# Development Environment Requirements

This document outlines all requirements for developing the FIT Viewer extension.

## System Requirements

### Required Software

1. **Node.js** (v20.x or higher)
   - Download: https://nodejs.org/
   - Verify installation: `node --version`
   - Required for running TypeScript compiler and npm packages

2. **npm** (v10.x or higher)
   - Comes with Node.js
   - Verify installation: `npm --version`
   - Package manager for JavaScript dependencies

3. **Visual Studio Code** (v1.96.0 or higher)
   - Download: https://code.visualstudio.com/
   - Required for testing the extension
   - The extension host environment

4. **Make** (optional but recommended)
   - Windows: Install via chocolatey (`choco install make`) or use Git Bash
   - Alternative: Run npm commands directly (see below)

## Node.js Dependencies

All dependencies are defined in `package.json` and installed via `npm install`.

### Production Dependencies

```json
{
  "@garmin/fitsdk": "^21.161.0",  // Garmin FIT SDK for encoding/decoding
  "arquero": "^7.2.0"              // Data manipulation library
}
```

### Development Dependencies

```json
{
  "@types/mocha": "^10.0.10",      // Type definitions for Mocha
  "@types/node": "^20.0.0",        // Type definitions for Node.js
  "@types/vscode": "^1.96.0",      // VS Code extension API types
  "@vscode/vsce": "^2.19.0",       // VS Code extension packaging tool
  "typescript": "^5.7.3",          // TypeScript compiler
  "copyfiles": "^2.4.1"            // File copying utility for build
}
```

## Quick Start

### Option 1: Using Make (Recommended)

```bash
# Install dependencies and compile
make dev

# Watch mode (auto-compile on changes)
make watch

# Create distributable package
make package

# Clean and reinstall
make reinstall
```

### Option 2: Using npm directly

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode
npm run watch

# Create package
npm run package
```

## Installation Steps

### 1. Install Node.js

**Windows:**
```powershell
# Download installer from https://nodejs.org/
# Or use Chocolatey
choco install nodejs
```

**Verify:**
```powershell
node --version  # Should show v20.x.x or higher
npm --version   # Should show v10.x.x or higher
```

### 2. Install Make (Optional)

**Windows (PowerShell as Admin):**
```powershell
# Option 1: Chocolatey
choco install make

# Option 2: Use Git Bash (comes with Git for Windows)
# Git Bash includes make by default

# Option 3: Skip make and use npm commands directly
```

### 3. Clone Repository

```powershell
git clone https://github.com/your-username/fit-viewer.git
cd fit-viewer
```

### 4. Install Dependencies

```powershell
# Using make
make install

# Or using npm directly
npm install
```

### 5. Compile TypeScript

```powershell
# Using make
make compile

# Or using npm directly
npm run compile
```

### 6. Test Extension

1. Press `F5` in VS Code
2. This opens Extension Development Host
3. Open a `.fit` file
4. Test the viewer and recovery mode features

## Project Structure

```
fit-viewer/
├── src/                          # TypeScript source files
│   ├── extension.ts             # Extension entry point
│   ├── fitFileEditorProvider.ts # Main editor provider with recovery mode
│   ├── fitParser.ts             # FIT file decoder
│   ├── fitEncoder.ts            # FIT file encoder with validation
│   ├── fitDocument.ts           # Custom document with edit tracking
│   ├── parseMessages.ts         # Message parsing logic
│   └── examples.ts              # Usage examples
├── media/                        # Webview assets
│   ├── webview.html             # Main UI with recovery mode controls
│   ├── webview.css              # Styling
│   └── webview.js               # Client-side logic
├── out/                          # Compiled JavaScript (generated)
│   ├── extension.js
│   └── media/
├── node_modules/                 # Dependencies (generated)
├── package.json                  # Project manifest and dependencies
├── package-lock.json            # Locked dependency versions
├── tsconfig.json                # TypeScript compiler configuration
├── Makefile                     # Build automation (this project)
├── REQUIREMENTS.md              # This file
└── README.md                    # User documentation
```

## Build Process

### TypeScript Compilation

The extension uses TypeScript which must be compiled to JavaScript before running:

```bash
# Single compilation
npm run compile

