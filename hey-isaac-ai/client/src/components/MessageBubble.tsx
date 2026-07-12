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
          borderRadius: 'var(--radius)',
          background: isMine ? 'var(--primary)' : 'var(--card)',
          color: isMine ? 'var(--primary-foreground)' : 'var(--card-foreground)',
          border: isMine ? 'none' : '1px solid var(--border)',
          fontSize: 14,
          lineHeight: 1.5,
          wordBreak: 'break-word',
        }}
      >
        {message.content}
      </div>
      <span
        style={{
          fontSize: 11,
          color: 'var(--muted-foreground)',
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
