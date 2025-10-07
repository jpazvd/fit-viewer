# FIT Viewer - Edit & Save Guide

## ✨ New Features (v0.7.0)

The FIT Viewer now supports **editing and saving** FIT files directly in VS Code!

### 🔧 How to Edit FIT Files

1. **Open a .fit file** in VS Code with FIT Viewer
2. **Navigate to the Data tab** 
3. **Click "✏️ Enable Editing"** button
4. **Click on editable cells** (they'll highlight in yellow)
5. **Type your changes**
6. **Click "💾 Save"** when done

### ✅ What You Can Edit

**Safe Fields** (recommended for editing):
- `heartRate` - Heart rate in BPM
- `cadence` - Cadence (RPM for cycling, steps/min for running)
- `power` - Power in watts
- `temperature` - Temperature in degrees
- `altitude` / `enhancedAltitude` - Elevation data
- `enhancedSpeed` - Speed values
- Session/Lap metadata (sport type, calories, etc.)

### ⚠️ Important Warnings

1. **Backup is Recommended**: Always create a backup when prompted before saving
2. **Computed Fields**: Some fields are calculated from others - editing them may cause inconsistencies
3. **Validation**: The extension validates data before saving, but use caution
4. **File Corruption**: Invalid edits can corrupt FIT files - only edit if you know what you're doing

### 📤 Export to JSON

For more advanced editing:

1. Click **"📤 Export JSON"** button
2. Edit the JSON file externally
3. (Future feature: Import JSON back to FIT)

### 🔄 Undo/Redo

- Use VS Code's built-in **Ctrl+Z** (Undo) and **Ctrl+Y** (Redo)
- All edits support full undo/redo tracking

### 💾 Saving

When you save:
1. Extension validates the data structure
2. Option to create a backup (.backup-TIMESTAMP.fit)
3. Encodes data back to FIT format
4. Writes to the original file

### 🐛 Troubleshooting

**"Cannot save: Missing required FILE_ID message"**
- The FIT file structure is corrupted. Revert changes.

**"Failed to encode FIT file"**
- Some fields have invalid values. Check the Output panel for details.

**Changes not appearing after save**
- Reload the file (close and reopen)

### 🔒 Read-Only Fields

These fields are **NOT** editable to prevent corruption:
- `timestamp` (critical for time-series data)
- `positionLat` / `positionLong` (GPS coordinates - editable but use extreme caution)
- `mesgNum` (message type identifier)
- Computed aggregates in Session/Lap messages

### 📚 Technical Details

**Encoding Process:**
1. Collects all messages from the editor
2. Validates required messages (FILE_ID, ACTIVITY, SESSION, LAP)
3. Orders messages correctly (FILE_ID first, ACTIVITY last)
4. Uses Garmin FIT SDK Encoder to convert to binary
5. Writes Uint8Array to disk

**Message Order:**
```
FILE_ID (required, must be first)
DEVICE_INFO (recommended)
EVENT (timer events)
RECORD (activity data)
LAP (lap summaries)
SESSION (session summaries)
ACTIVITY (required, must be last)
```

### 🎓 Advanced Usage

**Batch Editing via JSON:**
```bash
# Export multiple files
for file in *.fit; do
  # Open in VS Code and export to JSON
done

# Edit JSON files with scripts/tools

# (Future) Import back to FIT
```

### 🚀 Coming Soon

- [ ] Import from JSON
- [ ] Advanced field validation rules
- [ ] Batch editing UI
- [ ] Field-level edit history
- [ ] Custom field editing for developer data

### ⚙️ Configuration

No additional configuration needed - editing is enabled by default for all FIT files.

### 📝 Examples

**Example 1: Adjust Heart Rate Data**
```
1. Open activity.fit
2. Go to Data tab
3. Enable Editing
4. Expand "recordMesgs" table
5. Click on heartRate values
6. Adjust as needed
7. Save with backup
```

**Example 2: Change Activity Type**
```
1. Open activity.fit
2. Go to Data tab
3. Enable Editing
4. Expand "sessionMesgs" table
5. Edit "sport" field (e.g., "running" → "cycling")
6. Save
```

### 🆘 Need Help?

- Check the [GitHub Issues](https://github.com/thomascamminady/fit-viewer/issues)
- Post in the [FIT SDK Forum](https://forums.garmin.com/developer/)
- Read the [FIT SDK Documentation](https://developer.garmin.com/fit)

---

**Disclaimer**: This extension is provided as-is. Editing FIT files can corrupt them if done incorrectly. Always backup your files before editing. The author is not responsible for any data loss.
