"""Voice state machine states — independent of ConversationState.

VoiceEngine owns its own state machine. It does not touch ConversationManager.
"""
from __future__ import annotations
import enum


class VoiceState(str, enum.Enum):
    IDLE = "IDLE"
    LISTENING = "LISTENING"
    USER_SPEAKING = "USER_SPEAKING"
    THINKING = "THINKING"
    SPEAKING = "SPEAKING"
    ERROR = "ERROR"