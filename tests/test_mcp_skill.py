"""MCP skill tests (new MCP client integration)."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from server.intent.router import IntentRouter, Intent
from server.mcp_client.client import (
    MCPManager, MCPServerConfig, load_config, save_config,
)
from server.tools.mcp_tool import (
    mcp_list, mcp_call, mcp_add,
    MCP_LIST_SPEC, MCP_CALL_SPEC, MCP_ADD_SPEC,
)
from server.intent.registry import ExecutionMode


def _route(text: str):
    return IntentRouter().classify(text)


# --- Config ------------------------------------------------------------------

def test_load_config_empty(tmp_path):
    cfg = load_config(tmp_path / "nonexistent.json")
    assert cfg == {}


def test_save_load_config(tmp_path):
    path = tmp_path / "mcp_config.json"
    servers = {
        "test": MCPServerConfig(name="test", command="echo", args=["hi"]),
    }
    save_config(servers, path)
    loaded = load_config(path)
    assert "test" in loaded
    assert loaded["test"].command == "echo"
    assert loaded["test"].args == ["hi"]


# --- Intent routing -----------------------------------------------------------

def test_route_mcp_list():
    d = _route("mcp list")
    assert d.intent == Intent.TOOL_CALL
    assert d.tool_name == "mcp_list"


def test_route_mcp_call():
    d = _route("mcp call filesystem read_file '{\"path\": \"/tmp/x\"}'")
    assert d.tool_name == "mcp_call"
    assert "filesystem" in d.args["task"]


def test_route_mcp_add():
    d = _route("mcp add filesystem npx -y @modelcontextprotocol/server-filesystem /tmp")
    assert d.tool_name == "mcp_add"
    assert "filesystem" in d.args["task"]


# --- Tools ---------------------------------------------------------------------

def test_mcp_list_no_servers():
    from server.mcp_client import client as mcp_client
    orig = mcp_client._manager
    mcp_client._manager = None
    try:
        r = mcp_list()
        assert r.status == "success"
        assert r.mode == ExecutionMode.DIRECT
        assert "display" in r.data
    finally:
        mcp_client._manager = orig


def test_mcp_call_draft():
    r = mcp_call(task="mcp call filesystem read_file '{\"path\": \"/tmp/x\"}'")
    assert r.status == "success"
    assert r.data["server"] == "filesystem"
    assert r.data["tool"] == "read_file"
    assert r.data["args"] == {"path": "/tmp/x"}
    assert "action_args" in r.data


def test_mcp_add_draft():
    r = mcp_add(task="mcp add filesystem npx -y @modelcontextprotocol/server-filesystem /tmp")
    assert r.status == "success"
    assert r.data["name"] == "filesystem"
    assert r.data["command"] == "npx"
    assert "-y" in r.data["args"]
    assert "action_args" in r.data


def test_mcp_add_missing():
    r = mcp_add(task="mcp add")
    assert r.status == "failure"


def test_tool_specs():
    assert MCP_LIST_SPEC.name == "mcp_list"
    assert MCP_CALL_SPEC.name == "mcp_call"
    assert MCP_ADD_SPEC.name == "mcp_add"
    assert MCP_LIST_SPEC.execution_mode == ExecutionMode.DIRECT


def test_permissions():
    from server.supervisor.permissions import ToolPermission, ToolPolicy
    p = ToolPermission()
    policy, _ = p.check("mcp_list")
    assert policy == ToolPolicy.ALLOW
    policy, _ = p.check("mcp_call")
    assert policy == ToolPolicy.NEEDS_APPROVAL
    policy, _ = p.check("mcp_add")
    assert policy == ToolPolicy.NEEDS_APPROVAL
