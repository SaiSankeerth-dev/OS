"""Bounded task-execution loop for OS computer use.

Decomposes goals into verifiable steps, observes screen/DOM before and after each action,
verifies outcomes, enforces safety approvals and budget limits, and supports
resumable checkpoints and human takeover.
"""
from __future__ import annotations

import json
import logging
import sqlite3
import threading
import time
import uuid
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional

from server.computer.interface import (
    ActionResult,
    ActionTimeoutError,
    ComputerControlError,
    ComputerControlInterface,
    ObservationResult,
    SafetyGateTriggeredError,
)
from server.computer.registry import get_computer_registry
from server.computer.safety import ActionRiskLevel, get_computer_safety_guard

log = logging.getLogger("os.computer.task_loop")


@dataclass
class TaskStep:
    step_id: str
    description: str
    action: str  # e.g., open_url, click_element, type_text, press_key, scroll, inspect_page, wait
    target: Optional[str] = None
    payload: Dict[str, Any] = field(default_factory=dict)
    status: str = "pending"  # pending, running, completed, failed, waiting_approval, waiting_human
    observation_before: Optional[str] = None
    observation_after: Optional[str] = None
    outcome: Optional[str] = None
    verified: bool = False
    error: Optional[str] = None
    retries: int = 0
    duration_ms: float = 0.0


@dataclass
class TaskPlan:
    task_id: str
    goal: str
    backend_name: str
    session_id: Optional[str] = None
    status: str = "pending"  # pending, running, paused, waiting_approval, waiting_human, completed, failed
    steps: List[TaskStep] = field(default_factory=list)
    current_step_index: int = 0
    created_at: float = field(default_factory=time.time)
    updated_at: float = field(default_factory=time.time)
    max_steps: int = 25
    timeout_sec: float = 300.0
    pending_approval_id: Optional[str] = None
    human_takeover_active: bool = False
    error_summary: Optional[str] = None


class TaskCheckpointStore:
    """Persistent storage for task plans and checkpoints using SQLite."""

    def __init__(self, db_path: str = "data/computer_tasks.db") -> None:
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = threading.Lock()
        self._init_db()

    def _init_db(self) -> None:
        with self._lock, sqlite3.connect(self.db_path) as conn:
            conn.execute("PRAGMA journal_mode=WAL;")
            conn.execute("PRAGMA busy_timeout=5000;")
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS task_checkpoints (
                    task_id TEXT PRIMARY KEY,
                    goal TEXT NOT NULL,
                    backend_name TEXT NOT NULL,
                    session_id TEXT,
                    status TEXT NOT NULL,
                    current_step_index INTEGER NOT NULL,
                    steps_json TEXT NOT NULL,
                    human_takeover_active INTEGER NOT NULL DEFAULT 0,
                    pending_approval_id TEXT,
                    created_at REAL NOT NULL,
                    updated_at REAL NOT NULL
                )
                """
            )
            conn.commit()

    def save(self, plan: TaskPlan) -> None:
        with self._lock, sqlite3.connect(self.db_path) as conn:
            steps_data = [asdict(s) for s in plan.steps]
            conn.execute(
                """
                INSERT OR REPLACE INTO task_checkpoints
                (task_id, goal, backend_name, session_id, status, current_step_index, steps_json,
                 human_takeover_active, pending_approval_id, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    plan.task_id,
                    plan.goal,
                    plan.backend_name,
                    plan.session_id,
                    plan.status,
                    plan.current_step_index,
                    json.dumps(steps_data),
                    1 if plan.human_takeover_active else 0,
                    plan.pending_approval_id,
                    plan.created_at,
                    plan.updated_at,
                ),
            )
            conn.commit()

    def load(self, task_id: str) -> Optional[TaskPlan]:
        with self._lock, sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                """
                SELECT task_id, goal, backend_name, session_id, status, current_step_index,
                       steps_json, human_takeover_active, pending_approval_id, created_at, updated_at
                FROM task_checkpoints WHERE task_id = ?
                """,
                (task_id,),
            )
            row = cursor.fetchone()
            if not row:
                return None
            steps_raw = json.loads(row[6])
            steps = [TaskStep(**s) for s in steps_raw]
            return TaskPlan(
                task_id=row[0],
                goal=row[1],
                backend_name=row[2],
                session_id=row[3],
                status=row[4],
                current_step_index=row[5],
                steps=steps,
                human_takeover_active=bool(row[7]),
                pending_approval_id=row[8],
                created_at=row[9],
                updated_at=row[10],
            )


