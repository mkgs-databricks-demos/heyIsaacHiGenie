# Phase 1 — Foundation: Detailed Implementation Plan

_Synthesised from two independent read-only code investigations (claude_code + codex)._
_Project root: /home/matthew.giglia/projects/hey-isaac-hi-genie_

---

## Context & Starting Point

Phase 0 (Auth Spike) is complete. The live app at
`https://hey-isaac-hi-genie-dev-7474657291520070.aws.databricksapps.com` has:
- A working MCP endpoint (`/mcp`) with `whoami` + `ping` tools
- A signed persona-JWT issuer (`/token/persona`) that trusts **caller-supplied** `persona`/`project_id` without DB validation
- An in-memory DCR registry (Map, lost on restart)
- AppKit `lakebase()` plugin **registered but never called** — no Lakebase queries anywhere
- Auth middleware that extracts human email correctly but does **not** validate project membership or persona authority against DB

**Phase 1 goal:** Replace every spike stub with durable, DB-backed behaviour, and add the
first cohort of production MCP tools. No new features beyond the list below.

---

## Scope Boundaries

| In scope | Out of scope |
|----------|-------------|
| Lakebase DDL for all 11 tables + `dcr_clients` + `persona_token_jti` | GitHub integration (Phase 5) |
| Migration tooling (run DDL idempotently in bootstrap job) | Agile board tools (`list_tasks`, `update_task`) |
| DB-backed DCR (`dcr_clients` table) | Frontend / React dashboard (Phase 4) |
| DB-backed persona-token issuance (persona allowlist + project membership) | Full token revocation / blacklist (Phase 2+) |
| `jti` persistence (write on issue, check on verify — no expiry pruning yet) | OTEL / observability wiring |
| Phase 1 MCP tools (12 tools — see §4) | External GitHub MCP |
| Fail-closed MCP middleware (reject requests with no valid persona token) | Staging/prod targets |

---

## Track A — Lakebase DDL

### A1. Design the full SQL schema

**File to create:** `hey-isaac-infra/src/sql/schema.sql`

`docs/03-data-model.md` documents 11 tables with column names and semantics but **no SQL types, constraints, indexes, or RLS policies**. All must be designed now.

#### Proposed DDL

