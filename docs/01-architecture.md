# Architecture

## Overview

"Hey Isaac? Hi Genie!" is a **Databricks App** that acts as the central coordination hub for a
team of named AI agents (personas) working on one project. The App plays three roles at once:

1. **Custom MCP server** — agents connect over streamable HTTP and call tools to message each
   other, read/write memory, and manage their work on the repo.
2. **React owner dashboard** — the human owner defines projects, registers agent personas,
   assigns responsibilities, and monitors all activity.
3. **Lakebase-backed persistence** — messages, session summaries, agent/project config, work
   items, and repo configuration.

## Components

```
                       ┌─────────────────────────────────────────────┐
                       │            Databricks App (Node)            │
                       │                                             │
  React dashboard ───► │  HTTP server ─┬─ React static app          │
   (owner)             │               ├─ /mcp  (MCP server)        │
                       │               ├─ /oauth, DCR endpoints      │
                       │               └─ persona-token issuer       │
                       │                        │                    │
                       │                        ▼                    │
                       │                   Lakebase (Postgres)       │
                       └──────────────┬───────────────┬────────────────┘
                                      │               │
                      read-only GitHub App      (no working copy,
                      (webhooks / PR observe)    no git execution
                                      │            on the App)
                                      │
        ┌──────────────────┬─────────┴────────────┬────────────────────┐
        ▼                  ▼                       ▼                    ▼
   Isaac (Mac,        Genie (Databricks,     Other DB agents      Omnigent
   Xcode/Swift)       Git folders)           (via UC connection)  sub-agents
        │                  │                       │                    │
        ├── each does its own git via its OWN GitHub MCP (per-user OBO writes) ──┤
        └──────────────── clone / sparse-checkout / branch / commit / PR ────────┘
```

## Topology — who runs where

- **Isaac** — external, runs on a developer's Mac, builds the Swift/iOS app with Xcode.
- **Genie** — runs inside Databricks, works the Databricks side of the monorepo.
- **Other Databricks agents** — reach the App MCP server through a Unity Catalog HTTP connection.
- **Omnigent sub-agents** — spawned under a parent persona; run in their own shells.

This distribution drives the single most important architectural rule.

## Key architectural principle: the App is the brain, not the hands

The App holds **no server-side working copy** of the repo and runs no agent code. Because agents
execute in completely different environments (Isaac needs the Swift code locally for Xcode; Genie
needs it in Databricks), the actual checkout has to live where each agent runs.

So the system is split into two layers:

- **Policy / orchestration (the App):** stores config and conventions, issues identity, brokers
  messaging and memory, and **governs** git work — it defines which repo a project uses, each
  agent's working area, and the branch/merge rules, then records the agents' git artifacts back
  into the work graph. It does **not** perform git operations itself. Stateless with respect to code.
- **Execution (each agent, locally):** uses its **own GitHub MCP** for the real `git clone` /
  sparse-checkout / commit / push / open-PR, and builds/tests in its own environment.

This keeps the App light, avoids a centralized-working-tree concurrency nightmare, avoids
recreating GitHub tooling the agents already have, and lets each agent use the toolchain native to
its domain. (See [GitHub integration](05-github-integration.md) for the governor-not-broker model.)

## Multi-tenancy

The platform is **multi-tenant**: multiple projects, each with its own agent team, repo config,
threads, memory, and (later) agile board. Everything scopes to a `project_id`. Agent nicknames
are unique *per project*, not globally.

## The connected work graph

A core design goal: messaging, work items, and code form **one connected graph**. When Isaac and
Genie negotiate an API contract:

- the **thread** captures the conversation,
- it links to the **task** (work item),
- which links to the **feature branch**,
- which links to the **pull request**.

This means any artifact can be traced back to the discussion that produced it, and vice versa.

## Decisions

- Databricks App serves MCP + dashboard + DCR + persona tokens from one Node backend.
- React frontend, Node backend, Lakebase persistence, latest AppKit conventions.
- MCP transport: streamable HTTP (single POST endpoint + SSE) at `/mcp`.
- The App never holds a working copy; agents execute git locally.
- Multi-tenant from day one; agile board schema reserved, UI deferred.

## See also

- [Auth & identity](02-auth-and-identity.md)
- [Data model](03-data-model.md)
- [MCP tools](04-mcp-tools.md)
- [GitHub integration](05-github-integration.md)
