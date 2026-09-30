"""Document library with PDF view / inspect / fill / export — OpenMuse docs port.

Upload a PDF, inspect its pages and fillable form fields, fill the fields,
and download the result. Everything runs locally with pypdf — no paid APIs.

Documents are stored as blobs in the om.db `documents` table. Filled copies
are saved as new documents (source = 'filled:<original-id>') so the
original is never mutated.
"""
from __future__ import annotations

import io

from .store import OmStore, now


class DocumentError(Exception):
    def __init__(self, message: str, status: int = 400):
        super().__init__(message)
        self.status = status


def _pypdf():
    try:
        from pypdf import PdfReader, PdfWriter
    except ImportError as e:
        raise DocumentError(
            "PDF support needs the 'pypdf' package (pip install pypdf)", 503
        ) from e
    return PdfReader, PdfWriter


class DocumentService:
    def __init__(self, store: OmStore | None = None):
        self.store = store or OmStore()

    # -- library ---------------------------------------------------------
    def upload(self, name: str, raw: bytes) -> dict:
        if not raw:
            raise DocumentError("Empty file")
        if not name.lower().endswith(".pdf"):
            raise DocumentError("Only PDF files are supported")
        if raw[:5] != b"%PDF-":
            raise DocumentError("Not a PDF file")
        doc = self.store.insert("documents", {
            "name": name[:200], "source": "upload",
            "bytes": raw, "created_at": now(),
        })
        info = self.info(doc["id"])
        return {"id": doc["id"], "name": doc["name"],
                "pages": info["pages"],
                "fields": len(info["fields"]),
                "created_at": doc["created_at"]}

    def list(self) -> list[dict]:
        return [
            {"id": d["id"], "name": d["name"], "source": d["source"],
             "size": len(d["bytes"] or b""), "created_at": d["created_at"]}
            for d in self.store.list("documents",
                                    order="created_at DESC", limit=100)
        ]

    def get(self, did: str) -> dict:
        doc = self.store.get("documents", did)
        if not doc:
            raise DocumentError("Document not found", 404)
        return doc

    def delete(self, did: str) -> None:
        if not self.store.delete("documents", did):
            raise DocumentError("Document not found", 404)

    # -- inspect ---------------------------------------------------------
    def info(self, did: str) -> dict:
        doc = self.get(did)
        PdfReader, _ = _pypdf()
        reader = PdfReader(io.BytesIO(doc["bytes"]))
        fields = []
        try:
            raw_fields = reader.get_fields() or {}
        except Exception:
            raw_fields = {}
        for fname, f in raw_fields.items():
            ftype = str(getattr(f, "field_type", "") or f.get("/FT", ""))
            fields.append({
                "name": fname,
                "type": ftype.strip("/"),
                "value": str(f.get("/V", "") or ""),
                "required": bool(f.get("/Ff", 0) & 2),
            })
        return {
            "id": did, "name": doc["name"],
            "pages": len(reader.pages),
            "fields": fields,
            "encrypted": bool(reader.is_encrypted),
        }

    def page_text(self, did: str, page: int = 0,
                  max_chars: int = 20000) -> dict:
        doc = self.get(did)
        PdfReader, _ = _pypdf()
        reader = PdfReader(io.BytesIO(doc["bytes"]))
        if not (0 <= page < len(reader.pages)):
            raise DocumentError("Page out of range")
        text = reader.pages[page].extract_text() or ""
        return {"id": did, "page": page, "pages": len(reader.pages),
                "text": text[:max_chars],
                "truncated": len(text) > max_chars}

    # -- fill & export ---------------------------------------------------
    def fill(self, did: str, values: dict[str, str]) -> dict:
        """Fill form fields; returns a NEW document (original untouched)."""
        doc = self.get(did)
        PdfReader, PdfWriter = _pypdf()
        reader = PdfReader(io.BytesIO(doc["bytes"]))
        writer = PdfWriter()
        writer.append(reader)
        known = set((reader.get_fields() or {}).keys())
        unknown = [k for k in values if k not in known]
        writer.update_page_form_field_values(
            writer.pages[0], {k: v for k, v in values.items()
                              if k in known},
            flags=1)
        # apply to all pages (fields may live on any page)
        for page in writer.pages[1:]:
            writer.update_page_form_field_values(
                page, {k: v for k, v in values.items() if k in known},
                flags=1)
        buf = io.BytesIO()
        writer.write(buf)
        new = self.store.insert("documents", {
            "name": doc["name"].replace(".pdf", "") + " (filled).pdf",
            "source": f"filled:{did}",
            "bytes": buf.getvalue(),
            "created_at": now(),
        })
        return {"id": new["id"], "name": new["name"],
                "filled": len(values) - len(unknown),
                "unknown_fields": unknown}

    def file_bytes(self, did: str) -> tuple[str, bytes]:
        doc = self.get(did)
        return doc["name"], doc["bytes"]
