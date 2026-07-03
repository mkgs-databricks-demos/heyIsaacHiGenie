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

### Phase 5 — GitHub observe layer ✅ Done (PR #32)
- Read-only GitHub App registered; webhook consumer (`POST /webhook/github`) live with HMAC
  verification; OAuth flow (`/auth/github/login` + `/callback`) live.
- PR events upsert `app.pull_requests`; `app.github_tokens` table for OAuth tokens.
- All 14 `app.*` tables have `REPLICA IDENTITY FULL`; wal2delta CDC pipeline active.
- Verified end-to-end against `mkgs-databricks-demos/genie_code_demo`.

### Phase 5b — GitHub governance & linkage (next)
- Governance tools `get_repo_config` / `get_my_checkout_spec`; linkage tools `link_branch` /
  `link_pull_request` (the **primary**, agent-push linkage path). **No executing git tools** —
  agents use their own GitHub MCP.
- GitHub **branch protection** setup (the hard guard — now carries full weight); per-user OBO
  write identity + `Co-authored-by:` trailers; validate agent-reported branch names against the
  template and wire branch/PR into the work graph.

### Phase 6 — Integration test
- Connect **Genie** (via UC connection) and **Isaac** (static OAuth).
- End-to-end: an API-contract conversation in a **thread** tied to a **branch**, producing a
  **PR** that a human reviews and merges.

### Phase 7 — Agile board
- Activate `tasks` / `sprints` UI + `list_tasks` / `update_task` MCP tools.

## Immediate next steps

1. **Merge PR #32** — all cross-reviews passed, Phase 5 verified end-to-end.
2. **Phase 5b** — implement `get_repo_config`, `get_my_checkout_spec`, `link_branch`, `link_pull_request` MCP tools.
3. **S2/S3 security hardening** — `timingSafeEqual` for DCR secret compare; auth guard on `GET /dcr/:client_id`.
4. **wal2delta cycle verification** — confirm CDC data flowing to UC OTel tables after next wal2delta run.
5. **Phase 7 — Agile board** — `tasks`/`sprints` UI + MCP tools, now that PRs are wired into the work graph.

## Risks & watch-items

| Risk | Mitigation |
|---|---|
| DCR + UC connection + persona handshake is unproven | Phase 0 spike before anything else |
| External runtime might require DCR (incompatible) | Confirm runtime OAuth capability early |
| Overlapping sparse cones cause merge conflicts | Roster overlap warnings; non-overlapping by design |
| Agent merges unreviewed code | GitHub branch protection (hard guard — agents' own GitHub MCP may expose merge, so protection carries full weight) |
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
- **GitHub:** single monorepo; **agents use their own GitHub MCP for all git execution** — our
  App is the *governor*, not the broker (no working copy, no git tooling recreated). App owns
  policy (repo selection, per-agent sparse cones derived from responsibilities, naming + merge
  rules) and linkage (recording branch/PR back to threads/tasks). Always branch, never merge —
  enforced by **GitHub branch protection** (hard guard, full weight) + App-served policy.
- **GitHub identity = two lanes:** write = **per-user OBO** (agents, persona via `Co-authored-by:`
  trailers); read/observe = a **read-only GitHub App**, a GitHub-plane identity custodied by the
  App SPN's secret scope (SPN unlocks the secret holding the GitHub App creds; GitHub App is the
  actor; appears as a bot, never writes).
- **GitHub linkage = staged hybrid:** agent-push (`link_branch`/`link_pull_request`) primary and
  first; read-only GitHub App webhook observe layer later for authoritative lifecycle +
  reconciliation. Branch-name convention is the load-bearing join key (App validates it).
