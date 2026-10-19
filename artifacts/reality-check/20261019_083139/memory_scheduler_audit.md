# Memory & Scheduler Audit — Reality Check

**Repo:** `~/workspace/os/OS` · **Branch:** `os-10x` · **Commit:** `ff1e5af` (Batch B)
**Date:** 2026-10-19 · **Mode:** READ-ONLY (no code modified)
**Scope:** Audit Tasks B (memory) and H (scheduler) — storage, retrieval, forget, persistence, restart behavior.

---

## 1. MEMORY SUBSYSTEM

### 1.1 Implementation status: IMPLEMENTED BUT UNWIRED (dead code)

| Capability | Status | Evidence |
|---|---|---|
| SQLite storage | Implemented, unwired | `server/memory/sqlite_impl.py:28-54` — `_init_db()` creates `memories` table; `store()` does `INSERT OR REPLACE` + commit |
| Retrieval | Implemented, unwired | `server/memory/sqlite_impl.py:82-107` — keyword `LIKE` matching on `value`/`key`, ordered by `importance DESC`. NOT semantic/vector. |
| Memory extraction | Implemented, unwired | `server/memory/sqlite_impl.py:109-165` — regex heuristics on conversation turns (`prefer|like|important|remember|...`), key = first 3 words ≥4 chars |
| Consolidation/pruning | Implemented, unwired | `server/memory/sqlite_impl.py:167-209` — prunes `importance < 0.3` older than 30d; boosts recent by +0.05 |
| Forget (targeted delete) | **ABSENT** | No `forget()` method in `server/memory/base.py:31-44` (interface) or `sqlite_impl.py`. Only `prune()` (bulk age-based delete). |
| Expiry | Schema only | `expires_at REAL` column exists (`sqlite_impl.py:46`), but **nothing reads it** — no query filters expired rows, no sweep. |
| Conflict handling | **ABSENT** | `store()` uses blind `INSERT OR REPLACE` (`sqlite_impl.py:65-66`). No conflict detection, no supersede tracking, no "old vs current" distinction. |
| Provenance | **ABSENT** | No `provenance`/`source` field in schema or `MemoryRecord` (`base.py:18-29`). |
| Retrieval gating | Implemented, unwired | `server/memory/retriever.py:19-33` — skips trivial greetings via regex, delegates to manager. |

### 1.2 Wiring: NOTHING CALLS IT

```text
$ grep -rn "SQLiteMemoryManager\|\.store(\|MemoryRetriever(" server/ web/  (excluding tests, server/memory/)
→ zero production callers
```

- The **only** importers of `server.memory` are `tests/test_memory_retriever.py` and `tests/test_phase0_trust.py` (the latter only for `_safe_metadata`).
- No conversation manager, chat handler, tool, or skill calls `store()`, `retrieve()`, `extract()`, or instantiates `MemoryRetriever`.
- **Verdict: the entire `server/memory/` package is dead code.** It compiles and its unit tests pass, but it does zero work in the running application.

### 1.3 What the dashboard actually does (separate path)

The Memory tab does NOT use `server/memory/`. It hits SQLite directly:

- `GET /api/memory` — `web/server.py:404-427` — raw `sqlite3.connect("memory/os_memory.db")`, `SELECT ... LIMIT 50`. Returns `{"memories": []}` when the file is absent.
- `DELETE /api/memory/{key}` — `web/server.py:429-441` — raw `DELETE FROM memories WHERE key = ?`. **False-success edge:** if `memory/os_memory.db` does not exist, the `if db.exists()` guard is skipped and it returns `{"ok": True}` without deleting anything.

### 1.4 Persistence: what breaks on restart

- The `memory/` directory **does not exist** in the repo (`ls memory/` → no such directory). Default DB path is `memory/os_memory.db` (`sqlite_impl.py:29`).
- Because nothing calls `store()`, **no memories are ever written** — there is nothing to persist and nothing to lose on restart.
- If something *did* write via `SQLiteMemoryManager`, the SQLite file would persist across restarts (real file-backed storage, committed writes). The storage layer itself is sound; it is simply never invoked.
- **Expiry is decorative:** `expires_at` is stored but never evaluated. An "expired" memory retrieves identically to a live one.

### 1.5 Memory scorecard (this branch)

| Check | Result |
|---|---|
| Real persistence layer | Yes (SQLite file, committed) — but unwired |
| Retrieval works | Keyword LIKE only; unwired |
| Forget targeted record | Absent (only bulk `prune`) |
| Expiry enforced | No (column exists, never read) |
| Conflict / supersede | No (blind overwrite) |
| Survives restart | N/A — nothing is ever stored |

---

## 2. SCHEDULER / CRON

### 2.1 Implementation status: ABSENT

| Capability | Status | Evidence |
|---|---|---|
| APScheduler | **Not present** | `grep -rln "apscheduler\|APScheduler" --include="*.py" .` → zero hits |
| Cron / job store | **Not present** | `find . -iname "*schedul*"` → zero files |
| Background jobs | **Not present** | No `BackgroundScheduler`, no `CronTrigger`, no job tables in any DB |
| Reminders | **Not present** | No reminder model, endpoint, or UI beyond static text |

