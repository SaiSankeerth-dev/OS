"""Browser Use Desktop Companion Integration for OS.

Provides discovery, process detection, and optional companion connection to the
Browser Use Desktop companion application without creating duplicate control loops
or conflicting browser profile sessions.
"""
from __future__ import annotations

import logging
import os
import shutil
import subprocess
import time
import uuid
from typing import Any, Dict, List, Optional

from server.computer.backends.base import BaseComputerBackend
from server.computer.interface import (
    ActionResult,
    BackendCapabilities,
    BackendCostKind,
    ComputerControlError,
    HealthStatus,
    ObservationResult,
    SessionNotFoundError,
    SessionState,
    TabInfo,
    WindowInfo,
)

log = logging.getLogger("os.computer.browser_use_desktop")


class BrowserUseDesktopCompanion(BaseComputerBackend):
    """Companion connector for Browser Use Desktop application."""

    name: str = "browser_use_desktop"

    DEFAULT_COMPANION_PORTS = [5000, 8000, 9222]
    PROCESS_NAMES = ["browser-use-desktop.exe", "browser-use.exe", "browseruse.exe", "electron.exe"]

    def __init__(self, companion_endpoint: Optional[str] = None, binary_path: Optional[str] = None) -> None:
        super().__init__()
        self.companion_endpoint = companion_endpoint or os.environ.get("BROWSER_USE_DESKTOP_URL", "http://127.0.0.1:5000")
        self.binary_path = binary_path or os.environ.get("BROWSER_USE_DESKTOP_PATH")
        self._detected_pid: Optional[int] = None

    def is_running(self) -> bool:
        """Check if Browser Use Desktop process is running locally."""
        if os.name != "nt":
            return False
        try:
            cmd = "Get-Process | Where-Object { $_.ProcessName -match 'browser.*use' } | Select-Object -ExpandProperty Id"
            proc = subprocess.run(["powershell", "-NoProfile", "-Command", cmd], capture_output=True, text=True, timeout=3)
            if proc.returncode == 0 and proc.stdout.strip():
                lines = [l.strip() for l in proc.stdout.strip().splitlines() if l.strip()]
                if lines:
                    self._detected_pid = int(lines[0])
                    return True
        except Exception:
            pass
        return False

    def health_check(self) -> HealthStatus:
        running = self.is_running()
        installed = bool(self.binary_path and os.path.exists(self.binary_path)) or (shutil.which("browser-use") is not None)

        if running:
            return HealthStatus(
                ok=True,
                backend=self.name,
                message="Browser Use Desktop companion process detected and active",
                details={"pid": self._detected_pid, "endpoint": self.companion_endpoint, "mode": "companion_active"},
            )
        elif installed:
            return HealthStatus(
                ok=True,
                backend=self.name,
                message="Browser Use Desktop is installed (currently dormant)",
                details={"binary": self.binary_path, "mode": "launcher_ready"},
            )
        else:
            return HealthStatus(
                ok=False,
                backend=self.name,
                message="Browser Use Desktop not running (optional companion)",
                details={"installed": False, "mode": "unconfigured_optional"},
            )

    def get_capabilities(self) -> BackendCapabilities:
        return BackendCapabilities(
            supports_browser=True,
            supports_desktop=True,
            supports_virtual_sandbox=False,
            supports_visual_clicks=True,
            supports_dom_locators=True,
            supports_file_download=True,
            supports_auth_profiles=True,
            cost_classification=BackendCostKind.ZERO_LOCAL,
            max_concurrent_sessions=1,
        )

    def launch_companion(self) -> ActionResult:
        """Controlled launcher to start Browser Use Desktop if installed."""
        if self.is_running():
            return ActionResult(
                success=True,
                action="launch_companion",
                session_id="companion",
                backend=self.name,
                observed_outcome=f"Companion already active (PID {self._detected_pid})",
                verified=True,
            )

        target = self.binary_path or shutil.which("browser-use")
        if not target or not os.path.exists(target):
            return ActionResult(
                success=False,
                action="launch_companion",
                session_id="companion",
                backend=self.name,
                error="Browser Use Desktop executable not found on host",
                observed_outcome="Cannot launch: missing binary",
                verified=False,
            )

        try:
            p = subprocess.Popen([target], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            self._detected_pid = p.pid
            return ActionResult(
                success=True,
                action="launch_companion",
                session_id="companion",
                backend=self.name,
                details={"pid": p.pid},
                observed_outcome=f"Launched Browser Use Desktop (PID {p.pid})",
                verified=True,
            )
        except Exception as e:
            return ActionResult(
                success=False,
                action="launch_companion",
                session_id="companion",
                backend=self.name,
                error=str(e),
                observed_outcome=f"Launch failed: {e}",
                verified=False,
            )

    def start_session(self, config: Optional[Dict[str, Any]] = None) -> SessionState:
        session_id = (config or {}).get("session_id") or uuid.uuid4().hex[:12]
        state = SessionState(
            session_id=session_id,
            backend_name=self.name,
            status="active" if self.is_running() else "dormant",
            metadata={"endpoint": self.companion_endpoint, "pid": self._detected_pid},
        )
        with self._registry_lock:
            self._sessions[session_id] = state
        return state

    def list_windows(self) -> List[WindowInfo]:
        if not self.is_running():
            return []
        return [
            WindowInfo(
                window_id=f"win_companion_{self._detected_pid}",
                title="Browser Use Desktop",
                process_name="browser-use.exe",
                is_active=True,
            )
        ]

    def list_tabs(self, session_id: str) -> List[TabInfo]:
        return []

    def open_url(self, session_id: str, url: str) -> ActionResult:
        # Route to companion HTTP API if available
        import httpx
        try:
            resp = httpx.post(f"{self.companion_endpoint}/api/navigate", json={"url": url}, timeout=5)
            if resp.status_code == 200:
                return ActionResult(
                    success=True,
                    action="open_url",
                    session_id=session_id,
                    backend=self.name,
                    observed_outcome=f"Companion navigated to '{url}'",
                    verified=True,
                )
        except Exception:
            pass

        return ActionResult(
            success=False,
            action="open_url",
            session_id=session_id,
            backend=self.name,
            error="Browser Use Desktop companion IPC endpoint unreachable",
            observed_outcome="Companion endpoint not responding",
            verified=False,
        )

    def observe_screen(self, session_id: str) -> ObservationResult:
        return ObservationResult(session_id=session_id, backend=self.name, title="Browser Use Desktop Companion")

    def inspect_page(self, session_id: str) -> ObservationResult:
        return self.observe_screen(session_id)

    def click_element(self, session_id: str, target: Any) -> ActionResult:
        return ActionResult(
            success=False,
            action="click_element",
            session_id=session_id,
            backend=self.name,
            error="Companion click requires active companion IPC connection",
            observed_outcome="Unreachable companion",
            verified=False,
        )

    def type_text(self, session_id: str, text: str, target: Optional[Any] = None) -> ActionResult:
        return ActionResult(
            success=False,
            action="type_text",
            session_id=session_id,
            backend=self.name,
            error="Companion type requires active companion IPC connection",
            observed_outcome="Unreachable companion",
            verified=False,
        )

    def press_key(self, session_id: str, key: str) -> ActionResult:
        return ActionResult(
            success=False,
            action="press_key",
            session_id=session_id,
            backend=self.name,
            error="Companion press_key requires active companion IPC connection",
            observed_outcome="Unreachable companion",
            verified=False,
        )

    def scroll(self, session_id: str, direction: str = "down", amount: int = 300) -> ActionResult:
        return ActionResult(
            success=False,
            action="scroll",
            session_id=session_id,
            backend=self.name,
            error="Companion scroll requires active companion IPC connection",
            observed_outcome="Unreachable companion",
            verified=False,
        )

    def switch_tab(self, session_id: str, tab_id: str) -> ActionResult:
        return ActionResult(
            success=False,
            action="switch_tab",
            session_id=session_id,
            backend=self.name,
            error="Unsupported",
            observed_outcome="Unsupported",
            verified=False,
        )

    def take_screenshot(self, session_id: str) -> bytes:
        raise ComputerControlError("Screenshot requires active companion IPC connection", backend=self.name)

    def download_file(self, session_id: str, url_or_action: str) -> str:
        raise ComputerControlError("File download via companion requires active IPC connection", backend=self.name)
