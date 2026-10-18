"""Project Context, Artifacts, and Memory Manager for Computer-Control.

Grounds computer tasks in trusted repository context, separates untrusted web content,
stores execution artifacts (screenshots, downloads, transcripts), and enforces
revision safety with optimistic concurrency checks.
"""
from __future__ import annotations

import hashlib
import json
import logging
import os
import shutil
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

log = logging.getLogger("os.computer.context_memory")


@dataclass
class ContextFile:
    relative_path: str
    absolute_path: str
    content: str
    content_hash: str
    last_modified: float


@dataclass
class StoredArtifact:
    artifact_id: str
    task_id: str
    artifact_type: str  # screenshot, download, transcript, extracted_data
    filename: str
    file_path: str
    file_size_bytes: int
    created_at: float = field(default_factory=time.time)
    metadata: Dict[str, Any] = field(default_factory=dict)


class ComputerContextMemoryManager:
    """Manages trusted workspace context, untrusted content boundaries, and task artifacts."""

    def __init__(
        self,
        workspace_root: str = ".",
        artifacts_root: str = "data/computer_artifacts",
    ) -> None:
        self.workspace_root = Path(workspace_root).resolve()
        self.artifacts_root = Path(artifacts_root).resolve()
        self.artifacts_root.mkdir(parents=True, exist_ok=True)

    def _hash_text(self, text: str) -> str:
        return hashlib.sha256(text.encode("utf-8")).hexdigest()

    def sanitize_untrusted_web_content(self, raw_content: str, source_url: str) -> str:
        """Wrap untrusted scraped content with strict safety boundaries.

        Prevents prompt-injection attacks from malicious web pages overriding system policies.
        """
        escaped = raw_content.replace("```", "'''")
        return (
            f"--- BEGIN UNTRUSTED EXTERNAL WEB CONTENT [Source: {source_url}] ---\n"
            f"{escaped}\n"
            f"--- END UNTRUSTED EXTERNAL WEB CONTENT ---"
        )

    def read_workspace_file(self, rel_path: str) -> ContextFile:
        """Safely read a permitted workspace file, preventing directory traversal."""
        target = (self.workspace_root / rel_path).resolve()
        try:
            target.relative_to(self.workspace_root)
        except ValueError:
            raise PermissionError(f"Access denied: Path '{rel_path}' escapes workspace root.")

        if not target.exists() or not target.is_file():
            raise FileNotFoundError(f"Workspace file '{rel_path}' not found.")

        # Read content
        with open(target, "r", encoding="utf-8", errors="replace") as f:
            content = f.read()

        stat = target.stat()
        return ContextFile(
            relative_path=rel_path,
            absolute_path=str(target),
            content=content,
            content_hash=self._hash_text(content),
            last_modified=stat.st_mtime,
        )

    def write_workspace_file_revision_safe(
        self,
        rel_path: str,
        new_content: str,
        expected_base_hash: Optional[str] = None,
    ) -> ContextFile:
        """Write to a workspace file with optimistic concurrency / revision check.

        Fails if the file has been modified concurrently by user or another process.
        """
        target = (self.workspace_root / rel_path).resolve()
        try:
            target.relative_to(self.workspace_root)
        except ValueError:
            raise PermissionError(f"Access denied: Path '{rel_path}' escapes workspace root.")

        if target.exists() and expected_base_hash:
            with open(target, "r", encoding="utf-8", errors="replace") as f:
                current_text = f.read()
            curr_hash = self._hash_text(current_text)
            if curr_hash != expected_base_hash:
                raise ValueError(
                    f"Revision conflict on '{rel_path}': File was modified since read (expected {expected_base_hash[:8]}, got {curr_hash[:8]})."
                )

        target.parent.mkdir(parents=True, exist_ok=True)
        with open(target, "w", encoding="utf-8") as f:
            f.write(new_content)

        stat = target.stat()
        return ContextFile(
            relative_path=rel_path,
            absolute_path=str(target),
            content=new_content,
            content_hash=self._hash_text(new_content),
            last_modified=stat.st_mtime,
        )

    def save_artifact(
        self,
        task_id: str,
        artifact_type: str,
        filename: str,
        data: bytes | str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> StoredArtifact:
        """Persist an execution artifact (screenshot, download, transcript)."""
        task_dir = self.artifacts_root / task_id
        task_dir.mkdir(parents=True, exist_ok=True)

        target_file = task_dir / filename
        if isinstance(data, str):
            with open(target_file, "w", encoding="utf-8") as f:
                f.write(data)
        else:
            with open(target_file, "wb") as f:
                f.write(data)

        size = target_file.stat().st_size
        art_id = f"art-{int(time.time()*1000)}-{filename}"
        artifact = StoredArtifact(
            artifact_id=art_id,
            task_id=task_id,
            artifact_type=artifact_type,
            filename=filename,
            file_path=str(target_file),
            file_size_bytes=size,
            metadata=metadata or {},
        )
        # Append to manifest
        manifest_path = task_dir / "manifest.jsonl"
        with open(manifest_path, "a", encoding="utf-8") as f:
            f.write(json.dumps({
                "artifact_id": artifact.artifact_id,
                "task_id": artifact.task_id,
                "type": artifact.artifact_type,
                "filename": artifact.filename,
                "file_path": artifact.file_path,
                "size_bytes": artifact.file_size_bytes,
                "created_at": artifact.created_at,
                "metadata": artifact.metadata,
            }) + "\n")

        log.info(f"Saved artifact '{filename}' ({size} bytes) for task '{task_id}'.")
        return artifact

    def list_task_artifacts(self, task_id: str) -> List[Dict[str, Any]]:
        """List all artifacts generated during a specific task."""
        manifest_path = self.artifacts_root / task_id / "manifest.jsonl"
        if not manifest_path.exists():
            return []
        results = []
        with open(manifest_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    try:
                        results.append(json.loads(line))
                    except Exception:
                        pass
        return results


_GLOBAL_CONTEXT_MEMORY: Optional[ComputerContextMemoryManager] = None


def get_computer_context_memory() -> ComputerContextMemoryManager:
    global _GLOBAL_CONTEXT_MEMORY
    if _GLOBAL_CONTEXT_MEMORY is None:
        _GLOBAL_CONTEXT_MEMORY = ComputerContextMemoryManager()
    return _GLOBAL_CONTEXT_MEMORY
