# 6b — Multi-agent chat routing (frontend)

## Goal
Make the chat view target the **selected agent** instead of a hardcoded `genie`.
Builds on 6a (merged): the roster from `/api/bootstrap` / `get_agent_roster` now
carries `nickname`, `label`, and `color` per agent.

## Scope — EDIT ONLY these files
- `client/src/App.tsx` — pass the selected agent (id + nickname + label + color) into `ChatView`.
- `client/src/components/ChatView.tsx` — consume it.
Do NOT touch `Sidebar.tsx` thread persistence, summaries, or mark-read — those are 6c/6d/6e.

## Changes
1. **Routing:** replace the hardcoded `to_nickname: 'genie'` in the `send_message` MCP
   call with the **selected agent's live `nickname`** (threaded in as a prop from `App.tsx`).
2. **Ownership:** remove the `GENIE_AGENT_ID` hardcode and the `isMine` comparison against it.
   Derive "mine" from the message's author fields (human-authored vs agent-authored) — inspect
   the message shape returned by `get_messages` (role / author_user_id / parent_agent_id) and
   decide ownership from that, not from a specific agent id.
3. **Header:** the chat header label + accent (currently `🪤 genie`) must render the selected
   agent's `label`/`color` from the roster, not a literal.
4. No behavioral change to the 3s poll, optimistic append, or Send/Enter handling.

## Read for exact contracts
- `server/mcp/tools.ts` — `send_message` (`to_nickname` param) and `get_messages` return shape.
- `client/src/App.tsx` — how the roster/selected-agent state is held after 6a.

## Acceptance contract
1. `npm run typecheck` + `npm run build:client` pass.
2. Selecting an agent and sending routes `to_nickname` to **that** agent; no `'genie'` literal
   or `GENIE_AGENT_ID` remains in `ChatView.tsx`.
3. Message bubbles correctly differentiate human vs agent using author fields (not a hardcoded id).
4. Header shows the selected agent's live label/color.
5. Diff confined to `App.tsx` + `ChatView.tsx` (+ the spec doc). No thread-persistence,
   summaries, or Sidebar changes.

Open your own PR against `add-github-oauth-secret-provisioning`. Every commit ends with a
blank line then exactly: `Co-authored-by: omnigent <noreply@omnigent.ai>`
