# Phase 5 Round-2 Review Contract

Verify each of the following in the actual files at /home/matthew.giglia/projects/hey-isaac-hi-genie (commit 475232c on branch add-github-oauth-secret-provisioning). Do NOT edit any file.

## What was fixed in commit 475232c

### BLOCKER 1 — hey-isaac-ai/resources/hi_genie.app.yml
Must have 4 new secret resource entries after the github-client-secret block:
- name: github-app-id, key: github_app_id, permission: READ
- name: github-app-private-key, key: github_app_private_key, permission: READ
- name: github-app-installation-id, key: github_installation_id, permission: READ
- name: github-webhook-secret, key: github_webhook_secret, permission: READ
All use scope: ${var.secret_scope_name}.

### BLOCKER 2 — hey-isaac-ai/server/migrations/007_github_tokens.ts
Must append a DO $body$ PL/pgSQL block that finds the CHECK(thread_id IS NOT NULL OR task_id IS NOT NULL) constraint on app.pull_requests via pg_constraint and drops it if found. Must be idempotent (no error if constraint already gone).
ALSO CHECK: the file uses 'app.pull_requests'::regclass — but the server sets search_path=app,public. Does this regclass cast resolve correctly when search_path is already 'app'? (i.e. is 'app.pull_requests'::regclass safe when search_path includes app?)

### BLOCKER 3 — hey-isaac-ai/server/routes/github-webhook.ts
- Both pr.user.login occurrences in the pull_requests INSERT params must be pr.user.login.toLowerCase()
- The entire PR event handler block (destructuring + statusMap + db queries) must be in a try/catch returning res.status(400).json({error:'invalid_payload'})
- Push console.log must be gated on process.env.NODE_ENV === 'development'

### BLOCKER 4 — hey-isaac-ai/server/routes/github-oauth.ts
- The await db.query(github_tokens upsert) must be wrapped in try/catch returning res.status(500).json({error:'db_error',state})
- state must be typeof req.query.state === 'string' ? req.query.state : null in BOTH /login and /callback (not '' as fallback)

## Additional checks
- Any new issues introduced by the fixes?
- Does the res.json({ok:true, action: (body as PullRequestEvent).action}) after the try/catch still work if the try/catch caught and returned early? (i.e. is there a double-response risk?)
- TypeScript: npm run typecheck in hey-isaac-ai/ must exit 0.

Report: BLOCKING issues (must fix before merge), NON-BLOCKING, SUGGESTIONS.
