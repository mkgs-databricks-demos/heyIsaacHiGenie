# Session Summary — SPN Postgres Grants

**PR:** https://github.com/mkgs-databricks-demos/heyIsaacHiGenie/pull/20
**Branch:** `feat/wire-spn-postgres-grants`
**Implementer:** `claude_code`
**Reviewer:** `codex` (independent cross-vendor review — 3 rounds)
**Final verdict:** ✅ PASS (v3)
**Merge commit:** `f5355507` → `main`
**Deployed:** `dev` target, `fevm-hls-fde.cloud.databricks.com`, 2026-06-29

---

## Goal

Wire Postgres schema grants for the app SPN (`17579bfd-e62c-4bef-9b30-9175527e325d`) into the
automated deploy pipeline so every `./deploy.sh` run idempotently ensures the SPN has the
necessary access to the Lakebase database. Previously only secret scope READ was automated;
Postgres grants had to be applied manually.

---

## Problem Statement

The app's service principal needs `USAGE + CREATE` on the `public` (and `appkit`) schema, plus
default privileges on all future tables and sequences in `public`, before AppKit migrations can
run. This was a manual step and easy to forget on new deploys or after Lakebase branch resets.

---

## Design Decisions

### `lakebase_connection_string` as the API boundary

The key design choice: `deploy.sh` builds the full Postgres connection string **at deploy time**
using the deployer's OAuth access token (the same token that works for `psql` manually), then
passes it as a single `lakebase_connection_string` parameter to the `configure_app_spn` job.
The notebook calls `psycopg2.connect()` directly — no credential resolution inside the notebook.

This matches the `platform_bootstrap.py` pattern already proven in the codebase.

**Why not pass `LAKEBASE_PROJECT_ID` + `LAKEBASE_BRANCH_ID` to the notebook and resolve there?**
The notebook's `ctx.apiToken()` returns the workspace/notebook service token, not an OAuth token
valid for Postgres. Resolving the endpoint host from inside the notebook would also require an
extra API call pattern that wasn't proven. Keeping all credential logic in `deploy.sh` (which
already has a working `databricks auth token` call) is cleaner and more testable.

### Failure semantics (bifurcated)

- **Lakebase configured, credentials unresolvable** → `fail` (hard abort). Deploy should never
  succeed silently with Postgres grants skipped when Lakebase is configured.
- **Lakebase not configured** (`LAKEBASE_PROJECT_ID`/`BRANCH_ID` not set) → warn-and-continue.
  Backward-compatible for deployments without Lakebase.

### URL encoding

Both the user email and the OAuth token must be URL-encoded for the Postgres connection string
(OAuth tokens contain `+`, `/`, `=` which break the URI). Used `urllib.parse.quote(x, safe='')`.

---

## Changes Made

### `deploy.sh` — `run_configure_app_spn()`

Replaced the old call (which passed `lakebase_project_id` + `lakebase_branch_id` separately) with
a new flow that:

1. Resolves the OAuth token (`databricks auth token --output json`)
2. Resolves the Lakebase endpoint host (`databricks postgres list-endpoints …`)
3. Resolves the deployer's email (`databricks auth describe --output json`)
4. URL-encodes both user and token
5. Builds `postgresql://<user_enc>:<token_enc>@<host>:5432/databricks_postgres?sslmode=require`
6. Passes it as `lakebase_connection_string=<value>` to `databricks bundle run`
7. Hard-fails if credentials unresolvable but Lakebase is configured

### `hey-isaac-ai/resources/configure_app_spn.job.yml`

Replaced `lakebase_project_id` + `lakebase_branch_id` parameters with a single
`lakebase_connection_string` parameter (default `"__unset__"`). Wired through to
`base_parameters` in the notebook task.

### `hey-isaac-ai/src/notebooks/configure_app_spn.py`

Added `lakebase_connection_string` widget (default `"__unset__"`). When set (not `"__unset__"`):

```python
conn = psycopg2.connect(lakebase_connection_string)
conn.autocommit = True
cur.execute(f'GRANT ALL ON SCHEMA public TO "{principal}"')
# Check if appkit schema exists before granting
cur.execute("SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'appkit'")
if cur.fetchone():
    cur.execute(f'GRANT ALL ON SCHEMA appkit TO "{principal}"')
cur.execute(f'ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "{principal}"')
cur.execute(f'ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "{principal}"')
```

All four grants are idempotent.

---

## Codex Review History

### Round 1 (v1) — FAIL (2 blocking issues)

**B1 — Wrong token source:** Original design had the notebook build the connection string using
`ctx.apiToken()` (workspace/notebook service token). Codex correctly identified this wouldn't
work for Postgres auth. **Fix:** Moved all credential resolution to `deploy.sh`.

**B2 — Failure swallowing:** `run_configure_app_spn()` used `|| { warn ...; return 0; }` which
swallowed all job failures silently. **Fix:** Added `local job_failed=0` + `|| job_failed=1`,
then bifurcated on whether Lakebase was configured.

### Round 2 (v2) — FAIL (1 blocking issue)

**B3 — Credential resolution silent skip:** When `LAKEBASE_PROJECT_ID`/`BRANCH_ID` were set but
credentials couldn't be resolved, the code warned and fell through with `lb_conn_str="__unset__"`.
The job then succeeded while silently skipping Postgres grants — a dangerous silent failure.
**Fix:** Changed `else` branch from `warn` to `fail` — any configured-but-unresolvable Lakebase
state now hard-aborts the deploy.

### Round 3 (v3) — ✅ PASS

No blocking issues. Two non-blocking observations (acknowledged, not acted on immediately):
- Token could expire between `auth token` call and Postgres connect on slow deploys (acceptable
  for a deploy-time operation; TTL is typically 1 hour)
- `python3` assumed on PATH for URL encoding (safe assumption in the deploy environment)

---

## Deploy Verification

Job run: `415036123004801` (run time: ~18 seconds)

Postgres ACL confirmed via `psql`:
```
databricks_postgres=> \dn+
 public | ... | 17579bfd-e62c-4bef-9b30-9175527e325d=UC/matthew.giglia@databricks.com
 appkit | ... | 17579bfd-e62c-4bef-9b30-9175527e325d=UC/matthew.giglia@databricks.com
```

Default privileges confirmed for public schema:
```
Tables:  SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN → SPN
Sequences: SELECT, UPDATE, USAGE → SPN
```

---

## Lakebase Connection Details (dev)

| Resource | Value |
|---|---|
| Project | `dev-hi-genie` |
| Branch | `dev-matthew-giglia` |
| Endpoint | `ep-floral-lake-d2m059vl.database.us-east-1.cloud.databricks.com:5432` |
| Database | `databricks_postgres` |
| App SPN | `17579bfd-e62c-4bef-9b30-9175527e325d` |

---

## Lessons Learned

1. **Credential logic belongs in `deploy.sh`, not in notebooks.** The deployer's shell environment
   already has a working `databricks auth token` — use it. Notebooks run in a different auth
   context and don't have a clean path to OAuth tokens for Postgres.

2. **URL-encode both sides of the Postgres URI.** OAuth tokens are not URI-safe. Missing this
   causes silent connection failures that look like wrong password errors.

3. **Bifurcate failure modes early.** A single `|| warn` swallows all failures. Think through
   "configured + broken" vs "not configured" from the start.

4. **Three-round cross-review is normal for non-trivial shell + notebook combos.** Each codex
   review round found a real issue. The final code is materially safer than v1.
