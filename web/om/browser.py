"""Persistent browser sessions for the OS dashboard.

Adapted from OpenMuse apps/server/src/browser.ts (MIT, (c) 2026 OpenMuse
contributors). Rewritten for OS: sessions persist in SQLite; the live page is
driven by Playwright/Chromium when available, otherwise a plain HTTP fetch
fallback extracts title + text. Reads are data-only (never instructions).

Manual takeover: the dashboard shows each session's URL/title/status and the
user can open the URL in their own browser; the agent side reads pages,
captures the JS console (console takeover view), takes screenshots, and
exports pages to PDF. No autonomous interactive browsing.
"""
from __future__ import annotations

import functools
import re
import threading
import uuid
from concurrent.futures import ThreadPoolExecutor

from .store import OmStore, now

# Batch B: browser navigation goes through the same SSRF policy as web_read -
# no fetching loopback/private/link-local/metadata addresses.
from server.tools.webread_tool import _url_blocked


def _check_url_allowed(url: str) -> None:
    reason = _url_blocked(url)
    if reason is not None:
        raise BrowserError(f"URL not allowed: {reason}", 422)

READ_LIMIT = 100_000

# -- Batch B: interactive browser actions -------------------------------------
# Every action validates its inputs, runs under the session lock, and
# returns observed page state (never a bare "done"). Selectors are CSS;
# keys are limited to non-text-entry keys (text goes through fill/type).
_SELECTOR_LIMIT = 500
_TEXT_LIMIT = 10_000
_MIN_TIMEOUT_MS = 1_000
_MAX_TIMEOUT_MS = 60_000
_ELEMENTS_JS = """() => {
  const out = [];
  const els = document.querySelectorAll(
    'a[href], button, input, select, textarea, [role="button"], [role="link"], [onclick]'
  );
  for (const el of els) {
    if (out.length >= 100) break;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0 && !el.value) continue;
    const text = (el.innerText || el.value || el.getAttribute('aria-label') || '')
      .trim().replace(/\\s+/g, ' ').slice(0, 80);
    let selector = null;
    if (el.id) selector = '#' + CSS.escape(el.id);
    else if (el.name) selector = el.tagName.toLowerCase() + '[name="' + String(el.name).replace(/"/g, '') + '"]';
    else if (el.getAttribute('aria-label')) selector = '[aria-label="' + String(el.getAttribute('aria-label')).replace(/"/g, '').slice(0, 50) + '"]';
    else if (text) selector = el.tagName.toLowerCase() + ':has-text("' + text.slice(0, 30).replace(/"/g, '') + '")';
    out.push({
      tag: el.tagName.toLowerCase(), text: text, selector: selector,
      href: el.href ? String(el.href).slice(0, 300) : null,
      type: el.type || null,
    });
  }
  return out;
}"""
_DESCRIBE_JS = """(sel) => {
  const el = document.querySelector(sel);
  if (!el) return null;
  return {
    tag: el.tagName.toLowerCase(),
    text: (el.innerText || el.value || el.getAttribute('aria-label') || '').trim().replace(/\\s+/g, ' ').slice(0, 120),
    href: el.href ? String(el.href).slice(0, 300) : null,
    type: el.type || null,
  };
}"""
_ALLOWED_KEYS = {
    "Enter", "Tab", "Escape", "Backspace", "Delete",
    "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
    "Home", "End", "PageUp", "PageDown",
} | {f"F{i}" for i in range(1, 13)}


def _validate_interaction(selector: str, text: str | None = None,
                          key: str | None = None,
                          timeout_ms: int = 10_000) -> tuple[str, int]:
    """Validate one browser-action call. Raises BrowserError (never silent)."""
    selector = (selector or "").strip()
    if not selector:
        raise BrowserError("Give a CSS selector for the element", 422)
    if len(selector) > _SELECTOR_LIMIT:
        raise BrowserError("Selector too long (max 500 chars)", 422)
    if text is not None and len(text) > _TEXT_LIMIT:
        raise BrowserError("Text too long (max 10000 chars)", 422)
    if key is not None and key not in _ALLOWED_KEYS:
        raise BrowserError(
            f"Key '{key}' not allowed (Enter, Tab, Escape, arrows, F1-F12…)", 422)
    try:
        timeout_ms = int(timeout_ms)
    except (TypeError, ValueError):
        raise BrowserError("Timeout must be a number of milliseconds", 422)
    if not (_MIN_TIMEOUT_MS <= timeout_ms <= _MAX_TIMEOUT_MS):
        raise BrowserError("Timeout must be between 1 and 60 seconds", 422)
    return selector, timeout_ms


