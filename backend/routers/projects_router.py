# Owner: Abijith Asokan — App Designer, Builder, Developer & Ecosystem Architect, Film Maker
# Company: StreamVista OPC Pvt Ltd / Crayons Pictures Union
# Cost: $0.00/month

import uuid
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import (Project, ShootDay, CameraUnit, CameraCard,
                    ProjectStatus, IngestStatus, User, AuditLog)
from routers.auth_router import get_current_user, write_audit

router = APIRouter()

LIFECYCLE_ORDER = [
    ProjectStatus.DRAFT, ProjectStatus.PRE_PRODUCTION, ProjectStatus.SHOOTING,
    ProjectStatus.INGEST_ACTIVE, ProjectStatus.POST_PRODUCTION, ProjectStatus.MASTERING,
    ProjectStatus.DELIVERY_READY, ProjectStatus.ARCHIVED
]

# ── SCHEMAS ──────────────────────────────────────────────────

class CreateProjectRequest(BaseModel):
    title: str
    workspace_id: str
    description: Optional[str] = None

class CreateShootDayRequest(BaseModel):
    shoot_date: str
    location: Optional[str] = None
    day_number: Optional[int] = None
    unit_name: Optional[str] = None

class CreateCameraUnitRequest(BaseModel):
    camera_name: str
    camera_model: Optional[str] = None
    camera_serial: Optional[str] = None
    operator_name: Optional[str] = None
    media_format: Optional[str] = None

class RegisterCardRequest(BaseModel):
    card_label: str
    card_serial: Optional[str] = None
    expected_size: Optional[float] = None
    expected_file_count: Optional[int] = None

class AdvanceStatusRequest(BaseModel):
    target_status: str

# ── PROJECTS ──────────────────────────────────────────────────

@router.post("/projects", status_code=201)
async def create_project(body: CreateProjectRequest, request: Request,
                         db: Session = Depends(get_db),
                         current_user: User = Depends(get_current_user)):
    req_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    project = Project(
        id=str(uuid.uuid4()), workspace_id=body.workspace_id,
        title=body.title, description=body.description,
        producer_id=current_user.id, status=ProjectStatus.DRAFT,
        created_at=datetime.utcnow()
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    write_audit(db, "project.created", user_id=current_user.id,
                resource_type="project", resource_id=project.id, request=request)
    return {"success": True, "request_id": req_id, "data": {
        "id": project.id, "title": project.title, "status": project.status.value,
        "created_at": project.created_at.isoformat()}}

@router.get("/projects")
async def list_projects(db: Session = Depends(get_db),
                        current_user: User = Depends(get_current_user)):
    projects = db.query(Project).filter(Project.producer_id == current_user.id).all()
    return {"success": True, "data": [
        {"id": p.id, "title": p.title, "status": p.status.value,
         "created_at": p.created_at.isoformat()} for p in projects]}

@router.get("/projects/{project_id}")
async def get_project(project_id: str, db: Session = Depends(get_db),
                      current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail={"code": "PROJECT_NOT_FOUND",
            "message": "The requested project could not be found."})
    shoot_days = db.query(ShootDay).filter(ShootDay.project_id == project_id).all()
    return {"success": True, "data": {
        "id": project.id, "title": project.title, "status": project.status.value,
        "description": project.description, "shoot_days_count": len(shoot_days),
        "created_at": project.created_at.isoformat()}}

@router.patch("/projects/{project_id}/status")
async def advance_project_status(project_id: str, body: AdvanceStatusRequest,
                                  request: Request, db: Session = Depends(get_db),
                                  current_user: User = Depends(get_current_user)):
    req_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail={"code": "PROJECT_NOT_FOUND",
            "message": "Project not found.", "request_id": req_id})
    try:
        new_status = ProjectStatus(body.target_status)
        current_idx = LIFECYCLE_ORDER.index(project.status)
        new_idx = LIFECYCLE_ORDER.index(new_status)
    except ValueError:
        raise HTTPException(status_code=400, detail={"code": "INVALID_STATUS",
            "message": f"'{body.target_status}' is not a valid project status.", "request_id": req_id})
    if new_idx != current_idx + 1:
        raise HTTPException(status_code=400, detail={"code": "INVALID_STATUS_TRANSITION",
            "message": f"Cannot advance from {project.status.value} to {new_status.value}. Must follow lifecycle order.",
            "request_id": req_id})
    old_status = project.status.value
    project.status = new_status
    project.updated_at = datetime.utcnow()
    db.commit()
    write_audit(db, "project.status_changed", user_id=current_user.id,
                resource_type="project", resource_id=project_id, request=request,
                metadata={"from": old_status, "to": new_status.value})
    return {"success": True, "request_id": req_id, "data": {
        "id": project.id, "status": project.status.value}}

# ── SHOOT DAYS ────────────────────────────────────────────────

@router.post("/projects/{project_id}/shoot-days", status_code=201)
async def create_shoot_day(project_id: str, body: CreateShootDayRequest,
                            request: Request, db: Session = Depends(get_db),
                            current_user: User = Depends(get_current_user)):
    req_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    shoot_day = ShootDay(
        id=str(uuid.uuid4()), project_id=project_id,
        shoot_date=datetime.fromisoformat(body.shoot_date),
        location=body.location, day_number=body.day_number,
        unit_name=body.unit_name, status="planned", created_at=datetime.utcnow()
    )
    db.add(shoot_day)
    db.commit()
    db.refresh(shoot_day)
    write_audit(db, "shoot_day.created", user_id=current_user.id,
                resource_type="shoot_day", resource_id=shoot_day.id, request=request)
    return {"success": True, "request_id": req_id, "data": {
        "id": shoot_day.id, "shoot_date": shoot_day.shoot_date.isoformat(),
        "location": shoot_day.location, "status": shoot_day.status}}

