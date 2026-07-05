import { SignJWT, importPKCS8 } from 'jose';

const INSTALLATION_ID = Number(process.env.HI_GENIE_GITHUB_APP_INSTALLATION_ID ?? '144046209');
const APP_ID = process.env.HI_GENIE_GITHUB_APP_ID ?? '4202883';

// Cache: {token, expiresAt}
let _cache: { token: string; expiresAt: number } | null = null;

export async function getInstallationToken(): Promise<string> {
  // Return cached token if still valid (>60s margin)
  if (_cache && Date.now() < _cache.expiresAt - 60_000) {
    return _cache.token;
  }

  // Mint App JWT (valid 10 min max)
  const privateKey = process.env.HI_GENIE_GITHUB_APP_PRIVATE_KEY;
  if (!privateKey) throw new Error('HI_GENIE_GITHUB_APP_PRIVATE_KEY not set');

  const key = await importPKCS8(privateKey.replace(/\\n/g, '\n'), 'RS256');
  const now = Math.floor(Date.now() / 1000);
  const jwt = await new SignJWT({})
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuer(APP_ID)
    .setIssuedAt(now - 60)
    .setExpirationTime(now + 600)
    .sign(key);

  // Exchange for installation access token
  const resp = await fetch(
    `https://api.github.com/app/installations/${INSTALLATION_ID}/access_tokens`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  );
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`GitHub App token exchange failed: ${resp.status} ${body}`);
  }
  const data = await resp.json() as { token: string; expires_at: string };
  _cache = { token: data.token, expiresAt: new Date(data.expires_at).getTime() };
  return data.token;
}
