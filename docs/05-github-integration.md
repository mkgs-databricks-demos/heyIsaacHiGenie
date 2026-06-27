# GitHub Integration

Governs the project's **single GitHub monorepo**: which repo a project uses, where each agent is
allowed to work, the branch/merge rules they must follow, and how their git work links back into
the coordination graph.

## Core stance: our App governs, the agents' own GitHub MCP does the work

We are **not** rebuilding GitHub tooling. Each agent runtime already brings its **own GitHub MCP**
(or equivalent git tooling) to create branches, commit, push, and open PRs. Our App does **not**
perform git operations and holds **no server-side working copy**.

What our App owns is **policy and linkage**:

- **Policy (the rules):** which repo backs this project, each agent's working area (sparse cone),
  branch-naming conventions, and the always-branch / never-merge rule. Served to agents so their
  *own* GitHub MCP operates within the lines.
- **Linkage (the graph):** when an agent's GitHub MCP creates a branch or opens a PR, the agent
  reports the resulting `branch_ref` / PR number back to our App, which records it against the
  thread/task — keeping messaging, work items, and code one connected graph.

| Layer | Owner | Responsibility |
|---|---|---|
| **Governance / policy / linkage** | **Our App (MCP)** | repo selection, per-agent cone, naming + merge rules, recording branch/PR back to threads/tasks |
| **Git execution** | **Each agent's own GitHub MCP** | clone, sparse-checkout, branch, commit, push, open PR |
| **Hard enforcement** | **GitHub** | branch protection — the actual backstop |

So `get_repo_config` and `get_my_checkout_spec` tell an agent *what* to clone and *where* it may
work; the agent's GitHub MCP then does it. We don't recreate `create_feature_branch` /
`open_pull_request` as executing tools — those live in the agent's GitHub MCP.

## Clone strategy: full vs sparse, per-project then per-agent

The App *defines* these; the agent's GitHub MCP *applies* them.

- **Per-project default** (`repo_config`): `full`, or `sparse` with cone paths, plus optional
  **partial clone** (`--filter=blob:none`) for large histories.
- **Per-agent override** (`agent_checkout_spec`), **derived from responsibilities:** when the
  owner says "Isaac owns `/ios/**`, Genie owns `/databricks/**`" in the roster, that same
  definition becomes the agent's **sparse-checkout cone**. One source of truth drives both the
  responsibility boundary and the physical checkout — agents stay in their lane.

Use **cone-mode** sparse-checkout (`git sparse-checkout set --cone <dirs>`), the performant modern
path. Databricks **Git folders support sparse checkout**, so Genie's in-Databricks checkout can
mirror its cone exactly the way Isaac's local one does.

> ⚠️ **Non-overlapping cones.** Overlapping paths reintroduce the conflicts sparse-checkout was
> meant to avoid. The roster UI must warn when a new agent's paths intersect an existing agent's.

## Branch & merge policy: always branch, never merge

Because the agents bring their own GitHub MCP, we **cannot** rely on "our server exposes no merge
tool" as the guard — the agent's GitHub MCP may well expose one. So enforcement leans harder on
GitHub itself, with our App's policy as guidance:

- **Hard guard — GitHub branch protection** on the default branch (the real backstop): require a
  PR, require review, and **restrict who can merge to humans only**. Whatever an agent's GitHub
  MCP tries, GitHub refuses the merge. This is non-negotiable and now carries the full weight.
- **Policy guard — App-served rules.** `get_repo_config` states "always create a feature branch;
  never merge." Agents are instructed to follow it; it shapes behavior but is advisory, not
  enforcement.
- **Naming convention, App-defined:** the App provides the branch-name template
  (`{nickname}/feat/{task-id}-{slug}`) via `get_my_checkout_spec`; the agent's GitHub MCP creates
  a branch with that name, then reports it back so the App can link and (optionally) validate it.

## GitHub identity: two non-overlapping lanes

GitHub work splits into a **write lane** and a **read/observe lane**, each with its own identity.
They map exactly onto the push/pull split in the linkage design below.

**Write lane — per-user OBO (agents).** Symmetric with the Databricks OBO model.
- Agents act as the **authenticated human's** GitHub identity (per-user OAuth) through their own
  GitHub MCP — all branches, commits, and PRs.
- **Persona attribution** via a `Co-authored-by: Isaac <...>` commit trailer — both a real GitHub
  identity *and* persona attribution.
- **Per-user revocation**, same mental model as the UC connection.

**Read/observe lane — a read-only GitHub App (our App).**
- A single **GitHub App**, registered purely for **read-only** PR/branch observation and webhooks.
  It never writes and never merges.
- This is a distinct **GitHub-plane** identity — *not* the Databricks SPN. GitHub has no concept
  of a Databricks service principal. The relationship is custodial: the App backend **runs as the
  SPN**, which grants it permission to read the **GitHub App's credentials from the Databricks
  secret scope** (`hi_genie.secret_scope.yml`); it then calls GitHub *as the GitHub App*. Chain:
  **SPN → unlocks secret → holds GitHub App creds → GitHub App is the actual actor.**
- To GitHub, every observe/webhook call appears as a clearly-labeled **bot**, never as a human and
  never as the SPN.

> This deliberately does **not** reopen the "should agents be a bot" question — agents stay OBO.
> The bot identity exists solely for the **read-only** observe path, which is far lower-risk than a
> writing bot.

## The connected work graph

A thread where Isaac and Genie hammer out an API contract links to the **branch**, the **task**,
*and* the **PR** — one connected graph across messaging, work items, and code. Since the App no
longer creates the git artifacts, the agents **report them back** (via the linkage MCP tools in
[04-mcp-tools.md](04-mcp-tools.md)) so the App can populate `branch_ref` and `pull_requests`.

## Decisions

- Single **monorepo**; `repo_config.repos` is a list so polyrepo is a later config change.
- **Agents use their own GitHub MCP for all git execution**; our App does not recreate it and
  holds no working copy.
- Our App owns **policy** (repo selection, per-agent sparse cone, naming, merge rules) and
  **linkage** (recording branch/PR back to threads/tasks).
- Per-agent **sparse cones derived from responsibilities**; cone mode + optional partial clone.
- **Always branch, never merge** — enforced by **GitHub branch protection** (the hard guard,
  carrying full weight now) + App-served policy guidance.
- **Two GitHub identity lanes:** write = per-user OBO (agents, persona via `Co-authored-by:`);
  read/observe = a **read-only GitHub App** custodied by the SPN's secret scope.
- **Linkage = staged hybrid.** Agent-push (`link_branch` / `link_pull_request`) is the **primary**
  path and ships first — it's the only thing that carries thread linkage and it fits OBO with no
  new infra. **App-observe via the read-only GitHub App** (webhooks preferred over polling) is
  added **later** as the authoritative lifecycle + reconciliation layer.
- **Branch-name convention is load-bearing** — it's the **join key** the observe layer uses to
  reconcile observed PRs back to agent-reported rows (and recover the task id even if `link_branch`
  was never called). Therefore the App should **validate** agent-created branch names against the
  template, not just record them.

## Open items

- **Branch GC:** auto-prune branches whose PRs merged (policy + a small cleanup job).
- **Webhook specifics** for the observe path: endpoint, secret verification, which events
  (PR opened/merged/closed, CI status), and GitHub App permission scoping (read-only).
- PR template contents and required CI checks.
