"""CSV finance summaries — OpenMuse finance port.

Upload a bank/statement CSV and get a plain-language spending summary:
totals in/out, net, breakdown by category and by month, top merchants.

Column detection is forgiving: it looks for date / description / amount
headers (case-insensitive, common variants). Amounts may carry currency
symbols and commas. A row counts as "out" when amount < 0, "in" when > 0;
some exports use separate debit/credit columns, which are also detected.

Everything is local — no bank connections, no paid APIs.
"""
from __future__ import annotations

import csv
import io
import re
from collections import defaultdict
from datetime import datetime

from .store import OmStore, now


class FinanceError(Exception):
    def __init__(self, message: str, status: int = 400):
        super().__init__(message)
        self.status = status


DATE_KEYS = ("date", "transaction date", "posted date", "value date")
DESC_KEYS = ("description", "narrative", "details", "particulars",
             "merchant", "payee", "memo")
AMOUNT_KEYS = ("amount", "amt", "value", "total")
DEBIT_KEYS = ("debit", "withdrawal", "money out", "paid out")
CREDIT_KEYS = ("credit", "deposit", "money in", "paid in")

CATEGORIES = [
    ("food", r"swiggy|zomato|restaurant|cafe|coffee|dominos|pizza|food|eat|dining|hotel.*food"),
    ("groceries", r"bigbasket|blinkit|zepto|grocer|supermarket|dmart|reliance.*mart|vegetable|kirana"),
    ("travel", r"uber|ola|rapido|irctc|makemytrip|goibibo|flight|airline|hotel|fuel|petrol|metro|bus|taxi"),
    ("shopping", r"amazon|flipkart|myntra|ajio|shopping|mall|store|decathlon"),
    ("bills", r"electricity|water|gas|broadband|jio|airtel|vi |vodafone|recharge|bill|rent|maintenance"),
    ("health", r"pharmacy|apollo|hospital|clinic|doctor|medicine|lab|diagnostic"),
    ("entertainment", r"netflix|spotify|prime|hotstar|movie|cinema|bookmyshow|game|youtube"),
    ("education", r"course|udemy|coursera|college|fee|tuition|book|exam"),
    ("transfer", r"upi|neft|imps|transfer|atm|cash|withdraw"),
]


def _norm(h: str) -> str:
    return re.sub(r"[^a-z ]", "", h.strip().lower())


def _parse_amount(raw: str) -> float | None:
    if raw is None:
        return None
    s = str(raw).strip()
    if not s or s in ("-", "--", "N/A"):
        return None
    neg = s.startswith("(") and s.endswith(")")
    s = re.sub(r"[₹$€£,\s]", "", s).strip("()")
    # "1,234.56 Cr" / "Dr" style
    m = re.match(r"^([0-9.]+)\s*(cr|dr)$", s, re.I)
    if m:
        val = float(m.group(1))
        return -val if m.group(2).lower() == "dr" else val
    try:
        val = float(s)
    except ValueError:
        return None
    return -val if neg else val


