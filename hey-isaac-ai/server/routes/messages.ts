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
 *
 * This router also owns the human per-thread read-state endpoints
 * (GET /unread-counts, POST /:thread_id/read). They use the same OBO identity +
 * project-membership pattern and back the Sidebar unread badges. This is
 * deliberately a human-facing REST mechanism, distinct from the agent-scoped
 * MCP `mark_messages_read` (messages.read_at / to_agent_id), which is untouched.
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

  // GET /api/threads/unread-counts?project_id=<uuid>
  //
  // Per-human unread counts across the threads of a project the caller belongs
  // to. Human identity is the OBO email; project membership is checked the same
  // way as list_threads / the send route. "Unread" = messages created after the
  // caller's own last_read_at for that thread (COALESCE'd to -infinity when the
  // caller has never opened it), excluding the caller's own human-authored
  // messages (you don't get an unread badge for your own sends).
  router.get('/unread-counts', async (req, res) => {
    const human = extractOboIdentity(req);
    if (!human) {
      return res.status(401).json({ error: 'unauthenticated' });
    }

    const projectId = req.query.project_id;
    if (typeof projectId !== 'string' || !projectId) {
      return res.status(400).json({ error: 'project_id required' });
    }

    try {
      // Authorize: caller must be a member of the requested project. Same
      // extractOboIdentity + project_members check as the send route.
      const memberResult = await db.query<ProjectMember>(
        'SELECT * FROM project_members WHERE project_id = $1 AND user_id = lower($2)',
        [projectId, human],
      );
      if (memberResult.rows.length === 0) {
        return res.status(403).json({ error: 'forbidden', message: 'Not a member of this project' });
      }

      // One row per thread in the project with the caller's unread count. The
      // messages join is scoped to created_at > the caller's last_read_at and
      // excludes the caller's own 'user' messages, so a thread the caller has
      // fully read (or only spoken in) reports 0.
      const result = await db.query<{ thread_id: string; unread_count: string }>(
        `SELECT t.id AS thread_id, COUNT(m.id) AS unread_count
           FROM threads t
           LEFT JOIN thread_read_state rs
             ON rs.thread_id = t.id AND rs.user_email = lower($2)
           LEFT JOIN messages m
             ON m.thread_id = t.id
            AND m.created_at > COALESCE(rs.last_read_at, '-infinity'::timestamptz)
            AND NOT (m.role = 'user' AND m.author_user_id = lower($2))
          WHERE t.project_id = $1
          GROUP BY t.id`,
        [projectId, human],
      );

      const counts: Record<string, number> = {};
      for (const row of result.rows) {
        counts[row.thread_id] = Number(row.unread_count);
      }
      return res.json({ counts });
    } catch (err) {
      console.error('[messages] unread-counts error:', err);
      return res.status(500).json({ error: 'internal_error' });
    }
  });

  // POST /api/threads/:thread_id/read
  //
  // Marks the thread read for the calling human as of now(). Upserts
  // (thread_id, lower(OBO email)) — keyed per human so distinct humans on the
  // same project never clobber each other's read state. project_id is derived
  // from the thread row (never trusted from the body); membership is enforced.
  router.post('/:thread_id/read', async (req, res) => {
    const human = extractOboIdentity(req);
    if (!human) {
      return res.status(401).json({ error: 'unauthenticated' });
    }

    const { thread_id } = req.params;

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

      const memberResult = await db.query<ProjectMember>(
        'SELECT * FROM project_members WHERE project_id = $1 AND user_id = lower($2)',
        [projectId, human],
      );
      if (memberResult.rows.length === 0) {
        return res.status(403).json({ error: 'forbidden', message: 'Not a member of this project' });
      }

      // Upsert under the human's RLS-scoped Postgres role (db.asUser). user_email
      // is always lower(OBO email) — never client-supplied — so a human can only
      // ever write their own read-state row.
      await db.asUser(req).query(
        `INSERT INTO thread_read_state (thread_id, user_email, last_read_at, updated_at)
         VALUES ($1, lower($2), now(), now())
         ON CONFLICT (thread_id, user_email)
         DO UPDATE SET last_read_at = now(), updated_at = now()`,
        [thread_id, human],
      );
      return res.json({ ok: true });
    } catch (err) {
      console.error('[messages] mark-read error:', err);
      return res.status(500).json({ error: 'internal_error' });
    }
  });

  return router;
}
