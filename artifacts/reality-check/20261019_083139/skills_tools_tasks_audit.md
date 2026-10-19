# Skills, Tools, and Task Execution Audit

**Repository:** `~/workspace/os/OS`
**Branch:** `os-10x` (commits: ff1e5af, ae18bfa, cb4ed7c)
**Audit date:** 2026-10-19
**Scope:** Tasks C (planning/execution), D (failure/retry/cancel), G (skills)
**Method:** Read-only source inspection + live tool execution tests. No code modified.

---

## 1. Tool Registry — IMPLEMENTED AND WIRED

**File:** `server/intent/registry.py:39` (`ToolRegistry` class)

The live registry used by the conversation manager. Populated via `SkillLoader.load()` in `server/conversation/manager.py:95-120` (`_default_registry`).

**Tools registered (20 total, verified by running the loader):**

| Skill | Status | Tools |
|-------|--------|-------|
| browser | active | browser_open, browser_read, browser_elements, browser_screenshot, browser_console, browser_wait, browser_click, browser_fill, browser_type, browser_press, browser_select (11) |
| calc | active | calc (1) |
| datetime | active | get_current_datetime (1) |
| linkedin | active | linkedin_draft (1) |
| memory | active | memory_save, memory_recall, memory_forget (3) |
| system | active | get_system_info (1) |
| webread | active | web_read (1) |
| websearch | active | web_search (1) |
| files | planned | — (not loaded) |

**Evidence:** Ran `SkillLoader().load(ToolRegistry())` — 8 skills loaded, 20 tools registered.

**Tool execution — WORKS, failures are HONEST:**
- `get_current_datetime` → success with data (`server/intent/registry.py:69-94`)
- `calc('137 * 246')` → success, result 33702
- `calc('1/0')` → failure, error "can't calculate that: division by zero"
- `nonexistent_tool` → failure, error "unknown tool: nonexistent_tool"

**File:** `server/intent/registry.py:69-94` — `execute()` catches exceptions and returns `ToolResult(status="failure")`. Never fabricates success.

**Note:** There are TWO legacy `ToolsManager` classes (`server/tools/base.py:27`, `server/tools/manager.py:12`) that appear unused. The live path is `ToolRegistry` from `server/intent/registry.py`. Verified: `grep` shows no callers of `ToolsManager` outside its own files.

---

## 2. Skill Loading — IMPLEMENTED, FAIL-CLOSED

**File:** `server/skills/loader.py`

**Validation behavior:**
- `parse_skill_md()` (`loader.py:33-51`): Never raises. Malformed SKILL.md → defaults to `status="planned"` → skill skipped.
- `load()` (`loader.py:79-118`): Only loads skills with `status == "active"`. Skips if `tools.py` missing. Skips if import fails. Logs warning, never half-registers.
- Verified: malformed frontmatter → `status=planned`, name=fallback. Valid → `status=active`.

**Script injection protection:**
- Skills are Python modules imported via `importlib` (`loader.py:120-128`), executed in-process as Python functions.
- **No shell execution**: `grep` for `subprocess|shell=True|os.system` in `skills/*/tools.py` → zero hits.
- `calc_skill/tools.py:34-59` uses `ast.parse()` for expression evaluation, not `eval()`. Safe.
- **Verdict:** No shell injection vector exists because skills never invoke a shell.

**Skill discovery:** 9 skills found in `skills/` directory. 8 active, 1 planned (`file_skill`).

---

## 3. Task Planning — TEXT GENERATION, NOT A TASK ENGINE

**Status:** ABSENT (no durable task engine on this branch)

**Evidence:**
- `server/tasks/` directory **does not exist** (deleted in Phase 0 commit ae18bfa — the old TaskManager was dead code with false-COMPLETED status and zero callers).
- `server/intent/router.py:6`: `# TASK: deferred; reserved for the planner (not used in Phase 1)`
- `server/tools/manager.py:16`: `# Phase 10: planner/task manager integration.` (aspirational comment, not implemented)

**What exists instead:** `Supervisor.run_team()` (`server/supervisor/pipeline.py:213-260`)
- Calls `Team.plan()` which uses an LLM (pydantic_ai) to generate a JSON array of subtask **strings** (`server/teams/team.py:64-95`).
- This is **text generation**, not task execution. There is:
  - No persistence (tasks live in memory only)
  - No checkpoints
  - No retry logic
  - No state machine
  - No cancellation
  - No recovery after restart

