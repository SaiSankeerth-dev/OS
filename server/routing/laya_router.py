"""Phase 3: Laya fast router.

Laya (Apache-2.0, https://github.com/NandhaKishorM/laya) is a
non-autoregressive decision model: it answers a typed "which skill
should handle this?" question in a single forward pass (~tens of ms
on CPU), instead of calling an LLM or relying on regexes alone.

Role in OS: fast pre-router in front of the existing regex
IntentRouter. If Laya confidently picks a tool skill, we use it;
otherwise we fall back to the regex path exactly as before. Laya
being absent (not installed, checkpoint not downloaded) is never an
error - the OS just routes the old way.

Install: pip install -r requirements-laya.txt   (one-time ~800MB
checkpoint download happens on first use)
"""
from __future__ import annotations

import time
from pathlib import Path

# Skill name -> one-line description, fed to Laya as the choice
# criteria. Later phases will build this from the live skill/agent
# registry; for Phase 3 it is the two skills OS actually has.
DEFAULT_SKILLS = {
    "chat": "general conversation, questions, greetings, small talk, "
    "anything that is not one of the other skills",
    "linkedin_draft": "draft or write a LinkedIn post about a topic or idea",
}

# Laya skill name -> tool name in server/intent/registry.py
TOOL_MAP = {
    "linkedin_draft": "linkedin_draft",
}

CONFIDENCE_THRESHOLD = 0.6


def laya_importable() -> bool:
    try:
        import laya  # noqa: F401
        return True
    except Exception:
        return False


def checkpoint_cached() -> bool:
    """True if the Laya english checkpoint is already on disk.

    Never triggers a download - used to decide whether live tests
    and eager loading are possible.
    """
    if not laya_importable():
        return False
    try:
        from huggingface_hub import scan_cache_dir

        for repo in scan_cache_dir().repos:
            if repo.repo_id == "convaiinnovations/laya":
                return True
        return False
    except Exception:
        # Fallback: raw directory check.
        cache = Path.home() / ".cache" / "huggingface" / "hub"
        return any(cache.glob("models--convaiinnovations--laya*"))


def laya_available() -> bool:
    return laya_importable() and checkpoint_cached()


class LayaRouter:
    """Fast skill router with regex fallback.

    route(text) -> (skill, confidence, latency_ms) on a confident hit,
    None when unsure or when Laya is unavailable.
    """

    def __init__(
        self,
        skills: dict[str, str] | None = None,
        confidence_threshold: float = CONFIDENCE_THRESHOLD,
        model: str = "english",
    ) -> None:
        self.skills = skills or dict(DEFAULT_SKILLS)
        self.confidence_threshold = confidence_threshold
        self.model = model
        self._router = None
        self._load_error: str | None = None
        if not laya_importable():
            self._load_error = "laya package not installed"

    @property
    def available(self) -> bool:
        """Ready to route: importable, checkpoint on disk, no load errors.

        The model itself still loads lazily on the first route() call,
        so a fresh router can report True here before any prediction.
        """
        return self._load_error is None and laya_available()

    def _ensure_loaded(self) -> bool:
        if self._router is not None:
            return True
        if self._load_error and self._load_error != "checkpoint not cached":
            return False
        if not checkpoint_cached():
            self._load_error = "checkpoint not cached"
            return False
        try:
            from laya import Router

            self._router = Router()
            return True
        except Exception as e:  # noqa: BLE001
            self._load_error = f"{type(e).__name__}: {e}"
            return False

    def _questions(self) -> dict:
        return {
            "skill": {
                "type": "choice",
                "instructions": "Which OS skill should handle the user's message?",
                "criteria": dict(self.skills),
            }
        }

    def route(self, text: str) -> tuple[str, float, float] | None:
        """Returns (skill, confidence, latency_ms), or None."""
        if not text or not text.strip():
            return None
        if not self._ensure_loaded():
            return None
        started = time.perf_counter()
        try:
            result = self._router.predict(text, self._questions(), model=self.model)
        except Exception:
            return None
        latency_ms = (time.perf_counter() - started) * 1000.0
        try:
            answer = (result.get("answers") or {}).get("skill") or {}
            skill = answer["choice"]
            confidence = float(answer.get("answer_confidence", answer.get("confidence", 0.0)))
        except Exception:
            return None
        if skill not in self.skills:
            return None
        if confidence < self.confidence_threshold:
            return None
        return skill, confidence, latency_ms

    def status(self) -> dict:
        return {
            "laya_installed": laya_importable(),
            "checkpoint_cached": checkpoint_cached(),
            "available": self.available,
            "load_error": self._load_error,
            "skills": sorted(self.skills),
            "confidence_threshold": self.confidence_threshold,
        }
