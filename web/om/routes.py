"""FastAPI routes for the OpenMuse port: all /api/om/* endpoints."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import JSONResponse

from .activity import ActivityError, ActivityService, start_retry_sweeper
from .browser import BrowserError, BrowserService
from .computer import ComputerError, get_computer
from .documents import DocumentError, DocumentService
from .finance import FinanceError, FinanceService
from .mailrules import MailRulesError, MailRulesService
from .notify import NotifyError, NotifyService
from .store import OmStore
from .threads import ThreadError, ThreadService

router = APIRouter(prefix="/api/om")

_store: OmStore | None = None
_browser_svc: BrowserService | None = None


def _store_get() -> OmStore:
    global _store
    if _store is None:
        _store = OmStore()
    return _store


def _browser() -> BrowserService:
    """Process-wide browser service: one Chromium shared by all requests."""
    global _browser_svc
    if _browser_svc is None:
        _browser_svc = BrowserService(_store_get())
    return _browser_svc


def _activity() -> ActivityService:
    return ActivityService(_store_get())


def _finance() -> FinanceService:
    return FinanceService(_store_get())


def _docs() -> DocumentService:
    return DocumentService(_store_get())


def _threads() -> ThreadService:
    return ThreadService(_store_get())


def _notify() -> NotifyService:
    return NotifyService(_store_get())


async def _body(request: Request) -> dict:
    try:
        return await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")


def _err(e: Exception) -> HTTPException:
    status = getattr(e, "status", 500)
    return HTTPException(status_code=status, detail=str(e))


# ---------------------------------------------------------------- computer
@router.get("/computer")
def computer_snapshot():
    try:
        return get_computer(_store_get()).snapshot()
    except Exception as e:
        raise _err(e)


@router.post("/computer/start")
def computer_start():
    try:
        return get_computer(_store_get()).start()
    except Exception as e:
        raise _err(e)


@router.post("/computer/stop")
def computer_stop():
    try:
        return get_computer(_store_get()).stop()
    except Exception as e:
        raise _err(e)


@router.post("/computer/commands", status_code=201)
async def computer_execute(request: Request):
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")
    try:
        svc = get_computer(_store_get())
        return svc.execute(
            command=body.get("command", ""),
            cwd=body.get("cwd", "/workspace"),
            idempotency_key=body.get("idempotencyKey"),
        )
    except Exception as e:
        raise _err(e)


@router.get("/computer/files")
def computer_list_files(path: str = "/workspace"):
    try:
        return get_computer(_store_get()).list_files(path)
    except Exception as e:
        raise _err(e)


@router.post("/computer/files/read")
async def computer_read_file(request: Request):
    body = await request.json()
    try:
        return get_computer(_store_get()).read_file(body.get("path", ""))
    except Exception as e:
        raise _err(e)


@router.post("/computer/files/write")
async def computer_write_file(request: Request):
    body = await request.json()
    try:
        return get_computer(_store_get()).write_file(
            body.get("path", ""), body.get("text", ""))
    except Exception as e:
        raise _err(e)


@router.post("/computer/files/mkdir")
async def computer_mkdir(request: Request):
    body = await request.json()
    try:
        return get_computer(_store_get()).mkdir(body.get("path", ""))
    except Exception as e:
        raise _err(e)


@router.post("/computer/files/import-pdf")
async def computer_import_pdf(request: Request):
    body = await request.json()
    import base64
    try:
        raw = base64.b64decode(body.get("base64", ""))
        return get_computer(_store_get()).import_pdf(body.get("path", ""), raw)
    except Exception as e:
        raise _err(e)


@router.post("/computer/files/export-pdf")
async def computer_export_pdf(request: Request):
    body = await request.json()
    try:
        name, raw = get_computer(_store_get()).export_pdf(body.get("path", ""))
        return Response(content=raw, media_type="application/pdf",
                        headers={"Content-Disposition": f'attachment; filename="{name}"'})
    except Exception as e:
        raise _err(e)


# ---------------------------------------------------------------- browser
@router.get("/browsers")
def browsers_list():
    try:
        return _browser().list()
    except Exception as e:
        raise _err(e)


@router.post("/browsers", status_code=201)
async def browsers_create(request: Request):
    body = await request.json()
    try:
        return _browser().create(body.get("url", ""))
    except Exception as e:
        raise _err(e)


@router.get("/browsers/{sid}")
def browsers_get(sid: str):
    try:
        return _browser().get(sid)
    except Exception as e:
        raise _err(e)


@router.post("/browsers/{sid}/navigate")
async def browsers_navigate(sid: str, request: Request):
    body = await request.json()
    try:
        return _browser().navigate(sid, body.get("url", ""))
    except Exception as e:
        raise _err(e)


@router.post("/browsers/{sid}/read")
def browsers_read(sid: str):
    try:
        return _browser().read(sid)
    except Exception as e:
        raise _err(e)


@router.get("/browsers/{sid}/screenshot")
def browsers_screenshot(sid: str):
    try:
        name, png = _browser().screenshot(sid)
        return Response(content=png, media_type="image/png",
                        headers={"Content-Disposition": f'inline; filename="{name}"'})
    except Exception as e:
        raise _err(e)


@router.get("/browsers/{sid}/console")
def browsers_console(sid: str):
    try:
        return _browser().console(sid)
    except Exception as e:
        raise _err(e)


@router.get("/browsers/{sid}/pdf")
def browsers_pdf(sid: str):
    try:
        name, raw = _browser().page_pdf(sid)
        return Response(content=raw, media_type="application/pdf",
                        headers={"Content-Disposition": f'attachment; filename="{name}"'})
    except Exception as e:
        raise _err(e)


@router.post("/browsers/{sid}/close")
def browsers_close(sid: str):
    try:
        return _browser().close(sid)
    except Exception as e:
        raise _err(e)


@router.delete("/browsers/{sid}")
def browsers_delete(sid: str):
    try:
        return {"ok": _browser().delete(sid)}
    except Exception as e:
        raise _err(e)


# ---------------------------------------------------------------- activity
@router.get("/activity/runs")
def activity_runs(status: str = ""):
    try:
        return _activity().list_runs(status)
    except Exception as e:
        raise _err(e)


@router.post("/activity/runs", status_code=201)
async def activity_create_run(request: Request):
    body = await _body(request)
    try:
        return _activity().create_run(body.get("title", ""),
                                      body.get("steps", []),
                                      body.get("retry_policy"))
    except Exception as e:
        raise _err(e)


@router.post("/activity/runs/retry-sweep")
def activity_retry_sweep():
    try:
        return {"retried": _activity().sweep_retries()}
    except Exception as e:
        raise _err(e)


@router.get("/activity/runs/{rid}")
def activity_get_run(rid: str):
    try:
        return _activity().get_run(rid)
    except Exception as e:
        raise _err(e)


@router.post("/activity/runs/{rid}/transition")
async def activity_transition(rid: str, request: Request):
    body = await _body(request)
    try:
        return _activity().transition(rid, body.get("to", ""))
    except Exception as e:
        raise _err(e)


@router.post("/activity/runs/{rid}/steps")
async def activity_step(rid: str, request: Request):
    body = await _body(request)
    try:
        return _activity().step(rid, int(body.get("index", -1)),
                                body.get("status", ""),
                                body.get("note", ""))
    except Exception as e:
        raise _err(e)


@router.post("/activity/runs/{rid}/notes")
async def activity_note(rid: str, request: Request):
    body = await _body(request)
    try:
        return _activity().note(rid, body.get("message", ""))
    except Exception as e:
        raise _err(e)


@router.get("/activity/runs/{rid}/events")
def activity_events(rid: str):
    try:
        return _activity().events(rid)
    except Exception as e:
        raise _err(e)


@router.delete("/activity/runs/{rid}")
def activity_delete_run(rid: str):
    try:
        _activity().delete_run(rid)
        return {"ok": True}
    except Exception as e:
        raise _err(e)


# ---------------------------------------------------------------- ideas
@router.get("/ideas")
def ideas_list(status: str = ""):
    try:
        return _activity().list_ideas(status)
    except Exception as e:
        raise _err(e)


@router.post("/ideas", status_code=201)
async def ideas_create(request: Request):
    body = await _body(request)
    try:
        return _activity().create_idea(
            body.get("title", ""), body.get("prompt", ""),
            body.get("kind", "general"), body.get("evidence", []))
    except Exception as e:
        raise _err(e)


@router.get("/ideas/{iid}")
def ideas_get(iid: str):
    try:
        return _activity().get_idea(iid)
    except Exception as e:
        raise _err(e)


@router.patch("/ideas/{iid}")
async def ideas_update(iid: str, request: Request):
    body = await _body(request)
    try:
        allowed = {k: body[k] for k in
                   ("title", "prompt", "kind", "input", "evidence", "status")
                   if k in body}
        return _activity().update_idea(iid, **allowed)
    except Exception as e:
        raise _err(e)


@router.post("/ideas/{iid}/accept")
def ideas_accept(iid: str):
    try:
        return _activity().accept_idea(iid)
    except Exception as e:
        raise _err(e)


@router.delete("/ideas/{iid}")
def ideas_delete(iid: str):
    try:
        _activity().delete_idea(iid)
        return {"ok": True}
    except Exception as e:
        raise _err(e)


# ---------------------------------------------------------------- mail rules
def _mailrules() -> MailRulesService:
    return MailRulesService(_store_get())


@router.get("/activity/mail-rules/gmail-status")
def mailrules_gmail_status():
    try:
        return _mailrules().gmail_status()
    except Exception as e:
        raise _err(e)


@router.get("/activity/mail-rules")
def mailrules_list():
    try:
        return _mailrules().list_rules()
    except Exception as e:
        raise _err(e)


@router.post("/activity/mail-rules", status_code=201)
async def mailrules_create(request: Request):
    body = await _body(request)
    try:
        return _mailrules().add_rule(body.get("name", ""), body.get("query", ""),
                                     body.get("keywords", []),
                                     body.get("kind", "general"))
    except Exception as e:
        raise _err(e)


@router.post("/activity/mail-rules/seed", status_code=201)
def mailrules_seed():
    try:
        return _mailrules().seed_defaults()
    except Exception as e:
        raise _err(e)


@router.post("/activity/mail-rules/scan")
def mailrules_scan():
    try:
        return _mailrules().scan()
    except Exception as e:
        raise _err(e)


@router.delete("/activity/mail-rules/{rid}")
def mailrules_delete(rid: str):
    try:
        _mailrules().delete_rule(rid)
        return {"ok": True}
    except Exception as e:
        raise _err(e)


# ---------------------------------------------------------------- goals
@router.get("/goals")
def goals_list(status: str = ""):
    try:
        return _activity().list_goals(status)
    except Exception as e:
        raise _err(e)


@router.post("/goals", status_code=201)
async def goals_create(request: Request):
    body = await _body(request)
    try:
        return _activity().create_goal(body.get("title", ""))
    except Exception as e:
        raise _err(e)


@router.get("/goals/{gid}")
def goals_get(gid: str):
    try:
        return _activity().get_goal(gid)
    except Exception as e:
        raise _err(e)


@router.patch("/goals/{gid}")
async def goals_update(gid: str, request: Request):
    body = await _body(request)
    try:
        allowed = {k: body[k] for k in ("title", "status") if k in body}
        return _activity().update_goal(gid, **allowed)
    except Exception as e:
        raise _err(e)


@router.post("/goals/{gid}/milestones", status_code=201)
async def goals_add_milestone(gid: str, request: Request):
    body = await _body(request)
    try:
        return _activity().add_milestone(gid, body.get("title", ""))
    except Exception as e:
        raise _err(e)


@router.patch("/milestones/{mid}")
async def milestones_set(mid: str, request: Request):
    body = await _body(request)
    try:
        return _activity().set_milestone(mid, bool(body.get("done", False)))
    except Exception as e:
        raise _err(e)


@router.delete("/milestones/{mid}")
def milestones_delete(mid: str):
    try:
        _activity().delete_milestone(mid)
        return {"ok": True}
    except Exception as e:
        raise _err(e)


# ---------------------------------------------------------------- finance
@router.post("/finance/upload", status_code=201)
async def finance_upload(request: Request):
    try:
        form = await request.form()
        up = form.get("file")
        if up is None:
            raise HTTPException(status_code=400, detail="No file uploaded")
        raw = await up.read()
        return _finance().upload(up.filename or "statement.csv", raw)
    except HTTPException:
        raise
    except Exception as e:
        raise _err(e)


@router.get("/finance/reports")
def finance_reports():
    try:
        return _finance().list_reports()
    except Exception as e:
        raise _err(e)


@router.get("/finance/reports/{rid}")
def finance_report(rid: str):
    try:
        return _finance().get_report(rid)
    except Exception as e:
        raise _err(e)


@router.delete("/finance/reports/{rid}")
def finance_delete(rid: str):
    try:
        _finance().delete_report(rid)
        return {"ok": True}
    except Exception as e:
        raise _err(e)


# ---------------------------------------------------------------- documents
@router.post("/documents/upload", status_code=201)
async def documents_upload(request: Request):
    try:
        form = await request.form()
        up = form.get("file")
        if up is None:
            raise HTTPException(status_code=400, detail="No file uploaded")
        raw = await up.read()
        return _docs().upload(up.filename or "doc.pdf", raw)
    except HTTPException:
        raise
    except Exception as e:
        raise _err(e)


@router.get("/documents")
def documents_list():
    try:
        return _docs().list()
    except Exception as e:
        raise _err(e)


@router.get("/documents/{did}/info")
def documents_info(did: str):
    try:
        return _docs().info(did)
    except Exception as e:
        raise _err(e)


@router.get("/documents/{did}/text")
def documents_text(did: str, page: int = 0):
    try:
        return _docs().page_text(did, page)
    except Exception as e:
        raise _err(e)


@router.post("/documents/{did}/fill", status_code=201)
async def documents_fill(did: str, request: Request):
    body = await _body(request)
    try:
        return _docs().fill(did, body.get("values", {}))
    except Exception as e:
        raise _err(e)


@router.get("/documents/{did}/file")
def documents_file(did: str):
    try:
        name, raw = _docs().file_bytes(did)
        return Response(content=raw, media_type="application/pdf",
                        headers={"Content-Disposition":
                                 f'attachment; filename="{name}"'})
    except Exception as e:
        raise _err(e)


@router.delete("/documents/{did}")
def documents_delete(did: str):
    try:
        _docs().delete(did)
        return {"ok": True}
    except Exception as e:
        raise _err(e)


# ---------------------------------------------------------------- threads
@router.get("/threads")
def threads_list(archived: str = ""):
    try:
        a = None if archived == "" else archived == "1"
        return _threads().list(a)
    except Exception as e:
        raise _err(e)


@router.post("/threads", status_code=201)
async def threads_create(request: Request):
    body = await _body(request)
    try:
        return _threads().create(body.get("title", ""),
                                 body.get("kind", "main"))
    except Exception as e:
        raise _err(e)


@router.get("/threads/{tid}")
def threads_get(tid: str):
    try:
        return _threads().get(tid)
    except Exception as e:
        raise _err(e)


@router.patch("/threads/{tid}")
async def threads_rename(tid: str, request: Request):
    body = await _body(request)
    try:
        return _threads().rename(tid, body.get("title", ""))
    except Exception as e:
        raise _err(e)


@router.post("/threads/{tid}/archive")
def threads_archive(tid: str):
    try:
        return _threads().archive(tid)
    except Exception as e:
        raise _err(e)


@router.post("/threads/{tid}/restore")
def threads_restore(tid: str):
    try:
        return _threads().restore(tid)
    except Exception as e:
        raise _err(e)


@router.post("/threads/{tid}/replay", status_code=201)
def threads_replay(tid: str):
    try:
        return _threads().replay(tid)
    except Exception as e:
        raise _err(e)


@router.delete("/threads/{tid}")
def threads_delete(tid: str):
    try:
        _threads().delete(tid)
        return {"ok": True}
    except Exception as e:
        raise _err(e)


@router.post("/threads/{tid}/messages", status_code=201)
async def threads_add_message(tid: str, request: Request):
    body = await _body(request)
    try:
        return _threads().add_message(tid, body.get("role", "user"),
                                      body.get("content", ""))
    except Exception as e:
        raise _err(e)


# ---------------------------------------------------------------- notifications
@router.get("/notifications")
def notifications_list(unread: str = ""):
    try:
        return _notify().list(unread_only=unread == "1")
    except Exception as e:
        raise _err(e)


@router.get("/notifications/unread-count")
def notifications_unread():
    try:
        return {"unread": _notify().unread_count()}
    except Exception as e:
        raise _err(e)


@router.get("/notifications/telegram-status")
def notifications_telegram_status():
    try:
        return _notify().telegram_status()
    except Exception as e:
        raise _err(e)


@router.post("/notifications", status_code=201)
async def notifications_create(request: Request):
    body = await _body(request)
    try:
        return _notify().notify(body.get("title", ""), body.get("body", ""),
                                body.get("source", ""), body.get("link", ""),
                                telegram=bool(body.get("telegram")))
    except Exception as e:
        raise _err(e)


@router.post("/notifications/{nid}/read")
def notifications_read(nid: str):
    try:
        return _notify().mark_read(nid)
    except Exception as e:
        raise _err(e)


@router.post("/notifications/read-all")
def notifications_read_all():
    try:
        return {"marked": _notify().mark_all_read()}
    except Exception as e:
        raise _err(e)


@router.delete("/notifications/{nid}")
def notifications_delete(nid: str):
    try:
        _notify().delete(nid)
        return {"ok": True}
    except Exception as e:
        raise _err(e)


@router.post("/notifications/clear-read")
def notifications_clear_read():
    try:
        return {"cleared": _notify().clear_read()}
    except Exception as e:
        raise _err(e)
