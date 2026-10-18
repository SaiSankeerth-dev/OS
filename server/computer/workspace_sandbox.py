"""Isolated Developer Workspace Sandbox for OS Virtual Computer.

Provides sandboxed repository cloning, test execution, script running, and file manipulation:
- Enforces strict workspace jailing (preventing path traversal and symlink escapes)
- Blocks forbidden system binaries, network sniffers, and host Docker socket access
- Captures stdout, stderr, and exit codes with bounded output buffers (128KB)
- Enforces timeouts (default 30s) and environment variable scrubbing
- Seamlessly switches between Docker container workspace and hardened local sandbox
"""
from __future__ import annotations

import logging
import os
import re
import shutil
import subprocess
import time
import uuid
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from web.om.sandbox_jail import HardenedLocalSandbox, SandboxViolationError

log = logging.getLogger("os.computer.workspace_sandbox")

OUTPUT_LIMIT = 128 * 1024
DEFAULT_TIMEOUT_SEC = 30.0


@dataclass
class WorkspaceCommandResult:
    command: str
    exit_code: int
    stdout: str
    stderr: str
    duration_ms: float
    timed_out: bool = False
    truncated: bool = False
    sandbox_mode: str = "local_jail"  # "docker" or "local_jail"
    workspace_path: str = "/workspace"


