import { Avatar, AvatarFallback } from '@databricks/appkit-ui/react';
import type { Identity } from '../lib/types';

interface HeaderProps {
  identity: Identity | null;
}

function initials(email: string): string {
  const parts = email.split('@')[0].split(/[._-]/);
  return parts
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase() ?? '')
    .join('');
}

export default function Header({ identity }: HeaderProps) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: 56,
        background: 'var(--db-surface)',
        borderBottom: '2px solid var(--db-border)',
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 22 }}>🪔</span>
        <h1
          className="display-font"
          style={{
            margin: 0,
            fontSize: 20,
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ color: 'var(--db-navy)' }}>Hey Isaac?</span>
          {'  '}
          <span style={{ color: 'var(--db-red)' }}>Hi Genie!</span>
          <span className="sparkle"> ✦</span>
        </h1>
      </div>

      {identity && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontSize: 13,
              color: 'var(--db-text-muted)',
              maxWidth: 200,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {identity.email}
          </span>
          <Avatar>
            <AvatarFallback
              style={{
                background: 'var(--db-navy)',
                color: 'var(--db-cream)',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {initials(identity.email)}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </header>
  );
}
