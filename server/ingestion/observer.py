"""Observer Service for OS.

The Observer is the first intelligent gate in the Universal Ingestion Pipeline:
SOURCE -> SOURCE EVENT -> OBSERVER -> EXTRACTOR -> CONTEXT -> VERIFIER -> LINKER -> COMMITMENT

Responsibility:
Quickly decides if an incoming SourceEvent contains a potential commitment, deadline,
or task, avoiding unnecessary downstream LLM invocations.
Uses deterministic pattern detection + fast Laya classification (<100ms).
"""
from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Optional

from server.domain.entities import SourceEvent
from server.routing.laya_router import LayaRouter


@dataclass
class ObserverDecision:
    relevant: bool
    event_type: str  # potential_commitment, informational, question, etc.
    confidence: float
    reason: str


class ObserverService:
    # High-signal patterns indicating commitments, requests, or deadlines
    COMMITMENT_PATTERNS = [
        r"\b(?:please|pls)\s+(?:submit|send|finish|complete|review|prepare|deliver|share|fix)\b",
        r"\b(?:deadline|due|by|before)\s+(?:tomorrow|today|tonight|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{1,2}(?:st|nd|rd|th)?|\d{1,2}:\d{2})\b",
        r"\b(?:need\s+to|have\s+to|must|should|action\s+item|deliverable)\b",
        r"\b(?:follow\s+up|waiting\s+for|blocked\s+by)\b",
        r"\b(?:assigned\s+to\s+you|your\s+task|your\s+responsibility)\b",
    ]

    # Patterns indicating purely informational notices (FYI)
    FYI_PATTERNS = [
        r"\b(?:no\s+action\s+required|for\s+your\s+information|fyi\s+only|newsletter|unsubscribe|noreply)\b",
    ]

    def __init__(self, laya_router: Optional[LayaRouter] = None) -> None:
        self.laya = laya_router or LayaRouter()

    def observe(self, event: SourceEvent) -> ObserverDecision:
        payload = event.payload
        text = ""
        if isinstance(payload, dict):
            text = f"{payload.get('subject', '')} {payload.get('body', '')} {payload.get('content', '')} {payload.get('title', '')}".strip()
        elif isinstance(payload, str):
            text = payload.strip()

        if not text:
            return ObserverDecision(relevant=False, event_type="empty", confidence=1.0, reason="Empty payload")

        lower = text.lower()

        # 1. Fast negative gate: check for explicitly informational FYI
        for fyi in self.FYI_PATTERNS:
            if re.search(fyi, lower):
                return ObserverDecision(
                    relevant=False,
                    event_type="informational",
                    confidence=0.85,
                    reason="Matched FYI/informational pattern",
                )

        # 2. Fast positive gate: check for high-confidence commitment keywords
        matched_patterns = []
        for pat in self.COMMITMENT_PATTERNS:
            if re.search(pat, lower):
                matched_patterns.append(pat)

        if matched_patterns:
            conf = min(0.6 + len(matched_patterns) * 0.15, 0.98)
            return ObserverDecision(
                relevant=True,
                event_type="potential_commitment",
                confidence=conf,
                reason=f"Matched {len(matched_patterns)} commitment/deadline signals",
            )

        # 3. Laya classification path (if available)
        if self.laya.available:
            try:
                res = self.laya.route(text[:200])
                if res and res[1] >= 0.6 and res[0] != "chat":
                    return ObserverDecision(
                        relevant=True,
                        event_type="potential_commitment",
                        confidence=res[1],
                        reason=f"Laya classified as {res[0]} (latency={res[2]:.1f}ms)",
                    )
            except Exception:
                pass

        # Default: not a commitment
        return ObserverDecision(
            relevant=False,
            event_type="general",
            confidence=0.5,
            reason="No commitment or deadline patterns found",
        )
