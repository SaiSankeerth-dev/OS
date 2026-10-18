"""Base adapter for authorized AI web interfaces (ChatGPT, Claude, Gemini).

Handles session inspection, login verification, prompt submission, streaming wait,
and rate-limit detection.
"""
from __future__ import annotations

import abc
import logging
import re
import time
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

from server.computer.interface import (
    ActionResult,
    ComputerControlError,
    ComputerControlInterface,
    ObservationResult,
)

log = logging.getLogger("os.computer.ai_sites")


@dataclass
class AISiteResponse:
    site_name: str
    model: str
    prompt: str
    response_text: str
    code_blocks: List[Dict[str, str]] = field(default_factory=list)
    is_complete: bool = True
    rate_limited: bool = False
    rate_limit_details: Optional[Dict[str, Any]] = None
    duration_ms: float = 0.0


class BaseAISiteAdapter(abc.ABC):
    """Abstract interface for browser-driven AI website automation."""

    site_name: str = "base"
    home_url: str = ""

    def __init__(self, backend: ComputerControlInterface) -> None:
        self.backend = backend

    @abc.abstractmethod
    def is_logged_in(self, session_id: str) -> bool:
        """Check if active page state indicates an authenticated user session."""

    @abc.abstractmethod
    def wait_for_streaming_complete(self, session_id: str, timeout_sec: float = 120.0) -> bool:
        """Wait until generation completes (stop button disappears, send button re-enables)."""

    @abc.abstractmethod
    def extract_latest_response(self, session_id: str) -> AISiteResponse:
        """Extract the most recent assistant message, markdown code blocks, and metadata."""

    @abc.abstractmethod
    def detect_rate_limit(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Check if active UI exhibits quota cap, hourly cooldown, or model lockout."""

    def extract_code_blocks(self, text: str) -> List[Dict[str, str]]:
        """Parse markdown fenced code blocks into language and code string."""
        pattern = r"```([a-zA-Z0-9_\-\+]*)\n(.*?)```"
        matches = re.findall(pattern, text, re.DOTALL)
        return [{"language": lang.strip() or "text", "code": code.strip()} for lang, code in matches]

    def send_prompt(
        self,
        session_id: str,
        prompt: str,
        model: Optional[str] = None,
        timeout_sec: float = 120.0,
    ) -> AISiteResponse:
        """Standard pipeline: verify login -> input prompt -> submit -> await streaming -> parse."""
        t0 = time.time()
        # Verify authenticated session
        if not self.is_logged_in(session_id):
            raise ComputerControlError(
                f"User is not logged into {self.site_name} ({self.home_url}). Please log in via the browser profile.",
                backend=self.backend.name,
            )

        # Check for pre-existing rate limits
        rl = self.detect_rate_limit(session_id)
        if rl:
            return AISiteResponse(
                site_name=self.site_name,
                model=model or "default",
                prompt=prompt,
                response_text="",
                is_complete=False,
                rate_limited=True,
                rate_limit_details=rl,
            )

        # Execute submission (implemented in subclass)
        self._submit_prompt(session_id, prompt, model)

        # Await completion
        completed = self.wait_for_streaming_complete(session_id, timeout_sec)

        # Check for post-submission rate limits
        rl_after = self.detect_rate_limit(session_id)
        if rl_after:
            return AISiteResponse(
                site_name=self.site_name,
                model=model or "default",
                prompt=prompt,
                response_text="",
                is_complete=False,
                rate_limited=True,
                rate_limit_details=rl_after,
            )

        resp = self.extract_latest_response(session_id)
        resp.duration_ms = (time.time() - t0) * 1000
        resp.is_complete = completed
        return resp

    @abc.abstractmethod
    def _submit_prompt(self, session_id: str, prompt: str, model: Optional[str] = None) -> None:
        """Internal subclass method to fill text and click/send."""
