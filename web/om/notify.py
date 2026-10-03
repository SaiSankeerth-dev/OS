"""Durable notification inbox — OpenMuse notifications port.

Any part of OS can drop a notification here (watcher alerts, run
completions, reminders). The dashboard shows an unread badge; the inbox
view lists everything with source links. Read state is durable.

Optional Telegram delivery: if the Telegram connector is connected (bot
token in the credential vault), a notification can also be pushed to the
user's phone via the bot — free, no cloud service of ours involved. This
only ever fires on the user's explicit action in the dashboard.
"""
from __future__ import annotations

from .store import OmStore, now


class NotifyError(Exception):
    def __init__(self, message: str, status: int = 400):
        super().__init__(message)
        self.status = status


def _telegram_creds() -> dict:
    """Telegram bot credentials from the main dashboard vault ({} if none)."""
    try:
        from web.store import DashboardStore
        return DashboardStore().load_credentials("telegram") or {}
    except Exception:
        return {}


def telegram_status() -> dict:
    creds = _telegram_creds()
    if not creds.get("bot_token"):
        return {"connected": False,
                "detail": "No Telegram bot token — connect Telegram in the Connectors tab first."}
    try:
        from web.connectors.adapters import ADAPTERS
        ok, msg = ADAPTERS["telegram"].health_check(creds)
        return {"connected": bool(ok), "detail": str(msg)}
    except Exception as e:
        return {"connected": False, "detail": f"{type(e).__name__}: {e}"}


def send_telegram(title: str, body: str = "") -> dict:
    """Push one message via the Telegram bot. Returns a status dict."""
    creds = _telegram_creds()
    if not creds.get("bot_token"):
        return {"sent": False, "reason": "not_configured"}
    try:
        from web.connectors.adapters import ADAPTERS
        text = title if not body else f"{title}\n{body}"
        ADAPTERS["telegram"].run_action(
            "send_message", {"text": text[:4000]}, creds)
        return {"sent": True}
    except Exception as e:
        return {"sent": False, "reason": f"{type(e).__name__}: {e}"}


class NotifyService:
    def __init__(self, store: OmStore | None = None):
        self.store = store or OmStore()

    def notify(self, title: str, body: str = "", source: str = "",
               link: str = "", telegram: bool = False) -> dict:
        if not title.strip():
            raise NotifyError("Notification needs a title")
        row = self.store.insert("notifications", {
            "title": title.strip()[:200],
            "body": body[:2000],
            "source": source[:100],
            "link": link[:500],
            "read": 0,
            "created_at": now(),
        })
        tg = send_telegram(title, body) if telegram else None
        return {**row, "telegram": tg}

    def telegram_status(self) -> dict:
        return telegram_status()

    def list(self, unread_only: bool = False,
             limit: int = 100) -> list[dict]:
        where, params = ("read = 0", ()) if unread_only else ("", ())
        return self.store.list("notifications", where, params,
                               order="created_at DESC", limit=limit)

    def unread_count(self) -> int:
        return self.store.count("notifications", "read = 0")

    def mark_read(self, nid: str) -> dict:
        n = self.store.get("notifications", nid)
        if not n:
            raise NotifyError("Notification not found", 404)
        return self.store.update("notifications", nid, {"read": 1})

    def mark_all_read(self) -> int:
        n = 0
        for item in self.store.list("notifications", "read = 0",
                                    limit=10000):
            self.store.update("notifications", item["id"], {"read": 1})
            n += 1
        return n

    def delete(self, nid: str) -> None:
        if not self.store.delete("notifications", nid):
            raise NotifyError("Notification not found", 404)

    def clear_read(self) -> int:
        n = 0
        for item in self.store.list("notifications", "read = 1",
                                    limit=10000):
            self.store.delete("notifications", item["id"])
            n += 1
        return n
