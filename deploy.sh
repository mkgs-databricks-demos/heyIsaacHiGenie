#!/usr/bin/env bash
# deploy.sh — Deployment script for Hey Isaac / Hi Genie.
#
# Deploys Databricks Asset Bundles in dependency order:
#   1. hey-isaac-infra     (secret scope, UC schema, Lakebase project)
#   2. Platform bootstrap  (stores workspace_url; validates jwt_signing_key)
#   3. Readiness checks    (secret scope keys + Lakebase status)
#   4. hey-isaac-ai        (AppKit app: permissions, env vars, Lakebase binding)
#   5. App source deploy   (start compute if stopped, push source code)
#   6. Post-deploy validation
#
# Usage:
#   ./deploy.sh --target dev                        # full deploy
#   ./deploy.sh --target dev --run-setup            # deploy infra + bootstrap + app
#   ./deploy.sh --target dev --infra                # infra bundle only
#   ./deploy.sh --target dev --app                  # app bundle only (with readiness checks)
#   ./deploy.sh --target dev --app --skip-checks    # app bundle, skip readiness checks
#   ./deploy.sh --target dev --validate             # validate bundles, no deploy
#   ./deploy.sh --target dev --destroy              # destroy all resources
#
# First deployment:
#   1. ./deploy.sh --target dev --infra
#   2. Provision jwt_signing_key manually:
#        databricks secrets put-secret hi_genie_credentials jwt_signing_key \
#          --string-value "$(openssl rand -base64 64)"
#   3. ./deploy.sh --target dev --run-setup   (runs bootstrap, then app)
#
# Requirements:
#   - Databricks CLI installed and authenticated
#   - python3 (for JSON parsing)

set -euo pipefail

