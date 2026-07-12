# Databricks notebook source
# MAGIC %md
# MAGIC ## Hey Isaac / Hi Genie — Platform Bootstrap
# MAGIC
# MAGIC Stores `workspace_url` in the secret scope and validates admin-provisioned secrets.
# MAGIC Also runs Lakebase Postgres steps (dev seed + wal2delta registration
# MAGIC reconciliation) when a `lakebase_endpoint` / `lakebase_host` is provided.
# MAGIC The database credential is minted at runtime as the job's identity — it is
# MAGIC never passed in via CLI args or job parameters.
# MAGIC Run once after the infra bundle deploys, before deploying the app bundle.

# COMMAND ----------

from databricks.sdk import WorkspaceClient

dbutils.widgets.text("secret_scope_name", "dev_REPLACE_ME_hi_genie_credentials")  # type: ignore[name-defined]
# Non-secret Lakebase connection metadata. The short-lived Postgres token is
# generated at runtime (see the Postgres steps below); it is NOT accepted as a
# widget/parameter so it can never appear in process args or job-run metadata.
dbutils.widgets.text("lakebase_endpoint", "__unset__")  # type: ignore[name-defined]
dbutils.widgets.text("lakebase_host", "__unset__")  # type: ignore[name-defined]
dbutils.widgets.text("target", "dev")  # type: ignore[name-defined]

scope = dbutils.widgets.get("secret_scope_name")  # type: ignore[name-defined]
lakebase_endpoint = dbutils.widgets.get("lakebase_endpoint").strip()  # type: ignore[name-defined]
lakebase_host = dbutils.widgets.get("lakebase_host").strip()  # type: ignore[name-defined]
target = dbutils.widgets.get("target")  # type: ignore[name-defined]

w = WorkspaceClient()

# COMMAND ----------

# Store workspace URL (auto-provisioned)
workspace_url = spark.conf.get("spark.databricks.workspaceUrl")  # type: ignore[name-defined]
w.secrets.put_secret(scope=scope, key="workspace_url", string_value=f"https://{workspace_url}")
print(f"✓ workspace_url stored: https://{workspace_url}")

# COMMAND ----------

# Validate admin-provisioned secrets
ADMIN_KEYS = ["jwt_signing_key"]

existing = {s.key for s in w.secrets.list_secrets(scope=scope)}
missing = [k for k in ADMIN_KEYS if k not in existing]

for k in ADMIN_KEYS:
    mark = "✓" if k in existing else "✗ MISSING"
    print(f"  {mark}  {k}")

if missing:
    instructions = "\n".join(
        f"  databricks secrets put-secret {scope} {k} --string-value <value>"
        for k in missing
    )
    raise SystemExit(
        f"\nAdmin secrets not provisioned. Provision them then re-run:\n"
        f"  ./deploy.sh --target dev --app\n\n"
        f"Commands:\n{instructions}\n\n"
        f"Generate jwt_signing_key:\n"
        f"  openssl rand -base64 64"
    )

# COMMAND ----------

# Schema DDL is now managed by TypeScript migrations in:
# hey-isaac-ai/server/migrations/
# Migrations run automatically on app startup via runMigrations() in server.ts.
# Do not add DDL here — add a new numbered migration file instead.

# Table names are qualified to `app` explicitly — this runs over a raw
# psycopg2 connection, which doesn't inherit the app's
# `search_path=app,public` pool setting (see hey-isaac-ai/server/server.ts).
SEED_DEV_SQL = """
-- Dev seed data — idempotent via ON CONFLICT DO NOTHING

INSERT INTO app.projects (id, name, description)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'dev-hi-genie',
  'Development project for Phase 0 MCP spike'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO app.project_members (project_id, user_id, role)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'matthew.giglia@databricks.com',
  'owner'
)
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO app.agents (id, project_id, nickname, description, created_by)
VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'hi-genie',
  'Phase 0 MCP spike agent',
  'matthew.giglia@databricks.com'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO app.agent_grants (agent_id, user_id, granted_by)
VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid,
  'matthew.giglia@databricks.com',
  'matthew.giglia@databricks.com'
)
ON CONFLICT (agent_id, user_id) DO NOTHING;
"""

