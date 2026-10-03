"""Chat → real tasks. Parses natural commands and runs connector actions.

Read actions execute immediately. Write actions create an approval in the
dashboard rail — nothing external happens until the user approves the exact
action with its exact parameters. If the needed connector isn't connected,
the reply tells the user how to connect it instead of pretending.
"""
from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import datetime, timedelta


@dataclass
class AssistantResult:
    reply: str
    execution: dict | None = None   # card payload for the chat UI
    action_approval: dict | None = None  # pending approval record


class Ctx:
    """Provided by server.py: connected_ids(), adapter(cid), creds(cid),
    create_action(...), get_settings(cid)."""


# --------------------------------------------------------------------------
# natural date/time parsing
# --------------------------------------------------------------------------

_WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday",
             "saturday", "sunday"]
_MONTHS = {"jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6,
           "jul": 7, "aug": 8, "sep": 9, "oct": 10, "nov": 11, "dec": 12}


def _parse_day(text: str, now: datetime) -> datetime.date | None:
    t = text.lower()
    if "day after tomorrow" in t:
        return (now + timedelta(days=2)).date()
    if "tomorrow" in t:
        return (now + timedelta(days=1)).date()
    if "today" in t or "tonight" in t:
        return now.date()
    m = re.search(r"(\d{1,2})(st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*", t)
    if m:
        month = _MONTHS[m.group(3)[:3]]
        year = now.year
        d = datetime(year, month, int(m.group(1))).date()
        if d < now.date():  # assume next year if passed
            d = datetime(year + 1, month, int(m.group(1))).date()
        return d
    m = re.search(r"(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2})", t)
    if m:
        month = _MONTHS[m.group(1)[:3]]
        year = now.year
        d = datetime(year, month, int(m.group(2))).date()
        if d < now.date():
            d = datetime(year + 1, month, int(m.group(2))).date()
        return d
    m = re.search(r"(\d{4})-(\d{1,2})-(\d{1,2})", t)
    if m:
        return datetime(int(m.group(1)), int(m.group(2)), int(m.group(3))).date()
    m = re.search(r"(next|this)?\s*(monday|tuesday|wednesday|thursday|friday|saturday|sunday)", t)
    if m:
        target = _WEEKDAYS.index(m.group(2))
        delta = (target - now.weekday()) % 7
        if m.group(1) == "next" or delta == 0:
            delta = delta or 7
            if m.group(1) == "next" and delta <= 7:
                pass
        return (now + timedelta(days=delta)).date()
    return None


def _parse_time(text: str) -> tuple[int, int] | None:
    m = re.search(r"(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b", text.lower())
    if m:
        h, minute, ap = int(m.group(1)), int(m.group(2) or 0), m.group(3)
        if ap == "pm" and h < 12:
            h += 12
        if ap == "am" and h == 12:
            h = 0
        return h, minute
    m = re.search(r"\bat\s+(\d{1,2}):(\d{2})\b", text.lower())
    if m:
        return int(m.group(1)), int(m.group(2))
    return None


def parse_event_datetime(text: str, now: datetime | None = None
                         ) -> tuple[str, str] | None:
    """Returns (start_iso, end_iso) or None if day/time is missing."""
    now = now or datetime.now().astimezone()
    day = _parse_day(text, now)
    tm = _parse_time(text)
    if day is None or tm is None:
        return None
    start = datetime(day.year, day.month, day.day, tm[0], tm[1],
                     tzinfo=now.tzinfo)
    end = start + timedelta(hours=1)
    return start.isoformat(timespec="minutes"), end.isoformat(timespec="minutes")


# --------------------------------------------------------------------------
# command handlers
# --------------------------------------------------------------------------

def _need_connection(cid: str, cname: str, doing: str) -> AssistantResult:
    return AssistantResult(
        reply=f"I can {doing} — but {cname} isn't connected yet.",
        execution={"status": "needs_connection", "connector_id": cid,
                   "connector_name": cname, "label": doing})


def _ask(missing: str) -> AssistantResult:
    return AssistantResult(reply=missing,
                           execution={"status": "needs_info", "label": missing})


