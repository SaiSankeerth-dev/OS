"""Verification suite for Scenarios A through G from prompt Section 17.

Tests real end-to-end behavior across:
- Scenario A: Conversation & specialist coworker routing
- Scenario B: Approval gating with cryptographic hash binding
- Scenario C: Permission isolation between specialist roles
- Scenario D: Optimistic concurrency revision conflicts in workspaces
- Scenario E: Voice conversation and TTS pipeline integration
- Scenario F: Truthful social connectors (LinkedIn & YouTube)
- Scenario G: Safe recovery and idempotency under failure
"""
import pytest
from fastapi.testclient import TestClient

from jarvis_os.enterprise_runtime import EnterpriseJarvisRuntime
from jarvis_os.runtime import JarvisOSRuntime
from web.server import app

client = TestClient(app)


# -----------------------------------------------------------------------------
# Scenario A: Conversation & Specialist Routing
# -----------------------------------------------------------------------------
def test_scenario_a_conversation_routing():
    kernel = JarvisOSRuntime(db_path=":memory:")

    # 1. User submits coding/math query -> Forge selected
    res_math = kernel.handle_command("calculate (100 * 5) + 25")
    assert res_math["status"] == "completed"
    assert res_math["dot"] == "Forge"
    assert "525" in res_math["response"]
    assert res_math["telemetry"]["latency_ms"] > 0

    # 2. User submits system diagnostics -> Sentinel selected
    res_diag = kernel.handle_command("Give me the system diagnostic and status")
    assert res_diag["status"] == "completed"
    assert res_diag["dot"] == "Sentinel"
    assert "subsystems nominal" in res_diag["response"]

    # 3. User submits documentation -> Scribe selected
    res_doc = kernel.handle_command("Draft a note for the architecture space")
    assert res_doc["status"] == "completed"
    assert res_doc["dot"] == "Scribe"


# -----------------------------------------------------------------------------
# Scenario B: Approval Gating & Verification
# -----------------------------------------------------------------------------
def test_scenario_b_approval_lifecycle():
    kernel = JarvisOSRuntime(db_path=":memory:")

    # 1. Sensitive action proposed
    cmd = "echo pending-action-step"
    res = kernel.handle_command(
        "Run deployment command",
        preferred_dot="forge",
        action_type="shell_exec",
        action_payload=cmd,
    )
    assert res["status"] == "waiting_approval"
    assert kernel.state == "WAITING_APPROVAL"
    card = res["approval_card"]
    apr_id = card["approval_id"]
    assert card["arguments_hash"] is not None

    # 2. Denial prevents execution
    denied = kernel.resolve_approval(apr_id, "deny")
    assert denied["status"] == "denied"
    assert apr_id not in kernel.safety.pending_approvals
    assert "execution_result" not in denied or denied.get("execution_result") is None

    # 3. New sensitive action proposed and approved -> resumes and executes authorized operation
    res2 = kernel.handle_command(
        "Run approved deployment",
        preferred_dot="forge",
        action_type="shell_exec",
        action_payload="echo resumed-and-executed-ok",
    )
    apr_id2 = res2["approval_card"]["approval_id"]
    approved = kernel.resolve_approval(apr_id2, "allow_once")
    assert approved["status"] == "approved"
    assert approved["execution_status"] == "executed"
    assert approved["execution_result"] is not None
    assert "resumed-and-executed-ok" in approved["execution_result"].get("stdout", "")

    # 4. Verified: subsequent execution under always_allow policy auto-executes
    res3_pending = kernel.handle_command(
        "Always allow test",
        preferred_dot="forge",
        action_type="shell_exec",
        action_payload="echo always-allow-cmd",
    )
    apr_id3 = res3_pending["approval_card"]["approval_id"]
    kernel.resolve_approval(apr_id3, "always_allow")

    res4 = kernel.handle_command(
        "Auto-executed command",
        preferred_dot="forge",
        action_type="shell_exec",
        action_payload="echo auto-cmd",
    )
    assert res4["status"] == "completed"

    # 5. Audit log contains the full decision and execution history
    events = [entry["event"] for entry in kernel.safety.audit_log]
    assert "WAITING_APPROVAL" in events
    assert "RESOLVED_DENY" in events
    assert "EXECUTED_APPROVED_ACTION" in events


