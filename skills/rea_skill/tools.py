"""OS Execution Bridge for rea_skill."""
from server.intent.registry import ExecutionMode, ToolResult, ToolSpec

TOOL_SPEC = ToolSpec(
    name="rea_skill",
    description="Run rea skill operations in OS.",
    execution_mode=ExecutionMode.DIRECT,
)

def run_skill(prompt: str = "", **kwargs) -> ToolResult:
    return ToolResult(
        status="success",
        mode=ExecutionMode.DIRECT,
        data={"skill": "rea_skill", "input": prompt, "result": "Ready for execution."},
    )

def format_result(result: ToolResult) -> str:
    return str(result.data.get("result", ""))

TOOLS = [(TOOL_SPEC, run_skill, format_result)]
