"""Playwright Fallback Browser for OS.

Used when agent-browser CLI is not installed or fails.
Provides deterministic browser control via sync Playwright API.
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Optional

log = logging.getLogger("os.adapters.browser.playwright")

# Lazy-import so playwright is an optional dependency
_pw_imported = False
_sync_playwright = None
_PlaywrightModule = None


def _ensure_playwright():
    global _pw_imported, _sync_playwright, _PlaywrightModule
    if not _pw_imported:
        try:
            from playwright.sync_api import sync_playwright
            _sync_playwright = sync_playwright
            _pw_imported = True
        except ImportError:
            raise ImportError(
                "playwright is not installed. "
                "Run: pip install playwright && python -m playwright install chromium"
            )


class PlaywrightBrowser:
    """Sync Playwright wrapper that matches BrowserWorker's internal API."""

    def __init__(self) -> None:
        _ensure_playwright()
        self._contexts: dict[str, Any] = {}  # session_id → {browser, context, page}
        self._playwright: Any = None

    def _get_page(self, session_id: str):
        """Get or create a Playwright page for a session."""
        if session_id in self._contexts:
            return self._contexts[session_id]["page"]

        if self._playwright is None:
            self._playwright = _sync_playwright().__enter__()

        browser = self._playwright.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        self._contexts[session_id] = {
            "browser": browser,
            "context": context,
            "page": page,
        }
        return page

    def navigate(self, session_id: str, url: str):
        from adapters.browser.worker import BrowserReceipt

        page = self._get_page(session_id)
        try:
            resp = page.goto(url, wait_until="domcontentloaded", timeout=30000)
            status_code = resp.status if resp else 200
            return BrowserReceipt(
                action="navigate",
                url=url,
                status="SUCCEEDED" if status_code < 400 else "FAILED",
                status_code=status_code,
                details={"title": page.title(), "playwright": True},
            )
        except Exception as exc:
            return BrowserReceipt(
                action="navigate",
                url=url,
                status="FAILED",
                status_code=500,
                details={"error": str(exc), "playwright": True},
            )

    def extract_text(self, session_id: str) -> str:
        page = self._get_page(session_id)
        try:
            return page.inner_text("body")[:10000]
        except Exception:
            return ""

    def click(self, session_id: str, selector: str):
        from adapters.browser.worker import BrowserReceipt

        page = self._get_page(session_id)
        try:
            page.click(selector, timeout=5000)
            return BrowserReceipt(
                action="click",
                url=page.url,
                status="SUCCEEDED",
                details={"selector": selector, "playwright": True},
            )
        except Exception as exc:
            return BrowserReceipt(
                action="click",
                url=page.url,
                status="FAILED",
                details={"selector": selector, "error": str(exc), "playwright": True},
            )

    def fill(self, session_id: str, selector: str, value: str):
        from adapters.browser.worker import BrowserReceipt

        page = self._get_page(session_id)
        try:
            page.fill(selector, value, timeout=5000)
            return BrowserReceipt(
                action="fill",
                url=page.url,
                status="SUCCEEDED",
                details={"selector": selector, "playwright": True},
            )
        except Exception as exc:
            return BrowserReceipt(
                action="fill",
                url=page.url,
                status="FAILED",
                details={"selector": selector, "error": str(exc), "playwright": True},
            )

    def screenshot(self, session_id: str, path: str):
        from adapters.browser.worker import BrowserReceipt

        page = self._get_page(session_id)
        try:
            page.screenshot(path=path, full_page=True)
            return BrowserReceipt(
                action="screenshot",
                url=page.url,
                status="SUCCEEDED",
                screenshot_path=path,
                details={"playwright": True},
            )
        except Exception as exc:
            return BrowserReceipt(
                action="screenshot",
                url=page.url,
                status="FAILED",
                details={"error": str(exc), "playwright": True},
            )

    def close(self, session_id: str) -> None:
        ctx = self._contexts.pop(session_id, None)
        if ctx:
            try:
                ctx["browser"].close()
            except Exception:
                pass

    def close_all(self) -> None:
        for sid in list(self._contexts.keys()):
            self.close(sid)
        if self._playwright:
            try:
                self._playwright.__exit__(None, None, None)
            except Exception:
                pass
            self._playwright = None
