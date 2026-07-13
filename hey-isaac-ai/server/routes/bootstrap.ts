import { Router } from 'express';
import { extractOboIdentity } from '../middleware/auth.js';
import type { Db } from '../db/index.js';
import type { Project, ProjectMember, Agent } from '../../src/db/types.js';

/**
 * Bootstrap read route — human-OBO authenticated (no persona token required).
 *
 * The MCP tools (get_project_context, get_agent_roster) are persona-token-only,
 * which creates a chicken-and-egg: to mint a persona token the client needs an
 * agent nickname, but the roster that supplies real nicknames can only be read
 * with a persona token. This route breaks the cycle: authenticated purely by the
 * human's OBO identity, it returns the same project context + roster so the
 * client can discover the primary agent from LIVE data, then mint the working
 * persona token for that agent. No hardcoded bootstrap nickname is needed.
 *
 * It intentionally mirrors the membership check + roster SQL (including the
 * COALESCE label/color fallbacks) of the MCP tools so the two stay consistent.
 */
export function bootstrapRouter(db: Db): Router {
  const router = Router();

  // GET /api/bootstrap?project_id=<uuid>
  router.get('/', async (req, res) => {
    const human = extractOboIdentity(req);
    if (!human) {
      return res.status(401).json({ error: 'unauthenticated' });
    }

    const { project_id } = req.query as { project_id?: string };
    if (!project_id) return res.status(400).json({ error: 'project_id required' });

    try {
      const memberResult = await db.query<ProjectMember>(
        'SELECT * FROM project_members WHERE project_id = $1 AND user_id = lower($2)',
        [project_id, human],
      );
      if (memberResult.rows.length === 0) {
        return res.status(403).json({ error: 'forbidden', message: 'Not a member of this project' });
      }

      const projResult = await db.query<Project>('SELECT * FROM projects WHERE id = $1', [project_id]);
      if (projResult.rows.length === 0) {
        return res.status(404).json({ error: 'not_found', message: 'Project not found' });
      }

      // COALESCE'd label/color selected after a.* so they override the raw
      // (possibly-null) columns — the roster never returns null label/color.
      const rosterResult = await db.query<Agent & { grantee_id: string | null }>(
        `SELECT a.*,
                COALESCE(a.label, initcap(a.nickname)) AS label,
                COALESCE(a.color, '#4a86e8')           AS color,
                ag.user_id AS grantee_id
         FROM agents a
         LEFT JOIN agent_grants ag ON ag.agent_id = a.id AND ag.user_id = lower($2)
         WHERE a.project_id = $1
         ORDER BY a.nickname
         LIMIT 200`,
        [project_id, human],
      );

      return res.json({
        project: projResult.rows[0],
        membership: memberResult.rows[0],
        roster: rosterResult.rows,
      });
    } catch (err) {
      console.error('[bootstrap] error:', err);
      return res.status(500).json({ error: 'internal_error' });
    }
  });

  return router;
}
