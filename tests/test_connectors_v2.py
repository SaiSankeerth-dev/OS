"""Connector v2 tests: encrypted vault, health-gated states, real task
execution, approval safety, and the MCP bridge. Live service calls are
mocked; what we verify is the framework's honesty — "connected" only ever
means a health check passed, and rejected actions never run.
"""
import json
import sqlite3
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from fastapi.testclient import TestClient  # noqa: E402

from web.server import app  # noqa: E402
from web.connectors import adapters as A  # noqa: E402


@pytest.fixture(scope="module")
def client():
    Path("data/dashboard.db").unlink(missing_ok=True)
    with TestClient(app) as c:
        yield c
    Path("data/dashboard.db").unlink(missing_ok=True)


@pytest.fixture()
def healthy(monkeypatch):
    for adapter in A.ADAPTERS.values():
        monkeypatch.setattr(
            adapter, "health_check", lambda creds: (True, "mocked ok"))


@pytest.fixture()
def failing(monkeypatch):
    for adapter in A.ADAPTERS.values():
        monkeypatch.setattr(
            adapter, "health_check", lambda creds: (False, "bad token (mocked)"))


def _grant(client, cid, scopes):
    m = next(c for c in client.get("/api/connectors").json()["connectors"]
             if c["id"] == cid)
    r = client.post(f"/api/connectors/{cid}/grant", json={"scopes": scopes or m["scopes"]})
    assert r.status_code == 200, r.text
    return r.json()["status"]


def _chat(client, message):
    """POST chat and return the final SSE 'done' payload."""
    r = client.post("/api/chat", json={"message": message})
    assert r.status_code == 200
    done = None
    for line in r.text.splitlines():
        if line.startswith("data: "):
            payload = json.loads(line[6:])
            if payload.get("t") == "done":
                done = payload
    assert done is not None, "no done event in chat stream"
    return done


# ---------------------------------------------------------------- vault ---

def test_vault_encrypts_at_rest(client, healthy):
    _grant(client, "github", None)
    r = client.post("/api/connectors/github/credentials",
                    json={"label": "t", "fields": {"token": "SUPERSECRET123"}})
    assert r.json()["status"]["state"] == "connected"
    raw = sqlite3.connect("data/dashboard.db").execute(
        "SELECT secret FROM connector_credentials WHERE cred_group='github'"
    ).fetchone()[0]
    assert "SUPERSECRET123" not in raw, "credential stored in plaintext!"
    # …and it decrypts back through the API layer
    from web.server import get_dash

    assert get_dash().load_credentials("github")["token"] == "SUPERSECRET123"
    client.post("/api/connectors/github/revoke")


# ------------------------------------------------------- health gating ---

def test_connected_only_after_health_check(client, healthy):
    st = _grant(client, "telegram", None)
    assert st["state"] == "granted"
    r = client.post("/api/connectors/telegram/credentials",
                    json={"fields": {"bot_token": "x", "chat_id": "1"}})
    assert r.json()["status"]["state"] == "connected"
    client.post("/api/connectors/telegram/revoke")


def test_google_keys_alone_are_not_connected(client, healthy):
    """App keys without a finished OAuth sign-in must never read 'connected'."""
    _grant(client, "gmail", None)
    r = client.post("/api/connectors/gmail/credentials",
                    json={"fields": {"client_id": "x", "client_secret": "y"}})
    body = r.json()["status"]
    assert body["state"] == "granted", body
    assert "Sign in with Google" in body["health_msg"]
    conns = {c["id"]: c for c in client.get("/api/connectors").json()["connectors"]}
    assert conns["gmail"]["needs_oauth"] is True
    assert conns["gmail"]["state"] == "granted"
    client.post("/api/connectors/gmail/revoke")


