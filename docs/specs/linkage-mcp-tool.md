# Spec — `record_git_action` MCP Tool (GitHub → Lakebase linkage)

**Status:** Approved for implementation · **Date:** 2026-07-11
**Related:** [ADR 001 — GitHub is pull, not push](../adr/001-github-is-pull-not-push.md),
[08 — NOTIFY bridge](../08-notify-bridge.md), [03 — data model](../03-data-model.md),
[04 — MCP tools](../04-mcp-tools.md), [05 — GitHub integration](../05-github-integration.md)

## Purpose

Per ADR 001, agents do all git work through the **official GitHub MCP**; the Hi-Genie
app owns **policy + linkage**. This is the linkage tool. An already-active agent that
just performed a git action (opened a PR, pushed a branch, saw it merged) calls this
tool to:

1. **Record state** — upsert the fact into the `app.pull_requests` reference table so
   other agents can pull it (and it flows to Unity Catalog via the existing CDF path).
2. **Wake (optional but bundled)** — post a companion message into `app.messages`,
   which fires the existing `hi_genie_messages` NOTIFY trigger and wakes a target
   agent.

The tool **trusts** the agent's reported facts (ADR 001 addendum #2) — no server-side
GitHub read to verify. Discrepancies reconcile peer-to-peer later (another agent that
pulls full state via the official MCP and finds a mismatch messages the author agent to
reconcile).

## Design: one bundled tool, message optional

Both halves run in **one transaction** so a wake message can never fire for PR state
that failed to persist (and vice-versa). The message half is optional — a bare state
update (no wake) and a bare narration (no PR number) are both valid. This matches the
"write a message **and** write to a reference table" model.

## Location & pattern

- Add to `hey-isaac-ai/server/mcp/tools.ts`, registered via the existing
  `registerTools(server, db, req)` (`mcp.ts:52`), using
  `server.tool(name, description, zodSchema, handler)` — same shape as `register_repo`
  (`tools.ts:284`).
- **No migration needed** — `app.pull_requests` and `app.messages` already exist with
  all required columns. Zero schema change.

## Input schema (zod)

```ts
{
  // State half (reference table) — pr_number required to upsert
  repo_url:            z.string().url(),               // must match a registered repo
  pr_number:           z.number().int().positive().optional(),
  pr_url:              z.string().url().optional(),
  status:              z.enum(['draft','open','merged','closed']).optional(), // default 'open'
  branch_ref:          z.string().optional(),
  base_branch:         z.string().optional(),
  author_github_login: z.string().optional(),
  thread_id:           z.string().uuid().optional(),   // link PR -> thread
  task_id:             z.string().uuid().optional(),   // link PR -> task

  // Wake half (optional) — both required together to post a message
  notify_thread_id:    z.string().uuid().optional(),   // thread to post into (messages.thread_id NOT NULL)
  notify_content:      z.string().optional(),          // narration ("Opened PR #47 on genie_code_demo...")
  notify_to_agent_id:  z.string().uuid().optional(),   // routes the wake to a specific agent
}
```

`project_id` is **not** an input — it is taken from the persona token (see auth) to
prevent cross-project writes.

## Authorization (agent identity, not human OBO)

MCP calls carry a persona token, not an OBO human — `requirePersona` sets `req.persona`
and `req.agentId`, and the JWT claims include `project_id` and `agent_id` (`auth.ts:82`,
`auth.ts:108`). Therefore:

- Derive `project_id` **from `req.persona.project_id`** — do not accept it as an
  argument. An agent can only record actions for its own project.
- `parent_agent_id` for the message = `req.agentId`.

## Validation (before any write)

1. **Repo is registered to this project** — reuse the webhook's match
   (`github-webhook.ts:91`):
   `SELECT 1 FROM app.repo_config, jsonb_array_elements(repos) e WHERE project_id=$1 AND e->>'url'=$2`.
   Reject unknown repos.
