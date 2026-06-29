-- Dev seed data — idempotent via ON CONFLICT DO NOTHING

-- Seed dev project
INSERT INTO projects (id, name, description)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'dev-hi-genie',
  'Development project for Phase 0 MCP spike'
)
ON CONFLICT (id) DO NOTHING;

-- Seed project owner
INSERT INTO project_members (project_id, user_id, role)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'matthew.giglia@databricks.com',
  'owner'
)
ON CONFLICT (project_id, user_id) DO NOTHING;

-- Seed dev agent (id stable for dev)
INSERT INTO agents (id, project_id, nickname, description, created_by)
VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'hi-genie',
  'Phase 0 MCP spike agent',
  'matthew.giglia@databricks.com'
)
ON CONFLICT (id) DO NOTHING;

-- Seed agent grant
INSERT INTO agent_grants (agent_id, user_id, granted_by)
VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid,
  'matthew.giglia@databricks.com',
  'matthew.giglia@databricks.com'
)
ON CONFLICT (agent_id, user_id) DO NOTHING;
