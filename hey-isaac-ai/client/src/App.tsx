import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoadingView from './components/LoadingView';
import ProjectView from './components/ProjectView';
import ChatView from './components/ChatView';
import GitHubAppSetupBanner from './components/GitHubAppSetupBanner';
import { fetchGitHubStatus, type GitHubStatus } from './lib/github';
import type {
  Identity,
  View,
  Thread,
  AgentConfig,
  Project,
  BootstrapResponse,
} from './lib/types';

// Single bootstrap seed. There is no "list my projects" tool yet, so the shell
// is seeded with one project id. Everything the UI renders — project header,
// agent roster, and the working persona token — is driven by live data fetched
// with this seed. There is deliberately NO seed agent nickname: the primary
// agent is discovered from the live roster (see init()).
const SEED_PROJECT_ID = '00000000-0000-0000-0000-000000000001';

interface PersonaTokenResponse {
  token: string;
  persona: string;
  project_id: string;
  expires_in: number;
}

async function mintPersonaToken(persona: string, projectId: string): Promise<string> {
  const res = await fetch('/token/persona', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ persona, project_id: projectId }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
    throw new Error(body.message ?? body.error ?? `Token fetch failed (${res.status})`);
  }
  const data = (await res.json()) as PersonaTokenResponse;
  return data.token;
}

export default function App() {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [personaToken, setPersonaToken] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [view, setView] = useState<View>({ kind: 'loading' });
  const [threads, setThreads] = useState<Thread[]>([]);
  const [initError, setInitError] = useState<string | null>(null);
  const [githubStatus, setGithubStatus] = useState<GitHubStatus | null>(null);

  const refreshGitHubStatus = useCallback(async () => {
    try {
      const status = await fetchGitHubStatus();
      setGithubStatus(status);
    } catch {
      // Non-fatal — owner dashboard degrades to hiding GitHub settings.
      setGithubStatus(null);
    }
  }, []);

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

        // Step 2: Read live project context + roster under the human's OBO
        // identity — no persona token needed, so no seed nickname is required.
        const bootRes = await fetch(`/api/bootstrap?project_id=${SEED_PROJECT_ID}`);
        if (!bootRes.ok) {
          const body = await bootRes.json().catch(() => ({})) as { message?: string; error?: string };
          throw new Error(body.message ?? body.error ?? `Bootstrap failed (${bootRes.status})`);
        }
        const boot = await bootRes.json() as BootstrapResponse;
        setProject(boot.project);

        const agentList: AgentConfig[] = boot.roster.map(r => ({
          id: r.id,
          persona: r.nickname,
          label: r.label,
          color: r.color,
        }));
        setAgents(agentList);

        // Step 3: Mint the working persona token for the roster's primary agent
        // (nickname sourced from live data). An empty roster leaves personaToken
        // null — the shell renders the 'no agents' placeholder gracefully.
        const primary = agentList[0];
        if (primary) {
          setPersonaToken(await mintPersonaToken(primary.persona, boot.project.id));
        }

        setView({ kind: 'project' });

        // Step 4: Load GitHub App status (owner-only; null when unauthorized).
        void refreshGitHubStatus();
      } catch (e) {
        setInitError(e instanceof Error ? e.message : String(e));
        setView({ kind: 'project' }); // Show partial UI even on error
      }
    }

    void init();
  }, [refreshGitHubStatus]);

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

  // Resolve the live roster entry for the chat's target agent so ChatView can
  // route + render against real nickname/label/color instead of a hardcoded
  // agent. undefined only if the roster no longer contains the id (guarded on
  // render below).
  const selectedAgent =
    view.kind === 'chat' ? agents.find(a => a.id === view.agentId) : undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header identity={identity} />

      {githubStatus && view.kind === 'project' && (
        <GitHubAppSetupBanner status={githubStatus} onConfigured={refreshGitHubStatus} />
      )}

      {initError && (
        <div
          style={{
            background: 'var(--destructive)',
            borderBottom: '1px solid var(--destructive)',
            padding: '8px 24px',
            fontSize: 13,
            color: 'var(--destructive-foreground)',
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
          agents={agents}
          onNavigateProject={() => setView({ kind: 'project' })}
          onNavigateChat={handleNavigateChat}
        />

        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {view.kind === 'project' && project && (
            <ProjectView
              project={project}
              agents={agents}
              personaToken={personaToken}
              githubStatus={githubStatus}
              onRefreshGitHubStatus={refreshGitHubStatus}
              onStartThread={handleStartThread}
            />
          )}

          {view.kind === 'project' && !project && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'var(--muted-foreground)',
                fontSize: 14,
              }}
            >
              {initError ? 'Could not load project.' : 'Loading project…'}
            </div>
          )}

          {view.kind === 'chat' && personaToken && selectedAgent && (
            <ChatView
              threadId={view.threadId}
              agent={selectedAgent}
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