2. **thread_id / task_id / notify_thread_id / notify_to_agent_id belong to
   project_id** — explicit `SELECT 1 ... WHERE id=$ AND project_id=$`. FKs alone
   do not scope to project. `notify_to_agent_id` in particular must be
   project-scoped: `messages.to_agent_id` is not covered by the messages RLS
   policy (which scopes only by `thread_id`'s project) and the NOTIFY bridge
   resolves the target agent by id with no project check, so an unscoped UUID
   could wake an agent in another project.
3. If `notify_content` is set, `notify_thread_id` must be set (and vice-versa) —
   `messages.thread_id` is `NOT NULL` (`001:90`).

## Behavior (single transaction via `db.asUser(req)`)

Obtain an RLS-scoped client from `db.asUser(req)` and wrap both writes in
`BEGIN/COMMIT`.

**A. State upsert (only if `pr_number` provided)** — mirror the webhook exactly
(`github-webhook.ts:104-108`):

```sql
INSERT INTO app.pull_requests
  (project_id, thread_id, task_id, repo_url, pr_number, pr_url,
   status, opened_by, branch_ref, base_branch, author_github_login, updated_at)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11, now())
ON CONFLICT (project_id, pr_number) DO UPDATE SET
  status=EXCLUDED.status, pr_url=EXCLUDED.pr_url, branch_ref=EXCLUDED.branch_ref,
  base_branch=EXCLUDED.base_branch, author_github_login=EXCLUDED.author_github_login,
  thread_id=COALESCE(EXCLUDED.thread_id, app.pull_requests.thread_id),
  task_id=COALESCE(EXCLUDED.task_id, app.pull_requests.task_id),
  updated_at=now();
```

Constraints to honor (`001:153,158,159`; `007:23`):

- `status` defaults to `'open'` if omitted; `status IN {draft,open,merged,closed}`.
- **`opened_by` is NOT NULL and must be lowercase** — set `opened_by = lower(<identity>)`.
- `author_github_login` should be lowercased too, for consistency with the webhook path.
- Conflict target is `(project_id, pr_number)`.
- If `pr_number` is omitted (e.g. a bare push with no PR yet), **skip the upsert** —
  `pr_number` has no unique key when null, so there is nothing to upsert; that action is
  narration-only via the message half.

**B. Wake message (only if `notify_content` provided)** — insert into `app.messages`
(`001:89-99`), which fires `trg_notify_hi_genie_message` -> `pg_notify('hi_genie_messages', ...)`
(`006:23,33`):

```sql
INSERT INTO app.messages
  (thread_id, parent_agent_id, author_user_id, to_agent_id, content, role)
VALUES ($1, $2 /*req.agentId*/, NULL, $3 /*notify_to_agent_id or NULL*/, $4, 'assistant')
RETURNING id;
```

Honor CHECKs: exactly one of `author_user_id`/`parent_agent_id` non-null -> set
`parent_agent_id=req.agentId`, `author_user_id=NULL`; `role IN {user,assistant,system,tool}`
-> `'assistant'`. The trigger payload the bridge consumes is
`{message_id, thread_id, project_id, to_agent_id}` (`006:23`; `bridge/index.ts:67,75,100`)
— nothing extra needed from us.

`COMMIT`. On any validation or write error, `ROLLBACK` and return a structured MCP error.

## Return value

```json
{ "ok": true,
  "pull_request": { "id": "...", "pr_number": 47, "status": "open" } | null,
  "message_id": "..." | null }
```

## Interactions to note

- **CDF/analytics** — the `pull_requests` write propagates to
  `hls_fde_dev...lb_pull_requests_history` via wal2delta (`REPLICA IDENTITY FULL`,
  migration 008). Free, no extra work. (The sync being currently stale is a separate,
  decoupled issue.)
- **Parked webhook compatibility** — the dormant webhook handler upserts the *same*
  table with the *same* `(project_id, pr_number)` conflict target, so if it ever
  re-activates the two coexist as last-writer-wins. No conflict.
- **NOTIFY is the only trigger** — writing `pull_requests` alone is silent to other
  agents (only CDF sees it); waking requires the message half. Intentional, matches
  ADR 001.

## Acceptance contract

1. Tool `record_git_action` registered in `server/mcp/tools.ts`; `npm run typecheck` +
   `npm run build:server` clean.
2. `project_id` sourced from `req.persona`, never from input; a mismatched/absent
   persona -> MCP error, no write.
3. Unregistered `repo_url`, or `thread_id`/`task_id`/`notify_thread_id` not in the
   project -> rejected before any write.
4. Both writes in one transaction; failure of either rolls back both (no orphan wake,
   no silent state).
5. `opened_by` and `author_github_login` written lowercased; `status` defaults to
   `open`; upsert conflict target `(project_id, pr_number)`.
6. Message insert sets `parent_agent_id=req.agentId`, `author_user_id=NULL`,
   `role='assistant'`; a NOTIFY fires so the bridge wakes `notify_to_agent_id`.
7. `pr_number` omitted -> no `pull_requests` write; message-only path still works.
8. `notify_content` set without `notify_thread_id` (or vice-versa) -> rejected.

## Out of scope

- No outbound GitHub reads (that is the official GitHub MCP's job per ADR 001).
- No schema/migration changes.
- No changes to the parked webhook/relay path.
