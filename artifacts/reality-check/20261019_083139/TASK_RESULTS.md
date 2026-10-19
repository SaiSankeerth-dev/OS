# OS Task Results — Reality Check

**Target:** `~/workspace/os/OS`, branch `os-10x`, commit `ff1e5af`
**Date:** 2026-10-19

## Task A — Basic Conversation and Intent

**Request:** "Calculate 137 multiplied by 246, explain the result, and show how you verified it."

**Observed:**
- Without Ollama: Chat returned fallback message listing what works without a model
- With regex: `calc` tool exists and works (`137 * 246` → 33702 verified live via ToolRegistry)
- The chat path without Ollama cannot invoke calc via natural language (no regex pattern for arithmetic)

**Status:** PARTIAL
- Tool works (E2E via registry)
- Chat cannot access it without LLM (regex gap)
- Correct answer: 33,702

**Evidence:** Live API test, `server/intent/registry.py:69-94`

---

## Task B — Memory Persistence

**Request:** Store "TEST-ORBIT-47", retrieve in new conversation, update to "TEST-ORBIT-82", forget.

**Observed:**
- `POST /api/memory` → 405 Method Not Allowed (no write API)
- `server/memory/` has zero production callers (dead code)
- `DELETE /api/memory/{key}` → `{"ok":true}` on nonexistent key (false success)
- Memory database file does not exist

**Status:** FAIL
- Cannot store via API
- Subsystem is unwired
- Forget lies about success

**Evidence:** Live API tests, subagent grep (zero callers)

---

## Task C — Multi-step Planning

**Request:** Create 3 tasks with dependencies, execute in order.

**Observed:**
- `server/tasks/` does not exist (deleted)
- "Planning" = LLM generates text strings (`team.py:64-95`)
- No persistence, no checkpoints, no state machine
- Todo-list API (`/api/tasks`) exists but is not a task engine

**Status:** FAIL
- No durable task engine exists

**Evidence:** Static inspection, `ls server/tasks/` → not found

---

## Task D — Failure Handling and Retries

**Request:** Run failing operation, verify retry, test cancellation.

**Observed:**
- Tool failures return honest `ToolResult(failure)` 
- No retry logic exists
- No cancellation mechanism exists
- Failures are terminal

**Status:** PARTIAL
- Honest failures (good)
- No recovery (missing)

**Evidence:** `registry.py:88-94`, grep for retry → none

---

## Task E — Browser Interaction

**Request:** Open local test page, interact with form elements.

**Observed:**
- Created test HTML page with heading, input, button
- Browser `create` with localhost URL → **blocked by SSRF guard** (correct!)
- Playwright driver exists and launches (subagent verified)
- Interactive tools (click/fill) implemented with read-back validation
- Async fix is uncommitted (working tree only)

**Status:** PARTIAL
- Implementation is real and safe
- Cannot fully E2E test via chat without Ollama
- SSRF correctly blocks test (security working)

**Evidence:** Live API (422 on localhost), subagent runtime tests

---

## Task F — Computer and Terminal Isolation

**Request:** Test sandbox boundaries.

**Observed (subagent runtime tests):**
- File API blocks path traversal (`/etc/passwd` → 404)
- Shell `execute("cat /etc/passwd")` → **succeeded** (local mode not filesystem-jailed)
- Env scrubbed (no secrets in env)
- Snapshot honestly says "not container-isolated"

**Status:** PARTIAL
- File API is jailed
- Shell is NOT jailed (documented limitation)

**Evidence:** Subagent R-level tests

---

## Task G — Skill Import and Execution

**Request:** Inspect skill loading, validation, execution.

**Observed:**
- 8 active skills, 20 tools, loaded live
- Malformed SKILL.md → `status=planned` → skipped (fail-closed)
- No shell injection (skills use Python imports, not subprocess)
- `calc` uses `ast.parse`, not `eval()`

**Status:** PASS
- Loading works, validation works, execution works

**Evidence:** Live loader run, static inspection

---

## Task H — Scheduler

**Request:** Schedule a reminder in 1 minute.

**Observed:**
- No scheduler code exists (zero hits for apscheduler/cron)
- No job store, no background loop
- Cannot schedule anything

**Status:** FAIL (BLOCKED — capability absent)

**Evidence:** `grep -rln "apscheduler"` → zero hits

---

## Task I — Web Research

**Request:** Research with source tracing.

**Observed:**
- `web_search` and `web_read` tools exist in registry
- SSRF protection present
- Not end-to-end tested (requires network + LLM for full flow)

