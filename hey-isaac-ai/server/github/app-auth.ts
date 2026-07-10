import { createSign } from 'node:crypto';

const APP_ID = process.env.HI_GENIE_GITHUB_APP_ID;
const PRIVATE_KEY = process.env.HI_GENIE_GITHUB_APP_PRIVATE_KEY;

if (!APP_ID) {
  throw new Error('HI_GENIE_GITHUB_APP_ID is not configured. Set it via the GitHub App settings in the owner dashboard.');
}
if (!PRIVATE_KEY) {
  throw new Error('HI_GENIE_GITHUB_APP_PRIVATE_KEY is not configured. Set it via the GitHub App settings in the owner dashboard.');
}

// Normalize escaped newlines from secret scope
const pemKey = PRIVATE_KEY.replace(/\\n/g, '\n');

async function mintAppJwt(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ iat: now - 60, exp: now + 600, iss: APP_ID })).toString('base64url');
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

export async function getInstallationToken(installationId: number): Promise<string> {
  const cached = tokenCache.get(installationId);
  if (cached && cached.expiresAt > Date.now() + 60_000) {
    return cached.token;
  }

  const jwt = await mintAppJwt();
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
