import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { SignJWT } from 'jose';
import { z } from 'zod';
import { extractOboIdentity } from '../middleware/auth.js';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

const IssueSchema = z.object({
  persona: z.string().min(1).describe('Agent nickname (e.g. "Isaac", "Genie")'),
  project_id: z.string().min(1).describe('Project identifier'),
});

export function personaTokenRouter() {
  const router = Router();

  // POST /token/persona
  // Requires OBO identity (Databricks-injected headers).
  // Returns a signed JWT the agent attaches as X-Persona-Token on MCP calls.
  router.post('/persona', limiter, async (req, res) => {
    const human = extractOboIdentity(req);
    if (!human) {
      res.status(401).json({
        error: 'unauthenticated',
        message: 'OBO identity required — authenticate via Databricks before issuing a persona token',
      });
      return;
    }

    const parsed = IssueSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'invalid_request', details: parsed.error.flatten() });
      return;
    }

    const key = process.env.HI_GENIE_JWT_SIGNING_KEY;
    if (!key) {
      res.status(503).json({
        error: 'not_configured',
        message: 'Persona token signing key not available — set HI_GENIE_JWT_SIGNING_KEY',
      });
      return;
    }

    const { persona, project_id } = parsed.data;
    const secret = new TextEncoder().encode(key);
    const issuer = process.env.HI_GENIE_PERSONA_ISSUER || '';
    if (!issuer) {
      res.status(503).json({
        error: 'not_configured',
        message: 'Persona token issuer not configured — set HI_GENIE_PERSONA_ISSUER',
      });
      return;
    }
    const audience = process.env.HI_GENIE_PERSONA_AUDIENCE || 'mcp';
    const jti = randomUUID();

    const token = await new SignJWT({ sub: human, persona, project_id })
      .setProtectedHeader({ alg: 'HS256' })
      .setJti(jti)
      .setAudience(audience)
      .setIssuedAt()
      .setExpirationTime('1h')
      .setIssuer(issuer)
      .sign(secret);

    if (process.env.NODE_ENV === 'development') {
      console.log(`[persona-token] issued: human=${human} persona=${persona} project=${project_id}`);
    }

    res.json({
      token,
      token_type: 'Bearer',
      expires_in: 3600,
      persona,
      project_id,
    });
  });

  return router;
}
