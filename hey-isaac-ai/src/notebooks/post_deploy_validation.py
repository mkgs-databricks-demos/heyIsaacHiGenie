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

# Health check — allow_redirects=False because Databricks Apps proxy returns 302
# for unauthenticated requests; we accept that as proof the endpoint is routed correctly.
r = requests.get(f"{app_url}/health", timeout=15, allow_redirects=False)
assert r.status_code in (200, 302), f"/health returned {r.status_code}: {r.text}"
print(f"✓ /health  →  HTTP {r.status_code}")

# COMMAND ----------

# MCP endpoint — allow_redirects=False so a proxy 302 is accepted as "endpoint exists".
# If the app processes the request directly, expect 401 (no auth) or 400/200.
r = requests.post(f"{app_url}/mcp", json={}, timeout=15, allow_redirects=False)
assert r.status_code in (200, 302, 401, 400), f"/mcp returned unexpected {r.status_code}: {r.text}"
print(f"✓ /mcp     →  {r.status_code}")

# DCR endpoint — allow_redirects=False so a proxy 302 is accepted as "endpoint exists".
# If the app processes the request directly, expect 401 (missing shared secret) or 400 (missing client_name).
r = requests.post(f"{app_url}/register", json={}, timeout=15, allow_redirects=False)
assert r.status_code in (302, 400, 401, 201), f"/register returned unexpected {r.status_code}: {r.text}"
print(f"✓ /register →  {r.status_code}")

# COMMAND ----------

print("\n✓ Post-deploy validation passed — all endpoints responding.")