```sql
-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- gen_random_uuid()

-- 1. projects
CREATE TABLE IF NOT EXISTS projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  requirements_doc TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. project_members
CREATE TABLE IF NOT EXISTS project_members (
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id     TEXT NOT NULL,  -- human email (OBO identity)
  role        TEXT NOT NULL CHECK (role IN ('owner','member')),
  PRIMARY KEY (project_id, user_id)
);

-- 3. agents
CREATE TABLE IF NOT EXISTS agents (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  nickname     TEXT NOT NULL,
  role         TEXT NOT NULL,
  domain       TEXT,
  model        TEXT,
  responsibilities TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (project_id, nickname)
);

-- 4. agent_grants  (which humans may drive which agent personas)
CREATE TABLE IF NOT EXISTS agent_grants (
  agent_id  UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  user_id   TEXT NOT NULL,   -- human email
  PRIMARY KEY (agent_id, user_id)
);

-- 5. tasks (declared before threads to resolve circular FK)
CREATE TABLE IF NOT EXISTS tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','done','blocked')),
  branch_ref  TEXT,
  assignee_nickname TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. threads
CREATE TABLE IF NOT EXISTS threads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  subject     TEXT NOT NULL,
  branch_ref  TEXT,
  task_id     UUID REFERENCES tasks(id) ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED,
  status      TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','resolved')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. messages
CREATE TABLE IF NOT EXISTS messages (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id        UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  parent_agent_id  UUID NOT NULL REFERENCES agents(id),
  sub_agent_label  TEXT,
  author_user_id   TEXT NOT NULL,   -- human email
  to_nickname      TEXT NOT NULL,   -- recipient agent nickname
  body             TEXT NOT NULL,
  read_at          TIMESTAMPTZ,     -- NULL = unread
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. session_summaries
CREATE TABLE IF NOT EXISTS session_summaries (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id       UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  parent_agent_id  UUID NOT NULL REFERENCES agents(id),
  sub_agent_label  TEXT,
  author_user_id   TEXT NOT NULL,
  summary          TEXT NOT NULL,
  blockers         TEXT,
  next_steps       TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. repo_config  (one row per project)
CREATE TABLE IF NOT EXISTS repo_config (
  project_id           UUID PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  repos                JSONB NOT NULL DEFAULT '[]',
  default_branch       TEXT NOT NULL DEFAULT 'main',
  clone_mode           TEXT NOT NULL DEFAULT 'full' CHECK (clone_mode IN ('full','sparse','partial')),
  partial_clone_filter TEXT,
  branch_name_template TEXT NOT NULL DEFAULT '{{nickname}}/{{task_id}}',
  pr_template          TEXT,
  github_identity_config JSONB NOT NULL DEFAULT '{}'
);

-- 10. agent_checkout_spec  (one row per agent)
CREATE TABLE IF NOT EXISTS agent_checkout_spec (
  agent_id             UUID PRIMARY KEY REFERENCES agents(id) ON DELETE CASCADE,
  clone_mode           TEXT NOT NULL DEFAULT 'full' CHECK (clone_mode IN ('full','sparse','partial')),
  sparse_paths         TEXT[] NOT NULL DEFAULT '{}',
  partial_clone_filter TEXT
);

-- 11. pull_requests
CREATE TABLE IF NOT EXISTS pull_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  thread_id       UUID REFERENCES threads(id) ON DELETE SET NULL,
  task_id         UUID REFERENCES tasks(id) ON DELETE SET NULL,
  branch_ref      TEXT NOT NULL,
  github_pr_number INTEGER,
  status          TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','merged','closed')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. dcr_clients  (replaces in-memory Map in routes/dcr.ts)
CREATE TABLE IF NOT EXISTS dcr_clients (
  client_id     TEXT PRIMARY KEY,
  client_name   TEXT NOT NULL,
  redirect_uris JSONB NOT NULL DEFAULT '[]',
  grant_types   JSONB NOT NULL DEFAULT '["authorization_code"]',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. persona_token_jti  (written on issue, checked on verify)
CREATE TABLE IF NOT EXISTS persona_token_jti (
  jti        TEXT PRIMARY KEY,
  human      TEXT NOT NULL,
  persona    TEXT NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Indexes:**
```sql
CREATE INDEX idx_project_members_user   ON project_members(user_id);
CREATE INDEX idx_agents_project         ON agents(project_id);
CREATE INDEX idx_agent_grants_user      ON agent_grants(user_id);
CREATE INDEX idx_threads_project        ON threads(project_id);
CREATE INDEX idx_messages_thread        ON messages(thread_id);
CREATE INDEX idx_messages_to_nickname   ON messages(thread_id, to_nickname);
CREATE INDEX idx_messages_unread        ON messages(thread_id, to_nickname) WHERE read_at IS NULL;
CREATE INDEX idx_session_summaries_proj ON session_summaries(project_id, created_at DESC);
CREATE INDEX idx_pull_requests_project  ON pull_requests(project_id);
CREATE INDEX idx_jti_expires            ON persona_token_jti(expires_at);
```

**RLS policies (OBO connection enforces these; SP pool bypasses):**
```sql
ALTER TABLE projects            ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members     ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents              ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_grants        ENABLE ROW LEVEL SECURITY;
ALTER TABLE threads             ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages            ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_summaries   ENABLE ROW LEVEL SECURITY;
ALTER TABLE repo_config         ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_checkout_spec ENABLE ROW LEVEL SECURITY;
ALTER TABLE pull_requests       ENABLE ROW LEVEL SECURITY;
-- dcr_clients and persona_token_jti: SP-only, no RLS needed

CREATE POLICY projects_member ON projects
  FOR ALL USING (id IN (
    SELECT project_id FROM project_members WHERE user_id = current_user));

CREATE POLICY pm_self ON project_members
  FOR ALL USING (user_id = current_user);

CREATE POLICY agents_visible ON agents
  FOR ALL USING (project_id IN (
    SELECT project_id FROM project_members WHERE user_id = current_user));

CREATE POLICY agent_grants_visible ON agent_grants
  FOR ALL USING (
    user_id = current_user OR
    agent_id IN (SELECT id FROM agents WHERE project_id IN (
      SELECT project_id FROM project_members WHERE user_id = current_user)));

CREATE POLICY threads_project ON threads
  FOR ALL USING (project_id IN (
    SELECT project_id FROM project_members WHERE user_id = current_user));

