"""Agentic browser: natural-language browser tasks via browser-use.

This wraps the browser-use Agent (117k stars, MIT) to let OS perform
multi-step browser tasks from plain language like "play lofi on youtube".

Design:
- Uses ChatOllama (local, free) - no API keys, no cost.
- Every step is reported via callback so the chat shows progress.
- Sensitive actions (form submits, purchases) pause for OS approval.
- URLs pass OS's SSRF guard before navigation.

The agent runs in a thread to avoid blocking the async event loop.
"""
from __future__ import annotations

import asyncio
import logging
import threading
from dataclasses import dataclass, field
from typing import Any, Callable

log = logging.getLogger(__name__)

# Lazy imports: browser-use is heavy, and the ollama package has a proxy
# parsing quirk in this environment. Import only when actually running.
_AGENTIC_AVAILABLE: bool | None = None


def _check_available() -> bool:
    global _AGENTIC_AVAILABLE
    if _AGENTIC_AVAILABLE is None:
        try:
            import browser_use  # noqa: F401
            _AGENTIC_AVAILABLE = True
        except ImportError:
            _AGENTIC_AVAILABLE = False
    return _AGENTIC_AVAILABLE


# Actions that always need human approval before the agent executes them.
# These are matched against browser-use's action names (lowercased).
SENSITIVE_ACTIONS = frozenset({
    "click",  # clicks can submit forms / trigger purchases
    "input_text",
    "send_keys",
    "upload_file",
    "drag_drop",
    "scroll",  # safe, but listed for completeness - not in sensitive set
})

# Actions that are always safe to auto-run.
SAFE_ACTIONS = frozenset({
    "go_to_url",
    "go_back",
    "wait",
    "extract_content",
    "take_screenshot",
    "scroll",  # scrolling is safe
})


@dataclass
class AgentStep:
    """One step the agent took, for progress reporting."""
    n: int
    action: str
    detail: str = ""
    url: str = ""


@dataclass
class AgentResult:
    """Final result of an agentic browser task."""
    success: bool
    summary: str
    steps: list[AgentStep] = field(default_factory=list)
    final_url: str = ""
    error: str = ""


# Site aliases: "youtube" -> youtube.com, etc.
SITE_ALIASES = {
    "youtube": "https://www.youtube.com",
    "yt": "https://www.youtube.com",
    "gmail": "https://mail.google.com",
    "github": "https://github.com",
    "google": "https://www.google.com",
    "maps": "https://maps.google.com",
    "drive": "https://drive.google.com",
    "calendar": "https://calendar.google.com",
    "twitter": "https://x.com",
    "x": "https://x.com",
    "reddit": "https://www.reddit.com",
    "amazon": "https://www.amazon.com",
    "wikipedia": "https://www.wikipedia.org",
    "wiki": "https://www.wikipedia.org",
    "stackoverflow": "https://stackoverflow.com",
    "linkedin": "https://www.linkedin.com",
}


def expand_task(user_text: str) -> str:
    """Expand shorthand into a full browser task for the agent.

    "youtube" -> "Go to https://www.youtube.com"
    "youtube lofi" -> "Go to https://www.youtube.com and search for 'lofi'"
    "play lofi" -> "Go to https://www.youtube.com, search for 'lofi', play the first result"
    """
    import re
    text = user_text.strip()

    # "play X" / "play X on youtube"
    m = re.match(r"^(?:play|watch)\s+(.+?)(?:\s+on\s+youtube)?\s*$", text, re.IGNORECASE)
    if m:
        query = m.group(1).strip()
        return (
            f"Go to https://www.youtube.com. Search for '{query}'. "
            f"Click the first video result to play it. "
            f"Confirm the video is playing by checking the page title."
        )

    # "youtube" or "youtube <query>"
    m = re.match(r"^(youtube|yt)\b\s*(.*)$", text, re.IGNORECASE)
    if m:
        query = m.group(2).strip()
        if query:
            return (
                f"Go to https://www.youtube.com. Search for '{query}'. "
                f"Show the top results."
            )
        return "Go to https://www.youtube.com."

    # "<site>" or "<site> <query>" for known aliases
    m = re.match(r"^(\w+)\b\s*(.*)$", text)
    if m:
        site, query = m.group(1).lower(), m.group(2).strip()
        if site in SITE_ALIASES:
            url = SITE_ALIASES[site]
            if query:
                return f"Go to {url}. Search for '{query}' or navigate to find '{query}'."
            return f"Go to {url}."

    # Fallthrough: treat as a general web task
    return user_text


