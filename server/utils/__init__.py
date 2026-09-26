"""OS shared utilities: logging setup and the perf timing harness (Section 37).

`perf` is a tiny latency capture helper. Each turn records named stages
(stt, llm_first_token, tts_first_audio, ...); the conversation manager drives
it and flushes a single JSON line per turn to `logs/perf.jsonl`.
"""
from __future__ import annotations

import json
import logging
import sys
import time
from contextlib import contextmanager
from pathlib import Path
from typing import Any

LogAdapter = logging.LoggerAdapter


def setup_logging(level: str = "INFO", file_path: str | None = None) -> None:
    root = logging.getLogger()
    root.setLevel(level)
    for h in list(root.handlers):
        root.removeHandler(h)
    fmt = logging.Formatter("%(levelname)s | %(name)s | %(message)s")

    # Suppress httpx/httpcore noisy defaults
    for name in ("httpx", "httpcore", "urllib3"):
        logging.getLogger(name).setLevel(logging.WARNING)

    sh = logging.StreamHandler(sys.stderr)
    sh.setFormatter(fmt)
    sh.setLevel(level)
    root.addHandler(sh)

    if file_path:
        try:
            Path(file_path).parent.mkdir(parents=True, exist_ok=True)
            fh = logging.FileHandler(file_path, encoding="utf-8")
            fh.setFormatter(fmt)
            fh.setLevel(level)
            root.addHandler(fh)
        except Exception:
            pass


class PerfTrace:
    """Captures named timestamps within a single conversational turn."""

    def __init__(self, sink: Path | None) -> None:
        self._sink = sink
        self._marks: dict[str, float] = {}
        self._stages: list[dict[str, Any]] = []
        self._start: float = time.perf_counter()
        self._prev: float = self._start

    def mark(self, name: str) -> None:
        t = time.perf_counter()
        self._marks[name] = t
        self._stages.append({"stage": name, "since_turn_start_ms": round((t - self._start) * 1000, 1)})
        self._prev = t

    def elapsed_since(self, name: str) -> float:
        if name not in self._marks:
            return -1.0
        return (time.perf_counter() - self._marks[name]) * 1000

    def total_ms(self) -> float:
        return (time.perf_counter() - self._start) * 1000

    def flush(self, label: str = "turn") -> None:
        if not self._sink:
            return
        try:
            self._sink.parent.mkdir(parents=True, exist_ok=True)
            with self._sink.open("a", encoding="utf-8") as f:
                f.write(json.dumps({"label": label, "total_ms": round(self.total_ms(), 1), "stages": self._stages}) + "\n")
        except Exception:
            pass


def make_perf(label: str, cfg_file: str | None = None) -> PerfTrace:
    sink = Path(cfg_file) if cfg_file else None
    p = PerfTrace(sink)
    p.mark(f"turn_start:{label}")
    return p
