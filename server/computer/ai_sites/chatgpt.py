"""ChatGPT site adapter for OS browser automation."""
from __future__ import annotations

import logging
import re
import time
from typing import Any, Dict, List, Optional

from server.computer.ai_sites.base import AISiteResponse, BaseAISiteAdapter
from server.computer.interface import ComputerControlInterface

log = logging.getLogger("os.computer.ai_sites.chatgpt")


class ChatGPTAdapter(BaseAISiteAdapter):
    site_name = "ChatGPT"
    home_url = "https://chatgpt.com"

    def is_logged_in(self, session_id: str) -> bool:
        """Inspect active page for authenticated prompt textarea vs login banner."""
        obs = self.backend.observe_screen(session_id)
        text = (obs.text_content or "").lower()
        # If explicitly showing login/signup prompts with no input area
        if ("log in" in text or "sign up" in text) and "ask anything" not in text and "message chatgpt" not in text:
            # Check DOM elements
            dom = self.backend.inspect_page(session_id)
            elements = dom.dom_elements or []
            has_input = any("prompt-textarea" in str(e.get("attributes", {})) for e in elements)
            return has_input
        return True

    def detect_rate_limit(self, session_id: str) -> Optional[Dict[str, Any]]:
        obs = self.backend.observe_screen(session_id)
        text = obs.text_content or ""
        time_match = re.search(
            r"(?:try again after|resets at|until|after)\s*([0-9:]+\s*(?:[APMapm]{2})?)",
            text,
            re.IGNORECASE,
        )
        reset_time = time_match.group(1).strip() if time_match else None

        patterns = [
            r"You['’]ve reached your (?:usage )?cap(?: for [a-zA-Z0-9\-\.]+)?",
            r"You have reached your limit",
            r"Too many requests",
            r"Rate limit reached",
            r"Try again after",
        ]
        for pat in patterns:
            m = re.search(pat, text, re.IGNORECASE)
            if m:
                return {
                    "is_limited": True,
                    "reason": m.group(0),
                    "reset_time": reset_time,
                    "site": self.site_name,
                }
        if reset_time:
            return {
                "is_limited": True,
                "reason": "Usage limit reached",
                "reset_time": reset_time,
                "site": self.site_name,
            }
        return None

    def _submit_prompt(self, session_id: str, prompt: str, model: Optional[str] = None) -> None:
        # Type into prompt textarea
        self.backend.type_text(session_id, prompt, target="#prompt-textarea")
        time.sleep(0.3)
        # Send via Enter or send button
        self.backend.press_key(session_id, "Enter")

    def wait_for_streaming_complete(self, session_id: str, timeout_sec: float = 120.0) -> bool:
        t0 = time.time()
        # Initial small delay to let streaming start
        time.sleep(1.0)
        while (time.time() - t0) < timeout_sec:
            obs = self.backend.observe_screen(session_id)
            text = (obs.text_content or "").lower()
            # If rate limit appeared, break immediately
            if self.detect_rate_limit(session_id):
                return False
            # If "stop generating" is present, generation is in progress
            if "stop generating" in text or "stop streaming" in text:
                time.sleep(0.8)
                continue
            # When stop button disappears, streaming is complete
            return True
        return False

    def extract_latest_response(self, session_id: str) -> AISiteResponse:
        obs = self.backend.observe_screen(session_id)
        text = obs.text_content or ""
        # Split on assistant responses or parse text
        code_blocks = self.extract_code_blocks(text)
        return AISiteResponse(
            site_name=self.site_name,
            model="default",
            prompt="",
            response_text=text.strip(),
            code_blocks=code_blocks,
            is_complete=True,
        )
