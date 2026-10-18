"""Browser tools: the agent's hands on a real browser session.

Read-only tools (open/read/elements/screenshot/console/wait) run straight
through. Interactive tools (click/fill/type/press/select) are DRAFT-only
here: the handler validates and DESCRIBES the intended action with no side
effects. The real action runs only after the user approves, via
BrowserService.perform_action() in the approval-completion path.

Every result carries the session identity and observed page state.
"""
from __future__ import annotations

from pathlib import Path

from server.intent.registry import ExecutionMode, ToolResult, ToolSpec
from web.om.browser import BrowserError, get_browser


_SHOT_DIR = Path("data/browser_shots")


def _fail(e: Exception) -> ToolResult:
    if isinstance(e, BrowserError):
        return ToolResult(status="failure", mode=ExecutionMode.DIRECT,
                          error=f"{e} (status {e.status})")
    return ToolResult(status="failure", mode=ExecutionMode.DIRECT,
                      error=f"{type(e).__name__}: {e}")


def _svc():
    return get_browser()


# ---------------------------------------------------------------------------
# Read-only tools (ALLOW)
# ---------------------------------------------------------------------------

def browser_open(url: str = "", **kwargs) -> ToolResult:
    try:
        view = _svc().create(url)
    except Exception as e:
        return _fail(e)
    return ToolResult(
        status="success", mode=ExecutionMode.DIRECT,
        data={"session_id": view["id"], "url": view["url"],
              "title": view["title"], "status": view["status"]},
    )


def format_browser_open(result: ToolResult) -> str:
    d = result.data
    return (f"Browser session {d['session_id']} opened {d['url']}\n"
            f"Title: {d['title']}")


BROWSER_OPEN_SPEC = ToolSpec(
    name="browser_open",
    description="Open a URL in a new persistent browser session. Returns the session id.",
    execution_mode=ExecutionMode.DIRECT,
)


def browser_read(session_id: str = "", **kwargs) -> ToolResult:
    try:
        r = _svc().read(session_id)
    except Exception as e:
        return _fail(e)
    return ToolResult(
        status="success", mode=ExecutionMode.DIRECT,
        data={"session_id": r["id"], "url": r["url"], "title": r["title"],
              "text": r["text"][:8000], "truncated": r["truncated"]},
    )


def format_browser_read(result: ToolResult) -> str:
    d = result.data
    return f"\"{d['title']}\"\n{d['url']}\n\n{d['text']}"


BROWSER_READ_SPEC = ToolSpec(
    name="browser_read",
    description="Read the current page of a browser session: title, URL and text.",
    execution_mode=ExecutionMode.DIRECT,
)


def browser_elements(session_id: str = "", **kwargs) -> ToolResult:
    try:
        r = _svc().elements(session_id)
    except Exception as e:
        return _fail(e)
    return ToolResult(
        status="success", mode=ExecutionMode.DIRECT,
        data={"session_id": r["session_id"], "elements": r["elements"]},
    )


def format_browser_elements(result: ToolResult) -> str:
    lines = []
    for el in result.data["elements"][:40]:
        sel = el.get("selector") or "(no selector)"
        lines.append(f"- <{el.get('tag')}> {el.get('text','')[:60]} -> {sel}")
    return "\n".join(lines) or "No interactive elements found."


BROWSER_ELEMENTS_SPEC = ToolSpec(
    name="browser_elements",
    description="List clickable/fillable elements on the page with CSS selectors.",
    execution_mode=ExecutionMode.DIRECT,
)


def browser_screenshot(session_id: str = "", **kwargs) -> ToolResult:
    try:
        name, png = _svc().screenshot(session_id)
    except Exception as e:
        return _fail(e)
    _SHOT_DIR.mkdir(parents=True, exist_ok=True)
    path = _SHOT_DIR / name
    path.write_bytes(png)
    return ToolResult(
        status="success", mode=ExecutionMode.DIRECT,
        data={"session_id": session_id, "path": str(path),
              "bytes": len(png)},
    )


def format_browser_screenshot(result: ToolResult) -> str:
    return f"Screenshot saved to {result.data['path']}"


BROWSER_SCREENSHOT_SPEC = ToolSpec(
    name="browser_screenshot",
    description="Capture a screenshot of the browser session's current page.",
    execution_mode=ExecutionMode.DIRECT,
)


def browser_console(session_id: str = "", **kwargs) -> ToolResult:
    try:
        r = _svc().console(session_id)
    except Exception as e:
        return _fail(e)
    return ToolResult(
        status="success", mode=ExecutionMode.DIRECT,
        data={"session_id": r["id"], "logs": r["logs"][-20:],
              "count": r["count"]},
    )


def format_browser_console(result: ToolResult) -> str:
    lines = [f"[{l.get('type')}] {l.get('text','')[:200]}"
             for l in result.data["logs"]]
    return "\n".join(lines) or "No console messages."


BROWSER_CONSOLE_SPEC = ToolSpec(
    name="browser_console",
    description="Read the page's JS console messages and page errors.",
    execution_mode=ExecutionMode.DIRECT,
)


def browser_wait(session_id: str = "", selector: str | None = None,
                 state: str = "visible", timeout_ms: int = 10_000,
                 **kwargs) -> ToolResult:
    try:
        r = _svc().wait_for(session_id, selector or None, state,
                            int(timeout_ms))
    except Exception as e:
        return _fail(e)
    return ToolResult(
        status="success", mode=ExecutionMode.DIRECT,
        data={"session_id": r["session_id"], "url": r["url"],
              "title": r["title"]},
    )


def format_browser_wait(result: ToolResult) -> str:
    d = result.data
    return f"Condition met. Page: {d['title']} ({d['url']})"


