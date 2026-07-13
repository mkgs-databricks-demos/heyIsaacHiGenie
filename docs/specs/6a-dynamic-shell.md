# Spec — 6a Dynamic Shell + Authoritative Agent Presentation (foundation)

## Why
The owner dashboard hardcodes a single project id and a single-element `AGENTS`
array in `client/src/App.tsx`. Every downstream capability (multi-agent chat,
routing, summaries, linkage) hangs off having a **real project context** and a
**real agent roster**. This task replaces the hardcoded shell with live backend
data, and makes agent presentation (color + label) **authoritative in the
schema** rather than client-derived.

This is the FOUNDATION task in the frontend build. It ships alone; later waves
(6b routing, 6c thread persistence, 6d summaries, 6e read-receipts, 6f
branch/PR linkage) rebase on top of it. Keep the scope exactly as below — do
not pull in routing, summaries, or linkage.

## Scope: backend + frontend, one PR

### Part 1 — Schema: authoritative agent color + label
The `agents` table backs `get_agent_roster`. Today the roster returns only
`nickname`; the client needs a `label` (display name) and `color` (accent) and
we want those to be **server-authoritative**, not hashed on the client.

1. Add a new migration (use the NEXT sequential number — inspect
   `server/migrations/` for the current highest; do not hardcode a number) that:
   - `ALTER TABLE app.agents ADD COLUMN IF NOT EXISTS label text` and
     `ADD COLUMN IF NOT EXISTS color text`.
   - Backfills existing rows: set `label` to a title-cased `nickname` when null,
     and `color` to a sensible default (e.g. `'#4a86e8'`) when null. The existing
     `genie` agent must come out with a real label + color.
   - Follows the repo's migration convention documented in
     `server/migrations/migrate.ts` / ADR 002. `agents` already has
     `REPLICA IDENTITY FULL` (migration 008), and `ADD COLUMN` preserves it — no
     replica-identity change needed, but do NOT regress it.
   - Is idempotent (`IF NOT EXISTS`, guarded backfill) so re-runs are no-ops.
2. Decide `color`/`label` nullability: keep them nullable in the column but
   ensure the roster tool never returns null (fall back in SQL via
   `COALESCE(label, initcap(nickname))` / `COALESCE(color, '<default>')`) so the
   client always receives usable values even for rows created before this
   migration ran.

### Part 2 — Backend: `get_agent_roster` returns color + label
In `server/mcp/tools.ts`, update the `get_agent_roster` handler to SELECT and
return `color` and `label` (with the COALESCE fallbacks above) alongside the
existing `nickname` and grant/id fields. Do not change its input schema,
auth, or project-scoping. `get_project_context` is already correct — do not
modify it unless the client needs a field it doesn't currently return (confirm
first by reading the handler; if a needed field is missing, extend it
minimally).

### Part 3 — Frontend: replace the hardcoded shell
In `client/src/`:
1. **Project context** — the hardcoded `PROJECT_ID` constant (in `App.tsx`, and
   re-referenced in `Sidebar.tsx`, `ProjectView.tsx`, and the RepoSection path)
   becomes a **bootstrap seed** only. On init, call `get_project_context` with it
   and drive the UI (project name/header, membership) from the response. There is
   NO "list my projects" tool yet, so this is not a project *switcher* — it stays
   a single seeded project, just sourced live. Thread the resolved project data
   through props rather than importing the constant in each component.
2. **Agent roster** — delete the hardcoded `AGENTS` array in `App.tsx`. On init,
   call `get_agent_roster` and build the agent list from the response, mapping
   `nickname`/`label`/`color`/id into the existing `AgentConfig` shape the UI
   already consumes. `label` and `color` now come from the roster (authoritative),
   NOT from a client-side hash.
3. **Rewire consumers** (verify exact locations in the current source — line
   numbers drift):
   - `/token/persona` request body — the agent nickname it mints for must come
     from the roster, not a literal.
   - `start_thread` call in `ProjectView` — use the selected agent's real id/nickname.
   - `/api/repos/status` and RepoSection — use the resolved project id.
   - `<Sidebar agents=...>` and `<ProjectView agents=...>` — pass the live roster.
4. **States** — handle loading (spinner while context/roster resolve), empty
   (no agents → dashed placeholder), and error (roster/context fetch fails →
   keep the existing graceful-degradation error banner, do not white-screen).
   Preserve the current AppKit-default styling from PR #40 — no new brand theming.

## Out of scope (explicitly)
- Multi-agent chat routing / `to_nickname` selection (that's 6b).
- Thread persistence / `list_threads` (6c).
- Summaries, read-receipts, branch/PR linkage (6d/6e/6f).
- Any project *switcher* UI (no backend tool exists yet).
- The sidebar `threads.filter(t => t.id)` bug — leave it for 6c.

## Gates (must pass before opening the PR)
- `npm run typecheck`
- `npm run build:server`
- `npm run build:client`
Run these from `hey-isaac-ai/`. If a Lakebase/dev credential is needed to
exercise the migration live, DO NOT block on it — the migration runs on the
app SPN at deploy; verifying it is compile/SQL-review only here. Report clearly
if you could not live-run it.

## Acceptance contract (for the implementer + cross-review)
1. New migration adds `label` + `color` to `app.agents`, backfills existing rows
   (genie gets a real label + color), is idempotent, preserves `REPLICA IDENTITY
   FULL`, and uses the next sequential migration number + the repo convention.
2. `get_agent_roster` returns `nickname` + `label` + `color` (+ existing id/grant
   fields), never null for label/color (COALESCE fallback), input schema/auth
   unchanged.
3. `App.tsx` no longer contains a hardcoded `AGENTS` array; the roster is built
   from `get_agent_roster`. `PROJECT_ID` is a single bootstrap seed feeding
   `get_project_context`, not duplicated as an imported constant across
   components.
4. `/token/persona`, `start_thread`, `/api/repos/status`, `<Sidebar>`, and
   `<ProjectView>` all consume the live project/roster data, not literals.
5. Loading / empty / error states handled; graceful-degradation banner preserved;
   AppKit-default styling unchanged.
6. `typecheck` + `build:server` + `build:client` all clean.
7. Scope discipline: no routing, persistence, summaries, read-receipts, or
   linkage changes; no project-switcher UI.

## Deliverable
Work ONLY inside this worktree (`.worktrees/6a-dynamic-shell`, branch
`polly/6a-dynamic-shell`). Commit with the co-sign trailer as the final line:

    Co-authored-by: omnigent <noreply@omnigent.ai>

Open your OWN PR against `add-github-oauth-secret-provisioning`. Report the PR
number, the migration number you used, and whether you could live-run the
migration.
