# Databricks notebook source
# MAGIC %md
# MAGIC ## Hey Isaac / Hi Genie — Post-Deploy Validation
# MAGIC
# MAGIC Verifies all app endpoints are reachable after source deployment.

# COMMAND ----------

import requests
from databricks.sdk import WorkspaceClient

dbutils.widgets.text("app_name", "")  # type: ignore[name-defined]
app_name = dbutils.widgets.get("app_name")  # type: ignore[name-defined]

if not app_name:
    raise ValueError("app_name parameter is required")

# COMMAND ----------

w = WorkspaceClient()
app = w.apps.get(app_name)
app_url = app.url

assert app_url, f"App '{app_name}' has no URL — is it deployed?"
print(f"App URL: {app_url}")

# COMMAND ----------

# Health check
r = requests.get(f"{app_url}/health", timeout=15)
assert r.status_code == 200, f"/health returned {r.status_code}: {r.text}"
print(f"✓ /health  →  {r.json()}")

# COMMAND ----------

# MCP endpoint — expect 401 (no auth) or 200, not 404/500
r = requests.post(f"{app_url}/mcp", json={}, timeout=15)
assert r.status_code in (200, 401, 400), f"/mcp returned unexpected {r.status_code}: {r.text}"
print(f"✓ /mcp     →  {r.status_code}")

# DCR endpoint — expect 400 (missing client_name) or 201, not 404/500
r = requests.post(f"{app_url}/register", json={}, timeout=15)
assert r.status_code in (400, 201), f"/register returned unexpected {r.status_code}: {r.text}"
print(f"✓ /register →  {r.status_code}")

# COMMAND ----------

print("\n✓ Post-deploy validation passed — all endpoints responding.")
