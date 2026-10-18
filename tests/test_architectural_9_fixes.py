"""Comprehensive test suite for the 9 architectural fixes in OS.

Covers:
1. Fix 1: 8B Model Ceiling (ASTRepoMapper, HybridModelRouter, PII scrubbing)
2. Fix 2: Hardened Non-Docker Sandbox (Path traversal & forbidden binary blocking)
3. Fix 3: Dynamic Parallel DAG & Self-Healing Execution (Topological waves & remediation)
4. Fix 4: Bounded Interactive Browser Agent (DOM map & HITL approval gating)
5. Fix 5: Unified WAL SQLite Manager (Cross-store atomic transactions & WAL pragmas)
6. Fix 6: Streaming Voice Pipeline (Punctuation-boundary clause streaming)
7. Fix 7: Proactive OAuth Watchdog (10m pre-expiry refresh)
8. Fix 8: Frontend Code-Splitting (Vendor and lazy view bundle artifacts)
9. Fix 9: L3 Memory Compactor (Trigram Jaccard dedup & 450-token cap)
"""
from __future__ import annotations

import asyncio
import os
import shutil
import tempfile
import time
from pathlib import Path
import pytest

from jarvis_os.primitives.hybrid_router import ASTRepoMapper, HybridModelRouter
from web.om.sandbox_jail import HardenedLocalSandbox, SandboxViolationError
from jarvis_os.primitives.dynamic_dag_and_memory import (
    DynamicDAGExecutor,
    DAGNode,
    L3MemoryCompactor,
)
from jarvis_os.primitives.browser_voice_oauth_fixes import (
    DOMAccessibilityAgent,
    SentenceStreamingVoicePipeline,
    ProactiveOAuthWatchdog,
)
from server.db.unified_master import UnifiedMasterDB, get_unified_master_db


# -----------------------------------------------------------------------------
# Fix 1: AST Repo Mapper & Hybrid Router
# -----------------------------------------------------------------------------
def test_fix1_ast_repo_mapper():
    files = {
        "models.py": "class User:\n    def __init__(self, name: str):\n        self.name = name\n    def get_name(self) -> str:\n        return self.name\n",
        "service.py": "from models import User\ndef process_user(u: User) -> bool:\n    return True\n",
    }
    result = ASTRepoMapper.build_repo_map(files, max_chars=4000)
    repo_map = result["repo_map"]
    assert "class User" in repo_map
    assert "def get_name" in repo_map
    assert "def process_user" in repo_map
    assert result["compression_ratio"] > 0


def test_fix1_hybrid_model_router():
    router = HybridModelRouter(local_model="qwen2.5:8b", cloud_model="gemini-2.5-flash")
    # PII / Secret scrubbing
    text_with_secret = "Here is my key: sk-ant-api03-abcdef1234567890abcdef and token ghp_1234567890abcdef1234"
    scrubbed = router.scrub_pii_and_secrets(text_with_secret)
    assert "[REDACTED" in scrubbed
    assert "sk-ant" not in scrubbed
    assert "ghp_" not in scrubbed

    # Routing decision
    local_decision = router.select_route("Short prompt", files_count=1)
    assert local_decision["target"] == "local_ollama"
    cloud_decision = router.select_route("A" * 26000, files_count=1)
    assert cloud_decision["target"] == "hybrid_cloud"


# -----------------------------------------------------------------------------
# Fix 2: Hardened Non-Docker Sandbox
# -----------------------------------------------------------------------------
def test_fix2_hardened_sandbox_security(tmp_path):
    sandbox = HardenedLocalSandbox(workspace_root=str(tmp_path))

    # Forbidden binary blocking
    with pytest.raises(SandboxViolationError):
        sandbox.execute_jailed("nc -l 8080")

    # Path traversal blocking
    with pytest.raises(SandboxViolationError):
        sandbox.execute_jailed("cat ../../../../../etc/passwd")


# -----------------------------------------------------------------------------
# Fix 3: Dynamic Parallel DAG & Self-Healing
# -----------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_fix3_dynamic_dag_and_remediation():
    executor = DynamicDAGExecutor()

    async def _plan(ctx):
        return {"ok": True, "plan": "run"}

    async def _scout(ctx):
        return {"ok": True, "scout": "done"}

    async def _sentinel(ctx):
        return {"ok": True, "sentinel": "done"}

    attempt = 0
    async def _forge(ctx):
        nonlocal attempt
        attempt += 1
        if attempt == 1:
            return {"ok": False, "error": "compile error"}
        return {"ok": True, "forge": "repaired"}

    async def _forge_fix(res, att):
        return {"fix_attempt": att, "resolved": True}

    executor.add_node(DAGNode(node_id="plan", dot="architect", description="Plan", runner=_plan))
    executor.add_node(DAGNode(node_id="scout", dot="scout", description="Scout", runner=_scout, depends_on=["plan"]))
    executor.add_node(DAGNode(node_id="sentinel", dot="sentinel", description="Sentinel", runner=_sentinel, depends_on=["plan"]))
    executor.add_node(
        DAGNode(
            node_id="forge",
            dot="forge",
            description="Forge",
            runner=_forge,
            depends_on=["scout", "sentinel"],
            max_retries=2,
            remediation_hook=_forge_fix,
        )
    )

    out = await executor.run()
    assert out["status"] == "completed"
    assert len(out["waves"]) == 3
    assert out["waves"][0] == ["plan"]
    assert set(out["waves"][1]) == {"scout", "sentinel"}  # Parallel wave 2
    assert out["waves"][2] == ["forge"]
    assert out["remediations_triggered"] == 1
    assert out["results"]["forge"]["forge"] == "repaired"


