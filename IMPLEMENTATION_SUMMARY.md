# FIT Viewer - Edit & Save Implementation Summary

## 📚 Documentation Reviewed

### Garmin FIT JavaScript SDK
- **GitHub**: https://github.com/garmin/fit-javascript-sdk
- **Documentation**: https://developer.garmin.com/fit
- **Version used**: @garmin/fitsdk v21.161.0

### Key Learnings:

1. **Encoder Class Exists** ✅
   - `new Encoder()` creates encoder instance
   - `encoder.onMesg(mesgNum, message)` writes individual messages
   - `encoder.writeMesg(message)` writes with mesgNum in message data
   - `encoder.close()` returns `Uint8Array` of binary FIT data

2. **Message Format**
   - Same format as Decoder output (camelCase fields)
   - Subfields are automatically ignored by encoder
   - Unknown fields are ignored
   - Must preserve message order for valid files

3. **Required Message Order** (for Activity files):
   ```
   FILE_ID (required, first)
   DEVICE_INFO (recommended)
   EVENT (timer events)
   RECORD (data points)
   LAP (lap summaries)  
   SESSION (session summaries)
   ACTIVITY (required, last)
   ```

4. **Profile.MesgNum Constants**
   - Used to identify message types
   - Included in decoded messages
   - Required for encoding

## 🎯 Implementation Completed

### New Files Created:

1. **`src/fitEncoder.ts`** (300+ lines)
   - `encodeFitFile()` - Encodes messages back to FIT binary
   - `validateFitData()` - Validates structure before encoding
   - `getEditableFields()` - Returns safe-to-edit fields per message type
   - `createBackupPath()` - Generates timestamped backup filename
   - Implements proper message ordering
   - Comprehensive validation logic

2. **`src/fitDocument.ts`** (127 lines)
   - Custom document class implementing `vscode.CustomDocument`
   - Edit tracking with undo/redo support
   - Dirty state management
   - Edit application with immutable data patterns
   - Full integration with VS Code's document lifecycle

3. **`EDITING_GUIDE.md`** (150+ lines)
   - Comprehensive user guide
   - Safety warnings and best practices
   - Examples for common use cases
   - Troubleshooting section
   - Technical details about encoding

### Modified Files:

1. **`src/fitFileEditorProvider.ts`** (230 lines, complete rewrite)
   - Changed from `CustomReadonlyEditorProvider` to `CustomEditorProvider`
   - Implemented all CRUD operations:
     - `saveCustomDocument()` - Save with validation and backup
     - `saveCustomDocumentAs()` - Save to new location
     - `revertCustomDocument()` - Revert changes
     - `backupCustomDocument()` - Crash recovery
   - Added message handling for edit/save/export
   - Webview update on content changes
   - Export to JSON functionality

2. **`media/webview.html`** (100+ lines added)
   - Edit mode toggle button
   - Save button with dirty state management
   - Export to JSON button
   - Unsaved changes indicator
   - Contenteditable table cells with visual feedback
   - Edit event handlers
   - Cell value parsing (string vs number)
   - Table cells marked with `data-table-name` attribute
   - Yellow highlighting for editable cells
   - Focus styling for active editing

3. **`package.json`**
   - Added missing `"watch": "tsc -watch -p ./"` script
   - Ready for development with watch mode

4. **`README.md`**
   - Added editing features documentation
   - Safety warnings prominent
   - Link to detailed editing guide
   - Updated feature list

5. **`CHANGELOG.md`**
   - Documented v0.7.0 changes
   - Listed all new features
   - Technical changes noted

## 🔒 Safety Features Implemented

### 1. Validation
- Required messages checked (FILE_ID, ACTIVITY, SESSION, LAP for activities)
- Field type validation (numbers, timestamps)
- Structure integrity checks
- Pre-save validation prevents corruption

### 2. Backups
- Optional backup creation before saving
- Timestamped backup filenames (`.backup-2025-01-07T12-30-45.fit`)
- User prompted for backup decision

### 3. Limited Editing
- Only "safe" fields are editable by default
- Computed fields excluded
- Critical structure fields protected
- Field whitelist per message type

### 4. Undo/Redo
- Full VS Code undo/redo integration
- Edit history tracked
- Revert to last saved state

### 5. Error Handling
- Comprehensive try/catch blocks
- User-friendly error messages
- Detailed console logging for debugging
- Validation errors listed clearly

## ⚙️ Technical Architecture

### Data Flow:

```
User Opens FIT File
    ↓
Decoder.read() → Messages (JSON)
    ↓
FitDocument created (immutable initial state)
    ↓
User Edits → Tracked as Edit[]
    ↓
FitDocument.currentData (initial + edits applied)
    ↓
User Saves → validateFitData()
    ↓
encodeFitFile() → Uint8Array
    ↓
Write to disk
```