**Status:** NOT TESTED (tools exist, full flow needs LLM)

**Evidence:** Static (registry), no live E2E

---

## Task J — Approval and Authorization

**Scenarios tested (via code inspection + live API):**

1. ✅ Low-risk allowlisted action — datetime tool executes without approval
2. ✅ Consequential requires approval — browser_click is NEEDS_APPROVAL
3. ✅ Denied action — unknown tools → DENIED
4. ✅ Expired approval — lazy prune, nothing executes
5. ✅ Malformed request — validation errors, no execution
6. ✅ Ambiguous "yes" — refuses with >1 pending, lists items
7. ⚠️ Args changed — draft hash-bound, but action_args not hashed (P3)
8. ✅ Failed after approval — raises 500, dequeues only on success
9. ❌ Duplicate approval — **race allows double-execution** (P2 bug)
10. ✅ Missing tool — "unknown tool" failure, honest

**Status:** PARTIAL (9/10 pass, 1 critical race)

**Evidence:** `manager.py`, `server.py:294-310`, live API

---

## Task K — Connectors and OAuth

**Observed:**
- 16 connectors, all with real health checks (live API calls)
- OAuth state: random, single-use, 10-min expiry
- Tokens: Fernet-encrypted, refresh-token only
- Revoke: local delete only, **no provider-side revocation**

**Status:** PARTIAL
- Security is excellent
- Provider revoke missing

**Evidence:** `adapters.py`, `server.py:742-760`, `vault.py`

---

## Task L — Voice

**Observed:**
- Full pipeline: mic → AEC → VAD → Whisper → Ollama → TTS → speaker
- All components real (faster-whisper, Silero, PocketTTS)
- Missing hardware → clear RuntimeError, exit 2 (honest)
- Requires: Ollama + microphone + speaker + 4 packages

**Status:** BLOCKED (no hardware on test VM)

**Evidence:** Static inspection, `factory.py:21-23`

---

## Task M — Dashboard and API Consistency

**Observed:**
- 21 frontend API calls checked against backend routes
- **Zero mismatches** (method + path all match)
- Dashboard loads (200), zero JS errors (Playwright screenshot)
- Chat SSE streaming works

**Status:** PASS

**Evidence:** Cross-reference audit, live screenshot

---

## Task N — Restart and Persistence

**Observed:**
- Todo tasks: persist in SQLite, survive restart (verified)
- Approvals: SQLite queue, restored on startup (`manager.py:150-155`)
- Browser sessions: marked "stale" (410), not faked as active
- Memory: nothing to persist (dead code)
- Task engine: doesn't exist

**Status:** PARTIAL
- What exists persists correctly
- Missing subsystems can't persist

**Evidence:** Static + live API

---

## Task O — Security Injection

**Tested:**
- ✅ SSRF: blocks 127.0.0.1, 169.254.169.254, 10.0.0.1 (live)
- ✅ Path traversal: file API blocks (live)
- ✅ Shell injection: no vectors in skills (static)
- ✅ Approval bypass: hash binding works (static)
- ⚠️ DNS rebinding: TOCTOU possible (design concern)
- ❌ Approval race: double-execution possible (confirmed bug)

**Status:** PARTIAL (most controls work, one serious bug)

---

## Task P — Performance

**Measured:**
- Test suite: 336 passed in 30.9s (excluding 20 voice tests that can't collect)
- API latency: <200ms for tasks, approvals, memory (localhost)
- Chat without Ollama: <1s (fallback message)
- Browser launch: ~2s (Playwright, when working)

**Status:** PASS (adequate for local use)

**Evidence:** Live measurements

---

## Summary

| Task | Status |
|------|--------|
| A (Conversation) | PARTIAL |
| B (Memory) | FAIL |
| C (Planning) | FAIL |
| D (Retries) | PARTIAL |
| E (Browser) | PARTIAL |
| F (Computer) | PARTIAL |
| G (Skills) | PASS |
| H (Scheduler) | FAIL |
| I (Research) | NOT TESTED |
| J (Approvals) | PARTIAL |
| K (Connectors) | PARTIAL |
| L (Voice) | BLOCKED |
| M (Dashboard) | PASS |
| N (Persistence) | PARTIAL |
| O (Security) | PARTIAL |
| P (Performance) | PASS |

**3 PASS, 9 PARTIAL, 3 FAIL, 1 BLOCKED, 1 NOT TESTED**
