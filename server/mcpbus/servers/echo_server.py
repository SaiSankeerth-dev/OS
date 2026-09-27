"""Example MCP server for OS Phase 8 (stdio).

Exposes two trivially safe tools used by tests and the demo:
- echo(text): returns the text unchanged
- add(a, b): returns a + b

Run: python echo_server.py   (speaks MCP over stdio)
"""
from mcp.server.mcpserver import MCPServer

m = MCPServer("echo")


@m.tool()
def echo(text: str) -> str:
    """Return the input text unchanged."""
    return text


@m.tool()
def add(a: float, b: float) -> float:
    """Add two numbers and return the sum."""
    return a + b


if __name__ == "__main__":
    m.run()
