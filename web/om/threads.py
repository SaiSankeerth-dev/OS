"""Local main/side threads — OpenMuse rich-threads port.

Threads are lightweight local conversations with rename / archive /
restore / replay. A "main" thread is the primary conversation; "side"
threads are branches. Replay duplicates a thread's messages into a fresh
thread so the conversation can continue from that point.
"""
from __future__ import annotations

from .store import OmStore, now


class ThreadError(Exception):
    def __init__(self, message: str, status: int = 400):
        super().__init__(message)
        self.status = status


class ThreadService:
    def __init__(self, store: OmStore | None = None):
        self.store = store or OmStore()

    # -- threads ---------------------------------------------------------
    def create(self, title: str = "", kind: str = "main") -> dict:
        if kind not in ("main", "side"):
            raise ThreadError("kind must be 'main' or 'side'")
        t = self.store.insert("threads", {
            "title": title.strip() or "New conversation",
            "archived": 0, "created_at": now(), "updated_at": now(),
        })
        t["kind"] = kind
        t["messages"] = []
        return t

    def get(self, tid: str) -> dict:
        t = self.store.get("threads", tid)
        if not t:
            raise ThreadError("Thread not found", 404)
        return self._public(t)

    def list(self, archived: int | None = None,
             limit: int = 100) -> list[dict]:
        where, params = ("", ())
        if archived is not None:
            where, params = ("archived = ?", (1 if archived else 0,))
        out = []
        for t in self.store.list("threads", where, params,
                                 order="updated_at DESC", limit=limit):
            t = dict(t)
            t["message_count"] = self.store.count(
                "thread_messages", "thread_id = ?", (t["id"],))
            out.append(t)
        return out

    def rename(self, tid: str, title: str) -> dict:
        if not self.store.get("threads", tid):
            raise ThreadError("Thread not found", 404)
        if not title.strip():
            raise ThreadError("Title cannot be empty")
        t = self.store.update("threads", tid, {
            "title": title.strip()[:200], "updated_at": now()})
        return self._public(t)

    def archive(self, tid: str) -> dict:
        return self._set_archived(tid, True)

    def restore(self, tid: str) -> dict:
        return self._set_archived(tid, False)

    def _set_archived(self, tid: str, archived: bool) -> dict:
        if not self.store.get("threads", tid):
            raise ThreadError("Thread not found", 404)
        t = self.store.update("threads", tid, {
            "archived": 1 if archived else 0, "updated_at": now()})
        return self._public(t)

    def delete(self, tid: str) -> None:
        if not self.store.delete("threads", tid):
            raise ThreadError("Thread not found", 404)
        for m in self.store.list("thread_messages", "thread_id = ?",
                                 (tid,), limit=10000):
            self.store.delete("thread_messages", m["id"])

    def replay(self, tid: str) -> dict:
        """Duplicate a thread's messages into a fresh thread."""
        src = self.get(tid)
        new = self.store.insert("threads", {
            "title": src["title"] + " (replay)",
            "archived": 0, "created_at": now(), "updated_at": now(),
        })
        for m in src["messages"]:
            self.store.insert("thread_messages", {
                "thread_id": new["id"], "role": m["role"],
                "content": m["content"], "created_at": now(),
            })
        return self._public(self.store.get("threads", new["id"]))

    # -- messages --------------------------------------------------------
    def add_message(self, tid: str, role: str, content: str) -> dict:
        if not self.store.get("threads", tid):
            raise ThreadError("Thread not found", 404)
        if role not in ("user", "assistant", "system"):
            raise ThreadError("role must be user/assistant/system")
        if not content.strip():
            raise ThreadError("Message cannot be empty")
        m = self.store.insert("thread_messages", {
            "thread_id": tid, "role": role,
            "content": content[:20000], "created_at": now(),
        })
        self.store.update("threads", tid, {"updated_at": now()})
        return m

    def _public(self, t: dict) -> dict:
        t = dict(t)
        t["messages"] = self.store.list(
            "thread_messages", "thread_id = ?", (t["id"],),
            order="created_at ASC", limit=1000)
        return t
