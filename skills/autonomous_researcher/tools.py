"""OS Execution Bridge for autonomous_researcher."""
from server.intent.registry import ExecutionMode, ToolResult, ToolSpec

TOOL_SPEC = ToolSpec(
    name="autonomous_researcher",
    description="Run gpt-researcher skill operations in OS.",
    execution_mode=ExecutionMode.DIRECT,
)

def run_skill(prompt: str = "", **kwargs) -> ToolResult:
    return ToolResult(
        status="success",
        mode=ExecutionMode.DIRECT,
        data={"skill": "autonomous_researcher", "input": prompt, "result": "Ready for execution."},
    )

TOOLS = [(TOOL_SPEC, run_skill)]
