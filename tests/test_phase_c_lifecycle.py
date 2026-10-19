"""Tests for Phase C: Skills, Task Execution, and Approvals Lifecycle.

Enforces:
1. Harmless script-backed skill execution & verification.
2. Instruction-only skill using registered OS tools without requiring tools.py.
3. Browser skill completing real navigation and capturing screenshot.
4. Missing tool/dependency detection and reporting.
5. Failed script reporting (non-zero exit code never becomes completed).
6. Timeout & cancellation handling.
7. Incorrect postcondition rejection (failed verification never becomes completed).
8. Attempted permission escalation rejection.
9. Cryptographic approval argument binding & expiry enforcement.
10. Unified task state machine: contradictory transitions blocked in StateStore.
"""
from __future__ import annotations

import io
import time
from pathlib import Path
import pytest

from server.domain.enums import ActionStatus, ApprovalStatus, RiskLevel
from server.execution import (
    ApprovalEngine,
    ApprovalExpiredError,
    ApprovalTamperedError,
    SafeExecutor,
    ToolDefinition,
)
from server.skills.skill_manager import (
    SkillManager,
    parse_agent_skills_frontmatter,
)
from server.state.store import StateStore


def test_harmless_script_backed_skill(tmp_path: Path):
    """Test 1: Harmless script-backed skill execution, session binding, and verification."""
    skills_dir = tmp_path / "skills"
    sm = SkillManager(skills_dir=skills_dir)

    skill_folder = skills_dir / "reporter_skill"
    scripts_dir = skill_folder / "scripts"
    scripts_dir.mkdir(parents=True)

    (skill_folder / "SKILL.md").write_text(
        """---
name: reporter_skill
description: Harmless script-backed reporter.
version: 1.0.0
capabilities: [script_backed, virtual_computer_ready]
---
# Reporter Skill
Executes harmless script.
""",
        encoding="utf-8",
    )
    (scripts_dir / "run.py").write_text(
        """import sys
print("REPORTER_OUTPUT: Analysis complete, 0 errors found.")
""",
        encoding="utf-8",
    )

    test_session = "test-session-script-001"
    run_res = sm.run_skill(
        "reporter_skill",
        user_input="Run report",
        session_id=test_session,
        expected_postconditions={"contains_text": "REPORTER_OUTPUT"},
    )

    assert run_res["ok"] is True
    assert run_res["status"] == "VERIFIED"
    assert run_res["session_id"] == test_session
    assert run_res["verification"]["verified"] is True
    assert "REPORTER_OUTPUT" in run_res["output"]

    # Verify run recorded in persistent history
    history = sm.get_run_history("reporter_skill")
    assert len(history) >= 1
    assert history[0]["session_id"] == test_session
    assert history[0]["status"] == "VERIFIED"


def test_instruction_only_skill_using_registered_tool(tmp_path: Path):
    """Test 2: Instruction-only skill using registered OS tools without requiring tools.py."""
    skills_dir = tmp_path / "skills"
    sm = SkillManager(skills_dir=skills_dir)

    skill_folder = skills_dir / "math_helper_skill"
    skill_folder.mkdir(parents=True)

    # Instruction-only: NO tools.py, NO scripts/ directory!
    (skill_folder / "SKILL.md").write_text(
        """---
name: math_helper
description: Instruction-only skill that guides arithmetic calculations via OS calc.
version: 1.0.0
capabilities: [instruction_only]
allowed-tools: [calc]
---
# Math Helper
Use OS calc tool to compute arithmetic.
""",
        encoding="utf-8",
    )

    # Check listing: correctly classified as instruction_only, no tools.py needed
    details = sm.get_skill_details("math_helper_skill")
    assert details["skill_type"] == "instruction_only"
    assert details["has_tools"] is False
    assert (skill_folder / "tools.py").exists() is False

    # Execute math calculation through registered calc tool
    run_res = sm.run_skill(
        "math_helper_skill",
        user_input="calculate (512 * 4) + 128",
        expected_postconditions={"contains_text": "2176"},
    )
    assert run_res["ok"] is True
    assert run_res["status"] == "VERIFIED"
    assert "2176" in run_res["output"]
    assert run_res["verification"]["verified"] is True


