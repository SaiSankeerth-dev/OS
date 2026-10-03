"""Real service adapters — every connector's live API calls.

Each adapter talks to the actual service over HTTPS. Health checks make a
real read call so "connected" always means "verified working".
"""
from __future__ import annotations

import base64
import io
from email.mime.text import MIMEText
from typing import Any

import httpx

from .base import Adapter, AdapterError
from .manifests import get_manifest

_TIMEOUT = 25
# Health checks block the UI (grant / save-credentials responses), so they
# get a shorter budget than real actions like file uploads.
_HEALTH_TIMEOUT = 10


def _req(method: str, url: str, *, headers=None, json=None, params=None,
         data=None, content=None, timeout: float | None = None) -> httpx.Response:
    try:
        return httpx.request(
            method, url, headers=headers, json=json, params=params,
            data=data, content=content, timeout=timeout or _TIMEOUT,
        )
    except AdapterError:
        raise
    except Exception as e:
        # httpx.InvalidURL, proxy misconfiguration, SSL errors, etc. are NOT
        # httpx.HTTPError subclasses — never let them escape raw.
        raise AdapterError(f"Couldn't reach the service: {e}") from e


def _ok(r: httpx.Response, what: str = "Request") -> Any:
    if r.status_code in (200, 201, 202, 204):
        if not r.content:
            return {}
        try:
            return r.json()
        except Exception:
            return {"raw": r.text[:500]}
    try:
        detail = r.json()
        err = detail.get("error") if isinstance(detail, dict) else None
        msg = (err.get("message") if isinstance(err, dict) else None) or detail.get("message") or str(detail)[:200]
    except Exception:
        msg = r.text[:200]
    raise AdapterError(f"{what} failed ({r.status_code}): {msg}")


# --------------------------------------------------------------------------
# Google helpers (lazy imports — google libs only needed when used)
# --------------------------------------------------------------------------

def _google_creds(creds: dict, scopes: list[str]):
    try:
        from google.oauth2.credentials import Credentials
        from google.auth.transport.requests import Request
    except ImportError as e:
        raise AdapterError(
            "Google libraries aren't installed here (pip install google-api-python-client google-auth-oauthlib)."
        ) from e
    refresh = creds.get("refresh_token")
    if not refresh:
        raise AdapterError("Google isn't signed in yet — press “Connect with Google”.")
    c = Credentials(
        token=None,
        refresh_token=refresh,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=creds.get("client_id", ""),
        client_secret=creds.get("client_secret", ""),
        scopes=scopes,
    )
    try:
        c.refresh(Request())
    except Exception as e:
        raise AdapterError(f"Google sign-in expired or was revoked ({e}). Reconnect it.") from e
    return c


def _google_service(creds: dict, api: str, version: str, scopes: list[str]):
    try:
        from googleapiclient.discovery import build
        from googleapiclient.errors import HttpError
    except ImportError as e:
        raise AdapterError(
            "Google libraries aren't installed here (pip install google-api-python-client)."
        ) from e
    try:
        return build(api, version, credentials=_google_creds(creds, scopes),
                     cache_discovery=False)
    except HttpError as e:
        raise AdapterError(f"Google API error: {e}") from e


def _google_call(fn, what: str):
    try:
        from googleapiclient.errors import HttpError
    except ImportError:
        HttpError = Exception  # type: ignore
    try:
        return fn()
    except AdapterError:
        raise
    except HttpError as e:
        raise AdapterError(f"{what}: {e}") from e
    except Exception as e:
        raise AdapterError(f"{what}: {e}") from e


CAL_SCOPES = ["https://www.googleapis.com/auth/calendar"]
GMAIL_SCOPES = ["https://www.googleapis.com/auth/gmail.send",
                "https://www.googleapis.com/auth/gmail.readonly"]
SHEETS_SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
DRIVE_SCOPES = ["https://www.googleapis.com/auth/drive.file"]
YT_SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"]


