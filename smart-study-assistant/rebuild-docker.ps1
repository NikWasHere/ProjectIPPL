# Rebuild and restart Docker containers
Write-Host "Rebuilding Docker containers..." -ForegroundColor Cyan

# Stop and remove existing containers
Write-Host "Stopping existing containers..." -ForegroundColor Yellow
docker-compose down

# Remove old images
Write-Host "Removing old images..." -ForegroundColor Yellow
docker rmi smart-study-assistant-app -f 2>$null

# Build new image
Write-Host "Building new Docker image..." -ForegroundColor Yellow
docker-compose build --no-cache

# Start Ollama first
Write-Host "Starting Ollama service..." -ForegroundColor Yellow
docker-compose up -d ollama

# Wait for Ollama
Write-Host "Waiting for Ollama to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if qwen2:7b model exists
Write-Host "Checking for qwen2:7b model..." -ForegroundColor Yellow
$modelCheck = docker exec ollama-server ollama list 2>&1
Write-Host $modelCheck

if ($modelCheck -notmatch "qwen2:7b") {
    Write-Host "Pulling qwen2:7b model..." -ForegroundColor Yellow
    docker exec ollama-server ollama pull qwen2:7b
} else {
    Write-Host "qwen2:7b model already exists" -ForegroundColor Green
}

# Start the app
Write-Host "Starting application..." -ForegroundColor Yellow
docker-compose up -d app

# Wait for app to start
Write-Host "Waiting for application to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Show logs
Write-Host ""
Write-Host "Application logs:" -ForegroundColor Cyan
docker-compose logs --tail=50 app

Write-Host ""
Write-Host "Rebuild complete!" -ForegroundColor Green
Write-Host "Application running at: http://localhost:3015" -ForegroundColor Cyan
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  View logs: docker-compose logs -f app"
Write-Host "  Restart: docker-compose restart app"
Write-Host "  Stop all: docker-compose down"
Write-Host "  Check status: docker-compose ps"

