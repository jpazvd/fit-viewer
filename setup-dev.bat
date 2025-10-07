@echo off
REM FIT Viewer Extension - Windows Development Setup Script
REM Self-contained development environment setup

echo ========================================
echo FIT Viewer Extension - Development Setup
echo ========================================
echo.

REM Check if Node.js is installed
echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Recommended version: v20.x or higher
    echo.
    pause
    exit /b 1
)
echo     Node.js found: 
node --version
echo.

REM Check if npm is installed
echo [2/5] Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    echo.
    echo npm usually comes with Node.js. Please reinstall Node.js.
    echo.
    pause
    exit /b 1
)
echo     npm found:
npm --version
echo.

REM Install dependencies
echo [3/5] Installing dependencies...
echo     This may take a few minutes...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    echo.
    echo Try running: npm install --verbose
    echo.
    pause
    exit /b 1
)
echo     Dependencies installed successfully
echo.

REM Compile TypeScript
echo [4/5] Compiling TypeScript...
call npm run compile
if %errorlevel% neq 0 (
    echo ERROR: Failed to compile TypeScript!
    echo.
    echo Check the error messages above.
    echo.
    pause
    exit /b 1
)
echo     Compilation successful
echo.

REM Summary
echo [5/5] Setup complete!
echo.
echo ========================================
echo Development environment is ready!
echo ========================================
echo.
echo Next steps:
echo   1. Press F5 in VS Code to launch Extension Development Host
echo   2. Open a .fit file to test the viewer
echo   3. Enable Recovery Mode to edit corrupted files
echo.
echo Useful commands:
echo   npm run watch     - Auto-compile on file changes
echo   npm run compile   - Compile TypeScript
echo   npm run package   - Create .vsix package
echo.
echo   Or use Make commands:
echo   make watch        - Auto-compile on file changes
echo   make compile      - Compile TypeScript  
echo   make package      - Create .vsix package
echo   make help         - Show all available commands
echo.
echo See REQUIREMENTS.md for detailed documentation.
echo.
pause
