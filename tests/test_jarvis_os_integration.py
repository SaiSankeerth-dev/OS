"""Integration tests for OS Cyber-HUD, OpenJarvis, OpenMuse, and OpenDots primitives."""
import unittest
from jarvis_os.runtime import JarvisOSRuntime
from jarvis_os.enterprise_runtime import EnterpriseJarvisRuntime


class TestJarvisOSIntegration(unittest.TestCase):
    def setUp(self):
        self.kernel = JarvisOSRuntime(db_path=":memory:")

    def test_openjarvis_hardware_and_local_math(self):
        self.assertIn("recommended_local_model", self.kernel.hardware)
        res = self.kernel.handle_command("calculate 137 * 42", preferred_dot="forge")
        self.assertEqual(res["status"], "completed")
        self.assertIn("5754", res["response"])
        self.assertGreater(res["telemetry"]["latency_ms"], 0)

    def test_open_jarvis_destructive_command_block(self):
        res = self.kernel.handle_command(
            "Clean root filesystem",
            preferred_dot="forge",
            action_type="shell_exec",
            action_payload="rm -rf / --no-preserve-root",
        )
        self.assertEqual(res["status"], "blocked")
        self.assertEqual(self.kernel.state, "ERROR")

    def test_opendots_permission_isolation(self):
        # Scout only has {'browser', 'memory'}, NOT 'shell'
        res = self.kernel.handle_command(
            "Run shell build",
            preferred_dot="scout",
            action_type="shell_exec",
            action_payload="pytest",
        )
        self.assertEqual(res["status"], "permission_denied")

    def test_opendots_hitl_approval_flow(self):
        # Forge has 'shell', so risky action pauses for approval
        res = self.kernel.handle_command(
            "Run container build",
            preferred_dot="forge",
            action_type="shell_exec",
            action_payload="docker build -t openmuse-computer:local .",
        )
        self.assertEqual(res["status"], "waiting_approval")
        self.assertEqual(self.kernel.state, "WAITING_APPROVAL")
        apr_id = res["approval_card"]["approval_id"]

        # Approve with 'always_allow'
        resolved = self.kernel.safety.resolve_approval(apr_id, "always_allow")
        self.assertEqual(resolved["status"], "approved")

        # Subsequent call auto-approves
        res2 = self.kernel.handle_command(
            "Run container build again",
            preferred_dot="forge",
            action_type="shell_exec",
            action_payload="docker ps",
        )
        self.assertEqual(res2["status"], "completed")

    def test_opendots_spaces_revision_collision_guard(self):
        r1 = self.kernel.memory.save_page("engineering-hq", "arch-doc", "Architecture", "# v1", "Sai")
        self.assertEqual(r1["revision"], 1)

        # Valid update expecting revision 1 -> becomes revision 2
        r2 = self.kernel.memory.save_page(
            "engineering-hq", "arch-doc", "Architecture", "# v2", "Scribe", expected_revision=1
        )
        self.assertEqual(r2["status"], "updated")
        self.assertEqual(r2["revision"], 2)

        # Stale edit expecting revision 1 -> must fail with conflict
        r_conflict = self.kernel.memory.save_page(
            "engineering-hq", "arch-doc", "Architecture", "# stale", "Scout", expected_revision=1
        )
        self.assertEqual(r_conflict["status"], "conflict")

    def test_openmuse_agent_computer_and_take_control(self):
        state1 = self.kernel.computer.toggle_take_control(True)
        self.assertEqual(state1["computer_mode"], "HUMAN_CONTROL")
        state2 = self.kernel.computer.toggle_take_control(False)
        self.assertEqual(state2["computer_mode"], "AGENT_AUTONOMOUS")

        res = self.kernel.handle_command(
            "Save build log",
            preferred_dot="forge",
            action_type="file_write",
            action_payload="Build succeeded",
        )
        # First time triggers approval
        self.assertEqual(res["status"], "waiting_approval")

    def test_openjarvis_trace_learning_optimize(self):
        self.kernel.handle_command("morning briefing", preferred_dot="sentinel")
        opt = self.kernel.learning.optimize()
        self.assertEqual(opt["status"], "optimized")
        self.assertGreaterEqual(opt["total_traces"], 1)

    def test_enterprise_runtime_social_skills(self):
        ent = EnterpriseJarvisRuntime(db_path=":memory:")
        yt = ent.execute_enterprise_task("Summarize YouTube video on OpenMuse")
        self.assertEqual(yt["status"], "completed")
        self.assertEqual(yt["integration"], "YouTube")

        li = ent.execute_enterprise_task("Draft LinkedIn post on AI OS")
        self.assertEqual(li["status"], "completed")
        self.assertEqual(li["integration"], "LinkedIn")
        self.assertIn("content", li["result"])


if __name__ == "__main__":
    unittest.main()
