"""Gemini site adapter for OS browser automation."""
from __future__ import annotations

import logging
import re
import time
from typing import Any, Dict, List, Optional

from server.computer.ai_sites.base import AISiteResponse, BaseAISiteAdapter
from server.computer.interface import ComputerControlInterface

log = logging.getLogger("os.computer.ai_sites.gemini")


class GeminiAdapter(BaseAISiteAdapter):
    site_name = "Gemini"
    home_url = "https://gemini.google.com"

    def is_logged_in(self, session_id: str) -> bool:
        """Verify presence of Google account sign-in vs active Gemini session."""
        obs = self.backend.observe_screen(session_id)
        text = (obs.text_content or "").lower()
        if "sign in" in text and "ask gemini" not in text and "how can i help" not in text:
            dom = self.backend.inspect_page(session_id)
            elements = dom.dom_elements or []
            return any("rich-textarea" in str(e.get("attributes", {})) for e in elements)
        return True

    def detect_rate_limit(self, session_id: str) -> Optional[Dict[str, Any]]:
        obs = self.backend.observe_screen(session_id)
        text = obs.text_content or ""
        patterns = [
            r"You['’]ve reached your (?:daily )?limit",
            r"Gemini is temporarily unavailable",
            r"Quota exceeded",
            r"Please try again in ([0-9:]+\s*[APMapm]*)",
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
        target_selector = 'div[contenteditable="true"], rich-textarea div'
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
            if "stop response" in text or "stop" in text:
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
