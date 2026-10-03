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
from datetime import datetime
from pathlib import Path

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

_HERE = Path(__file__).resolve().parent
_STATIC = _HERE / "static"
_WORKSPACE = Path.home() / "workspace"

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
    from server.routing import LayaRouter
    from server.state.store import StateStore

    cfg = load_config()
    _engine["cfg"] = cfg
    state_store = StateStore()  # tasks, suggestions, events — real store
    try:
        router = ModelRouter.from_config(
            base_url=cfg.llm.base_url,
            model=cfg.llm.model,
            timeout_sec=float(cfg.llm.request_timeout_sec),
        )
        mgr = ConversationManager(
            cfg, router, fast_router=LayaRouter(), state_store=state_store
        )
        ok = await mgr.health()
        _engine["model_ok"] = bool(ok)
    except Exception as e:  # Ollama down etc. - dashboard still serves
        log.warning("engine degraded (no model): %s", e)
        mgr = ConversationManager(
            cfg, None, fast_router=LayaRouter(), state_store=state_store
        )
        _engine["model_ok"] = False
    _engine["mgr"] = mgr
    _engine["state_store"] = state_store
    log.info("dashboard engine ready (model_ok=%s)", _engine["model_ok"])
    yield


app = FastAPI(title="OS Dashboard", version="1.0.0", lifespan=lifespan)

_engine: dict = {}


def get_mgr():
    return _engine["mgr"]


def get_cfg():
    return _engine["cfg"]


def get_dash():
    from web.store import DashboardStore

    return _engine.setdefault("dash", DashboardStore())


def get_store():
    return _engine["state_store"]


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

app.mount("/static", StaticFiles(directory=str(_STATIC)), name="static")

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
    return {
        "name": name,
        "greeting": _greeting(),
        "mode": f"{persona} Mode",
        "online": True,
        "model_ok": _engine.get("model_ok", False),
        "model": getattr(cfg.llm, "model", ""),
    }


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
    except Exception as e:
        log.exception("approve failed")
        text = f"Approval failed: {type(e).__name__}."
    return {"ok": True, "text": text}


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
async def watcher_seen(nid: int) -> dict:
    get_store().mark_suggestion_seen(nid)
    return {"ok": True}


@app.get("/api/skills")
async def skills() -> dict:
    mgr = get_mgr()
    reg = getattr(mgr, "tool_registry", None)
    out: list[dict] = []
    if reg is not None:
        for spec in reg.specs():
            out.append(
                {
                    "name": spec.name,
                    "description": spec.description,
                    "category": getattr(spec, "category", ""),
                    "mode": getattr(spec.execution_mode, "value", str(spec.execution_mode)),
                }
            )
    return {"skills": out}


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
    return get_dash().load_credentials(m.cred_group)


# Pending Google OAuth flows: state -> {"cid", "created"}. Single-use, 10 min.
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
    creds = dash.load_credentials(m.cred_group)
    if m.auth_kind in ("google_oauth", "microsoft_oauth") and not creds.get("refresh_token"):
        provider = "Microsoft" if m.auth_kind == "microsoft_oauth" else "Google"
        dash.set_state(cid, "granted", f"Press “Sign in with {provider}” to sign in.")
        return dash.grant_status(cid, m.cred_group)
    if not st["has_credentials"]:
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
    if c["auth_kind"] in ("google_oauth", "microsoft_oauth"):
        creds = dash.load_credentials(c["cred_group"])
        needs_oauth = not creds.get("refresh_token")
    return {**c, "state": st["state"],
            "scopes_granted": st["scopes"],
            "has_credentials": st["has_credentials"],
            "needs_oauth": needs_oauth,
            "health_msg": st["health_msg"],
            "health_at": st["health_at"],
            "last_used_at": st["last_used_at"]}


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
async def revoke_connector(cid: str) -> dict:
    m = _manifest_or_404(cid)
    get_dash().revoke(cid, m.cred_group)
    return {"ok": True}


