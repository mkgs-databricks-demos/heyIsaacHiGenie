# Roadmap & Next Steps

## Implementation phases

### Phase 0 — Auth spike (do this first) ⚠️
**The critical-path risk lives here.** Before committing schema and UI, prove the hardest
handshake with a throwaway spike:

- Stand up a minimal Databricks App (Node) exposing `/mcp` + a DCR endpoint.
- Register it as a **Unity Catalog HTTP connection** (`OAuth U2M Per User`) and confirm
  auto-registration via **DCR** works against a real workspace.
- Round-trip a **persona token**: issue one, attach it to an MCP call, verify it in middleware,
  resolve persona from `(human OBO + persona token)`.
- Confirm an **external** client (auth-code flow, static OAuth app, no DCR) can also call `/mcp`.

**Exit criteria:** a real Databricks user, through the UC connection, calls an MCP tool that
correctly resolves to a persona; an external client does the same via the static OAuth app.

### Phase 1 — Foundation
- AppKit Node scaffold + React shell.
- Lakebase schema, including the **reserved board tables** (`tasks`, `sprints`) and git tables
  (`repo_config`, `agent_checkout_spec`, `pull_requests`).
- DB connection/data-access layer.

### Phase 2 — Auth (productionize the spike)
- DCR endpoints; UC connection setup docs.
- Persona-token issuer + verification middleware; key storage (Databricks secret), TTL, rotation.
- OBO plumbing for both in-Databricks and external paths.

### Phase 3 — MCP server
- `/mcp` streamable HTTP + the messaging/memory tools.
- Thread linkage (branch_ref / task_id) wired through.

### Phase 4 — Frontend
- Projects, agent roster (with cone-overlap warnings), message monitor, memory browser, dashboard.

### Phase 5 — GitHub integration
- `get_repo_config` / `get_my_checkout_spec` / `create_feature_branch` / `open_pull_request` /
  `get_pull_request_status` / `comment_on_pr` (API-only, no working copy).
- GitHub **branch protection** setup; per-user OBO GitHub identity + `Co-authored-by:` trailers.

### Phase 6 — Integration test
- Connect **Genie** (via UC connection) and **Isaac** (static OAuth).
- End-to-end: an API-contract conversation in a **thread** tied to a **branch**, producing a
  **PR** that a human reviews and merges.

### Phase 7 — Agile board
- Activate `tasks` / `sprints` UI + `list_tasks` / `update_task` MCP tools.

## Immediate next steps

1. **Run the Phase 0 auth spike** — highest-value de-risking action.
2. **Settle the persona-token format** — JWT vs opaque+introspection; signing key storage;
   TTL/rotation. (Decide during the spike.)
3. **Confirm external runtime OAuth capability** — verify Isaac's runtime can do auth-code flow
   with a static client and does **not** require DCR.
4. **Scaffold Phase 1** once the spike validates the approach.

## Risks & watch-items

| Risk | Mitigation |
|---|---|
| DCR + UC connection + persona handshake is unproven | Phase 0 spike before anything else |
| External runtime might require DCR (incompatible) | Confirm runtime OAuth capability early |
| Overlapping sparse cones cause merge conflicts | Roster overlap warnings; non-overlapping by design |
| Agent merges unreviewed code | GitHub branch protection (hard) + no merge tool (soft) |
| Persona impersonation | Persona token bounded to granted users + live OBO session |
| Stale feature branches accumulate | Branch GC policy / cleanup job (Phase 5+) |
| Board schema churn if added late | Tables reserved from day one |

## Decision log (all finalized 2026-06-27)

- **Scope:** multi-tenant (multiple projects, separate agent teams); agile board on the roadmap.
- **Messaging:** threaded; ties back to branches, tasks, projects, agents.
- **Stack:** React frontend, Node backend, Lakebase; latest Databricks AppKit.
- **Auth:** OBO per-user; UC HTTP connection (`OAuth U2M Per User`); App implements RFC 7591 DCR;
  external agents use a static pre-registered OAuth app; personas via App-issued signed tokens.
- **Identity hierarchy:** human → persona → Omnigent sub-agent.
- **GitHub:** single monorepo; App is API-only broker (no working copy); per-agent sparse cones
  derived from responsibilities; always branch, never merge (branch protection + no merge tool);
  per-user OBO GitHub identity with `Co-authored-by:` persona trailers.
