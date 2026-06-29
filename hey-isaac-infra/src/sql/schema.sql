-- REFERENCE DOCUMENT: This file describes the current intended schema state.
-- It is NOT executed directly. Schema is applied via TypeScript migrations:
--   hey-isaac-ai/server/migrations/001_initial_schema.ts  (base schema)
--   hey-isaac-ai/server/migrations/002_phase1_trackb.ts   (Phase 1 Track B additions)
-- To make a schema change, add a new numbered migration file.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. projects
CREATE TABLE IF NOT EXISTS projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. project_members
-- email case normalization enforced by CHECK
CREATE TABLE IF NOT EXISTS project_members (
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id     TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'member',
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (project_id, user_id),
  CHECK (role IN ('owner', 'member')),
  CHECK (user_id = lower(user_id))
);

-- 3. agents
CREATE TABLE IF NOT EXISTS agents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  nickname    TEXT NOT NULL,
  description TEXT,
  created_by  TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (project_id, nickname),
  CHECK (nickname ~ '^[a-z][a-z0-9_-]{1,31}$'),
  CHECK (created_by = lower(created_by))
);

-- 4. agent_grants
-- email case normalization enforced by CHECK
CREATE TABLE IF NOT EXISTS agent_grants (
  agent_id    UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  user_id     TEXT NOT NULL,
  granted_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  granted_by  TEXT NOT NULL,
  PRIMARY KEY (agent_id, user_id),
  CHECK (user_id = lower(user_id)),
  CHECK (granted_by = lower(granted_by))
);

-- 5. tasks
-- assignee_agent_id is UUID FK → agents(id)
CREATE TABLE IF NOT EXISTS tasks (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id        UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  description       TEXT,
  status            TEXT NOT NULL DEFAULT 'open',
  assignee_agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  created_by        TEXT NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (status IN ('open', 'in_progress', 'blocked', 'done', 'cancelled')),
  CHECK (created_by = lower(created_by))
);

-- 6. threads
-- task_id FK is DEFERRABLE INITIALLY DEFERRED
CREATE TABLE IF NOT EXISTS threads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id     UUID REFERENCES tasks(id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title       TEXT,
  created_by  TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (created_by = lower(created_by))
);

-- 7. messages
-- to_agent_id is UUID FK → agents(id)
-- XOR CHECK: exactly one of author_user_id or parent_agent_id must be set
CREATE TABLE IF NOT EXISTS messages (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id        UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  author_user_id   TEXT,
  parent_agent_id  UUID REFERENCES agents(id) ON DELETE SET NULL,
  to_agent_id      UUID REFERENCES agents(id) ON DELETE SET NULL,
  content          TEXT NOT NULL,
  role             TEXT NOT NULL DEFAULT 'user',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK ((author_user_id IS NULL) <> (parent_agent_id IS NULL)),
  CHECK (role IN ('user', 'assistant', 'system', 'tool')),
  CHECK (author_user_id IS NULL OR author_user_id = lower(author_user_id))
);

-- 8. session_summaries
-- Same authorship XOR CHECK as messages
CREATE TABLE IF NOT EXISTS session_summaries (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id        UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  author_user_id   TEXT,
  parent_agent_id  UUID REFERENCES agents(id) ON DELETE SET NULL,
  summary          TEXT NOT NULL,
  token_count      INT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK ((author_user_id IS NULL) <> (parent_agent_id IS NULL)),
  CHECK (author_user_id IS NULL OR author_user_id = lower(author_user_id))
);

-- 9. repo_config
CREATE TABLE IF NOT EXISTS repo_config (
  project_id  UUID PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  repos       JSONB NOT NULL DEFAULT '[]',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by  TEXT NOT NULL,
  CHECK (updated_by = lower(updated_by))
);

