"""MCP: connect OS to any MCP server."""
from .client import (
    MCPManager, MCPTool, MCPServerConfig,
    get_mcp_manager, call_tool_sync,
    load_config, save_config,
)

__all__ = [
    "MCPManager", "MCPTool", "MCPServerConfig",
    "get_mcp_manager", "call_tool_sync",
    "load_config", "save_config",
]
