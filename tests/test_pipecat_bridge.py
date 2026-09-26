"""Tests for the Pipecat ↔ ConversationManager bridge."""
import asyncio
from server.conversation.manager import ChatChunk
from server.voice.pipecat_bridge import ConversationBridge
from server.voice.sentence_buffer import SentenceBuffer


class _StubCM:
    async def respond_text(self, t):
        yield ChatChunk(delta="Hi there.", done=True)


class _MultiSentenceCM:
    async def respond_text(self, t):
        for piece in ("First. ", "Second. ", "Third."):
            yield ChatChunk(delta=piece)
        yield ChatChunk(done=True)


class _EmptyCM:
    async def respond_text(self, t):
        if False:
            yield
        return


def test_feed_text_emits_sentence():
    async def go():
        bridge = ConversationBridge(_StubCM())
        out = await bridge.feed_text("hello")
        return out
    assert asyncio.run(go()) == ["Hi there."]


def test_feed_text_multi_sentence():
    async def go():
        bridge = ConversationBridge(_MultiSentenceCM())
        out = await bridge.feed_text("hi")
        return out
    sents = asyncio.run(go())
    assert "First." in sents
    assert "Second." in sents
    assert "Third." in sents


def test_feed_text_empty_response_returns_empty():
    async def go():
        bridge = ConversationBridge(_EmptyCM())
        out = await bridge.feed_text("hi")
        return out
    assert asyncio.run(go()) == []


def test_interrupt_clears_buffer():
    async def go():
        bridge = ConversationBridge(_MultiSentenceCM())
        # Start feeding, cancel mid-stream
        task = asyncio.create_task(bridge.feed_text("hi"))
        await asyncio.sleep(0)
        bridge.interrupt()
        try:
            await task
        except asyncio.CancelledError:
            pass
        # After interrupt, no fresh stream run
        out = await bridge.feed_text("hi")
        return out
    sents = asyncio.run(go())
    # The second feed_text runs to completion cleanly
    assert "First." in sents


def test_spoken_sentences_cleared_per_turn():
    async def go():
        bridge = ConversationBridge(_StubCM())
        await bridge.feed_text("turn1")
        after_1 = list(bridge.spoken_sentences)
        await bridge.feed_text("turn2")
        after_2 = list(bridge.spoken_sentences)
        return after_1, after_2
    a1, a2 = asyncio.run(go())
    assert a1 == ["Hi there."]
    assert a2 == ["Hi there."]


def test_process_frame_ignores_unknown_frames():
    async def go():
        bridge = ConversationBridge(_StubCM())
        # Pass a non-pipecat object — bridge should not crash
        await bridge.process_frame(object(), direction=None)
        return True
    assert asyncio.run(go())


def test_process_frame_interruption_calls_interrupt():
    async def go():
        bridge = ConversationBridge(_StubCM())
        from pipecat.frames.frames import InterruptionFrame
        f = InterruptionFrame()
        await bridge.process_frame(f, direction=None)
        return bridge._cancelled
    assert asyncio.run(go())


def test_process_frame_transcription_starts_task():
    async def go():
        bridge = ConversationBridge(_StubCM())
        from pipecat.frames.frames import TranscriptionFrame
        f = TranscriptionFrame(text="hello", user_id="u", timestamp="t")
        await bridge.process_frame(f, direction=None)
        await asyncio.sleep(0.05)
        if bridge._active_task and not bridge._active_task.done():
            await bridge._active_task
        return bridge.spoken_sentences
    sents = asyncio.run(go())
    assert "Hi there." in sents
