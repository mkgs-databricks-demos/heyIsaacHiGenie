export interface GitHubStatus {
  configured: boolean;
  fields: {
    app_id: boolean;
    private_key: boolean;
    client_id: boolean;
    client_secret: boolean;
    webhook_secret: boolean;
  };
  relay: {
    sp_configured: boolean;
    app_url_configured: boolean;
  };
  can_mint_jwt?: boolean;
}

export interface GitHubConfigureBody {
  app_id: string;
  private_key: string;
  client_id: string;
  client_secret: string;
  webhook_secret?: string;
  app_public_url?: string;
}

export interface ConfigureResult {
  ok: boolean;
  restart_required?: boolean;
  written?: string[];
}

/** Fetches the current GitHub App status. Returns null when the caller is unauthorized. */
export async function fetchGitHubStatus(): Promise<GitHubStatus | null> {
  const res = await fetch('/api/github/status');
  if (res.status === 401 || res.status === 403) return null;
  if (!res.ok) throw new Error(`GitHub status fetch failed (${res.status})`);
  return (await res.json()) as GitHubStatus;
}

export async function configureGitHubApp(body: GitHubConfigureBody): Promise<ConfigureResult> {
  const res = await fetch('/api/github/configure', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
    throw new Error(err.message ?? err.error ?? `Configure failed (${res.status})`);
  }
  return (await res.json()) as ConfigureResult;
}

export async function rotateGitHubKey(privateKey: string): Promise<ConfigureResult> {
  const res = await fetch('/api/github/rotate-key', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ private_key: privateKey }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
    throw new Error(err.message ?? err.error ?? `Key rotation failed (${res.status})`);
  }
  return (await res.json()) as ConfigureResult;
}

/**
 * Classifies GitHub App configuration into a display state.
 * - `connected`: all required creds present
 * - `partial`: some creds present but app_id + private_key are set (JWT can mint)
 * - `broken`: app_id or private_key missing (all GitHub features broken)
 */
export function classifyStatus(status: GitHubStatus): 'connected' | 'partial' | 'broken' {
  if (status.configured) return 'connected';
  const { app_id, private_key } = status.fields;
  if (!app_id || !private_key) return 'broken';
  return 'partial';
}

/** Returns the list of human-readable field labels that are still missing. */
export function missingFields(status: GitHubStatus): string[] {
  const labels: Record<keyof GitHubStatus['fields'], string> = {
    app_id: 'App ID',
    private_key: 'Private Key',
    client_id: 'OAuth Client ID',
    client_secret: 'OAuth Client Secret',
    webhook_secret: 'Webhook Secret',
  };
  const required: (keyof GitHubStatus['fields'])[] = ['app_id', 'private_key', 'client_id', 'client_secret'];
  return required.filter((f) => !status.fields[f]).map((f) => labels[f]);
}
