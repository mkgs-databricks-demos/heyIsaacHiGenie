# Session Summary — RLS, CLI Hardening, Rate-Limit Fix, App-Schema Migration

**Date:** 2026-07-02
**PRs landed:** #22, #23, #24, #25, #26 (merged) · #27 (open, live-verified, awaiting merge)
**Implementers:** `codex` (PR #22, #23, #25, #26), `claude_code` (PR #24, #27)
**Reviewers (cross-vendor):** `claude_code` reviewed #22/#26, `codex` reviewed #23/#24/#27
**`pi` / `codex` investigations:** RLS spec recovery, `asUser()` mechanism, `public` vs `app` schema

---

## Starting point

Coming off Phase 1 (Track A/B, React frontend, SPN Postgres grants all merged), a
cross-review of PR #23 surfaced a real architecture gap: **no Row-Level Security existed
anywhere in the codebase**, despite the original Phase 1 plan (independently cross-reviewed
before Track B was built) explicitly requiring RLS `USING`/`WITH CHECK` policies as
DB-level defense-in-depth. Every write tool relied entirely on app-layer WHERE clauses.

## What shipped

### PR #22 — Rate-limit key: `trust proxy` → `X-Real-Ip`
A prior fix (`trust proxy: 1`) to silence an `express-rate-limit` startup warning was itself
wrong. A live deploy + spoof test found the real Databricks Apps ingress chain is **3 hops**
(not 1), confirmed against Databricks' internal architecture docs. Any hop-count number is
fragile to app-type changes (Spaces-based apps are 4 hops). Fixed by keying the rate limiter
directly on `X-Real-Ip` — the platform-set, non-spoofable header — across all three
rate-limited routes.

### PR #23 — `mark_messages_read` / `unread_only` (closes S6)
Adds `read_at TIMESTAMPTZ` (migration `003`) and wires the tool to actually filter/update it,
scoped to the caller's own `to_agent_id` via `asUser`. Closes the one remaining gap from the
Phase 1 smoke test run.

### PR #24 — RLS policies + lazy per-human Postgres roles
The big one. Two investigations first: recovered the original Phase 1 RLS spec (11
project-scoped tables, predicates including the `messages`/`session_summaries` →
`threads.project_id` FK traversal), and confirmed `asUser(req)` genuinely mints a per-human
OAuth-scoped Postgres connection (not a no-op convention) — meaning `current_user`-keyed RLS
would actually work, **except no human Postgres role is ever created**. Designed and shipped
lazy role provisioning: `ensureHumanRole.ts`, called from `/token/persona` before signing,
idempotent, fail-closed (503) on any provisioning error.

This one went through five review rounds — each catching a real bug the previous round
missed, several only via *empirical* testing against real Postgres rather than static code
trace:
1. Scope creep + missing FK indexes (first `codex` review)
2. Role-name length guard + skip-redundant-grants (user-requested cleanup)
3. `has_schema_privilege` throws (doesn't return false) on a nonexistent role — would have
   broken brand-new user provisioning, the primary path
4. `USAGE` on `public` is granted to `PUBLIC` by default — a false-positive "already granted"
   signal that would have permanently skipped real grants
5. Final empirical three-case validation (new role / fully-provisioned / role-without-grants)
   against a live ephemeral Postgres instance

Also live-deployed and human-tested end-to-end before merge (real OBO token → `/token/persona`
→ role creation confirmed via `information_schema.role_table_grants` → `/mcp` tool call
succeeding through RLS).

### PR #25 / #26 — CLI version investigation and hardening
User flagged that a CLI upgrade to 1.5.0 was available and asked whether the `deploy.sh`
username-parsing fix from earlier (PR #25) was a version regression. Investigated by pulling
the actual `authStatus` Go struct from `databricks/cli` at three tags (v0.299.2, v1.0.0,
v1.5.0) — **`username` has always been top-level, at every version; the old
`details.userName` lookup never worked at any point.** Not a regression. Still upgraded this
machine's CLI to 1.5.0 and shipped PR #26: `bundle.databricks_cli_version: ">= 1.5.0"` pinned
in both bundles, plus a fail-closed version-check gate at the very top of `deploy.sh` (correct
numeric semver comparison, not lexicographic) covering the 14+ raw CLI calls the bundle-level
pin alone doesn't protect.

### PR #27 — `public` → `app` Postgres schema (open, not yet merged)
Investigated pros/cons of a dedicated `app` schema vs. `public` (prompted by the
`USAGE`-on-`public` false-positive found during PR #24's review). Recommended and implemented
moving all 13 domain tables to `app`, matching the sibling `lakeLoom` project's precedent.
Key design call: **`_migrations` stays in `public`** to avoid a self-referential bookkeeping
hazard. `search_path=app,public` set on pool config so no application SQL call site needed
touching.

**A live deploy-before-merge (explicitly requested by the user this time, not after) caught
a real production bug that had passed static cross-review cleanly**: `@databricks/lakebase`
silently drops the `pool.options` config field, so the intended `search_path` setting never
reached any real connection — every query against a moved table crashed the whole Node
process (`relation "project_members" does not exist`, uncaught rejection, no auto-restart).
Root-caused by reading the library source directly and confirming via raw `psql`. Fixed with
a `pg.Pool` monkeypatch (`server/db/searchPath.ts`) using `pg-pool`'s `onConnect` hook —
verified to run and be awaited before any caller gets the client, and to fail the acquisition
outright (not just log) if `SET search_path` itself fails. Two more review rounds hardened
this: fatal-on-failure (switched a fire-and-forget `'connect'` listener to the awaited
`onConnect` hook) and an idempotency guard. Every iteration was re-verified against the live
dev app (OTEL zero-error check + full human test), not just typecheck.

---

## Key lessons reinforced this session

- **Deploy-before-merge caught what code review missed, twice** (PR #24's provisioning logic
  bugs were only found empirically; PR #27's crash was invisible to static review of correct-
  looking code that traced cleanly through AppKit's public interface but not its actual
  runtime config-drop behavior). The user's explicit "system test before merge" instruction on
  PR #27 was the right call.
- **A library silently dropping a config field is indistinguishable from working code until
  you run it.** Neither implementer nor reviewer caught `pool.options` being dropped until a
  live app actually crashed on a real query.
- Several `claude_code` sub-agent dispatches hit a recurring pattern: launching a long-running
  deploy as a background shell command, then ending the turn on "I'll wait for the
  notification" before the notification actually arrived and was processed. Recovered each
  time by continuing the same session with an explicit "the background task completed, please
  continue" nudge rather than re-dispatching fresh (which would have lost context and
  worktree state).
- Root-causing a "why doesn't X work" question by reading the actual dependency source
  (`pg-pool/index.js`, `@databricks/lakebase`'s `pool-config.js`, the `databricks/cli` Go
  source at specific tags) rather than trusting API docs or assuming version drift, resolved
  two separate investigations this session (the CLI regression question, and the search_path
  bug) with certainty instead of guesswork.

---

## State at end of session

| PR | Status |
|---|---|
| #22 (rate-limit `X-Real-Ip`) | ✅ Merged |
| #23 (`mark_messages_read`) | ✅ Merged |
| #24 (RLS + lazy Postgres roles) | ✅ Merged |
| #25 (CLI username-parsing fix) | ✅ Merged |
| #26 (CLI version pin + gate) | ✅ Merged |
| #27 (`app` schema migration) | 🟡 Open — fully live-verified on dev (schema move, RLS survival, search_path fix, both hardening follow-ups), zero blocking cross-review findings, **awaiting your merge** |

`main` is at `084f1da`. This machine's Databricks CLI is at `v1.5.0`. `PROJECT_MEMORY.md`
updated in this session to reflect all of the above (Current Status, Known Gaps table
corrections, Roadmap table, and four new/updated Technical Notes sections: Databricks Apps
Ingress Topology, DCR Registry, Lazy Per-Human Postgres Roles, and Postgres Schema `app` vs
`public`).
