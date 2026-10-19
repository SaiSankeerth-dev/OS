---
name: mcp
description: Model Context Protocol. Connect OS to any MCP server (filesystem, github, postgres, slack, etc.).
version: 1.0.0
status: active
---

# MCP Skill

## Purpose
MCP is the open standard for AI-tool connections. This skill lets OS
use any MCP server's tools — hundreds exist for files, databases,
GitHub, Slack, Gmail, and more.

## Available Tools
- `mcp_list()` - show connected servers and their tools (DIRECT)
- `mcp_call(server, tool, args_json)` - call a tool (NEEDS_APPROVAL)
- `mcp_add(name, command, args)` - add a server (NEEDS_APPROVAL)

## Examples
- `mcp list` → see what's connected
- `mcp call filesystem read_file '{"path": "/tmp/test.txt"}'` → read a file
- `mcp add github npx -y @modelcontextprotocol/server-github` → add GitHub server

## Popular MCP Servers
- `@modelcontextprotocol/server-filesystem` — file operations
- `@modelcontextprotocol/server-github` — GitHub (needs GITHUB_TOKEN)
- `@modelcontextprotocol/server-postgres` — PostgreSQL
- `@modelcontextprotocol/server-sqlite` — SQLite databases
- `@modelcontextprotocol/server-brave-search` — web search (needs API key)

## Safety
- `mcp_list` is DIRECT (read-only).
- `mcp_call` and `mcp_add` NEED_APPROVAL (they run commands / have side effects).
- Servers run as subprocesses with your user permissions.
- Config stored in data/mcp_config.json.

## Requirements
- `npx` (Node.js) for most servers, or `uvx` (Python)
- MCP Python SDK (already installed)
