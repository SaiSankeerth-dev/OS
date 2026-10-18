"""Control-ownership state machine and action arbiter for OS Computer & Browser.

Manages interaction state:
- HUMAN_CONTROL (default: human interacts, AI cannot execute unsolicited actions)
- AI_WORKING (AI executes assigned task, displays AI cursor)
- AI_PAUSED (human takeover or manual pause; task state preserved)
- STOPPED (task cancelled, execution halted)
- BROWSER_DISCONNECTED (browser detached or crashed)

Enforces single action arbiter to prevent concurrent race conditions between
human and AI operations. Prioritizes human input: if human interacts during
AI_WORKING, the AI task is instantly paused and control transfers to human.
"""
from __future__ import annotations

import logging
import threading
import time
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Callable, Dict, List, Optional, Tuple

log = logging.getLogger("os.computer.arbiter")


class ControlState(str, Enum):
    HUMAN_CONTROL = "HUMAN_CONTROL"
    AI_WORKING = "AI_WORKING"
    AI_PAUSED = "AI_PAUSED"
    STOPPED = "STOPPED"
    BROWSER_DISCONNECTED = "BROWSER_DISCONNECTED"


@dataclass
class AICursorInfo:
    x: float = 0.0
    y: float = 0.0
    visible: bool = False
    status: str = "Idle"  # Reading page, Clicking, Typing, Waiting, Paused
    action: str = ""
    target_rect: Optional[Dict[str, float]] = None  # {x, y, width, height}
    timestamp: float = field(default_factory=time.time)


@dataclass
class AssignedTaskInfo:
    task_id: str
    goal: str
    allowed_domains: List[str] = field(default_factory=list)
    created_at: float = field(default_factory=time.time)
    started_at: Optional[float] = None
    status: str = "pending"  # pending, running, paused, stopped, completed, failed
    current_step: str = ""
    total_steps: int = 0
    completed_steps: int = 0


