# OS Security Findings — Reality Check

**Target:** `~/workspace/os/OS`, branch `os-10x`, commit `ff1e5af`
**Date:** 2026-10-19
**Mode:** Read-only. No code modified.

## P0 — Critical (Stop dangerous behavior)

*None confirmed.* No unauthorized consequential actions, no secret leaks, no auth bypasses found.

---

## P1 — High (Repair core functionality)

*None in security.* The P1s are functional (task engine, memory, scheduler), not security.

---

## P2 — Medium (Design weaknesses, confirmed)

### P2-1: Approval double-execution race
**File:** `web/server.py:294-310`
**Severity:** P2

Two concurrent `POST /api/approvals/{pid}/approve` requests can both pass `_find_pending` before either completes, executing the approved action twice. No lock on the path.

```python
p = _find_pending(mgr, pid)          # in-memory lookup
text = await mgr._approve_one(p)     # executes (await!)
mgr._pending.remove(p)              # removed AFTER success
```

**Impact:** Duplicate side effects (e.g., double form submit, double email).
**Status:** Confirmed by code inspection. Not executed live (would require concurrent requests).
**Fix:** Add async lock around find+execute+remove, or pop-before-await (chat path already does this at `manager.py:813-830`).

### P2-2: Connector action approval race
**File:** `web/server.py:839-858`
**Severity:** P2

Read-then-write on action status with no atomicity. Two concurrent approves can both see `"pending"`. The 409 guard narrows but doesn't close the window.

**Status:** Confirmed design weakness.

### P2-3: Approval deleted from DB before execution completes
**File:** `server/conversation/manager.py:694-696`
**Severity:** P2

`_approve_one` removes the SQLite row at start. If execution raises, the in-memory item stays queued (HTTP reports "still queued"), but a restart loses it entirely.

**Impact:** User-authorized work silently dropped on restart-after-failure.
**Status:** Confirmed by code inspection.

### P2-4: SSRF DNS rebinding (TOCTOU)
**File:** `server/tools/webread_tool.py:57-88`
**Severity:** P2 (design concern)

`_url_blocked` checks DNS, then `urllib` re-resolves at connect. Attacker-controlled DNS can return public IP at check, private IP at fetch.

**Impact:** Limited (requires malicious DNS or redirect chain).
**Status:** Design concern, not experimentally verified.
**Fix:** Pin validated IP, dial by IP with Host header.

### P2-5: Unauthenticated localhost API
**Files:** `web/server.py:982`, `web/om/routes.py:95`
**Severity:** P2 (design concern)

No auth, no CORS, no tokens. `POST /om/computer/commands` runs `bash -c` as server user. Any local process can invoke.

**Assessment:** Acceptable for single-user localhost tool. **Must never bind to 0.0.0.0** without adding auth (no auth mechanism exists to enable).
**Status:** Verified by inspection. Working as designed.

---

## P3 — Low (Minor issues)

### P3-1: Browser executor thread leak
**File:** `web/om/browser.py:424-451` (uncommitted)
**Severity:** P3

`shutdown()` doesn't call `self._exec.shutdown()`. Leaks one thread per BrowserService instance.

### P3-2: Approval hash doesn't cover action_args
**File:** `server/conversation/manager.py:454-463`
**Severity:** P3 (design concern)

Hash binds human-readable draft only. Machine args bound by atomic construction, not hash. Currently safe, but fragile.

### P3-3: OAuth postMessage wildcard
**File:** `web/connectors/oauth_google.py`
**Severity:** P3

`postMessage(..., "*")` — any origin can receive "oauth-done" signal. No secrets leaked (just completion signal). Design concern, not exploitable.

---

## Verified Safe (No issues found)

- **Bare yes/no binding:** Refuses with >1 pending. Indexed approve/reject works.
- **Hash binding:** Recomputed at execution, mismatch → reject.
- **No false success:** Approve raises 500 on failure, dequeues only on success.
- **Expiry:** Fail-closed, lazy prune.
- **SSRF:** Blocks private IPs, 5-hop redirect cap, re-validates redirects.
- **Browser allowlist:** Only click/fill/type/press/select; unknown → 422.
- **Stale sessions:** 410, marked "stale", URL preserved.
- **Permissions:** Unknown tools → DENIED. Read-only ALLOW, interactive NEEDS_APPROVAL.
- **OAuth CSRF:** Random single-use state, 10-min expiry.
- **No eval():** Only docstring mention. `ast.parse` in calc.
- **Token encryption:** Fernet AES-128, refresh-token only.
- **Queue full:** Refuses new items (fail-closed).

---

## Summary

| Severity | Count |
|----------|-------|
| P0 | 0 |
| P2 | 5 (2 races, 1 persistence, 1 DNS, 1 auth-boundary) |
| P3 | 3 (minor) |
| Verified safe | 12 areas |

**No critical vulnerabilities.** The approval race (P2-1) is the most serious — it can cause duplicate side effects from a double-click.
