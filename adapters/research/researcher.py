"""Research Worker for OS — ResearchRouter.

Enforces Section 29 & 66 of the PRD/TRD:
The Research Agent handles:
- Web research & source collection
- Fact extraction & technology comparison
- Multi-source analysis
- Provenance tracking (Claim -> Source -> Evidence -> Confidence)

Architecture:
  OS → ResearchRouter
        ├── Quick Search → DDGS (existing websearch_tool.py)
        └── Deep Research → GPT Researcher (gpt_researcher_adapter.py)
        ↓
  Evidence → OS World Model
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Optional

from server.domain.entities import Evidence
from server.db.repositories.world import WorldModelRepository
from server.db.database import get_db

log = logging.getLogger("os.adapters.research")


# ---------------------------------------------------------------------------
# Data structures (preserved from original for backward compatibility)
# ---------------------------------------------------------------------------

@dataclass
class ResearchFinding:
    claim: str
    source_title: str
    source_url: str
    evidence_text: str
    confidence: float = 0.85


@dataclass
class ResearchReport:
    query: str
    summary: str
    findings: list[ResearchFinding] = field(default_factory=list)
    sources_consulted: int = 0
    report_type: str = "quick"  # "quick" or "deep"
    raw_report: str = ""  # Full GPT Researcher report if deep
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


# ---------------------------------------------------------------------------
# Quick search via existing DDGS websearch_tool
# ---------------------------------------------------------------------------

def _quick_search(query: str, count: int = 5) -> list[dict[str, Any]]:
    """Run a quick DuckDuckGo search using OS's existing websearch_tool."""
    try:
        from server.tools.websearch_tool import web_search
        result = web_search(query=query, count=count)
        if result.status == "success" and result.data:
            return result.data.get("results", [])
    except Exception as exc:
        log.warning("Quick search failed: %s", exc)
    return []


# ---------------------------------------------------------------------------
# ResearchRouter — the main research worker
# ---------------------------------------------------------------------------

class ResearchWorker:
    """Unified research interface for OS.

    Routes research requests to either:
    - Quick Search (DDGS) for simple lookups
    - Deep Research (GPT Researcher) for comprehensive analysis

    Auto-detects mode based on query complexity or explicit mode parameter.
    """

    def __init__(
        self,
        world_repo: Optional[WorldModelRepository] = None,
        *,
        deep_research_config: Optional[dict[str, Any]] = None,
    ) -> None:
        db = get_db()
        self.world_repo = world_repo or WorldModelRepository(db)
        self._deep_adapter = None
        self._deep_config = deep_research_config or {}

    def _get_deep_adapter(self):
        """Lazy-init GPT Researcher adapter."""
        if self._deep_adapter is None:
            from adapters.research.gpt_researcher_adapter import GPTResearcherAdapter
            self._deep_adapter = GPTResearcherAdapter(**self._deep_config)
        return self._deep_adapter

    def _classify_depth(self, query: str) -> str:
        """Heuristic: decide if a query needs quick search or deep research.

        Returns "quick" or "deep".
        """
        deep_signals = [
            "compare", "analysis", "comprehensive", "detailed",
            "research", "investigate", "evaluate", "assess",
            "pros and cons", "trade-off", "in-depth", "thorough",
            "multi-source", "literature", "state of the art",
        ]
        query_lower = query.lower()
        for signal in deep_signals:
            if signal in query_lower:
                return "deep"

        # Short queries → quick
        if len(query.split()) <= 6:
            return "quick"

        return "quick"

    def conduct_research(
        self,
        query: str,
        sources_data: Optional[list[dict[str, Any]]] = None,
        user_id: str = "default_user",
        *,
        mode: Optional[str] = None,  # "quick", "deep", or None (auto)
    ) -> ResearchReport:
        """Conduct research on a query.

        Args:
            query: The research question
            sources_data: Optional pre-provided sources
            user_id: User ID for evidence tracking
            mode: Force "quick" or "deep", or None for auto-detection

        Returns:
            ResearchReport with findings, sources, and provenance.
        """
        research_mode = mode or self._classify_depth(query)
        log.info("Research mode=%s for: %s", research_mode, query[:80])

        if research_mode == "deep":
            return self._deep_research(query, user_id=user_id)
        else:
            return self._quick_research(query, sources_data, user_id=user_id)

    def _quick_research(
        self,
        query: str,
        sources_data: Optional[list[dict[str, Any]]] = None,
        user_id: str = "default_user",
    ) -> ResearchReport:
        """Quick search via DuckDuckGo."""
        sources = sources_data or _quick_search(query, count=5)

        if not sources:
            sources = [{
                "title": f"No results for '{query}'",
                "url": "",
                "snippet": "Search returned no results.",
                "confidence": 0.0,
            }]

        findings: list[ResearchFinding] = []
        for s in sources:
            finding = ResearchFinding(
                claim=f"Search result for {query}: {s.get('snippet', '')[:120]}",
                source_title=s.get("title", "Source"),
                source_url=s.get("url", ""),
                evidence_text=s.get("snippet", ""),
                confidence=float(s.get("confidence", 0.7)),
            )
            findings.append(finding)

            # Store evidence in OS World Model
            ev = Evidence(
                user_id=user_id,
                evidence_type="research_finding",
                title=finding.source_title,
                content=finding.evidence_text,
                uri=finding.source_url,
                metadata={
                    "query": query,
                    "claim": finding.claim,
                    "confidence": finding.confidence,
                    "mode": "quick",
                },
            )
            self.world_repo.create_evidence(ev)

        summary = f"Quick search: {len(findings)} result(s) from DuckDuckGo."
        return ResearchReport(
            query=query,
            summary=summary,
            findings=findings,
            sources_consulted=len(sources),
            report_type="quick",
        )

    def _deep_research(
        self,
        query: str,
        user_id: str = "default_user",
    ) -> ResearchReport:
        """Deep research via GPT Researcher."""
        adapter = self._get_deep_adapter()

        if not adapter.is_available():
            log.warning("GPT Researcher not available, falling back to quick search")
            return self._quick_research(query, user_id=user_id)

        result = adapter.research_sync(query)

        # Convert GPT Researcher output to OS ResearchFindings
        findings: list[ResearchFinding] = []
        for src in result.sources:
            finding = ResearchFinding(
                claim=f"Deep research finding from {src.get('url', 'unknown')}",
                source_title=src.get("title", src.get("url", "Source")),
                source_url=src.get("url", ""),
                evidence_text=src.get("title", ""),
                confidence=0.85,
            )
            findings.append(finding)

            # Store evidence in OS World Model
            ev = Evidence(
                user_id=user_id,
                evidence_type="deep_research_finding",
                title=finding.source_title,
                content=finding.evidence_text[:500],
                uri=finding.source_url,
                metadata={
                    "query": query,
                    "claim": finding.claim,
                    "confidence": finding.confidence,
                    "mode": "deep",
                    "costs": result.costs,
                },
            )
            self.world_repo.create_evidence(ev)

        summary = (
            f"Deep research: {len(findings)} source(s) analyzed by GPT Researcher. "
            f"Report length: {len(result.report)} chars."
        )

        return ResearchReport(
            query=query,
            summary=summary,
            findings=findings,
            sources_consulted=len(result.sources),
            report_type="deep",
            raw_report=result.report,
        )
