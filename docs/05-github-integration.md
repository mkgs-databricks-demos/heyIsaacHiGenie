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

## Implementation status (as of 2026-07-03)

### Shipped — observe/webhook lane (PR #32)

The **read/observe lane** is live:

| Endpoint | Purpose |
|----------|---------|
| `GET /auth/github/login?state=<state>` | Initiates OAuth flow — redirects to GitHub |
| `GET /auth/github/callback?code=<code>&state=<state>` | Exchanges code, fetches GitHub user, upserts `app.github_tokens` |
| `POST /webhook/github` | HMAC-verified (timingSafeEqual) event consumer; PR events upsert `app.pull_requests` |

**Webhook details:**
- GitHub App configured with webhook URL `https://hey-isaac-hi-genie-dev-7474657291520070.aws.databricksapps.com/webhook/github`
- Events handled: `pull_request` (opened/reopened/closed/merged) → upsert `app.pull_requests`
- Events stubbed: `push` (logged, not stored yet)
- Signature verification: `X-Hub-Signature-256`, `timingSafeEqual` — the HMAC is the security layer
- `repo_config.repos` JSONB array is the join key — webhook payload `repository.html_url` must match an entry for a PR row to be recorded
- **IP ACL:** GitHub webhook IP ranges (`140.82.112.0/20`, `185.199.108.0/22`, `192.30.252.0/22`, `143.55.64.0/20`) must be in the workspace allowlist as `hey-isaac-hi-genie-github-webhooks`. Without this, all webhook deliveries return HTTP 403 with "Source IP blocked".
- **Platform OAuth proxy blocker (open):** The Databricks Apps gateway (`apps-gateway`, Rust) intercepts all incoming requests and redirects unauthenticated ones to OAuth login (HTTP 302). GitHub webhooks carry no Databricks session cookie, so they receive a 302 → OAuth login redirect before reaching Express. `skip_auth_routes` exists in the platform's Nimbus/oauth2proxy config but is **not customer-configurable** via `app.yaml`. This means `POST /webhook/github` cannot be reached by GitHub without a platform-side change. See "Open items" for mitigation options.

**Schema additions (migration 007):**
- `app.github_tokens (github_user_id, project_id, access_token, token_type, scope, created_at, updated_at)`
- `app.pull_requests` extended: `branch_ref`, `base_branch`, `author_github_login`, `UNIQUE(project_id, pr_number)`

**CDC / REPLICA IDENTITY (migration 008):**
- All 14 `app.*` tables have `REPLICA IDENTITY FULL` — required for wal2delta CDC to capture full row images
- CONVENTION: every `CREATE TABLE` in a migration must be immediately followed by `ALTER TABLE <name> REPLICA IDENTITY FULL`

### Not yet shipped — write/governance lane (Phase 5b)

The write lane and governance tooling are the **next milestone**:

- `get_repo_config` MCP tool — serve repo, sparse-cone, branch-naming, and merge policy to agents
- `get_my_checkout_spec` MCP tool — per-agent cone derived from responsibilities
- `link_branch` MCP tool — agent reports its created branch back; App validates name template + records `branch_ref`
- `link_pull_request` MCP tool — agent reports its opened PR; App links it to the thread/task
- GitHub branch protection setup (the hard enforcement guard)
- Roster overlap warnings (cone intersections)

## Relay SP provisioning

The GitHub Actions relay authenticates to `/webhook/github` with a Databricks M2M OAuth token
from a dedicated service principal (`hi-genie-relay-<target>`). The `provision_relay_spn` job
automates SP creation and secret storage.

### One-time setup per environment

```bash
# Deploy infra bundle, run platform bootstrap, then provision the relay SP:
DATABRICKS_CONFIG_PROFILE=fevm-hls-fde ./deploy.sh --target dev --run-setup
```

