import { useState, useEffect, useRef, useCallback } from 'react';
import { Badge, Button, ScrollArea, Textarea, Alert, AlertDescription } from '@databricks/appkit-ui/react';
import { callMcp } from '../lib/mcp';
import MessageBubble from './MessageBubble';
import SessionSummariesPanel from './SessionSummariesPanel';
import type { AgentConfig, Message } from '../lib/types';

const POLL_INTERVAL_MS = 3000;

interface GetMessagesResult {
  messages: Message[];
  next_cursor: string | null;
}

interface ChatViewProps {
  threadId: string;
  // The live roster entry for the agent this thread targets — its nickname
  // drives message routing and its label/color drive the header.
  agent: AgentConfig;
  // The current viewer's own OBO email. Human-authored messages persist with
  // author_user_id = lower(this email); isMine compares against it, so ownership
  // is derived purely from persisted data — reload-safe and multi-human-correct.
  ownEmail: string;
  threadTitle: string;
  personaToken: string;
  onBack: () => void;
}

export default function ChatView({
  threadId,
  agent,
  ownEmail,
  threadTitle,
  personaToken,
  onBack,
}: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const result = await callMcp<GetMessagesResult>(
        'get_messages',
        { thread_id: threadId, limit: 100 },
        personaToken,
      );
      setMessages(result.messages);
    } catch {
      // Silently swallow poll errors to avoid spamming the UI
    }
  }, [threadId, personaToken]);

  // Initial load + polling
  useEffect(() => {
    void fetchMessages();
    const interval = setInterval(() => void fetchMessages(), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  async function handleSend() {
    const content = draft.trim();
    if (!content || sending) return;
    setSending(true);
    setError(null);
    try {
      // Human-authored sends go through the OBO REST route, NOT MCP send_message
      // (which is agent-only and would attribute this to the persona agent). The
      // route persists role='user', author_user_id=lower(OBO email). agent.persona
      // is the roster nickname (App maps AgentConfig.persona from
      // RosterAgent.nickname), resolved server-side to route to the selected agent.
      const res = await fetch(`/api/threads/${threadId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, to_nickname: agent.persona }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
        throw new Error(body.message ?? body.error ?? `Send failed (${res.status})`);
      }
      const msg = (await res.json()) as Message;
      setMessages(prev => [...prev.filter(m => m.id !== msg.id), msg]);
      setDraft('');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  // A message is "mine" only when it is human-authored (role='user') and its
  // persisted author_user_id matches the current viewer's own OBO email. This is
  // derived purely from persisted fields, so it is reload-safe (no in-session
  // Set) and multi-human-correct: a different human's 'user' message and any
  // agent's 'assistant' reply both render as "not mine".
  function isMine(msg: Message): boolean {
    return msg.role === 'user' && msg.author_user_id?.toLowerCase() === ownEmail.toLowerCase();
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        background: 'var(--background)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minWidth: 0,
        }}
      >
        {/* Thread header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 20px',
            background: 'var(--card)',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}
        >
          <Button
            variant="outline"
            onClick={onBack}
            aria-label="Back to project"
            style={{ padding: '4px 10px', fontSize: 13 }}
          >
            ← Back
          </Button>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div
              style={{
                fontSize: 16,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {threadTitle}
            </div>
          </div>
          <Badge
            variant="secondary"
            style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <span
              aria-hidden
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: agent.color,
                display: 'inline-block',
              }}
            />
            {agent.label}
          </Badge>
        </div>

        {/* Message list */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {messages.length === 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: 12,
                color: 'var(--muted-foreground)',
              }}
            >
              <span style={{ fontSize: 40 }}>🪔</span>
              <p style={{ margin: 0, fontSize: 14, textAlign: 'center' }}>
                No messages yet.
                <br />
                Send one to get started!
              </p>
            </div>
          )}
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} isMine={isMine(msg)} />
          ))}
        </div>

        {/* Error banner */}
        {error && (
          <Alert
            variant="destructive"
            style={{
              margin: '0 20px 8px',
              flexShrink: 0,
            }}
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Input bar */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            padding: '12px 20px',
            background: 'var(--card)',
            borderTop: '1px solid var(--border)',
            flexShrink: 0,
          }}
        >
          <Textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${agent.label}… (Enter to send, Shift+Enter for newline)`}
            aria-label="Message input"
            rows={2}
            style={{
              flex: 1,
              resize: 'none',
              fontSize: 14,
            }}
          />
          <Button
            onClick={() => void handleSend()}
            disabled={!draft.trim() || sending}
            aria-label="Send message"
            style={{ alignSelf: 'flex-end' }}
          >
            {sending ? '…' : 'Send'}
          </Button>
        </div>
      </div>

      <SessionSummariesPanel threadId={threadId} personaToken={personaToken} />
    </div>
  );
}
