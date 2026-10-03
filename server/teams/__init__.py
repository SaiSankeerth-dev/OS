"""Phase 5: dynamic agent teams.

The supervisor can split a complex request into sub-tasks and run a
small team of worker agents in parallel, then verify each result and
synthesize one answer.

Rules (from the locked plan):
- Pydantic AI only. No CrewAI / LangGraph / AutoGen.
- Workers are isolated: pure reasoning agents with NO tool access.
  Anything needing a tool goes back through the supervisor's safety
  pipeline, never around it.
- Workers never trust each other: every worker result is independently
  verified before synthesis. Failed verifications are dropped, not
  retried silently.
- Budgets: max workers, per-worker timeout, team-level cancel
  (STOP / CANCEL / PAUSE preserved).
- Best-effort LLM: planning and synthesis use the local Ollama model;
  rule-based fallbacks keep the team working when it is down.
"""
from .team import Team, TeamResult
from .worker import WorkerAgent

__all__ = ["Team", "TeamResult", "WorkerAgent"]
