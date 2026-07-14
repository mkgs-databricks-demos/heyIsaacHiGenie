import { Avatar, AvatarFallback, Separator } from '@databricks/appkit-ui/react';
import type { Identity, Thread, View, AgentConfig } from '../lib/types';

interface SidebarProps {
  identity: Identity | null;
  threads: Thread[];
  view: View;
  agents: AgentConfig[];
  // Per-thread unread count for the signed-in human, keyed by thread id.
  // A thread absent from the map (or with 0) shows no badge.
  unreadCounts: Record<string, number>;
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
  unreadCounts,
  onNavigateProject,
  onNavigateChat,
}: SidebarProps) {
  const isProjectActive = view.kind === 'project';

  return (
    <aside
      style={{
        width: 220,
        background: 'var(--sidebar)',
        color: 'var(--sidebar-foreground)',
        borderRight: '1px solid var(--sidebar-border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* App name */}
      <div style={{ padding: '20px 16px 12px' }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--sidebar-foreground)',
          }}
        >
          Hi Genie
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 2 }}>
          multi-agent coordination
        </div>
      </div>

      <Separator style={{ margin: '0 12px' }} />

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
            background: isProjectActive ? 'var(--sidebar-accent)' : 'transparent',
            border: 'none',
            borderLeft: isProjectActive
              ? '3px solid var(--sidebar-primary)'
              : '3px solid transparent',
            color: 'var(--sidebar-foreground)',
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
          // agent_ids is derived server-side (list_threads) from message
          // linkage — a thread only "belongs" to an agent once a message has
          // been exchanged with it (see Thread.agent_ids). Freshly-created
          // threads with no messages yet won't match any agent here until
          // the optimistic append in App.tsx seeds agent_ids locally.
          const agentThreads = threads.filter(t => t.agent_ids?.includes(agent.id));
          return (
            <div key={agent.id}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 16px 6px 24px',
                  fontSize: 12,
                  color: 'var(--muted-foreground)',
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
                    color: 'var(--primary-foreground)',
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
                    color: 'var(--muted-foreground)',
                    fontStyle: 'italic',
                  }}
                >
                  No threads yet
                </div>
              )}

              {agentThreads.map(thread => {
                const isActive =
                  view.kind === 'chat' && view.threadId === thread.id;
                const unread = unreadCounts[thread.id] ?? 0;
                const showBadge = unread > 0 && !isActive;
                return (
                  <button
                    key={thread.id}
                    onClick={() => onNavigateChat(thread, agent.id)}
                    aria-current={isActive ? 'page' : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      width: '100%',
                      padding: '5px 16px 5px 40px',
                      background: isActive ? 'var(--sidebar-accent)' : 'transparent',
                      borderLeft: isActive
                        ? '3px solid var(--sidebar-primary)'
                        : '3px solid transparent',
                      border: 'none',
                      color: isActive
                        ? 'var(--sidebar-accent-foreground)'
                        : 'var(--muted-foreground)',
                      fontSize: 12,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        flex: 1,
                        minWidth: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontWeight: showBadge ? 600 : 400,
                        color: showBadge ? 'var(--sidebar-foreground)' : undefined,
                      }}
                    >
                      {thread.title ?? 'Untitled thread'}
                    </span>
                    {showBadge && (
                      <span
                        aria-label={`${unread} unread`}
                        style={{
                          flexShrink: 0,
                          minWidth: 18,
                          height: 18,
                          padding: '0 5px',
                          borderRadius: 9,
                          background: 'var(--sidebar-primary)',
                          color: 'var(--primary-foreground)',
                          fontSize: 10,
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          lineHeight: 1,
                        }}
                      >
                        {unread > 99 ? '99+' : unread}
                      </span>
                    )}
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
          <Separator style={{ margin: '0 12px' }} />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 16px',
            }}
          >
            <Avatar style={{ width: 28, height: 28 }}>
              <AvatarFallback>{initials(identity.email)}</AvatarFallback>
            </Avatar>
            <span
              style={{
                fontSize: 11,
                color: 'var(--muted-foreground)',
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
