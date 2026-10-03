"""Tests for batch 3: PWA assets, retry engine, mail rules."""
import json
import os
import tempfile
import time

import pytest

import web.om.mailrules as mailrules_mod
from web.om.activity import (ActivityService, start_retry_sweeper,
                             ActivityError)
from web.om.mailrules import MailRulesError, MailRulesService
from web.om.store import OmStore, jdumps, jloads


@pytest.fixture()
def store():
    tmp = tempfile.mkdtemp()
    return OmStore(os.path.join(tmp, "om.db"))


REPO = os.path.join(os.path.dirname(__file__), "..")


# ---------------- PWA ----------------
def test_manifest_valid():
    p = os.path.join(REPO, "web", "static", "manifest.webmanifest")
    m = json.load(open(p))
    assert m["name"].startswith("OS")
    assert m["start_url"] == "/"
    assert m["display"] == "standalone"
    assert any(i["sizes"] == "512x512" for i in m["icons"])
    for i in m["icons"]:
        assert os.path.exists(os.path.join(REPO, "web", "static",
                                           i["src"].replace("/static/", ""))), i["src"]


def test_service_worker_bypasses_api():
    sw = open(os.path.join(REPO, "web", "static", "sw.js")).read()
    assert "/api/" in sw  # API calls bypass the cache
    html = open(os.path.join(REPO, "web", "static", "index.html")).read()
    assert "manifest.webmanifest" in html
    assert "apple-touch-icon" in html
    js = open(os.path.join(REPO, "web", "static", "app.js")).read()
    assert "serviceWorker" in js


# ---------------- retry engine ----------------
def _fail_run(svc, rid):
    svc.transition(rid, "running")
    return svc.transition(rid, "failed")


def test_retry_policy_stored(store):
    svc = ActivityService(store)
    r = svc.create_run("R", ["a"], {"max_retries": 3, "backoff_s": 60})
    rt = r["receipt"]["retry"]
    assert (rt["max"], rt["backoff"], rt["count"], rt["next_at"]) == (3, 60, 0, None)
    r2 = svc.create_run("R2", ["a"])
    assert "retry" not in r2["receipt"]
    r3 = svc.create_run("R3", ["a"], {"max_retries": 0, "backoff_s": 5})
    assert "retry" not in r3["receipt"]
    r4 = svc.create_run("R4", ["a"], {"max_retries": "x"})
    assert "retry" not in r4["receipt"]


def test_fail_schedules_retry_with_backoff(store):
    svc = ActivityService(store)
    r = svc.create_run("R", ["a"], {"max_retries": 2, "backoff_s": 60})
    before = time.time()
    r = _fail_run(svc, r["id"])
    rt = r["receipt"]["retry"]
    assert before + 60 <= rt["next_at"] <= time.time() + 61
    kinds = [e["kind"] for e in svc.events(r["id"])]
    assert "retry_scheduled" in kinds
    # not due yet
    assert svc.sweep_retries() == []


def _force_due(store, rid):
    row = store.get("runs", rid)
    receipt = jloads(row["receipt"], {})
    receipt["retry"]["next_at"] = time.time() - 1
    store.update("runs", rid, {"receipt": jdumps(receipt)})


def test_sweep_retries_due_run(store):
    svc = ActivityService(store)
    r = svc.create_run("R", ["a"], {"max_retries": 2, "backoff_s": 60})
    _fail_run(svc, r["id"])
    _force_due(store, r["id"])
    assert svc.sweep_retries() == [r["id"]]
    r = svc.get_run(r["id"])
    assert r["status"] == "running"
    assert r["receipt"]["retry"]["count"] == 1
    # second failure -> exponential backoff (120s), scheduled again
    r = svc.transition(r["id"], "failed")
    assert r["receipt"]["retry"]["next_at"] > time.time() + 100


def test_retry_budget_exhaustion(store):
    svc = ActivityService(store)
    r = svc.create_run("R", ["a"], {"max_retries": 1, "backoff_s": 1})
    _fail_run(svc, r["id"])
    _force_due(store, r["id"])
    assert svc.sweep_retries() == [r["id"]]
    svc.transition(r["id"], "failed")  # count(1) >= max(1): exhausted
    r = svc.get_run(r["id"])
    assert r["receipt"]["retry"]["next_at"] is None
    assert r["status"] == "failed"
    assert svc.sweep_retries() == []
    notes = [e["data"].get("message", "") for e in svc.events(r["id"])
             if e["kind"] == "note"]
    assert any("exhausted" in n for n in notes)


def test_sweeper_idempotent(store):
    t1 = start_retry_sweeper(store, interval_s=3600)
    t2 = start_retry_sweeper(store, interval_s=3600)
    assert t1 is t2 and t1.is_alive()


# ---------------- mail rules ----------------
def test_rule_crud(store):
    m = MailRulesService(store)
    assert m.list_rules() == []
    r = m.add_rule("Follow", "newer_than:7d", "follow up, reminder", "task")
    assert r["keywords"] == ["follow up", "reminder"]
    assert len(m.list_rules()) == 1
    with pytest.raises(MailRulesError):
        m.add_rule("  ", "q", ["x"])
    with pytest.raises(MailRulesError):
        m.add_rule("No kw", "q", [])
    m.delete_rule(r["id"])
    assert m.list_rules() == []
    with pytest.raises(MailRulesError):
        m.delete_rule("nope")


def test_seed_defaults_idempotent(store):
    m = MailRulesService(store)
    assert len(m.seed_defaults()) == 2
    assert len(m.seed_defaults()) == 2
    assert len(m.list_rules()) == 2


def test_gmail_status_disconnected(store, monkeypatch):
    monkeypatch.setattr(mailrules_mod, "_gmail_creds", lambda: {})
    st = MailRulesService(store).gmail_status()
    assert st["connected"] is False


def test_scan_needs_gmail(store, monkeypatch):
    monkeypatch.setattr(mailrules_mod, "_gmail_creds", lambda: {})
    with pytest.raises(MailRulesError) as e:
        MailRulesService(store).scan()
    assert e.value.status == 503


def _fake_gmail(monkeypatch, emails):
    class FakeGmail:
        def run_action(self, action, params, creds):
            assert action == "search_emails"
            return {"ok": True, "emails": emails}
    monkeypatch.setattr(mailrules_mod, "_gmail_creds", lambda: {"t": "x"})
    import web.connectors.adapters as amod
    monkeypatch.setitem(amod.ADAPTERS, "gmail", FakeGmail())


def test_scan_creates_ideas_and_dedupes(store, monkeypatch):
    _fake_gmail(monkeypatch, [
        {"id": "m1", "subject": "Please follow up on the proposal",
         "from": "a@x.com", "date": "today"},
        {"id": "m2", "subject": "Lunch menu", "from": "b@x.com", "date": "today"},
    ])
    m = MailRulesService(store)
    m.add_rule("Follow", "newer_than:7d", ["follow up"], "task")
    res = m.scan()
    assert res["scanned"] == 2
    made = [c for c in res["created"] if c.get("idea_id")]
    assert len(made) == 1
    assert "follow up" in made[0]["title"].lower()
    ideas = ActivityService(store).list_ideas()
    assert len(ideas) == 1
    ev = ideas[0]["evidence"][0]
    assert ev["email_id"] == "m1" and ev["keyword"] == "follow up"
    # second scan: nothing new (seen pairs remembered)
    res2 = m.scan()
    assert [c for c in res2["created"] if c.get("idea_id")] == []
    assert len(ActivityService(store).list_ideas()) == 1
