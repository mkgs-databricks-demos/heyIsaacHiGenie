import { Router } from 'express';
import { extractOboIdentity } from '../middleware/auth.js';
import type { Db } from '../db/index.js';
import type { ProjectMember, Message } from '../../src/db/types.js';

/**
 * Human-authored chat send — human-OBO authenticated (no persona token required).
 *
 * The MCP `send_message` tool is agent-only: it always writes
 * `parent_agent_id = <persona agent>`, `role = 'assistant'`, `author_user_id = NULL`,
 * so a human operator's messages and an agent's replies are byte-for-byte
 * identical in storage and the client can't compute ownership after a reload.
 * This route is the human path: authenticated purely by the human's OBO identity,
 * it persists the message with `role = 'user'`, `author_user_id = lower(OBO email)`,
 * `parent_agent_id = NULL`. Ownership (`isMine`) is then derivable from persisted
 * data alone (role + author_user_id vs the viewer's own email), correct across
 * reloads and across multiple distinct humans on the same project.
 *
 * NOTIFY is unaffected: migration 006 installs an AFTER INSERT ON messages
 * FOR EACH ROW trigger, so this insert path fires `hi_genie_messages` exactly
 * like the MCP path — no per-path wiring.
 */
export function messagesRouter(db: Db): Router {
  const router = Router();

  // POST /api/threads/:thread_id/messages
  router.post('/:thread_id/messages', async (req, res) => {
    const human = extractOboIdentity(req);
    if (!human) {
      return res.status(401).json({ error: 'unauthenticated' });
    }

    const { thread_id } = req.params;
    const { content, to_agent_id, to_nickname } = req.body as {
      content?: string;
      to_agent_id?: string;
      to_nickname?: string;
    };
    if (typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ error: 'content required' });
    }

    try {
      // project_id is derived from the thread row — never accepted from the body.
      const threadRow = await db.query<{ project_id: string }>(
        'SELECT project_id FROM threads WHERE id = $1',
        [thread_id],
      );
      if (threadRow.rows.length === 0) {
        return res.status(404).json({ error: 'not_found', message: 'Thread not found' });
      }
      const projectId = threadRow.rows[0].project_id;

      // Authorize: the human must be a member of the thread's project. Same
      // extractOboIdentity + project_members check pattern as bootstrap.ts.
      const memberResult = await db.query<ProjectMember>(
        'SELECT * FROM project_members WHERE project_id = $1 AND user_id = lower($2)',
        [projectId, human],
      );
      if (memberResult.rows.length === 0) {
        return res.status(403).json({ error: 'forbidden', message: 'Not a member of this project' });
      }

      // Resolve the target agent within the thread's project, mirroring the MCP
      // send_message resolution (WHERE nickname = ...). Either to_nickname or an
      // explicit to_agent_id is accepted; both are validated against the project.
      let resolvedToAgentId: string | null = null;
      if (to_nickname) {
        const agentResult = await db.query<{ id: string }>(
          'SELECT id FROM agents WHERE project_id = $1 AND nickname = $2',
          [projectId, to_nickname],
        );
        if (agentResult.rows.length === 0) {
          return res.status(400).json({ error: `Agent "${to_nickname}" not found` });
        }
        resolvedToAgentId = agentResult.rows[0].id;
      } else if (to_agent_id) {
        const agentResult = await db.query<{ id: string }>(
          'SELECT id FROM agents WHERE project_id = $1 AND id = $2',
          [projectId, to_agent_id],
        );
        if (agentResult.rows.length === 0) {
          return res.status(400).json({ error: 'to_agent_id not found in this project' });
        }
        resolvedToAgentId = agentResult.rows[0].id;
      }

      // Insert under the human's RLS-scoped Postgres role (db.asUser). role='user',
      // author_user_id=lower(OBO email), parent_agent_id=NULL — satisfies the
      // messages CHECK ((author_user_id IS NULL) <> (parent_agent_id IS NULL)).
      const result = await db.asUser(req).query<Message>(
        `INSERT INTO messages
           (id, thread_id, author_user_id, parent_agent_id, to_agent_id, content, role, created_at)
         VALUES (gen_random_uuid(), $1, lower($2), NULL, $3, $4, 'user', now())
         RETURNING id, thread_id, author_user_id, parent_agent_id, to_agent_id, content, role, created_at`,
        [thread_id, human, resolvedToAgentId, content],
      );
      return res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('[messages] send error:', err);
      return res.status(500).json({ error: 'internal_error' });
    }
  });

  return router;
}
