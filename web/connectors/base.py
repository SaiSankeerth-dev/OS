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


def check_and_refresh_oauth(cred_group: str, store: Any = None) -> dict[str, Any]:
    """Check OAuth token expiry and proactively refresh 10 minutes (600s) before expiry."""
    from jarvis_os.primitives.browser_voice_oauth_fixes import ProactiveOAuthWatchdog

    if store is None:
        from web.store import DashboardStore
        store = DashboardStore()

    creds = store.load_credentials(cred_group)
    if not creds:
        return {"status": "no_credentials", "cred_group": cred_group, "refreshed": False}

    watchdog = ProactiveOAuthWatchdog(refresh_margin_sec=600)

    if cred_group == "microsoft":
        from .oauth_microsoft import refresh_access_token
        res = watchdog.check_and_refresh(cred_group, creds, refresh_access_token)
    elif cred_group == "google":
        def _google_refresh(client_id: str, client_secret: str, refresh_token: str) -> str:
            from google.oauth2.credentials import Credentials
            from google.auth.transport.requests import Request
            c = Credentials(
                token=None,
                refresh_token=refresh_token,
                token_uri="https://oauth2.googleapis.com/token",
                client_id=client_id,
                client_secret=client_secret,
            )
            c.refresh(Request())
            return c.token or ""
        res = watchdog.check_and_refresh(cred_group, creds, _google_refresh)
    else:
        return {"status": "unsupported_cred_group", "cred_group": cred_group, "refreshed": False}

    if res.get("refreshed"):
        store.save_credentials(cred_group, store.get_label(cred_group) or cred_group, creds)
    return res
