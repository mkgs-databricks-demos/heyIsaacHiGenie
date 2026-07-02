/**
 * Client for the Omnigent session/runner wire contract.
 *
 * ⚠️ UNSTABLE / UNDOCUMENTED: this contract is NOT in Omnigent's published
 * OpenAPI spec. It was validated empirically against a live workspace on
 * 2026-07-02 and may change without notice. All knowledge of it is isolated
 * behind this module so a contract change is a single-file edit.
 *
 * Endpoints:
 *   - POST {server}/v1/hosts/{host_id}/runners
 *       body: { session_id, workspace }
 *       Binds a runner to a session. A 400 whose body contains
 *       "session already has a runner bound" (case-insensitive substring) means
 *       the runner is ALREADY bound — treated as SUCCESS (no-op).
 *   - POST {server}/v1/sessions/{session_id}/events
 *       body: { type: "message", data: { role: "user", content: [ {type,text} ] } }
 *       `content` MUST be an array of content-block objects, never a bare string.
 *       Success is 202 { queued: true, item_id }. NOTE: "queued" means the
 *       message was accepted for delivery — NOT that the assistant has replied.
 *
 * On a 503 { error: { code: "runner_unavailable" } } from the events endpoint,
 * the caller should bind a runner and retry the events POST EXACTLY ONCE.
 */

/**
 * Auth token accessor, isolated so it's swappable later (e.g. for per-workspace
 * tokens or an OAuth exchange). Reads `OMNIGENT_BRIDGE_TOKEN` from the env.
 */
export function getAuthToken(): string {
  const token = process.env.OMNIGENT_BRIDGE_TOKEN;
  if (!token) {
    throw new Error(
      'OMNIGENT_BRIDGE_TOKEN is not set — cannot authenticate to Omnigent',
    );
  }
  return token;
}

export interface BindRunnerParams {
  hostId: string;
  sessionId: string;
  /** Target workspace for the runner. Sourced from the OMNIGENT_WORKSPACE env by the caller. */
  workspace?: string;
}

export interface DeliverParams {
  hostId: string;
  sessionId: string;
  workspace?: string;
  /** Plain-text message body to deliver as a user message. */
  message: string;
  /**
   * If the runner is already known to be bound (agents.omnigent_runner_bound),
   * we skip the pre-emptive bind and rely on the 503 retry path if needed.
   */
  runnerBound?: boolean;
}

export interface DeliverResult {
  /** True when the events endpoint accepted the message (202 queued). */
  queued: boolean;
  /** Omnigent's queue item id, when returned. */
  itemId?: string;
  /** True when a runner had to be (re)bound as part of delivery. */
  reboundRunner: boolean;
}

export class OmnigentError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = 'OmnigentError';
  }
}

interface RawResponse {
  status: number;
  body: unknown;
}

export class OmnigentClient {
  /** @param server Base URL of the Omnigent server (agents.omnigent_server). */
  constructor(private readonly server: string) {
    if (!server) throw new Error('OmnigentClient requires a server base URL');
  }

  private authHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    };
  }

  private async post(path: string, body: unknown): Promise<RawResponse> {
    const res = await fetch(`${this.server}${path}`, {
      method: 'POST',
      headers: this.authHeaders(),
      body: JSON.stringify(body),
    });
    let parsed: unknown = undefined;
    const text = await res.text();
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text; // keep raw text if not JSON
      }
    }
    return { status: res.status, body: parsed };
  }

  /**
   * Bind a runner to the session. Idempotent: a 400 "session already has a
   * runner bound" is treated as success (the runner is already there).
   */
  async bindRunner(params: BindRunnerParams): Promise<void> {
    const { hostId, sessionId, workspace } = params;
    const { status, body } = await this.post(
      `/v1/hosts/${encodeURIComponent(hostId)}/runners`,
      { session_id: sessionId, workspace },
    );

    if (status >= 200 && status < 300) return;

    if (status === 400 && bodyContains(body, 'session already has a runner bound')) {
      return; // already bound — no-op success
    }

    throw new OmnigentError(
      `bindRunner failed (status ${status})`,
      status,
      body,
    );
  }

  /**
   * POST a user message to the session's events endpoint. Returns the raw
   * response so the caller can inspect 503/runner_unavailable.
   */
  private async postEvent(sessionId: string, message: string): Promise<RawResponse> {
    return this.post(`/v1/sessions/${encodeURIComponent(sessionId)}/events`, {
      type: 'message',
      data: {
        role: 'user',
        // content MUST be an array of content-block objects, never a bare string.
        content: [{ type: 'text', text: message }],
      },
    });
  }

  /**
   * Deliver a message to a session, handling runner binding.
   *
   * Flow:
   *   1. If the runner isn't known to be bound, bind it first (best effort —
   *      the 503 path below is the real safety net).
   *   2. POST the message event.
   *   3. On 503 runner_unavailable: bind the runner, then retry the POST
   *      EXACTLY ONCE. If it still fails, throw (caller logs and gives up).
   */
  async deliverMessage(params: DeliverParams): Promise<DeliverResult> {
    const { hostId, sessionId, workspace, message, runnerBound } = params;
    let reboundRunner = false;

    if (!runnerBound) {
      await this.bindRunner({ hostId, sessionId, workspace });
      reboundRunner = true;
    }

    let res = await this.postEvent(sessionId, message);

    if (res.status === 503 && isRunnerUnavailable(res.body)) {
      // Runner went away — (re)bind and retry exactly once.
      await this.bindRunner({ hostId, sessionId, workspace });
      reboundRunner = true;
      res = await this.postEvent(sessionId, message);
    }

    if (res.status === 202) {
      const itemId =
        typeof res.body === 'object' && res.body !== null
          ? (res.body as { item_id?: string }).item_id
          : undefined;
      return { queued: true, itemId, reboundRunner };
    }

    throw new OmnigentError(
      `postEvent failed (status ${res.status})`,
      res.status,
      res.body,
    );
  }
}

function bodyContains(body: unknown, needle: string): boolean {
  const haystack =
    typeof body === 'string' ? body : JSON.stringify(body ?? '');
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

function isRunnerUnavailable(body: unknown): boolean {
  if (typeof body === 'object' && body !== null) {
    const err = (body as { error?: { code?: string } }).error;
    if (err && err.code === 'runner_unavailable') return true;
  }
  // Defensive fallback for a string/loosely-shaped body.
  return bodyContains(body, 'runner_unavailable');
}
