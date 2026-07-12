# Spec — wal2delta registration reconciliation (CDF sync hardening)

## Problem (evidenced, not theoretical)

The Lakebase Postgres → Unity Catalog CDF sync (`wal2delta`) writes into
`hls_fde_dev.dev_matthew_giglia_hi_genie.lb_pull_requests_history`. It is a
**platform-managed sidecar** — there is NO repo-owned pipeline/job/synced-table
resource for it. The managed service is driven by a registration/state table in
the Lakebase Postgres: **`wal2delta.tables`** (schema owner `cloud_admin`), keyed
by `table_oid`, columns `status`, `committed_lsn`, `last_write_time`,
`status_detail`.

Investigation (three lenses + a live probe) found the CDF target frozen since
2026-07-03. The Postgres replication layer is HEALTHY (logical slot active,
caught up to head, ~1.9 MB WAL retained). The problem is on the registration /
managed-writer side:

- `app.pull_requests` = `STREAMING` but `committed_lsn` frozen at `0/23DBBC8`
  (07-03); never advanced.
- All other 13 `app.*` tables = `PENDING`, never promoted to `STREAMING`.
- `app.github_tokens` = `PENDING`, `last_write_time = NULL` (never picked up —
  "wal2delta does not auto-discover" per prior session notes).
- `wal2delta.tables` shows `app.repo_config` = `SKIPPED` with
  `status_detail = "Does not have REPLICA IDENTITY FULL"` — **but this is a STALE
  cache**: a live check confirms `app.repo_config` (and all app.* tables) NOW
  have `REPLICA IDENTITY FULL`. The registration entry was never re-evaluated
  after FULL was applied.

So the repo-side gap is: **nothing keeps `wal2delta.tables` reconciled with the
actual `app.*` schema after migrations** — new tables are never registered, and
stale `SKIPPED` entries are never reset once their blocker (missing FULL) is
fixed.

## Scope of THIS fix (do NOT exceed)

Build a **reconciliation step** that keeps `wal2delta.tables` in sync with the
`app` schema, run as part of deploy/bootstrap (and documented as the convention
for future tables). This is a maintenance/hardening fix on OUR side.

EXPLICITLY OUT OF SCOPE (do not attempt):
- Restarting, re-seeding, or otherwise touching the managed wal2delta **writer**
  service or the UC Delta table. Whether the frozen writer resumes is a
  platform/operational question the human is investigating separately.
- Any migration to set `REPLICA IDENTITY FULL` on `repo_config` — it ALREADY has
  FULL (verified live). Do not add one.
- Backfilling the already-discarded 07-03→now changes.

## Required first step — VERIFY PRIVILEGES before choosing the mechanism

`wal2delta.tables` is owned by `cloud_admin`. Whether the reconciliation can run
as the app SPN (which runs migrations) or must run as an elevated
bootstrap/`cloud_admin` role is UNKNOWN and load-bearing. Before writing the
reconciliation, determine (read-only) what role can write to `wal2delta.tables`:

- Check `has_table_privilege('wal2delta.tables', 'UPDATE')` / `'INSERT'` for the
  relevant role(s). The app SPN identity and the bootstrap identity differ —
  `platform_bootstrap.py` runs with a more privileged connection than the app's
  runtime migrations.
- Decide the mechanism based on the answer:
  - If the **bootstrap** identity can write `wal2delta.tables` → put the
    reconciliation in the bootstrap path (`hey-isaac-infra/src/notebooks/
    platform_bootstrap.py`), which already runs elevated at deploy time.
  - If only `cloud_admin` can → implement as a **documented, idempotent SQL
    ops script** (e.g. `hey-isaac-infra/src/sql/reconcile_wal2delta.sql`) plus a
    deploy.sh gate/log that tells the operator to run it, rather than a silent
    no-op that pretends to work.
  - If the app-runtime migration role CAN write it → a migration is acceptable,
    but bootstrap is preferred (it already owns cross-cutting DDL/registration).

State which mechanism you chose and WHY, backed by the privilege check output.

## Reconciliation logic (idempotent)

For the `app` schema, reconcile `wal2delta.tables`:

1. **Register missing tables**: every base table in schema `app` that has
   `relreplident = 'f'` (FULL) and is NOT present in `wal2delta.tables` (join on
   `table_oid`) → INSERT a row with `status = 'PENDING'`.
2. **Reset stale SKIPPED**: any `app.*` row in `wal2delta.tables` with
   `status = 'SKIPPED'` whose table NOW has `REPLICA IDENTITY FULL` → set
   `status = 'PENDING'` (clear the stale `status_detail`). This is exactly the
   `repo_config` case.
3. Do NOT touch `STREAMING` rows, and do NOT touch non-`app` schemas
   (`appkit`, `public._migrations`, etc. — those legitimately lack FULL and are
   out of scope).
4. Must be safe to run repeatedly (idempotent): re-running changes nothing once
   reconciled.

Resolve `table_oid` ↔ name via `pg_class`/`pg_namespace` (the state table is
keyed by OID, and OIDs are stable per table unless the table is recreated).

## Convention (prevent recurrence)

Extend the migration convention already documented at
`hey-isaac-ai/server/migrations/migrate.ts` (~line 29, the REPLICA IDENTITY FULL
note): add that every new `app.*` table must ALSO be reconciled into
`wal2delta.tables` — and point at this reconciliation step as the mechanism that
enforces it at deploy time. Keep it a comment/convention note; the reconciliation
step is what actually does it.

## Deliverables

- The reconciliation implementation in the chosen mechanism (bootstrap step OR
  documented ops SQL + deploy.sh gate OR migration — per the privilege finding).
- `migrate.ts` convention note extended.
- A short doc note (in `docs/05-github-integration.md` or a new
  `docs/adr`/ops note) describing the registration-reconciliation behavior,
  the stale-`SKIPPED` correction, and that the managed-writer freeze is a
  SEPARATE, out-of-scope operational item.
- If a schema change / new migration is added, it must follow existing migration
  conventions and pass `npm run typecheck` + `npm run build:server`.

## Acceptance contract (for implementer + cross-review)

1. A privilege check was actually run and its result dictates the chosen
   mechanism (evidence included in the PR description). No silent no-op.
2. Reconciliation registers missing FULL `app.*` tables as `PENDING` and resets
   stale `SKIPPED` app-table rows (whose table now has FULL) to `PENDING`.
3. Idempotent — re-running is a no-op once reconciled.
4. Does NOT modify `STREAMING` rows, non-`app` schema rows, the managed writer,
   or the UC Delta table; adds NO replica-identity migration for repo_config.
5. `migrate.ts` convention extended to cover wal2delta registration for new
   tables.
6. Gates green: `npm run typecheck` + `npm run build:server` (if server code
   touched). Bundle validates if infra resource/notebook touched.
7. Every commit ends with a blank line then exactly:
   `Co-authored-by: omnigent <noreply@omnigent.ai>`
8. Work ONLY inside this worktree
   (`.worktrees/wal2delta-registration-reconcile`), open your OWN PR against
   base `add-github-oauth-secret-provisioning`.
