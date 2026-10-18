"""Regression tests for Google OAuth scope isolation, conflict detection,
and independent connector token management.

Verifies:
1. Connector scope registry maps each connector strictly to its required scopes.
2. Incompatible scope pairs (e.g. Drive + YouTube) are proactively detected and rejected.
3. Individual connector authorization requests only contain that connector's scopes.
4. include_granted_scopes is disabled (false) to prevent cross-service scope re-aggregation.
5. Connecting Calendar does NOT mark Gmail, Sheets, Drive, or YouTube as connected.
6. Revoking one connector preserves tokens and connection status for other Google connectors.
7. Secrets and tokens are properly redacted/masked in API responses.
"""
from __future__ import annotations

import json
import sqlite3
import sys
import urllib.parse
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from fastapi.testclient import TestClient  # noqa: E402
from web.connectors import adapters as A  # noqa: E402
from web.connectors import oauth_google as og  # noqa: E402
from web.server import app, get_dash  # noqa: E402
import web.server as srv  # noqa: E402


@pytest.fixture()
def client():
    db_path = Path("data/dashboard.db")
    db_path.unlink(missing_ok=True)
    with TestClient(app) as c:
        yield c
    db_path.unlink(missing_ok=True)


@pytest.fixture()
def healthy(monkeypatch):
    for adapter in A.ADAPTERS.values():
        monkeypatch.setattr(adapter, "health_check", lambda creds: (True, "mocked ok"))


def _grant(client: TestClient, cid: str, scopes: list[str] | None = None) -> dict:
    m = next(c for c in client.get("/api/connectors").json()["connectors"] if c["id"] == cid)
    r = client.post(f"/api/connectors/{cid}/grant", json={"scopes": scopes or m["scopes"]})
    assert r.status_code == 200, r.text
    return r.json()["status"]


def _extract_query_params(url: str) -> dict[str, list[str]]:
    parsed = urllib.parse.urlparse(url)
    return urllib.parse.parse_qs(parsed.query)


# =========================================================================
# 1. Scope Registry & Incompatibility Tests
# =========================================================================

def test_google_connector_scope_registry():
    """Verify each connector defines only its required scopes."""
    cal = og.get_scopes_for_connector("google_calendar")
    assert cal == ["https://www.googleapis.com/auth/calendar"]

    gmail = og.get_scopes_for_connector("gmail")
    assert "https://www.googleapis.com/auth/gmail.readonly" in gmail
    assert "https://www.googleapis.com/auth/gmail.send" in gmail
    assert len(gmail) == 2

    sheets = og.get_scopes_for_connector("google_sheets")
    assert sheets == ["https://www.googleapis.com/auth/spreadsheets"]

    drive = og.get_scopes_for_connector("google_drive")
    assert drive == ["https://www.googleapis.com/auth/drive.file"]

    yt = og.get_scopes_for_connector("youtube")
    assert yt == ["https://www.googleapis.com/auth/youtube.readonly"]


def test_validate_scopes_rejects_incompatible_drive_and_youtube():
    """Proactively reject combining Drive and YouTube scopes before Google is contacted."""
    incompatible = [
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/youtube.readonly",
    ]
    with pytest.raises(ValueError) as exc:
        og.validate_scopes(incompatible)
    assert "Incompatible Google OAuth scopes detected" in str(exc.value)
    assert "Drive and YouTube" in str(exc.value)


def test_validate_scopes_permits_compatible_scopes():
    """Valid independent or compatible scopes pass without error."""
    og.validate_scopes(["https://www.googleapis.com/auth/calendar"])
    og.validate_scopes([
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.send",
    ])
    og.validate_scopes(["https://www.googleapis.com/auth/spreadsheets"])
    og.validate_scopes(["https://www.googleapis.com/auth/drive.file"])
    og.validate_scopes(["https://www.googleapis.com/auth/youtube.readonly"])


