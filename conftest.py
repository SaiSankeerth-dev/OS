"""Pytest config: ensure project root is on sys.path."""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

try:
    import numpy as np
    if not hasattr(np, 'long'):
        np.long = int
    if not hasattr(np, 'ulong'):
        np.ulong = int
    import numpy.exceptions
    if not hasattr(np.exceptions, 'RankWarning'):
        np.exceptions.RankWarning = getattr(np, 'RankWarning', Warning)
except Exception:
    pass