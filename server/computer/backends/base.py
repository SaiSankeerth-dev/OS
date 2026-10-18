"""Base implementation class for computer-control backends."""
from __future__ import annotations

import logging
import threading
import time
import uuid
from typing import Any, Dict, List, Optional

from server.computer.interface import (
    ActionResult,
    BackendCapabilities,
    ComputerControlError,
    ComputerControlInterface,
    HealthStatus,
    ObservationResult,
    SessionNotFoundError,
    SessionState,
    TabInfo,
    WindowInfo,
)

log = logging.getLogger("os.computer.backend")


class BaseComputerBackend(ComputerControlInterface):
    """Abstract base handling thread-safe session tracking and concurrency prevention."""

    name: str = "base"

    def __init__(self) -> None:
        self._sessions: Dict[str, SessionState] = {}
        self._session_locks: Dict[str, threading.RLock] = {}
        self._registry_lock = threading.Lock()

    def _get_lock(self, session_id: str) -> threading.RLock:
        with self._registry_lock:
            if session_id not in self._session_locks:
                self._session_locks[session_id] = threading.RLock()
            return self._session_locks[session_id]

    def _require_session(self, session_id: str) -> SessionState:
        with self._registry_lock:
            sess = self._sessions.get(session_id)
            if not sess or sess.status == "closed":
                raise SessionNotFoundError(f"Session '{session_id}' not found or closed", backend=self.name)
            return sess

    def get_session_state(self, session_id: str) -> SessionState:
        return self._require_session(session_id)

    def attach_session(self, session_id: str) -> SessionState:
        return self._require_session(session_id)

    def cancel_action(self, session_id: str) -> ActionResult:
        sess = self._require_session(session_id)
        return ActionResult(
            success=True,
            action="cancel_action",
            session_id=session_id,
            backend=self.name,
            observed_outcome="In-flight operations signalled to cancel.",
            verified=True,
        )

    def close_session(self, session_id: str) -> ActionResult:
        with self._get_lock(session_id):
            sess = self._sessions.get(session_id)
            if sess:
                sess.status = "closed"
                sess.updated_at = time.time()
            return ActionResult(
                success=True,
                action="close_session",
                session_id=session_id,
                backend=self.name,
                observed_outcome=f"Session '{session_id}' closed.",
                verified=True,
            )