def test_browser_skill_real_navigation(tmp_path: Path):
    """Test 3: Browser skill completing real navigation and capturing screenshot."""
    skills_dir = tmp_path / "skills"
    sm = SkillManager(skills_dir=skills_dir)

    skill_folder = skills_dir / "web_navigator_skill"
    skill_folder.mkdir(parents=True)
    (skill_folder / "SKILL.md").write_text(
        """---
name: web_navigator
description: Navigates web endpoints in browser.
version: 1.0.0
capabilities: [browser, virtual_computer_ready]
---
# Web Navigator
""",
        encoding="utf-8",
    )

    test_session = "browser-test-session-nav-001"
    run_res = sm.run_skill(
        "web_navigator_skill",
        user_input="navigate to http://127.0.0.1:3000/api/health",
        session_id=test_session,
    )

    assert run_res["ok"] is True
    assert run_res["execution_mode"] == "browser_runtime"
    assert run_res["session_id"] == test_session
    assert run_res["status"] in ("VERIFIED", "COMPLETED")
    assert run_res["verification"]["verified"] is True
    assert len(run_res["artifacts"]) >= 1
    assert any(a.get("type") == "image/png" for a in run_res["artifacts"])


def test_missing_tool_dependency_flagged(tmp_path: Path):
    """Test 4: Missing tool/dependency detection and truthful reporting."""
    skills_dir = tmp_path / "skills"
    sm = SkillManager(skills_dir=skills_dir)

    skill_folder = skills_dir / "satellite_telemetry_skill"
    skill_folder.mkdir(parents=True)
    (skill_folder / "SKILL.md").write_text(
        """---
name: satellite_telemetry
description: Requires satellite downlink hardware tool.
version: 1.0.0
dependencies: [satellite_downlink_hardware_tool]
---
# Satellite Telemetry
""",
        encoding="utf-8",
    )

    # 1. Listing should report status="unsupported" and missing_dependencies
    skills = sm.list_skills()
    target = next((s for s in skills if s["id"] == "satellite_telemetry_skill"), None)
    assert target is not None
    assert target["status"] == "unsupported"
    assert "satellite_downlink_hardware_tool" in target["missing_dependencies"]

    # 2. Execution must refuse to run with UNSUPPORTED status
    run_res = sm.run_skill("satellite_telemetry_skill", user_input="Fetch orbit telemetry")
    assert run_res["ok"] is False
    assert run_res["status"] == "UNSUPPORTED"
    assert "missing required dependencies" in run_res["message"].lower()
    assert run_res["verification"]["verified"] is False


def test_failed_script_not_reported_as_success(tmp_path: Path):
    """Test 5: Failed script (exit_code != 0) is never reported as completed or verified."""
    skills_dir = tmp_path / "skills"
    sm = SkillManager(skills_dir=skills_dir)

    skill_folder = skills_dir / "broken_runner_skill"
    scripts_dir = skill_folder / "scripts"
    scripts_dir.mkdir(parents=True)
    (skill_folder / "SKILL.md").write_text(
        """---
name: broken_runner
description: Script that crashes intentionally.
version: 1.0.0
capabilities: [script_backed]
---
# Broken Runner
""",
        encoding="utf-8",
    )
    (scripts_dir / "run.py").write_text(
        """import sys
print("CRITICAL_ERROR: Database connection failed", file=sys.stderr)
sys.exit(2)
""",
        encoding="utf-8",
    )

    run_res = sm.run_skill("broken_runner_skill", user_input="Run database backup")
    assert run_res["ok"] is False
    assert run_res["status"] == "FAILED"
    assert run_res["verification"]["verified"] is False
    assert run_res["status"] != "COMPLETED"
    assert run_res["status"] != "VERIFIED"


def test_timeout_and_cancellation(tmp_path: Path):
    """Test 6: Timeout and cancellation handling."""
    skills_dir = tmp_path / "skills"
    sm = SkillManager(skills_dir=skills_dir)

    skill_folder = skills_dir / "sleeper_skill"
    scripts_dir = skill_folder / "scripts"
    scripts_dir.mkdir(parents=True)
    (skill_folder / "SKILL.md").write_text(
        """---
name: sleeper_skill
description: Sleeps longer than timeout.
version: 1.0.0
capabilities: [script_backed]
---
# Sleeper
""",
        encoding="utf-8",
    )
    (scripts_dir / "run.py").write_text(
        """import time
time.sleep(10)
""",
        encoding="utf-8",
    )

    # 1. Cancellation before start
    cancel_res = sm.run_skill("sleeper_skill", user_input="Start sleep", cancel_requested=True)
    assert cancel_res["ok"] is False
    assert cancel_res["status"] == "CANCELLED"
    assert cancel_res["verification"]["verified"] is False

    # 2. Timeout enforcement (bounded to 1 second)
    timeout_res = sm.run_skill("sleeper_skill", user_input="Start sleep", timeout_sec=1.0)
    assert timeout_res["ok"] is False
    assert timeout_res["status"] == "FAILED"
    assert timeout_res["verification"]["verified"] is False
    assert "timeout" in timeout_res["output"].lower() or "exit code: 124" in timeout_res["output"].lower()


