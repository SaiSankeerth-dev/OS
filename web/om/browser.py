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

import re
import threading
import uuid

from jarvis_os.primitives.browser_voice_oauth_fixes import DOMAccessibilityAgent
from .store import OmStore, now

READ_LIMIT = 100_000


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
    """One Chromium, one context per session id. Lazy; degrades to None."""

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._pw = None
        self._browser = None
        self._pages: dict[str, object] = {}
        self._console: dict[str, list[dict]] = {}
        self._ok: bool | None = None

    def available(self) -> bool:
        if self._ok is not None:
            return self._ok
        try:
            from playwright.sync_api import sync_playwright  # type: ignore
            self._pw = sync_playwright().start()
            self._browser = self._pw.chromium.launch(headless=True)
            self._ok = True
        except Exception:
            self._ok = False
        return self._ok

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

    def console_logs(self, sid: str) -> list[dict]:
        # ensure the page (and listeners) exist if the browser is available
        try:
            self._page(sid)
        except Exception:
            pass
        return list(self._console.get(sid, []))

    def pdf(self, sid: str) -> bytes:
        return self._page(sid).pdf()

    def open(self, sid: str, url: str) -> None:
        self._page(sid).goto(url, wait_until="domcontentloaded", timeout=30000)

    def read(self, sid: str) -> tuple[str, str, str]:
        page = self._page(sid)
        title = page.title()[:300]
        text = re.sub(r"\s+", " ", page.inner_text("body")).strip()[:READ_LIMIT]
        return page.url, title, text

    def screenshot(self, sid: str) -> bytes:
        return self._page(sid).screenshot(type="png")

    def content(self, sid: str) -> str:
        return self._page(sid).content()

    def interact(self, sid: str, selector: str, action: str = "click", value: str = "", label: str = "") -> dict:
        page = self._page(sid)
        loc = None
        if label and len(label.strip()) > 1:
            try:
                candidate = page.get_by_text(label.strip(), exact=False).first
                if candidate.count() > 0:
                    loc = candidate
            except Exception:
                pass
        if loc is None:
            try:
                loc = page.locator(selector).first
            except Exception:
                pass
        if loc is None:
            loc = page.locator("body")

        if action == "click":
            try:
                loc.click(timeout=3000)
            except Exception:
                pass
            return {"status": "clicked", "selector": selector, "label": label}
        elif action in ("fill", "type"):
            try:
                loc.fill(value, timeout=3000)
            except Exception:
                pass
            return {"status": "filled", "selector": selector, "value": value, "label": label}
        else:
            raise BrowserError(f"Unsupported action: {action}", 400)

    def close(self, sid: str) -> None:
        with self._lock:
            page = self._pages.pop(sid, None)
        if page is not None:
            try:
                page.context.close()
            except Exception:
                pass


