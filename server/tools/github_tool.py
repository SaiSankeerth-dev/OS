"""GitHub tools via gh CLI.

Uses the `gh` command-line tool with GH_TOKEN from ~/.git-credentials-os.
All operations are scoped to the user's own GitHub account.

Read operations (list repos, issues, PRs) are DIRECT.
Write operations (create issue, comment) are NEEDS_APPROVAL.
"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
from pathlib import Path

from server.intent.registry import ExecutionMode, ToolResult, ToolSpec


def _get_token() -> str | None:
    """Read the GitHub token from the credentials file (never log it)."""
    cred_path = Path.home() / ".git-credentials-os"
    if not cred_path.exists():
        return None
    try:
        for line in cred_path.read_text().splitlines():
            if "x-access-token" in line and "github.com" in line:
                # https://x-access-token:<token>@github.com/...
                start = line.find("x-access-token:") + len("x-access-token:")
                end = line.find("@github.com")
                if start > 0 and end > start:
                    return line[start:end]
    except Exception:
        pass
    return None


def _gh(*args: str, timeout: int = 30) -> tuple[bool, str]:
    """Run gh with the token. Returns (success, output)."""
    if not shutil.which("gh"):
        return False, "gh CLI not installed"
    token = _get_token()
    if not token:
        return False, "GitHub token not found"
    env = dict(os.environ)
    env["GH_TOKEN"] = token
    # Note: do NOT clear proxy vars — gh needs the runtime proxy
    # to reach api.github.com.
    try:
        result = subprocess.run(
            ["gh"] + list(args),
            capture_output=True, text=True, timeout=timeout, env=env,
        )
        if result.returncode == 0:
            return True, result.stdout.strip()
        return False, result.stderr.strip() or f"gh failed (code {result.returncode})"
    except subprocess.TimeoutExpired:
        return False, "gh timed out"
    except Exception as e:
        return False, f"{type(e).__name__}: {e}"


# --- Read operations (DIRECT) ------------------------------------------------

def github_repos(**kwargs) -> ToolResult:
    """List the user's GitHub repositories."""
    ok, out = _gh("repo", "list", "--limit", "20",
                  "--json", "name,description,isPrivate,updatedAt")
    if not ok:
        return ToolResult(status="failure", mode=ExecutionMode.DIRECT, error=out)
    try:
        repos = json.loads(out)
    except json.JSONDecodeError:
        return ToolResult(status="failure", mode=ExecutionMode.DIRECT,
                          error="Couldn't parse repo list")
    if not repos:
        return ToolResult(status="success", mode=ExecutionMode.DIRECT,
                          data={"display": "No repositories found."})
    lines = []
    for r in repos:
        priv = "private" if r.get("isPrivate") else "public"
        desc = (r.get("description") or "")[:60]
        lines.append(f"- {r['name']} ({priv}) {desc}")
    return ToolResult(
        status="success", mode=ExecutionMode.DIRECT,
        data={"display": "Your GitHub repos:\n" + "\n".join(lines),
              "repos": [r["name"] for r in repos]},
    )


def format_github_repos(result: ToolResult) -> str:
    if result.status == "failure":
        return result.error or "Couldn't list repos."
    return result.data["display"]


GITHUB_REPOS_SPEC = ToolSpec(
    name="github_repos",
    description="List your GitHub repositories. Usage: show my github repos",
    execution_mode=ExecutionMode.DIRECT,
)


def github_issues(repo: str = "", **kwargs) -> ToolResult:
    """List open issues in a repo."""
    repo = (repo or "").strip()
    if not repo:
        return ToolResult(status="failure", mode=ExecutionMode.DIRECT,
                          error="Which repo? Try 'github issues in OS'.")
    # Allow short name; prefix with owner
    if "/" not in repo:
        repo = f"SaiSankeerth-dev/{repo}"
    ok, out = _gh("issue", "list", "--repo", repo, "--limit", "10",
                  "--json", "number,title,state,createdAt")
    if not ok:
        return ToolResult(status="failure", mode=ExecutionMode.DIRECT, error=out)
    try:
        issues = json.loads(out)
    except json.JSONDecodeError:
        return ToolResult(status="failure", mode=ExecutionMode.DIRECT,
                          error="Couldn't parse issues")
    if not issues:
        return ToolResult(status="success", mode=ExecutionMode.DIRECT,
                          data={"display": f"No open issues in {repo}."})
    lines = [f"- #{i['number']}: {i['title']}" for i in issues]
    return ToolResult(
        status="success", mode=ExecutionMode.DIRECT,
        data={"display": f"Open issues in {repo}:\n" + "\n".join(lines)},
    )


