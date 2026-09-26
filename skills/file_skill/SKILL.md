# File Skill

## Purpose
Provides deterministic file system operations for OS.

## Available Tools
- `list_dir(path: str) -> list[str]`
- `read_file(path: str) -> str`
- `write_file(path: str, content: str) -> bool`
- `delete_file(path: str) -> bool`

## Safety
- Confined to OS-approved directories only
- No recursive system file operations
- User confirmation for destructive actions

## Integration
- Registered with ToolsManager
- Executed on demand via /tools execute command
- Skills/SKILL.md describes available operations