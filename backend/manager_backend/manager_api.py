"""
Manager Backend API
═══════════════════════════════════════════════════════════════════════════════
Handles the HR → Manager approval flow.

When HR clicks "Review & Approve" on the Feedback page, the frontend calls:
  POST /manager/hr-approve

Lookup strategy for candidate data (tried in order):
  1. interview_details  WHERE candidate_id = <id>        (most common)
  2. interview_details  WHERE _id = ObjectId(<id>)       (if id is a doc _id)
  3. candidates         WHERE _id = ObjectId(<id>)       (raw candidate record)
  4. Frontend-supplied fields in the request body        (offline / fallback)

MongoDB collections used (all in db: hr_recruitment):
  - interview_details   (shared with HR backend — read only here)
  - candidates          (shared with HR backend — read only here)
  - manager_approvals   (owned by manager backend)

Endpoints:
  POST  /manager/hr-approve                              → HR submits approval
  GET   /manager/approved-candidates                     → Manager portal list
  PATCH /manager/approved-candidates/{id}/decision       → Manager approve/reject
  GET   /manager/approved-candidates/{id}                → Single candidate detail
  GET   /manager/health                                  → Health check
"""

import os
import logging
from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId
from bson.errors import InvalidId
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import db, ping_db

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("manager_api")

# ── Collections ────────────────────────────────────────────────────────────────
interview_col  = db["interview_details"]   # HR backend writes here
candidates_col = db["candidates"]          # raw candidate profiles
approvals_col  = db["manager_approvals"]   # owned by manager backend

# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Manager Backend API",
    description="HR → Manager approval pipeline for the RecruitAI portal",
    version="1.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await ping_db()


# ══════════════════════════════════════════════════════════════════════════════
# HELPERS
# ══════════════════════════════════════════════════════════════════════════════

def _safe_id(doc: dict) -> dict:
    """Convert ObjectId / datetime fields to JSON-safe strings recursively."""
    out = {}
    for k, v in doc.items():
        if isinstance(v, ObjectId):
            out[k] = str(v)
        elif isinstance(v, datetime):
            out[k] = v.isoformat()
        elif isinstance(v, dict):
            out[k] = _safe_id(v)
        elif isinstance(v, list):
            out[k] = [_safe_id(i) if isinstance(i, dict) else i for i in v]
        else:
            out[k] = v
    return out


def _try_object_id(value: str) -> Optional[ObjectId]:
    """Return an ObjectId if value is a valid 24-hex string, else None."""
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        return None


async def _resolve_candidate(candidate_id: str) -> Optional[dict]:
    """
    Try multiple strategies to find the candidate record.

    Strategy 1 — interview_details.candidate_id == candidate_id  (string match)
    Strategy 2 — interview_details._id == ObjectId(candidate_id) (doc _id match)
    Strategy 3 — candidates._id == ObjectId(candidate_id)        (raw profile)

    Returns a normalised dict with at minimum:
        name, email, initials, color, role, rounds
    or None if nothing found.
    """
    cid = candidate_id.strip()

    # ── Strategy 1: interview_details keyed by candidate_id field ─────────────
    doc = await interview_col.find_one({"candidate_id": cid})
    if doc:
        logger.info("Resolved via interview_details.candidate_id=%s", cid)
        return doc

    # ── Strategy 2: interview_details keyed by its own _id ────────────────────
    oid = _try_object_id(cid)
    if oid:
        doc = await interview_col.find_one({"_id": oid})
        if doc:
            logger.info("Resolved via interview_details._id=%s", cid)
            return doc

    # ── Strategy 3: raw candidates collection ─────────────────────────────────
    if oid:
        doc = await candidates_col.find_one({"_id": oid})
        if doc:
            logger.info("Resolved via candidates._id=%s", cid)
            # Normalise to the same shape as interview_details
            name = doc.get("name", "")
            return {
                "candidate_id": cid,
                "name":         name,
                "email":        doc.get("email", ""),
                "initials":     doc.get("initials", (name[:1] + name.split()[-1][:1]).upper() if name else "??"),
                "color":        doc.get("color", "#6366f1"),
                "role":         doc.get("role", doc.get("job_title", "")),
                "rounds":       [],
            }

    logger.warning("Could not resolve candidate_id=%s in any collection", cid)
    return None


# ══════════════════════════════════════════════════════════════════════════════
# REQUEST / RESPONSE MODELS
# ══════════════════════════════════════════════════════════════════════════════

