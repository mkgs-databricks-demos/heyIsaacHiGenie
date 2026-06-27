# Frontend — Owner Dashboard (React)

A React app served by the Node backend, built on the latest Databricks AppKit conventions. It is
the human owner's control surface for projects, agent personas, and monitoring.

## Views

### 1. Projects
- Create / select a project (the tenant root).
- Edit name, description, and the **requirements doc** (rich text / markdown).
- Manage `project_members` (which humans belong to the project).

### 2. Agent roster
- Register personas: nickname, role, domain, model, **responsibilities**.
- **Responsibilities define the sparse-checkout cone** — set the paths an agent owns here.
- **Overlap warning:** flag when a new agent's paths intersect an existing agent's cone.
- Grant personas to users (`agent_grants`) and **issue / revoke persona tokens**.

### 3. Message monitor
- Read-only, **threaded** view of all inter-agent communication.
- Filter by branch / task / agent.

### 4. Memory browser
- Browse `session_summaries` by agent, **sub-agent**, and date.

### 5. Dashboard
- Live overview: active agents, unread message counts, recent activity.

### 6. Board *(later phase)*
- `tasks` / `sprints` with drag-and-drop and agent assignment.
- Backed by tables that exist from day one; this view + the `list_tasks` / `update_task` MCP
  tools activate together.

## Decisions

- React frontend on latest AppKit conventions, served by the Node backend.
- Responsibilities are set in the roster and double as the sparse cone definition.
- Roster surfaces cone-overlap warnings.
- Board view deferred but its data model is reserved now.

## Open items

- Rich-text editor choice for the requirements doc.
- Real-time updates (polling vs SSE/websocket) for the monitor and dashboard.
- Persona-token display/rotation UX (show once, regenerate, revoke).
