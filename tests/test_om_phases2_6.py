"""Tests for OpenMuse port phases 2–6: activity, finance, documents, threads, notifications."""
import io
import os
import tempfile

import pytest

from web.om.activity import ActivityError, ActivityService
from web.om.documents import DocumentService
from web.om.finance import FinanceService
from web.om.notify import NotifyService
from web.om.store import OmStore
from web.om.threads import ThreadService


@pytest.fixture()
def store():
    tmp = tempfile.mkdtemp()
    return OmStore(os.path.join(tmp, "om.db"))


# ---------------- activity runs ----------------
def test_run_lifecycle(store):
    a = ActivityService(store)
    run = a.create_run("Deploy", ["build", "test", "ship"])
    assert run["status"] == "planned"
    assert [s["name"] for s in run["plan"]] == ["build", "test", "ship"]

    run = a.transition(run["id"], "running")
    assert run["status"] == "running"
    run = a.step(run["id"], 0, "done")
    assert run["plan"][0]["status"] == "done"
    assert run["receipt"]["current_step"] == 1

    run = a.transition(run["id"], "paused")
    assert run["status"] == "paused"
    run = a.transition(run["id"], "running")
    run = a.transition(run["id"], "failed")
    assert run["status"] == "failed"
    # retry: failed → running
    run = a.transition(run["id"], "running")
    assert run["status"] == "running"
    run = a.transition(run["id"], "done")
    assert run["status"] == "done"

    evs = a.events(run["id"])
    kinds = [e["kind"] for e in evs]
    assert "created" in kinds and "step" in kinds
    assert [e["seq"] for e in evs] == sorted(e["seq"] for e in evs)


def test_run_bad_transitions(store):
    a = ActivityService(store)
    run = a.create_run("X")
    with pytest.raises(ActivityError):
        a.transition(run["id"], "done")  # planned → done not allowed
    with pytest.raises(ActivityError):
        a.transition(run["id"], "bogus")
    with pytest.raises(ActivityError):
        a.step(run["id"], 5, "done")  # no steps
    with pytest.raises(ActivityError):
        a.get_run("nope")


def test_run_cancel_and_note(store):
    a = ActivityService(store)
    run = a.create_run("Y", ["a"])
    a.transition(run["id"], "running")
    a.note(run["id"], "waiting on user")
    run = a.transition(run["id"], "cancelled")
    assert run["status"] == "cancelled"
    assert any(e["kind"] == "note" for e in a.events(run["id"]))


# ---------------- ideas & goals ----------------
def test_idea_lifecycle(store):
    a = ActivityService(store)
    idea = a.create_idea("Solar charger", "charge phones outdoors",
                         kind="product", evidence=["saw 3 people asking"])
    assert idea["status"] == "new"
    assert a.list_ideas()[0]["evidence"] == ["saw 3 people asking"]
    a.update_idea(idea["id"], status="edited", title="Solar charger v2")
    assert a.get_idea(idea["id"])["title"] == "Solar charger v2"
    res = a.accept_idea(idea["id"])
    assert a.get_idea(idea["id"])["status"] == "accepted"
    goal = a.get_goal(res["goal_id"])
    assert goal["title"] == "Solar charger v2"
    with pytest.raises(ActivityError):
        a.update_idea(idea["id"], status="bogus")


def test_goal_milestones(store):
    a = ActivityService(store)
    g = a.create_goal("Ship v1")
    m1 = a.add_milestone(g["id"], "Design")
    m2 = a.add_milestone(g["id"], "Build")
    a.set_milestone(m1["id"], True)
    g2 = a.get_goal(g["id"])
    assert len(g2["milestones"]) == 2
    assert g2["milestones"][0]["done"] == 1
    assert g2["milestones"][1]["done"] == 0
    a.update_goal(g["id"], status="done")
    assert a.get_goal(g["id"])["status"] == "done"
    a.delete_milestone(m2["id"])
    assert len(a.get_goal(g["id"])["milestones"]) == 1


# ---------------- finance ----------------
SAMPLE_CSV = """Date,Description,Amount
2026-09-01,Salary ACME,50000
2026-09-02,Swiggy order,-450.50
2026-09-03,Uber ride,-320
2026-09-04,BigBasket groceries,-1250.75
2026-09-05,Netflix,-649
"""


def test_finance_upload_and_summary(store):
    f = FinanceService(store)
    rep = f.upload("sept.csv", SAMPLE_CSV.encode())
    s = rep["summary"]
    assert s["transactions"] == 5
    assert s["total_in"] == 50000
    assert round(s["total_out"], 2) == round(450.50 + 320 + 1250.75 + 649, 2)
    assert round(s["net"], 2) == round(50000 - (450.50 + 320 + 1250.75 + 649), 2)
    cats = {c["category"]: c["spent"] for c in s["by_category"]}
    assert cats["food"] == 450.50
    assert cats["groceries"] == 1250.75
    assert len(s["by_month"]) == 1 and s["by_month"][0]["month"] == "2026-09"
    assert len(rep["transactions"]) == 5

    listed = f.list_reports()
    assert listed[0]["name"] == "sept.csv"
    assert listed[0]["report"]["summary"]["total_out"] == s["total_out"]
    full = f.get_report(rep["id"])
    assert full["report"]["row_count"] == 5
    f.delete_report(rep["id"])
    assert f.list_reports() == []


