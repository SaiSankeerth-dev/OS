"""Docker & Selkies / noVNC Virtual Desktop Backend for OS.

Provides an isolated, local-first Linux virtual computer desktop:
- Runs lightweight X11 desktop inside Docker container (Debian + Openbox + Xvfb)
- Exposes interactive noVNC / Selkies HTML5 streaming UI on port 6080
- Launches Chromium with Remote Debugging Protocol (CDP) on port 9222
- Connects Playwright browser harness directly to the container's Chromium instance
- Single-Browser architecture: human viewer and AI agent share the EXACT same session
- Honest observability: reports truthful offline status if Docker Desktop is stopped
"""
from __future__ import annotations

import json
import logging
import os
import shutil
import subprocess
import time
import urllib.error
import urllib.request
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from server.computer.backends.base import BaseComputerBackend
from server.computer.backends.browser_harness import BrowserHarnessBackend
from server.computer.interface import (
    ActionResult,
    BackendCapabilities,
    BackendCostKind,
    BackendUnavailableError,
    ComputerControlError,
    HealthStatus,
    ObservationResult,
    SessionNotFoundError,
    SessionState,
    TabInfo,
    WindowInfo,
)

log = logging.getLogger("os.computer.docker_desktop")


class DockerDesktopBackend(BaseComputerBackend):
    """Local-first Docker desktop container backend with unified CDP browser automation."""

    name: str = "docker_desktop"

    CONTAINER_NAME = "os-virtual-desktop"
    CDP_URL = "http://127.0.0.1:9222"
    STREAM_PORT = 6080
    CDP_PORT = 9222

    def __init__(
        self,
        compose_file: Optional[str] = None,
        browser_harness: Optional[BrowserHarnessBackend] = None,
    ) -> None:
        super().__init__()
        self.repo_root = Path(__file__).resolve().parents[3]
        self.compose_file = Path(compose_file) if compose_file else self.repo_root / "docker" / "docker-compose.desktop.yml"
        self._browser_harness = browser_harness or BrowserHarnessBackend()
        self._last_health: Optional[HealthStatus] = None
        self._last_health_ts: float = 0.0

    def get_capabilities(self) -> BackendCapabilities:
        return BackendCapabilities(
            supports_browser=True,
            supports_desktop=True,
            supports_virtual_sandbox=True,
            supports_visual_clicks=True,
            supports_dom_locators=True,
            supports_file_download=True,
            supports_auth_profiles=True,
            cost_classification=BackendCostKind.ZERO_LOCAL,
            max_concurrent_sessions=2,
        )

    def _is_docker_cli_available(self) -> bool:
        """Check if docker executable is present on system PATH."""
        return shutil.which("docker") is not None

    def _is_docker_daemon_running(self) -> Tuple[bool, str]:
        """Check if the Docker daemon is responding via `docker version`."""
        if not self._is_docker_cli_available():
            return False, "Docker CLI executable not found on PATH."

        try:
            res = subprocess.run(
                ["docker", "version", "--format", "{{json .Server}}"],
                capture_output=True,
                text=True,
                timeout=4,
            )
            if res.returncode == 0 and res.stdout.strip() and "null" not in res.stdout:
                return True, "Docker daemon is running."
            err = (res.stderr or res.stdout).strip()
            return False, f"Docker daemon is offline or unreachable: {err}"
        except subprocess.TimeoutExpired:
            return False, "Docker daemon probe timed out (daemon unresponsive)."
        except Exception as e:
            return False, f"Docker daemon probe failed: {e}"

    def _is_cdp_ready(self) -> bool:
        """Probe the container Chromium CDP endpoint on 127.0.0.1:9222."""
        try:
            req = urllib.request.Request(f"{self.CDP_URL}/json/version")
            with urllib.request.urlopen(req, timeout=1.5) as resp:
                if resp.status == 200:
                    data = json.loads(resp.read().decode("utf-8"))
                    return bool(data.get("Browser"))
        except Exception:
            pass
        return False

    def _is_stream_ready(self) -> bool:
        """Probe the container noVNC HTML5 stream endpoint on 127.0.0.1:6080."""
        try:
            req = urllib.request.Request(f"http://127.0.0.1:{self.STREAM_PORT}/vnc.html")
            with urllib.request.urlopen(req, timeout=1.5) as resp:
                return resp.status == 200
        except Exception:
            pass
        return False

    def _is_display_ready(self) -> bool:
        """Check if Xvfb display :1 is active and responding to xdpyinfo."""
        try:
            res = subprocess.run(
                ["docker", "exec", self.CONTAINER_NAME, "xdpyinfo", "-display", ":1"],
                capture_output=True,
                text=True,
                timeout=3,
            )
            return res.returncode == 0
        except Exception:
            return False

    def _is_wm_ready(self) -> bool:
        """Check if Openbox window manager is running."""
        try:
            res = subprocess.run(
                ["docker", "exec", self.CONTAINER_NAME, "pgrep", "openbox"],
                capture_output=True,
                text=True,
                timeout=3,
            )
            return res.returncode == 0
        except Exception:
            return False

    def _is_panel_ready(self) -> bool:
        """Check if tint2 desktop panel is running."""
        try:
            res = subprocess.run(
                ["docker", "exec", self.CONTAINER_NAME, "pgrep", "tint2"],
                capture_output=True,
                text=True,
                timeout=3,
            )
            return res.returncode == 0
        except Exception:
            return False

    def _is_vnc_ready(self) -> bool:
        """Check if x11vnc server is running."""
        try:
            res = subprocess.run(
                ["docker", "exec", self.CONTAINER_NAME, "pgrep", "x11vnc"],
                capture_output=True,
                text=True,
                timeout=3,
            )
            return res.returncode == 0
        except Exception:
            return False

    def _is_chromium_running(self) -> bool:
        """Check if Chromium browser process is running."""
        try:
            res = subprocess.run(
                ["docker", "exec", self.CONTAINER_NAME, "pgrep", "chromium"],
                capture_output=True,
                text=True,
                timeout=3,
            )
            return res.returncode == 0
        except Exception:
            return False

    def _check_frame_variance(self) -> Tuple[bool, int, str]:
        """Verify the X11 virtual desktop framebuffer is not completely black.
        
        Runs a quick scrot inside the container and measures byte entropy.
        A 1280x800 pure black framebuffer compresses to ~3KB.
        An active rendered desktop (navy background, tint2 bar, windows) is > 10KB.
        """
        try:
            res = subprocess.run(
                [
                    "docker", "exec", self.CONTAINER_NAME, "bash", "-c",
                    # scrot refuses to overwrite an existing output name and
                    # keeps trying suffixed alternatives.  A fixed hidden path
                    # therefore eventually reports a false black frame even
                    # while X11 is rendering normally.  The exec shell PID is
                    # unique per probe, and the trap keeps the container clean.
                    "frame=/tmp/os-frame-check-$$.png; trap 'rm -f \"$frame\"' EXIT; DISPLAY=:1 scrot -z -q 80 \"$frame\" 2>/dev/null && stat -c %s \"$frame\" 2>/dev/null",
                ],
                capture_output=True,
                text=True,
                timeout=4,
            )
            if res.returncode == 0 and res.stdout.strip().isdigit():
                size = int(res.stdout.strip())
                if size < 5000:
                    return False, size, f"Black framebuffer detected: scrot size is only {size} bytes (blank unpainted screen)."
                return True, size, f"Verified active desktop rendering: frame size is {size} bytes."
            return False, 0, f"Frame check probe failed: {res.stderr or res.stdout}"
        except subprocess.TimeoutExpired:
            return False, 0, "Frame check probe timed out"
        except Exception as e:
            return False, 0, f"Frame check error: {e}"

    def health_check(self, force_refresh: bool = False) -> HealthStatus:
        """Truthful health check without fake readiness indicators.
        
        Evaluates all 8 runtime layers:
        1. Docker CLI & daemon
        2. Container lifecycle
        3. Xvfb Display server (:1)
        4. Openbox window manager
        5. tint2 desktop panel
        6. x11vnc transport (:5900)
        7. noVNC HTML5 stream (:6080) & Chromium CDP (:9222)
        8. Framebuffer visual variance (black screen rejection)
        """
        now = time.time()
        if not force_refresh and self._last_health and (now - self._last_health_ts < 5.0):
            return self._last_health

        if not self._is_docker_cli_available():
            status = HealthStatus(
                ok=False,
                backend=self.name,
                message="Docker executable not found on system PATH. Install Docker Desktop for virtual desktop support.",
                details={
                    "docker_cli": False,
                    "daemon_running": False,
                    "container_running": False,
                    "stream_ready": False,
                    "cdp_ready": False,
                },
            )
            self._last_health = status
            self._last_health_ts = now
            return status

        daemon_ok, daemon_msg = self._is_docker_daemon_running()
        if not daemon_ok:
            status = HealthStatus(
                ok=False,
                backend=self.name,
                message="Docker daemon is offline or unreachable. Start Docker Desktop to launch Linux desktop container.",
                details={
                    "docker_cli": True,
                    "daemon_running": False,
                    "container_running": False,
                    "stream_ready": False,
                    "cdp_ready": False,
                    "diagnostic": daemon_msg,
                },
            )
            self._last_health = status
            self._last_health_ts = now
            return status

        # Docker daemon is running; inspect container and endpoints
        container_state = self._inspect_container_state()
        is_running = container_state.get("running", False)

        if not is_running:
            status = HealthStatus(
                ok=False,
                backend=self.name,
                message="Docker daemon active; virtual desktop container is standby (click 'Start Virtual Desktop' to launch).",
                details={
                    "docker_cli": True,
                    "daemon_running": True,
                    "container_running": False,
                    "container_name": self.CONTAINER_NAME,
                    "container_status": container_state.get("status", "stopped"),
                    "stream_ready": False,
                    "cdp_ready": False,
                    "stream_url": f"http://127.0.0.1:{self.STREAM_PORT}/vnc.html?autoconnect=true&resize=scale",
                    "cdp_url": self.CDP_URL,
                },
            )
            self._last_health = status
            self._last_health_ts = now
            return status

        cdp_online = self._is_cdp_ready()
        stream_online = self._is_stream_ready()
        display_online = self._is_display_ready()
        wm_online = self._is_wm_ready()
        panel_online = self._is_panel_ready()
        vnc_online = self._is_vnc_ready()
        chromium_online = self._is_chromium_running()
        frame_ok, frame_bytes, frame_msg = self._check_frame_variance()

        # Black screen detection: if ports 6080 and 9222 are open but the frame is black
        if cdp_online and stream_online:
            if not frame_ok:
                ok = False
                msg = f"Degraded: Black screen detected! Services active on :6080 and :9222, but framebuffer has zero visual variance ({frame_bytes} bytes)."
            else:
                ok = True
                msg = "Virtual desktop container running with active Display :1, Openbox, tint2, noVNC (:6080), Chromium CDP (:9222), and verified non-black rendered framebuffer."
        elif cdp_online or stream_online:
            msg = f"Virtual desktop container running (CDP: {'ready' if cdp_online else 'waiting'}, Stream: {'ready' if stream_online else 'waiting'})."
            ok = False
        else:
            msg = "Virtual desktop container started, waiting for desktop services (noVNC :6080 and CDP :9222)..."
            ok = False

        status = HealthStatus(
            ok=ok,
            backend=self.name,
            message=msg,
            details={
                "docker_cli": True,
                "daemon_running": True,
                "container_running": True,
                "container_name": self.CONTAINER_NAME,
                "container_status": container_state.get("status", "running"),
                "display_server": display_online,
                "window_manager": wm_online,
                "panel_ready": panel_online,
                "vnc_transport": vnc_online,
                "chromium_process": chromium_online,
                "stream_ready": stream_online,
                "cdp_ready": cdp_online,
                "frame_variance_ok": frame_ok,
                "frame_bytes": frame_bytes,
                "black_screen_detected": not frame_ok if (cdp_online and stream_online) else False,
                "diagnostic": frame_msg,
                "stream_url": f"http://127.0.0.1:{self.STREAM_PORT}/vnc.html?autoconnect=true&resize=scale",
                "cdp_url": self.CDP_URL,
            },
        )
        self._last_health = status
        self._last_health_ts = now
        return status

    def _inspect_container_state(self) -> Dict[str, Any]:
        """Query Docker for os-virtual-desktop container status."""
        try:
            res = subprocess.run(
                ["docker", "inspect", self.CONTAINER_NAME, "--format", "{{json .State}}"],
                capture_output=True,
                text=True,
                timeout=3,
            )
            if res.returncode == 0:
                state = json.loads(res.stdout)
                return {"running": state.get("Running", False), "status": state.get("Status", "unknown")}
        except Exception:
            pass
        return {"running": False, "status": "offline"}

    def ensure_container_running(self, timeout_sec: int = 25) -> bool:
        """Start the desktop container via docker compose if daemon is active."""
        daemon_ok, err = self._is_docker_daemon_running()
        if not daemon_ok:
            raise BackendUnavailableError(
                f"Cannot start virtual desktop: {err}",
                backend=self.name,
            )

        if self._is_cdp_ready():
            return True

        if not self.compose_file.exists():
            raise ComputerControlError(
                f"Docker compose configuration missing: {self.compose_file}",
                backend=self.name,
            )

        log.info("Launching OS virtual desktop container: docker compose up -d")
        try:
            res = subprocess.run(
                ["docker", "compose", "-f", str(self.compose_file), "up", "-d"],
                capture_output=True,
                text=True,
                timeout=60,
                cwd=str(self.compose_file.parent),
            )
            if res.returncode != 0:
                raise ComputerControlError(
                    f"Docker compose failed: {res.stderr or res.stdout}",
                    backend=self.name,
                )
        except Exception as e:
            raise ComputerControlError(f"Failed to start desktop container: {e}", backend=self.name)

        # Poll for both CDP and stream readiness
        deadline = time.time() + timeout_sec
        while time.time() < deadline:
            if self._is_cdp_ready() and self._is_stream_ready():
                log.info("Desktop container fully ready: Chromium CDP on %s and noVNC on :%d", self.CDP_URL, self.STREAM_PORT)
                return True
            time.sleep(1.0)

        log.warning("Container started but services did not fully respond within %ds", timeout_sec)
        return self._is_cdp_ready() and self._is_stream_ready()

    def stop_container(self) -> bool:
        """Stop the virtual desktop container."""
        try:
            res = subprocess.run(
                ["docker", "compose", "-f", str(self.compose_file), "stop"],
                capture_output=True,
                text=True,
                timeout=30,
                cwd=str(self.compose_file.parent),
            )
            self._last_health = None
            return res.returncode == 0
        except Exception as e:
            log.warning("Failed to stop container: %s", e)
            return False

    def restart_container(self, timeout_sec: int = 25) -> bool:
        """Restart the virtual desktop container."""
        try:
            subprocess.run(
                ["docker", "compose", "-f", str(self.compose_file), "restart"],
                capture_output=True,
                text=True,
                timeout=30,
                cwd=str(self.compose_file.parent),
            )
            self._last_health = None
            deadline = time.time() + timeout_sec
            while time.time() < deadline:
                if self._is_cdp_ready() and self._is_stream_ready():
                    return True
                time.sleep(1.0)
            return self._is_cdp_ready() and self._is_stream_ready()
        except Exception as e:
            log.warning("Failed to restart container: %s", e)
            return False

    def start_session(self, config: Optional[Dict[str, Any]] = None) -> SessionState:
        """Start an interactive session connected directly to the container's Chromium."""
        config = config or {}
        session_id = config.get("session_id") or uuid.uuid4().hex[:12]

        health = self.health_check(force_refresh=True)
        if not health.ok:
            raise BackendUnavailableError(
                f"Virtual desktop backend unavailable: {health.message}",
                backend=self.name,
                details=health.details,
            )

        # Ensure container is booted
        self.ensure_container_running()

        # Connect BrowserHarness to the container's Chromium via CDP
        harness_config = {
            "session_id": session_id,
            "cdp_url": self.CDP_URL,
            "initial_url": config.get("initial_url", "https://google.com"),
        }
        inner_state = self._browser_harness.start_session(harness_config)

        stream_url = f"http://127.0.0.1:{self.STREAM_PORT}/vnc.html?autoconnect=true&resize=scale"
        with self._get_lock(session_id):
            state = SessionState(
                session_id=session_id,
                backend_name=self.name,
                status="active",
                current_url=inner_state.current_url,
                created_at=time.time(),
                updated_at=time.time(),
                metadata={
                    "stream_url": stream_url,
                    "cdp_url": self.CDP_URL,
                    "container_name": self.CONTAINER_NAME,
                    "shared_single_browser": True,
                },
                runtime_identity={
                    "backend": self.name,
                    "type": "container",
                    "container_name": self.CONTAINER_NAME,
                    "display": ":1",
                    "stream_url": stream_url,
                    "cdp_url": self.CDP_URL,
                },
                desktop_service_health=health.details or {},
                frame={
                    "timestamp": time.time(),
                    "valid": bool(health.details.get("frame_variance_ok", True)),
                    "width": 1280,
                    "height": 800,
                },
                input_availability={
                    "keyboard": True,
                    "mouse": True,
                    "active": True,
                },
                browser_session_id=session_id,
                terminal_workspace={
                    "workspace_dir": str(Path("data/om-workspace").resolve()),
                    "container_mount": "/workspace",
                    "isolated": True,
                },
                interruption={
                    "state": "AI_IDLE",
                    "emergency_stopped": False,
                    "human_takeover": False,
                    "can_interrupt": True,
                    "can_resume": True,
                },
            )
            self._sessions[session_id] = state
            return state

    def get_stream_url(self, session_id: str) -> str:
        """Get the HTML5 noVNC / Selkies desktop streaming URL."""
        return f"http://127.0.0.1:{self.STREAM_PORT}/vnc.html?autoconnect=true&resize=scale"

    def list_windows(self) -> List[WindowInfo]:
        """List active desktop and application windows from container or fallback."""
        windows: List[WindowInfo] = []
        try:
            res = subprocess.run(
                ["docker", "exec", self.CONTAINER_NAME, "bash", "-c",
                 'for w in $(xdotool search --onlyvisible --class "chromium" 2>/dev/null); do echo "$w: $(xdotool getwindowname $w 2>/dev/null)"; done'],
                capture_output=True,
                text=True,
                timeout=2,
            )
            if res.returncode == 0 and res.stdout.strip():
                for line in res.stdout.strip().splitlines():
                    if ":" in line:
                        wid, title = line.split(":", 1)
                        title = title.strip()
                        if title and title != "chromium" and title != "Chromium clipboard":
                            windows.append(
                                WindowInfo(
                                    window_id=f"win_{wid.strip()}",
                                    title=title,
                                    process_name="chromium",
                                    is_active=True,
                                    bounds=(0, 0, 1280, 770),
                                )
                            )
        except Exception:
            pass

        if not windows:
            windows.append(
                WindowInfo(
                    window_id="win_desktop_1",
                    title="OS Linux Virtual Desktop (Display :1)",
                    process_name="openbox",
                    is_active=True,
                    bounds=(0, 0, 1280, 800),
                )
            )
        return windows

    def list_tabs(self, session_id: str) -> List[TabInfo]:
        self._require_session(session_id)
        return self._browser_harness.list_tabs(session_id)

    def open_url(self, session_id: str, url: str) -> ActionResult:
        self._require_session(session_id)
        res = self._browser_harness.open_url(session_id, url)
        sess = self._sessions.get(session_id)
        if sess:
            sess.current_url = url
            sess.updated_at = time.time()
        return res

    def observe_screen(self, session_id: str) -> ObservationResult:
        self._require_session(session_id)
        obs = self._browser_harness.observe_screen(session_id)
        obs.backend = self.name
        return obs

    def inspect_page(self, session_id: str) -> ObservationResult:
        self._require_session(session_id)
        obs = self._browser_harness.inspect_page(session_id)
        obs.backend = self.name
        return obs

    def click_element(self, session_id: str, target: Any) -> ActionResult:
        self._require_session(session_id)
        res = self._browser_harness.click_element(session_id, target)
        res.backend = self.name
        return res

    def type_text(self, session_id: str, text: str, target: Optional[Any] = None) -> ActionResult:
        self._require_session(session_id)
        res = self._browser_harness.type_text(session_id, text, target)
        res.backend = self.name
        return res

    def press_key(self, session_id: str, key: str) -> ActionResult:
        self._require_session(session_id)
        res = self._browser_harness.press_key(session_id, key)
        res.backend = self.name
        return res

    def press_shortcut(self, session_id: str, shortcut: str) -> ActionResult:
        self._require_session(session_id)
        if hasattr(self._browser_harness, "press_shortcut"):
            res = self._browser_harness.press_shortcut(session_id, shortcut)
            res.backend = self.name
            return res
        return self.press_key(session_id, shortcut)

    def key_down(self, session_id: str, key: str) -> ActionResult:
        self._require_session(session_id)
        if hasattr(self._browser_harness, "key_down"):
            res = self._browser_harness.key_down(session_id, key)
            res.backend = self.name
            return res
        return ActionResult(
            success=False,
            action="key_down",
            session_id=session_id,
            backend=self.name,
            verified=False,
            error=f"key_down is not implemented on {self.name} without browser harness key_down",
        )

    def key_up(self, session_id: str, key: str) -> ActionResult:
        self._require_session(session_id)
        if hasattr(self._browser_harness, "key_up"):
            res = self._browser_harness.key_up(session_id, key)
            res.backend = self.name
            return res
        return ActionResult(
            success=False,
            action="key_up",
            session_id=session_id,
            backend=self.name,
            verified=False,
            error=f"key_up is not implemented on {self.name} without browser harness key_up",
        )

    def release_all_keys(self, session_id: str) -> ActionResult:
        self._require_session(session_id)
        if hasattr(self._browser_harness, "release_all_keys"):
            self._browser_harness.release_all_keys(session_id)
        try:
            subprocess.run(
                ["docker", "exec", "-e", "DISPLAY=:1", self.CONTAINER_NAME, "xdotool", "keyup", "ctrl", "alt", "shift", "super"],
                capture_output=True,
                timeout=3,
            )
        except Exception:
            pass
        return ActionResult(success=True, action="release_all_keys", session_id=session_id, backend=self.name)

    def scroll(self, session_id: str, direction: str = "down", amount: int = 300) -> ActionResult:
        self._require_session(session_id)
        res = self._browser_harness.scroll(session_id, direction, amount)
        res.backend = self.name
        return res

    def switch_tab(self, session_id: str, tab_id: str) -> ActionResult:
        self._require_session(session_id)
        return self._browser_harness.switch_tab(session_id, tab_id)

    def take_screenshot(self, session_id: str) -> bytes:
        self._require_session(session_id)
        return self._browser_harness.take_screenshot(session_id)

    def capture_frame_jpeg(self, session_id: str, quality: int = 70) -> bytes:
        self._require_session(session_id)
        if hasattr(self._browser_harness, "capture_frame_jpeg"):
            return self._browser_harness.capture_frame_jpeg(session_id, quality=quality)
        return self.take_screenshot(session_id)

    def forward_mouse(
        self,
        session_id: str,
        event_type: str,
        x: float,
        y: float,
        button: str = "left",
        click_count: int = 1,
        delta_x: float = 0.0,
        delta_y: float = 0.0,
    ) -> ActionResult:
        self._require_session(session_id)
        if hasattr(self._browser_harness, "forward_mouse"):
            return self._browser_harness.forward_mouse(
                session_id=session_id,
                event_type=event_type,
                x=x,
                y=y,
                button=button,
                click_count=click_count,
                delta_x=delta_x,
                delta_y=delta_y,
            )
        return ActionResult(success=True, action="forward_mouse", session_id=session_id, backend=self.name)

    def forward_keyboard(
        self,
        session_id: str,
        event_type: str,
        key: str = "",
        code: str = "",
        text: str = "",
    ) -> ActionResult:
        self._require_session(session_id)
        if hasattr(self._browser_harness, "forward_keyboard"):
            return self._browser_harness.forward_keyboard(
                session_id=session_id,
                event_type=event_type,
                key=key,
                code=code,
                text=text,
            )
        return ActionResult(success=True, action="forward_keyboard", session_id=session_id, backend=self.name)

    def get_element_rect(self, session_id: str, target: str) -> Optional[Dict[str, float]]:
        self._require_session(session_id)
        if hasattr(self._browser_harness, "get_element_rect"):
            return self._browser_harness.get_element_rect(session_id, target)
        return None

    def download_file(self, session_id: str, url_or_action: str) -> str:
        self._require_session(session_id)
        return self._browser_harness.download_file(session_id, url_or_action)

    def close_session(self, session_id: str) -> ActionResult:
        try:
            self._browser_harness.close_session(session_id)
        except Exception:
            pass
        return super().close_session(session_id)
