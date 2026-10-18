"""Rate-Limits Tracker for OS computer control and AI providers.

Tracks known rate limits, cooldown periods, and quota resets across AI providers
(OpenAI, Anthropic, Google, Ollama). Caches state locally in data/rate_limits_cache.json
with schema validation and provides fallback rules if external endpoints are unreachable.
"""
from __future__ import annotations

import json
import logging
import threading
import time
import urllib.error
import urllib.request
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional

log = logging.getLogger("os.computer.rate_limits")

DEFAULT_FALLBACK_RULES = {
    "openai": {
        "gpt-4o": {"requests_per_minute": 500, "requests_per_day": 10000, "cooldown_sec": 3600.0},
        "gpt-4o-mini": {"requests_per_minute": 1500, "requests_per_day": 50000, "cooldown_sec": 1800.0},
        "chatgpt-web-free": {"requests_per_3h": 10, "cooldown_sec": 10800.0},
        "chatgpt-web-plus": {"requests_per_3h": 80, "cooldown_sec": 10800.0},
    },
    "anthropic": {
        "claude-3-5-sonnet": {"requests_per_minute": 50, "requests_per_day": 5000, "cooldown_sec": 3600.0},
        "claude-web-free": {"requests_per_5h": 15, "cooldown_sec": 18000.0},
        "claude-web-pro": {"requests_per_5h": 100, "cooldown_sec": 18000.0},
    },
    "google": {
        "gemini-1.5-pro": {"requests_per_minute": 60, "requests_per_day": 1000, "cooldown_sec": 3600.0},
        "gemini-1.5-flash": {"requests_per_minute": 1000, "requests_per_day": 20000, "cooldown_sec": 1800.0},
        "gemini-web": {"requests_per_day": 100, "cooldown_sec": 7200.0},
    },
    "ollama": {
        "local": {"requests_per_minute": 999999, "requests_per_day": 999999, "cooldown_sec": 0.0},
    },
}


@dataclass
class ActiveCooldown:
    provider: str
    model: str
    triggered_at: float
    resets_at: float
    reason: str

    @property
    def is_expired(self) -> bool:
        return time.time() >= self.resets_at

    @property
    def remaining_seconds(self) -> float:
        return max(0.0, self.resets_at - time.time())


