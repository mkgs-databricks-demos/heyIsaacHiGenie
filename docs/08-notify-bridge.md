# Omnigent NOTIFY Bridge

A standalone process that wakes **Omnigent-hosted persona sessions** when a new
message is addressed to them. It is the push-side complement to the existing
pull-based MCP tools: agents that self-poll (Isaac, Genie, generic UC-connection
agents) need nothing here; only personas whose runtime is an Omnigent session
need to be actively woken when a message lands for them.

It runs as its **own process** (`npm run bridge`), separate from the main
Databricks App server. It does not touch `server/server.ts`, the MCP tools, or
any migration — it is independently mergeable and runnable.

```
messages INSERT ──► pg_notify('hi_genie_messages', …)
                          │  (Postgres NOTIFY)
                          ▼
                  server/bridge/pgListener.ts   (dedicated pg.Client, LISTEN)
                          │  on('message')
                          ▼
                  server/bridge/index.ts        (look up agent routing)
                          │  if Omnigent-hosted
                          ▼
                  server/bridge/omnigentClient.ts
                     ├─ POST /v1/hosts/{host}/runners   (bind runner, if needed)
                     └─ POST /v1/sessions/{id}/events   (deliver the message)
```

## Files

| File | Responsibility |
|---|---|
| `server/bridge/pgListener.ts` | Dedicated `pg.Client` that issues `LISTEN hi_genie_messages`, parses payloads, and reconnects with exponential backoff. Emits `message` / `listening` / `error`. |
| `server/bridge/omnigentClient.ts` | The Omnigent wire contract (runner bind + session events), isolated behind one module. |
| `server/bridge/index.ts` | Entrypoint. Wires the listener to the agent lookup and the Omnigent client; structured logging; graceful shutdown. |

## The NOTIFY channel + payload contract (its dependency)

The bridge depends on a Postgres trigger added by a **sibling migration (PR #28,
`db-notify-read-tracking`)** — not owned by this task:

- **Channel:** `hi_genie_messages`
- **Fires:** `AFTER INSERT ON messages`, via `pg_notify('hi_genie_messages', payload)`
- **Payload:** a JSON string:

  ```json
  { "message_id": "<uuid>", "thread_id": "<uuid>", "to_agent_id": "<uuid or empty string>" }
  ```

> **⚠️ `to_agent_id` empty-string convention.** When a message has no recipient,
> `to_agent_id` is the **STRING `""` (empty string)**, *not* JSON `null`
> (see `docs/03-data-model.md`). The bridge treats empty-string, `null`, and
> `undefined` **all** as "no recipient" and skips such notifications.

### Routing columns on `agents` (also from PR #28)

Nullable columns the bridge reads to decide whether/where to deliver:

| Column | Meaning |
|---|---|
| `omnigent_server` | Base URL of the Omnigent server. NULL/empty ⇒ not Omnigent-hosted ⇒ do nothing (agent self-polls via MCP). |
| `omnigent_session_id` | Session to wake. NULL/empty ⇒ do nothing. |
| `omnigent_host_id` | Host used for the runner-bind endpoint. |
| `omnigent_runner_bound` | `true` ⇒ skip the pre-emptive bind (still rebinds on a `503`). |

## The Omnigent wire contract

> **⚠️ Undocumented / unstable.** This contract is **not** in Omnigent's
> published OpenAPI spec. It was **validated empirically against a live
> workspace on 2026-07-02** and may change without notice. All knowledge of it
> is isolated in `server/bridge/omnigentClient.ts` so a change is a one-file edit.

**Bind a runner** — `POST {server}/v1/hosts/{host_id}/runners`

```json
{ "session_id": "…", "workspace": "…" }
```

- A `400` whose body contains `"session already has a runner bound"`
  (case-insensitive substring) is treated as **success** (no-op).

**Post a message event** — `POST {server}/v1/sessions/{session_id}/events`

```json
{ "type": "message",
  "data": { "role": "user", "content": [ { "type": "text", "text": "<message>" } ] } }
```

- `content` **MUST** be an array of content-block objects, never a bare string.
- Success is `202 { "queued": true, "item_id": "…" }`. **`queued` means the
  message was accepted for delivery — NOT that the assistant has replied.**
- On `503 { "error": { "code": "runner_unavailable" } }`: bind a runner, then
  retry the events POST **exactly once**. If it still fails, the failure is
  logged with full context (session id, thread id, message id) and the bridge
  gives up — no infinite retry, no crash.

