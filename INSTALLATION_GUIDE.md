# Installing FIT Viewer Extension in VS Code

## 🚀 Method 1: Run in Development Mode (RECOMMENDED FOR TESTING)

This is the easiest way to test your extension without creating a package.

### Steps:

1. **Open the extension folder in VS Code**
   ```powershell
   cd C:\GitHub\garmin\fork\fit-viewer
   code .
   ```

2. **Press F5** (or go to Run > Start Debugging)

3. **A new VS Code window opens** - This is the "Extension Development Host"

4. **Open a .fit file** in this new window to test your extension

5. **Make changes and reload**
   - Edit your code in the original window
   - Press `Ctrl+R` in the Extension Development Host to reload changes

### Benefits:
- ✅ No packaging needed
- ✅ Instant testing
- ✅ Easy debugging
- ✅ See console logs

---

## 🎁 Method 2: Install as .vsix Package (FOR PERMANENT USE)

Install the extension permanently in your main VS Code installation.

### Steps:

### Step 1: Create the .vsix package

```powershell
cd C:\GitHub\garmin\fork\fit-viewer
cmd /c "npm run package"
```

This creates `fit-viewer-0.6.0.vsix` (or similar version number).

### Step 2: Install the package

**Option A: Via VS Code UI (EASIEST)**

1. Open VS Code
2. Press `Ctrl+Shift+P` (Command Palette)
3. Type: `Extensions: Install from VSIX...`
4. Select the command
5. Browse to `C:\GitHub\garmin\fork\fit-viewer\fit-viewer-0.6.0.vsix`
6. Click **Install**
7. Reload VS Code when prompted

**Option B: Via Command Line**

```powershell
cd C:\GitHub\garmin\fork\fit-viewer
code --install-extension fit-viewer-0.6.0.vsix
```

**Option C: Drag and Drop**

1. Open VS Code
2. Go to Extensions view (`Ctrl+Shift+X`)
3. Drag and drop the `.vsix` file into the Extensions view

### Step 3: Verify Installation

1. Go to Extensions view (`Ctrl+Shift+X`)
2. Search for "FIT File Viewer"
3. You should see it installed with a ⚙️ gear icon

### Step 4: Use the Extension

1. Open any `.fit` file
2. Right-click → **Open With...**
3. Select **FIT File Viewer**
4. Set as default if desired

---

## 🔄 Method 3: Link for Development (ADVANCED)

Symlink the extension for development while having it available in all VS Code windows.

### Steps:

1. **Create the package**
   ```powershell
   cd C:\GitHub\garmin\fork\fit-viewer
   cmd /c "npm run package"
   ```

2. **Install it**
   ```powershell
   code --install-extension fit-viewer-0.6.0.vsix
   ```

3. **Find the extension directory**
   - Windows: `%USERPROFILE%\.vscode\extensions\`
   - The extension will be in a folder like `thomascamminady.fit-viewer-0.6.0`

4. **Continue developing**
   - Make changes in `C:\GitHub\garmin\fork\fit-viewer`
   - Reinstall the .vsix when you want to update

---

## 📋 Comparison of Methods

| Method | Use Case | Pros | Cons |
|--------|----------|------|------|
| **F5 (Development)** | Testing & debugging | Fast, easy, debug console | Only in dev window |
| **.vsix Install** | Daily use | Available everywhere | Must rebuild to update |
| **Symlink** | Active development | Best of both | Complex setup |

---

## 🎯 Recommended Workflow

### For Development & Testing:
1. Use **Method 1 (F5)** while developing
2. Test all features in the Extension Development Host
3. Make changes and reload with `Ctrl+R`

### For Personal Use:
1. When ready, create .vsix with `npm run package`
2. Install with **Method 2**
3. Use in all your VS Code windows

### For Distribution:
1. Create .vsix package
2. Share the file with others
3. Or publish to VS Code Marketplace

---

## 🚦 Quick Start Commands

### Test Now (Fastest):
```powershell
# 1. Open in VS Code
cd C:\GitHub\garmin\fork\fit-viewer
code .

# 2. Press F5
# 3. Open a .fit file in the new window
```

### Install Permanently:
```powershell
# 1. Create package
cd C:\GitHub\garmin\fork\fit-viewer
cmd /c "npm run package"

# 2. Install
code --install-extension fit-viewer-0.6.0.vsix

# 3. Reload VS Code
```

---

## ⚠️ Troubleshooting

### "Extension not found" after F5
- Make sure you're in the correct directory: `C:\GitHub\garmin\fork\fit-viewer`
- Check that `out/` folder exists (run `npm run compile` if not)
- Restart VS Code

### ".vsix file not created"
- Run: `cmd /c "npm run compile"` first
- Check for errors in the terminal
- Ensure all dependencies installed: `cmd /c "npm install"`

### "Cannot install extension"
- Check VS Code version (needs v1.96.0+)
- Try uninstalling old version first
- Restart VS Code

### Changes not appearing
- **In dev mode (F5):** Press `Ctrl+R` in Extension Development Host
- **After .vsix install:** Reinstall the .vsix file

---

## 📦 What Gets Installed

When you install the extension, these features become available:

✅ **View .fit files** in VS Code
✅ **Interactive data tables** for all FIT messages
✅ **Map visualization** for GPS tracks
✅ **Charts** for all numeric data
✅ **Edit and save** FIT files
✅ **Recovery Mode** for corrupted files
✅ **Physiology validation** for Garmin compatibility
✅ **Export to JSON**

---

## 🎓 First Time Using the Extension

After installation:

1. **Open a .fit file**
   - Get sample files from your Garmin device
   - Or download from Garmin Connect

2. **Configure default editor** (optional)
   - Right-click .fit file
   - Open With... → Configure default editor
   - Select "FIT File Viewer"

3. **Try the features**
   - **Map tab** - See your GPS track
   - **Data tab** - View all FIT messages
   - **Charts tab** - Visualize numeric data
   - **Enable Editing** - Modify values
   - **Recovery Mode** - Fix corrupted files

---

## 🔧 Updating the Extension

### If using F5 (Dev Mode):
1. Make changes to the code
2. Press `Ctrl+R` in Extension Development Host
3. Changes applied immediately

### If using .vsix:
1. Make changes to the code
2. Recompile: `cmd /c "npm run compile"`
3. Repackage: `cmd /c "npm run package"`
4. Reinstall: `code --install-extension fit-viewer-0.6.0.vsix`
5. Reload VS Code

---

## ✅ Installation Complete!

Your FIT Viewer extension is now ready to use with:
- ✅ Full editing capabilities
- ✅ Recovery mode for corrupted files
- ✅ Physiology validation
- ✅ Secure (0 vulnerabilities)

**Next:** Open a .fit file and start editing! 🚀

---

## 📚 Additional Resources

- [EDITING_GUIDE.md](EDITING_GUIDE.md) - How to edit FIT files
- [RECOVERY_GUIDE.md](RECOVERY_GUIDE.md) - How to fix corrupted files
- [QUICKSTART.md](QUICKSTART.md) - Development quick reference
- [README.md](README.md) - Full documentation
