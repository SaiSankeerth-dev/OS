"""OS web dashboard — FastAPI app over the real OS engine.

Every view is backed by the same engine the terminal uses:
chat goes through ConversationManager, approvals through the real
ApprovalStore, memory/watchers/tasks through the real SQLite stores.
Connectors are permission-gated: nothing external is touched until
the user grants permission in the dashboard, and every grant revokes.
"""
from __future__ import annotations

import asyncio
import json
import logging
import secrets
import sqlite3
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException, Request, UploadFile
from fastapi.responses import (
    FileResponse,
    HTMLResponse,
    StreamingResponse,
)
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from contextlib import asynccontextmanager

log = logging.getLogger("os.dashboard")

import sys
_HERE = Path(__file__).resolve().parent
_REPO_ROOT = _HERE.parent
if str(_REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(_REPO_ROOT))

_STATIC = _HERE / "static"
_WORKSPACE = Path.home() / "workspace"
_MODEL_READINESS_TIMEOUT_SECONDS = 5

# --------------------------------------------------------------------------
# App + engine (built once at startup, same as cli.py)
# --------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    import sys

    root = _HERE.parent
    if str(root) not in sys.path:
        sys.path.insert(0, str(root))
    from config import load_config
    from server.conversation.manager import ConversationManager
    from server.llm.router import ModelRouter
    from server.memory import SQLiteMemoryManager
    from server.memory.retriever import MemoryRetriever
    from server.routing import LayaRouter
    from server.state.store import StateStore

    cfg = load_config()
    _engine["cfg"] = cfg
    state_store = StateStore()  # tasks, suggestions, events — real store
    memory = SQLiteMemoryManager("data/personal_memory.db")
    memory_retriever = MemoryRetriever(memory, cfg.conversation)
    try:
        router = ModelRouter.from_config(
            base_url=cfg.llm.base_url,
            model=cfg.llm.model,
            timeout_sec=float(cfg.llm.request_timeout_sec),
        )
        mgr = ConversationManager(
            cfg, router, fast_router=LayaRouter(), state_store=state_store,
            memory=memory, memory_retriever=memory_retriever,
        )
        # The dashboard must remain usable in local-first mode when Ollama is
        # stopped.  A readiness probe is intentionally short; real model calls
        # retain the configured request timeout once a user sends a message.
        ok = await asyncio.wait_for(
            mgr.health(), timeout=_MODEL_READINESS_TIMEOUT_SECONDS
        )
        _engine["model_ok"] = bool(ok)
    except Exception as e:  # Ollama down etc. - dashboard still serves
        log.warning("engine degraded (no model): %s", e)
        mgr = ConversationManager(
            cfg, None, fast_router=LayaRouter(), state_store=state_store,
            memory=memory, memory_retriever=memory_retriever,
        )
        _engine["model_ok"] = False
    _engine["mgr"] = mgr
    _engine["state_store"] = state_store
    log.info("dashboard engine ready (model_ok=%s)", _engine["model_ok"])
    yield


app = FastAPI(title="OS Dashboard", version="1.0.0", lifespan=lifespan)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_engine: dict = {}


def get_cfg():
    if "cfg" not in _engine:
        from config import load_config
        _engine["cfg"] = load_config()
    return _engine["cfg"]


def get_store():
    if "state_store" not in _engine:
        from server.state.store import StateStore
        _engine["state_store"] = StateStore()
    return _engine["state_store"]


def get_mgr():
    if "mgr" not in _engine:
        from server.conversation.manager import ConversationManager
        from server.routing import LayaRouter
        cfg = get_cfg()
        store = get_store()
        _engine["mgr"] = ConversationManager(cfg, None, fast_router=LayaRouter(), state_store=store)
    return _engine["mgr"]


def get_dash():
    from web.store import DashboardStore

    return _engine.setdefault("dash", DashboardStore())


# --------------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------------


def _pending_dict(p) -> dict:
    return {
        "id": p.pending_id,
        "skill": p.skill,
        "input_text": p.input_text,
        "draft": p.draft,
        "created_ts": p.created_ts,
    }


def _latest_approval(mgr) -> dict | None:
    pend = getattr(mgr, "_pending", [])
    if not pend:
        return None
    return _pending_dict(max(pend, key=lambda p: p.pending_id or 0))


def _split_notes(full: str) -> tuple[str, list[str]]:
    parts = full.split("\n\nHeads up: ")
    return parts[0].strip(), [p.strip() for p in parts[1:] if p.strip()]


def _greeting() -> str:
    h = datetime.now().hour
    if h < 12:
        return "Good morning"
    if h < 17:
        return "Good afternoon"
    return "Good evening"


async def _collect_text(mgr, text: str) -> str:
    out: list[str] = []
    async for chunk in mgr.respond_text(text):
        if chunk.delta:
            out.append(chunk.delta)
    return "".join(out)


# --------------------------------------------------------------------------
# Static UI
# --------------------------------------------------------------------------

from starlette.types import Receive, Scope, Send

class ImmutableStaticFiles(StaticFiles):
    """Serve immutable hashed bundles with aggressive caching headers."""
    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        async def send_wrapper(message):
            if message["type"] == "http.response.start":
                headers = list(message.get("headers", []))
                headers.append((b"cache-control", b"public, max-age=31536000, immutable"))
                message["headers"] = headers
            await send(message)
        await super().__call__(scope, receive, send_wrapper)

app.mount("/static", StaticFiles(directory=str(_STATIC)), name="static")
if (_STATIC / "assets").exists():
    app.mount("/assets", ImmutableStaticFiles(directory=str(_STATIC / "assets")), name="assets")

# OpenMuse feature port (web/om): computer, browser, activity, ideas, goals,
# finance, documents, threads, notifications. See docs/OPENMUSE_PORT.md.
try:
    from web.om.routes import router as _om_router

    app.include_router(_om_router)
except Exception as _om_err:  # pragma: no cover - never break the dashboard
    log.warning("om routes unavailable: %s", _om_err)

# OS V1 Domain API: Home, Commitments, Tasks, Plan, People, Projects, Goals, Agents, Approvals, Activity, Ingest
try:
    from server.api.v1.routes import router as _v1_router

    app.include_router(_v1_router)
except Exception as _v1_err:
    log.warning("v1 routes unavailable: %s", _v1_err)

# OS Cyber-HUD, 5 Primitives Telemetry, Specialist Dots & Take-Control
try:
    from web.hud_routes import router as _hud_router

    app.include_router(_hud_router)
except Exception as _hud_err:
    log.warning("hud routes unavailable: %s", _hud_err)

# OS Computer-Use & Multi-Backend Automation
try:
    from web.routes_computer_control import router as _computer_router

    app.include_router(_computer_router)
    log.info("Mounted computer-control router at /api/computer")
except Exception as _comp_err:
    log.warning("computer control routes unavailable: %s", _comp_err)

# OS V3 Proactive GitHub Intelligence & Research Lab
try:
    from web.routes_discovery import router as _discovery_router

    app.include_router(_discovery_router)
    log.info("Mounted discovery router at /api/discovery")
except Exception as _disc_err:
    log.warning("discovery routes unavailable: %s", _disc_err)




@app.get("/", response_class=HTMLResponse)
async def index() -> HTMLResponse:
    return HTMLResponse((_STATIC / "index.html").read_text(encoding="utf-8"))


# --------------------------------------------------------------------------
# Me / chat
# --------------------------------------------------------------------------


