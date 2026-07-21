# Owner: Abijith Asokan — App Designer, Builder, Developer & Ecosystem Architect, Film Maker
# Company: StreamVista OPC Pvt Ltd / Crayons Pictures Union
# Cost: $0.00/month

import uuid
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import Film, FilmBuyerMapping, BridgeHandoffStatus, User
from routers.auth_router import get_current_user, write_audit

router = APIRouter()

class CreateFilmRequest(BaseModel):
    title: str
    director: Optional[str] = None
    producer: Optional[str] = None
    language: Optional[str] = None
    content_type: str = "movie"
    s3_key: Optional[str] = None
    budget: Optional[float] = None

class UpdateBridgeStatusRequest(BaseModel):
    bridge_status: str

@router.get("/films")
async def list_films(language: Optional[str] = None, content_type: Optional[str] = None,
                      page: int = 1, page_size: int = 20,
                      db: Session = Depends(get_db)):
    query = db.query(Film).filter(Film.status == "published")
    if language: query = query.filter(Film.language == language)
    if content_type: query = query.filter(Film.content_type == content_type)
    total = query.count()
    films = query.offset((page - 1) * page_size).limit(page_size).all()
    return {"success": True, "data": {
        "films": [{"id": f.id, "uuid": f.uuid, "title": f.title,
                   "director": f.director, "producer": f.producer,
                   "language": f.language, "content_type": f.content_type,
                   "duration": f.duration, "poster": f.poster,
                   "rights_available": f.rights_available,
                   "bridge_status": f.bridge_status.value if f.bridge_status else None} for f in films],
        "total": total, "page": page, "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size}}

@router.get("/films/{film_id}")
async def get_film(film_id: int, db: Session = Depends(get_db)):
    film = db.query(Film).filter(Film.id == film_id).first()
    if not film:
        raise HTTPException(status_code=404, detail={"code": "FILM_NOT_FOUND",
            "message": "Film not found."})
    return {"success": True, "data": {
        "id": film.id, "uuid": film.uuid, "title": film.title,
        "director": film.director, "producer": film.producer,
        "cast": film.cast, "language": film.language,
        "duration": film.duration, "s3_key": film.s3_key,
        "poster": film.poster, "trailer": film.trailer,
        "budget": film.budget, "rights_available": film.rights_available,
        "distribution_territories": film.distribution_territories,
        "bridge_status": film.bridge_status.value if film.bridge_status else None,
        "status": film.status}}

@router.get("/films/{film_id}/stream-url")
async def get_stream_url(film_id: int, request: Request,
                          db: Session = Depends(get_db),
                          current_user: User = Depends(get_current_user)):
    req_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    film = db.query(Film).filter(Film.id == film_id).first()
    if not film:
        raise HTTPException(status_code=404, detail={"code": "FILM_NOT_FOUND",
            "message": "Film not found.", "request_id": req_id})
    if not film.s3_key:
        raise HTTPException(status_code=404, detail={"code": "STREAM_NOT_AVAILABLE",
            "message": "Streaming is not yet available for this title.", "request_id": req_id})
    stream_url = f"https://vault.crayonspictures.com/{film.s3_key}"
    film.views_count = (film.views_count or 0) + 1
    db.commit()
    write_audit(db, "film.stream_accessed", user_id=current_user.id,
                resource_type="film", resource_id=str(film_id), request=request)
    return {"success": True, "request_id": req_id, "data": {
        "stream_url": stream_url, "film_title": film.title,
        "expires_in_seconds": 3600, "drm_protected": False}}

@router.get("/films/{film_id}/buyer-access")
async def get_buyer_access(film_id: int, db: Session = Depends(get_db),
                            current_user: User = Depends(get_current_user)):
    mapping = db.query(FilmBuyerMapping).filter(
        FilmBuyerMapping.film_id == film_id,
        FilmBuyerMapping.buyer_id == current_user.id
    ).first()
    if not mapping:
        return {"success": True, "data": {
            "film_id": film_id, "buyer_id": current_user.id,
            "has_access": False, "allow_download": False,
            "allow_trailer": False, "allow_film_info": False}}
    return {"success": True, "data": {
        "film_id": film_id, "buyer_id": current_user.id,
        "has_access": True,
        "allow_download": mapping.allow_download,
        "allow_trailer": mapping.allow_trailer_download,
        "allow_film_info": mapping.allow_film_info_download,
        "download_requested": mapping.download_requested}}

@router.post("/films/{film_id}/request-download")
async def request_download(film_id: int, request: Request,
                            db: Session = Depends(get_db),
                            current_user: User = Depends(get_current_user)):
    req_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    mapping = db.query(FilmBuyerMapping).filter(
        FilmBuyerMapping.film_id == film_id,
        FilmBuyerMapping.buyer_id == current_user.id
    ).first()
    if mapping:
        mapping.download_requested = True
        db.commit()
    else:
        new_mapping = FilmBuyerMapping(
            film_id=film_id, buyer_id=current_user.id,
            download_requested=True, allow_download=False,
            created_at=datetime.utcnow()
        )
        db.add(new_mapping)
        db.commit()
    write_audit(db, "film.download_requested", user_id=current_user.id,
                resource_type="film", resource_id=str(film_id), request=request)
    return {"success": True, "request_id": req_id, "data": {
        "film_id": film_id, "download_requested": True,
        "message": "Download request sent to the content owner for review."}}

@router.post("/films", status_code=201)
async def create_film(body: CreateFilmRequest, request: Request,
                       db: Session = Depends(get_db),
                       current_user: User = Depends(get_current_user)):
    req_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    film = Film(
        uuid=str(uuid.uuid4()), title=body.title, director=body.director,
        producer=body.producer, language=body.language,
        content_type=body.content_type, s3_key=body.s3_key,
        budget=body.budget, rights_available=True,
        status="draft", bridge_status=BridgeHandoffStatus.NOT_ELIGIBLE,
        created_at=datetime.utcnow()
    )
    db.add(film)
    db.commit()
    db.refresh(film)
    write_audit(db, "film.created", user_id=current_user.id,
                resource_type="film", resource_id=str(film.id), request=request)
    return {"success": True, "request_id": req_id, "data": {
        "id": film.id, "title": film.title, "status": film.status}}

@router.patch("/films/{film_id}/bridge-status")
async def update_bridge_status(film_id: int, body: UpdateBridgeStatusRequest,
                                request: Request, db: Session = Depends(get_db),
                                current_user: User = Depends(get_current_user)):
    req_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    film = db.query(Film).filter(Film.id == film_id).first()
    if not film:
        raise HTTPException(status_code=404, detail={"code": "FILM_NOT_FOUND",
            "message": "Film not found.", "request_id": req_id})
    try: new_status = BridgeHandoffStatus(body.bridge_status)
    except ValueError:
        raise HTTPException(status_code=400, detail={"code": "INVALID_BRIDGE_STATUS",
            "message": f"'{body.bridge_status}' is not a valid bridge status.", "request_id": req_id})
    old_status = film.bridge_status.value if film.bridge_status else "NONE"
    film.bridge_status = new_status
    db.commit()
    write_audit(db, "film.bridge_status_changed", user_id=current_user.id,
                resource_type="film", resource_id=str(film_id), request=request,
                metadata={"from": old_status, "to": new_status.value})
    return {"success": True, "request_id": req_id, "data": {
        "film_id": film_id, "bridge_status": new_status.value}}