-- 10. agent_checkout_spec
-- clone_mode CHECK + coherence CHECK (worktree_path required when clone_mode='worktree')
CREATE TABLE IF NOT EXISTS agent_checkout_spec (
  agent_id       UUID PRIMARY KEY REFERENCES agents(id) ON DELETE CASCADE,
  clone_mode     TEXT NOT NULL DEFAULT 'worktree',
  worktree_path  TEXT,
  base_branch    TEXT NOT NULL DEFAULT 'main',
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by     TEXT NOT NULL,
  CHECK (clone_mode IN ('worktree', 'clone', 'none')),
  CHECK (
    (clone_mode = 'worktree' AND worktree_path IS NOT NULL) OR
    (clone_mode <> 'worktree')
  ),
  CHECK (updated_by = lower(updated_by))
);

-- 11. pull_requests
-- at least one of thread_id or task_id must be set
CREATE TABLE IF NOT EXISTS pull_requests (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id     UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  thread_id      UUID REFERENCES threads(id) ON DELETE SET NULL,
  task_id        UUID REFERENCES tasks(id) ON DELETE SET NULL,
  repo_url       TEXT NOT NULL,
  pr_number      INT,
  pr_url         TEXT,
  status         TEXT NOT NULL DEFAULT 'draft',
  opened_by      TEXT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (thread_id IS NOT NULL OR task_id IS NOT NULL),
  CHECK (status IN ('draft', 'open', 'merged', 'closed')),
  CHECK (opened_by = lower(opened_by))
);

-- 12. dcr_clients (Phase 1: DB-backed DCR replaces in-memory Map)
CREATE TABLE IF NOT EXISTS dcr_clients (
  client_id           TEXT PRIMARY KEY,
  client_secret_hash  TEXT NOT NULL,
  client_name         TEXT NOT NULL,
  redirect_uris       JSONB NOT NULL DEFAULT '[]',
  grant_types         JSONB NOT NULL DEFAULT '["authorization_code"]',
  owner_user_id       TEXT NOT NULL,
  project_id          UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (owner_user_id = lower(owner_user_id))
);

-- 13. persona_token_jti (Phase 1: jti persistence for replay prevention)
CREATE TABLE IF NOT EXISTS persona_token_jti (
  jti         TEXT PRIMARY KEY,
  human       TEXT NOT NULL,
  persona     TEXT NOT NULL,
  project_id  UUID REFERENCES projects(id) ON DELETE CASCADE,
  agent_id    TEXT,
  issued_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at  TIMESTAMPTZ NOT NULL,
  CHECK (human = lower(human))
);
-- Indexes
CREATE INDEX IF NOT EXISTS idx_project_members_user ON project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_project ON agents(project_id);
CREATE INDEX IF NOT EXISTS idx_agent_grants_user ON agent_grants(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee_agent_id);
CREATE INDEX IF NOT EXISTS idx_threads_task ON threads(task_id);
CREATE INDEX IF NOT EXISTS idx_threads_project ON threads(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(thread_id, created_at);
CREATE INDEX IF NOT EXISTS idx_session_summaries_thread ON session_summaries(thread_id);
CREATE INDEX IF NOT EXISTS idx_pull_requests_project ON pull_requests(project_id);
CREATE INDEX IF NOT EXISTS idx_pull_requests_thread ON pull_requests(thread_id);
CREATE INDEX IF NOT EXISTS idx_pull_requests_task ON pull_requests(task_id);
CREATE INDEX IF NOT EXISTS idx_dcr_clients_owner ON dcr_clients(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_dcr_clients_project ON dcr_clients(project_id);
CREATE INDEX IF NOT EXISTS idx_jti_expires ON persona_token_jti(expires_at);
CREATE INDEX IF NOT EXISTS idx_jti_human ON persona_token_jti(human);
CREATE INDEX IF NOT EXISTS idx_messages_parent_agent ON messages(parent_agent_id);
CREATE INDEX IF NOT EXISTS idx_messages_to_agent ON messages(to_agent_id);
CREATE INDEX IF NOT EXISTS idx_session_summaries_parent_agent ON session_summaries(parent_agent_id);
CREATE INDEX IF NOT EXISTS idx_jti_project ON persona_token_jti(project_id);
