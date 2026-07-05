# Session Summary — 2026-07-03: Phase 5 GitHub Integration

## Starting point

At the start of this session, PR #32 ("Add GitHub OAuth secret provisioning check") was open on
branch `add-github-oauth-secret-provisioning` with two deploy.sh hardening commits. The GitHub App
credentials (OAuth + App ID/key/installation) had been provisioned into the
`dev_matthew_giglia_hi_genie_credentials` secret scope with real values, but **zero server code
existed** to use them. Phase 5 was marked "Not started" in the roadmap.

---

## Work completed this session

### Phase 5 GitHub Integration — shipped into PR #32

**Commit `8714b96`** — Initial Phase 5 implementation:
- `server/routes/github-oauth.ts` — `GET /auth/github/login` (OAuth redirect) + `GET /auth/github/callback` (code exchange, GitHub user fetch, `app.github_tokens` upsert)
- `server/routes/github-webhook.ts` — `POST /webhook/github` with `timingSafeEqual` HMAC signature verification; PR events (`opened/closed/merged/reopened`) upsert `app.pull_requests` via `repo_config.repos` JSON match; push events stubbed; unknown events acknowledged
- `server/migrations/007_github_tokens.ts` — creates `app.github_tokens` table; adds `branch_ref`, `base_branch`, `author_github_login` to `app.pull_requests`; adds `UNIQUE(project_id, pr_number)` for upsert safety
- `app.yaml` — wired `HI_GENIE_GITHUB_APP_ID`, `HI_GENIE_GITHUB_APP_PRIVATE_KEY`, `HI_GENIE_GITHUB_APP_INSTALLATION_ID`, `HI_GENIE_GITHUB_WEBHOOK_SECRET` as `valueFrom` secret scope entries
- `deploy.sh` — extended provisioning checks to cover all six GitHub secrets

**Commit `475232c`** — Cross-review fixes (blocking issues from `codex` review):
- `hi_genie.app.yml` — added 4 missing secret resource declarations (the `valueFrom` entries in `app.yaml` require matching resource blocks in the DABs resource YAML)
- Migration 007 — ILIKE pattern fix for constraint-drop; `github-webhook.ts` — `.toLowerCase()` on `opened_by`/`author_github_login`; `github-oauth.ts` — try/catch around DB upsert

**Commit `aefccf8`** — Rebuilt `build/index.js` with Phase 5 routes

**Commits `a515d1a`, `a899add`** — Fixed `package-lock.json` resolved URLs from Databricks npm proxy (which had a cache miss on `xtend@4.0.2`) to public `registry.npmjs.org`, unblocking the Apps container `npm install`

**Commit `3820c01`** — Migration 008 + REPLICA IDENTITY FULL:
- `migrations/001_initial_schema.ts` — retroactively added `ALTER TABLE <name> REPLICA IDENTITY FULL` after each of 13 `CREATE TABLE` statements (so fresh deployments are correct from day one)
- `migrations/007_github_tokens.ts` — added `ALTER TABLE app.github_tokens REPLICA IDENTITY FULL`
- `migrations/008_replica_identity.ts` (new) — sets `REPLICA IDENTITY FULL` on all 14 live `app.*` tables; drops the `CHECK (thread_id IS NOT NULL OR task_id IS NOT NULL)` constraint (which was blocking webhook-sourced PR rows) using ILIKE to handle Postgres's parenthesised constraint text
- `migrations/migrate.ts` — registered migration008; added CONVENTION comment requiring `ALTER TABLE ... REPLICA IDENTITY FULL` after every `CREATE TABLE`
- `github-webhook.ts` — removed non-existent `title` column from the INSERT (bug found during live DB inspection); params shifted from 10 to 9

### Deployment verification

- All 8 migrations applied successfully in sequence; `008_replica_identity` applied at `2026-07-03T08:02:34Z`
- All 14 `app.*` tables confirmed `REPLICA IDENTITY FULL` via `pg_class.relreplident = 'f'`
- Deploy succeeded: `hey-isaac-hi-genie-dev` ACTIVE at `https://hey-isaac-hi-genie-dev-7474657291520070.aws.databricksapps.com`
- GitHub webhook secret provisioned: `github_webhook_secret` set in secret scope matching the value configured in the GitHub App settings

### wal2delta / CDC wiring

- All 13 `app.*` tables had been evaluated as `SKIPPED` (reason: "Does not have REPLICA IDENTITY FULL") before migration 008 ran — stale cache
- Reset 13 rows to `PENDING` in `wal2delta.tables`
- `app.github_tokens` (OID 40999) was missing from wal2delta tracking entirely — wal2delta does not auto-discover; manually inserted as `PENDING`
- `app.repo_config` needed an additional reset pass (missed in first reset due to OID filter)
- All 14 `app.*` tables now `PENDING` in wal2delta — CDC pipeline will pick them up on next wal2delta cycle

### End-to-end GitHub webhook test

- Test repo: `mkgs-databricks-demos/genie_code_demo`
- Webhook URL configured: `https://hey-isaac-hi-genie-dev-7474657291520070.aws.databricksapps.com/webhook/github`
- Webhook secret: set in both GitHub App settings and Databricks secret scope
- Initial webhook delivery (PR opened) received HTTP 403 — Databricks Apps platform proxy requires auth by default
- Fix: granted `CAN_USE` to all workspace `users` group — HMAC verification is the security layer for the public webhook endpoint
- After permission grant: PR close/reopen events delivered, `/webhook/github` reached, HMAC verified, `app.pull_requests` row inserted
- Test PR #1 (`test/webhook-integration → main`) closed after test

---

## State at session end

| Resource | Status |
|----------|--------|
| PR #32 | Open, all commits pushed, ready to merge |
| Branch | `add-github-oauth-secret-provisioning` |
| App | ACTIVE, Phase 5 routes live |
| Migrations | 008 applied, all 14 tables REPLICA IDENTITY FULL |
| wal2delta | 14 app.* tables at PENDING (CDC pipeline active) |
| GitHub OAuth | `/auth/github/login` + `/callback` wired, `app.github_tokens` table live |
| GitHub Webhook | `/webhook/github` verified end-to-end against `genie_code_demo` |
| UC OTel tables | 4 tables exist (`hi_genie_otel_logs/traces/metrics/annotations`), no data yet — wal2delta cycle needed |

---

## Remaining known gaps (unchanged from pre-session)

| # | Gap |
|---|-----|
| S2 | `x-dcr-shared-secret` comparison uses `===` instead of `crypto.timingSafeEqual` |
| S3 | `GET /dcr/:client_id` is unauthenticated |
| D1/D2/D3 | Prod `run_as_user`, `user_handle`, `lakebase_database_id` empty-string handling |
| O1 | `deploy.sh` hardcoded 300s wait instead of poll loop |

## Next focus areas

1. **Merge PR #32** — all cross-reviews passed, tests green
2. **Phase 5 MCP tools** — `get_repo_config`, `get_my_checkout_spec`, `link_branch`, `link_pull_request` (agent-push linkage)
3. **S2/S3 security hardening** — quick wins before any external agent connects
4. **wal2delta cycle verification** — confirm CDC data flowing into UC OTel tables after next wal2delta run
