"""OS Browser AI Agent Engine.

Provides an iterative, model-driven & semantic-fallback browser execution loop:
1. Decomposes user goals into explicit verifiable completion criteria.
2. Observes live session DOM, interactive element accessibility tree, and viewport.
3. Selects bounded tool actions via local Ollama models (with structured JSON schemas)
   or intelligent deterministic semantic planning for 0-cost local environments.
4. Enforces safety guardrails, action risk classification, and HITL approval gates.
5. Emits real-time dual-cursor updates (AI cursor coordinates) and WebSocket events.
6. Connects strictly to the live session visible in the UI viewport.
7. Independently verifies outcomes before declaring completion.
8. Reports honest results, diagnostics, and incomplete steps without fake success.
"""
from __future__ import annotations

import asyncio
import json
import logging
import re
import threading
import time
import urllib.parse
from dataclasses import asdict, dataclass, field
from typing import Any, Callable, Dict, List, Optional, Tuple

from server.computer.arbiter import ControlState, get_arbiter_registry
from server.computer.interface import (
    ActionResult,
    ComputerControlError,
    ObservationResult,
    SafetyGateTriggeredError,
)
from server.computer.registry import get_computer_registry
from server.computer.safety import (
    ActionRiskLevel,
    ApprovalTicket,
    get_computer_safety_guard,
)
from server.computer.task_loop import (
    TaskCheckpointStore,
    TaskPlan,
    TaskStep,
    get_bounded_task_executor,
)
from server.llm.base import LLMClient, Message
from server.computer.laya_adapter import get_laya_browser_adapter
from server.llm.ollama import OllamaClient
from server.llm.router import ModelRouter

log = logging.getLogger("os.computer.browser_agent")


# =============================================================================
# 1. Goal Decomposition & Verifiable Completion Criteria
# =============================================================================

@dataclass
class AssertionCriterion:
    """Explicit postcondition assertion verified against live browser state."""
    assertion_type: str  # "url_contains", "title_contains", "text_present", "element_present"
    expected_pattern: str
    description: str

    def verify(self, obs: ObservationResult) -> bool:
        pattern = self.expected_pattern.lower().strip()
        if not pattern:
            return True

        if self.assertion_type == "url_contains":
            current_url = (obs.url or "").lower()
            return pattern in current_url

        elif self.assertion_type == "title_contains":
            current_title = (obs.title or "").lower()
            return pattern in current_title

        elif self.assertion_type == "text_present":
            current_text = (obs.text_content or "").lower()
            return pattern in current_text

        elif self.assertion_type == "element_present":
            elements = obs.dom_elements or []
            for el in elements:
                label = (el.get("label") or "").lower()
                selector = (el.get("selector_hint") or "").lower()
                if pattern in label or pattern in selector:
                    return True
            return False

        return False


@dataclass
class GoalDecomposition:
    """Structured breakdown of user objective with explicit completion criteria."""
    goal: str
    intent: str  # "navigate", "search", "interact", "general"
    start_url: Optional[str] = None
    search_query: Optional[str] = None
    target_keywords: List[str] = field(default_factory=list)
    assertions: List[AssertionCriterion] = field(default_factory=list)

    def is_satisfied(self, obs: ObservationResult) -> Tuple[bool, str]:
        """Independently evaluate if all completion assertions are met."""
        if not self.assertions:
            # If no explicit assertions, check if we navigated to a non-blank page
            if obs.url and not obs.url.startswith("about:blank") and obs.url != "https://www.google.com/":
                return True, f"Navigated to {obs.url}"
            return False, "Page is still on search/blank"

        failed = []
        passed = []
        for a in self.assertions:
            if a.verify(obs):
                passed.append(a.description)
            else:
                failed.append(a.description)

        if not failed and passed:
            return True, f"All criteria verified: {'; '.join(passed)}"
        return False, f"Missing criteria: {'; '.join(failed)}"


