import { WorkspaceClient } from '@databricks/sdk-experimental';

/**
 * Secret-scope key names for each GitHub App credential. These are the keys the
 * Deploy Setup job maps into the corresponding HI_GENIE_* env vars at runtime.
 */
export const SECRET_KEYS = {
  app_id: 'github_app_id',
  private_key: 'github_app_private_key',
  client_id: 'github_client_id',
  client_secret: 'github_client_secret',
  webhook_secret: 'github_webhook_secret',
  app_public_url: 'app_public_url',
} as const;

export type SecretField = keyof typeof SECRET_KEYS;

function getScope(): string {
  const scope = process.env.HI_GENIE_SECRET_SCOPE;
  if (!scope || scope.length === 0) {
    throw new Error('HI_GENIE_SECRET_SCOPE is not set — cannot write GitHub App credentials');
  }
  return scope;
}

let cachedClient: WorkspaceClient | null = null;

function client(): WorkspaceClient {
  // The server runs with its own service-principal auth in Databricks Apps; the
  // default config picks up DATABRICKS_HOST / DATABRICKS_TOKEN (or the injected
  // OAuth credentials) from the environment.
  cachedClient ??= new WorkspaceClient({});
  return cachedClient;
}

/**
 * Writes a set of GitHub App credentials to the Databricks secret scope. Only
 * the fields present in `values` are written. Returns the list of keys written.
 */
export async function writeGitHubSecrets(values: Partial<Record<SecretField, string>>): Promise<SecretField[]> {
  const scope = getScope();
  const w = client();
  const written: SecretField[] = [];

  for (const field of Object.keys(SECRET_KEYS) as SecretField[]) {
    const value = values[field];
    if (typeof value !== 'string' || value.length === 0) continue;
    await w.secrets.putSecret({
      scope,
      key: SECRET_KEYS[field],
      string_value: value,
    });
    written.push(field);
  }

  return written;
}
