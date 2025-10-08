@echo off
echo Setting up Local Deepfake Detection...
echo =====================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.7+ from https://python.org
    pause
    exit /b 1
)

echo Python found! Installing dependencies...

REM Install Python dependencies
python setup_local_detection.py

if errorlevel 1 (
    echo.
    echo Setup failed! Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo Setup completed successfully!
echo.
echo To start the server with local detection:
echo    node server.cjs
echo.
echo The server will automatically use local detection instead of external APIs.
pause
