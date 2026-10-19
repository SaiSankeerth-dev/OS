# OS Architecture Map — Reality Check

**Target:** `~/workspace/os/OS`, branch `os-10x`, commit `ff1e5af`
**Date:** 2026-10-19

## Real Entry Points

| Entry | File | Purpose |
|-------|------|---------|
| Dashboard | `web/server.py:982` `run()` → uvicorn | FastAPI on 127.0.0.1:3000 |
| Chat API | `POST /api/chat` (`web/server.py:205`) | SSE stream via ConversationManager |
| CLI | `cli.py` | Dashboard launcher |
| Voice CLI | `voice_cli.py` | Full audio pipeline (requires hardware) |

## Request Flow: Chat Message → Tool Execution

```
User message
    ↓
POST /api/chat (web/server.py:205)
    ↓ SSE stream
ConversationManager.respond_text() (server/conversation/manager.py:240)
    ↓
1. Check pending approvals (manager.py:290-303)
   - Bare "yes"/"no" → _handle_pending_approval
   - >1 pending + bare yes → REFUSE (Batch A fix)
    ↓ (if not approval reply)
2. IntentRouter.classify() (server/intent/router.py:266)
   - 19 regex patterns → TOOL_CALL, LLM_CHAT, TASK, etc.
   - First match wins
    ↓ (if no regex match)
3. LayaRouter.route() (server/routing/laya_router.py:72)
   - Fast local model router (if available)
    ↓ (if no tool matched)
4. LLM fallback (requires Ollama)
   - If Ollama down → honest "can't reach model" message
    ↓ (if TOOL_CALL)
5. Scope check (server/supervisor/scope.py)
   - Tool in scope? → OUT_OF_SCOPE if not granted
    ↓
6. Permission check (server/supervisor/permissions.py)
   - ALLOW → execute
   - NEEDS_APPROVAL → create draft, queue approval
   - DENIED → refuse
    ↓
7. ToolRegistry.execute() (server/intent/registry.py:69)
   - 20 tools from 8 skills
   - Exceptions → ToolResult(failure), never fake success
```

## Component Relationships

### Live and Wired
- `ConversationManager` → `IntentRouter` → `ToolRegistry` → Skills
- `ConversationManager` → `ApprovalStore` (SQLite) → HTTP approve/reject
- `Web Server` → `BrowserService` → `_PlaywrightDriver` (or HTTP fallback)
- `Web Server` → `ConnectorManager` → 16 adapters with live health checks
- `Dashboard` (static JS) → REST API (zero mismatches verified)

### Implemented but Unwired (Dead Code)
- `server/memory/` (321 lines) — zero production callers
  - `SQLiteMemoryManager.store()` never called
  - `MemoryRetriever` never instantiated
  - Dashboard uses raw SQL instead
- `server/tools/base.py`, `server/tools/manager.py` — legacy ToolsManager, no callers
  - Live path uses `server/intent/registry.py:ToolRegistry`

### Absent (Not Implemented)
- `server/tasks/` — deleted in Phase 0, no replacement
- Scheduler — no APScheduler, no cron, no job store anywhere
- Task retry/cancellation — no code exists

### Partially Implemented
- Browser interactive tools — 11 tools registered, draft→approve→execute wired
  - BUT: uncommitted async fix in working tree (committed tree has bug)
  - BUT: can't invoke via chat without Ollama (regex too narrow)
- Voice pipeline — full implementation, but requires hardware + Ollama + packages

## Data Stores

| File | Tables | Purpose |
|------|--------|---------|
| `data/approvals.db` | `pending`, `runs` | Approval queue (SQLite) |
| `data/dashboard.db` | `connector_*` (4) | Connector state |
| `data/om.db` | 12 tables | Browser sessions, goals, notifications, threads |
| `data/os_state.db` | `approvals`, `events`, `sessions`, `tasks` | Tasks = todo list, NOT task engine |
| `memory/os_memory.db` | — | **Does not exist** (nothing ever writes) |

## Dead Paths and Stubs

1. **Memory subsystem** — full implementation, zero callers
2. **Legacy ToolsManager** — two classes, zero callers
3. **Task planner comments** — `router.py:6` "# TASK: deferred", `manager.py:16` "# Phase 10: planner/task manager integration" (aspirational)
4. **Scheduler references** — one comment in `activity.py:9` ("a cron, etc."), no code
5. **MCP endpoints** — `/mcp` GET/POST exist, not exercised

## Security Boundaries

- **Network:** Localhost-only bind (127.0.0.1). No auth, no CORS. Any local process can call any API.
- **Browser:** SSRF guard blocks private IPs. Interactive actions require approval.
- **Computer:** Local mode = cwd-jailed, NOT filesystem-jailed. Shell can read /etc/passwd.
- **OAuth:** Random single-use state, 10-min expiry. Tokens Fernet-encrypted.
- **Approvals:** Hash-bound drafts, indexed approve/reject, expiry fail-closed.
