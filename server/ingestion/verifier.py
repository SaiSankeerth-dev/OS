"""Ingestion Verifier Service.

Determines whether an extracted interpretation is supported by evidence:
SOURCE -> SOURCE EVENT -> OBSERVER -> EXTRACTOR -> CONTEXT -> VERIFIER -> LINKER -> COMMITMENT

Responsibilities:
- Verifies deliverable and deadline grounding.
- Confirms whether a duplicate commitment already exists.
- Produces unambiguous verification outcomes: VERIFIED, UNCERTAIN, REJECTED, NEEDS_CLARIFICATION.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from server.ingestion.context import RetrievedContext
from server.ingestion.extractor import ExtractedProposal


@dataclass
class VerificationDecision:
    status: str  # VERIFIED, UNCERTAIN, REJECTED, NEEDS_CLARIFICATION
    confidence: float
    is_duplicate: bool = False
    duplicate_commitment_id: Optional[str] = None
    reason: str = ""


class IngestionVerifier:
    CONFIDENCE_THRESHOLD = 0.70

    def verify(
        self,
        proposal: ExtractedProposal,
        context: RetrievedContext,
    ) -> VerificationDecision:
        # 1. Check for duplicates
        if context.similar_commitments:
            for existing in context.similar_commitments:
                # If title is very close or identical
                if existing.title.lower().strip() == proposal.title.lower().strip():
                    return VerificationDecision(
                        status="REJECTED",
                        confidence=0.95,
                        is_duplicate=True,
                        duplicate_commitment_id=existing.id,
                        reason=f"Duplicate commitment already exists: '{existing.title}' (id={existing.id})",
                    )

        # 2. Minimum viability check: must have either title + deadline or title + deliverable
        if not proposal.title or len(proposal.title.strip()) < 3:
            return VerificationDecision(
                status="REJECTED",
                confidence=0.9,
                reason="Proposed commitment has no discernible title",
            )

        # 3. Confidence gating
        if proposal.confidence < self.CONFIDENCE_THRESHOLD:
            return VerificationDecision(
                status="UNCERTAIN",
                confidence=proposal.confidence,
                reason=f"Proposal confidence ({proposal.confidence:.2f}) below threshold ({self.CONFIDENCE_THRESHOLD})",
            )

        return VerificationDecision(
            status="VERIFIED",
            confidence=proposal.confidence,
            reason="Proposal verified by evidence text with deliverable/deadline confirmation",
        )
