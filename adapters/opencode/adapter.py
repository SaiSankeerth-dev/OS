"""OpenCode Specialized Coding Adapter for OS.

Enforces Section 23 & 34 of the PRD/TRD:
- Operates strictly inside an isolated workspace.
- Executes code inspection, file modifications, terminal commands, and test suites.
- Generates command receipts and file diffs for independent OS verification.
"""
from __future__ import annotations

import difflib
import logging
import subprocess
import time
import uuid
from pathlib import Path
from typing import Any, Optional

from .interface import CodingExecutionResult, CodingTaskConfig, CodingWorker
from .workspace import WorkspaceManager

log = logging.getLogger("os.adapters.opencode")


class OpenCodeAdapter(CodingWorker):
    def __init__(self, workspace_manager: Optional[WorkspaceManager] = None) -> None:
        self.workspace_mgr = workspace_manager or WorkspaceManager()
        self._runs: dict[str, dict[str, Any]] = {}

    def start_task(self, config: CodingTaskConfig) -> str:
        run_id = f"opencode_{uuid.uuid4().hex[:8]}"

        # 1. Prepare isolated workspace
        ws = self.workspace_mgr.prepare_workspace(
            task_id=config.task_id,
            source_repo=config.base_repo_path,
        )

        self._runs[run_id] = {
            "run_id": run_id,
            "task_id": config.task_id,
            "config": config,
            "workspace": ws,
            "status": "RUNNING",
            "start_time": time.time(),
            "commands_run": [],
            "files_changed": [],
            "diff": "",
            "tests_run": False,
            "tests_passed": False,
            "test_output": "",
            "logs": [f"Isolated workspace initialized at: {ws}"],
            "error": None,
        }
        return run_id

    def execute_sync(self, run_id: str, edits: dict[str, str], test_cmd: Optional[str] = None) -> CodingExecutionResult:
        """Executes a coding batch in the sandbox: applies edits, captures diffs, and runs test commands."""
        run = self._runs.get(run_id)
        if not run:
            raise ValueError(f"Run {run_id} not found")

        ws: Path = run["workspace"]
        files_changed = []
        full_diff = []

        # 1. Apply file edits
        for rel_path, new_content in edits.items():
            target_file = ws / rel_path
            old_content = ""
            if target_file.exists():
                try:
                    old_content = target_file.read_text(encoding="utf-8", errors="replace")
                except Exception:
                    pass

            target_file.parent.mkdir(parents=True, exist_ok=True)
            target_file.write_text(new_content, encoding="utf-8")
            files_changed.append(rel_path)

            # Compute diff
            diff_lines = list(
                difflib.unified_diff(
                    old_content.splitlines(keepends=True),
                    new_content.splitlines(keepends=True),
                    fromfile=f"a/{rel_path}",
                    tofile=f"b/{rel_path}",
                )
            )
            full_diff.append("".join(diff_lines))
            run["logs"].append(f"Modified file: {rel_path} ({len(diff_lines)} diff lines)")

        run["files_changed"] = files_changed
        run["diff"] = "\n".join(full_diff)

        # 2. Run test command if specified
        tests_run = False
        tests_passed = False
        test_output = ""

        if test_cmd:
            tests_run = True
            run["logs"].append(f"Executing test command: {test_cmd}")
            try:
                proc = subprocess.run(
                    test_cmd,
                    shell=True,
                    cwd=str(ws),
                    capture_output=True,
                    text=True,
                    timeout=120,
                )
                test_output = f"{proc.stdout}\n{proc.stderr}".strip()
                tests_passed = (proc.returncode == 0)
                run["commands_run"].append({
                    "command": test_cmd,
                    "exit_code": proc.returncode,
                    "stdout": proc.stdout[:2000],
                    "stderr": proc.stderr[:2000],
                })
                run["logs"].append(f"Test run completed with exit code: {proc.returncode}")
            except Exception as e:
                test_output = f"Test execution failed: {e}"
                tests_passed = False
                run["error"] = str(e)
                run["logs"].append(f"Test execution error: {e}")

        run["tests_run"] = tests_run
        run["tests_passed"] = tests_passed
        run["test_output"] = test_output
        run["status"] = "SUCCEEDED" if (not tests_run or tests_passed) else "FAILED"

        return self.collect_result(run_id)

    def get_status(self, run_id: str) -> dict[str, Any]:
        run = self._runs.get(run_id)
        if not run:
            return {"status": "NOT_FOUND"}
        return {
            "run_id": run_id,
            "status": run["status"],
            "files_changed": run["files_changed"],
            "tests_passed": run["tests_passed"],
            "logs": run["logs"],
        }

    def cancel(self, run_id: str) -> bool:
        run = self._runs.get(run_id)
        if run and run["status"] == "RUNNING":
            run["status"] = "CANCELLED"
            run["logs"].append("Execution cancelled by OS control plane")
            return True
        return False

    def collect_result(self, run_id: str) -> CodingExecutionResult:
        run = self._runs.get(run_id)
        if not run:
            return CodingExecutionResult(
                task_id="unknown",
                success=False,
                status="NOT_FOUND",
                error="Run ID not found",
            )
        return CodingExecutionResult(
            task_id=run["task_id"],
            success=(run["status"] == "SUCCEEDED"),
            status=run["status"],
            files_changed=run["files_changed"],
            commands_run=run["commands_run"],
            tests_run=run["tests_run"],
            tests_passed=run["tests_passed"],
            test_output=run["test_output"],
            diff=run["diff"],
            error=run["error"],
            logs=run["logs"],
        )
