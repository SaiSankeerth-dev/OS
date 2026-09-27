"""Connector framework v2 — manifests, adapters, permission states.

Every connector is a *manifest* (what it is, what it asks for, how to set
it up) plus an *adapter* (the real API calls). Nothing external is touched
until the user grants permission, and a connector only reports "connected"
after its credentials pass a real health check against the live service.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


class AdapterError(Exception):
    """Raised when a live service call fails. Message is user-facing."""


@dataclass
class CredField:
    key: str
    label: str
    help: str = ""
    secret: bool = True
    placeholder: str = ""


@dataclass
class ActionParam:
    name: str
    label: str
    required: bool = False
    placeholder: str = ""


@dataclass
class ActionSpec:
    name: str
    label: str
    description: str
    needs_approval: bool  # write actions always go through the approval rail
    params: list[ActionParam] = field(default_factory=list)

    def tool_name(self, connector_id: str) -> str:
        return f"{connector_id}.{self.name}"

    def input_schema(self) -> dict:
        return {
            "type": "object",
            "properties": {
                p.name: {"type": "string", "description": p.label} for p in self.params
            },
            "required": [p.name for p in self.params if p.required],
        }


@dataclass
class ConnectorManifest:
    id: str
    name: str
    tagline: str
    color: str
    icon: str  # emoji, no external assets
    auth_kind: str  # google_oauth | token | fields
    cred_group: str  # credentials shared inside a group ("google" for all Google)
    cred_fields: list[CredField]
    scopes: list[str]  # permission strings shown in the grant dialog
    setup_steps: list[str]  # honest, numbered, human setup guide
    note: str  # honesty note: cost, limits, what "free" really means
    actions: list[ActionSpec]
    docs_url: str = ""

    def get_action(self, name: str) -> ActionSpec | None:
        for a in self.actions:
            if a.name == name:
                return a
        return None


class Adapter:
    """Real API calls for one connector. Subclass per service."""

    manifest: ConnectorManifest

    # -- lifecycle -----------------------------------------------------
    def health_check(self, creds: dict[str, str]) -> tuple[bool, str]:
        """Validate credentials against the LIVE service.

        Returns (ok, message). Must make a real network call — a connector
        is only "connected" when this passes.
        """
        raise NotImplementedError

    def run_action(
        self, action: str, params: dict[str, Any], creds: dict[str, str]
    ) -> dict[str, Any]:
        """Execute one action. Returns a JSON-serialisable result dict with
        at least {"ok": True, ...} or raises AdapterError."""
        raise NotImplementedError

    # -- helpers --------------------------------------------------------
    def _require(self, creds: dict, *keys: str) -> None:
        missing = [k for k in keys if not creds.get(k)]
        if missing:
            raise AdapterError(
                f"Missing {', '.join(missing)} — add it in the connector settings."
            )
