"""OS command-line interface.

Installed as the `os` console script (see pyproject.toml).
Subcommands:
    os start         text REPL with JARVIS
    os voice         voice mode (mic + speaker)
    os doctor        environment diagnostics
    os test          run the test suite
    os permissions   show skill permission table
    os allow|ask|deny <skill>
                     set a skill's permission
"""
from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent

__version__ = "0.1.0"


def cmd_start(args: argparse.Namespace) -> int:
    sys.argv = ["cli.py"] + args.passthrough
    from cli import main

    return main()


def cmd_voice(args: argparse.Namespace) -> int:
    sys.argv = ["voice_cli.py"] + args.passthrough
    from voice_cli import main

    return main()


def _check(label: str, ok: bool, detail: str = "") -> None:
    mark = "OK " if ok else "FAIL"
    print(f"[{mark}] {label}" + (f" — {detail}" if detail else ""))


def cmd_doctor(_args: argparse.Namespace) -> int:
    print(f"OS doctor v{__version__} (root: {ROOT})")
    failures = 0

    def check(label: str, ok: bool, detail: str = "") -> None:
        nonlocal failures
        _check(label, ok, detail)
        if not ok:
            failures += 1

    # Python
    check(
        f"Python {sys.version.split()[0]}",
        sys.version_info >= (3, 10),
        "need >= 3.10",
    )

    # Config loads
    try:
        sys.path.insert(0, str(ROOT))
        from config import load_config

        cfg = load_config()
        check("config/settings.yaml loads", True, f"model={cfg.llm.model}")
    except Exception as e:  # noqa: BLE001
        check("config/settings.yaml loads", False, f"{type(e).__name__}: {e}")
        cfg = None

    # Ollama reachable
    try:
        import httpx

        base = (cfg.llm.base_url if cfg else "http://localhost:11434").rstrip("/")
        r = httpx.get(f"{base}/api/tags", timeout=3.0)
        check("Ollama reachable", r.status_code == 200, base)
    except Exception as e:  # noqa: BLE001
        check("Ollama reachable", False, f"{type(e).__name__} (run: ollama serve)")

    # Voice deps (report-only: voice is optional on headless machines)
    for mod, label in [
        ("sounddevice", "sounddevice"),
        ("silero_vad", "silero-vad"),
        ("faster_whisper", "faster-whisper"),
    ]:
        try:
            __import__(mod)
            check(f"voice dep: {label}", True)
        except Exception as e:  # noqa: BLE001
            check(f"voice dep: {label}", False, type(e).__name__)

    # Skills
    skills = sorted(p.parent.name for p in ROOT.glob("skills/*/SKILL.md"))
    check("skills with SKILL.md", bool(skills), ", ".join(skills) or "none found")

    # Data dir writable (approvals audit log lives here)
    try:
        data = ROOT / "data"
        data.mkdir(exist_ok=True)
        probe = data / ".doctor_write_test"
        probe.write_text("ok")
        probe.unlink()
        check("data/ writable", True)
    except Exception as e:  # noqa: BLE001
        check("data/ writable", False, f"{type(e).__name__}: {e}")

    # State database health (Phase 2: tasks, events, approvals, sessions)
    try:
        from server.state import StateStore

        h = StateStore(ROOT / "data" / "os_state.db").health()
        detail = (
            f"{h['path']} ({h['size_bytes']} bytes): "
            + ", ".join(f"{k}={v}" for k, v in h["tables"].items())
        )
        check("state db integrity", h["ok"], detail)
    except Exception as e:  # noqa: BLE001
        check("state db integrity", False, f"{type(e).__name__}: {e}")

    # Fast router (Phase 3: Laya). Optional - the OS works without it.
    try:
        from server.routing import LayaRouter

        st = LayaRouter().status()
        if st["available"]:
            check("laya fast router", True, f"skills: {', '.join(st['skills'])}")
        elif st["laya_installed"] and not st["checkpoint_cached"]:
            check(
                "laya fast router",
                False,
                "installed but checkpoint not cached - run: "
                "pip install -r requirements-laya.txt && "
                "python -m server.routing.preload",
            )
        else:
            check(
                "laya fast router",
                False,
                "not installed (optional) - pip install -r requirements-laya.txt",
            )
    except Exception as e:  # noqa: BLE001
        check("laya fast router", False, f"{type(e).__name__}: {e}")

    # Supervisor (Phase 4: Pydantic AI). Core orchestration layer.
    try:
        from server.conversation.manager import _default_registry
        from server.supervisor import Supervisor

        st = Supervisor(_default_registry()).status()
        check(
            "supervisor",
            True,
            f"agent model={st['agent_model']}, tools={len(st['tools'])}, "
            f"stages={len(st['lifecycle_stages'])}",
        )
    except Exception as e:  # noqa: BLE001
        check("supervisor", False, f"{type(e).__name__}: {e}")

    # Skills (Phase 6: SKILL.md contracts). Planned skills are listed,
    # never loaded.
    try:
        from server.skills import SkillLoader

        loader = SkillLoader()
        infos = loader.discover()
        active = sorted(i.name for i in infos if i.status == "active")
        planned = sorted(i.name for i in infos if i.status != "active")
        detail = f"active: {', '.join(active) or 'none'}"
        if planned:
            detail += f" | planned: {', '.join(planned)}"
        check("skills", bool(active), detail)
    except Exception as e:  # noqa: BLE001
        check("skills", False, f"{type(e).__name__}: {e}")

    # Personality (Phase 7). Tone only - safety pipeline untouched.
    try:
        from server.personality import PERSONAS, PersonalityManager

        pm = PersonalityManager()
        check(
            "personality",
            True,
            f"current={pm.current_name} "
            f"(available: {', '.join(sorted(PERSONAS))})",
        )
    except Exception as e:  # noqa: BLE001
        check("personality", False, f"{type(e).__name__}: {e}")

    # MCP tool bus (Phase 8). Local stdio only; disabled by default.
    try:
        import mcp  # noqa: F401

        from config import load_config

        mcfg = load_config().mcp
        detail = f"sdk={mcp.__version__ if hasattr(mcp, '__version__') else 'ok'}"
        if mcfg.enabled:
            detail += f" | enabled, {len(mcfg.servers)} server(s): " + ", ".join(
                s.name for s in mcfg.servers
            )
        else:
            detail += " | disabled (default)"
        check("mcp", True, detail)
    except Exception as e:  # noqa: BLE001
        check("mcp", False, f"{type(e).__name__}: {e}")

    print(f"\ndoctor: {'all clear' if failures == 0 else f'{failures} problem(s) found'}")
    return 1 if failures else 0


