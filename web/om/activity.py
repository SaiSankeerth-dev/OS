"""Durable activity runs, ideas, and goals — OpenMuse activity port.

An activity run is a small durable plan: an ordered list of steps with a
lifecycle (planned → running → paused → running → done | cancelled | failed).
Every transition and step outcome is appended to run_events, so a run
survives restarts and its history is inspectable.

This is the bookkeeping layer only. Executing a step's real work is the
caller's job (the chat agent, a cron, etc.); the service records outcomes.

Ideas and goals are the lightweight planning surfaces OpenMuse ships:
ideas are captured with evidence and can be accepted (→ goal), edited, or
dismissed; goals track milestones.
"""
from __future__ import annotations

from typing import Any

from .store import OmStore, jdumps, jloads, now


class ActivityError(Exception):
    def __init__(self, message: str, status: int = 400):
        super().__init__(message)
        self.status = status


RUN_STATUSES = ("planned", "running", "paused", "done", "cancelled", "failed")
STEP_STATUSES = ("pending", "running", "done", "failed", "skipped")
IDEA_STATUSES = ("new", "accepted", "edited", "dismissed")
GOAL_STATUSES = ("active", "done", "archived")

# Allowed lifecycle transitions (besides any → cancelled which is always OK).
_TRANSITIONS = {
    "planned": ("running", "cancelled"),
    "running": ("paused", "done", "failed", "cancelled"),
    "paused": ("running", "cancelled"),
    "done": (),
    "cancelled": (),
    "failed": ("running", "cancelled"),  # retry = failed → running
}


