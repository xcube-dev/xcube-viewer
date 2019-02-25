export const LOCAL_OFFSET = -new Date("1970-01-01T00:00:00").getTime();

export function dateTimeStringToUtcTime(dateTimeString: string): number {
    return new Date(dateTimeString).getTime();
}

export function utcTimeToLocalDateTimeString(utcTime: number) {
    return new Date(utcTime).toLocaleString();
}

export function utcTimeToLocalDateString(utcTime: number) {
    return new Date(utcTime).toLocaleDateString();
}

export function utcTimeToLocalIsoDateString(utcTime: number) {
    let isoString = new Date(utcTime + LOCAL_OFFSET).toISOString();
    const index = isoString.indexOf("T");
    if (index > 0) {
        // Should always end up here!
        isoString = isoString.substring(0, index);
    }
    return isoString;
}

export function utcTimeToLocalIsoDateTimeString(utcTime: number) {
    let isoString = new Date(utcTime + LOCAL_OFFSET).toISOString();
    if (isoString.endsWith("Z")) {
        // Should always end up here!
        isoString = isoString.substr(0, isoString.length - 1);
    }
    return isoString;
}