CREATE POLICY messages_project ON messages
  FOR ALL USING (thread_id IN (
    SELECT id FROM threads WHERE project_id IN (
      SELECT project_id FROM project_members WHERE user_id = current_user)));

CREATE POLICY session_summaries_project ON session_summaries
  FOR ALL USING (project_id IN (
    SELECT project_id FROM project_members WHERE user_id = current_user));

CREATE POLICY repo_config_project ON repo_config
  FOR ALL USING (project_id IN (
    SELECT project_id FROM project_members WHERE user_id = current_user));

CREATE POLICY agent_checkout_project ON agent_checkout_spec
  FOR ALL USING (agent_id IN (
    SELECT id FROM agents WHERE project_id IN (
      SELECT project_id FROM project_members WHERE user_id = current_user)));

CREATE POLICY pull_requests_project ON pull_requests
  FOR ALL USING (project_id IN (
    SELECT project_id FROM project_members WHERE user_id = current_user));
```

**Key design decisions (underspecification resolved):**
- `id` fields: UUID with `gen_random_uuid()` default (not SERIAL — avoids sequential guessing)
- `tasks` declared before `threads` to allow the circular FK with `DEFERRABLE INITIALLY DEFERRED`
- `repo_config.repos`: JSONB (array of repo objects — flexible, not TEXT[])
- `agent_checkout_spec.sparse_paths`: `TEXT[]`
- `blockers`/`next_steps`: `TEXT` (not JSONB; human-readable prose)
- `dcr_clients` (table 12): not in data-model doc but explicitly called for in `routes/dcr.ts:12`
- `persona_token_jti` (table 13): not documented but required to close the `jti` gap in auth middleware

---

### A2. Bootstrap job runs DDL

**File to modify:** `hey-isaac-infra/src/notebooks/platform_bootstrap.py`

Currently writes `workspace_url` to secret scope only. No DDL is executed.

Add a DDL step after secret-scope setup:
1. Read the Lakebase endpoint from `LAKEBASE_ENDPOINT` (already wired in `app.yaml`)
2. Connect using psycopg2 with the service-principal token
3. Execute `schema.sql` content idempotently (all statements use `IF NOT EXISTS`; `CREATE POLICY` wrapped in `DO $$ BEGIN IF NOT EXISTS ... END $$`)
4. Emit structured log line per table: `✓ table <name> ready`

**Acceptance criterion:** Run bootstrap → 13 tables exist. Re-run → no error (fully idempotent).

---

### A3. Dev seed data

**File to create:** `hey-isaac-infra/src/sql/seed_dev.sql`

Seed one project + two agents (Isaac, Genie) + project membership for `matthew.giglia@databricks.com` + two agent_grants + one repo_config row so the live app has real rows immediately after DDL.

This file runs only in dev (guarded by a `-- dev-only` comment and a Python check in bootstrap).

**Acceptance criterion:** After bootstrap+seed, `POST /mcp` `get_project_context` returns real project/agent data.

---

## Track B — Server Scaffold (hey-isaac-ai)

### B1. DB-backed DCR (`dcr_clients` table)

**File to modify:** `hey-isaac-ai/server/routes/dcr.ts`

Replace the `Map` at line 14 with Lakebase calls:
- `POST /register` → `INSERT INTO dcr_clients ...` via `AppKit.lakebase.query()` (SP pool — client registration is not user-scoped)
- `GET /register/:client_id` → `SELECT FROM dcr_clients WHERE client_id = $1`

No RLS needed here; both operations run under SP pool.

**Acceptance criterion:** Register client → restart app → GET returns client.

---

### B2. `jti` persistence on persona-token issue + verify

**Files to modify:**
- `hey-isaac-ai/server/routes/persona-token.ts` — after signing JWT, `INSERT INTO persona_token_jti (jti, human, persona, project_id, expires_at)` via SP pool
- `hey-isaac-ai/server/middleware/auth.ts` — after verifying JWT signature, `SELECT 1 FROM persona_token_jti WHERE jti=$1 AND expires_at > now()`. If no row → 401. Add opportunistic pruning: `DELETE FROM persona_token_jti WHERE expires_at < now() LIMIT 100` (fire-and-forget, no await needed in Phase 1).

Use `AppKit.lakebase.query()` (SP pool) for both — jti is infra-level.

**Acceptance criterion:** Issue token → DB has jti row → token verifies. Expired row → verify returns 401.

---

### B3. DB-backed persona authority in `/token/persona`

**File to modify:** `hey-isaac-ai/server/routes/persona-token.ts`

Current lines 15 and 51/64: trusts any non-empty `persona` + `project_id` from body after only shape-validation. Phase 1 must enforce DB-backed authority.

New flow (after shape validation):
1. `human` comes from `req.ctx.human` (auth middleware, not from body)
2. `SELECT id FROM agents WHERE project_id = $1 AND nickname = $2` — if no row → 404
3. `SELECT 1 FROM agent_grants WHERE agent_id = $1 AND user_id = $2` — if no row → 403
4. Sign JWT with `agent.id` in sub + existing claims
5. INSERT jti (B2)

**Acceptance criterion:** Ungranted user → 403. Granted user → valid JWT. Bad project_id → 404.

---

### B4. Fail-closed MCP middleware

**File to modify:** `hey-isaac-ai/server/middleware/auth.ts`

Export a `requirePersona` middleware:
```typescript
export function requirePersona(req: Request, res: Response, next: NextFunction) {
  if (!req.ctx?.persona || !req.ctx?.project_id) {
    return res.status(401).json({ error: 'valid X-Persona-Token required' });
  }
  next();
}
```

**File to modify:** `hey-isaac-ai/server/server.ts` (or `routes/mcp.ts`) — apply `requirePersona` before the MCP router. Do NOT apply to `/health`, `/api/me`, `/token/persona`, `/register`, `/.well-known`.

**Acceptance criterion:** `POST /mcp` without `X-Persona-Token` → 401. With valid token → proceeds.

---

### B5. Phase 1 MCP tools (12 tools)

**File to modify:** `hey-isaac-ai/server/routes/mcp.ts`

All tools:
- Resolve calling agent/project from `req.ctx.persona` + `req.ctx.project_id` (from verified JWT) — **never from request body**
- Use `AppKit.lakebase.asUser(req)` for SELECT queries (RLS enforced)
- Use `AppKit.lakebase.query()` for INSERT/UPDATE writes (SP pool — writes are not user-filtered, but the persona's project_id is validated before every write)

| # | Tool | Direction | DB call | Notes |
|---|------|-----------|---------|-------|
| 1 | `get_project_context` | read | SELECT projects + agents WHERE project_id | asUser |
| 2 | `get_agent_roster` | read | SELECT agents WHERE project_id | asUser |
| 3 | `start_thread` | write | INSERT threads | SP; subject required, branch_ref/task_id optional |
| 4 | `send_message` | write | validate to_nickname in agents; INSERT messages | SP; thread_id required in Phase 1 |
| 5 | `get_messages` | read | SELECT messages WHERE to_nickname=persona | asUser; filter by thread_id and/or unread_only |
| 6 | `mark_messages_read` | write | UPDATE messages SET read_at=now() WHERE id = ANY($1) | SP |
| 7 | `write_session_summary` | write | INSERT session_summaries | SP; sub_agent_label optional |
| 8 | `get_session_summaries` | read | SELECT session_summaries WHERE project_id | asUser; filter by persona/date optional |
| 9 | `get_repo_config` | read | SELECT repo_config WHERE project_id | asUser |
| 10 | `get_my_checkout_spec` | read | SELECT agent_checkout_spec WHERE agent_id=calling agent | asUser |
| 11 | `link_branch` | write | UPDATE threads SET branch_ref=$1; optionally UPDATE tasks | SP; thread_id or task_id required |
| 12 | `link_pull_request` | write | INSERT pull_requests; UPDATE thread/task | SP; branch_ref + github_pr_number |

Keep `whoami` and `ping` as-is.

---

### B6. TypeScript types for DB rows

**File to create:** `hey-isaac-ai/server/db/types.ts`

Exported TypeScript interfaces for all 13 tables, used for generic type params on `lakebase.query<T>()` calls. No runtime validation library in Phase 1.

---

### B7. Remove spike artifacts

- `server/routes/mcp.ts` — move hardcoded `{ name: 'hi-genie', version: '0.1.0' }` to a `SERVER_INFO` const at top of file
- `server/server.ts` — retitle the debug endpoint comment from "Identity debug — useful during spike" to "// Dev diagnostic"
- `server/routes/persona-token.ts` — remove the caller-body trust path (replaced by B3)

---

## Dependency & Sequencing

```
A1 (write schema.sql) → A2 (bootstrap runs DDL) → A3 (seed)
                                                        ↓
