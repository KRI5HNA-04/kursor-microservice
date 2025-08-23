# PowerShell script for Windows deployment
Write-Host "🚀 Building Kursor Microservices for Deployment" -ForegroundColor Green

function Build-Service {
    param($ServiceName, $ServicePath)
    
    Write-Host "📦 Building $ServiceName..." -ForegroundColor Cyan
    Set-Location $ServicePath
    
    # Build Docker image
    docker build -t "kursor-$ServiceName`:latest" .
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $ServiceName built successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to build $ServiceName" -ForegroundColor Red
        exit 1
    }
    
    Set-Location ..
}

# Navigate to microservices directory
Set-Location $PSScriptRoot

# Build all services
Write-Host "🏗️  Building all microservices..." -ForegroundColor Yellow

Build-Service "api-gateway" "api-gateway"
Build-Service "execution-service" "services/execution-service"
Build-Service "communication-service" "services/communication-service"
Build-Service "snippet-service" "services/snippet-service"
Build-Service "user-service" "services/user-service"

Write-Host ""
Write-Host "🎉 All services built successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "To test locally:" -ForegroundColor White
Write-Host "  docker-compose up -d" -ForegroundColor Gray
Write-Host ""
Write-Host "To deploy to Railway:" -ForegroundColor White
Write-Host "  railway login" -ForegroundColor Gray
Write-Host "  railway up" -ForegroundColor Gray
Write-Host ""
Write-Host "To check status:" -ForegroundColor White
Write-Host "  docker-compose ps" -ForegroundColor Gray
Write-Host "  docker-compose logs -f api-gateway" -ForegroundColor Gray
