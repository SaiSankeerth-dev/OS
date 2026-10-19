"""Agentic computer: natural-language desktop tasks via cua-agent.

This wraps cua-agent (20k stars, MIT) to let OS perform desktop tasks
from plain language like "open calculator" or "take a screenshot".

Design:
- Uses Ollama (local, free) via the OMNI loop - no API keys, no cost.
- Every step is reported via callback so the chat shows progress.
- Falls back honestly when no display is available (headless).
- Deterministic shortcuts for common tasks (no LLM needed).

The agent runs in a thread to avoid blocking the async event loop.
"""
from __future__ import annotations

import logging
import os
import shutil
import subprocess
import threading
from dataclasses import dataclass, field
from typing import Callable

log = logging.getLogger(__name__)

_AGENTIC_AVAILABLE: bool | None = None


def _check_available() -> bool:
    global _AGENTIC_AVAILABLE
    if _AGENTIC_AVAILABLE is None:
        try:
            import cua_agent  # noqa: F401
            _AGENTIC_AVAILABLE = True
        except ImportError:
            _AGENTIC_AVAILABLE = False
    return _AGENTIC_AVAILABLE


def has_display() -> bool:
    """True if a graphical display is available for computer-use."""
    return bool(os.environ.get("DISPLAY") or os.environ.get("WAYLAND_DISPLAY"))


@dataclass
class ComputerStep:
    """One step the agent took, for progress reporting."""
    n: int
    action: str
    detail: str = ""


@dataclass
class ComputerResult:
    """Final result of an agentic computer task."""
    success: bool
    summary: str
    steps: list[ComputerStep] = field(default_factory=list)
    error: str = ""


# Deterministic computer actions: no LLM, instant, free.
# Each maps a task pattern to a shell command.
DETERMINISTIC_ACTIONS = {
    "screenshot": {
        "command": ["gnome-screenshot", "-f"],
        "fallbacks": [["scrot"], ["import", "-window", "root"]],
        "description": "Take a screenshot",
    },
    "lock": {
        "command": ["loginctl", "lock-session"],
        "fallbacks": [["gnome-screensaver-command", "-l"]],
        "description": "Lock the screen",
    },
    "volume_up": {
        "command": ["pactl", "set-sink-volume", "@DEFAULT_SINK@", "+5%"],
        "fallbacks": [["amixer", "set", "Master", "5%+"]],
        "description": "Volume up",
    },
    "volume_down": {
        "command": ["pactl", "set-sink-volume", "@DEFAULT_SINK@", "-5%"],
        "fallbacks": [["amixer", "set", "Master", "5%-"]],
        "description": "Volume down",
    },
    "mute": {
        "command": ["pactl", "set-sink-mute", "@DEFAULT_SINK@", "toggle"],
        "fallbacks": [["amixer", "set", "Master", "toggle"]],
        "description": "Toggle mute",
    },
}


def try_deterministic(task: str) -> ComputerResult | None:
    """Try a deterministic action. Returns None if no match."""
    import re
    t = task.strip().lower()

    # "take a screenshot" / "screenshot"
    if re.match(r"^(take\s+a\s+)?screenshot$", t):
        return _run_deterministic("screenshot", "/tmp/os_screenshot.png")

    # "lock screen" / "lock"
    if re.match(r"^lock(\s+(the\s+)?screen)?$", t):
        return _run_deterministic("lock")

    # "volume up" / "turn it up"
    if re.match(r"^(volume\s+up|turn\s+(it\s+)?up)$", t):
        return _run_deterministic("volume_up")

    # "volume down" / "turn it down"
    if re.match(r"^(volume\s+down|turn\s+(it\s+)?down)$", t):
        return _run_deterministic("volume_down")

    # "mute" / "unmute"
    if re.match(r"^(un)?mute$", t):
        return _run_deterministic("mute")

    return None


