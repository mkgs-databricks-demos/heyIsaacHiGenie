import type { Migration } from './migrate.js';

// Adds server-authoritative presentation fields (label + color) to app.agents so
// the roster — not the client — is the source of truth for how an agent is shown.
//
// Idempotent:
//   - ADD COLUMN IF NOT EXISTS guards the column adds.
//   - The backfill only touches rows where the value is still NULL, so re-runs
//     are no-ops and manually-set values are never clobbered.
//
// REPLICA IDENTITY: app.agents was set to REPLICA IDENTITY FULL in migration 008.
// ADD COLUMN preserves the existing replica identity, so no change is needed here
// (and none is made — do not regress it).
export const migration010: Migration = {
  name: '010_agent_presentation',
  up: `
    ALTER TABLE app.agents ADD COLUMN IF NOT EXISTS label text;
    ALTER TABLE app.agents ADD COLUMN IF NOT EXISTS color text;

    -- Backfill existing rows (e.g. the seeded genie agent) with a real label +
    -- color. Guarded on NULL so this is idempotent and non-destructive.
    UPDATE app.agents SET label = initcap(nickname) WHERE label IS NULL;
    UPDATE app.agents SET color = '#4a86e8'          WHERE color IS NULL;
  `,
};