class BrowserError(Exception):
    def __init__(self, message: str, status: int = 422):
        super().__init__(message)
        self.status = status


def _strip_html(html: str) -> tuple[str, str]:
    title = ""
    m = re.search(r"<title[^>]*>(.*?)</title>", html, re.I | re.S)
    if m:
        title = re.sub(r"\s+", " ", m.group(1)).strip()[:300]
    text = re.sub(r"<script.*?</script>", " ", html, flags=re.I | re.S)
    text = re.sub(r"<style.*?</style>", " ", text, flags=re.I | re.S)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return title, text[:READ_LIMIT]


class _PlaywrightDriver:
    """One Chromium, one context per session id. Lazy; degrades to None.

    Playwright's sync API has thread affinity: everything must run on the
    thread that started it, and it cannot start inside a running asyncio
    loop (which is exactly where FastAPI request handlers run). So every
    public method hops to a dedicated single Playwright thread via _run().
    Internal helpers (_page, _act, _evidence, ...) run directly on that
    thread and must never call _run() themselves (deadlock).
    """

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._pw = None
        self._browser = None
        self._pages: dict[str, object] = {}
        self._console: dict[str, list[dict]] = {}
        self._ok: bool | None = None
        # Session ids with a real page opened in THIS process. After a
        # dashboard restart this is empty even though SQLite rows persist;
        # is_live() lets callers detect that instead of silently
        # substituting a blank page.
        self._live: set[str] = set()
        self._exec = ThreadPoolExecutor(
            max_workers=1, thread_name_prefix="os-pw")

    def _run(self, fn, *args, **kwargs):
        """Run fn on the dedicated Playwright thread, propagating errors."""
        fut = self._exec.submit(fn, *args, **kwargs)
        return fut.result(timeout=180)

    def _on_pw_thread(fn):
        """Decorator: public driver methods run on the Playwright thread."""
        @functools.wraps(fn)
        def wrapper(self, *args, **kwargs):
            return self._run(fn, self, *args, **kwargs)
        return wrapper

    @_on_pw_thread
    def available(self) -> bool:
        if self._ok is not None:
            return self._ok
        try:
            from playwright.sync_api import sync_playwright  # type: ignore
            self._pw = sync_playwright().start()
            launch_kw: dict = {"headless": True}
            proxy = self._proxy_config()
            if proxy:
                launch_kw["proxy"] = proxy
            self._browser = self._pw.chromium.launch(**launch_kw)
            self._ok = True
        except Exception:
            self._ok = False
        return self._ok

    @staticmethod
    def _proxy_config() -> dict | None:
        """Honor the standard proxy env vars, like every other HTTP client.

        Chromium does not read them on its own; without this, browsing
        fails in proxied environments (e.g. sandboxes) even though curl,
        pip and httpx all work fine.
        """
        import os
        from urllib.parse import urlsplit

        raw = (os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
               or os.environ.get("HTTP_PROXY") or os.environ.get("http_proxy"))
        if not raw:
            return None
        try:
            p = urlsplit(raw)
            if not p.hostname or not p.port:
                return None
            cfg: dict = {"server": f"{p.scheme or 'http'}://{p.hostname}:{p.port}"}
            if p.username:
                from urllib.parse import unquote
                cfg["username"] = unquote(p.username)
                cfg["password"] = unquote(p.password or "")
            # Honor no_proxy/NO_PROXY so loopback and intranet hosts
            # bypass the proxy (otherwise even localhost goes through it).
            no_proxy = os.environ.get("no_proxy") or os.environ.get("NO_PROXY") or ""
            bypass = ",".join(
                h.strip() for h in no_proxy.split(",") if h.strip())
            if bypass:
                cfg["bypass"] = bypass
            return cfg
        except Exception:
            return None

    def _page(self, sid: str):
        with self._lock:
            page = self._pages.get(sid)
            if page is None:
                ctx = self._browser.new_context(viewport={"width": 1280, "height": 800})
                page = ctx.new_page()
                self._pages[sid] = page
                self._attach_console(sid, page)
            return page

    def _attach_console(self, sid: str, page) -> None:
        """Capture console messages + page errors (console takeover view)."""
        buf = self._console.setdefault(sid, [])

        def _push(entry: dict) -> None:
            buf.append(entry)
            del buf[:-200]  # cap memory

        def _on_console(msg) -> None:
            try:
                _push({"type": msg.type, "text": str(msg.text)[:2000]})
            except Exception:
                pass

        def _on_error(exc) -> None:
            _push({"type": "pageerror", "text": str(exc)[:2000]})

        try:
            page.on("console", _on_console)
            page.on("pageerror", _on_error)
        except Exception:
            pass

    @_on_pw_thread
    def console_logs(self, sid: str) -> list[dict]:
        # ensure the page (and listeners) exist if the browser is available
        try:
            self._page(sid)
        except Exception:
            pass
        return list(self._console.get(sid, []))

    @_on_pw_thread
    def pdf(self, sid: str) -> bytes:
        return self._page(sid).pdf()

    @_on_pw_thread
    def is_live(self, sid: str) -> bool:
        """True only if this process opened a real page for sid."""
        with self._lock:
            return sid in self._live

    @_on_pw_thread
    def open(self, sid: str, url: str) -> None:
        self._page(sid).goto(url, wait_until="domcontentloaded", timeout=30000)
        with self._lock:
            self._live.add(sid)

    @_on_pw_thread
    def read(self, sid: str) -> tuple[str, str, str]:
        page = self._page(sid)
        title = page.title()[:300]
        text = re.sub(r"\s+", " ", page.inner_text("body")).strip()[:READ_LIMIT]
        return page.url, title, text

    @_on_pw_thread
    def screenshot(self, sid: str) -> bytes:
        return self._page(sid).screenshot(type="png")

    # -- Batch B: interactive actions. Each returns observed page state. ----
    def _evidence(self, sid: str, page) -> dict:
        return {"url": page.url, "title": page.title()[:300]}

    def _act(self, sid: str, selector: str, timeout_ms: int, fn) -> dict:
        """Run fn(page, selector) with honest failure mapping."""
        selector, timeout_ms = _validate_interaction(selector, timeout_ms=timeout_ms)
        page = self._page(sid)
        try:
            fn(page, selector, timeout_ms)
        except Exception as e:
            msg = str(e)[:300]
            if "Timeout" in type(e).__name__ or "timeout" in msg.lower():
                raise BrowserError(
                    f"Timed out waiting for '{selector}'", 504)
            raise BrowserError(f"Action failed on '{selector}': {msg}", 502)
        ev = self._evidence(sid, page)
        ev["selector"] = selector
        return ev

    @_on_pw_thread
    def click(self, sid: str, selector: str, timeout_ms: int = 10_000) -> dict:
        return self._act(
            sid, selector, timeout_ms,
            lambda page, sel, t: page.click(sel, timeout=t))

    @_on_pw_thread
    def fill(self, sid: str, selector: str, text: str,
             timeout_ms: int = 10_000) -> dict:
        _validate_interaction(selector, text=text, timeout_ms=timeout_ms)
        page = self._page(sid)
        try:
            page.fill(selector, text, timeout=timeout_ms)
            value = page.input_value(selector)  # read-back, not assumed
        except Exception as e:
            raise BrowserError(f"Fill failed on '{selector}': {str(e)[:200]}", 502)
        ev = self._evidence(sid, page)
        ev.update({"selector": selector, "value": (value or "")[:1000]})
        return ev

    @_on_pw_thread
    def type_text(self, sid: str, selector: str, text: str,
                  timeout_ms: int = 10_000) -> dict:
        _validate_interaction(selector, text=text, timeout_ms=timeout_ms)
        page = self._page(sid)
        try:
            page.click(selector, timeout=timeout_ms)
            page.keyboard.type(text)
            value = page.input_value(selector)  # read-back, not assumed
        except Exception as e:
            raise BrowserError(f"Type failed on '{selector}': {str(e)[:200]}", 502)
        ev = self._evidence(sid, page)
        ev.update({"selector": selector, "value": (value or "")[:1000]})
        return ev

    @_on_pw_thread
    def press(self, sid: str, selector: str, key: str,
              timeout_ms: int = 10_000) -> dict:
        _validate_interaction(selector, key=key, timeout_ms=timeout_ms)
        page = self._page(sid)
        try:
            page.press(selector, key, timeout=timeout_ms)
        except Exception as e:
            raise BrowserError(f"Key press failed on '{selector}': {str(e)[:200]}", 502)
        ev = self._evidence(sid, page)
        ev.update({"selector": selector, "key": key})
        return ev

    @_on_pw_thread
    def select(self, sid: str, selector: str, value: str,
               timeout_ms: int = 10_000) -> dict:
        _validate_interaction(selector, text=value, timeout_ms=timeout_ms)
        page = self._page(sid)
        try:
            page.select_option(selector, value, timeout=timeout_ms)
            chosen = page.input_value(selector)  # read-back, not assumed
        except Exception as e:
            raise BrowserError(f"Select failed on '{selector}': {str(e)[:200]}", 502)
        ev = self._evidence(sid, page)
        ev.update({"selector": selector, "value": (chosen or "")[:1000]})
        return ev

    @_on_pw_thread
    def wait_for(self, sid: str, selector: str | None = None,
                 state: str = "visible",
                 timeout_ms: int = 10_000) -> dict:
        # A real condition, never an arbitrary sleep.
        if selector:
            selector, timeout_ms = _validate_interaction(
                selector, timeout_ms=timeout_ms)
            if state not in ("visible", "hidden", "attached", "detached"):
                raise BrowserError(f"Unknown wait state '{state}'", 422)
        else:
            _, timeout_ms = _validate_interaction("body", timeout_ms=timeout_ms)
            if state not in ("load", "domcontentloaded", "networkidle"):
                raise BrowserError(f"Unknown load state '{state}'", 422)
        page = self._page(sid)
        try:
            if selector:
                page.wait_for_selector(selector, state=state, timeout=timeout_ms)
            else:
                page.wait_for_load_state(state, timeout=timeout_ms)
        except Exception:
            raise BrowserError(
                f"Wait timed out ({'selector ' + selector if selector else state})", 504)
        return self._evidence(sid, page)

    @_on_pw_thread
    def elements(self, sid: str) -> list[dict]:
        page = self._page(sid)
        try:
            return page.evaluate(_ELEMENTS_JS) or []
        except Exception as e:
            raise BrowserError(f"Could not list elements: {str(e)[:200]}", 502)

    @_on_pw_thread
    def describe(self, sid: str, selector: str) -> dict:
        """Read-only element lookup for approval drafts. No side effects."""
        selector, _ = _validate_interaction(selector)
        page = self._page(sid)
        try:
            info = page.evaluate(_DESCRIBE_JS, selector)
        except Exception as e:
            raise BrowserError(f"Could not inspect '{selector}': {str(e)[:200]}", 502)
        if not info:
            raise BrowserError(f"No element matches '{selector}'", 404)
        info["selector"] = selector
        return info

    @_on_pw_thread
    def close(self, sid: str) -> None:
        with self._lock:
            page = self._pages.pop(sid, None)
            self._live.discard(sid)
        if page is not None:
            try:
                page.context.close()
            except Exception:
                pass

    @_on_pw_thread
    def shutdown(self) -> None:
        """Stop the browser and Playwright entirely.

        The dashboard process keeps the driver alive for its lifetime;
        this is for tests, so a real-browser test never leaks the
        event loop into whatever runs afterwards.
        """
        with self._lock:
            for sid, page in list(self._pages.items()):
                try:
                    page.context.close()
                except Exception:
                    pass
            self._pages.clear()
            self._live.clear()
            self._console.clear()
        try:
            if self._browser is not None:
                self._browser.close()
        except Exception:
            pass
        try:
            if self._pw is not None:
                self._pw.stop()
        except Exception:
            pass
        self._browser = None
        self._pw = None
        self._ok = None


