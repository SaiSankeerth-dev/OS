"""Agent computer: isolated sandbox with command receipts + workspace files.

Adapted from OpenMuse apps/server/src/computer.ts (MIT, (c) 2026 OpenMuse
contributors). Rewritten for OS: Docker when the CLI is present (locked-down
container, OpenMuse-style flags), otherwise a local cwd-jailed subprocess
sandbox. Both modes share the receipt + workspace-file API.

Safety: the computer is the user's own sandbox (their machine / their
Docker), so commands run without an approval card — same as their terminal.
Paths are jailed to the workspace (/workspace in Docker, data/om-workspace
locally). Commands time out (30s), output is capped (128KB), env is scrubbed.
"""
from __future__ import annotations

import hashlib
import os
import shutil
import subprocess
import time
import uuid
from dataclasses import dataclass, field
from pathlib import Path, PurePosixPath

from .store import OmStore, jdumps, jloads, now

OUTPUT_LIMIT = 128 * 1024
FILE_LIMIT = 256 * 1024
COMMAND_TIMEOUT = 30
LEASE_SECONDS = 180

DOCKER_IMAGE = os.environ.get("OS_COMPUTER_IMAGE", "python:3.12-slim")

# Helper run inside the Docker container for file ops (stdin JSON -> stdout JSON).
_FILE_HELPER = r"""
import base64, json, os, sys
def fail(msg):
    print(json.dumps({"ok": False, "error": msg})); sys.exit(1)
try:
    req = json.load(sys.stdin)
except Exception:
    fail("bad request")
op = req.get("operation"); rel = req.get("path", "")
if "\x00" in rel or ".." in rel.split("/") or not rel.startswith("/workspace"):
    fail("path must stay inside /workspace")
if op == "list":
    try:
        entries = sorted(os.listdir(rel))
    except FileNotFoundError:
        fail("not found")
    out = []
    for e in entries:
        p = os.path.join(rel, e)
        out.append({"name": e, "dir": os.path.isdir(p),
                    "size": os.path.getsize(p) if os.path.isfile(p) else 0})
    print(json.dumps({"ok": True, "path": rel, "entries": out})); sys.exit(0)
if op == "mkdir":
    os.makedirs(rel, exist_ok=True)
    print(json.dumps({"ok": True, "path": rel})); sys.exit(0)
if op == "read":
    try:
        with open(rel, "rb") as f: data = f.read(%d)
    except FileNotFoundError:
        fail("not found")
    except IsADirectoryError:
        fail("is a directory")
    try:
        text = data.decode("utf-8")
    except UnicodeDecodeError:
        fail("not a text file")
    print(json.dumps({"ok": True, "path": rel, "text": text})); sys.exit(0)
if op == "write":
    text = req.get("text", "")
    if len(text.encode("utf-8")) > %d: fail("file too large")
    os.makedirs(os.path.dirname(rel) or "/workspace", exist_ok=True)
    with open(rel, "w", encoding="utf-8") as f: f.write(text)
    print(json.dumps({"ok": True, "path": rel})); sys.exit(0)
if op == "write_pdf":
    raw = base64.b64decode(req.get("base64", ""))
    if len(raw) > 10*1024*1024 or not raw.startswith(b"%%PDF-"): fail("need a PDF <= 10MB")
    os.makedirs(os.path.dirname(rel) or "/workspace", exist_ok=True)
    with open(rel, "wb") as f: f.write(raw)
    print(json.dumps({"ok": True, "path": rel})); sys.exit(0)
if op == "read_pdf":
    try:
        with open(rel, "rb") as f: raw = f.read(10*1024*1024+1)
    except FileNotFoundError:
        fail("not found")
    if len(raw) > 10*1024*1024 or not raw.startswith(b"%%PDF-"): fail("need a PDF <= 10MB")
    print(json.dumps({"ok": True, "path": rel,
                      "base64": base64.b64encode(raw).decode()})); sys.exit(0)
fail("unknown operation")
""" % (FILE_LIMIT, FILE_LIMIT)


class ComputerError(Exception):
    def __init__(self, message: str, status: int = 422):
        super().__init__(message)
        self.status = status