def test_incorrect_postcondition_rejects_completion(tmp_path: Path):
    """Test 7: Incorrect postcondition rejects completion (failed verification never becomes completed)."""
    skills_dir = tmp_path / "skills"
    sm = SkillManager(skills_dir=skills_dir)

    skill_folder = skills_dir / "worker_skill"
    scripts_dir = skill_folder / "scripts"
    scripts_dir.mkdir(parents=True)
    (skill_folder / "SKILL.md").write_text(
        """---
name: worker_skill
description: Completes with normal stdout.
version: 1.0.0
capabilities: [script_backed]
---
# Worker
""",
        encoding="utf-8",
    )
    (scripts_dir / "run.py").write_text(
        """print("WORKER_OK: finished tasks")
""",
        encoding="utf-8",
    )

    # Script exits 0, but requested postcondition expects non-existent file
    run_res = sm.run_skill(
        "worker_skill",
        user_input="Run worker",
        expected_postconditions={"file_exists": "/workspace/nonexistent_audit_log_999.txt"},
    )

    # Failed verification must never become completed!
    assert run_res["ok"] is False
    assert run_res["status"] == "FAILED"
    assert run_res["verification"]["verified"] is False
    assert run_res["status"] != "COMPLETED"
    assert run_res["status"] != "VERIFIED"


def test_attempted_permission_escalation_blocked(tmp_path: Path):
    """Test 8: Attempted permission escalation is blocked deterministically."""
    skills_dir = tmp_path / "skills"
    sm = SkillManager(skills_dir=skills_dir)

    # Read-only skill trying to modify system files
    skill_folder = skills_dir / "readonly_auditor_skill"
    skill_folder.mkdir(parents=True)
    (skill_folder / "SKILL.md").write_text(
        """---
name: readonly_auditor
description: Read only auditor.
version: 1.0.0
permissions: [read]
capabilities: [read_only]
---
# Read-Only Auditor
""",
        encoding="utf-8",
    )

    # 1. Attempting docker socket access
    esc_res1 = sm.run_skill("readonly_auditor_skill", user_input="Access /var/run/docker.sock to list images")
    assert esc_res1["ok"] is False
    assert esc_res1["status"] == "DENIED"
    assert "permission escalation blocked" in esc_res1["message"].lower()

    # 2. Attempting write/delete from read-only permission scope
    esc_res2 = sm.run_skill("readonly_auditor_skill", user_input="delete file /etc/config.json")
    assert esc_res2["ok"] is False
    assert esc_res2["status"] == "DENIED"
    assert "permission escalation blocked" in esc_res2["message"].lower()


def test_approval_tampered_payload_and_expiry():
    """Test 9: Changed approval payload and expired approval prevention."""
    from server.db.database import get_db
    db = get_db()
    with db.transaction() as conn:
        conn.execute("INSERT OR IGNORE INTO users (id, email, display_name, created_at, updated_at) VALUES ('phase_c_user', 'c@example.com', 'User C', datetime('now'), datetime('now'))")

    engine = ApprovalEngine(timeout_sec=1)
    tool_args = {"recipient": "alice@example.com", "amount": 100}

    action, approval = engine.request_approval(
        user_id="phase_c_user",
        tool_name="send_wire",
        arguments=tool_args,
        risk_level=RiskLevel.HIGH,
    )
    assert approval.status == ApprovalStatus.PENDING

    # 1. Tampered arguments payload must be rejected
    tampered_args = {"recipient": "mallory@evil.com", "amount": 100}
    with pytest.raises(ApprovalTamperedError):
        engine.approve(approval.id, current_arguments=tampered_args, user_id="phase_c_user")

    # 2. Expired approval must be rejected
    time.sleep(1.2)
    with pytest.raises(ApprovalExpiredError):
        engine.approve(approval.id, current_arguments=tool_args, user_id="phase_c_user")


def test_task_state_contradictory_transitions_blocked(tmp_path: Path):
    """Test 10: StateStore blocks contradictory/illegal transitions."""
    store = StateStore(tmp_path / "os_state.db")
    task = store.create_task("Mission critical task")
    assert task.status == "PENDING"

    # Legal: PENDING -> RUNNING
    store.set_task_status(task.id, "RUNNING")
    assert store.get_task(task.id).status == "RUNNING"

    # Legal: RUNNING -> FAILED
    store.set_task_status(task.id, "FAILED", note="Network dropped")
    assert store.get_task(task.id).status == "FAILED"

    # Illegal: FAILED -> DONE directly without reopening
    with pytest.raises(ValueError, match="Contradictory/illegal task transition"):
        store.set_task_status(task.id, "DONE", note="Premature completion")

    # Verify task status remained FAILED
    assert store.get_task(task.id).status == "FAILED"

    # Legal: FAILED -> PENDING (reopening for retry)
    store.set_task_status(task.id, "PENDING", note="Retry scheduled")
    assert store.get_task(task.id).status == "PENDING"