# --------------------------------------------------------------------------- #
# Self-relocation — avoid FUSE filesystem staleness on long-running operations
# --------------------------------------------------------------------------- #
if [[ "${BASH_SOURCE[0]}" == /Workspace/* ]] && [[ "${__DEPLOY_RELOCATED:-}" != "1" ]]; then
  _tmp_script="/tmp/hi_genie_deploy_$$.sh"
  cp "${BASH_SOURCE[0]}" "${_tmp_script}"
  chmod +x "${_tmp_script}"
  export __DEPLOY_RELOCATED=1
  export __DEPLOY_ORIG_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  exec "${_tmp_script}" "$@"
fi
if [[ "${__DEPLOY_RELOCATED:-}" == "1" ]]; then
  trap 'rm -f "${BASH_SOURCE[0]}"' EXIT
fi

# --------------------------------------------------------------------------- #
# Constants
# --------------------------------------------------------------------------- #
if [[ -n "${__DEPLOY_ORIG_DIR:-}" ]]; then
  SCRIPT_DIR="${__DEPLOY_ORIG_DIR}"
else
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fi

INFRA_BUNDLE="hey-isaac-infra"
APP_BUNDLE="hey-isaac-ai"
PLATFORM_BOOTSTRAP_JOB="platform_bootstrap"
CONFIGURE_APP_SPN_JOB="configure_app_spn"
POST_DEPLOY_VALIDATION_JOB="post_deploy_validation"

# Auto-provisioned by bootstrap job
AUTO_PROVISIONED_KEYS=(workspace_url)

# Admin must provision these before deploying the app bundle
ADMIN_PROVISIONED_KEYS=(jwt_signing_key)

REQUIRED_SCOPE_KEYS=("${AUTO_PROVISIONED_KEYS[@]}" "${ADMIN_PROVISIONED_KEYS[@]}")

# Resolved at runtime
SCOPE_NAME=""
CATALOG=""
SCHEMA=""
LAKEBASE_PROJECT_ID=""
LAKEBASE_DATABASE_ID=""
WORKSPACE_HOST=""
APP_NAME=""
APP_SOURCE_PATH=""
APP_SPN_CLIENT_ID=""

# --------------------------------------------------------------------------- #
# Defaults
# --------------------------------------------------------------------------- #
TARGET=""
DEPLOY_INFRA=true
DEPLOY_APP=true
RUN_SETUP=false
SKIP_CHECKS=false
SKIP_VALIDATION=false
VALIDATE_ONLY=false
DESTROY=false

# --------------------------------------------------------------------------- #
# Usage
# --------------------------------------------------------------------------- #
usage() {
  cat <<EOF
Usage: $(basename "$0") --target <target> [OPTIONS]

Options:
  --target <name>       Required. Bundle target (dev, prod).
  --infra               Deploy only the infrastructure bundle.
  --app                 Deploy only the application bundle.
  --run-setup           Run the platform bootstrap job after infra deploy.
  --skip-checks         Skip infrastructure readiness checks before app deploy.
  --skip-validation     Skip post-deploy validation.
  --validate            Validate bundles without deploying.
  --destroy             Destroy deployed resources.
  -h, --help            Show this help.

First deployment:
  ./deploy.sh --target dev --infra
  # Then provision jwt_signing_key (see README)
  ./deploy.sh --target dev --app --run-setup
EOF
  exit 0
}

# --------------------------------------------------------------------------- #
# Parse arguments
# --------------------------------------------------------------------------- #
while [[ $# -gt 0 ]]; do
  case "$1" in
    --target)       TARGET="$2"; shift 2 ;;
    --infra)        DEPLOY_INFRA=true;  DEPLOY_APP=false; shift ;;
    --app)          DEPLOY_INFRA=false; DEPLOY_APP=true;  shift ;;
    --run-setup)    RUN_SETUP=true; shift ;;
    --skip-checks)  SKIP_CHECKS=true; shift ;;
    --skip-validation) SKIP_VALIDATION=true; shift ;;
    --validate)     VALIDATE_ONLY=true; shift ;;
    --destroy)      DESTROY=true; shift ;;
    -h|--help)      usage ;;
    *)              echo "Error: Unknown option '$1'"; usage ;;
  esac
done

[[ -z "${TARGET}" ]] && { echo "Error: --target is required."; usage; }

# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #
log()  { echo -e "\n\033[1;34m==>\033[0m \033[1m$1\033[0m"; }
warn() { echo -e "\033[1;33m  ⚠  $1\033[0m"; }
ok()   { echo -e "\033[1;32m  ✓  $1\033[0m"; }
fail() { echo -e "\033[1;31m  ✗  $1\033[0m"; exit 1; }

safe()     { echo "$1" | sed 's/[^a-zA-Z0-9_.\-]//g'; }
safe_url() { echo "$1" | sed 's/[^a-zA-Z0-9_.\-:\/]//g'; }

get_app_status() {
  python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
except (json.JSONDecodeError, ValueError):
    print('UNKNOWN'); sys.exit(0)
def extract(field):
    if isinstance(field, dict): return field.get('state', '')
    return str(field) if field else ''
for key in ('compute_status', 'status', 'app_status'):
    val = data.get(key)
    if val is not None:
        state = extract(val)
        if state: print(state.upper()); sys.exit(0)
print('UNKNOWN')
" 2>/dev/null
}

is_compute_ready() { [[ "$1" == "ACTIVE" ]] || [[ "$1" == "RUNNING" ]]; }

cd_bundle() {
  local dir="$1"; local i
  for ((i=1; i<=3; i++)); do
    ls "${dir}" >/dev/null 2>&1 || true
    sleep 0.5
    cd "${dir}" 2>/dev/null && return 0
    sleep 2
  done
  cd "${dir}"
}

# --------------------------------------------------------------------------- #
# Prerequisites
# --------------------------------------------------------------------------- #
command -v databricks &>/dev/null || fail "Databricks CLI not found."
command -v python3    &>/dev/null || fail "python3 not found."

# --------------------------------------------------------------------------- #
# deploy_bundle
# --------------------------------------------------------------------------- #
deploy_bundle() {
  local bundle_name="$1"; shift
  local extra_args=("$@")
  local bundle_dir="${SCRIPT_DIR}/${bundle_name}"

  [[ -d "${bundle_dir}" ]]              || { warn "Bundle '${bundle_name}' not found — skipping."; return 0; }
  [[ -f "${bundle_dir}/databricks.yml" ]] || { warn "No databricks.yml in '${bundle_name}' — skipping."; return 0; }

  log "Validating ${bundle_name} (target: ${TARGET})"
  (cd_bundle "${bundle_dir}" && databricks bundle validate --target "${TARGET}")
  ok "Validation passed: ${bundle_name}"

  [[ "${VALIDATE_ONLY}" == true ]] && return 0

  if [[ "${DESTROY}" == true ]]; then
    log "Destroying ${bundle_name} (target: ${TARGET})"
    (cd_bundle "${bundle_dir}" && databricks bundle destroy --target "${TARGET}" --auto-approve)
    ok "Destroyed: ${bundle_name}"
  else
    log "Deploying ${bundle_name} (target: ${TARGET})"
    if [[ ${#extra_args[@]} -gt 0 ]]; then
      (cd_bundle "${bundle_dir}" && databricks bundle deploy --target "${TARGET}" "${extra_args[@]}")
    else
      (cd_bundle "${bundle_dir}" && databricks bundle deploy --target "${TARGET}")
    fi
    ok "Deployed: ${bundle_name}"
  fi
}

# --------------------------------------------------------------------------- #
# resolve_infra_vars — extract scope, catalog, schema, lakebase ID from summary
# --------------------------------------------------------------------------- #
resolve_infra_vars() {
  local bundle_dir="${SCRIPT_DIR}/${INFRA_BUNDLE}"
  log "Resolving infrastructure variables (target: ${TARGET})"

  local summary_json
  summary_json=$(cd_bundle "${bundle_dir}" && databricks bundle summary --target "${TARGET}" --output json 2>/dev/null) || \
    fail "Could not read bundle summary for ${INFRA_BUNDLE}. Deploy infra first."

  eval "$(echo "${summary_json}" | python3 -c "
import sys, json, re

try:
    data = json.load(sys.stdin)
except json.JSONDecodeError as e:
    print(f'RESOLVE_ERROR=\"{e}\"'); sys.exit(0)

vars_block = data.get('variables', {})
def get_var(name, default=''):
    v = vars_block.get(name, {})
    return v.get('value', default) if isinstance(v, dict) else (str(v) if v else default)

scope = get_var('secret_scope_name', 'hi_genie_credentials')

resources = data.get('resources', {})

# catalog + schema from schema resource
catalog = schema = ''
for _, ws in resources.get('schemas', {}).items():
    if isinstance(ws, dict):
        catalog = ws.get('catalog_name', '')
        schema  = ws.get('name', '')

if not catalog: catalog = get_var('catalog')
if not schema:  schema  = get_var('schema')

# lakebase project_id
project_id = ''
for _, proj in resources.get('postgres_projects', {}).items():
    if isinstance(proj, dict):
        project_id = proj.get('project_id', '')
        if project_id: break
if not project_id: project_id = get_var('lakebase_project_id')

workspace_host = ''
workspace_block = data.get('workspace', {})
if isinstance(workspace_block, dict):
    workspace_host = workspace_block.get('host', '')

def safe(v):   return re.sub(r'[^a-zA-Z0-9_.\-]', '', str(v))
def safe_u(v): return re.sub(r'[^a-zA-Z0-9_.\-:/]', '', str(v))

print(f'SCOPE_NAME=\"{safe(scope)}\"')
print(f'CATALOG=\"{safe(catalog)}\"')
print(f'SCHEMA=\"{safe(schema)}\"')
print(f'LAKEBASE_PROJECT_ID=\"{safe(project_id)}\"')
print(f'WORKSPACE_HOST=\"{safe_u(workspace_host)}\"')
" 2>/dev/null)" || fail "Could not parse bundle summary."

  [[ -n "${RESOLVE_ERROR:-}" ]] && fail "Bundle summary parse error: ${RESOLVE_ERROR}"
  [[ -n "${SCOPE_NAME}" ]]        || fail "Could not resolve secret_scope_name."
  [[ -n "${CATALOG}" ]]           || fail "Could not resolve catalog."
  [[ -n "${SCHEMA}" ]]            || fail "Could not resolve schema."

  ok "Secret scope:      ${SCOPE_NAME}"
  ok "Catalog:           ${CATALOG}"
  ok "Schema:            ${SCHEMA}"
  ok "Lakebase project:  ${LAKEBASE_PROJECT_ID:-<not deployed yet>}"
  [[ -n "${WORKSPACE_HOST}" ]] && ok "Workspace host:    ${WORKSPACE_HOST}"
}

# --------------------------------------------------------------------------- #
# resolve_lakebase_database
# --------------------------------------------------------------------------- #
resolve_lakebase_database() {
  local project_id="${LAKEBASE_PROJECT_ID:-}"
  [[ -z "${project_id}" ]] && { warn "No Lakebase project ID — skipping database ID resolution."; return 0; }

  log "Resolving Lakebase database ID (project: ${project_id})"

  local db_json
  db_json=$(databricks postgres list-databases "projects/${project_id}/branches/production" --output json 2>/dev/null) || {
    warn "Could not list databases for project '${project_id}' — may still be initializing."; return 0;
  }

  LAKEBASE_DATABASE_ID=$(echo "${db_json}" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
except (json.JSONDecodeError, ValueError): sys.exit(0)
dbs = data.get('databases', data.get('items', []))
if isinstance(data, list): dbs = data
for db in dbs:
    if not isinstance(db, dict): continue
    name = db.get('name', '')
    if '/databases/' in name: print(name.split('/databases/')[-1]); sys.exit(0)
    db_id = db.get('database_id', '')
    if db_id: print(db_id); sys.exit(0)
" 2>/dev/null) || LAKEBASE_DATABASE_ID=""

  if [[ -n "${LAKEBASE_DATABASE_ID}" ]]; then
    ok "Lakebase database: ${LAKEBASE_DATABASE_ID}"
  else
    warn "Could not resolve Lakebase database ID — app bundle will use target default."
  fi
}

# --------------------------------------------------------------------------- #
# run_platform_bootstrap
# --------------------------------------------------------------------------- #
run_platform_bootstrap() {
  local bundle_dir="${SCRIPT_DIR}/${INFRA_BUNDLE}"
  log "Running platform bootstrap (target: ${TARGET})"
  (cd_bundle "${bundle_dir}" && databricks bundle run "${PLATFORM_BOOTSTRAP_JOB}" --target "${TARGET}") || \
    fail "Platform bootstrap failed. Check the Databricks Jobs UI."
  ok "Platform bootstrap complete"
}

# --------------------------------------------------------------------------- #
# check_lakebase_status — informational
# --------------------------------------------------------------------------- #
check_lakebase_status() {
  local project_id="${LAKEBASE_PROJECT_ID:-}"
  [[ -z "${project_id}" ]] && return 0

  log "Checking Lakebase project status (project: ${project_id})"

  databricks postgres get-project "projects/${project_id}" --output json >/dev/null 2>&1 && \
    ok "Lakebase project accessible: ${project_id}" || \
    { warn "Lakebase project '${project_id}' not found — may still be initializing."; return 0; }

  local ep_count
  ep_count=$(databricks postgres list-endpoints "projects/${project_id}/branches/production" --output json 2>/dev/null | \
    python3 -c "import sys,json; data=json.load(sys.stdin); eps=data.get('endpoints',data.get('items',[])); print(len(eps) if isinstance(eps,list) else 0)" 2>/dev/null) || ep_count=0

  [[ "${ep_count:-0}" -gt 0 ]] && ok "Lakebase endpoint active (${ep_count} endpoint(s))" || \
    warn "No active Lakebase endpoint found — may still be initializing."
}

# --------------------------------------------------------------------------- #
# verify_infra_readiness — gate before app bundle deploy
# --------------------------------------------------------------------------- #
verify_infra_readiness() {
  log "Verifying infrastructure readiness"

  local secrets_json
  secrets_json=$(databricks secrets list-secrets "${SCOPE_NAME}" --output json 2>/dev/null) || {
    echo ""
    echo "  Secret scope '${SCOPE_NAME}' not found."
    echo "  Run the platform bootstrap job first:"
    echo "    ./deploy.sh --target ${TARGET} --infra --run-setup"
    echo ""
    fail "Secret scope '${SCOPE_NAME}' does not exist."
  }

  local present_keys
  present_keys=$(echo "${secrets_json}" | python3 -c "
import sys,json
data = json.load(sys.stdin)
items = data.get('secrets', data) if isinstance(data, dict) else data
for s in items:
    if isinstance(s, dict): print(s.get('key', ''))
" 2>/dev/null) || fail "Could not parse secrets list."

  local missing_auto=()
  local missing_admin=()

  for key in "${REQUIRED_SCOPE_KEYS[@]}"; do
    if echo "${present_keys}" | grep -qx "${key}"; then
      ok "Secret key present: ${key}"
    else
      local is_admin=false
      for ak in "${ADMIN_PROVISIONED_KEYS[@]}"; do [[ "${key}" == "${ak}" ]] && is_admin=true; done
      [[ "${is_admin}" == true ]] && missing_admin+=("${key}") || missing_auto+=("${key}")
      warn "Secret key MISSING: ${key}"
    fi
  done

  check_lakebase_status

  if [[ ${#missing_auto[@]} -gt 0 ]]; then
    echo ""
    echo "  Auto-provisioned secrets missing — run the bootstrap job:"
    echo "    ./deploy.sh --target ${TARGET} --infra --run-setup"
    echo ""
    fail "Infra readiness check failed (auto-provisioned secrets missing)."
  fi

  if [[ ${#missing_admin[@]} -gt 0 ]]; then
    echo ""
    echo "  ============================================================="
    echo "  ACTION REQUIRED: Provision admin secrets before deploying app."
    echo "  ============================================================="
    echo ""
    echo "  Missing: ${missing_admin[*]}"
    echo ""
    echo "  Generate and store jwt_signing_key:"
    echo "    databricks secrets put-secret ${SCOPE_NAME} jwt_signing_key \\"
    echo "      --string-value \"\$(openssl rand -base64 64)\""
    echo ""
    echo "  Then re-run: ./deploy.sh --target ${TARGET} --app"
    echo ""
    fail "Infra readiness check failed (admin secrets missing)."
  fi

  ok "All infrastructure readiness checks passed"
}

# --------------------------------------------------------------------------- #
# build_app_deploy_args — pass runtime-discovered values as --var overrides
# --------------------------------------------------------------------------- #
APP_DEPLOY_ARGS=()

build_app_deploy_args() {
  APP_DEPLOY_ARGS=()
  # lakebase_database_id is discovered at runtime (not known at YAML-write time)
  [[ -n "${LAKEBASE_DATABASE_ID}" ]] && APP_DEPLOY_ARGS+=(--var "lakebase_database_id=${LAKEBASE_DATABASE_ID}")

  if [[ ${#APP_DEPLOY_ARGS[@]} -gt 0 ]]; then
    log "App bundle --var overrides:"
    for arg in "${APP_DEPLOY_ARGS[@]}"; do echo "    ${arg}"; done
  else
    log "No --var overrides needed (all values from target defaults)"
  fi
}

# --------------------------------------------------------------------------- #
# resolve_app_name
# --------------------------------------------------------------------------- #
resolve_app_name() {
  local bundle_dir="${SCRIPT_DIR}/${APP_BUNDLE}"
  log "Resolving app name from bundle summary"

  local summary_json
  summary_json=$(cd_bundle "${bundle_dir}" && databricks bundle summary --target "${TARGET}" --output json 2>/dev/null) || \
    fail "Could not read bundle summary for ${APP_BUNDLE}."

  eval "$(echo "${summary_json}" | python3 -c "
import sys, json, re

try:
    data = json.load(sys.stdin)
except json.JSONDecodeError as e:
    print(f'RESOLVE_ERROR=\"{e}\"'); sys.exit(0)

def safe(v): return re.sub(r'[^a-zA-Z0-9_.\-]', '', str(v))

app_name = ''
for _, app in data.get('resources', {}).get('apps', {}).items():
    if isinstance(app, dict) and app.get('name'):
        app_name = app['name']; break

workspace = data.get('workspace', {})
file_path = workspace.get('file_path', '') if isinstance(workspace, dict) else ''

print(f'APP_NAME=\"{safe(app_name)}\"')
path_safe = re.sub(r'[^a-zA-Z0-9_.\-/@]', '', str(file_path))
print(f'APP_SOURCE_PATH=\"{path_safe}\"')
")" || fail "Could not parse app bundle summary."

  [[ -n "${RESOLVE_ERROR:-}" ]] && fail "App bundle summary parse error: ${RESOLVE_ERROR}"
  [[ -n "${APP_NAME}" ]]        || fail "Could not resolve app name."
  [[ -n "${APP_SOURCE_PATH}" ]] || fail "Could not resolve app source path."

  ok "App name:    ${APP_NAME}"
  ok "Source path: ${APP_SOURCE_PATH}"
}

# --------------------------------------------------------------------------- #
# resolve_app_spn_id
# --------------------------------------------------------------------------- #
resolve_app_spn_id() {
  [[ -z "${APP_NAME}" ]] && { warn "APP_NAME not set — skipping SPN lookup."; return 0; }
  log "Resolving app SPN client_id (app: ${APP_NAME})"

  local app_json
  app_json=$(databricks apps get "${APP_NAME}" --output json 2>/dev/null) || { warn "Could not retrieve app info."; return 0; }

  APP_SPN_CLIENT_ID=$(echo "${app_json}" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(data.get('service_principal_client_id', ''))
except: pass
" 2>/dev/null) || APP_SPN_CLIENT_ID=""

  [[ -n "${APP_SPN_CLIENT_ID}" ]] && ok "App SPN: ${APP_SPN_CLIENT_ID:0:8}…" || \
    warn "Could not resolve app SPN client_id."
}

# --------------------------------------------------------------------------- #
# run_configure_app_spn
# --------------------------------------------------------------------------- #
run_configure_app_spn() {
  [[ -z "${APP_SPN_CLIENT_ID}" ]] && { warn "No app SPN — skipping scope ACL step."; return 0; }
  local bundle_dir="${SCRIPT_DIR}/${APP_BUNDLE}"
  log "Configuring app SPN scope access (job: ${CONFIGURE_APP_SPN_JOB})"
  (cd_bundle "${bundle_dir}" && databricks bundle run "${CONFIGURE_APP_SPN_JOB}" \
    --target "${TARGET}" \
    --params "principal=${APP_SPN_CLIENT_ID}") || {
    warn "Scope ACL job failed — app may not be able to read secrets."; return 0;
  }
  ok "App SPN scope access configured"
}

# --------------------------------------------------------------------------- #
# deploy_app_source
# --------------------------------------------------------------------------- #
deploy_app_source() {
  log "Deploying source code to app: ${APP_NAME}"

  local app_status
  app_status=$(databricks apps get "${APP_NAME}" --output json 2>/dev/null | get_app_status) || app_status="UNKNOWN"
  echo "  Current app status: ${app_status}"

  if ! is_compute_ready "${app_status}"; then
    log "Starting app compute (status: ${app_status})"
    databricks apps start "${APP_NAME}" --no-wait 2>/dev/null || true

    local max_wait=300 elapsed=0 interval=10
    while [[ ${elapsed} -lt ${max_wait} ]]; do
      sleep ${interval}; elapsed=$((elapsed + interval))
      app_status=$(databricks apps get "${APP_NAME}" --output json 2>/dev/null | get_app_status) || app_status="UNKNOWN"
      echo "  [${elapsed}s] ${app_status}"
      is_compute_ready "${app_status}" && break
      [[ "${app_status}" == "FAILED" || "${app_status}" == "CRASHED" || "${app_status}" == "DELETING" ]] && \
        fail "App entered ${app_status} state."
    done
    is_compute_ready "${app_status}" || fail "App compute did not reach ACTIVE within ${max_wait}s."
    ok "App compute ready"
  else
    ok "App compute already ready"
  fi

  log "Pushing source to container (source: ${APP_SOURCE_PATH})"
  databricks apps deploy "${APP_NAME}" \
    --source-code-path "${APP_SOURCE_PATH}" \
    --no-wait || fail "Source deployment failed."
  ok "Source deployment initiated for ${APP_NAME}"
}

# --------------------------------------------------------------------------- #
# run_post_deploy_validation
# --------------------------------------------------------------------------- #
run_post_deploy_validation() {
  local bundle_dir="${SCRIPT_DIR}/${APP_BUNDLE}"
  log "Running post-deploy validation"
  (cd_bundle "${bundle_dir}" && databricks bundle run "${POST_DEPLOY_VALIDATION_JOB}" --target "${TARGET}") || {
    warn "Post-deploy validation FAILED — check the job run for details."; return 1;
  }
  ok "Post-deploy validation passed"
}

# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #
log "Hey Isaac / Hi Genie — Bundle Deployment"
echo "  Target:          ${TARGET}"
echo "  Infra bundle:    ${DEPLOY_INFRA}"
echo "  App bundle:      ${DEPLOY_APP}"
echo "  Run setup:       ${RUN_SETUP}"
echo "  Skip checks:     ${SKIP_CHECKS}"
echo "  Skip validation: ${SKIP_VALIDATION}"
echo "  Validate only:   ${VALIDATE_ONLY}"
echo "  Destroy:         ${DESTROY}"

if [[ "${DEPLOY_INFRA}" == true ]]; then
  deploy_bundle "${INFRA_BUNDLE}"
fi

if [[ "${DEPLOY_APP}" == true ]] && [[ "${VALIDATE_ONLY}" != true ]] && [[ "${DESTROY}" != true ]]; then
  resolve_infra_vars
fi

if [[ "${RUN_SETUP}" == true ]] && [[ "${VALIDATE_ONLY}" != true ]] && [[ "${DESTROY}" != true ]]; then
  run_platform_bootstrap
fi

if [[ "${DEPLOY_APP}" == true ]] && [[ "${SKIP_CHECKS}" != true ]] && [[ "${VALIDATE_ONLY}" != true ]] && [[ "${DESTROY}" != true ]]; then
  verify_infra_readiness
  resolve_lakebase_database
fi

if [[ "${DEPLOY_APP}" == true ]]; then
  build_app_deploy_args
  if [[ ${#APP_DEPLOY_ARGS[@]} -gt 0 ]]; then
    deploy_bundle "${APP_BUNDLE}" "${APP_DEPLOY_ARGS[@]}"
  else
    deploy_bundle "${APP_BUNDLE}"
  fi
fi

if [[ "${DEPLOY_APP}" == true ]] && [[ "${VALIDATE_ONLY}" != true ]] && [[ "${DESTROY}" != true ]]; then
  resolve_app_name
  resolve_app_spn_id
  run_configure_app_spn
  deploy_app_source
fi

if [[ "${DEPLOY_APP}" == true ]] && [[ "${VALIDATE_ONLY}" != true ]] && [[ "${DESTROY}" != true ]] && [[ "${SKIP_VALIDATION}" != true ]]; then
  run_post_deploy_validation
fi

log "Done."