class GoogleCalendarAdapter(Adapter):
    def health_check(self, creds):
        svc = _google_service(creds, "calendar", "v3", CAL_SCOPES)
        _google_call(lambda: svc.calendarList().list(maxResults=1).execute(), "Calendar check")
        return True, "Calendar is reachable"

    def run_action(self, action, params, creds):
        svc = _google_service(creds, "calendar", "v3", CAL_SCOPES)
        if action == "list_events":
            day = params.get("date") or "today"
            start, end = _day_bounds(day)
            items = _google_call(
                lambda: svc.events().list(
                    calendarId="primary", timeMin=start, timeMax=end,
                    singleEvents=True, orderBy="startTime", maxResults=25).execute(),
                "Listing events").get("items", [])
            return {"ok": True, "events": [
                {"id": e.get("id"), "title": e.get("summary", "(no title)"),
                 "start": (e.get("start") or {}).get("dateTime", (e.get("start") or {}).get("date")),
                 "end": (e.get("end") or {}).get("dateTime", (e.get("end") or {}).get("date"))}
                for e in items]}
        if action == "create_event":
            body = {"summary": params["title"],
                    "start": {"dateTime": params["start"]},
                    "end": {"dateTime": params.get("end") or params["start"]},
                    "description": params.get("description", "")}
            e = _google_call(
                lambda: svc.events().insert(calendarId="primary", body=body).execute(),
                "Creating event")
            return {"ok": True, "id": e.get("id"), "title": e.get("summary"),
                    "start": params["start"], "link": e.get("htmlLink")}
        if action == "delete_event":
            _google_call(
                lambda: svc.events().delete(calendarId="primary",
                                            eventId=params["event_id"]).execute(),
                "Deleting event")
            return {"ok": True, "deleted": params["event_id"]}
        raise AdapterError(f"Unknown action {action}")


class GmailAdapter(Adapter):
    def health_check(self, creds):
        svc = _google_service(creds, "gmail", "v1", GMAIL_SCOPES)
        prof = _google_call(lambda: svc.users().getProfile(userId="me").execute(), "Gmail check")
        return True, f"Gmail is reachable ({prof.get('emailAddress', '')})"

    def run_action(self, action, params, creds):
        svc = _google_service(creds, "gmail", "v1", GMAIL_SCOPES)
        if action == "search_emails":
            n = int(params.get("max_results") or 5)
            res = _google_call(
                lambda: svc.users().messages().list(
                    userId="me", q=params["query"], maxResults=max(1, min(n, 20))).execute(),
                "Searching mail")
            out = []
            for m in res.get("messages", []):
                full = _google_call(
                    lambda: svc.users().messages().get(
                        userId="me", id=m["id"], format="metadata",
                        metadataHeaders=["Subject", "From", "Date"]).execute(),
                    "Reading message")
                heads = {h["name"]: h["value"] for h in
                         full.get("payload", {}).get("headers", [])}
                out.append({"id": m["id"], "subject": heads.get("Subject", ""),
                            "from": heads.get("From", ""), "date": heads.get("Date", "")})
            return {"ok": True, "emails": out}
        if action == "send_email":
            mime = MIMEText(params["body"])
            mime["to"] = params["to"]
            mime["subject"] = params["subject"]
            raw = base64.urlsafe_b64encode(mime.as_bytes()).decode()
            sent = _google_call(
                lambda: svc.users().messages().send(
                    userId="me", body={"raw": raw}).execute(), "Sending email")
            return {"ok": True, "id": sent.get("id"), "to": params["to"]}
        raise AdapterError(f"Unknown action {action}")


class GoogleSheetsAdapter(Adapter):
    def health_check(self, creds):
        _google_creds(creds, SHEETS_SCOPES)  # token refresh is the live check
        return True, "Google sign-in is valid"

    def run_action(self, action, params, creds):
        svc = _google_service(creds, "sheets", "v4", SHEETS_SCOPES)
        sid = params["spreadsheet_id"]
        if action == "read_range":
            res = _google_call(
                lambda: svc.spreadsheets().values().get(
                    spreadsheetId=sid, range=params["range"]).execute(),
                "Reading sheet")
            return {"ok": True, "values": res.get("values", [])}
        if action == "append_row":
            values = params["values"]
            if isinstance(values, str):
                values = [v.strip() for v in values.split(",")]
            res = _google_call(
                lambda: svc.spreadsheets().values().append(
                    spreadsheetId=sid, range=params.get("range") or "Sheet1!A:A",
                    valueInputOption="USER_ENTERED",
                    body={"values": [values]}).execute(),
                "Appending row")
            return {"ok": True, "updated": res.get("updates", {}).get("updatedCells")}
        raise AdapterError(f"Unknown action {action}")


