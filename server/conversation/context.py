"""Context window builder (Section 31).

Three layers, kept small:
1. System prompt (personality + memory hint)
2. Recent message history (capped)
3. Current task/context (Phase 8 hook returns "" for now)

Plus retrieved relevant memories injected into the system prompt hint.
Phase 1 ships without memory retrieval — `relevant_memories` is empty and
the hint stays empty; Phase 2 fills it.
"""
from __future__ import annotations

from pathlib import Path
import sys
_ROOT = Path(__file__).resolve().parent.parent
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from config import ConversationConfig
from ..llm.base import Message
from ..llm.base import Message
from .personality import build_system_prompt


def build_context_messages(
    recent: Sequence[Message],
    *,
    conversation_cfg: ConversationConfig,
    system_prompt: str,
    relevant_memories: Sequence[str] | None = None,
    task_context: str = "",
) -> list[Message]:
    # Always keep system at index 0.
    messages: list[Message] = [Message(role="system", content=system_prompt)]

    # Trim recent messages (we drop the oldest; both user/assistant entries are paired).
    if len(recent) > conversation_cfg.max_recent_messages:
        recent = recent[-conversation_cfg.max_recent_messages:]
    messages.extend(recent)

    if relevant_memories:
        mem_text = "\n".join(f"- {m}" for m in relevant_memories if m)
        if mem_text:
            messages.append(
                Message(
                    role="system",
                    content="Earlier context that may be relevant:\n" + mem_text,
                )
            )

    if task_context and len(task_context) <= conversation_cfg.max_task_context_chars:
        messages.append(
            Message(
                role="system",
                content="Current task context:\n" + task_context,
            )
        )
    return messages
