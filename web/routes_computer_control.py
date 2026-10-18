"""FastAPI router for OS Computer-Use and Browser Automation.

Exposes REST endpoints for:
- Backend capability detection & health monitoring
- Session lifecycle & remote execution (navigate, click, type, screenshot)
- Bounded task loop management with checkpoints
- Human takeover & HITL safety approval gates
- Rate-limits & quota status
- Emergency kill-switch controls
"""
from __future__ import annotations

import asyncio
import base64
import logging
import time
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, Query, Response, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field

from server.computer.arbiter import ControlState, get_arbiter_registry
from server.computer.interface import (
    ComputerControlError,
    SafetyGateTriggeredError,
)
from server.computer.rate_limits import get_rate_limits_tracker
from server.computer.registry import get_computer_registry
from server.computer.safety import get_computer_safety_guard
from server.computer.scheduler import get_quota_scheduler
from server.computer.browser_agent import BrowserAgentEngine
from server.computer.task_loop import (
    BoundedTaskExecutor,
    TaskPlan,
    TaskStep,
    get_bounded_task_executor,
)

log = logging.getLogger("os.web.computer")
router = APIRouter(prefix="/api/computer", tags=["computer_control"])
_ACTIVE_ENGINES: Dict[str, BrowserAgentEngine] = {}


# -----------------------------------------------------------------------------
# Request / Response Schemas
# -----------------------------------------------------------------------------
class StartSessionIn(BaseModel):
    backend: Optional[str] = None
    session_id: Optional[str] = None
    headless: bool = True
    cdp_url: Optional[str] = None
    initial_url: Optional[str] = "https://google.com"


class NavigateIn(BaseModel):
    url: str


class ActionIn(BaseModel):
    action_type: str  # click_element, type_text, press_key, scroll
    target: Optional[str] = None
    text: Optional[str] = None
    key: Optional[str] = None
    direction: Optional[str] = "down"
    amount: Optional[int] = 300
    approval_ticket_id: Optional[str] = None


class MouseEventIn(BaseModel):
    event_type: str  # mousemove, mousedown, mouseup, click, dblclick, wheel
    x: float
    y: float
    button: str = "left"
    click_count: int = 1
    delta_x: float = 0.0
    delta_y: float = 0.0


class KeyboardEventIn(BaseModel):
    event_type: str  # keydown, keyup, press, type
    key: str = ""
    code: str = ""
    text: str = ""


class KeyboardTypeIn(BaseModel):
    text: str
    target: Optional[str] = None
    agent_id: Optional[str] = None
    user_directed: bool = True


class KeyboardPressIn(BaseModel):
    key: str
    agent_id: Optional[str] = None
    user_directed: bool = True


class KeyboardShortcutIn(BaseModel):
    shortcut: str
    agent_id: Optional[str] = None
    user_directed: bool = True


class NavActionIn(BaseModel):
    action: str  # back, forward, reload


class ControlActionIn(BaseModel):
    action: str  # take_control, pause_ai, resume_ai, stop_ai, start_task
    task_id: Optional[str] = None
    goal: Optional[str] = None
    allowed_domains: Optional[List[str]] = None


class CreateTaskIn(BaseModel):
    goal: str
    backend: Optional[str] = None
    steps: Optional[List[Dict[str, Any]]] = None
    priority: int = 5


class ResolveApprovalIn(BaseModel):
    decision: str  # approve or reject
    user: str = "human"


class EmergencyStopIn(BaseModel):
    active: bool


# -----------------------------------------------------------------------------
# Backend Management & Capabilities
# -----------------------------------------------------------------------------
@router.get("/backends")
async def list_backends() -> Dict[str, Any]:
    """List all 5 registered computer-control backends with their capabilities and health."""
    registry = get_computer_registry()
    backends = registry.list_backends()
    return {"ok": True, "backends": backends}


