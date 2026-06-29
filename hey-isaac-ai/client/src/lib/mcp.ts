interface McpResponse {
  result?: {
    content?: Array<{ type: string; text: string }>;
    isError?: boolean;
  };
  error?: { code: number; message: string };
}

export async function callMcp<T>(
  tool: string,
  args: Record<string, unknown>,
  personaToken: string,
): Promise<T> {
  const response = await fetch('/mcp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
      'X-Persona-Token': personaToken,
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'tools/call',
      params: { name: tool, arguments: args },
      id: Date.now(),
    }),
  });

  if (!response.ok) {
    throw new Error(`MCP HTTP ${response.status}: ${response.statusText}`);
  }

  const text = await response.text();
  // SSE body: "event: message\ndata: {...}\n\n"
  const dataLine = text.split('\n').find(l => l.startsWith('data: '));
  if (!dataLine) throw new Error('No SSE data line in MCP response');

  const parsed = JSON.parse(dataLine.slice(6)) as McpResponse;

  if (parsed.error) throw new Error(parsed.error.message);
  if (parsed.result?.isError) {
    throw new Error(parsed.result.content?.[0]?.text ?? 'MCP tool error');
  }

  const payload = parsed.result?.content?.[0]?.text;
  if (payload === undefined) throw new Error('Empty MCP result');

  return JSON.parse(payload) as T;
}
