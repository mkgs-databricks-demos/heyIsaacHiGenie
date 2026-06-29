import type { Migration } from './migrate.js';

export const migration002: Migration = {
  name: '002_phase1_trackb',
  up: `
    ALTER TABLE persona_token_jti ADD COLUMN IF NOT EXISTS agent_id TEXT;
    CREATE INDEX IF NOT EXISTS idx_messages_parent_agent ON messages(parent_agent_id);
    CREATE INDEX IF NOT EXISTS idx_messages_to_agent ON messages(to_agent_id);
    CREATE INDEX IF NOT EXISTS idx_session_summaries_parent_agent ON session_summaries(parent_agent_id);
    CREATE INDEX IF NOT EXISTS idx_jti_project ON persona_token_jti(project_id);
  `,
};
