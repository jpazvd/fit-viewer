# Change Log

All notable changes to the "fit-viewer" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.7.0] - 2025-01-07

### Added
- **Edit and Save functionality** - Full support for editing FIT files directly in VS Code
  - Toggle edit mode to enable/disable editing
  - Editable fields: heartRate, cadence, power, temperature, altitude, enhancedSpeed, and more
  - Real-time validation before saving
  - Automatic backup creation option before saving
  - Unsaved changes indicator
  - Undo/Redo support through VS Code's built-in functionality
- **Export to JSON** - Export FIT data to JSON format for external editing
- **Crash recovery** - Automatic backup for unsaved changes

### Changed
- Switched from `CustomReadonlyEditorProvider` to `CustomEditorProvider`
- Enhanced error handling and validation
- Improved user feedback with status messages

### Technical
- Added `fitEncoder.ts` - Encoding FIT files back to binary format
- Added `fitDocument.ts` - Custom document with edit tracking and undo/redo
- Updated `fitFileEditorProvider.ts` - Full CRUD operations support
- Enhanced webview with edit controls and interactive editing

## [0.6.0] - Previous Release

- Initial read-only viewer with Map, Data Tables, and Charts

## [Unreleased]

- Import from JSON functionality
- Advanced field validation with custom rules
- Batch editing capabilities