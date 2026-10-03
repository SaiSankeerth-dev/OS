"""gstack Adapter for OS.

gstack is a skill/workflow package (NOT the main agent) that OS invokes
for structured software-engineering workflows:
  - /plan-eng-review  — Architecture + test plans
  - /review           — Code review
  - /qa               — Browser QA
  - /cso              — Security audit
  - /ship             — Deployment
  - /retro            — Velocity metrics
  - /office-hours     — Product strategy

Architecture:
  OS → Skill Resolver → GstackAdapter → gstack CLI (Bun subprocess)
                                        ↓
                       SPAWNED_SESSION="true" (headless, no prompts)

Requirements:
  - Bun v1.0+ installed
  - gstack cloned to a skills directory
  - git installed
"""
from __future__ import annotations

import json
import logging
import os
import shutil
import subprocess
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

log = logging.getLogger("os.adapters.gstack")


# ---------------------------------------------------------------------------
# Data
# ---------------------------------------------------------------------------

@dataclass
class GstackResult:
    """Result from a gstack skill invocation."""
    skill: str
    status: str  # SUCCEEDED, FAILED, NOT_INSTALLED
    output: str = ""
    details: dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


# ---------------------------------------------------------------------------
# Available gstack skills
# ---------------------------------------------------------------------------

GSTACK_SKILLS: dict[str, dict[str, str]] = {
    "plan": {
        "command": "/plan-ceo-review",
        "description": "Scope and prioritize work",
    },
    "plan_eng": {
        "command": "/plan-eng-review",
        "description": "Architecture review + test plans",
    },
    "review": {
        "command": "/review",
        "description": "Code review",
    },
    "qa": {
        "command": "/qa",
        "description": "Browser QA testing",
    },
    "security": {
        "command": "/cso",
        "description": "Security audit",
    },
    "ship": {
        "command": "/ship",
        "description": "Deployment workflow",
    },
    "retro": {
        "command": "/retro",
        "description": "Velocity metrics and retrospective",
    },
    "docs": {
        "command": "/docs",
        "description": "Documentation generation",
    },
    "office_hours": {
        "command": "/office-hours",
        "description": "Product strategy session",
    },
    "debug": {
        "command": "/debug",
        "description": "Debugging workflow",
    },
}


# ---------------------------------------------------------------------------
# Adapter
# ---------------------------------------------------------------------------