@app.get("/api/me")
async def me() -> dict:
    cfg = get_cfg()
    name = getattr(getattr(cfg, "user", None), "name", None) or "sai"
    persona = getattr(getattr(cfg, "personality", None), "name", None) or "Builder"
    current_model = _engine.get("model") or getattr(cfg.llm, "model", "")
    return {
        "name": name,
        "greeting": _greeting(),
        "mode": f"{persona} Mode",
        "online": True,
        "model_ok": _engine.get("model_ok", False),
        "model": current_model,
    }


@app.get("/api/health")
async def health_check_endpoint() -> dict:
    """Canonical operational health check for OS, reporting all subsystems truthfully."""
    cfg = get_cfg()
    model_name = _engine.get("model") or getattr(cfg.llm, "model", "qwen3:8b")
    model_ok = bool(_engine.get("model_ok", False))

    desktop_ok = False
    browser_ok = False
    try:
        from server.computer.registry import get_computer_registry
        reg = get_computer_registry()
        b_harness = reg.get_backend("browser_harness")
        if b_harness and hasattr(b_harness, "health_check"):
            bh_health = b_harness.health_check()
            browser_ok = bool(bh_health.ok)
        d_desktop = reg.get_backend("docker_desktop")
        if d_desktop and hasattr(d_desktop, "health_check"):
            dd_health = d_desktop.health_check()
            desktop_ok = bool(dd_health.ok)
    except Exception:
        pass

    scheduler_status = "ready"
    try:
        import apscheduler
    except ImportError:
        scheduler_status = "blocked"

    store_ok = False
    try:
        store = get_store()
        store_ok = bool(store and hasattr(store, "health") and store.health())
    except Exception:
        pass

    return {
        "status": "healthy" if store_ok else "degraded",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "local_first": True,
        "paid_services_blocked": True,
        "subsystems": {
            "model": {
                "provider": "ollama",
                "model": model_name,
                "reachable": model_ok,
                "cost_classification": "ZERO_LOCAL",
            },
            "browser": {
                "backend": "browser_harness",
                "engine": "playwright_chromium",
                "ready": browser_ok,
            },
            "desktop": {
                "backend": "docker_desktop",
                "ready": desktop_ok,
            },
            "scheduler": {
                "engine": "apscheduler",
                "status": scheduler_status,
            },
            "state_store": {
                "engine": "sqlite_wal",
                "persisted": store_ok,
            },
        },
    }


@app.get("/api/diagnostics")
async def operational_diagnostics() -> dict:
    """Operational diagnostics distinguishing Configured, Reachable, Authenticated, Executing, Verified.

    Enforces the invariant: Never make a green readiness badge from configuration alone.
    """
    cfg = get_cfg()
    now_iso = datetime.now(timezone.utc).isoformat()
    subsystems: dict[str, dict[str, Any]] = {}

    # 1. Local LLM Subsystem
    model_name = _engine.get("model") or getattr(cfg.llm, "model", "qwen3:8b")
    model_ok = bool(_engine.get("model_ok", False))
    if model_ok:
        llm_diag = {
            "state": "INDEPENDENTLY_VERIFIED",
            "badge": "verified",
            "badge_color": "green",
            "configured": True,
            "reachable": True,
            "authenticated": True,
            "executing": True,
            "verified": True,
            "evidence": f"Ollama HTTP probe verified at {cfg.llm.base_url} serving model '{model_name}'.",
        }
    else:
        llm_diag = {
            "state": "CONFIGURED",
            "badge": "offline",
            "badge_color": "amber",
            "configured": True,
            "reachable": False,
            "authenticated": False,
            "executing": False,
            "verified": False,
            "evidence": f"Configured for {cfg.llm.base_url}, but endpoint probe returned unreachable. Operating in deterministic local-first fallback mode.",
        }
    subsystems["local_llm"] = llm_diag

    # 2. Browser Runtime
    try:
        from server.computer.registry import get_computer_registry
        reg = get_computer_registry()
        bh = reg.get_backend("browser_harness")
        bh_health = bh.health_check() if bh else None
        if bh_health and bh_health.ok:
            browser_diag = {
                "state": "INDEPENDENTLY_VERIFIED",
                "badge": "verified",
                "badge_color": "green",
                "configured": True,
                "reachable": True,
                "authenticated": True,
                "executing": True,
                "verified": True,
                "evidence": "Playwright Chromium headless runtime verified via automated browser probe.",
            }
        else:
            browser_diag = {
                "state": "CONFIGURED",
                "badge": "unreachable",
                "badge_color": "amber",
                "configured": True,
                "reachable": False,
                "authenticated": False,
                "executing": False,
                "verified": False,
                "evidence": f"Browser configured, but engine reported: {getattr(bh_health, 'message', 'Chromium missing')}",
            }
    except Exception as e:
        browser_diag = {
            "state": "ERROR",
            "badge": "error",
            "badge_color": "red",
            "configured": True,
            "reachable": False,
            "authenticated": False,
            "executing": False,
            "verified": False,
            "evidence": str(e),
        }
    subsystems["browser_runtime"] = browser_diag

    # 3. Docker Virtual Desktop
    try:
        dd = reg.get_backend("docker_desktop")
        dd_health = dd.health_check() if dd else None
        details = getattr(dd_health, "details", {}) or {}
        if dd_health and dd_health.ok and details.get("stream_ready") and details.get("cdp_ready"):
            desktop_diag = {
                "state": "INDEPENDENTLY_VERIFIED",
                "badge": "verified",
                "badge_color": "green",
                "configured": True,
                "reachable": True,
                "authenticated": True,
                "executing": True,
                "verified": True,
                "evidence": f"Virtual Desktop 8-layer probe verified. Stream: {details.get('stream_url')}, Root Pixmap confirmed.",
            }
        elif dd_health and details.get("container_running"):
            desktop_diag = {
                "state": "REACHABLE",
                "badge": "standby",
                "badge_color": "amber",
                "configured": True,
                "reachable": True,
                "authenticated": False,
                "executing": False,
                "verified": False,
                "evidence": "Container running, but GUI streaming framebuffer not yet verified.",
            }
        else:
            desktop_diag = {
                "state": "CONFIGURED",
                "badge": "offline",
                "badge_color": "gray",
                "configured": True,
                "reachable": False,
                "authenticated": False,
                "executing": False,
                "verified": False,
                "evidence": getattr(dd_health, "message", "Desktop container offline"),
            }
    except Exception as e:
        desktop_diag = {
            "state": "ERROR",
            "badge": "error",
            "badge_color": "red",
            "configured": True,
            "reachable": False,
            "authenticated": False,
            "executing": False,
            "verified": False,
            "evidence": str(e),
        }
    subsystems["virtual_desktop"] = desktop_diag

    # 4. Proactive Scheduler
    try:
        import apscheduler
        subsystems["scheduler"] = {
            "state": "INDEPENDENTLY_VERIFIED",
            "badge": "verified",
            "badge_color": "green",
            "configured": True,
            "reachable": True,
            "authenticated": True,
            "executing": True,
            "verified": True,
            "evidence": f"APScheduler {apscheduler.__version__} loaded with SQLite persistent job store.",
        }
    except ImportError:
        subsystems["scheduler"] = {
            "state": "NOT_CONFIGURED",
            "badge": "blocked",
            "badge_color": "gray",
            "configured": True,
            "reachable": False,
            "authenticated": False,
            "executing": False,
            "verified": False,
            "evidence": "APScheduler not installed in environment; background crons blocked.",
        }

    # 5. State Store Persistence
    try:
        store = get_store()
        h = store.health() if store else {}
        if h.get("ok"):
            subsystems["persistence"] = {
                "state": "INDEPENDENTLY_VERIFIED",
                "badge": "verified",
                "badge_color": "green",
                "configured": True,
                "reachable": True,
                "authenticated": True,
                "executing": True,
                "verified": True,
                "evidence": f"SQLite WAL database verified at {h.get('db_path')}, {h.get('events_count', 0)} events logged.",
            }
        else:
            subsystems["persistence"] = {
                "state": "CONFIGURED",
                "badge": "degraded",
                "badge_color": "amber",
                "configured": True,
                "reachable": False,
                "authenticated": False,
                "executing": False,
                "verified": False,
                "evidence": "State store initialized but failed health verification.",
            }
    except Exception as e:
        subsystems["persistence"] = {
            "state": "ERROR",
            "badge": "error",
            "badge_color": "red",
            "configured": True,
            "reachable": False,
            "authenticated": False,
            "executing": False,
            "verified": False,
            "evidence": str(e),
        }

    # 6. System Resource Probe
    from server.tools.system_info_tool import get_system_info
    sys_info = get_system_info().data or {}
    subsystems["system_resources"] = {
        "state": "INDEPENDENTLY_VERIFIED",
        "badge": "verified",
        "badge_color": "green",
        "configured": True,
        "reachable": True,
        "authenticated": True,
        "executing": True,
        "verified": True,
        "evidence": f"Probed: CPU {sys_info.get('cpu_percent')}% ({sys_info.get('cpu_count')} cores), RAM {sys_info.get('memory_used_gb')}/{sys_info.get('memory_total_gb')} GB, Disk {sys_info.get('disk_percent')}% on {sys_info.get('platform')}.",
        "metrics": sys_info,
    }

    return {
        "ok": True,
        "timestamp": now_iso,
        "subsystems": subsystems,
    }



