"""WorkerAgent: one isolated worker in a team.

A worker is a Pydantic AI agent with a narrow system prompt: complete
exactly one sub-task, concisely. Workers get NO tools - they cannot
call the registry, the shell, or anything else. If a sub-task needs a
tool, the supervisor runs it through the safety pipeline instead.

Best-effort: falls back to a rule-based stub result when the model is
unreachable, so team mechanics stay testable without Ollama.
"""
from __future__ import annotations

import asyncio
import logging

from ..supervisor.agent import SupervisorAgent


log = logging.getLogger("os.teams")

_WORKER_TIMEOUT_SEC = 90.0


class WorkerAgent(SupervisorAgent):
    """Pydantic AI worker: narrow prompt, no tools, one sub-task."""

    def __init__(self, subtask: str, **kw) -> None:
        super().__init__(**kw)
        self.subtask = subtask

    def _worker(self):
        from pydantic_ai import Agent

        model = self._model or self._build_model()
        return Agent(
            model,
            system_prompt=(
                "You are a focused worker agent inside OS, a local voice "
                "assistant. You have no tools. Complete ONLY the sub-task "
                "below, concisely, in plain text. Do not invent new tasks."
            ),
        )

    async def run(self) -> str:
        """Run the sub-task. Returns result text, never raises."""
        if not self._model_reachable():
            return self._fallback()
        try:
            result = await asyncio.wait_for(
                self._worker().run(f"Sub-task: {self.subtask}"),
                timeout=_WORKER_TIMEOUT_SEC,
            )
            text = (result.output or "").strip()
            return text if text else self._fallback()
        except Exception as e:  # noqa: BLE001
            log.debug("worker fell back: %s", e)
            return self._fallback()

    def _fallback(self) -> str:
        return f"[worker fallback: no model available for: {self.subtask}]"
