export interface Storage {
    getItem: (key: string) => string;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
    clear: () => void;
    length: number;
}

export function getLocalStorage(): Storage | null {
    return getStorage("localStorage");
}

export function getSessionStorage(): Storage | null {
    return getStorage("sessionStorage");
}

function getStorage(type: "localStorage" | "sessionStorage"): Storage | null {
    try {
        const storage = window[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return storage as Storage;
    } catch (e) {
        return null;
    }
}