def _parse_date(raw: str) -> str:
    s = str(raw).strip()
    for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%m/%d/%Y", "%d/%m/%Y",
                "%Y/%m/%d", "%d %b %Y", "%d %B %Y", "%b %d, %Y",
                "%d-%b-%y", "%d-%b-%Y"):
        try:
            return datetime.strptime(s, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    return s[:10]


def _categorize(desc: str) -> str:
    d = desc.lower()
    for name, pat in CATEGORIES:
        if re.search(pat, d):
            return name
    return "other"


class FinanceService:
    def __init__(self, store: OmStore | None = None):
        self.store = store or OmStore()

    def upload(self, filename: str, content: bytes) -> dict:
        try:
            text = content.decode("utf-8-sig")
        except UnicodeDecodeError:
            text = content.decode("latin-1")
        rows = list(csv.DictReader(io.StringIO(text)))
        if not rows:
            raise FinanceError("CSV has no data rows")
        cols = {_norm(k): k for k in (rows[0].keys() or [])}

        def find(keys):
            for k in keys:
                if k in cols:
                    return cols[k]
            return None

        date_c = find(DATE_KEYS)
        desc_c = find(DESC_KEYS)
        amt_c = find(AMOUNT_KEYS)
        deb_c = find(DEBIT_KEYS)
        cre_c = find(CREDIT_KEYS)
        if not desc_c and not amt_c and not (deb_c or cre_c):
            raise FinanceError(
                "Could not find description/amount columns. "
                f"Headers seen: {', '.join(rows[0].keys() or [])}")

        txns = []
        for r in rows:
            if amt_c:
                amount = _parse_amount(r.get(amt_c, ""))
            else:
                amount = (_parse_amount(r.get(cre_c, "")) or 0.0) - \
                         (_parse_amount(r.get(deb_c, "")) or 0.0)
            if amount is None:
                continue
            desc = str(r.get(desc_c, "")).strip() if desc_c else ""
            txns.append({
                "date": _parse_date(r.get(date_c, "")) if date_c else "",
                "description": desc,
                "amount": round(amount, 2),
                "category": _categorize(desc),
            })
        if not txns:
            raise FinanceError("No parseable amount rows found")

        report = {
            "filename": filename[:200],
            "row_count": len(txns),
            "summary": self._summarize(txns),
            "transactions": txns[:2000],
            "created_at": now(),
        }
        saved = self.store.insert("finance_reports", {
            "name": report["filename"],
            "summary": __import__("json").dumps({
                "row_count": report["row_count"],
                "summary": report["summary"],
                "transactions": report["transactions"],
            }),
            "created_at": report["created_at"],
        })
        report["id"] = saved["id"]
        return report

    def _summarize(self, txns: list[dict]) -> dict:
        total_in = sum(t["amount"] for t in txns if t["amount"] > 0)
        total_out = -sum(t["amount"] for t in txns if t["amount"] < 0)
        by_cat = defaultdict(float)
        by_month = defaultdict(lambda: {"in": 0.0, "out": 0.0})
        by_merchant = defaultdict(float)
        for t in txns:
            a = t["amount"]
            if a < 0:
                by_cat[t["category"]] += -a
                by_merchant[t["description"][:60]] += -a
            m = (t["date"] or "????-??")[:7]
            by_month[m]["in" if a > 0 else "out"] += abs(a)
        top_cats = sorted(by_cat.items(), key=lambda kv: -kv[1])[:10]
        top_merchants = sorted(by_merchant.items(), key=lambda kv: -kv[1])[:10]
        return {
            "transactions": len(txns),
            "total_in": round(total_in, 2),
            "total_out": round(total_out, 2),
            "net": round(total_in - total_out, 2),
            "by_category": [{"category": k, "spent": round(v, 2)}
                            for k, v in top_cats],
            "by_month": [{"month": k, "in": round(v["in"], 2),
                          "out": round(v["out"], 2)}
                         for k, v in sorted(by_month.items())],
            "top_merchants": [{"merchant": k, "spent": round(v, 2)}
                              for k, v in top_merchants],
        }

    def list_reports(self) -> list[dict]:
        import json
        out = []
        for r in self.store.list("finance_reports",
                                 order="created_at DESC", limit=50):
            r = dict(r)
            r["report"] = json.loads(r.pop("summary") or "{}")
            out.append(r)
        return out

    def get_report(self, rid: str) -> dict:
        import json
        r = self.store.get("finance_reports", rid)
        if not r:
            raise FinanceError("Report not found", 404)
        r = dict(r)
        r["report"] = json.loads(r.pop("summary") or "{}")
        return r

    def delete_report(self, rid: str) -> None:
        if not self.store.delete("finance_reports", rid):
            raise FinanceError("Report not found", 404)
