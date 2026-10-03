"""Download the Laya checkpoint explicitly.

Run once after `pip install -r requirements-laya.txt`:

    python -m server.routing.preload

This keeps the ~421MB download out of the first conversation turn -
the router never downloads silently.
"""
from __future__ import annotations


def main() -> int:
    try:
        from laya import Router
    except ImportError:
        print("laya is not installed. Run: pip install -r requirements-laya.txt")
        return 1
    print("Downloading Laya checkpoint (~421MB, one time)...")
    Router(preload=True)
    print("Done. The fast router is ready.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
