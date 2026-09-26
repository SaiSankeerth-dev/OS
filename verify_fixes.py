"""Quick verification test."""
import asyncio
import sys
from pathlib import Path
root = Path('C:/OS')
if str(root) not in sys.path:
    sys.path.insert(0, str(root))

from config import load_config
from server.conversation import ConversationManager, ConversationState
from server.llm.router import ModelRouter
from server.utils import setup_logging

cfg = load_config()
setup_logging(level=cfg.logging.level)
router = ModelRouter.from_config(
    base_url=cfg.llm.base_url,
    model=cfg.llm.model,
    timeout_sec=float(cfg.llm.request_timeout_sec),
)
mgr = ConversationManager(cfg, router)

async def quick_test():
    # Test 1: Hello
    result = await mgr.respond_text_collected('hi')
    print(f'Turn 1: "{result.text}" state={result.state.value}')
    
    # Test 2: Time question
    result2 = await mgr.respond_text_collected('what time is it?')
    print(f'Turn 2: "{result2.text}" state={result2.state.value}')
    
    # Test 3: About yourself
    result3 = await mgr.respond_text_collected('tell me about yourself')
    print(f'Turn 3: "{result3.text}" state={result3.state.value}')
    
    # Test 4: Greeting again
    result4 = await mgr.respond_text_collected('hello')
    print(f'Turn 4: "{result4.text}" state={result4.state.value}')

asyncio.run(quick_test())