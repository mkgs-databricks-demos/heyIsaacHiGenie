# M2M Token Curl Test Spec

**Purpose:** Verify that Databricks Apps gateway accepts SP M2M OAuth tokens on the
`/webhook/github` route of the hey-isaac-hi-genie dev app.

**App URL:** `https://hey-isaac-hi-genie-dev-7474657291520070.aws.databricksapps.com`
**Profile:** `fevm-hls-fde`
**Secret scope:** `dev_matthew_giglia_hi_genie_credentials`

## Tests to run

### Test 1: Unauthenticated request (baseline)
```bash
curl -s -o /dev/null -w "%{http_code}" \
  https://hey-isaac-hi-genie-dev-7474657291520070.aws.databricksapps.com/webhook/github \
  -X POST -H "Content-Type: application/json" -d '{"zen":"test"}'
```
**Expected:** 302 (redirect to OIDC login) — confirms gateway intercepts unauthenticated requests.

### Test 2: Get U2M token and call with it
```bash
TOKEN=$(databricks auth token -p fevm-hls-fde --output json | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

WEBHOOK_SECRET=$(databricks secrets get-secret dev_matthew_giglia_hi_genie_credentials \
  github_webhook_secret -p fevm-hls-fde --output json | python3 -c "import sys,json; print(json.load(sys.stdin)['value'])")

PAYLOAD='{"zen":"test","hook_id":123}'
SIG=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" | awk '{print "sha256="$2}')

curl -s -w "\n%{http_code}" \
  https://hey-isaac-hi-genie-dev-7474657291520070.aws.databricksapps.com/webhook/github \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: ping" \
  -H "X-Hub-Signature-256: $SIG" \
  -d "$PAYLOAD"
```
**Expected:** 200 with `{"ok":true}` or similar — confirms U2M token works (already known).

### Test 3: Get SP M2M OAuth token and call with it
```bash
# Get SP client_id and client_secret from secret scope
CLIENT_ID=$(databricks secrets get-secret dev_matthew_giglia_hi_genie_credentials \
  app_client_id -p fevm-hls-fde --output json 2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin)['value'])" 2>/dev/null || echo "NOT_FOUND")

# If no SP creds in scope, use WorkspaceClient with profile (U2M already proven)
# For pure M2M, need a SP with client_id/client_secret — check if one exists:
databricks service-principals list -p fevm-hls-fde --output json 2>/dev/null | \
  python3 -c "import sys,json; sps=json.load(sys.stdin); [print(sp.get('applicationId'), sp.get('displayName')) for sp in sps[:5]]"
```

**If an SP with OAuth credentials is available:**
```bash
M2M_TOKEN=$(python3 -c "
from databricks.sdk import WorkspaceClient
w = WorkspaceClient(profile='fevm-hls-fde',
                    client_id='<SP_CLIENT_ID>',
                    client_secret='<SP_CLIENT_SECRET>')
headers = w.config.authenticate()
print(headers['Authorization'].split(' ')[1])
")

curl -s -w "\n%{http_code}" \
  https://hey-isaac-hi-genie-dev-7474657291520070.aws.databricksapps.com/webhook/github \
  -X POST \
  -H "Authorization: Bearer $M2M_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: ping" \
  -H "X-Hub-Signature-256: $SIG" \
  -d "$PAYLOAD"
```
**Expected:** 200 — confirms SP M2M OAuth token bypasses the gateway.

### Test 4: Wrong/no signature with valid token
```bash
curl -s -w "\n%{http_code}" \
  https://hey-isaac-hi-genie-dev-7474657291520070.aws.databricksapps.com/webhook/github \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: ping" \
  -H "X-Hub-Signature-256: sha256=0000000000000000000000000000000000000000000000000000000000000000" \
  -d "$PAYLOAD"
```
**Expected:** 400 — gateway passes (token valid), but HMAC check fails. Confirms auth layer and sig layer are independent.

## Reporting
Record: HTTP status codes for all 4 tests, response bodies, and whether Test 3 (M2M)
confirms or denies gateway access. Update PROJECT_MEMORY.md S4b action item accordingly.
