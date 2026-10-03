"""Quick test script for Phase 1 text conversation - no artificial timeout."""
import asyncio
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from config import load_config
from server.conversation import ConversationManager, ConversationState
from server.llm.router import ModelRouter
from server.utils import setup_logging


async def test():
    cfg = load_config()
    setup_logging(level=cfg.logging.level)

    router = ModelRouter.from_config(
        base_url=cfg.llm.base_url,
        model=cfg.llm.model,
        timeout_sec=float(cfg.llm.request_timeout_sec),
    )
    mgr = ConversationManager(cfg, router)

    assert await mgr.health(), "Ollama not healthy"
    print("[ok] health check passed")

    # Test respond_text_collected - no timeout wrapper, use config timeout
    result = await mgr.respond_text_collected("Hello OS")
    print("[ok] respond_text_collected: " + result.text + " (state: " + result.state.value + ")")

    # Test second turn
    result2 = await mgr.respond_text_collected("What do you remember?")
    print("[ok] second turn: " + result2.text + " (state: " + result2.state.value + ")")

    # Test state machine
    print("[ok] final state: " + mgr.state.value)

    mgr.reset()
    print("[ok] reset worked")

    print("\nAll Phase 1 tests done!")


if __name__ == "__main__":
    asyncio.run(test())