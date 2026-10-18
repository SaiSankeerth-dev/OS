"""Browser Harness Backend for OS.

Primary real-browser execution engine. Connects via Playwright / Chrome DevTools
Protocol (CDP), manages dedicated persistent profiles for authenticated sessions,
and enables visible browser sign-ins without risking accidental personal profile leakage.
"""
from __future__ import annotations

import base64
from concurrent.futures import ThreadPoolExecutor
import logging
import os
import shutil
import threading
import time
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional

from jarvis_os.primitives.browser_voice_oauth_fixes import DOMAccessibilityAgent
from server.computer.backends.base import BaseComputerBackend
from server.computer.interface import (
    ActionResult,
    BackendCapabilities,
    BackendCostKind,
    ComputerControlError,
    HealthStatus,
    ObservationResult,
    SessionNotFoundError,
    SessionState,
    TabInfo,
    WindowInfo,
)

log = logging.getLogger("os.computer.browser_harness")


class BrowserHarnessBackend(BaseComputerBackend):
    """Primary browser automation backend with persistent profiles and CDP support."""

    name: str = "browser_harness"

    def __init__(self, profile_root: Optional[str] = None) -> None:
        super().__init__()
        self.profile_root = Path(profile_root or ".os_browser_profile")
        self.profile_root.mkdir(parents=True, exist_ok=True)
        self._pw: Any = None
        self._browser_contexts: Dict[str, Any] = {}
        self._pages: Dict[str, Any] = {}
        self._cdp_endpoints: Dict[str, str] = {}
        self._executor = ThreadPoolExecutor(max_workers=1, thread_name_prefix="browser_harness_pw")
        self._last_health: Optional[HealthStatus] = None
        self._last_health_ts: float = 0.0

    def _run_worker(self, func, *args, **kwargs):
        """Execute a callable strictly on the dedicated single-threaded Playwright worker."""
        if threading.current_thread().name.startswith("browser_harness_pw"):
            return func(*args, **kwargs)
        future = self._executor.submit(func, *args, **kwargs)
        return future.result()

    def health_check(self, force_refresh: bool = False) -> HealthStatus:
        """Check if Playwright and Chromium are installed and operable."""
        now = time.time()
        if not force_refresh and self._last_health and (now - self._last_health_ts < 30.0):
            return self._last_health

        def _impl():
            try:
                from playwright.sync_api import sync_playwright

                if self._pw is not None:
                    return HealthStatus(
                        ok=True,
                        backend=self.name,
                        message="Playwright Chromium runtime verified and active",
                        details={"engine": "playwright_cdp", "profile_root": str(self.profile_root), "sessions": len(self._pages)},
                    )

                pw = sync_playwright().start()
                browser = pw.chromium.launch(headless=True)
                browser.close()
                pw.stop()
                return HealthStatus(
                    ok=True,
                    backend=self.name,
                    message="Playwright Chromium runtime verified and ready",
                    details={"engine": "playwright_cdp", "profile_root": str(self.profile_root)},
                )
            except Exception as e:
                return HealthStatus(
                    ok=False,
                    backend=self.name,
                    message=f"Chromium runtime unavailable: {e}",
                    details={"error": str(e)},
                )

        status = self._run_worker(_impl)
        self._last_health = status
        self._last_health_ts = now
        return status

    def get_capabilities(self) -> BackendCapabilities:
        return BackendCapabilities(
            supports_browser=True,
            supports_desktop=False,
            supports_virtual_sandbox=False,
            supports_visual_clicks=True,
            supports_dom_locators=True,
            supports_file_download=True,
            supports_auth_profiles=True,
            cost_classification=BackendCostKind.ZERO_LOCAL,
            max_concurrent_sessions=5,
        )

    def start_session(self, config: Optional[Dict[str, Any]] = None) -> SessionState:
        return self._run_worker(self._start_session_impl, config)

    def _start_session_impl(self, config: Optional[Dict[str, Any]] = None) -> SessionState:
        config = config or {}
        session_id = config.get("session_id") or uuid.uuid4().hex[:12]
        headless = config.get("headless", True)
        cdp_url = config.get("cdp_url")

        user_data_dir = self.profile_root / f"session_{session_id}"
        user_data_dir.mkdir(parents=True, exist_ok=True)

        with self._get_lock(session_id):
            try:
                from playwright.sync_api import sync_playwright

                if self._pw is None:
                    self._pw = sync_playwright().start()

                if cdp_url:
                    # Connect to existing Chrome over Chrome DevTools Protocol
                    browser = self._pw.chromium.connect_over_cdp(cdp_url)
                    context = browser.contexts[0] if browser.contexts else browser.new_context()
                    self._cdp_endpoints[session_id] = cdp_url
                else:
                    # Launch persistent context with stealth anti-detection flags & dedicated profile
                    stealth_args = [
                        "--disable-blink-features=AutomationControlled",
                        "--no-sandbox",
                        "--disable-infobars",
                        "--disable-dev-shm-usage",
                        "--no-first-run",
                        "--no-default-browser-check",
                    ]
                    context = self._pw.chromium.launch_persistent_context(
                        user_data_dir=str(user_data_dir),
                        headless=headless,
                        viewport={"width": 1280, "height": 800},
                        accept_downloads=True,
                        user_agent=(
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                            "AppleWebKit/537.36 (KHTML, like Gecko) "
                            "Chrome/124.0.0.0 Safari/537.36"
                        ),
                        args=stealth_args,
                        ignore_default_args=["--enable-automation"],
                    )

                # Mask webdriver flag and populate realistic navigator environment to prevent bot detection
                context.add_init_script("""
                    Object.defineProperty(navigator, 'webdriver', {
                        get: () => undefined
                    });
                    Object.defineProperty(navigator, 'languages', {
                        get: () => ['en-US', 'en']
                    });
                    Object.defineProperty(navigator, 'plugins', {
                        get: () => [1, 2, 3, 4, 5]
                    });
                    if (!window.chrome) {
                        window.chrome = { runtime: {} };
                    }
                """)

                page = context.pages[0] if context.pages else context.new_page()
                self._browser_contexts[session_id] = context
                self._pages[session_id] = page

                # Navigate immediately to initial page to avoid blank about:blank screen
                initial_url = (config.get("initial_url") or config.get("url") or "").strip()
                if not initial_url or initial_url.lower() == "about:blank":
                    initial_url = "https://google.com"

                try:
                    page.goto(initial_url, wait_until="domcontentloaded", timeout=15000)
                except Exception as nav_err:
                    log.warning("Initial navigation to %s completed with notice: %s", initial_url, nav_err)

                effective_url = page.url or initial_url

                state = SessionState(
                    session_id=session_id,
                    backend_name=self.name,
                    status="active",
                    current_url=effective_url,
                    active_tab_id="tab_0",
                    metadata={
                        "headless": headless,
                        "profile_path": str(user_data_dir),
                        "cdp_connected": bool(cdp_url),
                    },
                    runtime_identity={
                        "backend": self.name,
                        "type": "process",
                        "engine": "playwright_chromium",
                        "headless": headless,
                    },
                    desktop_service_health={
                        "ok": True,
                        "status": "ready",
                        "engine": "playwright_chromium",
                    },
                    frame={
                        "timestamp": time.time(),
                        "valid": True,
                        "width": 1280,
                        "height": 800,
                    },
                    input_availability={
                        "keyboard": True,
                        "mouse": True,
                        "active": True,
                    },
                    browser_session_id=session_id,
                    terminal_workspace={
                        "workspace_dir": str(Path("data/om-workspace").resolve()),
                        "isolated": False,
                    },
                    interruption={
                        "state": "AI_IDLE",
                        "emergency_stopped": False,
                        "human_takeover": False,
                        "can_interrupt": True,
                        "can_resume": True,
                    },
                )
                with self._registry_lock:
                    self._sessions[session_id] = state
                return state
            except Exception as e:
                log.exception("Failed to initialize BrowserHarness session")
                raise ComputerControlError(f"Failed to start Browser Harness session: {e}", backend=self.name)

    def list_windows(self) -> List[WindowInfo]:
        """Browser Harness controls web pages; returns active browser session window."""
        windows: List[WindowInfo] = []
        for sid, sess in self._sessions.items():
            if sess.status == "active":
                windows.append(
                    WindowInfo(
                        window_id=f"win_{sid}",
                        title=f"Browser Harness ({sess.current_url or 'Empty'})",
                        process_name="chrome.exe",
                        is_active=True,
                    )
                )
        return windows

    def list_tabs(self, session_id: str) -> List[TabInfo]:
        return self._run_worker(self._list_tabs_impl, session_id)

    def _list_tabs_impl(self, session_id: str) -> List[TabInfo]:
        sess = self._require_session(session_id)
        context = self._browser_contexts.get(session_id)
        if not context:
            return []
        tabs = []
        for i, p in enumerate(context.pages):
            tabs.append(
                TabInfo(
                    tab_id=f"tab_{i}",
                    title=p.title() or "Untitled",
                    url=p.url or "about:blank",
                    is_active=(p == self._pages.get(session_id)),
                )
            )
        return tabs

    def open_url(self, session_id: str, url: str) -> ActionResult:
        return self._run_worker(self._open_url_impl, session_id, url)

    def _open_url_impl(self, session_id: str, url: str) -> ActionResult:
        sess = self._require_session(session_id)
        with self._get_lock(session_id):
            page = self._pages.get(session_id)
            if not page:
                raise SessionNotFoundError("Page instance missing", backend=self.name)
            t0 = time.perf_counter()
            try:
                resp = page.goto(url, wait_until="domcontentloaded", timeout=30000)
                dur = round((time.perf_counter() - t0) * 1000, 2)
                status_code = resp.status if resp else 200
                sess.current_url = page.url
                sess.updated_at = time.time()
                return ActionResult(
                    success=status_code < 400,
                    action="open_url",
                    session_id=session_id,
                    backend=self.name,
                    details={"url": page.url, "title": page.title(), "status_code": status_code},
                    observed_outcome=f"Navigated to '{page.url}' (HTTP {status_code}) in {dur}ms",
                    verified=True,
                    duration_ms=dur,
                )
            except Exception as e:
                dur = round((time.perf_counter() - t0) * 1000, 2)
                return ActionResult(
                    success=False,
                    action="open_url",
                    session_id=session_id,
                    backend=self.name,
                    error=str(e),
                    observed_outcome=f"Navigation failed: {e}",
                    verified=False,
                    duration_ms=dur,
                )

    def observe_screen(self, session_id: str) -> ObservationResult:
        return self._run_worker(self._observe_screen_impl, session_id)

    def _observe_screen_impl(self, session_id: str) -> ObservationResult:
        sess = self._require_session(session_id)
        with self._get_lock(session_id):
            page = self._pages.get(session_id)
            if not page:
                raise SessionNotFoundError("Page missing", backend=self.name)
            try:
                png = page.screenshot(type="png")
                b64 = base64.b64encode(png).decode("utf-8")
                return ObservationResult(
                    session_id=session_id,
                    backend=self.name,
                    url=page.url,
                    title=page.title(),
                    screenshot_base64=b64,
                )
            except Exception as e:
                log.error("Failed to capture screen observation: %s", e)
                return ObservationResult(session_id=session_id, backend=self.name, url=sess.current_url)

    def inspect_page(self, session_id: str) -> ObservationResult:
        return self._run_worker(self._inspect_page_impl, session_id)

    def _inspect_page_impl(self, session_id: str) -> ObservationResult:
        sess = self._require_session(session_id)
        with self._get_lock(session_id):
            page = self._pages.get(session_id)
            if not page:
                raise SessionNotFoundError("Page missing", backend=self.name)
            try:
                html = page.content()
                text = page.inner_text("body")[:10000]
                dom_map = DOMAccessibilityAgent.build_interactive_dom_map(html)
                return ObservationResult(
                    session_id=session_id,
                    backend=self.name,
                    url=page.url,
                    title=page.title(),
                    text_content=text,
                    dom_elements=dom_map,
                )
            except Exception as e:
                log.error("Failed to inspect page: %s", e)
                return ObservationResult(session_id=session_id, backend=self.name, url=sess.current_url)

    def click_element(self, session_id: str, target: Any) -> ActionResult:
        return self._run_worker(self._click_element_impl, session_id, target)

    def _click_element_impl(self, session_id: str, target: Any) -> ActionResult:
        sess = self._require_session(session_id)
        with self._get_lock(session_id):
            page = self._pages.get(session_id)
            if not page:
                raise SessionNotFoundError("Page missing", backend=self.name)
            t0 = time.perf_counter()
            selector = str(target)
            try:
                # Handle selector, coordinate or text
                if isinstance(target, dict) and "x" in target and "y" in target:
                    page.mouse.click(target["x"], target["y"])
                    outcome = f"Clicked coordinates ({target['x']}, {target['y']})"
                else:
                    # Try text locator first if provided as plain text
                    try:
                        loc = page.get_by_text(selector, exact=False).first
                        if loc.count() > 0:
                            loc.click(timeout=3000)
                        else:
                            page.click(selector, timeout=5000)
                    except Exception:
                        page.click(selector, timeout=5000)
                    outcome = f"Clicked element '{selector}'"

                dur = round((time.perf_counter() - t0) * 1000, 2)
                sess.current_url = page.url
                sess.updated_at = time.time()
                return ActionResult(
                    success=True,
                    action="click_element",
                    session_id=session_id,
                    backend=self.name,
                    details={"target": target, "url_after": page.url},
                    observed_outcome=outcome,
                    verified=True,
                    duration_ms=dur,
                )
            except Exception as e:
                dur = round((time.perf_counter() - t0) * 1000, 2)
                return ActionResult(
                    success=False,
                    action="click_element",
                    session_id=session_id,
                    backend=self.name,
                    error=str(e),
                    observed_outcome=f"Click failed on '{target}': {e}",
                    verified=False,
                    duration_ms=dur,
                )

    def type_text(self, session_id: str, text: str, target: Optional[Any] = None) -> ActionResult:
        return self._run_worker(self._type_text_impl, session_id, text, target)

    def _type_text_impl(self, session_id: str, text: str, target: Optional[Any] = None) -> ActionResult:
        sess = self._require_session(session_id)
        with self._get_lock(session_id):
            page = self._pages.get(session_id)
            if not page:
                raise SessionNotFoundError("Page missing", backend=self.name)
            t0 = time.perf_counter()
            try:
                if target:
                    page.fill(str(target), text, timeout=5000)
                else:
                    page.keyboard.type(text)
                dur = round((time.perf_counter() - t0) * 1000, 2)
                return ActionResult(
                    success=True,
                    action="type_text",
                    session_id=session_id,
                    backend=self.name,
                    details={"target": target, "chars": len(text)},
                    observed_outcome=f"Typed {len(text)} characters into '{target or 'active_element'}'",
                    verified=True,
                    duration_ms=dur,
                )
            except Exception as e:
                dur = round((time.perf_counter() - t0) * 1000, 2)
                return ActionResult(
                    success=False,
                    action="type_text",
                    session_id=session_id,
                    backend=self.name,
                    error=str(e),
                    observed_outcome=f"Typing failed on '{target}': {e}",
                    verified=False,
                    duration_ms=dur,
                )

    def press_key(self, session_id: str, key: str) -> ActionResult:
        return self._run_worker(self._press_key_impl, session_id, key)

    def _press_key_impl(self, session_id: str, key: str) -> ActionResult:
        sess = self._require_session(session_id)
        with self._get_lock(session_id):
            page = self._pages.get(session_id)
            if not page:
                raise SessionNotFoundError("Page missing", backend=self.name)
            t0 = time.perf_counter()
            try:
                page.keyboard.press(key)
                dur = round((time.perf_counter() - t0) * 1000, 2)
                return ActionResult(
                    success=True,
                    action="press_key",
                    session_id=session_id,
                    backend=self.name,
                    details={"key": key},
                    observed_outcome=f"Pressed key '{key}'",
                    verified=True,
                    duration_ms=dur,
                )
            except Exception as e:
                dur = round((time.perf_counter() - t0) * 1000, 2)
                return ActionResult(
                    success=False,
                    action="press_key",
                    session_id=session_id,
                    backend=self.name,
                    error=str(e),
                    observed_outcome=f"Press key '{key}' failed: {e}",
                    verified=False,
                    duration_ms=dur,
                )

    def press_shortcut(self, session_id: str, shortcut: str) -> ActionResult:
        return self._run_worker(self._press_shortcut_impl, session_id, shortcut)

    def _press_shortcut_impl(self, session_id: str, shortcut: str) -> ActionResult:
        sess = self._require_session(session_id)
        with self._get_lock(session_id):
            page = self._pages.get(session_id)
            if not page:
                raise SessionNotFoundError("Page missing", backend=self.name)
            t0 = time.perf_counter()
            try:
                page.keyboard.press(shortcut)
                dur = round((time.perf_counter() - t0) * 1000, 2)
                return ActionResult(
                    success=True,
                    action="press_shortcut",
                    session_id=session_id,
                    backend=self.name,
                    details={"shortcut": shortcut},
                    observed_outcome=f"Executed shortcut '{shortcut}'",
                    verified=True,
                    duration_ms=dur,
                )
            except Exception as e:
                dur = round((time.perf_counter() - t0) * 1000, 2)
                return ActionResult(
                    success=False,
                    action="press_shortcut",
                    session_id=session_id,
                    backend=self.name,
                    error=str(e),
                    observed_outcome=f"Shortcut '{shortcut}' failed: {e}",
                    verified=False,
                    duration_ms=dur,
                )

    def key_down(self, session_id: str, key: str) -> ActionResult:
        return self._run_worker(self._key_down_impl, session_id, key)

    def _key_down_impl(self, session_id: str, key: str) -> ActionResult:
        sess = self._require_session(session_id)
        with self._get_lock(session_id):
            page = self._pages.get(session_id)
            if not page:
                raise SessionNotFoundError("Page missing", backend=self.name)
            page.keyboard.down(key)
            return ActionResult(
                success=True,
                action="key_down",
                session_id=session_id,
                backend=self.name,
                details={"key": key},
                observed_outcome=f"Key down: {key}",
                verified=True,
            )

    def key_up(self, session_id: str, key: str) -> ActionResult:
        return self._run_worker(self._key_up_impl, session_id, key)

    def _key_up_impl(self, session_id: str, key: str) -> ActionResult:
        sess = self._require_session(session_id)
        with self._get_lock(session_id):
            page = self._pages.get(session_id)
            if not page:
                raise SessionNotFoundError("Page missing", backend=self.name)
            page.keyboard.up(key)
            return ActionResult(
                success=True,
                action="key_up",
                session_id=session_id,
                backend=self.name,
                details={"key": key},
                observed_outcome=f"Key up: {key}",
                verified=True,
            )

    def release_all_keys(self, session_id: str) -> ActionResult:
        return self._run_worker(self._release_all_keys_impl, session_id)

    def _release_all_keys_impl(self, session_id: str) -> ActionResult:
        sess = self._require_session(session_id)
        with self._get_lock(session_id):
            page = self._pages.get(session_id)
            if not page:
                raise SessionNotFoundError("Page missing", backend=self.name)
            for mod in ["Control", "Alt", "Shift", "Meta"]:
                try:
                    page.keyboard.up(mod)
                except Exception:
                    pass
            return ActionResult(
                success=True,
                action="release_all_keys",
                session_id=session_id,
                backend=self.name,
                observed_outcome="Released all keys on Playwright page",
                verified=True,
            )

    def fill_and_submit(
        self, session_id: str, target: Any, text: str, press_enter: bool = True
    ) -> ActionResult:
        return self._run_worker(self._fill_and_submit_impl, session_id, target, text, press_enter)

    def _fill_and_submit_impl(
        self, session_id: str, target: Any, text: str, press_enter: bool = True
    ) -> ActionResult:
        sess = self._require_session(session_id)
        with self._get_lock(session_id):
            page = self._pages.get(session_id)
            if not page:
                raise SessionNotFoundError("Page missing", backend=self.name)
            t0 = time.perf_counter()
            try:
                selector = str(target)
                page.fill(selector, text, timeout=6000)
                if press_enter:
                    page.press(selector, "Enter")
                dur = round((time.perf_counter() - t0) * 1000, 2)
                sess.current_url = page.url
                sess.updated_at = time.time()
                return ActionResult(
                    success=True,
                    action="fill_and_submit",
                    session_id=session_id,
                    backend=self.name,
                    details={"target": target, "text": text, "enter": press_enter, "url": page.url},
                    observed_outcome=f"Filled '{target}' with '{text}' and submitted (URL: {page.url})",
                    verified=True,
                    duration_ms=dur,
                )
            except Exception as e:
                dur = round((time.perf_counter() - t0) * 1000, 2)
                return ActionResult(
                    success=False,
                    action="fill_and_submit",
                    session_id=session_id,
                    backend=self.name,
                    error=str(e),
                    observed_outcome=f"Fill and submit failed on '{target}': {e}",
                    verified=False,
                    duration_ms=dur,
                )

    def wait_for(self, session_id: str, selector_or_text: str, timeout_ms: int = 5000) -> ActionResult:
        return self._run_worker(self._wait_for_impl, session_id, selector_or_text, timeout_ms)

    def _wait_for_impl(self, session_id: str, selector_or_text: str, timeout_ms: int = 5000) -> ActionResult:
        sess = self._require_session(session_id)
        with self._get_lock(session_id):
            page = self._pages.get(session_id)
            if not page:
                raise SessionNotFoundError("Page missing", backend=self.name)
            t0 = time.perf_counter()
            try:
                # Try locator or text
                try:
                    page.wait_for_selector(selector_or_text, timeout=timeout_ms)
                except Exception:
                    page.get_by_text(selector_or_text, exact=False).first.wait_for(timeout=timeout_ms)
                dur = round((time.perf_counter() - t0) * 1000, 2)
                return ActionResult(
                    success=True,
                    action="wait_for",
                    session_id=session_id,
                    backend=self.name,
                    details={"target": selector_or_text},
                    observed_outcome=f"Condition met for '{selector_or_text}'",
                    verified=True,
                    duration_ms=dur,
                )
            except Exception as e:
                dur = round((time.perf_counter() - t0) * 1000, 2)
                return ActionResult(
                    success=False,
                    action="wait_for",
                    session_id=session_id,
                    backend=self.name,
                    error=str(e),
                    observed_outcome=f"Wait for '{selector_or_text}' timed out: {e}",
                    verified=False,
                    duration_ms=dur,
                )


    def scroll(self, session_id: str, direction: str = "down", amount: int = 300) -> ActionResult:
        return self._run_worker(self._scroll_impl, session_id, direction, amount)

    def _scroll_impl(self, session_id: str, direction: str = "down", amount: int = 300) -> ActionResult:
        sess = self._require_session(session_id)
        with self._get_lock(session_id):
            page = self._pages.get(session_id)
            if not page:
                raise SessionNotFoundError("Page missing", backend=self.name)
            delta_y = amount if direction == "down" else -amount
            page.mouse.wheel(0, delta_y)
            return ActionResult(
                success=True,
                action="scroll",
                session_id=session_id,
                backend=self.name,
                details={"direction": direction, "amount": amount},
                observed_outcome=f"Scrolled {direction} by {amount}px",
                verified=True,
            )

    def switch_tab(self, session_id: str, tab_id: str) -> ActionResult:
        return self._run_worker(self._switch_tab_impl, session_id, tab_id)

    def _switch_tab_impl(self, session_id: str, tab_id: str) -> ActionResult:
        sess = self._require_session(session_id)
        context = self._browser_contexts.get(session_id)
        if not context:
            raise SessionNotFoundError("Context missing", backend=self.name)
        try:
            idx = int(tab_id.replace("tab_", ""))
            page = context.pages[idx]
            page.bring_to_front()
            self._pages[session_id] = page
            sess.active_tab_id = tab_id
            sess.current_url = page.url
            return ActionResult(
                success=True,
                action="switch_tab",
                session_id=session_id,
                backend=self.name,
                details={"tab_id": tab_id, "url": page.url},
                observed_outcome=f"Switched active view to {tab_id} ({page.url})",
                verified=True,
            )
        except Exception as e:
            return ActionResult(
                success=False,
                action="switch_tab",
                session_id=session_id,
                backend=self.name,
                error=str(e),
                observed_outcome=f"Failed to switch tab {tab_id}: {e}",
                verified=False,
            )

    def take_screenshot(self, session_id: str) -> bytes:
        return self._run_worker(self._take_screenshot_impl, session_id)

    def _take_screenshot_impl(self, session_id: str) -> bytes:
        sess = self._require_session(session_id)
        with self._get_lock(session_id):
            page = self._pages.get(session_id)
            if not page:
                raise SessionNotFoundError("Page missing", backend=self.name)
            return page.screenshot(type="png")

    def download_file(self, session_id: str, url_or_action: str) -> str:
        return self._run_worker(self._download_file_impl, session_id, url_or_action)

    def _download_file_impl(self, session_id: str, url_or_action: str) -> str:
        sess = self._require_session(session_id)
        with self._get_lock(session_id):
            page = self._pages.get(session_id)
            if not page:
                raise SessionNotFoundError("Page missing", backend=self.name)
            download_dir = Path("data/downloads")
            download_dir.mkdir(parents=True, exist_ok=True)
            try:
                if url_or_action.startswith("http://") or url_or_action.startswith("https://"):
                    resp = page.request.get(url_or_action)
                    fname = Path(url_or_action).name or f"download_{int(time.time())}.bin"
                    target_file = download_dir / fname
                    target_file.write_bytes(resp.body())
                    return str(target_file.resolve())
                else:
                    with page.expect_download(timeout=10000) as download_info:
                        page.locator(url_or_action).click()
                    download = download_info.value
                    target_file = download_dir / download.suggested_filename
                    download.save_as(str(target_file))
                    return str(target_file.resolve())
            except Exception as e:
                raise ComputerControlError(f"Download failed: {e}", backend=self.name)

    def capture_frame_jpeg(self, session_id: str, quality: int = 70) -> bytes:
        return self._run_worker(self._capture_frame_jpeg_impl, session_id, quality)

    def _capture_frame_jpeg_impl(self, session_id: str, quality: int = 70) -> bytes:
        sess = self._require_session(session_id)
        with self._get_lock(session_id):
            page = self._pages.get(session_id)
            if not page:
                raise SessionNotFoundError("Page missing", backend=self.name)
            return page.screenshot(type="jpeg", quality=quality)

    def forward_mouse(
        self,
        session_id: str,
        event_type: str,
        x: float,
        y: float,
        button: str = "left",
        click_count: int = 1,
        delta_x: float = 0.0,
        delta_y: float = 0.0,
    ) -> ActionResult:
        return self._run_worker(
            self._forward_mouse_impl,
            session_id,
            event_type,
            x,
            y,
            button,
            click_count,
            delta_x,
            delta_y,
        )

    def _forward_mouse_impl(
        self,
        session_id: str,
        event_type: str,
        x: float,
        y: float,
        button: str = "left",
        click_count: int = 1,
        delta_x: float = 0.0,
        delta_y: float = 0.0,
    ) -> ActionResult:
        sess = self._require_session(session_id)
        with self._get_lock(session_id):
            page = self._pages.get(session_id)
            if not page:
                raise SessionNotFoundError("Page missing", backend=self.name)

            pw_button = "left"
            if button in ("right", "middle"):
                pw_button = button

            if event_type == "mousemove":
                page.mouse.move(x, y)
            elif event_type == "mousedown":
                page.mouse.move(x, y)
                page.mouse.down(button=pw_button)
            elif event_type == "mouseup":
                page.mouse.up(button=pw_button)
            elif event_type == "click":
                page.mouse.click(x, y, button=pw_button, click_count=click_count)
            elif event_type == "dblclick":
                page.mouse.dblclick(x, y, button=pw_button)
            elif event_type == "wheel":
                page.mouse.move(x, y)
                page.mouse.wheel(delta_x, delta_y)

            sess.current_url = page.url
            return ActionResult(
                success=True,
                action=f"mouse_{event_type}",
                session_id=session_id,
                backend=self.name,
                details={"x": x, "y": y, "button": button, "url": page.url},
                observed_outcome=f"Forwarded mouse {event_type} at ({x}, {y})",
                verified=True,
            )

    def forward_keyboard(
        self,
        session_id: str,
        event_type: str,
        key: str = "",
        code: str = "",
        text: str = "",
    ) -> ActionResult:
        return self._run_worker(
            self._forward_keyboard_impl,
            session_id,
            event_type,
            key,
            code,
            text,
        )

    def _forward_keyboard_impl(
        self,
        session_id: str,
        event_type: str,
        key: str = "",
        code: str = "",
        text: str = "",
    ) -> ActionResult:
        sess = self._require_session(session_id)
        with self._get_lock(session_id):
            page = self._pages.get(session_id)
            if not page:
                raise SessionNotFoundError("Page missing", backend=self.name)

            if event_type == "keydown":
                if key:
                    page.keyboard.down(key)
            elif event_type == "keyup":
                if key:
                    page.keyboard.up(key)
            elif event_type == "press":
                if key:
                    page.keyboard.press(key)
            elif event_type == "type":
                if text:
                    page.keyboard.type(text)

            return ActionResult(
                success=True,
                action=f"keyboard_{event_type}",
                session_id=session_id,
                backend=self.name,
                details={"key": key, "text": text},
                observed_outcome=f"Forwarded keyboard {event_type} '{key or text}'",
                verified=True,
            )

    def navigate_back(self, session_id: str) -> ActionResult:
        return self._run_worker(self._navigate_back_impl, session_id)

    def _navigate_back_impl(self, session_id: str) -> ActionResult:
        sess = self._require_session(session_id)
        with self._get_lock(session_id):
            page = self._pages.get(session_id)
            if not page:
                raise SessionNotFoundError("Page missing", backend=self.name)
            try:
                page.go_back(timeout=8000)
            except Exception:
                pass
            sess.current_url = page.url
            return ActionResult(
                success=True,
                action="navigate_back",
                session_id=session_id,
                backend=self.name,
                details={"url": page.url},
                observed_outcome=f"Navigated back to {page.url}",
                verified=True,
            )

    def navigate_forward(self, session_id: str) -> ActionResult:
        return self._run_worker(self._navigate_forward_impl, session_id)

    def _navigate_forward_impl(self, session_id: str) -> ActionResult:
        sess = self._require_session(session_id)
        with self._get_lock(session_id):
            page = self._pages.get(session_id)
            if not page:
                raise SessionNotFoundError("Page missing", backend=self.name)
            try:
                page.go_forward(timeout=8000)
            except Exception:
                pass
            sess.current_url = page.url
            return ActionResult(
                success=True,
                action="navigate_forward",
                session_id=session_id,
                backend=self.name,
                details={"url": page.url},
                observed_outcome=f"Navigated forward to {page.url}",
                verified=True,
            )

    def navigate_reload(self, session_id: str) -> ActionResult:
        return self._run_worker(self._navigate_reload_impl, session_id)

    def _navigate_reload_impl(self, session_id: str) -> ActionResult:
        sess = self._require_session(session_id)
        with self._get_lock(session_id):
            page = self._pages.get(session_id)
            if not page:
                raise SessionNotFoundError("Page missing", backend=self.name)
            try:
                page.reload(timeout=10000)
            except Exception:
                pass
            sess.current_url = page.url
            return ActionResult(
                success=True,
                action="navigate_reload",
                session_id=session_id,
                backend=self.name,
                details={"url": page.url},
                observed_outcome=f"Reloaded {page.url}",
                verified=True,
            )

    def get_element_rect(self, session_id: str, selector: str) -> Optional[Dict[str, float]]:
        return self._run_worker(self._get_element_rect_impl, session_id, selector)

    def _get_element_rect_impl(self, session_id: str, selector: str) -> Optional[Dict[str, float]]:
        self._require_session(session_id)
        with self._get_lock(session_id):
            page = self._pages.get(session_id)
            if not page:
                return None
            try:
                # Auto-wait up to 3000ms for element to have a visible bounding box
                loc = page.locator(selector).first
                box = loc.bounding_box(timeout=3000)
                if box:
                    return {
                        "x": float(box["x"]),
                        "y": float(box["y"]),
                        "width": float(box["width"]),
                        "height": float(box["height"]),
                        "cx": float(box["x"] + box["width"] / 2.0),
                        "cy": float(box["y"] + box["height"] / 2.0),
                    }
            except Exception as e:
                log.debug("Element bounding_box not found for '%s': %s", selector, e)
            return None

    def close_session(self, session_id: str) -> ActionResult:
        return self._run_worker(self._close_session_impl, session_id)

    def _close_session_impl(self, session_id: str) -> ActionResult:
        with self._get_lock(session_id):
            context = self._browser_contexts.pop(session_id, None)
            self._pages.pop(session_id, None)
            if context:
                try:
                    context.close()
                except Exception:
                    pass
            if not self._browser_contexts and self._pw is not None:
                try:
                    self._pw.stop()
                except Exception:
                    pass
                self._pw = None
            return super().close_session(session_id)


_browser_harness_singleton: Optional[BrowserHarnessBackend] = None
_browser_harness_lock = threading.Lock()


def get_browser_harness_backend(profile_root: Optional[str] = None) -> BrowserHarnessBackend:
    """Singleton getter for the primary BrowserHarnessBackend."""
    global _browser_harness_singleton
    with _browser_harness_lock:
        if _browser_harness_singleton is None:
            _browser_harness_singleton = BrowserHarnessBackend(profile_root=profile_root)
        return _browser_harness_singleton

