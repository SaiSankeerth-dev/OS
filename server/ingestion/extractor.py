"""Extractor Service for OS.

Transforms unstructured information into structured proposals:
SOURCE -> SOURCE EVENT -> OBSERVER -> EXTRACTOR -> CONTEXT -> VERIFIER -> LINKER -> COMMITMENT

Responsibilities:
Extracts commitment title, target deadline, deliverable, person, project, and confidence.
Never mutates the database directly.
"""
from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Any, Optional


@dataclass
class ExtractedProposal:
    title: str
    deadline: Optional[datetime] = None
    deadline_text: Optional[str] = None
    deliverable: Optional[str] = None
    person_name: Optional[str] = None
    project_name: Optional[str] = None
    confidence: float = 0.8
    raw_text: str = ""


class ExtractorService:
    """Extracts structured proposals from source events."""

    WEEKDAYS = {
        "monday": 0,
        "tuesday": 1,
        "wednesday": 2,
        "thursday": 3,
        "friday": 4,
        "saturday": 5,
        "sunday": 6,
    }

    def extract(self, text: str, reference_date: Optional[datetime] = None) -> ExtractedProposal:
        ref = reference_date or datetime.now(timezone.utc)
        clean = " ".join(text.split())

        # 1. Extract deadline
        deadline_dt, deadline_str = self._extract_deadline(clean, ref)

        # 2. Extract deliverable
        deliverable = self._extract_deliverable(clean)

        # 3. Extract title
        title = self._extract_title(clean, deliverable)

        # 4. Extract project or person if mentioned
        project_name = self._extract_project(clean)
        person_name = self._extract_person(clean)

        # Confidence calculation
        confidence = 0.75
        if deadline_dt:
            confidence += 0.1
        if deliverable:
            confidence += 0.1

        return ExtractedProposal(
            title=title,
            deadline=deadline_dt,
            deadline_text=deadline_str,
            deliverable=deliverable,
            person_name=person_name,
            project_name=project_name,
            confidence=min(confidence, 0.98),
            raw_text=text,
        )

    def _extract_deadline(self, text: str, ref: datetime) -> tuple[Optional[datetime], Optional[str]]:
        lower = text.lower()

        # Check for "today"
        if "today" in lower:
            dt = ref.replace(hour=23, minute=59, second=0, microsecond=0)
            return dt, "today"

        # Check for "tomorrow"
        if "tomorrow" in lower:
            dt = (ref + timedelta(days=1)).replace(hour=23, minute=59, second=0, microsecond=0)
            return dt, "tomorrow"

        # Check for weekdays (e.g., "by Friday", "due Friday")
        for day_name, day_idx in self.WEEKDAYS.items():
            match = re.search(rf"\b(?:by|due|before|on)\s+{day_name}\b", lower)
            if match or re.search(rf"\b{day_name}\b", lower):
                current_weekday = ref.weekday()
                days_ahead = (day_idx - current_weekday) % 7
                if days_ahead == 0 and ("by" in lower or "due" in lower):
                    days_ahead = 7  # Next week if today is that day and it's a deadline
                target_dt = (ref + timedelta(days=days_ahead)).replace(hour=23, minute=59, second=0, microsecond=0)
                return target_dt, day_name.capitalize()

        # Check for ISO or YYYY-MM-DD
        iso_match = re.search(r"\b(\d{4}-\d{2}-\d{2})\b", text)
        if iso_match:
            try:
                dt = datetime.strptime(iso_match.group(1), "%Y-%m-%d").replace(
                    hour=23, minute=59, second=0, tzinfo=timezone.utc
                )
                return dt, iso_match.group(1)
            except Exception:
                pass

        return None, None

    def _extract_deliverable(self, text: str) -> Optional[str]:
        match = re.search(r"\b(?:final\s+)?(pdf|report|code|pull\s+request|pr|draft|dataset|slides|presentation)\b", text, re.IGNORECASE)
        if match:
            return match.group(0).strip()
        return None

    def _extract_title(self, text: str, deliverable: Optional[str]) -> str:
        # Check for "Please finish the X and send Y"
        match = re.search(r"(?:please\s+)?(?:finish|submit|send|complete|review|prepare)\s+(?:the\s+)?([^,.]+?)(?:by|before|and|\.|$)", text, re.IGNORECASE)
        if match:
            action_obj = match.group(1).strip()
            return action_obj.title() if len(action_obj) < 60 else action_obj[:60].title()

        if deliverable:
            return f"Submit {deliverable.title()}"

        words = text.split()[:8]
        return " ".join(words).title()

    def _extract_project(self, text: str) -> Optional[str]:
        match = re.search(r"\b([A-Z]{2,6}|OS|DBMS|Next\.js|React|Python)\b", text)
        if match:
            return match.group(1)
        return None

    def _extract_person(self, text: str) -> Optional[str]:
        match = re.search(r"\b(Professor|Dr\.\s+[A-Z][a-z]+|Rahul|Sai|Recruiter)\b", text, re.IGNORECASE)
        if match:
            return match.group(1).title()
        return None
