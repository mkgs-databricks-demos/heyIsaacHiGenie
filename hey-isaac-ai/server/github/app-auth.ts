import { createSign } from 'node:crypto';

/**
 * Thrown by GitHub App credential-dependent paths when the required secrets are
 * absent. Routes catch this and return `503 { error: 'github_not_configured' }`
 * so the server degrades gracefully instead of crashing at startup.
 */
export class GitHubNotConfiguredError extends Error {
  constructor() {
    super('GitHub App credentials not configured. Use the owner dashboard to connect your GitHub App.');
    this.name = 'GitHubNotConfiguredError';
  }
}

/** Env var names the GitHub App reads at runtime (populated from the secret scope). */
export const GITHUB_ENV = {
  appId: 'HI_GENIE_GITHUB_APP_ID',
  privateKey: 'HI_GENIE_GITHUB_APP_PRIVATE_KEY',
  clientId: 'HI_GENIE_GITHUB_CLIENT_ID',
  clientSecret: 'HI_GENIE_GITHUB_CLIENT_SECRET',
  webhookSecret: 'HI_GENIE_GITHUB_WEBHOOK_SECRET',
  appUrl: 'HI_GENIE_APP_URL',
} as const;

/** Reports which GitHub App credentials are currently present in the environment. */
export function githubFieldStatus() {
  const has = (k: string) => typeof process.env[k] === 'string' && process.env[k]!.length > 0;
  return {
    app_id: has(GITHUB_ENV.appId),
    private_key: has(GITHUB_ENV.privateKey),
    client_id: has(GITHUB_ENV.clientId),
    client_secret: has(GITHUB_ENV.clientSecret),
    webhook_secret: has(GITHUB_ENV.webhookSecret),
  };
}

/**
 * Minimum credentials required to mint an App JWT / installation token. When
 * `app_id` or `private_key` are missing, *all* GitHub API features are broken.
 */
export function canMintAppJwt(): boolean {
  const f = githubFieldStatus();
  return f.app_id && f.private_key;
}

/** True when every credential needed for the full GitHub App flow is present. */
export function isGitHubConfigured(): boolean {
  const f = githubFieldStatus();
  return f.app_id && f.private_key && f.client_id && f.client_secret;
}

/**
 * Mints a short-lived GitHub App JWT (RS256) used to request installation
 * tokens. Throws {@link GitHubNotConfiguredError} when credentials are absent.
 */
async function mintAppJwt(): Promise<string> {
  if (!canMintAppJwt()) {
    throw new GitHubNotConfiguredError();
  }

  const appId = process.env[GITHUB_ENV.appId]!;
  // Normalize escaped newlines from secret scope
  const pemKey = process.env[GITHUB_ENV.privateKey]!.replace(/\\n/g, '\n');

  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ iat: now - 60, exp: now + 600, iss: appId })).toString('base64url');
  const signingInput = `${header}.${payload}`;
  const sign = createSign('RSA-SHA256');
  sign.update(signingInput);
  const signature = sign.sign(pemKey, 'base64url');
  return `${signingInput}.${signature}`;
}

interface CacheEntry {
  token: string;
  expiresAt: number;
}

const tokenCache = new Map<number, CacheEntry>();

/**
 * Exchanges an App JWT for an installation access token. Throws
 * {@link GitHubNotConfiguredError} when credentials are absent.
 */
export async function getInstallationToken(installationId: number): Promise<string> {
  const cached = tokenCache.get(installationId);
  if (cached && cached.expiresAt > Date.now() + 60_000) {
    return cached.token;
  }

  const jwt = await mintAppJwt(); // throws GitHubNotConfiguredError if unconfigured
  const resp = await fetch(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
  );
  if (!resp.ok) {
    throw new Error(`Failed to get installation token for ${installationId}: HTTP ${resp.status}`);
  }
  const data = await resp.json() as { token: string; expires_at: string };
  const entry: CacheEntry = {
    token: data.token,
    expiresAt: new Date(data.expires_at).getTime(),
  };
  tokenCache.set(installationId, entry);
  return data.token;
}

export async function listInstallations(): Promise<Array<{ id: number; account: { login: string } | null }>> {
  const jwt = await mintAppJwt();
  const resp = await fetch('https://api.github.com/app/installations', {
    headers: {
      Authorization: `Bearer ${jwt}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!resp.ok) throw new Error(`Failed to list installations: HTTP ${resp.status}`);
  return await resp.json() as Array<{ id: number; account: { login: string } | null }>;
}

export async function getInstallationIdForRepo(owner: string, repo: string): Promise<number> {
  const jwt = await mintAppJwt();
  const resp = await fetch(`https://api.github.com/repos/${owner}/${repo}/installation`, {
    headers: { Authorization: `Bearer ${jwt}`, Accept: 'application/vnd.github+json' },
  });
  if (!resp.ok) throw new Error(`GitHub App not installed on ${owner}/${repo} (HTTP ${resp.status})`);
  const data = await resp.json() as { id: number };
  return data.id;
}
