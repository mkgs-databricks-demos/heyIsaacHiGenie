import type { Request, Response, NextFunction } from 'express';
import { jwtVerify, decodeJwt } from 'jose';
import type { Db } from '../db/index.js';

export function extractOboIdentity(req: Request): string | null {
  // Try x-forwarded-access-token JWT sub first
  const accessToken = req.headers['x-forwarded-access-token'];
  if (typeof accessToken === 'string' && accessToken.length > 0) {
    try {
      const payload = decodeJwt(accessToken);
      if (typeof payload.sub === 'string' && payload.sub.includes('@')) {
        return payload.sub.toLowerCase();
      }
    } catch {
      // fall through to header candidates
    }
  }

  // Fallback: scan header candidates in order, skip numeric user IDs
  const OBO_HEADER_CANDIDATES = [
    'x-forwarded-email',
    'x-forwarded-user',
    'x-databricks-user-email',
    'x-ms-client-principal-name',
  ] as const;
  for (const header of OBO_HEADER_CANDIDATES) {
    const val = req.headers[header];
    if (typeof val === 'string' && val.length > 0) {
      // Skip numeric Databricks user IDs like "1234567890@1234567890"
      if (header === 'x-forwarded-user' && /^\d+@\d+$/.test(val)) continue;
      return val.toLowerCase();
    }
  }
  return null;
}

interface PersonaClaims {
  sub: string;
  persona: string;
  project_id: string;
  agent_id: string;
  jti: string;
}

async function verifyPersonaToken(
  token: string,
  issuer: string,
): Promise<PersonaClaims | null> {
  const key = process.env.HI_GENIE_JWT_SIGNING_KEY;
  if (!key) return null;
  try {
    const secret = new TextEncoder().encode(key);
    const audience = process.env.HI_GENIE_PERSONA_AUDIENCE || 'mcp';
    const { payload } = await jwtVerify(token, secret, { issuer, audience });
    const { sub, persona, project_id, agent_id, jti } = payload as Record<string, unknown>;
    if (
      typeof sub !== 'string' ||
      typeof persona !== 'string' ||
      typeof project_id !== 'string' ||
      typeof agent_id !== 'string' ||
      typeof jti !== 'string' ||
      jti.length === 0
    ) {
      return null;
    }
    return { sub, persona, project_id, agent_id, jti };
  } catch {
    return null;
  }
}

export function createAuthMiddleware(db: Db) {
  return async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    const human = extractOboIdentity(req);
    if (!human) {
      res.status(401).json({ error: 'unauthenticated', message: 'No OBO identity in request headers' });
      return;
    }

    req.user = human;

    const personaToken = req.headers['x-persona-token'];
    if (typeof personaToken === 'string') {
      const issuer = process.env.HI_GENIE_PERSONA_ISSUER;
      if (issuer) {
        const claims = await verifyPersonaToken(personaToken, issuer);
        if (claims && claims.sub === human) {
          // Verify JTI exists in DB and hasn't expired
          const jtiRow = await db.query<{ jti: string; human: string; project_id: string | null; agent_id: string | null }>(
            'SELECT jti, human, project_id, agent_id FROM persona_token_jti WHERE jti = $1 AND expires_at > now()',
            [claims.jti],
          );
          if (jtiRow.rows.length > 0) {
            const row = jtiRow.rows[0];
            if (row.human === human && row.project_id === claims.project_id && row.agent_id === claims.agent_id) {
              req.persona = claims.persona;
              req.agentId = claims.agent_id;
            }
          }
        }
      }
    }

    next();
  };
}

export function createRequirePersona(db: Db) {
  const auth = createAuthMiddleware(db);
  return async function requirePersona(req: Request, res: Response, next: NextFunction): Promise<void> {
    await auth(req, res, async () => {
      if (!req.persona || !req.agentId) {
        res.status(401).json({ error: 'persona_required', message: 'A valid persona token with persona and agent_id claims is required' });
        return;
      }
      next();
    });
  };
}
