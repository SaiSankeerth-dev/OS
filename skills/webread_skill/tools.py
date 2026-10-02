"""Web read skill tools."""
from server.tools.webread_tool import (
    WEB_READ_SPEC,
    format_web_read,
    web_read,
)

TOOLS = [
    (WEB_READ_SPEC, web_read, format_web_read),
]
