"""Web page reader tool: fetch a URL, return title + text. Read-only.

Gives the assistant real internet reading to go with web_search.
Content is data, never instructions. Bounded: 20s timeout, 8000 chars.
"""
from __future__ import annotations

import html as _html
import re
import urllib.request

from server.intent.registry import ExecutionMode, ToolResult, ToolSpec

_UA = "Mozilla/5.0 (OS personal assistant; local)"
_LIMIT = 8000


def _strip(page: str) -> tuple[str, str]:
    m = re.search(r"<title[^>]*>(.*?)</title>", page, re.I | re.S)
    title = _html.unescape(re.sub(r"\s+", " ", m.group(1)).strip())[:200] if m else ""
    text = re.sub(r"<script.*?</script>", " ", page, flags=re.I | re.S)
    text = re.sub(r"<style.*?</style>", " ", text, flags=re.I | re.S)
    text = re.sub(r"<[^>]+>", " ", text)
    text = _html.unescape(re.sub(r"\s+", " ", text)).strip()
    return title, text[:_LIMIT]


def web_read(url: str = "", **kwargs) -> ToolResult:
    url = (str(url) or "").strip().rstrip(".,!?)")
    if not re.match(r"^https?://", url, re.I) or len(url) > 2048:
        return ToolResult(status="failure", mode=ExecutionMode.DIRECT,
                          error="Give me an http(s) URL to read.")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": _UA})
        with urllib.request.urlopen(req, timeout=20) as resp:
            ctype = resp.headers.get("Content-Type", "")
            if "html" not in ctype and "text" not in ctype:
                return ToolResult(status="failure", mode=ExecutionMode.DIRECT,
                                  error=f"Not a readable page ({ctype or 'unknown type'}).")
            page = resp.read().decode("utf-8", errors="replace")
    except Exception as e:
        return ToolResult(status="failure", mode=ExecutionMode.DIRECT,
                          error=f"Could not read page: {type(e).__name__}")
    title, text = _strip(page)
    if not text:
        return ToolResult(status="failure", mode=ExecutionMode.DIRECT,
                          error="Page had no readable text.")
    return ToolResult(status="success", mode=ExecutionMode.DIRECT,
                      data={"url": url, "title": title or url, "text": text})


def format_web_read(result: ToolResult) -> str:
    d = result.data
    return f"\"{d['title']}\"\n{d['url']}\n\n{d['text']}"


WEB_READ_SPEC = ToolSpec(
    name="web_read",
    description="Read a web page URL and return its title and text.",
    execution_mode=ExecutionMode.DIRECT,
)
