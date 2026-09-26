from server.voice.sentence_buffer import SentenceBuffer


def test_decimal_not_split():
    b = SentenceBuffer()
    out = b.push("Python 3.12.5 is installed.")
    assert out == ["Python 3.12.5 is installed."]


def test_two_sentences():
    b = SentenceBuffer()
    out = b.push("Hello. World!")
    assert out == ["Hello.", "World!"]


def test_abbrev_not_split():
    b = SentenceBuffer()
    out = b.push("Dr. Smith said hi. Bye.")
    assert out == ["Dr. Smith said hi.", "Bye."]


def test_short_fragment_not_flushed():
    b = SentenceBuffer()
    out = b.push("ok.")  # 3 chars, exactly at threshold; not < 3 → flushed
    # actually 3 chars >= 3, so it IS flushed. Use a 2-char fragment.
    b2 = SentenceBuffer()
    out2 = b2.push("o.")
    assert out2 == []


def test_force_flush_on_max_chars():
    b = SentenceBuffer(max_chars=10)
    out = b.push("a" * 25)
    # forced flush returns the over-length remainder as ONE item
    assert any(len(s) == 25 for s in out)


def test_long_input_with_no_punct_forces_flush():
    b = SentenceBuffer(max_chars=10)
    out = b.push("a" * 5 + "." + "b" * 5 + "." + "c" * 25)
    # No terminators get flushed because they are followed by letters;
    # the whole buffer exceeds max_chars so it's force-flushed as one piece.
    assert len(out) == 1
    assert len(out[0]) == 37


def test_flush_returns_remainder():
    b = SentenceBuffer()
    b.push("incomplete sentence")
    rest = b.flush()
    assert rest == ["incomplete sentence"]


def test_flush_idempotent_empty():
    b = SentenceBuffer()
    assert b.flush() == []


def test_multi_clause_streaming():
    b = SentenceBuffer()
    seen = []
    for chunk in ["First", " sentence", ". ", "Second", "!"]:
        seen.extend(b.push(chunk))
    seen.extend(b.flush())
    assert "First sentence." in seen
    assert "Second!" in seen