# GitHub Integration

Manages the project's **single GitHub monorepo**: how each agent checks it out, how feature
branches are created, and how merges are kept off-limits.

## Core stance: the App is the brain, not the hands

The App holds **no server-side working copy**. Two layers:

- **Policy / orchestration (the App):** stores repo config + per-agent checkout specs + naming
  conventions, and talks to **GitHub via REST/GraphQL API only** — creating a branch ref or
  opening a PR needs no working tree.
- **Execution (each agent, locally):** does the real `git clone` / sparse-checkout / commit /
  push in its own environment, and builds/tests with its native toolchain.

`create_feature_branch` is just "create a ref pointing at default HEAD" via the API — instant, no
checkout. The agent then fetches that branch locally and works.

## Clone strategy: full vs sparse, per-project then per-agent

- **Per-project default** (`repo_config`): `full`, or `sparse` with cone paths, plus optional
  **partial clone** (`--filter=blob:none`) for large histories.
- **Per-agent override** (`agent_checkout_spec`), **derived from responsibilities:** when the
  owner says "Isaac owns `/ios/**`, Genie owns `/databricks/**`" in the roster, that same
  definition becomes the agent's **sparse-checkout cone**. One source of truth drives both the
  responsibility boundary and the physical checkout — agents can't easily touch code outside
  their lane.

Use **cone-mode** sparse-checkout (`git sparse-checkout set --cone <dirs>`), the performant modern
path. Databricks **Git folders support sparse checkout**, so Genie's in-Databricks checkout can
mirror its cone exactly the way Isaac's local one does.

> ⚠️ **Non-overlapping cones.** Overlapping paths reintroduce the conflicts sparse-checkout was
> meant to avoid. The roster UI must warn when a new agent's paths intersect an existing agent's.

## Branch & merge policy: always branch, never merge

Enforcement is **defense in depth**, and the real backstop is on GitHub — not app trust:

- **Hard guard — GitHub branch protection** on the default branch: require a PR, require review,
  and **restrict merge to humans only**. Agent identities get `contents: write` +
  `pull_requests: write` (push branches, open PRs) but are **not** in the merge-allowed set. Even
  a rogue or buggy agent is refused the merge by GitHub.
- **Soft guard — no merge tool.** The MCP server simply exposes no `merge_pull_request`.
- **Generated branch names**, not free-form: `create_feature_branch` mints a conventional name
  like `isaac/feat/<task-id>-<slug>` and links it to the originating task/thread — so git work
  threads straight back into the messaging graph.

## GitHub identity: per-user OBO

Symmetric with the Databricks OBO model — one consistent identity story end to end.

- Agents act as the **authenticated human's** GitHub identity (per-user OAuth).
- **Persona attribution** via a `Co-authored-by: Isaac <...>` commit trailer — you get *both* a
  real GitHub identity *and* persona attribution (the same trick used elsewhere in the system).
- **Per-user revocation**, same mental model as the UC connection.

(The alternative considered was a **GitHub App / bot** identity with fine-grained per-repo perms;
rejected for now in favor of OBO symmetry. Revisit if agents should appear as a labeled bot or to
avoid consuming per-user GitHub seats.)

## The connected work graph

A thread where Isaac and Genie hammer out an API contract links to the **branch**, the **task**,
*and* the **PR** — one connected graph across messaging, work items, and code. The git tools keep
this consistent by populating `branch_ref` and writing `pull_requests` rows.

## Decisions

- Single **monorepo**; `repo_config.repos` is a list so polyrepo is a later config change.
- App talks GitHub **API only**; no server-side working copy; agents do local git.
- Per-agent **sparse cones derived from responsibilities**; cone mode + optional partial clone.
- **Always branch, never merge**; GitHub branch protection (hard) + no merge tool (soft).
- **Per-user OBO** GitHub identity; persona via `Co-authored-by:` trailer.

## Open items

- **Branch GC:** auto-prune branches whose PRs merged (policy + a small cleanup job).
- PR template contents and required CI checks.
- Handling agents that legitimately need cross-cutting (full) checkouts.
