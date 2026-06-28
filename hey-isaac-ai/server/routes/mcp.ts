import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth.js';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// One McpServer per request (stateless for spike).
// Each server gets the auth context injected at construction time.
function buildMcpServer(human: string, persona?: string, project_id?: string) {
  const server = new McpServer({ name: 'hi-genie', version: '0.1.0' });

  server.tool(
    'whoami',
    'Return the authenticated identity for this MCP session (human + persona)',
    {},
    async () => ({
      content: [{
        type: 'text' as const,
        text: JSON.stringify({ human, persona: persona ?? null, project_id: project_id ?? null }, null, 2),
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

  return server;
}

export function mcpRouter() {
  const router = Router();

  router.post('/', limiter, authMiddleware, async (req, res) => {
    const { human, persona, project_id } = req.ctx!;
    const server = buildMcpServer(human, persona, project_id);
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });

    res.on('close', () => {
      transport.close().catch(() => undefined);
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  });

  return router;
}
