# Session Summary — DABs Parameterization

**PR:** https://github.com/mkgs-databricks-demos/heyIsaacHiGenie/pull/1
**Branch:** `polly/dabs-parameterization`
**Implementer:** `claude_code`
**Reviewer:** `pi` (independent cross-vendor review)
**Final verdict:** ✅ PASS

---

## Goal

Remove all hard-coded developer identity from the DABs bundle YAML and deploy
script, replacing it with values auto-resolved from the authenticated CLI
profile at deploy time.

---

## Changes Made

### `hey-isaac-infra/databricks.yml`
- Added `user_handle` variable (type: string, default: `""`)
- `lakebase_project_id` changed to `dev-${var.user_handle}-hi-genie`
- `root_path` uses `${workspace.current_user.userName}` (built-in)
- `run_as_user` default set to `${workspace.current_user.userName}`
- `tags_developer.default` changed from hard-coded email to `""`

### `hey-isaac-ai/databricks.yml`
- Added `user_handle` variable (type: string, default: `""`)
- `schema` changed to `dev_${var.user_handle}_hi_genie`
- `lakebase_project_id` changed to `dev-${var.user_handle}-hi-genie`
- `run_as_user` default set to `${workspace.current_user.userName}`
- `tags_developer.default` changed from hard-coded email to `""`

### `hey-isaac-infra/resources/hi_genie.secret_scope.yml`
- MANAGE permission principal changed from hard-coded
  `matthew.giglia@databricks.com` to `${workspace.current_user.userName}`

### `deploy.sh`
- Added `USER_HANDLE=""` global
- Added `resolve_user_handle()` function:
  - No-op for non-dev targets
  - Calls `databricks current-user me --output json` and parses with python3
  - Strips `@domain`, converts non-alphanumeric characters to `_`
  - Warns on resolution failure
- Added **fail-fast guard** after resolution: if target is `dev` and
  `USER_HANDLE` is empty, the script exits with a clear error message rather
  than deploying malformed resource names (`dev--hi-genie`, `dev__hi_genie`)
- `build_app_deploy_args()` injects `--var user_handle=${USER_HANDLE}` for
  dev target when non-empty
- `resolve_user_handle()` called early in `main()` before any deploy step

### `PROJECT_MEMORY.md`
- Bundle Configuration table updated to show parameterized values
- Known Gaps / Phase 2 Items section added (see below)

---

## Cross-Review Cycle

### Pass 1 — Blocking issues found by `pi`

| # | Issue | Fix |
|---|-------|-----|
| B1 | `hi_genie.secret_scope.yml` contained hard-coded `matthew.giglia@databricks.com` in MANAGE permission | Replaced with `${workspace.current_user.userName}` |
| B2 | `tags_developer.default` in both YAML files contained hard-coded email | Changed to empty string `""` |
| B3 | `deploy.sh` would silently deploy malformed resource names if `USER_HANDLE` was empty | Added fail-fast guard with explicit error message |

### Pass 2 — PASS

`pi` confirmed all three blocking issues resolved. No new issues introduced.
PR marked ready-to-merge.

---

## Key Design Decisions

- **`dev_` prefix stays in YAML** — `dev_${var.user_handle}_hi_genie` is the
  correct DABs convention; the `dev_` prefix is not the developer's handle.
- **`${workspace.current_user.userName}`** — DABs built-in substitution; used
  directly in YAML without string manipulation.
- **`user_handle` vs built-in** — `user_handle` is needed for schema names and
  lakebase project IDs because DABs built-ins don't support the
  `strip-domain + sanitize` transform; deploy.sh handles that.
- **Prod target** — when a prod target is added, `run_as_user` must be set to
  a service principal explicitly. `user_handle` must not be injected for prod.
  See Known Gaps D1/D2 in PROJECT_MEMORY.md.
