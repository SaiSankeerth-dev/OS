"""VoiceEngine — real-time voice layer around ConversationManager.

Pipeline:
    AudioInput -> AEC -> VAD -> STT -> user_text
        -> ConversationManager.respond_text -> ChatChunk stream
        -> SentenceBuffer -> TTSEngine -> AudioQueue (gen_id stamped)
        -> AudioOutput

Generation IDs span the entire response generation. interrupt() bumps the
counter and every downstream consumer silently drops stale items.

Auto barge-in: while the engine is SPEAKING (playing TTS), a background
monitor watches the microphone through AEC + VAD. Sustained user speech
(`barge_in_chunks` consecutive speech chunks) triggers interrupt()
automatically — the user can talk over OS. The speaker reference for AEC
comes from the audio output's rolling playback buffer when available.

The state machine has explicit recovery paths: no failure may leave the
engine permanently stuck in USER_SPEAKING, THINKING, or SPEAKING.
"""
from __future__ import annotations
import asyncio
import logging

from server.conversation.manager import ConversationManager
from server.tts.base import TTSEngine
from server.voice.base import STTService, VADService

from .aec import AEC
from .audio_io import AudioInput, AudioOutput
from .audio_queue import AudioCard, AudioQueue
from .generation import GenerationCounter
from .sentence_buffer import SentenceBuffer
from .states import VoiceState


log = logging.getLogger("os.voice")


