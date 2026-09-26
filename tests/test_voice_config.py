"""Tests for the voice configuration section (config/settings.yaml)."""
from config import load_config


def test_voice_config_defaults():
    cfg = load_config()
    v = cfg.voice
    assert v.sample_rate_in == 16000
    assert v.sample_rate_out == 24000
    assert v.channels == 1
    assert v.chunk_ms == 64
    assert v.vad_backend == "silero"
    assert v.vad_threshold == 0.5
    assert v.aec == "nlms"
    assert v.aec_filter_len == 256
    assert v.barge_in_chunks == 4
    assert v.stt_model == "small"
    assert v.stt_device == "cpu"
    assert v.stt_compute_type == "int8"
    assert v.tts_engine == "pocket-tts"
    assert v.input_device is None
    assert v.output_device is None


def test_voice_config_local_override(tmp_path):
    settings = tmp_path / "settings.yaml"
    settings.write_text("voice:\n  sample_rate_in: 48000\n  barge_in_chunks: 6\n")
    cfg = load_config(config_dir=tmp_path)
    assert cfg.voice.sample_rate_in == 48000
    assert cfg.voice.barge_in_chunks == 6
    # Untouched keys keep defaults.
    assert cfg.voice.sample_rate_out == 24000


def test_voice_config_local_yaml_overlay(tmp_path):
    settings = tmp_path / "settings.yaml"
    settings.write_text("voice:\n  aec: passthrough\n")
    local = tmp_path / "local.yaml"
    local.write_text("voice:\n  input_device: 'USB Mic'\n")
    cfg = load_config(config_dir=tmp_path)
    assert cfg.voice.aec == "passthrough"
    assert cfg.voice.input_device == "USB Mic"