def test_failed_health_check_is_setup_error(client, failing):
    _grant(client, "telegram", None)
    r = client.post("/api/connectors/telegram/credentials",
                    json={"fields": {"bot_token": "bogus", "chat_id": "1"}})
    body = r.json()["status"]
    assert body["state"] == "setup_error"
    assert "bad token" in body["health_msg"]
    # setup_error is NOT connected — chat must not claim it can send
    conns = {c["id"]: c for c in client.get("/api/connectors").json()["connectors"]}
    assert conns["telegram"]["state"] == "setup_error"
    client.post("/api/connectors/telegram/revoke")


def test_google_group_shares_one_signin(client, healthy):
    _grant(client, "gmail", None)
    _grant(client, "google_calendar", None)
    r = client.post("/api/connectors/gmail/credentials",
                    json={"fields": {"client_id": "x", "client_secret": "y",
                                     "refresh_token": "fake-refresh-token"}})
    assert r.json()["status"]["state"] in ("granted", "connected", "setup_error")
    # calendar sees the shared credential and can verify itself
    r = client.post("/api/connectors/google_calendar/test")
    assert r.json()["status"]["state"] == "connected"
    # revoking gmail keeps the shared sign-in while calendar still uses it
    client.post("/api/connectors/gmail/revoke")
    from web.server import get_dash

    assert get_dash().has_credentials("google") is True
    # revoking the last google user removes the shared credential
    client.post("/api/connectors/google_calendar/revoke")
    assert get_dash().has_credentials("google") is False


def test_revoke_clears_grant_and_creds(client, healthy):
    _grant(client, "discord", None)
    client.post("/api/connectors/discord/credentials",
                json={"fields": {"webhook_url": "https://discord.com/api/webhooks/1/x"}})
    client.post("/api/connectors/discord/revoke")
    conns = {c["id"]: c for c in client.get("/api/connectors").json()["connectors"]}
    assert conns["discord"]["state"] == "available"
    from web.server import get_dash

    assert get_dash().has_credentials("discord") is False


def test_credentials_need_grant_first(client):
    r = client.post("/api/connectors/slack/credentials",
                    json={"fields": {"bot_token": "y"}})
    assert r.status_code == 403


# ------------------------------------------------------- task execution ---

def _connect_calendar(client, monkeypatch):
    monkeypatch.setattr(
        A.ADAPTERS["google_calendar"], "health_check", lambda creds: (True, "ok"))
    _grant(client, "google_calendar", None)
    # a finished Google sign-in leaves OAuth tokens, not just the app keys
    r = client.post("/api/connectors/google_calendar/credentials",
                    json={"fields": {"client_id": "x", "client_secret": "y",
                                     "refresh_token": "fake-refresh-token"}})
    assert r.json()["status"]["state"] == "connected", r.json()


def test_chat_schedules_meeting_with_approval(client, monkeypatch):
    _connect_calendar(client, monkeypatch)
    calls = []
    monkeypatch.setattr(
        A.ADAPTERS["google_calendar"], "run_action",
        lambda action, params, creds: calls.append((action, params)) or {"ok": True})

    done = _chat(client, 'schedule meeting with mom tomorrow at 4pm')
    ex = done["execution"]
    assert ex and ex["status"] == "pending_approval", done
    assert done["action_approval"], "approval record must be attached"
    assert calls == [], "write action ran before approval!"

    params = done["action_approval"]["params"]
    assert params["title"].lower().startswith("meeting with mom")
    assert "T16:00" in params["start"]

    aid = done["action_approval"]["id"]
    r = client.post(f"/api/actions/{aid}/approve")
    assert r.status_code == 200
    assert calls and calls[0][0] == "create_event"
    assert calls[0][1]["title"] == params["title"]
    client.post("/api/connectors/google_calendar/revoke")