def _cli_permission_manager():
    """Minimal stack for permission inspection/mutation (Phase 9)."""
    sys.path.insert(0, str(ROOT))
    from server.intent.registry import ToolRegistry
    from server.permissions import PermissionManager
    from server.supervisor import Supervisor

    sup = Supervisor(ToolRegistry())
    return PermissionManager(sup.permissions, sup.scope_guard)


def _print_permission_table(pm) -> None:
    print("skill: policy (* = changed from default)")
    for row in pm.table():
        marker = " *" if row["custom"] else ""
        print(f"  {row['skill']}: {row['policy']}{marker}")


def cmd_permissions(_args: argparse.Namespace) -> int:
    pm = _cli_permission_manager()
    _print_permission_table(pm)
    return 0


def _cmd_set_policy(args: argparse.Namespace, word: str) -> int:
    from server.permissions import WORD_POLICIES, POLICY_WORDS

    pm = _cli_permission_manager()
    skill = pm.resolve_skill(args.skill)
    if skill is None:
        print(f"unknown skill '{args.skill}'. Known: {', '.join(pm.skills())}")
        return 1
    policy = WORD_POLICIES[word]
    pm.set_skill_policy(skill, policy)
    print(f"{skill}: {POLICY_WORDS[policy]}")
    return 0


def cmd_allow(args: argparse.Namespace) -> int:
    return _cmd_set_policy(args, "allow")


def cmd_ask(args: argparse.Namespace) -> int:
    return _cmd_set_policy(args, "ask")


def cmd_deny(args: argparse.Namespace) -> int:
    return _cmd_set_policy(args, "deny")


def cmd_test(args: argparse.Namespace) -> int:
    cmd = [sys.executable, "-m", "pytest", "-q"] + args.passthrough
    print("$", " ".join(cmd))
    return subprocess.call(cmd, cwd=str(ROOT))


def build_parser() -> argparse.ArgumentParser:
    ap = argparse.ArgumentParser(
        prog="os",
        description="OS — local-first proactive personal AI operating system.",
    )
    ap.add_argument("--version", action="version", version=f"%(prog)s {__version__}")
    sub = ap.add_subparsers(dest="command", required=True)

    p_start = sub.add_parser("start", help="text REPL with JARVIS")
    p_start.add_argument("passthrough", nargs=argparse.REMAINDER, help="args for cli.py")
    p_start.set_defaults(func=cmd_start)

    p_voice = sub.add_parser("voice", help="voice mode (needs mic + speaker)")
    p_voice.add_argument("passthrough", nargs=argparse.REMAINDER, help="args for voice_cli.py")
    p_voice.set_defaults(func=cmd_voice)

    p_doctor = sub.add_parser("doctor", help="environment diagnostics")
    p_doctor.set_defaults(func=cmd_doctor)

    p_test = sub.add_parser("test", help="run the test suite")
    p_test.add_argument("passthrough", nargs=argparse.REMAINDER, help="args for pytest")
    p_test.set_defaults(func=cmd_test)

    p_perm = sub.add_parser("permissions", help="show skill permission table")
    p_perm.set_defaults(func=cmd_permissions)

    for name, func, help_text in [
        ("allow", cmd_allow, "always allow a skill's tools"),
        ("ask", cmd_ask, "ask before running a skill's tools"),
        ("deny", cmd_deny, "deny a skill's tools"),
    ]:
        p = sub.add_parser(name, help=help_text)
        p.add_argument("skill", help="skill name (e.g. calculator, linkedin)")
        p.set_defaults(func=func)

    return ap


def main() -> int:
    args = build_parser().parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