# -----------------------------------------------------------------------------
# Scenario C: Permission Isolation
# -----------------------------------------------------------------------------
def test_scenario_c_permission_isolation():
    kernel = JarvisOSRuntime(db_path=":memory:")

    # Scout only holds {'browser', 'memory'}, NOT 'shell'
    res = kernel.handle_command(
        "Execute build script",
        preferred_dot="scout",
        action_type="shell_exec",
        action_payload="bash build.sh",
    )
    assert res["status"] == "permission_denied"
    assert "missing 'shell'" in res["error"]
    assert kernel.state == "ERROR"

    # Sentinel only holds {'memory'}, NOT 'files'
    res2 = kernel.handle_command(
        "Overwrite system file",
        preferred_dot="sentinel",
        action_type="file_write",
        action_payload="bad data",
    )
    assert res2["status"] == "permission_denied"
    assert "missing 'files'" in res2["error"]


# -----------------------------------------------------------------------------
# Scenario D: Workspace Revision & Concurrent Conflict Detection
# -----------------------------------------------------------------------------
def test_scenario_d_workspace_revision_conflict():
    kernel = JarvisOSRuntime(db_path=":memory:")

    # 1. Document opened at revision 1
    r1 = kernel.memory.save_page(
        space_id="engineering-hq",
        page_id="core-architecture",
        title="Architecture",
        markdown="# Section 1: Core",
        author="Sai",
    )
    assert r1["status"] == "created"
    assert r1["revision"] == 1

    # 2. Another actor updates it -> becomes revision 2
    r2 = kernel.memory.save_page(
        space_id="engineering-hq",
        page_id="core-architecture",
        title="Architecture v2",
        markdown="# Section 1: Core\n# Section 2: Storage",
        author="Scribe",
        expected_revision=1,
    )
    assert r2["status"] == "updated"
    assert r2["revision"] == 2

    # 3. First actor attempts to save stale content expecting revision 1
    r_conflict = kernel.memory.save_page(
        space_id="engineering-hq",
        page_id="core-architecture",
        title="Stale Overwrite Attempt",
        markdown="# Stale Section 1",
        author="Sai",
        expected_revision=1,
    )
    assert r_conflict["status"] == "conflict"
    assert "Revision mismatch" in r_conflict["error"]
    assert r_conflict["current_revision"] == 2

    # 4. Content at revision 2 was not overwritten
    page = kernel.memory.get_page("core-architecture")
    assert page["revision"] == 2
    assert "Section 2: Storage" in page["markdown"]

    # 5. Concurrent multi-threaded conflict check
    import concurrent.futures
    conflicts = []
    successes = []

    def try_save(actor_id: int):
        res = kernel.memory.save_page(
            space_id="engineering-hq",
            page_id="core-architecture",
            title=f"Concurrent Edit {actor_id}",
            markdown=f"# Content from {actor_id}",
            author=f"Actor-{actor_id}",
            expected_revision=2,
        )
        if res.get("status") == "conflict":
            conflicts.append(res)
        elif res.get("status") == "updated":
            successes.append(res)

    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(try_save, i) for i in range(5)]
        concurrent.futures.wait(futures)

    # Exactly one succeeded and the other 4 collided with revision conflicts
    assert len(successes) == 1
    assert len(conflicts) == 4


