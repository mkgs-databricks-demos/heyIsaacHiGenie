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
from databricks.sdk.service import apps

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
# DBTITLE 1,Install GitHub secret provisioning deps
%pip install "pynacl>=1.5.0" "pyjwt[crypto]>=2.8.0" requests
dbutils.library.restartPython()  # required on classic; no-op on serverless  # type: ignore[name-defined]

# COMMAND ----------
# DBTITLE 1,Provision GitHub Actions org secrets (HI_GENIE_SP_CLIENT_ID + HI_GENIE_SP_CLIENT_SECRET)
import time, base64, requests
import jwt as pyjwt          # PyJWT — not stdlib jwt
from nacl import encoding, public as nacl_public

GITHUB_ORG   = "mkgs-databricks-demos"
GITHUB_API   = "https://api.github.com"
HDRS_BASE    = {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
}

# Read GitHub App creds from secret scope (values redacted in Databricks output)
app_id          = dbutils.secrets.get(scope, "HI_GENIE_GITHUB_APP_ID")  # type: ignore[name-defined]
installation_id = dbutils.secrets.get(scope, "HI_GENIE_GITHUB_APP_INSTALLATION_ID")  # type: ignore[name-defined]
app_pem         = dbutils.secrets.get(scope, "HI_GENIE_GITHUB_APP_PRIVATE_KEY").replace("\\n", "\n")  # type: ignore[name-defined]

# ── 1. Mint App JWT → exchange for installation access token ──────────────────
now = int(time.time())
app_jwt = pyjwt.encode(
    {"iat": now - 60, "exp": now + 600, "iss": app_id},
    app_pem,
    algorithm="RS256",
)
tok_resp = requests.post(
    f"{GITHUB_API}/app/installations/{installation_id}/access_tokens",
    headers={**HDRS_BASE, "Authorization": f"Bearer {app_jwt}"},
    timeout=30,
)
tok_resp.raise_for_status()
gh_token = tok_resp.json()["token"]   # never print
auth_headers = {**HDRS_BASE, "Authorization": f"Bearer {gh_token}"}

# ── 2. GET org public key (Curve25519) ────────────────────────────────────────
pk_resp = requests.get(
    f"{GITHUB_API}/orgs/{GITHUB_ORG}/actions/secrets/public-key",
    headers=auth_headers,
    timeout=30,
)
pk_resp.raise_for_status()
pk_json   = pk_resp.json()
key_id    = pk_json["key_id"]
pub_key   = nacl_public.PublicKey(pk_json["key"].encode(), encoder=encoding.Base64Encoder)
box       = nacl_public.SealedBox(pub_key)

def _encrypt(plaintext: str) -> str:
    """Encrypt plaintext with libsodium sealed box → base64. Never logs value."""
    return base64.b64encode(box.encrypt(plaintext.encode("utf-8"))).decode("utf-8")

def _put_org_secret(name: str, plaintext: str) -> None:
    """Encrypt and PUT a GitHub Actions org secret. Plaintext is never printed."""
    encrypted = _encrypt(plaintext)
    del plaintext   # drop from memory immediately
    r = requests.put(
        f"{GITHUB_API}/orgs/{GITHUB_ORG}/actions/secrets/{name}",
        headers=auth_headers,
        json={"encrypted_value": encrypted, "key_id": key_id, "visibility": "all"},
        timeout=30,
    )
    if r.status_code not in (201, 204):
        raise RuntimeError(f"Failed to set org secret {name}: {r.status_code} {r.text}")
    print(f"✓ Org secret set: {GITHUB_ORG}/{name} (status={r.status_code}, visibility=all)")

# ── 3. Set HI_GENIE_SP_CLIENT_ID (non-sensitive UUID) ────────────────────────
_put_org_secret("HI_GENIE_SP_CLIENT_ID", str(sp.application_id))

# ── 4. Set HI_GENIE_SP_CLIENT_SECRET (sensitive — never printed) ─────────────
#   secret_resp is the CreateServicePrincipalSecretResponse from the earlier cell.
#   .secret is plaintext, shown once by the SDK; we consume it here and del it.
_put_org_secret("HI_GENIE_SP_CLIENT_SECRET", secret_resp.secret)
del secret_resp   # ensure the object (and its .secret) is released

print(f"\n✓ GitHub Actions org secrets provisioned for {GITHUB_ORG}")
print(f"  HI_GENIE_SP_CLIENT_ID  → set (application_id={sp.application_id})")
print(f"  HI_GENIE_SP_CLIENT_SECRET → set (sealed, not shown)")
print(f"\nNote: GitHub App needs 'Organization permissions → Secrets: Read and write'")
print(f"to write org secrets. If you see a 403, approve the permission in the App settings")
print(f"at https://github.com/settings/apps/<app-name>/permissions before re-running.")

# COMMAND ----------

try:
    w.apps.set_permissions(
        app_name=app_name,
        access_control_list=[
            apps.AppAccessControlRequest(
                service_principal_name=str(sp.application_id),
                permission_level=apps.AppPermissionLevel.CAN_USE,
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
print(f"  GitHub Actions:   HI_GENIE_SP_CLIENT_ID, HI_GENIE_SP_CLIENT_SECRET (auto-provisioned)")