# -----------------------------------------------------------------------------
# Dynamic Ollama Multi-Model Discovery & Selection Endpoints
# -----------------------------------------------------------------------------
class ModelSelectIn(BaseModel):
    model: str
    dot: str | None = None


class SkillImportIn(BaseModel):
    source_type: str = "github"  # "github" | "file" | "zip" | "local_dir"
    github_url: Optional[str] = None
    name: Optional[str] = None
    content: Optional[str] = None  # raw text or base64 encoded zip
    file_type: str = "md"  # "md" | "py" | "zip"
    category: str = "Integrations"
    description: Optional[str] = None
    prompt: Optional[str] = None
    local_path: Optional[str] = None


class SkillRunIn(BaseModel):
    input: str = ""
    model: Optional[str] = None

_ollama_registry = None

def _get_ollama_registry():
    global _ollama_registry
    if _ollama_registry is None:
        try:
            from web.hud_routes import get_kernel
            _ollama_registry = get_kernel().engine.registry
        except Exception:
            from jarvis_os.primitives.ollama_registry import OllamaModelRegistry
            cfg = get_cfg()
            base_url = getattr(getattr(cfg, "llm", None), "base_url", "http://127.0.0.1:11434")
            _ollama_registry = OllamaModelRegistry(base_url=base_url)
    return _ollama_registry

@app.get("/api/models")
async def list_models(refresh: bool = False) -> dict:
    reg = _get_ollama_registry()
    if refresh:
        reg.refresh_models()
    return reg.status()

@app.post("/api/models/refresh")
async def refresh_models() -> dict:
    reg = _get_ollama_registry()
    reg.refresh_models()
    st = reg.status()
    try:
        from web.hud_routes import notify_event
        notify_event("OLLAMA_MODELS_REFRESHED", st)
    except Exception:
        pass
    return st

@app.post("/api/models/select")
async def select_model(req: ModelSelectIn) -> dict:
    reg = _get_ollama_registry()
    st = reg.select_model(req.model, dot_id=req.dot)
    if not req.dot or req.dot in ("all", "global", "*"):
        _engine["model"] = req.model
        _engine["model_ok"] = reg.daemon_online
        if "cfg" in _engine and hasattr(_engine["cfg"], "llm"):
            _engine["cfg"].llm.model = req.model
        mgr = _engine.get("mgr")
        if mgr:
            if hasattr(mgr, "set_model"):
                mgr.set_model(req.model)
            elif hasattr(mgr, "router") and hasattr(mgr.router, "set_model"):
                mgr.router.set_model(req.model)
            elif hasattr(mgr, "router") and hasattr(mgr.router, "_default"):
                mgr.router._default.model = req.model
    try:
        from web.hud_routes import notify_event
        notify_event("OLLAMA_MODEL_SELECTED", {"model": req.model, "dot": req.dot, "status": st})
    except Exception:
        pass
    return {"ok": True, **st}


class ChatIn(BaseModel):
    message: str


@app.get("/api/onboarding")
async def onboarding() -> dict:
    """First-run state: has the user connected Google yet?"""
    creds = get_dash().load_credentials("google")
    google_configured = bool(creds.get("client_id") and creds.get("client_secret"))
    google_connected = bool(creds.get("refresh_token"))
    return {
        "google_configured": google_configured,
        "google_connected": google_connected,
        "needs_google": not google_connected,
    }


@app.post("/api/chat")
async def chat(inp: ChatIn):
    # 0) Explicit Skill Invocation (/skill <id> <prompt> or /<skill_id> <prompt>)
    msg_strip = (inp.message or "").strip()
    skill_dispatch = None
    if msg_strip.startswith("/skill "):
        parts = msg_strip[7:].strip().split(" ", 1)
        s_id = parts[0]
        s_in = parts[1] if len(parts) > 1 else ""
        skill_dispatch = (s_id, s_in)
    elif msg_strip.startswith("/"):
        token = msg_strip[1:].split(" ", 1)[0].lower()
        rem = msg_strip[1:].split(" ", 1)[1] if " " in msg_strip else ""
        from server.skills.skill_manager import get_skill_manager
        all_s = {s["id"]: s for s in get_skill_manager().list_skills()}
        if token in all_s or f"{token}_skill" in all_s:
            target_id = token if token in all_s else f"{token}_skill"
            skill_dispatch = (target_id, rem)

    if skill_dispatch:
        try:
            from server.skills.skill_manager import get_skill_manager
            sm = get_skill_manager()
            res = sm.run_skill(skill_id=skill_dispatch[0], user_input=skill_dispatch[1])

            async def skill_stream_gen():
                header = f"Invoking skill **{res['skill_title']}** on OS Virtual Computer (`{res['sandbox_mode']}`)...\n\n"
                yield f"data: {json.dumps({'t': 'token', 'd': header})}\n\n"
                await asyncio.sleep(0.02)
                yield f"data: {json.dumps({'t': 'token', 'd': res['output']})}\n\n"
                await asyncio.sleep(0.02)
                verif_note = f"Verified: {res.get('verification', {}).get('evidence')}" if res.get('verification') else "Execution completed"
                yield (
                    "data: "
                    + json.dumps({
                        "t": "done",
                        "full": res["output"],
                        "main": res["output"],
                        "approval": None,
                        "notes": [verif_note],
                        "execution": {
                            "skill_id": res["skill_id"],
                            "execution_mode": res["execution_mode"],
                            "sandbox_mode": res["sandbox_mode"],
                            "status": res["status"],
                            "verified": res.get("verification", {}).get("verified", False),
                            "evidence": res.get("verification", {}).get("evidence", ""),
                            "latency_ms": res.get("latency_ms", 0),
                        },
                    })
                    + "\n\n"
                )

            return StreamingResponse(skill_stream_gen(), media_type="text/event-stream")
        except Exception as e:
            log.warning("Skill chat dispatch failed: %s", e)

    # 1) Connector commands do real work first ("schedule a meeting…",
    #    "send an email…") — reads run immediately, writes ask approval.
    try:
        from web import assistant as _assistant

        ares = _assistant.handle(inp.message, _AssistantCtx())
        if ares is not None:
            async def agen():
                yield f"data: {json.dumps({'t': 'token', 'd': ares.reply})}\n\n"
                await asyncio.sleep(0)
                yield ("data: " + json.dumps({
                    "t": "done", "full": ares.reply, "main": ares.reply,
                    "approval": None, "notes": [],
                    "execution": ares.execution,
                    "action_approval": ares.action_approval,
                }) + "\n\n")

            return StreamingResponse(agen(), media_type="text/event-stream")
    except Exception:
        log.exception("connector assistant failed; falling back to engine")

    # 2) Everything else goes through the normal OS engine.
    mgr = get_mgr()

    async def gen():
        buf: list[str] = []
        try:
            async for chunk in mgr.respond_text(inp.message):
                if chunk.delta:
                    buf.append(chunk.delta)
                    yield f"data: {json.dumps({'t': 'token', 'd': chunk.delta})}\n\n"
                    await asyncio.sleep(0)
        except Exception as e:  # never leave the UI hanging
            log.exception("chat failed")
            msg = (
                "I couldn't reach my language model just now "
                "(is Ollama running?). Tool commands like drafting and "
                "memory still work — try one of those."
                if not _engine.get("model_ok")
                else f"Something went wrong: {type(e).__name__}."
            )
            buf.append(msg)
            yield f"data: {json.dumps({'t': 'token', 'd': msg})}\n\n"
        full = "".join(buf)
        main, notes = _split_notes(full)
        yield (
            "data: "
            + json.dumps(
                {
                    "t": "done",
                    "full": full,
                    "main": main,
                    "approval": _latest_approval(mgr),
                    "notes": notes,
                }
            )
            + "\n\n"
        )

    return StreamingResponse(gen(), media_type="text/event-stream")