# Watch mode (auto-compile on save)
npm run watch
```

**What happens during compilation:**
1. TypeScript compiler reads `tsconfig.json`
2. Compiles all `.ts` files in `src/` to `.js` in `out/`
3. Copies `media/*` files to `out/media/`
4. Generates source maps for debugging

### Output Directory

After compilation, the `out/` directory contains:
- `extension.js` - Main extension code
- `fitFileEditorProvider.js` - Editor provider
- `fitParser.js` - Parser
- `fitEncoder.js` - Encoder
- `fitDocument.js` - Document model
- `media/` - UI assets

## Development Workflow

### Standard Development

1. **Initial setup:**
   ```bash
   make dev
   ```

2. **Start watch mode:**
   ```bash
   make watch
   ```

3. **In VS Code:**
   - Press `F5` to launch Extension Development Host
   - Edit `.ts` files - they auto-compile
   - Reload Extension Host (`Ctrl+R`) to see changes

4. **Before committing:**
   ```bash
   make compile  # Ensure clean build
   ```

### Testing Recovery Mode

1. **Get a corrupted FIT file** (or use test files)
2. **Open in Extension Development Host**
3. **Click "🔧 Recovery Mode"**
4. **Click "🏃 Check Physiology"** to see missing fields
5. **Edit fields** (highlighted in yellow)
6. **Save changes**
7. **Upload to Garmin Connect** to verify

## Packaging for Distribution

To create a `.vsix` file for sharing:

```bash
# Using make
make package

# Or using npm
npm run package
```

This creates `fit-viewer-x.x.x.vsix` which can be:
- Installed in VS Code via "Install from VSIX"
- Published to VS Code Marketplace
- Shared with others

## Troubleshooting

### "Cannot find module 'vscode'"

**Cause:** Dependencies not installed or TypeScript can't find types

**Solution:**
```bash
make reinstall
# Or
npm install
```

### "tsc: command not found"

**Cause:** TypeScript not installed globally or locally

**Solution:**
```bash
npm install
# TypeScript is in devDependencies, will be installed
```

### Changes not appearing in Extension Host

**Cause:** Extension Host is using old compiled code

**Solutions:**
1. Reload Extension Host (`Ctrl+R` in Extension Host window)
2. Recompile: `make compile` or `npm run compile`
3. Restart debugging (`Ctrl+Shift+F5`)

### "make: command not found" on Windows

**Solutions:**
1. Install make via Chocolatey: `choco install make`
2. Use Git Bash instead of PowerShell
3. Use npm commands directly (see Quick Start)

### Module resolution warnings in TypeScript

**Cause:** VS Code shows warnings about vscode/fitsdk modules

**Solution:** These are expected in development. They disappear after `npm install`.

## CI/CD Integration

For automated builds, use this in your CI pipeline:

```yaml
# Example GitHub Actions
- name: Setup Node.js
  uses: actions/setup-node@v3
  with:
    node-version: '20'

- name: Install dependencies
  run: npm install

- name: Compile
  run: npm run compile

- name: Package
  run: npm run package
```

## Environment Variables

No special environment variables required.

## Optional Tools

### Recommended VS Code Extensions for Development

1. **ESLint** - Code quality
2. **TypeScript Vue Plugin** - Enhanced TypeScript support
3. **GitLens** - Git integration

### Debugging Tools

- **VS Code Debugger** - Built-in, works with `F5`
- **Chrome DevTools** - For webview debugging
  - In Extension Host, press `Ctrl+Shift+P`
  - Run "Developer: Open Webview Developer Tools"

## Updating Dependencies

```bash
# Check for outdated packages
npm outdated

# Update all to latest compatible versions
npm update

# Update to latest versions (may break things)
npm install @garmin/fitsdk@latest arquero@latest
```

## License Requirements

This project uses:
- **@garmin/fitsdk** - Check Garmin SDK license
- **arquero** - Apache 2.0
- **VS Code Extension API** - MIT

Ensure compliance with all dependency licenses.

## Getting Help

- **VS Code Extension API Docs:** https://code.visualstudio.com/api
- **Garmin FIT SDK:** https://developer.garmin.com/fit/
- **TypeScript Docs:** https://www.typescriptlang.org/docs/
- **Project Issues:** [GitHub Issues](https://github.com/your-username/fit-viewer/issues)

## Minimum System Specifications

- **RAM:** 4GB minimum (8GB recommended)
- **Disk Space:** 500MB for project + dependencies
- **OS:** Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **Internet:** Required for initial dependency download

## Summary

**To get started immediately:**

```bash
# Option 1: With Make
make dev

# Option 2: Without Make
npm install && npm run compile
```

Then press `F5` in VS Code to test!
