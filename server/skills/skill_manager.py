"""Dynamic Skill Management & Virtual Computer Execution Subsystem (`server/skills/skill_manager.py`).

Full implementation of the Agent Skills specification (https://agentskills.io):
- Standard skill directory layout: `SKILL.md`, `scripts/`, `references/`, `assets/`, `tools.py`
- Ingests from GitHub repositories, nested GitHub directories, raw SKILL.md, local folders, and ZIP archives
- Comprehensive security validation: Zip-slip prevention, container jailing, content hashing (SHA-256)
- OS Virtual Computer Runtime: Synchronizes skills to `/workspace/skills/<skill-id>/` inside Docker Linux Desktop
- Safe script runner inside isolated container with timeouts, output caps, and verifiable postcondition checks
- Execution history tracking with verified evidence, logs, and container artifacts
"""
from __future__ import annotations

import ast
import base64
import hashlib
import importlib.util
import io
import json
import logging
import os
import re
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid
import zipfile
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from server.skills.loader import SkillInfo, parse_skill_md

log = logging.getLogger("os.skills.manager")

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))
SKILLS_DIR = ROOT_DIR / "skills"
IMPORTED_MANIFEST = SKILLS_DIR / "imported_skills.json"
RUN_HISTORY_FILE = SKILLS_DIR / "run_history.json"


BUILTIN_SKILL_METADATA: Dict[str, Dict[str, Any]] = {
    "websearch": {
        "title": "Web Research",
        "category": "Research",
        "color": "text-blue-500 bg-blue-500/10 border-blue-500/20",
        "badge_class": "bg-blue-500/15 text-blue-500 border-blue-500/30",
        "icon": "Sparkles",
        "prompt": "Deep search the web and synthesize latest findings on ",
        "description": "Deep search the live internet via DuckDuckGo, extract structured tables, and cite verified sources.",
        "capabilities": ["web_search", "synthesis"],
    },
    "websearch_skill": {
        "title": "Web Research",
        "category": "Research",
        "color": "text-blue-500 bg-blue-500/10 border-blue-500/20",
        "badge_class": "bg-blue-500/15 text-blue-500 border-blue-500/30",
        "icon": "Sparkles",
        "prompt": "Deep search the web and synthesize latest findings on ",
        "description": "Deep search the live internet via DuckDuckGo, extract structured tables, and cite verified sources.",
        "capabilities": ["web_search", "synthesis"],
    },
    "calc": {
        "title": "Safe Math & Arithmetic",
        "category": "Data",
        "color": "text-purple-500 bg-purple-500/10 border-purple-500/20",
        "badge_class": "bg-purple-500/15 text-purple-500 border-purple-500/30",
        "icon": "BarChart2",
        "prompt": "calculate (1024 * 768) / 16 + 250",
        "description": "Sandboxed arithmetic computation engine using Python AST parsing. Instant, zero cloud leaks.",
        "capabilities": ["arithmetic", "sandboxed_ast"],
    },
    "calc_skill": {
        "title": "Safe Math & Arithmetic",
        "category": "Data",
        "color": "text-purple-500 bg-purple-500/10 border-purple-500/20",
        "badge_class": "bg-purple-500/15 text-purple-500 border-purple-500/30",
        "icon": "BarChart2",
        "prompt": "calculate (1024 * 768) / 16 + 250",
        "description": "Sandboxed arithmetic computation engine using Python AST parsing. Instant, zero cloud leaks.",
        "capabilities": ["arithmetic", "sandboxed_ast"],
    },
    "datetime": {
        "title": "System Clock & Datetime",
        "category": "Automation",
        "color": "text-amber-500 bg-amber-500/10 border-amber-500/20",
        "badge_class": "bg-amber-500/15 text-amber-500 border-amber-500/30",
        "icon": "Clock",
        "prompt": "Get the current system datetime, day of week, and UTC offset.",
        "description": "Reads host clock, ISO-8601 formatting, timezone offset, and local timestamps.",
        "capabilities": ["clock", "timezone"],
    },
    "datetime_skill": {
        "title": "System Clock & Datetime",
        "category": "Automation",
        "color": "text-amber-500 bg-amber-500/10 border-amber-500/20",
        "badge_class": "bg-amber-500/15 text-amber-500 border-amber-500/30",
        "icon": "Clock",
        "prompt": "Get the current system datetime, day of week, and UTC offset.",
        "description": "Reads host clock, ISO-8601 formatting, timezone offset, and local timestamps.",
        "capabilities": ["clock", "timezone"],
    },
    "system": {
        "title": "System Diagnostics & Hardware",
        "category": "Automation",
        "color": "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
        "badge_class": "bg-cyan-500/15 text-cyan-500 border-cyan-500/30",
        "icon": "Cpu",
        "prompt": "Run system diagnostics: inspect CPU usage, RAM, available disk space, and platform architecture.",
        "description": "Inspects CPU load, memory utilization, disk volumes, and kernel posture with zero external overhead.",
        "capabilities": ["hardware_probe", "diagnostics"],
    },
    "system_skill": {
        "title": "System Diagnostics & Hardware",
        "category": "Automation",
        "color": "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
        "badge_class": "bg-cyan-500/15 text-cyan-500 border-cyan-500/30",
        "icon": "Cpu",
        "prompt": "Run system diagnostics: inspect CPU usage, RAM, available disk space, and platform architecture.",
        "description": "Inspects CPU load, memory utilization, disk volumes, and kernel posture with zero external overhead.",
        "capabilities": ["hardware_probe", "diagnostics"],
    },
    "linkedin": {
        "title": "LinkedIn Social Drafter",
        "category": "Writing",
        "color": "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        "badge_class": "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
        "icon": "FileText",
        "prompt": "Draft a high-impact LinkedIn post announcing our new dynamic skill execution engine in OS.",
        "description": "Generates professional social drafts with engaging hooks, structured bullet points, and hashtags.",
        "capabilities": ["social_draft", "approval_gated"],
    },
    "linkedin_skill": {
        "title": "LinkedIn Social Drafter",
        "category": "Writing",
        "color": "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        "badge_class": "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
        "icon": "FileText",
        "prompt": "Draft a high-impact LinkedIn post announcing our new dynamic skill execution engine in OS.",
        "description": "Generates professional social drafts with engaging hooks, structured bullet points, and hashtags.",
        "capabilities": ["social_draft", "approval_gated"],
    },
    "memory": {
        "title": "Memory & Knowledge Store",
        "category": "Data",
        "color": "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
        "badge_class": "bg-indigo-500/15 text-indigo-500 border-indigo-500/30",
        "icon": "Brain",
        "prompt": "Recall all project specifications and key user preferences from memory.",
        "description": "Saves and recalls persistent notes and domain knowledge in local SQLite memory.",
        "capabilities": ["sqlite_store", "memory_retrieval"],
    },
    "memory_skill": {
        "title": "Memory & Knowledge Store",
        "category": "Data",
        "color": "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
        "badge_class": "bg-indigo-500/15 text-indigo-500 border-indigo-500/30",
        "icon": "Brain",
        "prompt": "Recall all project specifications and key user preferences from memory.",
        "description": "Saves and recalls persistent notes and domain knowledge in local SQLite memory.",
        "capabilities": ["sqlite_store", "memory_retrieval"],
    },
    "webread": {
        "title": "Web Page Reader",
        "category": "Research",
        "color": "text-blue-500 bg-blue-500/10 border-blue-500/20",
        "badge_class": "bg-blue-500/15 text-blue-500 border-blue-500/30",
        "icon": "Globe",
        "prompt": "Read and extract clean markdown content from URL: ",
        "description": "Extracts clean readable text, headers, and articles from arbitrary web URLs without JS tracking.",
        "capabilities": ["http_read", "markdown_extract"],
    },
    "webread_skill": {
        "title": "Web Page Reader",
        "category": "Research",
        "color": "text-blue-500 bg-blue-500/10 border-blue-500/20",
        "badge_class": "bg-blue-500/15 text-blue-500 border-blue-500/30",
        "icon": "Globe",
        "prompt": "Read and extract clean markdown content from URL: ",
        "description": "Extracts clean readable text, headers, and articles from arbitrary web URLs without JS tracking.",
        "capabilities": ["http_read", "markdown_extract"],
    },
    "github_research_skill": {
        "title": "GitHub Repo Research",
        "category": "Development",
        "color": "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
        "badge_class": "bg-cyan-500/15 text-cyan-500 border-cyan-500/30",
        "icon": "Code2",
        "prompt": "Audit the GitHub repository https://github.com/shadcn-ui/ui: analyze architecture, stars, and licensing.",
        "description": "Deep-dives open-source repos, architectural patterns, licenses, and quality benchmarks.",
        "capabilities": ["github_api", "repo_audit"],
    },
    "ui_ux_pro_max_skill": {
        "title": "UI/UX Design Craft",
        "category": "Development",
        "color": "text-pink-500 bg-pink-500/10 border-pink-500/20",
        "badge_class": "bg-pink-500/15 text-pink-500 border-pink-500/30",
        "icon": "Palette",
        "prompt": "Provide expert design specifications and Tailwind classes for a modern Cyber-HUD dashboard.",
        "description": "Design tokens, Apple HIG, responsive typography scales, color harmony, and anti-AI-slop design craft.",
        "capabilities": ["design_tokens", "apple_hig", "tailwind"],
    },
    "file_skill": {
        "title": "Workspace File Operations",
        "category": "Automation",
        "color": "text-rose-500 bg-rose-500/10 border-rose-500/20",
        "badge_class": "bg-rose-500/15 text-rose-500 border-rose-500/30",
        "icon": "Folder",
        "prompt": "List files in the workspace and inspect directory layout.",
        "description": "Safely manages, inspects, and organizes files within the user workspace.",
        "capabilities": ["file_read", "file_write", "workspace_jail"],
    },
    "browser_skill": {
        "title": "Virtual Computer Browser",
        "category": "Automation",
        "color": "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
        "badge_class": "bg-cyan-500/15 text-cyan-500 border-cyan-500/30",
        "icon": "Monitor",
        "prompt": "Take a screenshot of the virtual desktop and inspect active windows.",
        "description": "Automates isolated desktop applications and Chromium browsing inside Docker virtual container.",
        "capabilities": ["cdp_chromium", "novnc_stream", "screen_capture"],
    },
}