@router.post("/backends/{backend_name}/health")
async def check_backend_health(backend_name: str) -> Dict[str, Any]:
    """Run an on-demand health check on a specific backend."""
    registry = get_computer_registry()
    try:
        backend = registry.get_backend(backend_name)
        if hasattr(backend, "health_check"):
            try:
                health = backend.health_check(force_refresh=True)
            except TypeError:
                health = backend.health_check()
        else:
            health = backend.health_check()
        with registry._lock:
            registry._health_cache[backend_name] = health
        return {
            "ok": True,
            "backend": backend_name,
            "health": {
                "ok": bool(health.ok),
                "status": "ready" if health.ok else "offline",
                "message": health.message,
                "details": health.details,
            },
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# -----------------------------------------------------------------------------
# Session Lifecycle & Actions
# -----------------------------------------------------------------------------
@router.post("/sessions")
async def start_session(inp: StartSessionIn) -> Dict[str, Any]:
    """Start or attach to a computer session."""
    registry = get_computer_registry()
    try:
        if inp.backend:
            backend = registry.get_backend(inp.backend)
        else:
            backend = registry.route_task(task_description="Browser session")

        state = backend.start_session({
            "session_id": inp.session_id,
            "headless": inp.headless,
            "cdp_url": inp.cdp_url,
            "initial_url": inp.initial_url,
        })
        return {
            "ok": True,
            "session_id": state.session_id,
            "backend": backend.name,
            "status": state.status,
            "current_url": state.current_url,
        }
    except Exception as e:
        log.error(f"Failed to start session: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sessions")
async def list_sessions() -> Dict[str, Any]:
    """List all currently active computer control sessions across backends."""
    registry = get_computer_registry()
    sessions = []
    for b_name in ["browser_harness", "docker_desktop"]:
        try:
            backend = registry.get_backend(b_name)
            if hasattr(backend, "_sessions"):
                with backend._registry_lock:
                    for sid, s in backend._sessions.items():
                        sessions.append({
                            "session_id": sid,
                            "backend": backend.name,
                            "status": s.status,
                            "current_url": s.current_url,
                            "headless": s.metadata.get("headless", True) if s.metadata else True,
                            "stream_url": s.metadata.get("stream_url"),
                        })
        except Exception as e:
            log.debug(f"Failed to list sessions for {b_name}: {e}")
    return {"ok": True, "sessions": sessions}


@router.get("/desktop/status")
async def get_desktop_status() -> Dict[str, Any]:
    """Retrieve Docker Virtual Desktop runtime health and streaming coordinates."""
    registry = get_computer_registry()
    try:
        backend = registry.get_backend("docker_desktop")
        health = backend.health_check(force_refresh=True)
        details = health.details or {}

        # Precise, truthful status categorization
        if health.ok and details.get("stream_ready") and details.get("cdp_ready") and details.get("frame_variance_ok"):
            computed_status = "ready"
        elif not details.get("daemon_running"):
            computed_status = "offline"
        elif not details.get("container_running"):
            computed_status = "standby"
        elif details.get("black_screen_detected"):
            computed_status = "degraded"
        elif details.get("container_running") and (details.get("stream_ready") or details.get("cdp_ready")):
            computed_status = "degraded"
        else:
            computed_status = "starting"

        return {
            "ok": bool(health.ok),
            "health": {
                "ok": bool(health.ok),
                "status": computed_status,
                "message": health.message,
                "details": details,
            },
            "stream_url": details.get("stream_url", "http://127.0.0.1:6080/vnc.html?autoconnect=true&resize=scale"),
            "cdp_url": details.get("cdp_url", "http://127.0.0.1:9222"),
        }
    except Exception as e:
        return {
            "ok": False,
            "error": str(e),
            "health": {"ok": False, "status": "offline", "message": f"Docker desktop error: {e}", "details": {}},
        }


@router.post("/desktop/start")
async def start_desktop_container() -> Dict[str, Any]:
    """Start or ensure running the Docker desktop container."""
    registry = get_computer_registry()
    try:
        backend = registry.get_backend("docker_desktop")
        ready = backend.ensure_container_running(timeout_sec=20)
        health = backend.health_check(force_refresh=True)
        return {"ok": ready, "health": health.dict() if hasattr(health, "dict") else health.__dict__}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start desktop container: {e}")


@router.post("/desktop/stop")
async def stop_desktop_container() -> Dict[str, Any]:
    """Stop the Docker desktop container."""
    registry = get_computer_registry()
    try:
        backend = registry.get_backend("docker_desktop")
        stopped = backend.stop_container()
        health = backend.health_check(force_refresh=True)
        return {"ok": stopped, "health": health.dict() if hasattr(health, "dict") else health.__dict__}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to stop desktop container: {e}")


@router.post("/desktop/restart")
async def restart_desktop_container() -> Dict[str, Any]:
    """Restart the Docker desktop container and wait for services."""
    registry = get_computer_registry()
    try:
        backend = registry.get_backend("docker_desktop")
        restarted = backend.restart_container(timeout_sec=20)
        health = backend.health_check(force_refresh=True)
        return {"ok": restarted, "health": health.dict() if hasattr(health, "dict") else health.__dict__}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to restart desktop container: {e}")



@router.get("/sessions/{backend_name}/{session_id}")
async def get_session_state(backend_name: str, session_id: str) -> Dict[str, Any]:
    """Inspect current session state, active tabs, and windows."""
    registry = get_computer_registry()
    try:
        backend = registry.get_backend(backend_name)
        state = backend.get_session_state(session_id)
        tabs = backend.list_tabs(session_id)
        windows = backend.list_windows()
        return {
            "ok": True,
            "session_id": session_id,
            "backend": backend_name,
            "status": state.status,
            "current_url": state.current_url,
            "tabs": [{"tab_id": t.tab_id, "title": t.title, "url": t.url, "active": t.is_active} for t in tabs],
            "windows": [{"window_id": w.window_id, "title": w.title, "active": w.is_active} for w in windows],
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/sessions/{backend_name}/{session_id}")
async def close_session(backend_name: str, session_id: str) -> Dict[str, Any]:
    """Close an active session."""
    registry = get_computer_registry()
    try:
        backend = registry.get_backend(backend_name)
        res = backend.close_session(session_id)
        return {"ok": res.success, "outcome": res.observed_outcome}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/sessions/{backend_name}/{session_id}/navigate")
async def navigate_url(backend_name: str, session_id: str, inp: NavigateIn) -> Dict[str, Any]:
    """Navigate session to a target URL."""
    registry = get_computer_registry()
    safety = get_computer_safety_guard()
    try:
        clean_url = safety.sanitize_url(inp.url)
        backend = registry.get_backend(backend_name)
        res = backend.open_url(session_id, clean_url)
        return {
            "ok": res.success,
            "observed_outcome": res.observed_outcome,
            "verified": res.verified,
            "error": res.error,
        }
    except SafetyGateTriggeredError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sessions/{backend_name}/{session_id}/action")
async def perform_action(backend_name: str, session_id: str, inp: ActionIn) -> Dict[str, Any]:
    """Execute a single computer action (click, type, press_key, scroll)."""
    registry = get_computer_registry()
    safety = get_computer_safety_guard()
    try:
        # Validate against safety gate
        safety.validate_action(
            session_id=session_id,
            backend=backend_name,
            action=inp.action_type,
            target=inp.target,
            payload={"text": inp.text, "key": inp.key},
            approval_ticket_id=inp.approval_ticket_id,
        )

        backend = registry.get_backend(backend_name)
        if inp.action_type == "click_element":
            res = backend.click_element(session_id, inp.target)
        elif inp.action_type == "type_text":
            res = backend.type_text(session_id, inp.text or "", inp.target)
        elif inp.action_type == "press_key":
            res = backend.press_key(session_id, inp.key or "Enter")
        elif inp.action_type == "scroll":
            res = backend.scroll(session_id, inp.direction or "down", inp.amount or 300)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported action: {inp.action_type}")

        return {
            "ok": res.success,
            "observed_outcome": res.observed_outcome,
            "verified": res.verified,
            "error": res.error,
        }
    except SafetyGateTriggeredError as e:
        return {
            "ok": False,
            "safety_gate": True,
            "error": str(e),
            "details": getattr(e, "details", {}),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sessions/{backend_name}/{session_id}/screenshot")
async def get_screenshot(backend_name: str, session_id: str, format: str = "png") -> Any:
    """Capture and return real screenshot."""
    registry = get_computer_registry()
    try:
        backend = registry.get_backend(backend_name)
        img_bytes = backend.take_screenshot(session_id)
        if format.lower() == "base64":
            b64 = base64.b64encode(img_bytes).decode("ascii")
            return {"ok": True, "screenshot_base64": b64}
        return Response(content=img_bytes, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sessions/{backend_name}/{session_id}/observe")
async def observe_session(backend_name: str, session_id: str) -> Dict[str, Any]:
    """Observe text, elements, and title of active session."""
    registry = get_computer_registry()
    try:
        backend = registry.get_backend(backend_name)
        obs = backend.observe_screen(session_id)
        return {
            "ok": True,
            "url": obs.url,
            "title": obs.title,
            "text_content": obs.text_content,
            "dom_elements_count": len(obs.dom_elements or []),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sessions/{backend_name}/{session_id}/mouse")
async def forward_mouse(backend_name: str, session_id: str, inp: MouseEventIn) -> Dict[str, Any]:
    """Forward mouse event to browser and notify arbiter of human interaction."""
    registry = get_computer_registry()
    arbiter = get_arbiter_registry().get_or_create(session_id)
    paused, reason = arbiter.on_human_interaction("mouse")
    try:
        backend = registry.get_backend(backend_name)
        if hasattr(backend, "forward_mouse"):
            res = backend.forward_mouse(
                session_id=session_id,
                event_type=inp.event_type,
                x=inp.x,
                y=inp.y,
                button=inp.button,
                click_count=inp.click_count,
                delta_x=inp.delta_x,
                delta_y=inp.delta_y,
            )
            return {
                "ok": res.success,
                "arbiter_state": arbiter.state.value,
                "paused_ai": paused,
                "reason": reason,
            }
        return {"ok": True, "arbiter_state": arbiter.state.value}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sessions/{backend_name}/{session_id}/keyboard")
async def forward_keyboard(backend_name: str, session_id: str, inp: KeyboardEventIn) -> Dict[str, Any]:
    """Forward keyboard event to browser and notify arbiter of human interaction."""
    registry = get_computer_registry()
    arbiter = get_arbiter_registry().get_or_create(session_id)
    paused, reason = arbiter.on_human_interaction("keyboard")
    try:
        backend = registry.get_backend(backend_name)
        if hasattr(backend, "forward_keyboard"):
            res = backend.forward_keyboard(
                session_id=session_id,
                event_type=inp.event_type,
                key=inp.key,
                code=inp.code,
                text=inp.text,
            )
            return {
                "ok": res.success,
                "arbiter_state": arbiter.state.value,
                "paused_ai": paused,
                "reason": reason,
            }
        return {"ok": True, "arbiter_state": arbiter.state.value}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sessions/{backend_name}/{session_id}/keyboard/type")
async def keyboard_type_text(backend_name: str, session_id: str, inp: KeyboardTypeIn) -> Dict[str, Any]:
    """Execute AI typed text entry into the active session."""
    from server.computer.keyboard import get_keyboard_controller
    registry = get_computer_registry()
    safety = get_computer_safety_guard()
    try:
        safety.validate_action(
            session_id=session_id,
            backend=backend_name,
            action="type_text",
            target=inp.target,
            payload={"text": inp.text},
        )
        backend = registry.get_backend(backend_name)
        controller = get_keyboard_controller()
        res = controller.type_text(
            session_id=session_id,
            text=inp.text,
            target=inp.target,
            backend_instance=backend,
            agent_id=inp.agent_id,
            user_directed=inp.user_directed,
        )
        return {
            "ok": res.success,
            "action": res.action,
            "observed_outcome": res.observed_outcome,
            "verified": res.verified,
            "error": res.error,
            "duration_ms": res.duration_ms,
        }
    except SafetyGateTriggeredError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ComputerControlError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sessions/{backend_name}/{session_id}/keyboard/press")
async def keyboard_press_key(backend_name: str, session_id: str, inp: KeyboardPressIn) -> Dict[str, Any]:
    """Execute AI keypress into the active session."""
    from server.computer.keyboard import get_keyboard_controller
    registry = get_computer_registry()
    safety = get_computer_safety_guard()
    try:
        safety.validate_action(
            session_id=session_id,
            backend=backend_name,
            action="press_key",
            payload={"key": inp.key},
        )
        backend = registry.get_backend(backend_name)
        controller = get_keyboard_controller()
        res = controller.press_key(
            session_id=session_id,
            key=inp.key,
            backend_instance=backend,
            agent_id=inp.agent_id,
            user_directed=inp.user_directed,
        )
        return {
            "ok": res.success,
            "action": res.action,
            "observed_outcome": res.observed_outcome,
            "verified": res.verified,
            "error": res.error,
            "duration_ms": res.duration_ms,
        }
    except SafetyGateTriggeredError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ComputerControlError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sessions/{backend_name}/{session_id}/keyboard/shortcut")
async def keyboard_press_shortcut(backend_name: str, session_id: str, inp: KeyboardShortcutIn) -> Dict[str, Any]:
    """Execute AI modifier shortcut (Ctrl+L, Ctrl+A, Enter, etc.) into the active session."""
    from server.computer.keyboard import get_keyboard_controller
    registry = get_computer_registry()
    safety = get_computer_safety_guard()
    try:
        safety.validate_action(
            session_id=session_id,
            backend=backend_name,
            action="press_shortcut",
            payload={"shortcut": inp.shortcut},
        )
        backend = registry.get_backend(backend_name)
        controller = get_keyboard_controller()
        res = controller.press_shortcut(
            session_id=session_id,
            shortcut=inp.shortcut,
            backend_instance=backend,
            agent_id=inp.agent_id,
            user_directed=inp.user_directed,
        )
        return {
            "ok": res.success,
            "action": res.action,
            "observed_outcome": res.observed_outcome,
            "verified": res.verified,
            "error": res.error,
            "duration_ms": res.duration_ms,
        }
    except SafetyGateTriggeredError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ComputerControlError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sessions/{backend_name}/{session_id}/keyboard/release_all")
async def keyboard_release_all(backend_name: str, session_id: str) -> Dict[str, Any]:
    """Release all held keys to prevent stuck keys."""
    from server.computer.keyboard import get_keyboard_controller
    registry = get_computer_registry()
    try:
        backend = registry.get_backend(backend_name)
        controller = get_keyboard_controller()
        res = controller.release_all_keys(session_id=session_id, backend_instance=backend)
        return {
            "ok": res.success,
            "action": res.action,
            "observed_outcome": res.observed_outcome,
            "verified": res.verified,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sessions/{backend_name}/{session_id}/nav_action")
async def nav_action(backend_name: str, session_id: str, inp: NavActionIn) -> Dict[str, Any]:
    """Execute browser navigation action (back, forward, reload)."""
    registry = get_computer_registry()
    arbiter = get_arbiter_registry().get_or_create(session_id)
    arbiter.on_human_interaction("navigation")
    try:
        backend = registry.get_backend(backend_name)
        if inp.action == "back" and hasattr(backend, "navigate_back"):
            res = backend.navigate_back(session_id)
        elif inp.action == "forward" and hasattr(backend, "navigate_forward"):
            res = backend.navigate_forward(session_id)
        elif inp.action == "reload" and hasattr(backend, "navigate_reload"):
            res = backend.navigate_reload(session_id)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported navigation action: {inp.action}")
        return {"ok": res.success, "observed_outcome": res.observed_outcome}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sessions/{backend_name}/{session_id}/frame")
async def get_live_frame(backend_name: str, session_id: str, quality: int = 70) -> Any:
    """Capture and return real-time JPEG frame for low-latency viewport."""
    registry = get_computer_registry()
    try:
        backend = registry.get_backend(backend_name)
        if hasattr(backend, "capture_frame_jpeg"):
            jpeg_bytes = backend.capture_frame_jpeg(session_id, quality=quality)
            return Response(content=jpeg_bytes, media_type="image/jpeg")
        png = backend.take_screenshot(session_id)
        return Response(content=png, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sessions/{backend_name}/{session_id}/arbiter")
async def get_session_arbiter(backend_name: str, session_id: str) -> Dict[str, Any]:
    """Retrieve control ownership, active task status, and AI cursor telemetry."""
    arbiter = get_arbiter_registry().get_or_create(session_id)
    return {"ok": True, **arbiter.get_status()}


@router.post("/sessions/{backend_name}/{session_id}/control")
async def handle_control_action(backend_name: str, session_id: str, inp: ControlActionIn) -> Dict[str, Any]:
    """Handle state machine transitions (take_control, pause_ai, resume_ai, stop_ai, start_task)."""
    arbiter = get_arbiter_registry().get_or_create(session_id)
    executor = get_bounded_task_executor()

    if inp.action == "take_control":
        arbiter.take_human_control()
    elif inp.action == "pause_ai":
        arbiter.pause_ai("User requested pause")
    elif inp.action == "resume_ai":
        ok = arbiter.resume_ai()
        if not ok:
            raise HTTPException(status_code=400, detail="Cannot resume: no paused task found")
        if arbiter.active_task:
            task_id = arbiter.active_task.task_id
            plan = executor.checkpoints.load(task_id)
            if plan:
                plan.status = "running"
                executor.checkpoints.save(plan)
            agent = _ACTIVE_ENGINES.get(session_id)
            if not agent:
                agent = BrowserAgentEngine(
                    session_id=session_id,
                    goal=arbiter.active_task.goal,
                    backend_name=backend_name,
                    max_steps=15,
                )
                agent.plan = plan
                _ACTIVE_ENGINES[session_id] = agent
            agent.run_in_background()
    elif inp.action == "stop_ai":
        arbiter.stop_ai("User stopped AI task")
        _ACTIVE_ENGINES.pop(session_id, None)
    elif inp.action == "start_task":
        if not inp.goal:
            raise HTTPException(status_code=400, detail="Goal is required to start a task")
        agent = BrowserAgentEngine(
            session_id=session_id,
            goal=inp.goal,
            backend_name=backend_name,
            max_steps=15,
        )
        agent.initialize_plan()
        _ACTIVE_ENGINES[session_id] = agent
        agent.run_in_background()

    return {"ok": True, **arbiter.get_status()}


@router.websocket("/ws/{session_id}")
async def browser_websocket_endpoint(websocket: WebSocket, session_id: str):
    """Bidirectional WebSocket for low-latency live frames, input forwarding, and AI cursor events."""
    await websocket.accept()
    registry = get_computer_registry()
    arbiter = get_arbiter_registry().get_or_create(session_id)
    event_queue: asyncio.Queue = asyncio.Queue()

    def _event_handler(evt: Dict[str, Any]):
        try:
            event_queue.put_nowait(evt)
        except Exception:
            pass

    arbiter.add_listener(_event_handler)

    async def _sender():
        try:
            await websocket.send_json({
                "type": "control_state",
                "state": arbiter.state.value,
                "ai_cursor": arbiter.ai_cursor.__dict__,
            })
            while True:
                while not event_queue.empty():
                    evt = await event_queue.get()
                    await websocket.send_json(evt)

                try:
                    backend = registry.get_backend("browser_harness")
                    if hasattr(backend, "capture_frame_jpeg"):
                        frame_bytes = backend.capture_frame_jpeg(session_id, quality=65)
                        b64_frame = base64.b64encode(frame_bytes).decode("ascii")
                        await websocket.send_json({
                            "type": "frame",
                            "image": f"data:image/jpeg;base64,{b64_frame}",
                            "timestamp": time.time(),
                        })
                except Exception:
                    pass

                await asyncio.sleep(0.08)  # ~12 FPS live viewport stream
        except (WebSocketDisconnect, asyncio.CancelledError):
            pass
        except Exception as e:
            log.debug("WebSocket sender closed: %s", e)

    async def _receiver():
        try:
            while True:
                data = await websocket.receive_json()
                msg_type = data.get("type")

                if msg_type == "mouse":
                    paused, reason = arbiter.on_human_interaction("mouse")
                    backend = registry.get_backend("browser_harness")
                    if hasattr(backend, "forward_mouse"):
                        backend.forward_mouse(
                            session_id=session_id,
                            event_type=data.get("event", "mousemove"),
                            x=float(data.get("x", 0)),
                            y=float(data.get("y", 0)),
                            button=data.get("button", "left"),
                            click_count=int(data.get("click_count", 1)),
                            delta_x=float(data.get("deltaX", data.get("delta_x", 0))),
                            delta_y=float(data.get("deltaY", data.get("delta_y", 0))),
                        )

                elif msg_type == "keyboard":
                    paused, reason = arbiter.on_human_interaction("keyboard")
                    backend = registry.get_backend("browser_harness")
                    if hasattr(backend, "forward_keyboard"):
                        backend.forward_keyboard(
                            session_id=session_id,
                            event_type=data.get("event", "keydown"),
                            key=data.get("key", ""),
                            code=data.get("code", ""),
                            text=data.get("text", ""),
                        )

                elif msg_type == "nav_action":
                    arbiter.on_human_interaction("navigation")
                    backend = registry.get_backend("browser_harness")
                    act = data.get("action")
                    if act == "back" and hasattr(backend, "navigate_back"):
                        backend.navigate_back(session_id)
                    elif act == "forward" and hasattr(backend, "navigate_forward"):
                        backend.navigate_forward(session_id)
                    elif act == "reload" and hasattr(backend, "navigate_reload"):
                        backend.navigate_reload(session_id)

                elif msg_type == "navigate":
                    arbiter.on_human_interaction("navigation")
                    clean_url = get_computer_safety_guard().sanitize_url(data.get("url", ""))
                    backend = registry.get_backend("browser_harness")
                    backend.open_url(session_id, clean_url)

                elif msg_type == "control":
                    ctrl = data.get("action")
                    if ctrl == "take_control":
                        arbiter.take_human_control()
                    elif ctrl == "pause_ai":
                        arbiter.pause_ai("User paused AI")
                    elif ctrl == "resume_ai":
                        arbiter.resume_ai()
                    elif ctrl == "stop_ai":
                        arbiter.stop_ai("User stopped AI")

        except (WebSocketDisconnect, asyncio.CancelledError):
            pass
        except Exception as e:
            log.debug("WebSocket receiver closed: %s", e)

    sender_task = asyncio.create_task(_sender())
    receiver_task = asyncio.create_task(_receiver())

    try:
        done, pending = await asyncio.wait(
            [sender_task, receiver_task],
            return_when=asyncio.FIRST_COMPLETED,
        )
        for t in pending:
            t.cancel()
            try:
                await t
            except (asyncio.CancelledError, Exception):
                pass
    except Exception:
        pass
    finally:
        arbiter.remove_listener(_event_handler)
        for t in (sender_task, receiver_task):
            if not t.done():
                t.cancel()


# -----------------------------------------------------------------------------
# Task Loop & Human Takeover
# -----------------------------------------------------------------------------
@router.post("/tasks")
def create_task(inp: CreateTaskIn) -> Dict[str, Any]:
    """Create and persist a new computer task plan."""
    executor = get_bounded_task_executor()
    steps = []
    if inp.steps:
        for idx, s in enumerate(inp.steps):
            steps.append(
                TaskStep(
                    step_id=s.get("id") or f"step-{idx+1}",
                    description=s.get("description", ""),
                    action=s.get("action", "open_url"),
                    target=s.get("target"),
                    payload=s.get("payload", {}),
                )
            )

    plan = executor.create_plan(
        goal=inp.goal,
        backend_name=inp.backend,
        steps=steps,
    )

    # Enqueue in quota scheduler
    scheduler = get_quota_scheduler()
    scheduler.enqueue_task(task_id=plan.task_id, priority=inp.priority)

    return {
        "ok": True,
        "task_id": plan.task_id,
        "backend": plan.backend_name,
        "status": plan.status,
        "total_steps": len(plan.steps),
    }


@router.get("/tasks/{task_id}")
def get_task(task_id: str) -> Dict[str, Any]:
    """Fetch task checkpoint state, execution steps, and progress."""
    executor = get_bounded_task_executor()
    plan = executor.checkpoints.load(task_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Task not found")
    return {
        "ok": True,
        "task_id": plan.task_id,
        "goal": plan.goal,
        "backend": plan.backend_name,
        "session_id": plan.session_id,
        "status": plan.status,
        "current_step_index": plan.current_step_index,
        "human_takeover_active": plan.human_takeover_active,
        "pending_approval_id": plan.pending_approval_id,
        "error_summary": plan.error_summary,
        "steps": [
            {
                "step_id": s.step_id,
                "description": s.description,
                "action": s.action,
                "status": s.status,
                "outcome": s.outcome,
                "verified": s.verified,
                "error": s.error,
                "duration_ms": s.duration_ms,
            }
            for s in plan.steps
        ],
    }


@router.post("/tasks/{task_id}/step")
def execute_task_step(task_id: str) -> Dict[str, Any]:
    """Execute the next step in the task plan."""
    executor = get_bounded_task_executor()
    try:
        step = executor.execute_next_step(task_id)
        return {
            "ok": True,
            "step_id": step.step_id,
            "status": step.status,
            "outcome": step.outcome,
            "verified": step.verified,
            "error": step.error,
        }
    except SafetyGateTriggeredError as gate_err:
        return {
            "ok": False,
            "safety_gate": True,
            "message": str(gate_err),
            "details": getattr(gate_err, "details", {}),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/tasks/{task_id}/takeover")
def start_human_takeover(task_id: str, reason: str = "User initiated") -> Dict[str, Any]:
    """Pause agent execution so the human user can directly operate the browser/desktop."""
    executor = get_bounded_task_executor()
    try:
        plan = executor.pause_for_human_takeover(task_id, reason=reason)
        return {
            "ok": True,
            "task_id": task_id,
            "status": plan.status,
            "human_takeover_active": plan.human_takeover_active,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/tasks/{task_id}/resume")
def resume_from_human_takeover(task_id: str) -> Dict[str, Any]:
    """Return control to OS after human finishes takeover."""
    executor = get_bounded_task_executor()
    try:
        plan = executor.resume_from_human_takeover(task_id)
        return {
            "ok": True,
            "task_id": task_id,
            "status": plan.status,
            "human_takeover_active": plan.human_takeover_active,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# -----------------------------------------------------------------------------
# Safety, Approvals & Rate Limits
# -----------------------------------------------------------------------------
@router.get("/approvals")
async def list_approvals() -> Dict[str, Any]:
    """List pending human approval tickets."""
    safety = get_computer_safety_guard()
    pending = safety.get_pending_approvals()
    return {
        "ok": True,
        "pending": [
            {
                "ticket_id": t.ticket_id,
                "session_id": t.session_id,
                "backend": t.backend,
                "action_type": t.action_type,
                "target": t.target,
                "reason": t.reason,
                "risk_level": t.risk_level.value,
                "created_at": t.created_at,
            }
            for t in pending
        ],
    }


@router.post("/approvals/{ticket_id}/resolve")
async def resolve_approval(ticket_id: str, inp: ResolveApprovalIn) -> Dict[str, Any]:
    """Approve or reject a sensitive computer action."""
    safety = get_computer_safety_guard()
    try:
        ticket = safety.resolve_approval(ticket_id, decision=inp.decision, user=inp.user)
        return {
            "ok": True,
            "ticket_id": ticket.ticket_id,
            "status": ticket.status,
            "resolved_at": ticket.resolved_at,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/rate_limits")
async def get_rate_limits() -> Dict[str, Any]:
    """Get active model cooldowns and scheduler quota metrics."""
    scheduler = get_quota_scheduler()
    return {"ok": True, **scheduler.get_status()}


@router.post("/emergency_stop")
async def emergency_stop(inp: EmergencyStopIn) -> Dict[str, Any]:
    """Trip or reset global kill switch."""
    safety = get_computer_safety_guard()
    if inp.active:
        safety.trigger_emergency_stop()
    else:
        safety.reset_emergency_stop()
    return {"ok": True, "emergency_stopped": safety.is_emergency_stopped()}
