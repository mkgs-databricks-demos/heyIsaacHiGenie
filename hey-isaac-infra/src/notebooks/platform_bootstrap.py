# Databricks notebook source
# MAGIC %md
# MAGIC ## Hey Isaac / Hi Genie — Platform Bootstrap
# MAGIC
# MAGIC Stores `workspace_url` in the secret scope and validates admin-provisioned secrets.
# MAGIC Run once after the infra bundle deploys, before deploying the app bundle.

# COMMAND ----------

from databricks.sdk import WorkspaceClient

dbutils.widgets.text("secret_scope_name", "dev_REPLACE_ME_hi_genie_credentials")  # type: ignore[name-defined]
scope = dbutils.widgets.get("secret_scope_name")  # type: ignore[name-defined]

w = WorkspaceClient()

# COMMAND ----------

# Store workspace URL (auto-provisioned)
workspace_url = spark.conf.get("spark.databricks.workspaceUrl")  # type: ignore[name-defined]
w.secrets.put(scope=scope, key="workspace_url", string_value=f"https://{workspace_url}")
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

print("\n✓ Platform bootstrap complete.")
print(f"  Scope: {scope}")
print(f"  Keys auto-provisioned: workspace_url")
print(f"  Keys admin-provisioned: {', '.join(ADMIN_KEYS)}")
