# FIT File Recovery Mode - Implementation Summary

## 🎯 Purpose

Enhanced the FIT Viewer extension to support **recovery of corrupted/incomplete FIT files** that are missing critical training metrics due to incomplete saves at the end of exercises.

## ✅ User's Requirements

The user needed to edit the following fields to enable Garmin's physiology engine processing:

1. ✅ **FILE_ID** - device, serial number
2. ✅ **SESSION** - training type, load, aerobic/anaerobic summaries
3. ✅ **ACTIVITY** - timestamps, device-specific recording settings  
4. ✅ **DEVELOPER_DATA** - metrics from Garmin HRM, sensors, etc.

## 🔧 Implementation Details

### 1. Enhanced `fitEncoder.ts`

#### A. `getEditableFields()` - Recovery Mode Support

**Before:** Only safe fields editable (heartRate, cadence, power, etc.)

**After:** Recovery mode parameter unlocks critical fields:

```typescript
export function getEditableFields(
    messageType: string, 
    recoveryMode: boolean = false
): string[]
```

**New Editable Fields in Recovery Mode:**

**FILE_ID:**
- manufacturer
- product
- serialNumber
- timeCreated
- productName
- garminProduct

**SESSION:** 
- totalTrainingEffect (Aerobic TE)
- totalAnaerobicTrainingEffect (Anaerobic TE)
- trainingLoad
- trainingStressScore (TSS)
- intensityFactor (IF)
- normalizedPower (NP)
- avgVO2Max, maxVO2Max
- recoveryTime
- timeInHrZone[], timeInPowerZone[]
- avgRunningCadence, avgVerticalOscillation
- avgStanceTime, avgGroundContactTime
- And 20+ more physiology metrics

**LAP:**
- totalTrainingEffect
- totalAnaerobicTrainingEffect
- intensityFactor
- normalizedPower
- Running dynamics metrics

**ACTIVITY:**
- timestamp
- totalTimerTime
- numSessions
- localTimestamp
- event, eventType

**DEVICE_INFO:**
- manufacturer, product, serialNumber
- softwareVersion, hardwareVersion
- batteryVoltage, batteryStatus
- bodyLocation (for HRM)
- transmissionType
- antDeviceNumber

**DEVELOPER_DATA:**
- applicationId, manufacturerId
- developerDataIndex
- dataSourceId

**FIELD_DESCRIPTION:**
- All fields for custom sensor metrics

#### B. `validateFitData()` - Recovery Mode Validation

**Enhanced with recovery mode parameter:**

```typescript
export function validateFitData(
    messages: any, 
    recoveryMode: boolean = false
): { valid: boolean; errors: string[] }
```

**Changes:**
- In recovery mode, warnings instead of errors for:
  - Missing ACTIVITY message
  - Missing SESSION message
  - Missing LAP message
  - Records without timestamps
  - manufacturer = "development"
- Allows less complete files to be saved for gradual recovery

#### C. NEW: `validatePhysiologyFields()`

**Purpose:** Checks if file has required fields for Garmin's physiology engine

**Returns:**
```typescript
{
  valid: boolean;
  warnings: string[];     // Critical missing fields
  suggestions: string[];  // Recommended additions
}
```

**Checks performed:**
- FILE_ID completeness (manufacturer, product, serial)
- SESSION training metrics (TE, HR, calories)
- ACTIVITY message presence
- DEVICE_INFO presence
- Sport-specific metrics (e.g., running cadence for runs)
- Power-related metrics for cycling

**Example output:**
```
WARNINGS:
  • FILE_ID: manufacturer should be 'garmin' for Garmin devices
  • SESSION[0]: Missing Training Effect metrics
  • No DEVICE_INFO messages

SUGGESTIONS:
  • Set manufacturer to 'garmin' for Garmin devices
  • Add product ID (e.g., 2050 for Edge 530)
  • Add totalTrainingEffect (1.0-5.0)
  • Add avgHeartRate and maxHeartRate
```

### 2. Enhanced `fitFileEditorProvider.ts`

#### A. Recovery Mode State

**Added:**
```typescript
private recoveryMode: boolean = false;
```

#### B. New Message Handlers

**toggleRecoveryMode:**
- Toggles recovery mode on/off
- Sends update to webview
- Shows user notification

