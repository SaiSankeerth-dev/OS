import asyncio
import re

from config import load_config
from server.conversation.manager import ConversationManager
from server.conversation.personality import build_system_prompt
from server.intent.router import IntentRouter
from server.intent.registry import ToolRegistry
from server.tools.datetime_tool import (
    DATETIME_SPEC,
    format_datetime,
    get_current_datetime,
)
from server.tools.system_info_tool import (
    SYSTEM_INFO_SPEC,
    format_system_info,
    get_system_info,
)
from server.response.policy import ResponsePolicy


def _mgr():
    cfg = load_config()
    router = IntentRouter()
    reg = ToolRegistry()
    reg.register(DATETIME_SPEC, get_current_datetime, format_datetime)
    reg.register(SYSTEM_INFO_SPEC, get_system_info, format_system_info)
    policy = ResponsePolicy(
        forbidden_prefixes=cfg.personality.forbidden_phrases
    )
    return ConversationManager(
        cfg,
        intent_router=router,
        tool_registry=reg,
        response_policy=policy,
    )


async def _collect(text: str) -> str:
    m = _mgr()
    parts = []
    async for c in m.respond_text(text):
        parts.append(c.delta)
    return "".join(parts).strip()


async def _collect_into(m: ConversationManager, text: str) -> str:
    parts = []
    async for c in m.respond_text(text):
        parts.append(c.delta)
    return "".join(parts).strip()


def test_time_query_returns_clock_string():
    out = asyncio.run(_collect("what time is it?"))
    assert re.match(r"^It's \d{1,2}:\d{2} (AM|PM) on .+", out), out


def test_date_query_returns_clock_string():
    out = asyncio.run(_collect("what's today's date?"))
    assert re.match(r"^It's \d{1,2}:\d{2} (AM|PM) on .+", out), out


def test_system_info_returns_real_data():
    out = asyncio.run(_collect("battery"))
    assert "CPU:" in out and "memory:" in out


def test_history_appends_user_and_assistant():
    m = _mgr()
    asyncio.run(_collect_into(m, "hi"))
    asyncio.run(_collect_into(m, "what time is it?"))
    assert len(m.history) >= 4


def test_personality_contains_conversation_rules():
    cfg = load_config()
    p = build_system_prompt(cfg.personality)
    assert "Conversation rules:" in p
    assert "1. Answer the user's actual question." in p
