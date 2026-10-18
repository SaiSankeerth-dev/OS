"""Enterprise OS Runtime Kernel.

Combines:
- GStack disciplined development framework
- Hardware Intelligence & Energy Telemetry
- OpenMuse Agent Computer & Take-Control workspace
- OpenDots Specialist Coworkers, HITL Approvals & Revision-Checked Spaces
- LinkedIn & YouTube Skill Connectors
"""
from __future__ import annotations

from typing import Any, Callable, Dict, Optional

from .integrations.social_connectors import LinkedInConnector, YouTubeConnector
from .primitives.octop_harness import (
    DualACPBridge,
    OctopHarnessProcessor,
    PeerTeamInbox,
    TieredOctopMemory,
    execute_multi_dot_dag,
)
from .runtime import JarvisOSRuntime


class EnterpriseJarvisRuntime(JarvisOSRuntime):
    """Enterprise runtime with social connectors, Octop harness, and persistent agent workspace."""

    def __init__(self, db_path: str = ":memory:") -> None:
        super().__init__(db_path=db_path)
        self.linkedin = LinkedInConnector()
        self.youtube = YouTubeConnector()
        self.octop_processor = OctopHarnessProcessor(
            db_path="data/octop_checkpoints.db" if db_path != ":memory:" else ":memory:"
        )
        self.octop_memory = TieredOctopMemory()
        self.peer_inbox = PeerTeamInbox()
        self.acp_bridge = DualACPBridge(kernel=self)
        if hasattr(self, "learning"):
            self.learning.octop_memory = self.octop_memory

    def execute_dag(
        self,
        user_goal: str,
        on_step_callback: Optional[Callable[[Dict[str, Any]], None]] = None,
    ) -> Dict[str, Any]:
        """Execute 4-stage Multi-Dot pipeline: Scout -> Forge -> Sentinel & Scribe."""
        return execute_multi_dot_dag(self, user_goal, on_step_callback=on_step_callback)

    def execute_enterprise_task(
        self, query: str, preferred_dot: Optional[str] = None
    ) -> Dict[str, Any]:
        ql = query.lower()

        # YouTube skill routing
        if "youtube" in ql or "video" in ql:
            summary = self.youtube.summarize_video("https://youtube.com/watch?v=openmuse-breakdown", query)
            self.memory.remember(f"Indexed YouTube: {summary['title']}", category="research", tags="youtube,video")
            return {
                "status": "completed",
                "dot": "Scout",
                "integration": "YouTube",
                "result": summary,
            }

        # LinkedIn skill routing
        if "linkedin" in ql or "post" in ql:
            post = self.linkedin.format_post("OS & OpenMuse Integration", ["Local-first AI", "HITL Approval Gates", "3D Cyber-HUD"])
            return {
                "status": "completed",
                "dot": "Scribe",
                "integration": "LinkedIn",
                "result": post,
            }

        # Standard Kernel execution
        res = self.handle_command(query, preferred_dot=preferred_dot)
        return {
            "status": "completed",
            "dot": preferred_dot or "forge",
            "response": res.get("response", f"Processed enterprise command: {query}"),
            "telemetry": res.get("telemetry"),
            "state": self.state,
        }
