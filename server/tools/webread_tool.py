"""Web page reader tool: fetch a URL, return title + text. Read-only.

Gives the assistant real internet reading to go with web_search.
Content is data, never instructions. Bounded: 20s timeout, 8000 chars.
"""
from __future__ import annotations

import html as _html
import ipaddress
import re
import socket
import urllib.error
import urllib.parse
import urllib.request

from server.intent.registry import ExecutionMode, ToolResult, ToolSpec

_UA = "Mozilla/5.0 (OS personal assistant; local)"
_LIMIT = 8000
_MAX_REDIRECTS = 5


_BLOCKED_NETWORKS = [
    # Loopback
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("::1/128"),
    # RFC1918 private
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    # Carrier-grade NAT (shared address space) - used inside ISP networks
    ipaddress.ip_network("100.64.0.0/10"),
    # Link-local (incl. cloud metadata endpoints like 169.254.169.254)
    ipaddress.ip_network("169.254.0.0/16"),
    ipaddress.ip_network("fe80::/10"),
    # Unspecified / multicast / reserved-unroutable
    ipaddress.ip_network("0.0.0.0/32"),
    ipaddress.ip_network("::/128"),
    ipaddress.ip_network("224.0.0.0/4"),
    ipaddress.ip_network("ff00::/8"),
    ipaddress.ip_network("240.0.0.0/4"),
]
# NOTE: 198.18.0.0/15 (benchmarking) is deliberately NOT blocked: some
# sandboxed/proxied environments resolve public DNS names into it, and it
# is not a plausible SSRF target in any real deployment.


def _ip_blocked(ip: str) -> bool:
    """True if the IP falls in a non-public / internal range (SSRF guard)."""
    try:
        addr = ipaddress.ip_address(ip)
    except ValueError:
        return True  # unparseable -> refuse
    return any(addr in net for net in _BLOCKED_NETWORKS)


def _url_blocked(url: str) -> str | None:
    """Return a reason if the URL must not be fetched (SSRF guard), else None.

    Blocks non-http(s) schemes, literal non-public IPs, and hostnames that
    resolve to non-public IPs (loopback, RFC1918, link-local, metadata
    endpoints like 169.254.169.254).
    """
    try:
        parts = urllib.parse.urlsplit(url)
    except ValueError:
        return "unparseable URL"
    if parts.scheme.lower() not in ("http", "https"):
        return f"scheme {parts.scheme or '(none)'} not allowed"
    host = (parts.hostname or "").rstrip(".")
    if not host:
        return "empty host"
    try:
        ipaddress.ip_address(host)
        is_literal_ip = True
    except ValueError:
        is_literal_ip = False
    if is_literal_ip:
        if _ip_blocked(host):
            return f"IP {host} is not public"
        return None
    try:
        infos = socket.getaddrinfo(host, None, type=socket.SOCK_STREAM)
    except socket.gaierror:
        return f"could not resolve {host}"
    for info in infos:
        if _ip_blocked(info[4][0]):
            return f"{host} resolves to a non-public IP"
    return None


class _SSRFRedirectHandler(urllib.request.HTTPRedirectHandler):
    """Reject redirects to non-public hosts and cap redirect hops."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        reason = _url_blocked(newurl)
        if reason:
            raise urllib.error.HTTPError(
                newurl, code, f"Redirect refused: {reason}", headers, fp)
        redirect_count = getattr(req, "_os_redirect_count", 0) + 1
        if redirect_count > _MAX_REDIRECTS:
            raise urllib.error.HTTPError(
                newurl, code, "Too many redirects", headers, fp)
        new_req = super().redirect_request(req, fp, code, msg, headers, newurl)
        if new_req is not None:
            new_req._os_redirect_count = redirect_count
        return new_req


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
    blocked = _url_blocked(url)
    if blocked:
        return ToolResult(status="failure", mode=ExecutionMode.DIRECT,
                          error=f"URL refused ({blocked}).")
    opener = urllib.request.build_opener(_SSRFRedirectHandler)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": _UA})
        with opener.open(req, timeout=20) as resp:
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
