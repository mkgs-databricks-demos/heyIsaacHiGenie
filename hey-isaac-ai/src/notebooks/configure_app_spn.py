# Databricks notebook source
from databricks.sdk import WorkspaceClient
from databricks.sdk.service.workspace import AclPermission

dbutils.widgets.text("principal", "")
dbutils.widgets.text("secret_scope_name", "dev_REPLACE_ME_hi_genie_credentials")
dbutils.widgets.text("lakebase_connection_string", "__unset__")

principal = dbutils.widgets.get("principal")
scope = dbutils.widgets.get("secret_scope_name")
lakebase_connection_string = dbutils.widgets.get("lakebase_connection_string").strip()

if not principal:
    raise ValueError("principal parameter is required (app SPN client_id)")

w = WorkspaceClient()

# 1. Grant secret scope READ (idempotent upsert)
w.secrets.put_acl(scope=scope, principal=principal, permission=AclPermission.READ)
print("✓ App SPN now has READ on the configured secret scope")

# 2. Grant Lakebase Postgres permissions (idempotent) when connection string provided
if lakebase_connection_string and lakebase_connection_string != "__unset__":
    import psycopg2  # available on Databricks Runtime

    conn = psycopg2.connect(lakebase_connection_string)
    try:
        conn.autocommit = True
        with conn.cursor() as cur:
            # Grant on public schema
            cur.execute(f'GRANT ALL ON SCHEMA public TO "{principal}"')
            print(f"✓ GRANT ALL ON SCHEMA public TO {principal[:8]}…")

            # Grant on app schema — domain tables live here (see
            # 005_app_schema.ts). Create it defensively in case this notebook
            # runs before the app has applied migrations for the first time.
            cur.execute("CREATE SCHEMA IF NOT EXISTS app")
            cur.execute(f'GRANT ALL ON SCHEMA app TO "{principal}"')
            print(f"✓ GRANT ALL ON SCHEMA app TO {principal[:8]}…")

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

            cur.execute(
                f'ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT ALL ON TABLES TO "{principal}"'
            )
            cur.execute(
                f'ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT ALL ON SEQUENCES TO "{principal}"'
            )
            print("✓ Default privileges set for app schema")
    finally:
        conn.close()

    print("✓ Lakebase Postgres SPN permissions configured")
else:
    print("⚠  lakebase_connection_string not set — skipping Postgres grants")
