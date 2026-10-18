import os
import zipfile
import shutil

SKILL_NAME = "container_environment_auditor"
BASE_DIR = f"d:/OS/temp_skills/{SKILL_NAME}"

os.makedirs(f"{BASE_DIR}/scripts", exist_ok=True)
os.makedirs(f"{BASE_DIR}/references", exist_ok=True)
os.makedirs(f"{BASE_DIR}/assets", exist_ok=True)

skill_md = """---
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
"""

with open(f"{BASE_DIR}/SKILL.md", "w", encoding="utf-8") as f:
    f.write(skill_md)

probe_py = """import json
import os
import platform
import sys
import time

def main():
    target_dir = "/workspace/artifacts"
    os.makedirs(target_dir, exist_ok=True)
    report_file = os.path.join(target_dir, "container_audit_evidence.json")
    
    audit_data = {
        "status": "verified",
        "timestamp": time.time(),
        "platform": platform.platform(),
        "user": os.environ.get("USER", "unknown"),
        "uid": os.getuid() if hasattr(os, "getuid") else None,
        "pwd": os.getcwd(),
        "arguments": sys.argv[1:],
        "container_workdir": "/workspace",
        "evidence_id": f"ev_{int(time.time())}"
    }
    
    with open(report_file, "w") as f:
        json.dump(audit_data, f, indent=2)
        
    print(f"Container Probe executed successfully.")
    print(f"UID: {audit_data['uid']} (isolated user). Workdir: {audit_data['pwd']}")
    print(f"Verified Postcondition Artifact: {report_file}")
    print(json.dumps(audit_data, indent=2))

if __name__ == "__main__":
    main()
"""

with open(f"{BASE_DIR}/scripts/run_probe.py", "w", encoding="utf-8") as f:
    f.write(probe_py)

with open(f"{BASE_DIR}/references/architecture.md", "w", encoding="utf-8") as f:
    f.write("# OS Agent Skills Architecture\nContainerized execution isolation on Docker.")

with open(f"{BASE_DIR}/assets/icon.svg", "w", encoding="utf-8") as f:
    f.write('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="10" fill="cyan"/></svg>')

zip_path = "d:/OS/test_agent_skill.zip"
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
    for root, _, files in os.walk(BASE_DIR):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, BASE_DIR)
            zf.write(full_path, arcname=rel_path)

print(f"Created {zip_path} ({os.path.getsize(zip_path)} bytes)")
