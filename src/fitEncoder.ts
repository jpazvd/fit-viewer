/**
 * Encodes FIT messages back into a binary FIT file
 * @param messages - Object containing arrays of messages by type (e.g., recordMesgs, sessionMesgs)
 * @returns Uint8Array containing the encoded FIT file
 */
export async function encodeFitFile(messages: any): Promise<Uint8Array> {
    console.log("✅ encodeFitFile() called...");
    
    try {
        // Dynamically import Garmin FIT SDK
        const { Encoder, Profile } = await import('@garmin/fitsdk').then(mod => ({
            Encoder: mod.Encoder,
            Profile: mod.Profile
        }));
        
        console.log("✅ Garmin FIT SDK imported for encoding");
        
        // Create a new encoder
        const encoder = new Encoder();
        console.log("✅ FIT encoder initialized");
        
        // Define the correct order for FIT messages based on best practices
        // See: https://developer.garmin.com/fit/file-types/activity/
        const messageOrder = [
            'fileIdMesgs',           // REQUIRED - Must be first
            'fileCreatorMesgs',       // Recommended
            'developerDataIdMesgs',   // If using developer fields
            'fieldDescriptionMesgs',  // If using developer fields
            'deviceInfoMesgs',        // BEST PRACTICE
            'deviceSettingsMesgs',    // Optional
            'userProfileMesgs',       // Optional
            'eventMesgs',            // BEST PRACTICE (timer events)
            'recordMesgs',           // REQUIRED for activity files
            'lapMesgs',              // REQUIRED for activity files
            'sessionMesgs',          // REQUIRED for activity files
            'activityMesgs',         // REQUIRED - Must be last for activity files
            'sportMesgs',            // Optional
            'hrMesgs',               // Optional (heart rate)
            'hrvMesgs',              // Optional (heart rate variability)
        ];
        
        let messageCount = 0;
        
        // Write messages in the correct order
        for (const messageType of messageOrder) {
            if (messages[messageType] && Array.isArray(messages[messageType])) {
                const messageArray = messages[messageType];
                console.log(`📝 Writing ${messageArray.length} ${messageType} messages`);
                
                messageArray.forEach((msg: any, index: number) => {
                    try {
                        // Use writeMesg which expects mesgNum in the message
                        // The decoder already includes mesgNum in each message
                        encoder.writeMesg(msg);
                        messageCount++;
                    } catch (error) {
                        console.error(`❌ Error writing ${messageType}[${index}]:`, error);
                        throw error;
                    }
                });
            }
        }
        
        // Write any remaining message types not in our predefined order
        Object.keys(messages).forEach(messageType => {
            if (!messageOrder.includes(messageType) && Array.isArray(messages[messageType])) {
                const messageArray = messages[messageType];
                console.log(`📝 Writing ${messageArray.length} ${messageType} messages (not in standard order)`);
                
                messageArray.forEach((msg: any, index: number) => {
                    try {
                        encoder.writeMesg(msg);
                        messageCount++;
                    } catch (error) {
                        console.warn(`⚠️ Warning writing ${messageType}[${index}]:`, error);
                        // Don't throw - some messages might not be encodable
                    }
                });
            }
        });
        
        console.log(`✅ Wrote ${messageCount} total messages`);
        
        // Close the encoder and get the binary data
        const uint8Array = encoder.close();
        
        console.log(`✅ FIT file encoded successfully (${uint8Array.length} bytes)`);
        return uint8Array;
        
    } catch (error) {
        console.error("❌ Error encoding FIT file:", error);
        throw new Error(`Failed to encode FIT file: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Validates FIT data before encoding to prevent corruption
 * @param messages - Object containing arrays of messages by type
 * @param recoveryMode - If true, performs less strict validation for file recovery
 * @returns Validation result with errors if any
 */
export function validateFitData(messages: any, recoveryMode: boolean = false): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    console.log(`🔍 Validating FIT data (Recovery Mode: ${recoveryMode ? 'ON' : 'OFF'})...`);
    
    // Basic structure validation
    if (!messages || typeof messages !== 'object') {
        errors.push("Invalid messages structure - must be an object");
        return { valid: false, errors };
    }
    
    // Check for required File ID message (REQUIRED for all FIT files)
    if (!messages.fileIdMesgs || !Array.isArray(messages.fileIdMesgs) || messages.fileIdMesgs.length === 0) {
        errors.push("Missing required FILE_ID message");
    } else {
        const fileId = messages.fileIdMesgs[0];
        if (!fileId.type) {
            errors.push("FILE_ID message missing 'type' field");
        }
        
        // In recovery mode, manufacturer can be 'development' temporarily
        if (!recoveryMode && !fileId.manufacturer) {
            errors.push("FILE_ID message missing 'manufacturer' field");
        }
    }
    
    // If this is an activity file, check for required messages
    const isActivityFile = messages.fileIdMesgs?.[0]?.type === 'activity';
    if (isActivityFile) {
        if (!messages.activityMesgs || messages.activityMesgs.length === 0) {
            if (recoveryMode) {
                console.warn("⚠️ RECOVERY MODE: Activity file missing ACTIVITY message - will be created on save");
            } else {
                errors.push("Activity file missing required ACTIVITY message");
            }
        }
        
        if (!messages.sessionMesgs || messages.sessionMesgs.length === 0) {
            if (recoveryMode) {
                console.warn("⚠️ RECOVERY MODE: Activity file missing SESSION message(s) - will be created on save");
            } else {
                errors.push("Activity file missing required SESSION message(s)");
            }
        }
        
        if (!messages.lapMesgs || messages.lapMesgs.length === 0) {
            if (recoveryMode) {
                console.warn("⚠️ RECOVERY MODE: Activity file missing LAP message(s) - will be created on save");
            } else {
                errors.push("Activity file missing required LAP message(s)");
            }
        }
    }
    
    // Validate Record messages if present (most common message type)
    if (messages.recordMesgs) {
        if (!Array.isArray(messages.recordMesgs)) {
            errors.push("recordMesgs must be an array");
        } else {
            // Check for timestamps (required for most FIT files)
            const recordsWithoutTimestamp = messages.recordMesgs.filter((r: any) => !r.timestamp);
            if (recordsWithoutTimestamp.length > 0 && !recoveryMode) {
                errors.push(`${recordsWithoutTimestamp.length} record(s) missing timestamp`);
            } else if (recordsWithoutTimestamp.length > 0) {
                console.warn(`⚠️ RECOVERY MODE: ${recordsWithoutTimestamp.length} record(s) missing timestamp - may affect accuracy`);
            }
            
            // Validate coordinate fields if present (must be in semicircles or valid format)
            messages.recordMesgs.forEach((record: any, index: number) => {
                if (record.positionLat !== undefined && record.positionLat !== null) {
                    if (typeof record.positionLat !== 'number') {
                        errors.push(`Record[${index}].positionLat must be a number`);
                    }
                }
                if (record.positionLong !== undefined && record.positionLong !== null) {
                    if (typeof record.positionLong !== 'number') {
                        errors.push(`Record[${index}].positionLong must be a number`);
                    }
                }
            });
        }
    }
    
    // Validate Session messages
    if (messages.sessionMesgs && Array.isArray(messages.sessionMesgs)) {
        messages.sessionMesgs.forEach((session: any, index: number) => {
            if (!session.timestamp && !recoveryMode) {
                errors.push(`Session[${index}] missing required timestamp`);
            }
            if (!session.startTime && !recoveryMode) {
                errors.push(`Session[${index}] missing required startTime`);
            }
        });
    }
    
    // Validate Lap messages
    if (messages.lapMesgs && Array.isArray(messages.lapMesgs)) {
        messages.lapMesgs.forEach((lap: any, index: number) => {
            if (!lap.timestamp && !recoveryMode) {
                errors.push(`Lap[${index}] missing required timestamp`);
            }
            if (!lap.startTime && !recoveryMode) {
                errors.push(`Lap[${index}] missing required startTime`);
            }
        });
    }
    
    const isValid = errors.length === 0;
    if (isValid) {
        console.log("✅ FIT data validation passed");
    } else {
        console.error("❌ FIT data validation failed:", errors);
    }
    
    return { valid: isValid, errors };
}

/**
 * Gets a list of editable fields for a given message type
 * Some fields are computed/derived and should not be directly edited
 * 
 * RECOVERY MODE: Includes critical fields for fixing incomplete/corrupted FIT files
 * to enable Garmin's physiology engine processing
 */
export function getEditableFields(messageType: string, recoveryMode: boolean = false): string[] {
    // Define safe fields that can be edited per message type
    const editableFieldsMap: Record<string, string[]> = {
        recordMesgs: [
            'heartRate',
            'cadence',
            'power',
            'temperature',
            'altitude',
            'enhancedAltitude',
            'enhancedSpeed',
            'distance',
            'fractionalCadence',
            // Recovery mode additions
            ...(recoveryMode ? [
                'compressedSpeedDistance',
                'grade',
                'resistance',
                'cycleLength',
                'stanceTime',
                'verticalOscillation',
                'stanceTimePercent',
                'ballSpeed',
            ] : [])
        ],
        sessionMesgs: [
            'sport',
            'subSport',
            'totalCalories',
            'avgHeartRate',
            'maxHeartRate',
            'avgCadence',
            'maxCadence',
            'avgPower',
            'maxPower',
            // Recovery mode: Critical fields for Garmin physiology engine
            ...(recoveryMode ? [
                'trainingStressScore',  // TSS
                'intensityFactor',       // IF
                'normalizedPower',       // NP
                'totalTrainingEffect',   // Aerobic TE
                'totalAnaerobicTrainingEffect', // Anaerobic TE
                'trainingLoad',          // Training Load
                'totalWork',             // Total work in kJ
                'avgVO2Max',             // VO2 max estimate
                'maxVO2Max',
                'avgRunningCadence',
                'maxRunningCadence',
                'avgVerticalOscillation',
                'avgStanceTime',
                'avgStanceTimePercent',
                'avgGroundContactTime',
                'trainingLoadPeak',
                'recoveryTime',          // Recovery time recommendation
                'vo2MaxValue',
                'avgGrade',
                'maxGrade',
                'avgPosGrade',
                'avgNegGrade',
                'timeInHrZone',          // Array of time in each HR zone
                'timeInPowerZone',       // Array of time in each power zone
                'hrZoneCalc',
                'powerZoneCalc',
                'avgLapTime',
                'bestLapIndex',
            ] : [])
        ],
        lapMesgs: [
            'sport',
            'subSport',
            'totalCalories',
            'avgHeartRate',
            'maxHeartRate',
            'avgCadence',
            'maxCadence',
            'avgPower',
            'maxPower',
            // Recovery mode additions
            ...(recoveryMode ? [
                'totalTrainingEffect',
                'totalAnaerobicTrainingEffect',
                'intensityFactor',
                'normalizedPower',
                'avgRunningCadence',
                'maxRunningCadence',
                'avgVerticalOscillation',
                'avgStanceTime',
                'lapTrigger',
            ] : [])
        ],
        fileIdMesgs: [
            // Recovery mode: Allow editing device identification
            ...(recoveryMode ? [
                'manufacturer',          // Critical for Garmin processing
                'product',               // Device product ID
                'serialNumber',          // Device serial number
                'timeCreated',           // File creation time
                'number',                // File number
                'productName',           // Human-readable product name
                'garminProduct',         // Garmin-specific product code
            ] : ['productName'])
        ],
        deviceInfoMesgs: [
            'productName',
            'descriptor',
            // Recovery mode: Device-specific settings
            ...(recoveryMode ? [
                'manufacturer',
                'product',
                'serialNumber',
                'softwareVersion',
                'hardwareVersion',
                'cumOperatingTime',
                'batteryVoltage',
                'batteryStatus',
                'sensorDescription',
                'bodyLocation',          // For HRM sensors
                'transmissionType',
                'deviceIndex',
                'deviceType',
                'antDeviceNumber',
                'antNetwork',
                'sourceType',
            ] : [])
        ],
        activityMesgs: [
            ...(recoveryMode ? [
                'timestamp',             // Activity end timestamp
                'totalTimerTime',        // Total timer time
                'numSessions',           // Number of sessions
                'type',                  // Activity type
                'event',                 // Activity event
                'eventType',             // Event type
                'localTimestamp',        // Local timestamp with timezone
                'eventGroup',
            ] : [])
        ],
        eventMesgs: [
            ...(recoveryMode ? [
                'timestamp',
                'event',
                'eventType',
                'eventGroup',
                'timer',
                'data',
            ] : [])
        ],
        // Support for developer data (Garmin HRM, sensors, etc.)
        developerDataIdMesgs: [
            ...(recoveryMode ? [
                'applicationId',
                'applicationVersion',
                'manufacturerId',
                'developerDataIndex',
                'dataSourceId',
            ] : [])
        ],
        fieldDescriptionMesgs: [
            ...(recoveryMode ? [
                'developerDataIndex',
                'fieldDefinitionNumber',
                'fitBaseTypeId',
                'fieldName',
                'array',
                'components',
                'scale',
                'offset',
                'units',
                'bits',
                'accumulate',
                'fitBaseUnitId',
                'nativeMesgNum',
                'nativeFieldNum',
            ] : [])
        ],
    };
    
    return editableFieldsMap[messageType] || [];
}

/**
 * Validates fields specific to Garmin physiology engine requirements
 * These are critical for proper processing of training metrics
 */
export function validatePhysiologyFields(messages: any): { valid: boolean; warnings: string[]; suggestions: string[] } {
    const warnings: string[] = [];
    const suggestions: string[] = [];
    
    // Check for FILE_ID completeness
    if (messages.fileIdMesgs?.[0]) {
        const fileId = messages.fileIdMesgs[0];
        
        if (!fileId.manufacturer || fileId.manufacturer === 'development') {
            warnings.push("FILE_ID: manufacturer should be set to actual device manufacturer (e.g., 'garmin') for proper processing");
            suggestions.push("Set manufacturer to 'garmin' for Garmin devices");
        }
        
        if (!fileId.product) {
            warnings.push("FILE_ID: product ID missing - Garmin Connect may not recognize the device");
            suggestions.push("Add product ID (e.g., 2050 for Edge 530, 3122 for Fenix 7)");
        }
        
        if (!fileId.serialNumber) {
            warnings.push("FILE_ID: serial number missing - file may not be unique");
            suggestions.push("Add device serial number");
        }
        
        if (!fileId.timeCreated) {
            warnings.push("FILE_ID: timeCreated missing - file may have invalid timestamp");
            suggestions.push("Add file creation timestamp");
        }
    }
    
    // Check for SESSION completeness (critical for training metrics)
    if (messages.sessionMesgs?.length > 0) {
        messages.sessionMesgs.forEach((session: any, idx: number) => {
            if (!session.totalTrainingEffect && !session.totalAnaerobicTrainingEffect) {
                warnings.push(`SESSION[${idx}]: Missing Training Effect metrics - Garmin physiology engine won't calculate fitness impact`);
                suggestions.push(`Add totalTrainingEffect (1.0-5.0) and totalAnaerobicTrainingEffect (1.0-5.0)`);
            }
            
            if (!session.avgHeartRate && !session.maxHeartRate) {
                warnings.push(`SESSION[${idx}]: Missing heart rate data - VO2 max and other metrics won't be calculated`);
                suggestions.push(`Add avgHeartRate and maxHeartRate from record data`);
            }
            
            if (!session.totalCalories) {
                warnings.push(`SESSION[${idx}]: Missing totalCalories - energy expenditure won't be tracked`);
                suggestions.push(`Calculate from heart rate zones or power data`);
            }
            
            if (session.sport === 'running' && !session.avgRunningCadence) {
                suggestions.push(`SESSION[${idx}]: Consider adding avgRunningCadence for running efficiency metrics`);
            }
            
            if (session.sport === 'cycling' && !session.normalizedPower && session.avgPower) {
                suggestions.push(`SESSION[${idx}]: Consider adding normalizedPower for better training stress calculation`);
            }
        });
    } else {
        warnings.push("No SESSION messages found - file won't be processed properly by Garmin");
        suggestions.push("At least one SESSION message is required for activity files");
    }
    
    // Check for ACTIVITY message
    if (!messages.activityMesgs || messages.activityMesgs.length === 0) {
        warnings.push("No ACTIVITY message found - file is incomplete");
        suggestions.push("Add ACTIVITY message with timestamp, numSessions, and totalTimerTime");
    }
    
    // Check for DEVICE_INFO
    if (!messages.deviceInfoMesgs || messages.deviceInfoMesgs.length === 0) {
        warnings.push("No DEVICE_INFO messages - Garmin may not recognize the source device");
        suggestions.push("Add DEVICE_INFO message with manufacturer, product, and serial number");
    }
    
    return {
        valid: warnings.length === 0,
        warnings,
        suggestions
    };
}

/**
 * Creates a backup of the original FIT file before saving
 */
export function createBackupPath(originalPath: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    return originalPath.replace(/\.fit$/i, `.backup-${timestamp}.fit`);
}
