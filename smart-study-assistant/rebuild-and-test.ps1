# Script to rebuild Docker and test auth locally
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Smart Study Assistant - Docker Rebuild & Test" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if Docker is running
Write-Host "[1/6] Checking Docker status..." -ForegroundColor Yellow
$dockerStatus = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker is not running or paused!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and resume it, then run this script again." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Docker is running" -ForegroundColor Green
Write-Host ""

# Step 2: Stop existing containers
Write-Host "[2/6] Stopping existing containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml down
Write-Host "✓ Containers stopped" -ForegroundColor Green
Write-Host ""

# Step 3: Build Docker image
Write-Host "[3/6] Building Docker image (this may take a while)..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml build --no-cache
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Docker image built successfully" -ForegroundColor Green
Write-Host ""

# Step 4: Start containers
Write-Host "[4/6] Starting containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to start containers!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Containers started" -ForegroundColor Green
Write-Host ""

# Step 5: Wait for services to be ready
Write-Host "[5/6] Waiting for services to be ready (30 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30
Write-Host "✓ Services should be ready" -ForegroundColor Green
Write-Host ""

# Step 6: Test auth endpoints
Write-Host "[6/6] Testing auth endpoints..." -ForegroundColor Yellow
Write-Host ""

# Test health endpoint
Write-Host "Testing health endpoint..." -ForegroundColor Cyan
try {
    $health = Invoke-WebRequest -Uri "http://localhost:3015/api/health" -Method GET -UseBasicParsing -ErrorAction Stop
    if ($health.StatusCode -eq 200) {
        Write-Host "✓ Health check passed" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test NextAuth signin page
Write-Host "Testing NextAuth signin endpoint..." -ForegroundColor Cyan
try {
    $auth = Invoke-WebRequest -Uri "http://localhost:3015/api/auth/signin" -Method GET -UseBasicParsing -ErrorAction Stop
    if ($auth.StatusCode -eq 200) {
        Write-Host "✓ NextAuth signin endpoint accessible (Status: $($auth.StatusCode))" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ NextAuth signin failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test CSRF token endpoint
Write-Host "Testing CSRF token endpoint..." -ForegroundColor Cyan
try {
    $csrf = Invoke-WebRequest -Uri "http://localhost:3015/api/auth/csrf" -Method GET -UseBasicParsing -ErrorAction Stop
    if ($csrf.StatusCode -eq 200) {
        Write-Host "✓ CSRF token endpoint accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ CSRF token endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Show container logs
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Container Status:" -ForegroundColor Cyan
docker-compose -f docker-compose.prod.yml ps
Write-Host ""

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Open browser: http://localhost:3015" -ForegroundColor White
Write-Host "2. Try to login/register" -ForegroundColor White
Write-Host "3. Check logs: docker-compose -f docker-compose.prod.yml logs -f" -ForegroundColor White
Write-Host ""
Write-Host "If auth works locally, ready to create deployment zip!" -ForegroundColor Green
Write-Host ""
