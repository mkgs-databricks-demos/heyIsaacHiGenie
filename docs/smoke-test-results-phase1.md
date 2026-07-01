# Phase 1 MCP Smoke Test Results

**Date:** 2026-06-29  
**App:** [Hey Isaac? Hi Genie! (dev)](https://hey-isaac-hi-genie-dev-7474657291520070.aws.databricksapps.com)  
**Lakebase:** `ep-floral-lake-d2m059vl.database.us-east-1.cloud.databricks.com` — project `dev-hi-genie`, branch `dev-matthew-giglia`  
**Tester:** matthew.giglia@databricks.com  

---

## Test Environment

### Seed Data
All fixtures inserted directly via psql before test run:

| Fixture | UUID | Notes |
|---------|------|-------|
| Project `smoke-test-project` | `11111111-1111-1111-1111-111111111111` | |
| Agent `genie` | `22222222-2222-2222-2222-222222222222` | granted to matthew |
| Agent `ungrantd` | `33333333-3333-3333-3333-333333333333` | no grant (S2 fixture) |
| Member | `matthew.giglia@databricks.com` | owner role |

### Schema Notes
- Tables live in the `public` schema (not `dev_matthew_giglia_hi_genie`); migrations use unqualified table names.
- `repo_config.repos` is JSONB array — seeded as `[{"url":"...","default_branch":"main"}]`.
- `agent_checkout_spec` is keyed by `agent_id` only (no `project_id` column in Track A DDL).
- `threads` has no `branch_ref` column — `link_branch` writes to `agent_checkout_spec.base_branch`.

### MCP Call Pattern
```bash
# Every MCP call requires both headers:
curl -X POST "${APP_URL}/mcp" \
  -H "Authorization: Bearer ${DB_TOKEN}" \
  -H "X-Persona-Token: ${PT}" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \   # ← required; omitting → 406
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{...}}'
# Response is SSE: extract with grep -oP 'data: \K.*'
```

---

## Results

| # | Test | Result | Evidence |
|---|------|--------|----------|
| **S1** | Unauthenticated request → 401 | ✅ PASS | `{"error":"Unauthorized"}` with no Authorization header |
| **S2** | Persona token for ungranted agent → 403 | ✅ PASS | `/token/persona` with `persona: "ungrantd"` returns 403 |
| **S3** | Persona token issued; JTI recorded in DB | ✅ PASS | Token returned; `SELECT * FROM persona_token_jti` confirms JTI row |
| **S4** | `get_project_context` returns project + membership | ✅ PASS | `{"project":{...},"members":[{"user_id":"matthew.giglia@databricks.com","role":"owner"}]}` |
| **S5** | `start_thread` → `send_message` → `get_messages` | ✅ PASS | Thread `bfb58cac-de67-4004-acec-4eddbeadef44`; message round-trip confirmed |
| **S6** | `mark_messages_read` + `unread_only` filter | ⚠️ STUB | `mark_messages_read` returns `{ok:true}` (no-op); `unread_only` not in schema |
| **S7** | `write_session_summary` → `get_session_summaries` | ✅ PASS | Summary `f951d8ee-...` written and retrieved with correct pagination cursor |
| **S8** | `link_branch` → `agent_checkout_spec.base_branch` updated | ✅ PASS | `base_branch: "feature/smoke-test-s8"` confirmed in DB |
| **S9** | `get_repo_config` returns seeded repo list | ✅ PASS | JSONB repos array returned with url + default_branch |
| **S10** | `get_my_checkout_spec` returns agent's branch spec | ✅ PASS | Returns agent_checkout_spec row set by S8 |

**Summary: 9 PASS · 1 STUB (S6) · 0 FAIL**

---

## S6 Backlog (non-blocking)

Track A DDL does not include a `read_at` column on `messages` or a `message_reads` table.
Two TODOs are noted in `server/mcp/tools.ts`:

1. **Add migration** — new file `002_message_reads.ts` adding either:
   - `ALTER TABLE messages ADD COLUMN read_at TIMESTAMPTZ` (simple), or
   - new `message_reads` table for per-user read tracking (correct for multi-agent)

2. **Implement `mark_messages_read`** — update `read_at` / insert into `message_reads`

3. **Add `unread_only` to `get_messages` schema** — currently silently ignored by zod

---

## Key Findings / Gotchas

| Finding | Impact |
|---------|--------|
| `Accept: application/json, text/event-stream` is required on every `/mcp` call | Breaking — omitting returns 406 |
| MCP responses are SSE (`event: message\ndata: {...}`) not plain JSON | Parsing: `grep -oP 'data: \K.*'` |
| `databricks auth token` key is `.access_token`, not `.token` | Auth scripts break silently |
| `lakebase` psql user must be URL-encoded: `email%40domain.com` | Connection string fails otherwise |
| All tables in `public` schema, not `dev_matthew_giglia_hi_genie` | Schema assumption would break all queries |
| `link_branch` writes `agent_checkout_spec`, not `threads.branch_ref` (no such column) | API semantics differ from what name implies |

---

## Active IDs (for follow-up)

```
Project:  11111111-1111-1111-1111-111111111111
Agent:    22222222-2222-2222-2222-222222222222  (genie)
Thread:   bfb58cac-de67-4004-acec-4eddbeadef44
Summary:  f951d8ee-e251-43fd-b3bb-18c3e9a94668
```

---

## Additional Findings (from full transcript, merged 2026-07-01)

### ⚠️ Rate limiter `trust proxy` warning (worth a follow-up fix)
App logs show repeated warnings during the smoke test run:
```
The 'X-Forwarded-For' header is set but the Express 'trust proxy' setting is
false (default). code: 'ERR_ERL_UNEXPECTED_X_FORWARDED_FOR'
```
Databricks Apps' ingress sets `X-Forwarded-For`; without `app.set('trust proxy', 1)`
(or equivalent), `express-rate-limit` cannot reliably identify the true client IP,
which weakens the per-IP rate limiting added for the CodeQL fix (PR #4). Not
blocking, but should be fixed in a small follow-up PR.

### Spec vs. implementation naming drift
The original Phase 1 tool spec (chat-authored) and the shipped implementation
diverged on parameter names. Table below is the authoritative "what the code
actually expects" reference until the spec doc is updated to match:

| Tool | Spec said | Code actually uses |
|------|-----------|---------------------|
| `/token/persona` body | `agent_nickname` | `persona` |
| `send_message` | `to_agent_id`, `body`, `subject` | `thread_id`, `content`, `to_nickname?` |
| `get_messages` | `unread_only` param | `thread_id`, `limit`, `cursor` (no unread filter — see S6 backlog) |
| `mark_messages_read` | `message_ids` array | `thread_id`, `up_to_message_id` (stub) |
| `write_session_summary` | `project_id`, `agent_id`, `summary`, `tags` | `thread_id`, `content`, `summary_type?` |
| `get_session_summaries` | `project_id` | `thread_id`, `limit`, `cursor` |
| `link_branch` | updates `threads.branch_ref` | updates `agent_checkout_spec.base_branch` |
| `get_project_context` | returns agents array | returns project + membership only |
| DCR endpoint | `/oauth/dcr/register` | `/register` |
| DCR auth | no bearer token needed | Databricks bearer token required |

### DCR shared secret encoding
`databricks secrets get-secret ... | jq -r .value` returns the secret **base64-encoded** —
decode before using it as the `X-DCR-Shared-Secret` header value.
