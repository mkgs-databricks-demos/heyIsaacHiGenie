import type { Db } from '../db/index.js';
import { migration001 } from './001_initial_schema.js';
import { migration002 } from './002_phase1_trackb.js';
import { migration003 } from './003_message_read_tracking.js';

export interface Migration {
  name: string;
  up: string;
}

const migrations: Migration[] = [
  migration001,
  migration002,
  migration003,
];

const ENSURE_MIGRATIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS _migrations (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

const GET_APPLIED = `SELECT name FROM _migrations ORDER BY id`;
const INSERT_APPLIED = `INSERT INTO _migrations (name) VALUES ($1)`;

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