**Auth:** `Authorization: Bearer <token>`, token from `OMNIGENT_BRIDGE_TOKEN`,
read via `getAuthToken()` (isolated so it's swappable later).

## Environment variables

**Postgres connection** (how AppKit's `lakebase()` plugin exposes it — verified
2026-07-02 by inspecting `node_modules/@databricks/appkit` and
`@databricks/lakebase`):

| Var | Notes |
|---|---|
| `DATABASE_URL` | If set, used directly as a connection string (local dev / non-Lakebase Postgres). Takes precedence. |
| `LAKEBASE_ENDPOINT` | Present in production (injected at runtime via `app.yaml` `valueFrom: postgres`). Its presence selects **Lakebase OAuth mode**: the connection is built with `@databricks/lakebase`'s `getLakebasePgConfig()`, which authenticates with a **short-lived OAuth token minted per connection** — there is no static `PGPASSWORD`. |
| `PGHOST`, `PGDATABASE`, `PGPORT`, `PGSSLMODE` | Auto-injected by the platform at deploy time; also used for the plain-`pg` fallback path (local dev). |
| `PGUSER`, `PGPASSWORD` | Plain-`pg` fallback only (local dev against any Postgres). |

In Lakebase mode the bridge holds two kinds of connection, and each re-mints the
short-lived OAuth token on its own cadence so an expiring token never wedges it:

- **The dedicated LISTEN connection** is a `pg.Client`, which only supports a
  *string* password — so the token is resolved to a concrete string at connect
  time. Its `connect()` runs the config builder fresh on every (re)connect, so
  the **reconnect loop re-mints a token on each reconnect**.
- **The lookup connection pool** is a `pg.Pool`, which supports a *function*
  password. The bridge passes the async token callback through unresolved, so
  the **pool re-mints a token for every new connection it opens** (not tied to
  the client's reconnects — a different, per-pooled-connection cadence).

**Omnigent / bridge:**

| Var | Notes |
|---|---|
| `OMNIGENT_BRIDGE_TOKEN` | **Required** for delivery. Bearer token for Omnigent. |
| `OMNIGENT_WORKSPACE` | Workspace value sent in the runner-bind body. |
| `BRIDGE_LOG_LEVEL` | Set to `debug` to log skipped/no-op notifications (also on when `NODE_ENV=development`). |

## Running it

Alongside the main server, as its own process:

```bash
npm run bridge        # tsx server/bridge/index.ts
```

Local dev against a plain Postgres — set `DATABASE_URL` to a standard libpq
connection string of the form
`postgresql://<user>:<password>@<host>:5432/<database>`, then:

```bash
export DATABASE_URL="…"        # postgresql://<user>:<password>@<host>:5432/<db>
export OMNIGENT_BRIDGE_TOKEN=…
export OMNIGENT_WORKSPACE=…
npm run bridge
```

In production the Lakebase env vars (`LAKEBASE_ENDPOINT`, `PGHOST`, …) are
auto-injected; you only need to supply `OMNIGENT_BRIDGE_TOKEN` and
`OMNIGENT_WORKSPACE`.

### Logging

One-line JSON per event. Notable outcomes on the `notify` event:
`delivered`, `no_recipient`, `not_omnigent`, `agent_not_found`, `schema_absent`,
`empty_message`, `error` (with `stage`). Startup logs `listening` / `started`;
shutdown logs `shutdown` with the signal.

## Graceful degradation (before PR #28 lands)

The bridge is designed to run cleanly against **today's schema**, before the
NOTIFY trigger or the `agents` Omnigent columns exist:

- With **no trigger**, no NOTIFYs arrive — the bridge simply idles.
- If a NOTIFY *does* arrive but the routing columns / tables aren't present, the
  agent lookup catches Postgres **`42703` (undefined_column)** and **`42P01`
  (undefined_table)** specifically, logs **once** (`event: schema_absent`), and
  treats it as "nothing to do yet". It does **not** crash or retry-loop.
- Malformed NOTIFY payloads are logged and skipped.
- Connection drops trigger reconnection with exponential backoff (never a crash).

## Graceful shutdown

`SIGTERM` / `SIGINT` close the LISTEN connection and the lookup pool cleanly and
exit `0`.

## Verification (2026-07-02)

Exercised end-to-end against a local Postgres 16 with a fake Omnigent server:

- `npm run typecheck` passes.
- Bridge starts, connects, issues `LISTEN`, stays running.
- Against the **current schema** (no `agents` routing columns): a NOTIFY logs
  `schema_absent` once and the process keeps running.
- Empty-string `to_agent_id` ⇒ `no_recipient`; malformed payload ⇒ logged, no crash.
- With a seeded Omnigent-routed agent: message delivered (`202 queued`),
  including the `503 runner_unavailable` → rebind → retry-once path and the
  `400 "session already has a runner bound"` → success path; non-Omnigent agents
  skipped (`not_omnigent`).
- `SIGTERM`/`SIGINT` ⇒ clean shutdown, exit 0.
