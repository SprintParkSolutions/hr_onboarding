"""
candidate_documents_backend.py
──────────────────────────────
Handles ALL candidate-portal document operations:

  POST   /candidates/login                              → authenticate a candidate (offer_letter_sent gate)
  GET    /candidates/portal-eligible                    → list candidates who can log into the portal
  GET    /candidates/{candidate_id}/documents           → list uploaded docs for a candidate
  POST   /candidates/{candidate_id}/documents/upload    → upload a PDF for a candidate (stored in GridFS)
  DELETE /candidates/{candidate_id}/documents/{doc_id}  → delete a specific uploaded document
  POST   /candidates/{candidate_id}/documents/submit    → mark all docs as submitted to HR
  GET    /candidates/{candidate_id}/documents/{doc_id}/download → stream PDF for viewing (HR portal)
  GET    /candidates/all-submitted                      → HR: list all candidates who have submitted docs
"""

import os
import logging
import hashlib
from datetime import datetime, timezone
from typing import Optional

import motor.motor_asyncio
import gridfs
from bson import ObjectId
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from pymongo import MongoClient

logger = logging.getLogger("candidate_docs")

# ── MongoDB connections ───────────────────────────────────────────────────────
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# Sync client for GridFS (motor doesn't support GridFS directly)
_sync_client = MongoClient(MONGO_URI)
_sync_db     = _sync_client["hr_recruitment"]
_fs          = gridfs.GridFS(_sync_db, collection="candidate_docs_fs")

# Async client for metadata collection
_async_client  = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
_async_db      = _async_client["hr_recruitment"]
_docs_col      = _async_db["candidate_documents"]   # metadata per document
_offers_col    = _async_db["manager_offers"]         # used to gate portal access
_candidates_col = _async_db["candidates"]            # for name/role lookup

# Candidate portal password — same value must be set in .env
CANDIDATE_PORTAL_PASSWORD = os.getenv("CANDIDATE_PORTAL_PASSWORD", "candidate123")

AVATAR_COLORS = [
    "#8b5cf6", "#2563eb", "#0891b2", "#10b981",
    "#f59e0b", "#ef4444", "#6366f1", "#ec4899",
]


def _avatar_color(name: str) -> str:
    idx = int(hashlib.md5((name or "").encode()).hexdigest(), 16) % len(AVATAR_COLORS)
    return AVATAR_COLORS[idx]


def _initials(name: str) -> str:
    parts = (name or "").strip().split()
    if len(parts) >= 2:
        return (parts[0][0] + parts[-1][0]).upper()
    if parts:
        return parts[0][:2].upper()
    return "??"


def _safe_id(doc: dict) -> dict:
    """Convert ObjectId → str so the doc is JSON-serialisable."""
    doc["id"] = str(doc.pop("_id", ""))
    return doc


# ── Router ────────────────────────────────────────────────────────────────────
router = APIRouter(tags=["candidate-documents"])


# ──────────────────────────────────────────────────────────────────────────────
# Auth
# ──────────────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/candidates/login")
async def candidate_login(body: LoginRequest):
    """
    Validates the candidate's credentials.
    The portal is gated on `offer_letter_sent == True` AND
    `candidate_accepted == True` on the manager_offers record.
    """
    offer = await _offers_col.find_one({"candidate_email": body.email.strip().lower()})
    if not offer:
        raise HTTPException(
            status_code=401,
            detail="No offer found for this email. Please contact HR.",
        )
    if not offer.get("offer_letter_sent") and not offer.get("candidate_accepted"):
        raise HTTPException(
            status_code=403,
            detail="Your offer letter hasn't been sent yet. Please contact HR.",
        )
    if body.password != CANDIDATE_PORTAL_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    return {
        "candidate_id": offer.get("candidate_id", ""),
        "email":        body.email.strip().lower(),
        "name":         offer.get("candidate_name", ""),
        "role":         offer.get("role", ""),
    }


@router.get("/candidates/portal-eligible")
async def portal_eligible_candidates():
    """
    Returns candidates whose offer letter has been sent (or who have accepted),
    used to populate the login-page demo list.
    """
    results = []
    async for doc in _offers_col.find(
        {"$or": [{"offer_letter_sent": True}, {"candidate_accepted": True}]}
    ):
        name = doc.get("candidate_name", "")
        results.append({
            "candidate_id": doc.get("candidate_id", ""),
            "name":         name,
            "email":        doc.get("candidate_email", ""),
            "role":         doc.get("role", ""),
            "initials":     _initials(name),
            "color":        _avatar_color(name),
        })
    return {"candidates": results}


# ──────────────────────────────────────────────────────────────────────────────
# Document CRUD
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/candidates/{candidate_id}/documents")
async def list_documents(candidate_id: str):
    """Return all uploaded documents for a candidate."""
    docs = []
    async for doc in _docs_col.find({"candidate_id": candidate_id}):
        docs.append(_safe_id(doc))
    return {"candidate_id": candidate_id, "documents": docs}


