# 6c — thread persistence (backend + frontend)

## Why
Threads today only live in React state (`App.tsx` `useState`) — created via
the MCP `start_thread` tool but never re-fetched. They vanish on browser
reload. There is no `list_threads` tool or route anywhere server-side.

## Scope
1. **New backend MCP tool `list_threads`** — mirrors the existing
   `get_agent_roster`/`get_project_context` pattern (persona-token
   authenticated, `server/mcp/tools.ts`).
   - Input: `{ project_id: string }` (project_id validated the same way other
     tools validate it — from the persona/project scoping already
     established in this codebase's tools, not from unchecked client input
     if a stronger source of truth exists).
   - Output: list of threads for that project — at minimum `id`,
     `project_id`, `title`, `created_by`, `created_at`, `updated_at`, plus
     enough to let the client know which agent(s) a thread involves (check
     the `threads` table schema — if there's no agent-linkage column on
     `threads` itself, derive "involves agent X" by joining/filtering via
     `messages.parent_agent_id`/`to_agent_id` for that thread, or state
     clearly in your report if threads are project-scoped only with no
     agent linkage at the schema level — don't invent a column).
   - The `threads` table and its RLS already exist (per the project's
     history) — this is a new read tool, not a new migration. If you find a
     genuine gap (no RLS coverage, no efficient index for the query), flag it
     rather than silently work around it with an unscoped query.
2. **Fix the latent sidebar bug** — `Sidebar.tsx` currently filters threads
   by `t.id` truthiness (shows all threads under every agent). Now that
   multiple agents will exist via the 6a roster, this needs a real filter —
   presumably by which agent(s) the thread involves, per whatever linkage
   `list_threads` exposes in (1). If thread-to-agent linkage doesn't exist at
   the schema level, the correct minimal fix is to stop pretending there's
   per-agent filtering and show all threads under every entry point
   consistently (don't guess a wrong filter) — but prefer deriving a real
   linkage if the data supports it.
3. **Client wiring** — on mount (after the roster/project bootstrap), call
   `list_threads` and hydrate the sidebar's thread list instead of starting
   empty. New threads created via `start_thread` should still appear
   immediately (optimistic append), and a reload should show the same set
   (fetched, not reconstructed from memory).

## Acceptance contract
1. `npm run typecheck` + `npm run build:server` + `npm run build:client` all
   clean.
2. `list_threads` returns real persisted threads for the given project —
   reloading the page after creating a thread shows it in the sidebar (not
   just live-session state).
3. Sidebar's per-agent thread filter is either correctly scoped to real
   thread-to-agent linkage, or (if no such linkage exists in the schema)
   explicitly documented as showing all threads everywhere with the
   incorrect `t.id`-truthiness filter removed — no silently-wrong filter
   left in place.
4. No unrelated changes. If you discover during implementation that thread
   persistence requires something bigger than one new read tool (e.g. an
   actual schema gap), STOP and report the finding precisely rather than
   improvising a migration inside this task — surface it back for a design
   call.
5. `list_threads` requires a valid persona token / project scoping
   consistent with the other roster/context tools — no unauthenticated read
   of another project's threads.
