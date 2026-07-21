# Owner: Abijith Asokan — App Designer, Builder, Developer & Ecosystem Architect, Film Maker
# Company: StreamVista OPC Pvt Ltd / Crayons Pictures Union
# Cost: $0.00/month

import uuid, xxhash, hashlib
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import IngestSession, CameraCard, Asset, AssetType, IngestStatus, Job, JobType, JobStatus, User
from routers.auth_router import get_current_user, write_audit

router = APIRouter()

# ── SCHEMAS ──────────────────────────────────────────────────

class CreateSessionRequest(BaseModel):
    project_id: str
    shoot_day_id: Optional[str] = None
    card_id: str
    source_device: Optional[str] = None

class UpdateProgressRequest(BaseModel):
    bytes_uploaded: float
    bytes_total: float
    current_file: Optional[str] = None
    speed: Optional[float] = None

class FileChecksum(BaseModel):
    filename: str
    size: float
    source_hash: str

class CompleteUploadRequest(BaseModel):
    file_count: int
    total_size: float
    file_list: List[FileChecksum]

class VerifyChecksumRequest(BaseModel):
    session_id: str
    file_checksums: List[dict]

# ── INGEST SESSIONS ───────────────────────────────────────────

@router.post("/ingest/sessions", status_code=201)
async def create_ingest_session(body: CreateSessionRequest, request: Request,
                                 db: Session = Depends(get_db),
                                 current_user: User = Depends(get_current_user)):
    req_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    card = db.query(CameraCard).filter(CameraCard.id == body.card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail={"code": "CARD_NOT_FOUND",
            "message": "Camera card not found.", "request_id": req_id})

    session = IngestSession(
        id=str(uuid.uuid4()), project_id=body.project_id,
        shoot_day_id=body.shoot_day_id, card_id=body.card_id,
        started_by=current_user.id, source_device=body.source_device,
        status=IngestStatus.SCANNING, bytes_total=0, bytes_uploaded=0,
        retry_count=0, started_at=datetime.utcnow()
    )
    db.add(session)
    card.ingest_status = IngestStatus.SCANNING
    db.commit()
    db.refresh(session)
    write_audit(db, "ingest.session_created", user_id=current_user.id,
                resource_type="ingest_session", resource_id=session.id, request=request)
    return {"success": True, "request_id": req_id, "data": {
        "session_id": session.id, "status": session.status.value,
        "card_id": body.card_id,
        "tus_upload_endpoint": f"/v1/ingest/sessions/{session.id}/upload",
        "instructions": {"resume_support": True, "chunk_size_mb": 10,
                         "hash_algorithm": "xxh3+sha256"}}}

@router.get("/ingest/sessions/{session_id}")
async def get_session_status(session_id: str, db: Session = Depends(get_db),
                              current_user: User = Depends(get_current_user)):
    session = db.query(IngestSession).filter(IngestSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail={"code": "INGEST_SESSION_NOT_FOUND",
            "message": "The upload session could not be found."})
    progress_pct = (session.bytes_uploaded / session.bytes_total * 100) if session.bytes_total > 0 else 0
    return {"success": True, "data": {
        "session_id": session.id, "status": session.status.value,
        "bytes_uploaded": session.bytes_uploaded, "bytes_total": session.bytes_total,
        "progress_percentage": round(progress_pct, 2),
        "average_speed_mbps": round(session.average_speed / 1024 / 1024, 2) if session.average_speed else 0,
        "retry_count": session.retry_count, "started_at": session.started_at.isoformat()}}

@router.post("/ingest/sessions/{session_id}/progress")
async def update_progress(session_id: str, body: UpdateProgressRequest,
                           db: Session = Depends(get_db),
                           current_user: User = Depends(get_current_user)):
    session = db.query(IngestSession).filter(IngestSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail={"code": "INGEST_SESSION_NOT_FOUND",
            "message": "Upload session not found."})
    session.bytes_uploaded = body.bytes_uploaded
    session.bytes_total = body.bytes_total
    session.average_speed = body.speed or 0
    if session.status not in [IngestStatus.PAUSED, IngestStatus.FAILED]:
        session.status = IngestStatus.UPLOADING
    db.commit()
    return {"success": True, "data": {"progress_percentage":
        round(body.bytes_uploaded / body.bytes_total * 100, 2) if body.bytes_total > 0 else 0}}

@router.patch("/ingest/sessions/{session_id}/pause")
async def pause_session(session_id: str, db: Session = Depends(get_db),
                         current_user: User = Depends(get_current_user)):
    session = db.query(IngestSession).filter(IngestSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail={"code": "INGEST_SESSION_NOT_FOUND",
            "message": "Upload session not found."})
    session.status = IngestStatus.PAUSED
    db.commit()
    return {"success": True, "data": {"session_id": session_id, "status": "PAUSED"}}

@router.patch("/ingest/sessions/{session_id}/resume")
async def resume_session(session_id: str, db: Session = Depends(get_db),
                          current_user: User = Depends(get_current_user)):
    session = db.query(IngestSession).filter(IngestSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail={"code": "INGEST_SESSION_NOT_FOUND",
            "message": "Upload session not found."})
    session.status = IngestStatus.UPLOADING
    session.retry_count += 1
    db.commit()
    return {"success": True, "data": {"session_id": session_id, "status": "UPLOADING", "retry_count": session.retry_count}}

