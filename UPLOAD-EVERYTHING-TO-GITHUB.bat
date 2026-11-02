@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0DEPLOY-ALL-TO-GITHUB.ps1"
echo.
pause
