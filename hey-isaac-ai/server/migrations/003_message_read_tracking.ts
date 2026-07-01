import type { Migration } from './migrate.js';

export const migration003: Migration = {
  name: '003_message_read_tracking',
  up: `
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;
    CREATE INDEX IF NOT EXISTS idx_messages_to_agent_read_at ON messages(to_agent_id, read_at);
  `,
};