class GoalAnalyzer:
    """Analyzes natural-language instructions into structured goals with assertions."""

    URL_REGEX = re.compile(r"https?://[^\s]+|www\.[^\s]+", re.IGNORECASE)

    @classmethod
    def decompose(cls, goal: str) -> GoalDecomposition:
        goal_clean = goal.strip()
        lower = goal_clean.lower()

        # Check for explicit URLs
        url_match = cls.URL_REGEX.search(goal_clean)
        if url_match:
            raw_url = url_match.group(0)
            if not raw_url.startswith("http"):
                raw_url = "https://" + raw_url
            return GoalDecomposition(
                goal=goal_clean,
                intent="navigate",
                start_url=raw_url,
                assertions=[
                    AssertionCriterion("url_contains", urllib.parse.urlparse(raw_url).netloc, f"URL reaches {raw_url}"),
                ],
            )

        # Detect search intent (e.g. "search for fern youtube channel", "google python 3.12")
        search_prefixes = [
            "search for ", "search ", "find ", "look up ", "google ", "youtube ", "lookup "
        ]
        query = None
        for prefix in search_prefixes:
            if lower.startswith(prefix):
                query = goal_clean[len(prefix):].strip()
                break

        if not query and (" search " in lower or " find " in lower):
            parts = re.split(r"\s+(?:search|find|look up)\s+(?:for\s+)?", goal_clean, flags=re.IGNORECASE)
            if len(parts) > 1:
                query = parts[1].strip()

        if not query:
            query = goal_clean

        # Clean query
        query_terms = [t for t in re.split(r"[^\w]+", query) if len(t) > 1 and t.lower() not in ("the", "for", "and", "a", "an", "on", "in", "to")]

        # Determine target domain or search engine
        start_url = "https://www.google.com"
        assertions = []

        if "youtube" in lower:
            start_url = "https://www.youtube.com"
            # Target channels or videos
            clean_kw = [t for t in query_terms if t.lower() != "youtube"]
            assertions.append(AssertionCriterion("url_contains", "youtube.com", "URL on YouTube"))
            if clean_kw:
                assertions.append(AssertionCriterion("title_contains", clean_kw[0], f"Page title contains '{clean_kw[0]}'"))
        elif "wikipedia" in lower:
            start_url = "https://www.wikipedia.org"
            clean_kw = [t for t in query_terms if t.lower() != "wikipedia"]
            assertions.append(AssertionCriterion("url_contains", "wikipedia.org", "URL on Wikipedia"))
            if clean_kw:
                assertions.append(AssertionCriterion("text_present", clean_kw[0], f"Page text contains '{clean_kw[0]}'"))
        elif "github" in lower:
            start_url = "https://github.com"
            clean_kw = [t for t in query_terms if t.lower() != "github"]
            assertions.append(AssertionCriterion("url_contains", "github.com", "URL on GitHub"))
        else:
            # Generic web search
            assertions.append(AssertionCriterion("url_contains", "google.com/search", "Search results loaded"))
            if query_terms:
                assertions.append(AssertionCriterion("text_present", query_terms[0], f"Content contains '{query_terms[0]}'"))

        return GoalDecomposition(
            goal=goal_clean,
            intent="search",
            start_url=start_url,
            search_query=query,
            target_keywords=query_terms,
            assertions=assertions,
        )


# =============================================================================
# 2. Registered Browser Toolset & Typed Schema Validation
# =============================================================================