**checkPhysiology:**
- Runs `validatePhysiologyFields()`
- Returns results to webview for display

**Enhanced save handler:**
- Passes `recoveryMode` to validation
- Shows physiology warnings before save
- Allows user to review and proceed or cancel

### 3. Enhanced Webview (`webview.html`)

#### A. New UI Elements

**Recovery Mode Button:**
```html
<button id="recovery-btn" class="edit-btn">
    🔧 Recovery Mode
</button>
```

**Physiology Check Button:**
```html
<button class="edit-btn">
    🏃 Check Physiology
</button>
```

**Recovery Mode Indicator:**
```html
<span id="recovery-indicator" class="recovery-indicator">
    ⚠️ RECOVERY MODE ACTIVE
</span>
```

#### B. New Functions

**toggleRecoveryMode():**
- Sends message to extension
- Updates UI state

**checkPhysiology():**
- Triggers physiology validation
- Receives and displays results

**updateRecoveryModeUI():**
- Updates button appearance
- Shows/hides recovery indicator
- Changes button color (red when active)

**displayPhysiologyResults():**
- Shows warnings and suggestions in alert dialog
- Formatted list of issues and recommendations

### 4. Documentation

#### A. `RECOVERY_GUIDE.md` (400+ lines)

Comprehensive guide including:
- Problem description and symptoms
- Step-by-step recovery process
- Field-by-field editing instructions
- Product ID reference table
- Training Effect calculation guidelines
- Training Load estimation formulas
- Troubleshooting section
- Success checklist

#### B. Updated `README.md`

Added:
- Recovery Mode feature highlight
- Quick recovery steps
- List of editable fields in recovery mode
- Link to detailed recovery guide

## 🎓 Key Technical Decisions

### 1. Recovery Mode Toggle vs. Always On

**Decision:** Toggle button, default OFF

**Rationale:**
- Prevents accidental editing of critical fields
- Makes user explicitly aware of elevated permissions
- Clear visual feedback (red button, warning indicator)

### 2. Physiology Validation Separate from File Validation

**Decision:** Two separate functions

**Rationale:**
- File validation: Structure and required messages
- Physiology validation: Garmin-specific metrics
- Allows saving structurally valid but physiologically incomplete files
- User can incrementally fix issues

### 3. Warnings vs. Errors in Recovery Mode

**Decision:** Warnings only, allow save

**Rationale:**
- Users recovering corrupted files need flexibility
- Gradual recovery process - can't fix everything at once
- Trust user judgment when recovery mode is enabled
- Better than blocking saves completely

### 4. Detailed Physiology Feedback

**Decision:** Specific warnings and actionable suggestions

**Rationale:**
- Users may not know what Garmin needs
- Suggestions guide the recovery process
- Examples and ranges help set realistic values
- Educational component

## 📊 Usage Scenarios

### Scenario 1: Activity Cut Short

**Problem:**
- Watch battery died before saving
- Activity recovered from device
- No SESSION summary, no ACTIVITY message

**Solution:**
1. Enable Recovery Mode
2. Check Physiology → sees missing SESSION/ACTIVITY
3. Add SESSION with calculated metrics from records
4. Add ACTIVITY message with end timestamp
5. Save → ready for Garmin Connect

### Scenario 2: Development/Testing File

**Problem:**
- Created FIT file programmatically
- manufacturer = "development"
- Garmin Connect rejects file

**Solution:**
1. Enable Recovery Mode
2. Edit FILE_ID:manufacturer to "garmin"
3. Add valid product ID
4. Save → uploads to Garmin Connect

### Scenario 3: Missing Training Metrics

**Problem:**
- File opens in Garmin Connect
- Activity appears but no Training Effect
- No VO₂ max update
- No recovery time

**Solution:**
1. Check Physiology → identifies missing TE, HR data
2. Enable Recovery Mode
3. Calculate and add:
   - totalTrainingEffect based on duration/intensity
   - avgHeartRate from record data
   - totalCalories estimated
4. Save → metrics calculate on next sync

### Scenario 4: Corrupted Device Info

**Problem:**
- Device serial changed
- Multiple devices used in one activity
- Garmin can't identify source

**Solution:**
1. Enable Recovery Mode
2. Edit DEVICE_INFO messages
3. Set correct manufacturer, product, serial
4. Save → device properly identified

