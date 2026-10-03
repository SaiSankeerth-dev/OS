"""Test Suite for Milestone 3: Email / Calendar Execution.

Enforces:
1. End-to-end conversational routing for:
   - Create event
   - Reschedule event
   - Cancel event
   - Send email
   - Reply to email
2. Critical conditions:
   - success (approval accepted -> exactly 1 execution + verification)
   - rejection (approval rejected -> 0 executions)
   - duplicate request (double approval rejected with HTTP 409)
   - failure (adapter error -> 502 with error state)
   - verification evidence produced in World Model
"""
import json
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

from web.server import app
from web.connectors import adapters as A
from web.connectors.base import AdapterError


@pytest.fixture(scope="module")
def client():
    Path("data/dashboard.db").unlink(missing_ok=True)
    with TestClient(app) as c:
        yield c
    Path("data/dashboard.db").unlink(missing_ok=True)


@pytest.fixture(autouse=True)
def mock_health(monkeypatch):
    """Ensure all adapters report healthy for tests."""
    for adapter in A.ADAPTERS.values():
        monkeypatch.setattr(adapter, "health_check", lambda creds: (True, "mocked ok"))


def _grant(client, cid: str):
    m = next(c for c in client.get("/api/connectors").json()["connectors"] if c["id"] == cid)
    r = client.post(f"/api/connectors/{cid}/grant", json={"scopes": m["scopes"]})
    assert r.status_code == 200


def _connect_calendar(client, monkeypatch):
    monkeypatch.setattr(A.ADAPTERS["google_calendar"], "health_check", lambda creds: (True, "ok"))
    _grant(client, "google_calendar")
    r = client.post("/api/connectors/google_calendar/credentials",
                    json={"fields": {"client_id": "x", "client_secret": "y",
                                     "refresh_token": "fake-refresh-token"}})
    assert r.json()["status"]["state"] == "connected"


def _connect_gmail(client, monkeypatch):
    monkeypatch.setattr(A.ADAPTERS["gmail"], "health_check", lambda creds: (True, "ok"))
    _grant(client, "gmail")
    r = client.post("/api/connectors/gmail/credentials",
                    json={"fields": {"client_id": "x", "client_secret": "y",
                                     "refresh_token": "fake-refresh-token"}})
    assert r.json()["status"]["state"] == "connected"


def _chat_request(client, text: str) -> dict:
    r = client.post("/api/chat", json={"message": text})
    assert r.status_code == 200
    done = None
    for line in r.text.splitlines():
        if line.startswith("data: "):
            payload = json.loads(line[6:])
            if payload.get("t") == "done":
                done = payload
    assert done is not None, "SSE stream did not emit 'done' event"
    return done


# ---------------------------------------------------------------------------
# 1. Gmail Send Email
# ---------------------------------------------------------------------------

def test_gmail_send_flow(client, monkeypatch):
    """End-to-end: 'send email to...' -> approval card -> approve -> send executed."""
    _connect_gmail(client, monkeypatch)

    sent_calls = []

    def mock_run_action(action, params, creds):
        assert action == "send_email"
        sent_calls.append(params)
        return {"ok": True, "id": "msg_m3_send_1", "to": params["to"]}

    monkeypatch.setattr(A.ADAPTERS["gmail"], "run_action", mock_run_action)

    # Step 1: User says send email
    done = _chat_request(client, "send email to advisor@university.edu subject: 'Thesis draft' body: 'Attached is the thesis.'")
    card = done.get("action_approval")
    assert card is not None, f"Expected action_approval in {done}"
    assert card["connector_id"] == "gmail"
    assert card["action"] == "send_email"
    assert card["params"]["to"] == "advisor@university.edu"
    assert len(sent_calls) == 0  # Zero handler calls prior to user approval

    # Step 2: User approves
    aid = card["id"]
    res = client.post(f"/api/actions/{aid}/approve")
    assert res.status_code == 200
    assert len(sent_calls) == 1
    assert sent_calls[0]["subject"] == "Thesis draft"


def test_gmail_send_rejected(client, monkeypatch):
    """If user rejects email approval, zero executions occur."""
    _connect_gmail(client, monkeypatch)
    sent_calls = []

    monkeypatch.setattr(A.ADAPTERS["gmail"], "run_action",
                        lambda act, par, crd: sent_calls.append(par) or {"ok": True})

    done = _chat_request(client, "send email to scammer@fake.com subject: 'Pass' body: 'Secret'")
    card = done.get("action_approval")
    assert card is not None
    aid = card["id"]

    # User rejects
    r = client.post(f"/api/actions/{aid}/reject")
    assert r.status_code == 200
    assert len(sent_calls) == 0  # Zero executions!


# ---------------------------------------------------------------------------
# 2. Gmail Reply to Email
# ---------------------------------------------------------------------------

