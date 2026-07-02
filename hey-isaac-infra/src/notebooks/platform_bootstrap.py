# Databricks notebook source
# MAGIC %md
# MAGIC ## Hey Isaac / Hi Genie — Platform Bootstrap
# MAGIC
# MAGIC Stores `workspace_url` in the secret scope and validates admin-provisioned secrets.
# MAGIC Also executes Lakebase DDL (schema + seed) when `lakebase_connection_string` is set.
# MAGIC Run once after the infra bundle deploys, before deploying the app bundle.

# COMMAND ----------

from databricks.sdk import WorkspaceClient

dbutils.widgets.text("secret_scope_name", "dev_REPLACE_ME_hi_genie_credentials")  # type: ignore[name-defined]
dbutils.widgets.text("lakebase_connection_string", "__unset__")  # type: ignore[name-defined]
dbutils.widgets.text("target", "dev")  # type: ignore[name-defined]

scope = dbutils.widgets.get("secret_scope_name")  # type: ignore[name-defined]
lakebase_connection_string = dbutils.widgets.get("lakebase_connection_string")  # type: ignore[name-defined]
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

_conn_str = lakebase_connection_string.strip()
if not _conn_str or _conn_str == "__unset__":
    print("⚠  lakebase_connection_string is empty or unset — skipping seed data.")
    print("   Set the widget value to run seed data against Lakebase.")
else:
    import psycopg2  # available on Databricks Runtime

    conn = psycopg2.connect(_conn_str)
    try:
        conn.autocommit = True
        with conn.cursor() as cur:
            if target == "dev":
                print("Executing dev seed data (target=dev)...")
                cur.execute(SEED_DEV_SQL)
                print("✓ Dev seed data applied")
            else:
                print(f"  Skipping seed data (target={target})")
    finally:
        conn.close()

# COMMAND ----------

print("\n✓ Platform bootstrap complete.")
print("  Scope: <configured>")
print(f"  Keys auto-provisioned: workspace_url")
print(f"  Keys admin-provisioned: {', '.join(ADMIN_KEYS)}")
