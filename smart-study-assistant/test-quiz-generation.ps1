# Test Ollama Generate via Application API
Write-Host "Testing Quiz Generation via Application API..." -ForegroundColor Cyan
Write-Host ""

# Create a simple test text file
$testText = "Python is a high-level programming language. It was created by Guido van Rossum and first released in 1991."

# Test generate-quiz endpoint
Write-Host "Sending request to /api/generate-quiz..." -ForegroundColor Yellow

$body = @{
    text = $testText
    numberOfQuestions = 2
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3015/api/generate-quiz" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -TimeoutSec 60

    Write-Host ""
    Write-Host "SUCCESS: Quiz generated!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Cyan
    Write-Host ($response | ConvertTo-Json -Depth 5)
    
} catch {
    Write-Host ""
    Write-Host "FAILED: Could not generate quiz" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Show detailed error
    if ($_.ErrorDetails) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Checking logs for any errors..." -ForegroundColor Yellow
docker-compose logs --tail=30 app