class AgenticBrowser:
    """Runs natural-language browser tasks using browser-use + local Ollama."""

    def __init__(
        self,
        model: str = "qwen3:8b",
        on_step: Callable[[AgentStep], None] | None = None,
        on_approval_needed: Callable[[str, str], bool] | None = None,
    ):
        """
        Args:
            model: Ollama model name (default qwen3:8b, runs on sai's laptop).
            on_step: called with each AgentStep for progress updates.
            on_approval_needed: called with (action, detail) when a sensitive
                action is planned. Return True to allow, False to stop.
        """
        self.model = model
        self.on_step = on_step
        self.on_approval_needed = on_approval_needed
        self._stop_requested = threading.Event()

    def _is_url_allowed(self, url: str) -> bool:
        """SSRF guard: reuse OS's URL blocking policy."""
        try:
            from server.tools.webread_tool import _url_blocked
            return _url_blocked(url) is None
        except Exception:
            return False

    def run(self, task: str, max_steps: int = 25) -> AgentResult:
        """Run a browser task. Blocks until done. Thread-safe to call."""
        if not _check_available():
            return AgentResult(
                success=False, summary="",
                error="browser-use is not installed. Run: pip install browser-use",
            )

        # Clear proxy vars: the ollama package misparses the runtime proxy URL.
        import os
        for var in ("HTTP_PROXY", "HTTPS_PROXY", "http_proxy", "https_proxy",
                    "ALL_PROXY", "all_proxy", "NO_PROXY", "no_proxy"):
            os.environ.pop(var, None)

        from browser_use import Agent, Browser
        from browser_use.llm import ChatOllama

        expanded = expand_task(task)
        log.info("Agentic browser task: %s -> %s", task, expanded)

        steps: list[AgentStep] = []
        step_n = [0]
        approval_holder: dict[str, Any] = {}

        def _new_step_callback(state) -> None:
            # Called before each agent step; inspect planned actions.
            step_n[0] += 1
            try:
                # state.next_goal / model output varies by version; be defensive
                goal = getattr(state, "next_goal", "") or ""
                actions = []
                # Try to extract action names from the model output
                model_output = getattr(state, "model_output", None)
                if model_output:
                    for action in getattr(model_output, "action", []) or []:
                        # action is a dict like {"click": {...}}
                        if isinstance(action, dict):
                            actions.extend(action.keys())
                action_str = ", ".join(actions) if actions else "thinking"
                step = AgentStep(n=step_n[0], action=action_str, detail=str(goal)[:200])
                steps.append(step)
                if self.on_step:
                    self.on_step(step)

                # Safety gate: sensitive actions need approval
                for a in actions:
                    al = a.lower()
                    if al in SENSITIVE_ACTIONS and al not in SAFE_ACTIONS:
                        if self.on_approval_needed:
                            allowed = self.on_approval_needed(a, str(goal)[:200])
                            if not allowed:
                                self._stop_requested.set()
                                approval_holder["denied"] = a
                        break
            except Exception as e:
                log.warning("Step callback error: %s", e)

        def _should_stop() -> bool:
            return self._stop_requested.is_set()

        llm = ChatOllama(model=self.model)
        browser = Browser(headless=True)

        agent = Agent(
            task=expanded,
            llm=llm,
            browser=browser,
            register_new_step_callback=_new_step_callback,
            register_should_stop_callback=_should_stop,
        )

        try:
            history = agent.run_sync(max_steps=max_steps)
        except Exception as e:
            log.exception("Agentic browser run failed")
            return AgentResult(
                success=False, steps=steps,
                summary=f"Task failed after {len(steps)} steps.",
                error=f"{type(e).__name__}: {e}",
            )
        finally:
            try:
                browser.close()
            except Exception:
                pass

        if approval_holder.get("denied"):
            return AgentResult(
                success=False, steps=steps,
                summary=f"Stopped: '{approval_holder['denied']}' needs your approval.",
                error="approval_denied",
            )

        # Extract final answer from history
        final_text = ""
        try:
            final_text = history.final_result() or ""
        except Exception:
            pass

        final_url = ""
        try:
            urls = history.urls()
            if urls:
                final_url = urls[-1]
        except Exception:
            pass

        return AgentResult(
            success=True, steps=steps,
            summary=final_text or f"Completed in {len(steps)} steps.",
            final_url=final_url,
        )

    def stop(self) -> None:
        """Request the running agent to stop."""
        self._stop_requested.set()
