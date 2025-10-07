# FIT File Recovery Guide

## 🚨 Recovering Corrupted/Incomplete FIT Files

This guide specifically addresses recovering FIT files that were not fully saved at the end of an exercise, resulting in missing training metrics like Training Effect, Load, VO₂ max, and Recovery time.

---

## 🎯 Problem: Incomplete FIT Files

**Symptoms:**
- Activity recovered but physiological metrics missing
- Garmin Connect shows activity but no Training Effect
- Missing VO₂ max calculation
- No recovery time recommendation
- Missing training load data

**Cause:**
Garmin's physiology engine only processes complete FIT files that include:
- ✅ Proper FILE_ID with device information
- ✅ Complete SESSION summaries with training metrics
- ✅ Proper ACTIVITY message
- ✅ DEVICE_INFO messages
- ✅ Developer data fields from sensors (HRM, power meters, etc.)

---

## 🔧 Solution: Recovery Mode

The FIT Viewer's **Recovery Mode** allows you to edit critical fields that are normally protected, enabling you to complete corrupted files so Garmin's physiology engine can process them.

---

## 📋 Step-by-Step Recovery Process

### Step 1: Enable Recovery Mode

1. Open your corrupted `.fit` file in VS Code
2. Go to the **Data** tab
3. Click **"🔧 Recovery Mode: OFF"** to enable it
4. The button will turn red and show **"🔧 Recovery Mode: ON"**
5. You'll see **"⚠️ RECOVERY MODE ACTIVE"** indicator

### Step 2: Check Physiology Status

1. Click **"🏃 Check Physiology"** button
2. Review the warnings and suggestions
3. Note which fields are missing or need correction

Example output:
```
⚠️ Physiology Check Results:

WARNINGS:
  • FILE_ID: manufacturer should be 'garmin' for Garmin devices
  • SESSION[0]: Missing Training Effect metrics
  • SESSION[0]: Missing heart rate data
  • No DEVICE_INFO messages

SUGGESTIONS:
  • Set manufacturer to 'garmin'
  • Add product ID (e.g., 3122 for Fenix 7)
  • Add totalTrainingEffect (1.0-5.0)
  • Add avgHeartRate and maxHeartRate from record data
```

### Step 3: Fix FILE_ID Message

**Critical fields to edit:**