## 🔒 Safety Features

### Built-in Protections

1. **Backup Prompt:** Always asks before saving
2. **Validation:** Runs before every save
3. **Physiology Check:** Shows warnings before proceeding
4. **Modal Confirmation:** For files with warnings
5. **Recovery Indicator:** Constant visual reminder
6. **Undo/Redo:** All changes reversible

### User Warnings

1. Prominent disclaimers in UI
2. Recovery mode notification message
3. Tooltip on buttons explaining risks
4. Documentation warnings throughout
5. Examples of valid value ranges

## 📈 Metrics of Success

### What Users Can Now Do

✅ Fix incomplete FIT files from failed saves
✅ Add missing training metrics manually
✅ Correct device identification
✅ Enable Garmin physiology processing
✅ Recover activities that would be lost
✅ Edit developer/custom sensor data
✅ Validate files before upload

### Comparison: Before vs. After

| Task | Before | After |
|------|--------|-------|
| Edit FILE_ID.manufacturer | ❌ | ✅ (Recovery Mode) |
| Edit SESSION training metrics | ❌ | ✅ (Recovery Mode) |
| Add missing ACTIVITY message | ❌ | ✅ (Manual JSON) |
| Check Garmin compatibility | ❌ | ✅ (Physiology Check) |
| Edit device info | ❌ | ✅ (Recovery Mode) |
| Edit developer fields | ❌ | ✅ (Recovery Mode) |

## 🚀 Future Enhancements

### Potential Additions

1. **Auto-calculation:**
   - Automatically calculate Training Effect from HR zones
   - Auto-populate SESSION from RECORD aggregation
   - Estimate missing metrics

2. **Message Creation:**
   - Generate missing SESSION message
   - Generate missing ACTIVITY message
   - Create DEVICE_INFO from FILE_ID

3. **Batch Recovery:**
   - Fix multiple files at once
   - Apply same corrections across files
   - Template-based recovery

4. **Smart Suggestions:**
   - ML-based Training Effect estimation
   - Historical data analysis
   - Device-specific defaults

## ✅ Testing Recommendations

### Manual Test Cases

1. **Recovery Mode Toggle:**
   - [ ] Clicking button toggles mode
   - [ ] Button changes color when active
   - [ ] Indicator appears/disappears
   - [ ] Notification shown

2. **Physiology Check:**
   - [ ] Missing manufacturer warning shown
   - [ ] Missing TE warning shown
   - [ ] Suggestions displayed
   - [ ] Valid file shows ✅

3. **Editing in Recovery Mode:**
   - [ ] Can edit FILE_ID fields
   - [ ] Can edit SESSION training metrics
   - [ ] Can edit ACTIVITY fields
   - [ ] Can edit DEVICE_INFO

4. **Saving:**
   - [ ] Validation runs
   - [ ] Physiology warnings shown
   - [ ] Can proceed or cancel
   - [ ] Backup created
   - [ ] File saves successfully

5. **Upload to Garmin Connect:**
   - [ ] Fixed file uploads
   - [ ] Training Effect appears
   - [ ] Metrics calculate
   - [ ] Device identified correctly

## 📄 Files Changed/Added

### New Files
1. `RECOVERY_GUIDE.md` - 400+ line comprehensive guide

### Modified Files
1. `src/fitEncoder.ts` - Recovery mode support, physiology validation
2. `src/fitFileEditorProvider.ts` - Recovery mode toggle, physiology check
3. `media/webview.html` - Recovery UI, physiology display
4. `README.md` - Recovery mode documentation

### Lines of Code Added
- `fitEncoder.ts`: +300 lines
- `fitFileEditorProvider.ts`: +80 lines
- `webview.html`: +60 lines
- Documentation: +400 lines
- **Total: ~840 lines**

## 🎯 Conclusion

The Recovery Mode implementation successfully addresses the user's need to fix corrupted/incomplete FIT files and enable Garmin's physiology engine processing. 

**Key Achievements:**
- ✅ All requested fields now editable in Recovery Mode
- ✅ Comprehensive validation and guidance
- ✅ Safe workflow with warnings and confirmations
- ✅ Detailed documentation for end users
- ✅ Maintains backward compatibility (recovery mode off by default)

**Ready for:** Testing with real corrupted FIT files and upload to Garmin Connect.
