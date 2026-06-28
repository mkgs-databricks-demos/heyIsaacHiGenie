import { Router } from 'express';

export function wellKnownRouter() {
  const router = Router();

  // TODO Phase 0: confirm that Databricks UC HTTP connection correctly discovers registration_endpoint from this response
  router.get('/oauth-authorization-server', (_req, res) => {
    const appUrl = (process.env.HI_GENIE_APP_URL || '').replace(/\/$/, '');
    if (!appUrl) {
      res.status(503).json({
        error: 'not_configured',
        message: 'OAuth authorization server issuer not configured — set HI_GENIE_APP_URL',
      });
      return;
    }

    res.json({
      issuer: appUrl,
      registration_endpoint: `${appUrl}/register`,
      response_types_supported: ['code'],
      grant_types_supported: ['authorization_code'],
    });
  });

  return router;
}
