# 6b addendum — human-authored chat messages (reload-safe, multi-human)

## Why
Cross-review of PR #43 (6b) found: the dashboard's chat send currently goes
through the MCP `send_message` tool using the persona token, which always
writes `parent_agent_id = <persona agent>`, `role = 'assistant'`. That means a
human operator's messages and the agent's own replies are byte-for-byte
identical in storage — there is no persisted field that lets the client
compute `isMine` correctly after a reload (only in-session `sentIds` masks
it). This also can't distinguish between multiple different humans on the
same project, since nothing records *which* human sent it.

## Grounded facts (verified, do not re-derive)
- `app.messages` columns: `id, thread_id, author_user_id text, parent_agent_id
  uuid, to_agent_id uuid, content, role text default 'user', created_at,
  read_at`. (`001_initial_schema.ts`)
- `CHECK ((author_user_id IS NULL) <> (parent_agent_id IS NULL))` — exactly
  one of the two must be set. `role` CHECK allows `'user'|'assistant'|'system'|'tool'`.
  `author_user_id`, when present, must be lowercase.
- No `app.users` table — human identity is plain lowercase email text,
  matching `project_members.user_id` (`TEXT NOT NULL`, PK
  `(project_id, user_id)`, already supports multiple distinct humans per
  project today).
- `messages` RLS already permits inserts scoped by
  `hi_genie_has_project_access(project_id, current_user)` via the thread's
  project — this works for a human OBO Postgres role the same way it works
  for agent inserts.
- NOTIFY fires from an `AFTER INSERT ON messages FOR EACH ROW` trigger
  (migration 006) — table-level, not path-specific. Any insert into
  `app.messages`, from any code path, fires it identically. No special
  wiring needed for a new insert path.
- `/api/me` already returns the real OBO email; `extractOboIdentity(req)` /
  the owner-guard OBO pattern already used in `server/routes/repos.ts` is the
  precedent to follow for a human-authenticated (non-persona) REST route.
- MCP `send_message` (`server/mcp/tools.ts`) stays exactly as-is: agent-only,
  `parent_agent_id = req.agentId`, `role = 'assistant'`, no `author_user_id`.
  Do not touch it.

## The change

### 1. New backend route — human-authored send
Add `POST /api/threads/:thread_id/messages` (new file
`server/routes/messages.ts`, or alongside the existing OBO REST routers —
match whichever file organization the repo already uses for OBO-only routes).

- **Auth:** OBO only (`extractOboIdentity(req)`), no persona token required —
  same shape as the existing `repos.ts` OBO routes. Reject with 401 if no OBO
  identity.
- **Authorization:** the thread's project must be accessible to this human —
  either rely on RLS via an OBO-scoped Postgres client (preferred, matches
  the existing pattern for OBO writes elsewhere) or an explicit
  `project_members` check before insert. Do not accept `project_id` from the
  body — derive it from the thread row.
- **Body:** `{ content: string, to_agent_id?: string, to_nickname?: string }`.
  Resolve `to_agent_id` the same way `send_message`'s MCP handler already
  resolves a target agent from `to_nickname`/`to_agent_id` for the thread's
  project — reuse or mirror that resolution logic rather than duplicating it
  ad hoc.
- **Insert:**
  ```sql
  INSERT INTO app.messages
    (thread_id, author_user_id, parent_agent_id, to_agent_id, content, role)
  VALUES ($1, lower($2 /*OBO email*/), NULL, $3, $4, 'user')
  RETURNING id, created_at, ...;
  ```
- **Return:** the created message row (id, created_at, author_user_id,
  content, role, to_agent_id) so the client can reconcile its optimistic
  append without a refetch.

### 2. Frontend — human sends via the new route, not MCP
- `ChatView.tsx`: switch the human operator's send action from MCP
  `send_message` to `POST /api/threads/:thread_id/messages`. Keep MCP
  `get_messages` / `mark_messages_read` unchanged (reads stay as they are).
- Thread the current viewer's own OBO email (already available from `/api/me`
  at the `App.tsx` level) down to `ChatView` as a prop, e.g. `ownEmail`.
- **`isMine` derivation, reload-safe and multi-human-correct:**
  ```ts
  const isMine = msg.role === 'user' && msg.author_user_id?.toLowerCase() === ownEmail.toLowerCase();
  ```
  Agent-authored messages (`role === 'assistant'`) are never "mine" —
  render them with the sending agent's live label/color from the roster
  (per 6b's existing routing work). Human messages from a *different* human
  on the same project render as "not mine" too — distinguishable from the
  current viewer, not lumped in with the agent.
- Drop the in-session `sentIds` masking hack now that `author_user_id` makes
  ownership reload-safe and derivable from persisted data alone.
- Displaying the sender's email/name for other humans' messages is a nice-to
  -have, not required for this fix — at minimum, don't render another
  human's message as if it were the current viewer's.

## Acceptance contract
1. `npm run typecheck` + `npm run build:server` + `npm run build:client` clean.
2. MCP `send_message` unchanged — still agent-only, `role='assistant'`,
   `parent_agent_id` set, `author_user_id` NULL. No behavior change there.
3. New route requires OBO identity; rejects with 401 with none provided; does
   not accept a client-supplied `project_id` — always derived from the
   thread.
4. New route's insert always sets `role='user'`, `author_user_id=lower(OBO
   email)`, `parent_agent_id=NULL`; a project-inaccessible thread is
   rejected before any write (401/403, not a silent partial insert).
5. `isMine` in the client is computed purely from persisted fields
   (`role` + `author_user_id` vs the current viewer's own email) — no
   reliance on any in-session Set/array. Verify by reasoning through: two
   different humans (`alice@x.com`, `bob@x.com`) both messaging in the same
   thread — from Alice's browser, her own messages render as "mine", Bob's
   messages and the agent's replies do not; and vice versa from Bob's
   browser.
6. Confirm (by reading migration 006, not by asserting) that NOTIFY fires
   the same way for this new insert path as for the MCP path — table-level
   trigger, no per-path wiring needed. No behavior change required there,
   just don't break it.
7. Scope stays confined to: the new route file, `ChatView.tsx` (+ prop
   threading for `ownEmail` from `App.tsx`), and nothing in migrations
   (no schema change needed — all columns already exist).
