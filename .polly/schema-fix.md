# Schema alignment fixes needed

## Context
The live pull_requests table has these columns (from pg):
id, project_id, thread_id, task_id, repo_url, pr_number, pr_url, status,
opened_by, created_at, updated_at, branch_ref, base_branch, author_github_login

NO 'title' column.

The live constraint text (from pg_get_constraintdef) is:
  CHECK (((thread_id IS NOT NULL) OR (task_id IS NOT NULL)))
NOT:
  CHECK (thread_id IS NOT NULL OR task_id IS NOT NULL)

## Fix 1 — github-webhook.ts: remove 'title' from INSERT, fix pr_number

The webhook INSERT currently includes 'title' as column 3 in the list and pr.title as param $3.
Remove it. The adjusted INSERT should be:
  (project_id, pr_number, status, repo_url, pr_url, opened_by, branch_ref, base_branch, author_github_login, updated_at)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now())
  ON CONFLICT (project_id, pr_number) DO UPDATE SET
    status=EXCLUDED.status, repo_url=EXCLUDED.repo_url, pr_url=EXCLUDED.pr_url,
    branch_ref=EXCLUDED.branch_ref, base_branch=EXCLUDED.base_branch,
    author_github_login=EXCLUDED.author_github_login, updated_at=now()

params: [project_id, prNumber, status, repo.html_url, pr.html_url,
         pr.user.login.toLowerCase(), pr.head.ref, pr.base.ref, pr.user.login.toLowerCase()]

## Fix 2 — migration 007: fix LIKE pattern for constraint drop

The DO $body$ block uses:
  AND pg_get_constraintdef(oid) LIKE '%thread_id IS NOT NULL OR task_id IS NOT NULL%'

But the actual text is:
  CHECK (((thread_id IS NOT NULL) OR (task_id IS NOT NULL)))

Fix the LIKE pattern to match the actual text. Use a pattern that works regardless of extra parens:
  AND pg_get_constraintdef(oid) LIKE '%thread_id IS NOT NULL%'
  AND pg_get_constraintdef(oid) LIKE '%task_id IS NOT NULL%'
  AND contype = 'c'

Or use a single broader pattern:
  AND pg_get_constraintdef(oid) ILIKE '%thread_id%NOT NULL%task_id%NOT NULL%'

Since migration 007 already ran (it's in _migrations), we need to also add a new migration 008
that does the same constraint drop with the corrected LIKE pattern, so it runs on the live database.

## Fix 3 — migration 007: fix UNIQUE constraint check

The DO $$ block for the UNIQUE(project_id, pr_number) constraint — check if pr_number even
exists in the live table's unique constraints. Run a check first and only add if missing.
Also, since pr_number is nullable (integer, nullable in live schema), a unique constraint
on (project_id, pr_number) will allow multiple NULLs — that's fine for now.

## Summary of files to change:
1. hey-isaac-ai/server/routes/github-webhook.ts — remove 'title' from INSERT column list and params
2. hey-isaac-ai/server/migrations/007_github_tokens.ts — fix LIKE pattern (won't help live DB, but fixes for fresh deploys)
3. NEW hey-isaac-ai/server/migrations/008_fix_pr_constraint.ts — drop the CHECK constraint with corrected pattern; register in migrate.ts

After changes: npm run typecheck in hey-isaac-ai/, then npm run build:server, then:
git add -A && git commit -m "fix(phase5): align webhook INSERT with live schema, fix constraint-drop LIKE pattern" && git push

Branch: add-github-oauth-secret-provisioning
