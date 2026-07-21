# Owner: Abijith Asokan — App Designer, Builder, Developer & Ecosystem Architect, Film Maker
# Company: StreamVista OPC Pvt Ltd / Crayons Pictures Union
# Cost: $0.00/month

import os, uuid
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
import boto3
from botocore.exceptions import ClientError

from database import get_db
from models import Asset, Job, QCReport, JobType, JobStatus, QCStatus, AssetType, User, AuditLog
from routers.auth_router import get_current_user, write_audit
from config import settings

router = APIRouter()

def get_r2_client():
    if not settings.R2_ACCESS_KEY_ID:
        return None
    return boto3.client(
        "s3",
        endpoint_url=settings.R2_ENDPOINT_URL,
        aws_access_key_id=settings.R2_ACCESS_KEY_ID,
        aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
        region_name="auto"
    )

# ── QC ENGINE (LEVEL 1 & 2) ───────────────────────────────────

def run_qc_level1(asset: Asset, db: Session) -> dict:
    """Level 1: File Integrity QC"""
    results = {
        "checksum_match": asset.verification_result == "MATCH",
        "file_size_valid": asset.file_size is not None and asset.file_size > 0,
        "has_storage_key": bool(asset.storage_object_key),
        "original_filename_preserved": bool(asset.original_filename),
        "status": "PASS"
    }
    if not all([results["checksum_match"], results["file_size_valid"],
                results["has_storage_key"], results["original_filename_preserved"]]):
        results["status"] = "FAIL"
        results["failures"] = [k for k, v in results.items() if v is False]
    return results

def run_qc_level2(asset: Asset, db: Session) -> dict:
    """Level 2: Technical Media QC"""
    results = {
        "codec_detected": bool(asset.codec),
        "resolution_detected": bool(asset.resolution),
        "frame_rate_detected": bool(asset.frame_rate),
        "duration_valid": asset.duration is not None and asset.duration > 0,
        "audio_channels_detected": asset.audio_channels is not None,
        "status": "PASS"
    }
    failures = []
    if not results["codec_detected"]: failures.append("codec_not_detected")
    if not results["resolution_detected"]: failures.append("resolution_not_detected")
    if not results["duration_valid"]: failures.append("duration_invalid")
    if failures:
        results["status"] = "WARNING"
        results["warnings"] = failures
    return results

# ── ASSETS ROUTER ─────────────────────────────────────────────

@router.get("/assets")
async def list_assets(project_id: Optional[str] = None, asset_type: Optional[str] = None,
                       status: Optional[str] = None, db: Session = Depends(get_db),
                       current_user: User = Depends(get_current_user)):
    query = db.query(Asset)
    if project_id: query = query.filter(Asset.project_id == project_id)
    if asset_type:
        try: query = query.filter(Asset.asset_type == AssetType(asset_type))
        except ValueError: pass
    if status: query = query.filter(Asset.status == status)
    assets = query.limit(100).all()
    return {"success": True, "data": [
        {"id": a.id, "original_filename": a.original_filename,
         "asset_type": a.asset_type.value, "file_size": a.file_size,
         "codec": a.codec, "resolution": a.resolution,
         "verification_result": a.verification_result,
         "status": a.status, "created_at": a.created_at.isoformat()} for a in assets]}

@router.get("/assets/{asset_id}")
async def get_asset(asset_id: str, db: Session = Depends(get_db),
                     current_user: User = Depends(get_current_user)):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail={"code": "ASSET_NOT_FOUND",
            "message": "The requested asset could not be found."})
    jobs = db.query(Job).filter(Job.asset_id == asset_id).all()
    qc = db.query(QCReport).filter(QCReport.asset_id == asset_id).first()
    return {"success": True, "data": {
        "id": asset.id, "original_filename": asset.original_filename,
        "asset_type": asset.asset_type.value, "file_size": asset.file_size,
        "codec": asset.codec, "resolution": asset.resolution,
        "frame_rate": asset.frame_rate, "duration": asset.duration,
        "verification_result": asset.verification_result,
        "jobs": [{"id": j.id, "job_type": j.job_type.value,
                  "status": j.status.value, "progress": j.progress_percentage} for j in jobs],
        "qc": {"overall_status": qc.overall_status.value,
               "technical_status": qc.technical_status.value} if qc else None}}

@router.get("/assets/{asset_id}/download-url")
async def get_download_url(asset_id: str, request: Request,
                            db: Session = Depends(get_db),
                            current_user: User = Depends(get_current_user)):
    req_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail={"code": "ASSET_NOT_FOUND",
            "message": "Asset not found.", "request_id": req_id})
    r2 = get_r2_client()
    if r2:
        try:
            url = r2.generate_presigned_url(
                "get_object",
                Params={"Bucket": settings.R2_BUCKET_NAME, "Key": asset.storage_object_key},
                ExpiresIn=3600
            )
        except ClientError:
            raise HTTPException(status_code=500, detail={"code": "STORAGE_ERROR",
                "message": "Could not generate download link.", "request_id": req_id})
    else:
        url = f"/dev/download/{asset.storage_object_key}"
    write_audit(db, "asset.download_url_generated", user_id=current_user.id,
                resource_type="asset", resource_id=asset_id, request=request)
    return {"success": True, "request_id": req_id, "data": {
        "download_url": url, "expires_in_seconds": 3600,
        "filename": asset.original_filename, "file_size": asset.file_size}}

