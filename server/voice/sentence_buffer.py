"""Sentence splitter that flushes on terminal punctuation but skips
decimal points and common abbreviations. Has a MAX_CHARS safety ceiling
to prevent runaway buffering if the model forgets punctuation.

Flush rules:
  - Split on terminal ".", "!", "?" when followed by space or EOF.
  - Skip when ".", "!", "?" sits between digits (decimal).
  - Skip when token immediately before terminator is a known abbreviation.
  - Skip fragments shorter than 3 chars.
  - Force-flush if buffer exceeds max_chars regardless of punctuation.
"""
from __future__ import annotations


_TERMINATORS = (".", "!", "?")
_ABBREVIATIONS = {
    "Mr", "Mrs", "Ms", "Dr", "St", "Jr", "Sr",
    "etc", "vs", "e.g", "i.e", "U.S", "U.K",
}


class SentenceBuffer:
    def __init__(self, max_chars: int = 240) -> None:
        self.max_chars = max_chars
        self._buf: str = ""

    def push(self, text: str) -> list[str]:
        self._buf += text
        return self._drain(force=False)

    def flush(self) -> list[str]:
        return self._drain(force=True)

    def _drain(self, force: bool) -> list[str]:
        out: list[str] = []
        while True:
            idx, _term = self._find_terminator()
            if idx == -1:
                break
            sent = self._buf[: idx + 1].strip()
            self._buf = self._buf[idx + 1 :]
            if len(sent) < 3:
                continue
            out.append(sent)
        if force and self._buf.strip():
            out.append(self._buf.strip())
            self._buf = ""
        if not force and len(self._buf) > self.max_chars:
            out.append(self._buf.strip())
            self._buf = ""
        return out

    def _find_terminator(self) -> tuple[int, str]:
        buf = self._buf
        for i, ch in enumerate(buf):
            if ch not in _TERMINATORS:
                continue
            # Terminator must be at end of buffer, or followed by whitespace.
            at_end = i == len(buf) - 1
            followed_by_space = (
                i + 1 < len(buf) and buf[i + 1] in (" ", "\n", "\t")
            )
            if not (at_end or followed_by_space):
                continue
            prev = buf[i - 1] if i > 0 else ""
            nxt = buf[i + 1] if i + 1 < len(buf) else ""
            if prev.isdigit() and nxt.isdigit():
                continue
            token = self._extract_token_before(buf, i)
            if token in _ABBREVIATIONS:
                continue
            return i, ch
        return -1, ""

    @staticmethod
    def _extract_token_before(buf: str, pos: int) -> str:
        i = pos - 1
        while i >= 0 and (buf[i].isalpha() or buf[i] == "."):
            i -= 1
        return buf[i + 1 : pos]