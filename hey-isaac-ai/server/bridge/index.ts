/**
 * Omnigent NOTIFY bridge — standalone process.
 *
 * Listens on the `hi_genie_messages` Postgres NOTIFY channel (created by the
 * sibling migration in PR #28) and, for each new message addressed to an
 * Omnigent-hosted persona, wakes that persona's Omnigent session by binding a
 * runner (if needed) and posting the message as a session event.
 *
 * This runs as its OWN process (`npm run bridge`), independent of the main
 * server. It is written to DEGRADE GRACEFULLY: if the NOTIFY trigger or the
 * Omnigent routing columns on `agents` don't exist yet (i.e. PR #28 hasn't
 * landed), it connects, LISTENs, logs once, and idles — it never crashes.
 *
 * See docs/08-notify-bridge.md.
 */
import pg from 'pg';
import { PgListener, buildPgClientConfig, NOTIFY_CHANNEL } from './pgListener.js';
import type { NotifyPayload } from './pgListener.js';
import { OmnigentClient } from './omnigentClient.js';

const LOG_PREFIX = 'bridge';

function log(fields: Record<string, unknown>): void {
  // One-line JSON structured logging.
  console.log(JSON.stringify({ ts: new Date().toISOString(), src: LOG_PREFIX, ...fields }));
}

function debug(fields: Record<string, unknown>): void {
  if (process.env.BRIDGE_LOG_LEVEL === 'debug' || process.env.NODE_ENV === 'development') {
    log({ level: 'debug', ...fields });
  }
}

/** Row shape from the agents lookup (all Omnigent columns are nullable). */
interface AgentRoutingRow {
  omnigent_server: string | null;
  omnigent_session_id: string | null;
  omnigent_host_id: string | null;
  omnigent_runner_bound: boolean | null;
}

/** A message body column exists on `messages`; we fetch it to deliver content. */
interface MessageRow {
  content: string | null;
}

// True once we've logged (exactly once) that the routing schema isn't present.
let schemaAbsentLogged = false;

/** Treat empty-string, null, and undefined all as "no value". */
function isBlank(v: string | null | undefined): boolean {
  return v === undefined || v === null || v === '';
}

/**
 * Look up the Omnigent routing info for an agent plus the message body.
 *
 * Returns `null` (and logs once) when the routing schema isn't present yet —
 * catching Postgres 42703 (undefined_column) / 42P01 (undefined_table)
 * specifically so a pre-PR-#28 schema is "nothing to do", not a crash.
 */
async function loadDelivery(
  pool: pg.Pool,
  payload: NotifyPayload,
): Promise<{ agent: AgentRoutingRow; message: MessageRow } | 'schema_absent' | 'not_found'> {
  try {
    const agentRes = await pool.query<AgentRoutingRow>(
      `SELECT omnigent_server, omnigent_session_id, omnigent_host_id, omnigent_runner_bound
         FROM agents
        WHERE id = $1`,
      [payload.to_agent_id],
    );
    if (agentRes.rows.length === 0) return 'not_found';

    const msgRes = await pool.query<MessageRow>(
      `SELECT content FROM messages WHERE id = $1`,
      [payload.message_id],
    );
    const message = msgRes.rows[0] ?? { content: null };
    return { agent: agentRes.rows[0], message };
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === '42703' || code === '42P01') {
      if (!schemaAbsentLogged) {
        schemaAbsentLogged = true;
        log({
          level: 'info',
          event: 'schema_absent',
          detail:
            'agents Omnigent routing columns / messages table not present yet — bridge idling until PR #28 lands',
          pg_code: code,
        });
      }
      return 'schema_absent';
    }
    throw err;
  }
}

async function handleNotification(pool: pg.Pool, payload: NotifyPayload): Promise<void> {
  const base = { thread_id: payload.thread_id, to_agent_id: payload.to_agent_id ?? null };

  // No recipient → nothing to route (empty-string OR null both mean "none").
  if (isBlank(payload.to_agent_id)) {
    debug({ ...base, event: 'notify', outcome: 'no_recipient' });
    return;
  }

  let loaded: Awaited<ReturnType<typeof loadDelivery>>;
  try {
    loaded = await loadDelivery(pool, payload);
  } catch (err) {
    log({ ...base, event: 'notify', outcome: 'error', stage: 'lookup', error: String(err) });
    return;
  }

  if (loaded === 'schema_absent') {
    debug({ ...base, event: 'notify', outcome: 'schema_absent' });
    return;
  }
  if (loaded === 'not_found') {
    debug({ ...base, event: 'notify', outcome: 'agent_not_found' });
    return;
  }

  const { agent, message } = loaded;

  // Not an Omnigent-hosted persona → self-polls via MCP tools; nothing to do.
  if (isBlank(agent.omnigent_server) || isBlank(agent.omnigent_session_id)) {
    debug({ ...base, event: 'notify', outcome: 'not_omnigent' });
    return;
  }
  if (isBlank(agent.omnigent_host_id)) {
    log({ ...base, event: 'notify', outcome: 'error', stage: 'config', error: 'omnigent_host_id missing' });
    return;
  }
  if (isBlank(message.content)) {
    debug({ ...base, event: 'notify', outcome: 'empty_message' });
    return;
  }

  try {
    const client = new OmnigentClient(agent.omnigent_server as string);
    const result = await client.deliverMessage({
      hostId: agent.omnigent_host_id as string,
      sessionId: agent.omnigent_session_id as string,
      workspace: process.env.OMNIGENT_WORKSPACE,
      message: message.content as string,
      runnerBound: agent.omnigent_runner_bound === true,
    });
    log({
      ...base,
      event: 'notify',
      outcome: 'delivered',
      message_id: payload.message_id,
      item_id: result.itemId ?? null,
      rebound_runner: result.reboundRunner,
    });
  } catch (err) {
    // Full context, then give up (no infinite retry, no crash).
    log({
      ...base,
      event: 'notify',
      outcome: 'error',
      stage: 'deliver',
      message_id: payload.message_id,
      session_id: agent.omnigent_session_id,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

async function main(): Promise<void> {
  // Dedicated pool for the (small) agent/message lookups. Separate from the
  // LISTEN connection, which must stay a single persistent session.
  const pool = new pg.Pool({ ...(await buildPgClientConfig()), max: 2 });
  pool.on('error', (err) => log({ level: 'warn', event: 'pool_error', error: String(err) }));

  const listener = new PgListener();

  listener.on('listening', (channel: string) =>
    log({ level: 'info', event: 'listening', channel }),
  );
  listener.on('error', (err: Error) =>
    log({ level: 'warn', event: 'listener_error', error: err.message }),
  );
  listener.on('message', (payload: NotifyPayload) => {
    void handleNotification(pool, payload);
  });

  await listener.start();
  log({ level: 'info', event: 'started', channel: NOTIFY_CHANNEL });

  let shuttingDown = false;
  const shutdown = async (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    log({ level: 'info', event: 'shutdown', signal });
    try {
      await listener.stop();
      await pool.end();
    } catch (err) {
      log({ level: 'warn', event: 'shutdown_error', error: String(err) });
    }
    process.exit(0);
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

main().catch((err) => {
  log({ level: 'error', event: 'fatal', error: err instanceof Error ? err.message : String(err) });
  process.exit(1);
});