**Task C verdict:** FAIL — There is no durable task engine. "Planning" is LLM text output, not executable task state.

---

## 4. Failure Handling, Retries, Cancellation — ABSENT

**Task D verdict:** NOT IMPLEMENTED

**Evidence:**
- No retry logic found in supervisor or team code.
- No cancellation mechanism found.
- `Supervisor.run_tool()` (`server/supervisor/pipeline.py:69-160`): executes a single tool with approval check, returns result. No retry on failure.
- `LifecycleTracker` (`server/supervisor/lifecycle.py:29-58`): tracks stage transitions (NOTICE → SUGGEST → EXECUTE → VERIFY → REMEMBER) in memory via `state_store`, but this is observability, not a resumable task engine.

**What happens on tool failure:** Honest — returns `ToolResult(status="failure")` with error message. Does not retry. Does not fake success.

---

## 5. Approval Binding — IMPLEMENTED (Batch A)

**File:** `server/conversation/manager.py:71-72`

```python
_APPROVE_N_RE = re.compile(r"^\s*approve\s+(\d+)\s*[.!]?\s*$", re.IGNORECASE)
_REJECT_N_RE = re.compile(r"^\s*(?:reject|cancel)\s+(\d+)\s*[.!]?\s*$", re.IGNORECASE)
```

**Behavior** (`manager.py:815+`):
- Bare "yes"/"no" with multiple pendings → refuses, lists items (does NOT approve oldest).
- "approve 2" / "reject 1" → targets specific pending by index.

**Status:** Implemented and wired. (Was fixed in Batch A close-out, commit ff1e5af.)

---

## 6. Browser Tools — IMPLEMENTED (Batch B)

**11 browser tools** registered via `skills/browser_skill/tools.py`:
- Read-only (ALLOW): browser_open, browser_read, browser_elements, browser_screenshot, browser_console, browser_wait
- Interactive (NEEDS_APPROVAL): browser_click, browser_fill, browser_type, browser_press, browser_select

**Evidence:** Listed in registry output above. Draft-only pattern: interactive actions create drafts, execution via `BrowserService.perform_action()` in approval path.

**Note:** `web/om/browser.py` has uncommitted changes (43 insertions) — in-progress Playwright thread fix per parent context. Not audited here (out of scope).

---

## 7. Summary Table

| Capability | Status | Evidence |
|------------|--------|----------|
| Tool registry | Implemented, wired | `server/intent/registry.py:39`, 20 tools live |
| Tool execution | Works | Live test: 4/4 correct (2 success, 2 honest failures) |
| Failure honesty | Honest | `registry.py:88-94` — exceptions → failure, never fake success |
| Skill loading | Fail-closed | `loader.py:79-118` — skips malformed/inactive |
| Skill validation | Implemented | `loader.py:33-51` — malformed → planned (not loaded) |
| Script injection | Not applicable | No shell use in skills; `ast.parse` in calc |
| Task planning | Text-only | `team.py:64` — LLM generates subtask strings |
| Durable task engine | **Absent** | `server/tasks/` deleted; no replacement |
| Retries | **Absent** | No retry logic found |
| Cancellation | **Absent** | No cancel mechanism found |
| Approval binding | Implemented | `manager.py:71-72`, `815+` — indexed approve/reject |
| Browser tools | Implemented | 11 tools, draft→approve→execute pattern |

---

## 8. Critical Gaps

1. **No durable task engine** (P1): `server/tasks/` was deleted in Phase 0 because the old one was broken, but no replacement was built in Batch A/B. Multi-step tasks cannot survive restart, have no checkpoints, no retries.
2. **Planning is LLM text, not execution** (P1): `Team.plan()` returns strings. There is no state machine that executes, tracks, or recovers tasks.
3. **No retry/cancellation** (P2): Tool failures are honest but terminal. No retry policy, no way to cancel a running operation.
4. **Legacy dead code** (P3): Two unused `ToolsManager` classes (`server/tools/base.py`, `server/tools/manager.py`). The live path uses `ToolRegistry` from `server/intent/registry.py`.

---

## 9. What's Working Well

- Tool registry is clean, fail-closed, and honest about failures.
- Skill loading validates contracts and skips bad skills safely.
- No shell injection vectors in skill tools.
- Approval binding is correctly implemented (indexed, not FIFO).
- Browser tools follow draft→approve→execute pattern.
