# OS Engineering Recovery & Capability Improvement Program — Dependency-Aware Backlog

Last Updated: 2026-10-18

This backlog defines the recovery plan across Phases A through F, grounded in the capability audit, existing code inspections, and runtime evidence.

---

## Summary Matrix

| ID | Phase | Title | Priority | Status | Dependencies | Owner Subsystem |
|---|---|---|---|---|---|---|
| **A-1** | Phase A | Eliminate generic success-to-VERIFIED shortcuts | Highest | VERIFIED | None | `server/execution/verifier.py` |
| **A-2** | Phase A | Remove fabricated browser extraction fallback | Highest | VERIFIED | None | `adapters/browser/worker.py` |
| **A-3** | Phase A | Distinguish genuine empty research from search failure | Highest | VERIFIED | None | `server/tools/websearch_tool.py`, `adapters/research/` |
| **A-4** | Phase A | Align skill status with validation, tool contracts & readiness | Highest | VERIFIED | None | `server/skills/skill_manager.py` |
| **A-5** | Phase A | Safe deserialization for SQLite memory metadata (remove eval) | Highest | VERIFIED | None | `server/memory/sqlite_impl.py` |
| **A-6** | Phase A | Disallow synthesized success on unsupported Computer actions | Highest | VERIFIED | None | `server/computer/backends/` |
| **A-7** | Phase A | Explicit detection and reporting of planner dependency cycles | Highest | VERIFIED | None | `server/planner/engine.py` |
| **B-1** | Phase B | Canonical Computer session contract & health status | High | VERIFIED | A-6 | `server/computer/` |
| **B-2** | Phase B | Fix browser-availability blocker & deterministic Playwright harness | High | VERIFIED | B-1 | `adapters/browser/`, `server/computer/backends/browser_harness.py` |
| **B-3** | Phase B | End-to-end browser acceptance (navigate, link, content, screenshot) | High | VERIFIED | B-2 | `server/computer/`, Playwright test |
| **B-4** | Phase B | Desktop acceptance (live frame, non-destructive interaction, state check) | High | VERIFIED | B-1 | `server/computer/backends/docker_desktop.py` |
| **B-5** | Phase B | Native truthful desktop wallpaper integration & frame verification | High | VERIFIED | B-4 | `web/server.py`, `frontend/src/components/common/WallpaperGallery.tsx` |
| **B-6** | Phase B | Terminal acceptance (boundary, limits, timeout, isolation) | High | VERIFIED | B-1 | `server/computer/` |
| **C-1** | Phase C | Unified Skill lifecycle (import -> validate -> review -> enable -> ready -> run -> verify) | High | VERIFIED | A-1, A-4 | `server/skills/`, `web/server.py` |
| **C-2** | Phase C | Task states unification & contradictory transition elimination | High | VERIFIED | A-1 | `server/tasks/`, `server/domain/enums.py` |
| **C-3** | Phase C | Approval payload binding, hash verification, expiry & replay rejection | High | VERIFIED | A-1 | `server/execution/executor.py`, `server/approvals/` |
| **D-1** | Phase D | Structured typed records for people, preferences, projects, goals | Medium | IN PROGRESS | A-5 | `server/memory/`, `server/conversation/`, `web/server.py` |
| **D-2** | Phase D | Planning: time-slot conflict replanning, deadlines vs plan date | Medium | NOT STARTED | A-7 | `server/planner/engine.py` |
| **D-3** | Phase D | Voice: microphone transcription to conversation engine loop & barge-in | Medium | NOT STARTED | None | `server/voice/` |
| **D-4** | Phase D | Truthful connector states (configured, authorized, reachable, verified) | Medium | NOT STARTED | A-1 | `web/connectors/` |
| **D-5** | Phase D | Proactive scheduler: eliminate no-op fallback, verify job cycles | Medium | NOT STARTED | None | `server/scheduler/` |
| **E-1** | Phase E | Semantic token audit across 8 views & Computer views | Medium | NOT STARTED | None | `frontend/src/` |
| **E-2** | Phase E | Operational diagnostics & non-deceptive readiness badges | Medium | NOT STARTED | B-1, D-4 | `frontend/src/`, `web/server.py` |
| **F-1** | Phase F | Local-first audit: zero silent paid APIs, honest degradation & restart | Medium | VERIFIED | None | `server/llm/`, `config/`, `server/computer/`, `web/server.py` |

---

## Detailed Item Specifications

### [A-1] Eliminate Generic Success-to-VERIFIED Shortcuts
- **Priority**: Highest
- **User-visible problem**: System marks external writes and unknown tool invocations as `VERIFIED` when only HTTP 200 or a non-empty dict was returned, giving the user false certainty of real-world effects.
- **Existing code path and root cause**:
  - `server/execution/verifier.py`: `GenericApiVerifier` returns `VerificationStatus.VERIFIED` whenever `execution_result.get("ok", True) and len(execution_result) > 0`.
  - `GmailVerifier` and `CalendarVerifier` return `VERIFIED` even when `read_back_data` is None (no external read-back confirmed).
