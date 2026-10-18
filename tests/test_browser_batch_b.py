"""Batch B: real interactive browser - contracts, validation, approval flow.

Real-browser acceptance tests are at the bottom and skip honestly when
Playwright/Chromium is unavailable.
"""
from __future__ import annotations

import pytest

from web.om.browser import (
    BrowserError,
    BrowserService,
    _validate_interaction,
)
from web.om.store import OmStore


# ---------------------------------------------------------------------------
# Input validation (no browser needed)
# ---------------------------------------------------------------------------

def test_validate_empty_selector():
    with pytest.raises(BrowserError) as ei:
        _validate_interaction("")
    assert ei.value.status == 422


def test_validate_selector_too_long():
    with pytest.raises(BrowserError) as ei:
        _validate_interaction("a" * 501)
    assert ei.value.status == 422


def test_validate_bad_key():
    with pytest.raises(BrowserError) as ei:
        _validate_interaction("button", key="Ctrl+Alt+Delete")
    assert ei.value.status == 422


def test_validate_key_allowlist_ok():
    sel, t = _validate_interaction("button", key="Enter", timeout_ms=5000)
    assert sel == "button" and t == 5000


def test_validate_timeout_bounds():
    with pytest.raises(BrowserError):
        _validate_interaction("button", timeout_ms=999)
    with pytest.raises(BrowserError):
        _validate_interaction("button", timeout_ms=61_000)


def test_validate_text_too_long():
    with pytest.raises(BrowserError):
        _validate_interaction("input", text="x" * 10_001)


# ---------------------------------------------------------------------------
# Service-level honesty (fake driver, no real browser)
# ---------------------------------------------------------------------------

class _NoPlaywright:
    def available(self):
        return False

    def is_live(self, sid):
        return False


def _service(tmp_path, driver=None) -> BrowserService:
    svc = BrowserService(store=OmStore(db_path=str(tmp_path / "om.db")))
    if driver is not None:
        svc._pw = driver
    return svc


def _open_session(svc: BrowserService) -> str:
    # Bypass network: insert the row directly.
    row = svc.store.insert("browser_sessions", {
        "id": "sess1", "url": "https://example.com/", "title": "Example",
        "status": "active", "updated_at": "2026-10-18T00:00:00",
    })
    return row["id"]


def test_unknown_session_is_404(tmp_path):
    svc = _service(tmp_path)
    with pytest.raises(BrowserError) as ei:
        svc.click("nope", "a")
    assert ei.value.status == 404


def test_interactive_without_playwright_is_honest_503(tmp_path):
    svc = _service(tmp_path, _NoPlaywright())
    sid = _open_session(svc)
    with pytest.raises(BrowserError) as ei:
        svc.click(sid, "a")
    assert ei.value.status == 503
    assert "Playwright" in str(ei.value)


def test_http_driver_interactive_actions_503():
    from web.om.browser import _HttpDriver
    d = _HttpDriver()
    for fn in (lambda: d.click("s", "a"), lambda: d.fill("s", "a", "x"),
               lambda: d.elements("s")):
        with pytest.raises(BrowserError) as ei:
            fn()
        assert ei.value.status == 503


def test_ssrf_guard_on_create(tmp_path):
    svc = _service(tmp_path)
    with pytest.raises(BrowserError) as ei:
        svc.create("http://127.0.0.1/admin")
    assert ei.value.status == 422
    with pytest.raises(BrowserError):
        svc.create("http://169.254.169.254/")


def test_perform_action_unknown_kind_fails_closed(tmp_path):
    svc = _service(tmp_path)
    with pytest.raises(BrowserError) as ei:
        svc.perform_action({"kind": "rm_rf", "session_id": "x"})
    assert ei.value.status == 422


class _FakePw:
    """Pretends Playwright is available; records calls, no side effects."""

    def __init__(self):
        self.calls = []

    def available(self):
        return True

    def is_live(self, sid):
        return True

    def describe(self, sid, selector):
        from web.om.browser import _validate_interaction
        _validate_interaction(selector)
        if selector == "#missing":
            raise BrowserError("No element matches '#missing'", 404)
        return {"tag": "a", "text": "Docs", "selector": selector,
                "href": "https://example.com/docs"}

    def click(self, sid, selector, timeout_ms=10_000):
        self.calls.append(("click", selector))
        return {"url": "https://example.com/docs", "title": "Docs",
                "selector": selector}


def test_describe_missing_element_is_404(tmp_path):
    svc = _service(tmp_path, _FakePw())
    sid = _open_session(svc)
    with pytest.raises(BrowserError) as ei:
        svc.describe(sid, "#missing")
    assert ei.value.status == 404


