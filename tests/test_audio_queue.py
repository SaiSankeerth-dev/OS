import asyncio
from server.voice.audio_queue import AudioCard, AudioQueue


def _card(gen: int, sent: str = "x") -> AudioCard:
    return AudioCard(gen_id=gen, sentence=sent, samples=b"x")


def test_put_get_happy_path():
    async def main():
        q = AudioQueue()
        q.set_gen(1)
        await q.put(_card(1))
        c = await q.get()
        return c.gen_id
    assert asyncio.run(main()) == 1


def test_stale_put_silently_dropped():
    async def main():
        q = AudioQueue()
        q.set_gen(2)
        await q.put(_card(1))
        return q._q.empty()
    assert asyncio.run(main())


def test_stale_get_skipped_returns_next_valid():
    async def main():
        q = AudioQueue()
        q.set_gen(2)
        await q.put(_card(1, "stale"))
        await q.put(_card(2, "new"))
        c = await q.get()
        return c.sentence
    assert asyncio.run(main()) == "new"


def test_clear_stale_drops_old_only():
    async def main():
        q = AudioQueue()
        # Both cards queued under current_gen=1
        q.set_gen(1)
        await q.put(_card(1, "first"))
        await q.put(_card(1, "second"))
        # Bump gen — both are now stale
        q.set_gen(2)
        dropped = q.clear_stale()
        return dropped
    assert asyncio.run(main()) == 2


def test_current_gen_starts_zero():
    assert AudioQueue().current_gen() == 0