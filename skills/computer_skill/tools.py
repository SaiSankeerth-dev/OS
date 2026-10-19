"""Computer skill tools: natural-language desktop control.

computer_task is the agentic entry point: "take a screenshot" runs
instantly (no LLM); complex tasks use cua-agent + local Ollama.
Always NEEDS_APPROVAL.
"""
from server.tools.agentic_computer_tool import AGENTIC_COMPUTER_TOOLS

TOOLS = [
    AGENTIC_COMPUTER_TOOLS["computer_task"],
]