def _run_read(ctx: Ctx, cid: str, action: str, params: dict,
              format_fn) -> AssistantResult:
    adapter = ctx.adapter(cid)
    try:
        result = adapter.run_action(action, params, ctx.creds(cid))
    except Exception as e:
        return AssistantResult(
            reply=f"That didn't work: {e}",
            execution={"status": "error", "connector_id": cid,
                       "label": action, "error": str(e)})
    ctx.touch_used(cid)
    return AssistantResult(reply=format_fn(result),
                           execution={"status": "done", "connector_id": cid,
                                      "action": action, "label": action,
                                      "result": result})


def _request_write(ctx: Ctx, cid: str, cname: str, action: str, label: str,
                   params: dict, summary: str) -> AssistantResult:
    rec = ctx.create_action(cid, action, label, summary, params)
    return AssistantResult(
        reply=f"Ready to do this — approve it and I'll run it:\n\n{summary}",
        execution={"status": "pending_approval", "connector_id": cid,
                   "action": action, "label": label, "summary": summary,
                   "approval_id": rec["id"]},
        action_approval={**rec, "connector_name": cname})


def _fmt_time(iso: str) -> str:
    try:
        return datetime.fromisoformat(iso).strftime("%-I:%M %p")
    except Exception:
        return iso


# -- individual commands ----------------------------------------------------

def _cmd_calendar_create(text: str, ctx: Ctx) -> AssistantResult:
    cid = "google_calendar"
    if cid not in ctx.connected_ids():
        return _need_connection(cid, "Google Calendar", "schedule that")
    m = re.search(r'"([^"]+)"', text)
    title = m.group(1) if m else None
    if not title:
        m = re.search(
            r"\b(?:schedule|create|add|book|set up)\s+(?:a\s+|an\s+|the\s+)?"
            r"(.+?)(?=\s+(?:tomorrow|today|tonight|day after tomorrow|on\s|at\s|next\s|this\s)|\s+\d|\s*$)",
            text, re.I)
        if m:
            title = m.group(1).strip()
    if not title:
        m = re.search(r"\b(?:called|titled|about|regarding|to discuss)\s+(.+?)(?:\s+(?:tomorrow|today|tonight|on |at |next |this )|$)", text, re.I)
        title = m.group(1).strip() if m else None
    if not title:
        return _ask("What should I call the event?")
    dt = parse_event_datetime(text)
    if dt is None:
        return _ask(f"When is “{title}”? (e.g. “tomorrow at 4pm”)")
    start, end = dt
    day = datetime.fromisoformat(start).strftime("%a %d %b")
    summary = f"📅 Create “{title}” — {day}, {_fmt_time(start)}–{_fmt_time(end)}"
    return _request_write(ctx, cid, "Google Calendar", "create_event",
                          "Create event",
                          {"title": title, "start": start, "end": end},
                          summary)


def _cmd_calendar_list(text: str, ctx: Ctx) -> AssistantResult:
    cid = "google_calendar"
    if cid not in ctx.connected_ids():
        return _need_connection(cid, "Google Calendar", "check your schedule")
    now = datetime.now().astimezone()
    day = _parse_day(text, now) or now.date()
    label = "today" if day == now.date() else day.strftime("%a %d %b")

    def fmt(res):
        evs = res.get("events", [])
        if not evs:
            return f"Nothing on your calendar {label}. Clear skies. ☀️"
        lines = [f"Here's {label}:"] + [
            f"• {_fmt_time(e['start'])} — {e['title']}" for e in evs]
        return "\n".join(lines)

    return _run_read(ctx, cid, "list_events", {"date": day.isoformat()}, fmt)


