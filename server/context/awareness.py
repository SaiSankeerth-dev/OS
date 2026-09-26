"""Context awareness - screen, app, window, project tracking."""
from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


class AwarenessState(Enum):
    IDLE = "idle"
    LISTENING = "listening"
    PROCESSING = "processing"
    SPEAKING = "speaking"


@dataclass
class UserContext:
    """Current user context snapshot."""
    current_application: str = ""
    current_window_title: str = ""
    current_browser_tab: str = ""
    current_project: str = ""
    screen_content: str = ""  # summarized/sanitized
    selected_text: str = ""


class ContextAwareness:
    """Tracks what the user is currently doing.

    Phase 8: basic application/window tracking.
    Phase 9+: screen capture, DOM access, selected content.
    """

    def __init__(self) -> None:
        self.state: AwarenessState = AwarenessState.IDLE
        self.context: UserContext = UserContext()
        self._last_update: float = 0.0

    def update(self, **kwargs: object) -> None:
        """Update context fields."""
        for key, value in kwargs.items():
            if hasattr(self.context, key):
                setattr(self.context, key, value)
        self._last_update = __import__("time").time()

    def get_context_for_llm(self) -> str:
        """Build a compact LLM-context string from current awareness."""
        parts: list[str] = []
        if self.context.current_application:
            parts.append(f"app: {self.context.current_application}")
        if self.context.current_window_title:
            parts.append(f"window: {self.context.current_window_title}")
        if self.context.current_project:
            parts.append(f"project: {self.context.current_project}")
        if self.context.selected_text:
            parts.append(f"selected: {self.context.selected_text}")
        if self.context.screen_content:
            parts.append(f"screen: {self.context.screen_content[:200]}")
        return " | ".join(parts) if parts else ""