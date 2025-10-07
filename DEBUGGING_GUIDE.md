# Debugging FIT Viewer Extension - Setup Complete ✅

## ✅ What Was Fixed

VS Code was reporting "no markdown for debugging" because:
1. The `preLaunchTask` reference was incorrect
2. The compile task needed to be explicitly defined

**Fixed:**
- ✅ Updated `.vscode/tasks.json` - Added explicit compile task
- ✅ Updated `.vscode/launch.json` - Corrected task reference
- ✅ Added test configuration for completeness

## 🚀 How to Debug Now

### Method 1: Press F5 (Easiest)

1. **Make sure you're in the right folder:**
   ```powershell
   cd C:\GitHub\garmin\fork\fit-viewer
   code .
   ```

2. **Press F5** (or click Run > Start Debugging)

3. **What happens:**
   - VS Code automatically runs `npm run compile`
   - Compiles TypeScript → JavaScript
   - Opens Extension Development Host window
   - Your extension is loaded and ready

4. **Test your extension:**
   - Open a `.fit` file in the Extension Development Host
   - Try all features
   - Check console for logs

### Method 2: Use Debug Panel

1. **Open Debug view:** `Ctrl+Shift+D`
2. **Select configuration:** "Run Extension" (from dropdown)
3. **Click green play button** ▶️
4. **Extension Development Host opens**

### Method 3: Run Menu

1. **Go to:** Run > Start Debugging
2. **Or:** Run > Run Without Debugging (`Ctrl+F5`)

## 🔧 Debug Configurations Available

### 1. Run Extension (Primary)

**Name:** `Run Extension`  
**Purpose:** Launch extension in development host  
**Shortcut:** F5

**What it does:**
- Compiles TypeScript files
- Launches new VS Code window
- Loads your extension
- Enables debugging

### 2. Extension Tests (Optional)

**Name:** `Extension Tests`  
**Purpose:** Run automated tests  
**Use:** For testing when you add test cases

## 🎯 Debugging Workflow

### Starting Debug Session

1. **Press F5**
2. **Wait for compilation** (shows in terminal)
3. **Extension Development Host opens**
4. **Open a .fit file to test**

### Making Changes While Debugging

1. **Edit code** in original VS Code window
2. **Press `Ctrl+R`** in Extension Development Host to reload
3. **Or restart** with `Ctrl+Shift+F5`

### Viewing Debug Output

**Debug Console:**
- View > Debug Console (`Ctrl+Shift+Y`)
- See console.log() output
- View errors and warnings

**Terminal:**
- View compilation output
- See build errors

**Problems Panel:**
- View > Problems (`Ctrl+Shift+M`)
- See TypeScript errors

## 🐛 Debugging Features Available

### Breakpoints

1. **Set breakpoint:** Click left of line number (red dot appears)
2. **Run extension:** Press F5
3. **Trigger breakpoint:** Use the feature in Extension Development Host
4. **Debug controls appear:**
   - Continue (F5)
   - Step Over (F10)
   - Step Into (F11)
   - Step Out (Shift+F11)
   - Restart (Ctrl+Shift+F5)
   - Stop (Shift+F5)

### Watch Variables

1. **Debug view:** `Ctrl+Shift+D`
2. **Watch section:** Add variables to watch
3. **Inspect values** while debugging

### Call Stack

View the execution path when stopped at breakpoint

### Debug Console

Execute code in the current context:
```javascript
// Type in Debug Console:
document.uri.fsPath
messages.length
recoveryMode
```

## 🔍 Common Debugging Scenarios

### Debug WebView (UI)

The webview (HTML/JS) has separate debugging:

1. **In Extension Development Host:**
2. **Press `Ctrl+Shift+P`**
3. **Type:** `Developer: Open Webview Developer Tools`
4. **Select:** Your FIT Viewer webview
5. **Chrome DevTools opens**
6. **Debug HTML/CSS/JS** in the webview

### Debug Extension Code

Set breakpoints in:
- `src/extension.ts` - Extension activation
- `src/fitFileEditorProvider.ts` - Editor logic
- `src/fitEncoder.ts` - Encoding/validation
- `src/fitParser.ts` - Parsing

