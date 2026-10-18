"""Google OAuth 2.0 for the dashboard.

The user pastes a Client ID/Secret once (Desktop-app OAuth client), then
presses “Connect with Google”. We run the standard authorization-code flow
with a localhost redirect, exchange the code for tokens, and store only the
refresh token — encrypted — in the vault. All five Google connectors share
this one sign-in.
"""
from __future__ import annotations
import os

# Allow local HTTP redirect URIs (e.g. http://localhost:3000) for local desktop development
os.environ.setdefault("OAUTHLIB_INSECURE_TRANSPORT", "1")

# Canonical scopes per connector
CALENDAR_SCOPES = [
    "https://www.googleapis.com/auth/calendar",
]

GMAIL_READ_SCOPE = "https://www.googleapis.com/auth/gmail.readonly"
GMAIL_SEND_SCOPE = "https://www.googleapis.com/auth/gmail.send"
GMAIL_SCOPES = [
    GMAIL_READ_SCOPE,
    GMAIL_SEND_SCOPE,
]

SHEETS_SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
]

DRIVE_SCOPES = [
    "https://www.googleapis.com/auth/drive.file",
]

YOUTUBE_SCOPES = [
    "https://www.googleapis.com/auth/youtube.readonly",
]

CONNECTOR_SCOPES: dict[str, list[str]] = {
    "google_calendar": CALENDAR_SCOPES,
    "gmail": GMAIL_SCOPES,
    "google_sheets": SHEETS_SCOPES,
    "google_drive": DRIVE_SCOPES,
    "youtube": YOUTUBE_SCOPES,
}

SCOPE_DETAILS: dict[str, dict[str, str]] = {
    "https://www.googleapis.com/auth/calendar": {
        "service": "Google Calendar",
        "label": "Read and manage calendar events",
        "description": "View your schedule and create/reschedule events with approval.",
    },
    "https://www.googleapis.com/auth/gmail.readonly": {
        "service": "Gmail",
        "label": "Read email messages",
        "description": "Search and read messages in your inbox.",
    },
    "https://www.googleapis.com/auth/gmail.send": {
        "service": "Gmail",
        "label": "Send emails (Approval Required)",
        "description": "Send emails on your behalf; always pauses for human confirmation.",
    },
    "https://www.googleapis.com/auth/spreadsheets": {
        "service": "Google Sheets",
        "label": "Read and edit spreadsheets",
        "description": "Query tabular data and append rows with approval.",
    },
    "https://www.googleapis.com/auth/drive.file": {
        "service": "Google Drive",
        "label": "Manage OS-created files",
        "description": "Restricted access: OS only sees and modifies files it created.",
    },
    "https://www.googleapis.com/auth/youtube.readonly": {
        "service": "YouTube",
        "label": "Search videos and view channels",
        "description": "Read-only access to search videos and retrieve metadata.",
    },
}

# Incompatible scope combinations rejected by Google OAuth (e.g. Drive + YouTube in one token)
INCOMPATIBLE_SCOPE_SETS = [
    (
        {
            "https://www.googleapis.com/auth/drive.file",
            "https://www.googleapis.com/auth/drive",
            "https://www.googleapis.com/auth/drive.readonly",
        },
        {
            "https://www.googleapis.com/auth/youtube.readonly",
            "https://www.googleapis.com/auth/youtube",
            "https://www.googleapis.com/auth/youtube.upload",
            "https://www.googleapis.com/auth/youtube.force-ssl",
        },
    ),
]


def validate_scopes(scopes: list[str] | set[str]) -> None:
    """Validate that requested scopes do not contain incompatible combinations."""
    scope_set = set(scopes)
    for set_a, set_b in INCOMPATIBLE_SCOPE_SETS:
        has_a = bool(scope_set & set_a)
        has_b = bool(scope_set & set_b)
        if has_a and has_b:
            raise ValueError(
                "Incompatible Google OAuth scopes detected: Google Drive and YouTube "
                "scopes cannot be requested in the same authorization flow. "
                "Authorize Drive and YouTube separately to prevent Error 400: invalid_request."
            )


