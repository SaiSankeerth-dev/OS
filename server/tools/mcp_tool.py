"""MCP tools: interact with any connected MCP server.

`mcp_list()` shows connected servers and their tools.
`mcp_call(server, tool, args_json)` calls a tool.
`mcp_add(name, command, args)` adds a new server.

Reads are DIRECT; writes depend on the tool (conservative: NEEDS_APPROVAL
for mcp_call since MCP tools can have side effects).
"""
from __future__ import annotations

import asyncio
import json

from server.intent.registry import ExecutionMode, ToolResult, ToolSpec
from server.mcp_client.client import get_mcp_manager, MCPServerConfig, save_config


def mcp_list(**kwargs) -> ToolResult:
    """List connected MCP servers and their tools."""
    mgr = get_mcp_manager()
    servers = mgr.servers
    if not servers:
        return ToolResult(
            status="success", mode=ExecutionMode.DIRECT,
            data={"display":
                  "No MCP servers configured. Say 'mcp add <name> <command>' "
                  "to connect one, e.g. 'mcp add filesystem npx -y "
                  "@modelcontextprotocol/server-filesystem /tmp'."},
        )
    try:
        all_tools = asyncio.run(mgr.list_all_tools())
    except Exception as e:
        return ToolResult(status="failure", mode=ExecutionMode.DIRECT,
                          error=f"Couldn't list MCP tools: {e}")
    lines = []
    for name, tools in all_tools.items():
        lines.append(f"\n**{name}** ({len(tools)} tools):")
        for t in tools[:10]:  # first 10 to avoid spam
            desc = (t.description or "")[:60]
            lines.append(f"  - {t.name}: {desc}")
        if len(tools) > 10:
            lines.append(f"  ... and {len(tools) - 10} more")
    return ToolResult(
        status="success", mode=ExecutionMode.DIRECT,
        data={"display": "Connected MCP servers:" + "\n".join(lines)},
    )


def format_mcp_list(result: ToolResult) -> str:
    if result.status == "failure":
        return result.error or "Couldn't list MCP servers."
    return result.data["display"]


MCP_LIST_SPEC = ToolSpec(
    name="mcp_list",
    description="List connected MCP servers and their tools. Usage: mcp list",
    execution_mode=ExecutionMode.DIRECT,
)


def mcp_call(server: str = "", tool: str = "", args_json: str = "",
             task: str = "", **kwargs) -> ToolResult:
    """Draft an MCP tool call. Executes only after approval."""
    # Parse from full text if not given directly:
    # "mcp call filesystem read_file '{"path": "/tmp/x"}'"
    if task and (not server or not tool):
        import re
        m = re.match(
            r"^\s*mcp\s+call\s+(\S+)\s+(\S+)(?:\s+(.+))?\s*$",
            task, re.IGNORECASE,
        )
        if m:
            server, tool = m.group(1).strip(), m.group(2).strip()
            if m.group(3):
                args_json = m.group(3).strip().strip("'\"")
    server = (server or "").strip()
    tool = (tool or "").strip()
    if not server or not tool:
        return ToolResult(
            status="failure", mode=ExecutionMode.DIRECT,
            error="Need server and tool. Try 'mcp call filesystem read_file "
                  "'{\"path\": \"/tmp/test.txt\"}'. Say 'mcp list' to see tools.",
        )
    try:
        args = json.loads(args_json) if args_json else {}
    except json.JSONDecodeError:
        return ToolResult(status="failure", mode=ExecutionMode.DIRECT,
                          error="args_json must be valid JSON.")
    return ToolResult(
        status="success", mode=ExecutionMode.DIRECT,
        data={
            "server": server, "tool": tool, "args": args,
            "draft": f"MCP call: {server}.{tool}\nArgs: {json.dumps(args)[:300]}",
            "action_args": {
                "kind": "mcp",
                "mcp_action": {"server": server, "tool": tool, "args": args},
            },
        },
    )


def format_mcp_call(result: ToolResult) -> str:
    if result.status == "failure":
        return result.error or "Couldn't draft MCP call."
    return result.data["draft"]


MCP_CALL_SPEC = ToolSpec(
    name="mcp_call",
    description="Call an MCP tool (needs approval). Usage: mcp call <server> <tool> '<json>'",
    execution_mode=ExecutionMode.DIRECT,
)


def execute_mcp_action(action: dict) -> str:
    """Execute an approved MCP tool call."""
    from server.mcp_client.client import call_tool_sync
    try:
        result = call_tool_sync(
            action["server"], action["tool"], action.get("args", {}),
        )
        return f"MCP {action['server']}.{action['tool']}:\n{result[:2000]}"
    except Exception as e:
        return f"MCP call failed: {type(e).__name__}: {e}"


def mcp_add(name: str = "", command: str = "", args: str = "",
            task: str = "", **kwargs) -> ToolResult:
    """Add an MCP server (draft; needs approval since it runs a command)."""
    # Parse from full text: "mcp add filesystem npx -y @server/filesystem /tmp"
    if task and (not name or not command):
        import re
        m = re.match(
            r"^\s*mcp\s+add\s+(\S+)\s+(\S+)(?:\s+(.+))?\s*$",
            task, re.IGNORECASE,
        )
        if m:
            name, command = m.group(1).strip(), m.group(2).strip()
            if m.group(3):
                args = m.group(3).strip()
    name = (name or "").strip()
    command = (command or "").strip()
    if not name or not command:
        return ToolResult(
            status="failure", mode=ExecutionMode.DIRECT,
            error="Need a name and command. Try 'mcp add filesystem npx -y "
                  "@modelcontextprotocol/server-filesystem /tmp'.",
        )
    arg_list = args.split() if args else []
    return ToolResult(
        status="success", mode=ExecutionMode.DIRECT,
        data={
            "name": name, "command": command, "args": arg_list,
            "draft": f"Add MCP server '{name}':\nCommand: {command} {' '.join(arg_list)}\n"
                     "This will run the command when you use its tools.",
            "action_args": {
                "kind": "mcp_add",
                "mcp_action": {"name": name, "command": command,
                               "args": arg_list},
            },
        },
    )


def format_mcp_add(result: ToolResult) -> str:
    if result.status == "failure":
        return result.error or "Couldn't draft MCP server."
    return result.data["display"] if "display" in result.data else result.data["draft"]


MCP_ADD_SPEC = ToolSpec(
    name="mcp_add",
    description="Add an MCP server (needs approval). Usage: mcp add <name> <command> [args]",
    execution_mode=ExecutionMode.DIRECT,
)


def execute_mcp_add(action: dict) -> str:
    """Execute an approved MCP server addition."""
    from server.mcp_client.client import load_config, save_config, get_mcp_manager
    servers = load_config()
    servers[action["name"]] = MCPServerConfig(
        name=action["name"],
        command=action["command"],
        args=action.get("args", []),
        enabled=True,
    )
    save_config(servers)
    get_mcp_manager().reload()
    return f"MCP server '{action['name']}' added. Say 'mcp list' to see its tools."


MCP_TOOLS = [
    (MCP_LIST_SPEC, mcp_list, format_mcp_list),
    (MCP_CALL_SPEC, mcp_call, format_mcp_call),
    (MCP_ADD_SPEC, mcp_add, format_mcp_add),
]
