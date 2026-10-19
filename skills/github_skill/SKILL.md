---
name: github
description: GitHub via gh CLI. List repos, issues, PRs; draft issues (needs approval).
version: 1.0.0
status: active
---

# GitHub Skill

## Purpose
Connects OS to your GitHub via the `gh` CLI and your stored token.
Read your repos, check issues and PRs, draft new issues.

## Available Tools
- `github_repos()` - list your repos (DIRECT)
- `github_issues(repo)` - open issues in a repo (DIRECT)
- `github_prs()` - your open PRs (DIRECT)
- `github_create_issue(repo, title, body)` - draft an issue (NEEDS_APPROVAL)

## Examples
- `show my github repos`
- `github issues in OS`
- `show my github PRs`
- `create issue in OS titled Fix login bug`

## Safety
- Reads are DIRECT (harmless).
- Writes (create issue) are draft-only until you approve the exact title/repo.
- Token never leaves the machine; read from ~/.git-credentials-os.
- `repo` + `workflow` scopes: full repo access, no account settings.

## Requirements
- `gh` CLI installed
- Token at ~/.git-credentials-os (already set up)
