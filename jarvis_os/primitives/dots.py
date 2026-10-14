"""Specialist Coworkers (Dots) and OpenMuse Agent Computer for OS.

Defines role-based access control, tool boundaries, and human takeover
mechanisms for persistent agent computer environments.
"""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Set


@dataclass
class DotConfig:
    dot_id: str
    name: str
    role: str
    instructions: str
    permissions: Set[str] = field(default_factory=set)  # e.g. {"browser", "files", "shell", "memory"}
    authorized_spaces: Set[str] = field(default_factory=lambda: {"engineering-hq"})
    timeout_sec: int = 30
    verification_required: bool = True


class AgentComputerWorker:
    """OpenMuse-inspired Agent Computer with Take-Control human override."""

    def __init__(self, workspace_root: Optional[str] = None) -> None:
        if workspace_root is None:
            base = Path(__file__).resolve().parent.parent.parent
            workspace_root = str(base / "data" / "computer_workspace")
        self.workspace_root = os.path.abspath(workspace_root)
        os.makedirs(self.workspace_root, exist_ok=True)
        self.user_took_control: bool = False
        self.browser_tabs: List[Dict[str, Any]] = [
            {"url": "http://localhost:8000/hud", "title": "OS Cyber HUD", "status": "active"}
        ]
        self.terminal_history: List[Dict[str, Any]] = []

        try:
            from web.om.store import OmStore
            from web.om.computer import ComputerService
            from web.om.browser import BrowserService

            db_path = str(Path(self.workspace_root).parent / "om.db")
            self._om_store = OmStore(db_path)
            self._computer_svc = ComputerService(self._om_store, workspace_dir=self.workspace_root)
            self._browser_svc = BrowserService(self._om_store)
        except Exception:
            self._computer_svc = None
            self._browser_svc = None

    def toggle_take_control(self, take_control: bool) -> Dict[str, Any]:
        """Human Takeover: suspend autonomous agent actions while operator controls the session."""
        self.user_took_control = take_control
        mode = "HUMAN_CONTROL" if take_control else "AGENT_AUTONOMOUS"
        return {"computer_mode": mode, "workspace": self.workspace_root, "user_took_control": take_control}

    def execute_command(self, command: str) -> Dict[str, Any]:
        """Execute command in persistent workspace. Suspends if human operator has control."""
        if self.user_took_control:
            return {
                "status": "suspended",
                "command": command,
                "stdout": "",
                "stderr": "Execution suspended: human operator has interactive control.",
                "exitCode": None,
            }

        if self._computer_svc is not None:
            try:
                receipt = self._computer_svc.execute(command)
                self.terminal_history.append({
                    "cmd": command,
                    "exit_code": receipt.get("exitCode", 0),
                    "stdout": receipt.get("stdout", ""),
                    "stderr": receipt.get("stderr", ""),
                    "status": receipt.get("status", "succeeded"),
                })
                return receipt
            except Exception as e:
                err_dict = {
                    "status": "failed",
                    "command": command,
                    "stdout": "",
                    "stderr": str(e),
                    "exitCode": 1,
                }
                self.terminal_history.append({"cmd": command, "exit_code": 1, "stderr": str(e), "status": "failed"})
                return err_dict

        # Fallback local execution
        import subprocess
        shell = "bash" if os.name != "nt" else "cmd.exe"
        try:
            proc = subprocess.run(
                command,
                shell=True,
                cwd=self.workspace_root,
                capture_output=True,
                text=True,
                timeout=30,
            )
            res = {
                "status": "succeeded" if proc.returncode == 0 else "failed",
                "command": command,
                "stdout": proc.stdout,
                "stderr": proc.stderr,
                "exitCode": proc.returncode,
            }
            self.terminal_history.append({
                "cmd": command,
                "exit_code": proc.returncode,
                "stdout": proc.stdout,
                "stderr": proc.stderr,
                "status": res["status"],
            })
            return res
        except Exception as e:
            err_dict = {
                "status": "failed",
                "command": command,
                "stdout": "",
                "stderr": str(e),
                "exitCode": 1,
            }
            self.terminal_history.append({"cmd": command, "exit_code": 1, "stderr": str(e), "status": "failed"})
            return err_dict

    def open_url(self, dot_name: str, url: str) -> Dict[str, Any]:
        """Open URL in real browser session. Suspends if human operator has control."""
        if self.user_took_control:
            return {
                "status": "suspended",
                "url": url,
                "reason": "Browser action suspended: human operator has interactive control.",
            }

        title = f"Visited by {dot_name}: {url}"
        if self._browser_svc is not None:
            try:
                session = self._browser_svc.open(url, title=title)
                tab = {
                    "id": session.get("id"),
                    "url": session.get("url", url),
                    "title": session.get("title", title),
                    "status": session.get("status", "loaded"),
                }
                self.browser_tabs.append(tab)
                return tab
            except Exception:
                pass

        tab = {"url": url, "title": title, "status": "loaded"}
        self.browser_tabs.append(tab)
        return tab

    def write_workspace_file(self, rel_path: str, content: str) -> str:
        """Write file inside workspace with path-traversal protection. Suspends if human operator has control."""
        if self.user_took_control:
            raise RuntimeError("File write suspended: human operator has interactive control.")

        clean_rel = os.path.normpath(rel_path).lstrip("/\\")
        target_path = os.path.abspath(os.path.join(self.workspace_root, clean_rel))
        if not target_path.startswith(self.workspace_root):
            raise ValueError(f"Path traversal blocked: '{rel_path}' is outside workspace")

        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        with open(target_path, "w", encoding="utf-8") as f:
            f.write(content)

        self.terminal_history.append({
            "cmd": f"write {clean_rel}",
            "exit_code": 0,
            "bytes": len(content.encode("utf-8")),
            "status": "succeeded",
        })
        return target_path

    def list_files(self) -> List[Dict[str, Any]]:
        entries = []
        for root, dirs, files in os.walk(self.workspace_root):
            for file in files:
                full = os.path.join(root, file)
                rel = os.path.relpath(full, self.workspace_root)
                entries.append({
                    "name": rel,
                    "size": os.path.getsize(full),
                    "dir": False,
                })
        return entries


DEFAULT_DOTS: Dict[str, DotConfig] = {
    "scout": DotConfig(
        dot_id="scout",
        name="Scout",
        role="Deep Research & Web Specialist",
        instructions="Investigate topics, read documentation, and synthesize findings with citations.",
        permissions={"browser", "memory"},
    ),
    "forge": DotConfig(
        dot_id="forge",
        name="Forge",
        role="Coding & Autonomous Terminal Engineer",
        instructions="Write clean Python/TypeScript code, run unit tests in the Agent Computer, and propose fixes.",
        permissions={"files", "shell", "memory"},
    ),
    "scribe": DotConfig(
        dot_id="scribe",
        name="Scribe",
        role="Space & Documentation Architect",
        instructions="Turn research and conversations into structured, revision-safe Markdown pages in authorized Spaces.",
        permissions={"files", "memory"},
    ),
    "sentinel": DotConfig(
        dot_id="sentinel",
        name="Sentinel",
        role="System Diagnostics & Security Monitor",
        instructions="Monitor hardware telemetry, audit safety gates, and manage scheduled digests.",
        permissions={"memory"},
    ),
}
