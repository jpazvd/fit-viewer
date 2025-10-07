# Contributing to FIT Viewer Extension

Thank you for your interest in contributing to the FIT Viewer extension!

## 🚀 Quick Start for Contributors

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR-USERNAME/fit-viewer.git
cd fit-viewer
```

### 2. Set Up Development Environment

**Windows:**
```cmd
setup-dev.bat
```

**Linux/macOS:**
```bash
chmod +x setup-dev.sh
./setup-dev.sh
```

**Or manually:**
```bash
npm install
npm run compile
```

### 3. Make Your Changes

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make changes, then compile
npm run compile

# Or use watch mode while developing
npm run watch
```

### 4. Test Your Changes

1. Press `F5` in VS Code to launch Extension Development Host
2. Test with various `.fit` files
3. Test recovery mode with corrupted files
4. Verify all features work as expected

### 5. Submit Pull Request

```bash
git add .
git commit -m "Description of your changes"
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 📁 Project Structure

```
fit-viewer/
├── src/                              # TypeScript source
│   ├── extension.ts                 # Extension entry point
│   ├── fitFileEditorProvider.ts     # Main editor with recovery mode
│   ├── fitParser.ts                 # FIT decoder
│   ├── fitEncoder.ts                # FIT encoder with validation
│   ├── fitDocument.ts               # Document model with edit tracking
│   ├── parseMessages.ts             # Message parsing
│   └── examples.ts                  # Usage examples
├── media/                            # Webview UI
│   ├── webview.html                 # Main UI
│   ├── webview.css                  # Styling
│   └── webview.js                   # Client logic
├── out/                              # Compiled output (git-ignored)
├── screenshots/                      # Documentation images
├── Makefile                          # Build automation
├── package.json                      # Dependencies & scripts
├── tsconfig.json                    # TypeScript config
└── REQUIREMENTS.md                   # Development requirements
```

## 🔧 Development Workflow

### Daily Development

```bash
# Start watch mode (auto-compile on save)
make watch
# or
npm run watch

# In VS Code: Press F5 to test
# Make changes to .ts files
# Reload Extension Host: Ctrl+R (in Extension Host window)
```

### Before Committing

```bash
# Ensure clean compilation
make compile

# Check for errors
# TypeScript compiler will show any issues
```

### Creating a Release

```bash
# Update version in package.json
# Update CHANGELOG.md

# Create package
make package

# Test the .vsix file
# Install it: Extensions > ... > Install from VSIX
```

## 💡 Contribution Ideas

### 🐛 Bug Fixes

- File parsing issues
- UI rendering problems
- Recovery mode validation bugs
- Save/export errors

### ✨ Feature Enhancements

- **Auto-calculation**: Calculate Training Effect from HR data
- **Batch Recovery**: Fix multiple files at once
- **Smart Suggestions**: ML-based metric estimation
- **Message Creation**: Auto-generate missing SESSION/ACTIVITY
- **Template System**: Save/load recovery templates
- **Validation Presets**: Sport-specific field requirements

### 📚 Documentation

- More recovery examples
- Video tutorials
- Troubleshooting guides
- Translation to other languages

### 🧪 Testing

- Unit tests for encoder/decoder
- Integration tests for recovery mode
- Test with various device types
- Edge case handling

## 🎯 Code Style Guidelines

### TypeScript

```typescript
// Use explicit types
function parseMessage(data: Uint8Array): FitMessage {
    // Implementation
}

// Use interfaces for objects
interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}

// Use descriptive names
const isRecoveryModeEnabled = true;  // Good
const flag = true;                   // Bad

// Document public functions
/**
 * Validates FIT file data for completeness and correctness.
 * @param messages - Array of FIT messages
 * @param recoveryMode - If true, uses relaxed validation
 * @returns Validation result with errors and warnings
 */
export function validateFitData(
    messages: any[],
    recoveryMode: boolean = false
): ValidationResult {
    // Implementation
}
```

### HTML/CSS

```html
<!-- Use semantic HTML -->
<button id="recovery-btn" class="edit-btn">
    🔧 Recovery Mode
</button>

<!-- Use BEM-style naming for CSS classes -->
<div class="physiology-results">
    <div class="physiology-results__warning">Warning message</div>
    <div class="physiology-results__suggestion">Suggestion</div>
</div>
```

### Naming Conventions

- **Files**: camelCase (e.g., `fitFileEditorProvider.ts`)
- **Classes**: PascalCase (e.g., `FitDocument`)
- **Functions**: camelCase (e.g., `validatePhysiologyFields`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)
- **Interfaces**: PascalCase with 'I' prefix optional (e.g., `ValidationResult`)

## 🧪 Testing Guidelines

### Manual Testing Checklist

- [ ] Extension loads without errors
- [ ] Can open various .fit files (different devices/sports)
- [ ] Map displays correctly for GPS activities
- [ ] Charts render for all numeric fields
- [ ] Data table shows all messages
- [ ] Edit mode enables/disables correctly
- [ ] Recovery mode toggle works
- [ ] Physiology check shows appropriate warnings
- [ ] Save creates backup and writes file
- [ ] Export JSON works
- [ ] Edited file opens in Garmin Connect
- [ ] Training metrics calculate after recovery

### Test File Sources

- **Garmin Connect**: Download activities
- **Device Direct**: Transfer from watch/bike computer
- **Corrupted Files**: Intentionally incomplete saves
- **Test Suite**: Use FIT SDK test files

## 🐞 Reporting Bugs

When reporting bugs, please include:

1. **Description**: What happened vs. what you expected
2. **Steps to Reproduce**: Detailed steps
3. **Environment**:
   - OS (Windows/macOS/Linux)
   - VS Code version
   - Extension version
4. **File Details**:
   - Device that created the file
   - Activity type (run, ride, swim, etc.)
   - File size
5. **Screenshots/Logs**: Any error messages
6. **Sample File**: If possible (remove personal data)

## 📝 Pull Request Guidelines

### PR Checklist

- [ ] Code compiles without errors
- [ ] Tested manually in Extension Development Host
- [ ] Updated documentation if needed
- [ ] Added to CHANGELOG.md
- [ ] No unnecessary changes (whitespace, formatting)
- [ ] Descriptive commit messages
- [ ] PR description explains what and why

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing
How did you test this?

## Screenshots
If applicable

## Related Issues
Fixes #123
```

## 🔒 Security

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. Email the maintainer privately
3. Include steps to reproduce
4. Wait for confirmation before disclosing

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## 🤝 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

## ❓ Questions?

- **Documentation**: See [REQUIREMENTS.md](REQUIREMENTS.md)
- **Recovery Guide**: See [RECOVERY_GUIDE.md](RECOVERY_GUIDE.md)
- **Issues**: Open a GitHub issue
- **Discussions**: Use GitHub Discussions

## 🙏 Thank You!

Your contributions make this project better for everyone!

---

**Happy coding! 🚀**
