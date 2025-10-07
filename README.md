# fit-viewer README

Open, edit, and **recover corrupted** `.fit` files within `vscode`.

## ✨ Features

- 📊 **View** FIT file data in interactive tables
- 🗺️ **Map visualization** of GPS tracks
- 📈 **Charts** for all numeric data
- ✏️ **Edit and save** FIT files
- 🔧 **Recovery Mode** for corrupted/incomplete files (NEW!)
- 🏃 **Physiology Check** - Validate files for Garmin's engine
- 📤 **Export to JSON** for external editing

![Map](screenshots/map.png)

![Table](screenshots/data.png)

![Charts](screenshots/chart.png)

## 🚨 NEW: Recover Corrupted FIT Files

**Problem:** Activity recovered but missing Training Effect, Load, VO₂ max, and recovery metrics?

**Solution:** Use **Recovery Mode** to edit critical fields and enable Garmin's physiology engine processing.

### Quick Recovery:

1. Open corrupted `.fit` file
2. Go to **Data** tab
3. Click **"🔧 Recovery Mode"** to enable
4. Click **"🏃 Check Physiology"** to see what's missing
5. Edit required fields:
   - **FILE_ID**: manufacturer, product, serialNumber
   - **SESSION**: totalTrainingEffect, avgHeartRate, trainingLoad
   - **ACTIVITY**: timestamps, totalTimerTime
   - **DEVICE_INFO**: device identification
6. Click **"💾 Save"**
7. Upload to Garmin Connect - metrics will appear!

**See [RECOVERY_GUIDE.md](RECOVERY_GUIDE.md) for detailed step-by-step instructions.**

## 🎯 How to Use

### Viewing FIT Files

- Install the extension: Look for `FIT File Viewer` in the [Marketplace](https://marketplace.visualstudio.com/items?itemName=ThomasCamminady.fit-viewer)
- Right-click on a `.fit` file, select `Open with...`
- Click `Configure default editor for '*.fit'...`
- Click `FIT File Viewer`

Now, whenever you click on a `.fit` file it uses `FIT File Viewer`.

### Editing FIT Files

1. Open a .fit file
2. Navigate to the **Data** tab
3. Click **"✏️ Enable Editing"**
4. Edit values in editable cells (highlighted in yellow)
5. Click **"💾 Save"** when done
6. Optionally create a backup when prompted

**See [EDITING_GUIDE.md](EDITING_GUIDE.md) for detailed instructions and safety information.**

## 🔧 Recovery Mode Features

Recovery Mode unlocks editing of critical fields normally protected:

### Editable in Recovery Mode:

**FILE_ID**:
- manufacturer (e.g., "garmin")
- product (device model ID)
- serialNumber
- timeCreated

**SESSION** (Training Metrics):
- totalTrainingEffect (Aerobic TE: 1.0-5.0)
- totalAnaerobicTrainingEffect (Anaerobic TE: 1.0-5.0)
- trainingLoad
- avgHeartRate, maxHeartRate
- normalizedPower, intensityFactor
- avgRunningCadence, avgVerticalOscillation
- totalCalories
- timeInHrZone, timeInPowerZone

**ACTIVITY**:
- timestamp
- totalTimerTime
- numSessions
- localTimestamp

**DEVICE_INFO**:
- manufacturer, product, serialNumber
- deviceType, deviceIndex
- softwareVersion, hardwareVersion

**DEVELOPER_DATA** (Garmin HRM, sensors):
- applicationId, manufacturerId
- Custom sensor metrics

## ⚠️ Important Disclaimers

### Disclaimer 1: Editing Warning

**Editing FIT files can corrupt them if done incorrectly.** 

- Only edit fields you understand
- Always create backups before saving
- Some fields are computed from others - editing may cause inconsistencies
- Invalid edits may prevent the file from loading on Garmin devices

Use the editing feature at your own risk.

### Disclaimer 2: Employment

No work in this repository is affiliated with my employer, [Wahoo Fitness](http://www.wahoofitness.com). 

## Disclaimer 2

I have no idea what I am doing here. All code was written by ChatGPT and I haven't written a single line of JavaScript or TypeScript on my own. Suggestions to improve this code are very much appreciated.

## 🛠️ Development Setup

### Prerequisites

- **Node.js** v20+ ([download](https://nodejs.org/))
- **npm** v10+ (comes with Node.js)
- **Visual Studio Code** v1.96.0+
- **Make** (optional, recommended for Windows)

### Quick Start

#### Option 1: Using Make (Recommended)

```bash
# Clone repository
git clone https://github.com/your-username/fit-viewer.git
cd fit-viewer

# Complete setup (install + compile)
make dev

# Watch mode for development
make watch

# Create package for distribution
make package
```

#### Option 2: Using npm directly

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode
npm run watch

# Create package
npm run package
```

### Available Make Commands

```bash
make help          # Show all available commands
make install       # Install dependencies
make compile       # Compile TypeScript
make watch         # Auto-compile on changes
make dev           # Full dev setup
make package       # Create .vsix package
make clean         # Remove dependencies and output
make reinstall     # Clean and reinstall
```

### Testing the Extension

1. Press `F5` in VS Code (or Run > Start Debugging)
2. Extension Development Host opens
3. Open a `.fit` file
4. Test viewer and recovery mode features

### Project Structure

See [REQUIREMENTS.md](REQUIREMENTS.md) for:
- Detailed dependency information
- Development workflow
- Troubleshooting guide
- CI/CD integration

## Credit

Uses:
* [https://github.com/garmin/fit-javascript-sdk](https://github.com/garmin/fit-javascript-sdk), FIT Protocol License Agreement
* [https://leafletjs.com](https://leafletjs.com), BSD-2-Clause license
* [https://vega.github.io/vega-lite/](https://vega.github.io/vega-lite/), BSD-3-Clause license
* [https://github.com/vega/vega-embed](https://github.com/vega/vega-embed), BSD-3-Clause license
