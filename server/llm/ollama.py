"""Streaming chat client for Ollama (http://localhost:11434/api/chat).

Ollama streams newline-delimited JSON objects with a `message` field whose
`content` is the incremental token. The final object carries `done: true`.
We convert this into a uniform `ChatChunk` stream.

Designed for low first-token-latency: we open the HTTP body as soon as the
request fires and yield every newline as it arrives (httpx async streaming).
"""
from __future__ import annotations

import json
import time
from typing import AsyncIterator

import httpx

from ..utils import PerfTrace
from .base import ChatChunk, LLMClient, Message


class OllamaClient:
    name = "ollama"

    def __init__(self, base_url: str, model: str, timeout_sec: float = 120.0) -> None:
        self.base_url = base_url.rstrip("/")
        self.model = model
        self.timeout_sec = timeout_sec

    async def health(self) -> bool:
        try:
            async with httpx.AsyncClient(timeout=5.0) as c:
                r = await c.get(f"{self.base_url}/api/tags")
                return r.status_code == 200
        except Exception:
            return False

    def _payload(
        self,
        messages: list[Message],
        *,
        temperature: float,
        max_tokens: int,
        stop: list[str] | None,
    ) -> dict:
        return {
            "model": self.model,
            "messages": [{"role": m.role, "content": m.content} for m in messages],
            "stream": True,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens,
                **({"stop": stop} if stop else {}),
            },
        }

    async def chat_stream(
        self,
        messages: list[Message],
        *,
        temperature: float = 0.6,
        max_tokens: int = 256,
        stop: list[str] | None = None,
        perf: PerfTrace | None = None,
    ) -> AsyncIterator[ChatChunk]:
        """Yield ChatChunk tokens from Ollama as they arrive.

        We start the request, then read the body line-by-line while the model
        is still generating; we do NOT buffer the whole response first.
        """
        req_start = time.perf_counter()
        first_seen = False
        body = self._payload(messages, temperature=temperature, max_tokens=max_tokens, stop=stop)

        timeout = httpx.Timeout(self.timeout_sec, connect=10.0)
        async with httpx.AsyncClient(timeout=timeout) as client:
            async with client.stream("POST", f"{self.base_url}/api/chat", json=body) as r:
                if r.status_code != 200:
                    # Drain readable error text.
                    err = await r.aread()
                    raise RuntimeError(f"ollama HTTP {r.status_code}: {err.decode('utf-8', 'ignore')[:300]}")

                async for raw in r.aiter_lines():
                    if not raw:
                        continue
                    try:
                        obj = json.loads(raw)
                    except json.JSONDecodeError:
                        continue
                    if not first_seen:
                        first_seen = True
                        if perf is not None:
                            perf.mark("llm_first_token")
                    delta = obj.get("message", {}).get("content", "")
                    if delta:
                        yield ChatChunk(
                            delta=delta,
                            done=False,
                            first_token_ms=round((time.perf_counter() - req_start) * 1000, 1),
                        )
                    if obj.get("done"):
                        if perf is not None:
                            perf.mark("llm_done")
                        yield ChatChunk(delta="", done=True)
                        return
        if not first_seen and perf is not None:
            perf.mark("llm_first_token_attempted")
        if perf is not None and "llm_done" not in {s["stage"] for s in perf._stages}:
            perf.mark("llm_done_no_stream")
