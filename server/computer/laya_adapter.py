"""Laya Fast Browser Decision Adapter.

Inspired by ChenneyZhuang/laya-browser-agent and OS's local-first architecture:
- Evaluates local, structured browser action candidates in tens of milliseconds
- Eliminates heavy LLM reasoning loops for standard navigation, clicks, and inputs
- Bounded action types: CLICK, TYPE_TEXT, SELECT, SCROLL, WAIT, DONE, BLOCKED
- Validates model output against the live DOM interactive element table
- Automatically yields to OS LLM/Semantic planner when uncertain or uninstalled
"""
from __future__ import annotations

import enum
import logging
import re
import time
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Tuple

from jarvis_os.primitives.browser_voice_oauth_fixes import DOMAccessibilityAgent
from server.computer.interface import ObservationResult

log = logging.getLogger("os.computer.laya_adapter")


class LayaActionType(str, enum.Enum):
    CLICK = "CLICK"
    TYPE_TEXT = "TYPE_TEXT"
    SELECT = "SELECT"
    SCROLL = "SCROLL"
    WAIT = "WAIT"
    DONE = "DONE"
    BLOCKED = "BLOCKED"


@dataclass
class ActionCandidate:
    """A bounded, verified action candidate grounded in the current page DOM."""
    candidate_id: str
    action_type: LayaActionType
    element_id: Optional[int] = None
    selector_hint: Optional[str] = None
    label: str = ""
    description: str = ""
    risk: str = "LOW_NAVIGATION"
    default_payload: Dict[str, Any] = field(default_factory=dict)


@dataclass
class LayaDecision:
    """Structured decision returned by LayaBrowserDecisionAdapter."""
    action_type: LayaActionType
    confidence: float
    latency_ms: float
    candidate: Optional[ActionCandidate] = None
    target_selector: Optional[str] = None
    action_payload: Dict[str, Any] = field(default_factory=dict)
    reason: str = ""
    fallback_required: bool = False
    os_tool_call: Optional[Dict[str, Any]] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "action_type": self.action_type.value,
            "confidence": self.confidence,
            "latency_ms": self.latency_ms,
            "target_selector": self.target_selector,
            "action_payload": self.action_payload,
            "reason": self.reason,
            "fallback_required": self.fallback_required,
            "os_tool_call": self.os_tool_call,
        }


def laya_importable() -> bool:
    try:
        import laya  # noqa: F401
        return True
    except Exception:
        return False


