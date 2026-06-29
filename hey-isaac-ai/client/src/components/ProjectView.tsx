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
import type { AgentConfig, Thread } from '../lib/types';

const PROJECT_ID = '11111111-1111-1111-1111-111111111111';
const PROJECT_NAME = 'Hi Genie — Demo Project';
const PROJECT_DESCRIPTION =
  'Multi-agent coordination workspace. Each agent runs on its own branch and responds to threads you start here.';

interface ProjectViewProps {
  agents: AgentConfig[];
  personaToken: string;
  onStartThread: (thread: Thread, agentId: string) => void;
}

export default function ProjectView({ agents, personaToken, onStartThread }: ProjectViewProps) {
  const [startingFor, setStartingFor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleStartThread(agent: AgentConfig) {
    setStartingFor(agent.id);
    setError(null);
    try {
      const title = `Chat with ${agent.label} — ${new Date().toLocaleDateString()}`;
      const thread = await callMcp<Thread>(
        'start_thread',
        { project_id: PROJECT_ID, title },
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
          <h2
            className="display-font"
            style={{ margin: 0, fontSize: 26, color: 'var(--db-navy)' }}
          >
            {PROJECT_NAME}
          </h2>
        </div>
        <p style={{ margin: 0, color: 'var(--db-text-muted)', fontSize: 14, lineHeight: 1.6 }}>
          {PROJECT_DESCRIPTION}
        </p>
      </div>

      {error && (
        <Alert style={{ marginBottom: 24, borderColor: 'var(--db-red)' }}>
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
            color: 'var(--db-text-muted)',
          }}
        >
          Agents
        </h3>
        <div style={{ flex: 1, height: 1, background: 'var(--db-border)' }} />
      </div>

      {/* Agent cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {agents.map(agent => (
          <div key={agent.id} className="retro-card">
            <Card style={{ border: 'none', boxShadow: 'none', background: 'transparent' }}>
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
                      color: '#fff',
                      flexShrink: 0,
                      boxShadow: `0 2px 8px ${agent.color}66`,
                    }}
                  >
                    {agent.label[0]}
                  </div>
                  <div>
                    <CardTitle className="display-font" style={{ fontSize: 18, marginBottom: 4 }}>
                      {agent.label}
                    </CardTitle>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Badge
                        style={{
                          background: 'rgba(244,161,0,0.15)',
                          color: 'var(--db-gold)',
                          border: '1px solid var(--db-gold)',
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        ✦ granted
                      </Badge>
                      <span style={{ fontSize: 12, color: 'var(--db-text-muted)' }}>
                        @{agent.persona}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleStartThread(agent)}
                  disabled={startingFor === agent.id}
                  style={{
                    background: 'var(--db-red)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  {startingFor === agent.id ? 'Starting…' : 'Start a thread'}
                </Button>
              </CardHeader>
              <CardContent style={{ paddingTop: 0 }}>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--db-text-muted)', lineHeight: 1.5 }}>
                  Responds to messages in threads. Tag with{' '}
                  <code
                    style={{
                      background: 'var(--db-cream)',
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
          </div>
        ))}
      </div>
    </div>
  );
}
