# ADR 001 — GitHub is pull, not push; coordination is Lakebase-native

- **Status:** Accepted
- **Date:** 2026-07-11
- **Deciders:** Project owner
- **Related:** `docs/05-github-integration.md`, `docs/08-notify-bridge.md`, `docs/03-data-model.md`

## Context

Phases 5 / 5b / 5c built a GitHub integration around **inbound webhook delivery**:
GitHub events → `/webhook/github` → per-repo HMAC verification → `app.pull_requests`
upsert in Lakebase Postgres → wal2delta CDC → Unity Catalog. To make GitHub actually
deliver to the app, that path additionally required a **relay** that could attach a
Databricks M2M bearer token and originate from an allow-listed IP, because the
Databricks Apps OAuth gateway and the workspace **IP Access List** both reject raw
inbound GitHub delivery.

Chasing a workable relay consumed significant effort and produced a long tail of
increasingly heavy options:

- GitHub Actions relay workflow (works, but GitHub-hosted runner IPs are ~7,200 CIDR
  ranges — impractical to allow-list, and confirmed to hit the IP ACL: the runner's
  egress IP `20.169.94.67` was 403'd with an explicit
  `blocked by Databricks IP ACL` reason).
- `Redpanda → Zerobus → Delta` — ruled out twice: Zerobus ingest is itself a
  workspace-scoped endpoint governed by the **same** IP ACL, and it lands data in
  **Delta**, the wrong side of the one-way Postgres→Delta CDC boundary (synced tables
  back into Postgres are read-only, so they cannot be the writable `app.pull_requests`).
- Edge-function relay (AWS Lambda + NAT Gateway + Elastic IP) behind a single
  allow-listable `/32` — viable, but greenfield AWS infra (VPC/NAT/Lambda/API Gateway)
  standing up **solely** to relocate egress to one IP.
- Self-hosted GitHub Actions runner on a static IP — lighter, but still a box to own.

Stepping back to first principles surfaced the real question: **why does the app need
GitHub data at all, and does any of it require real-time inbound push?**

The platform's premise is **AI agents coordinating work on a shared GitHub monorepo**,
using Lakebase for short-term memory, long-term project memory, and inter-agent
messaging. GitHub data serves two distinct needs that had been conflated:

1. **State** — "what is the current status of PR #42?" A *query*. Needs to be current,
   not necessarily real-time.
2. **Trigger** — "something changed, an agent should react *now*." An *event*. Needs low
   latency.

Nearly all the pain came from insisting on need #2 as **inbound push into an
IP-restricted, OAuth-gated workspace**. But in this system the trigger is never a
GitHub event — it is **an agent writing a message to Lakebase**, which fires the
existing NOTIFY bridge (`docs/08-notify-bridge.md`) and wakes whoever must react. An
agent acting in git is, by definition, already awake and already inside the trust
boundary; it reads GitHub **outbound** and records what happened into Lakebase — either
narrated in the message body or written to a reference table (e.g. `app.pull_requests`)
that other agents pull from.

## Decision

**Coordination is Lakebase-native. GitHub is an outbound-pull peripheral, not an
inbound event source for coordination.**

Concretely:

1. **The trigger is always a Lakebase message write**, not a GitHub event. The
   NOTIFY-on-message bridge remains the single real-time wake mechanism. No coordination
   path depends on GitHub pushing into the workspace.

2. **GitHub is read outbound by already-active agents / the app**, using the GitHub App
   installation token the app already holds. Outbound calls from the workspace are not
   IP-ACL-blocked. Agents pull PR / CI / review state on demand and record it into
   Lakebase.

3. **`app.pull_requests` (and any GitHub reference table) is populated write-side by the
   acting agent**, via that outbound read + a normal Postgres write — not by an
   ingest pipeline. The write is what fires NOTIFY; the reverse (Delta→Postgres) path is
   explicitly not required.

4. **The merged inbound webhook handler is kept as a dormant, optional fast-path.** It is
   cross-reviewed, correct, and free at idle. It is not load-bearing and nothing depends
   on it being reachable from GitHub.

5. **The relay work is parked.** GitHub Actions relay, edge-function/Lambda+NAT, Zerobus,
   Redpanda, and self-hosted-runner options are all shelved. They exist only to secure
   inbound delivery the product does not require. Revisit **only** if a genuine
   sub-second, cold, human-originated trigger appears (see below).

6. **A "DevOps runner" is an agent, not infrastructure.** A specialized team member with
   CI/CD tooling participates in Lakebase like any other agent: when CI finishes or a
   deploy completes, *it* writes a message (which fires NOTIFY). It does not reintroduce
   an inbound ingestion pipeline.