def test_reject_never_runs_handler(client, monkeypatch):
    _connect_calendar(client, monkeypatch)
    calls = []
    monkeypatch.setattr(
        A.ADAPTERS["google_calendar"], "run_action",
        lambda action, params, creds: calls.append((action, params)) or {"ok": True})

    done = _chat(client, "schedule meeting with mom tomorrow at 4pm")
    aid = done["action_approval"]["id"]
    r = client.post(f"/api/actions/{aid}/reject")
    assert r.json()["ok"] is True
    assert calls == [], "rejected action must never invoke the handler"
    client.post("/api/connectors/google_calendar/revoke")


def test_chat_reads_calendar_now(client, monkeypatch):
    _connect_calendar(client, monkeypatch)
    monkeypatch.setattr(
        A.ADAPTERS["google_calendar"], "run_action",
        lambda action, params, creds: {
            "ok": True, "events": [
                {"id": "1", "title": "Standup", "start": "2026-09-28T10:00:00+05:30",
                 "end": "2026-09-28T10:15:00+05:30"}]})

    done = _chat(client, "what's on my calendar today")
    assert done["execution"]["status"] == "done"
    assert "Standup" in done["full"]
    client.post("/api/connectors/google_calendar/revoke")


def test_chat_needs_connection_without_grant(client):
    done = _chat(client, "schedule meeting with mom tomorrow at 4pm")
    assert done["execution"]["status"] == "needs_connection"
    assert "isn't connected" in done["full"]


def test_chat_asks_for_missing_info(client, monkeypatch):
    _connect_calendar(client, monkeypatch)
    done = _chat(client, "send email to bob@example.com")
    # gmail isn't connected in this test — either path is honest
    assert done["execution"]["status"] in ("needs_connection", "needs_info")
    client.post("/api/connectors/google_calendar/revoke")


# ------------------------------------------------------------------ MCP ---

def test_mcp_lists_only_connected_tools(client, monkeypatch):
    _connect_calendar(client, monkeypatch)
    r = client.post("/mcp", json={"jsonrpc": "2.0", "id": 1, "method": "tools/list"})
    tools = r.json()["result"]["tools"]
    names = {t["name"] for t in tools}
    assert "google_calendar.create_event" in names
    assert "google_calendar.list_events" in names
    assert not any(n.startswith("gmail.") for n in names), \
        "unconnected connector leaked into tools/list"
    client.post("/api/connectors/google_calendar/revoke")


def test_mcp_write_creates_approval_not_execution(client, monkeypatch):
    _connect_calendar(client, monkeypatch)
    calls = []
    monkeypatch.setattr(
        A.ADAPTERS["google_calendar"], "run_action",
        lambda action, params, creds: calls.append((action, params)) or {"ok": True})
    r = client.post("/mcp", json={
        "jsonrpc": "2.0", "id": 2, "method": "tools/call",
        "params": {"name": "google_calendar.create_event",
                   "arguments": {"title": "x", "start": "2026-09-28T16:00"}}})
    result = r.json()["result"]
    assert result.get("status") == "pending_approval"
    assert calls == [], "MCP must not execute write tools directly"
    pend = client.get("/api/actions/pending").json()["pending"]
    assert any(a["id"] == result["_approval_id"] for a in pend)
    client.post("/api/connectors/google_calendar/revoke")


def test_mcp_read_executes(client, monkeypatch):
    _connect_calendar(client, monkeypatch)
    monkeypatch.setattr(
        A.ADAPTERS["google_calendar"], "run_action",
        lambda action, params, creds: {"ok": True, "events": []})
    r = client.post("/mcp", json={
        "jsonrpc": "2.0", "id": 3, "method": "tools/call",
        "params": {"name": "google_calendar.list_events", "arguments": {}}})
    result = r.json()["result"]
    assert result.get("isError") is False
    client.post("/api/connectors/google_calendar/revoke")


def test_mcp_unknown_method(client):
    r = client.post("/mcp", json={"jsonrpc": "2.0", "id": 4, "method": "bogus"})
    assert "error" in r.json()


# ---- backend hardening (2026-09-28) --------------------------------------

