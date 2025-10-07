import * as vscode from 'vscode';

/**
 * Represents an edit made to a FIT file
 */
interface FitEdit {
    table: string;      // e.g., 'recordMesgs'
    row: number;        // index in the array
    field: string;      // field name
    oldValue: any;      // previous value
    newValue: any;      // new value
}

/**
 * Custom document for FIT files with undo/redo support
 */
export class FitDocument implements vscode.CustomDocument {
    private _edits: FitEdit[] = [];
    private _savedEdits: FitEdit[] = [];

    constructor(
        public readonly uri: vscode.Uri,
        public readonly initialData: any,
        private readonly _onDidChange: vscode.EventEmitter<vscode.CustomDocumentEditEvent<FitDocument>>,
        private readonly _onDidChangeContent: vscode.EventEmitter<void>
    ) {}

    /**
     * Get the current state of the data with all edits applied
     */
    get currentData(): any {
        return this.applyEdits(this.initialData, this._edits);
    }

    /**
     * Check if the document has unsaved changes
     */
    get isDirty(): boolean {
        return this._edits.length !== this._savedEdits.length ||
            !this.editsAreEqual(this._edits, this._savedEdits);
    }

    /**
     * Apply an array of edits to the data
     */
    private applyEdits(data: any, edits: FitEdit[]): any {
        // Deep clone the data to avoid mutations
        const result = JSON.parse(JSON.stringify(data));
        
        // Apply each edit
        edits.forEach(edit => {
            if (result[edit.table] && 
                Array.isArray(result[edit.table]) && 
                result[edit.table][edit.row]) {
                result[edit.table][edit.row][edit.field] = edit.newValue;
            }
        });
        
        return result;
    }

    /**
     * Check if two edit arrays are equal
     */
    private editsAreEqual(edits1: FitEdit[], edits2: FitEdit[]): boolean {
        if (edits1.length !== edits2.length) {
            return false;
        }
        
        for (let i = 0; i < edits1.length; i++) {
            const e1 = edits1[i];
            const e2 = edits2[i];
            if (e1.table !== e2.table || 
                e1.row !== e2.row || 
                e1.field !== e2.field || 
                e1.newValue !== e2.newValue) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Make an edit to the document
     */
    public makeEdit(edit: Omit<FitEdit, 'oldValue'>): void {
        // Get the old value
        const currentData = this.currentData;
        const oldValue = currentData[edit.table]?.[edit.row]?.[edit.field];
        
        const fullEdit: FitEdit = {
            ...edit,
            oldValue
        };
        
        this._edits.push(fullEdit);
        
        // Fire the change event with undo/redo support
        this._onDidChange.fire({
            label: `Edit ${edit.field}`,
            undo: () => {
                this._edits.pop();
                this._onDidChangeContent.fire();
            },
            redo: () => {
                this._edits.push(fullEdit);
                this._onDidChangeContent.fire();
            },
            document: this
        });
        
        // Fire content change for webview updates
        this._onDidChangeContent.fire();
    }

    /**
     * Save the current state
     */
    public save(): void {
        this._savedEdits = [...this._edits];
    }

    /**
     * Revert to the last saved state
     */
    public revert(): void {
        this._edits = [...this._savedEdits];
        this._onDidChangeContent.fire();
    }

    /**
     * Dispose of the document
     */
    dispose(): void {
        // Cleanup if needed
    }
}