class SessionArbiter:
    """Manages ownership, arbitration, and AI cursor telemetry for a browser session."""

    def __init__(self, session_id: str) -> None:
        self.session_id = session_id
        self.state: ControlState = ControlState.HUMAN_CONTROL
        self.active_task: Optional[AssignedTaskInfo] = None
        self.ai_cursor: AICursorInfo = AICursorInfo()
        self.last_human_activity: float = time.time()
        self._listeners: List[Callable[[Dict[str, Any]], None]] = []
        self._cleanup_callbacks: List[Callable[[], None]] = []
        self._lock = threading.Lock()

    def register_cleanup_callback(self, cb: Callable[[], None]) -> None:
        """Register a callback (e.g. release held keys) invoked on human takeover, pause, or stop."""
        with self._lock:
            self._cleanup_callbacks.append(cb)

    def _invoke_cleanup(self) -> None:
        """Safely trigger registered cleanup actions."""
        for cb in list(self._cleanup_callbacks):
            try:
                cb()
            except Exception as e:
                log.warning("Arbiter cleanup callback warning: %s", e)

    def add_listener(self, listener: Callable[[Dict[str, Any]], None]) -> None:
        with self._lock:
            self._listeners.append(listener)

    def remove_listener(self, listener: Callable[[Dict[str, Any]], None]) -> None:
        with self._lock:
            if listener in self._listeners:
                self._listeners.remove(listener)

    def _broadcast(self, event_type: str, data: Dict[str, Any]) -> None:
        payload = {
            "type": event_type,
            "session_id": self.session_id,
            "timestamp": time.time(),
            **data,
        }
        for cb in list(self._listeners):
            try:
                cb(payload)
            except Exception as e:
                log.warning("Failed to dispatch arbiter event: %s", e)

    def get_status(self) -> Dict[str, Any]:
        with self._lock:
            return {
                "session_id": self.session_id,
                "state": self.state.value,
                "has_active_task": self.active_task is not None,
                "active_task": {
                    "task_id": self.active_task.task_id,
                    "goal": self.active_task.goal,
                    "status": self.active_task.status,
                    "current_step": self.active_task.current_step,
                    "completed_steps": self.active_task.completed_steps,
                    "total_steps": self.active_task.total_steps,
                } if self.active_task else None,
                "ai_cursor": {
                    "x": self.ai_cursor.x,
                    "y": self.ai_cursor.y,
                    "visible": self.ai_cursor.visible,
                    "status": self.ai_cursor.status,
                    "action": self.ai_cursor.action,
                    "target_rect": self.ai_cursor.target_rect,
                },
                "last_human_activity": self.last_human_activity,
            }

    def assign_task(self, task_id: str, goal: str, allowed_domains: Optional[List[str]] = None) -> AssignedTaskInfo:
        """Assign an explicit user goal. Does not start execution automatically."""
        with self._lock:
            task = AssignedTaskInfo(
                task_id=task_id,
                goal=goal,
                allowed_domains=allowed_domains or [],
                status="pending",
            )
            self.active_task = task
            log.info("Assigned task '%s' to session '%s': %s", task_id, self.session_id, goal)
        self._broadcast("task_assigned", {"task": task.__dict__})
        return task

    def start_task(self, task_id: str) -> bool:
        """Explicitly transition to AI_WORKING upon user 'Start' command."""
        with self._lock:
            if not self.active_task or self.active_task.task_id != task_id:
                log.warning("Cannot start: task '%s' not assigned to session '%s'", task_id, self.session_id)
                return False
            self.state = ControlState.AI_WORKING
            self.active_task.status = "running"
            self.active_task.started_at = time.time()
            self.ai_cursor.visible = True
            self.ai_cursor.status = "Starting task"
        self._broadcast("control_state_changed", {"state": ControlState.AI_WORKING.value, "reason": "User started task"})
        self._broadcast("ai_cursor_update", {"ai_cursor": self.ai_cursor.__dict__})
        return True

    def on_human_interaction(self, source: str = "mouse") -> Tuple[bool, Optional[str]]:
        """Intercept any human input. If AI was working, immediately pause it and transfer ownership."""
        paused_ai = False
        reason = None
        with self._lock:
            self.last_human_activity = time.time()
            if self.state == ControlState.AI_WORKING:
                self.state = ControlState.AI_PAUSED
                paused_ai = True
                if self.active_task:
                    self.active_task.status = "paused"
                self.ai_cursor.status = "Paused (Human in control)"
                reason = f"Human {source} interaction detected: AI paused, human took control."
                log.info(reason)

        if paused_ai:
            self._invoke_cleanup()
            self._broadcast("control_state_changed", {
                "state": ControlState.AI_PAUSED.value,
                "reason": reason,
                "human_takeover": True,
            })
            self._broadcast("ai_cursor_update", {"ai_cursor": self.ai_cursor.__dict__})

        return paused_ai, reason

    def can_ai_act(self) -> Tuple[bool, Optional[str]]:
        """Verify whether AI agent is currently authorized to perform computer/keyboard actions."""
        with self._lock:
            if self.state == ControlState.HUMAN_CONTROL:
                return False, "Human control is active; unsolicited AI actions are rejected."
            elif self.state == ControlState.AI_PAUSED:
                return False, "AI execution is paused (human takeover or manual pause)."
            elif self.state == ControlState.STOPPED:
                return False, "Task execution is stopped."
            elif self.state == ControlState.BROWSER_DISCONNECTED:
                return False, "Browser is disconnected."
            return True, None

    def take_human_control(self) -> None:
        """Explicit user request to assume full human control."""
        with self._lock:
            if self.state == ControlState.AI_WORKING and self.active_task:
                self.active_task.status = "paused"
            self.state = ControlState.HUMAN_CONTROL
            self.ai_cursor.visible = False
            self.ai_cursor.status = "Standby"
        self._invoke_cleanup()
        self._broadcast("control_state_changed", {
            "state": ControlState.HUMAN_CONTROL.value,
            "reason": "User explicitly assumed control",
        })

    def pause_ai(self, reason: str = "User paused AI") -> None:
        """Pause running AI execution while preserving task and browser state."""
        with self._lock:
            if self.state == ControlState.AI_WORKING:
                self.state = ControlState.AI_PAUSED
                if self.active_task:
                    self.active_task.status = "paused"
                self.ai_cursor.status = "Paused"
        self._invoke_cleanup()
        self._broadcast("control_state_changed", {
            "state": ControlState.AI_PAUSED.value,
            "reason": reason,
        })
        self._broadcast("ai_cursor_update", {"ai_cursor": self.ai_cursor.__dict__})

    def resume_ai(self) -> bool:
        """Resume execution of the active paused task after verifying state."""
        with self._lock:
            if not self.active_task or self.active_task.status != "paused":
                return False
            self.state = ControlState.AI_WORKING
            self.active_task.status = "running"
            self.ai_cursor.visible = True
            self.ai_cursor.status = "Resuming task"
        self._broadcast("control_state_changed", {
            "state": ControlState.AI_WORKING.value,
            "reason": "User resumed AI task",
        })
        self._broadcast("ai_cursor_update", {"ai_cursor": self.ai_cursor.__dict__})
        return True

    def stop_ai(self, reason: str = "User stopped task") -> None:
        """Halt AI execution, cancel pending actions, transition to STOPPED."""
        with self._lock:
            self.state = ControlState.STOPPED
            if self.active_task:
                self.active_task.status = "stopped"
            self.ai_cursor.visible = False
            self.ai_cursor.status = "Stopped"
        self._invoke_cleanup()
        self._broadcast("control_state_changed", {
            "state": ControlState.STOPPED.value,
            "reason": reason,
        })
        self._broadcast("ai_cursor_update", {"ai_cursor": self.ai_cursor.__dict__})

    def update_ai_cursor(
        self,
        x: float,
        y: float,
        status: str,
        action: str = "",
        target_rect: Optional[Dict[str, float]] = None,
        visible: bool = True,
    ) -> None:
        """Update visual AI cursor telemetry from verified agent action."""
        with self._lock:
            self.ai_cursor.x = x
            self.ai_cursor.y = y
            self.ai_cursor.status = status
            self.ai_cursor.action = action
            self.ai_cursor.target_rect = target_rect
            self.ai_cursor.visible = visible
            self.ai_cursor.timestamp = time.time()
        self._broadcast("ai_cursor_update", {"ai_cursor": self.ai_cursor.__dict__})

    def mark_disconnected(self) -> None:
        with self._lock:
            self.state = ControlState.BROWSER_DISCONNECTED
            if self.active_task and self.active_task.status == "running":
                self.active_task.status = "paused"
            self.ai_cursor.visible = False
        self._broadcast("control_state_changed", {
            "state": ControlState.BROWSER_DISCONNECTED.value,
            "reason": "Browser disconnected",
        })


class GlobalArbiterRegistry:
    """Registry of SessionArbiter instances across active browser sessions."""

    def __init__(self) -> None:
        self._arbiters: Dict[str, SessionArbiter] = {}
        self._lock = threading.Lock()

    def get_or_create(self, session_id: str) -> SessionArbiter:
        with self._lock:
            if session_id not in self._arbiters:
                self._arbiters[session_id] = SessionArbiter(session_id)
            return self._arbiters[session_id]

    def remove(self, session_id: str) -> None:
        with self._lock:
            if session_id in self._arbiters:
                self._arbiters[session_id].mark_disconnected()
                del self._arbiters[session_id]


_GLOBAL_ARBITER_REGISTRY: Optional[GlobalArbiterRegistry] = None


def get_arbiter_registry() -> GlobalArbiterRegistry:
    global _GLOBAL_ARBITER_REGISTRY
    if _GLOBAL_ARBITER_REGISTRY is None:
        _GLOBAL_ARBITER_REGISTRY = GlobalArbiterRegistry()
    return _GLOBAL_ARBITER_REGISTRY
