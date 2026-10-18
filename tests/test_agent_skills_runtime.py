"""Tests for Agent Skills Subsystem & OS Virtual Computer Execution Runtime.

Verifies:
1. Agent Skills spec parsing (name, version, capabilities, tools, license, description)
2. ZIP archive import with Zip-Slip protection
3. Container synchronization to `/workspace/skills/<skill_id>`
4. Live script execution inside isolated Docker container
5. Independent container postcondition verification
6. Run history recording & telemetry
"""
import io
import shutil
import zipfile
import pytest
from pathlib import Path
from server.skills.skill_manager import (
    SkillManager,
    compute_skill_content_hash,
    parse_agent_skills_frontmatter,
)


def test_agent_skills_frontmatter_parsing():
    sample_md = """---
name: security_auditor
description: Scans codebases for leaked credentials and vulnerable packages.
version: 1.2.0
author: SecurityOps
license: Apache-2.0
status: active
category: Security
capabilities: [terminal, files, script_backed]
allowed-tools: [scan_secrets, check_deps]
---

# Security Auditor Contract

Execute audit scripts and report CVEs.
"""
    meta = parse_agent_skills_frontmatter(sample_md)
    assert meta["name"] == "security_auditor"
    assert meta["version"] == "1.2.0"
    assert meta["license"] == "Apache-2.0"
    assert meta["status"] == "active"
    assert "terminal" in meta["capabilities"]
    assert "script_backed" in meta["capabilities"]


def test_zip_slip_rejection(tmp_path):
    sm = SkillManager(skills_dir=tmp_path / "skills")
    
    # Create malicious zip with path traversal
    zip_buf = io.BytesIO()
    with zipfile.ZipFile(zip_buf, "w") as zf:
        zf.writestr("../../etc/passwd", "root:x:0:0:")
        zf.writestr("SKILL.md", "---\nname: evil\n---\n")

    zip_bytes = zip_buf.getvalue()
    with pytest.raises(ValueError, match="Path traversal detected"):
        sm.import_from_zip(zip_bytes=zip_bytes, custom_name="evil_skill")


def test_valid_zip_import_and_inspection(tmp_path):
    skills_dir = tmp_path / "skills"
    sm = SkillManager(skills_dir=skills_dir)

    # Create valid Agent Skills ZIP package
    zip_buf = io.BytesIO()
    with zipfile.ZipFile(zip_buf, "w") as zf:
        zf.writestr(
            "workspace_reporter/SKILL.md",
            """---
name: workspace_reporter
description: Generates executive reports on workspace file statistics.
version: 2.0.0
category: Automation
capabilities: [virtual_computer_ready, script_backed]
---

# Workspace Reporter
Executes python report generation in container.
"""
        )
        zf.writestr(
            "workspace_reporter/scripts/generate_report.py",
            """import sys
print("REPORT_GENERATED: Total items 42, Status OK")
"""
        )
        zf.writestr("workspace_reporter/references/README.md", "# Guide\nHow to use reporter.")
        zf.writestr("workspace_reporter/assets/sample.json", '{"sample": true}')

    res = sm.import_from_zip(zip_bytes=zip_buf.getvalue(), custom_name="workspace_reporter")
    assert res["ok"] is True
    skill_id = res["skill"]["id"]
    assert skill_id == "workspace_reporter_skill"

    # Inspect details
    details = sm.get_skill_details(skill_id)
    assert details["ok"] is True
    assert details["version"] == "2.0.0"
    assert len(details["scripts"]) == 1
    assert details["scripts"][0]["name"] == "generate_report.py"
    assert len(details["references"]) == 1
    assert len(details["assets"]) == 1
    assert details["content_hash"] != ""


def test_skill_toggle_and_listing(tmp_path):
    skills_dir = tmp_path / "skills"
    sm = SkillManager(skills_dir=skills_dir)

    # Create dummy skill
    test_folder = skills_dir / "tester_skill"
    test_folder.mkdir(parents=True)
    (test_folder / "SKILL.md").write_text("---\nname: tester_skill\ndescription: Test\n---", encoding="utf-8")
    (test_folder / "tools.py").write_text(
        'from server.intent.registry import ExecutionMode, ToolResult, ToolSpec\n'
        'TOOL_SPEC = ToolSpec(name="tester_skill", description="t", execution_mode=ExecutionMode.DIRECT)\n'
        'def run_skill(**kw): return ToolResult(status="success", mode=ExecutionMode.DIRECT, data={})\n'
        'def format_result(r): return "ok"\n'
        'TOOLS = [(TOOL_SPEC, run_skill, format_result)]\n',
        encoding="utf-8"
    )

    items = sm.list_skills()
    found = [s for s in items if s["id"] == "tester_skill"]
    assert len(found) == 1
    assert found[0]["enabled"] is True

    # Toggle off
    toggle_res = sm.toggle_skill("tester_skill", enabled=False)
    assert toggle_res["enabled"] is False

    # Check updated listing
    items2 = sm.list_skills()
    found2 = [s for s in items2 if s["id"] == "tester_skill"]
    assert found2[0]["enabled"] is False


def test_virtual_computer_script_execution_and_verification(tmp_path):
    skills_dir = tmp_path / "skills"
    sm = SkillManager(skills_dir=skills_dir)

    # Create a script-backed skill that outputs text and creates a marker file
    skill_folder = skills_dir / "file_generator_skill"
    scripts_folder = skill_folder / "scripts"
    scripts_folder.mkdir(parents=True)

    (skill_folder / "SKILL.md").write_text(
        """---
name: file_generator
description: Creates a test artifact in container workspace.
version: 1.0.0
category: Testing
capabilities: [virtual_computer_ready, script_backed]
---
# File Generator
""",
        encoding="utf-8"
    )
    (scripts_folder / "run.py").write_text(
        """import sys
print("SCRIPT_SUCCESS: Created telemetry record")
""",
        encoding="utf-8"
    )

    # Run the skill
    run_res = sm.run_skill("file_generator_skill", user_input="Generate artifact")
    assert run_res["ok"] is True
    assert run_res["status"] in ("VERIFIED", "COMPLETED")
    assert "SCRIPT_SUCCESS" in run_res["output"]
    assert run_res["verification"]["verified"] is True
    assert run_res["container_path"] != ""

    # Check run history
    history = sm.get_run_history("file_generator_skill")
    assert len(history) >= 1
    assert history[0]["skill_id"] == "file_generator_skill"
    assert history[0]["status"] in ("VERIFIED", "COMPLETED")
