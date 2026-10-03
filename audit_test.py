"""Audit test script."""
import asyncio
import re
from config import load_config
from server.conversation.manager import ConversationManager
from server.tools.datetime_tool import get_current_datetime, format_datetime, DATETIME_SPEC
from server.tools.system_info_tool import get_system_info, SYSTEM_INFO_SPEC
from server.llm.router import ModelRouter
from server.intent.router import IntentRouter
from server.intent.registry import ToolRegistry
from server.response.policy import ResponsePolicy


async def main():
    cfg = load_config()
    router = ModelRouter.from_config(
        base_url=cfg.llm.base_url,
        model=cfg.llm.model,
        timeout_sec=float(cfg.llm.request_timeout_sec),
    )
    mgr = ConversationManager(
        cfg,
        intent_router=IntentRouter(),
        tool_registry=ToolRegistry(),
        response_policy=ResponsePolicy(forbidden_prefixes=cfg.personality.forbidden_phrases),
    )
    mgr.tool_registry.register(DATETIME_SPEC, get_current_datetime, format_datetime)

    # Test 1: hello
    result = await mgr.respond_text_collected("hi")
    print(f'1. hi -> "{result.text}" state={result.state.value}')

    # Test 2: time
    result = await mgr.respond_text_collected("what time is it?")
    print(f'2. time -> "{result.text}" state={result.state.value}')

    # Test 3: python
    result = await mgr.respond_text_collected("what is Python?")
    print(f'3. Python -> "{result.text}" state={result.state.value}')

    # Test 4: who created it
    result = await mgr.respond_text_collected("who created it?")
    print(f'4. who created it -> "{result.text}" state={result.state.value}')

    # Test 5: what time is it (check it uses real clock)
    result = await mgr.respond_text_collected("what time is it?")
    print(f'5. time again -> "{result.text}" state={result.state.value}')

    # Test 6: memory - ask about conversation history
    result = await mgr.respond_text_collected("what were we talking about?")
    print(f'6. memory -> "{result.text}" state={result.state.value}')

    # Test 7: five unrelated questions
    for q in ["what is gravity", "who is kafka", "where is paris", "when is new year", "why is the sky blue"]:
        result = await mgr.respond_text_collected(q)
        print(f'7. {q} -> "{result.text[:60]}..." state={result.state.value}')

    # Test 8: datetime tool directly
    result = await mgr.respond_text_collected("battery")
    print(f'8. battery -> "{result.text}" state={result.state.value}')

asyncio.run(main())