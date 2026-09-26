"""Smoke test: Pipecat bridge + ConversationManager."""
import asyncio
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from config import load_config
from server.conversation.manager import ConversationManager
from server.intent.router import IntentRouter
from server.intent.registry import ToolRegistry
from server.tools.datetime_tool import DATETIME_SPEC, format_datetime, get_current_datetime
from server.response.policy import ResponsePolicy
from server.voice.pipecat_bridge import ConversationBridge


async def main():
    cfg = load_config()
    cm = ConversationManager(
        cfg,
        intent_router=IntentRouter(),
        tool_registry=ToolRegistry(),
        response_policy=ResponsePolicy(forbidden_prefixes=cfg.personality.forbidden_phrases),
    )
    cm.tool_registry.register(DATETIME_SPEC, get_current_datetime, format_datetime)
    bridge = ConversationBridge(cm)
    sents = await bridge.feed_text("what time is it?")
    print(f"sentences: {sents}")
    assert any(":" in s for s in sents), f"expected clock string in {sents}"


if __name__ == "__main__":
    asyncio.run(main())