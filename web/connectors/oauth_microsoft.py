"""Microsoft OAuth 2.0 for the dashboard (Microsoft Graph).

Mirrors web/connectors/oauth_google.py: the user pastes a Client ID/Secret
once (Azure app registration), then presses "Sign in with Microsoft".
We run the standard authorization-code flow, exchange the code for tokens,
and store only the refresh token — encrypted — in the vault. All Microsoft
connectors share this one sign-in.
"""
from __future__ import annotations

from urllib.parse import urlencode

AUTHORITY = "https://login.microsoftonline.com/common"
AUTHORIZE_URL = AUTHORITY + "/oauth2/v2.0/authorize"
TOKEN_URL = AUTHORITY + "/oauth2/v2.0/token"

MICROSOFT_SCOPES = [
    "User.Read",
    "Mail.Read",
    "Mail.Send",
    "Calendars.ReadWrite",
    "offline_access",
]

GRAPH_BASE = "https://graph.microsoft.com/v1.0"


def authorization_url(client_id: str, client_secret: str, redirect_uri: str,
                      state: str = "microsoft") -> tuple[str, str]:
    params = {
        "client_id": client_id,
        "response_type": "code",
        "redirect_uri": redirect_uri,
        "scope": " ".join(MICROSOFT_SCOPES),
        "state": state,
        "prompt": "consent",
    }
    return AUTHORIZE_URL + "?" + urlencode(params), state


def exchange_code(client_id: str, client_secret: str, redirect_uri: str,
                  code: str) -> dict:
    try:
        import requests
    except ImportError as e:
        raise RuntimeError(
            "requests isn't installed (pip install requests)."
        ) from e
    resp = requests.post(
        TOKEN_URL,
        data={
            "client_id": client_id,
            "client_secret": client_secret,
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": redirect_uri,
            "scope": " ".join(MICROSOFT_SCOPES),
        },
        timeout=30,
    )
    try:
        data = resp.json()
    except Exception:
        raise RuntimeError(f"Microsoft token endpoint returned HTTP {resp.status_code}.")
    if resp.status_code != 200:
        err = data.get("error_description") or data.get("error") or f"HTTP {resp.status_code}"
        raise RuntimeError(f"Microsoft said no: {err}")
    if not data.get("refresh_token"):
        raise RuntimeError(
            "Microsoft didn't return a refresh token. Make sure 'offline_access' "
            "is in the scope list and try again.")
    return {
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": data["refresh_token"],
    }


def refresh_access_token(client_id: str, client_secret: str,
                         refresh_token: str) -> str:
    """Exchange a refresh token for a fresh access token."""
    try:
        import requests
    except ImportError as e:
        raise RuntimeError("requests isn't installed.") from e
    resp = requests.post(
        TOKEN_URL,
        data={
            "client_id": client_id,
            "client_secret": client_secret,
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "scope": " ".join(MICROSOFT_SCOPES),
        },
        timeout=30,
    )
    data = resp.json()
    if resp.status_code != 200 or not data.get("access_token"):
        err = data.get("error_description") or data.get("error") or f"HTTP {resp.status_code}"
        raise RuntimeError(f"Microsoft refresh failed: {err}")
    return data["access_token"]


SUCCESS_HTML = """<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Connected — OS</title>
<style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;
justify-content:center;height:100vh;margin:0;background:#0f1115;color:#e8eaf0}
.card{text-align:center;padding:40px}.big{font-size:56px}</style></head>
<body><div class="card"><div class="big">✅</div>
<h2>Microsoft connected</h2><p>You can close this tab and go back to OS.</p>
<script>
try { window.opener && window.opener.postMessage({type:"oauth-done", connector:"Microsoft"}, "*"); } catch(e) {}
setTimeout(()=>window.close(), 1500)
</script></div></body></html>"""