class GoogleDriveAdapter(Adapter):
    def health_check(self, creds):
        svc = _google_service(creds, "drive", "v3", DRIVE_SCOPES)
        _google_call(lambda: svc.files().list(pageSize=1,
                                              fields="files(id)").execute(), "Drive check")
        return True, "Drive is reachable"

    def run_action(self, action, params, creds):
        from googleapiclient.http import MediaIoBaseUpload
        svc = _google_service(creds, "drive", "v3", DRIVE_SCOPES)
        if action == "list_files":
            res = _google_call(
                lambda: svc.files().list(
                    pageSize=25, q=params.get("query") or None,
                    fields="files(id,name,mimeType,modifiedTime)").execute(),
                "Listing files")
            return {"ok": True, "files": res.get("files", [])}
        if action == "upload_text":
            media = MediaIoBaseUpload(io.BytesIO(params["content"].encode()),
                                      mimetype="text/plain")
            f = _google_call(
                lambda: svc.files().create(
                    body={"name": params["name"]}, media_body=media,
                    fields="id,name,webViewLink").execute(),
                "Uploading file")
            return {"ok": True, "id": f.get("id"), "name": f.get("name"),
                    "link": f.get("webViewLink")}
        raise AdapterError(f"Unknown action {action}")


class YouTubeAdapter(Adapter):
    def health_check(self, creds):
        svc = _google_service(creds, "youtube", "v3", YT_SCOPES)
        _google_call(lambda: svc.channels().list(mine=True, part="id",
                                                 maxResults=1).execute(), "YouTube check")
        return True, "YouTube is reachable"

    def run_action(self, action, params, creds):
        if action != "search":
            raise AdapterError(f"Unknown action {action}")
        svc = _google_service(creds, "youtube", "v3", YT_SCOPES)
        n = int(params.get("max_results") or 5)
        res = _google_call(
            lambda: svc.search().list(q=params["query"], type="video",
                                      part="snippet",
                                      maxResults=max(1, min(n, 20))).execute(),
            "Searching YouTube")
        return {"ok": True, "videos": [
            {"title": it["snippet"]["title"], "channel": it["snippet"]["channelTitle"],
             "video_id": it["id"]["videoId"],
             "url": f"https://youtu.be/{it['id']['videoId']}"}
            for it in res.get("items", [])]}


# --------------------------------------------------------------------------
# Token-based services (httpx)
# --------------------------------------------------------------------------

class GitHubAdapter(Adapter):
    _API = "https://api.github.com"

    def _h(self, creds):
        self._require(creds, "token")
        return {"Authorization": f"Bearer {creds['token']}",
                "Accept": "application/vnd.github+json"}

    def health_check(self, creds):
        me = _ok(_req("GET", f"{self._API}/user", headers=self._h(creds), timeout=_HEALTH_TIMEOUT), "GitHub login")
        return True, f"GitHub is reachable (@{me.get('login', '')})"

    def run_action(self, action, params, creds):
        h = self._h(creds)
        if action == "list_repos":
            repos = _ok(_req("GET", f"{self._API}/user/repos",
                             headers=h, params={"per_page": 100,
                                                "sort": "updated"}), "Listing repos")
            return {"ok": True, "repos": [
                {"full_name": r["full_name"], "description": r.get("description"),
                 "url": r["html_url"]} for r in repos]}
        if action == "create_issue":
            issue = _ok(_req(
                "POST", f"{self._API}/repos/{params['owner']}/{params['repo']}/issues",
                headers=h,
                json={"title": params["title"], "body": params.get("body", "")}),
                "Creating issue")
            return {"ok": True, "number": issue.get("number"),
                    "url": issue.get("html_url"), "title": issue.get("title")}
        raise AdapterError(f"Unknown action {action}")


