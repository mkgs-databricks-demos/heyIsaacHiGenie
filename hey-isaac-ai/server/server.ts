import express from 'express';
import { createApp, server, lakebase } from '@databricks/appkit';
import { extractOboIdentity } from './middleware/auth.js';
import { mcpRouter } from './routes/mcp.js';
import { dcrRouter } from './routes/dcr.js';
import { personaTokenRouter } from './routes/persona-token.js';

if (!process.env.HI_GENIE_JWT_SIGNING_KEY) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('[auth] HI_GENIE_JWT_SIGNING_KEY not set — persona tokens will fail. Set it in server/.env');
  } else {
    throw new Error('HI_GENIE_JWT_SIGNING_KEY is required');
  }
}

const AppKit = await createApp({
  plugins: [server(), lakebase()],

  async onPluginsReady(appkit) {
    appkit.server.extend((app) => {
      app.use(express.json());

      // MCP streamable-HTTP endpoint (RFC — MCP 2025-03 transport spec)
      app.use('/mcp', mcpRouter());

      // OAuth 2.0 Dynamic Client Registration (RFC 7591)
      // Databricks calls this when auto-registering the UC HTTP connection.
      app.use('/register', dcrRouter());

      // Persona token issuer — agents call this to get a signed persona JWT
      app.use('/token', personaTokenRouter());

      // Identity debug — useful during spike to confirm OBO headers
      app.get('/api/me', (req, res) => {
        const human = extractOboIdentity(req);
        if (!human) {
          res.status(401).json({ error: 'unauthenticated' });
          return;
        }
        res.json({
          email: human,
          oboHeaders: Object.fromEntries(
            ['x-forwarded-user', 'x-databricks-user-email', 'x-ms-client-principal-name']
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
