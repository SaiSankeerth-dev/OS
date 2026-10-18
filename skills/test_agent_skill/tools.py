"""OS Execution Bridge for test_agent_skill."""
from server.intent.registry import ExecutionMode, ToolResult, ToolSpec

TOOL_SPEC = ToolSpec(
    name="test_agent_skill",
    description="Run test_agent_skill skill operations in OS.",
    execution_mode=ExecutionMode.DIRECT,
)

def run_skill(prompt: str = "", **kwargs) -> ToolResult:
    return ToolResult(
        status="success",
        mode=ExecutionMode.DIRECT,
        data={"skill": "test_agent_skill", "input": prompt, "result": "Ready for execution in OS Virtual Computer."},
    )

def format_result(result: ToolResult) -> str:
    return str(result.data.get("result", ""))

TOOLS = [(TOOL_SPEC, run_skill, format_result)]
