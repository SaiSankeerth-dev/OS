"""MCPBus: config-driven lifecycle for MCP servers.

Owns the clients for every configured server: connect, bridge the
allowlisted tools into a ToolRegistry, and shut down cleanly.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field

from server.intent.registry import ToolRegistry
from server.supervisor.permissions import ToolPermission
from server.supervisor.scope import ScopeGuard

from .bridge import policy_for_mode, register_mcp_tools
from .client import MCPError, MCPToolInfo, SyncMCPClient

log = logging.getLogger("os.mcp")


@dataclass
class MCPServerConfig:
    name: str
    command: list[str]
    allowed_tools: list[str] = field(default_factory=list)
    mode: str = "approval"  # "allow" | "approval"


class MCPBus:
    def __init__(self, servers: list[MCPServerConfig]) -> None:
        self._servers = servers
        self._clients: dict[str, SyncMCPClient] = {}
        self._tools: dict[str, list[MCPToolInfo]] = {}

    @property
    def connected_servers(self) -> list[str]:
        return sorted(self._clients)

    def connect(self) -> None:
        """Start every configured server. Failures are per-server:
        a crashed server is skipped, never fatal to the bus."""
        for scfg in self._servers:
            client = SyncMCPClient(scfg.name, scfg.command)
            try:
                client.connect()
                tools = client.list_tools()
            except MCPError as e:
                log.warning("mcp server '%s' unavailable: %s", scfg.name, e)
                client.close()
                continue
            self._clients[scfg.name] = client
            self._tools[scfg.name] = tools
            log.info(
                "mcp server '%s' ready (%d tools offered)",
                scfg.name,
                len(tools),
            )

    def register_into(
        self,
        registry: ToolRegistry,
        permissions: ToolPermission | None = None,
        scope_guard: ScopeGuard | None = None,
    ) -> list[str]:
        """Bridge allowlisted tools of connected servers into the registry.

        Policies come from each server's configured mode; each server also
        becomes its own scope-guard skill (``mcp_<server>``), so disabling
        the skill disables all of that server's tools. Without a
        permissions object the tools register but stay DENIED.
        """
        registered: list[str] = []
        for scfg in self._servers:
            client = self._clients.get(scfg.name)
            if client is None:
                continue
            names = register_mcp_tools(
                registry,
                client,
                self._tools.get(scfg.name, []),
                set(scfg.allowed_tools),
                permissions,
                policy_for_mode(scfg.mode, scfg.name),
            )
            if scope_guard is not None:
                skill = f"mcp_{scfg.name}"
                for bridged in names:
                    tool = bridged.split("__", 2)[2]
                    scope_guard.register_tool(
                        bridged, skill, (f"mcp:{scfg.name}:{tool}",)
                    )
            registered.extend(names)
        return registered

    def close(self) -> None:
        for name, client in self._clients.items():
            try:
                client.close()
            except Exception as e:  # noqa: BLE001
                log.debug("mcp server '%s' close failed: %s", name, e)
        self._clients.clear()
        self._tools.clear()