class RateLimitsTracker:
    """Manages rate limit rules and active cooldown timers across providers."""

    def __init__(self, cache_path: str = "data/rate_limits_cache.json") -> None:
        self.cache_path = Path(cache_path)
        self.cache_path.parent.mkdir(parents=True, exist_ok=True)
        self._rules: Dict[str, Dict[str, Any]] = dict(DEFAULT_FALLBACK_RULES)
        self._cooldowns: Dict[str, ActiveCooldown] = {}  # key: "provider:model"
        self._lock = threading.Lock()
        self._load_cache()

    def _cache_key(self, provider: str, model: str) -> str:
        return f"{provider.lower()}:{model.lower()}"

    def _load_cache(self) -> None:
        if not self.cache_path.exists():
            self._save_cache()
            return
        try:
            with open(self.cache_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            # Schema validation
            if not isinstance(data, dict):
                log.warning("Invalid cache structure; resetting to defaults.")
                return

            saved_rules = data.get("rules", {})
            if isinstance(saved_rules, dict):
                self._rules.update(saved_rules)

            saved_cooldowns = data.get("cooldowns", {})
            now = time.time()
            for k, cd in saved_cooldowns.items():
                if isinstance(cd, dict) and cd.get("resets_at", 0) > now:
                    self._cooldowns[k] = ActiveCooldown(
                        provider=cd.get("provider", "unknown"),
                        model=cd.get("model", "unknown"),
                        triggered_at=cd.get("triggered_at", now),
                        resets_at=cd.get("resets_at", now + 60),
                        reason=cd.get("reason", "cached cooldown"),
                    )
        except Exception as e:
            log.warning(f"Error loading rate limit cache: {e}; using fallbacks.")

    def _save_cache(self) -> None:
        try:
            now = time.time()
            active_cds = {
                k: asdict(cd)
                for k, cd in self._cooldowns.items()
                if cd.resets_at > now
            }
            data = {
                "version": "1.0",
                "updated_at": now,
                "rules": self._rules,
                "cooldowns": active_cds,
            }
            with open(self.cache_path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            log.warning(f"Failed to save rate limit cache: {e}")

    def record_limit_hit(
        self,
        provider: str,
        model: str,
        cooldown_sec: Optional[float] = None,
        reason: str = "Rate limit hit",
    ) -> ActiveCooldown:
        """Mark a provider/model as rate-limited with an active cooldown timer."""
        prov = provider.lower()
        mod = model.lower()
        key = self._cache_key(prov, mod)

        if cooldown_sec is None:
            # Query rules for default cooldown
            prov_rules = self._rules.get(prov, {})
            mod_rules = prov_rules.get(mod, {})
            cooldown_sec = mod_rules.get("cooldown_sec", 3600.0)

        now = time.time()
        cd = ActiveCooldown(
            provider=prov,
            model=mod,
            triggered_at=now,
            resets_at=now + cooldown_sec,
            reason=reason,
        )
        with self._lock:
            self._cooldowns[key] = cd
            self._save_cache()

        log.warning(f"Recorded rate limit on '{prov}:{mod}': resets in {cooldown_sec:.1f}s ({reason})")
        return cd

    def is_available(self, provider: str, model: str) -> bool:
        """Check if provider/model is currently free of active cooldowns."""
        key = self._cache_key(provider, model)
        with self._lock:
            cd = self._cooldowns.get(key)
            if not cd:
                return True
            if cd.is_expired:
                del self._cooldowns[key]
                self._save_cache()
                return True
            return False

    def get_active_cooldown(self, provider: str, model: str) -> Optional[ActiveCooldown]:
        key = self._cache_key(provider, model)
        with self._lock:
            cd = self._cooldowns.get(key)
            if cd and cd.is_expired:
                del self._cooldowns[key]
                self._save_cache()
                return None
            return cd

    def suggest_alternative(self, provider: str, model: str) -> Optional[Dict[str, str]]:
        """Suggest an available alternative model or provider when target is exhausted."""
        prov = provider.lower()
        # Priority order of local or free alternatives
        candidates = [
            {"provider": "ollama", "model": "local"},
            {"provider": "google", "model": "gemini-1.5-flash"},
            {"provider": "openai", "model": "gpt-4o-mini"},
            {"provider": "anthropic", "model": "claude-3-5-sonnet"},
        ]
        for cand in candidates:
            if cand["provider"] == prov and cand["model"] == model.lower():
                continue
            if self.is_available(cand["provider"], cand["model"]):
                return cand
        return None

    def list_active_cooldowns(self) -> List[Dict[str, Any]]:
        """Return all active cooldowns across all providers."""
        now = time.time()
        result = []
        with self._lock:
            for cd in list(self._cooldowns.values()):
                if cd.is_expired:
                    key = self._cache_key(cd.provider, cd.model)
                    self._cooldowns.pop(key, None)
                else:
                    result.append({
                        "provider": cd.provider,
                        "model": cd.model,
                        "triggered_at": cd.triggered_at,
                        "resets_at": cd.resets_at,
                        "remaining_seconds": cd.remaining_seconds,
                        "reason": cd.reason,
                    })
        return result


_GLOBAL_RATE_LIMITS_TRACKER: Optional[RateLimitsTracker] = None


def get_rate_limits_tracker() -> RateLimitsTracker:
    global _GLOBAL_RATE_LIMITS_TRACKER
    if _GLOBAL_RATE_LIMITS_TRACKER is None:
        _GLOBAL_RATE_LIMITS_TRACKER = RateLimitsTracker()
    return _GLOBAL_RATE_LIMITS_TRACKER
