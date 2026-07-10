import { Router } from 'express';
import { z } from 'zod';
import type { Db } from '../db/index.js';
import { requireOwner } from '../github/owner-guard.js';
import { githubFieldStatus, canMintAppJwt } from '../github/app-auth.js';
import { writeGitHubSecrets } from '../github/secret-store.js';

const ConfigureSchema = z.object({
  app_id: z.string().min(1),
  private_key: z.string().min(1),
  client_id: z.string().min(1),
  client_secret: z.string().min(1),
  webhook_secret: z.string().optional(),
  app_public_url: z.string().optional(),
});

const RotateKeySchema = z.object({
  private_key: z.string().min(1),
});

export function githubAppRouter(db: Db) {
  const router = Router();

  // GET /api/github/status — which creds are present + relay readiness.
  router.get('/status', async (req, res) => {
    const guard = await requireOwner(req, db);
    if (!guard.ok) {
      res.status(guard.status).json({ error: guard.error, message: guard.message });
      return;
    }

    const fields = githubFieldStatus();
    const configured = fields.app_id && fields.private_key && fields.client_id && fields.client_secret;

    res.json({
      configured,
      fields,
      relay: {
        sp_configured:
          typeof process.env.RELAY_SP_CLIENT_ID === 'string' &&
          process.env.RELAY_SP_CLIENT_ID.length > 0 &&
          typeof process.env.RELAY_SP_CLIENT_SECRET === 'string' &&
          process.env.RELAY_SP_CLIENT_SECRET.length > 0,
        app_url_configured:
          typeof process.env.HI_GENIE_APP_URL === 'string' && process.env.HI_GENIE_APP_URL.length > 0,
      },
      can_mint_jwt: canMintAppJwt(),
    });
  });

  // POST /api/github/configure — write all present creds to the secret scope.
  router.post('/configure', async (req, res) => {
    const guard = await requireOwner(req, db);
    if (!guard.ok) {
      res.status(guard.status).json({ error: guard.error, message: guard.message });
      return;
    }

    const parsed = ConfigureSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'invalid_request', details: parsed.error.flatten() });
      return;
    }

    try {
      const written = await writeGitHubSecrets(parsed.data);
      res.json({ ok: true, restart_required: true, written });
    } catch (err) {
      console.error('[github-app] configure error:', err);
      res.status(500).json({
        error: 'secret_write_failed',
        message: err instanceof Error ? err.message : 'Failed to write credentials to secret scope',
      });
    }
  });

  // POST /api/github/rotate-key — update the private key only.
  router.post('/rotate-key', async (req, res) => {
    const guard = await requireOwner(req, db);
    if (!guard.ok) {
      res.status(guard.status).json({ error: guard.error, message: guard.message });
      return;
    }

    const parsed = RotateKeySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'invalid_request', details: parsed.error.flatten() });
      return;
    }

    try {
      await writeGitHubSecrets({ private_key: parsed.data.private_key });
      res.json({ ok: true, restart_required: true });
    } catch (err) {
      console.error('[github-app] rotate-key error:', err);
      res.status(500).json({
        error: 'secret_write_failed',
        message: err instanceof Error ? err.message : 'Failed to write private key to secret scope',
      });
    }
  });

  return router;
}
