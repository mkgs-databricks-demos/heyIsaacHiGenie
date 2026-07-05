# Phase 5 cross-review fixes — implement all of these, then typecheck and push

Branch: add-github-oauth-secret-provisioning
Root: /home/matthew.giglia/projects/hey-isaac-hi-genie
After all fixes: cd hey-isaac-ai && npm run typecheck (zero errors required) then:
git add -A && git commit -m "fix(phase5): address cross-review blocking issues" && git push

## FIX 1 — hey-isaac-ai/resources/hi_genie.app.yml: add 4 missing secret resources

After the existing github-client-secret block (look for "github-client-secret" ~line 55-58), add:

        - name: github-app-id
          secret:
            scope: ${var.secret_scope_name}
            key: github_app_id
            permission: READ
        - name: github-app-private-key
          secret:
            scope: ${var.secret_scope_name}
            key: github_app_private_key
            permission: READ
        - name: github-app-installation-id
          secret:
            scope: ${var.secret_scope_name}
            key: github_installation_id
            permission: READ
        - name: github-webhook-secret
          secret:
            scope: ${var.secret_scope_name}
            key: github_webhook_secret
            permission: READ

## FIX 2 — hey-isaac-ai/server/migrations/007_github_tokens.ts: drop the CHECK constraint

Append to the up SQL string (before closing backtick):

    -- Allow webhook-sourced pull_request rows with no thread/task linkage.
    DO $body$ DECLARE
      cname TEXT;
    BEGIN
      SELECT conname INTO cname
      FROM pg_constraint
      WHERE conrelid = 'app.pull_requests'::regclass
        AND contype = 'c'
        AND pg_get_constraintdef(oid) LIKE '%thread_id IS NOT NULL OR task_id IS NOT NULL%';
      IF cname IS NOT NULL THEN
        EXECUTE 'ALTER TABLE app.pull_requests DROP CONSTRAINT ' || quote_ident(cname);
      END IF;
    END $body$;

## FIX 3 — hey-isaac-ai/server/routes/github-webhook.ts: toLowerCase() on logins

In the db.query params array for the pull_requests upsert, change:
  pr.user.login  (for opened_by, position $7)
  pr.user.login  (for author_github_login, position $10)
both to: pr.user.login.toLowerCase()

## FIX 4 — hey-isaac-ai/server/routes/github-oauth.ts: wrap DB upsert in try/catch

In the /callback handler, wrap `await db.query(INSERT INTO app.github_tokens...)`:
    try {
      await db.query(...);
    } catch (err) {
      console.error('[github-oauth] db upsert error:', err);
      res.status(500).json({ error: 'db_error', state: state ?? null });
      return;
    }

## NON-BLOCKING (also fix)

github-oauth.ts: normalize state: const state = typeof req.query.state === 'string' ? req.query.state : null;
  (both /login and /callback — remove the '' fallback, use null)

github-webhook.ts: wrap pull_request payload destructuring + db.query in try/catch returning res.status(400).json({ error: 'invalid_payload' }) on any Error.

github-webhook.ts: gate push console.log on process.env.NODE_ENV === 'development'.
