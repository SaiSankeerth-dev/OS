"""Batch H Remote Access & Mode Architecture Acceptance Tests.

Verifies:
1. Operating mode defaults to LAPTOP_LOCAL (zero cloud compute by default).
2. Companion token generation, verification, and expiry enforcement.
3. Token revocation works immediately.
4. Boundary validation prohibits raw exposed ports without Zero-Trust tunnel.
5. Truthful status reporting (laptop_available, worker_location, paid_services_blocked).
6. FastAPI endpoints for remote status and token validation.
"""
import pytest
import time
from unittest.mock import patch

from server.security.remote_access import (
    OperatingMode,
    RemoteAccessConfig,
    RemoteAccessManager,
    get_remote_manager,
)


def test_remote_mode_defaults_to_laptop_local():
    mgr = RemoteAccessManager()
    assert mgr.get_mode() == OperatingMode.LAPTOP_LOCAL
    rep = mgr.get_status_report()
    assert rep["is_local_first"] is True
    assert rep["worker_location"] == "laptop_local"
    assert rep["paid_services_blocked"] is True
    assert rep["laptop_available"] is True


def test_companion_token_lifecycle():
    mgr = RemoteAccessManager(RemoteAccessConfig(token_ttl_seconds=2))
    token, expiry = mgr.generate_companion_token("iphone_15")
    assert token
    assert expiry > time.time()

    # Valid token verification
    assert mgr.verify_token(token) is True
    assert mgr.verify_token(f"Bearer {token}") is True

    # Bad token
    assert mgr.verify_token("invalid_token") is False
    assert mgr.verify_token("") is False

    # Revocation
    assert mgr.revoke_token(token) is True
    assert mgr.verify_token(token) is False


def test_companion_token_expiry():
    mgr = RemoteAccessManager(RemoteAccessConfig(token_ttl_seconds=1))
    token, _ = mgr.generate_companion_token("pixel_8")
    assert mgr.verify_token(token) is True

    # Fast forward past expiry
    mgr._tokens[token] = time.time() - 10
    assert mgr.verify_token(token) is False


def test_port_safety_validation():
    mgr = RemoteAccessManager()
    # In LAPTOP_LOCAL, local access is contained
    safe, msg = mgr.validate_port_safety()
    assert safe is True

    # In MOBILE_COMPANION without tunnel, raw exposure is blocked
    mgr.set_mode(OperatingMode.MOBILE_COMPANION)
    mgr.config.tunnel_provider = "none"
    safe, msg = mgr.validate_port_safety()
    assert safe is False
    assert "Unsafe exposure" in msg

    # With Cloudflare or Tailscale tunnel, it is safe
    mgr.config.tunnel_provider = "cloudflare"
    safe, msg = mgr.validate_port_safety()
    assert safe is True


@pytest.mark.asyncio
async def test_remote_status_endpoint():
    from web.server import remote_status, create_companion_token, verify_companion_token

    rep = await remote_status()
    assert "mode" in rep
    assert rep["is_local_first"] is True
    assert rep["paid_services_blocked"] is True

    tok_res = await create_companion_token({"label": "test_companion"})
    assert tok_res["ok"] is True
    token = tok_res["token"]

    verify_res = await verify_companion_token({"token": token})
    assert verify_res["ok"] is True
    assert verify_res["valid"] is True