def format_github_issues(result: ToolResult) -> str:
    if result.status == "failure":
        return result.error or "Couldn't list issues."
    return result.data["display"]


GITHUB_ISSUES_SPEC = ToolSpec(
    name="github_issues",
    description="List open issues in a repo. Usage: github issues in OS",
    execution_mode=ExecutionMode.DIRECT,
)


def github_prs(**kwargs) -> ToolResult:
    """List the user's open pull requests."""
    ok, out = _gh("pr", "list", "--author", "@me", "--limit", "10",
                  "--json", "number,title,repository,state")
    if not ok:
        return ToolResult(status="failure", mode=ExecutionMode.DIRECT, error=out)
    try:
        prs = json.loads(out)
    except json.JSONDecodeError:
        return ToolResult(status="failure", mode=ExecutionMode.DIRECT,
                          error="Couldn't parse PRs")
    if not prs:
        return ToolResult(status="success", mode=ExecutionMode.DIRECT,
                          data={"display": "No open pull requests."})
    lines = []
    for p in prs:
        repo = p.get("repository", {}).get("name", "?")
        lines.append(f"- #{p['number']}: {p['title']} ({repo})")
    return ToolResult(
        status="success", mode=ExecutionMode.DIRECT,
        data={"display": "Your open PRs:\n" + "\n".join(lines)},
    )


def format_github_prs(result: ToolResult) -> str:
    if result.status == "failure":
        return result.error or "Couldn't list PRs."
    return result.data["display"]


GITHUB_PRS_SPEC = ToolSpec(
    name="github_prs",
    description="List your open pull requests. Usage: show my github PRs",
    execution_mode=ExecutionMode.DIRECT,
)


# --- Write operations (NEEDS_APPROVAL) ----------------------------------------

def github_create_issue(repo: str = "", title: str = "", body: str = "",
                        task: str = "", **kwargs) -> ToolResult:
    """Draft a GitHub issue. Executes only after approval."""
    # Parse from full text if repo/title not given directly:
    # "create issue in OS titled Fix bug"
    if task and (not repo or not title):
        import re
        m = re.match(
            r"^\s*create\s+(?:github\s+)?issue\s+in\s+(\S+)\s+"
            r"titled\s+(.+?)\s*$",
            task, re.IGNORECASE,
        )
        if m:
            repo, title = m.group(1).strip(), m.group(2).strip()
    repo = (repo or "").strip()
    title = (title or "").strip()
    if not repo or not title:
        return ToolResult(
            status="failure", mode=ExecutionMode.DIRECT,
            error="Need a repo and title. Try 'create issue in OS titled Fix login bug'.",
        )
    if "/" not in repo:
        repo = f"SaiSankeerth-dev/{repo}"
    action = {"action": "create_issue", "repo": repo,
              "title": title, "body": body or ""}
    return ToolResult(
        status="success", mode=ExecutionMode.DIRECT,
        data={
            "repo": repo, "title": title, "body": body or "",
            "draft": f"Create GitHub issue in {repo}:\nTitle: {title}\n"
                     + (f"Body: {body[:200]}\n" if body else ""),
            "github_action": action,
            # action_args lets the approval executor run it (like browser_action)
            "action_args": {"kind": "github", "github_action": action},
        },
    )


def format_github_create_issue(result: ToolResult) -> str:
    if result.status == "failure":
        return result.error or "Couldn't draft issue."
    return result.data["draft"]


GITHUB_CREATE_ISSUE_SPEC = ToolSpec(
    name="github_create_issue",
    description="Draft a GitHub issue (needs approval). Usage: create issue in OS titled Fix bug",
    execution_mode=ExecutionMode.DIRECT,
)


def execute_github_action(action: dict) -> str:
    """Execute an approved GitHub write action. Called from the
    approval-completion path."""
    kind = action.get("action")
    if kind == "create_issue":
        repo = action["repo"]
        cmd = ["issue", "create", "--repo", repo, "--title", action["title"]]
        if action.get("body"):
            cmd += ["--body", action["body"]]
        ok, out = _gh(*cmd)
        if ok:
            return f"Issue created in {repo}."
        return f"Failed to create issue: {out}"
    return f"Unknown GitHub action: {kind}"


GITHUB_TOOLS = [
    (GITHUB_REPOS_SPEC, github_repos, format_github_repos),
    (GITHUB_ISSUES_SPEC, github_issues, format_github_issues),
    (GITHUB_PRS_SPEC, github_prs, format_github_prs),
    (GITHUB_CREATE_ISSUE_SPEC, github_create_issue, format_github_create_issue),
]
