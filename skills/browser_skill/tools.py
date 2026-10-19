"""Browser skill tools: real interactive browsing through BrowserService.

Read-only tools run straight through; click/fill/type/press/select are
draft-only here and execute only after the user's approval.

browser_task is the agentic entry point: natural language like "play lofi"
or "youtube lofi hip hop" runs a multi-step browser agent (browser-use +
local Ollama). Always NEEDS_APPROVAL.
"""
from server.tools.agentic_browser_tool import AGENTIC_BROWSER_TOOLS
from server.tools.browser_tool import BROWSER_TOOLS

TOOLS = BROWSER_TOOLS + [
    AGENTIC_BROWSER_TOOLS["browser_task"],
]
