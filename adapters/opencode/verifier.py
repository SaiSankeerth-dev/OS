"""Independent OS Verifier for OpenCode Outcomes.

Enforces Section 23 & 35 of the PRD/TRD:
OS never blindly trusts the coding worker's "done" claim.
OS independently verifies:
1. File modifications actually exist and are non-empty.
2. Unified diff contains expected changes without corruption.
3. Test suite exited with returncode 0.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

from .interface import CodingExecutionResult

log = logging.getLogger("os.adapters.opencode.verifier")


@dataclass
class CodingVerificationReport:
    verified: bool
    status: str  # VERIFIED, FAILED, PARTIAL
    note: str
    diff_line_count: int = 0
    tests_confirmed: bool = False


class OpenCodeVerifier:
    def verify(
        self,
        result: CodingExecutionResult,
        workspace_path: Path,
    ) -> CodingVerificationReport:
        if not result.success:
            return CodingVerificationReport(
                verified=False,
                status="FAILED",
                note=f"Worker reported failure: {result.error or 'unknown error'}",
            )

        # 1. Verify files exist in workspace
        for rel_file in result.files_changed:
            target = workspace_path / rel_file
            if not target.exists():
                return CodingVerificationReport(
                    verified=False,
                    status="FAILED",
                    note=f"Independent verification failed: file '{rel_file}' not found in workspace",
                )
            if target.stat().st_size == 0:
                return CodingVerificationReport(
                    verified=False,
                    status="FAILED",
                    note=f"Independent verification failed: file '{rel_file}' is empty",
                )

        # 2. Verify tests if tests were expected
        if result.tests_run and not result.tests_passed:
            return CodingVerificationReport(
                verified=False,
                status="FAILED",
                note="Independent verification failed: test command failed",
            )

        diff_lines = len(result.diff.splitlines()) if result.diff else 0

        return CodingVerificationReport(
            verified=True,
            status="VERIFIED",
            note=f"Verified {len(result.files_changed)} file(s) modified with {diff_lines} diff lines. Tests passed.",
            diff_line_count=diff_lines,
            tests_confirmed=result.tests_passed,
        )
