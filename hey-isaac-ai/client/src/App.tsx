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
  // Per-thread unread counts for the signed-in human, keyed by thread id.
  // Sourced from the OBO GET /api/threads/unread-counts route (per-human,
  // project-scoped). Refreshed on load, on a light poll, and whenever ChatView
  // marks a thread read — so sidebar badges update without a full reload.
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const refreshUnreadCounts = useCallback(async (projectId: string) => {
    try {
      const res = await fetch(`/api/threads/unread-counts?project_id=${encodeURIComponent(projectId)}`);
      if (!res.ok) return; // Non-fatal — badges just don't update this tick.
      const data = (await res.json()) as { counts?: Record<string, number> };
      setUnreadCounts(data.counts ?? {});
    } catch {
      // Non-fatal — keep the last known counts.
    }
  }, []);

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
          const token = await mintPersonaToken(primary.persona, boot.project.id);
          setPersonaToken(token);

          // Step 3b: Hydrate persisted threads so the sidebar survives a
          // reload instead of starting empty (threads previously only lived
          // in this component's state).
          try {
            const persistedThreads = await callMcp<Thread[]>(
              'list_threads',
              { project_id: boot.project.id },
              token,
            );
            setThreads(persistedThreads);
          } catch {
            // Non-fatal — sidebar just shows no threads until the next fetch.
          }

          // Seed unread badges once threads exist.
          void refreshUnreadCounts(boot.project.id);
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
  }, [refreshGitHubStatus, refreshUnreadCounts]);

  // Light background poll so badges surface new messages even while the human
  // is on the project view (not inside a thread). ChatView also refreshes
  // counts on mark-read for immediate feedback; this covers the idle case.
  useEffect(() => {
    if (!project) return;
    const interval = setInterval(() => void refreshUnreadCounts(project.id), 5000);
    return () => clearInterval(interval);
  }, [project, refreshUnreadCounts]);

  function handleStartThread(thread: Thread, agentId: string) {
    // Server-side agent_ids only reflects real message linkage, which is
    // empty for a brand-new thread — seed it locally with the agent this
    // thread was started for so it shows under the right sidebar entry
    // immediately, ahead of the first message. A reload re-fetches via
    // list_threads and will show the same real linkage once messages exist.
    setThreads(prev => [...prev, { ...thread, agent_ids: [agentId] }]);
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

  // The current viewer's own OBO email. Human-authored messages persist with
  // author_user_id = lower(this email), so ChatView derives message ownership
  // (isMine) purely from persisted fields — reload-safe and correct when
  // multiple distinct humans message in the same thread.
  const ownEmail = identity?.email;

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
          unreadCounts={unreadCounts}
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

          {view.kind === 'chat' && personaToken && selectedAgent && ownEmail && (
            <ChatView
              threadId={view.threadId}
              agent={selectedAgent}
              ownEmail={ownEmail}
              threadTitle={view.threadTitle}
              personaToken={personaToken}
              onMarkedRead={project ? () => void refreshUnreadCounts(project.id) : undefined}
              onBack={() => setView({ kind: 'project' })}
            />
          )}
        </main>
      </div>
    </div>
  );
}
