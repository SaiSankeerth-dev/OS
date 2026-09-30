"""Connector manifests — the catalog of free services OS can drive.

Each manifest is honest about what "free" means: which need a one-time
developer setup, which are paste-a-token, and what limits exist.
"""
from __future__ import annotations

from .base import ActionParam, ActionSpec, ConnectorManifest, CredField

P = ActionParam


def _google_setup(service: str) -> list[str]:
    return [
        "Go to Google Cloud Console → create a project (free).",
        "Enable the " + service + " in API Library.",
        "Credentials → Create Credentials → OAuth client ID → Desktop app.",
        "Paste the Client ID and Client Secret below, save, then press “Connect with Google”.",
        "Sign in with your Google account and allow access — done, no token copy-paste.",
    ]


MANIFESTS: list[ConnectorManifest] = [
    ConnectorManifest(
        id="google_calendar",
        name="Google Calendar",
        tagline="See your day, create events, find what's next.",
        color="#4285F4",
        icon="📅",
        auth_kind="google_oauth",
        cred_group="google",
        cred_fields=[
            CredField("client_id", "Google OAuth Client ID", "From Google Cloud Console → Credentials", secret=False),
            CredField("client_secret", "Google OAuth Client Secret", "From the same OAuth client", secret=True),
        ],
        scopes=["Read your calendars", "Create and edit events (asks you first)"],
        setup_steps=_google_setup("Google Calendar API"),
        note="Free with any Google account. One OAuth setup covers Calendar, Gmail, Drive, Sheets and YouTube together.",
        docs_url="https://developers.google.com/calendar/api/quickstart/python",
        actions=[
            ActionSpec("list_events", "List events", "Events for a day (default: today).", False,
                       [P("date", "Day (today, tomorrow, 2026-09-28)")]),
            ActionSpec("create_event", "Create event", "Create a calendar event.", True,
                       [P("title", "Title", True), P("start", "Start (2026-09-28 16:00)", True),
                        P("end", "End (2026-09-28 17:00)"), P("description", "Description")]),
            ActionSpec("delete_event", "Delete event", "Delete an event by its ID.", True,
                       [P("event_id", "Event ID", True)]),
        ],
    ),
    ConnectorManifest(
        id="gmail",
        name="Gmail",
        tagline="Search mail, and send email — every send asks you first.",
        color="#EA4335",
        icon="✉️",
        auth_kind="google_oauth",
        cred_group="google",
        cred_fields=[
            CredField("client_id", "Google OAuth Client ID", "Same project as Calendar works", secret=False),
            CredField("client_secret", "Google OAuth Client Secret", "Kept encrypted on this machine", secret=True),
        ],
        scopes=["Read your emails", "Send email (always asks first)"],
        setup_steps=_google_setup("Gmail API"),
        note="Free with any Google account. Shares the Google sign-in with Calendar/Drive/Sheets/YouTube.",
        docs_url="https://developers.google.com/gmail/api/quickstart/python",
        actions=[
            ActionSpec("search_emails", "Search emails", "Search your inbox.", False,
                       [P("query", "Search query", True), P("max_results", "Max results")]),
            ActionSpec("send_email", "Send email", "Send an email. Always needs your approval.", True,
                       [P("to", "To", True), P("subject", "Subject", True), P("body", "Body", True)]),
        ],
    ),
    ConnectorManifest(
        id="google_sheets",
        name="Google Sheets",
        tagline="Log rows and read sheets — your free database.",
        color="#34A853",
        icon="📊",
        auth_kind="google_oauth",
        cred_group="google",
        cred_fields=[
            CredField("client_id", "Google OAuth Client ID", "Same project as Calendar works", secret=False),
            CredField("client_secret", "Google OAuth Client Secret", "Kept encrypted on this machine", secret=True),
        ],
        scopes=["Read your spreadsheets", "Add rows (asks you first)"],
        setup_steps=_google_setup("Google Sheets API"),
        note="Free with any Google account. Shares the Google sign-in.",
        docs_url="https://developers.google.com/sheets/api/quickstart/python",
        actions=[
            ActionSpec("read_range", "Read range", "Read cells from a spreadsheet.", False,
                       [P("spreadsheet_id", "Spreadsheet ID", True, "from the sheet URL"),
                        P("range", "Range", True, "Sheet1!A1:D20")]),
            ActionSpec("append_row", "Append row", "Add a row to a sheet.", True,
                       [P("spreadsheet_id", "Spreadsheet ID", True),
                        P("values", "Values (comma separated)", True),
                        P("range", "Range", placeholder="Sheet1!A:A")]),
        ],
    ),
    ConnectorManifest(
        id="google_drive",
        name="Google Drive",
        tagline="List files and save text files to your Drive.",
        color="#FBBC04",
        icon="💾",
        auth_kind="google_oauth",
        cred_group="google",
        cred_fields=[
            CredField("client_id", "Google OAuth Client ID", "Same project as Calendar works", secret=False),
            CredField("client_secret", "Google OAuth Client Secret", "Kept encrypted on this machine", secret=True),
        ],
        scopes=["See files it creates", "Upload text files (asks you first)"],
        setup_steps=_google_setup("Google Drive API"),
        note="Free with any Google account. Uses the restricted drive.file scope — OS only sees files it created.",
        docs_url="https://developers.google.com/drive/api/quickstart/python",
        actions=[
            ActionSpec("list_files", "List files", "List files OS can see.", False,
                       [P("query", "Search query")]),
            ActionSpec("upload_text", "Upload text file", "Save a text file to Drive.", True,
                       [P("name", "File name", True), P("content", "Content", True)]),
        ],
    ),
    ConnectorManifest(
        id="youtube",
        name="YouTube",
        tagline="Search videos. Uploads stay approval-gated.",
        color="#FF0000",
        icon="▶️",
        auth_kind="google_oauth",
        cred_group="google",
        cred_fields=[
            CredField("client_id", "Google OAuth Client ID", "Same project as Calendar works", secret=False),
            CredField("client_secret", "Google OAuth Client Secret", "Kept encrypted on this machine", secret=True),
        ],
        scopes=["Search YouTube", "Read your channel"],
        setup_steps=_google_setup("YouTube Data API v3"),
        note="Free with any Google account (API quota applies, plenty for personal use). Shares the Google sign-in.",
        docs_url="https://developers.google.com/youtube/v3/quickstart/python",
        actions=[
            ActionSpec("search", "Search videos", "Search YouTube.", False,
                       [P("query", "Search query", True), P("max_results", "Max results")]),
        ],
    ),
    ConnectorManifest(
        id="github",
        name="GitHub",
        tagline="List repos, open issues you approve.",
        color="#6e5494",
        icon="🐙",
        auth_kind="token",
        cred_group="github",
        cred_fields=[
            CredField("token", "Personal Access Token", "GitHub → Settings → Developer settings → Tokens (classic), scopes: repo", placeholder="ghp_…"),
        ],
        scopes=["Read your repositories", "Create issues (asks you first)"],
        setup_steps=[
            "GitHub → Settings → Developer settings → Personal access tokens.",
            "Generate new token (classic), tick the repo scope.",
            "Paste it below and save — OS checks it works right away.",
        ],
        note="Free. A classic PAT with the repo scope is all it takes — no app setup.",
        docs_url="https://docs.github.com/en/rest",
        actions=[
            ActionSpec("list_repos", "List repos", "Your repositories.", False, []),
            ActionSpec("create_issue", "Create issue", "Open an issue.", True,
                       [P("owner", "Owner", True), P("repo", "Repo", True),
                        P("title", "Title", True), P("body", "Body")]),
        ],
    ),
    ConnectorManifest(
        id="notion",
        name="Notion",
        tagline="Search pages, create pages you approve.",
        color="#111111",
        icon="📝",
        auth_kind="token",
        cred_group="notion",
        cred_fields=[
            CredField("token", "Internal Integration Token", "Notion → Settings → Integrations → New integration", placeholder="ntn_… / secret_…"),
        ],
        scopes=["Read pages you share", "Create pages (asks you first)"],
        setup_steps=[
            "Notion → Settings → Integrations → Develop your own integrations → New.",
            "Copy the Internal Integration Token.",
            "In Notion, share the pages/databases you want OS to see with the integration (⋯ → Add connections).",
            "Paste the token below and save.",
        ],
        note="Free. OS only ever sees pages you explicitly share with the integration.",
        docs_url="https://developers.notion.com/",
        actions=[
            ActionSpec("search", "Search pages", "Search pages shared with OS.", False,
                       [P("query", "Search query")]),
            ActionSpec("create_page", "Create page", "Create a page under a parent page.", True,
                       [P("parent_id", "Parent page ID", True), P("title", "Title", True), P("content", "Content")]),
        ],
    ),
    ConnectorManifest(
        id="telegram",
        name="Telegram",
        tagline="Message yourself (and others) through your bot.",
        color="#229ED9",
        icon="✈️",
        auth_kind="fields",
        cred_group="telegram",
        cred_fields=[
            CredField("bot_token", "Bot Token", "Message @BotFather on Telegram → /newbot", placeholder="123456:ABC-…"),
            CredField("chat_id", "Your Chat ID", "Message @userinfobot on Telegram", secret=False, placeholder="123456789"),
        ],
        scopes=["Send messages via your bot (asks you first)"],
        setup_steps=[
            "On Telegram, message @BotFather → /newbot → copy the token.",
            "Message @userinfobot → copy your chat ID.",
            "Start a chat with your new bot (press Start).",
            "Paste both below and save — OS sends you a test ping.",
        ],
        note="Free forever. Bots can't start conversations — you must press Start on the bot first.",
        docs_url="https://core.telegram.org/bots/api",
        actions=[
            ActionSpec("send_message", "Send message", "Send a message via your bot.", True,
                       [P("text", "Message", True), P("chat_id", "Chat ID (default: yours)")]),
        ],
    ),
    ConnectorManifest(
        id="slack",
        name="Slack",
        tagline="Post to channels you pick.",
        color="#4A154B",
        icon="💬",
        auth_kind="token",
        cred_group="slack",
        cred_fields=[
            CredField("bot_token", "Bot Token", "api.slack.com → Your apps → OAuth & Permissions", placeholder="xoxb-…"),
        ],
        scopes=["Post messages to channels you pick (asks you first)"],
        setup_steps=[
            "api.slack.com → Create an app → From scratch.",
            "OAuth & Permissions → add chat:write scope → Install to workspace.",
            "Copy the Bot User OAuth Token (xoxb-…).",
            "Invite the bot to the channel (/invite @yourbot).",
            "Paste the token below and save.",
        ],
        note="Free for personal workspaces. The bot must be invited to each channel it posts in.",
        docs_url="https://api.slack.com/",
        actions=[
            ActionSpec("send_message", "Send message", "Post a message to a channel.", True,
                       [P("channel", "Channel (#general)", True), P("text", "Message", True)]),
        ],
    ),
    ConnectorManifest(
        id="discord",
        name="Discord",
        tagline="Post to your server via webhook.",
        color="#5865F2",
        icon="🎮",
        auth_kind="token",
        cred_group="discord",
        cred_fields=[
            CredField("webhook_url", "Webhook URL", "Channel ⚙ → Integrations → Webhooks → New Webhook → Copy URL"),
        ],
        scopes=["Post messages to that channel (asks you first)"],
        setup_steps=[
            "In Discord: channel ⚙ → Integrations → Webhooks → New Webhook.",
            "Copy the Webhook URL.",
            "Paste it below and save — OS posts a hello to confirm.",
        ],
        note="Free. A webhook posts to exactly one channel — no bot hosting needed.",
        docs_url="https://discord.com/developers/docs/intro",
        actions=[
            ActionSpec("send_message", "Send message", "Post to the webhook channel.", True,
                       [P("text", "Message", True)]),
        ],
    ),
    ConnectorManifest(
        id="spotify",
        name="Spotify",
        tagline="See what's playing, search the catalog.",
        color="#1DB954",
        icon="🎵",
        auth_kind="token",
        cred_group="spotify",
        cred_fields=[
            CredField("token", "OAuth Access Token", "From developer.spotify.com console, or your own OAuth app", placeholder="BQD…"),
        ],
        scopes=["Read your playback state", "Search the catalog"],
        setup_steps=[
            "Easiest: open the Spotify Web API console, run any request, copy the OAuth token.",
            "Or: developer.spotify.com → Dashboard → create app → use Authorization Code flow.",
            "Paste the access token below and save. Tokens expire — refresh and re-save when needed.",
        ],
        note="Free tier works. Access tokens expire after ~1 hour unless you wire a refresh flow.",
        docs_url="https://developer.spotify.com/documentation/web-api",
        actions=[
            ActionSpec("now_playing", "Now playing", "What you're currently playing.", False, []),
            ActionSpec("search", "Search", "Search tracks/artists.", False, [P("query", "Search query", True)]),
        ],
    ),
    ConnectorManifest(
        id="whatsapp",
        name="WhatsApp",
        tagline="Send messages via the WhatsApp Business API.",
        color="#25D366",
        icon="💚",
        auth_kind="fields",
        cred_group="whatsapp",
        cred_fields=[
            CredField("token", "Access Token", "Meta for Developers → WhatsApp → API Setup", placeholder="EAAG…"),
            CredField("phone_number_id", "Phone Number ID", "From the same API Setup page", secret=False),
        ],
        scopes=["Send messages to numbers you approve (asks you first)"],
        setup_steps=[
            "developers.facebook.com → create app → add WhatsApp product.",
            "API Setup → copy the temporary access token and Phone Number ID.",
            "Paste both below and save.",
        ],
        note="Free test tier: message up to 5 numbers. Temporary tokens expire after ~24h; a permanent token needs Meta app review.",
        docs_url="https://developers.facebook.com/docs/whatsapp/",
        actions=[
            ActionSpec("send_message", "Send message", "Send a WhatsApp message.", True,
                       [P("to", "Phone (+15551234567)", True), P("text", "Message", True)]),
        ],
    ),
    ConnectorManifest(
        id="linkedin",
        name="LinkedIn",
        tagline="Posting needs an approved developer app.",
        color="#0A66C2",
        icon="💼",
        auth_kind="token",
        cred_group="linkedin",
        cred_fields=[
            CredField("token", "OAuth Access Token", "From your LinkedIn developer app (scope: w_member_social)"),
        ],
        scopes=["Post on your behalf (only after you approve each post)"],
        setup_steps=[
            "developer.linkedin.com → create app → request the Share on LinkedIn product.",
            "Complete OAuth with scope w_member_social.",
            "Paste the access token below and save.",
        ],
        note="Honest warning: LinkedIn gates posting behind developer-app approval. Reading your own posts is easier than publishing.",
        docs_url="https://learn.microsoft.com/en-us/linkedin/",
        actions=[
            ActionSpec("post", "Post update", "Publish a text post.", True, [P("text", "Post text", True)]),
        ],
    ),
    ConnectorManifest(
        id="x",
        name="X (Twitter)",
        tagline="Posting needs a paid API tier.",
        color="#000000",
        icon="𝕏",
        auth_kind="fields",
        cred_group="x",
        cred_fields=[
            CredField("api_key", "API Key", "From X Developer Portal"),
            CredField("api_secret", "API Secret", "From X Developer Portal"),
            CredField("access_token", "Access Token", "With read+write permissions"),
            CredField("access_secret", "Access Token Secret", "From X Developer Portal"),
        ],
        scopes=["Read your posts", "Post (only after you approve each post)"],
        setup_steps=[
            "developer.x.com → create project/app.",
            "Note: posting requires the Basic tier ($100/mo) — the free tier is read-only.",
            "Paste all four keys below and save.",
        ],
        note="Honest warning: X charges for write access. Free tier = reads only. Drafting posts still works without connecting.",
        docs_url="https://docs.x.com/",
        actions=[
            ActionSpec("post", "Post", "Publish a post.", True, [P("text", "Post text", True)]),
        ],
    ),
    ConnectorManifest(
        id="instagram",
        name="Instagram",
        tagline="Publishing needs Meta app review.",
        color="#E1306C",
        icon="📸",
        auth_kind="token",
        cred_group="instagram",
        cred_fields=[
            CredField("access_token", "Access Token", "Long-lived token for your account"),
        ],
        scopes=["Read your profile and media", "Publish (only after you approve each one)"],
        setup_steps=[
            "developers.facebook.com → create app → add Instagram product.",
            "Connect your Instagram business/creator account.",
            "Generate a long-lived access token.",
            "Note: publishing needs app review; test accounts can post to themselves.",
        ],
        note="Honest warning: Meta requires app review before posting to real audiences. Reading your media works right away.",
        docs_url="https://developers.facebook.com/docs/instagram-platform/",
        actions=[
            ActionSpec("post", "Publish photo", "Publish a photo post from a URL.", True,
                       [P("image_url", "Image URL", True), P("caption", "Caption")]),
        ],
    ),
    ConnectorManifest(
        id="microsoft_outlook",
        name="Microsoft Outlook",
        tagline="Outlook mail and calendar through Microsoft Graph.",
        color="#0078D4",
        icon="📧",
        auth_kind="microsoft_oauth",
        cred_group="microsoft",
        cred_fields=[
            CredField("client_id", "Microsoft OAuth Client ID", "From Azure Portal → App registrations", secret=False),
            CredField("client_secret", "Microsoft OAuth Client Secret", "From the same app registration", secret=True),
        ],
        scopes=["Read your Outlook mail", "Send mail (asks you first)", "Read and create calendar events (asks you first)"],
        setup_steps=[
            "Go to Azure Portal → Microsoft Entra ID → App registrations → New registration (free).",
            "Add redirect URI (Web): http://127.0.0.1:3000/api/connectors/microsoft/oauth/callback",
            "API permissions → add Microsoft Graph: Mail.Read, Mail.Send, Calendars.ReadWrite, User.Read, offline_access.",
            "Certificates & secrets → New client secret; paste the Application (client) ID and secret below, save.",
            "Press “Sign in with Microsoft” and approve — done, no token copy-paste.",
        ],
        note="Free with any Microsoft account. One sign-in covers Outlook mail and calendar together.",
        docs_url="https://learn.microsoft.com/en-us/graph/",
        actions=[
            ActionSpec("list_emails", "List emails", "Recent Outlook inbox messages.", False,
                       [P("query", "Search query"), P("max_results", "Max results (default 5)")]),
            ActionSpec("send_email", "Send email", "Send an Outlook email.", True,
                       [P("to", "To", True), P("subject", "Subject", True), P("body", "Body", True)]),
            ActionSpec("list_events", "List events", "Events for a day (default: today).", False,
                       [P("date", "Day (today, tomorrow, 2026-09-28)")]),
            ActionSpec("create_event", "Create event", "Create a calendar event.", True,
                       [P("title", "Title", True), P("start", "Start (2026-09-28 16:00)", True),
                        P("end", "End (2026-09-28 17:00)"), P("description", "Description")]),
        ],
    ),
]