- **Dependencies and file ownership**: `server/execution/verifier.py`
- **Planned change**:
  - `GenericApiVerifier`: return `VerificationStatus.UNKNOWN` with descriptive note for unregistered tools.
  - `GmailVerifier`: require verified read-back matching recipient/subject to return `VERIFIED`; if no read-back was performed, return `VerificationStatus.UNKNOWN`.
  - `CalendarVerifier`: require verified read-back matching event ID/title to return `VERIFIED`; otherwise return `VerificationStatus.UNKNOWN`.
  - `BrowserVerifier`: require valid screenshot on disk or confirmed navigation target; otherwise return `VerificationStatus.UNKNOWN`.
- **Focused tests and acceptance criteria**:
  - Tests in `tests/test_m2_verification.py` and new negative tests in `tests/test_phase_a_trust.py`.
  - Acceptance: No generic non-empty response establishes `VERIFIED`. Actions without read-back return `UNKNOWN`. Existing tests with read-back continue to pass.
- **Evidence path**: Test run logs and pytest exit 0.
- **Current status**: IN PROGRESS.

---

### [A-2] Remove Fabricated Browser Extraction Fallback
- **Priority**: Highest
- **User-visible problem**: If browser extraction fails, the agent reports a synthetic message `[fallback] Content extracted from <url>.`, deceiving the user and task supervisor into believing web content was actually read.
- **Existing code path and root cause**:
  - `adapters/browser/worker.py:257-260`: `except Exception: return f"[fallback] Content extracted from {url}."`
- **Dependencies and file ownership**: `adapters/browser/worker.py`
- **Planned change**:
  - Remove synthetic string return. On extraction failure, raise an error or return an explicit failure receipt / empty string with logged error.
- **Focused tests and acceptance criteria**:
  - Acceptance: No fabricated source content returned on extraction failure.
- **Evidence path**: Unit test asserting extraction error/empty handling without synthetic text.
- **Current status**: NOT STARTED.

---

### [A-3] Distinguish Genuine Empty Research from Search Failure
- **Priority**: Highest
- **User-visible problem**: When DuckDuckGo returns 0 results for an obscure query, it is treated as a runtime failure ("Search failed"). Conversely, when search errors out (e.g., network error), `ResearchWorker` constructs synthetic finding cards with confidence 0.0.
- **Existing code path and root cause**:
  - `server/tools/websearch_tool.py:94-96`: `if not results: return ToolResult(status="failure", error="No results found.")`
  - `adapters/research/researcher.py:161-167`: synthesizes fake finding entry when sources are empty.
- **Dependencies and file ownership**: `server/tools/websearch_tool.py`, `adapters/research/researcher.py`
- **Planned change**:
  - `web_search`: Return `status="success", data={"query": query, "results": [], "empty": True}` when search succeeds with zero hits. Reserve `status="failure"` for actual exceptions/network issues.
  - `ResearchWorker`: Clearly report zero findings without injecting fake dummy source cards.
- **Focused tests and acceptance criteria**:
  - Unit tests verifying: 1) query with 0 hits returns status="success" with empty results list; 2) network error returns status="failure".
- **Evidence path**: Unit tests in `tests/test_phase_a_trust.py`.
- **Current status**: NOT STARTED.

---

### [A-4] Align Skill Status with Actual Validation, Tool Contracts & Readiness
- **Priority**: Highest
- **User-visible problem**: Imported skills are automatically labeled `status: active` regardless of whether they are disabled, missing dependencies, or unvalidated.
- **Existing code path and root cause**:
  - `server/skills/skill_manager.py:411`: `"status": "active" if (info.status == "active" or source != "builtin") else info.status`.
- **Dependencies and file ownership**: `server/skills/skill_manager.py`
- **Planned change**:
  - Compute skill lifecycle state:
    - If `enabled == False`: `disabled`
    - If validation failed / missing required scripts: `validation_failed` / `unsupported`
    - If needs review: `needs_review`
    - If fully ready: `ready`
- **Focused tests and acceptance criteria**:
  - Disabled skill reports `status: "disabled"`. Invalid skill reports `status: "unsupported"` or `"validation_failed"`.
- **Evidence path**: Pytest on skill lifecycle tests.
- **Current status**: NOT STARTED.

---

### [A-5] Safe Deserialization for SQLite Memory Metadata
- **Priority**: Highest
- **User-visible problem**: Arbitrary Python code could execute when loading memory records from SQLite due to unsafe `eval()`.
- **Existing code path and root cause**:
  - `server/memory/sqlite_impl.py:78`: `metadata=eval(row[7]) if row[7] else {}`
  - `server/memory/sqlite_impl.py:51`: `str(record.metadata)`
