# 6f — Branch / PR linkage + repo detail (frontend)

## Goal
Surface the already-built, unrendered MCP tools: `get_my_checkout_spec`, `link_branch`,
`link_pull_request`, and `get_repo_config` in the owner dashboard.

## CRITICAL semantic quirk (do not get this wrong)
`link_branch` and `get_my_checkout_spec` **IGNORE** their `project_id` / `thread_id` /
`repo_url` inputs — the checkout spec is **per-agent GLOBAL**, not per-thread. So the UI must
present the branch as **"this agent's current branch"** on the AGENT CARD — never as a
per-thread branch. A per-thread branch control would be misleading.

`link_pull_request` DOES derive `project_id` from the thread and sets `opened_by = <human>` —
so a "link a PR to this thread" affordance is correct in a thread/agent context.

## Scope — EDIT ONLY these areas
- New component(s) for the branch display + link-PR affordance (e.g. under `client/src/components/`).
- `client/src/components/ProjectView.tsx` — mount the branch info on the agent card.
- `client/src/components/RepoSection.tsx` — enrich with `get_repo_config` detail.
Do NOT touch `App.tsx`, `ChatView.tsx`, or `Sidebar.tsx` (those are 6b/6c/6d/6e).

## Changes
1. **Agent branch (agent-global):** on each agent card, show the agent's current checkout spec
   via `get_my_checkout_spec`; provide a control that calls `link_branch` to set/update it.
   Label it clearly as the agent's current branch (agent-scoped, not thread-scoped).
2. **Link PR to thread:** a "link PR" affordance that calls `link_pull_request(thread_id, …)`.
3. **Repo detail:** enrich `RepoSection` using `get_repo_config` (today it only calls
   `/api/repos/status`).
4. MCP calls use the existing `/mcp` persona-token pattern already used by `start_thread` etc.

## Read for exact contracts
- `server/mcp/tools.ts` — exact zod input + return shape for the four tools. Note that the
  handlers ignore several accepted params (see quirk above); rely on the handler behavior,
  not the schema, for scoping.
- `client/src/components/ProjectView.tsx` / `RepoSection.tsx` for the current agent-card and
  repo-list structure after 6a.

## Acceptance contract
1. `npm run typecheck` + `npm run build:client` pass.
2. Branch shown on the AGENT CARD, labeled agent-global; `link_branch` updates it.
3. `link_pull_request` affordance links a PR to a thread and round-trips.
4. `RepoSection` shows `get_repo_config` detail.
5. Diff confined to new component(s) + `ProjectView.tsx` + `RepoSection.tsx` (+ spec doc).
   No changes to `App.tsx`/`ChatView.tsx`/`Sidebar.tsx`.

Open your own PR against `add-github-oauth-secret-provisioning`. Every commit ends with a
blank line then exactly: `Co-authored-by: omnigent <noreply@omnigent.ai>`
