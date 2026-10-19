"""Browser Skill Tools: Navigate, Click, Type, Inspect, and Screenshot.

Connects the agent's ToolRegistry to the real browser execution adapters
(BrowserHarnessBackend / Playwright / BrowserWorker).
All actions enforce SSRF security checks and generate action receipts with evidence.
"""
from __future__ import annotations

import logging
from typing import Any

from server.intent.registry import ExecutionMode, ToolResult, ToolSpec
from server.security.url_validator import validate_url_safe

log = logging.getLogger("os.skills.browser")

BROWSER_NAVIGATE_SPEC = ToolSpec(
    name="browser_navigate",
    description="Navigate the browser to a public webpage URL. Usage: browse to https://example.com",
    execution_mode=ExecutionMode.DIRECT,
)

BROWSER_INSPECT_SPEC = ToolSpec(
    name="browser_inspect",
    description="Inspect the current browser page to read its title, URL, visible text, and interactive elements.",
    execution_mode=ExecutionMode.DIRECT,
)

BROWSER_CLICK_SPEC = ToolSpec(
    name="browser_click",
    description="Click an interactive element on the browser page by text or CSS selector.",
    execution_mode=ExecutionMode.DIRECT,
)

BROWSER_TYPE_SPEC = ToolSpec(
    name="browser_type",
    description="Type text into an input field or active element on the current browser page.",
    execution_mode=ExecutionMode.DIRECT,
)

BROWSER_SCREENSHOT_SPEC = ToolSpec(
    name="browser_screenshot",
    description="Capture a visual screenshot of the current browser session.",
    execution_mode=ExecutionMode.DIRECT,
)


def _get_browser_worker():
    from adapters.browser.worker import BrowserWorker
    return BrowserWorker()


def _get_browser_backend():
    from server.computer.registry import get_computer_registry
    reg = get_computer_registry()
    b = reg.get_backend("browser_harness")
    if not b:
        from server.computer.backends.browser_harness import BrowserHarnessBackend
        b = BrowserHarnessBackend()
        reg.register(b)
    return b


def browser_navigate(url: str = "", session_id: str = "default", **kwargs) -> ToolResult:
    """Navigate browser to a URL with SSRF protection."""
    url = (str(url) or "").strip()
    if not url:
        return ToolResult(
            status="failure",
            mode=ExecutionMode.DIRECT,
            error="Please provide a URL to navigate to.",
        )

    # SSRF Protection
    is_safe, reason, _ = validate_url_safe(url)
    if not is_safe:
        return ToolResult(
            status="failure",
            mode=ExecutionMode.DIRECT,
            error=f"SSRF Protection blocked URL: {reason}",
        )

    try:
        worker = _get_browser_worker()
        receipt = worker.navigate(session_id, url)
        if receipt.status == "SUCCEEDED":
            return ToolResult(
                status="success",
                mode=ExecutionMode.DIRECT,
                data={
                    "action": "navigate",
                    "url": receipt.url,
                    "status_code": receipt.status_code,
                    "session_id": session_id,
                    "receipt": receipt.to_dict(),
                },
            )
        else:
            return ToolResult(
                status="failure",
                mode=ExecutionMode.DIRECT,
                error=receipt.details.get("error", "Navigation failed."),
                data={"url": url, "session_id": session_id},
            )
    except Exception as e:
        log.exception("browser_navigate failed")
        return ToolResult(
            status="failure",
            mode=ExecutionMode.DIRECT,
            error=f"Browser navigation error: {type(e).__name__}: {e}",
        )


def browser_inspect(session_id: str = "default", **kwargs) -> ToolResult:
    """Inspect current browser page and return title, URL, and visible content."""
    try:
        backend = _get_browser_backend()
        obs = backend.inspect_page(session_id)
        if obs.title == "[Extraction Error]":
            return ToolResult(
                status="failure",
                mode=ExecutionMode.DIRECT,
                error=obs.text_content or "Page inspection failed",
                data={"session_id": session_id, "url": obs.url},
            )
        return ToolResult(
            status="success",
            mode=ExecutionMode.DIRECT,
            data={
                "url": obs.url,
                "title": obs.title,
                "text": (obs.text_content or "")[:3000],
                "interactive_elements_count": len(obs.dom_elements or []),
                "session_id": session_id,
            },
        )
    except Exception as e:
        return ToolResult(
            status="failure",
            mode=ExecutionMode.DIRECT,
            error=f"Browser inspection error: {type(e).__name__}: {e}",
        )


