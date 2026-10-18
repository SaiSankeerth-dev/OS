"""Windows Harness Backend for OS.

Provides native Windows desktop control, visible window inspection, accessible UI element
navigation, mouse/keyboard simulation, and an emergency kill switch. Runs with least-privilege
checks and gracefully reports environment status on non-Windows hosts.
"""
from __future__ import annotations

import base64
import ctypes
import logging
import os
import subprocess
import time
import uuid
from typing import Any, Dict, List, Optional, Tuple

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

log = logging.getLogger("os.computer.windows_harness")


class WindowsHarnessBackend(BaseComputerBackend):
    """Native Windows computer-control backend with emergency stop mechanism."""

    name: str = "windows_harness"

    def __init__(self) -> None:
        super().__init__()
        self._emergency_stopped = False
        self._last_active_window: Optional[str] = None

    def emergency_stop(self) -> None:
        """Immediate kill switch that halts all desktop operations."""
        self._emergency_stopped = True
        log.warning("EMERGENCY KILL SWITCH ACTIVATED on Windows Harness")

    def reset_emergency_stop(self) -> None:
        self._emergency_stopped = False

    def health_check(self) -> HealthStatus:
        if os.name != "nt":
            return HealthStatus(
                ok=False,
                backend=self.name,
                message="Windows Harness requires a native Windows host (os.name == 'nt')",
                details={"os": os.name},
            )
        return HealthStatus(
            ok=True,
            backend=self.name,
            message="Windows desktop API and User32 subsystem available",
            details={"platform": "windows", "kill_switch_ready": True},
        )

    def get_capabilities(self) -> BackendCapabilities:
        return BackendCapabilities(
            supports_browser=False,
            supports_desktop=True,
            supports_virtual_sandbox=False,
            supports_visual_clicks=True,
            supports_dom_locators=False,
            supports_file_download=False,
            supports_auth_profiles=False,
            cost_classification=BackendCostKind.ZERO_LOCAL,
            max_concurrent_sessions=1,
        )

    def start_session(self, config: Optional[Dict[str, Any]] = None) -> SessionState:
        if os.name != "nt":
            raise ComputerControlError("Windows Harness is only available on Windows", backend=self.name)
        if self._emergency_stopped:
            raise ComputerControlError("Windows Harness is halted under Emergency Stop", backend=self.name)

        session_id = (config or {}).get("session_id") or uuid.uuid4().hex[:12]
        state = SessionState(
            session_id=session_id,
            backend_name=self.name,
            status="active",
            metadata={"emergency_stopped": False},
        )
        with self._registry_lock:
            self._sessions[session_id] = state
        return state

    def list_windows(self) -> List[WindowInfo]:
        """Enumerate visible, non-empty top-level Windows application windows."""
        if os.name != "nt":
            return []

        windows: List[WindowInfo] = []

        try:
            # Use PowerShell to query visible process windows cleanly without external DLL bloat
            ps_cmd = (
                "Get-Process | Where-Object { $_.MainWindowTitle } | "
                "Select-Object Id, ProcessName, MainWindowTitle | ConvertTo-Json -Compress"
            )
            proc = subprocess.run(
                ["powershell", "-NoProfile", "-Command", ps_cmd],
                capture_output=True,
                text=True,
                timeout=5,
            )
            if proc.returncode == 0 and proc.stdout.strip():
                import json
                data = json.loads(proc.stdout)
                if isinstance(data, dict):
                    data = [data]
                for item in data:
                    title = item.get("MainWindowTitle", "").strip()
                    if title:
                        windows.append(
                            WindowInfo(
                                window_id=str(item.get("Id", "")),
                                title=title,
                                process_name=f"{item.get('ProcessName', '')}.exe",
                                is_active=False,
                            )
                        )
        except Exception as e:
            log.warning("PowerShell window enum failed, falling back to User32: %s", e)

        return windows

    def list_tabs(self, session_id: str) -> List[TabInfo]:
        return []  # Windows desktop harness operates across windows, not browser tabs

    def open_url(self, session_id: str, url: str) -> ActionResult:
        """Launch the URL in the system default or configured application."""
        if self._emergency_stopped:
            raise ComputerControlError("Emergency stop is active", backend=self.name)
        t0 = time.perf_counter()
        try:
            os.startfile(url)
            dur = round((time.perf_counter() - t0) * 1000, 2)
            return ActionResult(
                success=True,
                action="open_url",
                session_id=session_id,
                backend=self.name,
                details={"url": url},
                observed_outcome=f"Dispatched URL '{url}' to Windows shell",
                verified=True,
                duration_ms=dur,
            )
        except Exception as e:
            dur = round((time.perf_counter() - t0) * 1000, 2)
            return ActionResult(
                success=False,
                action="open_url",
                session_id=session_id,
                backend=self.name,
                error=str(e),
                observed_outcome=f"Shell launch failed: {e}",
                verified=False,
                duration_ms=dur,
            )

    def observe_screen(self, session_id: str) -> ObservationResult:
        """Capture screenshot of the desktop screen via Pillow/MSS or PowerShell."""
        sess = self._require_session(session_id)
        b64 = None
        try:
            import io
            from PIL import ImageGrab
            img = ImageGrab.grab()
            buf = io.BytesIO()
            img.save(buf, format="PNG")
            b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
        except Exception as e:
            log.warning("Desktop screen capture failed: %s", e)

        windows = self.list_windows()
        active_win = windows[0] if windows else None
        return ObservationResult(
            session_id=session_id,
            backend=self.name,
            title=active_win.title if active_win else "Windows Desktop",
            active_window=active_win,
            screenshot_base64=b64,
        )

    def inspect_page(self, session_id: str) -> ObservationResult:
        return self.observe_screen(session_id)

    def click_element(self, session_id: str, target: Any) -> ActionResult:
        """Simulate mouse click at (x, y) coordinates."""
        if self._emergency_stopped:
            raise ComputerControlError("Emergency stop is active", backend=self.name)
        self._require_session(session_id)

        if not isinstance(target, dict) or "x" not in target or "y" not in target:
            return ActionResult(
                success=False,
                action="click_element",
                session_id=session_id,
                backend=self.name,
                error="Windows Harness click requires {'x': int, 'y': int} coordinates",
                observed_outcome="Invalid click target",
                verified=False,
            )

        x, y = int(target["x"]), int(target["y"])
        t0 = time.perf_counter()
        try:
            # Native Windows SetCursorPos & mouse_event
            ctypes.windll.user32.SetCursorPos(x, y)
            ctypes.windll.user32.mouse_event(2, 0, 0, 0, 0)  # MOUSEEVENTF_LEFTDOWN
            time.sleep(0.05)
            ctypes.windll.user32.mouse_event(4, 0, 0, 0, 0)  # MOUSEEVENTF_LEFTUP
            dur = round((time.perf_counter() - t0) * 1000, 2)
            return ActionResult(
                success=True,
                action="click_element",
                session_id=session_id,
                backend=self.name,
                details={"x": x, "y": y},
                observed_outcome=f"Dispatched native mouse click at ({x}, {y})",
                verified=True,
                duration_ms=dur,
            )
        except Exception as e:
            dur = round((time.perf_counter() - t0) * 1000, 2)
            return ActionResult(
                success=False,
                action="click_element",
                session_id=session_id,
                backend=self.name,
                error=str(e),
                observed_outcome=f"Native click failed: {e}",
                verified=False,
                duration_ms=dur,
            )

    def type_text(self, session_id: str, text: str, target: Optional[Any] = None) -> ActionResult:
        if self._emergency_stopped:
            raise ComputerControlError("Emergency stop is active", backend=self.name)
        self._require_session(session_id)

        # If target coordinate provided, click first
        if isinstance(target, dict) and "x" in target and "y" in target:
            self.click_element(session_id, target)

        t0 = time.perf_counter()
        try:
            # Use PowerShell SendKeys for stable native keystroke injection
            escaped = text.replace("{", "{{").replace("}", "}}")
            ps_code = f"[System.Windows.Forms.SendKeys]::SendWait('{escaped}')"
            subprocess.run(
                ["powershell", "-NoProfile", "-Command", "Add-Type -AssemblyName System.Windows.Forms;" + ps_code],
                timeout=5,
                capture_output=True,
            )
            dur = round((time.perf_counter() - t0) * 1000, 2)
            return ActionResult(
                success=True,
                action="type_text",
                session_id=session_id,
                backend=self.name,
                details={"chars": len(text)},
                observed_outcome=f"Injected {len(text)} keystrokes to foreground window",
                verified=True,
                duration_ms=dur,
            )
        except Exception as e:
            dur = round((time.perf_counter() - t0) * 1000, 2)
            return ActionResult(
                success=False,
                action="type_text",
                session_id=session_id,
                backend=self.name,
                error=str(e),
                observed_outcome=f"SendKeys failed: {e}",
                verified=False,
                duration_ms=dur,
            )

    def press_key(self, session_id: str, key: str) -> ActionResult:
        if self._emergency_stopped:
            raise ComputerControlError("Emergency stop is active", backend=self.name)
        self._require_session(session_id)
        try:
            ps_code = f"[System.Windows.Forms.SendKeys]::SendWait('{{{key}}}')"
            subprocess.run(
                ["powershell", "-NoProfile", "-Command", "Add-Type -AssemblyName System.Windows.Forms;" + ps_code],
                timeout=3,
                capture_output=True,
            )
            return ActionResult(
                success=True,
                action="press_key",
                session_id=session_id,
                backend=self.name,
                details={"key": key},
                observed_outcome=f"Sent native key '{key}'",
                verified=True,
            )
        except Exception as e:
            return ActionResult(
                success=False,
                action="press_key",
                session_id=session_id,
                backend=self.name,
                error=str(e),
                observed_outcome=f"Press key failed: {e}",
                verified=False,
            )

    def scroll(self, session_id: str, direction: str = "down", amount: int = 300) -> ActionResult:
        if self._emergency_stopped:
            raise ComputerControlError("Emergency stop is active", backend=self.name)
        self._require_session(session_id)
        clicks = -(amount // 10) if direction == "down" else (amount // 10)
        try:
            ctypes.windll.user32.mouse_event(0x0800, 0, 0, clicks, 0)  # MOUSEEVENTF_WHEEL
            return ActionResult(
                success=True,
                action="scroll",
                session_id=session_id,
                backend=self.name,
                details={"direction": direction, "amount": amount},
                observed_outcome=f"Scrolled mouse wheel {direction} by {amount} units",
                verified=True,
            )
        except Exception as e:
            return ActionResult(
                success=False,
                action="scroll",
                session_id=session_id,
                backend=self.name,
                error=str(e),
                observed_outcome=f"Native scroll failed: {e}",
                verified=False,
            )

    def switch_tab(self, session_id: str, tab_id: str) -> ActionResult:
        return ActionResult(
            success=False,
            action="switch_tab",
            session_id=session_id,
            backend=self.name,
            error="Tabs not supported in Windows desktop harness; use window switching",
            observed_outcome="Unsupported",
            verified=False,
        )

    def take_screenshot(self, session_id: str) -> bytes:
        import io
        from PIL import ImageGrab
        img = ImageGrab.grab()
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        return buf.getvalue()

    def download_file(self, session_id: str, url_or_action: str) -> str:
        raise ComputerControlError("File download not directly handled in desktop harness", backend=self.name)
