import type { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';

export interface AuthContext {
  human: string;       // email from OBO (Databricks-injected header)
  persona?: string;    // from verified persona token
  project_id?: string; // from verified persona token
}

declare global {
  namespace Express {
    interface Request {
      ctx?: AuthContext;
    }
  }
}

// Databricks Apps inject the authenticated user's email into request headers.
// The exact header name needs to be confirmed during the spike.
const OBO_HEADER_CANDIDATES = [
  'x-forwarded-user',
  'x-databricks-user-email',
  'x-ms-client-principal-name',
] as const;

export function extractOboIdentity(req: Request): string | null {
  for (const header of OBO_HEADER_CANDIDATES) {
    const val = req.headers[header];
    if (typeof val === 'string' && val.length > 0) return val;
  }
  return null;
}

export async function verifyPersonaToken(
  token: string,
  issuer: string,
): Promise<{ sub: string; persona: string; project_id: string } | null> {
  const key = process.env.HI_GENIE_JWT_SIGNING_KEY;
  if (!key) return null;
  try {
    const secret = new TextEncoder().encode(key);
    const audience = process.env.HI_GENIE_PERSONA_AUDIENCE || 'mcp';
    const { payload } = await jwtVerify(token, secret, { issuer, audience });
    const { sub, persona, project_id, jti } = payload as Record<string, unknown>;
    if (
      typeof sub !== 'string' ||
      typeof persona !== 'string' ||
      typeof project_id !== 'string' ||
      typeof jti !== 'string' ||
      jti.length === 0
    ) {
      return null;
    }
    return { sub, persona, project_id };
  } catch {
    return null;
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const human = extractOboIdentity(req);
  if (!human) {
    res.status(401).json({ error: 'unauthenticated', message: 'No OBO identity in request headers' });
    return;
  }

  const ctx: AuthContext = { human };

  const personaToken = req.headers['x-persona-token'];
  if (typeof personaToken === 'string') {
    const issuer = process.env.HI_GENIE_PERSONA_ISSUER;
    if (issuer) {
      const claims = await verifyPersonaToken(personaToken, issuer);
      if (claims && claims.sub === human) {
        ctx.persona = claims.persona;
        ctx.project_id = claims.project_id;
      }
    }
  }

  req.ctx = ctx;
  next();
}