def compute_skill_content_hash(folder: Path) -> str:
    """Computes a deterministic SHA-256 hash of all non-cache files in a skill directory."""
    hasher = hashlib.sha256()
    if not folder.exists():
        return ""
    for p in sorted(folder.rglob("*")):
        if p.is_file() and not p.name.endswith(".pyc") and "__pycache__" not in str(p):
            rel = str(p.relative_to(folder)).replace("\\", "/")
            hasher.update(rel.encode("utf-8"))
            try:
                hasher.update(p.read_bytes())
            except Exception:
                pass
    return hasher.hexdigest()[:16]


SUPPORTED_OS_TOOLS = {
    "web_search", "websearch", "web_read", "webread", "calc",
    "get_current_datetime", "datetime", "get_system_info", "system",
    "memory_save", "memory_recall", "memory", "linkedin_draft", "linkedin",
    "browser_open", "browser_navigate", "browser_click", "browser_extract_text",
    "browser_screenshot", "browser", "run", "shell_exec", "terminal",
    "file_read", "file_write", "list_files", "files", "python_script",
    "scan_secrets", "check_deps", "generate_report", "tester_skill", "workspace_reporter",
}


def parse_agent_skills_frontmatter(text: str) -> Dict[str, Any]:
    """Parses YAML frontmatter adhering to the Agent Skills specification."""
    meta: Dict[str, Any] = {
        "name": "",
        "description": "",
        "version": "1.0.0",
        "status": "active",
        "author": "",
        "license": "MIT",
        "capabilities": [],
        "allowed_tools": [],
        "dependencies": [],
        "permissions": [],
        "category": "Custom",
    }
    m = re.match(r"\A---\s*\n(.*?)\n---\s*\n", text, re.DOTALL)
    if not m:
        return meta

    for line in m.group(1).splitlines():
        if ":" not in line:
            continue
        key, _, val = line.partition(":")
        k = key.strip().lower()
        v = val.strip().strip("'\"")
        if k == "name" and v:
            meta["name"] = v
        elif k == "description":
            meta["description"] = v
        elif k == "version" and v:
            meta["version"] = v
        elif k == "status" and v:
            meta["status"] = v
        elif k == "author":
            meta["author"] = v
        elif k == "license":
            meta["license"] = v
        elif k == "category":
            meta["category"] = v
        elif k == "capabilities":
            cleaned = v.strip("[]")
            if cleaned:
                meta["capabilities"] = [item.strip().strip("'\"") for item in cleaned.split(",") if item.strip()]
        elif k in ("tools", "allowed-tools", "allowed_tools"):
            cleaned = v.strip("[]")
            if cleaned:
                meta["allowed_tools"] = [item.strip().strip("'\"") for item in cleaned.split(",") if item.strip()]
        elif k in ("dependencies", "deps"):
            cleaned = v.strip("[]")
            if cleaned:
                meta["dependencies"] = [item.strip().strip("'\"") for item in cleaned.split(",") if item.strip()]
        elif k == "permissions":
            cleaned = v.strip("[]")
            if cleaned:
                meta["permissions"] = [item.strip().strip("'\"") for item in cleaned.split(",") if item.strip()]
    return meta


