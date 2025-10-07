# Opening VS Code - Quick Guide

## Understanding "code ."

**`code .` is NOT a folder** - it's a command that means:
- `code` = Open Visual Studio Code
- `.` = Current directory

## 🚀 How to Open Your Extension in VS Code

### Method 1: Using PowerShell Command

1. **Open PowerShell**

2. **Navigate to your extension folder:**
   ```powershell
   cd C:\GitHub\garmin\fork\fit-viewer
   ```

3. **Open VS Code in this folder:**
   ```powershell
   code .
   ```

This opens VS Code with your extension project loaded.

---

### Method 2: Open from File Explorer (Easiest)

1. **Open File Explorer** (`Win + E`)

2. **Navigate to:** `C:\GitHub\garmin\fork\fit-viewer`

3. **Right-click** in the folder (on empty space)

4. **Select:** "Open with Code"
   - If you don't see this option, see "Installing VS Code" below

---

### Method 3: Open from VS Code Directly

1. **Open Visual Studio Code**

2. **Click:** File > Open Folder... (`Ctrl+K Ctrl+O`)

3. **Browse to:** `C:\GitHub\garmin\fork\fit-viewer`

4. **Click:** "Select Folder"

---

## ✅ Verify You're in the Right Place

After opening in VS Code, check:

**Left sidebar (Explorer) should show:**
```
fit-viewer
├── .vscode/
├── media/
├── src/
├── package.json
├── README.md
└── ... (other files)
```

**Bottom status bar should show:**
- Current folder: `fit-viewer`

---

## 🚀 Now Press F5 to Debug

Once VS Code is open with your project:

1. **Press F5** (or click Run > Start Debugging)

2. **Extension Development Host opens** (new VS Code window)

3. **Open a .fit file** in the new window to test

---

## ⚠️ If "code ." Doesn't Work

### Issue: "code: command not found"

**Solution: Add VS Code to PATH**

1. **Open VS Code**

2. **Press:** `Ctrl+Shift+P`

3. **Type:** `Shell Command: Install 'code' command in PATH`

4. **Select it** and press Enter

5. **Restart PowerShell**

6. **Try again:**
   ```powershell
   cd C:\GitHub\garmin\fork\fit-viewer
   code .
   ```

---

## 📁 Your Extension Location

Your extension files are located at:
```
C:\GitHub\garmin\fork\fit-viewer\
```

This is a **folder on your hard drive**, not inside VS Code.

---

## 🎯 Complete Step-by-Step

### Starting from scratch:

1. **Open PowerShell** (Win + X, then I)

2. **Run these commands:**
   ```powershell
   cd C:\GitHub\garmin\fork\fit-viewer
   code .
   ```

3. **VS Code opens with your project**

4. **Press F5** to start debugging

5. **New window opens** (Extension Development Host)

6. **Open a .fit file** to test

---

## 🔍 Alternative: Full Path Commands

If you're not in the right directory:

```powershell
# Open VS Code with full path
code "C:\GitHub\garmin\fork\fit-viewer"

# Or navigate first, then open
Set-Location "C:\GitHub\garmin\fork\fit-viewer"
code .
```

---

## ✅ Success Indicators

**You're in the right place when you see:**

1. ✅ Left sidebar shows `fit-viewer` files
2. ✅ `package.json` is visible
3. ✅ `src/` folder exists
4. ✅ Run button (▶️) appears in Activity Bar
5. ✅ Status bar shows folder name

---

## 🆘 Still Can't Find It?

### Verify the folder exists:

```powershell
# Check if folder exists
Test-Path "C:\GitHub\garmin\fork\fit-viewer"
# Should return: True

# List files in the folder
Get-ChildItem "C:\GitHub\garmin\fork\fit-viewer"
# Should show: package.json, src, media, etc.
```

If `Test-Path` returns `False`, the folder doesn't exist at that location.

### Find where the folder actually is:

```powershell
# Search for the folder
Get-ChildItem -Path C:\GitHub -Recurse -Directory -Filter "fit-viewer" | Select-Object FullName
```

---

## 📝 Summary

**"code ." explained:**
- NOT a folder
- It's a command
- Opens VS Code in current directory

**To open your extension:**
1. Navigate to: `C:\GitHub\garmin\fork\fit-viewer`
2. Run: `code .` (or use File Explorer/VS Code menu)
3. Press F5 to debug

**Need help?** The folder is at `C:\GitHub\garmin\fork\fit-viewer` on your hard drive!
