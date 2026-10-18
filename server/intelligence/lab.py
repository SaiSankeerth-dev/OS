"""Virtual Computer / Desktop Repository Lab for OS V3.

Provides an isolated environment to clone, inspect, test, and safely execute
promising open-source repositories with runtime detection, risky install script scanning,
scrubbed environment variables, timeout containment, and log capture.
"""
from __future__ import annotations

import json
import logging
import os
import re
import shutil
import subprocess
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from .models import CandidateRepo, RepoStatus
from .scope_guard import ScopeGuard, ScopeViolationError

log = logging.getLogger("os.intelligence.lab")

# Sensitive environment variables scrubbed before sandbox execution
SENSITIVE_ENV_PREFIXES = (
    "GITHUB_",
    "GOOGLE_",
    "AWS_",
    "ANTHROPIC_",
    "OPENAI_",
    "GEMINI_",
    "DATABASE_",
    "AZURE_",
)
SENSITIVE_ENV_SUBSTRINGS = (
    "SECRET",
    "TOKEN",
    "KEY",
    "PASS",
    "CREDENTIAL",
    "AUTH",
)


@dataclass
class EvaluationReceipt:
    repo_id: str
    command: str
    exit_code: int
    stdout: str
    stderr: str
    duration_ms: float
    timestamp: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    def to_dict(self) -> Dict[str, Any]:
        return {
            "repo_id": self.repo_id,
            "command": self.command,
            "exit_code": self.exit_code,
            "stdout": self.stdout[:8000],  # cap display size
            "stderr": self.stderr[:4000],
            "duration_ms": round(self.duration_ms, 2),
            "timestamp": self.timestamp,
        }


