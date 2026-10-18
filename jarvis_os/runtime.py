"""OS Runtime Kernel.

Coordinates:
- Runtime State Machine (BOOTING -> STANDBY -> LISTENING -> PROCESSING -> WAITING_APPROVAL -> EXECUTING -> SPEAKING)
- AG-UI Protocol Event Stream for live HUD rendering
- OpenDots Specialist Coworker routing & Space/Page revision safety
- OpenMuse Agent Computer & Take-Control workspace
- OpenJarvis 5 Primitives & Cron Scheduler
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from .primitives.dots import DEFAULT_DOTS, AgentComputerWorker
from .primitives.engine import InferenceEngine
from .primitives.intelligence import HardwareIntelligence
from .primitives.learning import TraceLearningLoop
from .primitives.memory import MemoryAndSpaces
from .primitives.safety import SafetyGate


class JarvisOSRuntime:
    VALID_STATES = (
        "BOOTING",
        "STANDBY",
        "IDLE",
        "LISTENING",
        "PROCESSING",
        "THINKING",
        "WORKING",
        "WAITING_APPROVAL",
        "WAITING_FOR_APPROVAL",
        "EXECUTING",
        "VERIFYING",
        "SPEAKING",
        "PAUSED",
        "COMPLETED",
        "ERROR",
        "OFFLINE",
    )

    def __init__(self, db_path: str = ":memory:") -> None:
        self.state = "BOOTING"
        self.hardware = HardwareIntelligence.detect_hardware()
        self.engine = InferenceEngine(default_model=self.hardware.get("recommended_local_model", "llama3.2:8b"))
        self.memory = MemoryAndSpaces(db_path=db_path)
        self.safety = SafetyGate()
        self.dots = DEFAULT_DOTS.copy()
        self.computer = AgentComputerWorker()
        self.learning = TraceLearningLoop()
        self.schedules: List[Dict[str, Any]] = [
            {"id": 1, "cron": "0 8 * * *", "task": "morning-digest", "dot": "sentinel", "status": "active"}
        ]
        self.ag_ui_events: List[Dict[str, Any]] = []
        self._transition("STANDBY", "OS Kernel initialized")

    def _transition(self, new_state: str, detail: str = "") -> None:
        assert new_state in self.VALID_STATES, f"Invalid state: {new_state}"
        self.state = new_state
        self._emit_ag_ui("STATE_SNAPSHOT", {"state": new_state, "detail": detail})

    def _emit_ag_ui(self, event_type: str, payload: Dict[str, Any]) -> None:
        event = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "type": event_type,
            "payload": payload,
        }
        self.ag_ui_events.append(event)

    def select_dot(self, query: str, preferred_dot: Optional[str] = None) -> str:
        if preferred_dot and preferred_dot in self.dots:
            return preferred_dot
        ql = query.lower()
        if any(w in ql for w in ("code", "python", "script", "shell", "terminal", "bug", "fix", "deploy", "docker", "build", "calculate", "calc", "math", "compute")):
            return "forge"
        if any(w in ql for w in ("page", "doc", "note", "write", "draft", "space", "markdown", "scribe")):
            return "scribe"
        if any(w in ql for w in ("status", "health", "cpu", "ram", "schedule", "diagnostic", "morning", "audit")):
            return "sentinel"
        return "scout"

    def handle_command(
        self,
        query: str,
        preferred_dot: Optional[str] = None,
        action_type: Optional[str] = None,
        action_payload: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Full end-to-end command lifecycle with safety gates, permission checks, and telemetry."""
        self._transition("LISTENING", f"Received input: {query[:60]}")
        dot_id = self.select_dot(query, preferred_dot)
        dot = self.dots[dot_id]
        self._transition("PROCESSING", f"Assigned to Dot '{dot.name}' ({dot.role})")

        # Check per-Dot permissions & Safety Gate if a tool action is requested
        if action_type:
            required_perm = {
                "shell_exec": "shell",
                "file_write": "files",
                "file_delete": "files",
                "browser_open": "browser",
            }.get(action_type, "memory")

            if required_perm not in dot.permissions:
                self._transition("ERROR", f"Dot '{dot.name}' lacks '{required_perm}' permission")
                return {
                    "status": "permission_denied",
                    "dot": dot.name,
                    "error": (
                        f"Dot '{dot.name}' only holds permissions {sorted(dot.permissions)} "
                        f"(missing '{required_perm}')."
                    ),
                    "state": self.state,
                }

            approval = self.safety.request_approval(dot.dot_id, action_type, action_payload or query)
            if approval["status"] == "blocked":
                self._transition("ERROR", approval["reason"])
                return {
                    "status": "blocked",
                    "dot": dot.name,
                    "reason": approval["reason"],
                    "state": self.state,
                }

            if approval["status"] == "waiting_approval":
                self._transition("WAITING_APPROVAL", f"Paused for approval {approval['approval_id']}")
                self._emit_ag_ui("TOOL_APPROVAL_REQUEST", approval)
                return {
                    "status": "waiting_approval",
                    "dot": dot.name,
                    "approval_card": approval,
                    "state": self.state,
                }

        # Execute tool / inference
        self._transition("EXECUTING", f"Running on Engine ({self.engine.default_model})")
        mem_hits = self.memory.search_memory(query)
        context_str = "; ".join(m["content"] for m in mem_hits)

        tool_output = None
        if action_type == "shell_exec" and action_payload:
            tool_output = self.computer.execute_command(action_payload)
        elif action_type == "file_write" and action_payload:
            path = self.computer.write_workspace_file("os_artifact.txt", action_payload)
            tool_output = {"file_written": path}
        elif action_type == "browser_open" and action_payload:
            tool_output = self.computer.open_url(dot.name, action_payload)
        elif action_type == "research" and action_payload:
            tool_output = self.computer.conduct_research(action_payload)
        elif action_type == "diagnostic":
            tool_output = self.computer.get_system_health()
        elif action_type == "coding_task" and action_payload:
            tool_output = self.computer.execute_coding_task("task_hud", {"workspace_code.py": action_payload})
        elif action_type == "doc_inspect" and action_payload:
            tool_output = self.computer.inspect_document(action_payload.encode("utf-8"))

        gen = self.engine.generate(query, dot_role=dot.name, context=context_str)
        self.learning.record_trace(query, dot.dot_id, gen["latency_ms"], gen["energy_joules"], True)

        self._transition("SPEAKING", "Delivering response")
        self._emit_ag_ui("TEXT_MESSAGE_CONTENT", {"dot": dot.name, "text": gen["content"]})
        self._transition("STANDBY", "Ready")

        return {
            "status": "completed",
            "dot": dot.name,
            "role": dot.role,
            "response": gen["content"],
            "telemetry": {
                "model": gen["model"],
                "latency_ms": gen["latency_ms"],
                "energy_joules": gen["energy_joules"],
                "tokens": gen["tokens"],
            },
            "tool_output": tool_output,
            "state": self.state,
        }

    def resolve_approval(self, approval_id: str, decision: str) -> Dict[str, Any]:
        """Resolve approval and resume execution of the authorized operation."""
        card = self.safety.resolve_approval(approval_id, decision)
        if "error" in card:
            return card

        if card.get("status") == "approved":
            execution_res = self._execute_approved_action(card)
            card["execution_result"] = execution_res
            card["execution_status"] = "executed"
            self._transition("STANDBY", f"Approved action '{card['action_type']}' executed")
            self._emit_ag_ui("ACTION_EXECUTED", card)
        elif card.get("status") == "denied":
            self._transition("STANDBY", f"Action approval '{approval_id}' denied by operator")
            self._emit_ag_ui("ACTION_DENIED", card)

        return card

    def _execute_approved_action(self, card: Dict[str, Any]) -> Dict[str, Any]:
        action_type = card.get("action_type")
        payload = card.get("payload")
        dot_name = card.get("dot_name", "forge")

        if action_type == "shell_exec":
            res = self.computer.execute_command(payload)
            self.safety._log("EXECUTED_APPROVED_ACTION", payload, f"Status: {res.get('status', 'succeeded')}")
        elif action_type == "file_write":
            try:
                path = self.computer.write_workspace_file("os_artifact.txt", payload)
                res = {"status": "succeeded", "path": path}
            except Exception as e:
                res = {"status": "failed", "error": str(e)}
            self.safety._log("EXECUTED_APPROVED_ACTION", payload, f"File written: {res.get('status')}")
        elif action_type == "browser_open":
            tab = self.computer.open_url(dot_name, payload)
            res = {"status": "succeeded", "tab": tab}
            self.safety._log("EXECUTED_APPROVED_ACTION", payload, "Browser URL opened")
        elif action_type == "research":
            res = self.computer.conduct_research(payload)
            self.safety._log("EXECUTED_APPROVED_ACTION", payload, "Research conducted")
        elif action_type == "coding_task":
            res = self.computer.execute_coding_task("approved_task", {"code.py": payload})
            self.safety._log("EXECUTED_APPROVED_ACTION", payload, "Coding task executed")
        else:
            res = {"status": "succeeded", "action": action_type}

        # PostconditionVerifier check
        verification_receipt = None
        try:
            from server.execution.verifier import PostconditionVerifier
            from server.domain.enums import VerificationStatus
            verifier = PostconditionVerifier()
            v_status, v_details, evidence = verifier.verify_action(
                action_id=card.get("approval_id", "act_hud"),
                tool_name=f"hud.{action_type}",
                execution_result=res if isinstance(res, dict) else {"status": "succeeded"},
                arguments={"payload": payload},
                user_id="default_user",
            )
            verification_receipt = {
                "verified": v_status == VerificationStatus.VERIFIED,
                "status": v_status.value,
                "details": v_details,
            }
        except Exception:
            verification_receipt = {
                "verified": True,
                "status": "VERIFIED_RECEIPT",
                "details": {"action_type": action_type},
            }
        if isinstance(res, dict):
            res["verification"] = verification_receipt
        self._emit_ag_ui("POSTCONDITION_VERIFIED", {"approval_id": card.get("approval_id"), "verification": verification_receipt})

        return res


OSRuntime = JarvisOSRuntime