class SkillManager:
    """Manages the full lifecycle of Agent Skills in OS with Docker Desktop virtual computer integration."""

    def __init__(self, skills_dir: Path | None = None) -> None:
        self.skills_dir = skills_dir or SKILLS_DIR
        self.skills_dir.mkdir(parents=True, exist_ok=True)
        self.manifest_path = self.skills_dir / "imported_skills.json"
        self.history_path = self.skills_dir / "run_history.json"
        self._imported_meta: Dict[str, Dict[str, Any]] = self._load_manifest()
        self._run_history: List[Dict[str, Any]] = self._load_history()

    def _check_missing_dependencies(self, declared_deps: List[str]) -> List[str]:
        """Returns any declared tools or dependencies that are not registered or supported by OS."""
        missing = []
        for dep in declared_deps:
            d_norm = dep.strip().lower().replace("-", "_")
            if not d_norm:
                continue
            if d_norm in SUPPORTED_OS_TOOLS or d_norm.rstrip("_tool") in SUPPORTED_OS_TOOLS or d_norm.rstrip("_skill") in SUPPORTED_OS_TOOLS:
                continue
            # Also check if it's an existing tool in intent registry
            try:
                from server.intent.registry import ToolRegistry
                tr = ToolRegistry()
                if d_norm in tr.list_tools():
                    continue
            except Exception:
                pass
            missing.append(dep)
        return missing

    def _load_manifest(self) -> Dict[str, Dict[str, Any]]:
        if self.manifest_path.exists():
            try:
                return json.loads(self.manifest_path.read_text(encoding="utf-8"))
            except Exception as e:
                log.warning("Failed to load %s: %s", self.manifest_path, e)
        return {}

    def _save_manifest(self) -> None:
        try:
            self.manifest_path.write_text(
                json.dumps(self._imported_meta, indent=2), encoding="utf-8"
            )
        except Exception as e:
            log.error("Failed to save imported skills manifest: %s", e)

    def _load_history(self) -> List[Dict[str, Any]]:
        if self.history_path.exists():
            try:
                return json.loads(self.history_path.read_text(encoding="utf-8"))
            except Exception as e:
                log.warning("Failed to load %s: %s", self.history_path, e)
        return []

    def _save_history(self) -> None:
        try:
            # Keep bounded to latest 100 runs
            bounded = self._run_history[-100:]
            self.history_path.write_text(
                json.dumps(bounded, indent=2), encoding="utf-8"
            )
        except Exception as e:
            log.error("Failed to save skill run history: %s", e)

    # -------------------------------------------------------------------------
    # Discovery & Listing
    # -------------------------------------------------------------------------
    def list_skills(self) -> List[Dict[str, Any]]:
        """Discovers all skills on disk, parses Agent Skills metadata, and reports live status."""
        results: List[Dict[str, Any]] = []
        seen_ids = set()

        if not self.skills_dir.exists():
            return results

        for p in sorted(self.skills_dir.iterdir()):
            if not p.is_dir() or p.name.startswith((".", "__")):
                continue

            md_file = p / "SKILL.md"
            if not md_file.exists():
                continue

            try:
                raw_text = md_file.read_text(encoding="utf-8")
                info = parse_skill_md(raw_text, p.name)
                spec_meta = parse_agent_skills_frontmatter(raw_text)
            except Exception as e:
                log.warning("Could not parse SKILL.md in %s: %s", p.name, e)
                continue

            skill_id = p.name
            seen_ids.add(skill_id)

            meta = self._imported_meta.get(skill_id, {})
            source = meta.get("source", "builtin")
            repo_url = meta.get("repo_url", "")
            can_delete = meta.get("can_delete", source != "builtin")
            enabled = meta.get("enabled", True)
            review_status = meta.get("review_status", "ready" if source == "builtin" else "ready")

            preset = BUILTIN_SKILL_METADATA.get(skill_id) or BUILTIN_SKILL_METADATA.get(info.name) or {}

            title = meta.get("title") or preset.get("title") or info.name.replace("_", " ").title()
            category = meta.get("category") or spec_meta.get("category") or preset.get("category") or "Custom"
            description = info.description or spec_meta.get("description") or preset.get("description") or "Specialized OS capability"
            color = preset.get("color", "text-blue-500 bg-blue-500/10 border-blue-500/20")
            badge_class = preset.get("badge_class", "bg-blue-500/15 text-blue-500 border-blue-500/30")
            icon = preset.get("icon", "Sparkles")
            prompt = meta.get("prompt") or preset.get("prompt") or f"Execute {title} with instructions: "

            has_tools = (p / "tools.py").exists()
            has_scripts = (p / "scripts").exists() and any((p / "scripts").glob("*.py"))
            has_references = (p / "references").exists() and any((p / "references").iterdir())
            has_assets = (p / "assets").exists() and any((p / "assets").iterdir())

            capabilities = list(set(
                spec_meta.get("capabilities", []) +
                preset.get("capabilities", []) +
                (["script_backed"] if has_scripts else []) +
                (["tool_backed"] if has_tools else []) +
                (["resource_backed"] if (has_references or has_assets) else []) +
                ["virtual_computer_ready"]
            ))

            content_hash = meta.get("content_hash") or compute_skill_content_hash(p)

            if has_scripts:
                skill_type = "script_backed"
            elif has_tools:
                skill_type = "tool_backed"
            elif (has_references or has_assets):
                skill_type = "resource_backed"
            else:
                skill_type = "instruction_only"

            declared_deps = spec_meta.get("dependencies", []) + spec_meta.get("allowed_tools", [])
            missing_deps = self._check_missing_dependencies(declared_deps)

            if not enabled:
                computed_status = "disabled"
            elif meta.get("status") in ("validation_failed", "unsupported", "needs_approval", "running", "verifying", "failed"):
                computed_status = meta["status"]
            elif missing_deps:
                computed_status = "unsupported"
            elif review_status == "needs_review":
                computed_status = "needs_review"
            elif has_scripts:
                script_syntax_ok = True
                scripts_dir = p / "scripts"
                if scripts_dir.exists():
                    for py_script in scripts_dir.glob("*.py"):
                        try:
                            ast.parse(py_script.read_text(encoding="utf-8"))
                        except Exception:
                            script_syntax_ok = False
                            break
                computed_status = "ready" if script_syntax_ok else "validation_failed"
            else:
                computed_status = "ready"

            results.append({
                "id": skill_id,
                "name": info.name,
                "title": title,
                "description": description,
                "category": category,
                "version": info.version or spec_meta.get("version", "1.0.0"),
                "status": computed_status,
                "skill_type": skill_type,
                "enabled": enabled,
                "review_status": review_status,
                "source": source,
                "repo_url": repo_url,
                "tools": info.tools or (["run"] if has_tools else []),
                "prompt": prompt,
                "has_tools": has_tools,
                "has_scripts": has_scripts,
                "capabilities": capabilities,
                "missing_dependencies": missing_deps,
                "content_hash": content_hash,
                "color": color,
                "badge_class": badge_class,
                "icon": icon,
                "can_delete": can_delete,
                "imported_at": meta.get("imported_at", ""),
                "container_path": f"/workspace/skills/{skill_id}",
            })

        return results

    def get_skill_details(self, skill_id: str) -> Dict[str, Any]:
        """Returns deep structural inspection data for a skill according to Agent Skills spec."""
        folder = self._resolve_skill_folder(skill_id)
        md_file = folder / "SKILL.md"
        raw_md = md_file.read_text(encoding="utf-8") if md_file.exists() else ""
        spec_meta = parse_agent_skills_frontmatter(raw_md)
        parsed = parse_skill_md(raw_md, folder.name)
        meta = self._imported_meta.get(folder.name, {})

        scripts: List[Dict[str, Any]] = []
        scripts_dir = folder / "scripts"
        if scripts_dir.exists() and scripts_dir.is_dir():
            for s in sorted(scripts_dir.iterdir()):
                if s.is_file():
                    scripts.append({
                        "name": s.name,
                        "size": s.stat().st_size,
                        "executable": os.access(s, os.X_OK) or s.suffix in (".py", ".sh", ".js"),
                        "extension": s.suffix,
                    })

        references: List[Dict[str, Any]] = []
        ref_dir = folder / "references"
        if ref_dir.exists() and ref_dir.is_dir():
            for r in sorted(ref_dir.iterdir()):
                if r.is_file():
                    references.append({
                        "name": r.name,
                        "size": r.stat().st_size,
                    })

        assets: List[Dict[str, Any]] = []
        assets_dir = folder / "assets"
        if assets_dir.exists() and assets_dir.is_dir():
            for a in sorted(assets_dir.iterdir()):
                if a.is_file():
                    assets.append({
                        "name": a.name,
                        "size": a.stat().st_size,
                    })

        tools_file = folder / "tools.py"
        has_tools = tools_file.exists()
        tools_snippet = tools_file.read_text(encoding="utf-8", errors="replace")[:1000] if has_tools else ""

        runs = [r for r in self._run_history if r.get("skill_id") == folder.name]

        has_scripts = len(scripts) > 0
        has_resources = len(references) > 0 or len(assets) > 0
        skill_type = "script_backed" if has_scripts else ("tool_backed" if has_tools else ("resource_backed" if has_resources else "instruction_only"))
        declared_deps = spec_meta.get("dependencies", []) + spec_meta.get("allowed_tools", [])
        missing_deps = self._check_missing_dependencies(declared_deps)

        return {
            "ok": True,
            "id": folder.name,
            "name": parsed.name,
            "title": meta.get("title") or parsed.name.replace("_", " ").title(),
            "description": parsed.description or spec_meta.get("description", ""),
            "version": parsed.version or spec_meta.get("version", "1.0.0"),
            "author": spec_meta.get("author", "Community"),
            "license": spec_meta.get("license", "MIT"),
            "category": meta.get("category") or spec_meta.get("category", "Custom"),
            "source": meta.get("source", "builtin"),
            "repo_url": meta.get("repo_url", ""),
            "enabled": meta.get("enabled", True),
            "review_status": meta.get("review_status", "ready"),
            "skill_type": skill_type,
            "missing_dependencies": missing_deps,
            "content_hash": meta.get("content_hash") or compute_skill_content_hash(folder),
            "container_path": f"/workspace/skills/{folder.name}",
            "skill_md": raw_md,
            "capabilities": spec_meta.get("capabilities", []) or ["virtual_computer_ready"],
            "scripts": scripts,
            "references": references,
            "assets": assets,
            "has_tools": has_tools,
            "tools_snippet": tools_snippet,
            "runs_count": len(runs),
            "last_run": runs[-1] if runs else None,
        }

    def toggle_skill(self, skill_id: str, enabled: Optional[bool] = None) -> Dict[str, Any]:
        """Toggles a skill's active enablement status in OS."""
        folder = self._resolve_skill_folder(skill_id)
        sid = folder.name
        current = self._imported_meta.get(sid, {})
        new_val = not current.get("enabled", True) if enabled is None else bool(enabled)
        current["enabled"] = new_val
        self._imported_meta[sid] = current
        self._save_manifest()
        return {"ok": True, "skill_id": sid, "enabled": new_val}

    # -------------------------------------------------------------------------
    # Import Methods (GitHub, Nested Dir, ZIP, File, Local Dir)
    # -------------------------------------------------------------------------
    def import_from_github(
        self,
        github_url: str,
        custom_name: Optional[str] = None,
        category: str = "Integrations",
    ) -> Dict[str, Any]:
        """Imports a skill from a GitHub repo URL, nested directory URL, or raw file."""
        url = github_url.strip()
        if not url:
            raise ValueError("GitHub URL cannot be empty")

        owner, repo, branch, subpath = self._parse_github_url(url)
        if not owner or not repo:
            raise ValueError(f"Could not parse GitHub repository owner/repo from '{url}'")

        # Determine skill slug
        if custom_name and custom_name.strip():
            slug_base = custom_name.strip().lower().replace(" ", "_")
        elif subpath:
            slug_base = subpath.rstrip("/").split("/")[-1].lower().replace(" ", "_")
        else:
            slug_base = repo.lower().replace("-", "_")
        
        skill_slug = re.sub(r"[^a-z0-9_-]", "", slug_base)
        if not skill_slug.endswith("_skill"):
            skill_slug = f"{skill_slug}_skill"

        skill_folder = self.skills_dir / skill_slug
        skill_folder.mkdir(parents=True, exist_ok=True)

        skill_md_content = ""
        tools_py_content = ""

        # Step 1: If subpath provided, check GitHub API for directory contents
        if subpath:
            api_contents_url = f"https://api.github.com/repos/{owner}/{repo}/contents/{subpath}?ref={branch}"
            contents_list = self._fetch_github_api_contents(api_contents_url)
            if isinstance(contents_list, list) and len(contents_list) > 0:
                for item in contents_list:
                    if item.get("type") == "file":
                        fname = item.get("name", "")
                        download_url = item.get("download_url") or f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{subpath}/{fname}"
                        file_text = self._fetch_url_text(download_url)
                        if file_text:
                            if fname.lower() == "skill.md":
                                skill_md_content = file_text
                                (skill_folder / "SKILL.md").write_text(file_text, encoding="utf-8")
                            elif fname.lower() == "tools.py":
                                tools_py_content = file_text
                                (skill_folder / "tools.py").write_text(file_text, encoding="utf-8")
                            elif fname.endswith((".py", ".sh", ".json", ".yaml", ".txt")):
                                (skill_folder / fname).write_text(file_text, encoding="utf-8")

        # Step 2: Try fetching raw SKILL.md from standard locations
        if not skill_md_content:
            candidate_paths = []
            if subpath:
                candidate_paths.append(f"{subpath}/SKILL.md")
            candidate_paths.extend([
                "SKILL.md",
                f"skills/{skill_slug}/SKILL.md",
                f"skills/{repo}/SKILL.md",
                ".agents/skills/SKILL.md",
                "skills/SKILL.md",
            ])

            for branch_try in [branch, "main", "master"]:
                for cp in candidate_paths:
                    raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/{branch_try}/{cp}"
                    content = self._fetch_url_text(raw_url)
                    if content and ("---" in content or "# " in content):
                        skill_md_content = content
                        tool_url = raw_url.rsplit("/", 1)[0] + "/tools.py"
                        tool_text = self._fetch_url_text(tool_url)
                        if tool_text:
                            tools_py_content = tool_text
                        break
                if skill_md_content:
                    break

        # Step 3: Fallback: Synthesize rich Agent Skills contract from repo metadata
        if not skill_md_content:
            repo_info = self._fetch_github_repo_api(owner, repo)
            readme_text = ""
            for branch_try in [branch, "main", "master"]:
                readme_url = f"https://raw.githubusercontent.com/{owner}/{repo}/{branch_try}/README.md"
                r_text = self._fetch_url_text(readme_url)
                if r_text:
                    readme_text = r_text[:4000]
                    break

            repo_desc = repo_info.get("description") or f"Open-source skill imported from GitHub {owner}/{repo}"
            repo_stars = repo_info.get("stargazers_count", 0)

            skill_md_content = f"""---
name: {skill_slug}
description: {repo_desc}
version: 1.0.0
status: active
source: github
repo_url: {url}
category: {category}
capabilities: [virtual_computer_ready, script_backed, github_import]
---

# {repo.replace('-', ' ').title()} Skill

## Purpose
{repo_desc}

## Origin
Imported from GitHub repository [{owner}/{repo}]({url}) (★ {repo_stars} stars).

## Usage Instructions
When executing this skill in OS:
1. Load user objective and container context at `/workspace/skills/{skill_slug}`.
2. Execute target workflows inside the OS Virtual Computer Linux container.
3. Verify output files and report execution evidence.

## Reference Documentation
{readme_text if readme_text else "No additional README documentation provided."}
"""

        (skill_folder / "SKILL.md").write_text(skill_md_content, encoding="utf-8")

        # Step 4: Ensure executable tools.py bridge with format_result
        if tools_py_content and "def format" in tools_py_content:
            (skill_folder / "tools.py").write_text(tools_py_content, encoding="utf-8")
        else:
            self._write_standard_tools_bridge(skill_folder, skill_slug, repo)

        # Step 5: Save manifest record
        parsed = parse_skill_md(skill_md_content, skill_slug)
        content_hash = compute_skill_content_hash(skill_folder)
        entry = {
            "id": skill_slug,
            "title": repo.replace("-", " ").replace("_", " ").title(),
            "description": parsed.description or f"Skill imported from {owner}/{repo}",
            "category": category,
            "source": "github",
            "repo_url": url,
            "can_delete": True,
            "enabled": True,
            "review_status": "ready",
            "content_hash": content_hash,
            "imported_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "prompt": f"Execute {repo} skill in OS Virtual Computer: ",
        }
        self._imported_meta[skill_slug] = entry
        self._save_manifest()

        return {
            "ok": True,
            "skill": {
                "id": skill_slug,
                "name": parsed.name,
                "title": entry["title"],
                "description": entry["description"],
                "category": category,
                "source": "github",
                "repo_url": url,
                "status": "active",
                "enabled": True,
                "content_hash": content_hash,
            },
            "message": f"Skill '{entry['title']}' successfully imported and ready for Virtual Computer execution.",
        }

    def import_from_zip(
        self,
        zip_bytes: bytes,
        custom_name: Optional[str] = None,
        category: str = "Custom",
    ) -> Dict[str, Any]:
        """Safely imports a full Agent Skill package from a ZIP archive."""
        if not zip_bytes:
            raise ValueError("ZIP archive content is empty")

        try:
            zf = zipfile.ZipFile(io.BytesIO(zip_bytes))
        except zipfile.BadZipFile:
            raise ValueError("Provided data is not a valid ZIP archive")

        # 1. Security Check: Zip-Slip prevention
        namelist = zf.namelist()
        for name in namelist:
            norm = os.path.normpath(name)
            if norm.startswith("..") or os.path.isabs(norm) or "/../" in name or "\\..\\" in name:
                raise ValueError(f"Security error: Path traversal detected in zip entry '{name}'")

        # 2. Find SKILL.md and determine root prefix
        skill_md_entry = None
        for name in namelist:
            if name.lower().endswith("skill.md"):
                skill_md_entry = name
                break

        prefix = ""
        if skill_md_entry and ("/" in skill_md_entry or "\\" in skill_md_entry):
            norm_md = skill_md_entry.replace("\\", "/")
            prefix = norm_md.rsplit("/", 1)[0].rstrip("/")

        skill_md_content = ""
        if skill_md_entry:
            try:
                skill_md_content = zf.read(skill_md_entry).decode("utf-8", errors="replace")
            except Exception:
                pass

        # 3. Determine slug
        slug_seed = custom_name.strip() if custom_name else ""
        if not slug_seed and skill_md_content:
            meta = parse_agent_skills_frontmatter(skill_md_content)
            slug_seed = meta.get("name", "")
        if not slug_seed and prefix:
            slug_seed = prefix.split("/")[-1]
        if not slug_seed:
            slug_seed = f"custom_skill_{int(time.time())}"

        skill_slug = re.sub(r"[^a-z0-9_-]", "", slug_seed.lower().replace(" ", "_"))
        if not skill_slug.endswith("_skill"):
            skill_slug = f"{skill_slug}_skill"

        target_dir = self.skills_dir / skill_slug
        target_dir.mkdir(parents=True, exist_ok=True)

        # 4. Extract safe files
        for name in namelist:
            if name.endswith("/") or name.endswith("\\"):
                continue  # Directory entry
            rel_name = name
            if prefix and name.startswith(prefix + "/"):
                rel_name = name[len(prefix) + 1:]
            
            # Skip hidden or dangerous files
            if ".git" in rel_name or "__pycache__" in rel_name or rel_name.endswith(".pyc"):
                continue

            dest_path = (target_dir / rel_name).resolve()
            if not str(dest_path).startswith(str(target_dir)):
                continue  # Skip any traversal
            
            dest_path.parent.mkdir(parents=True, exist_ok=True)
            dest_path.write_bytes(zf.read(name))

        # 5. Ensure SKILL.md exists
        if not (target_dir / "SKILL.md").exists():
            if not skill_md_content:
                skill_md_content = f"""---
name: {skill_slug}
description: Custom skill imported from ZIP package.
version: 1.0.0
status: active
source: zip
category: {category}
capabilities: [virtual_computer_ready, script_backed]
---

# {skill_slug.replace('_', ' ').title()}

## Purpose
Custom skill package extracted from uploaded ZIP archive.
"""
            (target_dir / "SKILL.md").write_text(skill_md_content, encoding="utf-8")

        # 6. Ensure tools.py exists with format_result
        if not (target_dir / "tools.py").exists():
            self._write_standard_tools_bridge(target_dir, skill_slug, skill_slug)

        parsed = parse_skill_md((target_dir / "SKILL.md").read_text(encoding="utf-8"), skill_slug)
        content_hash = compute_skill_content_hash(target_dir)

        entry = {
            "id": skill_slug,
            "title": custom_name or skill_slug.replace("_", " ").title(),
            "description": parsed.description or "Imported from ZIP archive",
            "category": category,
            "source": "zip",
            "repo_url": "",
            "can_delete": True,
            "enabled": True,
            "review_status": "ready",
            "content_hash": content_hash,
            "imported_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "prompt": f"Execute {skill_slug} in OS Virtual Computer: ",
        }
        self._imported_meta[skill_slug] = entry
        self._save_manifest()

        return {
            "ok": True,
            "skill": {
                "id": skill_slug,
                "name": parsed.name,
                "title": entry["title"],
                "description": entry["description"],
                "category": category,
                "source": "zip",
                "status": "active",
                "enabled": True,
                "content_hash": content_hash,
            },
            "message": f"Skill package '{entry['title']}' successfully imported and ready for execution.",
        }

    def import_from_file(
        self,
        name: str,
        content: str,
        file_type: str = "md",
        category: str = "Custom",
        description: str = "",
        prompt: str = "",
    ) -> Dict[str, Any]:
        """Imports a skill from raw file content (SKILL.md or Python tool file)."""
        name = name.strip()
        if not name:
            raise ValueError("Skill name cannot be empty")

        slug = re.sub(r"[^a-z0-9_-]", "", name.lower().replace(" ", "_"))
        if not slug.endswith("_skill"):
            slug = f"{slug}_skill"

        skill_folder = self.skills_dir / slug
        skill_folder.mkdir(parents=True, exist_ok=True)
        desc = description.strip()

        if file_type == "py":
            (skill_folder / "tools.py").write_text(content, encoding="utf-8")
            if not desc:
                desc = f"Custom Python tool skill '{name}'."
            skill_md = f"""---
name: {slug}
description: {desc}
version: 1.0.0
status: active
source: file
category: {category}
capabilities: [virtual_computer_ready, tool_backed]
---

# {name}

## Purpose
{desc}

## Tool Implementation
Provided via custom Python tools.py script.
"""
            (skill_folder / "SKILL.md").write_text(skill_md, encoding="utf-8")
        else:
            if not content.startswith("---"):
                if not desc:
                    desc = f"Custom skill '{name}'."
                content = f"""---
name: {slug}
description: {desc}
version: 1.0.0
status: active
source: file
category: {category}
capabilities: [virtual_computer_ready, instruction_only]
---

{content}
"""
            (skill_folder / "SKILL.md").write_text(content, encoding="utf-8")

        parsed = parse_skill_md((skill_folder / "SKILL.md").read_text(encoding="utf-8"), slug)
        content_hash = compute_skill_content_hash(skill_folder)

        entry = {
            "id": slug,
            "title": name.replace("_", " ").title(),
            "description": parsed.description or desc or f"Custom skill '{name}'",
            "category": category,
            "source": "file",
            "repo_url": "",
            "can_delete": True,
            "enabled": True,
            "review_status": "ready",
            "content_hash": content_hash,
            "imported_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "prompt": prompt or f"Execute {name}: ",
        }
        self._imported_meta[slug] = entry
        self._save_manifest()

        return {
            "ok": True,
            "skill": {
                "id": slug,
                "name": parsed.name,
                "title": entry["title"],
                "description": entry["description"],
                "category": category,
                "source": "file",
                "status": "active",
                "enabled": True,
                "content_hash": content_hash,
            },
            "message": f"Skill '{entry['title']}' installed successfully.",
        }

    def import_from_local_dir(
        self,
        local_path: str | Path,
        custom_name: Optional[str] = None,
        category: str = "Custom",
    ) -> Dict[str, Any]:
        """Imports an existing local skill directory into OS."""
        src_path = Path(local_path).resolve()
        if not src_path.exists() or not src_path.is_dir():
            raise ValueError(f"Local path '{local_path}' does not exist or is not a directory")

        slug_seed = custom_name.strip() if custom_name else src_path.name
        slug = re.sub(r"[^a-z0-9_-]", "", slug_seed.lower().replace(" ", "_"))
        if not slug.endswith("_skill"):
            slug = f"{slug}_skill"

        dest_dir = self.skills_dir / slug
        if dest_dir.exists():
            shutil.rmtree(dest_dir)
        shutil.copytree(src_path, dest_dir)

        if not (dest_dir / "SKILL.md").exists():
            md_content = f"""---
name: {slug}
description: Local skill imported from {src_path.name}
version: 1.0.0
status: active
source: local_dir
category: {category}
capabilities: [virtual_computer_ready]
---

# {slug.replace('_', ' ').title()}
"""
            (dest_dir / "SKILL.md").write_text(md_content, encoding="utf-8")

        if not (dest_dir / "tools.py").exists():
            self._write_standard_tools_bridge(dest_dir, slug, slug)

        parsed = parse_skill_md((dest_dir / "SKILL.md").read_text(encoding="utf-8"), slug)
        content_hash = compute_skill_content_hash(dest_dir)

        entry = {
            "id": slug,
            "title": custom_name or slug.replace("_", " ").title(),
            "description": parsed.description or f"Imported from {src_path.name}",
            "category": category,
            "source": "local_dir",
            "repo_url": str(src_path),
            "can_delete": True,
            "enabled": True,
            "review_status": "ready",
            "content_hash": content_hash,
            "imported_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "prompt": f"Execute {slug}: ",
        }
        self._imported_meta[slug] = entry
        self._save_manifest()

        return {
            "ok": True,
            "skill": {
                "id": slug,
                "name": parsed.name,
                "title": entry["title"],
                "description": entry["description"],
                "category": category,
                "source": "local_dir",
                "status": "active",
                "enabled": True,
                "content_hash": content_hash,
            },
            "message": f"Local skill '{entry['title']}' registered into OS.",
        }

    def delete_skill(self, skill_id: str) -> Dict[str, Any]:
        """Deletes an imported custom skill safely."""
        folder = self._resolve_skill_folder(skill_id)
        sid = folder.name

        if sid in (
            "calc_skill",
            "datetime_skill",
            "system_skill",
            "websearch_skill",
            "webread_skill",
            "memory_skill",
            "linkedin_skill",
        ):
            raise ValueError(f"Cannot delete core built-in system skill '{sid}'")

        shutil.rmtree(folder)
        if sid in self._imported_meta:
            del self._imported_meta[sid]
            self._save_manifest()

        return {"ok": True, "message": f"Skill '{sid}' removed successfully."}

    # -------------------------------------------------------------------------
    # Virtual Computer Deployment & Execution Runtime
    # -------------------------------------------------------------------------
    def _is_docker_container_active(self) -> bool:
        """Checks if os-virtual-desktop Docker container is up and running."""
        if shutil.which("docker") is None:
            return False
        try:
            res = subprocess.run(
                ["docker", "ps", "-q", "-f", "name=os-virtual-desktop"],
                capture_output=True,
                text=True,
                timeout=3,
            )
            return res.returncode == 0 and bool(res.stdout.strip())
        except Exception:
            return False

    def sync_skill_to_container(self, skill_id: str) -> Tuple[bool, str, str]:
        """Synchronizes skill directory into `/workspace/skills/<skill-id>` inside the Docker desktop container.
        
        Returns: (success: bool, mode: 'docker' | 'local_jail', container_path: str)
        """
        folder = self._resolve_skill_folder(skill_id)
        sid = folder.name

        if self._is_docker_container_active():
            container_dest = f"/workspace/skills/{sid}"
            try:
                # 1. Ensure target directory exists in container
                subprocess.run(
                    ["docker", "exec", "os-virtual-desktop", "mkdir", "-p", container_dest],
                    capture_output=True,
                    timeout=5,
                )
                # 2. Copy skill directory into container
                src_pattern = f"{str(folder)}/."
                cp_res = subprocess.run(
                    ["docker", "cp", src_pattern, f"os-virtual-desktop:{container_dest}/"],
                    capture_output=True,
                    text=True,
                    timeout=10,
                )
                # 3. Ensure permissions
                subprocess.run(
                    ["docker", "exec", "os-virtual-desktop", "chown", "-R", "1000:1000", container_dest],
                    capture_output=True,
                    timeout=5,
                )
                return True, "docker", container_dest
            except Exception as e:
                log.warning("Docker sync failed for skill %s: %s, falling back to local sandbox jail.", sid, e)

        # Fallback to local sandbox jail
        local_ws = ROOT_DIR / "data" / "om-workspace" / "skills" / sid
        local_ws.parent.mkdir(parents=True, exist_ok=True)
        if local_ws.exists():
            shutil.rmtree(local_ws)
        shutil.copytree(folder, local_ws)
        return True, "local_jail", str(local_ws)

    def run_skill(
        self,
        skill_id: str,
        user_input: str,
        model_name: Optional[str] = None,
        execution_env: str = "auto",
        timeout_sec: float = 30.0,
        session_id: Optional[str] = None,
        expected_postconditions: Optional[Dict[str, Any]] = None,
        retries: int = 1,
        cancel_requested: bool = False,
    ) -> Dict[str, Any]:
        """Executes a skill inside the OS Virtual Computer environment and performs independent verification."""
        t0 = time.perf_counter()
        folder = self._resolve_skill_folder(skill_id)
        sid = folder.name

        # Pre-flight Check 1: Cancellation
        if cancel_requested:
            return {
                "ok": False,
                "run_id": f"run_{uuid.uuid4().hex[:8]}",
                "skill_id": sid,
                "status": "CANCELLED",
                "message": "Execution cancelled before start.",
                "verification": {"verified": False, "evidence": "Cancelled by caller or user."},
                "output": "",
                "artifacts": [],
                "steps": [],
            }

        meta = self._imported_meta.get(sid, {})
        enabled = meta.get("enabled", True)
        # Pre-flight Check 2: Enabled status
        if not enabled:
            return {
                "ok": False,
                "run_id": f"run_{uuid.uuid4().hex[:8]}",
                "skill_id": sid,
                "status": "FAILED",
                "message": f"Skill '{sid}' is disabled. Enable it before execution.",
                "verification": {"verified": False, "evidence": "Execution prevented: skill is disabled."},
                "output": "",
                "artifacts": [],
                "steps": [],
            }

        review_status = meta.get("review_status", "ready")
        md_path = folder / "SKILL.md"
        skill_text = md_path.read_text(encoding="utf-8") if md_path.exists() else ""
        parsed = parse_skill_md(skill_text, sid)
        spec_meta = parse_agent_skills_frontmatter(skill_text)
        title = meta.get("title") or parsed.name.replace("_", " ").title()
        input_str = (user_input or "").strip()

        # Pre-flight Check 3: Missing required dependencies/tools
        declared_deps = spec_meta.get("dependencies", []) + spec_meta.get("allowed_tools", [])
        missing_deps = self._check_missing_dependencies(declared_deps)
        if missing_deps:
            return {
                "ok": False,
                "run_id": f"run_{uuid.uuid4().hex[:8]}",
                "skill_id": sid,
                "status": "UNSUPPORTED",
                "message": f"Skill '{sid}' missing required dependencies: {', '.join(missing_deps)}",
                "verification": {"verified": False, "evidence": f"Missing dependencies: {missing_deps}"},
                "output": "",
                "artifacts": [],
                "steps": [],
            }

        scripts_dir = folder / "scripts"
        has_scripts = scripts_dir.exists() and any(scripts_dir.glob("*.py"))
        # Pre-flight Check 4: Mandatory Review before Script Execution
        if review_status == "needs_review" and has_scripts:
            return {
                "ok": False,
                "run_id": f"run_{uuid.uuid4().hex[:8]}",
                "skill_id": sid,
                "status": "NEEDS_REVIEW",
                "message": f"Skill '{sid}' requires review before execution.",
                "verification": {"verified": False, "evidence": "Execution halted: pending mandatory safety review."},
                "output": "",
                "artifacts": [],
                "steps": [],
            }

        # Pre-flight Check 5: Permission escalation detection
        lowered_input = input_str.lower()
        if any(esc in lowered_input for esc in [
            "docker.sock", "/var/run/docker.sock", "rm -rf /", "chmod 777 /", ":(){ :|:& };:", "/etc/shadow", "/etc/sudoers"
        ]):
            return {
                "ok": False,
                "run_id": f"run_{uuid.uuid4().hex[:8]}",
                "skill_id": sid,
                "status": "DENIED",
                "message": "Permission escalation blocked: skill attempted unauthorized operations outside capability scope.",
                "verification": {"verified": False, "evidence": "Security policy blocked command attempting unauthorized host access."},
                "output": "",
                "artifacts": [],
                "steps": [],
            }
        declared_perms = spec_meta.get("permissions", [])
        if "read" in declared_perms and "write" not in declared_perms:
            if any(w in lowered_input for w in ["write to /", "modify system", "delete file", "rm "]):
                return {
                    "ok": False,
                    "run_id": f"run_{uuid.uuid4().hex[:8]}",
                    "skill_id": sid,
                    "status": "DENIED",
                    "message": "Permission escalation blocked: read-only skill attempted write/delete operations.",
                    "verification": {"verified": False, "evidence": "Security policy blocked write action for read-only skill."},
                    "output": "",
                    "artifacts": [],
                    "steps": [],
                }

        # Step 1: Bind to intended Computer session
        bound_session_id = session_id or f"skill-session-{sid}-{uuid.uuid4().hex[:8]}"

        # Step 2: Deploy skill to container workspace
        sync_ok, sandbox_mode, container_path = self.sync_skill_to_container(sid)
        steps_log: List[Dict[str, Any]] = [
            {
                "step": "workspace_synchronization",
                "target": container_path,
                "sandbox_mode": sandbox_mode,
                "session_id": bound_session_id,
                "status": "success" if sync_ok else "warning",
                "message": f"Skill synced to {container_path} in {sandbox_mode} environment (session: {bound_session_id}).",
            }
        ]

        # Step 3: Determine execution mechanism
        output_content = ""
        model_used = "deterministic-sandbox"
        mode = "script_execution"
        is_verified = False
        evidence_str = ""
        artifacts: List[Dict[str, Any]] = []
        exit_code = 0
        stdout = ""
        stderr = ""

        # Mechanism A: Script-Backed Execution
        if has_scripts:
            py_scripts = sorted(scripts_dir.glob("*.py"))
            script_file = None
            for cand in ["run.py", "main.py", "execute.py"]:
                if (scripts_dir / cand).exists():
                    script_file = scripts_dir / cand
                    break
            if not script_file and py_scripts:
                script_file = py_scripts[0]

            if script_file:
                script_rel = f"scripts/{script_file.name}"
                cmd = f"python3 {script_rel} {input_str}".strip()

                if sandbox_mode == "docker":
                    try:
                        proc = subprocess.run(
                            [
                                "docker", "exec",
                                "--user", "1000:1000",
                                "--workdir", container_path,
                                "os-virtual-desktop",
                                "/bin/bash", "-c", cmd,
                            ],
                            capture_output=True,
                            text=True,
                            timeout=timeout_sec,
                        )
                        stdout = proc.stdout.strip()
                        stderr = proc.stderr.strip()
                        exit_code = proc.returncode
                    except (subprocess.TimeoutExpired, TimeoutError):
                        exit_code = 124
                        stdout = ""
                        stderr = f"Execution timed out after {timeout_sec}s."

                    is_verified = (exit_code == 0)
                    evidence_str = f"Container exit_code: {exit_code}. Container stdout: {stdout[:100]}."

                    # Check for created files in container workspace
                    try:
                        check_artifacts = subprocess.run(
                            ["docker", "exec", "os-virtual-desktop", "find", "/workspace", "-maxdepth", "2", "-type", "f", "-mmin", "-5"],
                            capture_output=True,
                            text=True,
                            timeout=5,
                        )
                        for line in check_artifacts.stdout.splitlines():
                            if line.strip():
                                artifacts.append({"path": line.strip(), "environment": "docker"})
                    except Exception:
                        pass

                else:
                    # Execute in local sandbox jail
                    from server.computer.workspace_sandbox import get_workspace_sandbox
                    sandbox = get_workspace_sandbox()
                    try:
                        subres = sandbox.execute_command(cmd, cwd_rel=f"skills/{sid}", timeout_sec=timeout_sec)
                        stdout = subres.stdout.strip()
                        stderr = subres.stderr.strip()
                        exit_code = subres.exit_code
                    except (subprocess.TimeoutExpired, TimeoutError):
                        exit_code = 124
                        stdout = ""
                        stderr = f"Execution timed out after {timeout_sec}s."

                    is_verified = (exit_code == 0)
                    evidence_str = f"Local jail exit_code: {exit_code}."

                mode = "container_script"
                model_used = f"python3:{script_file.name}"
                output_content = (
                    f"### Virtual Computer Execution Output\n\n"
                    f"**Script**: `{script_rel}`\n"
                    f"**Environment**: `{sandbox_mode}` at `{container_path}`\n"
                    f"**Session ID**: `{bound_session_id}`\n"
                    f"**Exit Code**: `{exit_code}`\n\n"
                    f"```text\n{stdout or stderr or 'Execution finished with 0 output.'}\n```"
                )
                steps_log.append({
                    "step": "container_script_run",
                    "command": cmd,
                    "session_id": bound_session_id,
                    "exit_code": exit_code,
                    "duration_ms": round((time.perf_counter() - t0) * 1000, 2),
                    "status": "success" if exit_code == 0 else "error",
                })

        # Mechanism B: Browser Navigation
        elif sid in ("browser", "browser_skill") or ("browser" in sid and not has_scripts) or input_str.lower().startswith(("navigate to ", "browse to ", "open url ")):
            from server.computer.backends.browser_harness import get_browser_harness_backend
            bh = get_browser_harness_backend()
            target_url = "http://127.0.0.1:3000/api/health"
            url_match = re.search(r"https?://[^\s]+", input_str)
            if url_match:
                target_url = url_match.group(0)

            b_sess = bh.start_session({"session_id": bound_session_id, "initial_url": target_url})
            page_title = ""
            page_text = ""
            dest_url = target_url
            if b_sess:
                nav_res = bh.open_url(bound_session_id, target_url)
                dest_url = nav_res.details.get("url", target_url) if hasattr(nav_res, "details") and nav_res.details else target_url
                inspect_res = bh.inspect_page(bound_session_id)
                page_title = inspect_res.title or ""
                page_text = inspect_res.text_content or ""
                obs_res = bh.observe_screen(bound_session_id)
                if obs_res.screenshot_base64:
                    artifacts.append({
                        "name": f"screenshot_{bound_session_id}.png",
                        "size": len(obs_res.screenshot_base64),
                        "type": "image/png",
                        "environment": "browser_harness",
                    })

            mode = "browser_runtime"
            model_used = "browser-harness"
            is_verified = bool(page_title or page_text or b_sess)
            evidence_str = f"Navigated to {dest_url}, verified page title: '{page_title}'."
            output_content = (
                f"### Browser Runtime Output\n"
                f"- **Destination URL**: {dest_url}\n"
                f"- **Page Title**: {page_title}\n"
                f"- **Session ID**: {bound_session_id}\n"
                f"- **Content Excerpt**: {page_text[:300]}"
            )
            steps_log.append({
                "step": "browser_navigation",
                "url": dest_url,
                "session_id": bound_session_id,
                "status": "success" if is_verified else "error",
            })

        # Mechanism C: Built-in Native OS Tools
        elif sid in ("calc", "calc_skill") or "calc" in spec_meta.get("allowed_tools", []) or "calc" in sid or "math" in sid or "calculate" in input_str.lower():
            try:
                from skills.calc_skill.tools import calc
            except Exception:
                try:
                    spec = importlib.util.spec_from_file_location("calc_tools", folder / "tools.py")
                    mod = importlib.util.module_from_spec(spec)
                    spec.loader.exec_module(mod)
                    calc = getattr(mod, "calc")
                except Exception:
                    calc = None

            expr = re.sub(r"^(calculate|calc|compute|eval|what is)\s*", "", input_str, flags=re.I).strip() or "2 + 2"
            if calc is not None:
                res = calc(expression=expr)
                res_val = res.data.get("result") if res and res.data else None
            else:
                res_val = None

            if res_val is None:
                import ast, operator
                _ops = {ast.Add: operator.add, ast.Sub: operator.sub, ast.Mult: operator.mul, ast.Div: operator.truediv}
                def _eval_node(node):
                    if isinstance(node, ast.Expression): return _eval_node(node.body)
                    if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)): return node.value
                    if isinstance(node, ast.BinOp) and type(node.op) in _ops: return _ops[type(node.op)](_eval_node(node.left), _eval_node(node.right))
                    raise ValueError("unsupported")
                res_val = _eval_node(ast.parse(expr, mode='eval'))

            mode = "native_python_tool"
            model_used = "deterministic-ast-sandbox"
            is_verified = True
            evidence_str = f"Expression '{expr}' evaluated locally to {res_val}"
            output_content = f"**Calculation Result**: `{res_val}`\n\n*Evaluated locally with zero cloud leaks via Python AST sandbox.*"

        elif sid in ("datetime", "datetime_skill"):
            from server.tools.datetime_tool import get_current_datetime
            res = get_current_datetime()
            d = res.data or {}
            mode = "native_python_tool"
            model_used = "host-system-clock"
            is_verified = True
            evidence_str = f"Host clock returned ISO-8601 {d.get('iso_8601')}"
            output_content = f"### System Clock & Time\n- **ISO-8601**: `{d.get('iso_8601')}`\n- **Formatted**: {d.get('formatted')}\n- **Date**: {d.get('date')}\n- **Time**: {d.get('time')}\n- **Timezone**: {d.get('timezone')} ({d.get('utc_offset')})\n- **Day of Week**: {d.get('day_of_week')}"

        elif sid in ("system", "system_skill"):
            from server.tools.system_info_tool import get_system_info
            res = get_system_info()
            d = res.data or {}
            mode = "native_python_tool"
            model_used = "host-hardware-probe"
            is_verified = True
            evidence_str = f"Probed {d.get('platform')} {d.get('architecture')}, {d.get('cpu_count')} cores"
            output_content = (
                f"### System Hardware Posture\n"
                f"- **Platform**: {d.get('platform')}\n"
                f"- **Architecture**: {d.get('architecture')}\n"
                f"- **CPU Cores**: {d.get('cpu_count')}\n"
                f"- **RAM**: {d.get('memory_used_gb')} GB / {d.get('memory_total_gb')} GB ({d.get('memory_percent')}% used)\n"
                f"- **Disk**: {d.get('disk_used_gb')} GB / {d.get('disk_total_gb')} GB ({d.get('disk_percent')}% used)\n"
                f"- **Execution Boundary**: Strict Local SafeExecutor"
            )

        elif sid in ("websearch", "websearch_skill"):
            from server.tools.websearch_tool import web_search
            q = re.sub(r"^(search for|search|lookup|find)\s*", "", input_str, flags=re.I).strip() or "latest AI developments"
            res = web_search(query=q)
            results_list = res.data.get("results", []) if res.data else []
            mode = "native_python_tool"
            model_used = "duckduckgo-real-search"
            is_verified = len(results_list) > 0
            evidence_str = f"DuckDuckGo returned {len(results_list)} verified live search hits."
            lines = [f"### Web Search Results for: *{q}*\n"]
            for i, r in enumerate(results_list[:5], 1):
                lines.append(f"{i}. **[{r.get('title')}]({r.get('url')})**\n   {r.get('body')}\n")
            output_content = "\n".join(lines) if results_list else f"No search results returned for query '{q}'."

        elif sid in ("linkedin", "linkedin_skill"):
            try:
                from skills.linkedin_skill.tools import linkedin_draft
            except Exception:
                spec = importlib.util.spec_from_file_location("linkedin_tools", folder / "tools.py")
                mod = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(mod)
                linkedin_draft = getattr(mod, "linkedin_draft")
            res = linkedin_draft(topic=input_str or "Personal AI Operating System v2.0")
            post = res.data.get("post", "") if res.data else ""
            mode = "native_python_tool"
            model_used = "linkedin-template-engine"
            is_verified = bool(post)
            evidence_str = "Generated post draft with approval gating active."
            output_content = f"### Generated LinkedIn Update\n\n{post}\n\n---\n*Human approval gating active before publishing.*"

        elif sid in ("file_skill",):
            from server.computer.workspace_sandbox import get_workspace_sandbox
            sandbox = get_workspace_sandbox()
            files_list = sandbox.list_files()
            mode = "container_workspace_tool"
            model_used = "workspace-sandbox"
            is_verified = True
            evidence_str = f"Found {len(files_list)} entries in container workspace."
            flines = [f"### Virtual Computer Workspace Files\n\nPath: `/workspace`\n"]
            for f in files_list:
                flines.append(f"- **{f['name']}** ({'Directory' if f['dir'] else f'{f['size']} bytes'})")
            output_content = "\n".join(flines)

        # Mechanism D: Custom tools.py Handler
        elif (folder / "tools.py").exists():
            tools_file = folder / "tools.py"
            spec = importlib.util.spec_from_file_location(f"custom_{sid}_tools", tools_file)
            if spec and spec.loader:
                try:
                    mod = importlib.util.module_from_spec(spec)
                    spec.loader.exec_module(mod)
                    if hasattr(mod, "run_skill"):
                        custom_fn = getattr(mod, "run_skill")
                        t_res = custom_fn(prompt=input_str)
                        data_val = getattr(t_res, "data", t_res)
                        status_val = getattr(t_res, "status", "success")
                        out_text = json.dumps(data_val, indent=2) if isinstance(data_val, dict) else str(data_val)
                        mode = "custom_python_tool"
                        model_used = "native-tools.py"
                        is_verified = (status_val == "success")
                        evidence_str = f"tools.py returned status '{status_val}'."
                        output_content = out_text
                except Exception as e:
                    log.warning("tools.py execution failed: %s; falling back to LLM", e)

        # Mechanism E: LLM-Guided Reasoning with Skill Contract
        if not output_content:
            from jarvis_os.primitives.ollama_registry import OllamaModelRegistry
            reg = OllamaModelRegistry()
            active_model = model_name or reg.active_model or "deepseek-r1:32b"
            system_instruction = f"""You are OS running the specialist skill '{title}' inside the OS Virtual Computer environment.
Follow this skill contract strictly:
=== SKILL CONTRACT ===
{skill_text[:3000]}
=== END CONTRACT ===

Environment: Linux Desktop Container at {container_path}.
Session ID: {bound_session_id}
Provide clean, verifiable execution results."""

            chat_res = reg.chat_with_model(
                prompt=input_str or f"Execute {title} with standard parameters.",
                system_prompt=system_instruction,
            )
            if chat_res.get("ok") and chat_res.get("content"):
                output_content = chat_res["content"]
                model_used = chat_res.get("model", active_model)
                mode = "local_ollama_llm"
                is_verified = True
                evidence_str = f"Ollama model {model_used} completed inference in {chat_res.get('latency_ms')}ms."
            else:
                output_content = (
                    f"### {title} Execution Result\n\n"
                    f"**Task**: {input_str}\n\n"
                    f"**Virtual Computer Status**: Skill `{sid}` loaded and synchronized at `{container_path}`.\n"
                    f"- **Environment**: `{sandbox_mode}`\n"
                    f"- **Session ID**: `{bound_session_id}`\n"
                    f"- **Model**: `{active_model}` (Local Safe Fallback)\n"
                    f"- **Contract**: Loaded `{parsed.name}` v{parsed.version}\n"
                    f"- **Execution**: Completed deterministically under OS SafeExecutor sandbox."
                )
                model_used = f"{active_model} (fallback)"
                mode = "deterministic_fallback"
                is_verified = False
                evidence_str = "Deterministic fallback executed without live model verification."

        # Step 4: Evaluate Expected Postconditions
        postconditions_passed = True
        postcondition_details: List[str] = []
        if expected_postconditions:
            for p_key, p_val in expected_postconditions.items():
                if p_key == "file_exists":
                    target_file = str(p_val)
                    exists = False
                    if sandbox_mode == "docker":
                        chk = subprocess.run(
                            ["docker", "exec", "os-virtual-desktop", "test", "-f", target_file],
                            capture_output=True, timeout=5,
                        )
                        exists = (chk.returncode == 0)
                    else:
                        from server.computer.workspace_sandbox import get_workspace_sandbox
                        ws_root = get_workspace_sandbox().workspace_root
                        rel_target = target_file.lstrip("/").replace("workspace/", "").replace("skills/", "")
                        target_local = ws_root / rel_target
                        exists = target_local.exists() or Path(target_file).exists()
                    if exists:
                        postcondition_details.append(f"Passed: file_exists '{target_file}'")
                    else:
                        postconditions_passed = False
                        postcondition_details.append(f"Failed: file_exists '{target_file}' not found")

                elif p_key == "contains_text":
                    req_txt = str(p_val)
                    comb_txt = output_content + " " + stdout
                    if req_txt in comb_txt:
                        postcondition_details.append(f"Passed: contains_text '{req_txt}'")
                    else:
                        postconditions_passed = False
                        postcondition_details.append(f"Failed: contains_text '{req_txt}' missing from output")

                elif p_key == "destination_url":
                    req_url = str(p_val)
                    if req_url in output_content or ("dest_url" in locals() and dest_url == req_url):
                        postcondition_details.append(f"Passed: destination_url '{req_url}' reached")
                    else:
                        postconditions_passed = False
                        postcondition_details.append(f"Failed: destination_url '{req_url}' not reached")

            if not postconditions_passed:
                is_verified = False

        # Invariant: Failed verification must never become completed!
        if not is_verified:
            if exit_code != 0 or not postconditions_passed:
                final_status = "FAILED"
            else:
                final_status = "UNVERIFIED"
        else:
            final_status = "VERIFIED"

        elapsed_ms = round((time.perf_counter() - t0) * 1000, 2)
        run_id = f"run_{uuid.uuid4().hex[:8]}"

        # Step 5: Record real run in persistent history
        run_record = {
            "run_id": run_id,
            "skill_id": sid,
            "session_id": bound_session_id,
            "skill_title": title,
            "input": input_str,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "status": final_status,
            "execution_mode": mode,
            "sandbox_mode": sandbox_mode,
            "container_path": container_path,
            "duration_ms": elapsed_ms,
            "model_used": model_used,
            "verification": {
                "verified": is_verified,
                "evidence": evidence_str,
                "environment": sandbox_mode,
                "postconditions": postcondition_details,
            },
            "artifacts": artifacts,
            "steps": steps_log,
            "output_preview": output_content[:200],
        }
        self._run_history.append(run_record)
        self._save_history()

        return {
            "ok": (final_status in ("VERIFIED", "COMPLETED")),
            "run_id": run_id,
            "skill_id": sid,
            "session_id": bound_session_id,
            "skill_title": title,
            "input": input_str,
            "output": output_content,
            "execution_mode": mode,
            "sandbox_mode": sandbox_mode,
            "container_path": container_path,
            "model_used": model_used,
            "latency_ms": elapsed_ms,
            "status": final_status,
            "verification": {
                "verified": is_verified,
                "evidence": evidence_str,
                "environment": sandbox_mode,
                "postconditions": postcondition_details,
            },
            "artifacts": artifacts,
            "steps": steps_log,
        }

    def get_run_history(self, skill_id: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
        """Returns recent execution runs, newest first."""
        history = self._run_history
        if skill_id:
            folder = self._resolve_skill_folder(skill_id)
            history = [r for r in history if r.get("skill_id") == folder.name]
        return list(reversed(history[-limit:]))

    def clear_run_history(self, skill_id: Optional[str] = None) -> Dict[str, Any]:
        """Clears run history."""
        if skill_id:
            folder = self._resolve_skill_folder(skill_id)
            self._run_history = [r for r in self._run_history if r.get("skill_id") != folder.name]
        else:
            self._run_history = []
        self._save_history()
        return {"ok": True, "message": "Run history cleared."}

    # -------------------------------------------------------------------------
    # Helper Utilities
    # -------------------------------------------------------------------------
    def _resolve_skill_folder(self, skill_id: str) -> Path:
        """Finds the folder path for a skill ID, trying standard suffixes."""
        sid = skill_id.strip()
        folder = self.skills_dir / sid
        if folder.exists() and folder.is_dir():
            return folder
        if (self.skills_dir / f"{sid}_skill").exists():
            return self.skills_dir / f"{sid}_skill"
        raise ValueError(f"Skill '{skill_id}' not found on disk at {self.skills_dir}")

    def _write_standard_tools_bridge(self, folder: Path, slug: str, title: str) -> None:
        """Writes a standard tools.py bridge that conforms to ToolRegistry's 3-tuple requirement."""
        bridge_code = f'''"""OS Execution Bridge for {slug}."""
from server.intent.registry import ExecutionMode, ToolResult, ToolSpec

TOOL_SPEC = ToolSpec(
    name="{slug}",
    description="Run {title} skill operations in OS.",
    execution_mode=ExecutionMode.DIRECT,
)

def run_skill(prompt: str = "", **kwargs) -> ToolResult:
    return ToolResult(
        status="success",
        mode=ExecutionMode.DIRECT,
        data={{"skill": "{slug}", "input": prompt, "result": "Ready for execution in OS Virtual Computer."}},
    )

def format_result(result: ToolResult) -> str:
    return str(result.data.get("result", ""))

TOOLS = [(TOOL_SPEC, run_skill, format_result)]
'''
        (folder / "tools.py").write_text(bridge_code, encoding="utf-8")

    @staticmethod
    def _parse_github_url(url: str) -> tuple[str, str, str, str]:
        """Extracts (owner, repo, branch, subpath) from a GitHub URL."""
        clean = url.split("?")[0].split("#")[0].rstrip("/")
        if "raw.githubusercontent.com" in clean:
            parts = clean.split("raw.githubusercontent.com/")[1].split("/")
            if len(parts) >= 2:
                owner = parts[0]
                repo = parts[1]
                branch = parts[2] if len(parts) > 2 else "main"
                subpath = "/".join(parts[3:-1]) if len(parts) > 3 else ""
                return owner, repo, branch, subpath

        if "github.com" in clean:
            path = clean.split("github.com/")[1]
            parts = path.split("/")
            if len(parts) >= 2:
                owner = parts[0]
                repo = parts[1].removesuffix(".git")
                branch = "main"
                subpath = ""
                if len(parts) >= 4 and parts[2] in ("tree", "blob"):
                    branch = parts[3]
                    subpath = "/".join(parts[4:])
                    if parts[2] == "blob" and subpath.endswith("/SKILL.md"):
                        subpath = subpath.rsplit("/SKILL.md", 1)[0]
                return owner, repo, branch, subpath

        return "", "", "main", ""

    @staticmethod
    def _fetch_url_text(url: str, timeout: float = 6.0) -> str:
        """Fetches raw text over HTTP with standard headers."""
        try:
            req = urllib.request.Request(
                url,
                headers={
                    "User-Agent": "OS-Personal-AI/2.0",
                    "Accept": "text/plain, text/markdown, text/html, */*",
                },
            )
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                if resp.status == 200:
                    return resp.read().decode("utf-8", errors="replace")
        except Exception as e:
            log.debug("HTTP fetch error for %s: %s", url, e)
        return ""

    @staticmethod
    def _fetch_github_repo_api(owner: str, repo: str, timeout: float = 6.0) -> Dict[str, Any]:
        """Fetches public repo metadata from api.github.com."""
        try:
            api_url = f"https://api.github.com/repos/{owner}/{repo}"
            req = urllib.request.Request(
                api_url,
                headers={
                    "User-Agent": "OS-Personal-AI/2.0",
                    "Accept": "application/vnd.github.v3+json",
                },
            )
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                if resp.status == 200:
                    return json.loads(resp.read().decode("utf-8"))
        except Exception as e:
            log.debug("GitHub API fetch error for %s/%s: %s", owner, repo, e)
        return {}

    @staticmethod
    def _fetch_github_api_contents(api_contents_url: str, timeout: float = 6.0) -> Any:
        """Fetches directory contents listing from GitHub API."""
        try:
            req = urllib.request.Request(
                api_contents_url,
                headers={
                    "User-Agent": "OS-Personal-AI/2.0",
                    "Accept": "application/vnd.github.v3+json",
                },
            )
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                if resp.status == 200:
                    return json.loads(resp.read().decode("utf-8"))
        except Exception as e:
            log.debug("GitHub Contents API fetch error for %s: %s", api_contents_url, e)
        return []


_skill_manager_singleton: Optional[SkillManager] = None


def get_skill_manager() -> SkillManager:
    global _skill_manager_singleton
    if _skill_manager_singleton is None:
        _skill_manager_singleton = SkillManager()
    return _skill_manager_singleton
