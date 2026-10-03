"""System skill tools."""
from server.tools.system_info_tool import (
    SYSTEM_INFO_SPEC,
    format_system_info,
    get_system_info,
)

TOOLS = [
    (SYSTEM_INFO_SPEC, get_system_info, format_system_info),
]
