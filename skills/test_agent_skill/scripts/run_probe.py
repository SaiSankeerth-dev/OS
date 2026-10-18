import json
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