class NotionAdapter(Adapter):
    _API = "https://api.notion.com/v1"

    def _h(self, creds):
        self._require(creds, "token")
        return {"Authorization": f"Bearer {creds['token']}",
                "Notion-Version": "2022-06-28",
                "Content-Type": "application/json"}

    def health_check(self, creds):
        me = _ok(_req("GET", f"{self._API}/users/me", headers=self._h(creds), timeout=_HEALTH_TIMEOUT),
                 "Notion check")
        return True, f"Notion is reachable ({me.get('name', 'integration')})"

    def run_action(self, action, params, creds):
        h = self._h(creds)
        if action == "search":
            res = _ok(_req("POST", f"{self._API}/search", headers=h,
                           json={"query": params.get("query", ""),
                                 "page_size": 10}), "Searching Notion")
            return {"ok": True, "pages": [
                {"id": p["id"],
                 "title": "".join(t["plain_text"] for t in
                                  p.get("properties", {}).get("title", {}).get("title", []))
                 or p.get("id")[:8]}
                for p in res.get("results", [])]}
        if action == "create_page":
            children = []
            if params.get("content"):
                children = [{"object": "block", "type": "paragraph",
                             "paragraph": {"rich_text": [
                                 {"type": "text",
                                  "text": {"content": params["content"][:2000]}}]}}]
            page = _ok(_req("POST", f"{self._API}/pages", headers=h, json={
                "parent": {"page_id": params["parent_id"]},
                "properties": {"title": [{"text": {"content": params["title"]}}]},
                "children": children}), "Creating page")
            return {"ok": True, "id": page.get("id"), "url": page.get("url")}
        raise AdapterError(f"Unknown action {action}")


class TelegramAdapter(Adapter):
    def _base(self, creds):
        self._require(creds, "bot_token")
        return f"https://api.telegram.org/bot{creds['bot_token']}"

    def health_check(self, creds):
        me = _ok(_req("GET", f"{self._base(creds)}/getMe", timeout=_HEALTH_TIMEOUT), "Telegram check")
        if not me.get("ok"):
            raise AdapterError(f"Telegram rejected the token: {me.get('description')}")
        username = (me.get("result") or {}).get("username", "")
        return True, f"Bot is live (@{username})"

    def run_action(self, action, params, creds):
        if action != "send_message":
            raise AdapterError(f"Unknown action {action}")
        chat_id = params.get("chat_id") or creds.get("chat_id")
        if not chat_id:
            raise AdapterError("No chat ID — add your Chat ID in the connector settings.")
        res = _ok(_req("POST", f"{self._base(creds)}/sendMessage",
                       json={"chat_id": chat_id, "text": params["text"]}),
                  "Sending Telegram message")
        if not res.get("ok"):
            raise AdapterError(f"Telegram said: {res.get('description')}")
        return {"ok": True, "message_id": res["result"]["message_id"]}


class SlackAdapter(Adapter):
    _API = "https://slack.com/api"

    def _h(self, creds):
        self._require(creds, "bot_token")
        return {"Authorization": f"Bearer {creds['bot_token']}",
                "Content-Type": "application/json"}

    def health_check(self, creds):
        res = _ok(_req("POST", f"{self._API}/auth.test", headers=self._h(creds), timeout=_HEALTH_TIMEOUT),
                  "Slack check")
        if not res.get("ok"):
            raise AdapterError(f"Slack said: {res.get('error')}")
        return True, f"Slack is reachable ({res.get('team', '')})"

    def run_action(self, action, params, creds):
        if action != "send_message":
            raise AdapterError(f"Unknown action {action}")
        res = _ok(_req("POST", f"{self._API}/chat.postMessage",
                       headers=self._h(creds),
                       json={"channel": params["channel"], "text": params["text"]}),
                  "Posting to Slack")
        if not res.get("ok"):
            raise AdapterError(f"Slack said: {res.get('error')} "
                               "(is the bot invited to the channel?)")
        return {"ok": True, "channel": res.get("channel"), "ts": res.get("ts")}


class DiscordAdapter(Adapter):
    def _url(self, creds):
        self._require(creds, "webhook_url")
        url = creds["webhook_url"].strip()
        if not url.startswith("https://discord.com/api/webhooks/"):
            raise AdapterError("That doesn't look like a Discord webhook URL.")
        return url

    def health_check(self, creds):
        info = _ok(_req("GET", self._url(creds), timeout=_HEALTH_TIMEOUT), "Discord webhook check")
        return True, f"Webhook is live (#{info.get('channel_id', '?')})"

    def run_action(self, action, params, creds):
        if action != "send_message":
            raise AdapterError(f"Unknown action {action}")
        _ok(_req("POST", self._url(creds),
                 json={"content": params["text"][:2000]}), "Posting to Discord")
        return {"ok": True}


