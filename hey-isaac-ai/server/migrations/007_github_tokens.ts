import type { Migration } from './migrate.js';

export const migration007: Migration = {
  name: '007_github_tokens',
  up: `
    -- GitHub OAuth tokens from the write-lane OBO flow
    CREATE TABLE IF NOT EXISTS app.github_tokens (
      user_id      TEXT NOT NULL PRIMARY KEY,
      access_token TEXT NOT NULL,
      token_type   TEXT NOT NULL DEFAULT 'bearer',
      scope        TEXT,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    -- Extend pull_requests with webhook-observable columns
    ALTER TABLE app.pull_requests
      ADD COLUMN IF NOT EXISTS branch_ref          TEXT,
      ADD COLUMN IF NOT EXISTS base_branch         TEXT,
      ADD COLUMN IF NOT EXISTS author_github_login TEXT;

    -- Unique constraint so the webhook upsert can use ON CONFLICT
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'pull_requests_project_id_pr_number_key'
          AND conrelid = 'app.pull_requests'::regclass
      ) THEN
        ALTER TABLE app.pull_requests
          ADD CONSTRAINT pull_requests_project_id_pr_number_key
          UNIQUE (project_id, pr_number);
      END IF;
    END $$;
  `,
};
