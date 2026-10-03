"""MCP bridge — every connected connector is an MCP tool.

Speaks JSON-RPC 2.0 with the MCP method names any MCP client expects:
`initialize`, `tools/list`, `tools/call`. Tool names are namespaced as
`connector_id.action` (e.g. `google_calendar.create_event`).

Read tools execute immediately. Write tools never execute directly over
MCP — they create an approval in the dashboard rail and return
`pending_approval`, so a human still says yes before anything happens.
"""
from __future__ import annotations

from typing import Any

from .base import AdapterError


def _ctx_tools(ctx) -> list[dict]:
    tools = []
    for cid in ctx.connected_ids():
        adapter = ctx.adapter(cid)
        if adapter is None:
            continue
        for a in adapter.manifest.actions:
            tools.append({
                "name": a.tool_name(cid),
                "description": f"[{adapter.manifest.name}] {a.label}: {a.description}",
                "inputSchema": a.input_schema(),
                "_needs_approval": a.needs_approval,
            })
    return tools


def handle_rpc(payload: dict, ctx) -> dict:
    """ctx provides: connected_ids(), adapter(cid), creds(cid),
    create_action(cid, action, label, summary, params) -> record."""
    rpc_id = payload.get("id")
    method = payload.get("method", "")

    def ok(result: Any) -> dict:
        return {"jsonrpc": "2.0", "id": rpc_id, "result": result}

    def err(code: int, message: str) -> dict:
        return {"jsonrpc": "2.0", "id": rpc_id,
                "error": {"code": code, "message": message}}

    if method == "initialize":
        return ok({"protocolVersion": "2024-11-05",
                   "capabilities": {"tools": {}},
                   "serverInfo": {"name": "os-connectors", "version": "1.0.0"}})
    if method == "notifications/initialized":
        return ok({})

    if method == "tools/list":
        tools = _ctx_tools(ctx)
        for t in tools:
            t.pop("_needs_approval", None)
        return ok({"tools": tools})

    if method == "tools/call":
        params = payload.get("params") or {}
        name = params.get("name", "")
        args = params.get("arguments") or {}
        if "." not in name:
            return err(-32602, f"Bad tool name {name!r}")
        cid, action_name = name.split(".", 1)
        adapter = ctx.adapter(cid)
        if adapter is None or cid not in ctx.connected_ids():
            return err(-32602, f"Connector {cid!r} is not connected")
        spec = adapter.manifest.get_action(action_name)
        if spec is None:
            return err(-32602, f"Unknown action {action_name!r}")
        missing = [p.name for p in spec.params if p.required and not args.get(p.name)]
        if missing:
            return err(-32602, f"Missing required params: {', '.join(missing)}")
        if spec.needs_approval:
            rec = ctx.create_action(
                cid, action_name, spec.label,
                f"[MCP] {adapter.manifest.name}: {spec.label}", args)
            return ok({"content": [{
                "type": "text",
                "text": f"Action needs approval in the OS dashboard (approval {rec['id']})."}],
                "isError": False,
                "_approval_id": rec["id"],
                "status": "pending_approval"})
        try:
            result = adapter.run_action(action_name, args, ctx.creds(cid))
        except AdapterError as e:
            return ok({"content": [{"type": "text", "text": f"Error: {e}"}],
                       "isError": True})
        return ok({"content": [{"type": "text", "text": _fmt(result)}],
                   "isError": False})

    return err(-32601, f"Method not found: {method}")


def _fmt(result: dict) -> str:
    import json

    return json.dumps(result, indent=2, default=str)[:4000]
