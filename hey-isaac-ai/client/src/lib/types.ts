export interface Identity {
  email: string;
  oboHeaders: Record<string, string>;
}

export interface AgentConfig {
  id: string;
  persona: string;
  label: string;
  color: string;
}

// Shape of a single row returned by the get_agent_roster MCP tool.
// label/color are server-authoritative (COALESCE'd, never null).
export interface RosterAgent {
  id: string;
  nickname: string;
  label: string;
  color: string;
  grantee_id: string | null;
}

// Live project data resolved from the get_project_context MCP tool. Only the
// fields the shell actually consumes are modelled here.
export interface Project {
  id: string;
  name: string;
  description: string | null;
}

export interface ProjectMembership {
  project_id: string;
  user_id: string;
  role: string;
}

// Response of the OBO-authenticated GET /api/bootstrap read: live project
// context + agent roster, used to seed the shell before any persona token is
// minted.
export interface BootstrapResponse {
  project: Project;
  membership: ProjectMembership;
  roster: RosterAgent[];
}

export interface Thread {
  id: string;
  project_id: string;
  title: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  thread_id: string;
  parent_agent_id: string;
  to_agent_id: string | null;
  content: string;
  role: string;
  created_at: string;
}

export interface RepoStatus {
  url: string;
  last_delivery: string | null;
}

export interface RegisterRepoResult {
  ok: boolean;
  steps: Array<{ name: string; status: 'ok' | 'error'; detail?: string }>;
  relay?: { status: string };
  error?: string;
}

export interface GithubRepo {
  full_name: string;
  html_url: string;
  description: string | null;
}

export type View =
  | { kind: 'loading' }
  | { kind: 'project' }
  | { kind: 'chat'; threadId: string; agentId: string; threadTitle: string };
