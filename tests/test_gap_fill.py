"""Integration tests for OS Gap Fill.

Tests the four new components:
1. Browser Adapter (agent-browser + Playwright fallback)
2. Research Adapter (DDGS quick + GPT Researcher deep)
3. Background Scheduler
4. gstack Integration
5. Config loading for new sections
6. Agent Router with new adapters
"""
from __future__ import annotations

import sys
import os
from pathlib import Path

# Ensure project root is on path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import pytest


# ============================================================
# 1. Browser Adapter Tests
# ============================================================

class TestBrowserWorker:
    """Test BrowserWorker with automatic fallback logic."""

    def test_import(self):
        from adapters.browser import BrowserWorker, BrowserReceipt, PlaywrightBrowser
        assert BrowserWorker is not None
        assert BrowserReceipt is not None
        assert PlaywrightBrowser is not None

    def test_browser_receipt_fields(self):
        from adapters.browser.worker import BrowserReceipt
        r = BrowserReceipt(
            action="navigate",
            url="https://example.com",
            status="SUCCEEDED",
        )
        assert r.action == "navigate"
        assert r.url == "https://example.com"
        assert r.status == "SUCCEEDED"
        assert r.status_code == 200
        assert r.screenshot_path is None
        assert r.created_at is not None

    def test_worker_instantiation(self):
        from adapters.browser.worker import BrowserWorker
        worker = BrowserWorker()
        assert worker is not None
        # Should detect whether agent-browser is on PATH
        assert isinstance(worker._use_ab, bool)

    def test_navigate_returns_receipt(self):
        """Navigate should return a BrowserReceipt regardless of backend."""
        from adapters.browser.worker import BrowserWorker, BrowserReceipt
        worker = BrowserWorker(prefer_playwright=True)
        # With no Playwright installed, this will fall through to error receipt
        receipt = worker.navigate("test_session", "https://example.com")
        assert isinstance(receipt, BrowserReceipt)
        assert receipt.action == "navigate"
        assert receipt.url == "https://example.com"

    def test_extract_text_fallback(self):
        from adapters.browser.worker import BrowserWorker
        worker = BrowserWorker()
        text = worker.extract_text("nonexistent_session")
        assert isinstance(text, str)

    def test_ab_run_handles_missing_binary(self):
        from adapters.browser.worker import _ab_run
        result = _ab_run(["nonexistent_command"], session_id="test")
        assert result["ok"] is False


class TestPlaywrightFallback:
    """Test PlaywrightBrowser module existence (not actual Playwright)."""

    def test_module_import(self):
        from adapters.browser.playwright_fallback import PlaywrightBrowser
        assert PlaywrightBrowser is not None


# ============================================================
# 2. Research Adapter Tests
# ============================================================

class TestResearchWorker:
    """Test ResearchWorker with quick and deep modes."""

    def test_import(self):
        from adapters.research import (
            ResearchWorker, ResearchFinding, ResearchReport,
            GPTResearcherAdapter, GPTResearchResult,
        )
        assert ResearchWorker is not None
        assert ResearchFinding is not None
        assert ResearchReport is not None
        assert GPTResearcherAdapter is not None
        assert GPTResearchResult is not None

    def test_finding_fields(self):
        from adapters.research.researcher import ResearchFinding
        f = ResearchFinding(
            claim="Test claim",
            source_title="Test source",
            source_url="https://example.com",
            evidence_text="Test evidence",
        )
        assert f.confidence == 0.85
        assert f.claim == "Test claim"

    def test_report_fields(self):
        from adapters.research.researcher import ResearchReport
        r = ResearchReport(
            query="test query",
            summary="test summary",
        )
        assert r.report_type == "quick"
        assert r.raw_report == ""
        assert r.sources_consulted == 0

    def test_classify_depth_quick(self):
        from adapters.research.researcher import ResearchWorker
        rw = ResearchWorker()
        assert rw._classify_depth("weather today") == "quick"
        assert rw._classify_depth("stock price") == "quick"

    def test_classify_depth_deep(self):
        from adapters.research.researcher import ResearchWorker
        rw = ResearchWorker()
        assert rw._classify_depth("comprehensive analysis of AI safety") == "deep"
        assert rw._classify_depth("compare React vs Vue in-depth") == "deep"
        assert rw._classify_depth("detailed research on quantum computing") == "deep"

    def test_quick_research_with_sources(self):
        from adapters.research.researcher import ResearchWorker
        rw = ResearchWorker()
        sources = [
            {"title": "Test", "url": "https://test.com", "snippet": "Hello", "confidence": 0.9},
        ]
        report = rw.conduct_research("test query", sources_data=sources, mode="quick")
        assert report.report_type == "quick"
        assert len(report.findings) == 1
        assert report.findings[0].source_url == "https://test.com"


