# Test Rental Service Backend
Write-Host "========================================="
Write-Host "TESTING RENTAL SERVICE BACKEND"
Write-Host "========================================="
Write-Host ""

try {
    # Step 1: Register a test user
    Write-Host "[1/4] Registering test user..."
    $timestamp = Get-Date -Format "yyyyMMddHHmmss"
    $testEmail = "rentaltest$timestamp@test.com"
    $regBody = @{
        email = $testEmail
        password = "test123"
        role = "USER"
    } | ConvertTo-Json
    
    $regResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/register" -Method POST -Body $regBody -ContentType "application/json"
    Write-Host "   ✓ User registered: $testEmail"
    
    # Step 2: Login
    Write-Host "[2/4] Logging in..."
    $loginBody = @{
        email = $testEmail
        password = "test123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "   ✓ Login successful"
    Write-Host "   Token: $($token.Substring(0, 40))..."
    
    # Step 3: Check cars
    Write-Host "[3/4] Checking available cars..."
    $cars = Invoke-RestMethod -Uri "http://localhost:8082/api/cars" -Method GET
    Write-Host "   ✓ Found $($cars.Count) cars"
    if ($cars.Count -eq 0) {
        Write-Host "   ⚠ WARNING: No cars available. Please add a car first."
        exit 1
    }
    $carId = $cars[0].carId
    Write-Host "   Using Car ID: $carId ($($cars[0].brand) $($cars[0].model))"
    
    # Step 4: Create Rental
    Write-Host "[4/4] Creating rental..."
    $rentalBody = @{
        carId = $carId
        startDate = "2026-01-16"
        endDate = "2026-01-18"
    } | ConvertTo-Json
    
    Write-Host "   Request body: $rentalBody"
    $rentalResponse = Invoke-RestMethod -Uri "http://localhost:8083/api/rentals" -Method POST -Body $rentalBody -ContentType "application/json" -Headers @{Authorization="Bearer $token"}
    
    Write-Host ""
    Write-Host "========================================="
    Write-Host "SUCCESS - BACKEND TEST PASSED"
    Write-Host "========================================="
    Write-Host ""
    Write-Host "Rental Details:"
    Write-Host "  Rental ID: $($rentalResponse.rentalId)"
    Write-Host "  Car ID: $($rentalResponse.carId)"
    Write-Host "  Status: $($rentalResponse.status)"
    Write-Host "  Start Date: $($rentalResponse.startDate)"
    Write-Host "  End Date: $($rentalResponse.endDate)"
    Write-Host "  Total Price: $($rentalResponse.totalPrice)"
    Write-Host ""
    Write-Host "CONCLUSION: The rental service backend is working correctly."
    Write-Host "            If the frontend is failing, the issue is in the frontend code."
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "========================================="
    Write-Host "FAILED - BACKEND TEST FAILED"
    Write-Host "========================================="
    Write-Host ""
    Write-Host "Error Message: $($_.Exception.Message)"
    
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "Response Body: $errorBody"
    }
    
    Write-Host ""
    Write-Host "CONCLUSION: The rental service backend has an issue that needs fixing."
    Write-Host ""
    exit 1
}