class HRApproveRequest(BaseModel):
    """
    Sent by the HR portal when clicking "Review & Approve".

    candidate_id    — backendId from the frontend (= candidate _id string
                      stored as candidate_id in interview_details)
    hr_note         — Optional HR note attached to the approval
    overall_rating  — Computed rating shown on the feedback page
    recommendation  — HR recommendation label  (e.g. "Strong Hire")

    # Fallback fields — used when the candidate cannot be found in MongoDB
    # (e.g. seed data that was never persisted to the DB)
    candidate_name  — Candidate's display name
    candidate_email — Candidate's email address
    initials        — Avatar initials
    color           — Avatar background colour
    role            — Job role / title
    rounds          — Interview rounds array
    """
    candidate_id:     str
    hr_note:          Optional[str]   = ""
    overall_rating:   Optional[float] = None
    recommendation:   Optional[str]   = ""

    # Fallback / override fields supplied by the frontend
    candidate_name:   Optional[str]   = None
    candidate_email:  Optional[str]   = None
    initials:         Optional[str]   = None
    color:            Optional[str]   = None
    role:             Optional[str]   = None
    rounds:           Optional[list]  = None


class ManagerDecisionRequest(BaseModel):
    decision: str          # "approved" | "rejected"
    note:     Optional[str] = ""


# ══════════════════════════════════════════════════════════════════════════════
# ENDPOINT 1 — HR submits approval
# ══════════════════════════════════════════════════════════════════════════════

@app.post("/manager/hr-approve", summary="HR approves candidate for manager review")
async def hr_approve(body: HRApproveRequest):
    """
    Called when HR clicks "Review & Approve" on the Feedback page.

    Lookup order:
      1. interview_details  WHERE candidate_id = body.candidate_id
      2. interview_details  WHERE _id = ObjectId(body.candidate_id)
      3. candidates         WHERE _id = ObjectId(body.candidate_id)
      4. Use fallback fields from the request body itself

    Creates / updates a manager_approvals document with status = "pending_manager".
    """
    candidate_id = body.candidate_id.strip()
    now = datetime.now(timezone.utc)

    # ── Try to find the candidate in MongoDB ──────────────────────────────────
    iv_doc = await _resolve_candidate(candidate_id)

    if iv_doc:
        # Found in DB — use DB values, allow body overrides for missing fields
        name     = iv_doc.get("name",     "") or body.candidate_name or ""
        email    = iv_doc.get("email",    "") or body.candidate_email or ""
        initials = iv_doc.get("initials", "") or body.initials or ""
        color    = iv_doc.get("color",    "#6366f1") or body.color or "#6366f1"
        role     = iv_doc.get("role",     "") or body.role or ""
        rounds   = iv_doc.get("rounds",   []) or body.rounds or []
    else:
        # ── Strategy 4: fallback — use whatever the frontend sent ─────────────
        logger.warning(
            "Candidate %s not found in MongoDB — using frontend-supplied data",
            candidate_id,
        )

        name     = body.candidate_name  or ""
        email    = body.candidate_email or ""
        initials = body.initials        or (name[:1] + name.split()[-1][:1]).upper() if name else "??"
        color    = body.color           or "#6366f1"
        role     = body.role            or ""
        rounds   = body.rounds          or []

        # If we have absolutely nothing useful, reject the request
        if not name and not email:
            raise HTTPException(
                status_code=404,
                detail=(
                    f"Candidate '{candidate_id}' not found in interview_details or candidates "
                    f"collections. Make sure the HR backend (port 8000) has loaded candidates "
                    f"from MongoDB before approving, or ensure the candidate data has been "
                    f"saved to the database."
                ),
            )

    approval_doc = {
        "candidate_id":       candidate_id,
        "candidate_name":     name,
        "candidate_email":    email,
        "initials":           initials,
        "color":              color,
        "role":               role,
        "rounds":             rounds,
        "overall_rating":     body.overall_rating,
        "recommendation":     body.recommendation,
        "hr_note":            body.hr_note,
        "hr_approved_at":     now,
        "status":             "pending_manager",
        "manager_decision":   None,
        "manager_note":       None,
        "manager_decided_at": None,
        "updated_at":         now,
    }

    # Upsert — one record per candidate
    await approvals_col.update_one(
        {"candidate_id": candidate_id},
        {"$set": approval_doc},
        upsert=True,
    )

    # Stamp manager_approval back onto interview_details so HR can poll status
    if iv_doc:
        await interview_col.update_one(
            {"candidate_id": candidate_id},
            {"$set": {
                "manager_approval": {
                    "status":         "pending_manager",
                    "hr_approved_at": now,
                },
                "updated_at": now,
            }},
        )

    logger.info("HR approved candidate '%s' (%s) for manager review", name, candidate_id)
    return {
        "success":      True,
        "candidate_id": candidate_id,
        "status":       "pending_manager",
        "message":      f"{name or candidate_id} sent to Manager Portal interviews.",
    }


