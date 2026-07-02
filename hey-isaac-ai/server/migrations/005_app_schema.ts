import type { Migration } from './migrate.js';

const DOMAIN_TABLES = [
  'projects',
  'project_members',
  'agents',
  'agent_grants',
  'tasks',
  'threads',
  'messages',
  'session_summaries',
  'repo_config',
  'agent_checkout_spec',
  'pull_requests',
  'dcr_clients',
  'persona_token_jti',
];

// ALTER TABLE ... SET SCHEMA moves the table along with its indexes,
// constraints (including FKs), and RLS policies — none of that needs to be
// recreated. `_migrations` itself intentionally stays in `public` (see
// runMigrations in migrate.ts, which always looks it up unqualified there).
const moveTables = DOMAIN_TABLES.map(
  (table) => `
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = '${table}'
      ) THEN
        ALTER TABLE public.${table} SET SCHEMA app;
      END IF;
    END $$;
  `
).join('\n');

export const migration005: Migration = {
  name: '005_app_schema',
  up: `
    CREATE SCHEMA IF NOT EXISTS app;

    ${moveTables}

    -- hi_genie_has_project_access is SECURITY DEFINER with a pinned
    -- search_path (defense against search_path hijacking). Its body queries
    -- project_members unqualified, so once that table lives in app, the
    -- pinned search_path must include app or every RLS policy check fails.
    ALTER FUNCTION public.hi_genie_has_project_access(UUID, TEXT) SET search_path = app, public;
  `,
};
