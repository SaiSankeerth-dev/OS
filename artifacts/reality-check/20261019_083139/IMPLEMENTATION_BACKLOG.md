# OS Implementation Backlog — Reality Check

**Target:** `~/workspace/os/OS`, branch `os-10x`
**Date:** 2026-10-19
**Note:** Prioritized fixes. Do NOT implement without authorization.

---

## P0 — Critical (None)

No P0 security issues found. No unauthorized actions, no secret leaks.

---

## P1 — Repair Core Functionality

### ISSUE-001: Build durable task engine
**Severity:** P1
**Effort:** Large

**Evidence:** `server/tasks/` deleted, no replacement. `team.py:64` generates text strings, not tasks.

**Expected:** Task with steps, checkpoints, persisted state, restart recovery.

**Acceptance:**
1. Create 3-step task via API
2. Kill server mid-step-2
3. Restart
4. Verify: resumes from checkpoint OR marks FAILED (not silently lost, not marked complete)

**Files:** New `server/tasks/engine.py`, DB table, API routes
**Dependencies:** None
**Risks:** Must not break existing todo-list API (`/api/tasks`)

---

### ISSUE-002: Wire memory subsystem or delete it
**Severity:** P1
**Effort:** Medium

**Evidence:** `server/memory/` has zero callers. Dashboard uses raw SQL bypass.

**Expected:** Either (a) ConversationManager calls `memory.store()`/`retrieve()`, or (b) delete `server/memory/` and keep dashboard SQL.

**Acceptance:**
1. Send "remember X" via chat (with Ollama)
2. New conversation: "what did I ask you to remember?"
3. Verify: exact value returned from SQLite

**Files:** `server/conversation/manager.py`, `server/memory/`
**Dependencies:** Requires Ollama for full test
**Risks:** Two implementations diverging

---

### ISSUE-003: Build scheduler
**Severity:** P1
**Effort:** Medium

**Evidence:** Zero scheduler code. `grep -rln "apscheduler"` → no hits.

**Expected:** Schedule job, persist, execute without chat turn, survive restart.

**Acceptance:**
1. Schedule "test reminder" in 1 minute via API
2. Wait 70 seconds (no chat interaction)
3. Verify: notification sink received exactly 1 event
4. Restart server, verify: job still scheduled

**Files:** New scheduler module, DB table, API routes
**Dependencies:** APScheduler package
**Risks:** None

---

### ISSUE-004: Fix memory DELETE false-success
**Severity:** P1 (honesty)
**Effort:** Small

**Evidence:** `web/server.py:429-441` returns `{"ok":true}` when DB doesn't exist.

**Expected:** Return 404 or `{"ok":false, "reason":"not found"}` when key doesn't exist.

**Acceptance:**
1. `DELETE /api/memory/nonexistent` → 404 (not 200 with ok:true)
2. `DELETE /api/memory/existing` → 200 with ok:true

**Files:** `web/server.py:429-441`
**Dependencies:** None
**Risks:** None

---

## P2 — Improve Capability and Resilience

### ISSUE-005: Fix approval double-execution race
**Severity:** P2
**Effort:** Small

**Evidence:** `web/server.py:294-310` — no lock on find+execute+remove.

**Expected:** Concurrent approves for same PID execute at most once.

**Acceptance:**
1. Create approval
2. Send 10 concurrent approve requests
3. Verify: action executed exactly once (check side-effect count)

**Files:** `web/server.py:294-310`
**Dependencies:** None
**Risks:** Must not deadlock

---

### ISSUE-006: Add provider-side token revocation
**Severity:** P2
**Effort:** Small

**Evidence:** `web/server.py:697-700` only deletes local rows.

**Expected:** On revoke, call Google/Microsoft revocation endpoint.

**Acceptance:**
1. Connect Google account
2. Revoke via dashboard
3. Verify: token invalid at `https://oauth2.googleapis.com/tokeninfo`