class SpotifyAdapter(Adapter):
    _API = "https://api.spotify.com/v1"

    def _h(self, creds):
        self._require(creds, "token")
        return {"Authorization": f"Bearer {creds['token']}"}

    def health_check(self, creds):
        me = _ok(_req("GET", f"{self._API}/me", headers=self._h(creds), timeout=_HEALTH_TIMEOUT),
                 "Spotify check")
        return True, f"Spotify is reachable ({me.get('display_name', '')})"

    def run_action(self, action, params, creds):
        h = self._h(creds)
        if action == "now_playing":
            r = _req("GET", f"{self._API}/me/player/currently-playing", headers=h)
            if r.status_code == 204 or not r.content:
                return {"ok": True, "playing": False}
            data = _ok(r, "Now playing")
            item = data.get("item") or {}
            return {"ok": True, "playing": bool(data.get("is_playing")),
                    "track": item.get("name"),
                    "artists": ", ".join(a["name"] for a in item.get("artists", []))}
        if action == "search":
            res = _ok(_req("GET", f"{self._API}/search", headers=h,
                           params={"q": params["query"], "type": "track",
                                   "limit": 5}), "Spotify search")
            return {"ok": True, "tracks": [
                {"name": t["name"],
                 "artists": ", ".join(a["name"] for a in t["artists"]),
                 "url": t["external_urls"]["spotify"]}
                for t in res.get("tracks", {}).get("items", [])]}
        raise AdapterError(f"Unknown action {action}")


class WhatsAppAdapter(Adapter):
    _API = "https://graph.facebook.com/v21.0"

    def health_check(self, creds):
        self._require(creds, "token", "phone_number_id")
        info = _ok(_req(
            "GET", f"{self._API}/{creds['phone_number_id']}",
            params={"fields": "display_phone_number,verified_name",
                    "access_token": creds["token"]}, timeout=_HEALTH_TIMEOUT), "WhatsApp check")
        return True, f"WhatsApp number {info.get('display_phone_number', '')} is live"

    def run_action(self, action, params, creds):
        if action != "send_message":
            raise AdapterError(f"Unknown action {action}")
        self._require(creds, "token", "phone_number_id")
        res = _ok(_req(
            "POST", f"{self._API}/{creds['phone_number_id']}/messages",
            headers={"Authorization": f"Bearer {creds['token']}",
                     "Content-Type": "application/json"},
            json={"messaging_product": "whatsapp", "to": params["to"],
                  "type": "text", "text": {"body": params["text"]}}),
            "Sending WhatsApp message")
        msgs = res.get("messages", [])
        return {"ok": True, "message_id": msgs[0].get("id") if msgs else None}


class LinkedInAdapter(Adapter):
    _API = "https://api.linkedin.com/v2"

    def _h(self, creds):
        self._require(creds, "token")
        return {"Authorization": f"Bearer {creds['token']}",
                "X-Restli-Protocol-Version": "2.0.0",
                "Content-Type": "application/json"}

    def _person_id(self, creds, timeout: float | None = None):
        me = _ok(_req("GET", f"{self._API}/userinfo", headers=self._h(creds),
                      timeout=timeout),
                 "LinkedIn check")
        return me.get("sub")

    def health_check(self, creds):
        pid = self._person_id(creds, timeout=_HEALTH_TIMEOUT)
        if not pid:
            raise AdapterError("LinkedIn didn't return a profile — check the token scope.")
        return True, "LinkedIn is reachable"

    def run_action(self, action, params, creds):
        if action != "post":
            raise AdapterError(f"Unknown action {action}")
        pid = self._person_id(creds)
        res = _ok(_req(
            "POST", f"{self._API}/ugcPosts", headers=self._h(creds), json={
                "author": f"urn:li:person:{pid}",
                "lifecycleState": "PUBLISHED",
                "specificContent": {"com.linkedin.ugc.ShareContent": {
                    "shareCommentary": {"text": params["text"]},
                    "shareMediaCategory": "NONE"}},
                "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"}}),
            "Posting to LinkedIn")
        return {"ok": True, "id": res.get("id")}


