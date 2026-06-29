# Databricks notebook source
from databricks.sdk import WorkspaceClient
from databricks.sdk.service.workspace import AclPermission

dbutils.widgets.text("principal", "")
dbutils.widgets.text("secret_scope_name", "dev_REPLACE_ME_hi_genie_credentials")

principal = dbutils.widgets.get("principal")
scope = dbutils.widgets.get("secret_scope_name")

if not principal:
    raise ValueError("principal parameter is required (app SPN client_id)")

w = WorkspaceClient()
w.secrets.put_acl(scope=scope, principal=principal, permission=AclPermission.READ)

print("✓ App SPN now has READ on the configured secret scope")