@dataclass
class RunResult:
    stdout: str = ""
    stderr: str = ""
    exit_code: int | None = None
    timed_out: bool = False
    truncated: bool = False


def _scrub_env() -> dict:
    env: dict[str, str] = {}
    for key in ("PATH", "HOME", "LANG", "SYSTEMROOT", "TMPDIR", "TEMP", "TMP"):
        if os.environ.get(key):
            env[key] = os.environ[key]
    env.setdefault("LANG", "C.UTF-8")
    return env


def _cap(text: str) -> tuple[str, bool]:
    data = text.encode("utf-8", "replace")
    if len(data) > OUTPUT_LIMIT:
        return data[:OUTPUT_LIMIT].decode("utf-8", "replace"), True
    return text, False


class ComputerService:
    """One computer per OS install; single-flight commands via a lease."""

    def __init__(self, store: OmStore,
                 workspace_dir: str | Path = "data/om-workspace") -> None:
        self.store = store
        self.workspace = Path(workspace_dir)
        self.workspace.mkdir(parents=True, exist_ok=True)
        self._lease: dict | None = None  # in-memory single-flight lease

    # -- mode / lifecycle ------------------------------------------------
    def docker_available(self) -> bool:
        return shutil.which("docker") is not None

    def mode(self) -> str:
        return "docker" if self.docker_available() else "local"

    def _container(self) -> str:
        return "os-computer"

    def _docker(self, args: list[str], inp: str | None = None,
                timeout: int = 15) -> RunResult:
        try:
            proc = subprocess.run(
                ["docker"] + args, input=inp, capture_output=True, text=True,
                timeout=timeout, env=_scrub_env(),
            )
        except FileNotFoundError:
            raise ComputerError("Docker CLI not found", 503)
        except subprocess.TimeoutExpired:
            return RunResult(stderr="docker timed out", timed_out=True)
        out, trunc1 = _cap(proc.stdout or "")
        err, trunc2 = _cap(proc.stderr or "")
        return RunResult(stdout=out, stderr=err, exit_code=proc.returncode,
                         truncated=trunc1 or trunc2)

    def _container_running(self) -> bool:
        r = self._docker(["ps", "--filter", f"name=^/{self._container()}$",
                          "--format", "{{.Names}}"], timeout=10)
        return self._container() in (r.stdout or "")

    def snapshot(self) -> dict:
        mode = self.mode()
        self._reconcile()
        commands = self.store.list("computer_commands", order="started_at DESC", limit=100)
        base = {
            "mode": mode,
            "workspacePath": "/workspace" if mode == "docker" else str(self.workspace),
            "network": "disabled" if mode == "docker" else "host",
            "commands": [self._receipt(c) for c in commands],
        }
        if mode == "docker":
            try:
                running = self._container_running()
            except ComputerError as e:
                return {**base, "status": "error", "message": str(e)}
            return {**base, "status": "running" if running else "stopped"}
        return {**base, "status": "running",
                "message": "Local sandbox (cwd-jailed, not container-isolated). "
                           "Install Docker for full isolation."}

    def start(self) -> dict:
        if self.mode() == "local":
            return self.snapshot()
        name = self._container()
        exists = self._docker(
            ["ps", "-a", "--filter", f"name=^/{name}$", "--format", "{{.Names}}"],
            timeout=10)
        if name not in (exists.stdout or ""):
            r = self._docker([
                "create", "--name", name,
                "--label", "dev.os.managed=computer-v1",
                "--user", "1000:1000", "--workdir", "/workspace",
                "--read-only", "--cap-drop", "ALL",
                "--security-opt", "no-new-privileges",
                "--network", "none", "--ipc", "private",
                "--memory", "512m", "--memory-swap", "512m",
                "--cpus", "1", "--pids-limit", "128",
                "--restart", "no",
                "--tmpfs", "/tmp:rw,nosuid,nodev,noexec,size=67108864,mode=1777",
                "--volume", f"{name}-workspace:/workspace",
                "--env", "HOME=/workspace", "--env", "LANG=C.UTF-8",
                "--entrypoint", "/usr/bin/sleep",
                DOCKER_IMAGE, "infinity",
            ], timeout=120)
            if r.exit_code != 0:
                raise ComputerError(
                    f"Could not create the computer container: {(r.stderr or '').strip()[:300]} "
                    f"(image: {DOCKER_IMAGE})", 503)
        r = self._docker(["start", name], timeout=15)
        if r.exit_code != 0 and "already started" not in (r.stderr or ""):
            raise ComputerError(f"Could not start the computer: {(r.stderr or '').strip()[:300]}", 503)
        return self.snapshot()

    def stop(self) -> dict:
        if self.mode() == "local":
            self._interrupt_running("Stopped by the user.")
            return self.snapshot()
        self._docker(["stop", "--time", "2", self._container()], timeout=15)
        self._interrupt_running("Stopped by the user.")
        return self.snapshot()

    # -- commands ---------------------------------------------------------
    def _reconcile(self) -> None:
        """Restart reconciliation: anything still 'running' with no live lease
        is marked interrupted — its outcome is unknown."""
        lease_live = self._lease and self._lease["expires_at"] > time.time()
        if lease_live:
            return
        for cmd in self.store.list("computer_commands", where="status = 'running'"):
            self.store.update("computer_commands", cmd["id"], {
                "status": "interrupted",
                "stderr": (cmd.get("stderr") or "")
                + "\nExecution was interrupted (restart?). Outcome unknown; "
                  "inspect the workspace before retrying.",
                "completed_at": now(),
            })

    def _interrupt_running(self, note: str) -> None:
        for cmd in self.store.list("computer_commands", where="status = 'running'"):
            self.store.update("computer_commands", cmd["id"], {
                "status": "interrupted",
                "stderr": (cmd.get("stderr") or "") + f"\n{note}",
                "completed_at": now(),
            })
        self._lease = None

    def _acquire(self) -> dict:
        if self._lease and self._lease["expires_at"] > time.time():
            raise ComputerError("Computer is busy. Wait for the current command.", 409)
        self._lease = {"token": uuid.uuid4().hex, "expires_at": time.time() + LEASE_SECONDS}
        return self._lease

    def _release(self) -> None:
        self._lease = None

    @staticmethod
    def _workspace_path_docker(path: str) -> str:
        if "\x00" in path or len(path) > 2048:
            raise ComputerError("Bad path", 422)
        norm = str(PurePosixPath(path))
        if norm != "/workspace" and not norm.startswith("/workspace/"):
            raise ComputerError("Choose an absolute path inside /workspace", 422)
        return norm

    def _workspace_path_local(self, path: str) -> Path:
        # Accept /workspace/... (docker-style) or relative paths; jail to workspace dir.
        p = path[10:] if path.startswith("/workspace") else path
        full = (self.workspace / p.lstrip("/")).resolve()
        if full != self.workspace.resolve() and self.workspace.resolve() not in full.parents:
            raise ComputerError("Choose a path inside the workspace", 422)
        return full

    def execute(self, command: str, cwd: str = "/workspace",
                idempotency_key: str | None = None) -> dict:
        command = (command or "").strip()
        if not command or len(command) > 16000:
            raise ComputerError("Command must be 1-16000 chars", 422)
        rid = (hashlib.sha256(f"computer-command:{idempotency_key}".encode()).hexdigest()[:12]
               if idempotency_key else uuid.uuid4().hex[:12])
        prev = self.store.get("computer_commands", rid)
        if prev:
            if prev["command"] != command:
                raise ComputerError("This operation ID already belongs to a different command", 409)
            return self._receipt(prev)
        lease = self._acquire()
        try:
            if self.mode() == "docker" and not self._container_running():
                raise ComputerError("Start the computer before running commands", 409)
            rec = {
                "id": rid, "command": command, "cwd": cwd, "status": "running",
                "stdout": "", "stderr": "", "exit_code": None, "truncated": 0,
                "started_at": now(), "completed_at": None,
            }
            self.store.insert("computer_commands", rec)
            result = self._run(command, cwd)
            patch = {
                "status": ("timed_out" if result.timed_out
                           else "succeeded" if result.exit_code == 0 else "failed"),
                "stdout": result.stdout, "stderr": result.stderr,
                "exit_code": result.exit_code,
                "truncated": 1 if result.truncated else 0,
                "completed_at": now(),
            }
            updated = self.store.update("computer_commands", rid, patch)
            return self._receipt(updated or {**rec, **patch})
        finally:
            if self._lease and self._lease["token"] == lease["token"]:
                self._release()

    def _run(self, command: str, cwd: str) -> RunResult:
        if self.mode() == "docker":
            dcwd = self._workspace_path_docker(cwd)
            return self._docker([
                "exec", "--user", "1000:1000", "--workdir", dcwd,
                self._container(), "/usr/bin/timeout", "--signal=TERM",
                "--kill-after=2s", f"{COMMAND_TIMEOUT}s",
                "/bin/bash", "--noprofile", "--norc", "-c", command,
            ], timeout=COMMAND_TIMEOUT + 10)
        lcwd = self._workspace_path_local(cwd)
        lcwd.mkdir(parents=True, exist_ok=True)
        shell = "/bin/bash" if Path("/bin/bash").exists() else "/bin/sh"
        env = _scrub_env()
        env["WORKSPACE"] = str(lcwd)  # $WORKSPACE always points at the real dir
        try:
            proc = subprocess.run(
                [shell, "--noprofile", "--norc", "-c", command] if "bash" in shell
                else [shell, "-c", command],
                cwd=str(lcwd), capture_output=True, text=True,
                timeout=COMMAND_TIMEOUT, env=env,
            )
        except subprocess.TimeoutExpired as e:
            out, t1 = _cap((e.stdout or b"").decode("utf-8", "replace") if isinstance(e.stdout, bytes) else (e.stdout or ""))
            return RunResult(stdout=out, stderr="command timed out", timed_out=True, truncated=t1)
        out, t1 = _cap(proc.stdout or "")
        err, t2 = _cap(proc.stderr or "")
        return RunResult(stdout=out, stderr=err, exit_code=proc.returncode,
                         truncated=t1 or t2)

    @staticmethod
    def _receipt(row: dict) -> dict:
        return {
            "id": row["id"], "command": row["command"], "cwd": row["cwd"],
            "status": row["status"], "stdout": row.get("stdout") or "",
            "stderr": row.get("stderr") or "",
            "exitCode": row.get("exit_code"), "truncated": bool(row.get("truncated")),
            "startedAt": row.get("started_at"), "completedAt": row.get("completed_at"),
        }

    # -- workspace files ---------------------------------------------------
    def list_files(self, path: str = "/workspace") -> dict:
        if self.mode() == "docker":
            if not self._container_running():
                raise ComputerError("Start the computer before using its files", 409)
            return self._docker_fileop("list", self._workspace_path_docker(path))
        target = self._workspace_path_local(path)
        if not target.exists():
            raise ComputerError("Not found", 404)
        if not target.is_dir():
            raise ComputerError("Not a directory", 422)
        entries = [{"name": e.name, "dir": e.is_dir(),
                    "size": e.stat().st_size if e.is_file() else 0}
                   for e in sorted(target.iterdir(), key=lambda e: e.name)]
        return {"path": path, "entries": entries}

    def read_file(self, path: str) -> dict:
        if self.mode() == "docker":
            if not self._container_running():
                raise ComputerError("Start the computer before using its files", 409)
            return self._docker_fileop("read", self._workspace_path_docker(path))
        target = self._workspace_path_local(path)
        if not target.is_file():
            raise ComputerError("Not found", 404)
        data = target.read_bytes()
        if len(data) > FILE_LIMIT:
            raise ComputerError("File too large to read here", 413)
        try:
            return {"path": path, "text": data.decode("utf-8")}
        except UnicodeDecodeError:
            raise ComputerError("Not a text file", 422)

    def write_file(self, path: str, text: str) -> dict:
        if len(text.encode("utf-8")) > FILE_LIMIT:
            raise ComputerError("Text files must be 256 KB or smaller", 413)
        if self.mode() == "docker":
            if not self._container_running():
                raise ComputerError("Start the computer before using its files", 409)
            return self._docker_fileop("write", self._workspace_path_docker(path), text=text)
        target = self._workspace_path_local(path)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(text, encoding="utf-8")
        return {"path": path}

    def mkdir(self, path: str) -> dict:
        if self.mode() == "docker":
            if not self._container_running():
                raise ComputerError("Start the computer before using its files", 409)
            return self._docker_fileop("mkdir", self._workspace_path_docker(path))
        target = self._workspace_path_local(path)
        target.mkdir(parents=True, exist_ok=True)
        return {"path": path}

    def _docker_fileop(self, operation: str, path: str,
                       text: str | None = None) -> dict:
        import base64 as _b64
        payload = jdumps({"operation": operation, "path": path, "text": text})
        # The helper reads its JSON request from a __payload__ global; we feed
        # the program base64-encoded so quoting stays safe through docker exec.
        helper = _FILE_HELPER.replace("req = json.load(sys.stdin)",
                                      "req = json.loads(__payload__)")
        prog = _b64.b64encode(helper.encode()).decode()
        runner = (
            "import base64,sys;"
            f"exec(base64.b64decode('{prog}').decode(),"
            "{'__name__':'__main__','__payload__':sys.stdin.read()})"
        )
        r = self._docker(
            ["exec", "-i", "--user", "1000:1000", self._container(),
             "python3", "-c", runner],
            inp=payload, timeout=15)
        if r.exit_code != 0 or r.timed_out:
            raise ComputerError("Computer file operation failed", 422)
        data = jloads((r.stdout or "").strip(), None)
        if not isinstance(data, dict) or not data.get("ok"):
            err = data.get("error") if isinstance(data, dict) else None
            raise ComputerError(err or "file operation failed", 422)
        data.pop("ok", None)
        return data

    def _docker_raw_fileop(self, payload: dict) -> dict:
        """Variant of _docker_fileop for operations carrying base64 payloads."""
        import base64 as _b64
        body = jdumps(payload)
        helper = _FILE_HELPER.replace("req = json.load(sys.stdin)",
                                      "req = json.loads(__payload__)")
        prog = _b64.b64encode(helper.encode()).decode()
        runner = (
            "import base64,sys;"
            f"exec(base64.b64decode('{prog}').decode(),"
            "{'__name__':'__main__','__payload__':sys.stdin.read()})"
        )
        r = self._docker(
            ["exec", "-i", "--user", "1000:1000", self._container(),
             "python3", "-c", runner],
            inp=body, timeout=20)
        data = jloads((r.stdout or "").strip(), None)
        if r.exit_code != 0 or not isinstance(data, dict) or not data.get("ok"):
            err = data.get("error") if isinstance(data, dict) else None
            raise ComputerError(err or "file operation failed", 422)
        data.pop("ok", None)
        return data

    # -- PDF import/export --------------------------------------------------
    def import_pdf(self, path: str, raw: bytes) -> dict:
        if len(raw) > 10 * 1024 * 1024 or not raw.startswith(b"%PDF-"):
            raise ComputerError("Choose a PDF of 10 MB or smaller", 422)
        if self.mode() == "docker":
            if not self._container_running():
                raise ComputerError("Start the computer before using its files", 409)
            import base64 as _b64
            self._docker_raw_fileop({
                "operation": "write_pdf",
                "path": self._workspace_path_docker(path),
                "base64": _b64.b64encode(raw).decode(),
            })
            return {"path": path}
        target = self._workspace_path_local(path)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(raw)
        return {"path": path}

    def export_pdf(self, path: str) -> tuple[str, bytes]:
        if self.mode() == "docker":
            if not self._container_running():
                raise ComputerError("Start the computer before using its files", 409)
            import base64 as _b64
            data = self._docker_raw_fileop({
                "operation": "read_pdf",
                "path": self._workspace_path_docker(path),
            })
            raw = _b64.b64decode(data["base64"])
            return Path(path).name, raw
        target = self._workspace_path_local(path)
        if not target.is_file():
            raise ComputerError("Not found", 404)
        raw = target.read_bytes()
        if len(raw) > 10 * 1024 * 1024 or not raw.startswith(b"%PDF-"):
            raise ComputerError("Not a PDF of 10 MB or smaller", 422)
        return target.name, raw


def get_computer(store: OmStore | None = None) -> ComputerService:
    return ComputerService(store or OmStore())
