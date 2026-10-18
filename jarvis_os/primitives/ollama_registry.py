"""Dynamic Ollama Multi-Model Registry & Switcher (`jarvis_os/primitives/ollama_registry.py`).

Discovers every model downloaded in the user's local Ollama installation:
1. `GET /api/tags` HTTP API
2. `ollama list` CLI fallback
3. Local disk manifests scanning (`~/.ollama/models/manifests/registry.ollama.ai/library/`)

Supports dynamic switching:
- Globally (default model for all OS chat, dashboard & HUD commands)
- Per-Dot Coworker (e.g., bind `qwen2.5-coder` to `@forge`, `deepseek-r1` to `@scout`, `llama3.2` to `@scribe`)
"""
from __future__ import annotations

import json
import logging
import os
import shutil
import subprocess
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional

log = logging.getLogger("os.ollama_registry")


class OllamaModelRegistry:
    DEFAULT_HOST = os.environ.get("OLLAMA_HOST", "http://127.0.0.1:11434").rstrip("/")

    def __init__(
        self,
        base_url: str | None = None,
        http_getter: Optional[Callable[[str, float], Dict[str, Any]]] = None,
        http_poster: Optional[Callable[[str, Dict[str, Any], float], Dict[str, Any]]] = None,
        cli_runner: Optional[Callable[[List[str]], str]] = None,
    ) -> None:
        self.base_url = (base_url or self.DEFAULT_HOST).rstrip("/")
        if not self.base_url.startswith("http"):
            self.base_url = f"http://{self.base_url}"
        self._http_get = http_getter or self._default_http_get
        self._http_post = http_poster or self._default_http_post
        self._cli_runner = cli_runner or self._default_cli_runner

        self.installed_models: List[Dict[str, Any]] = []
        self.daemon_online: bool = False
        self.active_model: str = os.environ.get("OLLAMA_MODEL", "")
        # Per-Dot custom model bindings (if unset or None, falls back to self.active_model)
        self.dot_models: Dict[str, Optional[str]] = {
            "forge": None,
            "scout": None,
            "scribe": None,
            "sentinel": None,
        }
        self.refresh_models()

    @staticmethod
    def _default_http_get(url: str, timeout: float = 1.5) -> Dict[str, Any]:
        req = urllib.request.Request(url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))

    @staticmethod
    def _default_http_post(url: str, payload: Dict[str, Any], timeout: float = 60.0) -> Dict[str, Any]:
        body = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=body,
            headers={"Content-Type": "application/json", "Accept": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))

    @staticmethod
    def _default_cli_runner(cmd: List[str]) -> str:
        if not shutil.which(cmd[0]):
            return ""
        try:
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=1.5)
            return res.stdout if res.returncode == 0 else ""
        except Exception:
            return ""

    @staticmethod
    def _infer_model_type(model_name: str, family: str = "") -> str:
        low = f"{model_name} {family}".lower()
        if any(k in low for k in ["r1", "qwq", "reason", "think", "deepseek-r1"]):
            return "Reasoning"
        if any(k in low for k in ["coder", "codestral", "starcoder", "deepseek-coder", "code", "devstral"]):
            return "Coding"
        if any(k in low for k in ["vl", "llava", "vision", "pixtral", "moondream", "minicpm-v"]):
            return "Vision"
        if any(k in low for k in ["dolphin", "wizard"]):
            return "Creative"
        if any(k in low for k in ["mythos", "claude", "qwythos"]):
            return "Creative"
        if any(k in low for k in ["instruct", "chat"]):
            return "Instruction"
        if any(k in low for k in ["ornith"]):
            return "Agentic"
        return "General"

    @classmethod
    def _infer_tags(cls, model_name: str, family: str = "") -> List[str]:
        low = f"{model_name} {family}".lower()
        tags = ["local"]
        mtype = cls._infer_model_type(model_name, family).lower()
        if mtype not in tags:
            tags.append(mtype)
        if any(k in low for k in ["coder", "codestral", "starcoder", "deepseek-coder", "code", "devstral"]) and "coding" not in tags:
            tags.append("coding")
        if any(k in low for k in ["r1", "qwq", "reason", "think", "o1", "z1"]) and "reasoning" not in tags:
            tags.append("reasoning")
        if any(k in low for k in ["vl", "llava", "vision", "pixtral", "moondream", "minicpm-v"]) and "vision" not in tags:
            tags.append("vision")
        if len(tags) == 1:
            tags.append("general")
        return tags

    def refresh_models(self) -> List[Dict[str, Any]]:
        """Discovers all downloaded models via HTTP API, CLI fallback, or disk manifest inspection."""
        discovered: List[Dict[str, Any]] = []
        self.daemon_online = False

        # 1. Try Ollama HTTP API (/api/tags)
        try:
            data = self._http_get(f"{self.base_url}/api/tags", 3.0)
            self.daemon_online = True
            for m in data.get("models", []):
                name = m.get("name") or m.get("model") or ""
                if not name:
                    continue
                size_bytes = int(m.get("size", 0) or 0)
                size_gb = round(size_bytes / (1024 ** 3), 2) if size_bytes else 0.0
                details = m.get("details") or {}
                family = details.get("family", "")
                param_size = details.get("parameter_size", "")
                quant = details.get("quantization_level", "")
                model_type = self._infer_model_type(name, family)
                discovered.append({
                    "name": name,
                    "size_gb": size_gb,
                    "parameter_size": param_size or "local",
                    "quantization": quant or "default",
                    "family": family or name.split(":")[0],
                    "modified_at": m.get("modified_at", ""),
                    "model_type": model_type,
                    "type": model_type,
                    "display_name": f"{name} ({model_type})",
                    "capabilities": self._infer_tags(name, family),
                    "source": "ollama_http_api",
                })
        except Exception:
            pass

        # 2. Fallback to `ollama list` CLI if HTTP API returned nothing
        if not discovered:
            try:
                raw_out = self._cli_runner(["ollama", "list"])
                lines = [ln.strip() for ln in (raw_out or "").splitlines() if ln.strip()]
                for ln in lines[1:] if (lines and "NAME" in lines[0].upper()) else lines:
                    parts = ln.split()
                    if not parts or parts[0].startswith("Failed") or parts[0].startswith("time="):
                        continue
                    name = parts[0]
                    size_str = f"{parts[2]} {parts[3]}" if len(parts) >= 4 else "local"
                    model_type = self._infer_model_type(name)
                    discovered.append({
                        "name": name,
                        "size_gb": size_str,
                        "parameter_size": "local",
                        "quantization": "gguf",
                        "family": name.split(":")[0],
                        "modified_at": "",
                        "model_type": model_type,
                        "type": model_type,
                        "display_name": f"{name} ({model_type})",
                        "capabilities": self._infer_tags(name),
                        "source": "ollama_cli",
                    })
            except Exception:
                pass

        # 3. Fallback to local manifest directory inspection across all Ollama roots
        if not discovered:
            try:
                base_dir = Path.home() / ".ollama"
                custom_models = os.environ.get("OLLAMA_MODELS")
                candidate_roots = [
                    base_dir / "manifests",
                    base_dir / "models" / "manifests",
                ]
                if custom_models:
                    cm_path = Path(custom_models)
                    candidate_roots.extend([cm_path, cm_path / "manifests", cm_path / "models" / "manifests"])

                seen_names = set()
                for root in candidate_roots:
                    if not root.exists() or not root.is_dir():
                        continue
                    for p in root.rglob("*"):
                        if p.is_file():
                            rel = p.relative_to(root)
                            parts = rel.parts
                            if len(parts) >= 2:
                                tag = parts[-1]
                                if parts[0] == "registry.ollama.ai":
                                    if parts[1] == "library" and len(parts) == 4:
                                        name = f"{parts[2]}:{tag}"
                                        family = parts[2]
                                    else:
                                        name = f"{'/'.join(parts[1:-1])}:{tag}"
                                        family = parts[-2]
                                else:
                                    name = f"{'/'.join(parts[:-1])}:{tag}"
                                    family = parts[-2]

                                if name in seen_names:
                                    continue
                                seen_names.add(name)

                                size_gb = 0.0
                                quant = "default"
                                try:
                                    m_json = json.loads(p.read_text(encoding="utf-8"))
                                    layers = m_json.get("layers", [])
                                    total_b = sum(int(l.get("size", 0)) for l in layers)
                                    if total_b:
                                        size_gb = round(total_b / (1024 ** 3), 2)
                                    if "q4" in tag.lower() or "q4" in name.lower():
                                        quant = "Q4_K_M"
                                    elif "q8" in tag.lower() or "q8" in name.lower():
                                        quant = "Q8_0"
                                except Exception:
                                    pass

                                # Infer parameter size
                                param_size = tag
                                for p_match in ["32b", "30b", "14b", "8b", "7b", "3b", "70b", "1b"]:
                                    if p_match in tag.lower() or p_match in name.lower():
                                        param_size = p_match.upper()
                                        break

                                model_type = self._infer_model_type(name, family)
                                discovered.append({
                                    "name": name,
                                    "size_gb": size_gb or "local",
                                    "parameter_size": param_size,
                                    "quantization": quant,
                                    "family": family,
                                    "modified_at": "",
                                    "model_type": model_type,
                                    "type": model_type,
                                    "display_name": f"{name} ({model_type})",
                                    "capabilities": self._infer_tags(name, family),
                                    "source": "ollama_manifest_disk",
                                })
            except Exception as ex:
                log.debug("Manifest disk scan error: %s", ex)

        # Sort discovered models by size descending (largest/most capable first)
        if discovered:
            discovered.sort(
                key=lambda m: (float(m["size_gb"]) if isinstance(m.get("size_gb"), (int, float)) else 0.0),
                reverse=True,
            )

        # 4. If no models found, include default presets so selector is never empty
        if not discovered:
            discovered = [
                {
                    "name": "qwen3.5:35b",
                    "size_gb": 21.0,
                    "parameter_size": "35B",
                    "quantization": "Q4_K_M",
                    "family": "qwen",
                    "modified_at": "",
                    "model_type": "Coding",
                    "type": "Coding",
                    "display_name": "qwen3.5:35b (Coding)",
                    "capabilities": ["local", "coding", "reasoning"],
                    "source": "preset_catalog",
                },
                {
                    "name": "qwen2.5-coder:14b",
                    "size_gb": 9.0,
                    "parameter_size": "14B",
                    "quantization": "Q4_K_M",
                    "family": "qwen",
                    "modified_at": "",
                    "model_type": "Coding",
                    "type": "Coding",
                    "display_name": "qwen2.5-coder:14b (Coding)",
                    "capabilities": ["local", "coding"],
                    "source": "preset_catalog",
                },
                {
                    "name": "deepseek-r1:8b",
                    "size_gb": 4.9,
                    "parameter_size": "8B",
                    "quantization": "Q4_K_M",
                    "family": "deepseek",
                    "modified_at": "",
                    "model_type": "Reasoning",
                    "type": "Reasoning",
                    "display_name": "deepseek-r1:8b (Reasoning)",
                    "capabilities": ["local", "reasoning"],
                    "source": "preset_catalog",
                },
                {
                    "name": "llama3.2:latest",
                    "size_gb": 2.0,
                    "parameter_size": "3B",
                    "quantization": "Q4_K_M",
                    "family": "llama",
                    "modified_at": "",
                    "model_type": "General",
                    "type": "General",
                    "display_name": "llama3.2:latest (General)",
                    "capabilities": ["local", "general"],
                    "source": "preset_catalog",
                },
            ]

        self.installed_models = discovered

        # Auto-select active model
        installed_names = [m["name"] for m in self.installed_models]
        if installed_names:
            if not self.active_model or self.active_model not in installed_names:
                self.active_model = installed_names[0]
        elif not self.active_model:
            self.active_model = "llama3.2:latest"

        return self.installed_models

    def get_model_for_dot(self, dot_id: Optional[str] = None) -> str:
        if dot_id:
            key = dot_id.lower().lstrip("@")
            if self.dot_models.get(key):
                return str(self.dot_models[key])
        return self.active_model

    def select_model(self, model_name: str, dot_id: Optional[str] = None) -> Dict[str, Any]:
        """Switches the active model globally (when dot_id is None or 'all') or for a specific Dot."""
        model_name = model_name.strip()
        if not model_name:
            raise ValueError("Model name cannot be empty")

        if dot_id and dot_id.lower() not in ("all", "global", "*"):
            key = dot_id.lower().lstrip("@")
            self.dot_models[key] = model_name
        else:
            self.active_model = model_name
        return self.status()

    def clear_dot_override(self, dot_id: str) -> Dict[str, Any]:
        key = dot_id.lower().lstrip("@")
        if key in self.dot_models:
            self.dot_models[key] = None
        return self.status()

    def chat_with_model(
        self,
        prompt: str,
        dot_id: Optional[str] = None,
        system_prompt: str = "",
        temperature: float = 0.2,
    ) -> Dict[str, Any]:
        """Calls Ollama `/api/chat` using the selected model for `dot_id` (or global active model)."""
        chosen_model = self.get_model_for_dot(dot_id)
        t0 = time.perf_counter()

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": chosen_model,
            "messages": messages,
            "stream": False,
            "options": {"temperature": temperature},
        }
        try:
            resp = self._http_post(f"{self.base_url}/api/chat", payload, 60.0)
            elapsed_ms = round((time.perf_counter() - t0) * 1000, 2)
            msg = (resp.get("message") or {}).get("content", "")
            eval_count = int(resp.get("eval_count", 0) or max(10, len(msg.split()) * 2))
            return {
                "ok": True,
                "live_ollama": True,
                "model": chosen_model,
                "content": msg,
                "latency_ms": elapsed_ms,
                "tokens": eval_count,
                "energy_joules": round((elapsed_ms / 1000.0) * 15.0, 4),
            }
        except Exception as e:
            elapsed_ms = round((time.perf_counter() - t0) * 1000, 2)
            return {
                "ok": False,
                "live_ollama": False,
                "model": chosen_model,
                "error": str(e),
                "latency_ms": elapsed_ms,
            }

    def status(self) -> Dict[str, Any]:
        return {
            "base_url": self.base_url,
            "daemon_online": self.daemon_online,
            "active_model": self.active_model,
            "dot_models": {
                k: (v or self.active_model) for k, v in self.dot_models.items()
            },
            "dot_overrides": self.dot_models,
            "installed_count": len(self.installed_models),
            "installed_models": self.installed_models,
            "models": self.installed_models,
        }