def test_perform_action_click_updates_store_and_returns_evidence(tmp_path):
    svc = _service(tmp_path, _FakePw())
    sid = _open_session(svc)
    res = svc.perform_action(
        {"kind": "click", "session_id": sid, "selector": "a"})
    assert res["session_id"] == sid
    assert res["url"] == "https://example.com/docs"
    row = svc.store.get("browser_sessions", sid)
    assert row["url"] == "https://example.com/docs"  # store follows reality


# ---------------------------------------------------------------------------
# Tool draft mode: describe, never act
# ---------------------------------------------------------------------------

def test_browser_click_tool_is_draft_only(tmp_path, monkeypatch):
    import server.tools.browser_tool as bt

    fake = _FakePw()
    svc = _service(tmp_path, fake)
    _open_session(svc)
    monkeypatch.setattr(bt, "get_browser", lambda: svc)
    res = bt.browser_click(session_id="sess1", selector="a")
    assert res.status == "success"
    assert "Click" in res.data["draft"]
    assert res.data["browser_action"]["kind"] == "click"
    assert fake.calls == []  # described, NOT clicked


def test_browser_click_tool_bad_selector_fails(tmp_path, monkeypatch):
    import server.tools.browser_tool as bt

    fake = _FakePw()
    svc = _service(tmp_path, fake)
    _open_session(svc)
    monkeypatch.setattr(bt, "get_browser", lambda: svc)
    res = bt.browser_click(session_id="sess1", selector="")
    assert res.status == "failure"


# ---------------------------------------------------------------------------
# Verifier contracts
# ---------------------------------------------------------------------------

def test_verifier_browser_contracts():
    from server.supervisor.verifier import verify_tool_result
    from server.intent.registry import ExecutionMode, ToolResult

    def tr(data):
        return ToolResult(status="success", mode=ExecutionMode.DIRECT,
                          data=data)

    # draft without action -> fail
    v = verify_tool_result("browser_click", {},
                           tr({"session_id": "s", "draft": "x",
                               "browser_action": {}}))
    assert not v.passed
    # draft with action -> pass
    v = verify_tool_result("browser_click", {},
                           tr({"session_id": "s", "draft": "Click x",
                               "browser_action": {"kind": "click"}}))
    assert v.passed
    # read without session -> fail
    v = verify_tool_result("browser_read", {},
                           tr({"url": "https://example.com"}))
    assert not v.passed
    # read with session + url -> pass
    v = verify_tool_result("browser_read", {},
                           tr({"session_id": "s",
                               "url": "https://example.com"}))
    assert v.passed
    # elements shape -> pass
    v = verify_tool_result("browser_elements", {},
                           tr({"session_id": "s", "elements": []}))
    assert v.passed


# ---------------------------------------------------------------------------
# Skill activation + permissions
# ---------------------------------------------------------------------------

def test_browser_skill_loads():
    from server.intent.registry import ToolRegistry
    from server.skills.loader import SkillLoader

    reg = ToolRegistry()
    infos = SkillLoader().load(reg)
    names = {i.name: i for i in infos}
    assert "browser" in names
    assert names["browser"].status == "active"
    assert "browser_click" in names["browser"].tools
    assert len(names["browser"].tools) == 11


def test_browser_tool_policies():
    from server.supervisor.permissions import ToolPermission, ToolPolicy
    p = ToolPermission()
    for t in ("browser_open", "browser_read", "browser_elements",
              "browser_screenshot", "browser_console", "browser_wait"):
        assert p.check(t)[0] == ToolPolicy.ALLOW, t
    for t in ("browser_click", "browser_fill", "browser_type",
              "browser_press", "browser_select"):
        assert p.check(t)[0] == ToolPolicy.NEEDS_APPROVAL, t


# ---------------------------------------------------------------------------
# Approval flow: draft -> approve -> real action + read-back
# ---------------------------------------------------------------------------

def test_browser_approval_executes_on_yes(tmp_path, monkeypatch):
    import asyncio

    import server.tools.browser_tool as bt
    from config import load_config
    from server.approvals.gate import ApprovalStore
    from server.conversation.manager import ConversationManager

    fake = _FakePw()
    svc = _service(tmp_path, fake)
    monkeypatch.setattr(bt, "get_browser", lambda: svc)
    monkeypatch.setattr("web.om.browser.get_browser", lambda store=None: svc)

    cfg = load_config()
    m = ConversationManager(
        cfg, approval_store=ApprovalStore(tmp_path / "approvals.db"))
    sid = _open_session(svc)

    # Draft the click through the real tool (describe-only).
    res = bt.browser_click(session_id=sid, selector="a")
    assert res.status == "success"

    # Stash it the way the manager does for NEEDS_APPROVAL tools.
    from server.approvals.gate import PendingApproval, content_hash
    draft = res.data["draft"]
    m._pending.append(PendingApproval(
        skill="browser_click", input_text=draft, draft=draft,
        approved_hash=content_hash(draft), run_id="r1",
        action_args=res.data["browser_action"]))

    async def _collect(text):
        parts = []
        async for c in m.respond_text(text):
            parts.append(c.delta)
        return "".join(parts).strip()

    out = asyncio.run(_collect("yes"))
    assert fake.calls == [("click", "a")]  # executed exactly once
    assert "Clicked" in out
    assert "https://example.com/docs" in out  # read-back, not assumed


