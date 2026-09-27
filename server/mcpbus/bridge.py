"""Bridge MCP tools into the supervisor's ToolRegistry.

Each allowlisted MCP tool becomes a ToolSpec named
`mcp__<server>__<tool>`. The handler calls the live MCP server; the
supervisor's scope guard, tool permissions, and approval gates apply
exactly as they do for built-in tools.

Tool *descriptions* from the server are untrusted data - they are stored
as plain strings, never interpreted or executed.
"""
from __future__ import annotations

import logging

from server.intent.registry import (
    ExecutionMode,
    Formatter,
    Handler,
    ToolRegistry,
    ToolResult,
    ToolSpec,
)
from server.supervisor.permissions import ToolPermission, ToolPolicy

from .client import MCPToolClient, MCPToolInfo, SyncMCPClient

log = logging.getLogger("os.mcp")


def bridge_name(server_name: str, tool_name: str) -> str:
    return f"mcp__{server_name}__{tool_name}"


def policy_for_mode(mode: str, server_name: str) -> ToolPolicy:
    if mode == "allow":
        return ToolPolicy.ALLOW
    if mode != "approval":
        log.warning(
            "mcp server '%s': bad mode '%s', using needs_approval",
            server_name,
            mode,
        )
    return ToolPolicy.NEEDS_APPROVAL


def _make_handler(client: SyncMCPClient, tool_name: str) -> Handler:
    """Sync handler: the client owns its own thread+loop, so this works
    from inside the supervisor's running event loop."""

    def mcp_handler(**kwargs) -> ToolResult:
        from .client import MCPError

        try:
            text = client.call_tool(tool_name, dict(kwargs))
        except MCPError as e:
            return ToolResult(
                status="failure", mode=ExecutionMode.DIRECT, error=str(e)
            )
        return ToolResult(
            status="success", mode=ExecutionMode.DIRECT, data={"text": text}
        )

    return mcp_handler


def _make_formatter() -> Formatter:
    def fmt(result: ToolResult) -> str:
        return str(result.data.get("text", ""))

    return fmt


def bridge_tools(
    client: SyncMCPClient,
    tools: list[MCPToolInfo],
    allowed: set[str],
) -> list[tuple[ToolSpec, Handler, Formatter]]:
    """Build registry entries for allowlisted tools only."""
    bridged: list[tuple[ToolSpec, Handler, Formatter]] = []
    for info in tools:
        if info.name not in allowed:
            log.debug(
                "mcp server '%s': tool '%s' not allowlisted - skipped",
                client.server_name,
                info.name,
            )
            continue
        name = bridge_name(client.server_name, info.name)
        spec = ToolSpec(
            name=name,
            description=f"[MCP:{client.server_name}] {info.description}",
            execution_mode=ExecutionMode.DIRECT,
        )
        bridged.append((spec, _make_handler(client, info.name), _make_formatter()))
        log.info("mcp tool bridged: %s", name)
    return bridged


def register_mcp_tools(
    registry: ToolRegistry,
    client: SyncMCPClient,
    tools: list[MCPToolInfo],
    allowed: set[str],
    permissions: ToolPermission | None = None,
    policy: ToolPolicy = ToolPolicy.NEEDS_APPROVAL,
) -> list[str]:
    """Bridge, register, and (optionally) set the supervisor policy.

    Without a permissions object the tools register but stay DENIED by
    default - fail closed.
    """
    names: list[str] = []
    for spec, handler, formatter in bridge_tools(client, tools, allowed):
        registry.register(spec, handler, formatter)
        if permissions is not None:
            permissions.set_policy(spec.name, policy)
        names.append(spec.name)
    return names
