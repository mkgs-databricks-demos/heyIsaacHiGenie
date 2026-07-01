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

export type View =
  | { kind: 'loading' }
  | { kind: 'project' }
  | { kind: 'chat'; threadId: string; agentId: string; threadTitle: string };
