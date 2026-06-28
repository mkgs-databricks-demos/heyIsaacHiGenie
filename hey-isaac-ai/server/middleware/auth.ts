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

// Numeric-user-ID format injected by Databricks Apps proxy for direct API token auth
// Format: "1081964970114387@7474657291520070" (user_id@workspace_id)
const NUMERIC_USER_ID_RE = /^\d+@\d+$/;

function isNumericUserId(value: string): boolean {
  return NUMERIC_USER_ID_RE.test(value);
}

function extractSubFromJwt(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')
    ) as Record<string, unknown>;
    const sub = payload['sub'];
    if (typeof sub === 'string' && sub.length > 0 && !isNumericUserId(sub)) {
      return sub;
    }
    return null;
  } catch {
    return null;
  }
}

const OBO_HEADER_CANDIDATES = [
  'x-forwarded-email',          // Databricks Apps OIDC cookie flow — injects email directly
  'x-databricks-user-email',    // Alternative Databricks header
  'x-ms-client-principal-name', // Azure Static Web Apps (fallback)
  'x-forwarded-user',           // Databricks Apps direct API — injects numeric user ID format
] as const;

export function extractOboIdentity(req: Request): string | null {
  // First try: decode the OBO access token sub claim (most reliable email source)
  const oboToken = req.headers['x-forwarded-access-token'];
  if (typeof oboToken === 'string' && oboToken.length > 0) {
    const email = extractSubFromJwt(oboToken);
    if (email) return email;
  }

  // Second try: header-based extraction in priority order
  for (const header of OBO_HEADER_CANDIDATES) {
    const val = req.headers[header];
    if (typeof val === 'string' && val.length > 0) {
      if (isNumericUserId(val)) continue;
      return val;
    }
  }

  // Final fallback: accept numeric user ID if nothing better exists
  const forwardedUser = req.headers['x-forwarded-user'];
  if (typeof forwardedUser === 'string' && forwardedUser.length > 0) return forwardedUser;

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
