import { Avatar, AvatarFallback, Separator } from '@databricks/appkit-ui/react';
import type { Identity, Thread, View, AgentConfig } from '../lib/types';

interface SidebarProps {
  identity: Identity | null;
  threads: Thread[];
  view: View;
  agents: AgentConfig[];
  onNavigateProject: () => void;
  onNavigateChat: (thread: Thread, agentId: string) => void;
}

function initials(email: string): string {
  return email
    .split('@')[0]
    .split(/[._-]/)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase() ?? '')
    .join('');
}

export default function Sidebar({
  identity,
  threads,
  view,
  agents,
  onNavigateProject,
  onNavigateChat,
}: SidebarProps) {
  const isProjectActive = view.kind === 'project';

  return (
    <aside
      style={{
        width: 220,
        background: 'var(--db-navy)',
        color: 'var(--db-cream)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* App name */}
      <div style={{ padding: '20px 16px 12px' }}>
        <div
          className="display-font"
          style={{
            fontSize: 16,
            color: 'var(--db-cream)',
            letterSpacing: '0.3px',
          }}
        >
          Hi Genie <span className="sparkle">✦</span>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(253,246,236,0.5)', marginTop: 2 }}>
          multi-agent coordination
        </div>
      </div>

      <Separator style={{ background: 'rgba(253,246,236,0.12)', margin: '0 12px' }} />

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {/* Project */}
        <button
          onClick={onNavigateProject}
          aria-current={isProjectActive ? 'page' : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            padding: '8px 16px',
            background: isProjectActive ? 'rgba(255,54,33,0.2)' : 'transparent',
            border: 'none',
            borderLeft: isProjectActive ? '3px solid var(--db-red)' : '3px solid transparent',
            color: 'var(--db-cream)',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <span style={{ fontSize: 15 }}>🗂</span>
          <span>Project</span>
        </button>

        {/* Agents + their threads */}
        {agents.map(agent => {
          const agentThreads = threads.filter(t => t.id);
          return (
            <div key={agent.id}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 16px 6px 24px',
                  fontSize: 12,
                  color: 'rgba(253,246,236,0.7)',
                  fontWeight: 500,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: agent.color,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#fff',
                    flexShrink: 0,
                  }}
                >
                  {agent.label[0]}
                </span>
                {agent.label}
              </div>

              {agentThreads.length === 0 && (
                <div
                  style={{
                    padding: '4px 16px 4px 40px',
                    fontSize: 12,
                    color: 'rgba(253,246,236,0.35)',
                    fontStyle: 'italic',
                  }}
                >
                  No threads yet
                </div>
              )}

              {agentThreads.map(thread => {
                const isActive =
                  view.kind === 'chat' && view.threadId === thread.id;
                return (
                  <button
                    key={thread.id}
                    onClick={() => onNavigateChat(thread, agent.id)}
                    aria-current={isActive ? 'page' : undefined}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '5px 16px 5px 40px',
                      background: isActive ? 'rgba(255,54,33,0.2)' : 'transparent',
                      borderLeft: isActive
                        ? '3px solid var(--db-gold)'
                        : '3px solid transparent',
                      border: 'none',
                      color: isActive
                        ? 'var(--db-cream)'
                        : 'rgba(253,246,236,0.6)',
                      fontSize: 12,
                      cursor: 'pointer',
                      textAlign: 'left',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {thread.title ?? 'Untitled thread'}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User footer */}
      {identity && (
        <>
          <Separator style={{ background: 'rgba(253,246,236,0.12)', margin: '0 12px' }} />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 16px',
            }}
          >
            <Avatar style={{ width: 28, height: 28 }}>
              <AvatarFallback
                style={{
                  background: 'rgba(255,54,33,0.3)',
                  color: 'var(--db-cream)',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                {initials(identity.email)}
              </AvatarFallback>
            </Avatar>
            <span
              style={{
                fontSize: 11,
                color: 'rgba(253,246,236,0.6)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {identity.email}
            </span>
          </div>
        </>
      )}
    </aside>
  );
}
