"""MCP client for OS: connect to any MCP server, use its tools.

MCP (Model Context Protocol) is the open standard for AI-tool connections.
Hundreds of servers exist: filesystem, github, postgres, slack, gmail, etc.

Config: data/mcp_config.json
{
  "servers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"],
      "enabled": true
    }
  }
}

Each server's tools become callable via mcp_call(server, tool, args).
"""
from __future__ import annotations

import asyncio
import json
import logging
import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

log = logging.getLogger(__name__)

CONFIG_PATH = Path("data/mcp_config.json")


@dataclass
class MCPTool:
    server: str
    name: str
    description: str = ""
    input_schema: dict = field(default_factory=dict)


@dataclass
class MCPServerConfig:
    name: str
    command: str
    args: list[str] = field(default_factory=list)
    env: dict[str, str] = field(default_factory=dict)
    enabled: bool = True


def load_config(path: Path | str = CONFIG_PATH) -> dict[str, MCPServerConfig]:
    """Load MCP server configs from JSON."""
    path = Path(path)
    if not path.exists():
        return {}
    try:
        data = json.loads(path.read_text())
    except Exception as e:
        log.warning("MCP config invalid: %s", e)
        return {}
    servers = {}
    for name, cfg in (data.get("servers") or {}).items():
        if not cfg.get("enabled", True):
            continue
        servers[name] = MCPServerConfig(
            name=name,
            command=cfg.get("command", ""),
            args=cfg.get("args", []),
            env=cfg.get("env", {}),
            enabled=True,
        )
    return servers


def save_config(servers: dict[str, MCPServerConfig],
                path: Path | str = CONFIG_PATH) -> None:
    """Save MCP server configs to JSON."""
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    data = {
        "servers": {
            name: {
                "command": s.command,
                "args": s.args,
                "env": s.env,
                "enabled": s.enabled,
            }
            for name, s in servers.items()
        }
    }
    path.write_text(json.dumps(data, indent=2))


class MCPManager:
    """Manages connections to MCP servers and their tools.

    Tools are discovered on connect and cached. Calls are made
    on-demand (servers are spawned per-call for stdio, which is
    simple and robust; persistent connections are a future optimization).
    """

    def __init__(self, config_path: Path | str = CONFIG_PATH):
        self.config_path = Path(config_path)
        self._tools_cache: dict[str, list[MCPTool]] = {}
        self._servers: dict[str, MCPServerConfig] = {}

    def reload(self) -> None:
        """Reload config from disk."""
        self._servers = load_config(self.config_path)
        self._tools_cache.clear()

    @property
    def servers(self) -> dict[str, MCPServerConfig]:
        if not self._servers:
            self.reload()
        return self._servers

    async def list_tools(self, server: str) -> list[MCPTool]:
        """List tools from an MCP server (cached)."""
        if server in self._tools_cache:
            return self._tools_cache[server]
        cfg = self.servers.get(server)
        if not cfg:
            return []
        tools = await self._fetch_tools(cfg)
        self._tools_cache[server] = tools
        return tools

    async def list_all_tools(self) -> dict[str, list[MCPTool]]:
        """List tools from all configured servers."""
        result = {}
        for name in self.servers:
            try:
                result[name] = await self.list_tools(name)
            except Exception as e:
                log.warning("MCP server %s failed: %s", name, e)
                result[name] = []
        return result

    async def _fetch_tools(self, cfg: MCPServerConfig) -> list[MCPTool]:
        """Connect to a server and list its tools."""
        # Clear proxy vars (MCP servers spawn subprocesses; the runtime
        # proxy breaks npx downloads)
        env = dict(os.environ)
        for var in ("HTTP_PROXY", "HTTPS_PROXY", "http_proxy", "https_proxy",
                    "ALL_PROXY", "all_proxy", "NO_PROXY", "no_proxy"):
            env.pop(var, None)
        env.update(cfg.env)

        from mcp import ClientSession, StdioServerParameters
        from mcp.client.stdio import stdio_client

        params = StdioServerParameters(
            command=cfg.command, args=cfg.args, env=env,
        )
        async with stdio_client(params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                tools_result = await session.list_tools()
                return [
                    MCPTool(
                        server=cfg.name,
                        name=t.name,
                        description=t.description or "",
                        input_schema=t.inputSchema or {},
                    )
                    for t in tools_result.tools
                ]

    async def call_tool(self, server: str, tool: str,
                        args: dict[str, Any] | None = None) -> str:
        """Call an MCP tool. Returns the text result."""
        cfg = self.servers.get(server)
        if not cfg:
            raise ValueError(f"Unknown MCP server: {server}")

        env = dict(os.environ)
        for var in ("HTTP_PROXY", "HTTPS_PROXY", "http_proxy", "https_proxy",
                    "ALL_PROXY", "all_proxy", "NO_PROXY", "no_proxy"):
            env.pop(var, None)
        env.update(cfg.env)

        from mcp import ClientSession, StdioServerParameters
        from mcp.client.stdio import stdio_client

        params = StdioServerParameters(
            command=cfg.command, args=cfg.args, env=env,
        )
        async with stdio_client(params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                result = await session.call_tool(tool, args or {})
                # Extract text from content blocks
                parts = []
                for block in result.content:
                    if hasattr(block, "text"):
                        parts.append(block.text)
                    else:
                        parts.append(str(block))
                return "\n".join(parts)


# Singleton
_manager: MCPManager | None = None


def get_mcp_manager() -> MCPManager:
    global _manager
    if _manager is None:
        _manager = MCPManager()
    return _manager


def call_tool_sync(server: str, tool: str,
                   args: dict[str, Any] | None = None,
                   timeout: int = 60) -> str:
    """Sync wrapper for MCP tool calls (for use in non-async contexts)."""
    return asyncio.run(get_mcp_manager().call_tool(server, tool, args))
