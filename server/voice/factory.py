"""Factory: build a real VoiceEngine from the voice config section.

Single entry point for the hardware voice pipeline:

    AudioInput(sounddevice) -> NlmsAEC -> VADService(Silero)
        -> STTService(faster-whisper) -> ConversationManager
        -> PocketTTSEngine -> AudioQueue -> AudioOutput(sounddevice)

All knobs come from `config/settings.yaml` (`voice:`) with `local.yaml`
overrides — no hardcoded sample rates or device choices.
"""
from __future__ import annotations

import logging

from config import Config

log = logging.getLogger("os.voice.factory")


def build_voice_engine(cm, cfg: Config):
    """Build a fully real VoiceEngine from config. Raises RuntimeError with a
    clear message if audio hardware or a model is unavailable."""
    from .aec import NlmsAEC, PassthroughAEC
    from .audio_io import SoundDeviceAudioInput, SoundDeviceAudioOutput
    from .engine import VoiceEngine
    from .stt import STTService, STTServiceConfig
    from .vad import VADService
    from server.tts.mock import MockTTS
    from server.tts.pocket import PocketTTSEngine

    v = cfg.voice
    chunk_samples = max(1, int(v.sample_rate_in * v.chunk_ms / 1000))

    log.info(
        "building voice pipeline: in=%s@%dHz out=%s@%dHz vad=%s aec=%s stt=%s tts=%s",
        v.input_device, v.sample_rate_in, v.output_device, v.sample_rate_out,
        v.vad_backend, v.aec, v.stt_model, v.tts_engine,
    )

    audio_input = SoundDeviceAudioInput(
        sample_rate=v.sample_rate_in,
        channels=v.channels,
        chunk_samples=chunk_samples,
        device=v.input_device,
    )
    audio_output = SoundDeviceAudioOutput(
        sample_rate=v.sample_rate_out,
        channels=v.channels,
        device=v.output_device,
    )

    if v.aec == "nlms":
        aec = NlmsAEC(sample_rate=v.sample_rate_in, filter_len=v.aec_filter_len)
    elif v.aec == "passthrough":
        aec = PassthroughAEC()
    else:
        raise RuntimeError(f"unknown voice.aec={v.aec!r} (expected 'nlms'/'passthrough')")

    vad = VADService(
        sampling_rate=v.sample_rate_in,
        threshold=v.vad_threshold,
        use_silero=(v.vad_backend == "silero"),
    )
    if v.vad_backend == "silero" and vad.backend != "silero":
        log.warning("Silero VAD requested but unavailable; energy fallback active")

    stt = STTService(
        STTServiceConfig(
            model_size=v.stt_model,
            device=v.stt_device,
            compute_type=v.stt_compute_type,
            language=v.stt_language,
            sample_rate=v.sample_rate_in,
            chunk_ms=v.chunk_ms,
        )
    )

    if v.tts_engine == "pocket-tts":
        tts = PocketTTSEngine()
    elif v.tts_engine == "mock":
        tts = MockTTS()
    else:
        raise RuntimeError(
            f"unknown voice.tts_engine={v.tts_engine!r} (expected 'pocket-tts'/'mock')"
        )

    return VoiceEngine(
        cm=cm,
        audio_input=audio_input,
        aec=aec,
        vad=vad,
        stt=stt,
        tts=tts,
        audio_output=audio_output,
        barge_in_chunks=v.barge_in_chunks,
    )
