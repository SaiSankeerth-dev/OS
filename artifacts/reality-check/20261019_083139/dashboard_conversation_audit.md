# Dashboard, API Consistency & Conversation Audit

**Target:** `~/workspace/os/OS`, branch `os-10x` @ `ff1e5af` (Batch B)
**Date:** 2026-10-19
**Mode:** READ-ONLY (no code modified)
**Scope:** Audit Tasks A (conversation/intent) and M (dashboard/API consistency)

---

## 1. API Routes — Complete Inventory

### Core routes (`web/server.py`)

| Method | Path | Line | Purpose |
|--------|------|------|---------|
| GET | `/` | 163 | Dashboard HTML |
| GET | `/api/me` | 173 | User/status |
| GET | `/api/onboarding` | 192 | Onboarding state |
| POST | `/api/chat` | 205 | Chat (SSE stream) |
| GET | `/api/approvals` | 274 | Pending approvals |
| GET | `/api/approvals/history` | 281 | Approval history |
| POST | `/api/approvals/{pid}/approve` | 294 | Approve (500 on exec failure — Phase 0 fix) |
| POST | `/api/approvals/{pid}/reject` | 314 | Reject |
| POST | `/api/approvals/{pid}/edit` | 335 | Edit draft |
| GET | `/api/tasks` | 367 | Task list |
| POST | `/api/tasks` | 375 | Create task |
| PATCH | `/api/tasks/{tid}` | 381 | Toggle task (PUT→PATCH — Phase 0 fix) |
| DELETE | `/api/tasks/{tid}` | 390 | Delete task |
| GET | `/api/memory` | 404 | Memory list |
| DELETE | `/api/memory/{key}` | 429 | Forget memory |
| GET | `/api/watchers` | 444 | Watcher list |
| POST | `/api/watchers/{nid}/seen` | 454 | Dismiss watcher (was GET — Phase 0 fix) |
| GET | `/api/skills` | 460 | Skill registry |
| GET | `/api/files` | 478 | File list |
| GET | `/api/files/download` | 508 | Download |
| GET | `/api/projects` | 516 | Projects |
| GET | `/api/analytics` | 540 | Analytics |
| GET | `/api/connectors` | 644 | Connector list |
| GET | `/api/connectors/{cid}` | 665 | Connector detail |
| POST | `/api/connectors/{cid}/grant` | 677 | Grant permission |
| POST | `/api/connectors/{cid}/deny` | 689 | Deny permission |
| POST | `/api/connectors/{cid}/revoke` | 696 | Revoke (local creds) |
| POST | `/api/connectors/{cid}/credentials` | 708 | Save credentials |
| POST | `/api/connectors/{cid}/test` | 722 | Test connection |
| GET | `/api/connectors/{cid}/oauth/start` | 729 | OAuth start |
| GET | `/api/connectors/google/oauth/callback` | 796 | OAuth callback |
| GET | `/api/connectors/microsoft/oauth/callback` | 801 | OAuth callback |
| GET | `/api/connectors/{cid}/settings` | 806 | Settings |
| POST | `/api/connectors/{cid}/settings` | 816 | Save settings |
| GET | `/api/actions/pending` | 828 | Pending actions |
| POST | `/api/actions/{aid}/approve` | 839 | Approve action |
| POST | `/api/actions/{aid}/reject` | 865 | Reject action |
| POST | `/mcp` | 923 | MCP endpoint |
| GET | `/mcp` | 930 | MCP info |
| GET | `/api/calendar` | 938 | Calendar |
| POST | `/api/upload` | 963 | File upload |

### OM router (`web/om/routes.py`, prefix `/api/om`, mounted web/server.py:158)

~70 routes covering: computer (start/stop/commands/files), browsers
(list/create/navigate/read/screenshot/console/pdf/close), activity runs,
documents, finance, goals, ideas, milestones, notifications, threads.

### Static frontend
`web/static/` — `index.html`, `app.js` (1784 lines), `styles.css`,
`sw.js`, PWA manifest + icons. Served at `/static` (web/server.py:151).

---

## 2. Frontend ↔ Backend Consistency (Task M)

**Method:** Extracted all `api(...)` and `fetch(...)` calls from
`web/static/app.js`, compared method + path against backend routes.