## The one scoped exception: cold external triggers

The only scenario this model cannot catch natively is an event that originates **entirely
outside the agent system with no agent active or scheduled to look** — for now, a
**human** git action (opens a PR, approves, comments) when every agent is dormant.

Even this has a Lakebase-native answer and does **not** justify reopening inbound push:

- A scheduled or DevOps-runner **agent polls GitHub outbound** on an interval; when it
  observes the human's action it writes the message that wakes the rest. Human action →
  runner notices on next poll → runner messages → NOTIFY. No inbound path is ever crossed.
- "Within a minute or two" freshness is acceptable for this case, which outbound polling
  trivially satisfies.

Inbound webhook delivery (and therefore a relay) would earn its keep **only** if a future
requirement demands a **sub-second reaction to a cold, human-originated git event with no
agent in or near the loop**. No such requirement exists today.

## Addendum (2026-07-11) — agents use the official GitHub MCP

This decision assumes each agent performs all git operations through the **official
GitHub MCP server**, not a Hi-Genie-built GitHub client. This is the concrete form of the
"our App governs, the agents' own GitHub MCP does the work" stance in
`docs/05-github-integration.md`. It refines the decision above as follows.

**Division of labor**

- **Official GitHub MCP** — the agents' hands on git: read PR / CI / review / code state,
  create branches, commit, push, open PRs.
- **Hi-Genie app** — *policy* (which repo backs a project, per-agent working areas,
  branch / merge rules — the existing `repo_config`) and *linkage* (record a PR / branch /
  status against a thread/task in Lakebase and fire NOTIFY).
- **Lakebase** — short-term memory, long-term project memory, inter-agent messaging.

We build **no outbound GitHub readers**. The "outbound direction" follow-up below shrinks
to the **linkage half only**: a Hi-Genie MCP tool that records what an agent did in
GitHub (obtained via the official MCP) into Lakebase.

1. **Auth — per agent, as a human.** Each agent authenticates to the official GitHub MCP
   with a **human's** GitHub credentials via standard **Dynamic Client Registration (DCR)
   or OAuth** — not a shared service principal. Git actions are therefore attributed to
   real people, per agent. This is independent of the GitHub App the Hi-Genie app itself
   provisioned.

2. **Linkage is trusted, reconciled peer-to-peer.** The app **trusts** the agent's report
   when writing linkage into Lakebase — no eager server-side verification against GitHub.
   Correctness is **emergent**: if another agent later pulls the full code/state from
   GitHub (via the official MCP) and finds a discrepancy against what Lakebase records, it
   **messages the original author agent to verify** — a discrepancy → message → NOTIFY →
   author-reconciles loop, fully in keeping with the Lakebase-native coordination model.
   No server-side truth-checking is added.

3. **Keep the app's own GitHub App for now.** The GitHub App credentials the Hi-Genie app
   provisioned (client id/secret, app id, private key, installation) are **retained** —
   not shrunk or retired — in case the app still needs server-side GitHub access (e.g.
   `register_repo` / preflight installation checks) or a future need appears. Revisit only
   deliberately.

## Consequences

**Positive**

- The entire inbound relay / IP-ACL / NAT / edge-function problem is removed from the
  critical path. No new AWS infra, no runner host, no IP-ACL churn.
- The GitHub integration reduces to **outbound reads + Lakebase writes**, all inside the
  trust boundary — simpler, cheaper, and consistent with the existing "our App governs,
  the agents' own tooling does the work" stance in `docs/05-github-integration.md`.
- Coordination has a single real-time mechanism (the NOTIFY bridge), not two competing
  ones.

**Negative / accepted trade-offs**

- Cold human-originated events are observed at **poll latency** (seconds-to-minutes), not
  in real time. Accepted.
- Outbound polling is subject to GitHub API **rate limits**; a runner/poller must be
  reasonable about interval and scope. Accepted.
- The merged webhook code stays in the tree unused. Accepted as a low-cost future option;
  it may later be retired if it never earns activation.

**Follow-ups (not required by this decision, but implied)**

- Build the **linkage tool**: a Hi-Genie MCP tool that records what an agent did in
  GitHub — read via the **official GitHub MCP** (see Addendum) — into Lakebase as messages
  + reference-table rows against the thread/task. We build no outbound GitHub readers
  ourselves; this never touches an IP ACL.
- The broken **Lakebase→UC CDF sync** (`lb_pull_requests_history` stale since
  2026-07-03) remains worth fixing, but as an **analytics/observability** concern fully
  decoupled from coordination.
- When the DevOps-runner is specced, define it as an **agent** that inherits the Lakebase
  messaging/memory model.