class TestGPTResearcherAdapter:
    """Test GPTResearcherAdapter module."""

    def test_instantiation(self):
        from adapters.research.gpt_researcher_adapter import GPTResearcherAdapter
        adapter = GPTResearcherAdapter(retriever="duckduckgo")
        # is_available() depends on whether gpt-researcher is pip-installed
        available = adapter.is_available()
        assert isinstance(available, bool)

    def test_result_dataclass(self):
        from adapters.research.gpt_researcher_adapter import GPTResearchResult
        r = GPTResearchResult(
            query="test",
            report="test report",
        )
        assert r.report_type == "research_report"
        assert r.sources == []
        assert r.costs == {}


# ============================================================
# 3. Background Scheduler Tests
# ============================================================

class TestOSScheduler:
    """Test OSScheduler creation and job listing."""

    def test_import(self):
        from server.scheduler import OSScheduler
        assert OSScheduler is not None

    def test_instantiation(self):
        from server.scheduler.engine import OSScheduler
        scheduler = OSScheduler()
        assert scheduler is not None
        assert not scheduler.is_running()

    def test_list_jobs(self):
        from server.scheduler.engine import OSScheduler
        scheduler = OSScheduler()
        jobs = scheduler.list_jobs()
        assert len(jobs) == 5
        names = [j["name"] for j in jobs]
        assert "morning_plan" in names
        assert "email_scan" in names
        assert "deadline_check" in names
        assert "approval_nag" in names
        assert "watcher_eval" in names

    def test_custom_jobs(self):
        from server.scheduler.engine import OSScheduler
        custom = [
            {"name": "custom_job", "cron": "0 12 * * *", "handler": "test", "enabled": True},
        ]
        scheduler = OSScheduler(jobs=custom)
        jobs = scheduler.list_jobs()
        assert len(jobs) == 1
        assert jobs[0]["name"] == "custom_job"

    @pytest.mark.asyncio
    async def test_run_job_now(self):
        from server.scheduler.engine import OSScheduler
        scheduler = OSScheduler()
        result = await scheduler.run_job_now("morning_plan")
        assert result["job"] == "morning_plan"
        assert result["status"] == "completed"

    @pytest.mark.asyncio
    async def test_start_stop(self):
        from server.scheduler.engine import OSScheduler
        scheduler = OSScheduler()
        await scheduler.start()
        assert scheduler.is_running()
        await scheduler.stop()
        assert not scheduler.is_running()

    @pytest.mark.asyncio
    async def test_run_unknown_job_raises(self):
        from server.scheduler.engine import OSScheduler
        scheduler = OSScheduler()
        with pytest.raises(ValueError, match="Unknown job"):
            await scheduler.run_job_now("nonexistent_job")

    def test_get_history(self):
        from server.scheduler.engine import OSScheduler
        scheduler = OSScheduler()
        history = scheduler.get_history()
        assert isinstance(history, list)


# ============================================================
# 4. gstack Integration Tests
# ============================================================

