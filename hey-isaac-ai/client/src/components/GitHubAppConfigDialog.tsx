import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
  Textarea,
  Label,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@databricks/appkit-ui/react';
import { configureGitHubApp, type GitHubConfigureBody } from '../lib/github';

interface GitHubAppConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfigured?: () => void;
}

type Feedback =
  | { kind: 'idle' }
  | { kind: 'saving' }
  | { kind: 'success'; restartRequired: boolean }
  | { kind: 'error'; message: string };

export default function GitHubAppConfigDialog({ open, onOpenChange, onConfigured }: GitHubAppConfigDialogProps) {
  const [appId, setAppId] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [appPublicUrl, setAppPublicUrl] = useState(
    typeof window !== 'undefined' ? window.location.origin : '',
  );
  const [showSecrets, setShowSecrets] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({ kind: 'idle' });

  const canSave =
    appId.trim().length > 0 &&
    privateKey.trim().length > 0 &&
    clientId.trim().length > 0 &&
    clientSecret.trim().length > 0 &&
    feedback.kind !== 'saving';

  async function handleSave() {
    setFeedback({ kind: 'saving' });
    const body: GitHubConfigureBody = {
      app_id: appId.trim(),
      private_key: privateKey,
      client_id: clientId.trim(),
      client_secret: clientSecret,
      ...(webhookSecret.trim() ? { webhook_secret: webhookSecret.trim() } : {}),
      ...(appPublicUrl.trim() ? { app_public_url: appPublicUrl.trim() } : {}),
    };
    try {
      const result = await configureGitHubApp(body);
      setFeedback({ kind: 'success', restartRequired: result.restart_required ?? false });
      onConfigured?.();
    } catch (e) {
      setFeedback({ kind: 'error', message: e instanceof Error ? e.message : String(e) });
    }
  }

  const secretType = showSecrets ? 'text' : 'password';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ maxWidth: 560 }}>
        <DialogHeader>
          <DialogTitle>Connect your GitHub App</DialogTitle>
          <DialogDescription>
            Enter your GitHub App credentials to enable pull-request tracking and repo automation.
            Secrets are write-only — existing values are never shown.
          </DialogDescription>
        </DialogHeader>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--db-text-muted)', lineHeight: 1.5 }}>
            Don&apos;t have a GitHub App yet?{' '}
            <a
              href="https://github.com/settings/apps/new"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--db-red)' }}
            >
              Create one at github.com/settings/apps/new
            </a>
            . Already have one? Enter your credentials below.
          </p>

          <div>
            <Label htmlFor="gh-app-id">App ID</Label>
            <Input
              id="gh-app-id"
              type="number"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              placeholder="123456"
            />
          </div>

          <div>
            <Label htmlFor="gh-private-key">Private Key (PEM)</Label>
            <Textarea
              id="gh-private-key"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              placeholder="Paste the PEM contents of your GitHub App private key (.pem file)"
              rows={5}
              style={{ fontFamily: 'monospace', fontSize: 12 }}
            />
          </div>

          <div>
            <Label htmlFor="gh-client-id">OAuth Client ID</Label>
            <Input
              id="gh-client-id"
              type={secretType}
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Iv1.abcd1234"
            />
          </div>

          <div>
            <Label htmlFor="gh-client-secret">OAuth Client Secret</Label>
            <Input
              id="gh-client-secret"
              type={secretType}
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              placeholder="••••••••••••••••"
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <input
              type="checkbox"
              checked={showSecrets}
              onChange={(e) => setShowSecrets(e.target.checked)}
            />
            Show secret values
          </label>

          <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                style={{ width: '100%', justifyContent: 'flex-start', fontSize: 13 }}
              >
                {advancedOpen ? '▾' : '▸'} Advanced — Relay configuration
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 12 }}>
                <div>
                  <Label htmlFor="gh-app-url">App Public URL</Label>
                  <Input
                    id="gh-app-url"
                    type="text"
                    value={appPublicUrl}
                    onChange={(e) => setAppPublicUrl(e.target.value)}
                    placeholder="https://your-app.databricksapps.com"
                  />
                </div>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--db-text-muted)' }}>
                  Relay SP credentials are configured via the Deploy Setup job.
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {feedback.kind === 'success' && (
            <div
              style={{
                fontSize: 13,
                color: 'var(--db-green, #1b8a5a)',
                background: 'rgba(27,138,90,0.08)',
                border: '1px solid rgba(27,138,90,0.3)',
                borderRadius: 6,
                padding: '8px 12px',
              }}
            >
              {feedback.restartRequired
                ? '✓ Credentials saved. Redeploy the app for changes to take effect.'
                : '✓ Connected.'}
            </div>
          )}

          {feedback.kind === 'error' && (
            <div
              style={{
                fontSize: 13,
                color: 'var(--db-red)',
                background: 'rgba(255,54,33,0.08)',
                border: '1px solid rgba(255,54,33,0.3)',
                borderRadius: 6,
                padding: '8px 12px',
              }}
            >
              ⚠ {feedback.message}
            </div>
          )}
        </div>

        <DialogFooter style={{ marginTop: 16 }}>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={handleSave}
            disabled={!canSave}
            style={{ background: 'var(--db-red)', color: '#fff', border: 'none' }}
          >
            {feedback.kind === 'saving' ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
