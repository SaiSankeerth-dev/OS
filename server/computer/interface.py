"""Unified Computer-Control Interface for OS.

Defines a common, typed contract that OS can use regardless of whether the
underlying execution backend is Browser Harness, Windows Harness,
Browser Use Desktop, E2B Virtual Sandbox, or Skyvern.
"""
from __future__ import annotations

import abc
import time
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional, Tuple


# -----------------------------------------------------------------------------
# Structured Exceptions
# -----------------------------------------------------------------------------
class ComputerControlError(Exception):
    """Base exception for all computer-control operations."""
    def __init__(self, message: str, backend: str = "unknown", details: Optional[Dict[str, Any]] = None):
        super().__init__(message)
        self.message = message
        self.backend = backend
        self.details = details or {}


class BackendUnavailableError(ComputerControlError):
    """Raised when the requested backend is not installed or failed health checks."""


class SessionNotFoundError(ComputerControlError):
    """Raised when an operation targets an invalid or closed session."""


class ActionTimeoutError(ComputerControlError):
    """Raised when a browser or desktop interaction exceeds its timeout budget."""


class SafetyGateTriggeredError(ComputerControlError):
    """Raised when an action attempts an unapproved high-risk mutation."""


# -----------------------------------------------------------------------------
# Data Models
# -----------------------------------------------------------------------------
class BackendCostKind(str, Enum):
    ZERO_LOCAL = "ZERO_LOCAL"
    PAID_CLOUD = "PAID_CLOUD"


@dataclass
class HealthStatus:
    ok: bool
    backend: str
    message: str = "Operational"
    details: Dict[str, Any] = field(default_factory=dict)
    timestamp: float = field(default_factory=time.time)


@dataclass
class BackendCapabilities:
    supports_browser: bool = False
    supports_desktop: bool = False
    supports_virtual_sandbox: bool = False
    supports_visual_clicks: bool = False
    supports_dom_locators: bool = False
    supports_file_download: bool = False
    supports_auth_profiles: bool = False
    cost_classification: BackendCostKind = BackendCostKind.ZERO_LOCAL
    max_concurrent_sessions: int = 1


@dataclass
class WindowInfo:
    window_id: str
    title: str
    process_name: str
    is_active: bool = False
    bounds: Optional[Tuple[int, int, int, int]] = None  # (left, top, width, height)


@dataclass
class TabInfo:
    tab_id: str
    title: str
    url: str
    is_active: bool = False


@dataclass
class ObservationResult:
    session_id: str
    backend: str
    url: Optional[str] = None
    title: Optional[str] = None
    text_content: Optional[str] = None
    dom_elements: Optional[List[Dict[str, Any]]] = None
    active_window: Optional[WindowInfo] = None
    screenshot_base64: Optional[str] = None
    timestamp: float = field(default_factory=time.time)


@dataclass
class ActionResult:
    success: bool
    action: str
    session_id: str
    backend: str
    details: Dict[str, Any] = field(default_factory=dict)
    observed_outcome: Optional[str] = None
    verified: bool = True
    error: Optional[str] = None
    duration_ms: float = 0.0


@dataclass
class SessionState:
    session_id: str
    backend_name: str
    status: str = "active"  # active, paused, closed, error
    current_url: Optional[str] = None
    active_tab_id: Optional[str] = None
    active_window_id: Optional[str] = None
    created_at: float = field(default_factory=time.time)
    updated_at: float = field(default_factory=time.time)
    metadata: Dict[str, Any] = field(default_factory=dict)
    runtime_identity: Dict[str, Any] = field(default_factory=dict)
    desktop_service_health: Dict[str, Any] = field(default_factory=dict)
    frame: Dict[str, Any] = field(default_factory=dict)
    input_availability: Dict[str, Any] = field(default_factory=dict)
    browser_session_id: Optional[str] = None
    terminal_workspace: Dict[str, Any] = field(default_factory=dict)
    interruption: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "session_id": self.session_id,
            "backend_name": self.backend_name,
            "status": self.status,
            "current_url": self.current_url,
            "active_tab_id": self.active_tab_id,
            "active_window_id": self.active_window_id,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "metadata": self.metadata,
            "runtime_identity": self.runtime_identity,
            "desktop_service_health": self.desktop_service_health,
            "frame": self.frame,
            "input_availability": self.input_availability,
            "browser_session_id": self.browser_session_id or self.session_id,
            "terminal_workspace": self.terminal_workspace,
            "interruption": self.interruption,
        }


