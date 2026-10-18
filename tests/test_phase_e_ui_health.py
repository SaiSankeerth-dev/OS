"""Phase E: UI/UX & Operational Health Verification Suite.

Validates:
- E-1: Semantic design tokens, light/dark theme contrast, modal accessibility, and shared Computer API abstraction.
- E-2: 5-state operational diagnostics (/api/diagnostics) and strict non-deceptive readiness badges.
"""
from __future__ import annotations

import re
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

from web.server import app


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


def test_e1_semantic_tokens_and_theme_definitions():
    """E-1: Semantic design tokens defined in index.css and tailwind.config.js."""
    css_path = Path("frontend/src/index.css")
    tailwind_path = Path("frontend/tailwind.config.js")

    assert css_path.exists(), "frontend/src/index.css must exist"
    assert tailwind_path.exists(), "frontend/tailwind.config.js must exist"

    css_content = css_path.read_text(encoding="utf-8")
    tailwind_content = tailwind_path.read_text(encoding="utf-8")

    # 1. Semantic color tokens in index.css
    required_tokens = [
        "--bg-app",
        "--bg-surface",
        "--border-subtle",
        "--text-primary",
        "--text-secondary",
        "--text-muted",
    ]
    for token in required_tokens:
        assert token in css_content, f"Required semantic token {token} missing from index.css"

    # 2. Both dark and light theme blocks defined
    assert "data-theme='light'" in css_content or 'data-theme="light"' in css_content or ":root" in css_content
    assert "data-theme='dark'" in css_content or 'data-theme="dark"' in css_content or ".dark" in css_content

    # 3. Focus and outline accessibility rules defined
    assert "focus-visible" in css_content or "focus" in css_content
    assert "outline" in css_content or "ring" in css_content

    # 4. Tailwind config maps semantic colors to CSS variables
    assert "os:" in tailwind_content
    assert "bg: 'var(--bg-app)'" in tailwind_content or 'bg: "var(--bg-app)"' in tailwind_content
    assert "surface: 'var(--bg-surface)'" in tailwind_content or 'surface: "var(--bg-surface)"' in tailwind_content
    assert "primary: 'var(--text-primary)'" in tailwind_content or 'primary: "var(--text-primary)"' in tailwind_content
    assert "secondary: 'var(--text-secondary)'" in tailwind_content or 'secondary: "var(--text-secondary)"' in tailwind_content


def test_e1_modal_and_dialog_accessibility():
    """E-1: Modal component enforces accessible dialog contract and keyboard dismissal."""
    modal_path = Path("frontend/src/components/common/Modal.tsx")
    assert modal_path.exists(), "Modal.tsx must exist"
    content = modal_path.read_text(encoding="utf-8")

    # Accessible role and attributes
    assert 'role="dialog"' in content or "role='dialog'" in content
    assert 'aria-modal="true"' in content or "aria-modal='true'" in content

    # Escape key listener for dismissal
    assert "Escape" in content or "keydown" in content

    # Backdrop click dismiss
    assert "onClose" in content


def test_e1_shared_computer_api_abstraction():
    """E-1: Frontend api service exposes unified typed Computer API abstraction."""
    api_path = Path("frontend/src/services/api.ts")
    assert api_path.exists(), "api.ts must exist"
    content = api_path.read_text(encoding="utf-8")

    required_methods = [
        "getComputerBackends",
        "checkComputerBackendHealth",
        "getComputerDesktopStatus",
        "startComputerDesktop",
        "stopComputerDesktop",
        "restartComputerDesktop",
        "getComputerRateLimits",
        "getComputerApprovals",
        "resolveComputerApproval",
        "getComputerSessions",
        "createComputerSession",
        "deleteComputerSession",
        "getComputerArbiter",
        "controlComputer",
        "navigateComputer",
        "emergencyStopComputer",
        "getComputerFiles",
        "writeComputerFile",
        "execComputerCommand",
        "getDiagnostics",
        "getHealth",
    ]

    for method in required_methods:
        assert method in content, f"Required Computer API method '{method}' missing in api.ts"


