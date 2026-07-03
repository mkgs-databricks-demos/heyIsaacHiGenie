import { Router } from 'express';
import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Db } from '../db/index.js';

function verifySignature(secret: string, body: Buffer, sig: string | undefined): boolean {
  if (!sig || !sig.startsWith('sha256=')) return false;
  const expected = createHmac('sha256', secret).update(body).digest('hex');
  const expectedBuf = Buffer.from(`sha256=${expected}`, 'utf8');
  const sigBuf = Buffer.from(sig, 'utf8');
  if (sigBuf.length !== expectedBuf.length) return false;
  return timingSafeEqual(sigBuf, expectedBuf);
}

type PullRequestEvent = {
  action: string;
  number: number;
  pull_request: {
    html_url: string;
    title: string;
    state: string;
    merged: boolean;
    head: { ref: string };
    base: { ref: string };
    user: { login: string };
  };
  repository: { html_url: string };
};

export function githubWebhookRouter(db: Db) {
  const router = Router();

  router.post(
    '/',
    // Capture raw body before any json parsing for HMAC verification
    (req, res, next) => {
      const chunks: Buffer[] = [];
      req.on('data', (chunk: Buffer) => chunks.push(chunk));
      req.on('end', () => {
        (req as any).rawBody = Buffer.concat(chunks);
        next();
      });
      req.on('error', next);
    },
    async (req, res) => {
      const webhookSecret = process.env.HI_GENIE_GITHUB_WEBHOOK_SECRET;
      if (!webhookSecret) {
        res.status(503).json({ error: 'webhook not configured' });
        return;
      }

      const sig = req.headers['x-hub-signature-256'] as string | undefined;
      const rawBody: Buffer = (req as any).rawBody ?? Buffer.alloc(0);

      if (!verifySignature(webhookSecret, rawBody, sig)) {
        res.status(400).json({ error: 'invalid_signature' });
        return;
      }

      const event = req.headers['x-github-event'] as string | undefined;

      let body: unknown;
      try {
        body = JSON.parse(rawBody.toString('utf8'));
      } catch {
        res.status(400).json({ error: 'invalid_json' });
        return;
      }

      if (event === 'pull_request') {
        try {
          const payload = body as PullRequestEvent;
          const { action, number: prNumber, pull_request: pr, repository: repo } = payload;

          const statusMap: Record<string, string> = {
            opened: 'open',
            reopened: 'open',
            closed: pr.merged ? 'merged' : 'closed',
          };

          const status = statusMap[action];
          if (status) {
            // Match repo against repo_config.repos JSONB to find project_id
            const configResult = await db.query<{ project_id: string }>(
              `SELECT project_id FROM app.repo_config
               WHERE repos @> $1::jsonb`,
              [JSON.stringify([{ url: repo.html_url }])],
            );
            const project_id = configResult.rows[0]?.project_id ?? null;

            if (!project_id) {
              console.warn(`[github-webhook] PR #${prNumber}: no repo_config match for ${repo.html_url} — skipping upsert`);
            } else {
              await db.query(
                `INSERT INTO app.pull_requests
                   (project_id, pr_number, status, repo_url, pr_url, opened_by, branch_ref, base_branch, author_github_login, updated_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now())
                 ON CONFLICT (project_id, pr_number) DO UPDATE
                   SET status              = EXCLUDED.status,
                       repo_url            = EXCLUDED.repo_url,
                       pr_url              = EXCLUDED.pr_url,
                       branch_ref          = EXCLUDED.branch_ref,
                       base_branch         = EXCLUDED.base_branch,
                       author_github_login = EXCLUDED.author_github_login,
                       updated_at          = now()`,
                [
                  project_id,
                  prNumber,
                  status,
                  repo.html_url,
                  pr.html_url,
                  pr.user.login.toLowerCase(),
                  pr.head.ref,
                  pr.base.ref,
                  pr.user.login.toLowerCase(),
                ],
              );
            }

            if (process.env.NODE_ENV === 'development') {
              console.log(`[github-webhook] PR #${prNumber} ${action} → ${status} (project ${project_id ?? 'unmatched'})`);
            }
          }
        } catch (err) {
          console.error('[github-webhook] pull_request handler error:', err);
          res.status(400).json({ error: 'invalid_payload' });
          return;
        }

        res.json({ ok: true, action: (body as PullRequestEvent).action });
        return;
      }

      if (event === 'push') {
        if (process.env.NODE_ENV === 'development') {
          console.log('[github-webhook] push event received (stub)');
        }
        res.json({ ok: true });
        return;
      }

      res.json({ ignored: true, event: event ?? 'unknown' });
    },
  );

  return router;
}
