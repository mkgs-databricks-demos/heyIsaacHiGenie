import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Textarea,
  Label,
} from '@databricks/appkit-ui/react';
import GitHubAppConfigDialog from './GitHubAppConfigDialog';
import { classifyStatus, missingFields, rotateGitHubKey, type GitHubStatus } from '../lib/github';

interface GitHubAppStatusCardProps {
  status: GitHubStatus;
  onRefresh?: () => void;
}

const STATE_META = {
  connected: { color: '#1b8a5a', label: 'GitHub App: ✓ Connected' },
  partial: { color: 'var(--db-gold)', label: 'GitHub App: ⚠ Partially configured' },
  broken: { color: 'var(--db-red)', label: 'GitHub App: ✗ Not configured' },
} as const;

export default function GitHubAppStatusCard({ status, onRefresh }: GitHubAppStatusCardProps) {
  const [configOpen, setConfigOpen] = useState(false);
  const [rotateOpen, setRotateOpen] = useState(false);

  const state = classifyStatus(status);
  const meta = STATE_META[state];
  const missing = missingFields(status);

  return (
    <div className="retro-card" style={{ marginBottom: 24 }}>
      <Card style={{ border: 'none', boxShadow: 'none', background: 'transparent' }}>
        <CardHeader style={{ paddingBottom: 8 }}>
          <CardTitle className="display-font" style={{ fontSize: 16, color: meta.color }}>
            {meta.label}
          </CardTitle>
        </CardHeader>
        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {missing.length > 0 && (
            <p style={{ margin: 0, fontSize: 13, color: 'var(--db-text-muted)' }}>
              Missing: {missing.join(', ')}
            </p>
          )}
          <div style={{ display: 'flex', gap: 10 }}>
            <Button
              variant="outline"
              onClick={() => setRotateOpen(true)}
              style={{ fontSize: 13 }}
            >
              Rotate Private Key
            </Button>
            <Button
              onClick={() => setConfigOpen(true)}
              style={{ background: 'var(--db-red)', color: '#fff', border: 'none', fontSize: 13 }}
            >
              Reconfigure
            </Button>
          </div>
        </CardContent>
      </Card>

      <GitHubAppConfigDialog
        open={configOpen}
        onOpenChange={setConfigOpen}
        onConfigured={onRefresh}
      />

      <RotateKeyDialog open={rotateOpen} onOpenChange={setRotateOpen} onRotated={onRefresh} />
    </div>
  );
}

type RotateFeedback =
  | { kind: 'idle' }
  | { kind: 'saving' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

function RotateKeyDialog({
  open,
  onOpenChange,
  onRotated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRotated?: () => void;
}) {
  const [privateKey, setPrivateKey] = useState('');
  const [feedback, setFeedback] = useState<RotateFeedback>({ kind: 'idle' });

  async function handleRotate() {
    setFeedback({ kind: 'saving' });
    try {
      await rotateGitHubKey(privateKey);
      setFeedback({ kind: 'success' });
      onRotated?.();
    } catch (e) {
      setFeedback({ kind: 'error', message: e instanceof Error ? e.message : String(e) });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ maxWidth: 520 }}>
        <DialogHeader>
          <DialogTitle>Rotate Private Key</DialogTitle>
          <DialogDescription>
            Paste the new GitHub App private key (PEM). The old key is replaced in the secret scope.
          </DialogDescription>
        </DialogHeader>

        <div style={{ marginTop: 8 }}>
          <Label htmlFor="rotate-key">Private Key (PEM)</Label>
          <Textarea
            id="rotate-key"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            rows={6}
            placeholder="Paste the PEM contents of the new GitHub App private key (.pem file)"
            style={{ fontFamily: 'monospace', fontSize: 12 }}
          />
        </div>

        {feedback.kind === 'success' && (
          <div style={{ marginTop: 12, fontSize: 13, color: '#1b8a5a' }}>
            ✓ Key saved. Redeploy the app for changes to take effect.
          </div>
        )}
        {feedback.kind === 'error' && (
          <div style={{ marginTop: 12, fontSize: 13, color: 'var(--db-red)' }}>⚠ {feedback.message}</div>
        )}

        <DialogFooter style={{ marginTop: 16 }}>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={handleRotate}
            disabled={privateKey.trim().length === 0 || feedback.kind === 'saving'}
            style={{ background: 'var(--db-red)', color: '#fff', border: 'none' }}
          >
            {feedback.kind === 'saving' ? 'Saving…' : 'Rotate Key'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
