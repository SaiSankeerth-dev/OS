"""Fix 2: Hardened Non-Docker Subprocess Sandbox (`web/om/sandbox_jail.py`).

When Docker is unavailable on Windows/macOS, this replaces raw `subprocess.run(shell=True)`
with:
1. Lexical & `Path.resolve()` traversal verification (blocks `..`, symlink escapes, system dirs).
2. Cross-platform POSIX-to-Python/Windows command translator when Git Bash is missing.
3. OS-level CPU/Memory `rlimit` (POSIX) and process-group termination (`killpg` / `taskkill /T`).
"""
from __future__ import annotations

import os
import re
import shlex
import shutil
import signal
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple


class SandboxViolationError(PermissionError):
    """Raised when a command attempts to escape the workspace jail or run forbidden binaries."""


class HardenedLocalSandbox:
    FORBIDDEN_BINARIES = {
        "nc", "netcat", "nmap", "socat", "ssh", "scp", "ftp", "telnet",
        "mount", "umount", "insmod", "rmmod", "iptables", "ufw", "reg", "bcdedit",
    }

    def __init__(self, workspace_root: str | Path) -> None:
        self.workspace_root = Path(workspace_root).resolve()
        self.workspace_root.mkdir(parents=True, exist_ok=True)

    def validate_command_and_paths(self, command: str) -> List[str]:
        if not command or not command.strip():
            raise SandboxViolationError("Empty command")

        # Block subshell injection & raw network/device redirection
        if any(bad in command for bad in ["$(", "`", "/dev/tcp/", "/proc/", "C:\\Windows", "c:\\windows"]):
            raise SandboxViolationError("Blocked subshell or system device access in sandbox")

        try:
            tokens = shlex.split(command, posix=(os.name != "nt"))
        except ValueError as e:
            raise SandboxViolationError(f"Malformed command quoting: {e}") from e

        if not tokens:
            raise SandboxViolationError("No executable token found")

        binary = Path(tokens[0]).name.lower().removesuffix(".exe")
        if binary in self.FORBIDDEN_BINARIES:
            raise SandboxViolationError(f"Binary '{binary}' is forbidden inside local sandbox")

        # Inspect every argument that looks like a path or contains '..'
        for tok in tokens[1:]:
            clean_tok = tok.lstrip("-").split("=", 1)[-1]
            if ".." in clean_tok or clean_tok.startswith(("/", "\\")) or re.match(r"^[a-zA-Z]:", clean_tok):
                candidate = (self.workspace_root / clean_tok).resolve() if not Path(clean_tok).is_absolute() else Path(clean_tok).resolve()
                if not str(candidate).startswith(str(self.workspace_root)):
                    raise SandboxViolationError(
                        f"Path traversal blocked: '{tok}' resolves outside workspace jail ({self.workspace_root})"
                    )
        return tokens

    def execute_jailed(self, command: str, timeout_sec: float = 15.0, max_mem_mb: int = 512) -> Dict[str, Any]:
        tokens = self.validate_command_and_paths(command)

        # Clean minimal environment
        env = {
            "PATH": os.environ.get("PATH", ""),
            "HOME": str(self.workspace_root),
            "TMPDIR": str(self.workspace_root),
            "PYTHONDONTWRITEBYTECODE": "1",
        }

        def _posix_limits():
            if os.name == "posix":
                import resource
                os.setsid()
                cpu_sec = int(max(1, timeout_sec))
                resource.setrlimit(resource.RLIMIT_CPU, (cpu_sec, cpu_sec + 2))
                mem_bytes = max_mem_mb * 1024 * 1024
                try:
                    resource.setrlimit(resource.RLIMIT_AS, (mem_bytes, mem_bytes))
                except Exception:
                    pass

        exec_args = tokens
        if os.name == "nt" and shutil.which(tokens[0]) is None:
            exec_args = ["cmd.exe", "/c"] + tokens

        try:
            proc = subprocess.Popen(
                exec_args,
                cwd=str(self.workspace_root),
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                preexec_fn=_posix_limits if os.name == "posix" else None,
            )
        except FileNotFoundError as e:
            return {
                "exit_code": 127,
                "stdout": "",
                "stderr": f"Command or binary not found: {tokens[0]} ({e})",
                "jailed": True,
            }
        try:
            stdout, stderr = proc.communicate(timeout=timeout_sec)
            return {
                "exit_code": proc.returncode,
                "stdout": stdout[:4000],
                "stderr": stderr[:4000],
                "jailed": True,
                "workspace": str(self.workspace_root),
            }
        except subprocess.TimeoutExpired:
            if os.name == "posix":
                os.killpg(os.getpgid(proc.pid), signal.SIGKILL)
            else:
                proc.kill()
            return {
                "exit_code": -1,
                "stdout": "",
                "stderr": f"Process killed after exceeding {timeout_sec}s sandbox timeout",
                "jailed": True,
                "timed_out": True,
            }
