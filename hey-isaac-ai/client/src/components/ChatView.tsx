import { useState, useEffect, useRef, useCallback } from 'react';
import { Button, ScrollArea, Textarea, Alert, AlertDescription } from '@databricks/appkit-ui/react';
import { callMcp } from '../lib/mcp';
import MessageBubble from './MessageBubble';
import type { Message } from '../lib/types';

const GENIE_AGENT_ID = '00000000-0000-0000-0000-000000000002';
const POLL_INTERVAL_MS = 3000;

interface GetMessagesResult {
  messages: Message[];
  next_cursor: string | null;
}

interface ChatViewProps {
  threadId: string;
  agentId: string;
  threadTitle: string;
  personaToken: string;
  onBack: () => void;
}

export default function ChatView({
  threadId,
  agentId: _agentId,
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
        { thread_id: threadId, content, to_nickname: 'genie' },
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

  // A message is "mine" if we sent it OR if it's from the genie persona (same actor)
  function isMine(msg: Message): boolean {
    return sentIds.has(msg.id) || msg.parent_agent_id === GENIE_AGENT_ID;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--db-cream)',
      }}
    >
      {/* Thread header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 20px',
          background: 'var(--db-surface)',
          borderBottom: '2px solid var(--db-border)',
          flexShrink: 0,
        }}
      >
        <Button
          variant="outline"
          onClick={onBack}
          aria-label="Back to project"
          style={{
            padding: '4px 10px',
            fontSize: 13,
            borderColor: 'var(--db-border)',
            color: 'var(--db-navy)',
          }}
        >
          ← Back
        </Button>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div
            className="display-font"
            style={{
              fontSize: 16,
              color: 'var(--db-navy)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {threadTitle}
          </div>
        </div>
        <div
          style={{
            fontSize: 11,
            background: 'rgba(244,161,0,0.15)',
            color: 'var(--db-gold)',
            border: '1px solid var(--db-gold)',
            borderRadius: 12,
            padding: '2px 8px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          🪔 genie
        </div>
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
              color: 'var(--db-text-muted)',
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
          style={{
            margin: '0 20px 8px',
            borderColor: 'var(--db-red)',
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
          background: 'var(--db-surface)',
          borderTop: '2px solid var(--db-border)',
          flexShrink: 0,
        }}
      >
        <Textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Genie… (Enter to send, Shift+Enter for newline)"
          aria-label="Message input"
          rows={2}
          style={{
            flex: 1,
            resize: 'none',
            fontSize: 14,
            borderColor: 'var(--db-border)',
            borderRadius: 8,
          }}
        />
        <Button
          onClick={() => void handleSend()}
          disabled={!draft.trim() || sending}
          aria-label="Send message"
          style={{
            background: 'var(--db-red)',
            color: '#fff',
            border: 'none',
            fontWeight: 600,
            fontSize: 14,
            alignSelf: 'flex-end',
            padding: '8px 20px',
          }}
        >
          {sending ? '…' : 'Send'}
        </Button>
      </div>
    </div>
  );
}
