"""Workspace Manager for OpenCode Worker.

Provides isolated workspace sandboxes so that code generation,
dependency installation, and edits never pollute or corrupt the primary system.
"""
from __future__ import annotations

import shutil
from pathlib import Path
from typing import Optional


class WorkspaceManager:
    def __init__(self, base_workspace_root: Path = Path("workspace/sandboxes")) -> None:
        self.root = base_workspace_root
        self.root.mkdir(parents=True, exist_ok=True)

    def prepare_workspace(
        self,
        task_id: str,
        source_repo: Optional[Path] = None,
    ) -> Path:
        """Creates an isolated directory for the task, optionally cloning/copying source files."""
        task_ws = self.root / task_id
        if task_ws.exists():
            shutil.rmtree(task_ws)
        task_ws.mkdir(parents=True, exist_ok=True)

        if source_repo and source_repo.exists() and source_repo.is_dir():
            # Copy source repo into sandbox ignoring git/venv to keep sandbox clean
            def ignore_patterns(path, names):
                return {n for n in names if n in (".git", ".venv", "__pycache__", ".pytest_cache", "node_modules")}

            shutil.copytree(source_repo, task_ws, dirs_exist_ok=True, ignore=ignore_patterns)

        return task_ws

    def cleanup_workspace(self, task_id: str) -> None:
        task_ws = self.root / task_id
        if task_ws.exists():
            shutil.rmtree(task_ws, ignore_errors=True)