def _run_deterministic(action: str, output_file: str = "") -> ComputerResult:
    """Run a deterministic action with fallbacks."""
    spec = DETERMINISTIC_ACTIONS[action]
    commands = [spec["command"]] + spec["fallbacks"]

    for cmd in commands:
        if not shutil.which(cmd[0]):
            continue
        try:
            full_cmd = cmd + ([output_file] if output_file and cmd[0] in ("gnome-screenshot", "scrot", "import") else [])
            result = subprocess.run(
                full_cmd, capture_output=True, timeout=10, text=True
            )
            if result.returncode == 0:
                msg = spec["description"]
                if output_file:
                    msg += f" → {output_file}"
                return ComputerResult(
                    success=True, summary=msg,
                    steps=[ComputerStep(n=1, action=action, detail=" ".join(cmd))],
                )
        except Exception as e:
            log.warning("Deterministic %s failed: %s", action, e)
            continue

    return ComputerResult(
        success=False,
        summary=f"Could not {spec['description'].lower()}: no supported tool found.",
        error="no_tool",
    )


class AgenticComputer:
    """Runs natural-language desktop tasks using cua-agent + local Ollama."""

    def __init__(
        self,
        model: str = "qwen3:8b",
        on_step: Callable[[ComputerStep], None] | None = None,
    ):
        self.model = model
        self.on_step = on_step
        self._stop_requested = threading.Event()

    def run(self, task: str, max_steps: int = 20) -> ComputerResult:
        """Run a computer task. Tries deterministic first, then cua-agent."""
        # Fast path: deterministic actions (no LLM, instant, free)
        det = try_deterministic(task)
        if det is not None:
            return det

        # Check prerequisites for the full agent
        if not _check_available():
            return ComputerResult(
                success=False, summary="",
                error="cua-agent is not installed. Run: pip install 'cua-agent[omni]'",
            )
        if not has_display():
            return ComputerResult(
                success=False,
                summary="No display available. Computer-use needs a graphical "
                        "desktop. This works on your laptop, not on a headless server.",
                error="no_display",
            )

        # Clear proxy vars (same quirk as browser-use)
        for var in ("HTTP_PROXY", "HTTPS_PROXY", "http_proxy", "https_proxy",
                    "ALL_PROXY", "all_proxy", "NO_PROXY", "no_proxy"):
            os.environ.pop(var, None)

        # Full agent path: cua-agent with Ollama via OpenAI-compatible API
        try:
            from cua_agent import ComputerAgent
            # Note: cua-agent 0.9.0 uses model strings; Ollama via api_base
            agent = ComputerAgent(
                model=f"ollama/{self.model}",
                api_base="http://localhost:11434/v1",
                api_key="ollama",  # Ollama doesn't need a real key
                telemetry_enabled=False,
            )
        except Exception as e:
            return ComputerResult(
                success=False, summary="",
                error=f"Failed to init computer agent: {type(e).__name__}: {e}",
            )

        steps: list[ComputerStep] = []
        step_n = [0]

        # TODO: wire step callbacks when cua-agent exposes them
        # For now, run and capture the result

        try:
            # cua-agent runs async; run in a new event loop in this thread
            import asyncio
            result = asyncio.run(self._run_agent(agent, task, max_steps, steps))
        except Exception as e:
            log.exception("Agentic computer run failed")
            return ComputerResult(
                success=False, steps=steps,
                summary=f"Task failed after {len(steps)} steps.",
                error=f"{type(e).__name__}: {e}",
            )

        return ComputerResult(
            success=True, steps=steps,
            summary=result or f"Completed in {len(steps)} steps.",
        )

    async def _run_agent(self, agent, task: str, max_steps: int, steps: list) -> str:
        """Run the agent and collect results."""
        final = ""
        async for result in agent.run(task):
            # result is an AgentResponse; extract text
            step_n = len(steps) + 1
            text = str(result)[:200]
            steps.append(ComputerStep(n=step_n, action="agent_step", detail=text))
            if self.on_step:
                self.on_step(steps[-1])
            if self._stop_requested.is_set():
                break
            # Try to get final answer
            if hasattr(result, "output_text"):
                final = result.output_text
            elif hasattr(result, "content"):
                final = str(result.content)
        return final

    def stop(self) -> None:
        self._stop_requested.set()