| Field | Purpose | Example Value | How to Find |
|-------|---------|---------------|-------------|
| `manufacturer` | Device brand | `"garmin"` | Set to "garmin" for Garmin devices |
| `product` | Device model ID | `3122` | [See Product IDs table below](#product-ids) |
| `serialNumber` | Device serial | `1234567890` | From device settings or original file |
| `timeCreated` | File creation time | `{Date object}` | Start time of activity |

**Steps:**
1. Enable editing (click "✏️ Enable Editing")
2. Expand **fileIdMesgs** table
3. Click on each field value to edit
4. Enter correct values
5. Press Enter to save each change

### Step 4: Add Training Metrics to SESSION

**Required fields for physiology engine:**

| Field | Description | Typical Range | How to Calculate |
|-------|-------------|---------------|------------------|
| `totalTrainingEffect` | Aerobic TE | 1.0 - 5.0 | Based on intensity and duration |
| `totalAnaerobicTrainingEffect` | Anaerobic TE | 1.0 - 5.0 | Based on high-intensity efforts |
| `trainingLoad` | Training Load | 0 - 500+ | Duration × intensity factor |
| `avgHeartRate` | Average HR | 120 - 180 bpm | Calculate from record data |
| `maxHeartRate` | Maximum HR | 150 - 200 bpm | Max from record data |
| `totalCalories` | Energy burned | 200 - 3000 kcal | Based on HR zones and duration |

**Training Effect Guidelines:**
- **1.0-1.9**: Minor benefit (recovery)
- **2.0-2.9**: Maintaining fitness
- **3.0-3.9**: Improving fitness
- **4.0-4.9**: Highly improving
- **5.0**: Overreaching

**Steps:**
1. Expand **sessionMesgs** table
2. Enable editing if not already enabled
3. Click on missing fields to add values
4. Calculate appropriate values based on your activity:

**Example Calculations:**

For a **moderate 1-hour run** at avg HR 150:
```
totalTrainingEffect = 3.0 (improving)
totalAnaerobicTrainingEffect = 1.5 (minor)
avgHeartRate = 150
maxHeartRate = 165
totalCalories = 600
trainingLoad = 180
```

For a **hard 45-min cycling** session with high power:
```
totalTrainingEffect = 2.5 (maintaining)
totalAnaerobicTrainingEffect = 3.5 (improving)
normalizedPower = 250
intensityFactor = 0.85
totalCalories = 550
trainingLoad = 220
```

### Step 5: Add DEVICE_INFO (if missing)

If the "Check Physiology" shows missing DEVICE_INFO:

1. Add a new row to **deviceInfoMesgs** (if table missing, export to JSON and add manually)
2. Required fields:
   - `manufacturer`: "garmin"
   - `product`: Same as FILE_ID product
   - `serialNumber`: Same as FILE_ID serial number
   - `deviceIndex`: "creator"
   - `deviceType`: "hr" for heart rate monitor, "bike_power" for power meter

### Step 6: Fix ACTIVITY Message

Expand **activityMesgs** and ensure:
- `timestamp`: End time of activity (last record timestamp)
- `totalTimerTime`: Total active time in seconds
- `numSessions`: Usually 1
- `localTimestamp`: Local time with timezone offset

### Step 7: Save and Validate

1. Click **"💾 Save"** button
2. Choose "Yes" to create backup
3. Review the physiology check warnings
4. Click "Continue Save" if acceptable
5. File will be saved with all corrections

---

## 📊 Quick Reference Tables

### Product IDs

Common Garmin devices:

| Device | Product ID |
|--------|------------|
| Fenix 7 | 3122 |
| Fenix 6 | 2697 |
| Forerunner 945 | 2691 |
| Forerunner 245 | 2704 |
| Edge 530 | 2050 |
| Edge 830 | 2988 |
| Edge 1030 | 2713 |
| Venu | 3003 |

Full list: https://github.com/dtcooper/python-fitparse/blob/master/fitparse/profile.xlsx

### Manufacturer IDs

| Manufacturer | Value |
|--------------|-------|
| Garmin | `1` or `"garmin"` |
| Development | `255` or `"development"` |

### Sport Types

Common sport values for `sport` field:

| Sport | Value |
|-------|-------|
| Running | `"running"` |
| Cycling | `"cycling"` |
| Swimming | `"swimming"` |
| Walking | `"walking"` |
| Hiking | `"hiking"` |

---

## 🧮 Calculating Missing Metrics

### Average Heart Rate from Records

If you have record data but SESSION avgHeartRate is missing:

1. Export to JSON
2. Use this calculation:
```javascript
const records = data.recordMesgs;
const hrValues = records
  .map(r => r.heartRate)
  .filter(hr => hr != null);
const avgHR = Math.round(
  hrValues.reduce((a, b) => a + b, 0) / hrValues.length
);
// Add avgHR to sessionMesgs
```

### Training Effect Estimation

**Based on time in HR zones:**

| Zone | % Max HR | Time (min) | TE Contribution |
|------|----------|------------|-----------------|
| 1 | 50-60% | Any | 0.1 per 10min |
| 2 | 60-70% | Any | 0.3 per 10min |
| 3 | 70-80% | Any | 0.6 per 10min |
| 4 | 80-90% | Any | 1.0 per 10min |
| 5 | 90-100% | Any | 1.5 per 10min |

**Example:**
- 20 min in Zone 2 = 0.3 × 2 = 0.6
- 30 min in Zone 3 = 0.6 × 3 = 1.8
- 10 min in Zone 4 = 1.0 × 1 = 1.0
- **Total TE = 3.4**

### Training Load Calculation

```
Training Load = Duration (min) × Intensity Factor

Intensity Factor by sport:
- Easy run: 1.0
- Moderate run: 2.0
- Hard run: 3.0-4.0
- Easy ride: 1.5
- Moderate ride: 2.5
- Hard ride: 4.0-5.0
```

---

## ⚠️ Important Warnings

### DO NOT Edit These Fields

Even in Recovery Mode, avoid editing:
- `timestamp` in individual records (breaks time series)
- `positionLat` / `positionLong` (corrupts GPS track)
- `mesgNum` (message type identifier)
- Computed fields like `distance` if you have speed data

### Values Must Be Realistic

Garmin's algorithms detect impossible values:
- ❌ Heart rate > 220 bpm
- ❌ Training Effect > 5.0
- ❌ Negative calories
- ❌ Future timestamps

Use realistic values based on your fitness level and the activity.

---

## 🔍 Troubleshooting

### "File still not processing in Garmin Connect"

**Checklist:**
1. ✅ `manufacturer` = "garmin" (not "development")
2. ✅ `product` = valid Garmin product ID
3. ✅ `serialNumber` is set
4. ✅ SESSION has `totalTrainingEffect`
5. ✅ SESSION has `avgHeartRate` and `maxHeartRate`
6. ✅ ACTIVITY message exists
7. ✅ At least one LAP message exists

### "VO₂ max still not calculated"

Requires:
- ✅ Heart rate data throughout activity
- ✅ GPS/speed data for running
- ✅ Power data for cycling (optional but helps)
- ✅ Multiple activities over time (algorithm needs history)
- ✅ Activity duration > 10 minutes

### "Recovery time not showing"

Requires:
- ✅ Training Effect values present
- ✅ Training Load calculated
- ✅ Previous activities in Garmin Connect history

---

## 📤 Alternative: Manual JSON Editing

For complex recoveries:

1. Click **"📤 Export JSON"**
2. Edit the JSON file with proper structure:

```json
{
  "fileIdMesgs": [{
    "type": "activity",
    "manufacturer": "garmin",
    "product": 3122,
    "serialNumber": 1234567890,
    "timeCreated": "2025-01-07T10:00:00.000Z"
  }],
  "sessionMesgs": [{
    "sport": "running",
    "totalTrainingEffect": 3.2,
    "totalAnaerobicTrainingEffect": 1.8,
    "avgHeartRate": 155,
    "maxHeartRate": 178,
    "totalCalories": 650,
    "trainingLoad": 185
  }]
}
```

3. Import back (future feature) or manually copy-paste values

---

## 📚 Additional Resources

- **Garmin FIT SDK**: https://developer.garmin.com/fit
- **FIT Protocol Spec**: https://developer.garmin.com/fit/protocol/
- **Product IDs**: https://github.com/dtcooper/python-fitparse
- **Training Effect Science**: https://www.firstbeat.com/en/science-and-physiology/training-effect/

---

## ✅ Success Checklist

Before uploading to Garmin Connect:

- [ ] Recovery Mode enabled
- [ ] Physiology check shows no critical warnings
- [ ] FILE_ID has manufacturer="garmin"
- [ ] FILE_ID has valid product ID
- [ ] FILE_ID has serial number
- [ ] SESSION has Training Effect values (1.0-5.0)
- [ ] SESSION has average and max heart rate
- [ ] SESSION has total calories
- [ ] ACTIVITY message exists
- [ ] DEVICE_INFO message exists
- [ ] Backup created before saving
- [ ] File saved successfully

---

**Your file should now be complete and ready for Garmin's physiology engine to process! Upload to Garmin Connect and your metrics should appear within a few minutes.**
