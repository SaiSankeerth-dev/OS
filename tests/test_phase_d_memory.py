"""Focused Phase D-1 tests for typed, private local memory."""
from __future__ import annotations

import time
import asyncio
from concurrent.futures import ThreadPoolExecutor

from config import load_config
from server.conversation.manager import ConversationManager
from server.llm.base import ChatChunk
from server.memory.base import MemoryRecord, MemoryType
from server.memory.retriever import MemoryRetriever
from server.memory.sqlite_impl import SQLiteMemoryManager


def test_typed_memory_survives_restart_with_provenance(tmp_path):
    db_path = tmp_path / "personal-memory.db"
    first = SQLiteMemoryManager(str(db_path))
    written = first.remember_explicit("My project is OS recovery", source="user_explicit")

    assert written.accepted is True
    assert written.record is not None
    assert written.record.memory_type == MemoryType.PROJECT
    assert written.record.metadata["provenance"]["source"] == "user_explicit"
    assert written.record.metadata["confidence"] == 0.95
    first.close()

    second = SQLiteMemoryManager(str(db_path))
    records = second.retrieve("what project am I working on?", limit=4)
    assert len(records) == 1
    assert records[0].value == "My project is OS recovery"
    assert records[0].memory_type == MemoryType.PROJECT
    assert records[0].metadata["provenance"]["source"] == "user_explicit"


def test_memory_retrieval_excludes_expired_and_secret_records(tmp_path):
    memory = SQLiteMemoryManager(str(tmp_path / "private.db"))
    memory.store(MemoryRecord(
        key="expired-project",
        value="The retired project is Atlas",
        memory_type=MemoryType.PROJECT,
        expires_at=time.time() - 1,
        metadata={"provenance": {"source": "test"}, "confidence": 1.0},
    ))
    memory.store(MemoryRecord(
        key="secret-note",
        value="API token is should-not-be-retrieved",
        memory_type=MemoryType.LONG_TERM,
        metadata={"privacy": "secret", "provenance": {"source": "test"}, "confidence": 1.0},
    ))

    assert memory.retrieve("project Atlas", limit=4) == []
    assert memory.retrieve("token", limit=4) == []
    rejected = memory.remember_explicit("remember my API key is abc123")
    assert rejected.accepted is False
    assert "sensitive" in rejected.reason.lower()


def test_lower_confidence_conflict_does_not_overwrite_confirmed_memory(tmp_path):
    memory = SQLiteMemoryManager(str(tmp_path / "conflict.db"))
    original = MemoryRecord(
        key="preference:editor",
        value="I prefer Vim",
        memory_type=MemoryType.PREFERENCE,
        metadata={"confidence": 0.95, "provenance": {"source": "user_explicit"}},
    )
    memory.store(original)
    result = memory.store_typed(MemoryRecord(
        key="preference:editor",
        value="I prefer Emacs",
        memory_type=MemoryType.PREFERENCE,
        metadata={"confidence": 0.40, "provenance": {"source": "unverified_import"}},
    ))

    assert result.accepted is False
    assert result.conflict is True
    records = memory.retrieve("editor preference", limit=4)
    assert [record.value for record in records] == ["I prefer Vim"]


def test_higher_confidence_explicit_update_replaces_memory_with_history(tmp_path):
    memory = SQLiteMemoryManager(str(tmp_path / "update.db"))
    memory.store(MemoryRecord(
        key="preference:editor",
        value="I prefer Vim",
        memory_type=MemoryType.PREFERENCE,
        metadata={"confidence": 0.40, "provenance": {"source": "import"}},
    ))
    result = memory.store_typed(MemoryRecord(
        key="preference:editor",
        value="I prefer Emacs",
        memory_type=MemoryType.PREFERENCE,
        metadata={"confidence": 0.95, "provenance": {"source": "user_explicit"}},
    ))

    assert result.accepted is True
    record = memory.retrieve("editor preference", limit=1)[0]
    assert record.value == "I prefer Emacs"
    assert record.metadata["supersedes"]["value"] == "I prefer Vim"


def test_forget_removes_the_typed_mirror(tmp_path):
    memory = SQLiteMemoryManager(str(tmp_path / "forget.db"))
    assert memory.remember_explicit("My project is OS recovery").accepted

    deleted = memory.forget("OS project")

    assert [record.value for record in deleted] == ["My project is OS recovery"]
    assert memory.retrieve("OS project", limit=4) == []


def test_team_task_binds_retrieved_memory_as_untrusted_context(tmp_path, monkeypatch):
    """Task planning receives relevant facts separately from the user request."""
    from server.supervisor.pipeline import Supervisor
    from server.intent.registry import ToolRegistry

    captured: dict[str, str] = {}

    class FakeTeam:
        def __init__(self, **kwargs):
            pass

        async def plan(self, goal, *, context=""):
            captured["goal"] = goal
            captured["plan_context"] = context
            return [goal]

        async def execute(self, subtasks):
            return ["Plan OS recovery project"]

        def verify(self, subtask, output):
            return True

        async def synthesize(self, goal, verified, *, context=""):
            captured["synthesis_context"] = context
            return verified[0][1]

    monkeypatch.setattr("server.teams.Team", FakeTeam)
    supervisor = Supervisor(ToolRegistry())

    async def run():
        return await supervisor.run_team(
            "Plan the recovery work", memory_context=["Project: OS recovery"]
        )

    with ThreadPoolExecutor(max_workers=1) as pool:
        result = pool.submit(asyncio.run, run()).result()

    assert result.status == "ok"
    assert captured["goal"] == "Plan the recovery work"
    assert captured["plan_context"] == "Project: OS recovery"
    assert captured["synthesis_context"] == "Project: OS recovery"


def test_saved_memory_is_injected_into_ordinary_chat_context(tmp_path):
    class Client:
        name = "test"

        def __init__(self):
            self.messages = []

        async def healthy_cached(self):
            return True

        async def chat_stream(self, messages, **kwargs):
            self.messages = messages
            yield ChatChunk(delta="Acknowledged.", done=True)

    class Router:
        def __init__(self, client):
            self.client = client

        def client_for(self, _task):
            return self.client

    client = Client()
    cfg = load_config()
    db_path = tmp_path / "chat-memory.db"

    def run_chat():
        # The live ASGI app owns its manager and SQLite connection on the
        # serving thread; model that lifecycle in this end-to-end check.
        memory = SQLiteMemoryManager(str(db_path))
        assert memory.remember_explicit("My project is OS recovery").accepted
        manager = ConversationManager(
            cfg,
            router=Router(client),
            memory=memory,
            memory_retriever=MemoryRetriever(memory, cfg.conversation),
        )

        async def ask():
            return [chunk async for chunk in manager.respond_text("What project am I working on?")]

        return asyncio.run(ask())

    # Some existing tests intentionally use asyncio.run() themselves.  Keep
    # this real async conversation check isolated from their loop policy.
    with ThreadPoolExecutor(max_workers=1) as pool:
        pool.submit(run_chat).result()
    injected = [message.content for message in client.messages if message.role == "system"]
    assert any("My project is OS recovery" in message for message in injected)
