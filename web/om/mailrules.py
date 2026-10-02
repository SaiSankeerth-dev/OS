"""Mail → ideas rules — derive idea drafts from Gmail, locally.

OpenMuse ships source-backed mail/goal rules: interesting mail becomes
suggestions you can accept, edit, or dismiss. This is the local version:
user-defined keyword rules scan Gmail (via the existing connector + vault
credentials) and create *idea drafts* (status "new") with the email as
evidence. Nothing is sent anywhere; ideas wait for the user's review in
the Activity tab, where accept → goal already exists.

Reads Gmail only, and only when the user clicks Scan (or a rule they own
runs it). Seen (rule, email) pairs are remembered so nothing resurfaces.
"""
from __future__ import annotations

from .store import OmStore, jdumps, jloads, now


class MailRulesError(Exception):
    def __init__(self, message: str, status: int = 400):
        super().__init__(message)
        self.status = status


DEFAULT_RULES = [
    {"name": "Follow-ups", "query": "newer_than:7d",
     "keywords": ["follow up", "reminder", "action required", "todo", "pending"],
     "kind": "task"},
    {"name": "Opportunities", "query": "newer_than:7d",
     "keywords": ["proposal", "offer", "partnership", "invoice", "collaboration"],
     "kind": "opportunity"},
]


def _gmail_creds() -> dict:
    try:
        from web.store import DashboardStore
        return DashboardStore().load_credentials("google") or {}
    except Exception:
        return {}


class MailRulesService:
    def __init__(self, store: OmStore | None = None):
        self.store = store or OmStore()

    # -- connection ------------------------------------------------------
    def gmail_status(self) -> dict:
        creds = _gmail_creds()
        if not creds:
            return {"connected": False,
                    "detail": "Gmail not connected — use Sign in with Google first."}
        try:
            from web.connectors.adapters import ADAPTERS
            ok, msg = ADAPTERS["gmail"].health_check(creds)
            return {"connected": bool(ok), "detail": str(msg)}
        except Exception as e:
            return {"connected": False, "detail": f"{type(e).__name__}: {e}"}

    # -- rules -----------------------------------------------------------
    def list_rules(self) -> list[dict]:
        return [self._pub(r) for r in
                self.store.list("mail_rules", order="created_at ASC", limit=50)]

    def add_rule(self, name: str, query: str = "",
                 keywords: list[str] | str | None = None,
                 kind: str = "general") -> dict:
        if not (name or "").strip():
            raise MailRulesError("Rule needs a name")
        if isinstance(keywords, str):
            keywords = [k.strip().lower() for k in keywords.split(",")
                        if k.strip()]
        keywords = [k.lower() for k in (keywords or [])][:20]
        if not keywords:
            raise MailRulesError("Give at least one keyword")
        return self._pub(self.store.insert("mail_rules", {
            "name": name.strip()[:120],
            "query": (query or "").strip()[:300],
            "keywords": jdumps(keywords),
            "kind": (kind or "general").strip()[:40],
            "created_at": now(),
        }))

    def delete_rule(self, rid: str) -> None:
        if not self.store.delete("mail_rules", rid):
            raise MailRulesError("Rule not found", 404)

    def seed_defaults(self) -> list[dict]:
        if self.list_rules():
            return self.list_rules()
        return [self.add_rule(r["name"], r["query"], r["keywords"], r["kind"])
                for r in DEFAULT_RULES]

    def _pub(self, r: dict) -> dict:
        r = dict(r)
        r["keywords"] = jloads(r.get("keywords"), [])
        return r

    # -- scan ------------------------------------------------------------
    def scan(self, max_per_rule: int = 10) -> dict:
        """Run all rules; create idea drafts for new matches."""
        from .activity import ActivityService  # lazy: avoid import cycle
        creds = _gmail_creds()
        if not creds:
            raise MailRulesError("Gmail not connected", 503)
        try:
            from web.connectors.adapters import ADAPTERS
            gmail = ADAPTERS["gmail"]
        except Exception as e:
            raise MailRulesError(f"Gmail adapter unavailable: {e}", 503)

        ideas = ActivityService(self.store)
        created, scanned = [], 0
        for rule in self.list_rules():
            try:
                res = gmail.run_action("search_emails", {
                    "query": rule["query"] or "newer_than:7d",
                    "max_results": max(1, min(max_per_rule, 20)),
                }, creds)
            except Exception as e:
                created.append({"rule": rule["name"], "error": str(e)[:200]})
                continue
            for mail in (res.get("emails") or []):
                scanned += 1
                mid = mail.get("id", "")
                if self._seen(rule["id"], mid):
                    continue
                subject = mail.get("subject", "") or ""
                hay = subject.lower()
                hit = next((k for k in rule["keywords"] if k in hay), "")
                self._mark_seen(rule["id"], mid)
                if not hit:
                    continue
                idea = ideas.create_idea(
                    title=subject[:140] or "(no subject)",
                    prompt=f"From: {mail.get('from', '')}\n"
                           f"Matched rule '{rule['name']}' on keyword '{hit}'.",
                    kind=rule["kind"],
                    evidence=[{"email_id": mid, "subject": subject,
                               "from": mail.get("from", ""),
                               "date": mail.get("date", ""),
                               "rule": rule["name"], "keyword": hit}],
                )
                created.append({"rule": rule["name"], "idea_id": idea["id"],
                                "title": idea["title"]})
        return {"scanned": scanned, "created": created}

    def _seen(self, rule_id: str, email_id: str) -> bool:
        rows = self.store.list("mail_seen", "rule_id = ? AND email_id = ?",
                               (rule_id, email_id), limit=1)
        return bool(rows)

    def _mark_seen(self, rule_id: str, email_id: str) -> None:
        if not self._seen(rule_id, email_id):
            self.store.insert("mail_seen", {
                "rule_id": rule_id, "email_id": email_id,
                "seen_at": now(),
            })
