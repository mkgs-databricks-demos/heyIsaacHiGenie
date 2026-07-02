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

## Current Status: Bundles Deployed — Lakebase Live — SPN Grants Automated

### What is done (as of 2026-06-29)
- All architecture decisions finalized (see `docs/`)
- Both DABs bundles (`hey-isaac-infra`, `hey-isaac-ai`) deployed to `dev` target on `fevm-hls-fde`
- Lakebase project **`dev-hi-genie`**, branch **`dev-matthew-giglia`** live
  - Endpoint: `ep-floral-lake-d2m059vl.database.us-east-1.cloud.databricks.com:5432`
  - Database: `databricks_postgres`
- UC schema, secret scope, and app SPN all provisioned
- **App SPN Postgres grants fully automated** via `configure_app_spn` job (PR #20)
  - SPN `17579bfd-e62c-4bef-9b30-9175527e325d` has `USAGE + CREATE` on `public` and `appkit` schemas
  - Default privileges set on all future tables and sequences in `public`
- `deploy.sh` builds the Lakebase connection string at deploy time (deployer's OAuth token +
  live endpoint host) and passes it to the job — no credentials baked into bundle YAML

### Active dev environment
| Resource | Value |
|---|---|
| Workspace | `fevm-hls-fde.cloud.databricks.com` |
| Lakebase project | `dev-hi-genie` |
| Lakebase branch | `dev-matthew-giglia` |
| Postgres endpoint | `ep-floral-lake-d2m059vl.database.us-east-1.cloud.databricks.com:5432` |
| App SPN | `17579bfd-e62c-4bef-9b30-9175527e325d` |
| App name | `hey-isaac-hi-genie-dev` |

### Re-deploy sequence
```bash
DATABRICKS_CONFIG_PROFILE=fevm-hls-fde ./deploy.sh --target dev
```
`deploy.sh` handles infra → bootstrap → app → SPN grants in one pass.

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
| `secret_scope_name` | `dev_${var.user_handle}_hi_genie_credentials` |
| `lakebase_project_id` | `dev-matthew-giglia-hi-genie` |
| `run_as_user` | `matthew.giglia@databricks.com` |

### hey-isaac-ai dev target

| Variable | Value |
|---|---|
| `catalog` | `hls_fde_dev` |
| `schema` | `dev_<your_user_handle>_hi_genie` (DABs dev-mode prefix applied) |
| `lakebase_project_id` | `dev-matthew-giglia-hi-genie` |
| `lakebase_database_id` | `""` — resolved by `deploy.sh` at deploy time via `--var` |
| `app_name` | `hey-isaac-hi-genie-dev` |
| `run_as_user` | `matthew.giglia@databricks.com` |

---

## Secret Scopes (`dev_<user_handle>_hi_genie_credentials`, `hi_genie_staging_credentials`)

### Auto-provisioned by `platform_bootstrap` job
| Key | Value |
|---|---|
| `workspace_url` | `https://fevm-hls-fde.cloud.databricks.com` |

### Admin-provisioned (manual)
| Key | How to provision |
|---|---|
| `jwt_signing_key` | `openssl rand -base64 64` → `databricks secrets put-secret dev_<your_user_handle>_hi_genie_credentials jwt_signing_key --string-value <value>` |
| `github_client_id` | GitHub OAuth App client ID — Phase 5, not needed for spike |
| `github_client_secret` | GitHub OAuth App client secret — Phase 5, not needed for spike |

### App SPN access
The app's auto-provisioned SPN gets READ on the secret scope **and** Postgres schema grants
via the `configure_app_spn` job, which `deploy.sh` runs automatically after the app bundle deploys.

Postgres grants applied on every deploy (all idempotent):
```sql
GRANT ALL ON SCHEMA public TO "<spn-client-id>";
GRANT ALL ON SCHEMA appkit TO "<spn-client-id>";   -- skipped if appkit schema absent
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "<spn-client-id>";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "<spn-client-id>";
```
`deploy.sh` builds a full `lakebase_connection_string` at deploy time (deployer's OAuth token +
live Lakebase endpoint host) and passes it to the notebook as a job parameter. The notebook
calls `psycopg2.connect()` directly — no credential logic inside the notebook.

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
| 0 — Auth spike | ✅ **Done** | OBO + DCR + persona token round-trip proven live (S1–S3 smoke tests pass); S4 (external OAuth client) architecturally deferred — Databricks Apps proxy blocks M2M tokens, U2M behaviour already confirmed equivalent |
| 1 — Foundation | ✅ **Done** | 13-table Lakebase DDL (PR #16), idempotent TS migration runner (PR #18/#19), DB-backed DCR/JTI/persona authority + 12 MCP tools (PR #17), React frontend w/ Databricks retro branding (PR #21) |
| 2 — Auth productionize | 🟡 **Partial** | DCR persistence ✅ done (DB-backed, PR #17). Open: token rotation, timing-safe DCR secret compare (S2), unauthenticated `GET /dcr/:id` (S3), real GitHub OAuth creds (O2, currently stubbed) |
| 3 — MCP server | 🟡 **Mostly done** | All 12 tools shipped and smoke-tested (9/10 pass, `docs/smoke-test-results-phase1.md`). Open: `mark_messages_read` / `unread_only` filtering is a documented stub (S6) — no `read_at` column in Track A DDL yet |
| 4 — Frontend | ✅ **Done** | Retro Databricks-branded React SPA — project/agent roster, chat UI, Tailwind + AppKit UI theme (PR #21) |
| 5 — GitHub integration | ⬜ Not started | Branch/PR tools, sparse checkout, branch protection — schema (`pull_requests`, `agent_checkout_spec`) already exists from Track A |
| 6 — Integration test | 🟡 **Mostly done** | Tests 1–3 pass live against dev. Test 4 (external OAuth client, no DCR) deferred — Apps proxy rejects M2M tokens; U2M behaviour already proven via Tests 1–3 |
| 7 — Agile board | ⬜ Not started | tasks/sprints UI + MCP tools — follows GitHub integration since tasks likely reference PRs/branches |

---

## Technical Notes

### Required Tooling: Databricks CLI >= 1.5.0
Both bundles pin `bundle.databricks_cli_version: ">= 1.5.0"` in `databricks.yml`, and
`deploy.sh` has an explicit fail-closed version-check gate (`REQUIRED_CLI_VERSION`) as its
first CLI invocation, before any other `databricks` command runs.

**Why:** `databricks <cmd> --output json` has no documented/stable schema (confirmed against
Databricks' own docs and the CLI's source at multiple tags) — the shape can change or simply
be misassumed by a script author with no version signal at all. `deploy.sh` was bitten by
exactly this: it parsed `auth describe --output json` looking for `details.userName`, a key
that has **never existed at any CLI version** (v0.299.2 through v1.5.0 all return the username
as a top-level `username` field — verified directly against `cmd/auth/describe.go` in the
`databricks/cli` GitHub repo at those tags). The bug was a bad initial assumption, not version
drift, but the fix is the same either way: pin a modern CLI and fail loudly rather than
silently misparse.

If `deploy.sh` aborts with a CLI-version error, upgrade with:
```bash
curl -fsSL https://raw.githubusercontent.com/databricks/setup-cli/v1.5.0/install.sh | sh
```

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

### Lakebase Connection String Pattern (`deploy.sh` → `configure_app_spn`)
`deploy.sh` assembles a full Postgres connection string **at deploy time** using the deployer's
OAuth access token (proven to work for psql; rotates automatically) and the live Lakebase
endpoint host, then passes it to the `configure_app_spn` job as a single parameter:
```bash
# deploy.sh (inside run_configure_app_spn)
_token=$(databricks auth token --output json | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")
_host=$(databricks postgres list-endpoints "projects/${LAKEBASE_PROJECT_ID}/branches/${LAKEBASE_BRANCH_ID}" \
  --output json | python3 -c "import sys,json; eps=json.load(sys.stdin); ...; print(eps[0]['status']['hosts']['host'])")
_user=$(databricks auth describe --output json | python3 -c "... print(d.get('username','') or d.get('details',{}).get('userName','') or d.get('userName','') or d.get('user',{}).get('name',''))")
# NOTE: 'username' is top-level in every CLI version checked (v0.299.2-v1.5.0); the old
# 'details.userName' lookup never worked at any version. See "Required Tooling" note above.
# URL-encode both user and token (special chars in OAuth tokens)
_user_enc=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "${_user}")
_token_enc=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "${_token}")
lb_conn_str="postgresql://${_user_enc}:${_token_enc}@${_host}:5432/databricks_postgres?sslmode=require"
```
The notebook receives the string and calls `psycopg2.connect(lakebase_connection_string)` —
no credential logic in the notebook. This matches the `platform_bootstrap.py` pattern.

**Failure semantics:**
- Lakebase configured (`LAKEBASE_PROJECT_ID`/`BRANCH_ID` set) but credentials unresolvable → `fail` (hard abort, deploy blocked)
- Lakebase not configured → warn-and-continue (backward-compatible for non-Lakebase deployments)

---

## Known Gaps / Phase 2 Items

These are intentional spike shortcuts, not bugs. Each should be resolved before
production hardening.

### Auth & Security

| # | Area | Gap | Action |
|---|------|-----|--------|
| S1 | Persona token | Closed by Databricks Apps `valueFrom: persona-issuer`. | `deploy.sh` writes the resolved issuer URL to the target secret scope as `persona_issuer` before app bundle deploy. |
| S2 | DCR shared-secret | `x-dcr-shared-secret` comparison uses `===` (timing side-channel). | Replace with `crypto.timingSafeEqual` in `server/routes/dcr.ts`. |
| S3 | DCR GET endpoint | `GET /dcr/:client_id` is unauthenticated — any caller can enumerate registered clients. | Add shared-secret guard (same pattern as POST), or document as intentional internal-only route. |
| S4 | DCR persistence | Client registry is in-memory (`Map`). Restarts lose all registered clients. | Move to a Lakebase `dcr_clients` table. Already noted in architecture docs. |

### Deployment / Infra

| # | Area | Gap | Action |
|---|------|-----|--------|
| D1 | Prod `run_as_user` | Both bundles default `run_as_user` to `${workspace.current_user.userName}`. This is correct for dev but wrong for prod. | When a prod target is added, explicitly set `run_as_user` to a service principal in that target's override. |
| D2 | `user_handle` on prod | `deploy.sh` only injects `--var user_handle=` for the dev target. Prod bundle YAML must not reference `var.user_handle`. | Audit bundle YAML before adding a prod target; remove or conditionalize `user_handle` references. |
| D3 | `lakebase_database_id` empty-string | If `deploy.sh` fails to resolve the DB ID, it falls back to `""`, which causes a silent misconfiguration. | Add a fail-fast guard in `deploy.sh` mirroring the `user_handle` guard (fail loudly rather than deploy with an empty ID). |

### Ops / Observability

| # | Area | Gap | Action |
|---|------|-----|--------|
| O1 | App compute polling | `deploy.sh` waits a hardcoded 300 s for app compute to start, no backoff or early-exit. | Replace with a proper poll loop (check status, sleep, retry with timeout). |
| O2 | GitHub OAuth App credentials | `github_client_id` and `github_client_secret` in target-specific scope (`dev_<user_handle>_hi_genie_credentials` for dev, `hi_genie_staging_credentials` for staging) are currently set to `PLACEHOLDER_*` stub values. GitHub OAuth login flows will fail until real values are supplied. | Create a GitHub OAuth App at https://github.com/settings/developers, set callback URL to `https://<app-url>/auth/github/callback`, then run: `databricks secrets put-secret dev_<your_user_handle>_hi_genie_credentials github_client_id --string-value <real-id> -p fevm-hls-fde` and same for `github_client_secret` (or use the staging scope for staging). |
