"""OS Computer Control & Automation Subsystem.

Provides unified computer-use capabilities across local browsers, native desktop
controls, and virtual sandboxes under a single lifecycle-governed architecture.
"""
from __future__ import annotations

from .interface import (
    ActionResult,
    BackendCapabilities,
    ComputerControlError,
    ComputerControlInterface,
    HealthStatus,
    ObservationResult,
    SessionState,
    TabInfo,
    WindowInfo,
)

__all__ = [
    "ActionResult",
    "BackendCapabilities",
    "ComputerControlError",
    "ComputerControlInterface",
    "HealthStatus",
    "ObservationResult",
    "SessionState",
    "TabInfo",
    "WindowInfo",
]
