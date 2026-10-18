"""Executable Scope Guard for Agent Skills, Tool Invocations, and Sandbox Commands.

Enforces:
1. Tool permission scope against declared skill manifests.
2. Filesystem path jail (prevents directory traversal and writes outside allowed workspace).
3. Risky command pattern detection (blocks curl|bash, privilege escalation, destructive deletion, credential dumping).
4. Network domain boundaries.
"""
from __future__ import annotations

import os
import re
from pathlib import Path, PurePath
from typing import Any, Dict, List, Optional, Set


class ScopeViolationError(PermissionError):
    """Raised when an agent or tool violates declared permission boundaries."""
    pass


class ScopeGuard:
    # Dangerous patterns in command line invocations
    DANGEROUS_COMMAND_PATTERNS = [
        re.compile(r"curl\s+.*\|\s*(?:ba)?sh", re.IGNORECASE),
        re.compile(r"wget\s+.*\|\s*(?:ba)?sh", re.IGNORECASE),
        re.compile(r"curl\s+.*\|\s*python", re.IGNORECASE),
        re.compile(r"rm\s+-rf\s+/(?:\s|$)", re.IGNORECASE),
        re.compile(r"rm\s+-rf\s+~(?:\s|$)", re.IGNORECASE),
        re.compile(r"del\s+/[sfq]\s+c:\\", re.IGNORECASE),
        re.compile(r"format\s+[a-z]:", re.IGNORECASE),
        re.compile(r":\(\)\s*\{\s*:\s*\|\s*:\s*&\s*\}\s*;", re.IGNORECASE),  # forkbomb
        re.compile(r"\.ssh[/\\]id_rsa", re.IGNORECASE),
        re.compile(r"cat\s+.*(?:id_rsa|id_ed25519|\.env|credentials)", re.IGNORECASE),
        re.compile(r"printenv\s+.*(?:token|secret|key|pwd|password)", re.IGNORECASE),
        re.compile(r"(?:nc|netcat|ncat)\s+-e", re.IGNORECASE),  # reverse shell
    ]

    def __init__(
        self,
        skill_name: str,
        allowed_tools: Optional[Set[str]] = None,
        allowed_read_paths: Optional[List[str | Path]] = None,
        allowed_write_paths: Optional[List[str | Path]] = None,
        allowed_domains: Optional[List[str]] = None,
        allow_network: bool = True,
        allow_shell: bool = False,
    ) -> None:
        self.skill_name = skill_name
        self.allowed_tools = allowed_tools or set()
        self.allowed_read_paths = [Path(p).resolve() for p in (allowed_read_paths or [])]
        self.allowed_write_paths = [Path(p).resolve() for p in (allowed_write_paths or [])]
        self.allowed_domains = [d.lower().strip() for d in (allowed_domains or [])]
        self.allow_network = allow_network
        self.allow_shell = allow_shell

    def check_tool(self, tool_name: str) -> None:
        """Verify if a tool is permitted for this skill."""
        if self.allowed_tools and tool_name not in self.allowed_tools:
            raise ScopeViolationError(
                f"Skill '{self.skill_name}' is not authorized to invoke tool '{tool_name}'. "
                f"Allowed tools: {sorted(list(self.allowed_tools))}"
            )

    def check_read_path(self, target_path: str | Path) -> Path:
        """Verify if path is within allowed read paths."""
        try:
            resolved = Path(target_path).resolve()
        except Exception as e:
            raise ScopeViolationError(f"Malformed path '{target_path}': {e}")

        # Check for null bytes or relative escapes
        if "\x00" in str(target_path):
            raise ScopeViolationError("Null byte in path is strictly forbidden.")

        if not self.allowed_read_paths:
            return resolved

        for allowed in self.allowed_read_paths:
            try:
                resolved.relative_to(allowed)
                return resolved
            except ValueError:
                continue

        raise ScopeViolationError(
            f"Read access denied to '{resolved}'. Path is outside allowed read scope for '{self.skill_name}'."
        )

    def check_write_path(self, target_path: str | Path) -> Path:
        """Verify if path is within allowed write paths (jailed)."""
        if "\x00" in str(target_path):
            raise ScopeViolationError("Null byte in path is strictly forbidden.")

        try:
            resolved = Path(target_path).resolve()
        except Exception as e:
            raise ScopeViolationError(f"Malformed write path '{target_path}': {e}")

        if not self.allowed_write_paths:
            raise ScopeViolationError(f"Skill '{self.skill_name}' has no authorized write scope.")

        for allowed in self.allowed_write_paths:
            try:
                resolved.relative_to(allowed)
                return resolved
            except ValueError:
                continue

        raise ScopeViolationError(
            f"Write access denied to '{resolved}'. Path is outside allowed write boundaries."
        )

    def check_command(self, command: str) -> None:
        """Inspect command for dangerous execution patterns."""
        if not self.allow_shell:
            raise ScopeViolationError(
                f"Skill '{self.skill_name}' does not have host command execution permission."
            )

        cmd_clean = command.strip()
        for pattern in self.DANGEROUS_COMMAND_PATTERNS:
            if pattern.search(cmd_clean):
                raise ScopeViolationError(
                    f"Execution blocked: Command matches hazardous pattern: {pattern.pattern}"
                )

    def check_url(self, url: str) -> None:
        """Check if target network request is to an allowed domain."""
        if not self.allow_network:
            raise ScopeViolationError(f"Skill '{self.skill_name}' has network access disabled.")

        if not self.allowed_domains:
            return

        from urllib.parse import urlparse
        parsed = urlparse(url)
        hostname = (parsed.hostname or "").lower()

        for allowed in self.allowed_domains:
            if hostname == allowed or hostname.endswith("." + allowed):
                return

        raise ScopeViolationError(
            f"Network access to '{hostname}' is not in allowed domains: {self.allowed_domains}"
        )
