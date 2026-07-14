import type { Db } from '../db/index.js';
import { migration001 } from './001_initial_schema.js';
import { migration002 } from './002_phase1_trackb.js';
import { migration003 } from './003_message_read_tracking.js';
import { migration004 } from './004_rls_policies.js';
import { migration005 } from './005_app_schema.js';
import { migration006 } from './006_omnigent_routing.js';
import { migration007 } from './007_github_tokens.js';
import { migration008 } from './008_replica_identity.js';
import { migration009 } from './009_per_repo_fields.js';
import { migration010 } from './010_agent_presentation.js';
import { migration011 } from './011_thread_read_state.js';

export interface Migration {
  name: string;
  up: string;
}

const migrations: Migration[] = [
  migration001,
  migration002,
  migration003,
  migration004,
  migration005,
  migration006,
  migration007,
  migration008,
  migration009,
  migration010,
  migration011,
];

// CONVENTION: every CREATE TABLE in a migration must be followed immediately by
//   ALTER TABLE <name> REPLICA IDENTITY FULL;
// This ensures CDC / logical-replication consumers receive full before/after row
// images for all tables from the moment the table is created.
//
// CONVENTION (wal2delta registration): every new `app.*` table must ALSO be
// registered into the managed control table `wal2delta.tables` (schema owner
// cloud_admin) so the platform Postgres -> Unity Catalog CDF sync picks it up.
// That registration is NOT done here: the app SPN that runs these migrations has
// no INSERT/UPDATE on wal2delta.tables. It is reconciled at deploy time by the
// elevated platform bootstrap step
// (hey-isaac-infra/src/notebooks/platform_bootstrap.py), which registers missing
// REPLICA IDENTITY FULL `app.*` tables as PENDING and resets stale SKIPPED
// entries once their table gains FULL. Adding the REPLICA IDENTITY FULL line
// above is what makes a new table eligible for that reconciliation. See
// docs/adr/002-wal2delta-registration-reconciliation.md.

// Explicitly qualified to public — once search_path is app, public (see
// db/index.ts), an unqualified CREATE TABLE would land _migrations in `app`
// on a fresh database, which is exactly what we don't want (see 005_app_schema.ts).
const ENSURE_MIGRATIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS public._migrations (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

const GET_APPLIED = `SELECT name FROM public._migrations ORDER BY id`;
const INSERT_APPLIED = `INSERT INTO public._migrations (name) VALUES ($1)`;

export async function runMigrations(db: Db): Promise<number> {
  await db.query(ENSURE_MIGRATIONS_TABLE);
  const { rows } = await db.query(GET_APPLIED);
  const applied = new Set(rows.map((r: any) => r.name));
  let count = 0;
  for (const migration of migrations) {
    if (applied.has(migration.name)) continue;
    console.log(`[migrations] Applying: ${migration.name}`);
    try {
      await db.query(migration.up);
      await db.query(INSERT_APPLIED, [migration.name]);
      count++;
      console.log(`[migrations] Applied: ${migration.name}`);
    } catch (err) {
      console.error(`[migrations] FAILED: ${migration.name}`, err);
      throw new Error(
        `Migration "${migration.name}" failed: ${
          (err as Error).message
        }. Database may be in an inconsistent state. Fix the migration and restart.`
      );
    }
  }
  if (count === 0) {
    console.log('[migrations] All migrations already applied.');
  } else {
    console.log(`[migrations] Applied ${count} migration(s).`);
  }
  return count;
}