def _cmd_gmail_send(text: str, ctx: Ctx) -> AssistantResult:
    cid = "gmail"
    if cid not in ctx.connected_ids():
        return _need_connection(cid, "Gmail", "send that email")
    m = re.search(r"[\w.+-]+@[\w-]+\.[\w.]+", text)
    if not m:
        return _ask("Who should I send it to? (I need an email address)")
    to = m.group(0)
    subj = re.search(r"subject\s*[:\-]?\s*[\"']?([^\"'\n]+?)[\"']?(?=\s+body\b|\s*$)", text, re.I)
    body_m = re.search(r"body\s*[:\-]?\s*[\"']?(.+?)[\"']?$", text, re.I | re.S)
    if not body_m:
        body_m = re.search(r"(?:saying|that says|with (?:the )?message)\s+[\"']?(.+?)[\"']?$", text, re.I | re.S)
    subject = subj.group(1).strip() if subj else ""
    body = body_m.group(1).strip() if body_m else ""
    if not subject:
        return _ask(f"What's the subject for the email to {to}?")
    if not body:
        return _ask("And what should the email say?")
    summary = f"✉️ Send email\nTo: {to}\nSubject: {subject}\n\n{body[:300]}"
    return _request_write(ctx, cid, "Gmail", "send_email", "Send email",
                          {"to": to, "subject": subject, "body": body}, summary)


def _cmd_gmail_search(text: str, ctx: Ctx) -> AssistantResult:
    cid = "gmail"
    if cid not in ctx.connected_ids():
        return _need_connection(cid, "Gmail", "search your mail")
    m = re.search(r"(?:for|about|containing)\s+(.+)$", text, re.I)
    query = m.group(1).strip() if m else text.strip()
    if not query:
        return _ask("What should I search your inbox for?")

    def fmt(res):
        emails = res.get("emails", [])
        if not emails:
            return f"No emails found for “{query}”."
        return "Found:\n" + "\n".join(
            f"• {e['subject']} — {e['from']}" for e in emails)

    return _run_read(ctx, cid, "search_emails", {"query": query}, fmt)


def _cmd_calendar_cancel(text: str, ctx: Ctx) -> AssistantResult:
    cid = "google_calendar"
    if cid not in ctx.connected_ids():
        return _need_connection(cid, "Google Calendar", "cancel that event")
    m = re.search(r"\b(evt_[a-zA-Z0-9_-]+)\b", text, re.I)
    if not m:
        m = re.search(r"(?:id\s+)([a-zA-Z0-9_-]{5,})", text, re.I)
    event_id = m.group(1) if m else None
    if not event_id:
        m = re.search(r"(?:cancel|delete)\s+(?:the\s+)?(?:meeting|event|call)\s+[\"']?(.+?)[\"']?$", text, re.I)
        event_id = m.group(1).strip() if m else None
    if not event_id or event_id.lower() in ("event", "meeting", "call"):
        return _ask("Which event should I cancel? (Please provide the event ID or title)")
    summary = f"🗑️ Cancel calendar event: {event_id}"
    return _request_write(ctx, cid, "Google Calendar", "delete_event",
                          "Cancel event",
                          {"event_id": event_id}, summary)


def _cmd_calendar_reschedule(text: str, ctx: Ctx) -> AssistantResult:
    cid = "google_calendar"
    if cid not in ctx.connected_ids():
        return _need_connection(cid, "Google Calendar", "reschedule that")
    m = re.search(r"\b(evt_[a-zA-Z0-9_-]+)\b", text, re.I)
    if not m:
        m = re.search(r"(?:id\s+)([a-zA-Z0-9_-]{5,})", text, re.I)
    event_id = m.group(1) if m else None
    if not event_id:
        m = re.search(r"(?:reschedule|move)\s+(?:the\s+)?(?:meeting|event|call)?\s*[\"']?([^\"'\n]+?)[\"']?\s+to\b", text, re.I)
        event_id = m.group(1).strip() if m else None
    dt = parse_event_datetime(text)
    if not event_id or event_id.lower() in ("event", "meeting", "call"):
        return _ask("Which event should I reschedule? (Please provide the event ID or title)")
    if dt is None:
        return _ask(f"When should I move event '{event_id}' to? (e.g. 'tomorrow at 3pm')")
    start, end = dt
    summary = f"📅 Reschedule event {event_id} to {_fmt_time(start)}–{_fmt_time(end)}"
    return _request_write(ctx, cid, "Google Calendar", "update_event",
                          "Reschedule event",
                          {"event_id": event_id, "start": start, "end": end}, summary)