# -----------------------------------------------------------------------------
# Scenario E: Voice Integration & Pipeline
# -----------------------------------------------------------------------------
def test_scenario_e_voice_integration():
    import asyncio
    from server.conversation.manager import ChatChunk
    from server.tts.mock import MockTTS
    from server.voice.aec import PassthroughAEC
    from server.voice.audio_io import MockAudioInput, MockAudioOutput
    from server.voice.engine import VoiceEngine
    from server.voice.states import VoiceState

    # 1. State machine enum check
    assert VoiceState.IDLE.value == "IDLE"
    assert VoiceState.LISTENING.value == "LISTENING"
    assert VoiceState.SPEAKING.value == "SPEAKING"

    # 2. Drive simulated VoiceEngine turn
    class _TestCM:
        async def respond_text(self, text: str):
            yield ChatChunk(delta="OS voice test complete.", done=True)

    class _TestSTT:
        async def transcribe(self, audio: bytes) -> str:
            return "system status report"

    class _TestVAD:
        def is_speech(self, audio: bytes) -> bool:
            return audio != b"\x00" * 64

    inp = MockAudioInput([b"data"] * 4 + [b"\x00" * 64] * 12)
    out = MockAudioOutput()
    engine = VoiceEngine(
        cm=_TestCM(),
        audio_input=inp,
        aec=PassthroughAEC(),
        vad=_TestVAD(),
        stt=_TestSTT(),
        tts=MockTTS(),
        audio_output=out,
    )

    async def _run_voice():
        task = asyncio.create_task(engine.start_listening())
        await asyncio.sleep(0.05)
        await engine.stop()
        try:
            await task
        except asyncio.CancelledError:
            pass

    asyncio.run(_run_voice())
    history = engine.state_history()
    assert VoiceState.LISTENING in history
    assert VoiceState.IDLE in history

    # 3. Web API voice synthesis endpoint
    res = client.post("/api/hud/voice/speak", json={"text": "Hello from OS Cyber-HUD"})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert data["bytes_synthesized"] > 0
    assert data["audio_base64"]


# -----------------------------------------------------------------------------
# Scenario F: Connector Truthfulness
# -----------------------------------------------------------------------------
def test_scenario_f_connector_truthfulness():
    ent = EnterpriseJarvisRuntime(db_path=":memory:")

    # 1. LinkedIn post formatting
    draft = ent.linkedin.format_post("Distributed Agents", ["Isolation", "Zero Trust"])
    assert draft["platform"] == "LinkedIn"
    assert draft["status"] == "draft_ready"
    assert "Distributed Agents" in draft["content"]

    # 2. LinkedIn publish without configured token honestly fails
    pub_res = ent.linkedin.publish_post(draft["content"], token=None)
    assert pub_res["published"] is False
    assert pub_res["status"] == "unauthorized"
    assert "not configured" in pub_res["error"]

    # 3. YouTube truthful summarization (never hallucinates fabricated AG-UI bullets)
    yt_summary = ent.youtube.summarize_video("https://youtube.com/watch?v=sample-video", "Real Engineering Video")
    assert yt_summary["platform"] == "YouTube"
    assert yt_summary["citations"] == ["https://youtube.com/watch?v=sample-video"]
    assert yt_summary["title"] == "Real Engineering Video"
    for bullet in yt_summary["key_takeaways"]:
        assert "AG-UI event streams" not in bullet, "Fabricated bullet detected!"


# -----------------------------------------------------------------------------
# Scenario G: Recovery & Idempotency
# -----------------------------------------------------------------------------
def test_scenario_g_recovery_and_idempotency():
    kernel = JarvisOSRuntime(db_path=":memory:")

    # 1. Destructive pattern encounters safety gate -> safe error state
    res = kernel.handle_command(
        "Wipe everything",
        preferred_dot="forge",
        action_type="shell_exec",
        action_payload="rm -rf / --no-preserve-root",
    )
    assert res["status"] == "blocked"
    assert kernel.state == "ERROR"

    # 2. Recoverable transition on subsequent clean command
    res2 = kernel.handle_command("What is the status of the system?")
    assert res2["status"] == "completed"
    assert kernel.state in ("STANDBY", "IDLE")