@router.post("/candidates/{candidate_id}/documents/upload")
async def upload_document(
    candidate_id: str,
    doc_key:      str       = Form(...),
    degree_label: Optional[str] = Form(None),
    file:         UploadFile = File(...),
):
    """Upload a PDF document to GridFS and record its metadata."""
    if file.content_type not in ("application/pdf", "application/octet-stream"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File must be under 10 MB.")

    # Remove an existing upload for the same candidate + doc_key (re-upload)
    existing = await _docs_col.find_one({"candidate_id": candidate_id, "doc_key": doc_key,
                                         "degree_label": degree_label})
    if existing:
        grid_id = existing.get("gridfs_id")
        if grid_id:
            try:
                _fs.delete(ObjectId(grid_id))
            except Exception:
                pass
        await _docs_col.delete_one({"_id": existing["_id"]})

    # Save to GridFS
    grid_id = _fs.put(
        content,
        filename=file.filename,
        candidate_id=candidate_id,
        doc_key=doc_key,
        content_type="application/pdf",
    )

    # Save metadata
    now = datetime.now(timezone.utc)
    meta = {
        "candidate_id": candidate_id,
        "doc_key":      doc_key,
        "degree_label": degree_label,
        "filename":     file.filename,
        "size_bytes":   len(content),
        "gridfs_id":    str(grid_id),
        "uploaded_at":  now,
        "submitted":    False,
    }
    result = await _docs_col.insert_one(meta)

    return {
        "id":           str(result.inserted_id),
        "candidate_id": candidate_id,
        "doc_key":      doc_key,
        "degree_label": degree_label,
        "filename":     file.filename,
        "size_bytes":   len(content),
        "uploaded_at":  now.isoformat(),
    }


@router.delete("/candidates/{candidate_id}/documents/{doc_id}")
async def delete_document(candidate_id: str, doc_id: str):
    """Delete a document from GridFS and remove its metadata."""
    try:
        oid = ObjectId(doc_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid document id.")

    meta = await _docs_col.find_one({"_id": oid, "candidate_id": candidate_id})
    if not meta:
        raise HTTPException(status_code=404, detail="Document not found.")

    grid_id = meta.get("gridfs_id")
    if grid_id:
        try:
            _fs.delete(ObjectId(grid_id))
        except Exception:
            pass

    await _docs_col.delete_one({"_id": oid})
    return {"success": True, "deleted_id": doc_id}


@router.post("/candidates/{candidate_id}/documents/submit")
async def submit_documents(candidate_id: str):
    """Mark all documents for this candidate as submitted (sent to HR)."""
    result = await _docs_col.update_many(
        {"candidate_id": candidate_id},
        {"$set": {"submitted": True, "submitted_at": datetime.now(timezone.utc)}},
    )
    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="No documents found for this candidate. Please upload at least one document first.",
        )
    return {
        "success":          True,
        "total_documents":  result.modified_count,
        "message":          f"{result.modified_count} document(s) submitted successfully. HR will review them shortly.",
    }


# ──────────────────────────────────────────────────────────────────────────────
# PDF Download / View (for HR portal)
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/candidates/{candidate_id}/documents/{doc_id}/download")
async def download_document(candidate_id: str, doc_id: str):
    """
    Stream the PDF binary so HR can view it in-browser.
    The browser will open it inline (Content-Disposition: inline).
    """
    try:
        oid = ObjectId(doc_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid document id.")

    meta = await _docs_col.find_one({"_id": oid, "candidate_id": candidate_id})
    if not meta:
        raise HTTPException(status_code=404, detail="Document not found.")

    grid_id = meta.get("gridfs_id")
    if not grid_id:
        raise HTTPException(status_code=404, detail="File data not found in storage.")

    try:
        grid_out = _fs.get(ObjectId(grid_id))
    except gridfs.errors.NoFile:
        raise HTTPException(status_code=404, detail="File not found in GridFS.")

    content = grid_out.read()
    filename = meta.get("filename", "document.pdf")

    return StreamingResponse(
        iter([content]),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'inline; filename="{filename}"',
            "Content-Length":      str(len(content)),
        },
    )


# ──────────────────────────────────────────────────────────────────────────────
# HR-side: list all candidates who have submitted documents
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/candidates/all-submitted")
async def all_submitted_candidates():
    """
    Returns every candidate who has at least one submitted document.
    Groups documents by candidate and enriches with offer data (name/role/doj).
    Used by the HR Onboarding page Section 2.
    """
    # Find all submitted docs, group by candidate_id
    pipeline = [
        {"$match": {"submitted": True}},
        {"$group": {
            "_id":        "$candidate_id",
            "docs":       {"$push": {
                "id":           {"$toString": "$_id"},
                "doc_key":      "$doc_key",
                "degree_label": "$degree_label",
                "filename":     "$filename",
                "size_bytes":   "$size_bytes",
                "uploaded_at":  "$uploaded_at",
                "submitted_at": "$submitted_at",
            }},
            "submitted_at": {"$max": "$submitted_at"},
            "doc_count":    {"$sum": 1},
        }},
        {"$sort": {"submitted_at": -1}},
    ]
    grouped = []
    async for row in _docs_col.aggregate(pipeline):
        grouped.append(row)

    if not grouped:
        return {"candidates": []}

    # Enrich with offer data (name, role, doj)
    candidate_ids = [r["_id"] for r in grouped]
    offers_map: dict = {}
    async for offer in _offers_col.find({"candidate_id": {"$in": candidate_ids}}):
        offers_map[offer["candidate_id"]] = offer

    results = []
    for row in grouped:
        cid   = row["_id"]
        offer = offers_map.get(cid, {})
        name  = offer.get("candidate_name", cid)
        results.append({
            "candidate_id":  cid,
            "name":          name,
            "role":          offer.get("role", "—"),
            "email":         offer.get("candidate_email", ""),
            "doj":           offer.get("doj", ""),
            "initials":      _initials(name),
            "color":         _avatar_color(name),
            "doc_count":     row["doc_count"],
            "submitted_at":  row["submitted_at"].isoformat() if row.get("submitted_at") else "",
            "documents":     row["docs"],
        })

    return {"candidates": results, "total": len(results)}