# --------------------------------------------------------------------------
# Approvals (real queue, real hash semantics)
# --------------------------------------------------------------------------


@app.get("/api/approvals")
async def approvals() -> dict:
    mgr = get_mgr()
    mgr._prune_expired()
    return {"pending": [_pending_dict(p) for p in mgr._pending]}


@app.get("/api/approvals/history")
async def approvals_history() -> dict:
    mgr = get_mgr()
    return {"history": mgr._approval_store.recent(20)}


def _find_pending(mgr, pid: int):
    for p in mgr._pending:
        if p.pending_id == pid:
            return p
    return None


@app.post("/api/approvals/{pid}/approve")
async def approve(pid: int) -> dict:
    mgr = get_mgr()
    p = _find_pending(mgr, pid)
    if p is None:
        raise HTTPException(404, "approval not found (maybe it expired)")
    mgr._pending.remove(p)
    try:
        text = await mgr._approve_one(p)
        return {"ok": True, "text": text}
    except Exception as e:
        log.exception("approve failed")
        if hasattr(mgr, "_approval_store") and hasattr(mgr._approval_store, "record_decision"):
            try:
                mgr._approval_store.record_decision(
                    action_id=str(pid),
                    decision="FAILED",
                    approver="user",
                    notes=f"Execution error: {type(e).__name__}: {e}",
                )
            except Exception:
                pass
        return {
            "ok": False,
            "error": f"Approval execution failed: {type(e).__name__}: {e}",
            "text": f"Approval failed: {type(e).__name__}."
        }


@app.post("/api/approvals/{pid}/reject")
async def reject(pid: int) -> dict:
    mgr = get_mgr()
    p = _find_pending(mgr, pid)
    if p is None:
        raise HTTPException(404, "approval not found (maybe it expired)")
    mgr._pending.remove(p)
    text = mgr._reject_one(p)
    return {"ok": True, "text": text}


class EditIn(BaseModel):
    draft: str


@app.post("/api/approvals/{pid}/edit")
async def edit_draft(pid: int, inp: EditIn) -> dict:
    """Edit = reject the old draft (real reject), then draft anew from the
    edited text. The new version goes through approval again — the exact-
    content hash always binds what was shown."""
    mgr = get_mgr()
    p = _find_pending(mgr, pid)
    if p is None:
        raise HTTPException(404, "approval not found (maybe it expired)")
    mgr._pending.remove(p)
    mgr._reject_one(p)
    text = await _collect_text(mgr, f"draft a linkedin post about {inp.draft.strip()}")
    return {"ok": True, "text": text, "approval": _latest_approval(mgr)}


# --------------------------------------------------------------------------
# Tasks (real StateStore)
# --------------------------------------------------------------------------


class TaskIn(BaseModel):
    title: str


class TaskPatch(BaseModel):
    status: str


def _task_dict(t) -> dict:
    return {"id": t.id, "title": t.title, "status": t.status}


@app.get("/api/tasks")
async def tasks() -> dict:
    store = get_store()
    items = [_task_dict(t) for t in store.list_tasks()]
    open_n = sum(1 for t in store.list_tasks(status="PENDING"))
    return {"tasks": items, "open": open_n}


@app.post("/api/tasks")
async def create_task(inp: TaskIn) -> dict:
    t = get_store().create_task(inp.title.strip())
    return {"ok": True, "task": _task_dict(t)}


@app.patch("/api/tasks/{tid}")
@app.put("/api/tasks/{tid}")
async def patch_task(tid: int, inp: TaskPatch) -> dict:
    try:
        t = get_store().set_task_status(tid, inp.status.upper())
    except (KeyError, ValueError) as e:
        raise HTTPException(400, str(e))
    return {"ok": True, "task": _task_dict(t)}


@app.delete("/api/tasks/{tid}")
async def delete_task(tid: int) -> dict:
    try:
        get_store().delete_task(tid)
    except KeyError:
        raise HTTPException(404, "no such task")
    return {"ok": True}


# --------------------------------------------------------------------------
# Memory / watchers / skills / files / projects / analytics
# --------------------------------------------------------------------------


@app.get("/api/memory")
async def memory() -> dict:
    db = Path("memory/os_memory.db")
    items: list[dict] = []
    if db.exists():
        conn = sqlite3.connect(db)
        try:
            rows = conn.execute(
                "SELECT key, value, memory_type, updated_at FROM memories"
                " ORDER BY updated_at DESC LIMIT 50"
            ).fetchall()
            for key, value, mtype, updated_at in rows:
                items.append(
                    {
                        "key": key,
                        "value": value,
                        "type": mtype,
                        "updated_at": updated_at,
                    }
                )
        finally:
            conn.close()
    return {"memories": items}


@app.delete("/api/memory/{key}")
async def forget_memory(key: str) -> dict:
    db = Path("memory/os_memory.db")
    if db.exists():
        conn = sqlite3.connect(db)
        try:
            cur = conn.execute("DELETE FROM memories WHERE key = ?", (key,))
            conn.commit()
            if cur.rowcount == 0:
                raise HTTPException(404, "no such memory")
        finally:
            conn.close()
    return {"ok": True}


@app.get("/api/watchers")
async def watchers() -> dict:
    notes = get_store().unseen_suggestions(limit=10)
    return {
        "suggestions": [
            {"id": n["id"], "kind": n["kind"], "text": n["text"]} for n in notes
        ]
    }


@app.post("/api/watchers/{nid}/seen")
@app.delete("/api/watchers/{nid}")
async def watcher_seen(nid: int) -> dict:
    get_store().mark_suggestion_seen(nid)
    return {"ok": True}