def _cmd_gmail_reply(text: str, ctx: Ctx) -> AssistantResult:
    cid = "gmail"
    if cid not in ctx.connected_ids():
        return _need_connection(cid, "Gmail", "reply to that email")
    m = re.search(r"[\w.+-]+@[\w-]+\.[\w.]+", text)
    to = m.group(0) if m else None
    m_id = re.search(r"(?:thread|message)\s+(?:id\s+)?([a-zA-Z0-9_-]{5,})", text, re.I)
    thread_id = m_id.group(1) if m_id else None
    body_m = re.search(r"(?:saying|that says|with (?:the )?message)\s+(.+)$", text, re.I | re.S)
    body = body_m.group(1).strip() if body_m else ""
    subj_m = re.search(r"subject\s*[:\-]?\s*\"?([^\"\n]+)\"?", text, re.I)
    subject = subj_m.group(1).strip() if subj_m else "Follow-up"
    if not to and not thread_id:
        return _ask("Who should I reply to? (Need an email address or thread ID)")
    if not body:
        return _ask("What should the reply say?")
    params = {"to": to or "reply@example.com", "subject": subject, "body": body}
    if thread_id:
        params["thread_id"] = thread_id
    summary = f"↩️ Reply to {to or thread_id}\nSubject: Re: {subject}\n\n{body[:300]}"
    return _request_write(ctx, cid, "Gmail", "reply_email", "Reply to email", params, summary)


def _cmd_github_issue(text: str, ctx: Ctx) -> AssistantResult:
    cid = "github"
    if cid not in ctx.connected_ids():
        return _need_connection(cid, "GitHub", "open that issue")
    m = re.search(r"([\w.-]+)/([\w.-]+)", text)
    owner, repo = None, None
    if m:
        owner, repo = m.group(1), m.group(2)
    else:
        default = ctx.get_settings(cid).get("default_repo", "")
        if "/" in default:
            owner, repo = default.split("/", 1)
    if not owner:
        return _ask("Which repo? (e.g. “in myuser/myrepo”)")
    m = re.search(r'titled?\s+["\']?(.+?)["\']?(?:\s+(?:saying|with body|body)\s+(.+))?$',
                  text, re.I | re.S)
    if not m:
        return _ask("What should the issue be titled?")
    title, body = m.group(1).strip(), (m.group(2) or "").strip()
    summary = f"🐙 Open issue in {owner}/{repo}\nTitle: {title}" + (f"\n\n{body[:300]}" if body else "")
    return _request_write(ctx, cid, "GitHub", "create_issue", "Create issue",
                          {"owner": owner, "repo": repo, "title": title,
                           "body": body}, summary)


def _cmd_telegram(text: str, ctx: Ctx) -> AssistantResult:
    cid = "telegram"
    if cid not in ctx.connected_ids():
        return _need_connection(cid, "Telegram", "send that message")
    body = re.sub(r"(?i)^\s*(send|message)(\s+a)?(\s+me)?(\s+(a\s+)?telegram(\s+message)?)?\s*", "", text).strip()
    body = re.sub(r"(?i)^telegram\s*", "", body).strip()
    if not body:
        return _ask("What should the Telegram message say?")
    return _request_write(ctx, cid, "Telegram", "send_message", "Send message",
                          {"text": body}, f"✈️ Telegram: “{body[:200]}”")


def _cmd_slack(text: str, ctx: Ctx) -> AssistantResult:
    cid = "slack"
    if cid not in ctx.connected_ids():
        return _need_connection(cid, "Slack", "post that")
    m = re.search(r"(?:to|in)\s+(#?[\w-]+)\s+(.+)$", text, re.I | re.S)
    if m:
        channel, body = m.group(1), m.group(2).strip()
    else:
        channel = ctx.get_settings(cid).get("default_channel", "")
        body = re.sub(r"(?i)^\s*(send|post)(\s+(a|to))?(\s+slack)?\s*", "", text).strip()
        body = re.sub(r"(?i)^slack\s*", "", body).strip()
    if not channel:
        return _ask("Which Slack channel? (e.g. “to #general …”)")
    if not body:
        return _ask(f"What should I post to {channel}?")
    return _request_write(ctx, cid, "Slack", "send_message", "Post message",
                          {"channel": channel, "text": body},
                          f"💬 Slack {channel}: “{body[:200]}”")


