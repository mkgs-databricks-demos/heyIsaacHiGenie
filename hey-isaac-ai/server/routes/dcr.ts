import { Router } from 'express';
import { randomUUID } from 'crypto';

// In-memory client registry — spike only.
// Production: move registrations to Lakebase (dcr_clients table).
const registry = new Map<string, { client_secret: string; metadata: Record<string, unknown> }>();

export function dcrRouter() {
  const router = Router();

  // RFC 7591 — Dynamic Client Registration endpoint.
  // Databricks calls this when auto-registering the UC HTTP connection.
  router.post('/', (req, res) => {
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
    const client_id_issued_at = Math.floor(Date.now() / 1000);

    registry.set(client_id, {
      client_secret,
      metadata: { client_name, redirect_uris, grant_types, ...rest },
    });

    console.log(`[dcr] registered client: ${client_id} (${client_name})`);

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
  router.get('/:client_id', (req, res) => {
    const entry = registry.get(req.params.client_id);
    if (!entry) {
      res.status(404).json({ error: 'not_found' });
      return;
    }
    res.json({ client_id: req.params.client_id, ...entry.metadata });
  });

  return router;
}