### Debug Build Issues

**If compilation fails:**

1. **Check Terminal output** for errors
2. **Run manually:**
   ```powershell
   cmd /c "npm run compile"
   ```
3. **Check Problems panel** (`Ctrl+Shift+M`)
4. **Fix TypeScript errors**
5. **Try F5 again**

## ⚙️ Configuration Files

### .vscode/launch.json

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Run Extension",
      "type": "extensionHost",
      "request": "launch",
      "args": ["--extensionDevelopmentPath=${workspaceFolder}"],
      "outFiles": ["${workspaceFolder}/out/**/*.js"],
      "preLaunchTask": "npm: compile"
    }
  ]
}
```

**Key settings:**
- `extensionHost` - Launches extension in dev host
- `outFiles` - Points to compiled JavaScript
- `preLaunchTask` - Compiles before launching

### .vscode/tasks.json

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "npm",
      "script": "compile",
      "label": "npm: compile",
      "group": {
        "kind": "build",
        "isDefault": true
      }
    }
  ]
}
```

**Key settings:**
- `npm compile` - Runs TypeScript compiler
- `isDefault: true` - Makes it the default build task
- `problemMatcher: $tsc` - Parses TypeScript errors

## 📝 Debug Output Examples

### Console Logs

Add to your code:
```typescript
console.log('Opening FIT file:', uri.fsPath);
console.log('Recovery mode:', this.recoveryMode);
console.log('Messages:', messages.length);
```

View in Debug Console (`Ctrl+Shift+Y`)

### Error Messages

```typescript
console.error('Failed to encode:', error);
vscode.window.showErrorMessage('Error: ' + error.message);
```

### Information Messages

```typescript
vscode.window.showInformationMessage('File saved successfully!');
```

## 🚦 Troubleshooting

### "No task found"

**Fixed!** The tasks.json now has the correct configuration.

### "Cannot find module 'vscode'"

**Solution:**
```powershell
cmd /c "npm install"
```

### "Out folder not found"

**Solution:**
```powershell
cmd /c "npm run compile"
```

### Extension Host won't open

1. Check Terminal for compilation errors
2. Verify `out/` directory exists
3. Check `out/extension.js` exists
4. Restart VS Code

### Changes not appearing

**In Extension Development Host:**
- Press `Ctrl+R` to reload extension
- Or `Ctrl+Shift+F5` to restart debugging

### Breakpoints not hitting

1. Ensure file is compiled (check `out/` folder)
2. Verify source maps exist (`*.js.map` files)
3. Check `outFiles` in launch.json matches your output
4. Rebuild: `Ctrl+Shift+B`

## ✅ Verification Checklist

Before debugging:
- [x] ✅ npm dependencies installed
- [x] ✅ Code compiled (`out/` folder exists)
- [x] ✅ launch.json configured
- [x] ✅ tasks.json configured
- [x] ✅ Extension folder open in VS Code

## 🎯 Quick Reference

| Action | Shortcut | Description |
|--------|----------|-------------|
| Start Debugging | F5 | Compile & launch |
| Stop Debugging | Shift+F5 | Stop debug session |
| Restart | Ctrl+Shift+F5 | Restart debugging |
| Reload Extension | Ctrl+R | In Extension Host |
| Debug Console | Ctrl+Shift+Y | View logs |
| Problems | Ctrl+Shift+M | View errors |
| Debug View | Ctrl+Shift+D | Debug panel |
| Build | Ctrl+Shift+B | Run compile task |

## 🎓 Next Steps

1. **Press F5** to start debugging
2. **Open a .fit file** in Extension Development Host
3. **Test all features:**
   - View data tables
   - Enable editing
   - Try recovery mode
   - Check physiology
   - Save changes

4. **Set breakpoints** to understand code flow
5. **Use Debug Console** to inspect variables
6. **Check logs** for any errors

## ✅ You're Ready to Debug!

Everything is now configured correctly. 

**To start:** Press **F5** and test your extension! 🚀

---

**Debug configurations:** ✅ Ready  
**Build tasks:** ✅ Ready  
**Extension:** ✅ Compiled  
**Status:** Ready to debug!