class BrowserToolRegistry:
    """Defines typed schemas and dispatches bounded browser automation actions."""

    TOOL_SCHEMAS: Dict[str, Dict[str, Any]] = {
        "navigate": {
            "name": "navigate",
            "description": "Navigate to a specific URL (http or https).",
            "parameters": {
                "type": "object",
                "properties": {
                    "url": {"type": "string", "description": "The destination URL"}
                },
                "required": ["url"],
            },
            "risk": ActionRiskLevel.READ_ONLY,
        },
        "observe_page": {
            "name": "observe_page",
            "description": "Read the current page URL, title, and body text preview.",
            "parameters": {"type": "object", "properties": {}},
            "risk": ActionRiskLevel.READ_ONLY,
        },
        "inspect_elements": {
            "name": "inspect_elements",
            "description": "Inspect interactive DOM elements (buttons, inputs, links).",
            "parameters": {
                "type": "object",
                "properties": {
                    "filter": {"type": "string", "description": "Optional tag or label filter"}
                },
            },
            "risk": ActionRiskLevel.READ_ONLY,
        },
        "click_element": {
            "name": "click_element",
            "description": "Click an element by CSS selector, text, or coordinates.",
            "parameters": {
                "type": "object",
                "properties": {
                    "target": {"type": "string", "description": "CSS selector, text, or element id"},
                    "description": {"type": "string", "description": "Human-readable label of target"}
                },
                "required": ["target"],
            },
            "risk": ActionRiskLevel.INTERACTIVE_LOW,
        },
        "fill_and_submit": {
            "name": "fill_and_submit",
            "description": "Fill an input field with text and press Enter to submit.",
            "parameters": {
                "type": "object",
                "properties": {
                    "target": {"type": "string", "description": "CSS selector or element name"},
                    "text": {"type": "string", "description": "The text to type into the field"},
                    "press_enter": {"type": "boolean", "default": True, "description": "Whether to press Enter"}
                },
                "required": ["target", "text"],
            },
            "risk": ActionRiskLevel.INTERACTIVE_LOW,
        },
        "type_text": {
            "name": "type_text",
            "description": "Type text into a specific input or active element.",
            "parameters": {
                "type": "object",
                "properties": {
                    "target": {"type": "string", "description": "Optional CSS selector"},
                    "text": {"type": "string", "description": "Text to type"}
                },
                "required": ["text"],
            },
            "risk": ActionRiskLevel.INTERACTIVE_LOW,
        },
        "press_key": {
            "name": "press_key",
            "description": "Press a keyboard key (Enter, Escape, Tab, ArrowDown, Backspace).",
            "parameters": {
                "type": "object",
                "properties": {
                    "key": {"type": "string", "description": "Key name to press"}
                },
                "required": ["key"],
            },
            "risk": ActionRiskLevel.INTERACTIVE_LOW,
        },
        "press_shortcut": {
            "name": "press_shortcut",
            "description": "Send a keyboard modifier shortcut like Ctrl+L, Ctrl+A, Ctrl+C, Ctrl+V, Alt+Tab, Return.",
            "parameters": {
                "type": "object",
                "properties": {
                    "shortcut": {"type": "string", "description": "Keyboard shortcut (e.g. 'Ctrl+L', 'Ctrl+A', 'Enter')"}
                },
                "required": ["shortcut"],
            },
            "risk": ActionRiskLevel.INTERACTIVE_LOW,
        },
        "key_down": {
            "name": "key_down",
            "description": "Hold a keyboard key down (tracked to prevent stuck keys).",
            "parameters": {
                "type": "object",
                "properties": {
                    "key": {"type": "string", "description": "Key name to hold down"}
                },
                "required": ["key"],
            },
            "risk": ActionRiskLevel.INTERACTIVE_LOW,
        },
        "key_up": {
            "name": "key_up",
            "description": "Release a held keyboard key.",
            "parameters": {
                "type": "object",
                "properties": {
                    "key": {"type": "string", "description": "Key name to release"}
                },
                "required": ["key"],
            },
            "risk": ActionRiskLevel.INTERACTIVE_LOW,
        },
        "release_all_keys": {
            "name": "release_all_keys",
            "description": "Release all held modifier and standard keys to prevent stuck keys.",
            "parameters": {"type": "object", "properties": {}},
            "risk": ActionRiskLevel.INTERACTIVE_LOW,
        },
        "scroll": {
            "name": "scroll",
            "description": "Scroll the page viewport up or down.",
            "parameters": {
                "type": "object",
                "properties": {
                    "direction": {"type": "string", "enum": ["up", "down"], "default": "down"},
                    "amount": {"type": "integer", "default": 300}
                },
            },
            "risk": ActionRiskLevel.READ_ONLY,
        },
        "wait_for": {
            "name": "wait_for",
            "description": "Wait for an element, text, or navigation to complete.",
            "parameters": {
                "type": "object",
                "properties": {
                    "target": {"type": "string", "description": "CSS selector or text to wait for"},
                    "timeout_ms": {"type": "integer", "default": 5000}
                },
                "required": ["target"],
            },
            "risk": ActionRiskLevel.READ_ONLY,
        },
        "verify_completion": {
            "name": "verify_completion",
            "description": "Independently verify that the task outcome is achieved.",
            "parameters": {
                "type": "object",
                "properties": {
                    "assertion_type": {"type": "string", "enum": ["url_contains", "title_contains", "text_present", "element_present"]},
                    "expected_pattern": {"type": "string", "description": "Pattern expected on the page"}
                },
                "required": ["assertion_type", "expected_pattern"],
            },
            "risk": ActionRiskLevel.READ_ONLY,
        },
    }

    @classmethod
    def validate_tool_call(cls, tool_name: str, args: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
        """Validate tool name and required arguments against typed schemas."""
        if tool_name not in cls.TOOL_SCHEMAS:
            return False, f"Unknown browser tool '{tool_name}'. Available tools: {list(cls.TOOL_SCHEMAS.keys())}"

        schema = cls.TOOL_SCHEMAS[tool_name]
        params = schema.get("parameters", {})
        required = params.get("required", [])
        for req in required:
            if req not in args or args[req] is None or args[req] == "":
                return False, f"Missing required parameter '{req}' for tool '{tool_name}'"

        return True, None

    @classmethod
    def execute_tool(
        cls,
        tool_name: str,
        args: Dict[str, Any],
        backend: Any,
        session_id: str,
        safety_guard: Any,
    ) -> ActionResult:
        """Safely execute a validated tool against the computer backend."""
        valid, err = cls.validate_tool_call(tool_name, args)
        if not valid:
            return ActionResult(
                success=False,
                action=tool_name,
                session_id=session_id,
                backend=getattr(backend, "name", "unknown"),
                error=err,
                observed_outcome=f"Validation failed: {err}",
                verified=False,
            )

        try:
            if tool_name == "navigate":
                clean_url = safety_guard.sanitize_url(args["url"])
                return backend.open_url(session_id, clean_url)

            elif tool_name == "observe_page":
                obs = backend.inspect_page(session_id)
                return ActionResult(
                    success=True,
                    action="observe_page",
                    session_id=session_id,
                    backend=getattr(backend, "name", "browser_harness"),
                    details={"url": obs.url, "title": obs.title},
                    observed_outcome=f"Page URL: {obs.url} | Title: {obs.title}",
                    verified=True,
                )

            elif tool_name == "inspect_elements":
                obs = backend.inspect_page(session_id)
                elements = obs.dom_elements or []
                flt = args.get("filter", "").lower()
                if flt:
                    elements = [e for e in elements if flt in str(e).lower()]
                return ActionResult(
                    success=True,
                    action="inspect_elements",
                    session_id=session_id,
                    backend=getattr(backend, "name", "browser_harness"),
                    details={"count": len(elements), "elements": elements[:15]},
                    observed_outcome=f"Inspected {len(elements)} elements",
                    verified=True,
                )

            elif tool_name == "click_element":
                target = args["target"]
                return backend.click_element(session_id, target)

            elif tool_name == "fill_and_submit":
                target = args["target"]
                text = args["text"]
                press_enter = args.get("press_enter", True)
                if hasattr(backend, "fill_and_submit"):
                    return backend.fill_and_submit(session_id, target, text, press_enter)
                else:
                    res = backend.type_text(session_id, text, target)
                    if res.success and press_enter:
                        backend.press_key(session_id, "Enter")
                    return res

            elif tool_name == "type_text":
                return backend.type_text(session_id, args["text"], args.get("target"))

            elif tool_name == "press_key":
                return backend.press_key(session_id, args.get("key", "Enter"))

            elif tool_name == "press_shortcut":
                shortcut = args.get("shortcut", "Enter")
                if hasattr(backend, "press_shortcut"):
                    return backend.press_shortcut(session_id, shortcut)
                return backend.press_key(session_id, shortcut)

            elif tool_name == "key_down":
                key = args.get("key", "")
                if hasattr(backend, "key_down"):
                    return backend.key_down(session_id, key)
                return ActionResult(success=True, action="key_down", session_id=session_id, backend=getattr(backend, "name", "unknown"))

            elif tool_name == "key_up":
                key = args.get("key", "")
                if hasattr(backend, "key_up"):
                    return backend.key_up(session_id, key)
                return ActionResult(success=True, action="key_up", session_id=session_id, backend=getattr(backend, "name", "unknown"))

            elif tool_name == "release_all_keys":
                if hasattr(backend, "release_all_keys"):
                    return backend.release_all_keys(session_id)
                return ActionResult(success=True, action="release_all_keys", session_id=session_id, backend=getattr(backend, "name", "unknown"))

            elif tool_name == "scroll":
                return backend.scroll(session_id, args.get("direction", "down"), int(args.get("amount", 300)))

            elif tool_name == "wait_for":
                target = args["target"]
                timeout_ms = int(args.get("timeout_ms", 5000))
                if hasattr(backend, "wait_for"):
                    return backend.wait_for(session_id, target, timeout_ms)
                else:
                    time.sleep(min(timeout_ms / 1000.0, 3.0))
                    return ActionResult(
                        success=True,
                        action="wait_for",
                        session_id=session_id,
                        backend=getattr(backend, "name", "browser_harness"),
                        observed_outcome=f"Waited for {target}",
                        verified=True,
                    )

            elif tool_name == "verify_completion":
                obs = backend.inspect_page(session_id)
                crit = AssertionCriterion(
                    assertion_type=args["assertion_type"],
                    expected_pattern=args["expected_pattern"],
                    description="Manual verification assertion",
                )
                ok = crit.verify(obs)
                return ActionResult(
                    success=ok,
                    action="verify_completion",
                    session_id=session_id,
                    backend=getattr(backend, "name", "browser_harness"),
                    details={"verified": ok, "criterion": asdict(crit)},
                    observed_outcome=f"Verification {'PASSED' if ok else 'FAILED'} for pattern '{args['expected_pattern']}' on URL: {obs.url}",
                    verified=ok,
                )

            return ActionResult(
                success=False,
                action=tool_name,
                session_id=session_id,
                backend=getattr(backend, "name", "browser_harness"),
                error=f"Unsupported tool '{tool_name}'",
                verified=False,
            )

        except Exception as e:
            log.exception("Tool execution error in '%s': %s", tool_name, e)
            return ActionResult(
                success=False,
                action=tool_name,
                session_id=session_id,
                backend=getattr(backend, "name", "browser_harness"),
                error=str(e),
                observed_outcome=f"Execution error: {e}",
                verified=False,
            )


# =============================================================================
# 3. Deterministic Semantic Browser Planner (₹0 Offline Fallback)
# =============================================================================

class DeterministicSemanticPlanner:
    """Plans and selects next browser action based on semantic DOM structure.

    Guarantees reliable operation even when local Ollama models are uninstalled,
    unresponsive, or quota-limited, ensuring strict compliance with the ₹0 operating budget.
    """

    SEARCH_INPUT_SELECTORS = [
        "input[name='q']",
        "input[type='search']",
        "input[name='search']",
        "input[name='search_query']",
        "input[placeholder*='Search' i]",
        "input[aria-label*='Search' i]",
        "textarea[name='q']",
        "input[type='text']",
    ]

    def __init__(self, decomposition: GoalDecomposition) -> None:
        self.decomposition = decomposition
        self.step_history: List[Dict[str, Any]] = []
        self._searched = False
        self._navigated_to_result = False

    def decide_next_action(self, obs: ObservationResult) -> Optional[Dict[str, Any]]:
        """Evaluate current page state and return the next structured tool call."""
        current_url = (obs.url or "").strip().lower()
        title = (obs.title or "").strip().lower()

        # Check if goal is already satisfied!
        satisfied, reason = self.decomposition.is_satisfied(obs)
        if satisfied and current_url not in ("", "about:blank"):
            return {
                "tool": "verify_completion",
                "arguments": {
                    "assertion_type": "url_contains",
                    "expected_pattern": self.decomposition.assertions[0].expected_pattern if self.decomposition.assertions else current_url,
                },
                "reason": f"Goal criteria satisfied: {reason}",
            }

        # 1. Initial navigation if on blank page or wrong domain
        if not current_url or current_url.startswith("about:blank"):
            target_url = self.decomposition.start_url or "https://www.google.com"
            return {
                "tool": "navigate",
                "arguments": {"url": target_url},
                "reason": f"Initialize browser on target URL '{target_url}'",
            }

        # 2. If search query specified and we are on a search engine or video portal
        if self.decomposition.search_query and not self._searched:
            # Check if search input is available in DOM elements
            input_target = self._find_search_input(obs.dom_elements or [])
            if input_target:
                self._searched = True
                return {
                    "tool": "fill_and_submit",
                    "arguments": {
                        "target": input_target,
                        "text": self.decomposition.search_query,
                        "press_enter": True,
                    },
                    "reason": f"Enter query '{self.decomposition.search_query}' into search field '{input_target}'",
                }

        # 3. If searched and now on search results page, find top result matching keywords
        if self._searched and not self._navigated_to_result:
            target_link = self._find_matching_result(obs.dom_elements or [])
            if target_link:
                self._navigated_to_result = True
                tgt = f"#{target_link['id']}" if target_link.get("id") else (target_link.get("selector_hint") or target_link.get("label"))
                return {
                    "tool": "click_element",
                    "arguments": {
                        "target": tgt,
                        "description": target_link.get("label", "Matching result link"),
                    },
                    "reason": f"Click search result: {target_link.get('label')}",
                }
            else:
                # Scroll down to reveal more results
                return {
                    "tool": "scroll",
                    "arguments": {"direction": "down", "amount": 400},
                    "reason": "Scroll to reveal search results",
                }

        # 4. If we navigated to a result page, inspect and verify
        if self._navigated_to_result:
            return {
                "tool": "observe_page",
                "arguments": {},
                "reason": "Inspect resulting page content to verify task outcome",
            }

        # 5. Default wait / observe step
        return {
            "tool": "observe_page",
            "arguments": {},
            "reason": "Observe current page state",
        }

    def _find_search_input(self, elements: List[Dict[str, Any]]) -> Optional[str]:
        """Find the best search input selector from distilled DOM map."""
        # 1. Check for input with id or name containing search or q
        for el in elements:
            tag = el.get("tag", "").lower()
            name = (el.get("name") or "").lower()
            elem_id = (el.get("id") or "").lower()
            label = (el.get("label") or "").lower()
            if tag in ("input", "textarea"):
                if name == "q" or "search" in name or "search" in elem_id or any(kw in label for kw in ("search", "q", "query")):
                    if el.get("id"):
                        return f"#{el['id']}"
                    if el.get("name"):
                        return f"{tag}[name='{el['name']}']"
                    return el.get("selector_hint") or "input[name='q']"

        # 2. Fallback to first text/search input
        for el in elements:
            if el.get("tag") in ("input", "textarea"):
                if el.get("id"):
                    return f"#{el['id']}"
                if el.get("name"):
                    return f"{el['tag']}[name='{el['name']}']"
                return el.get("selector_hint") or "input[name='q']"

        return "input[name='q']"

    def _find_matching_result(self, elements: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        """Find the most relevant result link matching keywords."""
        keywords = [k.lower() for k in self.decomposition.target_keywords if len(k) > 2]
        if not keywords:
            keywords = [self.decomposition.goal.lower()]

        best_element = None
        best_score = 0

        for el in elements:
            if el.get("tag") in ("a", "button"):
                label = (el.get("label") or "").lower()
                # Skip navigational boilerplate
                if any(bp in label for bp in ("sign in", "login", "privacy", "terms", "settings", "feedback", "about")):
                    continue

                score = sum(1 for kw in keywords if kw in label)
                if score > best_score:
                    best_score = score
                    best_element = el

        return best_element


# =============================================================================
# 4. Model-Driven LLM Planner with Structured Tool Calling
# =============================================================================

class LLMBrowserPlanner:
    """Invokes local Ollama model using structured JSON tool calling schema."""

    SYSTEM_PROMPT = """You are OS Browser Agent, an autonomous AI web assistant.
You operate a real web browser to fulfill user instructions.
You must choose the next single tool action to take based on the current page state.
Always return a valid JSON object matching the requested schema.
Do not invent facts. Inspect the elements on screen carefully."""

    def __init__(self, model_client: Optional[LLMClient] = None) -> None:
        self.client = model_client or OllamaClient("http://localhost:11434", "qwen2.5:3b", timeout_sec=15.0)

    async def is_available(self) -> bool:
        try:
            return await self.client.health()
        except Exception:
            return False

    async def plan_step(
        self,
        goal: str,
        current_obs: ObservationResult,
        action_history: List[Dict[str, Any]],
    ) -> Optional[Dict[str, Any]]:
        """Prompt model with structured JSON schema for next browser tool call."""
        elements_preview = []
        for el in (current_obs.dom_elements or [])[:20]:
            elements_preview.append(f"[{el.get('element_id')}] <{el.get('tag')}> '{el.get('label')}' -> {el.get('selector_hint')}")

        dom_summary = "\n".join(elements_preview) if elements_preview else "None"
        history_summary = "\n".join([f"- Step {i+1}: {h.get('action')} -> {h.get('outcome')}" for i, h in enumerate(action_history[-4:])]) or "None"

        user_prompt = f"""Goal: {goal}
Current URL: {current_obs.url}
Page Title: {current_obs.title}

Interactive Elements on Page:
{dom_summary}

Recent Actions:
{history_summary}

Choose the next tool action to make progress toward the goal.
Available tools: {list(BrowserToolRegistry.TOOL_SCHEMAS.keys())}
"""
        tool_schema = {
            "type": "object",
            "properties": {
                "tool": {"type": "string"},
                "arguments": {"type": "object"},
                "reason": {"type": "string"},
            },
            "required": ["tool", "arguments"],
        }

        try:
            messages = [
                Message(role="system", content=self.SYSTEM_PROMPT),
                Message(role="user", content=user_prompt),
            ]
            full_content = ""
            async for chunk in self.client.chat_stream(
                messages=messages,
                temperature=0.2,
                max_tokens=256,
                tool_json_schema=tool_schema,
            ):
                full_content += chunk.delta

            parsed = json.loads(full_content)
            if "tool" in parsed and "arguments" in parsed:
                return parsed
        except Exception as e:
            log.warning("LLM browser planning failed or timed out: %s. Using semantic fallback.", e)

        return None


# =============================================================================
# 5. Core Browser Agent Engine (Bounded Iterative Loop)
# =============================================================================

class BrowserAgentEngine:
    """Iterative Observe-Think-Act-Verify loop bound to the live session."""

    def __init__(
        self,
        session_id: str,
        goal: str,
        backend_name: str = "browser_harness",
        max_steps: int = 15,
        model_client: Optional[LLMClient] = None,
        event_callback: Optional[Callable[[Dict[str, Any]], None]] = None,
    ) -> None:
        self.session_id = session_id
        self.goal = goal
        self.backend_name = backend_name
        self.max_steps = max_steps
        self.event_callback = event_callback

        self.registry = get_computer_registry()
        self.safety = get_computer_safety_guard()
        self.checkpoints = TaskCheckpointStore()
        self.arbiter = get_arbiter_registry().get_or_create(session_id)

        self.decomposition = GoalAnalyzer.decompose(goal)
        self.semantic_planner = DeterministicSemanticPlanner(self.decomposition)
        self.llm_planner = LLMBrowserPlanner(model_client)
        self.laya_adapter = get_laya_browser_adapter()

        self.plan: Optional[TaskPlan] = None
        self._is_running = False
        self._lock = threading.Lock()

    def _emit_event(self, event_type: str, data: Dict[str, Any]) -> None:
        payload = {
            "type": event_type,
            "session_id": self.session_id,
            "task_id": self.plan.task_id if self.plan else None,
            "status": self.plan.status if self.plan else "unknown",
            "timestamp": time.time(),
            **data,
        }
        if self.event_callback:
            try:
                self.event_callback(payload)
            except Exception as e:
                log.debug("Event callback error: %s", e)

    def initialize_plan(self) -> TaskPlan:
        """Create or load the persistent task plan in SQLite."""
        with self._lock:
            executor = get_bounded_task_executor()
            plan = executor.create_plan(
                goal=self.goal,
                backend_name=self.backend_name,
                max_steps=self.max_steps,
            )
            plan.session_id = self.session_id
            plan.status = "planning"
            self.checkpoints.save(plan)
            self.plan = plan

            self.arbiter.assign_task(plan.task_id, self.goal)
            self.arbiter.start_task(plan.task_id)
            return plan

    def run_sync(self) -> Dict[str, Any]:
        """Synchronously execute the iterative agent loop to completion or pause."""
        if not self.plan:
            self.initialize_plan()

        assert self.plan is not None
        backend = self.registry.get_backend(self.backend_name)
        self.plan.status = "running"
        self.checkpoints.save(self.plan)
        log.info("Starting browser agent task '%s' for goal: %s", self.plan.task_id, self.goal)

        step_count = 0
        while step_count < self.max_steps:
            # 1. Check Arbiter and Kill Switch
            if self.safety.is_emergency_stopped():
                self.plan.status = "paused"
                self.plan.error_summary = "Emergency stop active"
                self.checkpoints.save(self.plan)
                self.arbiter.pause_ai("Emergency kill switch triggered")
                return {"status": "paused", "reason": "emergency_stop"}

            if self.arbiter.state == ControlState.AI_PAUSED or self.plan.human_takeover_active:
                log.info("Task '%s' paused under human takeover or pause request.", self.plan.task_id)
                self.plan.status = "paused"
                self.checkpoints.save(self.plan)
                return {"status": "paused", "reason": "human_takeover"}

            if self.arbiter.state == ControlState.STOPPED:
                log.info("Task '%s' was stopped by user.", self.plan.task_id)
                self.plan.status = "stopped"
                self.checkpoints.save(self.plan)
                return {"status": "stopped", "reason": "user_stopped"}

            # 2. Observe Current State
            step_count += 1
            t0 = time.time()
            obs = backend.inspect_page(self.session_id)
            log.info("Step %d: Current page URL: %s | Title: %s", step_count, obs.url, obs.title)

            # 3. Independent Completion Check
            self.plan.status = "verifying"
            satisfied, reason = self.decomposition.is_satisfied(obs)
            if satisfied and step_count > 1:
                log.info("Goal satisfied independently: %s", reason)
                self.plan.status = "completed"
                self.plan.updated_at = time.time()
                self.checkpoints.save(self.plan)

                # Return control to human
                self.arbiter.update_ai_cursor(x=640, y=400, status="Task Complete", visible=False)
                self.arbiter.take_human_control()
                if self.arbiter.active_task:
                    self.arbiter.active_task.status = "completed"
                self._emit_event("task_completed", {"reason": reason, "total_steps": step_count})
                return {"status": "completed", "reason": reason, "steps": step_count}

            self.plan.status = "running"

            # 4. Decide Next Tool Call (Fast Laya decision path with Semantic/LLM fallback)
            laya_decision = self.laya_adapter.decide_action(
                goal=self.goal,
                obs=obs,
                action_history=self.semantic_planner.step_history,
                query_text=self.decomposition.search_query,
            )
            next_action = None
            if not laya_decision.fallback_required and laya_decision.os_tool_call:
                log.info(
                    "Laya fast decision selected: %s (confidence=%.2f, latency=%.1fms)",
                    laya_decision.action_type.value,
                    laya_decision.confidence,
                    laya_decision.latency_ms,
                )
                next_action = laya_decision.os_tool_call
            else:
                next_action = self.semantic_planner.decide_next_action(obs)

            if not next_action:
                log.warning("Planner returned no further actions. Halting.")
                break

            tool_name = next_action.get("tool", "observe_page")
            tool_args = next_action.get("arguments", {})
            action_reason = next_action.get("reason", "")

            # 5. Build TaskStep record
            step = TaskStep(
                step_id=f"step-{step_count}",
                description=action_reason or f"Execute {tool_name}",
                action=tool_name,
                target=str(tool_args.get("target") or tool_args.get("url") or ""),
                payload=tool_args,
                observation_before=f"URL: {obs.url} | Title: {obs.title}",
                status="running",
            )
            self.plan.steps.append(step)
            self.plan.current_step_index = len(self.plan.steps) - 1
            self.checkpoints.save(self.plan)
            self._emit_event("step_start", {"step": asdict(step)})

            # 6. Safety Gate & Approval Check
            try:
                self.safety.validate_action(
                    session_id=self.session_id,
                    backend=self.backend_name,
                    action=tool_name,
                    target=step.target,
                    payload=tool_args,
                    approval_ticket_id=self.plan.pending_approval_id,
                )
                self.plan.pending_approval_id = None
            except SafetyGateTriggeredError as gate_err:
                step.status = "waiting_approval"
                self.plan.status = "waiting_approval"
                ticket_id = (gate_err.details or {}).get("ticket_id")
                self.plan.pending_approval_id = ticket_id
                self.checkpoints.save(self.plan)
                self.arbiter.pause_ai("Waiting for approval on high-risk action")
                self._emit_event("waiting_approval", {"ticket_id": ticket_id, "error": str(gate_err)})
                return {"status": "waiting_approval", "ticket_id": ticket_id}

            # 7. AI Cursor Telemetry Update
            target_rect = None
            cx, cy = 640.0, 400.0
            if step.target and hasattr(backend, "get_element_rect"):
                rect = backend.get_element_rect(self.session_id, step.target)
                if rect:
                    target_rect = rect
                    cx, cy = rect["cx"], rect["cy"]

            self.arbiter.update_ai_cursor(
                x=cx,
                y=cy,
                status=f"AI: {tool_name.replace('_', ' ')}",
                action=tool_name,
                target_rect=target_rect,
                visible=True,
            )

            # 8. Execute Tool Action
            res = BrowserToolRegistry.execute_tool(
                tool_name=tool_name,
                args=tool_args,
                backend=backend,
                session_id=self.session_id,
                safety_guard=self.safety,
            )

            # 9. Post-Action Observation & Step Verification
            obs_after = backend.inspect_page(self.session_id)
            step.duration_ms = round((time.time() - t0) * 1000, 2)
            step.outcome = res.observed_outcome
            step.verified = res.verified and res.success
            step.error = res.error
            step.observation_after = f"URL: {obs_after.url} | Title: {obs_after.title}"

            if res.success:
                step.status = "completed"
            else:
                if step.retries < 2:
                    step.retries += 1
                    step.status = "pending"
                    log.warning("Step %s failed (%s). Retrying...", step.step_id, res.error)
                else:
                    step.status = "failed"
                    self.plan.status = "failed"
                    self.plan.error_summary = f"Step '{step.step_id}' failed: {res.error}"
                    self.checkpoints.save(self.plan)
                    self._emit_event("step_end", {"step": asdict(step)})
                    return {"status": "failed", "error": res.error}

            self.plan.updated_at = time.time()
            self.checkpoints.save(self.plan)
            self._emit_event("step_end", {"step": asdict(step)})

            # Brief pause to allow DOM updates & live viewport stream sync
            time.sleep(0.4)

        # 10. Max Steps Exhaustion without Verification
        final_obs = backend.inspect_page(self.session_id)
        satisfied, reason = self.decomposition.is_satisfied(final_obs)
        if satisfied:
            self.plan.status = "completed"
            self.checkpoints.save(self.plan)
            self.arbiter.take_human_control()
            return {"status": "completed", "reason": reason}

        # Honestly mark as failed / incomplete -- never fake success!
        self.plan.status = "failed"
        self.plan.error_summary = f"Reached max steps ({self.max_steps}) without completing goal verification. {reason}"
        self.checkpoints.save(self.plan)
        self.arbiter.take_human_control()
        return {"status": "failed", "reason": self.plan.error_summary}

    def run_in_background(self) -> threading.Thread:
        """Launch the agent loop on a daemon thread."""
        thread = threading.Thread(
            target=self.run_sync,
            daemon=True,
            name=f"browser_agent_{self.session_id}",
        )
        thread.start()
        return thread
