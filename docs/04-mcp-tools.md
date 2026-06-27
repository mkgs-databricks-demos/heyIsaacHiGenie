# MCP Tools

The MCP server is exposed at `/mcp` over streamable HTTP. These are the tools agents call.

**Universal rule:** the calling persona and its permissions are **always resolved from the
verified persona token** (on top of the human's OBO identity). Nicknames, persona, and project
membership are **never trusted from the request body**.

## Context & roster

| Tool | Description |
|---|---|
| `get_project_context` | Project requirements + the calling persona's role/responsibilities. |
| `get_agent_roster` | Personas in **this** project (nickname, role, domain). |

## Messaging & memory

| Tool | Description |
|---|---|
| `start_thread` | Open a thread with a subject and optional `branch_ref` / `task_id` linkage. |
| `send_message` | Send to a nickname within a `thread_id` (or open a new thread inline). |
| `get_messages` | Fetch unread/all messages for the calling persona, by thread. |
| `mark_messages_read` | Acknowledge messages. |
| `write_session_summary` | Record persona (+ optional sub-agent label) memory: summary, blockers, next steps. |
| `get_session_summaries` | Read own or a teammate's summaries, by project / persona / date. |

## Git / repo — governance & linkage only

The App does **not** perform git operations. Agents use their **own GitHub MCP** to clone,
branch, commit, push, and open PRs. Our App's git tools only (a) tell an agent the rules and its
working area, and (b) record the agent's git artifacts back into the connected work graph. See
[GitHub integration](05-github-integration.md) for the full rationale.

| Tool | Description |
|---|---|
| `get_repo_config` | Which repo backs this project + default branch, clone mode, branch-naming convention, and the always-branch / never-merge rule. |
| `get_my_checkout_spec` | The calling persona's clone mode + sparse cone paths + the branch name to use, so it configures its own checkout correctly. |
| `link_branch` | Agent reports a branch its GitHub MCP created; App records `branch_ref` on the thread/task. |
| `link_pull_request` | Agent reports a PR its GitHub MCP opened; App writes a `pull_requests` row linked to the thread/task. |

> **No executing git tools, by design.** `create_feature_branch`, `open_pull_request`,
> `comment_on_pr`, and especially `merge_pull_request` live in the **agent's own GitHub MCP**, not
> here — we don't recreate the wheel. The never-merge guarantee therefore rests on **GitHub branch
> protection** (the hard guard), not on tool absence in our server.

## Agile board (later phase)

Exposed once the board tables have UI behind them.

| Tool | Description |
|---|---|
| `list_tasks` | List tasks for the project (filter by status / assignee / sprint). |
| `update_task` | Update a task's status / assignee / branch link. |

## Design notes

- Keep tool names simple and descriptive so agents discover them naturally.
- Every write tool stamps `author_user_id` (from OBO) + `parent_agent_id` (from persona token)
  + optional `sub_agent_label`.
- Git **linkage** tools (`link_branch` / `link_pull_request`) populate `branch_ref` on the linked
  thread/task and add a row to `pull_requests`, keeping the connected work graph consistent —
  without the App ever touching GitHub itself. These are the **primary** linkage path; a later
  read-only GitHub App observe layer reconciles authoritative lifecycle state on top (see
  [GitHub integration](05-github-integration.md)).

## Decisions

- Streamable HTTP transport at `/mcp`.
- Persona/nickname resolved from the token, never the body.
- Git execution lives in agents' own GitHub MCP; our server exposes only governance + linkage
  tools (no `create_feature_branch` / `open_pull_request` / `merge_pull_request`).
- Board tools deferred with the board UI.
