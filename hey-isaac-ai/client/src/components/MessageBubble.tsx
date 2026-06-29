import type { Message } from '../lib/types';

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
}

export default function MessageBubble({ message, isMine }: MessageBubbleProps) {
  const time = new Date(message.created_at).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isMine ? 'flex-end' : 'flex-start',
        marginBottom: 12,
      }}
    >
      <div
        style={{
          maxWidth: '72%',
          padding: '10px 14px',
          borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          background: isMine ? 'var(--db-red)' : 'var(--db-surface)',
          color: isMine ? '#fff' : 'var(--db-text)',
          border: isMine ? 'none' : '2px solid var(--db-gold)',
          fontSize: 14,
          lineHeight: 1.5,
          boxShadow: isMine
            ? '2px 2px 0 rgba(196,0,60,0.25)'
            : '2px 2px 0 var(--db-border)',
          wordBreak: 'break-word',
        }}
      >
        {message.content}
      </div>
      <span
        style={{
          fontSize: 11,
          color: 'var(--db-text-muted)',
          marginTop: 4,
          paddingLeft: isMine ? 0 : 2,
          paddingRight: isMine ? 2 : 0,
        }}
      >
        {time}
      </span>
    </div>
  );
}
