"""Encrypted credential vault.

Secrets are encrypted with Fernet (AES-128-CBC + HMAC) before they touch
SQLite. The key lives either in the OS_DASHBOARD_KEY env var or in a
machine-local key file with 0600 permissions — never in the database, never
in logs, and never returned by any API.
"""
from __future__ import annotations

import base64
import json
import os
from pathlib import Path

from cryptography.fernet import Fernet, InvalidToken

_KEY_ENV = "OS_DASHBOARD_KEY"


def _key_file() -> Path:
    data_dir = Path(os.environ.get("OS_DATA_DIR", "data"))
    data_dir.mkdir(parents=True, exist_ok=True)
    return data_dir / ".dashboard.key"


def get_key() -> bytes:
    env_key = os.environ.get(_KEY_ENV)
    if env_key:
        raw = env_key.encode()
        # Accept a raw Fernet key or a passphrase-ish secret (hashed to 32B).
        try:
            Fernet(raw)
            return raw
        except Exception:
            import hashlib

            return base64.urlsafe_b64encode(hashlib.sha256(raw).digest())
    kf = _key_file()
    if kf.exists():
        raw = kf.read_bytes().strip()
        Fernet(raw)  # validates
        return raw
    key = Fernet.generate_key()
    kf.write_bytes(key)
    try:
        os.chmod(kf, 0o600)
    except OSError:
        pass
    return key


def encrypt_dict(secret: dict) -> str:
    f = Fernet(get_key())
    return f.encrypt(json.dumps(secret).encode()).decode()


def decrypt_dict(token: str) -> dict:
    f = Fernet(get_key())
    try:
        return json.loads(f.decrypt(token.encode()).decode())
    except InvalidToken as e:
        raise ValueError("stored credentials are unreadable (wrong key?)") from e


def mask_value(v: str) -> str:
    """For logs/UI: never show more than the last 4 chars."""
    if not v:
        return ""
    return "…" + v[-4:] if len(v) > 4 else "••••"
