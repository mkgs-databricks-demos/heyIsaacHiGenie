import { useState, useEffect } from 'react';
import { Button, Alert, AlertTitle, AlertDescription } from '@databricks/appkit-ui/react';
import type { RepoStatus } from '../lib/types';
import RelayStatusBadge from './RelayStatusBadge';
import RegisterRepoDialog from './RegisterRepoDialog';

const PROJECT_ID = '00000000-0000-0000-0000-000000000001';

interface RepoSectionProps {
  personaToken: string;
}

export default function RepoSection({ personaToken }: RepoSectionProps) {
  const [repos, setRepos] = useState<RepoStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [resyncErrors, setResyncErrors] = useState<Record<string, string>>({});

  async function fetchRepos() {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`/api/repos/status?project_id=${PROJECT_ID}`, {
        headers: { Authorization: `Bearer ${personaToken}` },
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json() as { repos: RepoStatus[] };
      setRepos(data.repos);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void fetchRepos(); }, []);

  return (
    <div style={{ marginTop: 40 }}>
      {/* Section heading */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <h3 style={{
          margin: 0, fontSize: 13, fontWeight: 600, letterSpacing: '0.8px',
          textTransform: 'uppercase', color: 'var(--db-text-muted)',
        }}>
          Repositories
        </h3>
        <div style={{ flex: 1, height: 1, background: 'var(--db-border)' }} />
        <Button
          onClick={() => setShowRegister(true)}
          style={{
            background: 'var(--db-navy)', color: '#fff', border: 'none',
            fontWeight: 600, fontSize: 12, padding: '4px 12px',
          }}
        >
          + Add Repo
        </Button>
      </div>

      {error && (
        <Alert style={{ marginBottom: 16, borderColor: 'var(--db-red)' }}>
          <AlertTitle>Could not load repositories</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div style={{ color: 'var(--db-text-muted)', fontSize: 13, padding: '12px 0' }}>
          Loading repositories…
        </div>
      ) : repos.length === 0 ? (
        <div style={{
          border: '1px dashed var(--db-border)', borderRadius: 8,
          padding: 24, textAlign: 'center', color: 'var(--db-text-muted)', fontSize: 13,
        }}>
          No repositories registered yet.{' '}
          <button
            onClick={() => setShowRegister(true)}
            style={{ color: 'var(--db-red)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}
          >
            Add one
          </button>
          {' '}to start forwarding GitHub events.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {repos.map(repo => (
            <div key={repo.url} className="retro-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16 }}>🐙</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--db-navy)' }}>
                    {repo.url.replace('https://github.com/', '')}
                  </div>
                  <RelayStatusBadge lastDelivery={repo.last_delivery} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <button
                  onClick={async () => {
                    setResyncErrors(prev => ({ ...prev, [repo.url]: '' }));
                    try {
                      const resp = await fetch('/api/repos/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${personaToken}` },
                        body: JSON.stringify({ project_id: PROJECT_ID, repo: repo.url.replace('https://github.com/', '') }),
                      });
                      if (!resp.ok) {
                        setResyncErrors(prev => ({ ...prev, [repo.url]: `Re-sync failed: HTTP ${resp.status}` }));
                        return;
                      }
                      void fetchRepos();
                    } catch (e) {
                      setResyncErrors(prev => ({ ...prev, [repo.url]: e instanceof Error ? e.message : String(e) }));
                    }
                  }}
                  style={{ background: 'none', border: '1px solid var(--db-border)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12, color: 'var(--db-text-muted)' }}
                >
                  Re-sync
                </button>
                {resyncErrors[repo.url] && (
                  <div style={{ color: 'var(--db-red)', fontSize: 11 }}>{resyncErrors[repo.url]}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showRegister && (
        <RegisterRepoDialog
          personaToken={personaToken}
          projectId={PROJECT_ID}
          onClose={() => setShowRegister(false)}
          onSuccess={() => { setShowRegister(false); void fetchRepos(); }}
        />
      )}
    </div>
  );
}