def _oauth1_header(method: str, url: str, params: dict, creds: dict) -> str:
    """Minimal OAuth 1.0a HMAC-SHA1 header (for X)."""
    import hashlib
    import hmac
    import time
    import urllib.parse
    import uuid

    oauth = {
        "oauth_consumer_key": creds["api_key"],
        "oauth_nonce": uuid.uuid4().hex,
        "oauth_signature_method": "HMAC-SHA1",
        "oauth_timestamp": str(int(time.time())),
        "oauth_token": creds["access_token"],
        "oauth_version": "1.0",
    }
    all_params = {**params, **oauth}
    base = "&".join(
        f"{urllib.parse.quote(k, safe='')}={urllib.parse.quote(str(v), safe='')}"
        for k, v in sorted(all_params.items()))
    sig_base = "&".join(urllib.parse.quote(p, safe="") for p in (method.upper(), url, base))
    signing_key = "&".join(urllib.parse.quote(creds[k], safe="")
                           for k in ("api_secret", "access_secret"))
    sig = base64.b64encode(hmac.new(signing_key.encode(), sig_base.encode(),
                                    hashlib.sha1).digest()).decode()
    oauth["oauth_signature"] = sig
    return "OAuth " + ", ".join(
        f'{urllib.parse.quote(k, safe="")}="{urllib.parse.quote(v, safe="")}"'
        for k, v in sorted(oauth.items()))


class XAdapter(Adapter):
    _API = "https://api.x.com/2"

    def _check(self, creds):
        self._require(creds, "api_key", "api_secret", "access_token", "access_secret")

    def health_check(self, creds):
        self._check(creds)
        url = f"{self._API}/users/me"
        auth = _oauth1_header("GET", url, {}, creds)
        me = _ok(_req("GET", url, headers={"Authorization": auth}, timeout=_HEALTH_TIMEOUT), "X check")
        return True, f"X is reachable (@{me.get('data', {}).get('username', '')})"

    def run_action(self, action, params, creds):
        if action != "post":
            raise AdapterError(f"Unknown action {action}")
        self._check(creds)
        url = f"{self._API}/tweets"
        auth = _oauth1_header("POST", url, {}, creds)
        res = _ok(_req("POST", url, headers={"Authorization": auth,
                                             "Content-Type": "application/json"},
                       json={"text": params["text"]}), "Posting to X")
        return {"ok": True, "id": (res.get("data") or {}).get("id")}


class InstagramAdapter(Adapter):
    _API = "https://graph.instagram.com/v21.0"

    def _uid(self, creds, timeout: float | None = None):
        self._require(creds, "access_token")
        me = _ok(_req("GET", f"{self._API}/me",
                      params={"fields": "id,username",
                              "access_token": creds["access_token"]},
                      timeout=timeout),
                 "Instagram check")
        return me.get("id"), me.get("username")

    def health_check(self, creds):
        _uid, username = self._uid(creds, timeout=_HEALTH_TIMEOUT)
        return True, f"Instagram is reachable (@{username})"

    def run_action(self, action, params, creds):
        if action != "post":
            raise AdapterError(f"Unknown action {action}")
        uid, _ = self._uid(creds)
        token = creds["access_token"]
        container = _ok(_req(
            "POST", f"{self._API}/{uid}/media",
            params={"image_url": params["image_url"],
                    "caption": params.get("caption", ""),
                    "access_token": token}), "Creating media container")
        published = _ok(_req(
            "POST", f"{self._API}/{uid}/media_publish",
            params={"creation_id": container.get("id"), "access_token": token}),
            "Publishing post")
        return {"ok": True, "id": published.get("id")}


