"""Lifecycle tracker: the WATCH -> ... -> REMEMBER stage machine.

Every supervised tool run moves through lifecycle stages. Each
transition is appended to the StateStore event log (kind="lifecycle"),
so a run can be audited or rolled back later. The tracker is purely
observational - it never gates execution; the safety pipeline does.
"""
from __future__ import annotations

import enum
import json
import uuid


class LifecycleStage(str, enum.Enum):
    WATCH = "WATCH"
    NOTICE = "NOTICE"
    SUGGEST = "SUGGEST"
    WAIT = "WAIT"
    DRAFT = "DRAFT"
    SHOW = "SHOW"
    REVISE = "REVISE"
    APPROVE = "APPROVE"
    EXECUTE = "EXECUTE"
    VERIFY = "VERIFY"
    REMEMBER = "REMEMBER"


class LifecycleTracker:
    """Records stage transitions for supervised runs."""

    def __init__(self, state_store=None) -> None:
        self._store = state_store
        self._runs: dict[str, list[str]] = {}

    def new_run(self) -> str:
        run_id = uuid.uuid4().hex[:12]
        self._runs[run_id] = []
        return run_id

    def transition(
        self, run_id: str, stage: LifecycleStage, detail: str = ""
    ) -> None:
        stages = self._runs.setdefault(run_id, [])
        stages.append(stage.value)
        if self._store is not None:
            try:
                self._store.log_event(
                    kind="lifecycle",
                    source="supervisor",
                    data=json.dumps(
                        {"run_id": run_id, "stage": stage.value, "detail": detail}
                    ),
                )
            except Exception:
                pass  # tracking must never break execution

    def stages_for(self, run_id: str) -> list[str]:
        return list(self._runs.get(run_id, []))
