import type { Migration } from './migrate.js';

export const migration004: Migration = {
  name: '004_rls_policies',
  up: `
    CREATE OR REPLACE FUNCTION public.hi_genie_has_project_access(target_project_id UUID, user_name TEXT)
    RETURNS BOOLEAN
    LANGUAGE sql
    STABLE
    SECURITY DEFINER
    SET search_path = public
    AS $$
      SELECT EXISTS (
        SELECT 1
        FROM project_members pm
        WHERE pm.project_id = target_project_id
          AND pm.user_id = user_name
      )
    $$;

    GRANT EXECUTE ON FUNCTION public.hi_genie_has_project_access(UUID, TEXT) TO public;

    ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
    ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
    ALTER TABLE agent_grants ENABLE ROW LEVEL SECURITY;
    ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
    ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
    ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
    ALTER TABLE session_summaries ENABLE ROW LEVEL SECURITY;
    ALTER TABLE repo_config ENABLE ROW LEVEL SECURITY;
    ALTER TABLE agent_checkout_spec ENABLE ROW LEVEL SECURITY;
    ALTER TABLE pull_requests ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS projects_project_member_access ON projects;
    CREATE POLICY projects_project_member_access ON projects
      USING (public.hi_genie_has_project_access(id, current_user))
      WITH CHECK (public.hi_genie_has_project_access(id, current_user));

    DROP POLICY IF EXISTS project_members_project_member_access ON project_members;
    CREATE POLICY project_members_project_member_access ON project_members
      USING (public.hi_genie_has_project_access(project_id, current_user))
      WITH CHECK (public.hi_genie_has_project_access(project_id, current_user));

    DROP POLICY IF EXISTS agents_project_member_access ON agents;
    CREATE POLICY agents_project_member_access ON agents
      USING (public.hi_genie_has_project_access(project_id, current_user))
      WITH CHECK (public.hi_genie_has_project_access(project_id, current_user));

    DROP POLICY IF EXISTS agent_grants_project_member_access ON agent_grants;
    CREATE POLICY agent_grants_project_member_access ON agent_grants
      USING (agent_id IN (
        SELECT id FROM agents
        WHERE public.hi_genie_has_project_access(project_id, current_user)
      ))
      WITH CHECK (agent_id IN (
        SELECT id FROM agents
        WHERE public.hi_genie_has_project_access(project_id, current_user)
      ));

    DROP POLICY IF EXISTS tasks_project_member_access ON tasks;
    CREATE POLICY tasks_project_member_access ON tasks
      USING (public.hi_genie_has_project_access(project_id, current_user))
      WITH CHECK (public.hi_genie_has_project_access(project_id, current_user));

    DROP POLICY IF EXISTS threads_project_member_access ON threads;
    CREATE POLICY threads_project_member_access ON threads
      USING (public.hi_genie_has_project_access(project_id, current_user))
      WITH CHECK (public.hi_genie_has_project_access(project_id, current_user));

    DROP POLICY IF EXISTS messages_project_member_access ON messages;
    CREATE POLICY messages_project_member_access ON messages
      USING (thread_id IN (
        SELECT id FROM threads
        WHERE public.hi_genie_has_project_access(project_id, current_user)
      ))
      WITH CHECK (thread_id IN (
        SELECT id FROM threads
        WHERE public.hi_genie_has_project_access(project_id, current_user)
      ));

    DROP POLICY IF EXISTS session_summaries_project_member_access ON session_summaries;
    CREATE POLICY session_summaries_project_member_access ON session_summaries
      USING (thread_id IN (
        SELECT id FROM threads
        WHERE public.hi_genie_has_project_access(project_id, current_user)
      ))
      WITH CHECK (thread_id IN (
        SELECT id FROM threads
        WHERE public.hi_genie_has_project_access(project_id, current_user)
      ));

    DROP POLICY IF EXISTS repo_config_project_member_access ON repo_config;
    CREATE POLICY repo_config_project_member_access ON repo_config
      USING (public.hi_genie_has_project_access(project_id, current_user))
      WITH CHECK (public.hi_genie_has_project_access(project_id, current_user));

    DROP POLICY IF EXISTS agent_checkout_spec_project_member_access ON agent_checkout_spec;
    CREATE POLICY agent_checkout_spec_project_member_access ON agent_checkout_spec
      USING (agent_id IN (
        SELECT id FROM agents
        WHERE public.hi_genie_has_project_access(project_id, current_user)
      ))
      WITH CHECK (agent_id IN (
        SELECT id FROM agents
        WHERE public.hi_genie_has_project_access(project_id, current_user)
      ));

    DROP POLICY IF EXISTS pull_requests_project_member_access ON pull_requests;
    CREATE POLICY pull_requests_project_member_access ON pull_requests
      USING (public.hi_genie_has_project_access(project_id, current_user))
      WITH CHECK (public.hi_genie_has_project_access(project_id, current_user));
  `,
};
