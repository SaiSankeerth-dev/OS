---
name: container_environment_auditor
version: 1.2.0
author: OS Systems Engineering
license: MIT
description: Audits Docker virtual desktop container environment, verifies disk write postconditions, and collects kernel telemetry.
capabilities:
  - container_execution
  - postcondition_verification
  - file_audit
allowed_tools:
  - python3
  - terminal
permissions:
  host_access: false
  virtual_computer: true
---

# Container Environment Auditor

Executes container probes inside `/workspace/skills/container_environment_auditor` in the `os-virtual-desktop` environment.

## Verification Protocol
All actions must write a machine-readable audit trail to `/workspace/artifacts/container_audit_evidence.json` and exit with code 0.