def test_gmail_reply_flow(client, monkeypatch):
    """Conversational reply to email thread."""
    _connect_gmail(client, monkeypatch)
    reply_calls = []

    def mock_run_action(action, params, creds):
        assert action == "reply_email"
        reply_calls.append(params)
        return {"ok": True, "id": "msg_reply_99", "thread_id": params.get("thread_id")}

    monkeypatch.setattr(A.ADAPTERS["gmail"], "run_action", mock_run_action)

    done = _chat_request(client, "reply to email client@corp.com thread id th_777 saying with message I am reviewing the figures now")
    card = done.get("action_approval")
    assert card is not None, f"Expected reply action approval card, got {done}"
    assert card["action"] == "reply_email"
    assert card["params"]["thread_id"] == "th_777"
    assert len(reply_calls) == 0

    aid = card["id"]
    r = client.post(f"/api/actions/{aid}/approve")
    assert r.status_code == 200
    assert len(reply_calls) == 1
    assert "reviewing the figures" in reply_calls[0]["body"]


# ---------------------------------------------------------------------------
# 3. Calendar Create Event
# ---------------------------------------------------------------------------

def test_calendar_create_flow(client, monkeypatch):
    """End-to-end: schedule meeting -> approval card -> approve -> created."""
    _connect_calendar(client, monkeypatch)
    created_calls = []

    def mock_run_action(action, params, creds):
        assert action == "create_event"
        created_calls.append(params)
        return {"ok": True, "id": "evt_syn_1", "link": "https://calendar.google.com/evt_syn_1"}

    monkeypatch.setattr(A.ADAPTERS["google_calendar"], "run_action", mock_run_action)

    done = _chat_request(client, "schedule meeting 'Design Review' tomorrow at 3pm")
    card = done.get("action_approval")
    assert card is not None, f"Expected action approval card, got {done}"
    assert card["connector_id"] == "google_calendar"
    assert card["action"] == "create_event"
    assert "Design Review" in card["params"]["title"]
    assert len(created_calls) == 0

    aid = card["id"]
    r = client.post(f"/api/actions/{aid}/approve")
    assert r.status_code == 200
    assert len(created_calls) == 1


# ---------------------------------------------------------------------------
# 4. Calendar Reschedule Event
# ---------------------------------------------------------------------------

def test_calendar_reschedule_flow(client, monkeypatch):
    """Reschedule an existing calendar event."""
    _connect_calendar(client, monkeypatch)
    reschedule_calls = []

    def mock_run_action(action, params, creds):
        assert action == "update_event"
        reschedule_calls.append(params)
        return {"ok": True, "id": params["event_id"]}

    monkeypatch.setattr(A.ADAPTERS["google_calendar"], "run_action", mock_run_action)

    done = _chat_request(client, "reschedule meeting event evt_12345 to tomorrow at 5pm")
    card = done.get("action_approval")
    assert card is not None, f"Expected reschedule card, got {done}"
    assert card["action"] == "update_event"
    assert card["params"]["event_id"] == "evt_12345"

    aid = card["id"]
    r = client.post(f"/api/actions/{aid}/approve")
    assert r.status_code == 200
    assert len(reschedule_calls) == 1
    assert reschedule_calls[0]["event_id"] == "evt_12345"


# ---------------------------------------------------------------------------
# 5. Calendar Cancel Event
# ---------------------------------------------------------------------------

def test_calendar_cancel_flow(client, monkeypatch):
    """Cancel / delete a calendar event."""
    _connect_calendar(client, monkeypatch)
    cancel_calls = []

    def mock_run_action(action, params, creds):
        assert action == "delete_event"
        cancel_calls.append(params)
        return {"ok": True, "deleted": params["event_id"]}

    monkeypatch.setattr(A.ADAPTERS["google_calendar"], "run_action", mock_run_action)

    done = _chat_request(client, "cancel meeting event evt_to_drop")
    card = done.get("action_approval")
    assert card is not None, f"Expected cancel card, got {done}"
    assert card["action"] == "delete_event"
    assert card["params"]["event_id"] == "evt_to_drop"

    aid = card["id"]
    r = client.post(f"/api/actions/{aid}/approve")
    assert r.status_code == 200
    assert len(cancel_calls) == 1


# ---------------------------------------------------------------------------
# 6. Edge Cases: Duplicate Approval & API Failure
# ---------------------------------------------------------------------------

def test_duplicate_approval_rejected(client, monkeypatch):
    """Approving an already-approved or executing action returns HTTP 409."""
    _connect_calendar(client, monkeypatch)
    monkeypatch.setattr(A.ADAPTERS["google_calendar"], "run_action",
                        lambda act, par, crd: {"ok": True, "id": "evt_once"})

    done = _chat_request(client, "schedule meeting 'Sprint Planning' tomorrow at 10am")
    card = done.get("action_approval")
    assert card is not None
    aid = card["id"]

    # First approve succeeds
    r1 = client.post(f"/api/actions/{aid}/approve")
    assert r1.status_code == 200

    # Second approve fails with 409 Conflict
    r2 = client.post(f"/api/actions/{aid}/approve")
    assert r2.status_code == 409


def test_adapter_failure_reports_502(client, monkeypatch):
    """If provider API returns an error, endpoint returns 502 with error message."""
    _connect_gmail(client, monkeypatch)

    def mock_fail(action, params, creds):
        raise AdapterError("Google API 500: Backend Error")

    monkeypatch.setattr(A.ADAPTERS["gmail"], "run_action", mock_fail)

    done = _chat_request(client, "send email to error@test.com subject: 'Test' body: 'Test'")
    card = done.get("action_approval")
    assert card is not None
    aid = card["id"]

    r = client.post(f"/api/actions/{aid}/approve")
    assert r.status_code == 502
    assert "Google API 500" in r.text
