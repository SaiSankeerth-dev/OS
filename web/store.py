"""Dashboard-local storage: connector permission states, encrypted vault,
per-connector settings, and action approvals.

States: available → granted → connected (only after a live health check
passes) | setup_error (creds failed the health check) | denied.
Revoking deletes the grant AND the encrypted credentials.
"""
from __future__ import annotations

import json
import sqlite3
import time
import uuid
from pathlib import Path

SCHEMA = """
CREATE TABLE IF NOT EXISTS connector_state (
    connector_id TEXT PRIMARY KEY,
    state TEXT NOT NULL DEFAULT 'available',
    scopes TEXT NOT NULL DEFAULT '[]',
    health_msg TEXT NOT NULL DEFAULT '',
    health_at REAL NOT NULL DEFAULT 0,
    last_used_at REAL NOT NULL DEFAULT 0,
    updated_at REAL NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS connector_credentials (
    cred_group TEXT PRIMARY KEY,
    label TEXT NOT NULL DEFAULT '',
    secret TEXT NOT NULL DEFAULT '',
    updated_at REAL NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS connector_settings (
    connector_id TEXT PRIMARY KEY,
    settings TEXT NOT NULL DEFAULT '{}',
    updated_at REAL NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS connector_actions (
    id TEXT PRIMARY KEY,
    connector_id TEXT NOT NULL,
    action TEXT NOT NULL,
    label TEXT NOT NULL,
    summary TEXT NOT NULL,
    params TEXT NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending',
    result TEXT NOT NULL DEFAULT '',
    created_at REAL NOT NULL,
    updated_at REAL NOT NULL
);
"""

# States
AVAILABLE = "available"
GRANTED = "granted"
CONNECTED = "connected"
SETUP_ERROR = "setup_error"
DENIED = "denied"


