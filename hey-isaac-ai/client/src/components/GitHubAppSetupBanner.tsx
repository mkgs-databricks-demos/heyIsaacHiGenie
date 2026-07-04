import { useState } from 'react';
import { Button } from '@databricks/appkit-ui/react';
import GitHubAppConfigDialog from './GitHubAppConfigDialog';
import { classifyStatus, missingFields, type GitHubStatus } from '../lib/github';

const DISMISS_KEY = 'hi-genie:github-setup-dismissed';

interface GitHubAppSetupBannerProps {
  status: GitHubStatus;
  onConfigured?: () => void;
}

/**
 * Dismissible warning banner shown at the top of the owner dashboard when the
 * GitHub App is not fully configured. Red when the JWT can't be minted
 * (app_id/private_key missing), amber when only partially configured. Dismissal
 * is stored in localStorage but re-appears on the next page load if still
 * unconfigured.
 */
export default function GitHubAppSetupBanner({ status, onConfigured }: GitHubAppSetupBannerProps) {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [configOpen, setConfigOpen] = useState(false);

  if (status.configured || dismissed) return null;

  const state = classifyStatus(status);
  const isBroken = state === 'broken';
  const missing = missingFields(status);

  const accent = isBroken ? 'var(--db-red)' : 'var(--db-gold)';
  const bg = isBroken ? 'rgba(255,54,33,0.08)' : 'rgba(244,161,0,0.10)';

  function handleDismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore storage failures */
    }
    setDismissed(true);
  }

  return (
    <>
      <div
        style={{
          background: bg,
          borderBottom: `1px solid ${accent}`,
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span style={{ fontSize: 18 }}>{isBroken ? '⛔' : '⚠'}</span>
        <div style={{ flex: 1, fontSize: 13, lineHeight: 1.5 }}>
          <strong style={{ color: accent }}>
            {isBroken
              ? 'GitHub App not configured — all GitHub features are disabled.'
              : 'GitHub App is partially configured.'}
          </strong>
          {missing.length > 0 && (
            <span style={{ color: 'var(--db-text-muted)', marginLeft: 6 }}>
              Missing: {missing.join(', ')}.
            </span>
          )}
        </div>
        <Button
          onClick={() => setConfigOpen(true)}
          style={{ background: accent, color: '#fff', border: 'none', fontSize: 13, fontWeight: 600 }}
        >
          Configure GitHub App
        </Button>
        <Button
          variant="ghost"
          onClick={handleDismiss}
          aria-label="Dismiss"
          style={{ fontSize: 16, padding: '2px 8px' }}
        >
          ✕
        </Button>
      </div>

      <GitHubAppConfigDialog
        open={configOpen}
        onOpenChange={setConfigOpen}
        onConfigured={onConfigured}
      />
    </>
  );
}
