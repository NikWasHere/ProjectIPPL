# Pre-ZIP Checklist - Smart Study Assistant
Write-Host "Checking deployment readiness..." -ForegroundColor Cyan
Write-Host ""

$ProjectRoot = $PSScriptRoot
$AllGood = $true

# Critical files that must exist
$CriticalFiles = @(
    "package.json",
    "package-lock.json",
    "Dockerfile",
    "docker-compose.yml",
    ".env.production",
    "next.config.ts",
    "tsconfig.json",
    "prisma/schema.prisma",
    "README-DEPLOYMENT.md",
    "rebuild-docker.ps1",
    "test-ai.ps1"
)

Write-Host "Checking critical files..." -ForegroundColor Yellow
foreach ($file in $CriticalFiles) {
    $fullPath = Join-Path $ProjectRoot $file
    if (Test-Path $fullPath) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file (MISSING!)" -ForegroundColor Red
        $AllGood = $false
    }
}

Write-Host ""
Write-Host "Checking Docker configuration..." -ForegroundColor Yellow

# Check Dockerfile has correct permissions
$dockerfileContent = Get-Content (Join-Path $ProjectRoot "Dockerfile") -Raw
if ($dockerfileContent -match "chown -R nextjs:nodejs") {
    Write-Host "  ✅ Dockerfile permissions configured" -ForegroundColor Green
} else {
    Write-Host "  ⚠️ Dockerfile may have permission issues" -ForegroundColor Yellow
}

# Check docker-compose has Ollama
$composeContent = Get-Content (Join-Path $ProjectRoot "docker-compose.yml") -Raw
if ($composeContent -match "ollama/ollama") {
    Write-Host "  ✅ Ollama service configured" -ForegroundColor Green
} else {
    Write-Host "  ❌ Ollama service missing" -ForegroundColor Red
    $AllGood = $false
}

if ($composeContent -match "AUTH_TRUST_HOST") {
    Write-Host "  ✅ Auth trust host configured" -ForegroundColor Green
} else {
    Write-Host "  ⚠️ AUTH_TRUST_HOST may be missing" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Checking environment template..." -ForegroundColor Yellow
$envProdPath = Join-Path $ProjectRoot ".env.production"
if (Test-Path $envProdPath) {
    $envContent = Get-Content $envProdPath -Raw
    
    if ($envContent -match "OLLAMA_BASE_URL") {
        Write-Host "  ✅ Ollama configuration in .env.production" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Ollama config missing" -ForegroundColor Red
        $AllGood = $false
    }
    
    if ($envContent -match "AUTH_TRUST_HOST") {
        Write-Host "  ✅ Auth trust host in .env.production" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️ AUTH_TRUST_HOST missing in .env.production" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Checking source files..." -ForegroundColor Yellow
$srcPath = Join-Path $ProjectRoot "src"
if (Test-Path $srcPath) {
    $tsFiles = (Get-ChildItem -Path $srcPath -Recurse -Filter "*.ts*").Count
    $apiRoutes = (Get-ChildItem -Path (Join-Path $srcPath "app/api") -Recurse -Filter "route.ts").Count
    
    Write-Host "  ✅ $tsFiles TypeScript files found" -ForegroundColor Green
    Write-Host "  ✅ $apiRoutes API routes found" -ForegroundColor Green
} else {
    Write-Host "  ❌ src directory missing" -ForegroundColor Red
    $AllGood = $false
}

Write-Host ""
Write-Host "Checking documentation..." -ForegroundColor Yellow
$docs = @("README.md", "README-DEPLOYMENT.md", "DEPLOYMENT.md", "DOCKER_DEPLOYMENT.md")
$foundDocs = 0
foreach ($doc in $docs) {
    if (Test-Path (Join-Path $ProjectRoot $doc)) {
        $foundDocs++
    }
}
Write-Host "  ✅ $foundDocs documentation files found" -ForegroundColor Green

Write-Host ""
if ($AllGood) {
    Write-Host "=================================" -ForegroundColor Green
    Write-Host "✅ ALL CHECKS PASSED!" -ForegroundColor Green
    Write-Host "=================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ready to create deployment ZIP!" -ForegroundColor Cyan
    Write-Host "Run: .\zip-project.ps1" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "=================================" -ForegroundColor Red
    Write-Host "❌ SOME CHECKS FAILED!" -ForegroundColor Red
    Write-Host "=================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please fix the issues above before creating ZIP" -ForegroundColor Yellow
    exit 1
}
