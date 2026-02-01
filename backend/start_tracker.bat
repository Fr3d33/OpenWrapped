@echo off
cd /d "%~dp0dist"
echo Starting OpenWrapped Tracker...
echo.
tracker.exe
echo.
echo Tracker stopped. Press any key to close...
pause >nul