class WorkspaceSandboxManager:
    """Manages isolated developer workspaces for repository testing and agent script execution."""

    def __init__(self, workspace_root: Optional[str | Path] = None, prefer_docker: bool = True) -> None:
        self.workspace_root = Path(workspace_root or "data/om-workspace").resolve()
        self.workspace_root.mkdir(parents=True, exist_ok=True)
        self.local_jail = HardenedLocalSandbox(self.workspace_root)
        self.prefer_docker = prefer_docker

    def is_docker_available(self) -> bool:
        """Check if Docker CLI and daemon are operational."""
        if shutil.which("docker") is None:
            return False
        try:
            res = subprocess.run(["docker", "version", "--format", "{{.Server.Version}}"], capture_output=True, text=True, timeout=3)
            return res.returncode == 0 and bool(res.stdout.strip())
        except Exception:
            return False

    def get_active_mode(self) -> str:
        """Return 'docker' if Docker is running and preferred, else 'local_jail'."""
        if not self.prefer_docker:
            return "local_jail"
        return "docker" if self.is_docker_available() else "local_jail"

    def execute_command(
        self,
        command: str,
        cwd_rel: str = "",
        timeout_sec: float = DEFAULT_TIMEOUT_SEC,
    ) -> WorkspaceCommandResult:
        """Safely execute a command inside the isolated workspace."""
        t0 = time.perf_counter()
        mode = self.get_active_mode()

        # Security check: Never allow mounting or referencing the Docker socket
        if "docker.sock" in command or "/var/run/docker.sock" in command:
            duration = round((time.perf_counter() - t0) * 1000, 2)
            return WorkspaceCommandResult(
                command=command,
                exit_code=1,
                stdout="",
                stderr="Security Violation: Host Docker socket mounting is strictly forbidden in OS sandboxes.",
                duration_ms=duration,
                sandbox_mode=mode,
                workspace_path=str(self.workspace_root),
            )

        # 1. Docker execution mode (if Docker is running and virtual desktop / sandbox container exists)
        if mode == "docker":
            return self._execute_docker(command, cwd_rel, timeout_sec, t0)

        # 2. Hardened local jail mode
        return self._execute_local(command, cwd_rel, timeout_sec, t0)

    def _execute_local(
        self,
        command: str,
        cwd_rel: str,
        timeout_sec: float,
        t0: float,
    ) -> WorkspaceCommandResult:
        target_dir = (self.workspace_root / cwd_rel.lstrip("/\\")).resolve()
        if not str(target_dir).startswith(str(self.workspace_root)):
            target_dir = self.workspace_root

        try:
            jail = HardenedLocalSandbox(target_dir)
            res = jail.execute_jailed(command, timeout_sec=timeout_sec)
            duration = round((time.perf_counter() - t0) * 1000, 2)
            return WorkspaceCommandResult(
                command=command,
                exit_code=res.get("exit_code", 0),
                stdout=res.get("stdout", ""),
                stderr=res.get("stderr", ""),
                duration_ms=duration,
                timed_out=bool(res.get("timed_out")),
                sandbox_mode="local_jail",
                workspace_path=str(target_dir),
            )
        except SandboxViolationError as sve:
            duration = round((time.perf_counter() - t0) * 1000, 2)
            return WorkspaceCommandResult(
                command=command,
                exit_code=1,
                stdout="",
                stderr=f"SandboxViolationError: {sve}",
                duration_ms=duration,
                sandbox_mode="local_jail",
                workspace_path=str(target_dir),
            )
        except Exception as e:
            duration = round((time.perf_counter() - t0) * 1000, 2)
            return WorkspaceCommandResult(
                command=command,
                exit_code=-1,
                stdout="",
                stderr=f"Execution failed: {e}",
                duration_ms=duration,
                sandbox_mode="local_jail",
                workspace_path=str(target_dir),
            )

    def _execute_docker(
        self,
        command: str,
        cwd_rel: str,
        timeout_sec: float,
        t0: float,
    ) -> WorkspaceCommandResult:
        container_name = "os-virtual-desktop"
        docker_cwd = f"/workspace/{cwd_rel.lstrip('/\\')}".rstrip("/") if cwd_rel else "/workspace"

        args = [
            "docker", "exec",
            "--user", "1000:1000",
            "--workdir", docker_cwd,
            container_name,
            "/bin/bash", "-c", command,
        ]
        try:
            proc = subprocess.run(
                args,
                capture_output=True,
                text=True,
                timeout=timeout_sec + 5,
            )
            duration = round((time.perf_counter() - t0) * 1000, 2)
            return WorkspaceCommandResult(
                command=command,
                exit_code=proc.returncode,
                stdout=proc.stdout[:OUTPUT_LIMIT],
                stderr=proc.stderr[:OUTPUT_LIMIT],
                duration_ms=duration,
                sandbox_mode="docker",
                workspace_path=docker_cwd,
            )
        except subprocess.TimeoutExpired:
            duration = round((time.perf_counter() - t0) * 1000, 2)
            return WorkspaceCommandResult(
                command=command,
                exit_code=-1,
                stdout="",
                stderr=f"Command timed out after {timeout_sec}s inside Docker container.",
                duration_ms=duration,
                timed_out=True,
                sandbox_mode="docker",
                workspace_path=docker_cwd,
            )
        except Exception as e:
            # Fall back to local jail if container execution encounters an error
            log.warning("Docker execution failed: %s; falling back to local sandbox jail.", e)
            return self._execute_local(command, cwd_rel, timeout_sec, t0)

    def clone_repository(
        self,
        repo_url: str,
        destination_folder: str = "",
        timeout_sec: float = 60.0,
    ) -> WorkspaceCommandResult:
        """Clone a git repository into the sandboxed workspace."""
        clean_url = repo_url.strip()
        if not clean_url.startswith(("https://", "http://", "git://")):
            return WorkspaceCommandResult(
                command=f"git clone {clean_url}",
                exit_code=1,
                stdout="",
                stderr="Invalid repository URL. Must start with https://, http://, or git://",
                duration_ms=0.0,
                workspace_path=str(self.workspace_root),
            )

        dest = destination_folder.strip() or clean_url.rstrip("/").split("/")[-1].removesuffix(".git")
        dest = re.sub(r"[^a-zA-Z0-9_\-\.]", "_", dest)

        cmd = f"git clone --depth 1 {clean_url} {dest}"
        return self.execute_command(cmd, timeout_sec=timeout_sec)

    def write_file(self, relative_path: str, content: str) -> bool:
        """Write content to a file inside the sandboxed workspace."""
        clean_path = (self.workspace_root / relative_path.lstrip("/\\")).resolve()
        if not str(clean_path).startswith(str(self.workspace_root)):
            raise SandboxViolationError(f"Path traversal attempt: {relative_path}")
        clean_path.parent.mkdir(parents=True, exist_ok=True)
        clean_path.write_text(content, encoding="utf-8")

        if self.get_active_mode() == "docker":
            try:
                dest = f"os-virtual-desktop:/workspace/{relative_path.lstrip('/\\')}"
                subprocess.run(["docker", "cp", str(clean_path), dest], capture_output=True, timeout=5)
            except Exception:
                pass
        return True

    def read_file(self, relative_path: str, max_bytes: int = 256 * 1024) -> str:
        """Read text from a file inside the sandboxed workspace."""
        clean_path = (self.workspace_root / relative_path.lstrip("/\\")).resolve()
        if not str(clean_path).startswith(str(self.workspace_root)):
            raise SandboxViolationError(f"Path traversal attempt: {relative_path}")
        if not clean_path.exists() or not clean_path.is_file():
            raise FileNotFoundError(f"File '{relative_path}' not found in workspace.")
        return clean_path.read_text(encoding="utf-8", errors="replace")[:max_bytes]

    def list_files(self, relative_path: str = "") -> List[Dict[str, Any]]:
        """List files and directories inside workspace."""
        target_dir = (self.workspace_root / relative_path.lstrip("/\\")).resolve()
        if not str(target_dir).startswith(str(self.workspace_root)):
            target_dir = self.workspace_root
        if not target_dir.exists():
            return []
        entries = []
        for item in sorted(target_dir.iterdir()):
            entries.append({
                "name": item.name,
                "dir": item.is_dir(),
                "size": item.stat().st_size if item.is_file() else 0,
            })
        return entries


_GLOBAL_WORKSPACE_SANDBOX: Optional[WorkspaceSandboxManager] = None


def get_workspace_sandbox() -> WorkspaceSandboxManager:
    """Retrieve or initialize global WorkspaceSandboxManager."""
    global _GLOBAL_WORKSPACE_SANDBOX
    if _GLOBAL_WORKSPACE_SANDBOX is None:
        _GLOBAL_WORKSPACE_SANDBOX = WorkspaceSandboxManager()
    return _GLOBAL_WORKSPACE_SANDBOX