BROWSER_WAIT_SPEC = ToolSpec(
    name="browser_wait",
    description="Wait for a real page condition (element visible, page loaded).",
    execution_mode=ExecutionMode.DIRECT,
)


# ---------------------------------------------------------------------------
# Interactive tools (NEEDS_APPROVAL): draft/describe only, no side effects
# ---------------------------------------------------------------------------

def _draft(kind: str, session_id: str, selector: str,
           extra: dict, human: str) -> ToolResult:
    """Validate + describe the intended action. Never acts."""
    if not session_id:
        return ToolResult(status="failure", mode=ExecutionMode.DIRECT,
                          error="Give a browser session id")
    try:
        info = _svc().describe(session_id, selector)
    except Exception as e:
        return _fail(e)
    label = info.get("text") or info.get("tag") or selector
    draft = (f"{human} the {info.get('tag')} '{label}' "
             f"(selector `{selector}`) in browser session {session_id}.")
    action = {"kind": kind, "session_id": session_id,
              "selector": selector, **extra}
    return ToolResult(
        status="success", mode=ExecutionMode.DIRECT,
        data={"draft": draft, "browser_action": action,
              "element": info},
    )


def browser_click(session_id: str = "", selector: str = "",
                  **kwargs) -> ToolResult:
    return _draft("click", session_id, selector, {}, "Click")


def format_browser_click(result: ToolResult) -> str:
    return result.data["draft"]


BROWSER_CLICK_SPEC = ToolSpec(
    name="browser_click",
    description="Click an element (CSS selector) in a browser session. Needs approval; describes the click first.",
    execution_mode=ExecutionMode.DIRECT,
)


def browser_fill(session_id: str = "", selector: str = "", text: str = "",
                 **kwargs) -> ToolResult:
    return _draft("fill", session_id, selector, {"text": text}, f"Fill '{text[:60]}' into")


def format_browser_fill(result: ToolResult) -> str:
    return result.data["draft"]


BROWSER_FILL_SPEC = ToolSpec(
    name="browser_fill",
    description="Fill a form field (CSS selector) with text. Needs approval; describes first.",
    execution_mode=ExecutionMode.DIRECT,
)


def browser_type(session_id: str = "", selector: str = "", text: str = "",
                 **kwargs) -> ToolResult:
    return _draft("type", session_id, selector, {"text": text}, f"Type '{text[:60]}' into")


def format_browser_type(result: ToolResult) -> str:
    return result.data["draft"]


BROWSER_TYPE_SPEC = ToolSpec(
    name="browser_type",
    description="Type text keystroke-by-keystroke into a field. Needs approval; describes first.",
    execution_mode=ExecutionMode.DIRECT,
)


def browser_press(session_id: str = "", selector: str = "", key: str = "",
                  **kwargs) -> ToolResult:
    return _draft("press", session_id, selector, {"key": key}, f"Press '{key}' on")


def format_browser_press(result: ToolResult) -> str:
    return result.data["draft"]


BROWSER_PRESS_SPEC = ToolSpec(
    name="browser_press",
    description="Press a key (Enter, Tab, Escape, arrows, F1-F12) on an element. Needs approval.",
    execution_mode=ExecutionMode.DIRECT,
)


def browser_select(session_id: str = "", selector: str = "", value: str = "",
                   **kwargs) -> ToolResult:
    return _draft("select", session_id, selector, {"value": value}, f"Select '{value}' in")


def format_browser_select(result: ToolResult) -> str:
    return result.data["draft"]


BROWSER_SELECT_SPEC = ToolSpec(
    name="browser_select",
    description="Choose an option in a dropdown. Needs approval; describes first.",
    execution_mode=ExecutionMode.DIRECT,
)


# ---------------------------------------------------------------------------
# Approval-completion formatting (runs after the user says yes)
# ---------------------------------------------------------------------------

def format_browser_action_result(action: dict, result: dict) -> str:
    kind = action.get("kind")
    sel = action.get("selector")
    url = result.get("url", "")
    title = result.get("title", "")
    if kind == "click":
        return f"Clicked `{sel}`. Page is now: {title} ({url})"
    if kind in ("fill", "type"):
        return (f"Entered text into `{sel}` (field now reads "
                f"'{(result.get('value') or '')[:120]}'). Page: {title} ({url})")
    if kind == "press":
        return f"Pressed '{action.get('key')}' on `{sel}`. Page: {title} ({url})"
    if kind == "select":
        return (f"Selected '{action.get('value')}' in `{sel}` "
                f"(now '{(result.get('value') or '')[:80]}'). Page: {title} ({url})")
    return f"Browser action '{kind}' done. Page: {title} ({url})"


BROWSER_TOOLS = [
    (BROWSER_OPEN_SPEC, browser_open, format_browser_open),
    (BROWSER_READ_SPEC, browser_read, format_browser_read),
    (BROWSER_ELEMENTS_SPEC, browser_elements, format_browser_elements),
    (BROWSER_SCREENSHOT_SPEC, browser_screenshot, format_browser_screenshot),
    (BROWSER_CONSOLE_SPEC, browser_console, format_browser_console),
    (BROWSER_WAIT_SPEC, browser_wait, format_browser_wait),
    (BROWSER_CLICK_SPEC, browser_click, format_browser_click),
    (BROWSER_FILL_SPEC, browser_fill, format_browser_fill),
    (BROWSER_TYPE_SPEC, browser_type, format_browser_type),
    (BROWSER_PRESS_SPEC, browser_press, format_browser_press),
    (BROWSER_SELECT_SPEC, browser_select, format_browser_select),
]