- **Dependencies and file ownership**: `server/memory/sqlite_impl.py`
- **Planned change**:
  - Store metadata as JSON string: `json.dumps(record.metadata or {})`.
  - Read metadata using `json.loads()` with safe fallback: if JSON parsing fails, use `ast.literal_eval` for legacy Python dict string format. Never use `eval()`.
- **Focused tests and acceptance criteria**:
  - Malicious metadata strings such as `__import__('os').system('...')` fail parsing safely and return `{}` without executing code. Valid JSON and legacy dict strings load correctly.
- **Evidence path**: Pytest in `tests/test_phase_a_trust.py`.
- **Current status**: NOT STARTED.

---

### [A-6] Disallow Synthesized Success on Unsupported Computer Actions
- **Priority**: Highest
- **User-visible problem**: Computer backends return `ActionResult(success=True, verified=True)` for actions they do not actually implement (e.g. `key_down`, `key_up`, `release_all_keys`, `press_key`, `scroll`).
- **Existing code path and root cause**:
  - `server/computer/interface.py:192-200`
  - `server/computer/backends/docker_desktop.py:599-621`
  - `server/computer/backends/e2b_sandbox.py:246, 279, 290, 301`
  - `server/computer/backends/skyvern_adapter.py:306, 317, 328`
- **Dependencies and file ownership**: `server/computer/backends/`
- **Planned change**:
  - Unsupported actions must return `success=False, verified=False, error="Action ... not supported by ..."` or raise an explicit error.
- **Focused tests and acceptance criteria**:
  - Calling unsupported actions returns `success=False` with error detail.
- **Evidence path**: Focused unit tests in `tests/test_phase_a_trust.py`.
- **Current status**: NOT STARTED.

---

### [A-7] Explicit Detection and Reporting of Planner Dependency Cycles
- **Priority**: Highest
- **User-visible problem**: When tasks have circular dependencies (Task A depends on Task B, Task B depends on Task A), the planner silently swallows the cycle and schedules arbitrary subsets.
- **Existing code path and root cause**:
  - `server/planner/engine.py:115-116`: `if task_id in temp_mark: return # Break dependency cycles gracefully`
- **Dependencies and file ownership**: `server/planner/engine.py`, `server/domain/enums.py`
- **Planned change**:
  - Track DFS path in topological sort. When a back-edge is encountered, record the cycle: `cycle_detected = True, cycle_path = [...]`.
  - Add `PlanStatus.INVALID = "INVALID"` to `PlanStatus`.
  - Return an explicit invalid-plan result: `Plan(status=PlanStatus.INVALID, reason=f"Dependency cycle detected: {cycle_str}")` and empty items list `[]`.
- **Focused tests and acceptance criteria**:
  - Calling `create_daily_plan` on circular tasks returns `plan.status == PlanStatus.INVALID` with clear diagnostic reason.
- **Evidence path**: Focused test in `tests/test_phase_a_trust.py` and `tests/test_m4_planner.py`.
- **Current status**: NOT STARTED.

---

### [D-1] Typed, Private Local Memory and Chat Retrieval
- **Priority**: Medium
- **User-visible problem**: Explicitly saved notes were stored only as untyped event payloads. The dashboard did not construct a `MemoryRetriever`, so ordinary chat could not use durable personal context. Credentials could be saved as a note.
- **Existing code path and root cause**: `skills/memory_skill/tools.py` writes opaque notes to `StateStore`; `web/server.py` constructed `ConversationManager` without `memory` or `memory_retriever`; `SQLiteMemoryManager.retrieve()` did not filter expiry/privacy or protect a higher-confidence record from a conflicting lower-confidence write.
- **Dependencies and file ownership**: `server/memory/base.py`, `server/memory/sqlite_impl.py`, `skills/memory_skill/tools.py`, `server/conversation/manager.py`, `web/server.py`.
- **Planned / completed change**: Added `PERSON`, `GOAL`, and `COMMITMENT` typed records alongside existing preference/project types; normalized confidence and provenance; rejected credential-like notes; filtered expired and secret records; added conflict-preserving typed writes plus explicit supersession history; wired the dashboard's existing conversation manager to `data/personal_memory.db` and its retriever. Explicit `memory_save` tool success mirrors to this store only after the tool pipeline succeeds.
- **Focused tests and acceptance criteria**: `tests/test_phase_d_memory.py` covers cross-session recall, relevance, provenance, typed classification, expiry, privacy rejection, lower-confidence conflict retention, higher-confidence correction history, typed-mirror deletion, and actual ordinary-chat context injection. Existing SQLite safety and StateStore note lifecycle tests remain passing in separate focused gates.
- **Evidence path**: `tests/test_phase_d_memory.py`; `artifacts/ui-audit/verification-log.md` Phase D-1 rows.
- **Current status**: IN PROGRESS.
- **Remaining blockers**: Task/team-planning context has not yet been given a structured memory input; no semantic/vector retrieval has been justified or added.

---

