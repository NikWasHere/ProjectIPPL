# Setup Ollama with qwen2:7b model
Write-Host "🚀 Setting up Ollama with qwen2:7b model..." -ForegroundColor Cyan

# Start Ollama service
Write-Host "📦 Starting Ollama service..." -ForegroundColor Yellow
docker-compose up -d ollama

# Wait for Ollama to be ready
Write-Host "⏳ Waiting for Ollama to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Pull qwen2:7b model
Write-Host "📥 Pulling qwen2:7b model (this may take a few minutes)..." -ForegroundColor Yellow
docker exec ollama-server ollama pull qwen2:7b

# Verify model is installed
Write-Host "✅ Verifying model installation..." -ForegroundColor Yellow
docker exec ollama-server ollama list

Write-Host "✅ Ollama setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Available models:" -ForegroundColor Cyan
docker exec ollama-server ollama list
