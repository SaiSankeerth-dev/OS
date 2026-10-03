"""Test the real pipeline after sounddevice install."""
import asyncio
from server.conversation.manager import ConversationManager
from config import load_config
from server.llm.router import ModelRouter
from server.intent.router import IntentRouter
from server.intent.registry import ToolRegistry
from server.tools.datetime_tool import DATETIME_SPEC, format_datetime
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

    result = await mgr.respond_text_collected("hi")
    print("Result:", result.text, result.state.value)


async def go():
    await main()


if __name__ == "__main__":
    asyncio.run(go())