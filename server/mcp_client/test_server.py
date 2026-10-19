"""Minimal test MCP server using MCPServer (mcp 2.x API)."""
from mcp.server.mcpserver import MCPServer

mcp = MCPServer("test-server")


@mcp.tool()
def echo(text: str) -> str:
    """Echo back the input text."""
    return f"Echo: {text}"


@mcp.tool()
def add(a: float, b: float) -> float:
    """Add two numbers."""
    return a + b


if __name__ == "__main__":
    mcp.run()
