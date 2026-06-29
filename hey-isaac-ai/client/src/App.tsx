import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoadingView from './components/LoadingView';
import ProjectView from './components/ProjectView';
import ChatView from './components/ChatView';
import type { Identity, View, Thread, AgentConfig } from './lib/types';

const PROJECT_ID = '11111111-1111-1111-1111-111111111111';

const AGENTS: AgentConfig[] = [
  {
    id: '22222222-2222-2222-2222-222222222222',
    persona: 'genie',
    label: 'Genie',
    color: '#FF3621',
  },
];

interface PersonaTokenResponse {
  token: string;
  persona: string;
  project_id: string;
  expires_in: number;
}

export default function App() {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [personaToken, setPersonaToken] = useState<string | null>(null);
  const [view, setView] = useState<View>({ kind: 'loading' });
  const [threads, setThreads] = useState<Thread[]>([]);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        // Step 1: Get OBO identity
        const meRes = await fetch('/api/me');
        if (!meRes.ok) {
          const body = await meRes.json().catch(() => ({})) as { error?: string };
          throw new Error(body.error ?? `Identity fetch failed (${meRes.status})`);
        }
        const me = await meRes.json() as Identity;
        setIdentity(me);

        // Step 2: Get persona token for the genie agent
        const tokenRes = await fetch('/token/persona', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ persona: 'genie', project_id: PROJECT_ID }),
        });
        if (!tokenRes.ok) {
          const body = await tokenRes.json().catch(() => ({})) as { message?: string; error?: string };
          throw new Error(body.message ?? body.error ?? `Token fetch failed (${tokenRes.status})`);
        }
        const tokenData = await tokenRes.json() as PersonaTokenResponse;
        setPersonaToken(tokenData.token);
        setView({ kind: 'project' });
      } catch (e) {
        setInitError(e instanceof Error ? e.message : String(e));
        setView({ kind: 'project' }); // Show partial UI even on error
      }
    }

    void init();
  }, []);

  function handleStartThread(thread: Thread, agentId: string) {
    setThreads(prev => [...prev, thread]);
    setView({
      kind: 'chat',
      threadId: thread.id,
      agentId,
      threadTitle: thread.title ?? 'Untitled thread',
    });
  }

  function handleNavigateChat(thread: Thread, agentId: string) {
    setView({
      kind: 'chat',
      threadId: thread.id,
      agentId,
      threadTitle: thread.title ?? 'Untitled thread',
    });
  }

  if (view.kind === 'loading') {
    return <LoadingView />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header identity={identity} />

      {initError && (
        <div
          style={{
            background: 'rgba(255,54,33,0.08)',
            borderBottom: '1px solid rgba(255,54,33,0.3)',
            padding: '8px 24px',
            fontSize: 13,
            color: 'var(--db-red)',
          }}
        >
          ⚠ {initError}
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          identity={identity}
          threads={threads}
          view={view}
          agents={AGENTS}
          onNavigateProject={() => setView({ kind: 'project' })}
          onNavigateChat={handleNavigateChat}
        />

        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {view.kind === 'project' && personaToken && (
            <ProjectView
              agents={AGENTS}
              personaToken={personaToken}
              onStartThread={handleStartThread}
            />
          )}

          {view.kind === 'project' && !personaToken && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'var(--db-text-muted)',
                fontSize: 14,
              }}
            >
              Waiting for persona token…
            </div>
          )}

          {view.kind === 'chat' && personaToken && (
            <ChatView
              threadId={view.threadId}
              agentId={view.agentId}
              threadTitle={view.threadTitle}
              personaToken={personaToken}
              onBack={() => setView({ kind: 'project' })}
            />
          )}
        </main>
      </div>
    </div>
  );
}
