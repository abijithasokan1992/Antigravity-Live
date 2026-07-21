# ============================================================
# CRAYONS PICTURES — DATABASE MODELS
# Full schema: Users, Orgs, Workspaces, Projects, Ingest,
#              Assets, Jobs, QC, Films, Payments, Audit
# Owner: Abijith Asokan / Crayons Pictures Union
# ============================================================

import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime,
    Text, JSON, ForeignKey, Enum as SAEnum
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import enum

Base = declarative_base()

def gen_uuid():
    return str(uuid.uuid4())

# ── ENUMS ────────────────────────────────────────────────────

class UserRole(str, enum.Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    ORG_ADMIN = "ORG_ADMIN"
    PRODUCER = "PRODUCER"
    DIT = "DIT"
    ASSISTANT_EDITOR = "ASSISTANT_EDITOR"
    EDITOR = "EDITOR"
    DI_ARTIST = "DI_ARTIST"
    RENTAL_MANAGER = "RENTAL_MANAGER"
    REVIEWER = "REVIEWER"
    DISTRIBUTOR = "DISTRIBUTOR"
    B2B_BUYER = "B2B_BUYER"
    CONSUMER_VIEWER = "CONSUMER_VIEWER"

class OrgType(str, enum.Enum):
    PRODUCTION_HOUSE = "production_house"
    DI_STUDIO = "di_studio"
    RENTAL_HOUSE = "rental_house"
    BROADCASTER = "broadcaster"
    DISTRIBUTOR = "distributor"
    INDEPENDENT_CREATOR = "independent_creator"

class ProjectStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PRE_PRODUCTION = "PRE_PRODUCTION"
    SHOOTING = "SHOOTING"
    INGEST_ACTIVE = "INGEST_ACTIVE"
    POST_PRODUCTION = "POST_PRODUCTION"
    MASTERING = "MASTERING"
    DELIVERY_READY = "DELIVERY_READY"
    ARCHIVED = "ARCHIVED"

class IngestStatus(str, enum.Enum):
    QUEUED = "QUEUED"
    SCANNING = "SCANNING"
    HASHING = "HASHING"
    UPLOADING = "UPLOADING"
    PAUSED = "PAUSED"
    RETRYING = "RETRYING"
    VERIFYING = "VERIFYING"
    COMPLETE = "COMPLETE"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"

class AssetType(str, enum.Enum):
    CAMERA_RAW = "CAMERA_RAW"
    PRODUCTION_AUDIO = "PRODUCTION_AUDIO"
    PROXY = "PROXY"
    SYNCED_PROXY = "SYNCED_PROXY"
    STILL = "STILL"
    LUT = "LUT"
    SCRIPT = "SCRIPT"
    CONTINUITY_REPORT = "CONTINUITY_REPORT"
    CAMERA_REPORT = "CAMERA_REPORT"
    SOUND_REPORT = "SOUND_REPORT"
    MASTER = "MASTER"
    SUBTITLE = "SUBTITLE"
    TRAILER = "TRAILER"
    POSTER = "POSTER"
    LEGAL_DOCUMENT = "LEGAL_DOCUMENT"
    DELIVERY_PACKAGE = "DELIVERY_PACKAGE"

class JobType(str, enum.Enum):
    METADATA_EXTRACTION = "METADATA_EXTRACTION"
    PROXY_GENERATION = "PROXY_GENERATION"
    THUMBNAIL_GENERATION = "THUMBNAIL_GENERATION"
    TECHNICAL_QC = "TECHNICAL_QC"
    AUDIO_ANALYSIS = "AUDIO_ANALYSIS"
    WATERMARK_RENDER = "WATERMARK_RENDER"
    EXPORT_PACKAGE = "EXPORT_PACKAGE"
    ARCHIVE_TRANSFER = "ARCHIVE_TRANSFER"

class JobStatus(str, enum.Enum):
    QUEUED = "QUEUED"
    RUNNING = "RUNNING"
    PAUSED = "PAUSED"
    SUCCEEDED = "SUCCEEDED"
    FAILED = "FAILED"
    RETRYING = "RETRYING"
    CANCELLED = "CANCELLED"

class QCStatus(str, enum.Enum):
    PASS = "PASS"
    FAIL = "FAIL"
    WARNING = "WARNING"
    PENDING = "PENDING"

class EquipmentStatus(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    RESERVED = "RESERVED"
    CHECKED_OUT = "CHECKED_OUT"
    ON_LOCATION = "ON_LOCATION"
    RETURN_PENDING = "RETURN_PENDING"
    UNDER_INSPECTION = "UNDER_INSPECTION"
    SERVICE = "SERVICE"
    DAMAGED = "DAMAGED"
    LOST = "LOST"
    RETIRED = "RETIRED"

class BridgeHandoffStatus(str, enum.Enum):
    NOT_ELIGIBLE = "NOT_ELIGIBLE"
    READY_FOR_HANDOFF = "READY_FOR_HANDOFF"
    SUBMISSION_CREATED = "SUBMISSION_CREATED"
    LEGAL_REVIEW = "LEGAL_REVIEW"
    QC_REVIEW = "QC_REVIEW"
    APPROVED_FOR_MARKETPLACE = "APPROVED_FOR_MARKETPLACE"
    REJECTED = "REJECTED"
    CHANGES_REQUESTED = "CHANGES_REQUESTED"

# ── TABLES ───────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=gen_uuid)
    full_name = Column(String(200), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(20))
    hashed_password = Column(String(255))
    account_status = Column(String(20), default="active")
    user_type = Column(String(50))
    user_subcategory = Column(String(100))
    profile_picture = Column(String(500))
    bio = Column(Text)
    preferred_language = Column(String(10), default="en")
    last_login_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    memberships = relationship("Membership", back_populates="user")

class Organization(Base):
    __tablename__ = "organizations"
    id = Column(String, primary_key=True, default=gen_uuid)
    legal_name = Column(String(300), nullable=False)
    display_name = Column(String(200), nullable=False)
    organization_type = Column(SAEnum(OrgType))
    registration_number = Column(String(100))
    tax_number = Column(String(100))
    billing_address = Column(Text)
    verification_status = Column(String(30), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    workspaces = relationship("Workspace", back_populates="organization")
    memberships = relationship("Membership", back_populates="organization")

class Workspace(Base):
    __tablename__ = "workspaces"
    id = Column(String, primary_key=True, default=gen_uuid)
    org_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    name = Column(String(200), nullable=False)
    workspace_type = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    organization = relationship("Organization", back_populates="workspaces")
    memberships = relationship("Membership", back_populates="workspace")
    projects = relationship("Project", back_populates="workspace")

class Membership(Base):
    __tablename__ = "memberships"
    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    org_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    workspace_id = Column(String, ForeignKey("workspaces.id"))
    role = Column(SAEnum(UserRole), nullable=False)
    status = Column(String(20), default="active")
    invited_by = Column(String, ForeignKey("users.id"))
    joined_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="memberships", foreign_keys=[user_id])
    organization = relationship("Organization", back_populates="memberships")
    workspace = relationship("Workspace", back_populates="memberships")

class Project(Base):
    __tablename__ = "projects"
    id = Column(String, primary_key=True, default=gen_uuid)
    workspace_id = Column(String, ForeignKey("workspaces.id"), nullable=False)
    title = Column(String(300), nullable=False)
    status = Column(SAEnum(ProjectStatus), default=ProjectStatus.DRAFT)
    producer_id = Column(String, ForeignKey("users.id"))
    description = Column(Text)
    storage_path = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    workspace = relationship("Workspace", back_populates="projects")
    shoot_days = relationship("ShootDay", back_populates="project")
    assets = relationship("Asset", back_populates="project")

class ShootDay(Base):
    __tablename__ = "shoot_days"
    id = Column(String, primary_key=True, default=gen_uuid)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    shoot_date = Column(DateTime, nullable=False)
    day_number = Column(Integer)
    location = Column(String(300))
    unit_name = Column(String(100))
    call_time = Column(DateTime)
    wrap_time = Column(DateTime)
    status = Column(String(30), default="planned")
    created_at = Column(DateTime, default=datetime.utcnow)
    project = relationship("Project", back_populates="shoot_days")
    camera_units = relationship("CameraUnit", back_populates="shoot_day")

class CameraUnit(Base):
    __tablename__ = "camera_units"
    id = Column(String, primary_key=True, default=gen_uuid)
    shoot_day_id = Column(String, ForeignKey("shoot_days.id"), nullable=False)
    camera_name = Column(String(100))
    camera_model = Column(String(200))
    camera_serial = Column(String(100))
    operator_name = Column(String(200))
    media_format = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    shoot_day = relationship("ShootDay", back_populates="camera_units")
    camera_cards = relationship("CameraCard", back_populates="camera_unit")

class CameraCard(Base):
    __tablename__ = "camera_cards"
    id = Column(String, primary_key=True, default=gen_uuid)
    camera_unit_id = Column(String, ForeignKey("camera_units.id"), nullable=False)
    card_label = Column(String(100), nullable=False)
    card_serial = Column(String(100))
    source_volume_name = Column(String(200))
    expected_size = Column(Float)
    expected_file_count = Column(Integer)
    actual_file_count = Column(Integer)
    checksum_manifest = Column(JSON)
    ingest_status = Column(SAEnum(IngestStatus), default=IngestStatus.QUEUED)
    verification_status = Column(String(30), default="NOT_VERIFIED")
    upload_complete = Column(Boolean, default=False)
    checksum_verified = Column(Boolean, default=False)
    file_count_matched = Column(Boolean, default=False)
    dit_confirmed = Column(Boolean, default=False)
    cleared_for_formatting = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    camera_unit = relationship("CameraUnit", back_populates="camera_cards")
    ingest_sessions = relationship("IngestSession", back_populates="card")

class IngestSession(Base):
    __tablename__ = "ingest_sessions"
    id = Column(String, primary_key=True, default=gen_uuid)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    shoot_day_id = Column(String, ForeignKey("shoot_days.id"))
    card_id = Column(String, ForeignKey("camera_cards.id"), nullable=False)
    started_by = Column(String, ForeignKey("users.id"), nullable=False)
    source_device = Column(String(200))
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
    status = Column(SAEnum(IngestStatus), default=IngestStatus.QUEUED)
    bytes_total = Column(Float, default=0)
    bytes_uploaded = Column(Float, default=0)
    average_speed = Column(Float, default=0)
    retry_count = Column(Integer, default=0)
    tus_upload_url = Column(String(1000))
    card = relationship("CameraCard", back_populates="ingest_sessions")

class Asset(Base):
    __tablename__ = "assets"
    id = Column(String, primary_key=True, default=gen_uuid)
    org_id = Column(String, ForeignKey("organizations.id"))
    workspace_id = Column(String, ForeignKey("workspaces.id"))
    project_id = Column(String, ForeignKey("projects.id"))
    shoot_day_id = Column(String, ForeignKey("shoot_days.id"))
    card_id = Column(String, ForeignKey("camera_cards.id"))
    parent_asset_id = Column(String, ForeignKey("assets.id"))
    asset_type = Column(SAEnum(AssetType), nullable=False)
    original_filename = Column(String(500), nullable=False)
    storage_object_key = Column(String(1000), nullable=False)
    file_size = Column(Float)
    mime_type = Column(String(200))
    codec = Column(String(100))
    duration = Column(Float)
    frame_rate = Column(String(20))
    resolution = Column(String(50))
    audio_channels = Column(Integer)
    timecode_start = Column(String(30))
    source_hash = Column(String(128))
    cloud_hash = Column(String(128))
    hash_algorithm = Column(String(20))
    verification_result = Column(String(20), default="NOT_VERIFIED")
    status = Column(String(30), default="active")
    metadata_json = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    project = relationship("Project", back_populates="assets")
    jobs = relationship("Job", back_populates="asset")
    qc_reports = relationship("QCReport", back_populates="asset")

class Job(Base):
    __tablename__ = "jobs"
    id = Column(String, primary_key=True, default=gen_uuid)
    job_type = Column(SAEnum(JobType), nullable=False)
    asset_id = Column(String, ForeignKey("assets.id"), nullable=False)
    priority = Column(Integer, default=5)
    status = Column(SAEnum(JobStatus), default=JobStatus.QUEUED)
    progress_percentage = Column(Float, default=0)
    attempt_count = Column(Integer, default=0)
    worker_id = Column(String(200))
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    error_code = Column(String(100))
    safe_error_message = Column(Text)
    output_asset_id = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    asset = relationship("Asset", back_populates="jobs")

class QCReport(Base):
    __tablename__ = "qc_reports"
    id = Column(String, primary_key=True, default=gen_uuid)
    asset_id = Column(String, ForeignKey("assets.id"), nullable=False)
    profile_id = Column(String(100))
    overall_status = Column(SAEnum(QCStatus), default=QCStatus.PENDING)
    technical_status = Column(SAEnum(QCStatus), default=QCStatus.PENDING)
    visual_status = Column(SAEnum(QCStatus), default=QCStatus.PENDING)
    delivery_status = Column(SAEnum(QCStatus), default=QCStatus.PENDING)
    level1_results = Column(JSON)
    level2_results = Column(JSON)
    level3_results = Column(JSON)
    level4_results = Column(JSON)
    generated_at = Column(DateTime, default=datetime.utcnow)
    reviewed_by = Column(String, ForeignKey("users.id"))
    approved_at = Column(DateTime)
    asset = relationship("Asset", back_populates="qc_reports")

class Film(Base):
    __tablename__ = "films"
    id = Column(Integer, primary_key=True)
    uuid = Column(String(32), unique=True, nullable=False, default=gen_uuid)
    title = Column(String(500), nullable=False)
    content_type = Column(String(50), default="movie")
    director = Column(String(300))
    producer = Column(String(300))
    cast = Column(Text)
    duration = Column(Integer)
    language = Column(String(100))
    country = Column(String(100))
    release_date = Column(String(20))
    censor_rating = Column(String(50))
    s3_key = Column(String(1000))
    poster = Column(String(1000))
    trailer = Column(String(1000))
    budget = Column(Float)
    rights_available = Column(Boolean, default=True)
    distribution_territories = Column(Text)
    views_count = Column(Integer, default=0)
    status = Column(String(30), default="published")
    bridge_status = Column(SAEnum(BridgeHandoffStatus), default=BridgeHandoffStatus.NOT_ELIGIBLE)
    created_at = Column(DateTime, default=datetime.utcnow)
    buyer_mappings = relationship("FilmBuyerMapping", back_populates="film")

class FilmBuyerMapping(Base):
    __tablename__ = "film_buyer_mappings"
    id = Column(Integer, primary_key=True)
    film_id = Column(Integer, ForeignKey("films.id"), nullable=False)
    buyer_id = Column(String, ForeignKey("users.id"), nullable=False)
    allow_download = Column(Boolean, default=False)
    allow_film_info_download = Column(Boolean, default=False)
    allow_trailer_download = Column(Boolean, default=False)
    download_requested = Column(Boolean, default=False)
    film_info_requested = Column(Boolean, default=False)
    trailer_download_requested = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    film = relationship("Film", back_populates="buyer_mappings")

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    status = Column(String(30), default="pending")
    razorpay_order_id = Column(String(200))
    razorpay_payment_id = Column(String(200))
    razorpay_signature = Column(String(500))
    receipt = Column(String(200))
    notes = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class Equipment(Base):
    __tablename__ = "equipment"
    id = Column(String, primary_key=True, default=gen_uuid)
    org_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    category = Column(String(100), nullable=False)
    brand = Column(String(200))
    model = Column(String(200))
    serial_number = Column(String(200), unique=True)
    qr_code = Column(String(500))
    ownership_type = Column(String(50))
    purchase_date = Column(DateTime)
    replacement_value = Column(Float)
    current_status = Column(SAEnum(EquipmentStatus), default=EquipmentStatus.AVAILABLE)
    maintenance_due_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(String, primary_key=True, default=gen_uuid)
    org_id = Column(String)
    workspace_id = Column(String)
    user_id = Column(String)
    action = Column(String(200), nullable=False)
    resource_type = Column(String(100))
    resource_id = Column(String(200))
    ip_address = Column(String(50))
    user_agent = Column(Text)
    request_id = Column(String(100))
    timestamp = Column(DateTime, default=datetime.utcnow)
    metadata_json = Column(JSON)