class VoiceEngine:
    def __init__(
        self,
        cm: ConversationManager,
        audio_input: AudioInput,
        aec: AEC,
        vad: VADService,
        stt: STTService,
        tts: TTSEngine,
        audio_output: AudioOutput,
        *,
        max_buffer_chars: int = 240,
        barge_in_chunks: int = 4,
    ) -> None:
        self.cm = cm
        self.audio_input = audio_input
        self.aec = aec
        self.vad = vad
        self.stt = stt
        self.tts = tts
        self.audio_output = audio_output
        self.gen = GenerationCounter()
        self.queue = AudioQueue()
        self.buffer = SentenceBuffer(max_chars=max_buffer_chars)
        self.state: VoiceState = VoiceState.IDLE
        self._states: list[VoiceState] = [VoiceState.IDLE]
        self._stopped: bool = False
        self._mic_gated: bool = False
        # Auto barge-in tuning: N consecutive speech chunks while SPEAKING.
        self._barge_in_chunks = max(1, barge_in_chunks)
        self._last_played: bytes | None = None  # fallback AEC reference

    # ---------- state tracking ----------

    def _set_state(self, s: VoiceState) -> None:
        if self.state != s:
            self.state = s
            self._states.append(s)

    def state_history(self) -> list[VoiceState]:
        return list(self._states)

    # ---------- main loop ----------

    async def start_listening(self) -> None:
        self._set_state(VoiceState.LISTENING)
        # Utterance segmentation: VAD-positive chunks are buffered and only
        # transcribed once the user pauses (end-silence) or the segment hits
        # its max length. Transcribing every raw chunk gives Whisper fragments
        # too short to decode, so nothing would ever get answered.
        stt_cfg = getattr(self.stt, "cfg", None)
        chunk_ms = int(getattr(stt_cfg, "chunk_ms", 64) or 64)
        end_silence_ms = int(getattr(stt_cfg, "end_silence_ms", 700) or 700)
        max_segment_ms = int(getattr(stt_cfg, "max_segment_ms", 15000) or 15000)
        silence_needed = max(1, -(-end_silence_ms // chunk_ms))
        max_speech_chunks = max(1, max_segment_ms // chunk_ms)

        buf = bytearray()
        in_speech = False
        silence_chunks = 0
        speech_chunks = 0
        try:
            while not self._stopped:
                raw = await self.audio_input.read_chunk()
                if raw is None:
                    if self._stopped:
                        break
                    await asyncio.sleep(0)
                    continue
                if self._mic_gated:
                    await asyncio.sleep(0)
                    continue
                try:
                    cleaned = self.aec.process(raw, self._speaker_ref(len(raw) // 2))
                    is_speech = self.vad.is_speech(cleaned)
                except Exception:
                    log.exception("input pipeline failure")
                    buf.clear()
                    in_speech = False
                    silence_chunks = 0
                    speech_chunks = 0
                    self._set_state(VoiceState.ERROR)
                    self._set_state(VoiceState.LISTENING)
                    continue
                if is_speech:
                    if not in_speech:
                        in_speech = True
                        self._set_state(VoiceState.USER_SPEAKING)
                    silence_chunks = 0
                    speech_chunks += 1
                    buf.extend(cleaned)
                    if speech_chunks >= max_speech_chunks:
                        await self._flush_utterance(bytes(buf))
                        buf.clear()
                        in_speech = False
                        silence_chunks = 0
                        speech_chunks = 0
                elif in_speech:
                    silence_chunks += 1
                    buf.extend(cleaned)
                    if silence_chunks >= silence_needed:
                        await self._flush_utterance(bytes(buf))
                        buf.clear()
                        in_speech = False
                        silence_chunks = 0
                        speech_chunks = 0
        except Exception:
            log.exception("start_listening crashed")
            self._set_state(VoiceState.ERROR)
            self._set_state(VoiceState.LISTENING)
        finally:
            if self._stopped:
                self._set_state(VoiceState.IDLE)

    async def _flush_utterance(self, audio: bytes) -> None:
        """Transcribe one complete utterance and handle the resulting text."""
        try:
            transcript = await self._stt_transcribe(audio)
        except Exception:
            log.exception("STT failure")
            self._set_state(VoiceState.LISTENING)
            return
        if not transcript or not transcript.strip():
            self._set_state(VoiceState.LISTENING)
            return
        await self._handle_user_text(transcript)

    def _speaker_ref(self, n_samples: int) -> bytes | None:
        """Best-effort speaker reference for AEC (None when unavailable)."""
        fn = getattr(self.audio_output, "speaker_reference", None)
        if callable(fn):
            try:
                return fn(n_samples)
            except Exception:
                log.debug("speaker_reference() failed", exc_info=True)
        # Fallback: most recently played card.
        if self._last_played:
            need = n_samples * 2
            data = self._last_played
            if len(data) < need:
                data = data + b"\x00" * (need - len(data))
            return data[-need:]
        return None

    async def _stt_transcribe(self, audio: bytes) -> str:
        """Transcribe audio, supporting both Transcript-returning and str-returning STT impls."""
        result = self.stt.transcribe(audio)
        # Could be Transcript, str, or coroutine depending on impl
        if asyncio.iscoroutine(result):
            result = await result
        if hasattr(result, "text"):
            return result.text or ""
        return str(result or "")

    async def _handle_user_text(self, text: str) -> None:
        gen = self.gen.bump()
        self.queue.set_gen(gen)
        self._set_state(VoiceState.THINKING)
        spoken_any = False
        try:
            async for chunk in self.cm.respond_text(text):
                if self._is_stale(gen):
                    return
                if chunk.delta:
                    spoken_any = True
                    for sent in self.buffer.push(chunk.delta):
                        await self._synthesize(sent, gen)
            for sent in self.buffer.flush():
                await self._synthesize(sent, gen)
        except Exception:
            log.exception("LLM/tool pipeline failure")
            await self._synthesize("Sorry, something went wrong.", gen)
        if not spoken_any and not self._is_stale(gen):
            await self._synthesize("I didn't catch that.", gen)
        self.enter_speaking()
        await self._drain(gen)
        await self.enter_listening()

    def _is_stale(self, gen: int) -> bool:
        return gen != self.gen.current()

    def enter_speaking(self) -> None:
        self._mic_gated = True
        self._set_state(VoiceState.SPEAKING)

    async def enter_listening(self) -> None:
        import asyncio
        await asyncio.sleep(0.15)
        self._mic_gated = False
        self._set_state(VoiceState.LISTENING)

    async def _synthesize(self, sentence: str, gen: int) -> bool:
        if self._is_stale(gen):
            return False
        try:
            samples = await self.tts.synthesize(sentence)
        except Exception:
            log.exception("TTS failure")
            return False
        await self.queue.put(
            AudioCard(gen_id=gen, sentence=sentence, samples=samples)
        )
        return True

    async def _drain(self, gen: int) -> None:
        """Play queued cards while a background monitor watches for barge-in."""
        monitor = asyncio.create_task(self._barge_in_watch(gen))
        try:
            while not self._is_stale(gen):
                try:
                    card = await asyncio.wait_for(self.queue.get(), timeout=0.05)
                except asyncio.TimeoutError:
                    # nothing more to drain right now
                    return
                if self._is_stale(gen):
                    return
                self._last_played = card.samples
                await self.audio_output.play(card)
        except Exception:
            log.exception("drain/play failure")
        finally:
            monitor.cancel()
            try:
                await monitor
            except asyncio.CancelledError:
                pass

    async def _barge_in_watch(self, gen: int) -> None:
        """Watch the mic during SPEAKING; interrupt on sustained user speech."""
        hits = 0
        while not self._is_stale(gen) and not self._stopped:
            try:
                raw = await self.audio_input.read_chunk(timeout_ms=100)
            except Exception:
                log.exception("barge-in mic read failure")
                await asyncio.sleep(0.05)
                continue
            if raw is None:
                await asyncio.sleep(0)
                continue
            try:
                cleaned = self.aec.process(raw, self._speaker_ref(len(raw) // 2))
                if self.vad.is_speech(cleaned):
                    hits += 1
                else:
                    hits = 0
                if hits >= self._barge_in_chunks:
                    log.info("auto barge-in: user speech detected during playback")
                    self.interrupt()
                    return
            except Exception:
                log.exception("barge-in detection failure")
                hits = 0

    # ---------- control ----------

    def interrupt(self) -> None:
        gen = self.gen.bump()
        self.queue.set_gen(gen)
        self.queue.clear_stale()
        self.buffer.flush()
        self.audio_output.stop()
        self._mic_gated = False  # un-gate: listen for the interrupting user
        self._set_state(VoiceState.LISTENING)

    async def stop(self) -> None:
        self._stopped = True
        self.gen.bump()
        self.queue.set_gen(self.gen.current())
        self.queue.clear_stale()
        self.audio_input.stop()
        self.audio_output.stop()
        self._set_state(VoiceState.IDLE)
