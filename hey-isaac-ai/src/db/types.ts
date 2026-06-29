// Auto-generated from schema.sql — do not edit by hand
// Re-generate by running: npm run gen:types (not yet wired)

export interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectMember {
  project_id: string;
  user_id: string; // always lower-case
  role: 'owner' | 'member';
  joined_at: Date;
}

export interface Agent {
  id: string;
  project_id: string;
  nickname: string;
  description: string | null;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface AgentGrant {
  agent_id: string;
  user_id: string; // always lower-case
  granted_at: Date;
  granted_by: string;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: 'open' | 'in_progress' | 'blocked' | 'done' | 'cancelled';
  assignee_agent_id: string | null;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface Thread {
  id: string;
  task_id: string | null;
  project_id: string;
  title: string | null;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface Message {
  id: string;
  thread_id: string;
  author_user_id: string | null; // null when parent_agent_id is set
  parent_agent_id: string | null; // null when author_user_id is set
  to_agent_id: string | null;
  content: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  created_at: Date;
}

export interface SessionSummary {
  id: string;
  thread_id: string;
  author_user_id: string | null;
  parent_agent_id: string | null;
  summary: string;
  token_count: number | null;
  created_at: Date;
}

export interface RepoConfig {
  project_id: string;
  repos: unknown[]; // JSONB array
  updated_at: Date;
  updated_by: string;
}

export interface AgentCheckoutSpec {
  agent_id: string;
  clone_mode: 'worktree' | 'clone' | 'none';
  worktree_path: string | null;
  base_branch: string;
  updated_at: Date;
  updated_by: string;
}

export interface PullRequest {
  id: string;
  project_id: string;
  thread_id: string | null;
  task_id: string | null;
  repo_url: string;
  pr_number: number | null;
  pr_url: string | null;
  status: 'draft' | 'open' | 'merged' | 'closed';
  opened_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface DcrClient {
  client_id: string;
  client_secret_hash: string;
  client_name: string;
  redirect_uris: string[];
  grant_types: string[];
  owner_user_id: string;
  project_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface PersonaTokenJti {
  jti: string;
  human: string; // always lower-case
  persona: string;
  project_id: string | null;
  issued_at: Date;
  expires_at: Date;
}
