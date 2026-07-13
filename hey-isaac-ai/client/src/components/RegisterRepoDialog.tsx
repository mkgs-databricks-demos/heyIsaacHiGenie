import { useState } from 'react';
import { Button, Alert, AlertTitle, AlertDescription } from '@databricks/appkit-ui/react';
import type { GithubRepo, RegisterRepoResult } from '../lib/types';

type Step = 'pick' | 'preflight' | 'registering' | 'done' | 'error';

interface RegisterRepoDialogProps {
  // Vestigial for auth (these routes are OBO-authenticated) but forwarded when
  // present. Null in the empty-roster case where no persona token was minted.
  personaToken: string | null;
  projectId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RegisterRepoDialog({ personaToken, projectId, onClose, onSuccess }: RegisterRepoDialogProps) {
  const authHeader: Record<string, string> = personaToken
    ? { Authorization: `Bearer ${personaToken}` }
    : {};
  const [step, setStep] = useState<Step>('pick');
  const [query, setQuery] = useState('');
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [preflightData, setPreflightData] = useState<unknown>(null);
  const [registerResult, setRegisterResult] = useState<RegisterRepoResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function searchRepos(q: string) {
    setLoadingRepos(true);
    try {
      const resp = await fetch(`/api/github/repos?q=${encodeURIComponent(q)}`, {
        headers: authHeader,
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json() as { repos: GithubRepo[] };
      setRepos(data.repos ?? []);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : String(e));
    }
    setLoadingRepos(false);
  }

  async function runPreflight(repo: string) {
    setStep('preflight');
    try {
      const resp = await fetch('/api/repos/preflight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({ project_id: projectId, repo }),
      });
      if (!resp.ok) { setErrorMsg(`Preflight failed: HTTP ${resp.status}`); setStep('error'); return; }
      setPreflightData(await resp.json());
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : String(e));
      setStep('error');
    }
  }

  async function register() {
    if (!selectedRepo) return;
    setStep('registering');
    try {
      const resp = await fetch('/api/repos/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({ project_id: projectId, repo: selectedRepo }),
      });
      if (!resp.ok) { setErrorMsg(`Registration failed: HTTP ${resp.status}`); setStep('error'); return; }
      const result = await resp.json() as RegisterRepoResult;
      setRegisterResult(result);
      setStep(result.ok ? 'done' : 'error');
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : String(e));
      setStep('error');
    }
  }

  const overlayStyle: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  };
  const dialogStyle: React.CSSProperties = {
    background: 'var(--popover)', color: 'var(--popover-foreground)',
    borderRadius: 'var(--radius)', padding: 28, width: 480, maxWidth: '95vw',
    border: '1px solid var(--border)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 20 }}>
            Register Repository
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--muted-foreground)' }}>
            ×
          </button>
        </div>

        {step === 'pick' && (
          <div>
            <p style={{ fontSize: 13, color: 'var(--muted-foreground)', marginBottom: 14 }}>
              Select a GitHub repository to register with this project. The Hi-Genie App must be installed on it.
            </p>
            <input
              type="text"
              placeholder="Search repos…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                void searchRepos(e.target.value);
              }}
              style={{
                width: '100%', padding: '8px 12px', borderRadius: 6,
                border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)',
                fontSize: 13, marginBottom: 12, boxSizing: 'border-box',
              }}
            />
            {step === 'pick' && errorMsg && <div style={{ color: 'var(--destructive)', fontSize: 12, marginBottom: 8 }}>{errorMsg}</div>}
            {loadingRepos && <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Searching…</div>}
            <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {repos.map((r) => (
                <button
                  key={r.full_name}
                  onClick={() => {
                    setSelectedRepo(r.full_name);
                    void runPreflight(r.full_name);
                  }}
                  style={{
                    textAlign: 'left', padding: '10px 14px', borderRadius: 8,
                    border: '1px solid var(--border)', cursor: 'pointer', background: 'var(--muted)',
                    color: 'var(--foreground)', fontSize: 13,
                  }}
                >
                  <strong>{r.full_name}</strong>
                  {r.description && <span style={{ color: 'var(--muted-foreground)', marginLeft: 6 }}>{r.description}</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'preflight' && (
          <div>
            <p style={{ fontSize: 13, marginBottom: 16 }}>
              Registering <strong>{selectedRepo}</strong>. The following changes will be made:
            </p>
            <pre style={{ background: 'var(--muted)', padding: 12, borderRadius: 6, fontSize: 11, overflow: 'auto' }}>
              {JSON.stringify(preflightData, null, 2)}
            </pre>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <Button onClick={register}>
                Confirm & Register
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {step === 'registering' && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚙️</div>
            <p style={{ color: 'var(--muted-foreground)', fontSize: 13 }}>Registering {selectedRepo}…</p>
          </div>
        )}

        {step === 'done' && registerResult && (
          <div>
            <div style={{ textAlign: 'center', fontSize: 32, marginBottom: 12 }}>✅</div>
            <p style={{ textAlign: 'center', fontWeight: 600, color: 'var(--foreground)', marginBottom: 16 }}>
              {selectedRepo} registered successfully
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {registerResult.steps.map((s, i) => (
                <div key={i} style={{ fontSize: 12, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span>{s.status === 'ok' ? '✓' : '✗'}</span>
                  <span style={{ color: s.status === 'ok' ? 'var(--foreground)' : 'var(--destructive)' }}>{s.name}</span>
                </div>
              ))}
            </div>
            <Button onClick={onSuccess} style={{ marginTop: 20, width: '100%' }}>
              Done
            </Button>
          </div>
        )}

        {step === 'error' && (
          <Alert variant="destructive">
            <AlertTitle>Registration failed</AlertTitle>
            <AlertDescription>{errorMsg ?? registerResult?.error ?? 'Unknown error'}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