class VirtualLabManager:
    def __init__(self, base_lab_dir: str | Path = "data/lab") -> None:
        self.base_dir = Path(base_lab_dir).resolve()
        self.base_dir.mkdir(parents=True, exist_ok=True)
        self.scope_guard = ScopeGuard(
            skill_name="virtual_lab",
            allowed_write_paths=[self.base_dir],
            allow_shell=True,
        )

    def _slugify(self, repo_id: str) -> str:
        return re.sub(r"[^a-zA-Z0-9_\-]", "_", repo_id).lower()

    def get_workspace(self, repo_id: str) -> Path:
        """Get or initialize isolated workspace directory for a repository."""
        slug = self._slugify(repo_id)
        ws = (self.base_dir / slug).resolve()
        # Verify jailed path
        self.scope_guard.check_write_path(ws)
        ws.mkdir(parents=True, exist_ok=True)
        return ws

    def inspect_manifests(self, workspace_path: Path) -> Dict[str, Any]:
        """Inspect repository files, detect runtime, and audit install scripts for hazardous patterns."""
        findings: Dict[str, Any] = {
            "runtime": "unknown",
            "has_package_json": False,
            "has_pyproject": False,
            "has_requirements": False,
            "risky_scripts_detected": [],
            "dependencies_sample": [],
            "suggested_test_command": None,
        }

        # Check Python
        pyproject = workspace_path / "pyproject.toml"
        requirements = workspace_path / "requirements.txt"
        setup_py = workspace_path / "setup.py"

        if pyproject.exists() or requirements.exists() or setup_py.exists():
            findings["runtime"] = "python"
            findings["suggested_test_command"] = "pytest" if (workspace_path / "tests").exists() else "python -m unittest"
            if requirements.exists():
                findings["has_requirements"] = True
                try:
                    lines = [line.strip() for line in requirements.read_text(encoding="utf-8", errors="ignore").splitlines() if line.strip() and not line.startswith("#")]
                    findings["dependencies_sample"] = lines[:10]
                except Exception:
                    pass

        # Check Node.js
        pkg_json = workspace_path / "package.json"
        if pkg_json.exists():
            findings["runtime"] = "nodejs"
            findings["has_package_json"] = True
            findings["suggested_test_command"] = "npm test"
            try:
                pkg_data = json.loads(pkg_json.read_text(encoding="utf-8", errors="ignore"))
                scripts = pkg_data.get("scripts", {})
                # Check for risky pre/post install scripts
                for s_name, s_cmd in scripts.items():
                    if any(term in s_cmd.lower() for term in ["curl", "wget", "rm -rf", "sh", "eval"]):
                        findings["risky_scripts_detected"].append(f"{s_name}: {s_cmd}")
            except Exception:
                pass

        return findings

    def _scrub_environment(self) -> Dict[str, str]:
        """Produce a clean environment dict without secrets or sensitive tokens."""
        clean_env = {}
        for k, v in os.environ.items():
            k_upper = k.upper()
            if any(k_upper.startswith(prefix) for prefix in SENSITIVE_ENV_PREFIXES):
                continue
            if any(substr in k_upper for substr in SENSITIVE_ENV_SUBSTRINGS):
                continue
            clean_env[k] = v
        # Add sandbox markers
        clean_env["OS_SANDBOX_JAIL"] = "1"
        clean_env["PYTHONUNBUFFERED"] = "1"
        return clean_env

    def run_sandbox_command(
        self,
        repo_id: str,
        command: str,
        timeout_seconds: int = 30,
    ) -> EvaluationReceipt:
        """Run command inside the isolated repository workspace with scrubbed environment and timeout."""
        ws = self.get_workspace(repo_id)

        # 1. Enforce ScopeGuard command check
        self.scope_guard.check_command(command)

        start_time = time.perf_counter()
        scrubbed_env = self._scrub_environment()

        try:
            # Execute in safe jailed subprocess
            proc = subprocess.run(
                command,
                cwd=str(ws),
                shell=True,
                capture_output=True,
                text=True,
                timeout=timeout_seconds,
                env=scrubbed_env,
            )
            duration_ms = (time.perf_counter() - start_time) * 1000.0

            receipt = EvaluationReceipt(
                repo_id=repo_id,
                command=command,
                exit_code=proc.returncode,
                stdout=proc.stdout or "",
                stderr=proc.stderr or "",
                duration_ms=duration_ms,
            )
        except subprocess.TimeoutExpired:
            duration_ms = (time.perf_counter() - start_time) * 1000.0
            receipt = EvaluationReceipt(
                repo_id=repo_id,
                command=command,
                exit_code=-9,
                stdout="",
                stderr=f"Command timed out after {timeout_seconds}s limit in virtual lab sandbox.",
                duration_ms=duration_ms,
            )
        except Exception as e:
            duration_ms = (time.perf_counter() - start_time) * 1000.0
            receipt = EvaluationReceipt(
                repo_id=repo_id,
                command=command,
                exit_code=-1,
                stdout="",
                stderr=f"Execution error: {str(e)}",
                duration_ms=duration_ms,
            )

        # Append to workspace receipts log
        log_file = ws / "evaluation_receipts.jsonl"
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(receipt.to_dict()) + "\n")

        return receipt

    def evaluate_repository(
        self,
        candidate: CandidateRepo,
        sample_files: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """Perform end-to-end virtual lab evaluation: prepare workspace, inspect manifests, run safe diagnostics."""
        ws = self.get_workspace(candidate.repo_id)

        # Write sample files if provided (useful for deterministic tests & mocked repos)
        if sample_files:
            for rel_path, content in sample_files.items():
                p = ws / rel_path
                p.parent.mkdir(parents=True, exist_ok=True)
                p.write_text(content, encoding="utf-8")

        # 1. Manifest inspection
        manifest_info = self.inspect_manifests(ws)

        # 2. Check for blockers
        if manifest_info["risky_scripts_detected"]:
            candidate.status = RepoStatus.BLOCKED
            return {
                "ok": False,
                "status": "BLOCKED",
                "reason": f"Hazardous install script detected: {manifest_info['risky_scripts_detected']}",
                "workspace": str(ws),
                "manifest_info": manifest_info,
                "receipts": [],
            }

        candidate.status = RepoStatus.TESTING
        receipts: List[Dict[str, Any]] = []

        # 3. Run safe diagnostic command (e.g. check Python version or file list)
        diag_receipt = self.run_sandbox_command(candidate.repo_id, "python -c \"print('OS Lab environment verified')\"")
        receipts.append(diag_receipt.to_dict())

        # 4. If test command suggested and files present, run test
        if manifest_info.get("suggested_test_command") and sample_files:
            test_rcpt = self.run_sandbox_command(candidate.repo_id, manifest_info["suggested_test_command"], timeout_seconds=15)
            receipts.append(test_rcpt.to_dict())

        candidate.status = RepoStatus.EVALUATED

        outcome = {
            "ok": True,
            "status": "EVALUATED",
            "workspace": str(ws),
            "manifest_info": manifest_info,
            "receipts": receipts,
            "evaluated_at": datetime.now(timezone.utc).isoformat(),
        }

        # Save summary to workspace
        (ws / "evaluation_summary.json").write_text(json.dumps(outcome, indent=2), encoding="utf-8")

        return outcome

    def list_workspaces(self) -> List[Dict[str, Any]]:
        """List all active lab workspaces and their files."""
        results = []
        if not self.base_dir.exists():
            return results

        for child in sorted(self.base_dir.iterdir()):
            if child.is_dir():
                files = []
                try:
                    for f in child.iterdir():
                        files.append({"name": f.name, "dir": f.is_dir(), "size": f.stat().st_size if f.is_file() else 0})
                except Exception:
                    pass
                results.append({
                    "slug": child.name,
                    "path": str(child),
                    "files_count": len(files),
                    "files": files[:20],
                })
        return results


_LAB_MANAGER: Optional[VirtualLabManager] = None


def get_lab_manager() -> VirtualLabManager:
    global _LAB_MANAGER
    if _LAB_MANAGER is None:
        _LAB_MANAGER = VirtualLabManager()
    return _LAB_MANAGER
