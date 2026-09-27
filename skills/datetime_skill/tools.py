"""Datetime skill tools."""
from server.tools.datetime_tool import (
    DATETIME_SPEC,
    format_datetime,
    get_current_datetime,
)

TOOLS = [
    (DATETIME_SPEC, get_current_datetime, format_datetime),
]
