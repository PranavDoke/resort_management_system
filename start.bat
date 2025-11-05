@echo off
echo ========================================
echo   Resort Management System - Startup
echo ========================================
echo.
echo Starting MongoDB service...
net start MongoDB
echo.
echo Starting Backend Server...
start "Resort Backend" cmd /k "cd /d %~dp0server && npm start"
timeout /t 5
echo.
echo Starting Frontend Client...
start "Resort Frontend" cmd /k "cd /d %~dp0client && npm start"
echo.
echo ========================================
echo Application is starting...
echo Backend API: http://localhost:5000
echo Frontend UI: http://localhost:3000
echo ========================================
echo.
echo Press any key to exit this window...
pause > nul
