# OS Capability Matrix — Reality Check

**Target:** `~/workspace/os/OS`, branch `os-10x`, commit `ff1e5af`
**Date:** 2026-10-19

Evidence levels: S=static, U=unit, I=integration, E2E=end-to-end, L=live external

## Conversation and Routing

| Aspect | Claimed | Actual | Test | Evidence | Result |
|--------|---------|--------|------|----------|--------|
| Intent routing | 3-layer routing | Real: regex → Laya → LLM | S | `router.py:266`, `laya_router.py:72` | Works |
| Tool calls without LLM | Yes | Yes, regex patterns match directly | E2E | Live: datetime, calc work without Ollama | Works |
| Natural language browser | Via chat | Regex requires exact URL format | E2E | "open example.com" → fallback; "open https://..." → OUT_OF_SCOPE | Partial |
| Ollama fallback | Honest | Explicit "can't reach model" + what works | E2E | Live test, `server.py:240-249` | Works |

**Score: 7/10** — Real routing, honest fallback. Natural language coverage is narrow.

## Model Runtime

| Aspect | Claimed | Actual | Test | Evidence | Result |
|--------|---------|--------|------|----------|--------|
| Ollama integration | Yes | `OllamaClient` with health probe | S | `server/llm/ollama.py`, `server.py:67` | Implemented |
| Model available | — | No Ollama on test VM | E2E | `curl :11434` → connection refused | Absent (env) |
| Degraded mode | — | Honest message, tools still work | E2E | Live chat test | Works |

**Score: 6/10** — Good design, honest fallback. Can't score higher without a live model test.

## Tool Registry

| Aspect | Claimed | Actual | Test | Evidence | Result |
|--------|---------|--------|------|----------|--------|
| Tools registered | — | 20 tools from 8 skills | I | Ran loader live | Works |
| Execution | — | Returns ToolResult, exceptions → failure | I | Live: 4/4 correct | Works |
| Failure honesty | — | Never fakes success | S | `registry.py:88-94` | Verified |

**Score: 9/10** — Clean, honest, well-tested.

## Planning and Durable Tasks

| Aspect | Claimed | Actual | Test | Evidence | Result |
|--------|---------|--------|------|----------|--------|
| Task engine | — | **Does not exist** | S | `server/tasks/` deleted, no replacement | Absent |
| Planning | Supervisor | LLM generates text strings | S | `team.py:64-95` | Text-only |
| Persistence | — | N/A (nothing to persist) | S | No task tables for engine | Absent |
| Restart recovery | — | N/A | — | — | Absent |

**Score: 2/10** — Planning is text generation. No executable task state.

## Retry, Cancellation, Recovery

| Aspect | Claimed | Actual | Test | Evidence | Result |
|--------|---------|--------|------|----------|--------|
| Retries | — | None | S | No retry logic in supervisor | Absent |
| Cancellation | — | None | S | No cancel mechanism | Absent |
| Failure honesty | — | ToolResult(failure) with message | I | Live test | Works |

**Score: 3/10** — Failures are honest but terminal. No recovery.

## Memory

| Aspect | Claimed | Actual | Test | Evidence | Result |
|--------|---------|--------|------|----------|--------|
| Storage | SQLite | Implemented, **zero callers** | S | `sqlite_impl.py`, grep → no callers | Dead code |
| Retrieval | Keyword | Implemented, unwired | S | `sqlite_impl.py:82-107` | Dead code |
| Forget | API exists | `DELETE /api/memory/{key}` false-succeeds on absent DB | E2E | Live: `{"ok":true}` on nonexistent | **Bug** |
| Cross-conversation | — | Impossible (nothing stored) | — | — | Absent |
| Dashboard | Shows memories | Raw SQL bypass, always empty | E2E | Live: `{"memories":[]}` | Empty |

**Score: 2/10** — Subsystem exists but is dead code. Dashboard is a hollow shell.

## Browser Automation

| Aspect | Claimed | Actual | Test | Evidence | Result |
|--------|---------|--------|------|----------|--------|
| Real Chromium | Yes | Playwright driver exists | S+R | `browser.py:126`, launches OK | Works |
| Interactive actions | 11 tools | click/fill/type/etc implemented | S | `browser.py:340-430` | Implemented |
| Async fix | — | **Uncommitted** in working tree | S | `git status` shows M | **Not committed** |
| SSRF protection | Yes | Blocks private IPs | E2E | Live: 127.0.0.1 → 422 | Works |
| Stale sessions | Honest | 410 + "stale", URL preserved | R | Subagent runtime test | Works |
| Via chat | — | Blocked without Ollama | E2E | Regex too narrow | Partial |

**Score: 7/10** — Real implementation, good safety. Uncommitted fix is a risk.

## Computer / Terminal

