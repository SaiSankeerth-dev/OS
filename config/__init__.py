"""Configuration loader for OS.

Loads `config/settings.yaml`, then overlays `config/local.yaml` if present
(gitignored) for machine-specific overrides without touching the shared file.
"""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import yaml

CONFIG_DIR = Path(__file__).resolve().parent


@dataclass
class LLMConfig:
    provider: str = "ollama"
    base_url: str = "http://localhost:11434"
    model: str = "qwen3:8b"
    temperature: float = 0.6
    max_tokens: int = 256
    stop: list[str] = field(default_factory=list)
    request_timeout_sec: int = 120


@dataclass
class ConversationConfig:
    max_recent_messages: int = 12
    max_relevant_memories: int = 4
    max_task_context_chars: int = 2000


@dataclass
class PersonalityConfig:
    name: str = "JARVIS"
    traits: list[str] = field(default_factory=list)
    forbidden_phrases: list[str] = field(default_factory=list)


@dataclass
class LoggingConfig:
    level: str = "INFO"
    file: str = "logs/os.log"
    perf_file: str = "logs/perf.jsonl"


@dataclass
class VoiceConfig:
    input_device: Any = None  # None=default, str=name substring, int=index
    output_device: Any = None
    sample_rate_in: int = 16000
    sample_rate_out: int = 24000
    channels: int = 1
    chunk_ms: int = 64
    vad_backend: str = "silero"
    vad_threshold: float = 0.5
    aec: str = "nlms"
    aec_filter_len: int = 256
    barge_in_chunks: int = 4
    stt_model: str = "small"
    stt_device: str = "cpu"
    stt_compute_type: str = "int8"
    stt_language: Any = None
    tts_engine: str = "pocket-tts"


@dataclass
class ApprovalsConfig:
    # How long a pending approval waits before it auto-expires.
    timeout_sec: int = 1800
    # Max items in the pending-approval queue; the newest request is
    # refused (fail closed) when the queue is full.
    max_pending: int = 10


@dataclass
class WatcherConfig:
    # Phase 13: proactive watcher. May only suggest - never acts.
    enabled: bool = True
    # Suggest about a pending approval still unanswered after this long.
    nag_after_sec: int = 600
    # Don't repeat the same suggestion within this window.
    cooldown_sec: int = 86400


@dataclass
class BrowserConfig:
    # Primary: agent-browser CLI. Set True to force Playwright.
    prefer_playwright: bool = False
    # Session timeout in seconds.
    session_timeout_sec: int = 300


@dataclass
class ResearchConfig:
    # Default mode: "auto", "quick", or "deep".
    default_mode: str = "auto"
    # GPT Researcher LLM config (format: provider:model_name).
    fast_llm: Any = None
    smart_llm: Any = None
    strategic_llm: Any = None
    # Web search retriever.
    retriever: str = "duckduckgo"
    # Max sources for deep research.
    max_sources: int = 10


@dataclass
class SchedulerConfig:
    # Enable the background scheduler.
    enabled: bool = True
    # SQLite job store path.
    job_store_path: str = "data/scheduler_jobs.db"
    # Per-job overrides (dict of job_name -> {enabled, cron}).
    jobs: dict[str, Any] = field(default_factory=dict)


@dataclass
class GstackConfig:
    # Enable gstack coding/QA/design skills.
    enabled: bool = False
    # Path to gstack installation directory.
    install_dir: Any = None
    # Default workspace for gstack skills.
    workspace_dir: Any = None


@dataclass
class MCPServerEntry:
    name: str = ""
    command: list[str] = field(default_factory=list)
    allowed_tools: list[str] = field(default_factory=list)
    mode: str = "approval"


@dataclass
class MCPConfig:
    enabled: bool = False
    servers: list[MCPServerEntry] = field(default_factory=list)


@dataclass
class Config:
    llm: LLMConfig = field(default_factory=LLMConfig)
    conversation: ConversationConfig = field(default_factory=ConversationConfig)
    personality: PersonalityConfig = field(default_factory=PersonalityConfig)
    logging: LoggingConfig = field(default_factory=LoggingConfig)
    voice: VoiceConfig = field(default_factory=VoiceConfig)
    mcp: MCPConfig = field(default_factory=MCPConfig)
    approvals: ApprovalsConfig = field(default_factory=ApprovalsConfig)
    watcher: WatcherConfig = field(default_factory=WatcherConfig)
    browser: BrowserConfig = field(default_factory=BrowserConfig)
    research: ResearchConfig = field(default_factory=ResearchConfig)
    scheduler: SchedulerConfig = field(default_factory=SchedulerConfig)
    gstack: GstackConfig = field(default_factory=GstackConfig)
    raw: dict[str, Any] = field(default_factory=dict)


def _deep_merge(base: dict, override: dict) -> dict:
    out = dict(base)
    for k, v in override.items():
        if k in out and isinstance(out[k], dict) and isinstance(v, dict):
            out[k] = _deep_merge(out[k], v)
        else:
            out[k] = v
    return out


