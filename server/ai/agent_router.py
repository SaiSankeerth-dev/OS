"""Specialized Agent Router for OS.

Enforces Section 22 & 33 of the PRD/TRD:
OS dispatches work to specialized workers rather than a single monolithic agent:
- Coding Worker (OpenCode)
- Browser Worker (agent-browser → Playwright fallback)
- Research Worker (DDGS quick search → GPT Researcher deep research)
- Skill Worker (gstack coding/QA/design workflows)

Tracks every worker invocation in the `agent_runs` repository for full observability.
"""
from __future__ import annotations

import logging
from typing import Any, Optional

from adapters.browser import BrowserWorker
from adapters.opencode import CodingTaskConfig, OpenCodeAdapter, OpenCodeVerifier
from adapters.research import ResearchWorker
from adapters.gstack import GstackAdapter
from server.domain.entities import AgentRun
from server.domain.enums import AgentRunStatus
from server.db.repositories.world import WorldModelRepository
from server.db.database import get_db

log = logging.getLogger("os.ai.agent_router")


class AgentRouter:
    def __init__(
        self,
        opencode_adapter: Optional[OpenCodeAdapter] = None,
        browser_worker: Optional[BrowserWorker] = None,
        research_worker: Optional[ResearchWorker] = None,
        gstack_adapter: Optional[GstackAdapter] = None,
        world_repo: Optional[WorldModelRepository] = None,
    ) -> None:
        db = get_db()
        self.opencode = opencode_adapter or OpenCodeAdapter()
        self.browser = browser_worker or BrowserWorker()
        self.research = research_worker or ResearchWorker(world_repo)
        self.gstack = gstack_adapter or GstackAdapter()
        self.world_repo = world_repo or WorldModelRepository(db)

    def route_task(
        self,
        task_type: str,  # coding, browser, research, gstack
        instruction: str,
        user_id: str = "default_user",
        task_id: Optional[str] = None,
        parameters: Optional[dict[str, Any]] = None,
    ) -> dict[str, Any]:
        params = parameters or {}

        # 1. Record Agent Run in database
        run = AgentRun(
            user_id=user_id,
            agent_type=task_type,
            workflow_type=f"specialized_{task_type}",
            task_id=task_id,
            status=AgentRunStatus.RUNNING,
            input_reference={"instruction": instruction, "parameters": params},
        )
        self.world_repo.record_agent_run(run)

        try:
            if task_type in ("coding", "opencode"):
                config = CodingTaskConfig(
                    task_id=task_id or run.id,
                    instruction=instruction,
                    workspace_dir=params.get("workspace_dir", None),
                )
                opencode_run_id = self.opencode.start_task(config)

                # Execute edits if provided
                edits = params.get("edits", {})
                test_cmd = params.get("test_cmd", None)
                if edits:
                    res = self.opencode.execute_sync(opencode_run_id, edits=edits, test_cmd=test_cmd)
                    run.status = AgentRunStatus.SUCCEEDED if res.success else AgentRunStatus.FAILED
                    run.output_reference = {
                        "files_changed": res.files_changed,
                        "tests_passed": res.tests_passed,
                        "diff": res.diff[:1000],
                    }
                else:
                    run.status = AgentRunStatus.SUCCEEDED
                    run.output_reference = {"run_id": opencode_run_id, "status": "initialized"}

                self.world_repo.update_agent_run(run)
                return {"agent": "opencode", "run_id": run.id, "worker_run_id": opencode_run_id, "status": run.status.value}

            elif task_type in ("browser", "web"):
                session_id = params.get("session_id", f"sess_{run.id}")
                url = params.get("url", "https://google.com")
                action = params.get("action", "navigate")

                if action == "navigate":
                    receipt = self.browser.navigate(session_id, url)
                elif action == "extract":
                    text = self.browser.extract_text(session_id)
                    run.status = AgentRunStatus.SUCCEEDED
                    run.output_reference = {"text": text[:2000]}
                    self.world_repo.update_agent_run(run)
                    return {"agent": "browser", "run_id": run.id, "text": text}
                elif action == "click":
                    ref = params.get("ref", params.get("selector", ""))
                    receipt = self.browser.click(session_id, ref)
                elif action == "screenshot":
                    receipt = self.browser.screenshot(session_id, params.get("path"))
                elif action == "submit_form":
                    receipt = self.browser.submit_form(session_id, params.get("form_data", {}))
                else:
                    receipt = self.browser.navigate(session_id, url)

                run.status = AgentRunStatus.SUCCEEDED if receipt.status == "SUCCEEDED" else AgentRunStatus.FAILED
                run.output_reference = {"receipt": receipt.details, "url": receipt.url}
                self.world_repo.update_agent_run(run)
                return {"agent": "browser", "run_id": run.id, "receipt": receipt}

            elif task_type in ("research", "study"):
                mode = params.get("mode", None)  # "quick", "deep", or None (auto)
                report = self.research.conduct_research(
                    instruction, user_id=user_id, mode=mode,
                )
                run.status = AgentRunStatus.SUCCEEDED
                run.output_reference = {
                    "summary": report.summary,
                    "findings_count": len(report.findings),
                    "report_type": report.report_type,
                }
                self.world_repo.update_agent_run(run)
                return {"agent": "research", "run_id": run.id, "report": report}

            elif task_type in ("gstack", "skill", "workflow"):
                skill_name = params.get("skill", "review")
                context = params.get("context", instruction)
                workspace = params.get("workspace", None)
                result = self.gstack.invoke_skill(
                    skill_name, context=context, workspace=workspace,
                )
                run.status = (
                    AgentRunStatus.SUCCEEDED
                    if result.status == "SUCCEEDED"
                    else AgentRunStatus.FAILED
                )
                run.output_reference = {
                    "skill": result.skill,
                    "status": result.status,
                    "output_preview": result.output[:500],
                }
                self.world_repo.update_agent_run(run)
                return {"agent": "gstack", "run_id": run.id, "result": result}

            else:
                raise ValueError(f"Unknown specialized agent type: '{task_type}'")

        except Exception as e:
            log.exception("Agent dispatch failed for %s", task_type)
            run.status = AgentRunStatus.FAILED
            run.error = {"message": str(e)}
            self.world_repo.update_agent_run(run)
            raise