class TestGstackAdapter:
    """Test GstackAdapter creation and skill listing."""

    def test_import(self):
        from adapters.gstack import GstackAdapter
        assert GstackAdapter is not None

    def test_instantiation(self):
        from adapters.gstack.adapter import GstackAdapter
        adapter = GstackAdapter()
        assert adapter is not None

    def test_list_skills(self):
        from adapters.gstack.adapter import GstackAdapter
        adapter = GstackAdapter()
        skills = adapter.list_skills()
        assert len(skills) >= 10
        skill_names = [s["name"] for s in skills]
        assert "review" in skill_names
        assert "qa" in skill_names
        assert "ship" in skill_names
        assert "security" in skill_names

    def test_invoke_unknown_skill(self):
        from adapters.gstack.adapter import GstackAdapter
        adapter = GstackAdapter()
        result = adapter.invoke_skill("nonexistent_skill")
        assert result.status == "FAILED"
        assert "Unknown skill" in result.output

    def test_invoke_without_install(self):
        """When gstack is not installed, should return NOT_INSTALLED."""
        from adapters.gstack.adapter import GstackAdapter
        # Point to a non-existent directory
        adapter = GstackAdapter(gstack_dir="/tmp/nonexistent_gstack_dir_12345")
        result = adapter.invoke_skill("review")
        assert result.status in ("NOT_INSTALLED", "FAILED")

    def test_result_dataclass(self):
        from adapters.gstack.adapter import GstackResult
        r = GstackResult(skill="test", status="SUCCEEDED", output="ok")
        assert r.skill == "test"
        assert r.created_at is not None


# ============================================================
# 5. Config Tests
# ============================================================

class TestConfig:
    """Test that new config sections load correctly."""

    def test_browser_config(self):
        from config import BrowserConfig
        cfg = BrowserConfig()
        assert cfg.prefer_playwright is False
        assert cfg.session_timeout_sec == 300

    def test_research_config(self):
        from config import ResearchConfig
        cfg = ResearchConfig()
        assert cfg.default_mode == "auto"
        assert cfg.retriever == "duckduckgo"
        assert cfg.max_sources == 10

    def test_scheduler_config(self):
        from config import SchedulerConfig
        cfg = SchedulerConfig()
        assert cfg.enabled is True
        assert cfg.job_store_path == "data/scheduler_jobs.db"

    def test_gstack_config(self):
        from config import GstackConfig
        cfg = GstackConfig()
        assert cfg.enabled is False

    def test_full_config_has_new_fields(self):
        from config import Config
        cfg = Config()
        assert hasattr(cfg, "browser")
        assert hasattr(cfg, "research")
        assert hasattr(cfg, "scheduler")
        assert hasattr(cfg, "gstack")

    def test_load_config(self):
        from config import load_config
        cfg = load_config()
        assert cfg.browser.prefer_playwright is False
        assert cfg.research.default_mode == "auto"
        assert cfg.scheduler.enabled is True
        assert cfg.gstack.enabled is False


# ============================================================
# 6. Agent Router Tests
# ============================================================

class TestAgentRouter:
    """Test AgentRouter with new adapters wired in."""

    def test_import(self):
        from server.ai.agent_router import AgentRouter
        assert AgentRouter is not None

    def test_instantiation(self):
        from server.ai.agent_router import AgentRouter
        router = AgentRouter()
        assert router.browser is not None
        assert router.research is not None
        assert router.gstack is not None
        assert router.opencode is not None

    def test_browser_route(self):
        from server.ai.agent_router import AgentRouter
        router = AgentRouter()
        result = router.route_task(
            "browser",
            "Navigate to example.com",
            parameters={"url": "https://example.com"},
        )
        assert result["agent"] == "browser"
        assert "run_id" in result

    def test_research_route(self):
        from server.ai.agent_router import AgentRouter
        router = AgentRouter()
        result = router.route_task(
            "research",
            "What is Python?",
            parameters={"mode": "quick"},
        )
        assert result["agent"] == "research"
        assert "report" in result

    def test_gstack_route_unknown_skill(self):
        from server.ai.agent_router import AgentRouter
        router = AgentRouter()
        result = router.route_task(
            "gstack",
            "Review the code",
            parameters={"skill": "nonexistent"},
        )
        assert result["agent"] == "gstack"

    def test_unknown_type_raises(self):
        from server.ai.agent_router import AgentRouter
        router = AgentRouter()
        with pytest.raises(ValueError, match="Unknown specialized agent type"):
            router.route_task("quantum_computing", "solve P=NP")