# ══════════════════════════════════════════════════════════════════════════════
# ENDPOINT 2 — Manager fetches approved candidates
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/manager/approved-candidates", summary="Get all candidates pending manager review")
async def get_approved_candidates(status: Optional[str] = None):
    """
    Returns candidates that HR has approved for manager review.
    Query param `status` filters by "pending_manager" | "approved" | "rejected".
    Default: returns all three statuses.
    """
    query: dict = {}
    if status:
        query["status"] = status
    else:
        query["status"] = {"$in": ["pending_manager", "approved", "rejected"]}

    results = []
    async for doc in approvals_col.find(query).sort("hr_approved_at", -1):
        results.append(_safe_id(doc))

    return {"candidates": results, "total": len(results)}


# ══════════════════════════════════════════════════════════════════════════════
# ENDPOINT 3 — Single candidate detail
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/manager/approved-candidates/{candidate_id}", summary="Get single approved candidate")
async def get_approved_candidate(candidate_id: str):
    doc = await approvals_col.find_one({"candidate_id": candidate_id})
    if not doc:
        raise HTTPException(
            status_code=404,
            detail=f"No approval record found for candidate_id={candidate_id!r}",
        )
    return _safe_id(doc)


# ══════════════════════════════════════════════════════════════════════════════
# ENDPOINT 4 — Manager approve / reject
# ══════════════════════════════════════════════════════════════════════════════

@app.patch(
    "/manager/approved-candidates/{candidate_id}/decision",
    summary="Manager approves or rejects a candidate",
)
async def manager_decision(candidate_id: str, body: ManagerDecisionRequest):
    if body.decision not in ("approved", "rejected"):
        raise HTTPException(status_code=400, detail="decision must be 'approved' or 'rejected'")

    doc = await approvals_col.find_one({"candidate_id": candidate_id})
    if not doc:
        raise HTTPException(
            status_code=404,
            detail=f"No approval record found for candidate_id={candidate_id!r}",
        )

    now = datetime.now(timezone.utc)

    await approvals_col.update_one(
        {"candidate_id": candidate_id},
        {"$set": {
            "status":             body.decision,
            "manager_decision":   body.decision,
            "manager_note":       body.note,
            "manager_decided_at": now,
            "updated_at":         now,
        }},
    )

    # Reflect decision back to interview_details so HR portal can read it
    await interview_col.update_one(
        {"candidate_id": candidate_id},
        {"$set": {
            "manager_approval.status":             body.decision,
            "manager_approval.manager_decided_at": now,
            "updated_at": now,
        }},
    )

    logger.info("Manager %s candidate %s", body.decision, candidate_id)
    return {
        "success":      True,
        "candidate_id": candidate_id,
        "decision":     body.decision,
        "message":      f"Candidate {doc.get('candidate_name', candidate_id)} has been {body.decision} by manager.",
    }


# ══════════════════════════════════════════════════════════════════════════════
# ENDPOINT 5 — Lightweight status poll (used by HR Feedback page)
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/manager/candidate-status/{candidate_id}", summary="Get manager decision status for a candidate")
async def candidate_status(candidate_id: str):
    """
    Lightweight endpoint polled by the HR Feedback page to check
    whether the manager has approved or rejected a candidate.

    Returns:
      candidate_id, status ("pending_manager" | "approved" | "rejected"),
      manager_decision, manager_decided_at
    """
    doc = await approvals_col.find_one(
        {"candidate_id": candidate_id},
        {"candidate_id": 1, "status": 1, "manager_decision": 1, "manager_decided_at": 1},
    )
    if not doc:
        raise HTTPException(
            status_code=404,
            detail=f"No approval record for candidate_id={candidate_id!r}",
        )
    return _safe_id(doc)


@app.get("/manager/candidates-status", summary="Bulk status for multiple candidates")
async def candidates_status_bulk(ids: str):
    """
    Comma-separated candidate_ids, e.g. ?ids=abc123,def456
    Returns a list of { candidate_id, status, manager_decision, manager_decided_at }.
    HR Feedback page calls this once on mount to populate the Status column.
    """
    id_list = [i.strip() for i in ids.split(",") if i.strip()]
    if not id_list:
        return {"statuses": []}

    results = []
    async for doc in approvals_col.find(
        {"candidate_id": {"$in": id_list}},
        {"candidate_id": 1, "status": 1, "manager_decision": 1, "manager_decided_at": 1},
    ):
        results.append(_safe_id(doc))

    return {"statuses": results}


# ══════════════════════════════════════════════════════════════════════════════
# ENDPOINT 6 — Health check
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/manager/health", summary="Health check")
async def health():
    return {
        "status":    "ok",
        "service":   "manager-backend",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


# ── Run ────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("MANAGER_API_PORT", "8001"))
    uvicorn.run("manager_api:app", host="0.0.0.0", port=port, reload=True)