@router.patch("/ingest/sessions/{session_id}/cancel")
async def cancel_session(session_id: str, request: Request, db: Session = Depends(get_db),
                          current_user: User = Depends(get_current_user)):
    session = db.query(IngestSession).filter(IngestSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail={"code": "INGEST_SESSION_NOT_FOUND",
            "message": "Upload session not found."})
    session.status = IngestStatus.CANCELLED
    session.completed_at = datetime.utcnow()
    db.commit()
    write_audit(db, "ingest.session_cancelled", user_id=current_user.id,
                resource_type="ingest_session", resource_id=session_id, request=request)
    return {"success": True, "data": {"session_id": session_id, "status": "CANCELLED"}}

@router.post("/ingest/sessions/{session_id}/complete")
async def complete_upload(session_id: str, body: CompleteUploadRequest,
                           request: Request, db: Session = Depends(get_db),
                           current_user: User = Depends(get_current_user)):
    req_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    session = db.query(IngestSession).filter(IngestSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail={"code": "INGEST_SESSION_NOT_FOUND",
            "message": "Upload session not found.", "request_id": req_id})
    session.status = IngestStatus.VERIFYING
    session.bytes_total = body.total_size
    session.bytes_uploaded = body.total_size
    db.commit()
    card = db.query(CameraCard).filter(CameraCard.id == session.card_id).first()
    if card:
        card.actual_file_count = body.file_count
        card.upload_complete = True
        card.ingest_status = IngestStatus.VERIFYING
        if card.expected_file_count and card.expected_file_count == body.file_count:
            card.file_count_matched = True
        db.commit()
    write_audit(db, "ingest.upload_complete", user_id=current_user.id,
                resource_type="ingest_session", resource_id=session_id, request=request,
                metadata={"file_count": body.file_count, "total_size_bytes": body.total_size})
    return {"success": True, "request_id": req_id, "data": {
        "session_id": session_id, "status": "VERIFYING",
        "file_count": body.file_count, "file_count_matched": card.file_count_matched if card else False,
        "next_step": "POST /v1/ingest/verify to complete checksum verification"}}

@router.post("/ingest/verify")
async def verify_checksums(body: VerifyChecksumRequest, request: Request,
                            db: Session = Depends(get_db),
                            current_user: User = Depends(get_current_user)):
    req_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    session = db.query(IngestSession).filter(IngestSession.id == body.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail={"code": "INGEST_SESSION_NOT_FOUND",
            "message": "Upload session not found.", "request_id": req_id})
    mismatches = []
    matches = []
    for fc in body.file_checksums:
        source_hash = fc.get("source_hash", "")
        cloud_hash = fc.get("cloud_hash", "")
        filename = fc.get("filename", "")
        result = "MATCH" if source_hash == cloud_hash else "MISMATCH"
        if result == "MISMATCH":
            mismatches.append({"filename": filename, "source_hash": source_hash,
                                "cloud_hash": cloud_hash, "result": "MISMATCH"})
        else:
            matches.append(filename)

    card = db.query(CameraCard).filter(CameraCard.id == session.card_id).first()
    if not mismatches:
        if card:
            card.checksum_verified = True
            card.verification_status = "MATCH"
            card.ingest_status = IngestStatus.COMPLETE
        session.status = IngestStatus.COMPLETE
        session.completed_at = datetime.utcnow()
        db.commit()
        write_audit(db, "ingest.checksum_verified", user_id=current_user.id,
                    resource_type="camera_card", resource_id=session.card_id, request=request,
                    metadata={"files_verified": len(matches)})
        return {"success": True, "request_id": req_id, "data": {
            "verification_result": "MATCH",
            "files_verified": len(matches), "mismatches": 0,
            "card_checksum_verified": True,
            "message": "✅ All checksums verified. Card is eligible for SAFE TO FORMAT after DIT confirmation."}}
    else:
        if card:
            card.verification_status = "MISMATCH"
            card.cleared_for_formatting = False
        session.status = IngestStatus.FAILED
        db.commit()
        write_audit(db, "ingest.checksum_mismatch", user_id=current_user.id,
                    resource_type="camera_card", resource_id=session.card_id, request=request,
                    metadata={"mismatches": len(mismatches)})
        return {"success": False, "request_id": req_id, "data": {
            "verification_result": "MISMATCH",
            "files_verified": len(matches), "mismatches": len(mismatches),
            "mismatch_details": mismatches,
            "card_clearance_blocked": True,
            "action_required": "Re-upload the affected files listed in mismatch_details."}}

@router.get("/ingest/history")
async def ingest_history(db: Session = Depends(get_db),
                          current_user: User = Depends(get_current_user)):
    sessions = db.query(IngestSession).filter(IngestSession.started_by == current_user.id).all()
    return {"success": True, "data": [
        {"session_id": s.id, "status": s.status.value, "card_id": s.card_id,
         "bytes_uploaded": s.bytes_uploaded, "bytes_total": s.bytes_total,
         "started_at": s.started_at.isoformat(),
         "completed_at": s.completed_at.isoformat() if s.completed_at else None} for s in sessions]}