The single scheduler-adjacent hit is a red herring:

- `web/om/activity.py:120-140` — `_schedule_retry()`: exponential-backoff **retry** for failed activity runs ("Retry N/M scheduled in Ns"). This is a retry timer, not a task scheduler. No cron expressions, no recurring jobs, no job persistence table.

The word "cron" appears once in a comment (`web/om/activity.py:9`: "the chat agent, a cron, etc.") — aspirational, not implemented.

### 2.2 Related: watchers (not a scheduler)

- `GET /api/watchers` / `POST /api/watchers/{nid}/seen` (`web/server.py:444-455`) — a notification list with dismissal. No background evaluation loop found; nothing polls watcher conditions on a schedule.

### 2.3 Persistence: what breaks on restart

- There is no scheduler state to lose: **no jobs table exists** in `data/*.db` (verified via `.tables` on all four DBs).
- A "reminder" mentioned in chat would be plain text in a conversation — it cannot fire, because nothing exists to fire it.

### 2.4 Scheduler scorecard (this branch)

| Check | Result |
|---|---|
| Scheduler exists | No |
| Jobs persist across restart | N/A (no jobs) |
| Recurring jobs | No |
| Missed-run policy | No |
| Approval-gated jobs | No |

---

## 3. DATABASE INVENTORY (`data/`)

| File | Tables | Memory/Scheduler relevance |
|---|---|---|
| `data/approvals.db` | `pending`, `runs` | Approvals only — no memory, no jobs |
| `data/dashboard.db` | `connector_*` (4 tables) | Connectors only |
| `data/om.db` | `browser_sessions`, `goals`, `notifications`, `threads`, … (12 tables) | No memory/jobs tables |
| `data/os_state.db` | `approvals`, `events`, `sessions`, `tasks`, … | Has `tasks` (todo-list), **not** a scheduler job store |
| `memory/os_memory.db` | — | **Does not exist** |

---

## 4. RESTART-BEHAVIOR SUMMARY

| Subsystem | On restart |
|---|---|
| `server/memory/` SQLite store | Would survive (file-backed) — but nothing ever writes to it |
| Dashboard Memory tab | Reads absent DB → shows empty; forget returns false `ok:true` on absent DB |
| Expiry | Never enforced, before or after restart |
| Scheduler jobs | None exist; nothing to recover |
| Reminders | Cannot exist; no mechanism |

---

## 5. TOP FINDINGS (prioritized)

1. **P1 — Memory subsystem is dead code.** `server/memory/` (321 lines: storage, retrieval, extraction, consolidation) has zero production callers (`base.py`, `sqlite_impl.py`, `retriever.py`). The Memory tab bypasses it with raw SQL. Either wire it or delete it; shipping both invites divergence.
2. **P1 — No scheduler exists.** No APScheduler, no cron, no job store, no reminders. Any "I'll remind you" claim by the assistant would be a false promise.
3. **P2 — No targeted forget.** The interface (`base.py:31-44`) lacks `forget()`; only bulk `prune()` exists. Dashboard `DELETE /api/memory/{key}` is raw SQL outside the subsystem and false-succeeds when the DB is absent (`web/server.py:429-441`).
4. **P2 — Expiry is schema-only.** `expires_at` column written but never evaluated (`sqlite_impl.py:46`); expired memories retrieve normally.
5. **P2 — No conflict handling.** `INSERT OR REPLACE` blind-overwrites (`sqlite_impl.py:65`); contradictory facts cannot be distinguished as current vs superseded; no provenance field.
6. **P3 — Retrieval is keyword-only.** `LIKE %query%` ordered by importance (`sqlite_impl.py:84-93`); no semantic search despite "Mem0-inspired" docstring.

---

## 6. EVIDENCE INDEX (file:line)

- `server/memory/base.py:18-29` — `MemoryRecord` dataclass (no provenance field)
- `server/memory/base.py:31-44` — `MemoryManager` interface (no `forget`)
- `server/memory/sqlite_impl.py:28-54` — SQLite init + schema (real, file-backed)
- `server/memory/sqlite_impl.py:65-80` — `store()` with blind `INSERT OR REPLACE`
- `server/memory/sqlite_impl.py:82-107` — keyword `LIKE` retrieval
- `server/memory/sqlite_impl.py:109-165` — regex-heuristic `extract()`
- `server/memory/sqlite_impl.py:167-209` — `consolidate()` (prune + re-score)
- `server/memory/retriever.py:19-33` — trivial-greeting gate (unwired)
- `web/server.py:404-427` — dashboard memory list (raw SQL, bypasses subsystem)
- `web/server.py:429-441` — dashboard forget (false `ok:true` when DB absent)
- `web/om/activity.py:120-140` — retry backoff (not a scheduler)

*Audit performed read-only. No application code was modified. Report written to the audit directory only.*