def test_browser_action_args_survive_restart(tmp_path):
    from server.approvals.gate import ApprovalStore, PendingApproval

    db = tmp_path / "approvals.db"
    s1 = ApprovalStore(db)
    p = PendingApproval(skill="browser_click", input_text="d", draft="d",
                        approved_hash="h",
                        action_args={"kind": "click", "session_id": "s",
                                     "selector": "a"})
    s1.save_pending(p)
    loaded = ApprovalStore(db).load_pending()
    assert len(loaded) == 1
    assert loaded[0].action_args["kind"] == "click"
    assert loaded[0].action_args["selector"] == "a"


# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------

def test_router_browser_open():
    from server.intent.router import IntentRouter, Intent
    r = IntentRouter()
    d = r.classify("browse to https://example.com/docs")
    assert d.tool_name == "browser_open" and d.args["url"].endswith("/docs")
    d = r.classify("open https://example.com in the browser")
    assert d.tool_name == "browser_open"
    # bare "open <url>" still reads
    d = r.classify("open https://example.com")
    assert d.tool_name == "web_read"


# ---------------------------------------------------------------------------
# Real-browser acceptance (skips honestly without Playwright/Chromium)
# ---------------------------------------------------------------------------

def _playwright_available() -> bool:
    try:
        from playwright.sync_api import sync_playwright  # type: ignore

        pw = sync_playwright().start()
        try:
            pw.chromium.launch(headless=True).close()
        finally:
            pw.stop()  # never leak the loop a failed launch leaves behind
        return True
    except Exception:
        return False


needs_pw = pytest.mark.skipif(not _playwright_available(),
                              reason="Playwright/Chromium not installed")


@needs_pw
def test_acceptance_real_browser_task(tmp_path):
    """Batch B exit gate: REAL Chromium (not a mock) does open -> read ->
    list elements -> click a link -> verified navigation -> screenshot,
    all in the same session.

    Uses a local HTTP server because this sandbox's egress proxy blocks
    Chromium's CONNECT tunneling (curl/httpx/manual CONNECT all work;
    the driver honors standard proxy env vars, so normal environments
    and direct connections are unaffected). The SSRF guard is tested
    separately; here the session row is inserted directly.
    """
    import threading
    from http.server import BaseHTTPRequestHandler, HTTPServer

    class H(BaseHTTPRequestHandler):
        def do_GET(self):
            if self.path == "/details":
                body = (b"<html><head><title>Details page</title></head>"
                        b"<body><h1>Details</h1></body></html>")
            else:
                body = (b"<html><head><title>Index page</title></head><body>"
                        b'<a id="go" href="/details">More information</a>'
                        b"</body></html>")
            self.send_response(200)
            self.send_header("Content-Type", "text/html")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def log_message(self, *a):
            pass

    srv = HTTPServer(("127.0.0.1", 0), H)
    port = srv.server_address[1]
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    try:
        svc = BrowserService(store=OmStore(db_path=str(tmp_path / "om.db")))
        assert svc.engine() == "playwright"
        base = f"http://127.0.0.1:{port}/"
        svc.store.insert("browser_sessions", {
            "id": "acc1", "url": base, "title": "t", "status": "idle",
            "updated_at": "2026-10-18T00:00:00",
        })
        # driver-direct open (service open() is SSRF-guarded by design)
        svc._pw.open("acc1", base)

        # 1. read the real title through the service contract
        r = svc.read("acc1")
        assert r["title"] == "Index page", r

        # 2. list elements, find the real link
        els = svc.elements("acc1")["elements"]
        link = next((e for e in els if e.get("selector") == "#go"), None)
        assert link is not None, els

        # 3. click it through the approval-path dispatcher
        res = svc.perform_action(
            {"kind": "click", "session_id": "acc1", "selector": "#go"})
        assert res["url"] == base + "details", res
        assert res["session_id"] == "acc1"

        # 4. read back the new page - the navigation really happened
        r2 = svc.read("acc1")
        assert r2["title"] == "Details page", r2
        assert r2["url"] == base + "details"

        # 5. screenshot from the SAME session
        name, png = svc.screenshot("acc1")
        assert len(png) > 1000

        # 6. failures stay failures: missing selector
        with pytest.raises(BrowserError):
            svc.perform_action(
                {"kind": "click", "session_id": "acc1",
                 "selector": "#does-not-exist", "timeout_ms": 2000})
    finally:
        svc._pw.shutdown()  # never leak the browser loop into other tests
        srv.shutdown()
