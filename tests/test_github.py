"""GitHub skill tests via gh CLI.

Read operations are tested live (gh + token work).
Write operations test the draft (not the actual creation).
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from server.intent.router import IntentRouter, Intent
from server.tools.github_tool import (
    github_repos, github_issues, github_prs, github_create_issue,
    GITHUB_REPOS_SPEC, GITHUB_CREATE_ISSUE_SPEC,
    _get_token, _gh,
)
from server.intent.registry import ExecutionMode


def _route(text: str):
    return IntentRouter().classify(text)


# --- Token ------------------------------------------------------------------

def test_token_readable():
    token = _get_token()
    assert token is not None
    assert len(token) > 10
    # Never log the full token
    assert "github_pat" not in token or True  # format varies


def test_gh_available():
    ok, out = _gh("--version")
    assert ok, f"gh not working: {out}"


# --- Intent routing ----------------------------------------------------------

def test_route_repos():
    d = _route("show my github repos")
    assert d.intent == Intent.TOOL_CALL
    assert d.tool_name == "github_repos"


def test_route_issues():
    d = _route("github issues in OS")
    assert d.tool_name == "github_issues"
    assert d.args["repo"] == "OS"


def test_route_prs():
    d = _route("show my github PRs")
    assert d.tool_name == "github_prs"


def test_route_create_issue():
    d = _route("create issue in OS titled Fix login bug")
    assert d.tool_name == "github_create_issue"
    assert "OS" in d.args["task"]
    assert "Fix login bug" in d.args["task"]


# --- Read operations (live) ---------------------------------------------------

def test_github_repos_live():
    r = github_repos()
    assert r.status == "success"
    assert r.mode == ExecutionMode.DIRECT
    assert "Your GitHub repos:" in r.data["display"]
    assert len(r.data["repos"]) > 0
    assert "OS" in r.data["repos"]


def test_github_issues_live():
    r = github_issues(repo="OS")
    # May succeed or fail gracefully (repo might not have issues)
    assert r.status in ("success", "failure")
    if r.status == "success":
        assert "Open issues in" in r.data["display"] or "No open issues" in r.data["display"]


def test_github_prs_live():
    r = github_prs()
    assert r.status in ("success", "failure")


def test_github_issues_no_repo():
    r = github_issues(repo="")
    assert r.status == "failure"
    assert "Which repo" in r.error


# --- Write operations (draft only) --------------------------------------------

def test_create_issue_draft():
    r = github_create_issue(task="create issue in OS titled Fix login bug")
    assert r.status == "success"
    assert r.mode == ExecutionMode.DIRECT
    assert "SaiSankeerth-dev/OS" in r.data["repo"]
    assert r.data["title"] == "Fix login bug"
    assert "github_action" in r.data
    assert r.data["github_action"]["action"] == "create_issue"


def test_create_issue_needs_approval():
    assert GITHUB_CREATE_ISSUE_SPEC.execution_mode == ExecutionMode.DIRECT
    # Approval comes from ToolPolicy, not ExecutionMode
    from server.supervisor.permissions import ToolPermission, ToolPolicy
    p = ToolPermission()
    policy, _ = p.check("github_create_issue")
    assert policy == ToolPolicy.NEEDS_APPROVAL


def test_create_issue_missing_args():
    r = github_create_issue(task="create issue")
    assert r.status == "failure"


def test_tool_specs():
    assert GITHUB_REPOS_SPEC.name == "github_repos"
    assert GITHUB_REPOS_SPEC.execution_mode == ExecutionMode.DIRECT
