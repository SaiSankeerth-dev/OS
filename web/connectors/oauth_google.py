"""Google OAuth 2.0 for the dashboard.

The user pastes a Client ID/Secret once (Desktop-app OAuth client), then
presses “Connect with Google”. We run the standard authorization-code flow
with a localhost redirect, exchange the code for tokens, and store only the
refresh token — encrypted — in the vault. All five Google connectors share
this one sign-in.
"""
from __future__ import annotations

GOOGLE_SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/youtube.readonly",
]


def build_flow(client_id: str, client_secret: str, redirect_uri: str):
    try:
        from google_auth_oauthlib.flow import Flow
    except ImportError as e:
        raise RuntimeError(
            "google-auth-oauthlib isn't installed (pip install google-auth-oauthlib)."
        ) from e
    return Flow.from_client_config(
        {
            "web": {
                "client_id": client_id,
                "client_secret": client_secret,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=GOOGLE_SCOPES,
        redirect_uri=redirect_uri,
    )


def authorization_url(client_id: str, client_secret: str, redirect_uri: str,
                      state: str = "google") -> tuple[str, str]:
    flow = build_flow(client_id, client_secret, redirect_uri)
    url, returned_state = flow.authorization_url(
        access_type="offline", prompt="consent", state=state,
        include_granted_scopes="true")
    return url, returned_state


def exchange_code(client_id: str, client_secret: str, redirect_uri: str,
                  full_url: str) -> dict:
    flow = build_flow(client_id, client_secret, redirect_uri)
    flow.fetch_token(authorization_response=full_url)
    creds = flow.credentials
    if not creds.refresh_token:
        raise RuntimeError(
            "Google didn't return a refresh token. Try again — if it keeps "
            "happening, revoke OS at myaccount.google.com/permissions and retry.")
    return {
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": creds.refresh_token,
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