class CredsIn(BaseModel):
    label: str = ""
    fields: dict[str, str] = {}


@app.post("/api/connectors/{cid}/credentials")
async def save_creds(cid: str, inp: CredsIn) -> dict:
    m = _manifest_or_404(cid)
    dash = get_dash()
    st = dash.grant_status(cid, m.cred_group)
    if st["state"] in ("available", "denied"):
        raise HTTPException(403, "grant permission first")
    merged = dash.load_credentials(m.cred_group)
    merged.update({k: v for k, v in inp.fields.items() if v})
    dash.save_credentials(m.cred_group, inp.label or m.name, merged)
    status = _refresh_state(cid)
    return {"ok": True, "status": status}


@app.post("/api/connectors/{cid}/test")
async def test_connector(cid: str) -> dict:
    _manifest_or_404(cid)
    status = _refresh_state(cid)
    return {"ok": status["state"] == "connected", "status": status}


@app.get("/api/connectors/{cid}/oauth/start")
async def oauth_start(cid: str, request: Request) -> dict:
    m = _manifest_or_404(cid)
    mod = _OAUTH_MODULES.get(m.auth_kind)
    if mod is None:
        raise HTTPException(400, "this connector has no OAuth flow")
    provider = "Microsoft" if m.auth_kind == "microsoft_oauth" else "Google"
    creds = _creds_for(cid)
    if not creds.get("client_id") or not creds.get("client_secret"):
        raise HTTPException(400, f"save your {provider} OAuth Client ID and Secret first")
    group = _OAUTH_GROUPS[m.auth_kind]
    redirect_uri = str(request.base_url).rstrip("/") + f"/api/connectors/{group}/oauth/callback"
    # Random single-use state prevents CSRF on the callback (valid 10 min).
    state = secrets.token_urlsafe(16)
    _OAUTH_STATES[state] = {"cid": cid, "created": time.time()}
    try:
        url, _ = mod.authorization_url(
            creds["client_id"], creds["client_secret"], redirect_uri, state=state)
    except RuntimeError as e:
        _OAUTH_STATES.pop(state, None)
        raise HTTPException(400, str(e))
    return {"url": url}


def _oauth_callback_common(request: Request, group: str, provider: str) -> HTMLResponse:
    mod = _OAUTH_MODULES["microsoft_oauth" if group == "microsoft" else "google_oauth"]
    params = dict(request.query_params)
    if "error" in params:
        raise HTTPException(400, f"{provider} said no: {params.get('error')}")
    state = params.get("state", "")
    rec = _OAUTH_STATES.pop(state, None)
    if rec is None or time.time() - rec["created"] > 600:
        raise HTTPException(
            400, "This sign-in link expired or is invalid — start over from the Connectors page.")
    code = params.get("code")
    cid = rec["cid"]
    if not code:
        raise HTTPException(400, "missing code")
    dash = get_dash()
    existing = dash.load_credentials(group)
    client_id = existing.get("client_id")
    client_secret = existing.get("client_secret")
    if not client_id or not client_secret:
        raise HTTPException(
            400, f"Your {provider} OAuth client was removed — save it again, then reconnect.")
    redirect_uri = str(request.base_url).rstrip("/") + f"/api/connectors/{group}/oauth/callback"
    try:
        if group == "microsoft":
            tokens = mod.exchange_code(client_id, client_secret, redirect_uri, code)
        else:
            tokens = mod.exchange_code(
                client_id, client_secret, redirect_uri, str(request.url))
    except Exception as e:
        raise HTTPException(400, f"Token exchange failed: {e}")
    existing.update(tokens)
    dash.save_credentials(group, provider, existing)
    # health-check every granted connector in this group so they flip to connected
    from web.connectors.manifests import MANIFESTS

    for gm in MANIFESTS:
        if gm.cred_group == group:
            st = dash.grant_status(gm.id, group)
            if st["state"] in ("granted", "setup_error") and st["has_credentials"]:
                _refresh_state(gm.id)
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