# --------------------------------------------------------------------------- #
# wal2delta registration reconciliation (idempotent)
#
# `wal2delta.tables` (schema owner: cloud_admin) is the control table that drives
# the platform-managed Postgres -> Unity Catalog CDF sync. It is keyed by
# `table_oid` and is NOT auto-reconciled with the `app` schema: new `app.*` tables
# are never registered, and stale `SKIPPED` entries (whose table has since gained
# REPLICA IDENTITY FULL — e.g. app.repo_config) are never re-evaluated.
#
# This runs here, in the elevated bootstrap step, on purpose: the app runtime SPN
# that applies the TypeScript migrations does NOT have INSERT/UPDATE on
# wal2delta.tables, whereas the bootstrap/deploy identity is a member of
# databricks_superuser (which holds those privileges). A migration therefore
# CANNOT do this; the bootstrap can. See docs/adr/002-wal2delta-registration-
# reconciliation.md for the privilege evidence.
#
# Idempotent and conservative: STREAMING rows and non-`app` schemas
# (public._migrations, appkit.*) are never touched. Re-running changes nothing
# once reconciled.
RECONCILE_WAL2DELTA_SQL = """
-- 1. Register missing app.* base tables that have REPLICA IDENTITY FULL.
--    ON CONFLICT keeps this race-safe against a concurrent bootstrap run.
INSERT INTO wal2delta.tables (table_oid, status)
SELECT c.oid, 'PENDING'
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'app'
  AND c.relkind = 'r'
  AND c.relreplident = 'f'
  AND NOT EXISTS (SELECT 1 FROM wal2delta.tables t WHERE t.table_oid = c.oid)
ON CONFLICT (table_oid) DO NOTHING;
"""

RESET_STALE_SKIPPED_SQL = """
-- 2. Reset stale SKIPPED app.* rows whose table now has REPLICA IDENTITY FULL.
UPDATE wal2delta.tables t
SET status = 'PENDING', status_detail = NULL
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE t.table_oid = c.oid
  AND n.nspname = 'app'
  AND c.relkind = 'r'
  AND c.relreplident = 'f'
  AND t.status = 'SKIPPED';
"""

# The Postgres steps skip ONLY when Lakebase is not configured for this run
# (no endpoint/host passed). Once an endpoint IS provided, any failure to mint a
# credential or connect is raised (fail loud) — it must NOT masquerade as a skip.
# The only legitimate skip when configured is a genuine first deploy where the app
# schema does not exist yet (the app applies its migrations on startup, after
# bootstrap); that case is detected below by inspecting the live schema.
if (
    not lakebase_endpoint
    or lakebase_endpoint == "__unset__"
    or not lakebase_host
    or lakebase_host == "__unset__"
):
    print("⚠  lakebase_endpoint/host not provided — skipping seed data")
    print("   AND wal2delta registration reconciliation.")
    print("   (Lakebase is not configured for this run — deploy.sh passes these")
    print("   once the branch endpoint is available.)")
else:
    import urllib.parse

    import psycopg2  # available on Databricks Runtime

    # Mint a short-lived Lakebase database credential at runtime, as the job's
    # identity. Generating it here (rather than accepting a connection string as a
    # parameter) keeps the token out of CLI args and job-run metadata.
    _cred = w.api_client.do(
        "POST", "/api/2.0/postgres/credentials", body={"endpoint": lakebase_endpoint}
    )
    _token = _cred.get("token") if isinstance(_cred, dict) else None
    if not _token:
        raise SystemExit(
            f"Could not mint a Lakebase database credential for endpoint "
            f"{lakebase_endpoint}. Refusing to skip Postgres steps."
        )

    _user = w.current_user.me().user_name
    _conn_str = (
        f"postgresql://{urllib.parse.quote(_user, safe='')}:"
        f"{urllib.parse.quote(_token, safe='')}@{lakebase_host}:5432/"
        f"databricks_postgres?sslmode=require"
    )

    conn = psycopg2.connect(_conn_str)
    del _token, _conn_str  # plaintext token no longer needed in local scope
    try:
        conn.autocommit = True
        with conn.cursor() as cur:
            # Guard: on a first deploy the app schema does not exist yet. Skip
            # Postgres steps gracefully — re-run bootstrap after the app started.
            cur.execute("SELECT to_regnamespace('app') IS NOT NULL")
            app_schema_ready = cur.fetchone()[0]

            if not app_schema_ready:
                print(
                    "⚠  app schema not present yet (app migrations have not run) — "
                    "skipping seed data + wal2delta reconciliation."
                )
                print("   Re-run bootstrap after the app has started at least once.")
            else:
                if target == "dev":
                    print("Executing dev seed data (target=dev)...")
                    cur.execute(SEED_DEV_SQL)
                    print("✓ Dev seed data applied")
                else:
                    print(f"  Skipping seed data (target={target})")

                # Reconciliation runs for ALL targets (registration maintenance).
                print("Reconciling wal2delta.tables with the app schema...")
                cur.execute(RECONCILE_WAL2DELTA_SQL)
                registered = cur.rowcount
                cur.execute(RESET_STALE_SKIPPED_SQL)
                reset = cur.rowcount
                print(
                    f"✓ wal2delta reconciliation complete: "
                    f"{registered} table(s) registered PENDING, "
                    f"{reset} stale SKIPPED entr(ies) reset to PENDING"
                )
    finally:
        conn.close()

# COMMAND ----------

print("\n✓ Platform bootstrap complete.")
print("  Scope: <configured>")
print(f"  Keys auto-provisioned: workspace_url")
print(f"  Keys admin-provisioned: {', '.join(ADMIN_KEYS)}")
