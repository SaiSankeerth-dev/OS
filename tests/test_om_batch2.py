"""Tests for the free-local batch: browser console+PDF, OCR, Telegram push."""
import os
import tempfile

import pytest

from web.om import notify as notify_mod
from web.om.browser import BrowserError, BrowserService, get_browser
from web.om.documents import DocumentService, _ocr_page, ocr_available
from web.om.notify import NotifyService
from web.om.store import OmStore


@pytest.fixture()
def store():
    tmp = tempfile.mkdtemp()
    return OmStore(os.path.join(tmp, "om.db"))


def _mk_session(store, sid="testsid1"):
    return store.insert("browser_sessions", {
        "id": sid, "url": "https://example.com",
        "title": "t", "status": "active", "updated_at": 0})


# ---------------- browser console + PDF ----------------
def test_console_404(store):
    svc = BrowserService(store)
    with pytest.raises(BrowserError) as e:
        svc.console("nope")
    assert e.value.status == 404
    with pytest.raises(BrowserError) as e:
        svc.page_pdf("nope")
    assert e.value.status == 404


def test_console_and_pdf_playwright(store):
    svc = get_browser(store)
    if not svc._pw.available():
        with pytest.raises(BrowserError) as e:
            svc.console(_mk_session(store)["id"])
        assert e.value.status == 503
        with pytest.raises(BrowserError) as e:
            svc.page_pdf(_mk_session(store, "s2")["id"])
        assert e.value.status == 503
        pytest.skip("playwright unavailable here")
    sid = _mk_session(store)["id"]
    # data: URL works offline; console.log fires on load
    svc._pw.open(sid, "data:text/html,<title>C</title>"
                      "<script>console.log('ping-console-123')</script>"
                      "<body>hello</body>")
    res = svc.console(sid)
    assert res["id"] == sid
    assert any("ping-console-123" in l["text"] for l in res["logs"]), res["logs"]
    name, raw = svc.page_pdf(sid)
    assert name.endswith(".pdf")
    assert raw[:5] == b"%PDF-"
    svc.close(sid)


# ---------------- OCR ----------------
def test_ocr_available():
    assert ocr_available() is True


def test_ocr_blank_page_returns_empty():
    # blank pypdf page -> pipeline runs, nothing to read
    from pypdf import PdfWriter
    import io
    w = PdfWriter()
    w.add_blank_page(width=400, height=400)
    buf = io.BytesIO()
    w.write(buf)
    assert _ocr_page(buf.getvalue(), 0) == ""


def test_ocr_reads_rendered_text(tmp_path):
    from PIL import Image, ImageDraw
    img = Image.new("RGB", (1200, 240), "white")
    d = ImageDraw.Draw(img)
    d.text((40, 80), "HELLO OCR 98765", fill="black")
    big = img.resize((2400, 480))
    png = str(tmp_path / "t.png")
    big.save(png)
    import subprocess
    out = subprocess.run(["tesseract", png, "stdout", "-l", "eng"],
                         capture_output=True, text=True, timeout=60)
    assert "HELLO" in out.stdout and "98765" in out.stdout, out.stdout


def test_page_text_embedded_source(store):
    import io
    from reportlab.pdfgen import canvas
    buf = io.BytesIO()
    c = canvas.Canvas(buf)
    c.drawString(50, 750, "embedded hello world")
    c.showPage()
    c.save()
    svc = DocumentService(store)
    doc = svc.upload("t.pdf", buf.getvalue())
    res = svc.page_text(doc["id"], 0)
    assert "embedded hello" in res["text"]
    assert res["source"] == "embedded"
    assert res["ocr_available"] is True


def test_page_text_scanned_triggers_ocr_attempt(store):
    # blank page: no embedded text -> OCR attempted (blank -> still empty)
    from pypdf import PdfWriter
    import io
    w = PdfWriter()
    w.add_blank_page(width=400, height=400)
    buf = io.BytesIO()
    w.write(buf)
    svc = DocumentService(store)
    doc = svc.upload("blank.pdf", buf.getvalue())
    res = svc.page_text(doc["id"], 0)
    assert res["text"] == ""
    assert res["source"] == "embedded"  # OCR found nothing either
    assert res["ocr_available"] is True


# ---------------- telegram ----------------
def test_telegram_not_configured(store, monkeypatch):
    monkeypatch.setattr(notify_mod, "_telegram_creds", lambda: {})
    assert NotifyService(store).telegram_status()["connected"] is False
    assert notify_mod.send_telegram("hi") == {"sent": False,
                                              "reason": "not_configured"}


def test_notify_telegram_flag_saves_inbox(store, monkeypatch):
    monkeypatch.setattr(notify_mod, "_telegram_creds", lambda: {})
    n = NotifyService(store)
    row = n.notify("Hello", "body", telegram=True)
    assert row["telegram"] == {"sent": False, "reason": "not_configured"}
    assert n.unread_count() == 1  # inbox save unaffected


def test_send_telegram_wiring(store, monkeypatch):
    seen = {}

    class FakeAdapter:
        def run_action(self, action, params, creds):
            seen.update(action=action, params=params, creds=creds)
            return {"ok": True}

    monkeypatch.setattr(notify_mod, "_telegram_creds",
                        lambda: {"bot_token": "tok", "chat_id": "42"})
    import web.connectors.adapters as adapters_mod
    monkeypatch.setitem(adapters_mod.ADAPTERS, "telegram", FakeAdapter())
    res = notify_mod.send_telegram("Title here", "Body here")
    assert res == {"sent": True}
    assert seen["action"] == "send_message"
    assert "Title here" in seen["params"]["text"]
    assert "Body here" in seen["params"]["text"]
