# Crayons Pictures Python Backend — Start Script
# Owner: Abijith Asokan | StreamVista OPC Pvt Ltd

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  CRAYONS PICTURES API" -ForegroundColor White
Write-Host "  Owner: Abijith Asokan | StreamVista OPC Pvt Ltd" -ForegroundColor Gray
Write-Host "  App Designer | Builder | Developer | Film Maker" -ForegroundColor Gray  
Write-Host "  Cost: $0.00/month" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan

# Step 1: Create virtual environment
if (-Not (Test-Path "venv")) {
    Write-Host "`n[1/4] Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Step 2: Activate virtual environment
Write-Host "`n[2/4] Activating virtual environment..." -ForegroundColor Yellow
& "venv\Scripts\Activate.ps1"

# Step 3: Install dependencies
Write-Host "`n[3/4] Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt --quiet

# Step 4: Copy env if needed
if (-Not (Test-Path ".env")) {
    Write-Host "`n[4/4] Creating .env from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "  ⚠ Edit .env file with your API keys before going live." -ForegroundColor Red
}

# Start the API
Write-Host "`n🚀 Starting Crayons Pictures API..." -ForegroundColor Green
Write-Host "   Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "   Health: http://localhost:8000/health" -ForegroundColor Cyan
Write-Host ""

uvicorn main:app --reload --host 0.0.0.0 --port 8000
