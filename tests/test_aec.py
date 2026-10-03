from server.voice.aec import AEC, PassthroughAEC


def test_passthrough_returns_input_unchanged():
    aec = PassthroughAEC()
    assert aec.process(b"\x01\x02\x03") == b"\x01\x02\x03"


def test_passthrough_ignores_speaker_ref():
    aec = PassthroughAEC()
    assert aec.process(b"mic", speaker_ref=b"speaker") == b"mic"


def test_aec_is_a_protocol():
    assert hasattr(AEC, "process")