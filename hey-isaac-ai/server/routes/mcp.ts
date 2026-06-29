import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import { createRequirePersona } from '../middleware/auth.js';
import { registerTools } from '../mcp/tools.js';
import type { Db } from '../db/index.js';
import { SERVER_INFO } from '../constants.js';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

export function mcpRouter(db: Db) {
  const requirePersona = createRequirePersona(db);
  const router = Router();

  router.post('/', limiter, requirePersona, async (req, res) => {
    const server = new McpServer({ name: SERVER_INFO.name, version: SERVER_INFO.version });

    server.tool(
      'whoami',
      'Return the authenticated identity for this MCP session (human + persona)',
      {},
      async () => ({
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            human: req.user,
            persona: req.persona,
            agent_id: req.agentId,
          }, null, 2),
        }],
      }),
    );

    server.tool(
      'ping',
      'Echo a message back — basic health check',
      { message: z.string().optional().describe('Optional message to echo') },
      async ({ message }) => ({
        content: [{ type: 'text' as const, text: message ?? 'pong' }],
      }),
    );

    registerTools(server, db, req);

    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });

    res.on('close', () => {
      transport.close().catch(() => undefined);
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  });

  return router;
}
