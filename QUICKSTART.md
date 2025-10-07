# Quick Start - FIT Viewer Development

## ⚡ Fastest Setup (Windows)

```cmd
cd C:\GitHub\garmin\fork\fit-viewer
setup-dev.bat
```

Press F5 in VS Code → Done! 🎉

## ⚡ Fastest Setup (Linux/macOS)

```bash
cd /path/to/fit-viewer
chmod +x setup-dev.sh
./setup-dev.sh
```

Press F5 in VS Code → Done! 🎉

## 📋 Daily Commands

```bash
make watch          # Auto-compile on file changes
```

Or without Make:

```bash
npm run watch
```

## 🎯 Common Tasks

| Task | Command |
|------|---------|
| First-time setup | `make dev` or `setup-dev.bat` |
| Auto-compile | `make watch` or `npm run watch` |
| Manual compile | `make compile` or `npm run compile` |
| Test extension | Press F5 in VS Code |
| Reload changes | Ctrl+R in Extension Host |
| Create package | `make package` or `npm run package` |
| Clean build | `make clean` |
| Reinstall all | `make reinstall` |

## 📚 Documentation

- **README.md** - User guide
- **REQUIREMENTS.md** - Complete dev requirements
- **CONTRIBUTING.md** - How to contribute
- **RECOVERY_GUIDE.md** - Fix corrupted FIT files
- **SELF_CONTAINED_SETUP.md** - This setup overview

## 🆘 Troubleshooting

**Extension doesn't update?**
→ Reload Extension Host (Ctrl+R)

**"Cannot find module"?**
→ `npm install`

**"make: command not found"?**
→ Use `npm` commands instead or `setup-dev.bat`

## ✅ Quick Reference

```bash
# Setup
make dev

# Develop
make watch
# Press F5

# Release
make package
```

That's all you need! 🚀
