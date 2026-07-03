import { Router } from 'express';
import type { Db } from '../db/index.js';

export function githubOAuthRouter(db: Db) {
  const router = Router();

  // GET /auth/github/login — redirect to GitHub OAuth authorization
  router.get('/login', (req, res) => {
    const clientId = process.env.HI_GENIE_GITHUB_CLIENT_ID;
    const appUrl = process.env.HI_GENIE_APP_URL;

    if (!clientId || !appUrl) {
      res.status(503).json({ error: 'GitHub OAuth not configured' });
      return;
    }

    const state = typeof req.query.state === 'string' ? req.query.state : '';
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: `${appUrl}/auth/github/callback`,
      scope: 'repo,read:user',
      ...(state ? { state } : {}),
    });

    res.redirect(`https://github.com/login/oauth/authorize?${params}`);
  });

  // GET /auth/github/callback — exchange code for access token, store it
  router.get('/callback', async (req, res) => {
    const clientId = process.env.HI_GENIE_GITHUB_CLIENT_ID;
    const clientSecret = process.env.HI_GENIE_GITHUB_CLIENT_SECRET;
    const appUrl = process.env.HI_GENIE_APP_URL;

    const { code, state } = req.query;

    if (!clientId || !clientSecret || !appUrl) {
      res.status(503).json({ error: 'GitHub OAuth not configured', state: state ?? null });
      return;
    }

    if (typeof code !== 'string' || !code) {
      res.status(400).json({ error: 'missing_code', state: state ?? null });
      return;
    }

    let tokenData: Record<string, string>;
    try {
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: `${appUrl}/auth/github/callback`,
        }),
      });

      if (!tokenRes.ok) {
        throw new Error(`GitHub token exchange failed: ${tokenRes.status}`);
      }

      tokenData = await tokenRes.json() as Record<string, string>;
    } catch (err) {
      console.error('[github-oauth] token exchange error:', err);
      res.status(502).json({ error: 'token_exchange_failed', state: state ?? null });
      return;
    }

    if (tokenData.error) {
      res.status(400).json({ error: tokenData.error, error_description: tokenData.error_description, state: state ?? null });
      return;
    }

    const { access_token, token_type = 'bearer', scope } = tokenData;

    if (!access_token) {
      res.status(502).json({ error: 'no_access_token', state: state ?? null });
      return;
    }

    // Fetch GitHub user id to use as user_id primary key
    let userId: string;
    try {
      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });

      if (!userRes.ok) {
        throw new Error(`GitHub user fetch failed: ${userRes.status}`);
      }

      const user = await userRes.json() as { login: string; id: number };
      userId = String(user.id);
    } catch (err) {
      console.error('[github-oauth] user fetch error:', err);
      res.status(502).json({ error: 'user_fetch_failed', state: state ?? null });
      return;
    }

    await db.query(
      `INSERT INTO app.github_tokens (user_id, access_token, token_type, scope, updated_at)
       VALUES ($1, $2, $3, $4, now())
       ON CONFLICT (user_id) DO UPDATE
         SET access_token = EXCLUDED.access_token,
             token_type   = EXCLUDED.token_type,
             scope        = EXCLUDED.scope,
             updated_at   = now()`,
      [userId, access_token, token_type, scope ?? null],
    );

    if (process.env.NODE_ENV === 'development') {
      console.log(`[github-oauth] stored token for GitHub user ${userId}`);
    }

    res.json({ ok: true, state: state ?? null });
  });

  return router;
}
