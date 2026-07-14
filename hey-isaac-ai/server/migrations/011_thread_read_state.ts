import type { Migration } from './migrate.js';

export const migration011: Migration = {
  name: '011_thread_read_state',
  up: `
    -- Per-human, per-thread read state. The existing messages.read_at column is
    -- scoped to to_agent_id (agent recipients), so it cannot express "has THIS
    -- signed-in human read this thread." This table adds that: read state is keyed
    -- by (thread_id, user_email) so two distinct humans on the same project track
    -- their unread counts independently and never clobber each other.
    CREATE TABLE IF NOT EXISTS app.thread_read_state (
      thread_id     UUID NOT NULL REFERENCES app.threads(id) ON DELETE CASCADE,
      user_email    TEXT NOT NULL,
      last_read_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (thread_id, user_email),
      CHECK (user_email = lower(user_email))
    );

    -- CONVENTION (see migrate.ts): every CREATE TABLE is followed immediately by
    -- REPLICA IDENTITY FULL so CDC / wal2delta gets full before/after row images
    -- and the table becomes eligible for platform-bootstrap wal2delta registration.
    ALTER TABLE app.thread_read_state REPLICA IDENTITY FULL;

    -- RLS, mirroring the messages/session_summaries policies: access is gated by
    -- project membership on the owning thread's project. current_user is the
    -- human's provisioned Lakebase role (= lower(OBO email)); the OBO route always
    -- writes user_email = lower(OBO email), so per-human rows are never crossed.
    ALTER TABLE app.thread_read_state ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS thread_read_state_project_member_access ON app.thread_read_state;
    CREATE POLICY thread_read_state_project_member_access ON app.thread_read_state
      USING (thread_id IN (
        SELECT id FROM threads
        WHERE public.hi_genie_has_project_access(project_id, current_user)
      ))
      WITH CHECK (thread_id IN (
        SELECT id FROM threads
        WHERE public.hi_genie_has_project_access(project_id, current_user)
      ));

    CREATE INDEX IF NOT EXISTS idx_thread_read_state_user ON app.thread_read_state(user_email);
  `,
};
