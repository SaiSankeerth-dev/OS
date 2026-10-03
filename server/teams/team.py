"""Team: plan -> spawn workers -> verify -> synthesize.

The supervisor drives a Team through its lifecycle stages; the Team
itself only knows planning, parallel execution with budgets, rule-based
verification, and synthesis.
"""
from __future__ import annotations

import asyncio
import json
import logging
import re
from dataclasses import dataclass, field

from ..supervisor.agent import SupervisorAgent
from .worker import WorkerAgent


log = logging.getLogger("os.teams")

MAX_WORKERS = 4
WORKER_TIMEOUT_SEC = 90.0

_STOPWORDS = frozenset(
    "the a an and or of to in on for with is are was were be as at by "
    "it its this that these those i you we they he she".split()
)


@dataclass
class TeamResult:
    status: str  # "ok" | "partial" | "failed" | "cancelled"
    text: str = ""
    subtasks: list[str] = field(default_factory=list)
    verified: int = 0
    dropped: int = 0
    run_id: str = ""


class Team:
    def __init__(
        self,
        agent: SupervisorAgent | None = None,
        max_workers: int = MAX_WORKERS,
        worker_timeout: float = WORKER_TIMEOUT_SEC,
        worker_model=None,
        worker_factory=None,
    ) -> None:
        self.agent = agent or SupervisorAgent()
        self.max_workers = max_workers
        self.worker_timeout = worker_timeout
        self._worker_model = worker_model  # TestModel in tests
        # worker_factory(subtask) -> object with async run() -> str.
        # Test seam: lets tests inject deterministic stub workers.
        self._worker_factory = worker_factory
        self._cancel = asyncio.Event()

    def cancel(self) -> None:
        """STOP/CANCEL: no new work starts; pending workers are dropped."""
        self._cancel.set()

    # ---------- plan ---------------------------------------------------

    async def plan(self, goal: str) -> list[str]:
        """Split a goal into independent sub-tasks. Never raises."""
        if self.agent._model_reachable():
            try:
                from pydantic_ai import Agent

                model = self.agent._model or self.agent._build_model()
                planner = Agent(
                    model,
                    system_prompt=(
                        "You split goals into small independent sub-tasks. "
                        "Return ONLY a JSON array of strings."
                    ),
                )
                result = await asyncio.wait_for(
                    planner.run(
                        f"Goal: {goal}\n\nSplit into 2-4 independent "
                        "sub-tasks. JSON array only:"
                    ),
                    timeout=30.0,
                )
                tasks = json.loads(result.output.strip())
                tasks = [t.strip() for t in tasks if str(t).strip()]
                if tasks:
                    return tasks[: self.max_workers]
            except Exception as e:  # noqa: BLE001
                log.debug("team plan fell back: %s", e)
        # Fallback: the goal is its own single sub-task.
        return [goal.strip()]

    # ---------- execute -------------------------------------------------

    async def execute(self, subtasks: list[str]) -> list[str]:
        """Run workers in parallel within budget. Never raises."""
        subtasks = subtasks[: self.max_workers]
        results: list[str] = []

        async def _one(subtask: str) -> str | None:
            if self._cancel.is_set():
                return None
            if self._worker_factory is not None:
                worker = self._worker_factory(subtask)
            else:
                worker = WorkerAgent(
                    subtask,
                    model=self._worker_model,
                    base_url=self.agent._base_url,
                    model_name=self.agent._model_name,
                )
            try:
                return await asyncio.wait_for(
                    worker.run(), timeout=self.worker_timeout
                )
            except asyncio.TimeoutError:
                log.debug("worker timed out: %s", subtask[:60])
                return None
            except Exception as e:  # noqa: BLE001
                log.debug("worker error: %s", e)
                return None

        gathered = await asyncio.gather(*(_one(s) for s in subtasks))
        for subtask, out in zip(subtasks, gathered):
            if out:
                results.append(out)
            else:
                results.append(f"[no result: {subtask[:60]}]")
        return results

    # ---------- verify ---------------------------------------------------

    @staticmethod
    def _significant_words(text: str) -> set[str]:
        return {
            w
            for w in re.findall(r"[a-z]{3,}", text.lower())
            if w not in _STOPWORDS
        }

    def verify(self, subtask: str, result: str) -> bool:
        """Independent check: non-empty and on-topic. Deterministic."""
        if not result or result.startswith("[no result"):
            return False
        if result.startswith("[worker fallback"):
            return False
        overlap = self._significant_words(subtask) & self._significant_words(
            result
        )
        return bool(overlap)

    # ---------- synthesize ----------------------------------------------

    async def synthesize(self, goal: str, verified: list[tuple[str, str]]) -> str:
        """Merge verified worker outputs into one answer. Never raises."""
        if not verified:
            return "I couldn't complete that task - no verified results."
        if len(verified) == 1:
            return verified[0][1]
        if self.agent._model_reachable():
            try:
                from pydantic_ai import Agent

                model = self.agent._model or self.agent._build_model()
                synth = Agent(
                    model,
                    system_prompt=(
                        "You merge worker outputs into one coherent answer. "
                        "Be concise. Plain text only."
                    ),
                )
                parts = "\n\n".join(
                    f"[{i+1}] {text}" for i, (_, text) in enumerate(verified)
                )
                result = await asyncio.wait_for(
                    synth.run(
                        f"Goal: {goal}\n\nWorker outputs:\n{parts}\n\n"
                        "Merged answer:"
                    ),
                    timeout=30.0,
                )
                text = (result.output or "").strip()
                if text:
                    return text
            except Exception as e:  # noqa: BLE001
                log.debug("synthesize fell back: %s", e)
        return "\n\n".join(text for _, text in verified)

    # ---------- full run --------------------------------------------------

    async def run(self, goal: str) -> TeamResult:
        """Plan -> execute -> verify -> synthesize. Never raises."""
        if self._cancel.is_set():
            return TeamResult(status="cancelled", text="Task cancelled.")
        subtasks = await self.plan(goal)
        if self._cancel.is_set():
            return TeamResult(
                status="cancelled", text="Task cancelled.", subtasks=subtasks
            )
        outputs = await self.execute(subtasks)
        verified: list[tuple[str, str]] = []
        dropped = 0
        for subtask, out in zip(subtasks, outputs):
            if self.verify(subtask, out):
                verified.append((subtask, out))
            else:
                dropped += 1
        text = await self.synthesize(goal, verified)
        status = (
            "ok" if dropped == 0 else ("partial" if verified else "failed")
        )
        return TeamResult(
            status=status,
            text=text,
            subtasks=subtasks,
            verified=len(verified),
            dropped=dropped,
        )
