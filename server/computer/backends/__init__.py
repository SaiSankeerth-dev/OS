"""OS Computer Control Execution Backends."""
from __future__ import annotations

from .base import BaseComputerBackend
from .browser_harness import BrowserHarnessBackend
from .windows_harness import WindowsHarnessBackend
from .browser_use_desktop import BrowserUseDesktopCompanion
from .e2b_sandbox import E2BDesktopSandboxBackend
from .skyvern_adapter import SkyvernWorkflowBackend

__all__ = [
    "BaseComputerBackend",
    "BrowserHarnessBackend",
    "WindowsHarnessBackend",
    "BrowserUseDesktopCompanion",
    "E2BDesktopSandboxBackend",
    "SkyvernWorkflowBackend",
]
