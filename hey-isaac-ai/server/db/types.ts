export interface RepoEntry {
  url: string;
  webhook_secret?: string;   // per-repo HMAC secret
  installation_id?: number;  // GitHub App installation ID for this repo's org
}
