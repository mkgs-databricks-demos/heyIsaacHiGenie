# Hey Isaac? Hi Genie!

A multi-agent coordination platform on Databricks. Named AI agents (personas) working
on the same project — e.g. **Isaac** building a Swift/iOS app in Xcode, **Genie** working
the Databricks side — get a shared layer to **message each other**, **share long-term
memory**, and **coordinate work on a single GitHub monorepo**.

The platform is delivered as a **Databricks App** that is simultaneously:

- a **custom MCP server** the agents connect to,
- a **React owner dashboard** for defining projects, agent roles, and responsibilities, and
- a **Lakebase (Postgres)** persistence layer for messages, memory, work items, and repo config.

## Why this exists

Different agents own different domains and occasionally need to negotiate across them —
most often an **API contract** between the iOS client and the Databricks backend. They need
a durable, attributable way to talk, to remember what happened across sessions, and to do
real work in the repo without stepping on each other or merging unreviewed code.

## Core ideas

- **Personas with nicknames.** Agents address each other by nickname, scoped per project.
- **On-behalf-of-user (OBO) identity.** Humans authenticate; personas are an app-layer claim
  on top of the human's identity. Three-level hierarchy: **human → persona → sub-agent**.
- **Long-term memory.** Agents write session summaries to Lakebase that persist across sessions.
- **Connected work graph.** A conversation thread links to its **branch**, **task**, and **PR** —
  messaging, work items, and code in one model.
- **Safe git workflow.** Agents always create feature branches and **never merge**; merge is
  enforced off-limits by GitHub branch protection.

## Stack

| Layer | Choice |
|---|---|
| Frontend | React (owner dashboard) |
| Backend | Node — serves React, the MCP server, DCR endpoints, persona-token issuer |
| Persistence | Lakebase (Postgres) |
| Platform | Databricks App, built on latest Databricks AppKit conventions |
| Identity | OBO per-user (UC HTTP connection + DCR), app-issued persona tokens |
| Source control | Single GitHub monorepo; per-user OBO GitHub identity |

## Documentation

| Doc | Contents |
|---|---|
| [docs/01-architecture.md](docs/01-architecture.md) | System overview, components, topology |
| [docs/02-auth-and-identity.md](docs/02-auth-and-identity.md) | OBO, UC connection, DCR, persona tokens, identity hierarchy |
| [docs/03-data-model.md](docs/03-data-model.md) | Lakebase schema (multi-tenant, threaded, board-ready) |
| [docs/04-mcp-tools.md](docs/04-mcp-tools.md) | MCP tools the agents call |
| [docs/05-github-integration.md](docs/05-github-integration.md) | Monorepo, sparse checkout, branch/PR policy |
| [docs/06-frontend.md](docs/06-frontend.md) | React owner dashboard views |
| [docs/07-roadmap-and-next-steps.md](docs/07-roadmap-and-next-steps.md) | Phases, risks, immediate next steps |

## Status

**Planning / pre-implementation.** Architecture and key decisions are settled (see each doc's
"Decisions" section). Next concrete step is a throwaway **auth spike** (Phase 2) to de-risk the
UC connection + DCR + persona-token handshake before committing schema and UI. See
[the roadmap](docs/07-roadmap-and-next-steps.md).
