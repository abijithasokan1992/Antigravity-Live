# ============================================================
# CRAYONS PICTURES — PYTHON FASTAPI BACKEND
# Owner: Abijith Asokan / Crayons Pictures Union
# Cost: $0.00/month
# ============================================================

import os
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # App
    APP_NAME: str = "Crayons Pictures API"
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = "development"
    SECRET_KEY: str = "crayons-pictures-secret-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Database (Supabase Postgres or local SQLite)
    DATABASE_URL: str = "sqlite:///./crayons_pictures.db"

    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    # Cloudflare R2 (S3-compatible)
    R2_ACCOUNT_ID: str = ""
    R2_ACCESS_KEY_ID: str = ""
    R2_SECRET_ACCESS_KEY: str = ""
    R2_BUCKET_NAME: str = "crayons-vault"
    R2_ENDPOINT_URL: str = ""

    # Email (Resend)
    RESEND_API_KEY: str = ""
    EMAIL_FROM: str = "noreply@crayonspictures.com"
    EMAIL_FROM_NAME: str = "Crayons Pictures"

    # SMS (MSG91)
    MSG91_AUTH_KEY: str = ""
    MSG91_SENDER_ID: str = "CRAYON"
    MSG91_TEMPLATE_ID: str = ""

    # WhatsApp (Meta Cloud API)
    WHATSAPP_TOKEN: str = ""
    WHATSAPP_PHONE_ID: str = ""

    # Google Gemini (Crayons Bridge AI)
    GEMINI_API_KEY: str = ""

    # Razorpay
    RAZORPAY_KEY_ID: str = ""
    RAZORPAY_KEY_SECRET: str = ""

    # CORS
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3001",
        "https://streamvista.in",
        "https://crayonspictures.com",
        "https://streamvistacreator.com",
        "https://crayonsloop.com",
    ]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