class _HttpDriver:
    """Fallback: plain HTTP fetch, title + text extraction only."""

    def __init__(self) -> None:
        self._cached_html: dict[str, str] = {}

    def open(self, sid: str, url: str) -> None:
        pass  # stateless

    def content(self, sid: str, url: str | None = None) -> str:
        if sid in self._cached_html:
            return self._cached_html[sid]
        if not url:
            return ""
        import httpx
        try:
            resp = httpx.get(url, timeout=20, follow_redirects=True,
                             headers={"User-Agent": "Mozilla/5.0 (OS dashboard)"})
            resp.raise_for_status()
            self._cached_html[sid] = resp.text
            return resp.text
        except Exception:
            return ""

    def interact(self, sid: str, selector: str, action: str = "click", value: str = "") -> dict:
        return {"status": "simulated", "selector": selector, "action": action, "value": value}

    def read(self, sid: str, url: str) -> tuple[str, str, str]:
        import httpx
        try:
            resp = httpx.get(url, timeout=20, follow_redirects=True,
                             headers={"User-Agent": "Mozilla/5.0 (OS dashboard)"})
            resp.raise_for_status()
        except Exception as e:
            raise BrowserError(f"Could not fetch page: {type(e).__name__}", 502)
        self._cached_html[sid] = resp.text
        title, text = _strip_html(resp.text)
        return str(resp.url), title or str(resp.url), text

    def screenshot(self, sid: str) -> bytes:
        raise BrowserError("Screenshots need Playwright/Chromium installed", 503)

    def console_logs(self, sid: str) -> list[dict]:
        raise BrowserError("Console logs need Playwright/Chromium installed", 503)

    def pdf(self, sid: str) -> bytes:
        raise BrowserError("PDF export needs Playwright/Chromium installed", 503)

    def close(self, sid: str) -> None:
        self._cached_html.pop(sid, None)


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

    def read(self, sid: str) -> dict:
        row = self.store.get("browser_sessions", sid)
        if not row:
            raise BrowserError("Browser session not found", 404)
        with self._lock_for(sid):
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
            png = self._pw.screenshot(sid)
        return f"browser-{sid}.png", png

    def console(self, sid: str) -> dict:
        if not self.store.get("browser_sessions", sid):
            raise BrowserError("Browser session not found", 404)
        if not self._pw.available():
            raise BrowserError(
                "Console logs need Playwright/Chromium installed", 503)
        with self._lock_for(sid):
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
            try:
                raw = self._pw.pdf(sid)
            except Exception as e:
                raise BrowserError(f"Could not export PDF: {type(e).__name__}", 502)
        return f"browser-{sid}.pdf", raw

    def dom(self, sid: str) -> list[dict]:
        row = self.store.get("browser_sessions", sid)
        if not row:
            raise BrowserError("Browser session not found", 404)
        with self._lock_for(sid):
            html = ""
            if self._pw.available():
                try:
                    html = self._pw.content(sid)
                except Exception:
                    pass
            if not html:
                try:
                    html = self._http.content(sid, row.get("url"))
                except Exception:
                    pass
            return DOMAccessibilityAgent.build_interactive_dom_map(html or "")

    def interact(
        self,
        sid: str,
        action: str = "click",
        element_id: int | None = None,
        selector: str | None = None,
        text: str = "",
        value: str = "",
        approval_granted: bool = False,
    ) -> dict:
        row = self.store.get("browser_sessions", sid)
        if not row:
            raise BrowserError("Browser session not found", 404)

        val = value or text
        dom_map = self.dom(sid)
        matched_elem = None
        if element_id is not None:
            for el in dom_map:
                if el.get("element_id") == element_id:
                    matched_elem = el
                    break

        target_risk = matched_elem["risk"] if matched_elem else "LOW_NAVIGATION"
        target_selector = selector or (matched_elem.get("selector_hint") if matched_elem else "body")

        # HITL Gate Check for HIGH_AUTH_OR_WRITE
        if target_risk == "HIGH_AUTH_OR_WRITE" and not approval_granted:
            return {
                "status": "waiting_approval",
                "gate": "HITL_APPROVAL_REQUIRED",
                "element_id": element_id,
                "element": matched_elem,
                "action": action,
                "value": val,
                "message": f"Action '{action}' on high-risk element #{element_id} ({matched_elem.get('label') if matched_elem else ''}) requires HITL approval.",
            }

        # Autonomous execution for LOW_NAVIGATION or when approval_granted
        with self._lock_for(sid):
            try:
                if self._pw.available():
                    result = self._pw.interact(
                        sid, target_selector, action=action, value=val,
                        label=matched_elem.get("label", "") if matched_elem else "",
                    )
                else:
                    result = self._http.interact(sid, target_selector, action=action, value=val)
                return {
                    "status": "executed",
                    "element_id": element_id,
                    "element": matched_elem,
                    "action": action,
                    "result": result,
                    "engine": self.engine(),
                }
            except Exception as e:
                raise BrowserError(f"Interaction failed: {type(e).__name__} - {e}", 500)

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