**Files:** `web/server.py`, `web/connectors/oauth_google.py`
**Dependencies:** None
**Risks:** Network call during revoke (handle failure gracefully)

---

### ISSUE-007: Commit browser async fix
**Severity:** P2
**Effort:** Small

**Evidence:** `web/om/browser.py` has uncommitted Playwright thread fix.

**Expected:** Fix committed with regression test.

**Acceptance:**
1. `git status` clean
2. New test: call browser from async context → works (not "Sync API in event loop" error)

**Files:** `web/om/browser.py`
**Dependencies:** None
**Risks:** None (fix already written)

---

### ISSUE-008: Fix approval DB deletion timing
**Severity:** P2
**Effort:** Small

**Evidence:** `manager.py:694-696` deletes SQLite row before execution.

**Expected:** Delete after successful execution, or on explicit failure.

**Acceptance:**
1. Create approval
2. Approve (execution fails)
3. Restart server
4. Verify: approval still in queue (not lost)

**Files:** `server/conversation/manager.py:694-696`
**Dependencies:** None
**Risks:** Must handle double-execution (see ISSUE-005)

---

### ISSUE-009: Add retry policy for tools
**Severity:** P2
**Effort:** Medium

**Evidence:** No retry logic exists.

**Expected:** Configurable retries for transient failures (network timeouts).

**Acceptance:**
1. Tool fails with transient error (e.g., timeout)
2. Verify: retries N times with backoff
3. Verify: gives up after N, returns honest failure

**Files:** `server/intent/registry.py`, `server/supervisor/pipeline.py`
**Dependencies:** None
**Risks:** Must not retry non-idempotent actions

---

### ISSUE-010: Add task cancellation
**Severity:** P2
**Effort:** Medium

**Evidence:** No cancellation mechanism.

**Expected:** Cancel running task, state → CANCELLED, cleanup.

**Acceptance:**
1. Start long-running task
2. Cancel via API
3. Verify: stops within 5s, state=CANCELLED, no partial side effects

**Files:** New (depends on ISSUE-001)
**Dependencies:** ISSUE-001 (task engine)
**Risks:** None

---

## P3 — Quality Improvements

### ISSUE-011: Hash action_args in approval
**Severity:** P3
**Effort:** Small

**Evidence:** `manager.py:454-463` hashes draft only.

**Expected:** Include canonical JSON of action_args in hash.

**Acceptance:** Modify action_args after approval → hash mismatch → reject.

---

### ISSUE-012: Fix browser executor thread leak
**Severity:** P3
**Effort:** Small

**Evidence:** `browser.py:424-451` doesn't shutdown executor.

**Expected:** No thread leak on BrowserService shutdown.

---

### ISSUE-013: Document local-mode computer limits at call site
**Severity:** P3
**Effort:** Small

**Evidence:** Snapshot discloses, but callers don't see warning.

**Expected:** `execute()` docstring warns "cwd-jailed only, not filesystem-isolated".

---

### ISSUE-014: Remove dead code
**Severity:** P3
**Effort:** Small

**Evidence:** `server/tools/base.py`, `server/tools/manager.py` (unused ToolsManager).

**Expected:** Delete or document as deprecated.

---

## Suggested Order

1. ISSUE-007 (commit browser fix) — 1 hour, unblocks browser testing
2. ISSUE-004 (memory DELETE) — 30 min, honesty fix
3. ISSUE-005 (approval race) — 2 hours, security
4. ISSUE-001 (task engine) — 1-2 weeks, core missing feature
5. ISSUE-002 (memory wiring) — 3-5 days, core missing feature
6. ISSUE-003 (scheduler) — 3-5 days, core missing feature
7. ISSUE-008 (approval persistence) — 2 hours, reliability
8. ISSUE-006 (provider revoke) — 2 hours, security hygiene
9. ISSUE-009 (retries) — 1 week, resilience
10. ISSUE-010 (cancellation) — 1 week, depends on #1
11. ISSUE-011 through 014 — polish, as time permits