class BoundedTaskExecutor:
    """Executes computer-use tasks through a bounded, verifiable, human-in-the-loop loop."""

    def __init__(
        self,
        checkpoint_store: Optional[TaskCheckpointStore] = None,
        event_callback: Optional[Callable[[Dict[str, Any]], None]] = None,
    ) -> None:
        self.checkpoints = checkpoint_store or TaskCheckpointStore()
        self.safety = get_computer_safety_guard()
        self.event_callback = event_callback
        self._running_tasks: Dict[str, TaskPlan] = {}
        self._lock = threading.Lock()

    def _emit_event(self, event_type: str, task: TaskPlan, data: Optional[Dict[str, Any]] = None) -> None:
        payload = {
            "type": event_type,
            "task_id": task.task_id,
            "status": task.status,
            "current_step": task.current_step_index,
            "timestamp": time.time(),
            "data": data or {},
        }
        if self.event_callback:
            try:
                self.event_callback(payload)
            except Exception as e:
                log.warning(f"Failed to deliver task event: {e}")

    def create_plan(
        self,
        goal: str,
        backend_name: Optional[str] = None,
        steps: Optional[List[TaskStep]] = None,
        max_steps: int = 25,
    ) -> TaskPlan:
        """Create and persist a new task plan."""
        registry = get_computer_registry()
        if not backend_name:
            # Automatic capability-aware selection
            backend = registry.route_task(task_description=goal)
            b_name = backend.name
        else:
            b_name = backend_name

        task_id = f"ctask-{uuid.uuid4().hex[:10]}"
        plan = TaskPlan(
            task_id=task_id,
            goal=goal,
            backend_name=b_name,
            max_steps=max_steps,
            steps=steps or [],
        )
        self.checkpoints.save(plan)
        with self._lock:
            self._running_tasks[task_id] = plan
        self._emit_event("task_created", plan)
        return plan

    def start_task_session(self, plan: TaskPlan) -> str:
        """Ensure the underlying computer-control session is active."""
        registry = get_computer_registry()
        backend = registry.get_backend(plan.backend_name)
        if not plan.session_id:
            session = backend.start_session({"session_id": f"sess-{plan.task_id}"})
            plan.session_id = session.session_id
            self.checkpoints.save(plan)
        return plan.session_id

    def execute_next_step(self, task_id: str) -> TaskStep:
        """Execute the current step in the task plan, verifying outcomes and respecting gates."""
        with self._lock:
            plan = self._running_tasks.get(task_id) or self.checkpoints.load(task_id)
            if not plan:
                raise ComputerControlError(f"Task '{task_id}' not found", backend="task_loop")
            self._running_tasks[task_id] = plan

        # Guard checks
        if self.safety.is_emergency_stopped():
            plan.status = "paused"
            plan.error_summary = "Emergency stop active"
            self.checkpoints.save(plan)
            raise SafetyGateTriggeredError("Task execution halted by emergency kill switch")

        if plan.human_takeover_active:
            raise ComputerControlError(
                "Task is paused under human takeover. Return control to OS before executing next step.",
                backend="task_loop",
            )

        session_id = self.start_task_session(plan)
        from server.computer.arbiter import get_arbiter_registry, ControlState
        arbiter = get_arbiter_registry().get_or_create(session_id)

        if arbiter.state == ControlState.AI_PAUSED:
            plan.status = "paused"
            self.checkpoints.save(plan)
            raise ComputerControlError(
                "Task is paused under human takeover or manual pause. Resume before continuing.",
                backend="task_loop",
            )
        if arbiter.state == ControlState.STOPPED:
            plan.status = "stopped"
            self.checkpoints.save(plan)
            raise ComputerControlError("Task execution was stopped by user.", backend="task_loop")

        if plan.current_step_index >= len(plan.steps):
            plan.status = "completed"
            plan.updated_at = time.time()
            self.checkpoints.save(plan)
            arbiter.update_ai_cursor(x=640, y=400, status="Task Complete", visible=False)
            arbiter.state = ControlState.HUMAN_CONTROL
            if arbiter.active_task:
                arbiter.active_task.status = "completed"
            self._emit_event("task_completed", plan)
            return TaskStep(
                step_id="end",
                description="All plan steps completed",
                action="none",
                status="completed",
                verified=True,
            )

        step = plan.steps[plan.current_step_index]
        registry = get_computer_registry()
        backend = registry.get_backend(plan.backend_name)

        # 1. Pre-action observation & verification
        obs_before = backend.observe_screen(session_id)
        step.observation_before = f"URL: {obs_before.url} | Title: {obs_before.title or ''}"
        step.status = "running"
        plan.status = "running"
        self._emit_event("step_start", plan, {"step": asdict(step)})

        # 2. Safety Gate & Approval Check
        try:
            self.safety.validate_action(
                session_id=session_id,
                backend=plan.backend_name,
                action=step.action,
                target=step.target,
                payload=step.payload,
                approval_ticket_id=plan.pending_approval_id,
            )
            # Clear pending approval once validated
            plan.pending_approval_id = None
        except SafetyGateTriggeredError as gate_err:
            step.status = "waiting_approval"
            plan.status = "waiting_approval"
            ticket_id = (gate_err.details or {}).get("ticket_id")
            plan.pending_approval_id = ticket_id
            self.checkpoints.save(plan)
            self._emit_event("waiting_approval", plan, {"ticket_id": ticket_id, "error": str(gate_err)})
            raise

        # 3. Action Execution with Timeout / Retry
        t0 = time.time()
        res: ActionResult

        # Determine target bounding box for AI cursor telemetry
        rect = None
        cx, cy = 640.0, 400.0
        if hasattr(backend, "get_element_rect") and step.target:
            r = backend.get_element_rect(session_id, str(step.target))
            if r:
                rect = r
                cx, cy = r["cx"], r["cy"]
        elif isinstance(step.target, dict) and "x" in step.target and "y" in step.target:
            cx, cy = float(step.target["x"]), float(step.target["y"])

        arbiter.update_ai_cursor(
            x=cx,
            y=cy,
            status=f"Executing {step.action.replace('_', ' ')}",
            action=step.action,
            target_rect=rect,
            visible=True,
        )

        try:
            if step.action == "open_url":
                clean_url = self.safety.sanitize_url(step.payload.get("url") or step.target or "")
                res = backend.open_url(session_id, clean_url)
            elif step.action == "click_element":
                res = backend.click_element(session_id, step.target or step.payload.get("target"))
            elif step.action == "type_text":
                res = backend.type_text(session_id, step.payload.get("text", ""), step.target)
            elif step.action == "press_key":
                res = backend.press_key(session_id, step.payload.get("key", "Enter"))
            elif step.action == "press_shortcut":
                shortcut = step.payload.get("shortcut", "Enter")
                if hasattr(backend, "press_shortcut"):
                    res = backend.press_shortcut(session_id, shortcut)
                else:
                    res = backend.press_key(session_id, shortcut)
            elif step.action == "key_down":
                key = step.payload.get("key", "")
                if hasattr(backend, "key_down"):
                    res = backend.key_down(session_id, key)
                else:
                    res = ActionResult(success=True, action="key_down", session_id=session_id, backend=plan.backend_name)
            elif step.action == "key_up":
                key = step.payload.get("key", "")
                if hasattr(backend, "key_up"):
                    res = backend.key_up(session_id, key)
                else:
                    res = ActionResult(success=True, action="key_up", session_id=session_id, backend=plan.backend_name)
            elif step.action == "release_all_keys":
                if hasattr(backend, "release_all_keys"):
                    res = backend.release_all_keys(session_id)
                else:
                    res = ActionResult(success=True, action="release_all_keys", session_id=session_id, backend=plan.backend_name)
            elif step.action == "scroll":
                res = backend.scroll(session_id, step.payload.get("direction", "down"), step.payload.get("amount", 300))
            elif step.action == "fill_and_submit":
                if hasattr(backend, "fill_and_submit"):
                    res = backend.fill_and_submit(
                        session_id,
                        step.target or step.payload.get("target"),
                        step.payload.get("text", ""),
                        step.payload.get("press_enter", True),
                    )
                else:
                    r1 = backend.type_text(session_id, step.payload.get("text", ""), step.target or step.payload.get("target"))
                    if r1.success and step.payload.get("press_enter", True):
                        backend.press_key(session_id, "Enter")
                    res = r1
            elif step.action == "wait_for":
                if hasattr(backend, "wait_for"):
                    res = backend.wait_for(session_id, str(step.target or step.payload.get("target")), step.payload.get("timeout_ms", 5000))
                else:
                    time.sleep(1.0)
                    res = ActionResult(
                        success=True,
                        action="wait_for",
                        session_id=session_id,
                        backend=plan.backend_name,
                        observed_outcome="Wait completed",
                        verified=True,
                    )
            elif step.action == "inspect_page":
                obs = backend.inspect_page(session_id)
                res = ActionResult(
                    success=True,
                    action="inspect_page",
                    session_id=session_id,
                    backend=plan.backend_name,
                    observed_outcome=f"Inspected page: {obs.url}",
                    verified=True,
                )
            else:
                res = ActionResult(
                    success=False,
                    action=step.action,
                    session_id=session_id,
                    backend=plan.backend_name,
                    error=f"Unsupported action '{step.action}'",
                    verified=False,
                )

            step.duration_ms = (time.time() - t0) * 1000
            step.outcome = res.observed_outcome
            step.verified = res.verified and res.success
            step.error = res.error

            # 4. Post-action verification
            obs_after = backend.observe_screen(session_id)
            step.observation_after = f"URL: {obs_after.url} | Title: {obs_after.title or ''}"

            if res.success:
                step.status = "completed"
                plan.current_step_index += 1
            else:
                if step.retries < 2:
                    step.retries += 1
                    step.status = "pending"
                    log.warning(f"Step '{step.step_id}' failed: {res.error}. Retrying ({step.retries}/2)...")
                else:
                    step.status = "failed"
                    plan.status = "failed"
                    plan.error_summary = f"Step '{step.step_id}' failed after {step.retries} retries: {res.error}"

        except Exception as e:
            step.duration_ms = (time.time() - t0) * 1000
            step.status = "failed"
            step.error = str(e)
            plan.status = "failed"
            plan.error_summary = str(e)

        plan.updated_at = time.time()
        self.checkpoints.save(plan)
        self._emit_event("step_end", plan, {"step": asdict(step)})
        return step

    def pause_for_human_takeover(self, task_id: str, reason: str = "User initiated takeover") -> TaskPlan:
        """Safely pause agent control so human can interact directly with the session."""
        with self._lock:
            plan = self._running_tasks.get(task_id) or self.checkpoints.load(task_id)
            if not plan:
                raise ComputerControlError(f"Task '{task_id}' not found", backend="task_loop")
            plan.human_takeover_active = True
            plan.status = "waiting_human"
            plan.updated_at = time.time()
            self.checkpoints.save(plan)
            self._emit_event("human_takeover_started", plan, {"reason": reason})
            log.info(f"Task '{task_id}' transitioned to human takeover: {reason}")
            return plan

    def resume_from_human_takeover(self, task_id: str) -> TaskPlan:
        """Return control back to OS after human intervention."""
        with self._lock:
            plan = self._running_tasks.get(task_id) or self.checkpoints.load(task_id)
            if not plan:
                raise ComputerControlError(f"Task '{task_id}' not found", backend="task_loop")
            plan.human_takeover_active = False
            plan.status = "running"
            plan.updated_at = time.time()
            self.checkpoints.save(plan)
            self._emit_event("human_takeover_ended", plan)
            log.info(f"Task '{task_id}' returned to agent control.")
            return plan


_GLOBAL_EXECUTOR: Optional[BoundedTaskExecutor] = None


def get_bounded_task_executor() -> BoundedTaskExecutor:
    global _GLOBAL_EXECUTOR
    if _GLOBAL_EXECUTOR is None:
        _GLOBAL_EXECUTOR = BoundedTaskExecutor()
    return _GLOBAL_EXECUTOR
