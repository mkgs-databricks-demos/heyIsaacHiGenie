# Hey Isaac? Hi Genie! — Project Memory

Shared durable context for the **hey-isaac-hi-genie** platform — spans both
`hey-isaac-infra` and `hey-isaac-ai` bundles. Used to resume work across sessions.

---

## What This Project Is

A multi-agent coordination platform on Databricks. Named AI agents (personas) working on
the same project — e.g. **Isaac** building a Swift/iOS app in Xcode, **Genie** working
the Databricks side — get a shared layer to **message each other**, **share long-term
memory**, and **coordinate work on a single GitHub monorepo**.

Delivered as a **Databricks App** that is simultaneously:
- A **custom MCP server** agents connect to (streamable HTTP, MCP 2025-03 transport)
- A **React owner dashboard** for defining projects, agent roles, and responsibilities
- A **Lakebase (Postgres)** persistence layer for messages, memory, work items, repo config

See `docs/` for full architecture, auth, data model, MCP tools, GitHub integration, and roadmap.

---

## Project Structure

```
hey-isaac-hi-genie/
├── PROJECT_MEMORY.md               # This file
├── deploy.sh                       # Unified deployment script (infra → bootstrap → app → source)
├── docs/
│   ├── 01-architecture.md
│   ├── 02-auth-and-identity.md
│   ├── 03-data-model.md
│   ├── 04-mcp-tools.md
│   ├── 05-github-integration.md
│   ├── 06-frontend.md
│   └── 07-roadmap-and-next-steps.md
├── hey-isaac-infra/                # DABs infra bundle
│   ├── databricks.yml
│   └── resources/
│       ├── hi_genie.schema.yml
│       ├── hi_genie.secret_scope.yml
│       ├── hi_genie.lakebase.yml
│       └── platform_bootstrap.job.yml
│   └── src/notebooks/
│       └── platform_bootstrap.py
└── hey-isaac-ai/                   # DABs app bundle (AppKit)
    ├── databricks.yml
    ├── app.yaml
    ├── package.json
    ├── tsconfig.json
    ├── tsdown.server.config.ts
    ├── .env.example
    ├── resources/
    │   ├── hi_genie.app.yml
    │   ├── configure_app_spn.job.yml
    │   └── post_deploy_validation.job.yml
    ├── server/
    │   ├── server.ts               # createApp() entry point
    │   ├── middleware/auth.ts      # OBO identity extraction + persona JWT verification
    │   └── routes/
    │       ├── mcp.ts              # Streamable-HTTP MCP server (whoami + ping tools)
    │       ├── dcr.ts              # RFC 7591 Dynamic Client Registration
    │       └── persona-token.ts    # HMAC JWT persona token issuer
    ├── client/
    │   ├── index.html
    │   ├── vite.config.ts
    │   └── src/
    │       ├── main.tsx
    │       └── App.tsx             # Spike UI: /api/me + persona token round-trip
    └── src/notebooks/
        ├── configure_app_spn.py
        └── post_deploy_validation.py
```

---

## Current Status: Phase 0 Auth Spike — Scaffolded, Not Yet Deployed

### What is done
- All architecture decisions finalized (see `docs/`)
- Both DABs bundles fully scaffolded on branch `feat/spike-scaffold`
- Branch pushed to `origin` at `https://github.com/mkgs-databricks-demos/heyIsaacHiGenie`
- `deploy.sh` adapted from lakeLoom conventions

### What is NOT done yet
- **Infra bundle has never been deployed** — `databricks bundle deploy` has not run
- `jwt_signing_key` has NOT been provisioned in the secret scope
- The app bundle has NOT been deployed
- No Lakebase project exists yet
- No UC schema exists yet
- `npm install` has NOT been run in `hey-isaac-ai/`

### Blocked on
- Need to authenticate Databricks CLI against `fevm-hls-fde.cloud.databricks.com`
  (was started but not completed — Matthew was away from his home network)

---

