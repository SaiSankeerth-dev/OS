"""Phase 0 trust-repair regression tests.

Each test pins one audit fix: the previously-buggy behavior must stay fixed.
Run: pytest tests/test_phase0_trust.py
"""
from __future__ import annotations

import importlib
import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parent.parent


# ---------------------------------------------------------------------------
# 1. Approval endpoint: exception -> failure (not ok:true), item stays queued
# ---------------------------------------------------------------------------

class _FakePending:
    def __init__(self, pid: int):
        self.pending_id = pid


class _ExplodingMgr:
    def __init__(self):
        self._pending = [_FakePending(7)]

    async def _approve_one(self, p):
        raise RuntimeError("boom")

    def _reject_one(self, p):
        raise RuntimeError("boom")


class _OkMgr:
    def __init__(self):
        self._pending = [_FakePending(7)]

    async def _approve_one(self, p):
        return "done"

    def _reject_one(self, p):
        return "rejected"


def _client_with(monkeypatch, mgr) -> TestClient:
    import web.server as srv
    monkeypatch.setattr(srv, "get_mgr", lambda: mgr)
    return TestClient(srv.app, raise_server_exceptions=False)


def test_approve_exception_reports_failure_and_keeps_queued(monkeypatch):
    mgr = _ExplodingMgr()
    r = _client_with(monkeypatch, mgr).post("/api/approvals/7/approve")
    assert r.status_code == 500
    # The item must NOT be silently dropped while the UI was told success.
    assert len(mgr._pending) == 1


def test_approve_success_dequeues(monkeypatch):
    mgr = _OkMgr()
    r = _client_with(monkeypatch, mgr).post("/api/approvals/7/approve")
    assert r.status_code == 200
    assert r.json()["ok"] is True
    assert mgr._pending == []


def test_reject_exception_reports_failure_and_keeps_queued(monkeypatch):
    mgr = _ExplodingMgr()
    r = _client_with(monkeypatch, mgr).post("/api/approvals/7/reject")
    assert r.status_code == 500
    assert len(mgr._pending) == 1


def test_approve_missing_id_is_404(monkeypatch):
    mgr = _OkMgr()
    r = _client_with(monkeypatch, mgr).post("/api/approvals/999/approve")
    assert r.status_code == 404


# ---------------------------------------------------------------------------
# 2. _safe_metadata: no eval() on database content
# ---------------------------------------------------------------------------

from server.memory.sqlite_impl import _safe_metadata  # noqa: E402


def test_safe_metadata_parses_plain_dict():
    assert _safe_metadata("{'a': 1}") == {"a": 1}
    assert _safe_metadata("{}") == {}


def test_safe_metadata_does_not_execute_code():
    # Under the old eval() these would run arbitrary code.
    assert _safe_metadata("__import__('os').system('evil')") == {}
    assert _safe_metadata("{'a': __import__('os')}") == {}
    assert _safe_metadata("(lambda: 1)()") == {}


def test_safe_metadata_empty_and_garbage():
    assert _safe_metadata("") == {}
    assert _safe_metadata(None) == {}
    assert _safe_metadata("not a dict") == {}
    assert _safe_metadata("[1, 2, 3]") == {}  # not a dict -> {}
    assert _safe_metadata({"already": "dict"}) == {"already": "dict"}


# ---------------------------------------------------------------------------
# 3. Dead TaskManager / planner removed (false-complete landmine)
# ---------------------------------------------------------------------------

def test_dead_task_manager_files_gone():
    assert not (ROOT / "server" / "tasks").exists()


def test_dead_task_manager_not_importable():
    with pytest.raises(ImportError):
        importlib.import_module("server.tasks.task_manager")
    with pytest.raises(ImportError):
        importlib.import_module("server.tasks")


# ---------------------------------------------------------------------------
# 4. Stale browser session: honest 410 + "stale", URL never clobbered
# ---------------------------------------------------------------------------

from web.om.browser import BrowserError, BrowserService  # noqa: E402
from web.om.store import OmStore  # noqa: E402


class _StaleDriver:
    """Simulates post-restart state: driver up, but no live page for sid."""

    def available(self):
        return True

    def is_live(self, sid):
        return False


def _service_with_session(tmp_path) -> tuple[BrowserService, str]:
    store = OmStore(db_path=str(tmp_path / "om.db"))
    svc = BrowserService(store=store)
    store.insert("browser_sessions", {
        "id": "sess1",
        "url": "https://example.com/",
        "title": "Example",
        "status": "active",
        "updated_at": "2026-10-18T00:00:00",
    })
    svc._pw = _StaleDriver()
    return svc, store


def test_stale_session_read_raises_and_preserves_url(tmp_path):
    svc, store = _service_with_session(tmp_path)
    with pytest.raises(BrowserError) as ei:
        svc.read("sess1")
    assert ei.value.status == 410
    after = store.get("browser_sessions", "sess1")
    assert after["status"] == "stale"
    # The real URL must never be overwritten with about:blank.
    assert after["url"] == "https://example.com/"


def test_stale_session_screenshot_raises(tmp_path):
    svc, _ = _service_with_session(tmp_path)
    with pytest.raises(BrowserError) as ei:
        svc.screenshot("sess1")
    assert ei.value.status == 410


def test_stale_session_console_raises(tmp_path):
    svc, _ = _service_with_session(tmp_path)
    with pytest.raises(BrowserError) as ei:
        svc.console("sess1")
    assert ei.value.status == 410


def test_stale_session_pdf_raises(tmp_path):
    svc, _ = _service_with_session(tmp_path)
    with pytest.raises(BrowserError) as ei:
        svc.page_pdf("sess1")
    assert ei.value.status == 410


# ---------------------------------------------------------------------------
# 5. SSRF guard on web_read
# ---------------------------------------------------------------------------

from server.tools.webread_tool import _url_blocked  # noqa: E402


@pytest.mark.parametrize("url", [
    "http://127.0.0.1/",
    "http://localhost:8080/",
    "http://169.254.169.254/",   # cloud metadata endpoint
    "http://10.0.0.5/",
    "http://172.16.4.4/",
    "http://192.168.1.1/",
    "http://100.64.0.1/",        # carrier-grade NAT
    "http://[::1]/",
    "http://[fe80::1]/",
    "ftp://example.com/",
    "file:///etc/passwd",
    "http://",
])
def test_ssrf_guard_blocks_internal_urls(url):
    assert _url_blocked(url) is not None, url


@pytest.mark.parametrize("url", [
    "http://93.184.216.34/",     # literal public IP (DNS-independent)
    "https://93.184.216.34/",
])
def test_ssrf_guard_allows_public_urls(url):
    assert _url_blocked(url) is None, url