The `--run-setup` flag runs two jobs sequentially:
1. `platform_bootstrap` — stores `workspace_url`, validates admin secrets
2. `provision_relay_spn` — creates `hi-genie-relay-dev` SP, stores credentials, grants CAN_USE,
   and **automatically sets `HI_GENIE_SP_CLIENT_ID` and `HI_GENIE_SP_CLIENT_SECRET` as GitHub
   Actions org secrets** — no manual copy-paste needed.

### GitHub Actions org secrets (auto-provisioned)

`provision_relay_spn` uses the GitHub App credentials already in the secret scope to mint an
installation access token, then encrypts and PUTs the two secrets via the GitHub REST API:

| GitHub Actions secret | Value | Visibility |
|---|---|---|
| `HI_GENIE_SP_CLIENT_ID` | relay SP `application_id` (OAuth client UUID) | all repos |
| `HI_GENIE_SP_CLIENT_SECRET` | relay SP OAuth client secret | all repos |

The secret plaintext **never appears in notebook output or job run history** — it is encrypted
client-side with the org's Curve25519 public key (libsodium `SealedBox`) before being sent to
GitHub.

**Prerequisite:** The GitHub App must have `Organization permissions → Secrets: Read and write`
approved by an org owner. Without it the PUT returns HTTP 403. Grant the permission at
`https://github.com/settings/apps/<app-name>/permissions`, then re-run:

```bash
DATABRICKS_CONFIG_PROFILE=fevm-hls-fde ./deploy.sh --target dev --run-setup
```

Fallback if the GitHub App cannot be granted org-secret write permission: use a fine-grained
PAT with `org:secrets:write` scope stored as `HI_GENIE_GITHUB_PAT` in the secret scope, and
swap the App JWT auth for a `Authorization: Bearer <pat>` header in the notebook.

### Idempotency and rotation

- **SP creation** is idempotent — re-running finds the existing SP by `displayName`.
- **Secret generation** is rotation-safe — each run generates a new OAuth secret and updates
  the scope. Existing tokens remain valid until their expiry; only the stored secret is updated.
- Re-run any time you need to rotate the relay SP credentials.

### What is stored in the secret scope

| Key | Value |
|---|---|
| `relay_sp_client_id` | OAuth client_id (= `application_id`) for the relay SP |
| `relay_sp_client_secret` | OAuth client_secret (new value on each run) |

### App permissions

The job calls `w.apps.set_permissions()` to grant `CAN_USE` on the app for the relay SP.
If the app is not yet deployed when the job runs, this step is non-fatal and prints a warning.
Re-run after deploying the app:

```bash
DATABRICKS_CONFIG_PROFILE=fevm-hls-fde ./deploy.sh --target dev --run-setup
```

## Open items

- **Platform OAuth proxy — webhook blocker (highest priority):** The Databricks Apps OAuth proxy (apps-gateway, Rust) returns HTTP 302 to all unauthenticated requests before they reach Express. GitHub webhooks carry no Databricks session, so `POST /webhook/github` is intercepted. Mitigation options:
  1. **Request platform feature** (`skip_auth_routes` for customer apps) — file an internal ticket so `app.yaml` can list unauthenticated route regexes.
  2. **GitHub Actions relay** — a GitHub Actions workflow fires on PR events and makes an authenticated call to `/webhook/github` using a Databricks PAT (stored as a GitHub Actions secret). The app re-validates with its own shared secret.
  3. **Smee / webhook proxy** — a tiny relay service that authenticates to Databricks and forwards GitHub webhook payloads.
  4. **Polling fallback** — use a scheduled job (e.g., Lakeflow Job every minute) to poll GitHub's REST API for PR state changes, skipping webhooks entirely.
- **Branch GC:** auto-prune branches whose PRs merged (policy + a small cleanup job).
- **PR template contents** and required CI checks.
- **Webhook expansion:** push events → record to work graph; CI status events.
- **`github_tokens` registration in wal2delta** — currently manually inserted as PENDING; should be auto-discovered or added in the deploy pipeline.
