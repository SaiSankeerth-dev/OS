"""Calculator skill: safe arithmetic, nothing else.

Parses the expression with ast and evaluates only numbers and basic
operators. No names, no attribute access, no function calls - so
`__import__('os')` and friends are rejected before they can run.
"""
from __future__ import annotations

import ast
import operator

from server.intent.registry import ExecutionMode, ToolResult, ToolSpec


CALC_SPEC = ToolSpec(
    name="calc",
    description="Evaluate an arithmetic expression, e.g. '2+3*4'.",
    execution_mode=ExecutionMode.DIRECT,
)

_OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.FloorDiv: operator.floordiv,
    ast.Mod: operator.mod,
    ast.Pow: operator.pow,
    ast.UAdd: operator.pos,
    ast.USub: operator.neg,
}


def _eval(node: ast.AST) -> float:
    if isinstance(node, ast.Expression):
        return _eval(node.body)
    if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
        return node.value
    if isinstance(node, ast.BinOp) and type(node.op) in _OPERATORS:
        return _OPERATORS[type(node.op)](_eval(node.left), _eval(node.right))
    if isinstance(node, ast.UnaryOp) and type(node.op) in _OPERATORS:
        return _OPERATORS[type(node.op)](_eval(node.operand))
    raise ValueError("not a plain arithmetic expression")


def calc(expression: str = "", **kwargs) -> ToolResult:
    expr = (expression or "").strip()
    if not expr:
        return ToolResult(
            status="failure", mode=ExecutionMode.DIRECT, error="no expression"
        )
    if len(expr) > 200:
        return ToolResult(
            status="failure",
            mode=ExecutionMode.DIRECT,
            error="expression too long",
        )
    try:
        result = _eval(ast.parse(expr, mode="eval"))
    except (SyntaxError, ValueError, ZeroDivisionError, OverflowError) as e:
        return ToolResult(
            status="failure",
            mode=ExecutionMode.DIRECT,
            error=f"can't calculate that: {e}",
        )
    if isinstance(result, float) and result.is_integer():
        result = int(result)
    return ToolResult(
        status="success",
        mode=ExecutionMode.DIRECT,
        data={"expression": expr, "result": result},
    )


def format_calc(result: ToolResult) -> str:
    if result.status != "success":
        return "I can't calculate that - plain arithmetic only."
    return f"{result.data['expression']} = {result.data['result']}"


TOOLS = [(CALC_SPEC, calc, format_calc)]
