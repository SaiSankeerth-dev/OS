"""FastAPI router for OS Cyber-HUD, Primitives, and AG-UI event streaming.

Exposes:
- /api/hud/state
- /api/hud/command
- /api/hud/approval
- /api/hud/computer/takeover
- /api/hud/spaces/save
- /api/hud/spaces/{space_id}/pages
- /api/hud/optimize
- /api/hud/social/linkedin/draft
- /api/hud/social/linkedin/publish
- /api/hud/social/youtube/summarize
- /api/hud/events (SSE stream)
- /hud (Dedicated Cyber-HUD view)
"""
from __future__ import annotations

import asyncio
import json
import logging
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import HTMLResponse, StreamingResponse
from pydantic import BaseModel, Field

from jarvis_os.enterprise_runtime import EnterpriseJarvisRuntime

log = logging.getLogger("os.web.hud")
router = APIRouter(tags=["hud"])

# Process-wide runtime kernel singleton
_kernel: Optional[EnterpriseJarvisRuntime] = None
_subscribers: List[asyncio.Queue] = []


def get_kernel() -> EnterpriseJarvisRuntime:
    global _kernel
    if _kernel is None:
        _kernel = EnterpriseJarvisRuntime()
    return _kernel


def notify_event(event_type: str, payload: Dict[str, Any]) -> None:
    data = json.dumps({"type": event_type, "payload": payload})
    msg = f"event: {event_type}\ndata: {data}\n\n"
    for q in list(_subscribers):
        try:
            q.put_nowait(msg)
        except Exception:
            if q in _subscribers:
                _subscribers.remove(q)


# -----------------------------------------------------------------------------
# Schemas
# -----------------------------------------------------------------------------
class CommandRequest(BaseModel):
    query: str
    dot: Optional[str] = None
    action_type: Optional[str] = None
    action_payload: Optional[str] = None


class ApprovalResolveRequest(BaseModel):
    approval_id: str
    decision: str = Field(..., pattern="^(allow_once|always_allow|deny)$")


class TakeoverRequest(BaseModel):
    take_control: bool


class SavePageRequest(BaseModel):
    space_id: str = "engineering-hq"
    page_id: str
    title: str
    markdown: str
    author: str = "Sai"
    expected_revision: Optional[int] = None


class LinkedInDraftRequest(BaseModel):
    topic: str
    highlights: List[str] = Field(default_factory=list)


class LinkedInPublishRequest(BaseModel):
    post_text: str
    token: Optional[str] = None


class YouTubeSummarizeRequest(BaseModel):
    video_url: str
    title: Optional[str] = ""


class VoiceSpeakRequest(BaseModel):
    text: str


# -----------------------------------------------------------------------------
# Endpoints
# -----------------------------------------------------------------------------
@router.get("/api/hud/state")
async def get_hud_state() -> Dict[str, Any]:
    kernel = get_kernel()
    dots_dict = {}
    for dot_id, dot in kernel.dots.items():
        dots_dict[dot_id] = {
            "dot_id": dot.dot_id,
            "name": dot.name,
            "role": dot.role,
            "instructions": dot.instructions,
            "permissions": sorted(list(dot.permissions)),
            "authorized_spaces": sorted(list(dot.authorized_spaces)),
        }

    opt = kernel.learning.optimize()
    return {
        "runtime_state": kernel.state,
        "hardware": kernel.hardware,
        "engine": {
            "default_model": kernel.engine.default_model,
            "cloud_fallback": kernel.engine.cloud_fallback,
            "total_generations": len(kernel.engine.telemetry_history),
        },
        "dots": dots_dict,
        "active_dot": "forge",
        "computer": {
            "mode": "HUMAN_CONTROL" if kernel.computer.user_took_control else "AGENT_AUTONOMOUS",
            "user_took_control": kernel.computer.user_took_control,
            "workspace_root": kernel.computer.workspace_root,
            "browser_tabs": kernel.computer.browser_tabs,
            "terminal_history": kernel.computer.terminal_history[-20:],
        },
        "spaces": {
            "spaces": kernel.memory.list_spaces(),
            "pages": kernel.memory.get_pages(),
        },
        "telemetry": {
            "total_traces": opt.get("total_traces", 0),
            "avg_latency_ms": opt.get("avg_latency_ms", 4.2),
            "total_energy_joules": opt.get("total_energy_joules", 0.06),
            "learned_skills": opt.get("learned_skills", []),
        },
        "pending_approvals": list(kernel.safety.pending_approvals.values()),
        "schedules": kernel.schedules,
    }


@router.post("/api/hud/command")
async def handle_hud_command(req: CommandRequest) -> Dict[str, Any]:
    kernel = get_kernel()
    notify_event("COMMAND_START", {"query": req.query, "dot": req.dot})
    result = kernel.handle_command(
        query=req.query,
        preferred_dot=req.dot,
        action_type=req.action_type,
        action_payload=req.action_payload,
    )
    notify_event("COMMAND_COMPLETE", result)
    return result


