"""Browser Adapter Package."""
from .worker import BrowserReceipt, BrowserWorker
from .playwright_fallback import PlaywrightBrowser

__all__ = [
    "BrowserReceipt",
    "BrowserWorker",
    "PlaywrightBrowser",
]
