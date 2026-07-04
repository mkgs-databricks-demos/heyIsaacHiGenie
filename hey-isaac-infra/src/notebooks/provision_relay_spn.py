# Databricks notebook source
# MAGIC %md
# MAGIC ## Hey Isaac / Hi Genie — Relay SP Provisioning
# MAGIC
# MAGIC Creates the relay service principal, stores its OAuth client_id and
# MAGIC client_secret in the secret scope, and grants CAN_USE on the app.
# MAGIC Run once per environment after the infra bundle deploys.
# MAGIC Safe to re-run — idempotent for the SP; generates a new secret rotation on re-run.

# COMMAND ----------

from databricks.sdk import WorkspaceClient
from databricks.sdk.service import iam

dbutils.widgets.text("secret_scope_name", "dev_REPLACE_ME_hi_genie_credentials")  # type: ignore[name-defined]
dbutils.widgets.text("app_name", "hey-isaac-hi-genie")  # type: ignore[name-defined]
dbutils.widgets.text("target", "dev")  # type: ignore[name-defined]

scope    = dbutils.widgets.get("secret_scope_name")  # type: ignore[name-defined]
app_name = dbutils.widgets.get("app_name")  # type: ignore[name-defined]
target   = dbutils.widgets.get("target")  # type: ignore[name-defined]

w = WorkspaceClient()

# COMMAND ----------

sp_name = f"hi-genie-relay-{target}"
existing = list(w.service_principals.list(filter=f'displayName eq "{sp_name}"'))

if existing:
    sp = existing[0]
    print(f"✓ SP already exists: {sp.display_name} (id={sp.id}, application_id={sp.application_id})")
else:
    sp = w.service_principals.create(display_name=sp_name)
    print(f"✓ SP created: {sp.display_name} (id={sp.id}, application_id={sp.application_id})")

# COMMAND ----------

w.secrets.put_secret(scope=scope, key="relay_sp_client_id", string_value=str(sp.application_id))
print(f"✓ relay_sp_client_id stored: {sp.application_id}")

# COMMAND ----------

secret_resp = w.service_principal_secrets_proxy.create(service_principal_id=sp.id)
w.secrets.put_secret(scope=scope, key="relay_sp_client_secret", string_value=secret_resp.secret)
print(f"✓ relay_sp_client_secret stored (secret_id={secret_resp.id}, shown once, now sealed)")
print(f"  Note: existing tokens remain valid until their expiry. Only the stored secret is updated.")

# COMMAND ----------

try:
    w.apps.set_permissions(
        app_name=app_name,
        access_control_list=[
            iam.AppAccessControlRequest(
                service_principal_name=str(sp.id),
                permission_level=iam.AppPermissionLevel.CAN_USE,
            )
        ],
    )
    print(f"✓ CAN_USE granted on app: {app_name}")
except Exception as e:
    # App may not exist yet in this target — non-fatal, re-run after app deploy
    print(f"⚠  Could not set app permissions (app may not be deployed yet): {e}")
    print(f"   Re-run after: ./deploy.sh --target {target} --app")

# COMMAND ----------

print(f"\n✓ Relay SP provisioning complete.")
print(f"  SP name:          {sp_name}")
print(f"  application_id:   {sp.application_id}  (= relay_sp_client_id)")
print(f"  Secret scope:     {scope}")
print(f"  Keys stored:      relay_sp_client_id, relay_sp_client_secret")
print(f"\nOrg-level GitHub Actions secrets to set (one-time):")
print(f"  HI_GENIE_SP_CLIENT_ID     = {sp.application_id}")
print(f"  HI_GENIE_SP_CLIENT_SECRET = <value from secret scope: relay_sp_client_secret>")
