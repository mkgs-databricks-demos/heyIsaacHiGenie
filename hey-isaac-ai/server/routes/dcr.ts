import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { randomUUID, createHash } from 'node:crypto';
import type { Db } from '../db/index.js';
import type { DcrClient } from '../../src/db/types.js';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

function hashSecret(secret: string): string {
  return createHash('sha256').update(secret).digest('hex');
}

export function dcrRouter(db: Db) {
  const router = Router();

  // RFC 7591 — Dynamic Client Registration endpoint.
  // Databricks calls this when auto-registering the UC HTTP connection.
  router.post('/', limiter, async (req, res) => {
    const configured = process.env.HI_GENIE_DCR_SHARED_SECRET;
    const provided = req.header('x-dcr-shared-secret');
    if (!configured || provided !== configured) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }

    const { client_name, redirect_uris = [], grant_types = ['authorization_code'], ...rest } = req.body as Record<string, unknown>;

    if (typeof client_name !== 'string' || !client_name) {
      res.status(400).json({
        error: 'invalid_client_metadata',
        error_description: 'client_name is required',
      });
      return;
    }

    const client_id = `hg_${randomUUID().replace(/-/g, '').slice(0, 20)}`;
    const client_secret = randomUUID().replace(/-/g, '');
    const client_secret_hash = hashSecret(client_secret);
    const client_id_issued_at = Math.floor(Date.now() / 1000);

    await db.query(
      `INSERT INTO dcr_clients
         (client_id, client_secret_hash, client_name, redirect_uris, grant_types, owner_user_id, project_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, now(), now())`,
      [
        client_id,
        client_secret_hash,
        client_name,
        redirect_uris,
        grant_types,
        'service',
        (rest.project_id as string) || null,
      ],
    );

    if (process.env.NODE_ENV === 'development') {
      console.log(`[dcr] registered client: ${client_id} (${client_name})`);
    }

    res.status(201).json({
      client_id,
      client_secret,
      client_id_issued_at,
      client_secret_expires_at: 0, // never expires — RFC 7591 §3.2.1
      client_name,
      redirect_uris,
      grant_types,
    });
  });

  // Lookup for token endpoint validation (used internally)
  router.get('/:client_id', limiter, async (req, res) => {
    const result = await db.query<DcrClient>(
      'SELECT * FROM dcr_clients WHERE client_id = $1',
      [req.params.client_id],
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'not_found' });
      return;
    }
    const { client_secret_hash: _, ...safe } = result.rows[0];
    res.json(safe);
  });

  return router;
}
