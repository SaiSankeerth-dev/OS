"""LinkedIn and YouTube API Skill Connectors for OS.

Adheres to Feature H truthfulness requirements:
- Formats editable LinkedIn drafts with previews
- Requires explicit OAuth credentials for publishing; never reports fake publication
- Retrieves real video metadata via oEmbed / YouTube API
- Summarizes only real retrieved data; never fabricates transcripts or citations
"""
from __future__ import annotations

import json
import logging
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Optional

log = logging.getLogger("os.integrations.social")


class LinkedInConnector:
    """LinkedIn draft generation and publishing with credential-gating."""

    @staticmethod
    def format_post(topic: str, technical_highlights: List[str]) -> Dict[str, Any]:
        bullets = "\n".join(f"• {h}" for h in technical_highlights)
        post_text = (
            f"🚀 Building local-first autonomous AI systems: {topic}\n\n"
            f"{bullets}\n\n"
            f"#ArtificialIntelligence #LocalFirst #OpenSource #OS #Engineering"
        )
        return {
            "platform": "LinkedIn",
            "status": "draft_ready",
            "character_count": len(post_text),
            "content": post_text,
            "can_publish": False,
            "note": "Review draft before publishing. Publishing requires configured LinkedIn OAuth credentials.",
        }

    @staticmethod
    def publish_post(post_text: str, token: Optional[str] = None) -> Dict[str, Any]:
        """Publishing requires a configured official integration and authorization."""
        if not token:
            try:
                from web.store import DashboardStore
                creds = DashboardStore().load_credentials("linkedin")
                token = creds.get("token")
            except Exception:
                pass

        if not token:
            return {
                "platform": "LinkedIn",
                "status": "unauthorized",
                "published": False,
                "error": "LinkedIn publishing is not configured. Connect your LinkedIn developer token (w_member_social scope) in the Connectors panel to publish.",
            }

        try:
            from web.connectors.adapters import LinkedInAdapter
            adapter = LinkedInAdapter()
            res = adapter.execute("share", {"text": post_text}, creds={"token": token})
            return {
                "platform": "LinkedIn",
                "status": "published",
                "published": True,
                "result": res,
            }
        except Exception as e:
            return {
                "platform": "LinkedIn",
                "status": "failed",
                "published": False,
                "error": str(e),
            }


class YouTubeConnector:
    """YouTube video metadata extraction and truthful summarization."""

    @staticmethod
    def fetch_oembed(video_url: str) -> Optional[Dict[str, Any]]:
        """Fetch public YouTube metadata via standard oEmbed endpoint."""
        try:
            endpoint = f"https://www.youtube.com/oembed?url={urllib.parse.quote(video_url)}&format=json"
            req = urllib.request.Request(endpoint, headers={"User-Agent": "OS-Agent/1.0"})
            with urllib.request.urlopen(req, timeout=4.0) as resp:
                if resp.status == 200:
                    return json.loads(resp.read().decode("utf-8"))
        except Exception as e:
            log.debug("YouTube oEmbed fetch failed: %s", e)
        return None

    @classmethod
    def summarize_video(cls, video_url: str, title: str = "") -> Dict[str, Any]:
        """Retrieve actual video metadata and summarize only retrieved information."""
        meta = cls.fetch_oembed(video_url)
        real_title = (meta.get("title") if meta else "") or title or "YouTube Video"
        author = meta.get("author_name") if meta else None
        provider = meta.get("provider_name", "YouTube") if meta else "YouTube"

        if meta:
            key_takeaways = [
                f"Title: {real_title}",
                f"Channel / Author: {author or 'Unknown'}",
                "Transcript status: Not available via public oEmbed (requires YouTube Data API credentials).",
            ]
            status = "indexed_in_space"
        else:
            key_takeaways = [
                f"Video URL referenced: {video_url}",
                "Metadata retrieval: Offline or inaccessible via public endpoint.",
                "Per truthfulness policy: No speculative transcript or summary was fabricated.",
            ]
            status = "unverified_reference"

        return {
            "platform": "YouTube",
            "video_url": video_url,
            "title": real_title,
            "author": author,
            "provider": provider,
            "transcript_status": "metadata_only" if meta else "unavailable",
            "key_takeaways": key_takeaways,
            "citations": [video_url],
            "status": status,
            "verified": bool(meta),
        }
