@echo off
title RecruitAI - Starting All Services
echo.
echo ========================================
echo   RecruitAI - Starting All Services
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Starting HR Backend on port 8000...
start "HR Backend (8000)" cmd /k ".venv\Scripts\python.exe backend\fastapi_feedback1.py"
timeout /t 3 /nobreak >nul

echo [2/3] Starting Manager Backend on port 8001...
start "Manager Backend (8001)" cmd /k ".venv\Scripts\python.exe backend\manager_backend\manager_api.py"
timeout /t 3 /nobreak >nul

echo [3/3] Starting Frontend on port 3000...
start "Frontend (3000)" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   All 3 services started!
echo   HR Backend    : http://localhost:8000
echo   Manager API   : http://localhost:8001
echo   Frontend      : http://localhost:3000
echo ========================================
echo.
echo You can close this window.
pause
