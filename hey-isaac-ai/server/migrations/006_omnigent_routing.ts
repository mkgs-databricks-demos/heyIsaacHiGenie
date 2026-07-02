import type { Migration } from './migrate.js';

export const migration006: Migration = {
  name: '006_omnigent_routing',
  up: `
    -- Omnigent routing columns on agents (nullable — non-Omnigent agents leave NULL)
    ALTER TABLE agents ADD COLUMN IF NOT EXISTS omnigent_server TEXT;
    ALTER TABLE agents ADD COLUMN IF NOT EXISTS omnigent_session_id TEXT;
    ALTER TABLE agents ADD COLUMN IF NOT EXISTS omnigent_host_id TEXT;
    ALTER TABLE agents ADD COLUMN IF NOT EXISTS omnigent_runner_bound BOOLEAN NOT NULL DEFAULT false;

    -- NOTIFY trigger: fires on every new message insert (independent of read
    -- state) so the Omnigent bridge process can route it via LISTEN/NOTIFY.
    CREATE OR REPLACE FUNCTION app.notify_hi_genie_message() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path = app, public
    AS $$
    DECLARE
      v_project_id UUID;
    BEGIN
      SELECT project_id INTO v_project_id FROM threads WHERE id = NEW.thread_id;

      PERFORM pg_notify('hi_genie_messages', json_build_object(
        'message_id',  NEW.id::text,
        'thread_id',   NEW.thread_id::text,
        'project_id',  v_project_id::text,
        'to_agent_id', COALESCE(NEW.to_agent_id::text, '')
      )::text);
      RETURN NEW;
    END;
    $$;

    DROP TRIGGER IF EXISTS trg_notify_hi_genie_message ON messages;
    CREATE TRIGGER trg_notify_hi_genie_message
      AFTER INSERT ON messages
      FOR EACH ROW
      EXECUTE FUNCTION app.notify_hi_genie_message();
  `,
};
