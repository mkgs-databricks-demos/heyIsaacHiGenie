# Databricks notebook source
from databricks.sdk import WorkspaceClient
from databricks.sdk.service.workspace import AclPermission
import urllib.parse

dbutils.widgets.text("principal", "")
dbutils.widgets.text("secret_scope_name", "dev_REPLACE_ME_hi_genie_credentials")
dbutils.widgets.text("lakebase_project_id", "__unset__")
dbutils.widgets.text("lakebase_branch_id", "__unset__")

principal = dbutils.widgets.get("principal")
scope = dbutils.widgets.get("secret_scope_name")
lakebase_project_id = dbutils.widgets.get("lakebase_project_id").strip()
lakebase_branch_id = dbutils.widgets.get("lakebase_branch_id").strip()

if not principal:
    raise ValueError("principal parameter is required (app SPN client_id)")

w = WorkspaceClient()

# 1. Grant secret scope READ (idempotent upsert)
w.secrets.put_acl(scope=scope, principal=principal, permission=AclPermission.READ)
print("✓ App SPN now has READ on the configured secret scope")

# 2. Grant Lakebase Postgres permissions (idempotent) when project/branch provided
_lakebase_configured = (
    lakebase_project_id and lakebase_project_id != "__unset__"
    and lakebase_branch_id and lakebase_branch_id != "__unset__"
)

if _lakebase_configured:
    import psycopg2  # available on Databricks Runtime

    # Resolve endpoint host via REST
    ep_path = f"/api/2.0/postgres/projects/{lakebase_project_id}/branches/{lakebase_branch_id}/endpoints"
    ep_list = w.api_client.do("GET", ep_path)
    if not isinstance(ep_list, list) or not ep_list:
        raise RuntimeError(
            f"No Lakebase endpoints found for {lakebase_project_id}/{lakebase_branch_id}"
        )
    ep = ep_list[0]
    host = ep["status"]["hosts"]["host"]
    port = 5432

    # Get token from notebook context (used as postgres password)
    ctx = dbutils.notebook.entry_point.getDbutils().notebook().getContext()
    token = ctx.apiToken().get()

    # Get current user name (postgres username)
    me = w.current_user.me()
    username = me.user_name  # e.g. "matthew.giglia@databricks.com"

    conn_str = (
        f"postgresql://{urllib.parse.quote(username, safe='')}:{urllib.parse.quote(token, safe='')}"
        f"@{host}:{port}/databricks_postgres?sslmode=require"
    )

    conn = psycopg2.connect(conn_str)
    try:
        conn.autocommit = True
        with conn.cursor() as cur:
            # Grant on public schema
            cur.execute(f'GRANT ALL ON SCHEMA public TO "{principal}"')
            print(f"✓ GRANT ALL ON SCHEMA public TO {principal[:8]}…")

            # Grant on appkit schema if it exists
            cur.execute(
                "SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'appkit'"
            )
            if cur.fetchone():
                cur.execute(f'GRANT ALL ON SCHEMA appkit TO "{principal}"')
                print(f"✓ GRANT ALL ON SCHEMA appkit TO {principal[:8]}…")
            else:
                print("⚠  appkit schema not found — skipping appkit grant")

            # Set default privileges so future tables/sequences inherit access
            cur.execute(
                f'ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "{principal}"'
            )
            cur.execute(
                f'ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "{principal}"'
            )
            print("✓ Default privileges set for public schema")
    finally:
        conn.close()

    print("✓ Lakebase Postgres SPN permissions configured")
else:
    print("⚠  lakebase_project_id / lakebase_branch_id not set — skipping Postgres grants")
