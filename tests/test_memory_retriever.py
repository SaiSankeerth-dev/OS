from dataclasses import dataclass
from server.memory.base import MemoryManager, MemoryRecord, MemoryType
from server.memory.retriever import MemoryRetriever


@dataclass
class _Cfg:
    max_relevant_memories: int = 4


class _Mem(MemoryManager):
    def __init__(self, items):
        self._items = items

    def store(self, record):
        pass

    def retrieve(self, query, limit=4):
        ql = query.lower()
        tokens = [t for t in ql.split() if len(t) >= 3]
        out = []
        for r in self._items:
            rv = r.value.lower()
            if tokens and any(tok in rv for tok in tokens):
                out.append(r)
            elif ql and ql in rv:
                out.append(r)
        return out[:limit]

    def extract(self, turns):
        return []

    def prune(self, max_age_days=None):
        return 0


def _rec(value, key="k", imp=0.9):
    return MemoryRecord(
        key=key,
        value=value,
        memory_type=MemoryType.CONVERSATION,
        importance=imp,
    )


def test_trivial_greeting_skips_memory():
    mem = _Mem([_rec("user is building OS")])
    r = MemoryRetriever(mem, _Cfg())
    assert r.retrieve_relevant("hi") == []


def test_tell_joke_skips_memory():
    mem = _Mem([_rec("user is building OS")])
    r = MemoryRetriever(mem, _Cfg())
    assert r.retrieve_relevant("tell me a joke") == []


def test_relevant_query_returns_memories():
    mem = _Mem([_rec("user is working on OS, a voice assistant project")])
    r = MemoryRetriever(mem, _Cfg())
    out = r.retrieve_relevant("what project am I working on?")
    assert len(out) == 1
    assert "OS" in out[0]


def test_needs_memory_force_fetches_even_trivial():
    mem = _Mem([_rec("user said hi there")])
    r = MemoryRetriever(mem, _Cfg())
    out = r.retrieve_relevant("hi", needs_memory=True)
    assert len(out) == 1