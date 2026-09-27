"""Deterministic verification of tool outcomes.

Phase 11. Locked rule: never trust an agent's (or a tool's) "done"
claim - every executed tool result is checked against a structural
contract before it is presented as fact. No model, no network, no
heuristics: pure functions over the ToolResult.

A tool that reports success but returns nothing verifiable FAILS.
The pipeline turns that into status="failed" and the user hears
"I couldn't verify that worked" instead of a bogus answer.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from ..intent.registry import ToolResult


@dataclass
class VerificationResult:
    passed: bool
    note: str = ""


def _nonempty_str(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def _check_calculate(data: dict) -> VerificationResult:
    result = data.get("result")
    # bool is a subclass of int - "True" is never a calculation.
    if isinstance(result, bool) or not isinstance(result, (int, float)):
        return VerificationResult(
            False, "calculator returned no numeric result"
        )
    return VerificationResult(True, "numeric result present")


def _check_linkedin_draft(data: dict) -> VerificationResult:
    draft = data.get("draft")
    if not _nonempty_str(draft):
        return VerificationResult(False, "draft is empty")
    if len(draft) > 3000:  # LinkedIn post ceiling
        return VerificationResult(False, "draft exceeds post length limit")
    return VerificationResult(True, "draft present and within limits")


def _check_memory_save(data: dict) -> VerificationResult:
    if not _nonempty_str(data.get("note")):
        return VerificationResult(False, "saved note is empty")
    return VerificationResult(True, "note stored")


def _check_memory_recall(data: dict) -> VerificationResult:
    # Zero hits is a legitimate outcome - the contract is the shape.
    if not isinstance(data.get("notes"), list):
        return VerificationResult(False, "recall returned no notes list")
    return VerificationResult(True, "notes list present")


def _check_memory_forget(data: dict) -> VerificationResult:
    # A successful forget deleted at least one note - nothing deleted
    # is a failure upstream, never a "success".
    deleted = data.get("deleted")
    if not isinstance(deleted, list) or not deleted:
        return VerificationResult(False, "forget deleted nothing")
    return VerificationResult(True, f"{len(deleted)} note(s) deleted")


def _check_datetime(data: dict) -> VerificationResult:
    if not _nonempty_str(data.get("date")) or not _nonempty_str(
        data.get("time")
    ):
        return VerificationResult(False, "datetime fields missing")
    return VerificationResult(True, "date and time present")


def _check_system_info(data: dict) -> VerificationResult:
    for key in ("cpu_percent", "memory_percent"):
        if not isinstance(data.get(key), (int, float)):
            return VerificationResult(
                False, f"system info field '{key}' missing"
            )
    return VerificationResult(True, "system fields present")


def _check_mcp(data: dict) -> VerificationResult:
    # MCP servers are external processes: a "success" with no payload
    # is exactly the lie this phase exists to catch.
    if not data:
        return VerificationResult(
            False, "MCP tool claimed success but returned no data"
        )
    return VerificationResult(True, "MCP payload present")


# Tool name -> contract. Prefix "mcp__" matches every MCP bus tool.
_CONTRACTS: list[tuple[str, Any]] = [
    ("calc", _check_calculate),
    ("linkedin_draft", _check_linkedin_draft),
    ("memory_save", _check_memory_save),
    ("memory_recall", _check_memory_recall),
    ("memory_forget", _check_memory_forget),
    ("get_current_datetime", _check_datetime),
    ("get_system_info", _check_system_info),
]


def verify_tool_result(
    tool_name: str, args: dict, result: ToolResult
) -> VerificationResult:
    """Deterministic gate over an executed tool result."""
    if result.status != "success":
        return VerificationResult(
            False, f"tool reported failure: {result.error or 'unknown error'}"
        )
    data = result.data or {}
    for prefix, check in _CONTRACTS:
        if tool_name == prefix or tool_name.startswith(prefix + "_"):
            return check(data)
    if tool_name.startswith("mcp__"):
        return _check_mcp(data)
    # Unknown tool: the minimum honest bar is a non-empty outcome.
    if not data:
        return VerificationResult(
            False, "tool claimed success but returned nothing"
        )
    return VerificationResult(True, "non-empty outcome")