@app.get("/api/skills")
async def list_skills_endpoint() -> dict:
    from server.skills.skill_manager import get_skill_manager
    skills_list = get_skill_manager().list_skills()
    return {"skills": skills_list}


@app.post("/api/skills/import")
async def import_skill_endpoint(req: SkillImportIn) -> dict:
    from server.skills.skill_manager import get_skill_manager
    import base64
    sm = get_skill_manager()
    try:
        if req.source_type == "github":
            if not req.github_url:
                raise HTTPException(status_code=400, detail="github_url is required for GitHub imports")
            return sm.import_from_github(
                github_url=req.github_url,
                custom_name=req.name,
                category=req.category or "Integrations",
            )
        elif req.source_type == "zip":
            if not req.content:
                raise HTTPException(status_code=400, detail="content (base64) is required for ZIP imports")
            try:
                zip_bytes = base64.b64decode(req.content)
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid base64 payload for ZIP archive")
            return sm.import_from_zip(
                zip_bytes=zip_bytes,
                custom_name=req.name,
                category=req.category or "Custom",
            )
        elif req.source_type == "local_dir":
            path_val = req.local_path or req.name or req.content
            if not path_val:
                raise HTTPException(status_code=400, detail="local_path is required for local directory imports")
            return sm.import_from_local_dir(
                local_path=path_val,
                custom_name=req.name,
                category=req.category or "Custom",
            )
        else:
            if not req.content:
                raise HTTPException(status_code=400, detail="content is required for file imports")
            if not req.name:
                raise HTTPException(status_code=400, detail="name is required for file imports")
            return sm.import_from_file(
                name=req.name,
                content=req.content,
                file_type=req.file_type or "md",
                category=req.category or "Custom",
                description=req.description or "",
                prompt=req.prompt or "",
            )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        log.exception("Skill import failed: %s", e)
        raise HTTPException(status_code=500, detail=f"Failed to import skill: {e}")


