"""Claude site adapter for OS browser automation."""
from __future__ import annotations

import logging
import re
import time
from typing import Any, Dict, List, Optional

from server.computer.ai_sites.base import AISiteResponse, BaseAISiteAdapter
from server.computer.interface import ComputerControlInterface

log = logging.getLogger("os.computer.ai_sites.claude")


class ClaudeAdapter(BaseAISiteAdapter):
    site_name = "Claude"
    home_url = "https://claude.ai"

    def is_logged_in(self, session_id: str) -> bool:
        """Verify presence of Claude chat input or session token cookies."""
        obs = self.backend.observe_screen(session_id)
        text = (obs.text_content or "").lower()
        if "sign in" in text and "start a new chat" not in text and "how can claude help" not in text:
            dom = self.backend.inspect_page(session_id)
            elements = dom.dom_elements or []
            return any("contenteditable" in str(e.get("attributes", {})) for e in elements)
        return True

    def detect_rate_limit(self, session_id: str) -> Optional[Dict[str, Any]]:
        obs = self.backend.observe_screen(session_id)
        text = obs.text_content or ""
        patterns = [
            r"You are out of (?:free )?messages until ([0-9:]+\s*[APMapm]*)",
            r"Message limit reached",
            r"Claude is currently at capacity",
            r"Your message capacity will reset at ([0-9:]+\s*[APMapm]*)",
        ]
        for pat in patterns:
            m = re.search(pat, text, re.IGNORECASE)
            if m:
                return {
                    "is_limited": True,
                    "reason": m.group(0),
                    "reset_time": m.group(1) if m.groups() else None,
                    "site": self.site_name,
                }
        return None

    def _submit_prompt(self, session_id: str, prompt: str, model: Optional[str] = None) -> None:
        # Type into contenteditable prompt box
        target_selector = 'div[contenteditable="true"]'
        self.backend.type_text(session_id, prompt, target=target_selector)
        time.sleep(0.3)
        self.backend.press_key(session_id, "Enter")

    def wait_for_streaming_complete(self, session_id: str, timeout_sec: float = 120.0) -> bool:
        t0 = time.time()
        time.sleep(1.0)
        while (time.time() - t0) < timeout_sec:
            obs = self.backend.observe_screen(session_id)
            text = (obs.text_content or "").lower()
            if self.detect_rate_limit(session_id):
                return False
            # Check for stop button or active streaming indicators
            if "stop generating" in text or "stop response" in text:
                time.sleep(0.8)
                continue
            return True
        return False

    def extract_latest_response(self, session_id: str) -> AISiteResponse:
        obs = self.backend.observe_screen(session_id)
        text = obs.text_content or ""
        code_blocks = self.extract_code_blocks(text)
        return AISiteResponse(
            site_name=self.site_name,
            model="default",
            prompt="",
            response_text=text.strip(),
            code_blocks=code_blocks,
            is_complete=True,
        )
