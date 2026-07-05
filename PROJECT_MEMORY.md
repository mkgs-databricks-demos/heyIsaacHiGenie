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
    │       ├── persona-token.ts    # HMAC JWT persona token issuer
    │       ├── github-oauth.ts     # GET /auth/github/login + /callback (write lane)
    │       └── github-webhook.ts   # POST /webhook/github (read/observe lane)
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

## Current Status: Phase 5 GitHub Integration Live — CDC Pipeline Active

### What is done (as of 2026-07-03)
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
- **Row-Level Security is live in production** (PR #24) — all 11 project-scoped tables have
  `USING`/`WITH CHECK` policies keyed on `current_user`; DB-level defense-in-depth alongside
  app-layer checks. Human Postgres roles are provisioned **lazily** on first `/token/persona`
  call per human per Lakebase branch — see "Lazy Per-Human Postgres Roles" below.
- **`mark_messages_read` / `unread_only` fully implemented** (PR #23, migration `003`) — the
  Track A stub (S6) is closed; `read_at` column + index now back the real filter.
- **Databricks CLI hard-pinned to >= 1.5.0** (PR #25/#26) — both bundles declare
  `bundle.databricks_cli_version` and `deploy.sh` fails loudly on an older CLI before any
  other command runs. See "Required Tooling" below.
- **Rate-limit key fixed to `X-Real-Ip`** (PR #22) — replaces the earlier, wrong,
  hop-count-based `trust proxy` setting. See "Databricks Apps Ingress Topology" below.
- **App-layer domain tables moved from `public` → `app` Postgres schema** (PR #27, merged
  `21c710a`) — matches the sibling `lakeLoom` project's convention. `_migrations` stays in
  `public`. See "Postgres Schema: `app` vs `public`" below.
- **Phase 5 GitHub integration shipped** (PR #32, branch `add-github-oauth-secret-provisioning`):
  - `GET /auth/github/login` + `GET /auth/github/callback` — OAuth flow, stores token in `app.github_tokens`
  - `POST /webhook/github` — HMAC-verified (timingSafeEqual) webhook consumer; PR events upsert `app.pull_requests`
  - Migration 007: `app.github_tokens` table; adds `branch_ref`, `base_branch`, `author_github_login` to `pull_requests`; UNIQUE(project_id, pr_number)
  - Migration 008: sets `REPLICA IDENTITY FULL` on all 14 `app.*` tables; drops obsolete thread_id/task_id NOT NULL check constraint
  - All future migrations must follow the CONVENTION: `ALTER TABLE <name> REPLICA IDENTITY FULL` immediately after every `CREATE TABLE`
  - `app.yaml` + `hi_genie.app.yml` wired for all 6 GitHub secrets from secret scope
  - `deploy.sh` checks/provisions all 6 GitHub secrets; Databricks Apps `users` group granted `CAN_USE` for webhook accessibility
  - `package-lock.json` resolved URLs patched to public npm registry (Databricks proxy had cache miss on `xtend@4.0.2`)
  - Verified end-to-end against `mkgs-databricks-demos/genie_code_demo` — webhook delivered, HMAC verified, PR row inserted
- **wal2delta CDC pipeline active** — all 14 `app.*` tables at PENDING status; 4 UC OTel Delta
  tables exist (`hls_fde_dev.dev_matthew_giglia_hi_genie.hi_genie_otel_{logs,traces,metrics,annotations}`)
  — data will flow on next wal2delta cycle

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
| `github_client_id` | GitHub OAuth App client ID (write lane) |
| `github_client_secret` | GitHub OAuth App client secret (write lane) |
| `github_app_id` | GitHub App ID (read/observe lane) |
| `github_app_private_key` | GitHub App RSA private key PEM (read/observe lane) |
| `github_installation_id` | GitHub App installation ID for the target org/repo |
| `github_webhook_secret` | Webhook HMAC secret used to verify `X-Hub-Signature-256` |

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
| 0 — Auth spike | ✅ **Done** | OBO + DCR + persona token round-trip proven live (S1–S3 smoke tests pass); S4 (external OAuth client) architecturally deferred — ~~Apps proxy blocks M2M tokens~~ **CORRECTION (2026-07-03): Databricks Apps DO support SP M2M OAuth tokens via client_credentials grant** (docs: "Connect to an API Databricks app using token authentication", updated 2026-04-06). SP must have CAN_USE on the app; use `WorkspaceClient(client_id, client_secret).config.authenticate()` to get the Bearer token. **LIVE VERIFIED (2026-07-03):** SP `500b37b6-8104-4eb6-8f0a-1e9d55cc780d` (lakeloom_credentials non-Xcode creds) successfully called `/webhook/github` with a `client_credentials` M2M token — 200 with valid HMAC, 400 with bad HMAC. No `/api/` prefix required. |
| 1 — Foundation | ✅ **Done** | 13-table Lakebase DDL (PR #16), idempotent TS migration runner (PR #18/#19), DB-backed DCR/JTI/persona authority + 12 MCP tools (PR #17), React frontend w/ Databricks retro branding (PR #21) |
| 2 — Auth productionize | 🟡 **Partial** | DCR persistence ✅ done (DB-backed, PR #17). RLS defense-in-depth ✅ done (PR #24, lazy per-human Postgres roles). Rate-limit key hardened to `X-Real-Ip` ✅ done (PR #22). GitHub OAuth creds ✅ done (O2, PR #32). Open: token rotation, timing-safe DCR secret compare (S2), unauthenticated `GET /dcr/:id` (S3). |
| 3 — MCP server | ✅ **Done** | All 12 tools shipped and smoke-tested (9/10 pass at the time, `docs/smoke-test-results-phase1.md`). `mark_messages_read` / `unread_only` (S6) closed in PR #23 — the one remaining gap from that test run is now fixed |
| 4 — Frontend | ✅ **Done** | Retro Databricks-branded React SPA — project/agent roster, chat UI, Tailwind + AppKit UI theme (PR #21) |
| 5 — GitHub integration | ✅ **Done** | OAuth flow (/auth/github/*) + webhook consumer (/webhook/github) + migration 007+008 + deploy.sh GitHub App secret provisioning — shipped in PR #32. Verified end-to-end against genie_code_demo. Phase 5b (governance MCP tools: get_repo_config, link_branch, link_pull_request) is next. |
| 6 — Integration test | 🟡 **Mostly done** | Tests 1–3 pass live against dev. Test 4 (external OAuth client, no DCR) can now be implemented — ~~Apps proxy rejects M2M tokens~~ **CORRECTION (2026-07-03): SP M2M OAuth tokens ARE accepted by the Databricks Apps gateway**. Use SP `client_id`/`client_secret` with `WorkspaceClient.config.authenticate()`. |
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

### Databricks Apps Ingress Topology (PR #22)
`express-rate-limit` needs the real client IP, but Express's `trust proxy` is a fixed
hop-count setting — fragile and, empirically, **wrong for this platform**. A live deploy
test (spoofed `X-Forwarded-For` at various depths) found the real chain is **3 hops** for
classic Databricks Apps (PoPP → DP APIProxy → oauth2-proxy sidecar) — matching Databricks'
internal architecture docs exactly — and would be **4 hops** for Spaces-based apps. Any
fixed number is fragile to app-type/topology changes, and Databricks' own public docs don't
document `X-Forwarded-For` for this purpose at all.
**Fix**: don't use `trust proxy` for rate-limiting at all. Point the rate limiter's
`keyGenerator` directly at the `X-Real-Ip` header — this is the header Databricks' gateway
itself sets and cannot be spoofed by a client (any client-forged `X-Real-Ip` is silently
overwritten by the platform gateway, verified live). Applied across all three rate-limited
routes (`mcp.ts`, `dcr.ts`, `persona-token.ts`) via a shared helper.

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

### DCR Registry — DB-backed (PR #17)
~~`server/routes/dcr.ts` uses an in-memory `Map`~~ — **stale, fixed in Phase 1 Track B.**
Registered clients now persist in the `dcr_clients` table (SP pool only, no RLS — admin/service
table). Survives app restarts. Remaining known gaps: S2 (timing-safe secret compare) and S3
(unauthenticated `GET /dcr/:client_id`) — see Known Gaps below.

### AppKit `lakebase().asUser(req)`
Used for OBO per-user Postgres queries. **Enforces Row-Level Security as of PR #24** — every
project-scoped table has `USING`/`WITH CHECK` policies keyed on `current_user`. Requires
`user_api_scopes: [postgres]` in `hi_genie.app.yml` — already set. Service-principal pool
(`AppKit.lakebase.query()`) used for DDL, admin operations, and any table without RLS
(`dcr_clients`, `persona_token_jti`).

### Lazy Per-Human Postgres Roles (PR #24)
RLS `current_user`-based policies require a real Postgres role per human, but `asUser(req)`
alone doesn't create one. `server/db/ensureHumanRole.ts` is called from `/token/persona`
**before** the JWT is signed:
1. Fast path: `has_schema_privilege(roleName, 'app', 'USAGE')` — if true, grants are already
   applied, return immediately (self-healing: if this ever comes back false for an
   *existing* role — e.g. a prior partial-provisioning failure — grants are re-applied, not
   skipped).
2. If the role doesn't exist yet: `CREATE ROLE "<lowercased-email>"`, then grant `USAGE` +
   full CRUD + `ALTER DEFAULT PRIVILEGES` on the RLS-protected schema.
3. Any failure here **fails the whole `/token/persona` call with 503** — no token is ever
   issued that would later break on `asUser()` inside an MCP tool call.
Role name = lowercased human email. Byte-length guarded against Postgres's 63-byte
`NAMEDATALEN` limit (hard error, never truncates — truncation could collide two different
humans onto the same role). Effectively "per human per Lakebase branch" since each
target (dev/staging/prod) is a different Postgres instance with its own role namespace —
falls out of the design for free, no explicit per-branch logic needed.
**User-facing latency**: near-zero after the first call ever made against a given branch;
one extra indexed catalog lookup per token issuance forever after.

### Postgres Schema: `app` vs `public` (PR #27 — merged `21c710a`)
All 13 domain tables (`projects`, `messages`, `dcr_clients`, etc.) are moving from `public`
to a dedicated `app` schema, matching the `lakeLoom` project's precedent. **`_migrations`
deliberately stays in `public`** — moving the migration-tracking table itself would create a
bookkeeping hazard (the runner would look for `app._migrations`, find nothing, and try to
re-apply 001–004 whose `CREATE TABLE`s would then collide with the already-moved tables).
Rationale for the move: explicit grants instead of relying on Postgres's implicit
`USAGE`-on-`public`-to-`PUBLIC`-role default, namespace isolation from Lakebase/`appkit`
platform objects, and a clean `DROP SCHEMA app CASCADE` reset path for dev. RLS policies,
indexes, and FKs survive `ALTER TABLE ... SET SCHEMA` automatically — no policy
recreation needed (migration `005_app_schema.ts` does not touch `CREATE POLICY`).
The `hi_genie_has_project_access` `SECURITY DEFINER` RLS helper function also needed its
own `ALTER FUNCTION ... SET search_path = app, public` — it pins its own search_path and
would otherwise silently find zero rows in `project_members` after the table move, breaking
every RLS check with no error (caught before merge via live deploy testing, not code review).

**⚠️ Load-bearing workaround — do not remove `server/db/searchPath.ts`:** the app's pool
config sets `pool: { options: '-c search_path=app,public' }`, but `@databricks/lakebase`'s
`pool-config.js` explicitly enumerates which fields it reads from `userConfig`
(`endpoint, host, database, port, sslMode, ssl, max, idleTimeoutMillis,
connectionTimeoutMillis`) and **silently drops `options` entirely** — confirmed by reading
the library source, not assumed. AppKit's Lakebase plugin also exposes no `pool.on('connect')`
hook (the real `pg.Pool` instances are private fields on its `RoutingPool` wrapper), so there
is no supported extension point. `searchPath.ts` monkeypatches the global `pg.Pool` export
(safe: `pg` is a CJS singleton, patched once via a module-level idempotency guard) with a
subclass that passes `onConnect` in the `pg-pool` config — an async hook `pg-pool` *awaits
before ever handing the client to a caller*; if the `SET search_path` query fails, `pg-pool`
discards the client and fails the acquisition, rather than silently handing back a client
with the wrong search_path. This is installed once, at the very top of `server.ts`, before
`createApp()` — every pool `@databricks/lakebase` constructs afterward (SP pool eagerly,
each per-human OBO pool lazily) inherits the patched constructor. **This was found by a live
dev deploy that crashed the whole app process on the first real request
(`relation "project_members" does not exist`) — static code review of the same change had
passed cleanly.** Deploy-before-merge caught what review alone did not.

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
| ~~S4~~ | ~~DCR persistence~~ | **Closed (PR #17).** Client registry moved to a Lakebase `dcr_clients` table (SP pool, no RLS). This row was left stale in an earlier revision of this doc despite the Roadmap table already reflecting the fix — corrected here. | — |
| S4b | External M2M auth | **CORRECTION (2026-07-03): Databricks Apps DO accept SP M2M OAuth tokens.** Prior note claiming "Apps proxy blocks M2M tokens" was an untested speculation. Documented in Databricks docs "Connect to an API Databricks app using token authentication" (updated 2026-04-06). SP must have `CAN_USE` on the app. Token pattern: `WorkspaceClient(host, client_id=..., client_secret=...).config.authenticate()` → `{"Authorization": "Bearer <token>"}`. This unblocks Redpanda Connect, Lambda/edge relays, and any server-to-server caller using SP credentials. | Verify with a live curl test (see `.polly/specs/m2m-curl-test.md`). |
| S5 | RLS defense-in-depth | **Closed (PR #24).** All 11 project-scoped tables now have DB-level `USING`/`WITH CHECK` RLS policies, backed by lazy per-human Postgres role provisioning. Previously app-layer WHERE clauses were the *only* backstop. | — |
| S6 | `mark_messages_read` stub | **Closed (PR #23).** `read_at` column + index added (migration `003`); `unread_only` now filters for real. | — |

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
| O2 | GitHub credentials | **Resolved (PR #32).** Real OAuth + GitHub App credentials provisioned; `/auth/github/*` (OAuth flow) and `/webhook/github` (webhook consumer) implemented. `deploy.sh` now checks/provisions all six GitHub secrets: `github_client_id`, `github_client_secret`, `github_app_id`, `github_app_private_key`, `github_installation_id`, `github_webhook_secret`. | — |