class GstackAdapter:
    """OS adapter for gstack skill workflows.

    gstack is invoked as a subprocess using Bun in headless mode
    (SPAWNED_SESSION="true"). OS remains the orchestrator — gstack
    is just a skill package, not the main agent.
    """

    def __init__(
        self,
        *,
        gstack_dir: Optional[str] = None,
        workspace_dir: Optional[str] = None,
    ) -> None:
        self._gstack_dir = Path(gstack_dir) if gstack_dir else self._find_gstack()
        self._workspace_dir = workspace_dir
        self._available: Optional[bool] = None

    @staticmethod
    def _find_gstack() -> Path:
        """Try to locate gstack installation."""
        candidates = [
            Path.home() / ".os" / "skills" / "gstack",
            Path.home() / "gstack",
            Path("D:/OS/skills/gstack"),
            Path("skills/gstack"),
        ]
        for p in candidates:
            if (p / "SKILL.md").exists() or (p / "setup").exists():
                return p
        return Path.home() / ".os" / "skills" / "gstack"

    def is_available(self) -> bool:
        """Check if gstack is installed and Bun is available."""
        if self._available is None:
            has_bun = shutil.which("bun") is not None
            has_gstack = self._gstack_dir.exists() and (
                (self._gstack_dir / "SKILL.md").exists()
                or (self._gstack_dir / "setup").exists()
            )
            self._available = has_bun and has_gstack
            if not has_bun:
                log.warning("Bun not installed (required for gstack)")
            if not has_gstack:
                log.info("gstack not found at %s", self._gstack_dir)
        return self._available

    def list_skills(self) -> list[dict[str, str]]:
        """List available gstack skills."""
        return [
            {"name": name, **info}
            for name, info in GSTACK_SKILLS.items()
        ]

    def invoke_skill(
        self,
        skill_name: str,
        *,
        context: Optional[str] = None,
        workspace: Optional[str] = None,
        timeout: int = 120,
    ) -> GstackResult:
        """Invoke a gstack skill in headless mode.

        Args:
            skill_name: One of the GSTACK_SKILLS keys (e.g. "review", "qa")
            context: Additional context/instructions for the skill
            workspace: Working directory (defaults to self._workspace_dir)
            timeout: Max seconds to wait

        Returns:
            GstackResult with output and status.
        """
        if skill_name not in GSTACK_SKILLS:
            return GstackResult(
                skill=skill_name,
                status="FAILED",
                output=f"Unknown skill: {skill_name}. Available: {list(GSTACK_SKILLS.keys())}",
            )

        if not self.is_available():
            return GstackResult(
                skill=skill_name,
                status="NOT_INSTALLED",
                output="gstack or Bun not installed. Run setup first.",
            )

        skill_info = GSTACK_SKILLS[skill_name]
        cwd = workspace or self._workspace_dir or str(Path.cwd())

        # Build the command — gstack uses Bun to run skills
        env = os.environ.copy()
        env["SPAWNED_SESSION"] = "true"  # Headless mode — no interactive prompts

        cmd = [
            "bun", "run",
            str(self._gstack_dir / "index.ts"),
            skill_info["command"],
        ]
        if context:
            cmd.append(context)

        log.info("gstack invoking: %s in %s", skill_name, cwd)

        try:
            proc = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=timeout,
                cwd=cwd,
                env=env,
            )

            output = proc.stdout.strip()
            if proc.returncode == 0:
                return GstackResult(
                    skill=skill_name,
                    status="SUCCEEDED",
                    output=output,
                    details={
                        "command": skill_info["command"],
                        "returncode": 0,
                        "workspace": cwd,
                    },
                )
            else:
                return GstackResult(
                    skill=skill_name,
                    status="FAILED",
                    output=output or proc.stderr.strip(),
                    details={
                        "command": skill_info["command"],
                        "returncode": proc.returncode,
                        "stderr": proc.stderr.strip()[:500],
                    },
                )

        except subprocess.TimeoutExpired:
            return GstackResult(
                skill=skill_name,
                status="FAILED",
                output=f"Timed out after {timeout}s",
            )
        except FileNotFoundError:
            return GstackResult(
                skill=skill_name,
                status="FAILED",
                output="Bun binary not found",
            )
        except Exception as exc:
            return GstackResult(
                skill=skill_name,
                status="FAILED",
                output=f"{type(exc).__name__}: {exc}",
            )

    async def install(self) -> GstackResult:
        """Install gstack by cloning the repo and running setup."""
        target = self._gstack_dir
        if target.exists():
            return GstackResult(
                skill="install",
                status="SUCCEEDED",
                output=f"Already installed at {target}",
            )

        target.parent.mkdir(parents=True, exist_ok=True)
        try:
            subprocess.run(
                ["git", "clone", "--depth", "1",
                 "https://github.com/garrytan/gstack.git",
                 str(target)],
                check=True,
                capture_output=True,
                text=True,
                timeout=120,
            )
            # Run setup
            setup_script = target / "setup"
            if setup_script.exists():
                subprocess.run(
                    [str(setup_script)],
                    cwd=str(target),
                    capture_output=True,
                    text=True,
                    timeout=120,
                )
            self._available = None  # Reset cache
            return GstackResult(
                skill="install",
                status="SUCCEEDED",
                output=f"Installed gstack to {target}",
            )
        except Exception as exc:
            return GstackResult(
                skill="install",
                status="FAILED",
                output=f"Install failed: {exc}",
            )