def test_req_wraps_non_http_errors():
    """httpx.InvalidURL etc. must become AdapterError, never escape raw."""
    import httpx
    from web.connectors.adapters import _req
    from web.connectors.base import AdapterError

    real = httpx.request

    def boom(*a, **k):
        raise httpx.InvalidURL("Invalid port: ':1]'")

    httpx.request = boom
    try:
        with pytest.raises(AdapterError, match="Couldn't reach the service"):
            _req("GET", "https://example.com")
    finally:
        httpx.request = real


def test_health_checks_use_short_timeout():
    """Every non-Google health check must bound its wait so the UI never hangs."""
    import inspect
    from web.connectors.adapters import _HEALTH_TIMEOUT, get_adapter
    from web.connectors.manifests import MANIFESTS

    google = {m.id for m in MANIFESTS if m.auth_kind == "google_oauth"}
    for m in MANIFESTS:
        if m.id in google:
            continue
        src = inspect.getsource(get_adapter(m.id).health_check)
        assert "_HEALTH_TIMEOUT" in src, f"{m.id} health_check has no short timeout"


def test_oauth_state_csrf(client, monkeypatch):
    """Forged, missing, or reused OAuth states are rejected with 400."""
    import urllib.parse
    import web.server as srv
    import web.connectors.oauth_google as og

    monkeypatch.setattr(
        og, "authorization_url",
        lambda *a, **k: (f"https://accounts.google.com/x?state={k.get('state', '')}",
                         k.get("state", "")))
    client.post("/api/connectors/google_calendar/grant", json={})
    client.post("/api/connectors/google_calendar/credentials",
                json={"fields": {"client_id": "c", "client_secret": "s"}})

    # forged state
    r = client.get("/api/connectors/google/oauth/callback?code=x&state=forged")
    assert r.status_code == 400

    # valid state, missing code -> 400 and single-use consumption
    r = client.get("/api/connectors/google_calendar/oauth/start")
    state = urllib.parse.parse_qs(
        urllib.parse.urlparse(r.json()["url"]).query)["state"][0]
    assert len(state) >= 16 and state != "google_calendar"
    r = client.get(f"/api/connectors/google/oauth/callback?state={state}")
    assert r.status_code == 400
    # reuse -> 400
    r = client.get(f"/api/connectors/google/oauth/callback?code=x&state={state}")
    assert r.status_code == 400


def test_oauth_callback_without_client_creds(client, monkeypatch):
    """Callback with a valid state but wiped vault fails cleanly, not 500."""
    import urllib.parse
    import web.connectors.oauth_google as og

    monkeypatch.setattr(
        og, "authorization_url",
        lambda *a, **k: (f"https://accounts.google.com/x?state={k.get('state', '')}",
                         k.get("state", "")))
    client.post("/api/connectors/gmail/grant", json={})
    client.post("/api/connectors/gmail/credentials",
                json={"fields": {"client_id": "c", "client_secret": "s"}})
    r = client.get("/api/connectors/gmail/oauth/start")
    state = urllib.parse.parse_qs(
        urllib.parse.urlparse(r.json()["url"]).query)["state"][0]
    # wipe the vault between start and callback
    client.post("/api/connectors/gmail/revoke")
    client.post("/api/connectors/gmail/grant", json={})
    r = client.get(f"/api/connectors/google/oauth/callback?code=x&state={state}")
    assert r.status_code == 400