# -----------------------------------------------------------------------------
# Unified Computer Control Interface
# -----------------------------------------------------------------------------
class ComputerControlInterface(abc.ABC):
    """Abstract contract for OS computer-use backends."""

    name: str = "base"

    @abc.abstractmethod
    def health_check(self) -> HealthStatus:
        """Verify runtime dependencies, executables, and operational readiness."""

    @abc.abstractmethod
    def get_capabilities(self) -> BackendCapabilities:
        """Return the capability flags and cost classification for this backend."""

    @abc.abstractmethod
    def start_session(self, config: Optional[Dict[str, Any]] = None) -> SessionState:
        """Initialize a new persistent or isolated session."""

    @abc.abstractmethod
    def attach_session(self, session_id: str) -> SessionState:
        """Attach to an existing active session."""

    @abc.abstractmethod
    def list_windows(self) -> List[WindowInfo]:
        """List visible application windows controllable by this backend."""

    @abc.abstractmethod
    def list_tabs(self, session_id: str) -> List[TabInfo]:
        """List open browser tabs in the given session."""

    @abc.abstractmethod
    def open_url(self, session_id: str, url: str) -> ActionResult:
        """Navigate to a target URL and verify navigation status."""

    @abc.abstractmethod
    def observe_screen(self, session_id: str) -> ObservationResult:
        """Capture screenshot and desktop window or browser state."""

    @abc.abstractmethod
    def inspect_page(self, session_id: str) -> ObservationResult:
        """Extract structured text, title, and interactive element map."""

    @abc.abstractmethod
    def click_element(self, session_id: str, target: Any) -> ActionResult:
        """Click a target identified by CSS selector, text label, coordinate, or element ID."""

    @abc.abstractmethod
    def type_text(self, session_id: str, text: str, target: Optional[Any] = None) -> ActionResult:
        """Type text into a target input or currently focused control."""

    @abc.abstractmethod
    def press_key(self, session_id: str, key: str) -> ActionResult:
        """Send a keyboard shortcut or keypress (e.g. 'Enter', 'Escape', 'Ctrl+S')."""

    def press_shortcut(self, session_id: str, shortcut: str) -> ActionResult:
        """Send a keyboard modifier combination like 'Ctrl+L', 'Ctrl+A'."""
        return self.press_key(session_id, shortcut)

    def key_down(self, session_id: str, key: str) -> ActionResult:
        """Hold a key down."""
        return ActionResult(
            success=False,
            action="key_down",
            session_id=session_id,
            backend=self.name,
            verified=False,
            error=f"key_down is not implemented by backend '{self.name}'",
        )

    def key_up(self, session_id: str, key: str) -> ActionResult:
        """Release a key."""
        return ActionResult(
            success=False,
            action="key_up",
            session_id=session_id,
            backend=self.name,
            verified=False,
            error=f"key_up is not implemented by backend '{self.name}'",
        )

    def release_all_keys(self, session_id: str) -> ActionResult:
        """Release all held keys to prevent stuck keys."""
        return ActionResult(success=True, action="release_all_keys", session_id=session_id, backend=self.name)

    @abc.abstractmethod
    def scroll(self, session_id: str, direction: str = "down", amount: int = 300) -> ActionResult:
        """Scroll the active view in a given direction."""

    @abc.abstractmethod
    def switch_tab(self, session_id: str, tab_id: str) -> ActionResult:
        """Switch active focus to a specific tab."""

    @abc.abstractmethod
    def take_screenshot(self, session_id: str) -> bytes:
        """Return raw PNG bytes of the current session view."""

    @abc.abstractmethod
    def download_file(self, session_id: str, url_or_action: str) -> str:
        """Trigger a download and return the local path of the saved file."""

    @abc.abstractmethod
    def get_session_state(self, session_id: str) -> SessionState:
        """Retrieve current session metadata and status."""

    @abc.abstractmethod
    def cancel_action(self, session_id: str) -> ActionResult:
        """Halt in-flight operations safely on the session."""

    @abc.abstractmethod
    def close_session(self, session_id: str) -> ActionResult:
        """Terminate the session and clean up all allocated resources."""
