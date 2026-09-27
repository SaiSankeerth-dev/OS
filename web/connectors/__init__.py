"""Connector package: manifests, adapters, vault, MCP bridge."""
from .base import Adapter, AdapterError  # noqa: F401
from .manifests import CONNECTORS, MANIFESTS, get_connector, get_manifest  # noqa: F401
from .adapters import ADAPTERS, get_adapter  # noqa: F401
from . import mcp, oauth_google, vault  # noqa: F401
