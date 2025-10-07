# FIT Viewer Extension - Makefile
# Self-contained development environment setup

.PHONY: help install clean compile watch test package dev check-node check-npm

# Default target
help:
	@echo "FIT Viewer Extension - Development Commands"
	@echo "==========================================="
	@echo ""
	@echo "Setup & Installation:"
	@echo "  make install          - Install all dependencies"
	@echo "  make check-node       - Check if Node.js is installed"
	@echo "  make check-npm        - Check if npm is installed"
	@echo ""
	@echo "Development:"
	@echo "  make compile          - Compile TypeScript to JavaScript"
	@echo "  make watch            - Watch mode - auto-compile on changes"
	@echo "  make dev              - Full dev setup (install + compile)"
	@echo ""
	@echo "Testing:"
	@echo "  make test             - Run extension in test mode (F5)"
	@echo ""
	@echo "Package & Distribution:"
	@echo "  make package          - Create .vsix package for distribution"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean            - Remove compiled output and dependencies"
	@echo "  make clean-out        - Remove only compiled output (keep node_modules)"
	@echo "  make reinstall        - Clean and reinstall everything"
	@echo ""

# Check if Node.js is installed
check-node:
	@echo "Checking Node.js installation..."
	@node --version || (echo "ERROR: Node.js is not installed. Install from https://nodejs.org/" && exit 1)
	@echo "✅ Node.js found"

# Check if npm is installed
check-npm: check-node
	@echo "Checking npm installation..."
	@npm --version || (echo "ERROR: npm is not installed" && exit 1)
	@echo "✅ npm found"

# Install all dependencies
install: check-npm
	@echo "Installing dependencies..."
	npm install
	@echo "✅ Dependencies installed"

# Compile TypeScript
compile:
	@echo "Compiling TypeScript..."
	npm run compile
	@echo "✅ Compilation complete"

# Watch mode for development
watch:
	@echo "Starting watch mode (auto-compile on changes)..."
	@echo "Press Ctrl+C to stop"
	npm run watch

# Full development setup
dev: install compile
	@echo ""
	@echo "✅ Development environment ready!"
	@echo ""
	@echo "Next steps:"
	@echo "  1. Press F5 in VS Code to launch Extension Development Host"
	@echo "  2. Open a .fit file to test the viewer"
	@echo "  3. Enable Recovery Mode to edit corrupted files"
	@echo ""
	@echo "Or run 'make watch' to auto-compile on file changes"
	@echo ""

# Test the extension (requires VS Code)
test:
	@echo "To test the extension:"
	@echo "  1. Press F5 in VS Code"
	@echo "  2. Or use the Run > Start Debugging menu"
	@echo ""
	@echo "This will open Extension Development Host with your extension loaded"

# Create distributable package
package: compile
	@echo "Creating .vsix package..."
	npm run package
	@echo "✅ Package created successfully"

# Clean compiled output only
clean-out:
	@echo "Removing compiled output..."
	@if exist out rmdir /s /q out
	@echo "✅ Compiled output removed"

# Clean everything (dependencies + output)
clean:
	@echo "Removing dependencies and compiled output..."
	@if exist node_modules rmdir /s /q node_modules
	@if exist out rmdir /s /q out
	@if exist package-lock.json del package-lock.json
	@echo "✅ Clean complete"

# Reinstall from scratch
reinstall: clean install compile
	@echo "✅ Reinstallation complete"
