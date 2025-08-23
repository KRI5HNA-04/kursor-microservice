# PowerShell script to start all microservices
# Save as start-all-services.ps1

Write-Host "🚀 Starting Kursor Microservices..." -ForegroundColor Green
Write-Host "This will start all 5 services in separate windows" -ForegroundColor Yellow
Write-Host ""

# Function to start service in new window
function Start-Service {
    param($ServiceName, $ServicePath, $Port)
    
    Write-Host "Starting $ServiceName on port $Port..." -ForegroundColor Cyan
    
    $command = "cd '$ServicePath'; npm start; Read-Host 'Press Enter to close'"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $command
    
    Start-Sleep -Seconds 2
}

# Start services in order
Write-Host "📊 Starting services..." -ForegroundColor Green

Start-Service "Execution Service" "D:\Kursor\kursor-microservices\services\execution-service" "3001"
Start-Service "Communication Service" "D:\Kursor\kursor-microservices\services\communication-service" "3002"  
Start-Service "Snippet Service" "D:\Kursor\kursor-microservices\services\snippet-service" "3003"
Start-Service "User Service" "D:\Kursor\kursor-microservices\services\user-service" "3004"

Write-Host "⏳ Waiting for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Start-Service "API Gateway" "D:\Kursor\kursor-microservices\api-gateway" "3000"

Write-Host ""
Write-Host "✅ All services starting!" -ForegroundColor Green
Write-Host "🌐 API Gateway: http://localhost:3000" -ForegroundColor White
Write-Host "🧪 Test Console: Open api-gateway/test.html in browser" -ForegroundColor White
Write-Host "📊 Dashboard: http://localhost:3000/dashboard" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this script (services will continue running)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
