#!/bin/bash
# FIT Viewer Extension - Linux/macOS Development Setup Script
# Self-contained development environment setup

set -e  # Exit on error

echo "========================================"
echo "FIT Viewer Extension - Development Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
echo "[1/5] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo ""
    echo "Please install Node.js from: https://nodejs.org/"
    echo "Recommended version: v20.x or higher"
    echo ""
    exit 1
fi
echo "    Node.js found: $(node --version)"
echo ""

# Check if npm is installed
echo "[2/5] Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed!"
    echo ""
    echo "npm usually comes with Node.js. Please reinstall Node.js."
    echo ""
    exit 1
fi
echo "    npm found: $(npm --version)"
echo ""

# Install dependencies
echo "[3/5] Installing dependencies..."
echo "    This may take a few minutes..."
npm install
echo "    ✅ Dependencies installed successfully"
echo ""

# Compile TypeScript
echo "[4/5] Compiling TypeScript..."
npm run compile
echo "    ✅ Compilation successful"
echo ""

# Summary
echo "[5/5] Setup complete!"
echo ""
echo "========================================"
echo "Development environment is ready!"
echo "========================================"
echo ""
echo "Next steps:"
echo "  1. Press F5 in VS Code to launch Extension Development Host"
echo "  2. Open a .fit file to test the viewer"
echo "  3. Enable Recovery Mode to edit corrupted files"
echo ""
echo "Useful commands:"
echo "  npm run watch     - Auto-compile on file changes"
echo "  npm run compile   - Compile TypeScript"
echo "  npm run package   - Create .vsix package"
echo ""
echo "  Or use Make commands:"
echo "  make watch        - Auto-compile on file changes"
echo "  make compile      - Compile TypeScript"
echo "  make package      - Create .vsix package"
echo "  make help         - Show all available commands"
echo ""
echo "See REQUIREMENTS.md for detailed documentation."
echo ""
