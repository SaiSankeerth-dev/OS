"""PersonalityManager: the active persona, persisted in the StateStore.

Local settings change only - no external effect, no approval needed.
"""
from __future__ import annotations

import json
import logging

from config import PersonalityConfig
from server.state.store import StateStore

from .personas import DEFAULT_PERSONA, PERSONAS, Persona


log = logging.getLogger("os.personality")


class PersonalityManager:
    def __init__(self, state_store: StateStore | None = None) -> None:
        self._store = state_store or StateStore()
        self._current = DEFAULT_PERSONA
        self._load()

    def _load(self) -> None:
        try:
            events = self._store.get_events(kind="personality", limit=1)
            if events:
                name = json.loads(events[0]["data"]).get("persona", "")
                if name in PERSONAS:
                    self._current = name
        except Exception as e:  # noqa: BLE001
            log.debug("personality load failed: %s", e)

    @property
    def current(self) -> Persona:
        return PERSONAS[self._current]

    @property
    def current_name(self) -> str:
        return self._current

    def list_personas(self) -> list[Persona]:
        return [PERSONAS[k] for k in PERSONAS]

    def set_persona(self, name: str) -> Persona:
        key = (name or "").strip().lower()
        if key not in PERSONAS:
            raise ValueError(
                f"unknown persona '{name}'. "
                f"Choose from: {', '.join(PERSONAS)}"
            )
        self._current = key
        try:
            self._store.log_event(
                "personality",
                "personality_manager",
                json.dumps({"persona": key}),
            )
        except Exception as e:  # noqa: BLE001
            log.debug("personality persist failed: %s", e)
        return PERSONAS[key]

    def to_config(self, persona: Persona | None = None) -> PersonalityConfig:
        p = persona or self.current
        return PersonalityConfig(
            name=p.name,
            traits=list(p.traits),
            forbidden_phrases=list(p.forbidden_phrases),
        )
