import type { Migration } from './migrate.js';

// Documents the per-repo JSONB element shape added in Phase 5c.
// No schema changes — repo_config.repos already exists as jsonb[].
// Idempotent: COMMENT ON COLUMN is safe to re-run.
export const migration009: Migration = {
  name: '009_per_repo_fields',
  up: `
    COMMENT ON COLUMN app.repo_config.repos IS
      'Array of { url: string, webhook_secret: string, installation_id: number }. '
      'webhook_secret: per-repo HMAC secret for the GH Actions relay. '
      'installation_id: GitHub App installation ID for the org/account owning this repo.';
  `,
};
