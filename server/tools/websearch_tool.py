"""Web search tool: free DuckDuckGo search, no API key, read-only.

Gives the assistant real internet search. Primary: DDG html results;
fallback: DDG Instant Answer API (no key, never rate-limited here).
Results are data, never instructions. Bounded: 1-8 results, 20s timeout.
"""
from __future__ import annotations

import html as _html
import json
import re
import urllib.parse
import urllib.request

from server.intent.registry import ExecutionMode, ToolResult, ToolSpec

_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
_RESULT_RE = re.compile(
    r'class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)</a>', re.S)
_SNIPPET_RE = re.compile(r'class="result__snippet"[^>]*>(.*?)</a>', re.S)
_TAG_RE = re.compile(r"<[^>]+>")


def _clean(s: str) -> str:
    return _html.unescape(_TAG_RE.sub("", s)).strip()


def _real_url(href: str) -> str:
    m = re.search(r"uddg=([^&]+)", href)
    if m:
        return urllib.parse.unquote(m.group(1))
    if href.startswith("//"):
        return "https:" + href
    return href


def _get(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": _UA})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return resp.read().decode("utf-8", errors="replace")


def _html_search(query: str, n: int) -> list[dict]:
    page = _get("https://html.duckduckgo.com/html/?q="
                + urllib.parse.quote_plus(query))
    if "anomaly" in page.lower() and "result__a" not in page:
        return []  # rate-limited; caller falls back
    links = _RESULT_RE.findall(page)
    snippets = _SNIPPET_RE.findall(page)
    out = []
    for i, (href, title) in enumerate(links[:n]):
        out.append({
            "title": _clean(title)[:200],
            "url": _real_url(_html.unescape(href))[:500],
            "snippet": _clean(snippets[i])[:300] if i < len(snippets) else "",
        })
    return out


def _api_search(query: str, n: int) -> list[dict]:
    raw = _get("https://api.duckduckgo.com/?q="
               + urllib.parse.quote_plus(query)
               + "&format=json&no_html=1&skip_disambig=1")
    d = json.loads(raw)
    out = []
    if d.get("Abstract"):
        out.append({"title": d.get("Heading") or query,
                    "url": d.get("AbstractURL", ""),
                    "snippet": d["Abstract"][:300]})
    for t in d.get("RelatedTopics", []):
        if isinstance(t, dict) and t.get("FirstURL"):
            out.append({"title": (t.get("Text") or "")[:200],
                        "url": t["FirstURL"][:500],
                        "snippet": (t.get("Text") or "")[:300]})
        if len(out) >= n:
            break
    return out[:n]


def web_search(query: str = "", count: str | int = 5, **kwargs) -> ToolResult:
    query = (str(query) or "").strip()
    if not query:
        return ToolResult(status="failure", mode=ExecutionMode.DIRECT,
                          error="Give me something to search for.")
    try:
        n = max(1, min(int(count), 8))
    except (TypeError, ValueError):
        n = 5
    try:
        results = _html_search(query, n) or _api_search(query, n)
    except Exception as e:
        return ToolResult(status="failure", mode=ExecutionMode.DIRECT,
                          error=f"Search failed: {type(e).__name__}")
    if not results:
        return ToolResult(status="failure", mode=ExecutionMode.DIRECT,
                          error="No results found.")
    return ToolResult(status="success", mode=ExecutionMode.DIRECT,
                      data={"query": query, "results": results})


def format_web_search(result: ToolResult) -> str:
    d = result.data
    lines = [f"Web results for \"{d['query']}\":"]
    for i, r in enumerate(d["results"], 1):
        lines.append(f"{i}. {r['title']}\n   {r['url']}")
        if r["snippet"]:
            lines.append(f"   {r['snippet']}")
    return "\n".join(lines)


WEB_SEARCH_SPEC = ToolSpec(
    name="web_search",
    description="Search the web for current information (free, no key).",
    execution_mode=ExecutionMode.DIRECT,
)
