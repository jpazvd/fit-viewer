/**
 * Example usage of FIT Encoder
 * This demonstrates how to programmatically edit FIT files
 */

import { encodeFitFile, validateFitData } from './fitEncoder';
import { decodeFitFile } from './fitParser';
import * as vscode from 'vscode';

/**
 * Example: Adjust all heart rate values by a multiplier
 */
export async function adjustHeartRate(
    fileUri: vscode.Uri, 
    multiplier: number
): Promise<void> {
    // Read the FIT file
    const fileData = await vscode.workspace.fs.readFile(fileUri);
    
    // Decode
    const messages = await decodeFitFile(fileData);
    
    // Edit record messages
    if (messages.recordMesgs && Array.isArray(messages.recordMesgs)) {
        messages.recordMesgs.forEach((record: any) => {
            if (record.heartRate && typeof record.heartRate === 'number') {
                record.heartRate = Math.round(record.heartRate * multiplier);
            }
        });
    }
    
    // Validate
    const validation = validateFitData(messages);
    if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    // Encode
    const encodedData = await encodeFitFile(messages);
    
    // Save
    const newUri = vscode.Uri.file(fileUri.fsPath.replace('.fit', '.modified.fit'));
    await vscode.workspace.fs.writeFile(newUri, encodedData);
    
    console.log(`✅ Saved modified file to: ${newUri.fsPath}`);
}

/**
 * Example: Remove all power data
 */
export async function removePowerData(
    fileUri: vscode.Uri
): Promise<void> {
    const fileData = await vscode.workspace.fs.readFile(fileUri);
    const messages = await decodeFitFile(fileData);
    
    if (messages.recordMesgs && Array.isArray(messages.recordMesgs)) {
        messages.recordMesgs.forEach((record: any) => {
            delete record.power;
        });
    }
    
    const validation = validateFitData(messages);
    if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    const encodedData = await encodeFitFile(messages);
    await vscode.workspace.fs.writeFile(fileUri, encodedData);
    
    console.log('✅ Power data removed and file saved');
}

/**
 * Example: Change activity type
 */
export async function changeActivityType(
    fileUri: vscode.Uri,
    newSport: string,
    newSubSport?: string
): Promise<void> {
    const fileData = await vscode.workspace.fs.readFile(fileUri);
    const messages = await decodeFitFile(fileData);
    
    // Update session messages
    if (messages.sessionMesgs && Array.isArray(messages.sessionMesgs)) {
        messages.sessionMesgs.forEach((session: any) => {
            session.sport = newSport;
            if (newSubSport) {
                session.subSport = newSubSport;
            }
        });
    }
    
    // Update lap messages
    if (messages.lapMesgs && Array.isArray(messages.lapMesgs)) {
        messages.lapMesgs.forEach((lap: any) => {
            lap.sport = newSport;
            if (newSubSport) {
                lap.subSport = newSubSport;
            }
        });
    }
    
    const validation = validateFitData(messages);
    if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    const encodedData = await encodeFitFile(messages);
    await vscode.workspace.fs.writeFile(fileUri, encodedData);
    
    console.log(`✅ Activity type changed to: ${newSport}/${newSubSport || 'generic'}`);
}

/**
 * Example: Export statistics about a FIT file
 */
export async function exportStatistics(fileUri: vscode.Uri): Promise<any> {
    const fileData = await vscode.workspace.fs.readFile(fileUri);
    const messages = await decodeFitFile(fileData);
    
    const stats: any = {
        fileType: messages.fileIdMesgs?.[0]?.type || 'unknown',
        manufacturer: messages.fileIdMesgs?.[0]?.manufacturer || 'unknown',
        product: messages.fileIdMesgs?.[0]?.product || 'unknown',
        recordCount: messages.recordMesgs?.length || 0,
        lapCount: messages.lapMesgs?.length || 0,
        sessionCount: messages.sessionMesgs?.length || 0,
    };
    
    if (messages.recordMesgs && messages.recordMesgs.length > 0) {
        const records = messages.recordMesgs;
        const startTime = records[0].timestamp;
        const endTime = records[records.length - 1].timestamp;
        
        stats.duration = endTime - startTime;
        stats.startTime = new Date(startTime);
        stats.endTime = new Date(endTime);
        
        // Calculate average heart rate
        const heartRates = records
            .map((r: any) => r.heartRate)
            .filter((hr: any) => hr != null && typeof hr === 'number');
        
        if (heartRates.length > 0) {
            stats.avgHeartRate = Math.round(
                heartRates.reduce((a: number, b: number) => a + b, 0) / heartRates.length
            );
        }
        
        // Calculate max heart rate
        if (heartRates.length > 0) {
            stats.maxHeartRate = Math.max(...heartRates);
        }
    }
    
    return stats;
}