def get_manifest(connector_id: str) -> ConnectorManifest | None:
    for m in MANIFESTS:
        if m.id == connector_id:
            return m
    return None


# Try-it examples: real chat commands sai can send once a connector works.
TRY_IT: dict[str, list[str]] = {
    "google_calendar": ["what's on my calendar today",
                        "schedule meeting with mom tomorrow at 4pm"],
    "gmail": ["check my unread emails", "search mail for invoices"],
    "google_sheets": ["add a row to my sheet: alice, 42, done"],
    "google_drive": ["list my recent files"],
    "youtube": ["search youtube for lofi beats"],
    "github": ["list my repos", "create an issue titled 'Test from OS'"],
    "notion": ["create a notion page titled 'Ideas'"],
    "telegram": ["send a telegram message saying hello"],
    "slack": ["send a slack message saying hello"],
    "discord": ["send a discord message saying hello"],
    "spotify": ["what's playing on spotify"],
    "whatsapp": ["send a whatsapp message saying hello"],
    "linkedin": ["draft a linkedin post about shipping early"],
    "x": ["show my latest posts"],
    "instagram": ["show my instagram profile"],
}


# Per-connector default settings sai can fill once (used when chat commands
# omit a target). Keys match what the assistants read via ctx.get_settings().
DEFAULTS: dict[str, list[dict]] = {
    "google_calendar": [
        {"key": "default_calendar", "label": "Default calendar",
         "placeholder": "primary", "help": "Calendar ID to create events in."},
    ],
    "gmail": [],
    "google_sheets": [
        {"key": "default_spreadsheet", "label": "Default spreadsheet",
         "placeholder": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
         "help": "Spreadsheet ID used when a command doesn't name one."},
    ],
    "google_drive": [
        {"key": "default_folder", "label": "Default folder",
         "placeholder": "root", "help": "Folder ID uploads go to."},
    ],
    "youtube": [],
    "github": [
        {"key": "default_repo", "label": "Default repository",
         "placeholder": "owner/repo", "help": "Used when a command doesn't name a repo."},
    ],
    "notion": [
        {"key": "default_parent", "label": "Default parent page",
         "placeholder": "page-id", "help": "New pages are created under this page."},
    ],
    "telegram": [
        {"key": "default_chat", "label": "Default chat ID",
         "placeholder": "123456789", "help": "Where messages go unless told otherwise."},
    ],
    "slack": [
        {"key": "default_channel", "label": "Default channel",
         "placeholder": "#general", "help": "Channel used when a command doesn't name one."},
    ],
    "discord": [
        {"key": "default_channel", "label": "Default channel ID",
         "placeholder": "123456789012345678", "help": "Channel messages go to unless told otherwise."},
    ],
    "spotify": [],
    "whatsapp": [
        {"key": "default_chat", "label": "Default recipient",
         "placeholder": "+15551234567", "help": "Phone number messages go to unless told otherwise."},
    ],
    "linkedin": [],
    "x": [],
    "instagram": [],
}


# Backwards-compatible dict catalog for older call sites.
CONNECTORS: list[dict] = [
    {
        "id": m.id,
        "name": m.name,        "tagline": m.tagline,
        "color": m.color,
        "icon": m.icon,
        "auth_kind": m.auth_kind,
        "cred_group": m.cred_group,
        "scopes": m.scopes,
        "note": m.note,
        "docs_url": m.docs_url,
        "try_it": TRY_IT.get(m.id, []),
        "defaults": DEFAULTS.get(m.id, []),
        "cred_fields": [
            {"key": f.key, "label": f.label, "help": f.help,
             "secret": f.secret, "placeholder": f.placeholder}
            for f in m.cred_fields
        ],
        "setup_steps": m.setup_steps,
        "actions": [
            {"name": a.name, "label": a.label, "description": a.description,
             "needs_approval": a.needs_approval,
             "params": [{"name": p.name, "label": p.label, "required": p.required,
                         "placeholder": p.placeholder} for p in a.params]}
            for a in m.actions
        ],
    }
    for m in MANIFESTS
]


def get_connector(connector_id: str) -> dict | None:
    for c in CONNECTORS:
        if c["id"] == connector_id:
            return c
    return None
