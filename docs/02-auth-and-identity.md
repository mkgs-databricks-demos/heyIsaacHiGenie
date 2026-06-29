# Authentication & Identity

This is the most important and highest-risk part of the system. The model is **on-behalf-of-user
(OBO)** everywhere, with agent personas layered on top as an application-level claim.

## The constraint that shapes everything

Databricks Apps are **always fronted by Databricks OAuth** — every request must carry a valid
Databricks identity before it reaches the Node code. For custom MCP servers on Apps specifically:

- **Personal access tokens (PATs) are not supported** — OAuth only.
- **Dynamic Client Registration (DCR) is not offered to external clients** connecting *to* a
  Databricks-hosted app (Databricks acting as OAuth *provider*). External clients must use a
  pre-registered static OAuth app + redirect URL.

DCR support differs by direction (see the table below) — this distinction matters.

## Two layers of identity

| Layer | What it establishes | How |
|---|---|---|
| **Transport / platform** | The authenticated **human user** | Databricks OAuth (OBO). UC enforces the user's permissions; per-user audit. |
| **Application** | The **agent persona** (Isaac/Genie) and **sub-agent** | App-issued, signed, scoped persona token resolved in MCP middleware. |

Critically, under OBO the transport layer only ever identifies the **human** — never the persona.
So persona identity **cannot be derived** from the transport principal; it must be asserted by an
app-layer claim (the persona token).

## Identity hierarchy

```
Human user        ← UC OBO: real identity, UC-enforced, audited, per-user revocable
  └─ Agent persona     ← app-issued signed persona token (Isaac / Genie)
       └─ Sub-agent    ← Omnigent worker: inherits parent persona, carries a label
```

Messages and session summaries carry `parent_agent_id` plus an optional `sub_agent_label`, so a
summary can read "Isaac → omnigent-worker-3 refactored the networking layer" while everything
rolls up to the right persona and the right human in the audit trail.

## In-Databricks consumers — Unity Catalog HTTP connection

In-Databricks agents (Genie, other DB agents, Omnigent) reach the App MCP server through a
**Unity Catalog HTTP connection** configured with auth type **"OAuth User to Machine (Per User)."**

- **Catalog → Connections → Create connection → HTTP → OAuth User to Machine (Per User).**
- Each human logs in **individually** with their own Databricks identity; the MCP server receives
  each request *on behalf of that specific user*.
- **Unity Catalog enforces that user's permissions** on every call; per-user auditing/accountability.
- **Per-user revocation:** a user can revoke their own consent —
  `DELETE /api/2.0/oauth-app-integrations/<app-integration-id>/user-consent/me`. Revoking one user
  does not affect anyone else.

## Auto-registration via DCR (RFC 7591)

The App **implements an OAuth 2.0 Dynamic Client Registration endpoint** so that Databricks (and
other DCR-capable clients) auto-discover, register, and create the UC connection — no manual
client ID/secret configuration.
Auto-discovery is exposed via `GET /.well-known/oauth-authorization-server`, which advertises `/register` as the `registration_endpoint`.

Reconciling the two directions of DCR support:

| Direction | DCR? |
|---|---|
| **Databricks consuming an external MCP server** (Databricks is the OAuth *client*) | **Works** — if the server implements RFC 7591, Databricks auto-registers and creates the UC connection. This is our App. |
| **External client connecting to a Databricks-hosted app** (Databricks is the OAuth *provider*) | **Not offered** — the external client must use a pre-registered static OAuth app + redirect URL. A client that *mandates* DCR cannot connect. |

## External agents (e.g. Isaac on a Mac)

External agents do **not** go through a UC connection — they hit the App's `/mcp` endpoint
directly. Requirements:

- A **pre-registered static OAuth app** with the client's exact redirect URL
  (e.g. `http://localhost:<port>/oauth/callback` for a local dev tool).
- The runtime must support the **OAuth authorization-code flow** and hold/refresh tokens.
- The runtime must **not require DCR** (Databricks-as-provider doesn't offer it).
- For public clients (browser/mobile), do not generate a client secret.

## Persona tokens (the application layer)

Because the transport only authenticates the human, each agent asserts its persona with an
**App-issued, signed, scoped persona token**:

- Issued when the owner registers an agent persona in the dashboard.
- Attached by the agent to its MCP calls; verified by middleware (signature + that the persona is
  **granted to the authenticating user** via `agent_grants`).
- **Bounded risk:** an agent can only assume personas the live human OBO token is permitted to
  drive. A leaked persona token alone is useless without that user's active OBO session.
- Revocable per persona, independent of the human's UC consent.

Nicknames and persona are **never trusted from the request body** — always resolved from the
verified persona token.

## Decisions

- OBO per-user everywhere (not service-principal-per-agent).
- In-Databricks: UC HTTP connection, `OAuth U2M Per User`, per-user login + revocation.
- The App implements an RFC 7591 **DCR endpoint** for auto-registration.
- External agents: static pre-registered OAuth app + auth-code flow; no DCR dependency.
- Persona = App-issued signed token, bounded to granted users; never self-asserted in the body.
- Identity hierarchy human → persona → sub-agent, carried on messages/summaries.

## App SPN — deployment-time grants

Databricks Apps auto-provisions a **service principal** for the app itself. This SPN is the
identity the app uses for service-level Postgres queries (DDL, admin operations, AppKit pool).
It is distinct from the OBO human user and has no relation to the persona token.

`deploy.sh` calls the `configure_app_spn` DABs job after every app bundle deploy to ensure the
SPN has the required access (idempotent — safe to re-run):

| Grant | Where |
|---|---|
| Secret scope READ | App's secret scope (all targets) |
| `GRANT ALL ON SCHEMA public` | Lakebase `databricks_postgres` |
| `GRANT ALL ON SCHEMA appkit` | Lakebase (applied only if `appkit` schema exists) |
| `ALTER DEFAULT PRIVILEGES … GRANT ALL ON TABLES/SEQUENCES IN SCHEMA public` | Lakebase |

The job receives a **`lakebase_connection_string`** parameter built at deploy time by `deploy.sh`
(deployer's OAuth token + live endpoint host, both URL-encoded). The notebook just calls
`psycopg2.connect()` — no credential logic inside the notebook.

## Open items

- Persona-token format (JWT vs opaque + introspection), signing key storage (Databricks secret),
  rotation, and TTL — to be settled during the auth spike.
- Exact UC connection scopes required.

## See also

- [Roadmap — Phase 2 auth spike](07-roadmap-and-next-steps.md) (the de-risking step)
- [GitHub integration](05-github-integration.md) (mirrors this OBO model for GitHub)
