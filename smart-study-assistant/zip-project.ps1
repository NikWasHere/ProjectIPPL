# Smart Study Assistant - Auto Zip Script for Windows
# Simple version - menggunakan Compress-Archive

Write-Host "Starting zip process..." -ForegroundColor Green

# Project configuration
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$OutputFile = "smart-study-assistant-$Timestamp.zip"

# Get current directory (should be run from project root)
$ProjectDir = $PSScriptRoot
$ParentDir = Split-Path -Parent $ProjectDir

Write-Host "Project directory: $ProjectDir" -ForegroundColor Cyan
Write-Host "Output will be created in: $ParentDir" -ForegroundColor Cyan
Write-Host "Output file: $OutputFile" -ForegroundColor Cyan
Write-Host ""

# Change to parent directory
Set-Location -Path $ParentDir

# Define what to exclude
$ExcludePaths = @(
    "smart-study-assistant\node_modules",
    "smart-study-assistant\.next",
    "smart-study-assistant\.git",
    "smart-study-assistant\dist",
    "smart-study-assistant\build",
    "smart-study-assistant\coverage",
    "smart-study-assistant\public\uploads"
)

$ExcludeFiles = @(
    "*.db",
    "*.db-journal",
    ".env.local",
    ".DS_Store",
    "Thumbs.db",
    "*.log"
)

Write-Host "IMPORTANT: Including deployment files:" -ForegroundColor Green
Write-Host "  - .env.production (production template)" -ForegroundColor Gray
Write-Host "  - Dockerfile & docker-compose.yml" -ForegroundColor Gray
Write-Host "  - All setup scripts (.ps1)" -ForegroundColor Gray
Write-Host "  - Documentation (*.md)" -ForegroundColor Gray
Write-Host ""

Write-Host "Collecting files to zip..." -ForegroundColor Yellow
Write-Host "Excluding: node_modules, .next, .git, .env, *.db" -ForegroundColor DarkGray
Write-Host ""

# Get all files except excluded ones
$FilesToZip = Get-ChildItem -Path "smart-study-assistant" -Recurse -File | Where-Object {
    $file = $_
    $exclude = $false
    
    # Check against excluded paths
    foreach ($path in $ExcludePaths) {
        if ($file.FullName -like "*$path*") {
            $exclude = $true
            break
        }
    }
    
    # Check against excluded file patterns
    if (-not $exclude) {
        foreach ($pattern in $ExcludeFiles) {
            if ($file.Name -like $pattern) {
                $exclude = $true
                break
            }
        }
    }
    
    -not $exclude
}

Write-Host "Found $($FilesToZip.Count) files to zip" -ForegroundColor Cyan
Write-Host "Creating zip archive..." -ForegroundColor Yellow

# Create temporary list file for 7zip or use Compress-Archive
# Using Compress-Archive (built-in PowerShell)
try {
    # Create temp directory structure
    $TempBase = Join-Path $env:TEMP "smart-study-temp"
    $TempDir = Join-Path $TempBase "smart-study-assistant"
    
    if (Test-Path $TempBase) {
        Remove-Item $TempBase -Recurse -Force
    }
    New-Item -ItemType Directory -Path $TempDir -Force | Out-Null
    
    # Copy files maintaining structure
    foreach ($file in $FilesToZip) {
        $relativePath = $file.FullName.Replace("$ProjectDir\", "")
        $destPath = Join-Path $TempDir $relativePath
        $destDir = Split-Path -Parent $destPath
        
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        
        Copy-Item -Path $file.FullName -Destination $destPath -Force
    }
    
    # Create zip
    Compress-Archive -Path "$TempBase\*" -DestinationPath $OutputFile -Force
    
    # Cleanup
    Remove-Item $TempBase -Recurse -Force
    
    # Show result
    $ZipFile = Get-Item $OutputFile
    $SizeMB = [math]::Round($ZipFile.Length / 1MB, 2)
    
    Write-Host ""
    Write-Host "SUCCESS! Zip created successfully!" -ForegroundColor Green
    Write-Host "=================================" -ForegroundColor Green
    Write-Host "File: $OutputFile" -ForegroundColor Cyan
    Write-Host "Location: $($ZipFile.FullName)" -ForegroundColor Cyan
    Write-Host "Size: $SizeMB MB" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Package Contents:" -ForegroundColor Yellow
    Write-Host "  ✅ Complete application source code" -ForegroundColor White
    Write-Host "  ✅ Docker configuration (Dockerfile + docker-compose.yml)" -ForegroundColor White
    Write-Host "  ✅ Ollama AI setup (qwen2:7b ready)" -ForegroundColor White
    Write-Host "  ✅ Environment template (.env.production)" -ForegroundColor White
    Write-Host "  ✅ Setup scripts (rebuild-docker.ps1, test-ai.ps1)" -ForegroundColor White
    Write-Host "  ✅ Complete documentation (README-DEPLOYMENT.md)" -ForegroundColor White
    Write-Host "  ✅ Auth 404 fix applied (NEXTAUTH_URL configured)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Deployment Instructions:" -ForegroundColor Yellow
    Write-Host "1. Extract: unzip $OutputFile" -ForegroundColor White
    Write-Host "2. Run: cd smart-study-assistant && docker-compose up -d" -ForegroundColor White
    Write-Host "3. Wait for Ollama model download (~5-10 minutes)" -ForegroundColor White
    Write-Host "4. Access: http://localhost:3015" -ForegroundColor White
    Write-Host ""
    Write-Host "See README-DEPLOYMENT.md inside the ZIP for detailed instructions" -ForegroundColor Cyan
    Write-Host "=================================" -ForegroundColor Green
    
} catch {
    Write-Host ""
    Write-Host "ERROR: Failed to create zip file" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Return to project directory
Set-Location -Path $ProjectDir