def test_finance_debit_credit_columns(store):
    f = FinanceService(store)
    csv_text = "Date,Details,Debit,Credit\n2026-09-01,ATM,5000,\n2026-09-02,Refund,,1200\n"
    rep = f.upload("dc.csv", csv_text.encode())
    s = rep["summary"]
    assert s["total_out"] == 5000
    assert s["total_in"] == 1200


def test_finance_bad_csv(store):
    f = FinanceService(store)
    with pytest.raises(Exception):
        f.upload("empty.csv", b"")
    with pytest.raises(Exception):
        f.upload("weird.csv", b"foo,bar\n1,2\n")


# ---------------- documents ----------------
def _make_pdf(fields=None):
    """Build a minimal PDF with text form fields, computing a valid xref."""
    fields = fields or []
    objs = []
    # 1: catalog, 2: pages, 3: page, 4: acroform, 5..: field annots
    field_refs = " ".join(f"{5 + i} 0 R" for i in range(len(fields)))
    objs.append("<< /Type /Catalog /Pages 2 0 R /AcroForm 4 0 R >>")
    objs.append("<< /Type /Pages /Kids [3 0 R] /Count 1 >>")
    annots = " ".join(f"{5 + i} 0 R" for i in range(len(fields)))
    objs.append(f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] "
                f"/Annots [{annots}] >>")
    objs.append(f"<< /Fields [{field_refs}] >>")
    for i, name in enumerate(fields):
        y = 150 - i * 25
        objs.append(
            f"<< /Type /Annot /Subtype /Widget /Rect [10 {y} 190 {y + 18}] "
            f"/FT /Tx /T ({name}) /V () /F 4 >>")
    out = [b"%PDF-1.4"]
    offsets = []
    for i, body in enumerate(objs, start=1):
        offsets.append(sum(len(b) + 1 for b in out))
        out.append(f"{i} 0 obj".encode())
        out.append(body.encode())
        out.append(b"endobj")
    xref_pos = sum(len(b) + 1 for b in out)
    out.append(f"xref\n0 {len(objs) + 1}".encode())
    out.append(b"0000000000 65535 f ")
    for off in offsets:
        out.append(f"{off:010d} 00000 n ".encode())
    out.append(f"trailer\n<< /Size {len(objs) + 1} /Root 1 0 R >>".encode())
    out.append(b"startxref")
    out.append(str(xref_pos).encode())
    out.append(b"%%EOF")
    return b"\n".join(out)


def test_documents_upload_info_fill(store):
    pytest.importorskip("pypdf")
    d = DocumentService(store)
    raw = _make_pdf(["name", "email"])
    up = d.upload("form.pdf", raw)
    assert up["pages"] == 1 and up["fields"] == 2

    info = d.info(up["id"])
    assert {f["name"] for f in info["fields"]} == {"name", "email"}

    txt = d.page_text(up["id"], 0)
    assert txt["pages"] == 1

    filled = d.fill(up["id"], {"name": "Sai", "nope": "x"})
    assert filled["filled"] == 1
    assert filled["unknown_fields"] == ["nope"]
    # original untouched, new doc exists
    assert len(d.list()) == 2
    name, data = d.file_bytes(filled["id"])
    assert data[:5] == b"%PDF-"
    d.delete(up["id"])
    assert len(d.list()) == 1


def test_documents_rejects_non_pdf(store):
    d = DocumentService(store)
    with pytest.raises(Exception):
        d.upload("x.txt", b"hello")


# ---------------- threads ----------------
def test_thread_lifecycle(store):
    t = ThreadService(store)
    th = t.create("My chat")
    assert th["title"] == "My chat"
    t.add_message(th["id"], "user", "hello")
    t.add_message(th["id"], "assistant", "hi there")
    got = t.get(th["id"])
    assert len(got["messages"]) == 2
    assert got["messages"][0]["role"] == "user"

    t.rename(th["id"], "Renamed")
    assert t.get(th["id"])["title"] == "Renamed"
    t.archive(th["id"])
    assert t.list(archived=False) == []
    assert len(t.list(archived=True)) == 1
    t.restore(th["id"])
    assert len(t.list(archived=False)) == 1

    r = t.replay(th["id"])
    assert r["title"] == "Renamed (replay)"
    assert len(r["messages"]) == 2
    t.delete(th["id"])
    with pytest.raises(Exception):
        t.get(th["id"])


def test_thread_bad_input(store):
    t = ThreadService(store)
    with pytest.raises(Exception):
        t.create("x", kind="bogus")
    th = t.create("y")
    with pytest.raises(Exception):
        t.add_message(th["id"], "robot", "hi")
    with pytest.raises(Exception):
        t.add_message(th["id"], "user", "   ")


# ---------------- notifications ----------------
def test_notifications(store):
    n = NotifyService(store)
    n.notify("Run done", "deploy finished", source="activity")
    n.notify("New idea", source="ideas")
    assert n.unread_count() == 2
    items = n.list()
    assert len(items) == 2
    n.mark_read(items[0]["id"])
    assert n.unread_count() == 1
    assert len(n.list(unread_only=True)) == 1
    assert n.mark_all_read() == 1
    assert n.unread_count() == 0
    assert n.clear_read() == 2
    assert n.list() == []
    with pytest.raises(Exception):
        n.notify("   ")
