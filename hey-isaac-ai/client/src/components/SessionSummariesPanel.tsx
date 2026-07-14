import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  AlertDescription,
  Button,
  Spinner,
  Textarea,
} from '@databricks/appkit-ui/react';
import { callMcp } from '../lib/mcp';
import type { SessionSummary } from '../lib/types';

const PAGE_SIZE = 20;

interface GetSessionSummariesResult {
  summaries: SessionSummary[];
  next_cursor: string | null;
}

interface SessionSummariesPanelProps {
  threadId: string;
  personaToken: string;
}

export default function SessionSummariesPanel({
  threadId,
  personaToken,
}: SessionSummariesPanelProps) {
  const [summaries, setSummaries] = useState<SessionSummary[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const loadSummaries = useCallback(
    async (cursor?: string | null) => {
      const result = await callMcp<GetSessionSummariesResult>(
        'get_session_summaries',
        { thread_id: threadId, limit: PAGE_SIZE, ...(cursor ? { cursor } : {}) },
        personaToken,
      );
      return result;
    },
    [threadId, personaToken],
  );

  const refreshSummaries = useCallback(async () => {
    setLoadingInitial(true);
    setLoadError(null);
    try {
      const allSummaries: SessionSummary[] = [];
      let cursor: string | null = null;

      do {
        // Known server-tool limitation: pagination advances by UUID id while the
        // query orders by created_at ASC, so this client drains the full result set.
        const result = await loadSummaries(cursor);
        allSummaries.push(...result.summaries);
        cursor = result.next_cursor;
      } while (cursor);

      setSummaries(allSummaries.reverse());
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : String(e));
      setSummaries([]);
    } finally {
      setLoadingInitial(false);
    }
  }, [loadSummaries]);

  useEffect(() => {
    setDraft('');
    setSaveError(null);
    void refreshSummaries();
  }, [refreshSummaries, threadId]);

  async function handleSaveSummary() {
    const content = draft.trim();
    if (!content || saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      const summary = await callMcp<SessionSummary>(
        'write_session_summary',
        { thread_id: threadId, content },
        personaToken,
      );
      setSummaries(prev => {
        if (prev.some(item => item.id === summary.id)) return prev;
        return [summary, ...prev];
      });
      setDraft('');
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }
  return (
    <aside
      aria-label="Session summaries"
      style={{
        width: 360,
        minWidth: 320,
        maxWidth: 420,
        borderLeft: '1px solid var(--border)',
        background: 'var(--card)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '16px 20px 12px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Session summaries</div>
          <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 4 }}>
            Save quick recap notes for this thread.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="Write a concise session summary…"
            aria-label="Session summary input"
            rows={4}
            style={{ resize: 'vertical', minHeight: 96, fontSize: 14 }}
          />
          <Button onClick={() => void handleSaveSummary()} disabled={!draft.trim() || saving}>
            {saving ? 'Saving…' : 'Save summary'}
          </Button>
        </div>

        {saveError && (
          <Alert variant="destructive">
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        )}
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 20 }}>
        {loadError && (
          <Alert variant="destructive" style={{ marginBottom: 16 }}>
            <AlertDescription>{loadError}</AlertDescription>
          </Alert>
        )}

        {loadingInitial ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              minHeight: 180,
            }}
          >
            <Spinner />
          </div>
        ) : summaries.length === 0 ? (
          <div
            style={{
              border: '1px dashed var(--border)',
              borderRadius: 'var(--radius)',
              padding: 24,
              textAlign: 'center',
              color: 'var(--muted-foreground)',
              fontSize: 14,
              background: 'var(--background)',
            }}
          >
            No summaries yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {summaries.map(summary => (
              <article
                key={summary.id}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '12px 14px',
                  background: 'var(--background)',
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--muted-foreground)',
                    marginBottom: 8,
                  }}
                >
                  {new Date(summary.created_at).toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {summary.summary}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