| Aspect | Claimed | Actual | Test | Evidence | Result |
|--------|---------|--------|------|----------|--------|
| Local mode | Cwd-jailed | Yes, but shell NOT filesystem-jailed | R | `cat /etc/passwd` succeeded | **Limitation** |
| Docker mode | Isolated | Flags correct, can't test (no Docker) | S | `computer.py:200-225` | Unverified |
| Path traversal | Blocked | File API blocked | R | `/etc/passwd` → 404 via API | Works |
| Honesty | — | Snapshot discloses "not container-isolated" | S | `computer.py:100-130` | Honest |

**Score: 5/10** — Honest about limitations, but local mode is not a security boundary.

## Skills

| Aspect | Claimed | Actual | Test | Evidence | Result |
|--------|---------|--------|------|----------|--------|
| Loading | — | 8 active, 1 planned, fail-closed | I | Ran loader | Works |
| Validation | — | Malformed → planned (skipped) | S | `loader.py:33-51` | Works |
| Injection | — | No shell use, ast.parse in calc | S | Grep → zero hits | Safe |

**Score: 8/10** — Clean, safe, well-validated.

## Scheduler

| Aspect | Claimed | Actual | Test | Evidence | Result |
|--------|---------|--------|------|----------|--------|
| Exists | — | **No** | S | Zero hits for apscheduler/cron | Absent |
| Jobs | — | N/A | — | — | Absent |
| Reminders | — | Impossible | — | — | Absent |

**Score: 0/10** — Does not exist.

## Research

| Aspect | Claimed | Actual | Test | Evidence | Result |
|--------|---------|--------|------|----------|--------|
| Web search | Yes | Tool exists | S | `websearch` in registry | Implemented |
| Web read | Yes | SSRF-protected | S | `webread_tool.py` | Implemented |
| Source tracing | — | Not verified | — | — | Unknown |

**Score: 5/10** — Tools exist, not end-to-end tested.

## Approvals

| Aspect | Claimed | Actual | Test | Evidence | Result |
|--------|---------|--------|------|----------|--------|
| Bare yes/no | Safe | Refuses with >1 pending | S | `manager.py:826-830` | Works |
| Indexed | Yes | `approve N`/`reject N` | S | `manager.py:71-72` | Works |
| Hash binding | Yes | Recomputes at execution | S | `manager.py:700-709` | Works |
| Failure | 500 | Raises on exec failure | S | `server.py:294-310` | Works |
| **Race** | — | **Concurrent approves → double exec** | S | No lock on path | **Bug (P2)** |
| Expiry | Fail-closed | Lazy prune, nothing executes | S | `manager.py:657-679` | Works |

**Score: 7/10** — Well-designed, one serious race condition.

## Connectors

| Aspect | Claimed | Actual | Test | Evidence | Result |
|--------|---------|--------|------|----------|--------|
| Count | — | 16 connectors | S | `manifests.py` | — |
| Health checks | Real | Live API calls per adapter | S | `adapters.py:125-638` | Works |
| OAuth CSRF | Secure | Random single-use state | S | `server.py:742-760` | Works |
| Token storage | Encrypted | Fernet AES-128 | S | `vault.py` | Works |
| Provider revoke | — | **Missing** (local delete only) | S | `server.py:697-700` | **Gap** |

**Score: 8/10** — Excellent security, missing provider-side revocation.

## Voice

| Aspect | Claimed | Actual | Test | Evidence | Result |
|--------|---------|--------|------|----------|--------|
| Pipeline | Full | STT/VAD/TTS/AEC all real | S | `voice_cli.py`, `server/voice/` | Implemented |
| Without hardware | Honest | Clear errors, exit 2 | S | `factory.py:21-23` | Honest |
| Usable | — | Requires Ollama + mic + packages | — | — | **Blocked** |

**Score: 5/10** — Real but heavyweight. Can't test without hardware.

## Dashboard

| Aspect | Claimed | Actual | Test | Evidence | Result |
|--------|---------|--------|------|----------|--------|
| API routes | — | 40+ core, 70 OM | S | Route inventory | Complete |
| Frontend match | — | Zero mismatches (21 checked) | S | Cross-reference | Perfect |
| Loads | — | 200, no JS errors | E2E | Playwright screenshot | Works |

**Score: 9/10** — Excellent consistency.

## Persistence

| Aspect | Claimed | Actual | Test | Evidence | Result |
|--------|---------|--------|------|----------|--------|
| Tasks (todo) | Yes | SQLite, survives restart | E2E | Live API test | Works |
| Approvals | Yes | SQLite queue, restored | S | `manager.py:150-155` | Works |
| Memory | — | Nothing stored | — | — | N/A |
| Browser sessions | — | Marked stale, not faked | R | Subagent test | Honest |

**Score: 6/10** — What exists persists. What's missing (tasks engine, memory) can't persist.

## Security

See SECURITY_FINDINGS.md for details.

**Score: 7/10** — Strong fundamentals (SSRF, OAuth, approvals), but approval race and unauthenticated localhost are concerns.

## Overall: 5.8/10

Weighted: Safety/honesty (30%) = 8.5, Core function (30%) = 7.0, Autonomy (40%) = 3.5
