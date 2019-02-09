export interface SessionState {
    selectedDatasetId: string | null;
}

export function newSessionState() {
    return {
        selectedDatasetId: null,
    };
}