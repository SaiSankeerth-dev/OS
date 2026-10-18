"""Capability-aware computer-control backend registry.

Tracks health, capabilities, and intelligent routing across all five backends:
- Browser Harness (primary real browser)
- Windows Harness (native desktop automation)
- Browser Use Desktop (companion IPC / visual workflow)
- E2B Desktop Sandbox (isolated virtual sandbox, $0 guardrail by default)
- Skyvern (multi-step workflow extraction)
"""
from __future__ import annotations

import logging
import threading
from typing import Any, Dict, List, Optional

from server.computer.backends.base import BaseComputerBackend
from server.computer.backends.browser_harness import BrowserHarnessBackend
from server.computer.backends.browser_use_desktop import BrowserUseDesktopCompanion
from server.computer.backends.e2b_sandbox import E2BDesktopSandboxBackend
from server.computer.backends.docker_desktop import DockerDesktopBackend
from server.computer.backends.skyvern_adapter import SkyvernWorkflowBackend
from server.computer.backends.windows_harness import WindowsHarnessBackend
from server.computer.interface import (
    BackendCapabilities,
    BackendUnavailableError,
    ComputerControlError,
    ComputerControlInterface,
    HealthStatus,
)

log = logging.getLogger("os.computer.registry")


class ComputerBackendRegistry:
    """Central registry and intelligent router for computer-control backends."""

    def __init__(self) -> None:
        self._backends: Dict[str, ComputerControlInterface] = {}
        self._health_cache: Dict[str, HealthStatus] = {}
        self._lock = threading.Lock()
        self._initialize_default_backends()

    def _initialize_default_backends(self) -> None:
        """Instantiate default configurations for all 5 backends."""
        self._backends["browser_harness"] = BrowserHarnessBackend()
        self._backends["windows_harness"] = WindowsHarnessBackend()
        self._backends["browser_use_desktop"] = BrowserUseDesktopCompanion()
        self._backends["docker_desktop"] = DockerDesktopBackend(browser_harness=self._backends["browser_harness"])
        self._backends["e2b_sandbox"] = E2BDesktopSandboxBackend(allow_paid_cloud_sandboxes=False)
        self._backends["skyvern"] = SkyvernWorkflowBackend(allow_paid_cloud=False)

    def register_backend(self, name: str, backend: ComputerControlInterface) -> None:
        """Register or replace a backend adapter."""
        with self._lock:
            self._backends[name] = backend
            if name in self._health_cache:
                del self._health_cache[name]
            log.info(f"Registered computer backend '{name}' ({backend.__class__.__name__})")

    def get_backend(self, name: str) -> ComputerControlInterface:
        """Retrieve a specific backend by name."""
        with self._lock:
            if name not in self._backends:
                raise ComputerControlError(
                    f"Computer backend '{name}' is not registered. Available: {list(self._backends.keys())}",
                    backend="registry",
                )
            return self._backends[name]

    def list_backends(self) -> Dict[str, Dict[str, Any]]:
        """List all registered backends with their capabilities and cached health status."""
        with self._lock:
            if not self._health_cache:
                self._detect_capabilities_unlocked(force_refresh=False)
            result = {}
            for name, backend in self._backends.items():
                caps = backend.get_capabilities()
                health = self._health_cache.get(name)
                is_ready = bool(health and health.ok)
                result[name] = {
                    "name": name,
                    "class": backend.__class__.__name__,
                    "capabilities": {
                        "supports_browser": caps.supports_browser,
                        "supports_desktop": caps.supports_desktop,
                        "supports_virtual_sandbox": caps.supports_virtual_sandbox,
                        "supports_visual_clicks": caps.supports_visual_clicks,
                        "supports_dom_locators": caps.supports_dom_locators,
                        "supports_file_download": caps.supports_file_download,
                        "supports_auth_profiles": caps.supports_auth_profiles,
                        "cost_classification": caps.cost_classification.value,
                    },
                    "health": {
                        "ok": is_ready,
                        "status": "ready" if is_ready else "offline",
                        "message": health.message if health else "Not yet checked",
                        "details": health.details if health else {},
                    },
                }
            return result

    def _detect_capabilities_unlocked(self, force_refresh: bool = False) -> Dict[str, HealthStatus]:
        for name, backend in self._backends.items():
            if force_refresh or name not in self._health_cache:
                try:
                    self._health_cache[name] = backend.health_check()
                except Exception as e:
                    self._health_cache[name] = HealthStatus(
                        ok=False,
                        backend=name,
                        message=f"Health check failed: {e}",
                    )
        return dict(self._health_cache)

    def detect_capabilities(self, force_refresh: bool = False) -> Dict[str, HealthStatus]:
        """Perform on-demand health check across all registered backends."""
        with self._lock:
            return self._detect_capabilities_unlocked(force_refresh=force_refresh)

    def route_task(
        self,
        task_description: str = "",
        requires_isolation: bool = False,
        requires_desktop: bool = False,
        prefer_workflow: bool = False,
    ) -> ComputerControlInterface:
        """Select the most appropriate healthy backend for a task.

        Routing rules:
        1. If requires_isolation=True -> route to E2B Desktop Sandbox (if enabled)
        2. If requires_desktop=True -> route to Windows Harness (Windows native UI)
        3. If prefer_workflow=True and Skyvern is healthy -> route to Skyvern
        4. Default -> route to Browser Harness (primary authenticated browser)
        """
        self.detect_capabilities(force_refresh=False)

        # 1. Isolation / Untrusted code execution
        if requires_isolation:
            e2b = self.get_backend("e2b_sandbox")
            health = self._health_cache.get("e2b_sandbox")
            if health and health.ok:
                return e2b
            raise BackendUnavailableError(
                f"Isolated virtual sandbox requested but E2B is unavailable: {health.message if health else 'Unhealthy'}",
                backend="e2b_sandbox",
            )

        # 2. Desktop native controls
        if requires_desktop:
            for desk_name in ["docker_desktop", "windows_harness"]:
                try:
                    desk = self.get_backend(desk_name)
                    health = self._health_cache.get(desk_name)
                    if health and health.ok:
                        return desk
                except Exception:
                    pass
            win = self.get_backend("windows_harness")
            health = self._health_cache.get("windows_harness")
            raise BackendUnavailableError(
                f"Desktop automation requested but neither Docker Desktop nor Windows Harness is ready: {health.message if health else 'Offline'}",
                backend="docker_desktop",
            )

        # 3. Web workflow / structured extraction
        if prefer_workflow:
            sky = self.get_backend("skyvern")
            health = self._health_cache.get("skyvern")
            if health and health.ok:
                return sky
            log.info("Skyvern unavailable for workflow task; falling back to primary Browser Harness.")

        # 4. Primary browser automation (Browser Harness)
        bh = self.get_backend("browser_harness")
        bh_health = self._health_cache.get("browser_harness")
        if bh_health and bh_health.ok:
            return bh

        # If Browser Harness not ready, check if any browser backend is available
        for name in ["browser_use_desktop", "skyvern"]:
            cand = self.get_backend(name)
            h = self._health_cache.get(name)
            if h and h.ok and cand.get_capabilities().supports_browser:
                log.warning(f"Browser Harness unavailable; falling back to {name}")
                return cand

        # Return Browser Harness anyway so caller gets descriptive startup/health errors
        return bh


_GLOBAL_REGISTRY: Optional[ComputerBackendRegistry] = None
_REGISTRY_INIT_LOCK = threading.Lock()


def get_computer_registry() -> ComputerBackendRegistry:
    """Obtain or initialize the global ComputerBackendRegistry singleton."""
    global _GLOBAL_REGISTRY
    if _GLOBAL_REGISTRY is None:
        with _REGISTRY_INIT_LOCK:
            if _GLOBAL_REGISTRY is None:
                _GLOBAL_REGISTRY = ComputerBackendRegistry()
    return _GLOBAL_REGISTRY
