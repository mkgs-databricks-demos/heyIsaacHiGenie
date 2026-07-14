# Spec — 6e-ii: Human per-thread unread badges

## Context
Per the frontend-capabilities scoping done earlier this session: the existing `read_at`/
read-tracking in `app.messages` is scoped to `to_agent_id` (agent recipients), so there is
currently NO way to know "has THIS SIGNED-IN HUMAN read the latest messages in this thread."
The Sidebar shows a thread list per agent but has no unread indicator for humans.

This task adds that mechanism end-to-end: schema + backend route(s) + Sidebar UI.

Multiple distinct humans can be members of the same project (confirmed in the human-message-
attribution work for PR #43 — `author_user_id` is per-signed-in-human, e.g.
`matthew.giglia@databricks.com`, not a shared "operator" bucket). Design this so read-state is
tracked PER HUMAN, not globally per thread — two different humans viewing the same thread must
each get correct, independent unread counts.

## What to verify first (ground truth, don't assume)
1. Read the current `app.messages` schema (migrations 001, plus whatever added
   `role`/`author_user_id` for PR #43) and confirm exact column names/types/CHECK constraints.
2. Read `server/routes/messages.ts` (the OBO human-send route from PR #43) to see the existing
   pattern for deriving the OBO human identity (email) and project-membership scoping — reuse
   that pattern exactly, do not invent a new auth path.
3. Read `Sidebar.tsx` to see how threads are currently listed/filtered (note: there was a known
   latent bug around per-agent thread filtering that was fixed in 6c — build on the current,
   fixed version, don't reintroduce the old bug).
4. Check whether `db.asUser`/RLS conventions apply to a new table the same way as `app.messages`
   (look at how `app.pull_requests`/`app.repo_config` etc. are protected) — mirror that.

## Design (recommended, but defer to what you find is idiomatic in this codebase)
- **New table**: something like `app.thread_read_state` with columns
  `(thread_id uuid, user_email text, last_read_message_id uuid or last_read_at timestamptz,
  updated_at timestamptz)`, primary key `(thread_id, user_email)`. Add a migration following
  this repo's existing migration conventions (including `REPLICA IDENTITY FULL` per the
  established convention note in `migrate.ts` — confirm that convention comment exists and
  follow it).
- **New route(s)**, OBO-authenticated (same identity/membership-check pattern as
  `POST /api/threads/:thread_id/messages` from PR #43):
  - `POST /api/threads/:thread_id/read` — upserts `(thread_id, lower(<OBO email>), now())` for
    the calling human. Call this when the human views/opens a thread in ChatView.
  - `GET /api/threads/unread-counts` (or per-project) — for the calling human, across their
    project's threads, return unread counts: count of messages in each thread with
    `created_at > COALESCE(thread_read_state.last_read_at, '-infinity')`, excluding the human's
    own messages (don't count your own sends as unread to yourself).
- **Frontend**: `Sidebar.tsx` fetches unread counts (once on load, and/or on a light poll or
  after `ChatView` marks a thread read) and renders a badge per thread. `ChatView.tsx` calls the
  new `POST .../read` route when a thread is opened and after each poll tick that shows new
  messages, so returning to the sidebar reflects the updated count.

## Constraints
- Do not touch `server/mcp/tools.ts`'s `mark_messages_read` (agent-scoped, separate concept,
  being wired independently in task 6e-i) — this is a human-facing, REST-based mechanism, not
  an MCP tool, to match the OBO pattern PR #43 established for human-authored actions.
- Do not regress the 6c thread-persistence fix or the 6b human-message-attribution work.
- Every project-scoped query must be scoped through the thread's actual `project_id` (derived
  server-side, never trusted from client input) — mirror PR #43's `messages.ts` pattern exactly.
- If schema investigation reveals a materially better mechanism than the one sketched above
  (e.g. an existing column that already fits), prefer that and document the deviation rather
  than forcing this design.

## Acceptance contract
1. `npm run typecheck`, `npm run build:server`, `npm run build:client` all clean.
2. New migration is idempotent, includes `REPLICA IDENTITY FULL` per the repo convention, and
   does not alter any existing table's data.
3. New route(s) are OBO-only (401 with no OBO identity), project-membership-scoped (403 if not
   a project member), and never trust `project_id` from the request body — always derive from
   the thread row.
4. Per-human correctness: two different `author_user_id`/OBO-email humans viewing/marking the
   same thread must not clobber each other's read state.
5. A human's own sent messages must not count as unread for themselves.
6. Sidebar renders a badge (count or dot) per thread, correctly reflecting unread state after
   marking read, and clears/updates without a full page reload.
7. No change to `mark_messages_read`/MCP agent-read semantics.
8. Commits end with the trailer: `Co-authored-by: omnigent <noreply@omnigent.ai>`
9. Open your own PR (base `add-github-oauth-secret-provisioning`, head `polly/6e-ii-unread-badges`).