## First Deployment Sequence (pick up here)

```bash
# 1. Authenticate CLI
databricks auth login --host https://fevm-hls-fde.cloud.databricks.com

# 2. Deploy infra (schema, secret scope, Lakebase project)
./deploy.sh --target dev --infra

# 3. Provision the persona token signing key (admin step)
databricks secrets put-secret hi_genie_credentials jwt_signing_key \
  --string-value "$(openssl rand -base64 64)"

# 4. Deploy app + run bootstrap (stores workspace_url, validates jwt_signing_key)
./deploy.sh --target dev --app --run-setup

# 5. Install Node deps and verify the build locally
cd hey-isaac-ai && npm install && npm run typecheck
```

---

## Architecture Decisions (all finalized 2026-06-27)

### Auth & Identity
- **OBO (on-behalf-of-user)** — NOT service-principal-per-agent
- In-Databricks agents connect via **Unity Catalog HTTP connection** (`OAuth U2M Per User`)
  — each human logs in individually, UC enforces permissions, per-user audit + revocation
- The App implements **RFC 7591 DCR** at `POST /register` so Databricks auto-registers the
  UC connection without a manual client ID/secret
- External agents (e.g. Isaac on a Mac) hit `/mcp` directly with a pre-registered static
  OAuth app + auth-code flow — NO DCR required on that path
- **Persona layer**: transport authenticates the human user; each agent additionally sends
  an **App-issued, signed, scoped persona JWT** (`X-Persona-Token` header) to assert its
  nickname. Bounded: an agent can only assume personas the authenticating user may drive.
- **Identity hierarchy**: Human user (UC OBO) → Agent persona (app token) →
  Omnigent sub-agent (inherits parent, carries label)

### MCP Server
- Transport: **streamable HTTP** (POST `/mcp`, MCP 2025-03 spec)
- Stateless for Phase 0 spike — one `McpServer` instance per request
- Phase 0 spike tools: `whoami` (returns human + persona + project_id), `ping`
- Full messaging/memory tools come in Phase 3

### GitHub Integration
- Single monorepo; App is **API-only broker** — no server-side working copy
- Agents always create feature branches, never merge
- Branch protection enforces no-merge; MCP server exposes no merge tool
- Per-user OBO GitHub identity; commits attributed via `Co-authored-by: <persona>` trailers

### Stack
- Frontend: React (Vite)
- Backend: Node.js + AppKit (`@databricks/appkit`)
- Persistence: Lakebase (Postgres) via AppKit `lakebase()` plugin
- Platform: Databricks App on `fevm-hls-fde.cloud.databricks.com`

---

## Bundle Configuration

### hey-isaac-infra dev target

| Variable | Value |
|---|---|
| `catalog` | `hls_fde_dev` |
| `schema` | `hi_genie` |
| `secret_scope_name` | `hi_genie_credentials` |
| `lakebase_project_id` | `dev-${var.user_handle}-hi-genie` (injected by `deploy.sh`) |
| `run_as_user` | `${workspace.current_user.userName}` (DABs built-in, auto-resolved) |

### hey-isaac-ai dev target

| Variable | Value |
|---|---|
| `catalog` | `hls_fde_dev` |
| `schema` | `dev_${var.user_handle}_hi_genie` (injected by `deploy.sh`) |
| `lakebase_project_id` | `dev-${var.user_handle}-hi-genie` (injected by `deploy.sh`) |
| `lakebase_database_id` | `""` — resolved by `deploy.sh` at deploy time via `--var` |
| `app_name` | `hey-isaac-hi-genie-dev` |
| `run_as_user` | `${workspace.current_user.userName}` (DABs built-in, auto-resolved) |

---

## Secret Scope (`hi_genie_credentials`)

### Auto-provisioned by `platform_bootstrap` job
| Key | Value |
|---|---|
| `workspace_url` | `https://fevm-hls-fde.cloud.databricks.com` |