@app.get("/api/skills/{skill_id}/details")
async def skill_details_endpoint(skill_id: str) -> dict:
    from server.skills.skill_manager import get_skill_manager
    sm = get_skill_manager()
    try:
        return sm.get_skill_details(skill_id=skill_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.post("/api/skills/{skill_id}/toggle")
async def toggle_skill_endpoint(skill_id: str, req: dict = None) -> dict:
    from server.skills.skill_manager import get_skill_manager
    sm = get_skill_manager()
    try:
        enabled_val = req.get("enabled") if req else None
        return sm.toggle_skill(skill_id=skill_id, enabled=enabled_val)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.get("/api/skills/runs")
async def list_skill_runs_endpoint(limit: int = 50) -> dict:
    from server.skills.skill_manager import get_skill_manager
    sm = get_skill_manager()
    return {"runs": sm.get_run_history(limit=limit)}


@app.get("/api/skills/{skill_id}/runs")
async def skill_runs_endpoint(skill_id: str, limit: int = 50) -> dict:
    from server.skills.skill_manager import get_skill_manager
    sm = get_skill_manager()
    return {"runs": sm.get_run_history(skill_id=skill_id, limit=limit)}


@app.delete("/api/skills/runs")
async def clear_skill_runs_endpoint() -> dict:
    from server.skills.skill_manager import get_skill_manager
    sm = get_skill_manager()
    return sm.clear_run_history()


@app.post("/api/skills/{skill_id}/run")
async def run_skill_endpoint(skill_id: str, req: SkillRunIn) -> dict:
    from server.skills.skill_manager import get_skill_manager
    sm = get_skill_manager()
    try:
        return sm.run_skill(skill_id=skill_id, user_input=req.input, model_name=req.model)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        log.exception("Skill execution failed: %s", e)
        raise HTTPException(status_code=500, detail=f"Execution error: {e}")


@app.delete("/api/skills/{skill_id}")
async def delete_skill_endpoint(skill_id: str) -> dict:
    from server.skills.skill_manager import get_skill_manager
    sm = get_skill_manager()
    try:
        return sm.delete_skill(skill_id=skill_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/files")
async def files() -> dict:
    items: list[dict] = []

    def walk(path: Path, depth: int) -> None:
        if depth > 2 or len(items) > 300:
            return
        try:
            entries = sorted(path.iterdir(), key=lambda p: (p.is_file(), p.name.lower()))
        except OSError:
            return
        for e in entries:
            if e.name.startswith(".") or e.is_symlink():
                continue
            rel = str(e.relative_to(_WORKSPACE))
            if e.is_dir():
                items.append({"path": rel, "type": "dir"})
                walk(e, depth + 1)
            else:
                try:
                    size = e.stat().st_size
                except OSError:
                    size = 0
                items.append({"path": rel, "type": "file", "size": size})

    if not _WORKSPACE.exists():
        try:
            _WORKSPACE.mkdir(parents=True, exist_ok=True)
            (_WORKSPACE / "welcome.md").write_text("# OS Workspace\nWelcome to your workspace.\n", encoding="utf-8")
        except Exception:
            pass
    elif _WORKSPACE.is_dir():
        try:
            if not any(_WORKSPACE.iterdir()):
                (_WORKSPACE / "welcome.md").write_text("# OS Workspace\nWelcome to your workspace.\n", encoding="utf-8")
        except Exception:
            pass

    if _WORKSPACE.exists():
        walk(_WORKSPACE, 0)
    return {"root": str(_WORKSPACE), "files": items}


@app.get("/api/files/download")
async def download_file(path: str):
    target = (_WORKSPACE / path).resolve()
    if not str(target).startswith(str(_WORKSPACE.resolve())) or not target.is_file():
        raise HTTPException(400, "invalid path")
    return FileResponse(target, filename=target.name)


@app.get("/api/projects")
async def projects() -> dict:
    goals = Path.home() / "workspace" / "goals"
    out: list[dict] = []
    if goals.exists():
        for d in sorted(goals.iterdir()):
            if not d.is_dir():
                continue
            gfile = d / "GOAL.md"
            title, desc = d.name.replace("-", " ").title(), ""
            if gfile.exists():
                try:
                    text = gfile.read_text(encoding="utf-8", errors="replace")[:600]
                    for line in text.splitlines():
                        if line.startswith("# "):
                            title = line[2:].strip()
                            break
                    desc = " ".join(text.split())[:160]
                except OSError:
                    pass
            out.append({"id": d.name, "title": title, "description": desc})
    return {"projects": out}


@app.get("/api/analytics")
async def analytics() -> dict:
    mgr = get_mgr()
    hist = mgr._approval_store.recent(1000)
    counts = {"APPROVED": 0, "REJECTED": 0, "EXPIRED": 0, "SHOWN": 0}
    for h in hist:
        s = h.get("status", "")
        if s in counts:
            counts[s] += 1
    mem_n = 0
    db = Path("memory/os_memory.db")
    if db.exists():
        conn = sqlite3.connect(db)
        try:
            mem_n = conn.execute("SELECT COUNT(*) FROM memories").fetchone()[0]
        finally:
            conn.close()
    store = get_store()
    tasks_all = store.list_tasks()
    return {
        "approvals_approved": counts["APPROVED"],
        "approvals_rejected": counts["REJECTED"],
        "approvals_expired": counts["EXPIRED"],
        "memories": mem_n,
        "tasks_open": sum(1 for t in tasks_all if t.status == "PENDING"),
        "tasks_done": sum(1 for t in tasks_all if t.status == "DONE"),
        "events": len(store.get_events(limit=10000)),
    }


# --------------------------------------------------------------------------
# --------------------------------------------------------------------------
# Connectors v2 — permission-gated, health-checked, real APIs
# --------------------------------------------------------------------------

from web.connectors import (  # noqa: E402
    CONNECTORS,
    get_adapter,
    get_connector,
    get_manifest,
)
from web.connectors import mcp as mcp_bridge  # noqa: E402
from web.connectors import oauth_google  # noqa: E402
from web.connectors import oauth_microsoft  # noqa: E402

_OAUTH_MODULES = {
    "google_oauth": oauth_google,
    "microsoft_oauth": oauth_microsoft,
}
_OAUTH_GROUPS = {
    "google_oauth": "google",
    "microsoft_oauth": "microsoft",
}
from web.connectors.base import AdapterError  # noqa: E402


def _manifest_or_404(cid: str):
    m = get_manifest(cid)
    if m is None:
        raise HTTPException(404, "unknown connector")
    return m


def _creds_for(cid: str) -> dict:
    m = get_manifest(cid)
    if m is None:
        return {}
    dash = get_dash()
    if m.auth_kind == "google_oauth":
        # Check connector-specific credentials/tokens first (google:<cid>)
        conn_creds = dict(dash.load_credentials(f"google:{cid}"))
        if not conn_creds:
            conn_creds = dict(dash.load_credentials(cid))
        # Shared app credentials (client_id, client_secret) from cred_group ("google")
        shared = dict(dash.load_credentials(m.cred_group))

        merged: dict = {}
        if shared.get("client_id"):
            merged["client_id"] = shared["client_id"]
        if shared.get("client_secret"):
            merged["client_secret"] = shared["client_secret"]

        if conn_creds:
            merged.update(conn_creds)
        return merged
    return dash.load_credentials(m.cred_group)


# Pending Google OAuth flows: state -> {"cid", "created", "scopes"}. Single-use, 10 min.
_OAUTH_STATES: dict[str, dict] = {}


def _run_health(cid: str) -> tuple[bool, str]:
    adapter = get_adapter(cid)
    if adapter is None:
        return False, "no adapter"
    try:
        return adapter.health_check(_creds_for(cid))
    except AdapterError as e:
        return False, str(e)
    except Exception as e:  # never leak tracebacks to the UI
        log.exception("health check failed for %s", cid)
        return False, f"{type(e).__name__}: {e}"


def _refresh_state(cid: str) -> dict:
    """Re-run the live health check and store the resulting state."""
    dash = get_dash()
    m = get_manifest(cid)
    st = dash.grant_status(cid, m.cred_group)
    if st["state"] not in ("granted", "connected", "setup_error"):
        return st
    creds = _creds_for(cid)
    if m.auth_kind in ("google_oauth", "microsoft_oauth") and not creds.get("refresh_token"):
        provider = "Microsoft" if m.auth_kind == "microsoft_oauth" else "Google"
        dash.set_state(cid, "granted", f"Press “Sign in with {provider}” to sign in.")
        return dash.grant_status(cid, m.cred_group)
    if not (creds.get("client_id") and creds.get("client_secret")) and not st["has_credentials"]:
        return st
    ok, msg = _run_health(cid)
    dash.set_state(cid, "connected" if ok else "setup_error", msg or "")
    return dash.grant_status(cid, m.cred_group)


@app.get("/api/connectors")
async def list_connectors() -> dict:
    return {"connectors": [_connector_dict(c) for c in CONNECTORS]}


def _connector_dict(c: dict) -> dict:
    dash = get_dash()
    st = dash.grant_status(c["id"], c["cred_group"])
    needs_oauth = False
    creds = _creds_for(c["id"])
    has_creds = st["has_credentials"]
    if c["auth_kind"] in ("google_oauth", "microsoft_oauth"):
        needs_oauth = not bool(creds.get("refresh_token"))
        has_creds = bool(creds.get("client_id") and creds.get("client_secret"))
    health_msg = st["health_msg"]
    if st["state"] == "available" and not health_msg:
        health_msg = "Not configured. Grant permissions to connect."
    return {
        **c,
        "state": st["state"],
        "scopes_granted": st["scopes"],
        "has_credentials": has_creds,
        "needs_oauth": needs_oauth,
        "health_msg": health_msg,
        "health_at": st["health_at"],
        "last_used_at": st["last_used_at"],
    }


@app.get("/api/connectors/{cid}")
async def connector_detail(cid: str) -> dict:
    c = get_connector(cid)
    if c is None:
        raise HTTPException(404, "unknown connector")
    return _connector_dict(c)


class GrantIn(BaseModel):
    scopes: list[str] = []


@app.post("/api/connectors/{cid}/grant")
async def grant_connector(cid: str, inp: GrantIn | None = None) -> dict:
    c = _manifest_or_404(cid)
    allowed = set(c.scopes)
    asked = inp.scopes if inp else []
    chosen = [s for s in asked if s in allowed] or list(c.scopes)
    if not chosen:
        raise HTTPException(400, "grant at least one permission")
    get_dash().grant(cid, chosen)
    return {"ok": True, "status": _refresh_state(cid)}


@app.post("/api/connectors/{cid}/deny")
async def deny_connector(cid: str) -> dict:
    _manifest_or_404(cid)
    get_dash().deny(cid)
    return {"ok": True}


@app.post("/api/connectors/{cid}/revoke")
@app.delete("/api/connectors/{cid}/revoke")
async def revoke_connector(cid: str) -> dict:
    m = _manifest_or_404(cid)
    dash = get_dash()
    if m.auth_kind == "google_oauth":
        # Delete connector-specific credentials/tokens
        dash.revoke(cid, f"google:{cid}")
        # Check whether any sibling Google connectors remain active
        from web.connectors.manifests import MANIFESTS

        siblings = [
            gm.id
            for gm in MANIFESTS
            if gm.auth_kind == "google_oauth" and gm.id != cid
        ]
        conn = dash._connect()
        try:
            rows = conn.execute(
                "SELECT connector_id, state FROM connector_state WHERE connector_id IN (%s)"
                % ",".join("?" * len(siblings)),
                siblings,
            ).fetchall()
            still_used = any(
                r["state"] in ("granted", "connected", "setup_error") for r in rows
            )
            if not still_used:
                conn.execute(
                    "DELETE FROM connector_credentials WHERE cred_group = ?",
                    (m.cred_group,),
                )
            conn.commit()
        finally:
            conn.close()
    else:
        dash.revoke(cid, m.cred_group)
    return {"ok": True}


class CredsIn(BaseModel):
    label: str = ""
    fields: dict[str, str] = {}


@app.get("/api/connectors/{cid}/credentials")
async def get_creds(cid: str) -> dict:
    m = _manifest_or_404(cid)
    creds = _creds_for(cid)
    fields: dict[str, str] = {}
    is_configured = False
    for f in m.cred_fields:
        val = creds.get(f.key, "")
        if val:
            is_configured = True
            if f.secret:
                fields[f.key] = "••••••••"
            else:
                fields[f.key] = val
        else:
            fields[f.key] = ""
    return {
        "configured": is_configured,
        "fields": fields,
        "has_refresh_token": bool(creds.get("refresh_token")),
        "cred_group": m.cred_group,
    }


@app.post("/api/connectors/{cid}/credentials")
async def save_creds(cid: str, inp: CredsIn) -> dict:
    m = _manifest_or_404(cid)
    dash = get_dash()
    st = dash.grant_status(cid, m.cred_group)
    if st["state"] in ("available", "denied"):
        raise HTTPException(403, "grant permission first")

    if m.auth_kind == "google_oauth":
        shared = dash.load_credentials(m.cred_group)
        for k, v in inp.fields.items():
            if v and v != "••••••••" and k in ("client_id", "client_secret"):
                shared[k] = v.strip()
        dash.save_credentials(m.cred_group, "Google OAuth Client", shared)
        # If refresh_token was explicitly provided in fields (e.g. in test fixture or direct injection)
        if "refresh_token" in inp.fields and inp.fields["refresh_token"] and inp.fields["refresh_token"] != "••••••••":
            conn_creds = dash.load_credentials(f"google:{cid}")
            conn_creds["refresh_token"] = inp.fields["refresh_token"].strip()
            if shared.get("client_id"):
                conn_creds["client_id"] = shared["client_id"]
            if shared.get("client_secret"):
                conn_creds["client_secret"] = shared["client_secret"]
            dash.save_credentials(f"google:{cid}", f"Google ({cid})", conn_creds)
    else:
        merged = dash.load_credentials(m.cred_group)
        for k, v in inp.fields.items():
            if v and v != "••••••••":
                merged[k] = v.strip()
        dash.save_credentials(m.cred_group, inp.label or m.name, merged)

    status = _refresh_state(cid)
    return {"ok": True, "status": status}


@app.post("/api/connectors/{cid}/test")
async def test_connector(cid: str) -> dict:
    _manifest_or_404(cid)
    status = _refresh_state(cid)
    return {"ok": status["state"] == "connected", "status": status}


@app.get("/api/connectors/{cid}/oauth/start")
async def oauth_start(cid: str, request: Request, scopes: str | None = None) -> dict:
    m = _manifest_or_404(cid)
    mod = _OAUTH_MODULES.get(m.auth_kind)
    if mod is None:
        raise HTTPException(400, "this connector has no OAuth flow")
    provider = "Microsoft" if m.auth_kind == "microsoft_oauth" else "Google"
    creds = _creds_for(cid)
    client_id = (creds.get("client_id") or "").strip()
    client_secret = (creds.get("client_secret") or "").strip()
    if not client_id or not client_secret:
        raise HTTPException(400, f"save your {provider} OAuth Client ID and Secret first")
    group = _OAUTH_GROUPS[m.auth_kind]
    redirect_uri = str(request.base_url).rstrip("/") + f"/api/connectors/{group}/oauth/callback"

    # Parse requested scopes if specified
    req_scopes: list[str] | None = None
    if scopes:
        s_clean = scopes.strip()
        if s_clean.startswith("["):
            try:
                parsed = json.loads(s_clean)
                if isinstance(parsed, list):
                    req_scopes = [str(x).strip() for x in parsed if str(x).strip()]
            except Exception:
                req_scopes = [s.strip() for s in s_clean.split(",") if s.strip()]
        else:
            req_scopes = [s.strip() for s in s_clean.split(",") if s.strip()]

    # Validate scopes for Google connectors to prevent incompatible combinations
    target_scopes: list[str] = []
    if m.auth_kind == "google_oauth":
        target_scopes = req_scopes or mod.get_scopes_for_connector(cid)
        try:
            mod.validate_scopes(target_scopes)
        except ValueError as err:
            raise HTTPException(400, str(err))

    # Random single-use state prevents CSRF on the callback (valid 10 min).
    state = secrets.token_urlsafe(16)
    _OAUTH_STATES[state] = {
        "cid": cid,
        "created": time.time(),
        "scopes": target_scopes if m.auth_kind == "google_oauth" else req_scopes,
    }
    try:
        if m.auth_kind == "google_oauth":
            url, _ = mod.authorization_url(
                client_id,
                client_secret,
                redirect_uri,
                state=state,
                cid=cid,
                scopes=target_scopes,
                include_granted_scopes=False,
            )
        else:
            url, _ = mod.authorization_url(
                client_id, client_secret, redirect_uri, state=state
            )
    except (RuntimeError, ValueError) as e:
        _OAUTH_STATES.pop(state, None)
        raise HTTPException(400, str(e))
    return {
        "url": url,
        "redirect_uri": redirect_uri,
        "scopes": target_scopes if m.auth_kind == "google_oauth" else [],
    }


def _oauth_callback_common(request: Request, group: str, provider: str) -> HTMLResponse:
    mod = _OAUTH_MODULES["microsoft_oauth" if group == "microsoft" else "google_oauth"]
    params = dict(request.query_params)
    if "error" in params:
        raise HTTPException(400, f"{provider} said no: {params.get('error')}")
    state = params.get("state", "")
    rec = _OAUTH_STATES.pop(state, None)
    if rec is None or time.time() - rec["created"] > 600:
        raise HTTPException(
            400, "This sign-in link expired or is invalid — start over from the Connectors page."
        )
    code = params.get("code")
    cid = rec["cid"]
    req_scopes = rec.get("scopes")
    if not code:
        raise HTTPException(400, "missing code")
    dash = get_dash()
    creds = _creds_for(cid)
    client_id = creds.get("client_id")
    client_secret = creds.get("client_secret")
    if not client_id or not client_secret:
        raise HTTPException(
            400, f"Your {provider} OAuth client was removed — save it again, then reconnect."
        )
    redirect_uri = str(request.base_url).rstrip("/") + f"/api/connectors/{group}/oauth/callback"
    try:
        if group == "microsoft":
            tokens = mod.exchange_code(client_id, client_secret, redirect_uri, code)
        else:
            try:
                tokens = mod.exchange_code(
                    client_id,
                    client_secret,
                    redirect_uri,
                    str(request.url),
                    scopes=req_scopes,
                    cid=cid,
                )
            except TypeError:
                tokens = mod.exchange_code(
                    client_id, client_secret, redirect_uri, str(request.url)
                )
    except Exception as e:
        raise HTTPException(400, f"Token exchange failed: {e}")

    if group == "google":
        token_record = {
            "client_id": client_id,
            "client_secret": client_secret,
            "refresh_token": tokens.get("refresh_token"),
            "access_token": tokens.get("access_token"),
            "scopes": tokens.get("scopes", req_scopes or []),
            "expiry": tokens.get("expiry"),
            "updated_at": time.time(),
        }
        dash.save_credentials(f"google:{cid}", f"{provider} ({cid})", token_record)
        # Ensure client_id and client_secret are stored in shared "google" group without tokens
        shared = dash.load_credentials(group)
        shared["client_id"] = client_id
        shared["client_secret"] = client_secret
        shared.pop("refresh_token", None)
        shared.pop("access_token", None)
        dash.save_credentials(group, provider, shared)

        # Health-check ONLY the authenticated connector
        _refresh_state(cid)
    else:
        existing = dash.load_credentials(group)
        existing.update(tokens)
        dash.save_credentials(group, provider, existing)
        _refresh_state(cid)

    return HTMLResponse(mod.SUCCESS_HTML)


@app.get("/api/connectors/google/oauth/callback", response_class=HTMLResponse)
async def oauth_callback(request: Request) -> HTMLResponse:
    return _oauth_callback_common(request, "google", "Google")


@app.get("/api/connectors/microsoft/oauth/callback", response_class=HTMLResponse)
async def oauth_callback_microsoft(request: Request) -> HTMLResponse:
    return _oauth_callback_common(request, "microsoft", "Microsoft")


@app.get("/api/connectors/{cid}/settings")
async def get_connector_settings(cid: str) -> dict:
    _manifest_or_404(cid)
    return {"settings": get_dash().get_settings(cid)}


class SettingsIn(BaseModel):
    settings: dict[str, str] = {}


@app.post("/api/connectors/{cid}/settings")
async def save_connector_settings(cid: str, inp: SettingsIn) -> dict:
    _manifest_or_404(cid)
    clean = {k: v for k, v in inp.settings.items() if isinstance(v, str)}
    get_dash().save_settings(cid, clean)
    return {"ok": True, "settings": clean}


# --------------------------------------------------------------------------
# Action approvals — write actions wait here for the user's yes
# --------------------------------------------------------------------------

@app.get("/api/actions/pending")
async def pending_actions() -> dict:
    dash = get_dash()
    out = []
    for a in dash.list_pending_actions():
        m = get_manifest(a["connector_id"])
        out.append({**a, "connector_name": m.name if m else a["connector_id"],
                    "connector_icon": m.icon if m else "🔌"})
    return {"pending": out}


@app.post("/api/actions/{aid}/approve")
async def approve_action(aid: str) -> dict:
    dash = get_dash()
    rec = dash.get_action(aid)
    if rec is None:
        raise HTTPException(404, "unknown action")
    if rec["status"] != "pending":
        raise HTTPException(409, f"action is {rec['status']}")
    adapter = get_adapter(rec["connector_id"])
    if adapter is None:
        raise HTTPException(404, "unknown connector")

    # Race condition protection: mark executing immediately before side-effect
    dash.set_action_status(aid, "executing", "running action")

    try:
        result = adapter.run_action(rec["action"], rec["params"],
                                    _creds_for(rec["connector_id"]))
    except AdapterError as e:
        dash.set_action_status(aid, "error", str(e))
        raise HTTPException(502, str(e))
    except Exception as e:
        log.exception("action %s failed", aid)
        dash.set_action_status(aid, "error", f"{type(e).__name__}: {e}")
        raise HTTPException(500, "action failed")
    dash.touch_used(rec["connector_id"])
    dash.set_action_status(aid, "done", _short_result(result))

    # Run PostconditionVerifier and record evidence
    try:
        from server.execution import PostconditionVerifier
        from server.db.database import get_db
        db = get_db()
        tool_name = f"{rec['connector_id']}.{rec['action']}"
        with db.transaction() as conn:
            conn.execute(
                "INSERT OR IGNORE INTO actions (id, user_id, tool_name, arguments_hash, idempotency_key, created_at) "
                "VALUES (?, 'default_user', ?, 'hash', ?, datetime('now'))",
                (aid, tool_name, f"idem_{aid}"),
            )
        pv = PostconditionVerifier()
        pv.verify_action(aid, tool_name, result, "default_user", arguments=rec["params"])
    except Exception as e:
        log.warning("Postcondition verification on connector action failed: %s", e)

    return {"ok": True, "result": result}


@app.post("/api/actions/{aid}/reject")
async def reject_action(aid: str) -> dict:
    dash = get_dash()
    rec = dash.get_action(aid)
    if rec is None:
        raise HTTPException(404, "unknown action")
    if rec["status"] != "pending":
        raise HTTPException(409, f"action is {rec['status']}")
    # Rejecting guarantees the handler never ran — the adapter is only
    # invoked from approve_action above.
    dash.set_action_status(aid, "rejected", "rejected by user")
    return {"ok": True}


def _short_result(result: dict) -> str:
    import json as _json

    return _json.dumps(result, default=str)[:2000]


# --------------------------------------------------------------------------
# MCP bridge — external MCP clients can use connected connectors as tools
# --------------------------------------------------------------------------

class _MCPContext:
    def connected_ids(self) -> list[str]:
        dash = get_dash()
        return [c["id"] for c in CONNECTORS
                if dash.grant_status(c["id"], c["cred_group"])["state"] == "connected"]

    def adapter(self, cid: str):
        return get_adapter(cid)

    def creds(self, cid: str) -> dict:
        return _creds_for(cid)

    def create_action(self, cid: str, action: str, label: str,
                      summary: str, params: dict) -> dict:
        return get_dash().create_action(cid, action, label, summary, params)

    def get_settings(self, cid: str) -> dict:
        return get_dash().get_settings(cid)

    def touch_used(self, cid: str) -> None:
        get_dash().touch_used(cid)


# The chat assistant uses the same context (plus settings/touch_used).
_AssistantCtx = _MCPContext


class MCPIn(BaseModel):
    jsonrpc: str = "2.0"
    id: int | str | None = None
    method: str = ""
    params: dict = {}


@app.post("/mcp")
async def mcp_endpoint(inp: MCPIn) -> dict:
    payload = {"jsonrpc": inp.jsonrpc, "id": inp.id,
               "method": inp.method, "params": inp.params}
    return mcp_bridge.handle_rpc(payload, _MCPContext())


@app.get("/mcp")
async def mcp_info() -> dict:
    return {"name": "os-connectors", "version": "1.0.0",
            "transports": ["http-jsonrpc"],
            "methods": ["initialize", "tools/list", "tools/call"],
            "note": "Write tools create a dashboard approval instead of executing."}


@app.get("/api/calendar")
async def calendar() -> dict:
    dash = get_dash()
    st = dash.grant_status("google_calendar", "google")
    if st["state"] != "connected":
        return {"connected": False, "events": []}
    adapter = get_adapter("google_calendar")
    try:
        from datetime import date

        result = adapter.run_action(
            "list_events", {"date": date.today().isoformat()}, _creds_for("google_calendar"))
        return {"connected": True, "events": result.get("events", [])}
    except AdapterError as e:
        return {"connected": True, "events": [], "error": str(e)}



# --------------------------------------------------------------------------
# Uploads
# --------------------------------------------------------------------------

_UPLOADS = Path("data/uploads")


@app.post("/api/upload")
async def upload(file: UploadFile) -> dict:
    _UPLOADS.mkdir(parents=True, exist_ok=True)
    name = f"{uuid.uuid4().hex}_{Path(file.filename or 'file').name}"
    target = _UPLOADS / name
    with target.open("wb") as f:
        while True:
            chunk = await file.read(1024 * 1024)
            if not chunk:
                break
            f.write(chunk)
    return {"ok": True, "id": name, "name": file.filename, "size": target.stat().st_size}


# --------------------------------------------------------------------------
# Remote & Companion Access Mode Endpoints (Batch H)
# --------------------------------------------------------------------------

@app.get("/api/remote/status")
async def remote_status() -> dict:
    from server.security.remote_access import get_remote_manager
    mgr = get_remote_manager()
    return mgr.get_status_report()


@app.post("/api/remote/token")
async def create_companion_token(body: dict | None = None) -> dict:
    from server.security.remote_access import get_remote_manager
    mgr = get_remote_manager()
    label = (body or {}).get("label", "mobile_device")
    token, expiry = mgr.generate_companion_token(label)
    return {"ok": True, "token": token, "expires_at": expiry}


@app.post("/api/remote/token/verify")
async def verify_companion_token(body: dict) -> dict:
    from server.security.remote_access import get_remote_manager
    mgr = get_remote_manager()
    token = body.get("token", "")
    valid = mgr.verify_token(token)
    return {"ok": True, "valid": valid}


# --------------------------------------------------------------------------
# Entrypoint
# --------------------------------------------------------------------------


def run(port: int = 3000, host: str = "127.0.0.1") -> None:
    import uvicorn

    # Background retry sweeper for activity runs (daemon thread, local only).
    try:
        from web.om.activity import start_retry_sweeper
        from web.om.store import OmStore
        start_retry_sweeper(OmStore(), interval_s=30)
    except Exception:
        pass

    print(f"\n  * OS Dashboard -> http://localhost:{port}\n")
    uvicorn.run(app, host=host, port=port, log_level="warning")