class _HttpDriver:
    """Fallback: plain HTTP fetch, title + text extraction only."""

    def open(self, sid: str, url: str) -> None:
        pass  # stateless

    def read(self, sid: str, url: str) -> tuple[str, str, str]:
        import httpx
        try:
            resp = httpx.get(url, timeout=20, follow_redirects=True,
                             headers={"User-Agent": "Mozilla/5.0 (OS dashboard)"})
            resp.raise_for_status()
        except Exception as e:
            raise BrowserError(f"Could not fetch page: {type(e).__name__}", 502)
        title, text = _strip_html(resp.text)
        return str(resp.url), title or str(resp.url), text

    def screenshot(self, sid: str) -> bytes:
        raise BrowserError("Screenshots need Playwright/Chromium installed", 503)

    def console_logs(self, sid: str) -> list[dict]:
        raise BrowserError("Console logs need Playwright/Chromium installed", 503)

    def pdf(self, sid: str) -> bytes:
        raise BrowserError("PDF export needs Playwright/Chromium installed", 503)

    def close(self, sid: str) -> None:
        pass

    # Batch B: the HTTP fallback cannot interact - say so honestly.
    def _unsupported(self, what: str) -> BrowserError:
        return BrowserError(
            f"{what} needs Playwright/Chromium installed", 503)

    def click(self, sid: str, selector: str, timeout_ms: int = 10_000) -> dict:
        raise self._unsupported("Clicking")

    def fill(self, sid: str, selector: str, text: str,
             timeout_ms: int = 10_000) -> dict:
        raise self._unsupported("Filling fields")

    def type_text(self, sid: str, selector: str, text: str,
                  timeout_ms: int = 10_000) -> dict:
        raise self._unsupported("Typing")

    def press(self, sid: str, selector: str, key: str,
              timeout_ms: int = 10_000) -> dict:
        raise self._unsupported("Key presses")

    def select(self, sid: str, selector: str, value: str,
               timeout_ms: int = 10_000) -> dict:
        raise self._unsupported("Selecting options")

    def wait_for(self, sid: str, selector: str | None = None,
                 state: str = "visible",
                 timeout_ms: int = 10_000) -> dict:
        raise self._unsupported("Waiting for conditions")

    def elements(self, sid: str) -> list[dict]:
        raise self._unsupported("Listing elements")

    def describe(self, sid: str, selector: str) -> dict:
        raise self._unsupported("Inspecting elements")


