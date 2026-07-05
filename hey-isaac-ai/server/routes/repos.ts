import { Router } from 'express';
import sodium from 'libsodium-wrappers';
import { extractOboIdentity } from '../middleware/auth.js';
import { getInstallationToken } from '../github/app-auth.js';
import type { Db } from '../db/index.js';

export function reposRouter(db: Db): Router {
  const router = Router();

  router.use((req, res, next) => {
    if (!extractOboIdentity(req)) {
      return res.status(401).json({ error: 'unauthenticated' });
    }
    return next();
  });

  /**
   * GET /api/repos/status?project_id=<uuid>
   * Returns repo_config rows + last PR delivery timestamp for each repo.
   */
  router.get('/status', async (req, res) => {
    const { project_id } = req.query as { project_id?: string };
    if (!project_id) return res.status(400).json({ error: 'project_id required' });

    try {
      const row = await db.query(
        `SELECT repos, updated_at FROM app.repo_config WHERE project_id = $1`,
        [project_id],
      );
      if (!row.rows.length) return res.json({ repos: [] });

      const repos: Array<{ url: string }> = row.rows[0].repos ?? [];
      // Enrich with last PR delivery
      const enriched = await Promise.all(
        repos.map(async (r) => {
          const pr = await db.query(
            `SELECT created_at FROM app.pull_requests WHERE repo_url = $1 ORDER BY created_at DESC LIMIT 1`,
            [r.url],
          );
          return {
            url: r.url,
            last_delivery: pr.rows[0]?.created_at ?? null,
          };
        }),
      );
      return res.json({ repos: enriched });
    } catch (err) {
      console.error('[repos] status error:', err);
      return res.status(500).json({ error: 'internal_error' });
    }
  });

  /**
   * POST /api/repos/preflight
   * Body: { project_id, repo: "owner/name" }
   * Returns what actions will be taken without executing them.
   */
  router.post('/preflight', async (req, res) => {
    const { project_id, repo } = req.body as { project_id: string; repo: string };
    if (!project_id || !repo) return res.status(400).json({ error: 'project_id and repo required' });

    try {
      const token = await getInstallationToken();

      // Check App installation
      const instResp = await fetch(`https://api.github.com/repos/${repo}/installation`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      const appInstalled = instResp.ok;

      // Check if workflow file exists
      const wfResp = await fetch(
        `https://api.github.com/repos/${repo}/contents/.github/workflows/hi-genie-relay.yml`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
          },
        },
      );
      const workflowExists = wfResp.ok;

      return res.json({
        app_installed: appInstalled,
        install_url: appInstalled ? null : `https://github.com/apps/hey-isaac-hi-genie/installations/new`,
        actions: [
          { name: 'Set HI_GENIE_WEBHOOK_SECRET secret', status: 'will_create' },
          { name: 'Commit hi-genie-relay.yml workflow', status: workflowExists ? 'will_update' : 'will_create' },
          { name: 'Update repo_config', status: 'will_upsert' },
        ],
      });
    } catch (err) {
      console.error('[repos] preflight error:', err);
      return res.status(500).json({ error: 'internal_error' });
    }
  });

  /**
   * POST /api/repos/register
   * Body: { project_id, repo: "owner/name" }
   * Performs all registration steps atomically (best-effort per step).
   */
  router.post('/register', async (req, res) => {
    const { project_id, repo } = req.body as { project_id: string; repo: string };
    if (!project_id || !repo) return res.status(400).json({ error: 'project_id and repo required' });

    const steps: Array<{ name: string; status: 'ok' | 'error'; detail?: string }> = [];

    try {
      await sodium.ready;
      const token = await getInstallationToken();

      // Step 1: Verify App installation
      const instResp = await fetch(`https://api.github.com/repos/${repo}/installation`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      if (!instResp.ok) {
        return res.status(409).json({
          error: 'app_not_installed',
          install_url: `https://github.com/apps/hey-isaac-hi-genie/installations/new`,
          message: `GitHub App is not installed on ${repo}. Install it first.`,
        });
      }
      steps.push({ name: 'Verify GitHub App installation', status: 'ok' });

      // Step 2: Use the global webhook secret (must match github-webhook.ts verifier)
      const webhookSecret = process.env.HI_GENIE_GITHUB_WEBHOOK_SECRET;
      if (!webhookSecret) throw new Error('HI_GENIE_GITHUB_WEBHOOK_SECRET not configured');

      // Step 3: Set Actions secret
      const pkResp = await fetch(`https://api.github.com/repos/${repo}/actions/secrets/public-key`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      if (!pkResp.ok) throw new Error(`Could not get public key: ${pkResp.status}`);
      const { key, key_id } = await pkResp.json() as { key: string; key_id: string };

      const keyBytes = Buffer.from(key, 'base64');
      const secretBytes = Buffer.from(webhookSecret, 'utf8');
      const encrypted = sodium.crypto_box_seal(secretBytes, keyBytes);
      const encryptedB64 = Buffer.from(encrypted).toString('base64');

      const secretResp = await fetch(
        `https://api.github.com/repos/${repo}/actions/secrets/HI_GENIE_WEBHOOK_SECRET`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ encrypted_value: encryptedB64, key_id }),
        },
      );
      if (!secretResp.ok && secretResp.status !== 204) {
        throw new Error(`Secret PUT failed: ${secretResp.status}`);
      }
      steps.push({ name: 'Set HI_GENIE_WEBHOOK_SECRET Actions secret', status: 'ok' });

      // Step 4: Commit the caller stub workflow
      const workflowContent = generateCallerStub();
      const workflowB64 = Buffer.from(workflowContent, 'utf8').toString('base64');

      // Check for existing file (need SHA to update)
      const existResp = await fetch(
        `https://api.github.com/repos/${repo}/contents/.github/workflows/hi-genie-relay.yml`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
          },
        },
      );
      const existingData = existResp.ok ? await existResp.json() as { sha: string } : null;

      const putBody: Record<string, string> = {
        message: 'chore: add Hi-Genie event relay workflow',
        content: workflowB64,
      };
      if (existingData?.sha) putBody.sha = existingData.sha;

      const putResp = await fetch(
        `https://api.github.com/repos/${repo}/contents/.github/workflows/hi-genie-relay.yml`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(putBody),
        },
      );
      if (!putResp.ok) {
        const errBody = await putResp.text();
        throw new Error(`Workflow commit failed: ${putResp.status} ${errBody}`);
      }
      steps.push({ name: 'Commit hi-genie-relay.yml workflow', status: 'ok' });

      // Step 5: Get repo HTML URL
      const repoResp = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      const repoData = await repoResp.json() as { html_url: string };

      // Step 6: Upsert repo_config
      await db.query(
        `INSERT INTO app.repo_config (project_id, repos, updated_at, updated_by)
         VALUES ($1, $2::jsonb, now(), $3)
         ON CONFLICT (project_id) DO UPDATE SET
           repos = (
             SELECT jsonb_agg(DISTINCT elem) FROM (
               SELECT jsonb_array_elements(app.repo_config.repos) AS elem
               UNION
               SELECT $2::jsonb -> 0 AS elem
             ) t
           ),
           updated_at = now(),
           updated_by = $3`,
        [project_id, JSON.stringify([{ url: repoData.html_url }]), (req.user ?? extractOboIdentity(req) ?? 'system').toLowerCase()],
      );
      steps.push({ name: 'Update repo_config', status: 'ok' });

      return res.json({ ok: true, steps, relay: { status: 'pending' } });
    } catch (err) {
      console.error('[repos] register error:', err);
      const message = err instanceof Error ? err.message : String(err);
      steps.push({ name: 'Registration failed', status: 'error', detail: message });
      return res.status(500).json({ ok: false, steps, error: message });
    }
  });

  return router;
}

function generateCallerStub(): string {
  return `# Auto-generated by Hi-Genie owner dashboard.
# Do not edit manually — use the dashboard to update.
name: Forward events to Hi-Genie
on:
  pull_request:
    types: [opened, closed, synchronize, reopened, review_requested]
  push:
  pull_request_review:
  pull_request_review_comment:
  issues:
    types: [opened, edited, closed, reopened]
  issue_comment:
    types: [created, edited]
  workflow_run:
    workflows: ["**"]
    types: [completed]
  check_run:
    types: [completed]

jobs:
  relay:
    uses: mkgs-databricks-demos/.github/.github/workflows/relay-to-hi-genie.yml@main
    secrets:
      HI_GENIE_SP_CLIENT_ID: \${{ secrets.HI_GENIE_SP_CLIENT_ID }}
      HI_GENIE_SP_CLIENT_SECRET: \${{ secrets.HI_GENIE_SP_CLIENT_SECRET }}
      HI_GENIE_WEBHOOK_SECRET: \${{ secrets.HI_GENIE_WEBHOOK_SECRET }}
      HI_GENIE_APP_URL: \${{ secrets.HI_GENIE_APP_URL }}
`;
}
