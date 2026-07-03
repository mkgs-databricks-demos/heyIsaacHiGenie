# Session Summary — Auth / Security Hardening

**PR:** https://github.com/mkgs-databricks-demos/heyIsaacHiGenie/pull/2
**Branch:** `polly/auth-security-hardening`
**Implementer:** `codex`
**Reviewer:** `claude_code` (independent cross-vendor review)
**Final verdict:** ✅ PASS

---

## Goal

Harden the persona JWT issuance and validation paths, add the DCR
shared-secret guard, gate dev-only console logging, and wire all new env vars
into the app deployment configuration.

---

## Changes Made

### `hey-isaac-ai/server/routes/persona-token.ts`
- Issuer (`iss`) now read from `process.env.HI_GENIE_PERSONA_ISSUER`; returns
  503 if the env var is not set (rather than using a request-header-derived
  value)
- `aud` claim added, populated from `process.env.HI_GENIE_PERSONA_AUDIENCE`
  (default `'mcp'`)
- `jti` claim added via `crypto.randomUUID()`
- `console.log` of issued token gated on `NODE_ENV === 'development'`

### `hey-isaac-ai/server/middleware/auth.ts`
- Issuer verification now reads from `process.env.HI_GENIE_PERSONA_ISSUER`
  (not from the incoming request's token header)
- Audience (`aud`) verification added
- `jti` validation checks both type (`typeof jti !== 'string'`) and
  non-empty (`jti.length === 0`) — both conditions required

### `hey-isaac-ai/server/routes/dcr.ts`
- Shared-secret guard added at the top of `POST /register`: reads
  `x-dcr-shared-secret` header, compares against
  `process.env.HI_GENIE_DCR_SHARED_SECRET`; returns 401 if missing or
  mismatched
- `console.log` of `client_id` gated on `NODE_ENV === 'development'`

### `hey-isaac-ai/.env.example`
- `DATABRICKS_HOST` placeholder changed from real workspace URL
  (`https://fevm-hls-fde.cloud.databricks.com`) to
  `https://your-workspace.cloud.databricks.com`
- Added entries for `HI_GENIE_PERSONA_ISSUER`, `HI_GENIE_PERSONA_AUDIENCE`,
  `HI_GENIE_DCR_SHARED_SECRET`

### `hey-isaac-ai/app.yaml`
- Added `env_variables` entries for all three new env vars:
  - `HI_GENIE_PERSONA_AUDIENCE: mcp`
  - `HI_GENIE_PERSONA_ISSUER: ""` (operator must set post-deploy; empty string
    is the correct fail-safe — the token route returns 503 if unset)
  - `HI_GENIE_DCR_SHARED_SECRET` wired via secret scope reference

### `hey-isaac-ai/resources/hi_genie.app.yml`
- Added `dcr-shared-secret` app resource binding against the secret scope

### `hey-isaac-ai/src/notebooks/post_deploy_validation.py`
- DCR POST assertion updated to accept `401` in addition to `400` and `201`,
  since an unauthenticated DCR POST now correctly returns 401

---

## Cross-Review Cycle

### Pass 1 — Blocking and non-blocking issues found by `claude_code`

| # | Severity | Issue | Fix |
|---|----------|-------|-----|
| B1 | **Blocking** | `.env.example` contained real workspace URL `https://fevm-hls-fde.cloud.databricks.com` | Replaced with `https://your-workspace.cloud.databricks.com` |
| NB1 | Non-blocking | `jti` check only verified type, not non-empty string | Added `\|\| jti.length === 0` guard |
| NB3 | Non-blocking | New env vars not wired into `app.yaml`/`hi_genie.app.yml` — feature dead on deploy | Added all three vars including secret-scope reference for DCR secret |
| NB4 | Non-blocking | `post_deploy_validation.py` DCR assertion broke: DCR now returns 401 but assertion only accepted 400/201 | Added 401 to accepted status codes |

### Pass 2 — PASS

`claude_code` confirmed all issues resolved. No new hard-coded credentials or
URLs introduced. PR marked ready-to-merge.

---

## Key Design Decisions

- **`HI_GENIE_PERSONA_ISSUER` ships as `""`** — deliberate fail-safe. The app
  URL is not known until after the first deploy, so the env var cannot be
  pre-populated. The token route returns 503 until the operator sets it.
  Operator action required post-deploy (see Known Gap S1 in PROJECT_MEMORY.md).
- **`===` for DCR shared secret** — simple equality for the spike. Phase 2
  should use `crypto.timingSafeEqual` to eliminate timing side-channels
  (Known Gap S2).
- **`GET /dcr/:client_id` unauthenticated** — intentional for the spike
  (internal-use route). Should be guarded in Phase 2 (Known Gap S3).
- **TypeScript typecheck failures** — both PRs' TS typechecks fail due to
  pre-existing repo issues (`@types/express` missing, `allowImportingTsExtensions`).
  These are not introduced by either PR.