class ActivityService:
    def __init__(self, store: OmStore | None = None):
        self.store = store or OmStore()

    # -- runs ------------------------------------------------------------
    def create_run(self, title: str, steps: list[str] | None = None) -> dict:
        plan = [{"name": s, "status": "pending"} for s in (steps or [])]
        run = self.store.insert("runs", {
            "title": title.strip() or "Untitled run",
            "plan": jdumps(plan),
            "status": "planned",
            "receipt": jdumps({"current_step": 0}),
            "created_at": now(),
            "updated_at": now(),
        })
        self._event(run["id"], "created",
                    {"message": f"Run created with {len(plan)} step(s)."})
        return self._public(run)

    def get_run(self, rid: str) -> dict:
        run = self.store.get("runs", rid)
        if not run:
            raise ActivityError("Run not found", 404)
        return self._public(run)

    def list_runs(self, status: str = "", limit: int = 50) -> list[dict]:
        where, params = ("status = ?", (status,)) if status else ("", ())
        return [self._public(r) for r in
                self.store.list("runs", where, params,
                                order="updated_at DESC", limit=limit)]

    def transition(self, rid: str, to: str) -> dict:
        if to not in RUN_STATUSES:
            raise ActivityError(f"Unknown status '{to}'")
        run = self.store.get("runs", rid)
        if not run:
            raise ActivityError("Run not found", 404)
        frm = run["status"]
        if to != "cancelled" and to not in _TRANSITIONS.get(frm, ()):
            raise ActivityError(f"Cannot move run from '{frm}' to '{to}'")
        run = self.store.update("runs", rid,
                                {"status": to, "updated_at": now()})
        self._event(rid, "status", {"message": f"{frm} → {to}"})
        if to == "failed":
            self._event(rid, "note", {
                "message": "Run failed. Fix the cause, then retry "
                           "(failed → running)."})
        return self._public(run)

    def step(self, rid: str, index: int, status: str,
             note: str = "") -> dict:
        if status not in STEP_STATUSES:
            raise ActivityError(f"Unknown step status '{status}'")
        run = self.store.get("runs", rid)
        if not run:
            raise ActivityError("Run not found", 404)
        plan = jloads(run["plan"], [])
        if not (0 <= index < len(plan)):
            raise ActivityError("Step index out of range")
        plan[index]["status"] = status
        if note:
            plan[index]["note"] = note[:500]
        receipt = jloads(run["receipt"], {}) or {}
        receipt["current_step"] = index + 1 if status == "done" else index
        run = self.store.update("runs", rid, {
            "plan": jdumps(plan),
            "receipt": jdumps(receipt),
            "updated_at": now(),
        })
        self._event(rid, "step", {
            "message": f"Step {index + 1} '{plan[index]['name']}' → {status}"
                       + (f": {note}" if note else "")})
        return self._public(run)

    def note(self, rid: str, message: str) -> dict:
        if not self.store.get("runs", rid):
            raise ActivityError("Run not found", 404)
        self._event(rid, "note", {"message": message[:2000]})
        return self.get_run(rid)

    def events(self, rid: str, limit: int = 200) -> list[dict]:
        if not self.store.get("runs", rid):
            raise ActivityError("Run not found", 404)
        out = []
        for e in self.store.list("run_events", "run_id = ?", (rid,),
                                 order="seq ASC", limit=limit):
            e = dict(e)
            e["data"] = jloads(e.get("data"), {})
            out.append(e)
        return out

    def delete_run(self, rid: str) -> None:
        if not self.store.delete("runs", rid):
            raise ActivityError("Run not found", 404)

    def _event(self, rid: str, kind: str, data: dict) -> None:
        seq = self.store.count("run_events", "run_id = ?", (rid,))
        self.store.insert("run_events", {
            "run_id": rid, "seq": seq, "kind": kind,
            "data": jdumps(data), "created_at": now(),
        })

    def _public(self, run: dict) -> dict:
        run = dict(run)
        run["plan"] = jloads(run.get("plan"), [])
        run["receipt"] = jloads(run.get("receipt"), {})
        return run

    # -- ideas -----------------------------------------------------------
    def create_idea(self, title: str, prompt: str = "",
                    kind: str = "general", evidence: list | None = None) -> dict:
        if not title.strip():
            raise ActivityError("Idea needs a title")
        return self.store.insert("ideas", {
            "title": title.strip(),
            "prompt": prompt,
            "kind": kind,
            "input": "",
            "evidence": jdumps(evidence or []),
            "status": "new",
            "created_at": now(),
        })

    def list_ideas(self, status: str = "") -> list[dict]:
        where, params = ("status = ?", (status,)) if status else ("", ())
        return [self._public_idea(i) for i in self.store.list(
            "ideas", where, params, order="created_at DESC", limit=100)]

    def get_idea(self, iid: str) -> dict:
        idea = self.store.get("ideas", iid)
        if not idea:
            raise ActivityError("Idea not found", 404)
        return self._public_idea(idea)

    def update_idea(self, iid: str, **patch: Any) -> dict:
        idea = self.store.get("ideas", iid)
        if not idea:
            raise ActivityError("Idea not found", 404)
        if "status" in patch and patch["status"] not in IDEA_STATUSES:
            raise ActivityError("Bad idea status")
        if "evidence" in patch and not isinstance(patch["evidence"], str):
            patch["evidence"] = jdumps(patch["evidence"])
        return self._public_idea(self.store.update("ideas", iid, patch))

    def accept_idea(self, iid: str) -> dict:
        """Accept an idea → mark accepted and create a matching goal."""
        idea = self.store.get("ideas", iid)
        if not idea:
            raise ActivityError("Idea not found", 404)
        goal = self.create_goal(idea["title"])
        self.store.update("ideas", iid, {"status": "accepted"})
        return {"idea_id": iid, "goal_id": goal["id"]}

    def delete_idea(self, iid: str) -> None:
        if not self.store.delete("ideas", iid):
            raise ActivityError("Idea not found", 404)

    def _public_idea(self, idea: dict) -> dict:
        idea = dict(idea)
        idea["evidence"] = jloads(idea.get("evidence"), [])
        return idea

    # -- goals -----------------------------------------------------------
    def create_goal(self, title: str) -> dict:
        if not title.strip():
            raise ActivityError("Goal needs a title")
        return self.store.insert("goals", {
            "title": title.strip(), "status": "active",
            "created_at": now(),
        })

    def list_goals(self, status: str = "") -> list[dict]:
        where, params = ("status = ?", (status,)) if status else ("", ())
        return [self._public_goal(g) for g in self.store.list(
            "goals", where, params, order="created_at DESC", limit=100)]

    def get_goal(self, gid: str) -> dict:
        goal = self.store.get("goals", gid)
        if not goal:
            raise ActivityError("Goal not found", 404)
        return self._public_goal(goal)

    def update_goal(self, gid: str, **patch: Any) -> dict:
        if not self.store.get("goals", gid):
            raise ActivityError("Goal not found", 404)
        if "status" in patch and patch["status"] not in GOAL_STATUSES:
            raise ActivityError("Bad goal status")
        return self._public_goal(self.store.update("goals", gid, patch))

    def add_milestone(self, gid: str, title: str) -> dict:
        if not self.store.get("goals", gid):
            raise ActivityError("Goal not found", 404)
        if not title.strip():
            raise ActivityError("Milestone needs a title")
        return self.store.insert("goal_milestones", {
            "goal_id": gid, "title": title.strip(),
            "done": 0, "created_at": now(),
        })

    def set_milestone(self, mid: str, done: bool) -> dict:
        ms = self.store.get("goal_milestones", mid)
        if not ms:
            raise ActivityError("Milestone not found", 404)
        return self.store.update("goal_milestones", mid,
                                 {"done": 1 if done else 0})

    def delete_milestone(self, mid: str) -> None:
        if not self.store.delete("goal_milestones", mid):
            raise ActivityError("Milestone not found", 404)

    def _public_goal(self, goal: dict) -> dict:
        goal = dict(goal)
        goal["milestones"] = self.store.list(
            "goal_milestones", "goal_id = ?", (goal["id"],),
            order="created_at ASC", limit=50)
        return goal
