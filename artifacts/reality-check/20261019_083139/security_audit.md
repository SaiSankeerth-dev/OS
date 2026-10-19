# Security Audit — Approvals, Permissions, Security Boundaries

**Target:** `~/workspace/os/OS`, branch `os-10x`, commit `ff1e5af`
**Date:** 2026-10-19
**Scope:** approval lifecycle/binding, tool permissions, SSRF, injection, auth boundaries
**Mode:** READ-ONLY. No code was modified.

**Working-tree note:** two dirty files at audit time —
`logs/perf.jsonl` (pre-existing, unrelated) and `web/om/browser.py`
(uncommitted Playwright dedicated-thread fix). Findings below reflect the
**working tree**, including the uncommitted browser.py changes.

---

## Findings

### P2-1 — Double-execution race on HTTP approval path
**File:** `web/server.py:294-310`

```python
p = _find_pending(mgr, pid)          # in-memory lookup
...
text = await mgr._approve_one(p)     # executes (await!)
...
mgr._pending.remove(p)               # removed only AFTER success
```

Two concurrent `POST /api/approvals/{pid}/approve` requests for the same
`pid` can both pass `_find_pending` before either completes, executing the
approved action **twice**. No lock exists anywhere on this path (verified:
no `Lock` in `web/server.py` or `server/conversation/manager.py`).
**Impact:** duplicate side effects — e.g. a double-clicked form submit
fires twice. The chat path is safe (pop-before-await at
`manager.py:813-830`); only the HTTP endpoint is racy.
**Status:** confirmed vulnerability (code inspection; not executed live).

### P2-2 — Same race class on connector action approval
**File:** `web/server.py:839-858`

`get_action` → `status != "pending"` check → `adapter.run_action(...)` →
`set_action_status(aid, "done")` is read-then-write with no atomicity. Two
concurrent approves can both observe `"pending"`. The 409 guard narrows but
does not close the window.
**Status:** confirmed design weakness (code inspection).

### P2-3 — Persisted approval deleted before execution completes
**File:** `server/conversation/manager.py:694-696`

