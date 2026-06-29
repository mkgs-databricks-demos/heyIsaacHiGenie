# Databricks notebook source
# MAGIC %md
# MAGIC ## Hey Isaac / Hi Genie — Platform Bootstrap
# MAGIC
# MAGIC Stores `workspace_url` in the secret scope and validates admin-provisioned secrets.
# MAGIC Also executes Lakebase DDL (schema + seed) when `lakebase_connection_string` is set.
# MAGIC Run once after the infra bundle deploys, before deploying the app bundle.

# COMMAND ----------

from databricks.sdk import WorkspaceClient

dbutils.widgets.text("secret_scope_name", "dev_REPLACE_ME_hi_genie_credentials")  # type: ignore[name-defined]
dbutils.widgets.text("lakebase_connection_string", "__unset__")  # type: ignore[name-defined]
dbutils.widgets.text("target", "dev")  # type: ignore[name-defined]

scope = dbutils.widgets.get("secret_scope_name")  # type: ignore[name-defined]
lakebase_connection_string = dbutils.widgets.get("lakebase_connection_string")  # type: ignore[name-defined]
target = dbutils.widgets.get("target")  # type: ignore[name-defined]

w = WorkspaceClient()

# COMMAND ----------

# Store workspace URL (auto-provisioned)
workspace_url = spark.conf.get("spark.databricks.workspaceUrl")  # type: ignore[name-defined]
w.secrets.put_secret(scope=scope, key="workspace_url", string_value=f"https://{workspace_url}")
print(f"✓ workspace_url stored: https://{workspace_url}")

# COMMAND ----------

# Validate admin-provisioned secrets
ADMIN_KEYS = ["jwt_signing_key"]

existing = {s.key for s in w.secrets.list_secrets(scope=scope)}
missing = [k for k in ADMIN_KEYS if k not in existing]

for k in ADMIN_KEYS:
    mark = "✓" if k in existing else "✗ MISSING"
    print(f"  {mark}  {k}")

if missing:
    instructions = "\n".join(
        f"  databricks secrets put-secret {scope} {k} --string-value <value>"
        for k in missing
    )
    raise SystemExit(
        f"\nAdmin secrets not provisioned. Provision them then re-run:\n"
        f"  ./deploy.sh --target dev --app\n\n"
        f"Commands:\n{instructions}\n\n"
        f"Generate jwt_signing_key:\n"
        f"  openssl rand -base64 64"
    )

# COMMAND ----------

# Execute Lakebase DDL — skipped if lakebase_connection_string is empty or '__unset__'

SCHEMA_SQL = """
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

-- 12. dcr_clients
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

-- 13. persona_token_jti
CREATE TABLE IF NOT EXISTS persona_token_jti (
  jti         TEXT PRIMARY KEY,
  human       TEXT NOT NULL,
  persona     TEXT NOT NULL,
  project_id  UUID REFERENCES projects(id) ON DELETE CASCADE,
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
"""

SEED_DEV_SQL = """
-- Dev seed data — idempotent via ON CONFLICT DO NOTHING

INSERT INTO projects (id, name, description)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'dev-hi-genie',
  'Development project for Phase 0 MCP spike'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO project_members (project_id, user_id, role)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'matthew.giglia@databricks.com',
  'owner'
)
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO agents (id, project_id, nickname, description, created_by)
VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'hi-genie',
  'Phase 0 MCP spike agent',
  'matthew.giglia@databricks.com'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO agent_grants (agent_id, user_id, granted_by)
VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid,
  'matthew.giglia@databricks.com',
  'matthew.giglia@databricks.com'
)
ON CONFLICT (agent_id, user_id) DO NOTHING;
"""

_conn_str = lakebase_connection_string.strip()
if not _conn_str or _conn_str == "__unset__":
    print("⚠  lakebase_connection_string is empty or unset — skipping DDL execution.")
    print("   Set the widget value to run DDL against Lakebase.")
else:
    import psycopg2  # available on Databricks Runtime

    conn = psycopg2.connect(_conn_str)
    try:
        conn.autocommit = True
        with conn.cursor() as cur:
            print("Executing schema DDL...")
            cur.execute(SCHEMA_SQL)
            print("✓ Schema DDL applied (13 tables + indexes)")

            if target == "dev":
                print("Executing dev seed data (target=dev)...")
                cur.execute(SEED_DEV_SQL)
                print("✓ Dev seed data applied")
            else:
                print(f"  Skipping seed data (target={target})")

            # Report tables created
            cur.execute("""
                SELECT tablename FROM pg_tables
                WHERE schemaname = 'public'
                ORDER BY tablename
            """)
            tables = [row[0] for row in cur.fetchall()]
            print(f"\nTables in public schema ({len(tables)}):")
            for t in tables:
                print(f"  ✓ {t}")
    finally:
        conn.close()

# COMMAND ----------

print("\n✓ Platform bootstrap complete.")
print("  Scope: <configured>")
print(f"  Keys auto-provisioned: workspace_url")
print(f"  Keys admin-provisioned: {', '.join(ADMIN_KEYS)}")
