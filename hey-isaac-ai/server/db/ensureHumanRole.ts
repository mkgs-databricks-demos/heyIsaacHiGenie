import { getWorkspaceClient } from '@databricks/appkit';
import type { Db } from './index.js';

const ROLE_ALREADY_EXISTS_CODES = new Set(['ALREADY_EXISTS', 'RESOURCE_ALREADY_EXISTS', 'CONFLICT']);
const MAX_POSTGRES_IDENTIFIER_BYTES = 63;
const ROLE_VISIBILITY_ATTEMPTS = 10;
const ROLE_VISIBILITY_DELAY_MS = 500;

function quoteIdentifier(identifier: string): string {
  return `"${identifier.replace(/"/g, '""')}"`;
}

function normalizeHumanEmail(email: string): string {
  return email.trim().toLowerCase();
}

function validateRoleNameLength(roleName: string): void {
  const roleNameBytes = Buffer.byteLength(roleName, 'utf8');
  if (roleNameBytes > MAX_POSTGRES_IDENTIFIER_BYTES) {
    throw new Error(`Postgres role name exceeds ${MAX_POSTGRES_IDENTIFIER_BYTES} bytes`);
  }
}

function getLakebaseBranchResource(): string {
  const branch = process.env.LAKEBASE_BRANCH;
  if (branch?.startsWith('projects/')) return branch;

  const endpoint = process.env.LAKEBASE_ENDPOINT;
  const match = endpoint?.match(/^(projects\/[^/]+\/branches\/[^/]+)\/endpoints\/[^/]+$/);
  if (match) return match[1];

  throw new Error('Lakebase branch resource unavailable — set LAKEBASE_ENDPOINT or LAKEBASE_BRANCH');
}

function isAlreadyExistsError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const status = (error as Error & { status?: number; statusCode?: number }).status ?? (error as Error & { statusCode?: number }).statusCode;
  if (status === 409) return true;

  const errorCode = (error as Error & { errorCode?: string; error_code?: string }).errorCode ?? (error as Error & { error_code?: string }).error_code;
  if (errorCode && ROLE_ALREADY_EXISTS_CODES.has(errorCode)) return true;

  return /already exists|already_exist|already-exists|conflict/i.test(error.message);
}

async function createLakebaseRole(roleName: string): Promise<void> {
  const branch = getLakebaseBranchResource();
  const headers = new Headers();
  headers.set('Accept', 'application/json');
  headers.set('Content-Type', 'application/json');
  await getWorkspaceClient({}).apiClient.request({
    path: `/api/2.0/postgres/${branch}/roles`,
    method: 'POST',
    headers,
    raw: false,
    payload: {
      spec: {
        identity_type: 'USER',
        postgres_role: roleName,
      },
    },
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function roleExists(db: Db, roleName: string): Promise<boolean> {
  const existing = await db.query('SELECT 1 FROM pg_roles WHERE rolname = $1', [roleName]);
  return existing.rows.length > 0;
}

async function waitForRoleVisibility(db: Db, roleName: string): Promise<void> {
  for (let attempt = 0; attempt < ROLE_VISIBILITY_ATTEMPTS; attempt++) {
    if (await roleExists(db, roleName)) return;
    await sleep(ROLE_VISIBILITY_DELAY_MS);
  }

  throw new Error('Lakebase role was created but is not visible in Postgres yet');
}

async function grantRolePrivileges(db: Db, roleName: string): Promise<void> {
  const role = quoteIdentifier(roleName);
  await db.query(`GRANT USAGE ON SCHEMA public TO ${role}`);
  await db.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ${role}`);
  await db.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ${role}`);
}

export async function ensureHumanRole(db: Db, humanEmail: string): Promise<string> {
  const roleName = normalizeHumanEmail(humanEmail);
  if (!roleName) throw new Error('Human email is required to provision a Lakebase role');
  validateRoleNameLength(roleName);

  if (await roleExists(db, roleName)) {
    return roleName;
  }

  try {
    await createLakebaseRole(roleName);
  } catch (error) {
    if (!isAlreadyExistsError(error)) throw error;
  }
  await waitForRoleVisibility(db, roleName);
  await grantRolePrivileges(db, roleName);
  return roleName;
}
