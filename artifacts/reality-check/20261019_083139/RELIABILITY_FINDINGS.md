# OS Reliability Findings — Reality Check

**Target:** `~/workspace/os/OS`, branch `os-10x`, commit `ff1e5af`
**Date:** 2026-10-19

## False Success Responses (Confirmed)

### R1: Memory DELETE returns ok:true on nonexistent database
**File:** `web/server.py:429-441`
**Severity:** P2

```python
if db.exists():
    # ... delete ...
return {"ok": True}  # Always returns True, even if nothing deleted
```

**Observed live:** `DELETE /api/memory/nonexistent_key` → `{"ok":true}`
**Impact:** User believes memory was forgotten. It wasn't (nothing existed, but the API lies about the operation).
**Evidence:** Live curl test on :3001.

### R2: (Fixed) Approval false-success
**File:** `web/server.py:294-310`
**Status:** FIXED in Phase 0 (commit ae18bfa)

Previously returned `ok:true` on execution failure. Now raises 500. Verified safe.

---

## Failed Recovery (Confirmed)

### R3: No task recovery (no task engine)
**Severity:** P1

There is no task engine, so there is nothing to recover. Multi-step work in progress is lost on restart. This is not a bug in recovery — it's absence of the subsystem.

### R4: Approval lost on restart-after-failure
**File:** `server/conversation/manager.py:694-696`
**Severity:** P2

SQLite row deleted at start of `_approve_one`. If execution fails and server restarts before retry, the approval is gone. In-memory queue still has it (until restart).

---

## Persistence Defects (Confirmed)

### R5: Memory subsystem is dead code
**Severity:** P1

`server/memory/` (321 lines) has zero production callers. The storage layer works (SQLite), but nothing invokes it. Dashboard bypasses with raw SQL.

**Evidence:** `grep -rn "SQLiteMemoryManager" server/ web/` → zero production hits.

### R6: Browser sessions don't survive restart (by design, honest)
**Severity:** P3 (not a bug)

Playwright pages are in-memory only. On restart, sessions marked "stale" (410), not faked as active. URL preserved. This is correct behavior.

---

## Route Mismatches (None found)

**Verified:** 21 frontend API calls cross-referenced against backend routes. Zero mismatches. The Phase 0 fixes (PUT→PATCH, GET→POST) are correctly reflected on both sides.

---

## Hidden Mocks (None found)

No mocked services pretending to be live. Specifically checked:
- Browser: Real Playwright or honest 503 + "http" engine label
- Connectors: Real live health checks, not hardcoded
- Voice: Real pipeline or clear error, not fake
- Model: Honest "can't reach" message, not fake replies

---

## Hung Operations (None found)

- Tool execution: Synchronous with timeouts
- Browser: 1-60s timeout clamp on actions
- Computer: 30s command timeout, 128KB output cap
- No unbounded waits found

---

## Retry Problems (Confirmed absence)

**No retry logic exists.** Tool failures are honest but terminal. This is a missing feature, not a bug.

---

## Error Swallowing (Checked, none found)

- `ToolRegistry.execute()`: Catches exceptions → `ToolResult(failure)` with message. Does not swallow.
- Approval paths: Raise 500/502 on failure. Do not swallow.
- Skill loader: Logs warning on bad skill, skips. Does not crash.

---

## Test Suite Health

**Baseline (2026-10-19):**
- 336 passed, 23 failed, 2 skipped
- 20 voice/audio tests cannot be collected (missing `sounddevice`, etc.)
- 16 MCP tests fail (missing `mcp` module)
- 3 TTS tests fail (missing modules)
- 2 OCR tests fail (missing tesseract bindings)
- 1 browser test fails (Playwright version mismatch)
- 1 teams test fails (missing module)

**All failures are missing dependencies, not logic bugs.** The test suite cannot fully run without the complete dependency set.

---

## Summary

| Category | Issues |
|----------|--------|
| False success | 1 confirmed (R1), 1 fixed (R2) |
| Failed recovery | 2 (R3: no engine, R4: approval loss) |
| Persistence defects | 2 (R5: dead code, R6: by design) |
| Route mismatches | 0 |
| Hidden mocks | 0 |
| Hung operations | 0 |
| Missing retries | 1 (feature gap) |
| Error swallowing | 0 |

**Reliability is strong where subsystems exist.** The gaps are missing subsystems, not broken ones.