class DashboardStore:
    def __init__(self, db_path: str | Path = "data/dashboard.db") -> None:
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        conn = self._connect()
        try:
            conn.executescript(SCHEMA)
            conn.commit()
        finally:
            conn.close()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    # ---- permission states -------------------------------------------
    def grant(self, connector_id: str, scopes: list[str]) -> dict:
        now = time.time()
        conn = self._connect()
        try:
            conn.execute(
                "INSERT INTO connector_state (connector_id, state, scopes, updated_at)"
                " VALUES (?,?,?,?)"
                " ON CONFLICT(connector_id) DO UPDATE SET"
                " state='granted', scopes=excluded.scopes, updated_at=excluded.updated_at",
                (connector_id, GRANTED, json.dumps(scopes), now),
            )
            conn.commit()
        finally:
            conn.close()
        return self.grant_status(connector_id)

    def deny(self, connector_id: str) -> None:
        conn = self._connect()
        try:
            conn.execute(
                "INSERT INTO connector_state (connector_id, state, updated_at)"
                " VALUES (?,?,?)"
                " ON CONFLICT(connector_id) DO UPDATE SET"
                " state='denied', updated_at=excluded.updated_at",
                (connector_id, DENIED, time.time()),
            )
            conn.commit()
        finally:
            conn.close()

    def revoke(self, connector_id: str, cred_group: str) -> None:
        """Remove the grant, settings, and the credential group — but only
        delete shared group credentials if no sibling connector still uses
        them."""
        from .connectors.manifests import MANIFESTS

        conn = self._connect()
        try:
            conn.execute("DELETE FROM connector_state WHERE connector_id = ?",
                         (connector_id,))
            conn.execute("DELETE FROM connector_settings WHERE connector_id = ?",
                         (connector_id,))
            siblings = [m.id for m in MANIFESTS
                        if m.cred_group == cred_group and m.id != connector_id]
            still_used = False
            if siblings:
                rows = conn.execute(
                    "SELECT connector_id, state FROM connector_state WHERE "
                    "connector_id IN (%s)" % ",".join("?" * len(siblings)),
                    siblings).fetchall()
                still_used = any(r["state"] in (GRANTED, CONNECTED, SETUP_ERROR)
                                 for r in rows)
            if not still_used:
                conn.execute("DELETE FROM connector_credentials WHERE cred_group = ?",
                             (cred_group,))
            conn.commit()
        finally:
            conn.close()

    def set_state(self, connector_id: str, state: str, health_msg: str = "") -> None:
        conn = self._connect()
        try:
            conn.execute(
                "INSERT INTO connector_state (connector_id, state, health_msg,"
                " health_at, updated_at) VALUES (?,?,?,?,?)"
                " ON CONFLICT(connector_id) DO UPDATE SET state=excluded.state,"
                " health_msg=excluded.health_msg, health_at=excluded.health_at,"
                " updated_at=excluded.updated_at",
                (connector_id, state, health_msg,
                 time.time() if state in (CONNECTED, SETUP_ERROR) else 0,
                 time.time()),
            )
            conn.commit()
        finally:
            conn.close()

    def touch_used(self, connector_id: str) -> None:
        conn = self._connect()
        try:
            conn.execute(
                "UPDATE connector_state SET last_used_at = ? WHERE connector_id = ?",
                (time.time(), connector_id))
            conn.commit()
        finally:
            conn.close()

    def grant_status(self, connector_id: str, cred_group: str = "") -> dict:
        conn = self._connect()
        try:
            row = conn.execute(
                "SELECT state, scopes, health_msg, health_at, last_used_at"
                " FROM connector_state WHERE connector_id = ?",
                (connector_id,)).fetchone()
            has_creds = False
            if cred_group:
                has_creds = conn.execute(
                    "SELECT 1 FROM connector_credentials WHERE cred_group = ?",
                    (cred_group,)).fetchone() is not None
        finally:
            conn.close()
        if row is None:
            return {"state": AVAILABLE, "scopes": [], "has_credentials": False,
                    "health_msg": "", "health_at": 0, "last_used_at": 0}
        return {"state": row["state"], "scopes": json.loads(row["scopes"]),
                "has_credentials": has_creds, "health_msg": row["health_msg"],
                "health_at": row["health_at"], "last_used_at": row["last_used_at"]}

    def has_credentials(self, cred_group: str) -> bool:
        conn = self._connect()
        try:
            return conn.execute(
                "SELECT 1 FROM connector_credentials WHERE cred_group = ?",
                (cred_group,)).fetchone() is not None
        finally:
            conn.close()

    # ---- encrypted credentials -----------------------------------------
    def save_credentials(self, cred_group: str, label: str, secret: dict) -> None:
        from .connectors.vault import encrypt_dict

        conn = self._connect()
        try:
            conn.execute(
                "INSERT INTO connector_credentials (cred_group, label, secret, updated_at)"
                " VALUES (?,?,?,?)"
                " ON CONFLICT(cred_group) DO UPDATE SET label=excluded.label,"
                " secret=excluded.secret, updated_at=excluded.updated_at",
                (cred_group, label, encrypt_dict(secret), time.time()),
            )
            conn.commit()
        finally:
            conn.close()

    def load_credentials(self, cred_group: str) -> dict:
        from .connectors.vault import decrypt_dict

        conn = self._connect()
        try:
            row = conn.execute(
                "SELECT secret FROM connector_credentials WHERE cred_group = ?",
                (cred_group,)).fetchone()
        finally:
            conn.close()
        if row is None or not row["secret"]:
            return {}
        return decrypt_dict(row["secret"])

    # ---- per-connector settings (non-secret defaults) -------------------
    def save_settings(self, connector_id: str, settings: dict) -> None:
        conn = self._connect()
        try:
            conn.execute(
                "INSERT INTO connector_settings (connector_id, settings, updated_at)"
                " VALUES (?,?,?)"
                " ON CONFLICT(connector_id) DO UPDATE SET settings=excluded.settings,"
                " updated_at=excluded.updated_at",
                (connector_id, json.dumps(settings), time.time()),
            )
            conn.commit()
        finally:
            conn.close()

    def get_settings(self, connector_id: str) -> dict:
        conn = self._connect()
        try:
            row = conn.execute(
                "SELECT settings FROM connector_settings WHERE connector_id = ?",
                (connector_id,)).fetchone()
        finally:
            conn.close()
        return json.loads(row["settings"]) if row else {}

    # ---- action approvals (write actions wait here) ---------------------
    def create_action(self, connector_id: str, action: str, label: str,
                      summary: str, params: dict) -> dict:
        aid = uuid.uuid4().hex[:12]
        now = time.time()
        conn = self._connect()
        try:
            conn.execute(
                "INSERT INTO connector_actions (id, connector_id, action, label,"
                " summary, params, status, created_at, updated_at)"
                " VALUES (?,?,?,?,?,?,'pending',?,?)",
                (aid, connector_id, action, label, summary, json.dumps(params),
                 now, now),
            )
            conn.commit()
        finally:
            conn.close()
        return self.get_action(aid)

    def list_pending_actions(self) -> list[dict]:
        conn = self._connect()
        try:
            rows = conn.execute(
                "SELECT * FROM connector_actions WHERE status = 'pending'"
                " ORDER BY created_at").fetchall()
        finally:
            conn.close()
        return [dict(r) for r in rows]

    def get_action(self, aid: str) -> dict | None:
        conn = self._connect()
        try:
            row = conn.execute(
                "SELECT * FROM connector_actions WHERE id = ?", (aid,)).fetchone()
        finally:
            conn.close()
        if row is None:
            return None
        d = dict(row)
        d["params"] = json.loads(d["params"])
        return d

    def set_action_status(self, aid: str, status: str, result: str = "") -> dict | None:
        conn = self._connect()
        try:
            conn.execute(
                "UPDATE connector_actions SET status = ?, result = ?,"
                " updated_at = ? WHERE id = ?",
                (status, result[:8000], time.time(), aid))
            conn.commit()
        finally:
            conn.close()
        return self.get_action(aid)

    def recent_actions(self, limit: int = 20) -> list[dict]:
        conn = self._connect()
        try:
            rows = conn.execute(
                "SELECT * FROM connector_actions ORDER BY created_at DESC"
                " LIMIT ?", (limit,)).fetchall()
        finally:
            conn.close()
        out = []
        for r in rows:
            d = dict(r)
            d["params"] = json.loads(d["params"])
            out.append(d)
        return out