class BrowserService:
    def __init__(self, store: OmStore) -> None:
        self.store = store
        self._pw = _PlaywrightDriver()
        self._http = _HttpDriver()
        self._serial: dict[str, threading.Lock] = {}
        self._serial_lock = threading.Lock()

    def engine(self) -> str:
        return "playwright" if self._pw.available() else "http"

    def _lock_for(self, sid: str) -> threading.Lock:
        with self._serial_lock:
            return self._serial.setdefault(sid, threading.Lock())

    # -- session CRUD -----------------------------------------------------
    def list(self) -> list[dict]:
        return [self._view(r) for r in
                self.store.list("browser_sessions", order="updated_at DESC")]

    def get(self, sid: str) -> dict:
        row = self.store.get("browser_sessions", sid)
        if not row:
            raise BrowserError("Browser session not found", 404)
        return self._view(row)

    def _view(self, row: dict) -> dict:
        return {
            "id": row["id"], "url": row["url"], "title": row["title"],
            "status": row["status"], "updatedAt": row["updated_at"],
            "engine": self.engine(),
        }

    def create(self, url: str) -> dict:
        url = (url or "").strip()
        if not url or len(url) > 2048 or not re.match(r"^https?://", url, re.I):
            raise BrowserError("Give an http(s) URL", 422)
        _check_url_allowed(url)
        row = self.store.insert("browser_sessions", {
            "id": uuid.uuid4().hex[:12], "url": url,
            "title": "New browser session", "status": "idle",
            "updated_at": now(),
        })
        return self.open(row["id"], url)

    def open(self, sid: str, url: str | None = None) -> dict:
        row = self.store.get("browser_sessions", sid)
        if not row:
            raise BrowserError("Browser session not found", 404)
        target = (url or "").strip() or row["url"]
        if not re.match(r"^https?://", target, re.I):
            raise BrowserError("Give an http(s) URL", 422)
        _check_url_allowed(target)
        with self._lock_for(sid):
            try:
                if self._pw.available():
                    self._pw.open(sid, target)
                    url_now, title, _text = self._pw.read(sid)
                else:
                    url_now, title, _text = self._http.read(sid, target)
                patch = {"url": url_now, "title": title or target,
                         "status": "active", "updated_at": now()}
            except BrowserError:
                patch = {"url": target, "status": "error", "updated_at": now()}
                self.store.update("browser_sessions", sid, patch)
                raise
            except Exception as e:
                patch = {"url": target, "status": "error", "updated_at": now()}
                self.store.update("browser_sessions", sid, patch)
                raise BrowserError(f"Browser failed: {type(e).__name__}", 502)
            updated = self.store.update("browser_sessions", sid, patch)
            return self._view(updated or {**row, **patch})

    def navigate(self, sid: str, url: str) -> dict:
        return self.open(sid, url)

    def _ensure_live_page(self, sid: str) -> None:
        """Refuse to operate on a session whose live page was lost.

        After a dashboard restart the driver's in-memory pages are gone
        while SQLite rows persist. Without this guard the driver would
        silently substitute a blank page and callers would persist
        ``about:blank`` over the real URL, reporting ``"active"``.
        """
        if self._pw.available() and not self._pw.is_live(sid):
            self.store.update("browser_sessions", sid,
                              {"status": "stale", "updated_at": now()})
            raise BrowserError(
                "Browser session went stale (the dashboard restarted and the "
                "live page was lost). Re-open the page to continue.", 410)

    def read(self, sid: str) -> dict:
        row = self.store.get("browser_sessions", sid)
        if not row:
            raise BrowserError("Browser session not found", 404)
        with self._lock_for(sid):
            self._ensure_live_page(sid)
            try:
                if self._pw.available():
                    url_now, title, text = self._pw.read(sid)
                else:
                    url_now, title, text = self._http.read(sid, row["url"])
            except Exception as e:
                raise BrowserError(f"Could not read page: {type(e).__name__}", 502)
            truncated = len(text) >= READ_LIMIT
            self.store.update("browser_sessions", sid, {
                "url": url_now, "title": title or url_now,
                "status": "active", "updated_at": now()})
            return {"id": sid, "url": url_now, "title": title,
                    "text": text, "truncated": truncated}

    def screenshot(self, sid: str) -> tuple[str, bytes]:
        if not self.store.get("browser_sessions", sid):
            raise BrowserError("Browser session not found", 404)
        if not self._pw.available():
            raise BrowserError(
                "Screenshots need Playwright/Chromium installed", 503)
        with self._lock_for(sid):
            self._ensure_live_page(sid)
            png = self._pw.screenshot(sid)
        return f"browser-{sid}.png", png

    def console(self, sid: str) -> dict:
        if not self.store.get("browser_sessions", sid):
            raise BrowserError("Browser session not found", 404)
        if not self._pw.available():
            raise BrowserError(
                "Console logs need Playwright/Chromium installed", 503)
        with self._lock_for(sid):
            self._ensure_live_page(sid)
            try:
                logs = self._pw.console_logs(sid)
            except Exception as e:
                raise BrowserError(f"Could not read console: {type(e).__name__}", 502)
        return {"id": sid, "logs": logs, "count": len(logs)}

    def page_pdf(self, sid: str) -> tuple[str, bytes]:
        if not self.store.get("browser_sessions", sid):
            raise BrowserError("Browser session not found", 404)
        if not self._pw.available():
            raise BrowserError(
                "PDF export needs Playwright/Chromium installed", 503)
        with self._lock_for(sid):
            self._ensure_live_page(sid)
            try:
                raw = self._pw.pdf(sid)
            except Exception as e:
                raise BrowserError(f"Could not export PDF: {type(e).__name__}", 502)
        return f"browser-{sid}.pdf", raw

    # -- Batch B: interactive actions through the common session contract --
    def _require_interactive(self, sid: str) -> dict:
        row = self.store.get("browser_sessions", sid)
        if not row:
            raise BrowserError("Browser session not found", 404)
        if not self._pw.available():
            raise BrowserError(
                "Interactive browser actions need Playwright/Chromium installed",
                503)
        return row

    def _interact(self, sid: str, fn) -> dict:
        """Run one driver action under the session lock; persist new state."""
        self._require_interactive(sid)
        with self._lock_for(sid):
            self._ensure_live_page(sid)
            try:
                result = fn()
            except BrowserError:
                raise
            except Exception as e:
                raise BrowserError(
                    f"Browser action failed: {type(e).__name__}", 502)
            if isinstance(result, dict) and result.get("url"):
                self.store.update("browser_sessions", sid, {
                    "url": result["url"],
                    "title": result.get("title") or result["url"],
                    "status": "active", "updated_at": now()})
            result = dict(result) if isinstance(result, dict) else {}
            result["session_id"] = sid
            return result

    def click(self, sid: str, selector: str,
              timeout_ms: int = 10_000) -> dict:
        return self._interact(
            sid, lambda: self._pw.click(sid, selector, timeout_ms))

    def fill(self, sid: str, selector: str, text: str,
             timeout_ms: int = 10_000) -> dict:
        return self._interact(
            sid, lambda: self._pw.fill(sid, selector, text, timeout_ms))

    def type_text(self, sid: str, selector: str, text: str,
                  timeout_ms: int = 10_000) -> dict:
        return self._interact(
            sid, lambda: self._pw.type_text(sid, selector, text, timeout_ms))

    def press(self, sid: str, selector: str, key: str,
              timeout_ms: int = 10_000) -> dict:
        return self._interact(
            sid, lambda: self._pw.press(sid, selector, key, timeout_ms))

    def select(self, sid: str, selector: str, value: str,
               timeout_ms: int = 10_000) -> dict:
        return self._interact(
            sid, lambda: self._pw.select(sid, selector, value, timeout_ms))

    def wait_for(self, sid: str, selector: str | None = None,
                 state: str = "visible",
                 timeout_ms: int = 10_000) -> dict:
        return self._interact(
            sid, lambda: self._pw.wait_for(sid, selector, state, timeout_ms))

    def elements(self, sid: str) -> dict:
        els = self._interact(sid, lambda: {"elements": self._pw.elements(sid)})
        return els

    def describe(self, sid: str, selector: str) -> dict:
        """Read-only element description for approval drafts. No side effects."""
        self._require_interactive(sid)
        with self._lock_for(sid):
            self._ensure_live_page(sid)
            info = self._pw.describe(sid, selector)
        info["session_id"] = sid
        return info

    def perform_action(self, action: dict) -> dict:
        """Execute one approved browser action. Unknown kinds fail closed."""
        kind = (action or {}).get("kind")
        sid = (action or {}).get("session_id")
        handler = {
            "click": lambda: self.click(sid, action.get("selector", ""),
                                        action.get("timeout_ms", 10_000)),
            "fill": lambda: self.fill(sid, action.get("selector", ""),
                                       action.get("text", ""),
                                       action.get("timeout_ms", 10_000)),
            "type": lambda: self.type_text(sid, action.get("selector", ""),
                                            action.get("text", ""),
                                            action.get("timeout_ms", 10_000)),
            "press": lambda: self.press(sid, action.get("selector", ""),
                                         action.get("key", ""),
                                         action.get("timeout_ms", 10_000)),
            "select": lambda: self.select(sid, action.get("selector", ""),
                                          action.get("value", ""),
                                          action.get("timeout_ms", 10_000)),
        }.get(kind)
        if handler is None or not sid:
            raise BrowserError(f"Unknown browser action '{kind}'", 422)
        return handler()

    def close(self, sid: str) -> dict:
        row = self.store.get("browser_sessions", sid)
        if not row:
            raise BrowserError("Browser session not found", 404)
        with self._lock_for(sid):
            try:
                if self._pw.available():
                    self._pw.close(sid)
                    self._pw._console.pop(sid, None)
                else:
                    self._http.close(sid)
            finally:
                updated = self.store.update("browser_sessions", sid,
                                            {"status": "closed", "updated_at": now()})
        return self._view(updated or row)

    def delete(self, sid: str) -> bool:
        try:
            self.close(sid)
        except BrowserError:
            pass
        return self.store.delete("browser_sessions", sid)


def get_browser(store: OmStore | None = None) -> BrowserService:
    return BrowserService(store or OmStore())
