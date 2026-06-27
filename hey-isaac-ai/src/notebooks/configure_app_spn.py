# Databricks notebook source
# MAGIC %md
# MAGIC ## Hey Isaac / Hi Genie — Configure App SPN Scope Access
# MAGIC
# MAGIC Grants the app's auto-provisioned SPN READ access on the secret scope.
# MAGIC Run by deploy.sh after the app bundle deploys and the SPN client_id is known.
# MAGIC Idempotent — put_acl is an upsert.

# COMMAND ----------

from databricks.sdk import WorkspaceClient
from databricks.sdk.service.iam import SecretAclPermission

dbutils.widgets.text("principal", "")           # type: ignore[name-defined]
dbutils.widgets.text("secret_scope_name", "hi_genie_credentials")  # type: ignore[name-defined]

principal = dbutils.widgets.get("principal")    # type: ignore[name-defined]
scope = dbutils.widgets.get("secret_scope_name")  # type: ignore[name-defined]

if not principal:
    raise ValueError("principal parameter is required (app SPN client_id)")

# COMMAND ----------

w = WorkspaceClient()
w.secrets.put_acl(scope=scope, principal=principal, permission=SecretAclPermission.READ)

print(f"✓ {principal} now has READ on scope '{scope}'")
