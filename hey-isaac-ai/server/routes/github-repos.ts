import { Router } from 'express';
import { getInstallationToken } from '../github/app-auth.js';

export function githubReposRouter(): Router {
  const router = Router();

  /**
   * GET /api/github/repos?q=<search>
   * Returns repos in the org that have the App installed.
   */
  router.get('/', async (req, res) => {
    const q = (req.query.q as string) ?? '';
    try {
      const token = await getInstallationToken();
      const url = new URL('https://api.github.com/installation/repositories');
      url.searchParams.set('per_page', '50');
      const resp = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      if (!resp.ok) return res.status(502).json({ error: 'github_error' });
      const data = await resp.json() as { repositories: Array<{ full_name: string; html_url: string; description: string | null }> };
      const repos = data.repositories
        .filter((r) => !q || r.full_name.toLowerCase().includes(q.toLowerCase()))
        .map((r) => ({ full_name: r.full_name, html_url: r.html_url, description: r.description }));
      return res.json({ repos });
    } catch (err) {
      console.error('[github-repos] error:', err);
      return res.status(500).json({ error: 'internal_error' });
    }
  });

  return router;
}
