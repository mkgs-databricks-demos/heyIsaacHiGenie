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
  threadTitle: string;
  personaToken: string;
  onBack: () => void;
}

export default function ChatView({
  threadId,
  agent,
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

  // Ownership is derived from the message's author fields, per the get_messages
  // contract: the messages table enforces an XOR between author_user_id (human)
  // and parent_agent_id (agent), so a null parent_agent_id means human-authored.
  // Optimistically-appended sends stay "mine" via sentIds across poll refetches,
  // where the persisted row comes back attributed to the sending persona agent.
  function isMine(msg: Message): boolean {
    const { author_user_id } = msg as Message & { author_user_id: string | null };
    return sentIds.has(msg.id) || author_user_id != null;
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
