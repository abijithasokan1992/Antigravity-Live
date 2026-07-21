# ============================================================
# CRAYONS PICTURES — FASTAPI MAIN APPLICATION
# Owner: Abijith Asokan
#   App Designer, Builder, Developer & Ecosystem Architect
#   Film Maker
# Company: StreamVista OPC Pvt Ltd / Crayons Pictures Union
# Cost: $0.00/month
# ============================================================

import uuid
import time
import structlog
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from config import settings
from database import create_tables

log = structlog.get_logger()

# ── STARTUP ─────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("🎬 Crayons Pictures API starting up", env=settings.APP_ENV)
    create_tables()
    log.info("✅ Database tables initialized")
    yield
    log.info("🛑 Crayons Pictures API shutting down")

# ── APP INSTANCE ─────────────────────────────────────────────
app = FastAPI(
    title="Crayons Pictures API",
    description="""
## Crayons Pictures — Production Media Platform API

**Owner:** Abijith Asokan  
**Title:** App Designer, Builder, Developer & Ecosystem Architect | Film Maker  
**Company:** StreamVista OPC Pvt Ltd / Crayons Pictures Union  
**All IP owned by Abijith Asokan. All rights reserved.**

---

### Products
- **Crayons Creator Cloud** — CloudStudio, DIT, Studio, Archive
- **Crayons Bridge** — Marketplace
- **Crayons Loop** — Streaming (SVOD/FAST)
- **StreamVista** — Media OS

### API Base
`api.crayonspictures.com/v1/`

### Core Principle
*Safely move production footage from set to editor.*
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── CORS ─────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── REQUEST ID MIDDLEWARE ────────────────────────────────────
@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = f"req_{uuid.uuid4().hex[:12]}"
    request.state.request_id = request_id
    start = time.time()
    response = await call_next(request)
    duration = round((time.time() - start) * 1000, 2)
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Response-Time"] = f"{duration}ms"
    response.headers["X-Powered-By"] = "Crayons Pictures"
    return response

# ── GLOBAL EXCEPTION HANDLER ─────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    request_id = getattr(request.state, "request_id", "req_unknown")
    log.error("Unhandled exception", request_id=request_id, error=str(exc))
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred. Please try again.",
                "request_id": request_id,
            }
        }
    )

# ── HEALTH CHECK ──────────────────────────────────────────────
@app.get("/", tags=["Health"])
async def root():
    return {
        "success": True,
        "data": {
            "service": "Crayons Pictures API",
            "version": "1.0.0",
            "owner": "Abijith Asokan — StreamVista OPC Pvt Ltd",
            "status": "operational",
            "products": [
                "Crayons Creator Cloud",
                "Crayons Bridge",
                "Crayons Loop",
                "StreamVista Media OS"
            ]
        }
    }

@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "service": "crayons-pictures-api"}

# ── ROUTERS (imported after files are created by subagent) ────
try:
    from routers.auth_router import router as auth_router
    app.include_router(auth_router, prefix="/v1", tags=["Auth — Crayons Identity"])
except ImportError:
    pass

try:
    from routers.projects_router import router as projects_router
    app.include_router(projects_router, prefix="/v1", tags=["Projects — Creator Cloud"])
except ImportError:
    pass

try:
    from routers.ingest_router import router as ingest_router
    app.include_router(ingest_router, prefix="/v1", tags=["Ingest — DIT Engine"])
except ImportError:
    pass

try:
    from routers.assets_router import router as assets_router
    app.include_router(assets_router, prefix="/v1", tags=["Assets — Crayons Vault"])
except ImportError:
    pass

try:
    from routers.jobs_router import router as jobs_router
    app.include_router(jobs_router, prefix="/v1", tags=["Jobs — Crayons Transcode + QC"])
except ImportError:
    pass

try:
    from routers.films_router import router as films_router
    app.include_router(films_router, prefix="/v1", tags=["Films — Crayons Loop + Bridge"])
except ImportError:
    pass

try:
    from routers.notifications_router import router as notify_router
    app.include_router(notify_router, prefix="/v1", tags=["Notifications — Crayons Notify"])
except ImportError:
    pass