class MicrosoftOutlookAdapter(Adapter):
    _API = "https://graph.microsoft.com/v1.0"

    def _token(self, creds) -> str:
        self._require(creds, "client_id", "client_secret", "refresh_token")
        from .oauth_microsoft import refresh_access_token
        try:
            return refresh_access_token(
                creds["client_id"], creds["client_secret"], creds["refresh_token"])
        except RuntimeError as e:
            raise AdapterError(str(e)) from e

    def _h(self, creds, timeout: float | None = None):
        return {"Authorization": f"Bearer {self._token(creds)}",
                "Content-Type": "application/json"}

    def health_check(self, creds):
        me = _ok(_req("GET", f"{self._API}/me", headers=self._h(creds),
                      timeout=_HEALTH_TIMEOUT), "Microsoft profile")
        name = me.get("displayName") or me.get("userPrincipalName", "")
        return True, f"Microsoft Graph is reachable ({name})"

    def run_action(self, action, params, creds):
        h = self._h(creds)
        if action == "list_emails":
            q = params.get("query", "")
            n = max(1, min(int(params.get("max_results") or 5), 20))
            url = f"{self._API}/me/messages"
            gql: dict = {"$top": n, "$orderby": "receivedDateTime desc",
                         "$select": "id,subject,from,receivedDateTime"}
            if q:
                gql["$search"] = f'"{q}"'
            msgs = _ok(_req("GET", url, headers=h, params=gql), "Listing mail")
            return {"ok": True, "emails": [
                {"id": m.get("id"), "subject": m.get("subject", ""),
                 "from": ((m.get("from") or {}).get("emailAddress") or {}).get("address", ""),
                 "date": m.get("receivedDateTime", "")}
                for m in msgs.get("value", [])]}
        if action == "send_email":
            body = {"message": {
                "subject": params["subject"],
                "body": {"contentType": "Text", "content": params["body"]},
                "toRecipients": [{"emailAddress": {"address": params["to"]}}]}}
            sent = _ok(_req("POST", f"{self._API}/me/sendMail", headers=h,
                            json=body), "Sending mail")
            return {"ok": True, "to": params["to"]}
        if action == "list_events":
            from datetime import datetime, timedelta
            day = (params.get("date") or "today").lower()
            base = datetime.now()
            if day == "tomorrow":
                base += timedelta(days=1)
            elif day not in ("today",):
                try:
                    base = datetime.fromisoformat(day)
                except ValueError:
                    pass
            start = base.replace(hour=0, minute=0, second=0).isoformat()
            end = base.replace(hour=23, minute=59, second=59).isoformat()
            evs = _ok(_req(
                "GET", f"{self._API}/me/calendarview",
                headers=h,
                params={"startDateTime": start, "endDateTime": end,
                        "$orderby": "start/dateTime", "$top": 25}),
                "Listing events")
            return {"ok": True, "events": [
                {"id": e.get("id"), "title": e.get("subject", "(no title)"),
                 "start": ((e.get("start") or {}).get("dateTime")),
                 "end": ((e.get("end") or {}).get("dateTime"))}
                for e in evs.get("value", [])]}
        if action == "create_event":
            body = {"subject": params["title"],
                    "start": {"dateTime": params["start"], "timeZone": "Asia/Kolkata"},
                    "end": {"dateTime": params.get("end") or params["start"],
                            "timeZone": "Asia/Kolkata"},
                    "body": {"contentType": "Text",
                             "content": params.get("description", "")}}
            e = _ok(_req("POST", f"{self._API}/me/events", headers=h,
                         json=body), "Creating event")
            return {"ok": True, "id": e.get("id"), "title": e.get("subject"),
                    "start": params["start"], "link": e.get("webLink")}
        raise AdapterError(f"Unknown action {action}")


ADAPTERS: dict[str, Adapter] = {}


def _register(adapter: Adapter, manifest_id: str) -> Adapter:
    manifest = get_manifest(manifest_id)
    assert manifest is not None, manifest_id
    adapter.manifest = manifest
    ADAPTERS[manifest_id] = adapter
    return adapter


_register(GoogleCalendarAdapter(), "google_calendar")
_register(GmailAdapter(), "gmail")
_register(GoogleSheetsAdapter(), "google_sheets")
_register(GoogleDriveAdapter(), "google_drive")
_register(YouTubeAdapter(), "youtube")
_register(GitHubAdapter(), "github")
_register(NotionAdapter(), "notion")
_register(TelegramAdapter(), "telegram")
_register(SlackAdapter(), "slack")
_register(DiscordAdapter(), "discord")
_register(SpotifyAdapter(), "spotify")
_register(WhatsAppAdapter(), "whatsapp")
_register(LinkedInAdapter(), "linkedin")
_register(XAdapter(), "x")
_register(InstagramAdapter(), "instagram")
_register(MicrosoftOutlookAdapter(), "microsoft_outlook")


def get_adapter(connector_id: str) -> Adapter | None:
    return ADAPTERS.get(connector_id)


def _day_bounds(day: str) -> tuple[str, str]:
    """'today'/'tomorrow'/'YYYY-MM-DD' -> (RFC3339 start, end) in local tz."""
    from datetime import datetime, timedelta
    day = (day or "today").strip().lower()
    now = datetime.now()
    if day == "today":
        d = now.date()
    elif day == "tomorrow":
        d = (now + timedelta(days=1)).date()
    else:
        try:
            d = datetime.fromisoformat(day[:10]).date()
        except ValueError:
            d = now.date()
    start = datetime(d.year, d.month, d.day, 0, 0, 0).astimezone()
    end = datetime(d.year, d.month, d.day, 23, 59, 59).astimezone()
    return start.isoformat(), end.isoformat()