### Admin-provisioned (manual)
| Key | How to provision |
|---|---|
| `jwt_signing_key` | `openssl rand -base64 64` → `databricks secrets put-secret hi_genie_credentials jwt_signing_key --string-value <value>` |
| `github_client_id` | GitHub OAuth App client ID — Phase 5, not needed for spike |
| `github_client_secret` | GitHub OAuth App client secret — Phase 5, not needed for spike |

### App SPN access
The app's auto-provisioned SPN gets READ on the scope via the `configure_app_spn` job,
which `deploy.sh` runs automatically after the app bundle deploys.

---

## Phase 0 Spike — What to Prove

**Exit criteria before moving to Phase 1:**

1. A real Databricks user, through a UC HTTP connection, calls the `/mcp` endpoint and the
   `whoami` tool correctly returns their human email.
2. That same user calls `POST /token/persona` and receives a signed JWT.
3. Attaching that JWT as `X-Persona-Token` on a second `/mcp` call causes `whoami` to return
   both the human email and the persona nickname + project_id.
4. An external client (auth-code flow, static OAuth app, no DCR) can also call `/mcp` with
   the same result.

**Open questions to answer during spike:**
- What exact header does the Databricks App platform inject for OBO identity?
  (`x-forwarded-user`? `x-databricks-user-email`?) — check `server/middleware/auth.ts`
  `OBO_HEADER_CANDIDATES` and log from `/api/me`.
- Does DCR auto-registration actually trigger when the UC HTTP connection is created, or
  does it require a specific well-known endpoint path?
- Does `@modelcontextprotocol/sdk` `StreamableHTTPServerTransport` work correctly with
  the one-server-per-request stateless pattern?

---

## Roadmap

| Phase | Status | Description |
|---|---|---|
| 0 — Auth spike | **Scaffolded, not deployed** | Prove OBO + DCR + persona token round-trip |
| 1 — Foundation | Not started | Lakebase schema DDL, AppKit scaffold |
| 2 — Auth productionize | Not started | DCR persistence, persona token rotation, key storage |
| 3 — MCP server | Not started | Full messaging/memory tools, thread linkage |
| 4 — Frontend | Not started | Owner dashboard: projects, roster, message monitor |
| 5 — GitHub integration | Not started | Branch/PR tools, sparse checkout, branch protection |
| 6 — Integration test | Not started | Connect Genie (UC) + Isaac (static OAuth), end-to-end |
| 7 — Agile board | Not started | tasks/sprints UI + MCP tools |

---

## Technical Notes

### OBO Header Discovery
The spike UI at `/` hits `GET /api/me` which logs all candidate OBO headers and returns them
in the response JSON. Check this endpoint first after deploy to see which header
Databricks Apps actually injects.

### Persona Token Format (HS256 JWT)
```json
{
  "sub": "human@databricks.com",
  "persona": "Genie",
  "project_id": "my-project",
  "iat": <unix>,
  "exp": <unix + 3600>,
  "iss": "https://<app-url>/token/persona"
}
```
Signed with `HS256` using `HI_GENIE_JWT_SIGNING_KEY` (env var, injected from secret scope).

### DCR In-Memory Registry
`server/routes/dcr.ts` uses an in-memory `Map` for the spike. Move to a Lakebase
`dcr_clients` table in Phase 2.

### AppKit `lakebase().asUser(req)`
Used for OBO per-user Postgres queries (enforces Row-Level Security).
Requires `user_api_scopes: [postgres]` in `hi_genie.app.yml` — already set.
Service-principal pool (`AppKit.lakebase.query()`) used for DDL and admin operations.

### deploy.sh `lakebase_database_id` Resolution
The Lakebase database ID is auto-generated on first project deploy and not known at
YAML-write time. `deploy.sh` discovers it via:
```bash
databricks postgres list-databases "projects/${LAKEBASE_PROJECT_ID}/branches/production"
```
and passes it to the app bundle as `--var lakebase_database_id=<id>`.