@router.delete("/assets/{asset_id}")
async def soft_delete_asset(asset_id: str, request: Request,
                             db: Session = Depends(get_db),
                             current_user: User = Depends(get_current_user)):
    req_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail={"code": "ASSET_NOT_FOUND",
            "message": "Asset not found.", "request_id": req_id})
    if asset.asset_type in [AssetType.CAMERA_RAW, AssetType.MASTER]:
        raise HTTPException(status_code=403, detail={"code": "PROTECTED_ASSET",
            "message": f"Original {asset.asset_type.value} files require elevated approval to delete. Contact your Organization Admin.",
            "request_id": req_id})
    asset.status = "deleted"
    db.commit()
    write_audit(db, "asset.soft_deleted", user_id=current_user.id,
                resource_type="asset", resource_id=asset_id, request=request,
                metadata={"asset_type": asset.asset_type.value, "filename": asset.original_filename})
    return {"success": True, "request_id": req_id, "data": {
        "asset_id": asset_id, "status": "deleted",
        "note": "Asset soft-deleted. Will be permanently removed after retention window."}}

# ── JOBS ROUTER ───────────────────────────────────────────────

class TriggerJobRequest(BaseModel):
    asset_id: str
    job_type: str
    priority: int = 5

@router.post("/jobs/trigger", status_code=201)
async def trigger_job(body: TriggerJobRequest, request: Request,
                       db: Session = Depends(get_db),
                       current_user: User = Depends(get_current_user)):
    req_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    asset = db.query(Asset).filter(Asset.id == body.asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail={"code": "ASSET_NOT_FOUND",
            "message": "Asset not found.", "request_id": req_id})
    try: job_type = JobType(body.job_type)
    except ValueError:
        raise HTTPException(status_code=400, detail={"code": "INVALID_JOB_TYPE",
            "message": f"'{body.job_type}' is not a valid job type.", "request_id": req_id})
    job = Job(
        id=str(uuid.uuid4()), job_type=job_type, asset_id=body.asset_id,
        priority=body.priority, status=JobStatus.QUEUED, progress_percentage=0,
        attempt_count=0, created_at=datetime.utcnow()
    )
    db.add(job)
    if job_type == JobType.TECHNICAL_QC:
        qc = QCReport(
            id=str(uuid.uuid4()), asset_id=body.asset_id,
            overall_status=QCStatus.PENDING, technical_status=QCStatus.PENDING,
            visual_status=QCStatus.PENDING, delivery_status=QCStatus.PENDING,
            level1_results=run_qc_level1(asset, db),
            level2_results=run_qc_level2(asset, db),
            generated_at=datetime.utcnow()
        )
        db.add(qc)
        l1 = qc.level1_results
        l2 = qc.level2_results
        if l1.get("status") == "PASS":
            qc.technical_status = QCStatus.PASS if l2.get("status") == "PASS" else QCStatus.WARNING
            qc.overall_status = qc.technical_status
        else:
            qc.overall_status = QCStatus.FAIL
            qc.technical_status = QCStatus.FAIL
        job.status = JobStatus.SUCCEEDED
        job.progress_percentage = 100
        job.completed_at = datetime.utcnow()
    db.commit()
    write_audit(db, "job.triggered", user_id=current_user.id,
                resource_type="job", resource_id=job.id, request=request,
                metadata={"job_type": body.job_type, "asset_id": body.asset_id})
    return {"success": True, "request_id": req_id, "data": {
        "job_id": job.id, "status": job.status.value, "job_type": job.job_type.value,
        "estimated_time": "2-5 minutes for proxy generation"}}

@router.get("/jobs")
async def list_jobs(asset_id: Optional[str] = None, status: Optional[str] = None,
                     db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Job)
    if asset_id: query = query.filter(Job.asset_id == asset_id)
    if status:
        try: query = query.filter(Job.status == JobStatus(status))
        except ValueError: pass
    jobs = query.order_by(Job.created_at.desc()).limit(50).all()
    return {"success": True, "data": [
        {"id": j.id, "job_type": j.job_type.value, "status": j.status.value,
         "progress_percentage": j.progress_percentage, "attempt_count": j.attempt_count,
         "error_code": j.error_code, "safe_error_message": j.safe_error_message,
         "started_at": j.started_at.isoformat() if j.started_at else None,
         "completed_at": j.completed_at.isoformat() if j.completed_at else None} for j in jobs]}

@router.get("/jobs/{job_id}")
async def get_job(job_id: str, db: Session = Depends(get_db),
                   current_user: User = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail={"code": "JOB_NOT_FOUND",
            "message": "The requested job could not be found."})
    return {"success": True, "data": {
        "id": job.id, "job_type": job.job_type.value, "status": job.status.value,
        "progress_percentage": job.progress_percentage, "attempt_count": job.attempt_count,
        "safe_error_message": job.safe_error_message}}

@router.post("/jobs/{job_id}/retry")
async def retry_job(job_id: str, request: Request, db: Session = Depends(get_db),
                     current_user: User = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail={"code": "JOB_NOT_FOUND",
            "message": "Job not found."})
    if job.status not in [JobStatus.FAILED, JobStatus.CANCELLED]:
        raise HTTPException(status_code=400, detail={"code": "JOB_NOT_RETRYABLE",
            "message": "Only FAILED or CANCELLED jobs can be retried."})
    job.status = JobStatus.QUEUED
    job.attempt_count += 1
    job.progress_percentage = 0
    job.error_code = None
    job.safe_error_message = None
    db.commit()
    return {"success": True, "data": {"job_id": job_id, "status": "QUEUED",
        "attempt_count": job.attempt_count}}