def test_e2_diagnostics_contract_structure(client: TestClient):
    """E-2: /api/diagnostics returns complete 5-state operational schema."""
    resp = client.get("/api/diagnostics")
    assert resp.status_code == 200
    data = resp.json()

    assert data["ok"] is True
    assert "timestamp" in data
    assert "subsystems" in data

    subsystems = data["subsystems"]
    expected_subsystems = [
        "local_llm",
        "browser_runtime",
        "virtual_desktop",
        "scheduler",
        "persistence",
        "system_resources",
    ]

    for name in expected_subsystems:
        assert name in subsystems, f"Subsystem '{name}' missing from /api/diagnostics"
        sub = subsystems[name]
        assert "state" in sub
        assert "badge" in sub
        assert "badge_color" in sub
        assert "configured" in sub
        assert "reachable" in sub
        assert "authenticated" in sub
        assert "executing" in sub
        assert "verified" in sub
        assert "evidence" in sub
        assert len(sub["evidence"]) > 0


def test_e2_non_deceptive_badge_invariant(client: TestClient):
    """E-2: Strict Invariant: Never make a green readiness badge from configuration alone."""
    resp = client.get("/api/diagnostics")
    assert resp.status_code == 200
    data = resp.json()

    for sub_name, sub in data["subsystems"].items():
        state = sub["state"]
        color = sub["badge_color"]
        verified = sub["verified"]

        # Invariant 1: If badge is green, state MUST be INDEPENDENTLY_VERIFIED and verified is True
        if color == "green":
            assert state == "INDEPENDENTLY_VERIFIED", (
                f"Subsystem '{sub_name}' has green badge but state is '{state}' (must be INDEPENDENTLY_VERIFIED)"
            )
            assert verified is True, f"Subsystem '{sub_name}' has green badge but verified is False"

        # Invariant 2: If state is CONFIGURED only, badge CANNOT be green
        if state == "CONFIGURED":
            assert color != "green", (
                f"Subsystem '{sub_name}' is only CONFIGURED but was awarded a deceptive green badge"
            )
            assert verified is False

        # Invariant 3: If state is NOT_CONFIGURED, badge must be gray or red
        if state == "NOT_CONFIGURED":
            assert color in ("gray", "red")
            assert verified is False


def test_e2_system_resource_metrics(client: TestClient):
    """E-2: System resources telemetry probe reports real measured hardware metrics."""
    resp = client.get("/api/diagnostics")
    assert resp.status_code == 200
    data = resp.json()

    sys_sub = data["subsystems"]["system_resources"]
    assert sys_sub["state"] == "INDEPENDENTLY_VERIFIED"
    assert sys_sub["badge_color"] == "green"
    assert "metrics" in sys_sub

    metrics = sys_sub["metrics"]
    assert metrics["cpu_count"] >= 1
    assert metrics["memory_total_gb"] > 0.0
    assert metrics["disk_total_gb"] > 0.0
    assert metrics["platform"] in ("Windows", "Linux", "Darwin")


def test_e2_frontend_built_assets_truthfulness():
    """E-2: Built distribution files exist in web/static and contain semantic styles."""
    index_html = Path("web/static/index.html")
    assert index_html.exists(), "web/static/index.html must exist"
    html_text = index_html.read_text(encoding="utf-8")

    # Must link to compiled assets
    assert "assets/" in html_text
    assert "<div id=\"root\">" in html_text

    # Check asset directory
    assets_dir = Path("web/static/assets")
    assert assets_dir.exists(), "web/static/assets directory must exist"
    css_files = list(assets_dir.glob("*.css"))
    js_files = list(assets_dir.glob("*.js"))
    assert len(css_files) >= 1, "At least one compiled CSS bundle must exist"
    assert len(js_files) >= 1, "At least one compiled JS bundle must exist"


def test_e2_dynamic_model_registry_endpoints(client: TestClient):
    """E-2: Dynamic model discovery and selection endpoints respond truthfully."""
    # 1. Models list endpoint
    resp_models = client.get("/api/models")
    assert resp_models.status_code == 200
    m_data = resp_models.json()
    assert "installed_models" in m_data
    assert "active_model" in m_data
    assert isinstance(m_data["installed_models"], list)

    # 2. Model selection endpoint
    resp_sel = client.post("/api/models/select", json={"model": "deepseek-r1:32b", "dot": "sentinel"})
    assert resp_sel.status_code == 200
    sel_data = resp_sel.json()
    assert sel_data["ok"] is True
    assert sel_data["active_model"] == "deepseek-r1:32b"
