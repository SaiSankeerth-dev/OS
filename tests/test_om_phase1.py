"""Phase 1 tests: agent computer + browser sessions (web/om)."""
import os
import sys
import tempfile

import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from web.om import browser as browser_mod
from web.om import computer as computer_mod
from web.om.browser import BrowserError, BrowserService, _strip_html
from web.om.computer import ComputerError, ComputerService
from web.om.store import OmStore


@pytest.fixture()
def tmpdir():
    with tempfile.TemporaryDirectory() as d:
        yield d


@pytest.fixture()
def store(tmpdir):
    return OmStore(os.path.join(tmpdir, "om.db"))


@pytest.fixture()
def svc(store, tmpdir):
    return ComputerService(store, workspace_dir=os.path.join(tmpdir, "ws"))


# ------------------------------------------------------------- store
def test_store_crud(store):
    rec = store.insert("ideas", {"title": "t", "created_at": 1.0})
    assert store.get("ideas", rec["id"])["title"] == "t"
    store.update("ideas", rec["id"], {"status": "dismissed"})
    assert store.get("ideas", rec["id"])["status"] == "dismissed"
    assert store.count("ideas") == 1
    assert store.delete("ideas", rec["id"])
    assert store.get("ideas", rec["id"]) is None


# ------------------------------------------------------------- computer
def test_computer_snapshot_local(svc):
    snap = svc.snapshot()
    assert snap["mode"] == "local"
    assert snap["status"] == "running"
    assert snap["commands"] == []


def test_computer_execute_success(svc):
    r = svc.execute("echo hello")
    assert r["status"] == "succeeded"
    assert r["stdout"].strip() == "hello"
    assert r["exitCode"] == 0
    assert r["completedAt"]


def test_computer_execute_failure(svc):
    r = svc.execute("exit 3")
    assert r["status"] == "failed"
    assert r["exitCode"] == 3


def test_computer_idempotency(svc):
    a = svc.execute("echo one", idempotency_key="idem-1")
    b = svc.execute("echo one", idempotency_key="idem-1")
    assert a["id"] == b["id"]
    with pytest.raises(ComputerError):
        svc.execute("echo two", idempotency_key="idem-1")


def test_computer_busy_lease(svc):
    svc._lease = {"token": "x", "expires_at": 9999999999}
    with pytest.raises(ComputerError):
        svc.execute("echo hi")
    svc._lease = None


def test_computer_path_jail(svc):
    with pytest.raises(ComputerError):
        svc.read_file("/etc/passwd")
    with pytest.raises(ComputerError):
        svc.read_file("/workspace/../../etc/passwd")
    with pytest.raises(ComputerError):
        svc.write_file("/workspace/../../evil.txt", "x")
    # Absolute paths outside /workspace are remapped *inside* the workspace
    # (local mode) — the command still runs, but jailed.
    r = svc.execute("pwd", cwd="/etc")
    assert r["status"] == "succeeded"
    assert "/etc" not in r["stdout"] or "ws" in r["stdout"] or "tmp" in r["stdout"]


def test_computer_files(svc):
    svc.write_file("/workspace/a/b.txt", "data")
    assert svc.read_file("/workspace/a/b.txt")["text"] == "data"
    listing = svc.list_files("/workspace/a")
    assert [e["name"] for e in listing["entries"]] == ["b.txt"]
    svc.mkdir("/workspace/newdir")
    assert svc.list_files("/workspace/newdir")["entries"] == []
    with pytest.raises(ComputerError):
        svc.read_file("/workspace/nope.txt")


def test_computer_reconcile_marks_interrupted(svc, store):
    store.insert("computer_commands", {
        "id": "stuck1", "command": "sleep 999", "cwd": "/workspace",
        "status": "running", "stdout": "", "stderr": "",
        "started_at": 1.0,
    })
    snap = svc.snapshot()  # triggers reconcile
    assert snap["commands"][0]["status"] == "interrupted"


def test_computer_pdf_roundtrip(svc):
    raw = b"%PDF-1.4 fake"
    svc.import_pdf("/workspace/f.pdf", raw)
    name, out = svc.export_pdf("/workspace/f.pdf")
    assert name == "f.pdf" and out == raw
    with pytest.raises(ComputerError):
        svc.import_pdf("/workspace/x.pdf", b"not a pdf")


# ------------------------------------------------------------- browser
def test_strip_html():
    title, text = _strip_html(
        "<html><head><title>Hi</title></head>"
        "<body><h1>Hello</h1><script>evil()</script><p>World</p></body></html>")
    assert title == "Hi"
    assert "Hello" in text and "World" in text
    assert "evil" not in text


def test_browser_bad_url(store):
    b = BrowserService(store)
    with pytest.raises(BrowserError):
        b.create("not a url")
    with pytest.raises(BrowserError):
        b.create("ftp://x.example/x")


def test_browser_session_lifecycle_http(store):
    b = BrowserService(store)
    b._pw._ok = False  # force the HTTP fallback engine
    assert b.engine() == "http"
    # lifecycle against a local HTTP server
    import threading
    from http.server import BaseHTTPRequestHandler, HTTPServer

    class H(BaseHTTPRequestHandler):
        def do_GET(self):
            body = b"<html><head><title>Local</title></head><body><p>page text</p></body></html>"
            self.send_response(200)
            self.send_header("Content-Type", "text/html")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def log_message(self, *a):
            pass

    srv = HTTPServer(("127.0.0.1", 0), H)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    url = f"http://127.0.0.1:{srv.server_port}/"
    try:
        s = b.create(url)
        assert s["status"] == "active"
        assert s["title"] == "Local"
        page = b.read(s["id"])
        assert "page text" in page["text"]
        assert b.navigate(s["id"], url)["status"] == "active"
        assert b.close(s["id"])["status"] == "closed"
        assert b.delete(s["id"])
    finally:
        srv.shutdown()


def test_browser_screenshot_needs_playwright(store):
    b = BrowserService(store)
    b._pw._ok = False
    s = b.store.insert("browser_sessions", {"url": "http://x/", "updated_at": 1.0})
    with pytest.raises(BrowserError):
        b.screenshot(s["id"])
