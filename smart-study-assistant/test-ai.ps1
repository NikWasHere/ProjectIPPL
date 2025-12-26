# Test AI connection
Write-Host "Testing AI Connection..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Ollama health
Write-Host "1. Testing Ollama health..." -ForegroundColor Yellow
try {
    $result = docker exec ollama-server curl -s http://localhost:11434/api/tags
    if ($result) {
        Write-Host "SUCCESS: Ollama is running" -ForegroundColor Green
        Write-Host "Available models:" -ForegroundColor Cyan
        docker exec ollama-server ollama list
    }
} catch {
    Write-Host "FAILED: Ollama is not responding" -ForegroundColor Red
}

Write-Host ""

# Test 2: App to Ollama connection
Write-Host "2. Testing app to Ollama connection..." -ForegroundColor Yellow
try {
    $result = docker exec smart-study-assistant curl -s http://ollama:11434/api/tags
    if ($result) {
        Write-Host "SUCCESS: App can reach Ollama" -ForegroundColor Green
    }
} catch {
    Write-Host "FAILED: App cannot reach Ollama" -ForegroundColor Red
}

Write-Host ""

# Test 3: Generate test
Write-Host "3. Testing Ollama generate endpoint..." -ForegroundColor Yellow
Write-Host "Sending test prompt to Ollama..." -ForegroundColor Gray
$testCommand = 'curl -s -X POST http://localhost:11434/api/generate -d "{\"model\":\"qwen2:7b\",\"prompt\":\"Say hello in one sentence\",\"stream\":false}"'
$response = docker exec ollama-server sh -c $testCommand

if ($response) {
    Write-Host "SUCCESS: Generate endpoint is working" -ForegroundColor Green
    $jsonResponse = $response | ConvertFrom-Json
    Write-Host "Response: $($jsonResponse.response)" -ForegroundColor Cyan
} else {
    Write-Host "FAILED: Generate endpoint not working" -ForegroundColor Red
}

Write-Host ""

# Test 4: Application health
Write-Host "4. Testing application health endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3015/api/health" -Method GET -TimeoutSec 5
    Write-Host "SUCCESS: Application is healthy" -ForegroundColor Green
    Write-Host ($health | ConvertTo-Json -Depth 3)
} catch {
    Write-Host "FAILED: Application health check failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "Recent application logs:" -ForegroundColor Cyan
docker-compose logs --tail=20 app