@router.get("/projects/{project_id}/shoot-days")
async def list_shoot_days(project_id: str, db: Session = Depends(get_db),
                           current_user: User = Depends(get_current_user)):
    days = db.query(ShootDay).filter(ShootDay.project_id == project_id).all()
    return {"success": True, "data": [
        {"id": d.id, "shoot_date": d.shoot_date.isoformat(),
         "location": d.location, "day_number": d.day_number,
         "status": d.status} for d in days]}

# ── CAMERA UNITS ──────────────────────────────────────────────

@router.post("/projects/{project_id}/shoot-days/{day_id}/camera-units", status_code=201)
async def create_camera_unit(project_id: str, day_id: str, body: CreateCameraUnitRequest,
                              request: Request, db: Session = Depends(get_db),
                              current_user: User = Depends(get_current_user)):
    req_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    unit = CameraUnit(
        id=str(uuid.uuid4()), shoot_day_id=day_id,
        camera_name=body.camera_name, camera_model=body.camera_model,
        camera_serial=body.camera_serial, operator_name=body.operator_name,
        media_format=body.media_format, created_at=datetime.utcnow()
    )
    db.add(unit)
    db.commit()
    db.refresh(unit)
    return {"success": True, "request_id": req_id, "data": {
        "id": unit.id, "camera_name": unit.camera_name, "operator_name": unit.operator_name}}

# ── CAMERA CARDS ──────────────────────────────────────────────

@router.post("/projects/{project_id}/shoot-days/{day_id}/camera-units/{unit_id}/cards", status_code=201)
async def register_card(project_id: str, day_id: str, unit_id: str,
                         body: RegisterCardRequest, request: Request,
                         db: Session = Depends(get_db),
                         current_user: User = Depends(get_current_user)):
    req_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    card = CameraCard(
        id=str(uuid.uuid4()), camera_unit_id=unit_id,
        card_label=body.card_label, card_serial=body.card_serial,
        expected_size=body.expected_size, expected_file_count=body.expected_file_count,
        ingest_status=IngestStatus.QUEUED, verification_status="NOT_VERIFIED",
        upload_complete=False, checksum_verified=False,
        file_count_matched=False, dit_confirmed=False,
        cleared_for_formatting=False, created_at=datetime.utcnow()
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    write_audit(db, "camera_card.registered", user_id=current_user.id,
                resource_type="camera_card", resource_id=card.id, request=request,
                metadata={"card_label": body.card_label, "project_id": project_id})
    return {"success": True, "request_id": req_id, "data": {
        "id": card.id, "card_label": card.card_label,
        "ingest_status": card.ingest_status.value, "cleared_for_formatting": False}}

@router.get("/projects/{project_id}/cards/{card_id}/clearance")
async def get_card_clearance(project_id: str, card_id: str,
                              db: Session = Depends(get_db),
                              current_user: User = Depends(get_current_user)):
    card = db.query(CameraCard).filter(CameraCard.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail={"code": "CARD_NOT_FOUND",
            "message": "Camera card not found."})
    all_checks_pass = all([card.upload_complete, card.checksum_verified,
                           card.file_count_matched, card.dit_confirmed])
    return {"success": True, "data": {
        "card_id": card_id, "card_label": card.card_label,
        "upload_complete": card.upload_complete,
        "checksum_verified": card.checksum_verified,
        "file_count_matched": card.file_count_matched,
        "dit_confirmed": card.dit_confirmed,
        "cleared_for_formatting": card.cleared_for_formatting,
        "safe_to_format": all_checks_pass,
        "status_banner": "✅ SAFE TO FORMAT" if all_checks_pass else "🔴 NOT SAFE TO FORMAT — Checks incomplete"}}

@router.post("/projects/{project_id}/cards/{card_id}/dit-confirm")
async def dit_confirm_card(project_id: str, card_id: str, request: Request,
                            db: Session = Depends(get_db),
                            current_user: User = Depends(get_current_user)):
    req_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    card = db.query(CameraCard).filter(CameraCard.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail={"code": "CARD_NOT_FOUND",
            "message": "Camera card not found.", "request_id": req_id})
    card.dit_confirmed = True
    all_clear = all([card.upload_complete, card.checksum_verified,
                     card.file_count_matched, card.dit_confirmed])
    card.cleared_for_formatting = all_clear
    card.updated_at = datetime.utcnow()
    db.commit()
    write_audit(db, "camera_card.dit_confirmed", user_id=current_user.id,
                resource_type="camera_card", resource_id=card_id, request=request)
    return {"success": True, "request_id": req_id, "data": {
        "card_id": card_id, "dit_confirmed": True,
        "cleared_for_formatting": all_clear,
        "safe_to_format": all_clear,
        "message": "✅ SAFE TO FORMAT — All checks passed." if all_clear
                   else "⚠️ DIT confirmed but other checks still pending."}}
