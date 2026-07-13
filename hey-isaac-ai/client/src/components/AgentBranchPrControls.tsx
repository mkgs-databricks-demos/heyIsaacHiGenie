import { useEffect, useState } from 'react';
import { Alert, AlertDescription, Button, Input, Label } from '@databricks/appkit-ui/react';
import { callMcp } from '../lib/mcp';
import type { AgentConfig } from '../lib/types';

interface AgentBranchPrControlsProps {
  agent: AgentConfig;
  projectId: string;
}

interface PersonaTokenResponse {
  token: string;
}

interface AgentCheckoutSpec {
  agent_id: string;
  clone_mode: 'worktree' | 'clone' | 'none';
  worktree_path: string | null;
  base_branch: string;
  updated_at: string;
  updated_by: string;
}

interface PullRequestLink {
  id: string;
  thread_id: string | null;
  repo_url: string;
  pr_url: string | null;
  status: 'draft' | 'open' | 'merged' | 'closed';
  opened_by: string;
  updated_at: string;
}

async function mintPersonaToken(persona: string, projectId: string): Promise<string> {
  const res = await fetch('/token/persona', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ persona, project_id: projectId }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string; error?: string };
    throw new Error(body.message ?? body.error ?? `Token fetch failed (${res.status})`);
  }
  const data = await res.json() as PersonaTokenResponse;
  return data.token;
}

