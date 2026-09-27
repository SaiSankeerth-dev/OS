"""Phase 3 tests: Laya fast router.

Stub-based tests run everywhere (no checkpoint needed). Live tests
run only when the Laya checkpoint is cached - they never trigger a
download.
"""
import asyncio

import pytest

from config import load_config
from server.approvals.gate import ApprovalStore
from server.conversation.manager import ConversationManager
from server.intent.router import Intent
from server.routing import (
    LayaRouter,
    checkpoint_cached,
    laya_available,
    laya_importable,
)


class _StubLaya:
    """Pretends to be laya.Router for threshold/logic tests."""

    def __init__(self, choice, confidence):
        self._choice = choice
        self._confidence = confidence

    def predict(self, text, questions, model=None):
        assert "skill" in questions
        return {
            "model": "laya-rl-agent",
            "answers": {
                "skill": {
                    "type": "choice",
                    "choice": self._choice,
                    "answer_confidence": self._confidence,
                    "confidence": self._confidence,
                }
            },
        }


def _router_with_stub(choice="linkedin_draft", confidence=0.9) -> LayaRouter:
    r = LayaRouter()
    r._router = _StubLaya(choice, confidence)
    return r


def test_hit_above_threshold_returns_skill():
    r = _router_with_stub("linkedin_draft", 0.9)
    hit = r.route("write me a post for linkedin about startups")
    assert hit is not None
    skill, confidence, latency_ms = hit
    assert skill == "linkedin_draft"
    assert confidence == 0.9
    assert latency_ms >= 0


def test_hit_below_threshold_falls_back():
    r = _router_with_stub("linkedin_draft", 0.2)
    assert r.route("write me a post for linkedin about startups") is None


def test_unknown_skill_label_is_ignored():
    r = _router_with_stub("email_blast", 0.99)
    assert r.route("send an email blast") is None


def test_empty_text_returns_none():
    r = _router_with_stub()
    assert r.route("   ") is None
    assert r.route("") is None


def test_graceful_when_laya_missing(monkeypatch):
    import server.routing.laya_router as lr

    monkeypatch.setattr(lr, "laya_importable", lambda: False)
    r = LayaRouter()
    assert r.route("hello") is None
    assert r.status()["laya_installed"] is False


def test_status_shape():
    st = LayaRouter().status()
    assert set(st) == {
        "laya_installed",
        "checkpoint_cached",
        "available",
        "load_error",
        "skills",
        "confidence_threshold",
    }


def _collect(m: ConversationManager, text: str) -> str:
    async def go():
        parts = []
        async for c in m.respond_text(text):
            parts.append(c.delta)
        return "".join(parts).strip()

    return asyncio.run(go())


def test_fast_router_catches_phrasing_regex_misses(tmp_path):
    # "can you write me a post for linkedin about X" does NOT match the
    # regex router's pattern - this is exactly the gap Laya fills.
    cfg = load_config()
    m = ConversationManager(
        cfg,
        approval_store=ApprovalStore(tmp_path / "a.db"),
        fast_router=_router_with_stub("linkedin_draft", 0.9),
    )
    out = _collect(m, "can you write me a post for linkedin about my internship")
    assert "Here's the draft" in out
    assert "Approve and post this exact text?" in out


def test_no_fast_router_keeps_old_behavior(tmp_path):
    cfg = load_config()
    m = ConversationManager(cfg, approval_store=ApprovalStore(tmp_path / "a.db"))
    decision = m.intent_router.classify(
        "can you write me a post for linkedin about my internship"
    )
    assert decision.tool_name is None  # regex finds no tool...
    assert m._fast_router is None  # ...and no fast router is installed


def test_regex_hit_stays_authoritative_over_laya(tmp_path):
    # Regex matched -> Laya is not even consulted for the tool choice.
    cfg = load_config()
    stub = _router_with_stub("chat", 0.99)  # Laya "disagrees"
    m = ConversationManager(
        cfg, approval_store=ApprovalStore(tmp_path / "a.db"), fast_router=stub
    )
    out = _collect(m, "draft a linkedin post about my hackathon win")
    assert "Here's the draft" in out  # regex hit wins


# ---- live eval: only when the checkpoint is cached (never downloads) ----
LIVE_EVAL = [
    ("draft a linkedin post about my hackathon win", "linkedin_draft"),
    ("write a linkedin post on shipping fast", "linkedin_draft"),
    ("can you draft a post for linkedin about my internship", "linkedin_draft"),
    ("i need a linkedin post about our product launch", "linkedin_draft"),
    ("write me a short linkedin post for the demo day", "linkedin_draft"),
    ("help me write a post for linkedin about ai agents", "linkedin_draft"),
    ("make a linkedin post about finishing my first year", "linkedin_draft"),
    ("compose something for linkedin about the hackathon", "linkedin_draft"),
    ("hello", "chat"),
    ("hi there", "chat"),
    ("what's the weather like today", "chat"),
    ("tell me a joke", "chat"),
    ("what time is it", "chat"),
    ("how does photosynthesis work", "chat"),
    ("what did we talk about yesterday", "chat"),
    ("good morning", "chat"),
    ("explain recursion in simple words", "chat"),
    ("who won the match yesterday", "chat"),
]


@pytest.mark.skipif(not laya_available(), reason="Laya checkpoint not cached")
def test_live_accuracy_and_latency():
    r = LayaRouter()
    assert r.route("hey") is not None  # loads the model (clear chat example)
    correct, confident_wrong, latencies = 0, 0, []
    for text, expected in LIVE_EVAL:
        hit = r.route(text)
        predicted = hit[0] if hit else "<unsure>"
        if hit:
            latencies.append(hit[2])
        if predicted == expected:
            correct += 1
        elif hit:
            confident_wrong += 1
            print(f"\nCONFIDENT MISROUTE: {text!r} -> {predicted} (expected {expected})")
        else:
            print(f"\nunsure (safe fallback): {text!r} (expected {expected})")
    accuracy = correct / len(LIVE_EVAL)
    mean_ms = sum(latencies) / len(latencies)
    print(f"\nLaya live eval: {correct}/{len(LIVE_EVAL)} = {accuracy:.1%}, "
          f"confident misroutes {confident_wrong}, mean latency {mean_ms:.0f}ms")
    # Safety contract: Laya must never confidently pick the wrong skill.
    # "unsure" is fine - the regex router handles those exactly as before.
    assert confident_wrong == 0, f"{confident_wrong} confident misroutes"
    # Latency bar is generous: this VM's CPU is slow (~1.1s/predict here);
    # upstream reports ~33ms on faster hardware. Must still beat an LLM call.
    assert mean_ms < 2500, f"mean latency {mean_ms:.0f}ms too slow for this box"
