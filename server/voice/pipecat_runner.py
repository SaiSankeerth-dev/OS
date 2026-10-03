"""Run a real Pipecat voice loop with ConversationManager.

Flow:
  mic -> LocalAudioTransport.input -> Silero VAD -> Whisper STT
       -> ConversationBridge (calls ConversationManager.respond_text)
       -> SentenceBuffer-fed TextFrames -> PocketTTS -> LocalAudioTransport.output
       -> speaker

Usage:
  python -m server.voice.pipecat_runner

Requires:
  - Local mic + speaker
  - Ollama running on http://localhost:11434 with qwen3:8b loaded
  - Pocket TTS model auto-downloads on first run
  - faster-whisper model auto-downloads on first run
"""
from __future__ import annotations
import asyncio
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from config import load_config
from server.conversation.manager import ConversationManager
from server.intent.router import IntentRouter
from server.intent.registry import ToolRegistry
from server.tools.datetime_tool import DATETIME_SPEC, format_datetime, get_current_datetime
from server.response.policy import ResponsePolicy
from server.voice.pipecat_bridge import ConversationBridge

from pipecat.audio.vad.silero import SileroVADAnalyzer
from pipecat.pipeline.pipeline import Pipeline
from pipecat.processors.audio.vad_processor import VADProcessor
from pipecat.services.pocket_tts.tts import PocketTTSService
from pipecat.services.whisper.stt import WhisperSTTService
from pipecat.transports.local.audio import LocalAudioTransport, LocalAudioTransportParams
from server.voice.self_echo_gate import SelfEchoGate


async def run() -> None:
    cfg = load_config()
    cm = ConversationManager(
        cfg,
        intent_router=IntentRouter(),
        tool_registry=ToolRegistry(),
        response_policy=ResponsePolicy(forbidden_prefixes=cfg.personality.forbidden_phrases),
    )
    cm.tool_registry.register(DATETIME_SPEC, get_current_datetime, format_datetime)

    print("[os] loading pipecat services...")
    v = cfg.voice
    transport = LocalAudioTransport(
        params=LocalAudioTransportParams(
            audio_in_enabled=True,
            audio_out_enabled=True,
            audio_in_sample_rate=v.sample_rate_in,
            audio_out_sample_rate=v.sample_rate_out,
        )
    )
    vad_analyzer = SileroVADAnalyzer()
    vad = VADProcessor(vad_analyzer=vad_analyzer)
    stt = WhisperSTTService(
        settings=WhisperSTTService.Settings(model=v.stt_model),
        device=v.stt_device,
        compute_type=v.stt_compute_type,
    )
    tts = PocketTTSService()
    bridge = ConversationBridge(cm)

    pipeline = Pipeline(
        [
            transport.input(),
            vad,
            SelfEchoGate(),
            stt,
            bridge,
            tts,
            transport.output(),
        ]
    )

    print("[os] starting voice loop. speak into the mic.")
    from pipecat.pipeline.runner import PipelineRunner
    from pipecat.pipeline.task import PipelineTask
    task = PipelineTask(pipeline)
    runner = PipelineRunner(handle_sigint=False)
    runner.add_workers(task)
    await runner.run(task)


def main() -> None:
    try:
        asyncio.run(run())
    except KeyboardInterrupt:
        print("\n[os] exiting")


if __name__ == "__main__":
    main()
