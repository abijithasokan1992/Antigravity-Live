# ============================================================
# CRAYONS PICTURES — PYTHON FASTAPI DOCKER IMAGE
# Owner: Abijith Asokan | StreamVista OPC Pvt Ltd
# App Designer, Builder, Developer & Ecosystem Architect
# Film Maker
# ============================================================

FROM python:3.11-slim

# Install system dependencies (FFmpeg for media processing)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libmagic1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements first for Docker layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start Crayons Pictures API
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
