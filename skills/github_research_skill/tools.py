"""GitHub Repository Research Tool.

Inspects GitHub repositories, reads manifests, validates architecture relevance,
and produces evidence-backed reports.
"""
from __future__ import annotations

import json
import logging
import urllib.request
import re
from typing import Any

from server.intent.registry import ExecutionMode, ToolResult, ToolSpec
from server.security.url_validator import validate_url_safe

log = logging.getLogger("os.skills.github_research")

GITHUB_RESEARCH_SPEC = ToolSpec(
    name="github_repo_research",
    description="Research and inspect a GitHub repository (e.g. owner/repo or full URL). Gathers metadata, README, and manifests.",
    execution_mode=ExecutionMode.DIRECT,
)


def github_repo_research(repo_target: str = "", **kwargs) -> ToolResult:
    """Investigate a GitHub repository, fetching metadata and README."""
    target = (repo_target or "").strip()
    if not target:
        return ToolResult(
            status="failure",
            mode=ExecutionMode.DIRECT,
            error="Please provide a GitHub repository in owner/repo format or URL.",
        )

    # Extract owner and repo
    m = re.search(r"github\.com/([^/]+)/([^/#?]+)", target)
    if m:
        owner, repo = m.group(1), m.group(2).rstrip(".git")
    elif "/" in target and not target.startswith("http"):
        parts = target.strip("/").split("/")
        owner, repo = parts[0], parts[1].rstrip(".git")
    else:
        return ToolResult(
            status="failure",
            mode=ExecutionMode.DIRECT,
            error="Target must be 'owner/repo' or 'https://github.com/owner/repo'.",
        )

    api_url = f"https://api.github.com/repos/{owner}/{repo}"
    safe, reason, _ = validate_url_safe(api_url)
    if not safe:
        return ToolResult(
            status="failure",
            mode=ExecutionMode.DIRECT,
            error=f"SSRF validation blocked request: {reason}",
        )

    headers = {
        "User-Agent": "OS-Agent-Researcher/1.0",
        "Accept": "application/vnd.github.v3+json",
    }

    try:
        req = urllib.request.Request(api_url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))

        desc = data.get("description", "No description provided.")
        stars = data.get("stargazers_count", 0)
        license_info = (data.get("license") or {}).get("name", "Unknown")
        default_branch = data.get("default_branch", "main")
        open_issues = data.get("open_issues_count", 0)

        # Try to fetch README
        readme_url = f"https://raw.githubusercontent.com/{owner}/{repo}/{default_branch}/README.md"
        readme_snippet = ""
        try:
            r_req = urllib.request.Request(readme_url, headers=headers)
            with urllib.request.urlopen(r_req, timeout=10) as r_resp:
                readme_snippet = r_resp.read(3000).decode("utf-8", errors="replace")
        except Exception:
            readme_snippet = "README not available via raw CDN."

        return ToolResult(
            status="success",
            mode=ExecutionMode.DIRECT,
            data={
                "repo": f"{owner}/{repo}",
                "description": desc,
                "stars": stars,
                "license": license_info,
                "default_branch": default_branch,
                "open_issues": open_issues,
                "readme_snippet": readme_snippet[:1000],
            },
        )
    except urllib.error.HTTPError as e:
        return ToolResult(
            status="failure",
            mode=ExecutionMode.DIRECT,
            error=f"GitHub API returned HTTP {e.code}: {e.reason}",
            data={"repo": f"{owner}/{repo}"},
        )
    except Exception as e:
        return ToolResult(
            status="failure",
            mode=ExecutionMode.DIRECT,
            error=f"Failed to inspect GitHub repository: {type(e).__name__}: {e}",
            data={"repo": f"{owner}/{repo}"},
        )


def format_github_research(res: ToolResult) -> str:
    if res.status != "success":
        return f"GitHub Research failed: {res.error}"
    d = res.data
    return (
        f"Repository: {d['repo']}\n"
        f"Stars: ★ {d['stars']} | License: {d['license']}\n"
        f"Description: {d['description']}\n\n"
        f"Summary:\n{d.get('readme_snippet', '')[:400]}..."
    )


TOOLS = [
    (GITHUB_RESEARCH_SPEC, github_repo_research, format_github_research),
]