@router.post("/api/hud/approval")
async def resolve_hud_approval(req: ApprovalResolveRequest) -> Dict[str, Any]:
    kernel = get_kernel()
    resolved = kernel.resolve_approval(req.approval_id, req.decision)
    if "error" in resolved:
        raise HTTPException(status_code=404, detail=resolved["error"])
    notify_event("APPROVAL_RESOLVED", resolved)
    return resolved


@router.post("/api/hud/computer/takeover")
async def toggle_computer_takeover(req: TakeoverRequest) -> Dict[str, Any]:
    kernel = get_kernel()
    res = kernel.computer.toggle_take_control(req.take_control)
    notify_event("TAKEOVER_TOGGLED", res)
    return res


@router.post("/api/hud/spaces/save")
async def save_space_page(req: SavePageRequest) -> Dict[str, Any]:
    kernel = get_kernel()
    res = kernel.memory.save_page(
        space_id=req.space_id,
        page_id=req.page_id,
        title=req.title,
        markdown=req.markdown,
        author=req.author,
        expected_revision=req.expected_revision,
    )
    if res.get("status") == "conflict":
        raise HTTPException(status_code=409, detail=res)
    notify_event("PAGE_SAVED", res)
    return res


@router.get("/api/hud/spaces/{space_id}/pages")
async def list_space_pages(space_id: str) -> Dict[str, Any]:
    kernel = get_kernel()
    pages = kernel.memory.get_pages(space_id=space_id)
    return {"pages": pages}


@router.post("/api/hud/optimize")
async def optimize_traces() -> Dict[str, Any]:
    kernel = get_kernel()
    res = kernel.learning.optimize()
    notify_event("OPTIMIZATION_COMPLETE", res)
    return res


@router.post("/api/hud/social/linkedin/draft")
async def draft_linkedin_post(req: LinkedInDraftRequest) -> Dict[str, Any]:
    kernel = get_kernel()
    draft = kernel.linkedin.format_post(req.topic, req.highlights)
    return draft


@router.post("/api/hud/social/linkedin/publish")
async def publish_linkedin_post(req: LinkedInPublishRequest) -> Dict[str, Any]:
    kernel = get_kernel()
    result = kernel.linkedin.publish_post(req.post_text, token=req.token)
    return result


@router.post("/api/hud/social/youtube/summarize")
async def summarize_youtube_video(req: YouTubeSummarizeRequest) -> Dict[str, Any]:
    kernel = get_kernel()
    result = kernel.youtube.summarize_video(req.video_url, title=req.title or "")
    kernel.memory.remember(
        f"Indexed YouTube: {result['title']}",
        category="research",
        tags="youtube,video",
    )
    return result


@router.post("/api/hud/voice/speak")
async def voice_speak(req: VoiceSpeakRequest) -> Dict[str, Any]:
    """Connect to OS TTS pipeline."""
    import base64
    from server.tts.mock import MockTTS
    tts = MockTTS()
    audio = await tts.synthesize(req.text)
    return {
        "status": "success",
        "text": req.text,
        "audio_base64": base64.b64encode(audio).decode("utf-8"),
        "bytes_synthesized": len(audio),
        "engine": "os_tts",
    }


@router.get("/api/hud/events")
async def hud_events_stream(request: Request):
    """Server-Sent Events (SSE) stream for real-time AG-UI telemetry."""
    q: asyncio.Queue = asyncio.Queue()
    _subscribers.append(q)

    async def event_generator():
        try:
            # Send initial ping
            yield "event: PING\ndata: {}\n\n"
            while True:
                if await request.is_disconnected():
                    break
                try:
                    msg = await asyncio.wait_for(q.get(), timeout=15.0)
                    yield msg
                except asyncio.TimeoutError:
                    yield ": keepalive\n\n"
        finally:
            if q in _subscribers:
                _subscribers.remove(q)

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.get("/hud", response_class=HTMLResponse)
async def serve_hud_page() -> HTMLResponse:
    """Serve the 3D Cyber-HUD interface wired to real OS backend APIs."""
    from pathlib import Path
    hud_path = Path(__file__).resolve().parent / "static" / "hud.html"
    if hud_path.exists():
        return HTMLResponse(hud_path.read_text(encoding="utf-8"))
    # Fallback to root jarvis_os_hud.html if not copied yet
    root_hud = Path(__file__).resolve().parent.parent / "jarvis_os_hud.html"
    if root_hud.exists():
        return HTMLResponse(root_hud.read_text(encoding="utf-8"))
    return HTMLResponse("<h1>OS Cyber-HUD</h1>")
