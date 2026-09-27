"""SupervisorAgent: Pydantic AI agent used by the supervisor.

Two jobs, both best-effort on the local Ollama model:
  - refine_args: clean up tool arguments from the user's raw text
  - verify: independent verification of a tool outcome

Neither job is load-bearing. If the model is unreachable, slow, or
returns garbage, the supervisor falls back to rule-based behavior and
the safety pipeline (scope, permission, approval) still holds. The
agent never executes tools itself.
"""
from __future__ import annotations

import asyncio
import json
import logging
import time

import httpx
from pydantic import BaseModel, Field


log = logging.getLogger("os.supervisor")

_AGENT_TIMEOUT_SEC = 25.0
_REACHABILITY_TTL_SEC = 60.0


class VerificationResult(BaseModel):
    passed: bool = Field(description="Whether the outcome looks correct")
    note: str = Field(default="", description="One-line reason")


def build_model(base_url: str = "http://localhost:11434",
                model_name: str = "qwen3:8b"):
    """Local Ollama model for the supervisor agent. No API keys, no cloud."""
    from pydantic_ai.models.ollama import OllamaModel
    from pydantic_ai.providers.ollama import OllamaProvider

    return OllamaModel(model_name, provider=OllamaProvider(base_url=base_url))


class SupervisorAgent:
    def __init__(self, model=None, base_url: str = "http://localhost:11434",
                 model_name: str = "qwen3:8b") -> None:
        self._model = model  # TestModel in tests; None -> build lazily
        self._base_url = base_url
        self._model_name = model_name
        self._agent = None
        self._reachable: bool | None = None
        self._reachable_at: float = 0.0

    def _model_reachable(self) -> bool:
        """Fast cached probe: is there an Ollama server to talk to?

        A TestModel is always 'reachable'. Without this probe every
        agent call would burn the full 25s timeout when Ollama is down.
        """
        if self._model is not None:
            return True
        now = time.monotonic()
        if (self._reachable is not None
                and now - self._reachable_at < _REACHABILITY_TTL_SEC):
            return self._reachable
        try:
            r = httpx.get(f"{self._base_url}/api/tags", timeout=2.0)
            self._reachable = r.status_code < 500
        except Exception:
            self._reachable = False
        self._reachable_at = now
        return self._reachable

    def _build_model(self):
        return build_model(self._base_url, self._model_name)

    def _ensure_agent(self):
        if self._agent is None:
            from pydantic_ai import Agent

            model = self._model or build_model(self._base_url, self._model_name)
            self._agent = Agent(
                model,
                system_prompt=(
                    "You are the verification assistant inside OS, a local "
                    "voice assistant. Be terse. Answer only what is asked."
                ),
            )
        return self._agent

    @property
    def model_name(self) -> str:
        if self._model is not None:
            return getattr(self._model, "model_name", "test-model")
        return self._model_name

    async def refine_args(
        self, tool_name: str, user_text: str, args: dict
    ) -> dict:
        """Best-effort argument cleanup. Returns original args on failure."""
        if not self._model_reachable():
            return dict(args)
        try:
            agent = self._ensure_agent()
            prompt = (
                f"Tool: {tool_name}\n"
                f"User text: {user_text}\n"
                f"Current args (JSON): {json.dumps(args)}\n\n"
                "Return ONLY a JSON object with the cleaned-up args for "
                "this tool. Keep every key from the current args; fix "
                "obvious issues (e.g. strip 'please', quotes). No prose."
            )
            result = await asyncio.wait_for(
                agent.run(prompt), timeout=_AGENT_TIMEOUT_SEC
            )
            refined = json.loads(result.output.strip())
            if isinstance(refined, dict):
                merged = dict(args)
                merged.update(refined)
                return merged
        except Exception as e:  # noqa: BLE001 - fallback is the contract
            log.debug("refine_args fell back: %s", e)
        return dict(args)

    async def verify(
        self, tool_name: str, args: dict, result_summary: str
    ) -> VerificationResult:
        """Independent check of a tool outcome. Rule-based fallback."""
        if not self._model_reachable():
            return self._rule_based_verify(result_summary)
        try:
            from pydantic_ai import Agent

            model = self._model or build_model(self._base_url, self._model_name)
            verifier = Agent(
                model,
                output_type=VerificationResult,
                system_prompt=(
                    "You verify tool outcomes for a local assistant. "
                    "Reply with the structured verdict only."
                ),
            )
            result = await asyncio.wait_for(
                verifier.run(
                    f"Tool: {tool_name}\nArgs: {json.dumps(args)}\n"
                    f"Outcome: {result_summary}\n\n"
                    "Did the tool do what was asked? Verdict:"
                ),
                timeout=_AGENT_TIMEOUT_SEC,
            )
            return result.output
        except Exception as e:  # noqa: BLE001
            log.debug("verify fell back to rule-based: %s", e)
        return self._rule_based_verify(result_summary)

    @staticmethod
    def _rule_based_verify(result_summary: str) -> VerificationResult:
        # A non-empty outcome is a pass. The safety pipeline never
        # depends on this being smart.
        passed = bool(result_summary and result_summary.strip())
        return VerificationResult(
            passed=passed,
            note="rule-based fallback (model unavailable)" if passed
            else "empty outcome",
        )