def get_scopes_for_connector(cid: str) -> list[str]:
    """Return the scoped Google permissions strictly for connector cid."""
    if cid in CONNECTOR_SCOPES:
        return list(CONNECTOR_SCOPES[cid])
    return []


def build_flow(
    client_id: str,
    client_secret: str,
    redirect_uri: str,
    scopes: list[str] | None = None,
    cid: str | None = None,
):
    try:
        from google_auth_oauthlib.flow import Flow
    except ImportError as e:
        raise RuntimeError(
            "google-auth-oauthlib isn't installed (pip install google-auth-oauthlib)."
        ) from e

    cid_clean = client_id.strip() if client_id else ""
    sec_clean = client_secret.strip() if client_secret else ""
    client_config = {
        "client_id": cid_clean,
        "client_secret": sec_clean,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "redirect_uris": [redirect_uri],
    }

    if scopes is not None:
        target_scopes = list(scopes)
    elif cid is not None:
        target_scopes = get_scopes_for_connector(cid)
    else:
        target_scopes = []

    validate_scopes(target_scopes)

    # Google OAuth client configs can be declared under 'web' or 'installed'
    try:
        return Flow.from_client_config(
            {"web": client_config},
            scopes=target_scopes,
            redirect_uri=redirect_uri,
        )
    except Exception:
        return Flow.from_client_config(
            {"installed": client_config},
            scopes=target_scopes,
            redirect_uri=redirect_uri,
        )


def authorization_url(
    client_id: str,
    client_secret: str,
    redirect_uri: str,
    state: str = "google",
    cid: str | None = None,
    scopes: list[str] | None = None,
    include_granted_scopes: bool = False,
) -> tuple[str, str]:
    flow = build_flow(client_id, client_secret, redirect_uri, scopes=scopes, cid=cid)
    # Using include_granted_scopes="false" prevents Google from re-merging
    # previously granted scopes across disparate services (such as Drive + YouTube),
    # which causes Error 400: invalid_request.
    include_val = "true" if include_granted_scopes else "false"
    url, returned_state = flow.authorization_url(
        access_type="offline",
        prompt="consent",
        state=state,
        include_granted_scopes=include_val,
    )
    return url, returned_state


def exchange_code(
    client_id: str,
    client_secret: str,
    redirect_uri: str,
    full_url: str,
    scopes: list[str] | None = None,
    cid: str | None = None,
    **kwargs,
) -> dict:
    flow = build_flow(client_id, client_secret, redirect_uri, scopes=scopes, cid=cid)
    flow.fetch_token(authorization_response=full_url)
    creds = flow.credentials
    if not creds.refresh_token:
        raise RuntimeError(
            "Google didn't return a refresh token. Try again — if it keeps "
            "happening, revoke OS at myaccount.google.com/permissions and retry."
        )
    granted = (
        list(creds.scopes)
        if getattr(creds, "scopes", None)
        else (scopes or (get_scopes_for_connector(cid) if cid else []))
    )
    expiry = creds.expiry.isoformat() if getattr(creds, "expiry", None) else None
    return {
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": creds.refresh_token,
        "access_token": getattr(creds, "token", None),
        "scopes": granted,
        "expiry": expiry,
    }


SUCCESS_HTML = """<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Connected — OS</title>
<style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;
justify-content:center;height:100vh;margin:0;background:#0f1115;color:#e8eaf0}
.card{text-align:center;padding:40px}.big{font-size:56px}</style></head>
<body><div class="card"><div class="big">✅</div>
<h2>Google connected</h2><p>You can close this tab and go back to OS.</p>
<script>
try { window.opener && window.opener.postMessage({type:"oauth-done", connector:"Google"}, "*"); } catch(e) {}
setTimeout(()=>window.close(), 1500)
</script></div></body></html>"""
