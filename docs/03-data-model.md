# Data Model (Lakebase / Postgres)

Multi-tenant, threaded, and board-ready. Everything scopes to a `project_id`. The agile-board
tables (`tasks`, `sprints`) are **defined now even though their UI ships later**, so that messages
and branches can reference them without a painful migration once the board lands.

## Tables

### `projects` — tenant root
| Column | Notes |
|---|---|
| `id` | PK |
| `name` | |
| `description` | |
| `requirements_doc` | rich text / markdown |
| `created_at` | |

### `project_members` — which humans belong to a project
| Column | Notes |
|---|---|
| `project_id` | FK → projects |
| `user_id` | Databricks user |
| `role` | owner / member |

### `agents` — personas
| Column | Notes |
|---|---|
| `id` | PK |
| `project_id` | FK → projects |
| `nickname` | unique **per project** |
| `role` | e.g. "iOS engineer" |
| `domain` | e.g. "Swift/Xcode client" |
| `model` | model backing the persona |
| `responsibilities` | text; **also drives the sparse-checkout cone** |
| `created_at` | |

### `agent_grants` — which users may assume a persona
| Column | Notes |
|---|---|
| `agent_id` | FK → agents |
| `user_id` | bounds the persona token (see auth doc) |

### `threads` — conversations
| Column | Notes |
|---|---|
| `id` | PK |
| `project_id` | FK → projects |
| `subject` | |
| `branch_ref` | links to the git feature branch |
| `task_id` | FK → tasks (nullable) |
| `status` | open / resolved |
| `created_at` | |

### `messages` — threaded, carries the 3-level identity
| Column | Notes |
|---|---|
| `id` | PK |
| `thread_id` | FK → threads |
| `parent_agent_id` | the persona (FK → agents) |
| `sub_agent_label` | optional Omnigent sub-agent label |
| `author_user_id` | the authenticated human (OBO) |
| `to_nickname` | recipient persona nickname |
| `body` | |
| `read_at` | nullable; null = unread |
| `created_at` | |

### `session_summaries` — long-term memory
| Column | Notes |
|---|---|
| `id` | PK |
| `project_id` | FK → projects |
| `parent_agent_id` | the persona (FK → agents) |
| `sub_agent_label` | optional |
| `author_user_id` | the authenticated human |
| `summary` | what was accomplished |
| `blockers` | |
| `next_steps` | |
| `created_at` | |

### `repo_config` — per-project repo settings
| Column | Notes |
|---|---|
| `project_id` | FK → projects |
| `repos` | **list** (monorepo today; list keeps polyrepo a config change, not a migration) |
| `default_branch` | e.g. `main` |
| `clone_mode` | `full` \| `sparse` |
| `partial_clone_filter` | e.g. `blob:none` (nullable) |
| `branch_name_template` | e.g. `{nickname}/feat/{task_id}-{slug}` |
| `pr_template` | |
| `github_identity_config` | OBO settings |

### `agent_checkout_spec` — per-agent checkout
| Column | Notes |
|---|---|
| `agent_id` | FK → agents |
| `clone_mode` | override of project default |
| `sparse_paths` | cone paths **derived from `agents.responsibilities`** |
| `partial_clone_filter` | optional override |

### `pull_requests` — PR tracking
| Column | Notes |
|---|---|
| `id` | PK |
| `project_id` | FK → projects |
| `thread_id` | FK → threads (nullable) |
| `task_id` | FK → tasks (nullable) |
| `branch_ref` | source branch |
| `github_pr_number` | |
| `status` | open / merged / closed |
| `opened_by_agent_id` | persona that opened it |
| `created_at` | |

### `tasks` — agile board (schema now, UI later)
| Column | Notes |
|---|---|
| `id` | PK |
| `project_id` | FK → projects |
| `title` | |
| `description` | |
| `status` | backlog / in-progress / review / done |
| `assignee_agent_id` | FK → agents (nullable) |
| `branch_ref` | links to git branch |
| `sprint_id` | FK → sprints (nullable) |

### `sprints` — board grouping (schema now, UI later)
| Column | Notes |
|---|---|
| `id` | PK |
| `project_id` | FK → projects |
| `name` | |
| `starts_on` | |
| `ends_on` | |

## Relationships at a glance

```
projects ─┬─ project_members
          ├─ agents ─┬─ agent_grants
          │          └─ agent_checkout_spec
          ├─ threads ─ messages
          ├─ session_summaries
          ├─ repo_config
          ├─ pull_requests
          └─ tasks ─ sprints

thread ─ branch_ref ─ pull_request ─ task   (the connected work graph)
```

## Decisions

- Multi-tenant: everything scoped by `project_id`; nicknames unique per project.
- Messages are threaded and carry parent_agent_id + sub_agent_label + author_user_id.
- Threads/tasks/PRs cross-link (branch_ref) to form the connected work graph.
- `repos` stored as a list so polyrepo is a future config change, not a migration.
- Sparse cone (`agent_checkout_spec.sparse_paths`) derived from `agents.responsibilities`.
- Board tables (`tasks`, `sprints`) created up front; UI deferred to a later phase.

## Open items

- Index strategy (unread-by-persona, thread listing, per-project scans).
- Soft-delete vs hard-delete policy for agents/threads.
- Retention policy for session summaries.