def load_config(config_dir: Path | None = None) -> Config:
    cfg_dir = config_dir or CONFIG_DIR
    shared = cfg_dir / "settings.yaml"
    local = cfg_dir / "local.yaml"

    data: dict[str, Any] = {}
    if shared.exists():
        data = yaml.safe_load(shared.read_text(encoding="utf-8")) or {}
    if local.exists():
        local_data = yaml.safe_load(local.read_text(encoding="utf-8")) or {}
        data = _deep_merge(data, local_data)

    def get(path: str, default):
        node: Any = data
        for part in path.split("."):
            if not isinstance(node, dict) or part not in node:
                return default
            node = node[part]
        return node

    cfg = Config(
        llm=LLMConfig(
            provider=get("llm.provider", "ollama"),
            # OLLAMA_BASE_URL wins over YAML — this is how Docker points the
            # container at Ollama on the host (http://host.docker.internal:11434).
            base_url=os.environ.get("OLLAMA_BASE_URL")
            or get("llm.base_url", "http://localhost:11434"),
            model=os.environ.get("OLLAMA_MODEL")
            or get("llm.model", "qwen3:8b"),
            temperature=float(get("llm.temperature", 0.6)),
            max_tokens=int(get("llm.max_tokens", 256)),
            stop=get("llm.stop", []) or [],
            request_timeout_sec=int(get("llm.request_timeout_sec", 120)),
        ),
        conversation=ConversationConfig(
            max_recent_messages=int(get("conversation.max_recent_messages", 12)),
            max_relevant_memories=int(get("conversation.max_relevant_memories", 4)),
            max_task_context_chars=int(get("conversation.max_task_context_chars", 2000)),
        ),
        personality=PersonalityConfig(
            name=get("personality.name", "JARVIS"),
            traits=get("personality.traits", []) or [],
            forbidden_phrases=get("personality.forbidden_phrases", []) or [],
        ),
        logging=LoggingConfig(
            level=get("logging.level", "INFO"),
            file=get("logging.file", "logs/os.log"),
            perf_file=get("logging.perf_file", "logs/perf.jsonl"),
        ),
        voice=VoiceConfig(
            input_device=get("voice.input_device", None),
            output_device=get("voice.output_device", None),
            sample_rate_in=int(get("voice.sample_rate_in", 16000)),
            sample_rate_out=int(get("voice.sample_rate_out", 24000)),
            channels=int(get("voice.channels", 1)),
            chunk_ms=int(get("voice.chunk_ms", 64)),
            vad_backend=get("voice.vad_backend", "silero"),
            vad_threshold=float(get("voice.vad_threshold", 0.5)),
            aec=get("voice.aec", "nlms"),
            aec_filter_len=int(get("voice.aec_filter_len", 256)),
            barge_in_chunks=int(get("voice.barge_in_chunks", 4)),
            stt_model=get("voice.stt_model", "small"),
            stt_device=get("voice.stt_device", "cpu"),
            stt_compute_type=get("voice.stt_compute_type", "int8"),
            stt_language=get("voice.stt_language", None),
            tts_engine=get("voice.tts_engine", "pocket-tts"),
        ),
        mcp=MCPConfig(
            enabled=bool(get("mcp.enabled", False)),
            servers=[
                MCPServerEntry(
                    name=str(s.get("name", "")),
                    command=list(s.get("command", []) or []),
                    allowed_tools=list(s.get("allowed_tools", []) or []),
                    mode=str(s.get("mode", "approval")),
                )
                for s in (get("mcp.servers", []) or [])
                if isinstance(s, dict) and s.get("name") and s.get("command")
            ],
        ),
        approvals=ApprovalsConfig(
            timeout_sec=int(get("approvals.timeout_sec", 1800)),
            max_pending=int(get("approvals.max_pending", 10)),
        ),
        watcher=WatcherConfig(
            enabled=bool(get("watcher.enabled", True)),
            nag_after_sec=int(get("watcher.nag_after_sec", 600)),
            cooldown_sec=int(get("watcher.cooldown_sec", 86400)),
        ),
        browser=BrowserConfig(
            prefer_playwright=bool(get("browser.prefer_playwright", False)),
            session_timeout_sec=int(get("browser.session_timeout_sec", 300)),
        ),
        research=ResearchConfig(
            default_mode=get("research.default_mode", "auto"),
            fast_llm=get("research.fast_llm", None),
            smart_llm=get("research.smart_llm", None),
            strategic_llm=get("research.strategic_llm", None),
            retriever=get("research.retriever", "duckduckgo"),
            max_sources=int(get("research.max_sources", 10)),
        ),
        scheduler=SchedulerConfig(
            enabled=bool(get("scheduler.enabled", True)),
            job_store_path=get("scheduler.job_store_path", "data/scheduler_jobs.db"),
            jobs=get("scheduler.jobs", {}) or {},
        ),
        gstack=GstackConfig(
            enabled=bool(get("gstack.enabled", False)),
            install_dir=get("gstack.install_dir", None),
            workspace_dir=get("gstack.workspace_dir", None),
        ),
        raw=data,
    )
    return cfg


_default: Config | None = None


def get_config() -> Config:
    """Return a cached default config (reload per-process)."""
    global _default
    if _default is None:
        _default = load_config()
    return _default


def reload_config() -> Config:
    """Discard the cached config; used by tests and live config edits."""
    global _default
    _default = load_config()
    return _default
