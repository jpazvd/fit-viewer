import * as vscode from 'vscode';
import { decodeFitFile } from './fitParser';
import { encodeFitFile, validateFitData, validatePhysiologyFields } from './fitEncoder';
import { parseMessages } from './parseMessages';
import { FitDocument } from './fitDocument';
import * as path from 'path';
import * as fs from 'fs';

export class FitFileEditorProvider implements vscode.CustomEditorProvider<FitDocument> {

    private readonly _onDidChangeCustomDocument = new vscode.EventEmitter<vscode.CustomDocumentEditEvent<FitDocument>>();
    public readonly onDidChangeCustomDocument = this._onDidChangeCustomDocument.event;

    private readonly _onDidChangeContent = new vscode.EventEmitter<void>();
    
    // Recovery mode for corrupted/incomplete files
    private recoveryMode: boolean = false;

    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        console.log("Registering FitFileEditorProvider with EDIT support...");
        return vscode.window.registerCustomEditorProvider(
            FitFileEditorProvider.viewType,
            new FitFileEditorProvider(context),
            {
                webviewOptions: {
                    retainContextWhenHidden: true
                },
                supportsMultipleEditorsPerDocument: false
            }
        );
    }

    private static readonly viewType = 'fitViewer.fitEditor';

    constructor(private readonly context: vscode.ExtensionContext) {
        console.log("FitFileEditorProvider constructor called...");
    }

    public async openCustomDocument(
        uri: vscode.Uri,
        _openContext: vscode.CustomDocumentOpenContext,
        _token: vscode.CancellationToken
    ): Promise<FitDocument> {
        console.log("Opening FIT file:", uri.fsPath);
        
        const workspaceFs = vscode.workspace.fs;
        const fileData = await workspaceFs.readFile(uri);
        const rawMessages = await decodeFitFile(fileData);
        
        return new FitDocument(
            uri,
            rawMessages,
            this._onDidChangeCustomDocument,
            this._onDidChangeContent
        );
    }

    public async resolveCustomEditor(
        document: FitDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        console.log("Resolving custom editor for:", document.uri.fsPath);
        webviewPanel.webview.options = { enableScripts: true };

        const tables = await parseMessages(document.currentData);

        // Construct path to the HTML file that was copied to out/media/
        const htmlPath = path.join(this.context.extensionPath, 'out', 'media', 'webview.html');
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');

        webviewPanel.webview.html = htmlContent;

        // Listen for content changes to update the webview
        this._onDidChangeContent.event(() => {
            this.updateWebview(document, webviewPanel);
        });

        // Listen for messages from the webview
        webviewPanel.webview.onDidReceiveMessage(async message => {
            switch (message.type) {
                case "ready":
                    // Send initial data with editing enabled
                    webviewPanel.webview.postMessage({ 
                        type: "fitData", 
                        data: tables,
                        editable: true,
                        recoveryMode: this.recoveryMode
                    });
                    break;
                    
                case "edit":
                    // Handle edit from webview
                    console.log("📝 Edit received:", message.edit);
                    document.makeEdit(message.edit);
                    break;
                    
                case "save":
                    // Trigger save
                    await this.saveCustomDocument(document, _token);
                    webviewPanel.webview.postMessage({ type: "saved" });
                    break;

                case "export":
                    // Export to JSON
                    await this.exportToJson(document);
                    break;

                case "toggleRecoveryMode":
                    // Toggle recovery mode
                    this.recoveryMode = !this.recoveryMode;
                    console.log(`🔧 Recovery mode ${this.recoveryMode ? 'ENABLED' : 'DISABLED'}`);
                    webviewPanel.webview.postMessage({ 
                        type: "recoveryModeChanged", 
                        enabled: this.recoveryMode 
                    });
                    vscode.window.showInformationMessage(
                        `Recovery Mode ${this.recoveryMode ? 'Enabled' : 'Disabled'}: ${
                            this.recoveryMode ? 
                            'Can edit critical fields (FILE_ID, SESSION, ACTIVITY, DEVICE_INFO)' : 
                            'Standard editing mode - only safe fields editable'
                        }`
                    );
                    break;

                case "checkPhysiology":
                    // Run physiology validation
                    const physiologyCheck = validatePhysiologyFields(document.currentData);
                    webviewPanel.webview.postMessage({
                        type: "physiologyCheckResults",
                        results: physiologyCheck
                    });
                    break;
            }
        });
    }

    private async updateWebview(document: FitDocument, webviewPanel: vscode.WebviewPanel): Promise<void> {
        const tables = await parseMessages(document.currentData);
        webviewPanel.webview.postMessage({ 
            type: "update", 
            data: tables,
            isDirty: document.isDirty
        });
    }

    public async saveCustomDocument(
        document: FitDocument,
        cancellation: vscode.CancellationToken
    ): Promise<void> {
        console.log("💾 Saving FIT file:", document.uri.fsPath);
        
        // Validate data before saving
        const validation = validateFitData(document.currentData, this.recoveryMode);
        if (!validation.valid) {
            const errorMessage = `Cannot save FIT file:\n${validation.errors.join('\n')}`;
            vscode.window.showErrorMessage(errorMessage);
            throw new Error(errorMessage);
        }
        
        // Run physiology check if in recovery mode
        if (this.recoveryMode) {
            const physiologyCheck = validatePhysiologyFields(document.currentData);
            if (physiologyCheck.warnings.length > 0 || physiologyCheck.suggestions.length > 0) {
                const showDetails = await vscode.window.showWarningMessage(
                    `⚠️ Physiology Engine Check: ${physiologyCheck.warnings.length} warnings, ${physiologyCheck.suggestions.length} suggestions`,
                    'Show Details',
                    'Continue Anyway',
                    'Cancel'
                );
                
                if (showDetails === 'Show Details') {
                    const details = [
                        '⚠️ WARNINGS:',
                        ...physiologyCheck.warnings.map(w => `  • ${w}`),
                        '',
                        '💡 SUGGESTIONS:',
                        ...physiologyCheck.suggestions.map(s => `  • ${s}`)
                    ].join('\n');
                    
                    const proceed = await vscode.window.showInformationMessage(
                        details,
                        { modal: true },
                        'Continue Save',
                        'Cancel'
                    );
                    
                    if (proceed !== 'Continue Save') {
                        return;
                    }
                } else if (showDetails === 'Cancel') {
                    return;
                }
            }
        }
        
        // Ask user if they want to create a backup
        const createBackup = await vscode.window.showQuickPick(
            ['Yes', 'No'],
            {
                placeHolder: 'Create a backup of the original file?',
                title: `Save FIT File ${this.recoveryMode ? '(Recovery Mode)' : ''}`
            }
        );
        
        if (createBackup === 'Yes') {
            try {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
                const backupPath = document.uri.fsPath.replace(/\.fit$/i, `.backup-${timestamp}.fit`);
                const originalData = await vscode.workspace.fs.readFile(document.uri);
                await vscode.workspace.fs.writeFile(
                    vscode.Uri.file(backupPath),
                    originalData
                );
                console.log(`📦 Backup created: ${backupPath}`);
            } catch (error) {
                console.error("Failed to create backup:", error);
                vscode.window.showWarningMessage("Failed to create backup, but will proceed with save.");
            }
        }
        
        try {
            // Encode back to FIT format
            const encodedData = await encodeFitFile(document.currentData);
            
            // Write to file
            await vscode.workspace.fs.writeFile(document.uri, encodedData);
            
            // Mark as saved
            document.save();
            
            const successMessage = this.recoveryMode ? 
                '✅ FIT file saved successfully (Recovery Mode)! Ready for Garmin physiology processing.' : 
                '✅ FIT file saved successfully!';
            vscode.window.showInformationMessage(successMessage);
        } catch (error) {
            const errorMessage = `Failed to save FIT file: ${error instanceof Error ? error.message : String(error)}`;
            vscode.window.showErrorMessage(errorMessage);
            throw error;
        }
    }

    public async saveCustomDocumentAs(
        document: FitDocument,
        destination: vscode.Uri,
        cancellation: vscode.CancellationToken
    ): Promise<void> {
        console.log("💾 Saving FIT file as:", destination.fsPath);
        
        const validation = validateFitData(document.currentData, this.recoveryMode);
        if (!validation.valid) {
            throw new Error(`Cannot save: ${validation.errors.join(', ')}`);
        }
        
        const encodedData = await encodeFitFile(document.currentData);
        await vscode.workspace.fs.writeFile(destination, encodedData);
        
        vscode.window.showInformationMessage(`✅ FIT file saved to ${destination.fsPath}`);
    }

    public async revertCustomDocument(
        document: FitDocument,
        cancellation: vscode.CancellationToken
    ): Promise<void> {
        console.log("↩️ Reverting FIT file changes");
        document.revert();
        vscode.window.showInformationMessage('Changes reverted');
    }

    public async backupCustomDocument(
        document: FitDocument,
        context: vscode.CustomDocumentBackupContext,
        cancellation: vscode.CancellationToken
    ): Promise<vscode.CustomDocumentBackup> {
        // Backup for crash recovery
        const encodedData = await encodeFitFile(document.currentData);
        await vscode.workspace.fs.writeFile(context.destination, encodedData);
        
        return {
            id: context.destination.toString(),
            delete: async () => {
                try {
                    await vscode.workspace.fs.delete(context.destination);
                } catch {
                    // Ignore deletion errors
                }
            }
        };
    }

    private async exportToJson(document: FitDocument): Promise<void> {
        const jsonData = JSON.stringify(document.currentData, null, 2);
        const jsonPath = document.uri.fsPath.replace(/\.fit$/i, '.json');
        
        const encoder = new TextEncoder();
        await vscode.workspace.fs.writeFile(
            vscode.Uri.file(jsonPath),
            encoder.encode(jsonData)
        );
        
        vscode.window.showInformationMessage(`✅ Exported to ${jsonPath}`);
        
        // Optionally open the JSON file
        const openFile = await vscode.window.showQuickPick(['Yes', 'No'], {
            placeHolder: 'Open the exported JSON file?'
        });
        
        if (openFile === 'Yes') {
            const doc = await vscode.workspace.openTextDocument(jsonPath);
            await vscode.window.showTextDocument(doc);
        }
    }
}