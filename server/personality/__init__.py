"""Phase 7: switchable personalities.

Four personas, one active at a time. A persona only changes *tone*:
the safety pipeline, tool formatters, and approval flows are untouched -
a different voice never means different rules.

Personas persist in the StateStore (kind="personality"); the latest
event wins, so the choice survives restarts.
"""
from .manager import PersonalityManager
from .personas import PERSONAS, Persona

__all__ = ["PERSONAS", "Persona", "PersonalityManager"]
