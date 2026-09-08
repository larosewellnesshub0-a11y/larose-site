@echo off
REM ===========================================================================
REM  La Rose Wellness Hub - start the local preview
REM
REM  Double-click this file. It opens the site at http://localhost:4173 and
REM  keeps serving until you close the window (or run STOP-SITE.bat).
REM
REM  Nothing is installed and nothing is sent anywhere. It only serves the
REM  files in this folder, plus the dashboard at /dashboard/.
REM ===========================================================================
title La Rose - local site
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo.
  echo   Node.js was not found on this machine.
  echo   Install it from https://nodejs.org and run this file again.
  echo.
  pause
  exit /b 1
)

echo.
echo   Starting La Rose locally...
echo.
echo     Website    http://localhost:4173/ar/index.html
echo     Dashboard  http://localhost:4173/dashboard/
echo.
echo   Leave this window open. Close it to stop the site.
echo.

start "" http://localhost:4173/ar/index.html
node server\serve.mjs
pause