def browser_click(target: str = "", session_id: str = "default", **kwargs) -> ToolResult:
    """Click an element on the current page."""
    target = (str(target) or "").strip()
    if not target:
        return ToolResult(
            status="failure",
            mode=ExecutionMode.DIRECT,
            error="Please specify the element or text to click.",
        )
    try:
        backend = _get_browser_backend()
        res = backend.click_element(session_id, target)
        if res.success:
            return ToolResult(
                status="success",
                mode=ExecutionMode.DIRECT,
                data={"action": "click", "target": target, "outcome": res.observed_outcome},
            )
        return ToolResult(
            status="failure",
            mode=ExecutionMode.DIRECT,
            error=res.error or "Click failed",
            data={"target": target},
        )
    except Exception as e:
        return ToolResult(
            status="failure",
            mode=ExecutionMode.DIRECT,
            error=f"Browser click error: {type(e).__name__}: {e}",
        )


def browser_type(text: str = "", target: str = "", session_id: str = "default", **kwargs) -> ToolResult:
    """Type text into an input element."""
    try:
        backend = _get_browser_backend()
        res = backend.type_text(session_id, text=str(text), target=target or None)
        if res.success:
            return ToolResult(
                status="success",
                mode=ExecutionMode.DIRECT,
                data={"action": "type", "text": text, "target": target, "outcome": res.observed_outcome},
            )
        return ToolResult(
            status="failure",
            mode=ExecutionMode.DIRECT,
            error=res.error or "Type failed",
            data={"target": target},
        )
    except Exception as e:
        return ToolResult(
            status="failure",
            mode=ExecutionMode.DIRECT,
            error=f"Browser type error: {type(e).__name__}: {e}",
        )


def browser_screenshot(session_id: str = "default", **kwargs) -> ToolResult:
    """Take a screenshot of the browser page."""
    try:
        backend = _get_browser_backend()
        png_bytes = backend.take_screenshot(session_id)
        return ToolResult(
            status="success",
            mode=ExecutionMode.DIRECT,
            data={
                "action": "screenshot",
                "bytes_len": len(png_bytes),
                "session_id": session_id,
            },
        )
    except Exception as e:
        return ToolResult(
            status="failure",
            mode=ExecutionMode.DIRECT,
            error=f"Browser screenshot error: {type(e).__name__}: {e}",
        )


def format_navigate(res: ToolResult) -> str:
    if res.status != "success":
        return f"Navigation failed: {res.error}"
    return f"Navigated to {res.data['url']} (status: {res.data['status_code']})"


def format_inspect(res: ToolResult) -> str:
    if res.status != "success":
        return f"Inspection failed: {res.error}"
    d = res.data
    return f"Page: {d.get('title')}\nURL: {d.get('url')}\n\n{d.get('text', '')[:400]}"


def format_click(res: ToolResult) -> str:
    if res.status != "success":
        return f"Click failed: {res.error}"
    return f"Clicked '{res.data['target']}': {res.data.get('outcome', 'Done')}"


def format_type(res: ToolResult) -> str:
    if res.status != "success":
        return f"Typing failed: {res.error}"
    return f"Typed into '{res.data.get('target', 'field')}': {res.data.get('outcome', 'Done')}"


def format_screenshot(res: ToolResult) -> str:
    if res.status != "success":
        return f"Screenshot failed: {res.error}"
    return f"Captured browser screenshot ({res.data['bytes_len']} bytes)"


TOOLS = [
    (BROWSER_NAVIGATE_SPEC, browser_navigate, format_navigate),
    (BROWSER_INSPECT_SPEC, browser_inspect, format_inspect),
    (BROWSER_CLICK_SPEC, browser_click, format_click),
    (BROWSER_TYPE_SPEC, browser_type, format_type),
    (BROWSER_SCREENSHOT_SPEC, browser_screenshot, format_screenshot),
]
