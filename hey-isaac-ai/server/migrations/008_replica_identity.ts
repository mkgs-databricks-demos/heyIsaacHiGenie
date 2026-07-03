import type { Migration } from './migrate.js';

export const migration008: Migration = {
  name: '008_replica_identity',
  up: `
    -- Set REPLICA IDENTITY FULL on all existing app-schema tables.
    -- Idempotent: ALTER TABLE REPLICA IDENTITY is always safe to re-run.
    ALTER TABLE app.projects             REPLICA IDENTITY FULL;
    ALTER TABLE app.project_members      REPLICA IDENTITY FULL;
    ALTER TABLE app.agents               REPLICA IDENTITY FULL;
    ALTER TABLE app.agent_grants         REPLICA IDENTITY FULL;
    ALTER TABLE app.threads              REPLICA IDENTITY FULL;
    ALTER TABLE app.messages             REPLICA IDENTITY FULL;
    ALTER TABLE app.session_summaries    REPLICA IDENTITY FULL;
    ALTER TABLE app.tasks                REPLICA IDENTITY FULL;
    ALTER TABLE app.pull_requests        REPLICA IDENTITY FULL;
    ALTER TABLE app.repo_config          REPLICA IDENTITY FULL;
    ALTER TABLE app.agent_checkout_spec  REPLICA IDENTITY FULL;
    ALTER TABLE app.dcr_clients          REPLICA IDENTITY FULL;
    ALTER TABLE app.persona_token_jti    REPLICA IDENTITY FULL;
    ALTER TABLE app.github_tokens        REPLICA IDENTITY FULL;

    -- Drop the thread_id/task_id NOT NULL check constraint so webhook-sourced
    -- pull_request rows (no thread/task yet) can be inserted.
    -- Uses ILIKE to match regardless of extra parens in pg_get_constraintdef output.
    DO $body$ DECLARE
      cname TEXT;
    BEGIN
      SELECT conname INTO cname
      FROM pg_constraint
      WHERE conrelid = 'app.pull_requests'::regclass
        AND contype = 'c'
        AND pg_get_constraintdef(oid) ILIKE '%thread_id%NOT NULL%task_id%NOT NULL%';
      IF cname IS NOT NULL THEN
        EXECUTE 'ALTER TABLE app.pull_requests DROP CONSTRAINT ' || quote_ident(cname);
      END IF;
    END $body$;
  `,
};
