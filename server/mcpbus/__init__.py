"""Phase 8: MCP tool bus.

The future tool bus for OS: external tools arrive over the Model Context
Protocol (stdio subprocesses only - local-first, no network transports in
this phase) and are bridged into the supervisor's ToolRegistry, where the
same scope guard, tool permissions, and approval gates apply.

Security notes:
- Tool *descriptions* from an MCP server are untrusted data. They are
  registered as description strings only and never executed.
- Only tools on the server's explicit `allowed_tools` list are bridged.
  Everything else the server offers is ignored (fail closed).
- Argument payloads are capped; calls have timeouts; a crashed server
  means its tools are simply not registered - never fabricated.
"""
from .bus import MCPBus
from .client import MCPError, MCPToolClient, MCPToolInfo, SyncMCPClient

__all__ = ["MCPBus", "MCPError", "MCPToolClient", "MCPToolInfo", "SyncMCPClient"]