# =========================================================================
# 2. Scope-Specific Authorization URL Generation
# =========================================================================

def test_calendar_auth_url_has_only_calendar_scope(client):
    """Calendar authorization request contains ONLY calendar scope."""
    _grant(client, "google_calendar")
    client.post(
        "/api/connectors/google_calendar/credentials",
        json={"fields": {"client_id": "cal-cid.apps.googleusercontent.com", "client_secret": "cal-sec"}},
    )

    r = client.get("/api/connectors/google_calendar/oauth/start")
    assert r.status_code == 200
    data = r.json()
    url = data["url"]

    params = _extract_query_params(url)
    scopes = params.get("scope", [""])[0].split()

    assert "https://www.googleapis.com/auth/calendar" in scopes
    assert not any("gmail" in s for s in scopes)
    assert not any("drive" in s for s in scopes)
    assert not any("spreadsheets" in s for s in scopes)
    assert not any("youtube" in s for s in scopes)
    assert params.get("include_granted_scopes") == ["false"]


def test_gmail_auth_url_has_only_gmail_scopes(client):
    """Gmail authorization request contains ONLY gmail scopes."""
    _grant(client, "gmail")
    client.post(
        "/api/connectors/gmail/credentials",
        json={"fields": {"client_id": "gmail-cid.apps.googleusercontent.com", "client_secret": "gmail-sec"}},
    )

    r = client.get("/api/connectors/gmail/oauth/start")
    assert r.status_code == 200
    data = r.json()
    url = data["url"]

    params = _extract_query_params(url)
    scopes = params.get("scope", [""])[0].split()

    assert "https://www.googleapis.com/auth/gmail.readonly" in scopes
    assert "https://www.googleapis.com/auth/gmail.send" in scopes
    assert not any("calendar" in s for s in scopes)
    assert not any("drive" in s for s in scopes)
    assert not any("spreadsheets" in s for s in scopes)
    assert not any("youtube" in s for s in scopes)
    assert params.get("include_granted_scopes") == ["false"]


def test_drive_auth_url_has_no_youtube_scope(client):
    """Drive authorization request contains drive.file and NEVER youtube."""
    _grant(client, "google_drive")
    client.post(
        "/api/connectors/google_drive/credentials",
        json={"fields": {"client_id": "drive-cid.apps.googleusercontent.com", "client_secret": "drive-sec"}},
    )

    r = client.get("/api/connectors/google_drive/oauth/start")
    assert r.status_code == 200
    params = _extract_query_params(r.json()["url"])
    scopes = params.get("scope", [""])[0].split()

    assert "https://www.googleapis.com/auth/drive.file" in scopes
    assert not any("youtube" in s for s in scopes)
    assert params.get("include_granted_scopes") == ["false"]


def test_youtube_auth_url_has_no_drive_scope(client):
    """YouTube authorization request contains youtube.readonly and NEVER drive."""
    _grant(client, "youtube")
    client.post(
        "/api/connectors/youtube/credentials",
        json={"fields": {"client_id": "yt-cid.apps.googleusercontent.com", "client_secret": "yt-sec"}},
    )

    r = client.get("/api/connectors/youtube/oauth/start")
    assert r.status_code == 200
    params = _extract_query_params(r.json()["url"])
    scopes = params.get("scope", [""])[0].split()

    assert "https://www.googleapis.com/auth/youtube.readonly" in scopes
    assert not any("drive" in s for s in scopes)
    assert params.get("include_granted_scopes") == ["false"]


def test_incompatible_scope_combination_rejected_with_400(client):
    """Attempting an authorization flow combining Drive and YouTube triggers HTTP 400."""
    _grant(client, "google_drive")
    client.post(
        "/api/connectors/google_drive/credentials",
        json={"fields": {"client_id": "cid.apps.googleusercontent.com", "client_secret": "sec"}},
    )

    incompatible = "https://www.googleapis.com/auth/drive.file,https://www.googleapis.com/auth/youtube.readonly"
    r = client.get(f"/api/connectors/google_drive/oauth/start?scopes={incompatible}")
    assert r.status_code == 400
    assert "Incompatible Google OAuth scopes detected" in r.text