B6 (TS types) ──────────────────────────────────────────┤
                                                        ↓
B1 (DCR→DB) ──── can start after A1                    ↓
B2 (jti→DB) ──── can start after A1                    ↓
B3 (persona authority) ── after A2+A3 (needs rows)     ↓
B4 (fail-closed MCP) ─── independent                   ↓
B5 (12 MCP tools) ─────── after A2+A3+B4 (needs tables + persona enforcement)
B7 (cleanup) ───────────── last
```

**Minimum viable order for a single implementer:**
1. A1 → A2 → A3 (infra foundation, deploy infra bundle first)
2. B6 (types, unblocks everything else)
3. B1 + B2 (parallel, infra-level DB work)
4. B3 + B4 (auth hardening)
5. B5 (bulk MCP work)
6. B7 (cleanup)
7. Deploy app bundle; run smoke tests

**Two PRs:** one for `hey-isaac-infra`, one for `hey-isaac-ai`. Infra PR merges and deploys first.

---

## Phase 1 Acceptance Smoke Tests

| # | Command | Expected |
|---|---------|----------|
| S1 | `POST /mcp` (no X-Persona-Token) | HTTP 401 |
| S2 | `POST /token/persona` with ungranted persona | HTTP 403 |
| S3 | `POST /token/persona` with granted persona → JWT, restart app, re-verify | JWT still valid (jti in DB) |
| S4 | `POST /mcp` `get_project_context` with valid persona | Seeded project + agents returned |
| S5 | `send_message` → `get_messages(unread_only=true)` | Message appears unread |
| S6 | `mark_messages_read` → `get_messages(unread_only=true)` | Message no longer in list |
| S7 | `write_session_summary` → `get_session_summaries` | Summary returned |
| S8 | `link_branch(branch_ref="feat/test")` → `get_project_context` | Thread.branch_ref updated |
| S9 | Register DCR client → restart app → `GET /register/:id` | Client still exists |
| S10 | `get_repo_config` + `get_my_checkout_spec` | Seeded config/spec returned |

---

## Open Design Questions (resolve before implementation)

1. **`send_message` without thread_id**: require thread_id (Phase 1) or auto-create? **Recommendation: require thread_id. Auto-create is Phase 3.**
2. **`link_branch` / `link_pull_request` authorship**: any project-member persona, or only owning agent? **Recommendation: any project-member persona (enables cross-agent coordination).**
3. **`jti` pruning cadence**: opportunistic on SELECT (add DELETE LIMIT 100 fire-and-forget) or scheduled job? **Recommendation: opportunistic in Phase 1; scheduled job in Phase 2.**
4. **Dev seed idempotency**: `seed_dev.sql` uses `INSERT ... ON CONFLICT DO NOTHING` to be safe on re-runs.
5. **Circular FK Lakebase compatibility**: `DEFERRABLE INITIALLY DEFERRED` is standard Postgres. Lakebase runs Postgres — confirm version ≥ 12 (low risk; supported since PG 9.0).

---

## Files Changed (full list)

### hey-isaac-infra bundle
| File | Change |
|------|--------|
| `src/sql/schema.sql` | **NEW** — DDL for 13 tables, indexes, RLS policies |
| `src/sql/seed_dev.sql` | **NEW** — dev seed: 1 project, 2 agents, 1 member, 2 grants, repo_config |
| `src/notebooks/platform_bootstrap.py` | **MODIFY** — add DDL execution step |

### hey-isaac-ai bundle
| File | Change |
|------|--------|
| `server/db/types.ts` | **NEW** — TypeScript interfaces for all 13 tables |
| `server/routes/dcr.ts` | **MODIFY** — replace Map with lakebase.query() |
| `server/routes/persona-token.ts` | **MODIFY** — DB-backed authority check + jti INSERT |
| `server/middleware/auth.ts` | **MODIFY** — jti SELECT check + export requirePersona |
| `server/routes/mcp.ts` | **MODIFY** — 12 new tools + requirePersona |
| `server/server.ts` | **MINOR** — cleanup spike comments |

**Total: 3 new files + 5 modified files across 2 bundles. Two PRs.**
