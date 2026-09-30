"""Durable notification inbox — OpenMuse notifications port.

Any part of OS can drop a notification here (watcher alerts, run
completions, reminders). The dashboard shows an unread badge; the inbox
view lists everything with source links. Read state is durable.
"""
from __future__ import annotations

from .store import OmStore, now


class NotifyError(Exception):
    def __init__(self, message: str, status: int = 400):
        super().__init__(message)
        self.status = status


class NotifyService:
    def __init__(self, store: OmStore | None = None):
        self.store = store or OmStore()

    def notify(self, title: str, body: str = "", source: str = "",
               link: str = "") -> dict:
        if not title.strip():
            raise NotifyError("Notification needs a title")
        return self.store.insert("notifications", {
            "title": title.strip()[:200],
            "body": body[:2000],
            "source": source[:100],
            "link": link[:500],
            "read": 0,
            "created_at": now(),
        })

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
