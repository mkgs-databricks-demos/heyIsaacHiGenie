import express from 'express';
import { createApp, server, lakebase } from '@databricks/appkit';
import { extractOboIdentity } from './middleware/auth.js';
import { mcpRouter } from './routes/mcp.js';
import { dcrRouter } from './routes/dcr.js';
import { personaTokenRouter } from './routes/persona-token.js';
import { wellKnownRouter } from './routes/well-known.js';
import type { Db } from './db/index.js';
import { installLakebaseSearchPath } from './db/searchPath.js';
import { runMigrations } from './migrations/migrate.js';
import { SERVER_INFO } from './constants.js';

export { SERVER_INFO };

if (!process.env.HI_GENIE_JWT_SIGNING_KEY) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('[auth] HI_GENIE_JWT_SIGNING_KEY not set — persona tokens will fail. Set it in server/.env');
  } else {
    throw new Error('HI_GENIE_JWT_SIGNING_KEY is required');
  }
}

// Must run before createApp(): @databricks/lakebase's parsePoolConfig() drops
// pool.options ('-c search_path=...') entirely, so it never reaches pg.Pool —
// confirmed live (crashed prod with `relation "project_members" does not
// exist` on every persona-token/MCP call after the app-schema migration).
// See server/db/searchPath.ts for the full mechanism and why this is the only
// reliable fix available from application code.
installLakebaseSearchPath();

const AppKit = createApp({
  plugins: [server(), lakebase()],

  async onPluginsReady(appkit) {
    const db = appkit.lakebase as unknown as Db;

    try {
      await runMigrations(db);
    } catch (err) {
      console.error('[startup] Migration failed — halting:', err);
      throw err; // crash loudly; do not start with bad schema
    }

    appkit.server.extend((app) => {
      app.use(express.json());

      // MCP streamable-HTTP endpoint (RFC — MCP 2025-03 transport spec)
      app.use('/mcp', mcpRouter(db));

      // OAuth 2.0 Dynamic Client Registration (RFC 7591)
      // Databricks calls this when auto-registering the UC HTTP connection.
      app.use('/register', dcrRouter(db));

      // OAuth 2.0 Authorization Server Metadata (RFC 8414)
      // Databricks discovers the Dynamic Client Registration endpoint here.
      app.use('/.well-known', wellKnownRouter());

      // Persona token issuer — agents call this to get a signed persona JWT
      app.use('/token', personaTokenRouter(db));

      // Identity debug — useful during development to confirm OBO headers
      app.get('/api/me', (req, res) => {
        const human = extractOboIdentity(req);
        if (!human) {
          res.status(401).json({ error: 'unauthenticated' });
          return;
        }
        res.json({
          email: human,
          oboHeaders: Object.fromEntries(
            ['x-forwarded-email', 'x-forwarded-user', 'x-databricks-user-email', 'x-ms-client-principal-name']
              .filter(h => req.headers[h])
              .map(h => [h, req.headers[h]])
          ),
        });
      });

      app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));
    });
  },
});

export { AppKit };