# =========================================================================
# 3. Independent Token Storage & No Status Bleed
# =========================================================================

def test_connecting_calendar_does_not_mark_other_connectors_connected(client, monkeypatch):
    """Authorizing Calendar leaves Gmail, Sheets, Drive, and YouTube unconnected."""
    # Grant all Google connectors
    for cid in ("google_calendar", "gmail", "google_sheets", "google_drive", "youtube"):
        _grant(client, cid)

    # Save Google OAuth client credentials on Calendar
    r = client.post(
        "/api/connectors/google_calendar/credentials",
        json={"fields": {"client_id": "app-id.apps.googleusercontent.com", "client_secret": "app-sec"}},
    )
    assert r.status_code == 200

    # Start OAuth for Calendar
    start_res = client.get("/api/connectors/google_calendar/oauth/start").json()
    state = urllib.parse.parse_qs(urllib.parse.urlparse(start_res["url"]).query)["state"][0]

    # Mock token exchange and health check
    monkeypatch.setattr(
        og,
        "exchange_code",
        lambda cid, sec, uri, full_url, **kwargs: {
            "client_id": cid,
            "client_secret": sec,
            "refresh_token": "calendar-refresh-token-123",
            "access_token": "calendar-access-token-123",
            "scopes": ["https://www.googleapis.com/auth/calendar"],
        },
    )
    monkeypatch.setattr(srv, "_run_health", lambda cid: (True, "mocked healthy"))

    # Execute callback
    cb_res = client.get(f"/api/connectors/google/oauth/callback?code=fake-cal-code&state={state}")
    assert cb_res.status_code == 200
    assert "Google connected" in cb_res.text

    # Verify Calendar is CONNECTED
    cal_detail = client.get("/api/connectors/google_calendar").json()
    assert cal_detail["state"] == "connected"
    assert cal_detail["needs_oauth"] is False

    # CRITICAL: Verify Gmail, Sheets, Drive, and YouTube are NOT connected!
    gmail_detail = client.get("/api/connectors/gmail").json()
    assert gmail_detail["state"] in ("granted", "available")
    assert gmail_detail["needs_oauth"] is True

    sheets_detail = client.get("/api/connectors/google_sheets").json()
    assert sheets_detail["state"] in ("granted", "available")
    assert sheets_detail["needs_oauth"] is True

    drive_detail = client.get("/api/connectors/google_drive").json()
    assert drive_detail["state"] in ("granted", "available")
    assert drive_detail["needs_oauth"] is True

    yt_detail = client.get("/api/connectors/youtube").json()
    assert yt_detail["state"] in ("granted", "available")
    assert yt_detail["needs_oauth"] is True


