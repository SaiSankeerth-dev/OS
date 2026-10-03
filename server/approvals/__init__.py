"""Approval engine: draft -> show -> approve/reject -> execute -> log.

This is Milestone 0 of the OS build plan, wired into the live
conversation engine instead of a standalone script. See gate.py.
"""
from .gate import ApprovalStore, PendingApproval, content_hash

__all__ = ["ApprovalStore", "PendingApproval", "content_hash"]
