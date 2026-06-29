import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { SignJWT } from 'jose';
import { z } from 'zod';
import { extractOboIdentity } from '../middleware/auth.js';
import type { Db } from '../db/index.js';
import type { Agent, ProjectMember, AgentGrant } from '../../src/db/types.js';

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

export function personaTokenRouter(db: Db) {
  const router = Router();

  // POST /token/persona
  // Requires OBO identity (Databricks-injected headers).
  // Returns a signed JWT the agent attaches as X-Persona-Token on MCP calls.
  router.post('/persona', limiter, async (req, res) => {
    // Human identity comes ONLY from OBO headers, never from the request body.
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

    const issuer = process.env.HI_GENIE_PERSONA_ISSUER || '';
    if (!issuer) {
      res.status(503).json({
        error: 'not_configured',
        message: 'Persona token issuer not configured — set HI_GENIE_PERSONA_ISSUER',
      });
      return;
    }

    const { persona, project_id } = parsed.data;

    // B3: Project membership check
    const memberResult = await db.query<ProjectMember>(
      'SELECT * FROM project_members WHERE project_id = $1 AND user_id = lower($2)',
      [project_id, human],
    );
    if (memberResult.rows.length === 0) {
      res.status(403).json({ error: 'forbidden', message: 'Not a member of this project' });
      return;
    }

    // B3: Agent lookup by nickname
    const agentResult = await db.query<Agent>(
      'SELECT * FROM agents WHERE project_id = $1 AND nickname = $2',
      [project_id, persona],
    );
    if (agentResult.rows.length === 0) {
      res.status(404).json({ error: 'not_found', message: `Agent with nickname "${persona}" not found in project` });
      return;
    }
    const agent = agentResult.rows[0];

    // B3: Grant check — user must have a grant for this agent
    const grantResult = await db.query<AgentGrant>(
      'SELECT * FROM agent_grants WHERE agent_id = $1 AND user_id = lower($2)',
      [agent.id, human],
    );
    if (grantResult.rows.length === 0) {
      res.status(403).json({ error: 'forbidden', message: 'No grant for this agent' });
      return;
    }

    const audience = process.env.HI_GENIE_PERSONA_AUDIENCE || 'mcp';
    const jti = randomUUID();
    const secret = new TextEncoder().encode(key);

    const token = await new SignJWT({ sub: human, persona, project_id, agent_id: agent.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setJti(jti)
      .setAudience(audience)
      .setIssuedAt()
      .setExpirationTime('1h')
      .setIssuer(issuer)
      .sign(secret);

    // B2: Persist JTI to DB
    await db.query(
      `INSERT INTO persona_token_jti (jti, human, persona, project_id, agent_id, issued_at, expires_at)
       VALUES ($1, lower($2), $3, $4, $5, now(), now() + interval '1 hour')`,
      [jti, human, persona, project_id, agent.id],
    );

    // Opportunistic cleanup of expired JTIs — fire-and-forget
    db.query('DELETE FROM persona_token_jti WHERE expires_at < now()').catch(() => undefined);

    if (process.env.NODE_ENV === 'development') {
      console.log(`[persona-token] issued: human=${human} persona=${persona} project=${project_id} agent=${agent.id}`);
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
