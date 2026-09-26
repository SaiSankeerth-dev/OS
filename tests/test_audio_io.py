import asyncio
from server.voice.audio_io import MockAudioInput, MockAudioOutput
from server.voice.audio_queue import AudioCard


def test_mock_input_drains_then_none():
    inp = MockAudioInput([b"a", b"b"])

    async def go():
        return [
            await inp.read_chunk(),
            await inp.read_chunk(),
            await inp.read_chunk(),
        ]

    assert asyncio.run(go()) == [b"a", b"b", None]


def test_mock_input_stop_returns_none_immediately():
    inp = MockAudioInput([b"a", b"b"])
    inp.stop()
    assert asyncio.run(inp.read_chunk()) is None


def test_mock_output_records_played_cards():
    out = MockAudioOutput()

    async def go():
        await out.play(AudioCard(gen_id=1, sentence="hi", samples=b"x"))
        await out.play(AudioCard(gen_id=1, sentence="there", samples=b"y"))

    asyncio.run(go())
    assert [c.sentence for c in out.played] == ["hi", "there"]


def test_mock_output_stop_blocks_subsequent_play():
    out = MockAudioOutput()
    out.stop()

    async def go():
        await out.play(AudioCard(gen_id=1, sentence="x", samples=b"x"))

    asyncio.run(go())
    assert out.played == []