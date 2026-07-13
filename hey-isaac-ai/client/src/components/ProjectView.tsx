import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  Alert,
  AlertTitle,
  AlertDescription,
} from '@databricks/appkit-ui/react';
import { callMcp } from '../lib/mcp';
import GitHubAppStatusCard from './GitHubAppStatusCard';
import type { GitHubStatus } from '../lib/github';
import type { AgentConfig, Project, Thread } from '../lib/types';
import RepoSection from './RepoSection';

interface ProjectViewProps {
  project: Project;
  agents: AgentConfig[];
  personaToken: string;
  githubStatus: GitHubStatus | null;
  onRefreshGitHubStatus: () => void;
  onStartThread: (thread: Thread, agentId: string) => void;
}

export default function ProjectView({
  project,
  agents,
  personaToken,
  githubStatus,
  onRefreshGitHubStatus,
  onStartThread,
}: ProjectViewProps) {
  const [startingFor, setStartingFor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleStartThread(agent: AgentConfig) {
    setStartingFor(agent.id);
    setError(null);
    try {
      const title = `Chat with ${agent.label} — ${new Date().toLocaleDateString()}`;
      const thread = await callMcp<Thread>(
        'start_thread',
        { project_id: project.id, title },
        personaToken,
      );
      onStartThread(thread, agent.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setStartingFor(null);
    }
  }

  return (
    <div
      style={{
        padding: 32,
        maxWidth: 800,
        margin: '0 auto',
      }}
    >
      {/* Project header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>🪔</span>
          <h2 style={{ margin: 0, fontSize: 26 }}>
            {project.name}
          </h2>
        </div>
        {project.description && (
          <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: 14, lineHeight: 1.6 }}>
            {project.description}
          </p>
        )}
      </div>

      {error && (
        <Alert variant="destructive" style={{ marginBottom: 24 }}>
          <AlertTitle>Failed to start thread</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Section heading */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 16,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            color: 'var(--muted-foreground)',
          }}
        >
          Agents
        </h3>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      {/* Agent cards */}
      {agents.length === 0 ? (
        <div style={{
          border: '1px dashed var(--border)', borderRadius: 'var(--radius)',
          padding: 24, textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 13,
        }}>
          No agents in this project yet.
        </div>
      ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {agents.map(agent => (
            <Card key={agent.id}>
              <CardHeader
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {/* Agent avatar */}
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: agent.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      fontWeight: 700,
                      color: 'var(--primary-foreground)',
                      flexShrink: 0,
                    }}
                  >
                    {agent.label[0]}
                  </div>
                  <div>
                    <CardTitle style={{ fontSize: 18, marginBottom: 4 }}>
                      {agent.label}
                    </CardTitle>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Badge variant="secondary" style={{ fontSize: 11 }}>
                        granted
                      </Badge>
                      <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>
                        @{agent.persona}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleStartThread(agent)}
                  disabled={startingFor === agent.id}
                >
                  {startingFor === agent.id ? 'Starting…' : 'Start a thread'}
                </Button>
              </CardHeader>
              <CardContent style={{ paddingTop: 0 }}>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
                  Responds to messages in threads. Tag with{' '}
                  <code
                    style={{
                      background: 'var(--muted)',
                      padding: '1px 5px',
                      borderRadius: 4,
                      fontSize: 12,
                    }}
                  >
                    @{agent.persona}
                  </code>{' '}
                  to direct messages.
                </p>
              </CardContent>
            </Card>
        ))}
      </div>
      )}

      {/* GitHub App settings — owner-only; null when caller is not an owner/admin. */}
      {githubStatus && (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              margin: '32px 0 16px',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                color: 'var(--muted-foreground)',
              }}
            >
              GitHub App Settings
            </h3>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <GitHubAppStatusCard status={githubStatus} onRefresh={onRefreshGitHubStatus} />
        </>
      )}

      <RepoSection projectId={project.id} personaToken={personaToken} />
    </div>
  );
}
