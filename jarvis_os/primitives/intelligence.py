"""Hardware Intelligence primitive for OS.

Detects system resources (CPU cores, RAM, GPU, OS/architecture) and maps them
to hardware tiers and recommended local-first models.
"""
from __future__ import annotations

import multiprocessing
import os
import platform
from typing import Any, Dict, List


class HardwareIntelligence:
    MODEL_CATALOG: List[Dict[str, Any]] = [
        {"id": "qwen3.5:35b", "provider": "ollama", "min_ram_gb": 24, "tier": "workstation", "task": "orchestrator"},
        {"id": "qwen2.5-coder:14b", "provider": "ollama", "min_ram_gb": 12, "tier": "desktop", "task": "coding"},
        {"id": "llama3.2:8b", "provider": "ollama", "min_ram_gb": 8, "tier": "laptop", "task": "general"},
        {"id": "qwen2.5:3b", "provider": "ollama", "min_ram_gb": 4, "tier": "edge", "task": "fast_local"},
        {"id": "gemini-2.5-flash", "provider": "cloud_gemini", "min_ram_gb": 0, "tier": "cloud_fallback", "task": "multimodal"},
        {"id": "llama-3.3-70b-versatile", "provider": "cloud_groq", "min_ram_gb": 0, "tier": "cloud_fallback", "task": "fast_cloud"},
    ]

    @classmethod
    def detect_hardware(cls) -> Dict[str, Any]:
        cpu_count = multiprocessing.cpu_count()
        ram_gb = 8.0

        # Try psutil first if available
        try:
            import psutil
            ram_gb = round(psutil.virtual_memory().total / (1024 ** 3), 2)
        except Exception:
            # Fall back to OS-specific methods
            if platform.system() == "Windows":
                try:
                    import ctypes

                    class MEMORYSTATUSEX(ctypes.Structure):
                        _fields_ = [
                            ("dwLength", ctypes.c_ulong),
                            ("dwMemoryLoad", ctypes.c_ulong),
                            ("ullTotalPhys", ctypes.c_ulonglong),
                            ("ullAvailPhys", ctypes.c_ulonglong),
                            ("ullTotalPageFile", ctypes.c_ulonglong),
                            ("ullAvailPageFile", ctypes.c_ulonglong),
                            ("ullTotalVirtual", ctypes.c_ulonglong),
                            ("ullAvailVirtual", ctypes.c_ulonglong),
                            ("sullAvailExtendedVirtual", ctypes.c_ulonglong),
                        ]

                    stat = MEMORYSTATUSEX()
                    stat.dwLength = ctypes.sizeof(MEMORYSTATUSEX)
                    if ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(stat)):
                        ram_gb = round(stat.ullTotalPhys / (1024 ** 3), 2)
                except Exception:
                    pass
            elif hasattr(os, "sysconf") and "SC_PAGE_SIZE" in os.sysconf_names and "SC_PHYS_PAGES" in os.sysconf_names:
                try:
                    ram_bytes = os.sysconf("SC_PAGE_SIZE") * os.sysconf("SC_PHYS_PAGES")
                    ram_gb = round(ram_bytes / (1024 ** 3), 2)
                except Exception:
                    pass

        gpu_vendor = "CPU-Only (Unified/Integrated)"
        if platform.system() == "Darwin" and platform.machine() == "arm64":
            gpu_vendor = "Apple Silicon Unified GPU (MLX / Metal)"
        elif os.path.exists("/proc/driver/nvidia"):
            gpu_vendor = "NVIDIA CUDA GPU"
        else:
            try:
                import torch
                if torch.cuda.is_available():
                    gpu_vendor = f"NVIDIA CUDA ({torch.cuda.get_device_name(0)})"
            except Exception:
                pass

        recommended = "qwen2.5:3b"
        for model in cls.MODEL_CATALOG:
            if model["provider"] == "ollama" and ram_gb >= model["min_ram_gb"]:
                recommended = model["id"]
                break

        return {
            "os": f"{platform.system()} {platform.release()}",
            "arch": platform.machine(),
            "cpu_cores": cpu_count,
            "ram_gb": ram_gb,
            "gpu": gpu_vendor,
            "recommended_local_model": recommended,
            "preferred_engine": "ollama",
        }
