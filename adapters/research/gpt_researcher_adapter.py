"""GPT Researcher Adapter for OS.

Wraps the `gpt-researcher` Python package (pip install gpt-researcher)
for deep multi-source research with citations and provenance.

Architecture:
  OS ResearchRouter → GPTResearcherAdapter → gpt-researcher library
                                            → web sources
                                            → structured report + citations

Config via env vars or OS config:
  - FAST_LLM, SMART_LLM, STRATEGIC_LLM (format: provider:model)
  - RETRIEVER (default: "duckduckgo")
  - OLLAMA_BASE_URL (for local LLM)
"""
from __future__ import annotations

import asyncio
import logging
import os
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Optional

log = logging.getLogger("os.adapters.research.gpt_researcher")


@dataclass
class GPTResearchResult:
    """Structured result from GPT Researcher."""
    query: str
    report: str
    sources: list[dict[str, str]] = field(default_factory=list)
    research_context: str = ""
    costs: dict[str, Any] = field(default_factory=dict)
    report_type: str = "research_report"
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


class GPTResearcherAdapter:
    """OS adapter for GPT Researcher (pip install gpt-researcher).

    Provides async deep research with configurable LLM backends
    (Ollama, OpenAI, Anthropic, etc.) and DuckDuckGo as the default
    free retriever.
    """

    def __init__(
        self,
        *,
        fast_llm: Optional[str] = None,
        smart_llm: Optional[str] = None,
        strategic_llm: Optional[str] = None,
        retriever: str = "duckduckgo",
        ollama_base_url: Optional[str] = None,
    ) -> None:
        # Set env vars for gpt-researcher config
        if fast_llm:
            os.environ.setdefault("FAST_LLM", fast_llm)
        if smart_llm:
            os.environ.setdefault("SMART_LLM", smart_llm)
        if strategic_llm:
            os.environ.setdefault("STRATEGIC_LLM", strategic_llm)
        os.environ.setdefault("RETRIEVER", retriever)
        if ollama_base_url:
            os.environ.setdefault("OLLAMA_BASE_URL", ollama_base_url)

        self._available: Optional[bool] = None

    def is_available(self) -> bool:
        """Check if gpt-researcher package is installed."""
        if self._available is None:
            try:
                import gpt_researcher  # noqa: F401
                self._available = True
            except ImportError:
                self._available = False
                log.warning(
                    "gpt-researcher not installed. "
                    "Run: pip install gpt-researcher"
                )
        return self._available

    async def research(
        self,
        query: str,
        *,
        report_type: str = "research_report",
        tone: str = "objective",
        max_sources: int = 10,
    ) -> GPTResearchResult:
        """Conduct deep research using GPT Researcher.

        Args:
            query: Research question
            report_type: One of research_report, detailed_report,
                        outline_report, resource_report, custom_report
            tone: Report tone (objective, formal, analytical, etc.)
            max_sources: Max web sources to consult

        Returns:
            GPTResearchResult with report text, sources, and costs.
        """
        if not self.is_available():
            return GPTResearchResult(
                query=query,
                report="[GPT Researcher not installed] Unable to conduct deep research.",
                report_type=report_type,
            )

        try:
            from gpt_researcher import GPTResearcher

            researcher = GPTResearcher(
                query=query,
                report_type=report_type,
                report_source="web",
                tone=tone,
            )

            # Phase 1: Conduct research (search + scrape + analyze)
            log.info("GPT Researcher: conducting research on '%s'", query[:80])
            await researcher.conduct_research()

            # Phase 2: Generate report
            report_text = await researcher.write_report()

            # Extract provenance
            source_urls = researcher.get_source_urls()
            research_sources = researcher.get_research_sources()
            context = researcher.get_research_context()
            costs = researcher.get_costs()

            sources = []
            for url in source_urls[:max_sources]:
                sources.append({"url": url, "type": "web"})

            # Merge with research_sources if available
            if isinstance(research_sources, list):
                for src in research_sources:
                    if isinstance(src, dict) and src.get("url"):
                        if src["url"] not in [s["url"] for s in sources]:
                            sources.append({
                                "url": src.get("url", ""),
                                "title": src.get("title", ""),
                                "type": "web",
                            })

            log.info(
                "GPT Researcher: completed. %d sources, cost=%s",
                len(sources), costs,
            )

            return GPTResearchResult(
                query=query,
                report=report_text,
                sources=sources,
                research_context=context if isinstance(context, str) else str(context),
                costs=costs if isinstance(costs, dict) else {"raw": costs},
                report_type=report_type,
            )

        except Exception as exc:
            log.exception("GPT Researcher failed for query: %s", query[:80])
            return GPTResearchResult(
                query=query,
                report=f"[Research failed] {type(exc).__name__}: {exc}",
                report_type=report_type,
            )

    def research_sync(
        self,
        query: str,
        **kwargs,
    ) -> GPTResearchResult:
        """Synchronous wrapper around async research()."""
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            loop = None

        if loop and loop.is_running():
            # We're inside an existing event loop — run in a thread
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
                future = pool.submit(asyncio.run, self.research(query, **kwargs))
                return future.result(timeout=300)
        else:
            return asyncio.run(self.research(query, **kwargs))
