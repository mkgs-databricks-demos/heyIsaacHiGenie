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

## Git / repo

See [GitHub integration](05-github-integration.md) for the full policy. The App performs all of
these through the **GitHub REST/GraphQL API** — no server-side working copy.

| Tool | Description |
|---|---|
| `get_repo_config` | Repo URL(s), default branch, clone mode, conventions for the project. |
| `get_my_checkout_spec` | The calling persona's clone mode + sparse cone paths, so it sets up its working copy correctly. |
| `create_feature_branch` | Creates a branch ref off default HEAD via API; generates a conventional name; links to task/thread. Returns branch name. |
| `open_pull_request` | Opens a PR from the agent's branch; links to thread/task. |
| `get_pull_request_status` | Read PR state, reviews, CI. |
| `comment_on_pr` | Comment on a PR — lets agents negotiate API contracts on the PR itself. |

> **Deliberately absent: `merge_pull_request`.** Agents never merge. This is the soft guard;
> the hard guard is GitHub branch protection (see the GitHub doc).

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
- Tools that create git artifacts populate `branch_ref` on the linked thread/task and add a row
  to `pull_requests`, keeping the connected work graph consistent.

## Decisions

- Streamable HTTP transport at `/mcp`.
- Persona/nickname resolved from the token, never the body.
- No merge tool exists; branching/PR tools only.
- Board tools deferred with the board UI.
