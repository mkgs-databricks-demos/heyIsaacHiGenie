import { EventEmitter } from 'node:events';
import pg from 'pg';
import type { ClientConfig } from 'pg';

/**
 * The Postgres NOTIFY channel this bridge listens on. Defined by the sibling
 * migration in PR #28 (an `AFTER INSERT ON messages` trigger that calls
 * `pg_notify('hi_genie_messages', payload)`). Kept as a constant so the string
 * lives in exactly one place.
 */
export const NOTIFY_CHANNEL = 'hi_genie_messages';

/**
 * Shape of the JSON payload carried on the NOTIFY channel.
 *
 * IMPORTANT: `to_agent_id` is the STRING `""` (empty string) when a message has
 * no recipient — NOT JSON `null` (see docs/03-data-model.md, PR #28). Callers
 * must treat empty-string, null, and undefined all as "no recipient".
 */
export interface NotifyPayload {
  message_id: string;
  thread_id: string;
  to_agent_id: string | null;
}

export interface PgListenerOptions {
  /** Channel to LISTEN on. Defaults to {@link NOTIFY_CHANNEL}. */
  channel?: string;
  /** Initial reconnect backoff in ms (doubles each attempt). Default 1000. */
  initialBackoffMs?: number;
  /** Maximum reconnect backoff in ms. Default 30000. */
  maxBackoffMs?: number;
}

/**
 * Build a raw `pg` connection config for the bridge.
 *
 * We need a DEDICATED connection here because LISTEN/NOTIFY requires a single,
 * persistent session, and the app's `Db` interface (server/db/index.ts) only
 * exposes `query`/`asUser` over an AppKit-managed pool — it has no LISTEN hook.
 *
 * How production injects Postgres connection info (verified 2026-07-02 by
 * inspecting node_modules/@databricks/appkit/dist/plugins/lakebase/manifest.js
 * and node_modules/@databricks/lakebase):
 *
 *   - The AppKit `lakebase()` plugin declares these env vars, auto-injected by
 *     the Databricks Apps platform at deploy/runtime:
 *       PGHOST, PGDATABASE, PGPORT, PGSSLMODE  (localOnly connection params)
 *       LAKEBASE_ENDPOINT                       (valueFrom: postgres, runtime only)
 *   - There is deliberately NO PGPASSWORD/PGUSER static secret. Lakebase
 *     authenticates with a SHORT-LIVED OAUTH TOKEN minted per connection.
 *     `@databricks/lakebase`'s `getLakebasePgConfig()` returns a pg config whose
 *     `password` is an async callback that mints/refreshes that token.
 *
 * Resolution order:
 *   1. DATABASE_URL  — a plain connection string (local dev / non-Lakebase PG).
 *   2. LAKEBASE_ENDPOINT present — Lakebase OAuth mode via @databricks/lakebase.
 *   3. Plain PG* env vars — local dev against any Postgres (PGPASSWORD auth).
 *
 * The OAuth token is resolved to a concrete string here: `pg.Client` only
 * supports a string `password` (the function form is a `pg.Pool`-only feature),
 * and long-lived LISTEN sessions re-mint a fresh token on every reconnect, so
 * token expiry is handled naturally by the reconnect loop.
 */
export async function buildPgClientConfig(): Promise<ClientConfig> {
  if (process.env.DATABASE_URL) {
    return { connectionString: process.env.DATABASE_URL };
  }

  if (process.env.LAKEBASE_ENDPOINT) {
    // Lakebase OAuth mode. Imported lazily so the bridge still runs (via the
    // plain-env path below) in environments where the package is unavailable.
    const { getLakebasePgConfig } = await import('@databricks/lakebase');
    const cfg = getLakebasePgConfig();
    let password = cfg.password;
    if (typeof password === 'function') {
      password = await (password as () => string | Promise<string>)();
    }
    return { ...cfg, password } as ClientConfig;
  }

  const sslmode = process.env.PGSSLMODE;
  return {
    host: process.env.PGHOST,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ssl:
      sslmode && sslmode !== 'disable'
        ? { rejectUnauthorized: false }
        : undefined,
  };
}

/**
 * Dedicated LISTEN/NOTIFY client for the `hi_genie_messages` channel.
 *
 * Emits:
 *   - `'message'` (payload: {@link NotifyPayload}) for each valid NOTIFY.
 *   - `'listening'` once LISTEN is established (and after each reconnect).
 *   - `'error'` (err: Error) for connection/parse errors (informational; the
 *     listener recovers on its own — do not treat as fatal).
 *
 * Reconnection uses exponential backoff and never throws out of the module or
 * crashes the process; failures are logged and retried.
 */
export class PgListener extends EventEmitter {
  private readonly channel: string;
  private readonly initialBackoffMs: number;
  private readonly maxBackoffMs: number;

  private client: pg.Client | null = null;
  private stopped = false;
  private backoffMs: number;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(options: PgListenerOptions = {}) {
    super();
    this.channel = options.channel ?? NOTIFY_CHANNEL;
    this.initialBackoffMs = options.initialBackoffMs ?? 1000;
    this.maxBackoffMs = options.maxBackoffMs ?? 30000;
    this.backoffMs = this.initialBackoffMs;
  }

  /** Connect and issue LISTEN. Safe to call once; reconnection is automatic. */
  async start(): Promise<void> {
    this.stopped = false;
    await this.connect();
  }

  private async connect(): Promise<void> {
    if (this.stopped) return;
    try {
      const config = await buildPgClientConfig();
      const client = new pg.Client(config);

      // A connection-level error (e.g. the server dropping the session, or an
      // expired OAuth token) surfaces here. Reconnecting re-mints credentials.
      client.on('error', (err) => {
        this.emit('error', err);
        this.scheduleReconnect();
      });

      client.on('notification', (msg) => {
        this.handleNotification(msg.payload);
      });

      await client.connect();
      await client.query(`LISTEN ${this.channel}`);

      this.client = client;
      this.backoffMs = this.initialBackoffMs; // reset backoff on success
      this.emit('listening', this.channel);
    } catch (err) {
      this.emit('error', err instanceof Error ? err : new Error(String(err)));
      this.scheduleReconnect();
    }
  }

  private handleNotification(raw: string | undefined): void {
    if (!raw) return;
    let payload: NotifyPayload;
    try {
      payload = JSON.parse(raw) as NotifyPayload;
    } catch (err) {
      this.emit(
        'error',
        new Error(`Failed to parse NOTIFY payload: ${raw} (${String(err)})`),
      );
      return;
    }
    this.emit('message', payload);
  }

  private scheduleReconnect(): void {
    if (this.stopped || this.reconnectTimer) return;

    // Tear down the current client (best-effort) before reconnecting.
    const dead = this.client;
    this.client = null;
    if (dead) {
      dead.removeAllListeners();
      dead.end().catch(() => undefined);
    }

    const delay = this.backoffMs;
    this.backoffMs = Math.min(this.backoffMs * 2, this.maxBackoffMs);
    this.emit('error', new Error(`Reconnecting in ${delay}ms`));

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      void this.connect();
    }, delay);
    this.reconnectTimer.unref();
  }

  /** Stop listening and close the connection cleanly. Idempotent. */
  async stop(): Promise<void> {
    this.stopped = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    const client = this.client;
    this.client = null;
    if (client) {
      client.removeAllListeners();
      try {
        await client.end();
      } catch {
        // ignore — we're shutting down
      }
    }
  }
}
