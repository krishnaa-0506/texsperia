# Quick Setup Script for TEXPERIA Registration System

Write-Host "==================================" -ForegroundColor Yellow
Write-Host "TEXPERIA 2026 - Setup Script" -ForegroundColor Yellow
Write-Host "==================================" -ForegroundColor Yellow
Write-Host ""

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
npm install

# Install backend dependencies
Write-Host ""
Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
Set-Location server
npm install
Set-Location ..

Write-Host ""
Write-Host "==================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: Before running the application:" -ForegroundColor Yellow
Write-Host "1. Edit server\.env and add your MongoDB connection URL" -ForegroundColor White
Write-Host "2. Replace 'your-username' and 'your-password' with actual credentials" -ForegroundColor White
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host "1. Open first terminal and run: cd server; npm start" -ForegroundColor White
Write-Host "2. Open second terminal and run: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Default Admin Password: hkkk@admin2026" -ForegroundColor Magenta
Write-Host ""
