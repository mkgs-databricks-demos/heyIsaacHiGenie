import type { Migration } from './migrate.js';

export const migration003: Migration = {
  name: '003_notify_and_routing',
  up: `
    -- Read-tracking cursors (per agent per thread)
    CREATE TABLE IF NOT EXISTS agent_read_cursors (
      thread_id            UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
      agent_id             UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
      last_read_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
      updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (thread_id, agent_id)
    );

    -- Omnigent routing columns on agents (nullable — non-Omnigent agents leave NULL)
    ALTER TABLE agents ADD COLUMN IF NOT EXISTS omnigent_server TEXT;
    ALTER TABLE agents ADD COLUMN IF NOT EXISTS omnigent_session_id TEXT;
    ALTER TABLE agents ADD COLUMN IF NOT EXISTS omnigent_host_id TEXT;
    ALTER TABLE agents ADD COLUMN IF NOT EXISTS omnigent_runner_bound BOOLEAN NOT NULL DEFAULT false;

    -- NOTIFY trigger: fires on every new message, emitting to hi_genie_messages
    CREATE OR REPLACE FUNCTION notify_hi_genie_message() RETURNS trigger AS $$
    BEGIN
      PERFORM pg_notify('hi_genie_messages', json_build_object(
        'message_id',  NEW.id::text,
        'thread_id',   NEW.thread_id::text,
        'to_agent_id', COALESCE(NEW.to_agent_id::text, '')
      )::text);
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS trg_notify_hi_genie_message ON messages;
    CREATE TRIGGER trg_notify_hi_genie_message
      AFTER INSERT ON messages
      FOR EACH ROW
      EXECUTE FUNCTION notify_hi_genie_message();
  `,
};
