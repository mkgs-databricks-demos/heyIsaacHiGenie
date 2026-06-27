import { useState, useEffect } from 'react';

interface Identity {
  email: string;
  oboHeaders: Record<string, string>;
}

interface PersonaToken {
  token: string;
  persona: string;
  project_id: string;
  expires_in: number;
}

export default function App() {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [personaToken, setPersonaToken] = useState<PersonaToken | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [issuing, setIssuing] = useState(false);

  useEffect(() => {
    fetch('/api/me')
      .then(r => r.ok ? r.json() : r.json().then(e => Promise.reject(e.error)))
      .then(setIdentity)
      .catch(e => setError(String(e)));
  }, []);

  async function issuePersonaToken() {
    setIssuing(true);
    try {
      const r = await fetch('/token/persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona: 'Genie', project_id: 'spike-test' }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message ?? data.error);
      setPersonaToken(data as PersonaToken);
    } catch (e) {
      setError(String(e));
    } finally {
      setIssuing(false);
    }
  }

  const styles: Record<string, React.CSSProperties> = {
    root: { fontFamily: 'monospace', padding: 32, maxWidth: 720, margin: '0 auto' },
    h1: { marginBottom: 4 },
    section: { marginTop: 24, padding: 16, border: '1px solid #ccc', borderRadius: 6 },
    label: { fontWeight: 'bold', marginBottom: 8, display: 'block' },
    pre: { background: '#f4f4f4', padding: 12, borderRadius: 4, overflowX: 'auto' },
    error: { color: 'crimson', marginTop: 8 },
    btn: { marginTop: 12, padding: '8px 16px', cursor: 'pointer' },
  };

  return (
    <div style={styles.root}>
      <h1 style={styles.h1}>Hey Isaac? Hi Genie!</h1>
      <p>Auth spike — OBO identity + persona token round-trip</p>

      {error && <p style={styles.error}>Error: {error}</p>}

      <div style={styles.section}>
        <span style={styles.label}>OBO Identity (/api/me)</span>
        {identity
          ? <pre style={styles.pre}>{JSON.stringify(identity, null, 2)}</pre>
          : <p>Loading…</p>}
      </div>

      <div style={styles.section}>
        <span style={styles.label}>Persona Token (/token/persona)</span>
        <button style={styles.btn} onClick={issuePersonaToken} disabled={issuing}>
          {issuing ? 'Issuing…' : 'Issue token for persona=Genie, project=spike-test'}
        </button>
        {personaToken && (
          <pre style={styles.pre}>{JSON.stringify(
            { ...personaToken, token: personaToken.token.slice(0, 40) + '…' },
            null, 2
          )}</pre>
        )}
      </div>
    </div>
  );
}