class LayaBrowserDecisionAdapter:
    """Fast, local browser action decision adapter with automatic fallback."""

    DEFAULT_CONFIDENCE_THRESHOLD = 0.65

    def __init__(
        self,
        confidence_threshold: float = DEFAULT_CONFIDENCE_THRESHOLD,
        prefer_local_fast_model: bool = True,
    ) -> None:
        self.confidence_threshold = confidence_threshold
        self.prefer_local_fast_model = prefer_local_fast_model
        self._router_instance = None
        self._load_error: Optional[str] = None
        if not laya_importable():
            self._load_error = "laya package not installed"

    @property
    def available(self) -> bool:
        """True if laya library is importable and ready."""
        return laya_importable() and self._load_error is None

    def build_action_table(
        self,
        obs: ObservationResult,
        goal: str = "",
        raw_html: Optional[str] = None,
    ) -> List[ActionCandidate]:
        """Distill current DOM into a bounded, numbered action table."""
        candidates: List[ActionCandidate] = []

        # 1. Obtain distilled interactive elements
        elements = obs.dom_elements or []
        if not elements and raw_html:
            elements = DOMAccessibilityAgent.build_interactive_dom_map(raw_html)

        for el in elements:
            elem_id = el.get("element_id")
            tag = (el.get("tag") or "").lower()
            label = (el.get("label") or "").strip()
            selector = el.get("selector_hint") or (f"#{el['id']}" if el.get("id") else f"{tag}")
            risk = el.get("risk", "LOW_NAVIGATION")

            if tag in ("button", "a"):
                candidates.append(
                    ActionCandidate(
                        candidate_id=f"act_click_{elem_id}",
                        action_type=LayaActionType.CLICK,
                        element_id=elem_id,
                        selector_hint=selector,
                        label=label,
                        description=f"Click {tag} '{label}' [{selector}]",
                        risk=risk,
                        default_payload={"target": selector, "description": label},
                    )
                )
            elif tag in ("input", "textarea"):
                candidates.append(
                    ActionCandidate(
                        candidate_id=f"act_type_{elem_id}",
                        action_type=LayaActionType.TYPE_TEXT,
                        element_id=elem_id,
                        selector_hint=selector,
                        label=label,
                        description=f"Type into {tag} '{label}' [{selector}]",
                        risk=risk,
                        default_payload={"target": selector, "press_enter": True},
                    )
                )
            elif tag == "select":
                candidates.append(
                    ActionCandidate(
                        candidate_id=f"act_select_{elem_id}",
                        action_type=LayaActionType.SELECT,
                        element_id=elem_id,
                        selector_hint=selector,
                        label=label,
                        description=f"Select option in dropdown '{label}' [{selector}]",
                        risk=risk,
                        default_payload={"target": selector},
                    )
                )

        # 2. Add global page actions
        candidates.append(
            ActionCandidate(
                candidate_id="act_scroll_down",
                action_type=LayaActionType.SCROLL,
                description="Scroll down viewport 400px",
                default_payload={"direction": "down", "amount": 400},
            )
        )
        candidates.append(
            ActionCandidate(
                candidate_id="act_wait",
                action_type=LayaActionType.WAIT,
                description="Wait for dynamic DOM / network completion",
                default_payload={"target": "body", "timeout_ms": 3000},
            )
        )
        candidates.append(
            ActionCandidate(
                candidate_id="act_done",
                action_type=LayaActionType.DONE,
                description="Goal is satisfied on the current page",
                default_payload={"reason": "Goal conditions verified"},
            )
        )
        candidates.append(
            ActionCandidate(
                candidate_id="act_blocked",
                action_type=LayaActionType.BLOCKED,
                description="Action blocked by CAPTCHA, login wall, or security policy",
                default_payload={"reason": "Blocked by external condition"},
            )
        )

        return candidates

    def decide_action(
        self,
        goal: str,
        obs: ObservationResult,
        action_history: Optional[List[Dict[str, Any]]] = None,
        query_text: Optional[str] = None,
    ) -> LayaDecision:
        """Fast decision path for browser action selection.
        
        Evaluates candidate actions against goal and current page state in tens of ms.
        """
        t0 = time.perf_counter()
        action_table = self.build_action_table(obs, goal=goal)
        history = action_history or []

        # If laya model is installed and cached, use fast neural model
        if self.available and self._router_instance is not None:
            try:
                decision = self._predict_with_laya(goal, obs, action_table, t0)
                if decision:
                    return decision
            except Exception as e:
                log.warning("Laya fast prediction error: %s. Using heuristic fast path.", e)

        # Fast non-autoregressive heuristic decision (<5ms)
        decision = self._evaluate_fast_heuristic(goal, obs, action_table, history, query_text, t0)
        return decision

    def _evaluate_fast_heuristic(
        self,
        goal: str,
        obs: ObservationResult,
        action_table: List[ActionCandidate],
        history: List[Dict[str, Any]],
        query_text: Optional[str],
        t0: float,
    ) -> LayaDecision:
        """Fast, robust deterministic matcher that grounds decisions in the DOM candidate table."""
        goal_lower = goal.lower()
        current_url = (obs.url or "").lower()

        # Check for CAPTCHA / bot detection
        if any(w in (obs.text_content or "").lower() for w in ("verify you are human", "captcha", "security check")):
            latency = round((time.perf_counter() - t0) * 1000, 2)
            return LayaDecision(
                action_type=LayaActionType.BLOCKED,
                confidence=0.98,
                latency_ms=latency,
                reason="Page presents a CAPTCHA or bot check requiring human intervention",
                fallback_required=False,
                os_tool_call={"tool": "observe_page", "arguments": {}, "reason": "Bot check detected"},
            )

        # 1. Search Box pattern: If on search engine or portal and haven't searched yet
        has_typed_search = any(h.get("action") in ("fill_and_submit", "type_text") for h in history)
        if not has_typed_search and any(w in goal_lower for w in ("search", "find", "look up", "google", "youtube", "github")):
            # Look for an input candidate
            input_cand = None
            for cand in action_table:
                if cand.action_type == LayaActionType.TYPE_TEXT:
                    label_lower = cand.label.lower()
                    sel_lower = (cand.selector_hint or "").lower()
                    if any(k in label_lower or k in sel_lower for k in ("search", "q", "query", "find")):
                        input_cand = cand
                        break
            if not input_cand:
                # Pick first input candidate if available
                inputs = [c for c in action_table if c.action_type == LayaActionType.TYPE_TEXT]
                if inputs:
                    input_cand = inputs[0]

            if input_cand:
                latency = round((time.perf_counter() - t0) * 1000, 2)
                text_to_type = query_text or self._extract_query_from_goal(goal)
                os_tool = {
                    "tool": "fill_and_submit",
                    "arguments": {
                        "target": input_cand.selector_hint,
                        "text": text_to_type,
                        "press_enter": True,
                    },
                    "reason": f"Fast decision: Type '{text_to_type}' into {input_cand.label}",
                }
                return LayaDecision(
                    action_type=LayaActionType.TYPE_TEXT,
                    confidence=0.88,
                    latency_ms=latency,
                    candidate=input_cand,
                    target_selector=input_cand.selector_hint,
                    action_payload={"text": text_to_type, "press_enter": True},
                    reason=f"Type search query into '{input_cand.label}'",
                    fallback_required=False,
                    os_tool_call=os_tool,
                )

        # 2. Result selection: Click search result matching goal keywords
        if has_typed_search:
            keywords = [w for w in re.findall(r"[a-zA-Z0-9]+", goal_lower) if len(w) > 3 and w not in ("search", "find", "open", "look", "click", "page", "show")]
            best_cand = None
            best_score = 0
            for cand in action_table:
                if cand.action_type == LayaActionType.CLICK:
                    label_l = cand.label.lower()
                    # Skip common nav boilerplate
                    if any(bp in label_l for bp in ("sign in", "login", "privacy", "terms", "settings", "feedback", "about", "all", "images", "videos")):
                        continue
                    score = sum(1 for kw in keywords if kw in label_l)
                    if score > best_score:
                        best_score = score
                        best_cand = cand

            if best_cand and best_score >= 1:
                latency = round((time.perf_counter() - t0) * 1000, 2)
                os_tool = {
                    "tool": "click_element",
                    "arguments": {
                        "target": best_cand.selector_hint,
                        "description": best_cand.label,
                    },
                    "reason": f"Fast decision: Click match '{best_cand.label}'",
                }
                return LayaDecision(
                    action_type=LayaActionType.CLICK,
                    confidence=min(0.92, 0.65 + best_score * 0.1),
                    latency_ms=latency,
                    candidate=best_cand,
                    target_selector=best_cand.selector_hint,
                    action_payload=best_cand.default_payload,
                    reason=f"Matched target result: {best_cand.label}",
                    fallback_required=False,
                    os_tool_call=os_tool,
                )

        # 3. If uncertain, return fallback request to let main LLM / Semantic planner handle it
        latency = round((time.perf_counter() - t0) * 1000, 2)
        return LayaDecision(
            action_type=LayaActionType.WAIT,
            confidence=0.40,
            latency_ms=latency,
            reason="Fast decision confidence below threshold (0.40 < 0.65); falling back to primary planner",
            fallback_required=True,
            os_tool_call=None,
        )

    def _extract_query_from_goal(self, goal: str) -> str:
        """Extract search query keywords from natural language goal."""
        m = re.search(r"(?:search\s+for|search|find|look\s+for|open)\s+[\"']([^\"']+)[\"']", goal, re.IGNORECASE)
        if m:
            return m.group(1).strip()
        m2 = re.search(r"(?:search\s+for|search|look\s+up|find)\s+(.+?)(?:$|on\s+|in\s+)", goal, re.IGNORECASE)
        if m2:
            return m2.group(1).strip()
        return goal.strip()

    def _predict_with_laya(
        self,
        goal: str,
        obs: ObservationResult,
        action_table: List[ActionCandidate],
        t0: float,
    ) -> Optional[LayaDecision]:
        """Query Laya model if available."""
        # Builds choice question across top candidate actions
        candidates_map = {c.candidate_id: c.description for c in action_table[:10]}
        if not candidates_map:
            return None

        # Predict using laya router
        pred = self._router_instance.predict(
            goal,
            {"action": {"type": "choice", "options": candidates_map}},
        )
        latency = round((time.perf_counter() - t0) * 1000, 2)
        answer = pred.get("answers", {}).get("action", {})
        chosen_id = answer.get("choice")
        conf = float(answer.get("confidence") or answer.get("answer_confidence") or 0.0)

        # Ground candidate in table
        matched = next((c for c in action_table if c.candidate_id == chosen_id), None)
        if not matched or conf < self.confidence_threshold:
            return LayaDecision(
                action_type=LayaActionType.WAIT,
                confidence=conf,
                latency_ms=latency,
                reason=f"Laya confidence {conf:.2f} below threshold {self.confidence_threshold}",
                fallback_required=True,
            )

        # Build OS tool call
        os_tool = None
        if matched.action_type == LayaActionType.CLICK:
            os_tool = {"tool": "click_element", "arguments": {"target": matched.selector_hint, "description": matched.label}}
        elif matched.action_type == LayaActionType.TYPE_TEXT:
            os_tool = {"tool": "fill_and_submit", "arguments": {"target": matched.selector_hint, "text": goal, "press_enter": True}}
        elif matched.action_type == LayaActionType.SCROLL:
            os_tool = {"tool": "scroll", "arguments": {"direction": "down", "amount": 400}}

        return LayaDecision(
            action_type=matched.action_type,
            confidence=conf,
            latency_ms=latency,
            candidate=matched,
            target_selector=matched.selector_hint,
            action_payload=matched.default_payload,
            reason=f"Laya neural choice: {matched.description}",
            fallback_required=False,
            os_tool_call=os_tool,
        )


_GLOBAL_LAYA_BROWSER_ADAPTER: Optional[LayaBrowserDecisionAdapter] = None


def get_laya_browser_adapter() -> LayaBrowserDecisionAdapter:
    """Retrieve or initialize the global Laya browser decision adapter."""
    global _GLOBAL_LAYA_BROWSER_ADAPTER
    if _GLOBAL_LAYA_BROWSER_ADAPTER is None:
        _GLOBAL_LAYA_BROWSER_ADAPTER = LayaBrowserDecisionAdapter()
    return _GLOBAL_LAYA_BROWSER_ADAPTER
