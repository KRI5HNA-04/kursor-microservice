# Simple PowerShell test for Communication Service
$baseUrl = "http://localhost:3002"

Write-Host "Testing Communication Service..." -ForegroundColor Green

try {
    # Test health endpoint
    Write-Host "`n1. Testing health endpoint..." -ForegroundColor Yellow
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET -ContentType "application/json"
    Write-Host "✅ Health check successful:" -ForegroundColor Green
    Write-Host ($health | ConvertTo-Json) -ForegroundColor Cyan

    # Test service info
    Write-Host "`n2. Testing service info..." -ForegroundColor Yellow
    $info = Invoke-RestMethod -Uri "$baseUrl/info" -Method GET -ContentType "application/json"
    Write-Host "✅ Service info:" -ForegroundColor Green
    Write-Host ($info | ConvertTo-Json) -ForegroundColor Cyan

    # Test contact form validation
    Write-Host "`n3. Testing contact form validation..." -ForegroundColor Yellow
    $invalidBody = @{
        name = "Test User"
        # Missing email and message
    } | ConvertTo-Json

    try {
        $invalidResponse = Invoke-RestMethod -Uri "$baseUrl/contact" -Method POST -Body $invalidBody -ContentType "application/json"
    } catch {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $responseBody = $reader.ReadToEnd()
        Write-Host "✅ Validation test (expected error):" -ForegroundColor Green
        Write-Host $responseBody -ForegroundColor Yellow
    }

    Write-Host "`n🎉 Communication Service tests completed!" -ForegroundColor Green

} catch {
    Write-Host "❌ Test failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Make sure the communication service is running on port 3002" -ForegroundColor Yellow
    Write-Host "   Run: npm start" -ForegroundColor Yellow
}
