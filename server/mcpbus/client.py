"""MCPToolClient: speaks to one MCP server over stdio.

Local subprocess only - the command must be a local executable, never a
URL. All failures raise MCPError so callers fail closed.
"""
from __future__ import annotations

import asyncio
import json
import logging
import threading
from concurrent.futures import TimeoutError as FuturesTimeoutError
from contextlib import AsyncExitStack
from dataclasses import dataclass, field

log = logging.getLogger("os.mcp")

MAX_ARG_BYTES = 64 * 1024


class MCPError(Exception):
    """Any MCP transport/tool failure. Never silently swallowed."""


@dataclass
class MCPToolInfo:
    name: str
    description: str = ""
    input_schema: dict = field(default_factory=dict)


class MCPToolClient:
    def __init__(
        self,
        server_name: str,
        command: list[str],
        cwd: str | None = None,
        connect_timeout: float = 15.0,
        call_timeout: float = 30.0,
    ) -> None:
        if not command or not isinstance(command, list):
            raise MCPError(f"server '{server_name}': command must be a non-empty list")
        if "://" in command[0]:
            raise MCPError(
                f"server '{server_name}': remote transports are not allowed "
                "(local stdio subprocesses only)"
            )
        self.server_name = server_name
        self._command = command
        self._cwd = cwd
        self._connect_timeout = connect_timeout
        self._call_timeout = call_timeout
        self._stack: AsyncExitStack | None = None
        self._session = None

    async def __aenter__(self) -> "MCPToolClient":
        from mcp import ClientSession, StdioServerParameters
        from mcp.client.stdio import stdio_client

        try:
            self._stack = AsyncExitStack()
            params = StdioServerParameters(
                command=self._command[0], args=self._command[1:], cwd=self._cwd
            )
            read, write = await asyncio.wait_for(
                self._stack.enter_async_context(stdio_client(params)),
                timeout=self._connect_timeout,
            )
            self._session = await self._stack.enter_async_context(
                ClientSession(read, write)
            )
            await asyncio.wait_for(
                self._session.initialize(), timeout=self._connect_timeout
            )
            log.info("mcp server '%s' connected", self.server_name)
            return self
        except Exception as e:  # noqa: BLE001
            await self.close()
            raise MCPError(
                f"server '{self.server_name}' failed to start: "
                f"{type(e).__name__}: {e}"
            ) from e

    async def __aexit__(self, *exc) -> None:
        await self.close()

    async def close(self) -> None:
        if self._stack is not None:
            try:
                await self._stack.aclose()
            except Exception:  # noqa: BLE001
                pass
            self._stack = None
            self._session = None

    def _require_session(self):
        if self._session is None:
            raise MCPError(f"server '{self.server_name}' is not connected")
        return self._session

    async def list_tools(self) -> list[MCPToolInfo]:
        session = self._require_session()
        try:
            result = await asyncio.wait_for(
                session.list_tools(), timeout=self._connect_timeout
            )
            return [
                MCPToolInfo(
                    name=t.name,
                    description=t.description or "",
                    input_schema=dict(t.input_schema or {}),
                )
                for t in result.tools
            ]
        except MCPError:
            raise
        except Exception as e:  # noqa: BLE001
            raise MCPError(
                f"server '{self.server_name}' list_tools failed: "
                f"{type(e).__name__}: {e}"
            ) from e

    async def call_tool(self, tool_name: str, args: dict | None = None) -> str:
        """Call a tool; return concatenated text content."""
        session = self._require_session()
        args = args or {}
        try:
            payload = json.dumps(args)
        except (TypeError, ValueError) as e:
            raise MCPError(f"arguments not JSON-serializable: {e}") from e
        if len(payload.encode("utf-8")) > MAX_ARG_BYTES:
            raise MCPError(
                f"argument payload exceeds {MAX_ARG_BYTES} bytes - refused"
            )
        try:
            result = await asyncio.wait_for(
                session.call_tool(tool_name, args), timeout=self._call_timeout
            )
        except asyncio.TimeoutError as e:
            raise MCPError(
                f"server '{self.server_name}' tool '{tool_name}' timed out"
            ) from e
        except Exception as e:  # noqa: BLE001
            raise MCPError(
                f"server '{self.server_name}' tool '{tool_name}' failed: "
                f"{type(e).__name__}: {e}"
            ) from e
        is_error = getattr(result, "is_error", None)
        if is_error is None:
            is_error = getattr(result, "isError", False)
        if is_error:
            raise MCPError(
                f"server '{self.server_name}' tool '{tool_name}' returned an error"
            )
        texts: list[str] = []
        for block in getattr(result, "content", []) or []:
            text = getattr(block, "text", None)
            if isinstance(text, str):
                texts.append(text)
        return "\n".join(texts)

class SyncMCPClient:
    """Sync facade over MCPToolClient.

    Owns a background thread running its own event loop, so tool calls
    work from anywhere - including inside the supervisor's running loop,
    where the sync ToolRegistry.execute cannot asyncio.run() a coroutine.

    All failures raise MCPError (fail closed).
    """

    def __init__(
        self,
        server_name: str,
        command: list[str],
        cwd: str | None = None,
        connect_timeout: float = 15.0,
        call_timeout: float = 30.0,
    ) -> None:
        self._client = MCPToolClient(
            server_name, command, cwd, connect_timeout, call_timeout
        )
        self._call_timeout = call_timeout
        self._loop: asyncio.AbstractEventLoop | None = None
        self._thread: threading.Thread | None = None

    @property
    def server_name(self) -> str:
        return self._client.server_name

    def _submit(self, coro, timeout: float):
        if self._loop is None:
            raise MCPError(f"server '{self.server_name}' is not connected")
        fut = asyncio.run_coroutine_threadsafe(coro, self._loop)
        try:
            return fut.result(timeout=timeout)
        except FuturesTimeoutError as e:
            fut.cancel()
            raise MCPError(
                f"server '{self.server_name}' timed out after {timeout}s"
            ) from e

    def connect(self) -> "SyncMCPClient":
        if self._thread is not None:
            return self
        loop = asyncio.new_event_loop()
        ready = threading.Event()

        def _run() -> None:
            asyncio.set_event_loop(loop)
            ready.set()
            loop.run_forever()

        thread = threading.Thread(
            target=_run, daemon=True, name=f"mcp-{self.server_name}"
        )
        thread.start()
        if not ready.wait(timeout=5):
            raise MCPError(f"server '{self.server_name}': loop thread failed")
        self._loop, self._thread = loop, thread
        try:
            self._submit(self._client.__aenter__(), timeout=30.0)
        except Exception:
            self.close()
            raise
        return self

    def close(self) -> None:
        if self._loop is not None:
            try:
                self._submit(self._client.close(), timeout=5.0)
            except Exception:  # noqa: BLE001
                pass
            self._loop.call_soon_threadsafe(self._loop.stop)
        if self._thread is not None:
            self._thread.join(timeout=5.0)
        self._loop, self._thread = None, None

    def __enter__(self) -> "SyncMCPClient":
        return self.connect()

    def __exit__(self, *exc) -> None:
        self.close()

    def list_tools(self) -> list[MCPToolInfo]:
        return self._submit(self._client.list_tools(), timeout=30.0)

    def call_tool(self, tool_name: str, args: dict | None = None) -> str:
        return self._submit(
            self._client.call_tool(tool_name, args),
            timeout=self._call_timeout + 5.0,
        )