### Edit Tracking:

```typescript
interface FitEdit {
    table: string;      // 'recordMesgs'
    row: number;        // array index
    field: string;      // 'heartRate'
    oldValue: any;      // previous value
    newValue: any;      // new value
}
```

### Message Encoding Logic:

1. Iterate through message types in correct order
2. For each message type array:
   - Call `encoder.writeMesg(message)`
   - Message already contains `mesgNum`
3. Handle encoding errors gracefully
4. Call `encoder.close()` to get binary data

## 🧪 Testing Recommendations

### Before Publishing:

1. **Test with various FIT files:**
   - Activity files (running, cycling)
   - Course files
   - Workout files
   - Settings files

2. **Test editing scenarios:**
   - Edit single field
   - Edit multiple fields
   - Save and reload
   - Undo/redo operations
   - Cancel without saving

3. **Test edge cases:**
   - Very large files (>10MB)
   - Corrupted files
   - Empty record messages
   - Missing required messages

4. **Test encoding:**
   - Verify encoded files load in Garmin Connect
   - Verify on Garmin devices
   - Check file integrity with `Decoder.checkIntegrity()`

5. **Test validation:**
   - Try to save with missing FILE_ID
   - Try to save with invalid field types
   - Try to save with missing timestamps

## 📝 Known Limitations

1. **No Import from JSON** (planned for future)
2. **Limited field validation** - basic type checking only
3. **No batch editing UI** - must edit individually
4. **Position data editing** - possible but dangerous (can break GPS track)
5. **Timestamp editing** - disabled to prevent time-series corruption
6. **Developer fields** - not fully supported for editing yet

## 🚀 Future Enhancements

1. **Phase 2:**
   - Import from JSON functionality
   - Advanced field validation rules
   - Field-level constraints (min/max values)

2. **Phase 3:**
   - Batch editing UI
   - Search and replace across records
   - Formula-based editing (e.g., "multiply all power by 0.95")

3. **Phase 4:**
   - Visual editing on charts/maps
   - Drag points on elevation profile
   - Draw new GPS tracks

4. **Phase 5:**
   - Developer field editing
   - Custom message types
   - FIT file generation from scratch

## ✅ Checklist for Deployment

- [x] Encoder implementation complete
- [x] Document class with undo/redo
- [x] Editor provider with full CRUD
- [x] Webview edit controls
- [x] Validation logic
- [x] Backup functionality
- [x] Documentation (README, CHANGELOG, EDITING_GUIDE)
- [x] Error handling
- [ ] Unit tests (recommended)
- [ ] Integration tests with real FIT files (recommended)
- [ ] Update version to 0.7.0 in package.json
- [ ] Test compilation: `npm run compile`
- [ ] Test packaging: `npm run package`
- [ ] Manual testing with various FIT files
- [ ] Publish to VS Code Marketplace

## 🎓 Developer Notes

### Debugging Tips:

1. **Enable console logging:**
   - Open "Help → Toggle Developer Tools"
   - Check Console for encoder/decoder logs

2. **Check FIT file integrity:**
   ```typescript
   const decoder = new Decoder(stream);
   console.log(decoder.checkIntegrity()); // should be true
   ```

3. **Export to JSON for inspection:**
   - Use the "Export JSON" button
   - Inspect structure and values
   - Compare before/after editing

4. **Use FitCSVTool:**
   - Convert FIT to CSV for debugging
   - Available in Garmin FIT SDK

### Common Issues:

**Issue**: "Cannot find module '@garmin/fitsdk'"
- **Solution**: Run `npm install` to install dependencies

**Issue**: Webview not loading
- **Solution**: Check that `media/webview.html` is copied to `out/media/`
- Run: `npm run copy-assets`

**Issue**: Edits not saving
- **Solution**: Check console for validation errors
- Ensure message structure is intact

## 📄 License Compliance

This implementation uses:
- Garmin FIT SDK (FIT Protocol License)
- VS Code Extension APIs (MIT)
- TypeScript (Apache 2.0)
- All properly attributed in README.md

## 🙏 Acknowledgments

- **Garmin** for the excellent FIT SDK and documentation
- **VS Code team** for CustomEditor APIs
- **ChatGPT/AI assistance** acknowledged in original README
- **Community** for testing and feedback

---

**Status**: ✅ Implementation complete and ready for testing

**Next Steps**: 
1. Update version in package.json to 0.7.0
2. Run `npm run compile` to test compilation
3. Test with real FIT files
4. Package and publish if tests pass
