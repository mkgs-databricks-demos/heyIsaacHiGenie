import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { Request } from 'express';
import type { Db } from '../db/index.js';
import type {
  Project,
  ProjectMember,
  Agent,
  Thread,
  Message,
  SessionSummary,
  RepoConfig,
  AgentCheckoutSpec,
  PullRequest,
} from '../../src/db/types.js';

function err(text: string) {
  return { content: [{ type: 'text' as const, text: `Error: ${text}` }], isError: true };
}

function ok(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] };
}

export function registerTools(server: McpServer, db: Db, req: Request) {
  const human = req.user!;
  const agentId = req.agentId!;

  // Tool 1: get_project_context
  server.tool(
    'get_project_context',
    'Get project details and verify the calling user is a member',
    { project_id: z.string().describe('Project ID') },
    async ({ project_id }) => {
      const [projResult, memberResult] = await Promise.all([
        db.query<Project>('SELECT * FROM projects WHERE id = $1', [project_id]),
        db.query<ProjectMember>(
          'SELECT * FROM project_members WHERE project_id = $1 AND user_id = lower($2)',
          [project_id, human],
        ),
      ]);
      if (memberResult.rows.length === 0) return err('Not a member of this project');
      if (projResult.rows.length === 0) return err('Project not found');
      return ok({ project: projResult.rows[0], membership: memberResult.rows[0] });
    },
  );

  // Tool 2: get_agent_roster
  server.tool(
    'get_agent_roster',
    'List agents in a project with grant status for the calling user',
    { project_id: z.string().describe('Project ID') },
    async ({ project_id }) => {
      const memberCheck = await db.query<ProjectMember>(
        'SELECT * FROM project_members WHERE project_id = $1 AND user_id = lower($2)',
        [project_id, human],
      );
      if (memberCheck.rows.length === 0) return err('Not a member of this project');

      const result = await db.query<Agent & { grantee_id: string | null }>(
        `SELECT a.*, ag.user_id AS grantee_id
         FROM agents a
         LEFT JOIN agent_grants ag ON ag.agent_id = a.id AND ag.user_id = lower($2)
         WHERE a.project_id = $1
         ORDER BY a.nickname
         LIMIT 200`,
        [project_id, human],
      );
      return ok(result.rows);
    },
  );

  // Tool 3: start_thread
  server.tool(
    'start_thread',
    'Create a new thread in a project',
    {
      project_id: z.string().describe('Project ID'),
      task_id: z.string().optional().describe('Optional task ID to link'),
      title: z.string().optional().describe('Optional thread title'),
    },
    async ({ project_id, task_id, title }) => {
      const result = await db.asUser(req).query<Thread>(
        `INSERT INTO threads (id, project_id, task_id, title, created_by, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, lower($4), now(), now())
         RETURNING *`,
        [project_id, task_id ?? null, title ?? null, human],
      );
      return ok(result.rows[0]);
    },
  );

  // Tool 4: send_message
  server.tool(
    'send_message',
    'Send a message in a thread',
    {
      thread_id: z.string().describe('Thread ID'),
      content: z.string().describe('Message content'),
      to_nickname: z.string().optional().describe('Target agent nickname'),
    },
    async ({ thread_id, content, to_nickname }) => {
      let to_agent_id: string | null = null;
      if (to_nickname) {
        const agentResult = await db.query<{ id: string }>(
          `SELECT id FROM agents
           WHERE project_id = (SELECT project_id FROM threads WHERE id = $1)
             AND nickname = $2`,
          [thread_id, to_nickname],
        );
        if (agentResult.rows.length === 0) return err(`Agent "${to_nickname}" not found`);
        to_agent_id = agentResult.rows[0].id;
      }

      const result = await db.asUser(req).query<Message>(
        `INSERT INTO messages
           (id, thread_id, parent_agent_id, to_agent_id, content, role, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, 'assistant', now())
         RETURNING *`,
        [thread_id, agentId, to_agent_id, content],
      );
      return ok(result.rows[0]);
    },
  );

  // Tool 5: get_messages
  server.tool(
    'get_messages',
    'Retrieve messages from a thread with cursor pagination',
    {
      thread_id: z.string().describe('Thread ID'),
      limit: z.number().int().min(1).max(200).optional().describe('Max messages to return (default 50)'),
      cursor: z.string().optional().describe('Pagination cursor (message ID)'),
      unread_only: z.boolean().optional().describe('Only return unread messages addressed to the calling agent'),
    },
    async ({ thread_id, limit = 50, cursor, unread_only = false }) => {
      const result = await db.query<Message>(
        `SELECT * FROM messages
         WHERE thread_id = $1 AND ($2::uuid IS NULL OR id > $2::uuid)
           AND ($4::boolean IS FALSE OR (to_agent_id = $5 AND read_at IS NULL))
         ORDER BY created_at ASC
         LIMIT $3`,
        [thread_id, cursor ?? null, limit, unread_only, agentId],
      );
      const messages = result.rows;
      const next_cursor = messages.length === limit ? messages[messages.length - 1].id : null;
      return ok({ messages, next_cursor });
    },
  );

  // Tool 6: mark_messages_read
  server.tool(
    'mark_messages_read',
    'Mark messages as read up to a given message ID',
    {
      thread_id: z.string().describe('Thread ID'),
      up_to_message_id: z.string().describe('Mark all messages up to and including this ID as read'),
    },
    async ({ thread_id, up_to_message_id }) => {
      const result = await db.asUser(req).query<{ id: string }>(
        `UPDATE messages
         SET read_at = now()
         WHERE thread_id = $1
           AND to_agent_id = $2
           AND read_at IS NULL
           AND created_at <= (
             SELECT created_at FROM messages WHERE id = $3 AND thread_id = $1
           )
         RETURNING id`,
        [thread_id, agentId, up_to_message_id],
      );
      return ok({ updated_count: result.rowCount ?? result.rows.length });
    },
  );

  // Tool 7: write_session_summary
  server.tool(
    'write_session_summary',
    'Write a session summary for a thread',
    {
      thread_id: z.string().describe('Thread ID'),
      content: z.string().describe('Summary content'),
      summary_type: z.string().optional().describe('Summary type label'),
    },
    async ({ thread_id, content }) => {
      // summary_type not in Track A DDL schema — stored in summary field
      const result = await db.asUser(req).query<SessionSummary>(
        `INSERT INTO session_summaries
           (id, thread_id, parent_agent_id, summary, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, now())
         RETURNING *`,
        [thread_id, agentId, content],
      );
      return ok(result.rows[0]);
    },
  );

  // Tool 8: get_session_summaries
  server.tool(
    'get_session_summaries',
    'Retrieve session summaries for a thread with cursor pagination',
    {
      thread_id: z.string().describe('Thread ID'),
      limit: z.number().int().min(1).max(200).optional().describe('Max summaries to return (default 50)'),
      cursor: z.string().optional().describe('Pagination cursor (summary ID)'),
    },
    async ({ thread_id, limit = 50, cursor }) => {
      const result = await db.query<SessionSummary>(
        `SELECT * FROM session_summaries
         WHERE thread_id = $1 AND ($2::uuid IS NULL OR id > $2::uuid)
         ORDER BY created_at ASC
         LIMIT $3`,
        [thread_id, cursor ?? null, limit],
      );
      const summaries = result.rows;
      const next_cursor = summaries.length === limit ? summaries[summaries.length - 1].id : null;
      return ok({ summaries, next_cursor });
    },
  );

  // Tool 9: get_repo_config
  server.tool(
    'get_repo_config',
    'Get repository configuration for a project',
    { project_id: z.string().describe('Project ID') },
    async ({ project_id }) => {
      const memberCheck = await db.query<ProjectMember>(
        'SELECT * FROM project_members WHERE project_id = $1 AND user_id = lower($2)',
        [project_id, human],
      );
      if (memberCheck.rows.length === 0) return err('Not a member of this project');

      const result = await db.query<RepoConfig>(
        'SELECT * FROM repo_config WHERE project_id = $1',
        [project_id],
      );
      return ok(result.rows[0] ?? null);
    },
  );

  // Tool 10: get_my_checkout_spec
  server.tool(
    'get_my_checkout_spec',
    "Get the calling agent's checkout spec for a project",
    { project_id: z.string().describe('Project ID') },
    async ({ project_id }) => {
      // agent_checkout_spec is keyed by agent_id only (no project_id column in Track A DDL)
      void project_id;
      const result = await db.query<AgentCheckoutSpec>(
        'SELECT * FROM agent_checkout_spec WHERE agent_id = $1',
        [agentId],
      );
      return ok(result.rows[0] ?? null);
    },
  );

  // Tool 11: link_branch
  server.tool(
    'link_branch',
    "Set or update the calling agent's branch checkout spec",
    {
      project_id: z.string().describe('Project ID'),
      thread_id: z.string().describe('Thread ID'),
      branch_name: z.string().describe('Branch name'),
      repo_url: z.string().optional().describe('Repository URL (informational)'),
    },
    async ({ branch_name }) => {
      // agent_checkout_spec has: agent_id, clone_mode, worktree_path, base_branch, updated_at, updated_by
      // No project_id or repo_url columns in Track A DDL
      const result = await db.asUser(req).query<AgentCheckoutSpec>(
        `INSERT INTO agent_checkout_spec (agent_id, base_branch, clone_mode, worktree_path, updated_at, updated_by)
         VALUES ($1, $2, 'none', null, now(), lower($3))
         ON CONFLICT (agent_id) DO UPDATE
           SET base_branch = EXCLUDED.base_branch,
               updated_at = now(),
               updated_by = EXCLUDED.updated_by
         RETURNING *`,
        [agentId, branch_name, human],
      );
      return ok(result.rows[0]);
    },
  );

  // Tool 12: link_pull_request
  server.tool(
    'link_pull_request',
    'Link a pull request to a thread',
    {
      thread_id: z.string().describe('Thread ID'),
      pr_url: z.string().describe('Pull request URL'),
      title: z.string().optional().describe('PR title (informational)'),
      status: z.enum(['draft', 'open', 'merged', 'closed']).optional().describe('PR status'),
    },
    async ({ thread_id, pr_url, status = 'open' }) => {
      // Look up project_id from thread; repo_url derived from pr_url
      const threadRow = await db.query<{ project_id: string }>(
        'SELECT project_id FROM threads WHERE id = $1',
        [thread_id],
      );
      if (threadRow.rows.length === 0) return err('Thread not found');
      const project_id = threadRow.rows[0].project_id;

      // Derive repo_url from pr_url by stripping /pull/<number>
      const repoUrl = pr_url.replace(/\/pull\/\d+.*$/, '');

      const result = await db.asUser(req).query<PullRequest>(
        `INSERT INTO pull_requests
           (id, project_id, thread_id, repo_url, pr_url, status, opened_by, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, lower($6), now(), now())
         RETURNING *`,
        [project_id, thread_id, repoUrl, pr_url, status, human],
      );
      return ok(result.rows[0]);
    },
  );
}