| Frontend call | Method | Backend route | Match? |
|---------------|--------|---------------|--------|
| `/api/watchers/{nid}/seen` | POST | `POST /api/watchers/{nid}/seen` (server.py:454) | ✅ |
| `/api/tasks/{tid}` (toggle) | PATCH | `PATCH /api/tasks/{tid}` (server.py:381) | ✅ |
| `/api/tasks/{tid}` (delete) | DELETE | `DELETE /api/tasks/{tid}` (server.py:390) | ✅ |
| `/api/om/browsers/{sid}/close` | POST | `POST /api/om/browsers/{sid}/close` (routes.py) | ✅ |
| `/api/om/browsers/{sid}/console` | GET | `GET /api/om/browsers/{sid}/console` (routes.py) | ✅ |
| `/api/om/browsers/{sid}/navigate` | POST | `POST /api/om/browsers/{sid}/navigate` (routes.py) | ✅ |
| `/api/om/browsers/{sid}/read` | POST | `POST /api/om/browsers/{sid}/read` (routes.py) | ✅ |
| `/api/connectors/{id}/revoke` | POST | `POST /api/connectors/{cid}/revoke` (server.py:696) | ✅ |
| `/api/connectors/{id}/grant` | POST | `POST /api/connectors/{cid}/grant` (server.py:677) | ✅ |
| `/api/connectors/{id}/test` | POST | `POST /api/connectors/{cid}/test` (server.py:722) | ✅ |
| `/api/connectors/{id}/oauth/start` | GET | `GET /api/connectors/{cid}/oauth/start` (server.py:729) | ✅ |
| `/api/om/ideas/{iid}` (dismiss) | PATCH `{status:dismissed}` | `PATCH /api/om/ideas/{iid}` (routes.py) | ✅ |
| `/api/om/goals/{gid}` (done) | PATCH `{status:done}` | `PATCH /api/om/goals/{gid}` (routes.py) | ✅ |
| `/api/om/threads/{tid}/archive` | POST | `POST /api/om/threads/{tid}/archive` (routes.py) | ✅ |
| `/api/om/threads/{tid}/restore` | POST | `POST /api/om/threads/{tid}/restore` (routes.py) | ✅ |
| `/api/upload` | POST | `POST /api/upload` (server.py:963) | ✅ |
| `/api/om/documents/upload` | POST | `POST /api/om/documents/upload` (routes.py:558) | ✅ |
| `/api/om/finance/upload` | POST | `POST /api/om/finance/upload` (routes.py:517) | ✅ |
| `/api/chat` | POST (SSE) | `POST /api/chat` (server.py:205) | ✅ |
| `/api/approvals/{pid}/approve` | POST | `POST /api/approvals/{pid}/approve` (server.py:294) | ✅ |
| `/api/memory/{key}` | DELETE | `DELETE /api/memory/{key}` (server.py:429) | ✅ |

**Result: Zero mismatches found.** The Phase 0 fixes (task checkbox
PUT→PATCH at server.py:381, watcher dismiss GET→POST at server.py:454)
are correctly reflected on both sides.

---

## 3. Conversation & Intent Routing (Task A)

### Architecture (evidence: file:line)

**Three-layer routing, deterministic first:**

1. **Regex intent router** — `server/intent/router.py:266`
   (`IntentRouter.classify()`, 19 compiled patterns in
   `DEFAULT_PATTERNS`). Intents: `TOOL_CALL`, `LLM_CHAT`, `TASK`,
   `PERSONA`, `PERMISSION`, `APPROVALS`. First match wins.

2. **Laya fast router** — `server/routing/laya_router.py:72`
   (`LayaRouter.route()`). Consulted ONLY when regex found no tool
   (manager.py:309-326). Exact regex hits stay authoritative.

3. **LLM fallback** — only when neither router matched a tool.

**Wiring:** `server/conversation/manager.py:167` instantiates
`IntentRouter()`; `manager.py:305` classifies every message;
`manager.py:290-303` routes pending-approval replies before intent
classification (bare "yes" can't misroute as chat — Batch A fix).

**Verdict: Real intent routing, not LLM-only.** Tool calls
(datetime, memory, web search/read, browser, drafts) are resolved
deterministically without any model call.

### Chat handling
`server/conversation/manager.py` (990 lines): `respond_text()`
(manager.py:240) yields `ChatChunk` stream; `/api/chat`
(server.py:205) wraps as SSE. Approval lifecycle integrated
(`_handle_pending_approval`, `_approve_one` with hash verification).

---

## 4. Model Configuration & Ollama Fallback

### Configuration
- `server/llm/router.py:17` — `ModelRouter` wraps a single
  `OllamaClient`; `from_config(base_url, model, timeout_sec)`
  (router.py:26-29).
- `server/llm/ollama.py` — Ollama HTTP client.
- Startup health probe: `web/server.py:67` sets
  `_engine["model_ok"] = bool(ok)`; `False` on exception (server.py:73).

### Ollama-unavailable behavior — HONEST, not broken

**Evidence (web/server.py:240-249):**
```python
msg = (
    "I couldn't reach my language model just now "
    "(is Ollama running?). Tool commands like drafting and "
    "memory still work — try one of those."
    if not _engine.get("model_ok")
    else f"Something went wrong: {type(e).__name__}."
)
```

- No crash: exception caught, SSE stream completes with `done` event.
- Message distinguishes "model unreachable" from other errors.
- **Tool commands keep working** — the regex intent router needs no
  LLM, so datetime/memory/search/drafts function in no-model mode.
- `/api/me` (server.py:183) exposes `model_ok` so the UI can show
  status truthfully.

**Verdict: Honest degraded mode.** The system tells the user what's
wrong and what still works, rather than faking replies or crashing.

---

## 5. Summary Scores (this audit slice only)

| Area | Score | Basis |
|------|-------|-------|
| API route coverage | 9/10 | 40+ core + ~70 om routes inventoried; zero frontend mismatches |
| Frontend/backend consistency | 9/10 | 21 call sites checked, all match on method + path |
| Intent routing | 8/10 | Real 3-layer routing (regex → Laya → LLM); deterministic tool path |
| Ollama fallback honesty | 9/10 | Explicit health flag, honest message, tools still work |
| Chat pipeline | 7/10 | SSE streaming, approval integration; LLM-dependent for open chat |

**Notable:** No dead routes found in the checked surface. No fake
success paths in the approval endpoints (Phase 0 fixed the
`ok:true`-on-failure bug at server.py:294-312).

## 6. Gaps / Follow-ups (not failures)

1. **Laya router availability** — `laya_available()` (laya_router.py:68)
   gates the fast path; if the model file is absent it silently skips
   to LLM. Worth a dashboard indicator.
2. **`/api/actions/*` vs `/api/approvals/*`** — two parallel approval
   APIs exist (server.py:274 vs 828). Both wired, but duality is a
   future confusion risk.
3. **MCP endpoints** (`/mcp` GET/POST, server.py:923-930) — present but
   not exercised in this audit.