def _cmd_discord(text: str, ctx: Ctx) -> AssistantResult:
    cid = "discord"
    if cid not in ctx.connected_ids():
        return _need_connection(cid, "Discord", "post that")
    body = re.sub(r"(?i)^\s*(send|post)(\s+a)?(\s+(a\s+)?discord(\s+message)?)?\s*", "", text).strip()
    body = re.sub(r"(?i)^discord\s*", "", body).strip()
    if not body:
        return _ask("What should I post to Discord?")
    return _request_write(ctx, cid, "Discord", "send_message", "Post message",
                          {"text": body}, f"🎮 Discord: “{body[:200]}”")


def _cmd_whatsapp(text: str, ctx: Ctx) -> AssistantResult:
    cid = "whatsapp"
    if cid not in ctx.connected_ids():
        return _need_connection(cid, "WhatsApp", "send that")
    m = re.search(r"(\+?\d[\d\s]{9,}\d)", text)
    if not m:
        return _ask("Which number? (with country code, e.g. +91…)")
    to = re.sub(r"\s+", "", m.group(1))
    body = text[m.end():].strip(" :,-")
    if not body:
        return _ask(f"What should I send to {to}?")
    return _request_write(ctx, cid, "WhatsApp", "send_message", "Send message",
                          {"to": to, "text": body},
                          f"💚 WhatsApp to {to}: “{body[:200]}”")


def _cmd_notion(text: str, ctx: Ctx) -> AssistantResult:
    cid = "notion"
    if cid not in ctx.connected_ids():
        return _need_connection(cid, "Notion", "save that")
    parent = ctx.get_settings(cid).get("default_parent", "")
    if not parent:
        return _ask("Which Notion page should I add it under? (set a default page in the Notion connector settings, or paste the page ID)")
    body = re.sub(r"(?i)^\s*(add|save|note)(\s+to)?(\s+notion)?\s*:?\s*", "", text).strip()
    body = re.sub(r"(?i)^notion\s*", "", body).strip()
    if not body:
        return _ask("What should I save to Notion?")
    title = body[:60]
    return _request_write(ctx, cid, "Notion", "create_page", "Create page",
                          {"parent_id": parent, "title": title, "content": body},
                          f"📝 Notion page: “{title}”")


def _cmd_sheet_log(text: str, ctx: Ctx) -> AssistantResult:
    cid = "google_sheets"
    if cid not in ctx.connected_ids():
        return _need_connection(cid, "Google Sheets", "log that")
    sid = ctx.get_settings(cid).get("default_spreadsheet", "")
    if not sid:
        return _ask("Which spreadsheet? Set a default in the Google Sheets connector settings (paste the spreadsheet ID), or say “log to sheet <id>: …”")
    m = re.search(r"sheet\s+([a-zA-Z0-9-_]{10,})\s*:\s*(.+)$", text, re.I | re.S)
    if m:
        sid, body = m.group(1), m.group(2).strip()
    else:
        body = re.sub(r"(?i)^\s*(log|add)(\s+to)?(\s+sheet)?\s*:?\s*", "", text).strip()
    if not body:
        return _ask("What should I log to the sheet?")
    stamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    return _request_write(ctx, cid, "Google Sheets", "append_row", "Append row",
                          {"spreadsheet_id": sid, "values": f"{stamp}, {body}"},
                          f"📊 Log to sheet: “{body[:200]}”")


