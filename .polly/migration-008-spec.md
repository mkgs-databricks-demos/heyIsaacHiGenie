# Migration 008 spec — REPLICA IDENTITY FULL + webhook fix + replica identity convention

## Goal
1. Set REPLICA IDENTITY FULL on all existing app-schema tables (migration 008)
2. Retroactively add REPLICA IDENTITY FULL after every CREATE TABLE in migrations 001-007
   so fresh deployments also get it right from the start (without a separate backfill step)
3. Fix github-webhook.ts INSERT: remove non-existent 'title' column
4. Fix migration 007 constraint-drop LIKE pattern (too strict; new migration 008 also re-does it)

---

## Fix 1: Retroactively add REPLICA IDENTITY FULL to existing migrations

In hey-isaac-ai/server/migrations/001_initial_schema.ts, after EACH CREATE TABLE statement
(projects, project_members, agents, agent_grants, threads, messages, session_summaries,
tasks, pull_requests, repo_config, agent_checkout_spec) add:
  ALTER TABLE app.<tablename> REPLICA IDENTITY FULL;

In hey-isaac-ai/server/migrations/002_phase1_trackb.ts, find any CREATE TABLE statements
and add ALTER TABLE ... REPLICA IDENTITY FULL after each.

In hey-isaac-ai/server/migrations/007_github_tokens.ts, after CREATE TABLE app.github_tokens add:
  ALTER TABLE app.github_tokens REPLICA IDENTITY FULL;

(Migrations 003-006 likely don't create new tables — check, but don't modify if no CREATE TABLE.)

NOTE: These migrations have already run on the live DB. The retroactive change is so fresh
deployments don't need a separate step. Migration 008 handles the live DB.

---

## Fix 2: NEW hey-isaac-ai/server/migrations/008_replica_identity.ts

export const migration008: Migration = {
  name: '008_replica_identity',
  up: `
    -- Set REPLICA IDENTITY FULL on all existing app-schema tables.
    -- Idempotent: ALTER TABLE REPLICA IDENTITY is always safe to re-run.
    ALTER TABLE app.projects             REPLICA IDENTITY FULL;
    ALTER TABLE app.project_members      REPLICA IDENTITY FULL;
    ALTER TABLE app.agents               REPLICA IDENTITY FULL;
    ALTER TABLE app.agent_grants         REPLICA IDENTITY FULL;
    ALTER TABLE app.threads              REPLICA IDENTITY FULL;
    ALTER TABLE app.messages             REPLICA IDENTITY FULL;
    ALTER TABLE app.session_summaries    REPLICA IDENTITY FULL;
    ALTER TABLE app.tasks                REPLICA IDENTITY FULL;
    ALTER TABLE app.pull_requests        REPLICA IDENTITY FULL;
    ALTER TABLE app.repo_config          REPLICA IDENTITY FULL;
    ALTER TABLE app.agent_checkout_spec  REPLICA IDENTITY FULL;
    ALTER TABLE app.dcr_clients          REPLICA IDENTITY FULL;
    ALTER TABLE app.persona_token_jti    REPLICA IDENTITY FULL;
    ALTER TABLE app.github_tokens        REPLICA IDENTITY FULL;

    -- Drop the thread_id/task_id NOT NULL check constraint so webhook-sourced
    -- pull_request rows (no thread/task yet) can be inserted.
    -- Uses ILIKE to match regardless of extra parens in pg_get_constraintdef output.
    DO $body$ DECLARE
      cname TEXT;
    BEGIN
      SELECT conname INTO cname
      FROM pg_constraint
      WHERE conrelid = 'app.pull_requests'::regclass
        AND contype = 'c'
        AND pg_get_constraintdef(oid) ILIKE '%thread_id%NOT NULL%task_id%NOT NULL%';
      IF cname IS NOT NULL THEN
        EXECUTE 'ALTER TABLE app.pull_requests DROP CONSTRAINT ' || quote_ident(cname);
      END IF;
    END $body$;
  `,
};

---

## Fix 3: hey-isaac-ai/server/migrations/migrate.ts

Add: import { migration008 } from './008_replica_identity.js';
Add migration008 to the migrations array after migration007.

---

## Fix 4: hey-isaac-ai/server/routes/github-webhook.ts

Remove 'title' from INSERT column list (column does not exist in live schema).

CURRENT (wrong):
  `INSERT INTO app.pull_requests
     (project_id, pr_number, title, status, repo_url, pr_url, opened_by, branch_ref, base_branch, author_github_login, updated_at)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now())
   ON CONFLICT (project_id, pr_number) DO UPDATE
     SET title               = EXCLUDED.title, ...`
  params: [project_id, prNumber, pr.title, status, ...]

FIXED:
  `INSERT INTO app.pull_requests
     (project_id, pr_number, status, repo_url, pr_url, opened_by, branch_ref, base_branch, author_github_login, updated_at)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now())
   ON CONFLICT (project_id, pr_number) DO UPDATE
     SET status              = EXCLUDED.status,
         repo_url            = EXCLUDED.repo_url,
         pr_url              = EXCLUDED.pr_url,
         branch_ref          = EXCLUDED.branch_ref,
         base_branch         = EXCLUDED.base_branch,
         author_github_login = EXCLUDED.author_github_login,
         updated_at          = now()`
  params: [project_id, prNumber, status, repo.html_url, pr.html_url,
           pr.user.login.toLowerCase(), pr.head.ref, pr.base.ref, pr.user.login.toLowerCase()]

---

## After all edits

Add a comment to migrate.ts or a CONVENTION.md note: "Every CREATE TABLE in a migration
must be followed immediately by ALTER TABLE <name> REPLICA IDENTITY FULL;"

Then:
1. cd hey-isaac-ai && npm run typecheck  (must be 0 errors)
2. npm run build:server
3. git add -A
4. git commit -m "feat: REPLICA IDENTITY FULL on all tables (migration 008 + retroactive), fix webhook INSERT"
5. git push to add-github-oauth-secret-provisioning
