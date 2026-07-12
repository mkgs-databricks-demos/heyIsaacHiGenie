# ADR 002 — wal2delta registration reconciliation (bootstrap step)

- **Status:** Accepted
- **Date:** 2026-07-12
- **Deciders:** Project owner
- **Related:** `docs/adr/001-github-is-pull-not-push.md`, `docs/05-github-integration.md`,
  `hey-isaac-ai/server/migrations/migrate.ts`,
  `hey-isaac-infra/src/notebooks/platform_bootstrap.py`, `deploy.sh`

## Context

The Lakebase Postgres → Unity Catalog CDF sync (`wal2delta`) is a
**platform-managed sidecar** — there is no repo-owned pipeline/job/synced-table
resource for it. The managed writer is driven by a control table in the Lakebase
Postgres: **`wal2delta.tables`** (schema owner `cloud_admin`), keyed by
`table_oid`, with columns `status`, `committed_lsn`, `last_write_time`,
`status_detail`.

`wal2delta.tables` is **not** auto-reconciled with the `app` schema after
migrations:

- New `app.*` tables are never registered (`wal2delta` does not auto-discover).
- Stale `SKIPPED` entries are never re-evaluated once their blocker is fixed.
  Concretely, `app.repo_config` was `SKIPPED` with
  `status_detail = "Does not have REPLICA IDENTITY FULL"`, but a live check
  confirmed it (and every `app.*` table) **now** has REPLICA IDENTITY FULL — the
  registration entry was simply never re-evaluated after FULL was applied.

This ADR covers the repo-side maintenance fix: keep `wal2delta.tables` reconciled
with the actual `app` schema at deploy time.

## Out of scope (separate operational item)

The managed **writer** itself is frozen (the CDF target stopped advancing on
2026-07-03; `app.pull_requests` sits at `STREAMING` with a `committed_lsn` that
never moved). **Whether the frozen writer resumes is a platform/operational
question handled separately.** This ADR does **not**:

- restart, re-seed, or otherwise touch the managed wal2delta writer or the UC
  Delta table;
- add any REPLICA IDENTITY FULL migration for `repo_config` (it already has FULL);
- backfill the already-discarded 07-03 → now changes.

## Required first step — privilege check (drove the mechanism)

`wal2delta.tables` is owned by `cloud_admin`, so *who can write it* was unknown
and load-bearing. A read-only check was run against the dev branch Postgres:

| Identity | `INSERT` | `UPDATE` | `SELECT` | Notes |
| --- | --- | --- | --- | --- |
| Deployer / bootstrap identity (`matthew.giglia@…`) | ✅ | ✅ | ✅ | Member of `databricks_superuser` |
| App runtime SPN (`17579bfd-…`, owns `app.*`, runs migrations) | ❌ | ❌ | ✅ | Not a member of `databricks_superuser` / `cloud_admin` |

Supporting evidence:

- `wal2delta` schema owner: `cloud_admin`.
- `wal2delta.tables` ACL grants write **with grant option** to
  `databricks_superuser` (`databricks_superuser=a*r*w*d*…/cloud_admin`) and read
  to `PUBLIC` (`=r/cloud_admin`).
- `pg_has_role(deployer, 'databricks_superuser', 'MEMBER')` → **true**;
  `pg_has_role(app_spn, 'databricks_superuser', 'MEMBER')` → **false**.
- `has_table_privilege(app_spn, 'wal2delta.tables', 'INSERT'/'UPDATE')` →
  **false/false**.

## Decision

**Implement the reconciliation as a bootstrap step** in
`hey-isaac-infra/src/notebooks/platform_bootstrap.py` — the spec's *preferred*
mechanism — because:

- The **bootstrap/deploy identity can write** `wal2delta.tables` (via
  `databricks_superuser`), so this is not a `cloud_admin`-only case (a documented
  ops-SQL + operator gate is unnecessary).
- A **TypeScript migration is ruled out**: the app SPN that runs migrations has no
  INSERT/UPDATE on `wal2delta.tables`, so a migration would fail or silently no-op.
- Bootstrap already runs elevated at deploy time and already owns cross-cutting
  registration/DDL.

`deploy.sh`'s `run_platform_bootstrap` resolves the Lakebase **endpoint + host**
(both non-secret) and passes them to the bootstrap job so the step actually
executes rather than being a silent no-op. The Postgres **token is minted inside
the notebook at runtime** (`POST /api/2.0/postgres/credentials` as the job's
identity) — it is never placed in CLI args or job-run parameters.

**Fail-safe:** the reconciliation must run whenever the app tables exist. Two
skips are legitimate: (a) Lakebase is not configured (no project) — `deploy.sh`
warns and passes `__unset__`; (b) a genuine first deploy where the `app` schema
does not exist yet — the notebook detects this via `to_regnamespace('app')` and
skips gracefully. Anything else fails loud: if Lakebase IS configured but the
endpoint cannot be resolved, `deploy.sh` hard-fails rather than degrading to a
skip; and if the endpoint is provided but the credential cannot be minted, the
notebook raises. A resolution failure must never masquerade as a first-deploy
skip.

## Reconciliation logic (idempotent)

For the `app` schema only:

1. **Register missing tables** — every base table in schema `app` with
   `relreplident = 'f'` (FULL) not present in `wal2delta.tables` (join on
   `table_oid`) is inserted with `status = 'PENDING'`
   (`ON CONFLICT (table_oid) DO NOTHING` makes it race-safe against a concurrent
   bootstrap run).
2. **Reset stale SKIPPED** — any `app.*` row in `wal2delta.tables` with
   `status = 'SKIPPED'` whose table now has FULL is set to `status = 'PENDING'`
   with `status_detail` cleared. (This is the `repo_config` case.)
3. `STREAMING` rows and non-`app` schemas (`appkit`, `public._migrations`, …) are
   **never** touched.
4. Safe to run repeatedly — re-running changes nothing once reconciled.

`table_oid ↔ name` is resolved via `pg_class`/`pg_namespace`. A first-deploy guard
(`to_regnamespace('app') IS NOT NULL`) skips Postgres steps gracefully when the
app schema does not exist yet (the app applies its migrations on startup, after
bootstrap); re-running bootstrap after the app has started performs the
reconciliation.

## Verification (live, dev branch)

- Before: `app.repo_config` = `SKIPPED` /
  `"Does not have REPLICA IDENTITY FULL"`; all other `app.*` = `PENDING`/`STREAMING`.
- Apply run 1: `INSERT 0` (nothing missing), `UPDATE 1` (`repo_config` reset).
- Apply run 2: `INSERT 0`, `UPDATE 0` — idempotent no-op.
- After: `app.repo_config` = `PENDING` with `status_detail` cleared;
  `app.pull_requests` still `STREAMING`; `public._migrations` and
  `appkit.appkit_cache_entries` still `SKIPPED` (unchanged).

## Consequences

- New `app.*` tables become registration-eligible simply by following the existing
  `REPLICA IDENTITY FULL` convention; the deploy-time bootstrap reconciles them.
- The convention note in `migrate.ts` points future authors at this step.
- The managed-writer freeze remains a separate operational item — reconciliation
  makes tables *eligible* for streaming but does not itself resume the writer.
