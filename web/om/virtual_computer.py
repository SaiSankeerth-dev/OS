"""Docker Virtual Computer Manager (`web/om/virtual_computer.py`).

Gives OS (`@forge` & `@scout`) a dedicated Docker Virtual Computer with:
1. Isolated Linux userland + `/workspace` volume/mount (`os-virtual-desktop` / `openmuse-computer:local`).
2. Live X11 Virtual Desktop streamed over noVNC (`http://localhost:6080/vnc.html?autoconnect=1&resize=scale&reconnect=1`).
3. CLI Execution: `exec_shell()` and `exec_python()` via container execution.
4. GUI Computer Use: `mouse_click(x, y)`, `type_text()`, `key_press()`, `open_browser(url)`, and `capture_screenshot()` via `xdotool` & `scrot`.
5. Human-in-the-Loop "Take Control" lease: pauses autonomous agent actions while the human interacts with the live noVNC desktop.
"""
from __future__ import annotations

import base64
import os
import shlex
import shutil
import subprocess
import time
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional


class VirtualComputerError(RuntimeError):
    """Raised when the Docker Virtual Computer encounters an error or lease conflict."""


class DockerVirtualComputer:
    DEFAULT_IMAGE = os.environ.get("OS_COMPUTER_IMAGE", "os-virtual-desktop:latest")
    DEFAULT_CONTAINER = os.environ.get("OS_COMPUTER_CONTAINER", "os-virtual-desktop")
    NOVNC_URL = os.environ.get(
        "OS_COMPUTER_NOVNC_URL",
        "http://localhost:6080/vnc.html?autoconnect=1&resize=scale&reconnect=1",
    )

    def __init__(
        self,
        workspace_host_dir: str | Path = "data/om-workspace",
        container_name: str | None = None,
        image_name: str | None = None,
        novnc_url: str | None = None,
        runner: Optional[Callable[[List[str], float], subprocess.CompletedProcess]] = None,
    ) -> None:
        self.workspace_host_dir = Path(workspace_host_dir).resolve()
        self.workspace_host_dir.mkdir(parents=True, exist_ok=True)
        self.container_name = container_name or self.DEFAULT_CONTAINER
        self.image_name = image_name or self.DEFAULT_IMAGE
        self.novnc_url = novnc_url or self.NOVNC_URL
        self._runner = runner or self._default_runner
        self.human_takeover: bool = False
        self.command_receipts: List[Dict[str, Any]] = []
        self._cached_display: Optional[str] = None
        self._cached_user: Optional[str] = None

    @staticmethod
    def _default_runner(cmd: List[str], timeout: float = 30.0) -> subprocess.CompletedProcess:
        return subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)

    def docker_available(self) -> bool:
        if not shutil.which("docker") and self._runner == self._default_runner:
            return False
        try:
            res = self._runner(["docker", "info"], 5.0)
            return res.returncode == 0
        except Exception:
            return False

    def is_container_running(self) -> bool:
        """Returns True if the primary container or a known desktop container is running."""
        try:
            res = self._runner(
                ["docker", "ps", "--format", "{{.Names}}"],
                5.0,
            )
            names = (res.stdout or "").strip().splitlines()
            if self.container_name in names:
                return True
            for fallback in ("os-virtual-desktop", "os-agent-computer", "openmuse-computer"):
                if fallback in names:
                    self.container_name = fallback
                    return True
            return False
        except Exception:
            return False

    def _detect_display(self) -> str:
        if self._cached_display:
            return self._cached_display
        try:
            res = self._runner(
                ["docker", "exec", self.container_name, "printenv", "DISPLAY"],
                5.0,
            )
            disp = (res.stdout or "").strip()
            if disp.startswith(":"):
                self._cached_display = disp
                return disp
        except Exception:
            pass
        if "agent-computer" in self.container_name:
            self._cached_display = ":99"
        else:
            self._cached_display = ":1"
        return self._cached_display

    def _detect_user(self) -> Optional[str]:
        if self._cached_user is not None:
            return self._cached_user if self._cached_user != "none" else None
        try:
            res = self._runner(
                ["docker", "exec", self.container_name, "id", "-u", "jarvis"],
                5.0,
            )
            if res.returncode == 0:
                self._cached_user = "jarvis"
                return "jarvis"
        except Exception:
            pass
        self._cached_user = "none"
        return None

    def ensure_running(self) -> Dict[str, Any]:
        """Starts the virtual computer container if not already running."""
        if self.is_container_running():
            return self.status()

        # Remove stopped container with same name if present
        self._runner(["docker", "rm", "-f", self.container_name], 10.0)

        run_cmd = [
            "docker", "run", "-d",
            "--name", self.container_name,
            "-p", "6080:6080",
            "-p", "5900:5900",
            "--cpus", "2.0",
            "--memory", "2g",
            "--security-opt", "no-new-privileges:true",
            "-v", f"{self.workspace_host_dir}:/workspace",
            self.image_name,
        ]
        res = self._runner(run_cmd, 30.0)
        if res.returncode != 0:
            raise VirtualComputerError(
                f"Failed to start Docker container '{self.container_name}': {res.stderr.strip()}"
            )
        return self.status()

    def status(self) -> Dict[str, Any]:
        running = self.is_container_running()
        return {
            "container_name": self.container_name,
            "image": self.image_name,
            "running": running,
            "mode": "HUMAN_OVERRIDE" if self.human_takeover else "AGENT_AUTONOMOUS",
            "human_takeover": self.human_takeover,
            "novnc_url": self.novnc_url,
            "workspace_host": str(self.workspace_host_dir),
            "workspace_container": "/workspace",
            "display": self._detect_display() if running else None,
            "recent_receipts": self.command_receipts[-10:],
        }

    def set_take_control(self, take_control: bool) -> Dict[str, Any]:
        """Toggles Human Take Control mode (pauses autonomous agent writes when True)."""
        self.human_takeover = bool(take_control)
        return self.status()

    def toggle_take_control(self) -> Dict[str, Any]:
        return self.set_take_control(not self.human_takeover)

    def _assert_agent_permitted(self, bypass_takeover: bool = False) -> None:
        if self.human_takeover and not bypass_takeover:
            raise VirtualComputerError(
                "Virtual Computer is currently in HUMAN_OVERRIDE ('Take Control') mode. "
                "Return control to the agent before dispatching autonomous commands."
            )

    def exec_shell(
        self,
        command: str,
        workdir: str = "/workspace",
        timeout: float = 30.0,
        bypass_takeover: bool = False,
    ) -> Dict[str, Any]:
        """Executes a shell command inside the running Docker Virtual Computer."""
        self._assert_agent_permitted(bypass_takeover=bypass_takeover)
        t0 = time.perf_counter()
        display = self._detect_display()
        user = self._detect_user()

        docker_cmd = ["docker", "exec"]
        if user:
            docker_cmd.extend(["-u", user])
        docker_cmd.extend([
            "-w", workdir,
            "-e", f"DISPLAY={display}",
            self.container_name,
            "/bin/bash", "-c", command,
        ])

        res = self._runner(docker_cmd, timeout)
        elapsed_ms = round((time.perf_counter() - t0) * 1000, 2)
        receipt = {
            "type": "shell",
            "command": command,
            "workdir": workdir,
            "exit_code": res.returncode,
            "stdout": (res.stdout or "")[:4000],
            "stderr": (res.stderr or "")[:4000],
            "elapsed_ms": elapsed_ms,
            "container": self.container_name,
        }
        self.command_receipts.append(receipt)
        return receipt

    def gui_action(
        self,
        action: str,
        x: Optional[int] = None,
        y: Optional[int] = None,
        text: Optional[str] = None,
        key: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Executes GUI actions (mouse click, move, type, key press, open URL) on virtual X11 Display."""
        self._assert_agent_permitted()
        if action == "click" and x is not None and y is not None:
            cmd = f"xdotool mousemove {int(x)} {int(y)} click 1"
        elif action == "double_click" and x is not None and y is not None:
            cmd = f"xdotool mousemove {int(x)} {int(y)} click --repeat 2 1"
        elif action == "mouse_move" and x is not None and y is not None:
            cmd = f"xdotool mousemove {int(x)} {int(y)}"
        elif action == "type" and text is not None:
            safe_txt = shlex.quote(text)
            cmd = f"xdotool type --delay 25 -- {safe_txt}"
        elif action == "key" and key is not None:
            safe_key = shlex.quote(key)
            cmd = f"xdotool key -- {safe_key}"
        elif action == "open_url" and text is not None:
            safe_url = shlex.quote(text)
            cmd = f"nohup chromium --no-sandbox --disable-dev-shm-usage {safe_url} >/dev/null 2>&1 &"
        else:
            raise VirtualComputerError(f"Unsupported or incomplete GUI action: {action}")

        return self.exec_shell(cmd, timeout=10.0)

    def capture_screenshot(self) -> Dict[str, Any]:
        """Captures X11 Display to a PNG inside container and returns base64 data URI."""
        display = self._detect_display()
        # Direct container screenshot and base64 pipeline
        cmd = f"DISPLAY={display} scrot -o /tmp/.os_screen.png && base64 -w 0 /tmp/.os_screen.png"
        res = self.exec_shell(cmd, bypass_takeover=True, timeout=10.0)
        out = (res.get("stdout") or "").strip()
        if res["exit_code"] == 0 and out.startswith("iVBOR"):
            return {
                "ok": True,
                "data_uri": f"data:image/png;base64,{out}",
                "width": 1280,
                "height": 800,
            }

        # Fallback: check workspace host directory if bound
        shot_name = ".os_screen.png"
        cmd2 = f"DISPLAY={display} scrot -o /workspace/{shot_name}"
        res2 = self.exec_shell(cmd2, bypass_takeover=True, timeout=10.0)
        host_shot = self.workspace_host_dir / shot_name
        if res2["exit_code"] == 0 and host_shot.exists():
            b64 = base64.b64encode(host_shot.read_bytes()).decode("ascii")
            return {
                "ok": True,
                "data_uri": f"data:image/png;base64,{b64}",
                "width": 1280,
                "height": 800,
            }
        return {"ok": False, "error": res.get("stderr") or "Screenshot capture failed"}


# Singleton instance
_virtual_computer_instance: Optional[DockerVirtualComputer] = None


def get_virtual_computer() -> DockerVirtualComputer:
    global _virtual_computer_instance
    if _virtual_computer_instance is None:
        _virtual_computer_instance = DockerVirtualComputer()
    return _virtual_computer_instance
