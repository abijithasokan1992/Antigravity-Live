# Owner: Abijith Asokan — App Designer, Builder, Developer & Ecosystem Architect, Film Maker
# Company: StreamVista OPC Pvt Ltd / Crayons Pictures Union
# Cost: $0.00/month

import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt

from database import get_db
from models import User, AuditLog, UserRole, Membership
from config import settings

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer_scheme = HTTPBearer()

# ── HELPERS ──────────────────────────────────────────────────

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def write_audit(db: Session, action: str, user_id: str = None, resource_type: str = None,
                resource_id: str = None, request: Request = None, metadata: dict = None):
    log = AuditLog(
        id=str(uuid.uuid4()),
        user_id=user_id,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        ip_address=request.client.host if request else None,
        user_agent=request.headers.get("user-agent") if request else None,
        request_id=getattr(request.state, "request_id", None) if request else None,
        metadata_json=metadata,
        timestamp=datetime.utcnow()
    )
    db.add(log)
    db.commit()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail={"code": "INVALID_TOKEN", "message": "Token is invalid."})
    except JWTError:
        raise HTTPException(status_code=401, detail={"code": "TOKEN_EXPIRED", "message": "Session has expired. Please sign in again."})
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.account_status != "active":
        raise HTTPException(status_code=401, detail={"code": "USER_NOT_FOUND", "message": "User account not found or suspended."})
    return user

def require_role(*roles: UserRole):
    def checker(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
        membership = db.query(Membership).filter(Membership.user_id == current_user.id).first()
        if not membership or membership.role.value not in [r.value for r in roles]:
            raise HTTPException(
                status_code=403,
                detail={"code": "INSUFFICIENT_PERMISSIONS", "message": "You do not have permission to perform this action."}
            )
        return current_user
    return checker

# ── SCHEMAS ──────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone: str = None
    user_type: str = "producer_creator"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# ── ROUTES ───────────────────────────────────────────────────

@router.post("/auth/register", status_code=201)
async def register(body: RegisterRequest, request: Request, db: Session = Depends(get_db)):
    req_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    existing = db.query(User).filter(User.email == body.email).first()
    if existing:
        raise HTTPException(status_code=400, detail={"code": "EMAIL_ALREADY_EXISTS",
            "message": "An account with this email already exists.", "request_id": req_id})
    user = User(
        id=str(uuid.uuid4()),
        full_name=body.full_name,
        email=body.email,
        phone=body.phone,
        hashed_password=hash_password(body.password),
        user_type=body.user_type,
        account_status="active",
        created_at=datetime.utcnow()
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": user.id, "email": user.email, "user_type": user.user_type})
    write_audit(db, "user.registered", user_id=user.id, resource_type="user",
                resource_id=user.id, request=request)
    return {"success": True, "request_id": req_id, "data": {
        "token": token, "user": {"id": user.id, "full_name": user.full_name,
        "email": user.email, "user_type": user.user_type}}}

@router.post("/auth/login")
async def login(body: LoginRequest, request: Request, db: Session = Depends(get_db)):
    req_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not verify_password(body.password, user.hashed_password or ""):
        raise HTTPException(status_code=401, detail={"code": "INVALID_CREDENTIALS",
            "message": "Email or password is incorrect.", "request_id": req_id})
    if user.account_status != "active":
        raise HTTPException(status_code=403, detail={"code": "ACCOUNT_SUSPENDED",
            "message": "Your account has been suspended. Contact support.", "request_id": req_id})
    user.last_login_at = datetime.utcnow()
    db.commit()
    token = create_access_token({"sub": user.id, "email": user.email, "user_type": user.user_type})
    membership = db.query(Membership).filter(Membership.user_id == user.id, Membership.status == "active").first()
    write_audit(db, "user.login", user_id=user.id, resource_type="user",
                resource_id=user.id, request=request)
    return {"success": True, "request_id": req_id, "data": {
        "token": token,
        "user": {"id": user.id, "full_name": user.full_name, "email": user.email,
                 "user_type": user.user_type, "role": membership.role.value if membership else None}}}

@router.get("/auth/me")
async def me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    memberships = db.query(Membership).filter(Membership.user_id == current_user.id).all()
    return {"success": True, "data": {
        "id": current_user.id, "full_name": current_user.full_name,
        "email": current_user.email, "phone": current_user.phone,
        "user_type": current_user.user_type, "account_status": current_user.account_status,
        "memberships": [{"org_id": m.org_id, "workspace_id": m.workspace_id,
                         "role": m.role.value, "status": m.status} for m in memberships]}}
