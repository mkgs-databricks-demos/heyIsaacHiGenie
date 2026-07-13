import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoadingView from './components/LoadingView';
import ProjectView from './components/ProjectView';
import ChatView from './components/ChatView';
import GitHubAppSetupBanner from './components/GitHubAppSetupBanner';
import { fetchGitHubStatus, type GitHubStatus } from './lib/github';
import { callMcp } from './lib/mcp';
import type {
  Identity,
  View,
  Thread,
  AgentConfig,
  Project,
  ProjectContext,
  RosterAgent,
} from './lib/types';

// Bootstrap seeds. There is no "list my projects" tool yet, so the shell is
// seeded with a single project id and mints an initial persona token for a seed
// nickname purely to read the live project context + roster. Everything the UI
// renders (project name/header, agent list, and the working persona token) is
// then driven by that live data — these constants are NOT threaded into
// components or used as display values.
const SEED_PROJECT_ID = '00000000-0000-0000-0000-000000000001';
const BOOTSTRAP_PERSONA = 'genie';

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

        // Step 2: Mint a bootstrap persona token good enough to read the live
        // project context + agent roster.
        const bootstrapToken = await mintPersonaToken(BOOTSTRAP_PERSONA, SEED_PROJECT_ID);

        // Step 3: Resolve project + roster from the backend.
        const [ctx, roster] = await Promise.all([
          callMcp<ProjectContext>('get_project_context', { project_id: SEED_PROJECT_ID }, bootstrapToken),
          callMcp<RosterAgent[]>('get_agent_roster', { project_id: SEED_PROJECT_ID }, bootstrapToken),
        ]);
        setProject(ctx.project);

        const agentList: AgentConfig[] = roster.map(r => ({
          id: r.id,
          persona: r.nickname,
          label: r.label,
          color: r.color,
        }));
        setAgents(agentList);

        // Step 4: The working persona token is minted for the roster's primary
        // agent (nickname sourced from live data, never a literal). If the
        // roster is empty there is no agent to act as, so we keep the bootstrap
        // token so repo/status calls still authenticate.
        const primary = agentList[0];
        const appToken = primary
          ? await mintPersonaToken(primary.persona, ctx.project.id)
          : bootstrapToken;
        setPersonaToken(appToken);

        setView({ kind: 'project' });

        // Step 5: Load GitHub App status (owner-only; null when unauthorized).
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
          {view.kind === 'project' && personaToken && project && (
            <ProjectView
              project={project}
              agents={agents}
              personaToken={personaToken}
              githubStatus={githubStatus}
              onRefreshGitHubStatus={refreshGitHubStatus}
              onStartThread={handleStartThread}
            />
          )}

          {view.kind === 'project' && !(personaToken && project) && (
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
