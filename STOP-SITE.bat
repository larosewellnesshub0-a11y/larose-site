@echo off
REM Stops the local preview server (frees port 4173).
title La Rose - stop local site
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":4173" ^| findstr LISTENING') do (
  taskkill /F /PID %%p >nul 2>&1
)
echo   La Rose local site stopped.
timeout /t 2 >nul