def _cmd_youtube_search(text: str, ctx: Ctx) -> AssistantResult:
    cid = "youtube"
    if cid not in ctx.connected_ids():
        return _need_connection(cid, "YouTube", "search YouTube")
    m = re.search(r"(?:for|about)\s+(.+)$", text, re.I)
    query = (m.group(1) if m else re.sub(r"(?i)youtube|search", "", text)).strip()
    if not query:
        return _ask("What should I search YouTube for?")

    def fmt(res):
        vids = res.get("videos", [])
        if not vids:
            return f"No videos found for “{query}”."
        return "Top results:\n" + "\n".join(
            f"• {v['title']} ({v['channel']})\n  {v['url']}" for v in vids)

    return _run_read(ctx, cid, "search", {"query": query}, fmt)


def _cmd_spotify_now(text: str, ctx: Ctx) -> AssistantResult:
    cid = "spotify"
    if cid not in ctx.connected_ids():
        return _need_connection(cid, "Spotify", "check what's playing")

    def fmt(res):
        if not res.get("playing"):
            return "Nothing playing on Spotify right now. 🎧"
        return f"🎵 Now playing: {res.get('track')} — {res.get('artists')}"

    return _run_read(ctx, cid, "now_playing", {}, fmt)


def _cmd_drive_list(text: str, ctx: Ctx) -> AssistantResult:
    cid = "google_drive"
    if cid not in ctx.connected_ids():
        return _need_connection(cid, "Google Drive", "list your files")

    def fmt(res):
        files = res.get("files", [])
        if not files:
            return "No files found."
        return "Files:\n" + "\n".join(f"• {f['name']}" for f in files[:15])

    return _run_read(ctx, cid, "list_files", {}, fmt)


# (pattern, handler) — order matters, most specific first
COMMANDS = [
    (re.compile(r"\b(reschedule|move)\b.{0,40}\b(meeting|event|appointment|call)?\b", re.I), _cmd_calendar_reschedule),
    (re.compile(r"\b(cancel|delete)\b.{0,40}\b(meeting|event|appointment|call)\b", re.I), _cmd_calendar_cancel),
    (re.compile(r"\b(reply)\b.{0,30}\b(to\s+email|email|mail)\b", re.I), _cmd_gmail_reply),
    (re.compile(r"\b(schedule|create|add|book|set up)\b.{0,50}\b(meeting|event|appointment|call|reminder|session)\b", re.I), _cmd_calendar_create),
    (re.compile(r"\b(what'?s|show|list|any|do i have)\b.{0,40}\b(on my calendar|my schedule|events|meetings|appointments)\b", re.I), _cmd_calendar_list),
    (re.compile(r"\bsend\b.{0,30}\bemail\b", re.I), _cmd_gmail_send),
    (re.compile(r"\b(search|find|check)\b.{0,30}\b(email|mail|inbox)\b", re.I), _cmd_gmail_search),
    (re.compile(r"\b(github\s+)?issue\b", re.I), _cmd_github_issue),
    (re.compile(r"\btelegram\b", re.I), _cmd_telegram),
    (re.compile(r"\bslack\b", re.I), _cmd_slack),
    (re.compile(r"\bdiscord\b", re.I), _cmd_discord),
    (re.compile(r"\bwhatsapp\b", re.I), _cmd_whatsapp),
    (re.compile(r"\bnotion\b", re.I), _cmd_notion),
    (re.compile(r"\b(log|add)\b.{0,20}\bsheet\b", re.I), _cmd_sheet_log),
    (re.compile(r"\byoutube\b", re.I), _cmd_youtube_search),
    (re.compile(r"\b(what'?s playing|now playing)\b", re.I), _cmd_spotify_now),
    (re.compile(r"\b(drive|my files)\b", re.I), _cmd_drive_list),
]


def handle(text: str, ctx: Ctx) -> AssistantResult | None:
    """Return an AssistantResult if the message is a connector command,
    else None (fall through to the normal engine)."""
    for pattern, handler in COMMANDS:
        if pattern.search(text):
            try:
                return handler(text, ctx)
            except Exception as e:
                return AssistantResult(
                    reply=f"I hit a snag: {e}",
                    execution={"status": "error", "label": "command",
                               "error": str(e)})
    return None
