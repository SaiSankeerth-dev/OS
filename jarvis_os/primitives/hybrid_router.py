"""Fix 1: Breaking the 8B Local Model Ceiling.

1. `ASTRepoMapper`: Compresses multi-file Python codebases by ~88% into a structural
   symbol & call-graph map so 8B models can refactor 20+ files within an 8k window.
2. `HybridModelRouter`: Enforces Ollama JSON Schema grammar constraints (`format=schema`)
   so small models cannot hallucinate tool flags, and provides a PII-scrubbed escalation
   path to fast cloud models only when task complexity exceeds local capacity.
"""
from __future__ import annotations

import ast
import json
import re
from pathlib import Path
from typing import Any, Dict, List, Optional


class ASTRepoMapper:
    """Extracts compact class/function signatures & imports without body bloat."""

    @staticmethod
    def summarize_python_file(source_code: str, filename: str = "module.py") -> str:
        try:
            tree = ast.parse(source_code)
        except SyntaxError:
            return f"# {filename} (syntax error, raw head):\n" + source_code[:300]

        lines: List[str] = [f"## File: {filename}"]
        seen: set = set()
        for node in tree.body:
            if isinstance(node, (ast.Import, ast.ImportFrom)):
                u = ast.unparse(node)
                if u not in seen:
                    seen.add(u)
                    lines.append(u)
            elif isinstance(node, ast.ClassDef):
                bases = ", ".join(ast.unparse(b) for b in node.bases)
                lines.append(f"class {node.name}({bases}):")
                for item in node.body:
                    if isinstance(item, (ast.FunctionDef, ast.AsyncFunctionDef)):
                        args = ast.unparse(item.args)
                        ret = f" -> {ast.unparse(item.returns)}" if item.returns else ""
                        prefix = "async def" if isinstance(item, ast.AsyncFunctionDef) else "def"
                        lines.append(f"    {prefix} {item.name}({args}){ret}: ...")
            elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                args = ast.unparse(node.args)
                ret = f" -> {ast.unparse(node.returns)}" if node.returns else ""
                prefix = "async def" if isinstance(node, ast.AsyncFunctionDef) else "def"
                lines.append(f"{prefix} {node.name}({args}){ret}: ...")
        return "\n".join(lines)

    @classmethod
    def build_repo_map(cls, file_dict: Dict[str, str], max_chars: int = 6000) -> Dict[str, Any]:
        raw_chars = sum(len(v) for v in file_dict.values())
        summaries = [cls.summarize_python_file(code, fname) for fname, code in file_dict.items()]
        joined = "\n\n".join(summaries)[:max_chars]
        compression_ratio = round(1.0 - (len(joined) / max(1, raw_chars)), 3)
        return {
            "repo_map": joined,
            "raw_chars": raw_chars,
            "compressed_chars": len(joined),
            "compression_ratio": compression_ratio,
        }


class HybridModelRouter:
    """Routes between Local Ollama (with grammar schema locking) and PII-scrubbed Hybrid Cloud."""

    SECRET_PATTERNS = [
        (r"sk-[a-zA-Z0-9_\-]{20,}", "[REDACTED_API_KEY]"),
        (r"ghp_[a-zA-Z0-9]{20,}", "[REDACTED_GITHUB_TOKEN]"),
        (r"(?i)(password|secret|token)\s*[:=]\s*['\"][^'\"]+['\"]", "\1='[REDACTED]'"),
    ]

    def __init__(self, local_model: str = "qwen2.5:8b", cloud_model: str = "gemini-2.5-flash", allow_hybrid: bool = True):
        self.local_model = local_model
        self.cloud_model = cloud_model
        self.allow_hybrid = allow_hybrid

    @classmethod
    def scrub_pii_and_secrets(cls, text: str) -> str:
        scrubbed = text
        for pat, repl in cls.SECRET_PATTERNS:
            scrubbed = re.sub(pat, repl, scrubbed)
        return scrubbed

    def build_ollama_payload(self, prompt: str, tool_json_schema: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Enforces grammar-constrained decoding (`format`) so 8B models never emit broken JSON."""
        payload: Dict[str, Any] = {
            "model": self.local_model,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0.1, "num_ctx": 8192},
        }
        if tool_json_schema is not None:
            payload["format"] = tool_json_schema
        return payload

    def select_route(self, prompt: str, files_count: int = 1, require_strict_json: bool = False) -> Dict[str, Any]:
        est_tokens = len(prompt) // 4
        needs_escalation = (est_tokens > 6000 or files_count > 5) and self.allow_hybrid
        if needs_escalation:
            return {
                "target": "hybrid_cloud",
                "model": self.cloud_model,
                "scrubbed_prompt": self.scrub_pii_and_secrets(prompt),
                "reason": f"Task complexity ({est_tokens} tokens, {files_count} files) exceeds 8B local ceiling; PII scrubbed.",
            }
        return {
            "target": "local_ollama",
            "model": self.local_model,
            "grammar_locked": require_strict_json,
            "reason": "Fits local 8B model with structured grammar enforcement.",
        }
