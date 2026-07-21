# Owner: Abijith Asokan — App Designer, Builder, Developer & Ecosystem Architect, Film Maker
# Company: StreamVista OPC Pvt Ltd / Crayons Pictures Union
# Cost: $0.00/month

import uuid, httpx
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from config import settings
from database import get_db
from models import User
from routers.auth_router import get_current_user

router = APIRouter()

class SendNotificationRequest(BaseModel):
    user_id: str
    channel: str  # email | sms | whatsapp | inapp
    event: str
    data: dict = {}

# ── EMAIL (Resend) ────────────────────────────────────────────

async def send_email(to: str, subject: str, html_body: str, from_name: str = "Crayons Pictures"):
    if not settings.RESEND_API_KEY:
        print(f"[DEV] Email to {to}: {subject}")
        return {"id": "dev-email", "status": "sent"}
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {settings.RESEND_API_KEY}",
                     "Content-Type": "application/json"},
            json={"from": f"{from_name} <{settings.EMAIL_FROM}>",
                  "to": [to], "subject": subject, "html": html_body}
        )
        return resp.json()

# ── SMS (MSG91) ───────────────────────────────────────────────

async def send_sms(phone: str, message: str):
    if not settings.MSG91_AUTH_KEY:
        print(f"[DEV] SMS to {phone}: {message}")
        return {"type": "success"}
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://api.msg91.com/api/v5/flow/",
            headers={"authkey": settings.MSG91_AUTH_KEY, "Content-Type": "application/json"},
            json={"template_id": settings.MSG91_TEMPLATE_ID,
                  "sender": settings.MSG91_SENDER_ID,
                  "mobiles": phone, "VAR1": message}
        )
        return resp.json()

# ── WHATSAPP (Meta Cloud API) ─────────────────────────────────

async def send_whatsapp(phone: str, template_name: str, params: list):
    if not settings.WHATSAPP_TOKEN:
        print(f"[DEV] WhatsApp to {phone}: template={template_name}, params={params}")
        return {"status": "sent"}
    url = f"https://graph.facebook.com/v18.0/{settings.WHATSAPP_PHONE_ID}/messages"
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            url,
            headers={"Authorization": f"Bearer {settings.WHATSAPP_TOKEN}",
                     "Content-Type": "application/json"},
            json={"messaging_product": "whatsapp", "to": phone,
                  "type": "template", "template": {
                      "name": template_name, "language": {"code": "en"},
                      "components": [{"type": "body", "parameters":
                          [{"type": "text", "text": p} for p in params]}]}}
        )
        return resp.json()

# ── NOTIFICATION EVENT DISPATCHER ────────────────────────────

EVENT_TEMPLATES = {
    "upload.complete": {
        "email_subject": "✅ Upload Complete — Crayons Ingest",
        "email_body": "<h2>Upload Complete</h2><p>Your files have been successfully uploaded to Crayons Vault.</p>",
        "sms": "Crayons: Upload complete. Checksum verification in progress.",
        "whatsapp_template": "upload_complete",
        "channels": ["email", "inapp"]
    },
    "checksum.mismatch": {
        "email_subject": "🔴 CRITICAL: Checksum Mismatch — Action Required",
        "email_body": "<h2>Checksum Mismatch Detected</h2><p>One or more files failed verification. Card clearance is BLOCKED. Please re-upload the affected files.</p>",
        "sms": "CRITICAL: Crayons checksum mismatch on your upload. Card clearance blocked. Check dashboard.",
        "whatsapp_template": "checksum_mismatch",
        "channels": ["email", "sms", "inapp"]
    },
    "proxy.ready": {
        "email_subject": "🎬 Proxy Ready — Crayons Studio",
        "email_body": "<h2>Proxy Ready</h2><p>Your review proxy has been generated and is ready for viewing.</p>",
        "sms": "Crayons: Proxy ready for review.",
        "whatsapp_template": "proxy_ready",
        "channels": ["inapp", "whatsapp"]
    },
    "qc.failed": {
        "email_subject": "⚠️ QC Failed — Review Required",
        "email_body": "<h2>QC Check Failed</h2><p>One or more quality checks failed on your asset. Please review the QC report in your dashboard.</p>",
        "sms": "Crayons: QC failed on your asset. Check dashboard immediately.",
        "whatsapp_template": "qc_failed",
        "channels": ["email", "sms"]
    },
    "delivery.ready": {
        "email_subject": "📦 Delivery Ready — Crayons Studio",
        "email_body": "<h2>Delivery Package Ready</h2><p>Your editor delivery package is ready for download.</p>",
        "sms": "Crayons: Delivery package ready.",
        "whatsapp_template": "delivery_ready",
        "channels": ["email", "whatsapp"]
    },
    "card.safe_to_format": {
        "email_subject": "✅ Card Safe to Format — DIT Confirmed",
        "email_body": "<h2>Card Cleared</h2><p>All checks passed. This card is now SAFE TO FORMAT.</p>",
        "sms": "Crayons DIT: Card SAFE TO FORMAT. All checks passed.",
        "whatsapp_template": "card_safe",
        "channels": ["inapp", "sms"]
    }
}

@router.post("/notify/send")
async def send_notification(body: SendNotificationRequest, request: Request,
                             db: Session = Depends(get_db),
                             current_user: User = Depends(get_current_user)):
    req_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    template = EVENT_TEMPLATES.get(body.event)
    if not template:
        return {"success": False, "error": {"code": "UNKNOWN_EVENT",
            "message": f"No template for event '{body.event}'", "request_id": req_id}}

    user = db.query(User).filter(User.id == body.user_id).first()
    if not user:
        return {"success": False, "error": {"code": "USER_NOT_FOUND",
            "message": "Recipient user not found.", "request_id": req_id}}

    results = {}
    channels = body.channel.split(",") if body.channel != "auto" else template["channels"]

    if "email" in channels and user.email:
        results["email"] = await send_email(
            user.email, template["email_subject"], template["email_body"])

    if "sms" in channels and user.phone:
        results["sms"] = await send_sms(user.phone, template["sms"])

    if "whatsapp" in channels and user.phone:
        results["whatsapp"] = await send_whatsapp(
            user.phone, template["whatsapp_template"],
            [user.full_name, body.event])

    return {"success": True, "request_id": req_id, "data": {
        "event": body.event, "user_id": body.user_id,
        "channels_triggered": list(results.keys()), "results": results}}