def test_connecting_multiple_google_services_stores_independent_tokens(client, monkeypatch):
    """Authorizing Calendar and Gmail stores separate tokens without cross-contamination."""
    _grant(client, "google_calendar")
    _grant(client, "gmail")

    # Save client credentials
    client.post(
        "/api/connectors/google_calendar/credentials",
        json={"fields": {"client_id": "app-id.apps.googleusercontent.com", "client_secret": "app-sec"}},
    )

    # 1. Authorize Calendar
    start_cal = client.get("/api/connectors/google_calendar/oauth/start").json()
    state_cal = urllib.parse.parse_qs(urllib.parse.urlparse(start_cal["url"]).query)["state"][0]

    monkeypatch.setattr(
        og,
        "exchange_code",
        lambda cid, sec, uri, full_url, **kwargs: {
            "client_id": cid,
            "client_secret": sec,
            "refresh_token": "token-for-calendar",
            "access_token": "access-cal",
            "scopes": ["https://www.googleapis.com/auth/calendar"],
        },
    )
    monkeypatch.setattr(srv, "_run_health", lambda cid: (True, "ok"))
    client.get(f"/api/connectors/google/oauth/callback?code=calcode&state={state_cal}")

    # 2. Authorize Gmail
    start_gmail = client.get("/api/connectors/gmail/oauth/start").json()
    state_gmail = urllib.parse.parse_qs(urllib.parse.urlparse(start_gmail["url"]).query)["state"][0]

    monkeypatch.setattr(
        og,
        "exchange_code",
        lambda cid, sec, uri, full_url, **kwargs: {
            "client_id": cid,
            "client_secret": sec,
            "refresh_token": "token-for-gmail",
            "access_token": "access-gmail",
            "scopes": ["https://www.googleapis.com/auth/gmail.readonly", "https://www.googleapis.com/auth/gmail.send"],
        },
    )
    client.get(f"/api/connectors/google/oauth/callback?code=gmailcode&state={state_gmail}")

    # Both are connected
    assert client.get("/api/connectors/google_calendar").json()["state"] == "connected"
    assert client.get("/api/connectors/gmail").json()["state"] == "connected"

    # Verify underlying credentials store distinct tokens
    dash = get_dash()
    cal_creds = dash.load_credentials("google:google_calendar")
    gmail_creds = dash.load_credentials("google:gmail")

    assert cal_creds["refresh_token"] == "token-for-calendar"
    assert gmail_creds["refresh_token"] == "token-for-gmail"


def test_independent_token_revocation(client, monkeypatch):
    """Revoking Calendar deletes Calendar's token but keeps Gmail connected."""
    _grant(client, "google_calendar")
    _grant(client, "gmail")

    client.post(
        "/api/connectors/google_calendar/credentials",
        json={"fields": {"client_id": "app-id.apps.googleusercontent.com", "client_secret": "app-sec"}},
    )

    # Mock connect both
    dash = get_dash()
    dash.save_credentials(
        "google:google_calendar",
        "Google Calendar",
        {"client_id": "app-id", "client_secret": "sec", "refresh_token": "cal-token"},
    )
    dash.set_state("google_calendar", "connected", "OK")

    dash.save_credentials(
        "google:gmail",
        "Gmail",
        {"client_id": "app-id", "client_secret": "sec", "refresh_token": "gmail-token"},
    )
    dash.set_state("gmail", "connected", "OK")

    # Revoke Calendar
    r = client.post("/api/connectors/google_calendar/revoke")
    assert r.status_code == 200

    # Calendar is now available
    assert client.get("/api/connectors/google_calendar").json()["state"] == "available"
    assert not dash.load_credentials("google:google_calendar")

    # Gmail is STILL connected and has its token
    assert client.get("/api/connectors/gmail").json()["state"] == "connected"
    assert dash.load_credentials("google:gmail")["refresh_token"] == "gmail-token"
    # Shared app credentials still exist
    assert dash.load_credentials("google")["client_id"] == "app-id.apps.googleusercontent.com"

    # Revoke Gmail (the last active Google connector)
    client.post("/api/connectors/gmail/revoke")
    assert client.get("/api/connectors/gmail").json()["state"] == "available"
    # Shared credentials cleaned up
    assert not dash.load_credentials("google")


def test_credentials_redaction_in_api(client):
    """Client secrets and tokens are redacted with bullet mask in API responses."""
    _grant(client, "google_calendar")
    client.post(
        "/api/connectors/google_calendar/credentials",
        json={"fields": {"client_id": "my-id.apps.googleusercontent.com", "client_secret": "super-confidential-secret"}},
    )

    r = client.get("/api/connectors/google_calendar/credentials")
    assert r.status_code == 200
    creds = r.json()

    assert creds["fields"]["client_id"] == "my-id.apps.googleusercontent.com"
    assert creds["fields"]["client_secret"] == "••••••••"
    assert "super-confidential-secret" not in json.dumps(creds)
