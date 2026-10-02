"""Web search skill tools."""
from server.tools.websearch_tool import (
    WEB_SEARCH_SPEC,
    format_web_search,
    web_search,
)

TOOLS = [
    (WEB_SEARCH_SPEC, web_search, format_web_search),
]
