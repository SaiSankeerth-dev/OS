"""OpenCode Coding Worker Interface for OS.

Enforces Section 23 & 34 of the PRD/TRD:
OS is the control plane and manager.
OpenCode is a specialized execution worker for complex software engineering,
terminal commands, repository modifications, and test execution.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Optional, Protocol


@dataclass
class CodingTaskConfig:
    task_id: str
    instruction: str
    workspace_dir: Path
    base_repo_path: Optional[Path] = None
    timeout_seconds: int = 300
    allow_terminal: bool = True
    test_command: Optional[str] = None
    context: dict[str, Any] = field(default_factory=dict)


@dataclass
class CodingExecutionResult:
    task_id: str
    success: bool
    status: str  # SUCCEEDED, FAILED, TIMED_OUT, CANCELLED
    files_changed: list[str] = field(default_factory=list)
    commands_run: list[dict[str, Any]] = field(default_factory=list)
    tests_run: bool = False
    tests_passed: bool = False
    test_output: str = ""
    diff: str = ""
    error: Optional[str] = None
    logs: list[str] = field(default_factory=list)


class CodingWorker(Protocol):
    """Standard interface for specialized coding engines."""

    def start_task(self, config: CodingTaskConfig) -> str:
        """Starts a coding task in an isolated workspace. Returns run_id."""
        ...

    def get_status(self, run_id: str) -> dict[str, Any]:
        """Queries the current status and progress of the worker."""
        ...

    def cancel(self, run_id: str) -> bool:
        """Cancels an in-progress coding execution."""
        ...

    def collect_result(self, run_id: str) -> CodingExecutionResult:
        """Collects the completed execution result, diffs, and receipts."""
        ...