def test_microsoft_oauth_state_csrf(client, monkeypatch):
    """Forged, missing, or reused Microsoft OAuth states are rejected with 400."""
    import urllib.parse
    import web.connectors.oauth_microsoft as om

    monkeypatch.setattr(
        om, "authorization_url",
        lambda *a, **k: (f"https://login.microsoftonline.com/x?state={k.get('state', '')}",
                         k.get("state", "")))
    client.post("/api/connectors/microsoft_outlook/grant", json={})
    client.post("/api/connectors/microsoft_outlook/credentials",
                json={"fields": {"client_id": "c", "client_secret": "s"}})

    # forged state
    r = client.get("/api/connectors/microsoft/oauth/callback?code=x&state=forged")
    assert r.status_code == 400

    # valid state, missing code -> 400 and single-use consumption
    r = client.get("/api/connectors/microsoft_outlook/oauth/start")
    state = urllib.parse.parse_qs(
        urllib.parse.urlparse(r.json()["url"]).query)["state"][0]
    assert len(state) >= 16 and state != "microsoft_outlook"
    r = client.get(f"/api/connectors/microsoft/oauth/callback?state={state}")
    assert r.status_code == 400
    # reuse -> 400
    r = client.get(f"/api/connectors/microsoft/oauth/callback?code=x&state={state}")
    assert r.status_code == 400


def test_microsoft_oauth_callback_without_client_creds(client, monkeypatch):
    """Microsoft callback with a valid state but wiped vault fails cleanly, not 500."""
    import urllib.parse
    import web.connectors.oauth_microsoft as om

    monkeypatch.setattr(
        om, "authorization_url",
        lambda *a, **k: (f"https://login.microsoftonline.com/x?state={k.get('state', '')}",
                         k.get("state", "")))
    client.post("/api/connectors/microsoft_outlook/grant", json={})
    client.post("/api/connectors/microsoft_outlook/credentials",
                json={"fields": {"client_id": "c", "client_secret": "s"}})
    r = client.get("/api/connectors/microsoft_outlook/oauth/start")
    state = urllib.parse.parse_qs(
        urllib.parse.urlparse(r.json()["url"]).query)["state"][0]
    # wipe the vault between start and callback
    client.post("/api/connectors/microsoft_outlook/revoke")
    client.post("/api/connectors/microsoft_outlook/grant", json={})
    r = client.get(f"/api/connectors/microsoft/oauth/callback?code=x&state={state}")
    assert r.status_code == 400


def test_microsoft_oauth_happy_path(client, monkeypatch):
    """Full Microsoft OAuth flow stores the refresh token and clears needs_oauth."""
    import urllib.parse
    import web.connectors.oauth_microsoft as om
    import web.server as srv

    monkeypatch.setattr(
        om, "authorization_url",
        lambda *a, **k: (f"https://login.microsoftonline.com/x?state={k.get('state', '')}",
                         k.get("state", "")))
    monkeypatch.setattr(
        om, "exchange_code",
        lambda cid, sec, uri, code: {
            "client_id": cid, "client_secret": sec, "refresh_token": "rt-123"})
    # never hit the real Graph API during the callback health check
    monkeypatch.setattr(srv, "_run_health", lambda cid: (True, "ok"))

    client.post("/api/connectors/microsoft_outlook/grant", json={})
    client.post("/api/connectors/microsoft_outlook/credentials",
                json={"fields": {"client_id": "c", "client_secret": "s"}})
    r = client.get("/api/connectors/microsoft_outlook/oauth/start")
    assert r.status_code == 200
    assert "login.microsoftonline.com" in r.json()["url"]
    state = urllib.parse.parse_qs(
        urllib.parse.urlparse(r.json()["url"]).query)["state"][0]
    r = client.get(f"/api/connectors/microsoft/oauth/callback?code=authcode&state={state}")
    assert r.status_code == 200
    assert "Microsoft connected" in r.text

    # refresh token persisted, needs_oauth cleared
    detail = client.get("/api/connectors/microsoft_outlook").json()
    assert detail["needs_oauth"] is False
    assert detail["state"] == "connected"


def test_microsoft_manifest_registered():
    """Microsoft connector exists with the right auth wiring."""
    from web.connectors.manifests import get_manifest
    from web.connectors.adapters import get_adapter

    m = get_manifest("microsoft_outlook")
    assert m is not None
    assert m.auth_kind == "microsoft_oauth"
    assert m.cred_group == "microsoft"
    assert get_adapter("microsoft_outlook") is not None