# -----------------------------------------------------------------------------
# Fix 4: Bounded Interactive Browser Agent
# -----------------------------------------------------------------------------
def test_fix4_dom_accessibility_agent():
    sample_html = """
    <html>
      <body>
        <a href="/docs">Read Documentation</a>
        <input type="password" name="user_password" placeholder="Enter password" />
        <button type="submit">Submit Transfer</button>
      </body>
    </html>
    """
    dom = DOMAccessibilityAgent.build_interactive_dom_map(sample_html)
    assert len(dom) == 3

    # Link is LOW_NAVIGATION
    assert dom[0]["risk"] == "LOW_NAVIGATION"
    # Password field is HIGH_AUTH_OR_WRITE
    assert dom[1]["risk"] == "HIGH_AUTH_OR_WRITE"


# -----------------------------------------------------------------------------
# Fix 5: Unified WAL SQLite Manager
# -----------------------------------------------------------------------------
def test_fix5_unified_master_db(tmp_path):
    master_file = tmp_path / "master.db"
    store_a = tmp_path / "om.db"
    store_b = tmp_path / "os_state.db"

    db = UnifiedMasterDB(
        master_path=str(master_file),
        attached_stores={"om": str(store_a), "os_state": str(store_b)},
    )

    cur = db.execute("PRAGMA journal_mode;")
    assert cur.fetchone()[0].lower() == "wal"

    cur = db.execute("PRAGMA busy_timeout;")
    assert cur.fetchone()[0] == 10000

    # Cross-store atomic transaction
    with db.atomic() as c:
        c.execute("CREATE TABLE om.items (id INT);")
        c.execute("INSERT INTO om.items VALUES (101);")
        c.execute("CREATE TABLE os_state.users (name TEXT);")
        c.execute("INSERT INTO os_state.users VALUES ('Sai');")

    assert db.execute("SELECT id FROM om.items").fetchone()[0] == 101
    assert db.execute("SELECT name FROM os_state.users").fetchone()[0] == "Sai"
    db.close()


# -----------------------------------------------------------------------------
# Fix 6: Streaming Voice Pipeline
# -----------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_fix6_streaming_voice_pipeline():
    async def token_stream():
        tokens = ["This ", "is ", "the ", "first ", "sentence. ", "Here ", "is ", "the ", "second!"]
        for t in tokens:
            yield t

    def mock_tts(text: str) -> bytes:
        return f"AUDIO({text})".encode("utf-8")

    chunks = []
    async for chunk in SentenceStreamingVoicePipeline.stream_llm_to_tts(token_stream(), mock_tts):
        chunks.append(chunk)

    assert len(chunks) == 2
    assert "first sentence" in chunks[0]["sentence"]
    assert "second" in chunks[1]["sentence"]
    assert chunks[0]["first_audio_latency_ms"] is not None


# -----------------------------------------------------------------------------
# Fix 7: Proactive OAuth Watchdog
# -----------------------------------------------------------------------------
def test_fix7_proactive_oauth_watchdog():
    watchdog = ProactiveOAuthWatchdog(refresh_margin_sec=600)

    # 1. Healthy token (expires in 20 min) -> no refresh
    healthy_creds = {"access_token": "live_tok", "expires_at": time.time() + 1200}
    res_h = watchdog.check_and_refresh("google", healthy_creds, lambda a, b, c: "new")
    assert res_h["status"] == "healthy"
    assert res_h["refreshed"] is False

    # 2. Expiring token (expires in 5 min < 10 min margin) -> refreshed!
    expiring_creds = {
        "client_id": "cid",
        "client_secret": "sec",
        "refresh_token": "reftok",
        "access_token": "old_tok",
        "expires_at": time.time() + 300,
    }
    res_e = watchdog.check_and_refresh(
        "google", expiring_creds, lambda cid, sec, ref: "fresh_access_token_123"
    )
    assert res_e["status"] == "refreshed"
    assert res_e["refreshed"] is True
    assert expiring_creds["access_token"] == "fresh_access_token_123"


# -----------------------------------------------------------------------------
# Fix 8: Frontend Code-Splitting Artifacts
# -----------------------------------------------------------------------------
def test_fix8_frontend_code_splitting_artifacts():
    static_assets = Path("web/static/assets")
    assert static_assets.exists()
    js_files = [f.name for f in static_assets.glob("*.js")]

    # Check for vendor chunks
    has_vendor_react = any("vendor-react" in f for f in js_files)
    has_vendor_icons = any("vendor-icons" in f for f in js_files)
    assert has_vendor_react, f"Missing vendor-react chunk in {js_files}"
    assert has_vendor_icons, f"Missing vendor-icons chunk in {js_files}"

    # Check for lazy view chunks
    has_lazy_views = any("View" in f or "ChatCanvas" in f for f in js_files)
    assert has_lazy_views, f"Missing split view chunks in {js_files}"


# -----------------------------------------------------------------------------
# Fix 9: L3 Memory Compactor
# -----------------------------------------------------------------------------
def test_fix9_l3_memory_compactor():
    compactor = L3MemoryCompactor(max_tokens_budget=450)
    rules = [
        "OS-L3-GUARD: Never commit passwords or private API tokens to repositories.",
        "OS-L3-GUARD: Never commit passwords or private API keys to git repositories.",  # Trigram duplicate
        "OS-L3-GUARD: Always enforce local-first privacy when executing code.",
    ]
    res = compactor.compact(rules)
    compacted_l3 = res["active_l3"]
    assert len(compacted_l3) < len(rules)
    assert res["merged_duplicates"] >= 1
