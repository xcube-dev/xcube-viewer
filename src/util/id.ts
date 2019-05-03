export function newId(): string {
    return (Math.random().toString(16).substr(2) + '-' + Date.now().toString(16)).toUpperCase();
}
