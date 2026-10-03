from server.voice.generation import GenerationCounter


def test_initial_zero():
    assert GenerationCounter().current() == 0


def test_bump_increments():
    g = GenerationCounter()
    assert g.bump() == 1
    assert g.bump() == 2
    assert g.current() == 2