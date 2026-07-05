# Webhook Raw Body Fix Spec

## Problem
`POST /webhook/github` with a valid auth token hangs indefinitely (curl status 000).
Root cause: the webhook handler uses `req.on('data') / req.on('end')` to capture the
raw body for HMAC verification. The Databricks Apps AppKit proxy buffers the request
body before handing to Express, so these stream events never fire, `next()` is never
called, and the handler stalls.

## Fix
Replace the `req.on('data/end')` streaming pattern with `express.raw({ type: '*/*' })`
middleware mounted directly on the webhook route. `express.raw()` uses Express's own
body-parser which hooks the stream correctly and populates `req.body` as a `Buffer`.

## Files to change

### `hey-isaac-ai/server/routes/github-webhook.ts`

1. Add import: `import express from 'express';` (already imported via Router — just need
   to reference `express.raw`)

2. Replace the streaming middleware (the `app.use` inside `githubWebhookRouter` that
   does `req.on('data')`) with:
   ```typescript
   router.use(express.raw({ type: '*/*' }));
   ```
   This populates `req.body` as a `Buffer`.

3. In the main route handler, replace:
   ```typescript
   const rawBody: Buffer = (req as any).rawBody ?? Buffer.alloc(0);
   ```
   with:
   ```typescript
   const rawBody: Buffer = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
   ```

4. Remove the entire streaming middleware block:
   ```typescript
   router.use((req, _res, next) => {
     // Capture raw body before any json parsing for HMAC verification
     if (req.method === 'POST') {
       const chunks: Buffer[] = [];
       req.on('data', (chunk: Buffer) => chunks.push(chunk));
       req.on('end', () => {
         (req as any).rawBody = Buffer.concat(chunks);
         next();
       });
       req.on('error', next);
     } else {
       next();
     }
   });
   ```
   Replace entirely with: `router.use(express.raw({ type: '*/*' }));`

### `hey-isaac-ai/server/server.ts`
No change needed — `express.raw()` is scoped to the webhook router, so it doesn't
affect other routes.

## After the code change
1. Run: `cd hey-isaac-ai && npm run typecheck`
2. Run: `npm run build:server`
3. git add, git commit -m "fix: use express.raw() for webhook body capture — req.on streams hang under AppKit proxy"
4. git push (branch: add-github-oauth-secret-provisioning)

## Verification (post-deploy)
After `./deploy.sh --target dev --app`:
```bash
TOKEN=$(databricks auth token -p fevm-hls-fde --output json | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")
WEBHOOK_SECRET=$(databricks secrets get-secret dev_matthew_giglia_hi_genie_credentials github_webhook_secret -p fevm-hls-fde --output json | python3 -c "import sys,json; print(json.load(sys.stdin)['value'])")
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
Expected: HTTP 200, body `{"ok":true}` or similar (ping event acknowledged).