export default function AgentBranchPrControls({ agent, projectId }: AgentBranchPrControlsProps) {
  const [personaToken, setPersonaToken] = useState<string | null>(null);
  const [checkoutSpec, setCheckoutSpec] = useState<AgentCheckoutSpec | null>(null);
  const [branchName, setBranchName] = useState('');
  const [branchLoading, setBranchLoading] = useState(true);
  const [branchSaving, setBranchSaving] = useState(false);
  const [branchError, setBranchError] = useState<string | null>(null);

  const [threadId, setThreadId] = useState('');
  const [prUrl, setPrUrl] = useState('');
  const [prStatus, setPrStatus] = useState<PullRequestLink['status']>('open');
  const [linkedPr, setLinkedPr] = useState<PullRequestLink | null>(null);
  const [prSaving, setPrSaving] = useState(false);
  const [prError, setPrError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCheckoutSpec() {
      setBranchLoading(true);
      setBranchError(null);
      try {
        const token = await mintPersonaToken(agent.persona, projectId);
        if (cancelled) return;
        setPersonaToken(token);
        const spec = await callMcp<AgentCheckoutSpec | null>(
          'get_my_checkout_spec',
          { project_id: projectId },
          token,
        );
        if (cancelled) return;
        setCheckoutSpec(spec);
        setBranchName(spec?.base_branch ?? '');
      } catch (e) {
        if (!cancelled) setBranchError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setBranchLoading(false);
      }
    }

    void loadCheckoutSpec();
    return () => { cancelled = true; };
  }, [agent.persona, projectId]);

  async function handleLinkBranch() {
    const nextBranch = branchName.trim();
    if (!nextBranch) {
      setBranchError('Enter a branch name for this agent.');
      return;
    }

    setBranchSaving(true);
    setBranchError(null);
    try {
      const token = personaToken ?? await mintPersonaToken(agent.persona, projectId);
      setPersonaToken(token);
      const spec = await callMcp<AgentCheckoutSpec>(
        'link_branch',
        {
          project_id: projectId,
          thread_id: `agent-global:${agent.id}`,
          branch_name: nextBranch,
        },
        token,
      );
      setCheckoutSpec(spec);
      setBranchName(spec.base_branch);
    } catch (e) {
      setBranchError(e instanceof Error ? e.message : String(e));
    } finally {
      setBranchSaving(false);
    }
  }

  async function handleLinkPullRequest() {
    const nextThreadId = threadId.trim();
    const nextPrUrl = prUrl.trim();
    if (!nextThreadId || !nextPrUrl) {
      setPrError('Enter both a thread ID and pull request URL.');
      return;
    }

    setPrSaving(true);
    setPrError(null);
    setLinkedPr(null);
    try {
      const token = personaToken ?? await mintPersonaToken(agent.persona, projectId);
      setPersonaToken(token);
      const pr = await callMcp<PullRequestLink>(
        'link_pull_request',
        { thread_id: nextThreadId, pr_url: nextPrUrl, status: prStatus },
        token,
      );
      setLinkedPr(pr);
    } catch (e) {
      setPrError(e instanceof Error ? e.message : String(e));
    } finally {
      setPrSaving(false);
    }
  }

  return (
    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--card-foreground)' }}>
              Agent-global current branch
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>
              This checkout spec belongs to @{agent.persona}, not to an individual thread.
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)', textAlign: 'right' }}>
            {branchLoading ? 'Loading…' : checkoutSpec?.base_branch ?? 'No branch linked'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <Label htmlFor={`branch-${agent.id}`}>Branch name</Label>
            <Input
              id={`branch-${agent.id}`}
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              placeholder="feature/my-agent-work"
              disabled={branchLoading || branchSaving}
            />
          </div>
          <Button onClick={handleLinkBranch} disabled={branchLoading || branchSaving}>
            {branchSaving ? 'Saving…' : checkoutSpec ? 'Update branch' : 'Link branch'}
          </Button>
        </div>
        {checkoutSpec && (
          <div style={{ marginTop: 6, fontSize: 11, color: 'var(--muted-foreground)' }}>
            Mode: {checkoutSpec.clone_mode} · Updated by {checkoutSpec.updated_by}
          </div>
        )}
        {branchError && (
          <Alert variant="destructive" style={{ marginTop: 10 }}>
            <AlertDescription>{branchError}</AlertDescription>
          </Alert>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--card-foreground)' }}>
            Link PR to a thread
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>
            Pull requests are thread-scoped; paste a thread ID and PR URL to record the linkage.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px auto', gap: 8, alignItems: 'end' }}>
          <div>
            <Label htmlFor={`thread-${agent.id}`}>Thread ID</Label>
            <Input
              id={`thread-${agent.id}`}
              value={threadId}
              onChange={(e) => setThreadId(e.target.value)}
              placeholder="thread uuid"
              disabled={prSaving}
            />
          </div>
          <div>
            <Label htmlFor={`pr-${agent.id}`}>PR URL</Label>
            <Input
              id={`pr-${agent.id}`}
              value={prUrl}
              onChange={(e) => setPrUrl(e.target.value)}
              placeholder="https://github.com/org/repo/pull/123"
              disabled={prSaving}
            />
          </div>
          <div>
            <Label htmlFor={`pr-status-${agent.id}`}>Status</Label>
            <select
              id={`pr-status-${agent.id}`}
              value={prStatus}
              onChange={(e) => setPrStatus(e.target.value as PullRequestLink['status'])}
              disabled={prSaving}
              style={{
                width: '100%',
                height: 32,
                border: '1px solid var(--border)',
                borderRadius: 6,
                background: 'var(--background)',
                color: 'var(--foreground)',
                padding: '0 8px',
                fontSize: 13,
              }}
            >
              <option value="open">open</option>
              <option value="draft">draft</option>
              <option value="merged">merged</option>
              <option value="closed">closed</option>
            </select>
          </div>
          <Button onClick={handleLinkPullRequest} disabled={prSaving}>
            {prSaving ? 'Linking…' : 'Link PR'}
          </Button>
        </div>

        {linkedPr && (
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--muted-foreground)' }}>
            Linked {linkedPr.pr_url} to thread {linkedPr.thread_id} as {linkedPr.status}.
          </div>
        )}
        {prError && (
          <Alert variant="destructive" style={{ marginTop: 10 }}>
            <AlertDescription>{prError}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
