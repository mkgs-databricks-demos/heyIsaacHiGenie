import type { Request } from 'express';
import { extractOboIdentity } from '../middleware/auth.js';
import type { Db } from '../db/index.js';

/**
 * Resolves the caller's OBO identity and confirms they are a project owner for
 * at least one project (or a workspace admin). Returns the lower-cased email on
 * success, or a structured failure describing the HTTP status to return.
 */
export async function requireOwner(
  req: Request,
  db: Db,
): Promise<{ ok: true; human: string } | { ok: false; status: number; error: string; message: string }> {
  const human = extractOboIdentity(req);
  if (!human) {
    return {
      ok: false,
      status: 401,
      error: 'unauthenticated',
      message: 'OBO identity required — authenticate via Databricks first',
    };
  }

  // Workspace admins pass regardless of project membership. Databricks injects
  // group membership in x-forwarded-* headers on some deployments; fall back to
  // the project_members role check which is always authoritative.
  const isAdmin = detectWorkspaceAdmin(req);

  if (!isAdmin) {
    const owned = await db.query<{ project_id: string }>(
      "SELECT project_id FROM project_members WHERE user_id = lower($1) AND role = 'owner' LIMIT 1",
      [human],
    );
    if (owned.rows.length === 0) {
      return {
        ok: false,
        status: 403,
        error: 'forbidden',
        message: 'Only project owners or workspace admins can manage GitHub App settings',
      };
    }
  }

  return { ok: true, human };
}

function detectWorkspaceAdmin(req: Request): boolean {
  const groups = req.headers['x-forwarded-groups'];
  if (typeof groups === 'string' && /\badmins\b/i.test(groups)) return true;
  return false;
}