`_approve_one` calls `self._approval_store.remove_pending(...)` at its
**start**. If execution then raises, the HTTP endpoint keeps the in-memory
item and reports `"The item is still queued"` (`web/server.py:306-309`) —
but the SQLite row is already gone. A restart in that window loses the
approval entirely. The endpoint comment ("On failure the item stays
queued") is true only for the in-memory queue.
**Impact:** reliability — user-authorized work silently dropped on
restart-after-failure. Fail-closed w.r.t. double execution.
**Status:** confirmed (code inspection).

### P2-4 — SSRF check-then-fetch TOCTOU (DNS rebinding)
**File:** `server/tools/webread_tool.py:57-88`

`_url_blocked` resolves the host and checks every `getaddrinfo` result,
then `urllib` re-resolves at connect time. A hostile or rebinding DNS can
return a public IP at check time and a private IP at fetch time. Related:
Playwright `open()` (`web/om/browser.py:268`) validates only the initial
URL — in-page redirects to private hosts are not re-validated.
**Impact:** limited in this threat model (requires attacker-controlled DNS
or a malicious redirect chain), but the guard is bypassable by design.
Proper fix: pin the validated IP / dial-by-IP with Host header + SNI.
**Status:** design concern (not experimentally verified).

### P2-5 — All write endpoints unauthenticated; localhost bind is the only boundary
**Files:** `web/server.py:982` (`host="127.0.0.1"` default), `web/om/routes.py:95`

No auth middleware, no CORS, no tokens anywhere. `POST /om/computer/commands`
executes arbitrary `bash -c` as the server user (cwd-jailed via
`resolve()`+containment at `web/om/computer.py:271-276`, env scrubbed at
`:110`). Any local process/user can invoke it, as well as approvals,
connector credential writes, and file writes.
**Assessment:** acceptable for a local-first single-user tool **only** while
bound to loopback. The JSON content-type + absent CORS largely mitigates
browser CSRF. Must never be run with `host="0.0.0.0"` without adding auth —
there is currently no auth mechanism to enable.
**Status:** design concern (verified by inspection).

### P3-1 — `shutdown()` leaks its executor thread (uncommitted code)
**File:** `web/om/browser.py:424-451` (dirty working tree)

`shutdown()` is decorated `@_on_pw_thread` (runs on the 1-worker
executor) but never calls `self._exec.shutdown()`. No self-deadlock, but
every driver instance leaks its worker thread for process lifetime (matters
for tests that construct drivers per case). Post-shutdown `available()`
re-launches Playwright on the same executor, which still works.
**Status:** confirmed minor defect (code inspection).

### P3-2 — `action_args` not covered by the approval hash
**File:** `server/conversation/manager.py:454-463`

`approved_hash = content_hash(draft)` binds the human description only;
the machine-readable `action_args` executed on approval are not hashed.
**Currently safe:** `_draft()` (`server/tools/browser_tool.py:195-216`)
builds draft + action atomically from one `describe()` call (draft embeds
the selector), and the verifier (`server/supervisor/verifier.py:88-108`)
requires both present. A future tool that builds them separately could let
the executed action diverge from what the user saw. Recommend hashing
`action_args` (canonical JSON) into the approval as well.
**Status:** design concern (verified safe today).

---

## Verified safe

- **V1 — Bare yes/no binding.** With >1 pending, bare "yes"/"no" refuses via
  `_ambiguous_multi` (`manager.py:826-830`, `849-853`); indexed
  `approve N`/`reject N` (`:815-824`, `:838-848`) with out-of-range handled;
  `approve all` requires the explicit phrase. Single-pending bare "yes" is
  unambiguous.
- **V2 — Hash binding at execution.** `_approve_one` recomputes
  `content_hash(pending.draft)` and refuses on mismatch, logging
  `REJECTED_HASH_MISMATCH` (`manager.py:700-709`).
- **V3 — No false success on approval.** HTTP approve dequeues only after
  success and raises 500 on exception (`web/server.py:294-310`); connector
  `approve_action` sets `"error"` status and raises 502/500
  (`web/server.py:839-858`).
- **V4 — Expiry fail-closed.** Lazy prune on every queue touch, EXPIRED
  logged, lifecycle run rejected, nothing executes (`manager.py:657-679`);
  queue restored from SQLite at startup (`manager.py:150-155`).
- **V5 — SSRF guards.** web_read: scheme allowlist, literal-IP check,
  per-result DNS check, redirect re-validation + 5-hop cap
  (`webread_tool.py:23-109`). Browser `create`/`open`/`navigate` reuse it
  (`browser.py:28-31`, `554-573`).
- **V6 — Browser action allowlist.** `perform_action` maps only
  click/fill/type/press/select; unknown kinds → 422 (`browser.py:747-768`).
  Input validation: selector ≤500, text ≤10000, key allowlist, timeout
  clamped 1–60s (`browser.py:84-104`).
- **V7 — Stale sessions.** `_ensure_live_page` marks 410 "stale", never
  substitutes a blank page (`browser.py:600-612`).
- **V8 — Permissions fail closed.** Unknown tools → DENIED
  (`permissions.py:56-60`); read-only browser tools ALLOW, interactions
  NEEDS_APPROVAL with draft-only pre-approval tools.
- **V9 — OAuth CSRF.** Single-use random `state`, 10-min expiry, popped on
  use (`web/server.py:742-760`).
- **V10 — No eval/shell surprises.** No raw `eval(` (only a docstring
  mention in `sqlite_impl.py:13`); `documents.py` uses argv lists
  (`:53-64`); computer.py's `bash -c` is the tool's documented purpose,
  cwd-jailed (`computer.py:271-276`).
- **V11 — Queue-full fail closed.** `_enqueue_pending` refuses when full
  (`manager.py:681-689`).

---

## Answers to the audit questions

- **Is approval bound to the exact action+args?** Yes for the human-visible
  draft (hash-checked at execution). Machine args are bound by atomic
  construction + verifier contract, not by hash (P3-2).
- **Can a vague "yes" approve the wrong thing?** No — multi-pending bare
  yes/no refuses; indexed and explicit-all variants only.
- **Do failed operations ever return success?** No — approve paths raise
  500/502 on failure and dequeue only after success.
- **Is SSRF protection present and correct?** Present and correct for the
  initial fetch/navigation; bypassable via DNS rebinding by design (P2-4).
- **Unprotected shell/command injection?** None found. The intentional
  `bash -c` in computer.py is cwd-jailed with scrubbed env.
- **Can unauthenticated requests perform writes?** Yes — everything is
  unauthenticated; localhost binding is the sole boundary (P2-5).
