import { useState, useEffect, useRef, useCallback } from 'react';
import { Badge, Button, ScrollArea, Textarea, Alert, AlertDescription } from '@databricks/appkit-ui/react';
import { callMcp } from '../lib/mcp';
import MessageBubble from './MessageBubble';
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
  // The agent id of the persona the human is operating as (the persona token's
  // agent). Messages the human sends persist with parent_agent_id === this, so
  // it is the reload-safe signal for "mine".
  ownAgentId: string;
  threadTitle: string;
  personaToken: string;
  onBack: () => void;
}

export default function ChatView({
  threadId,
  agent,
  ownAgentId,
  threadTitle,
  personaToken,
  onBack,
}: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
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
      const msg = await callMcp<Message>(
        'send_message',
        // agent.persona is the roster nickname (App maps AgentConfig.persona
        // from RosterAgent.nickname); send_message resolves the target agent by
        // `WHERE nickname = to_nickname`, so this routes to the selected agent.
        { thread_id: threadId, content, to_nickname: agent.persona },
        personaToken,
      );
      setSentIds(prev => new Set([...prev, msg.id]));
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

  // A message is "mine" when it was authored by the persona the human operates
  // as. Every message persists with parent_agent_id set to its author agent
  // (send_message attributes to the caller's persona; role is always
  // 'assistant' and so cannot distinguish sender from responder), so comparing
  // against ownAgentId is reload-safe — it does not depend on the transient
  // sentIds set, which is empty after a refetch. sentIds is still OR'd in to
  // cover the optimistic append before the send response's fields are read.
  function isMine(msg: Message): boolean {
    return msg.parent_agent_id === ownAgentId || sentIds.has(msg.id);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--background)',
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
  );
}
