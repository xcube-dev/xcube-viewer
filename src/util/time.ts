
const REF_TIME_STRING = "1970-01-01T00:00:00.000";
const LOCAL_UTC_DELTA = new Date(REF_TIME_STRING).getTime() - new Date(REF_TIME_STRING + "Z").getTime();

export function localToUtcTime(localTime: number): number {
    return localTime - LOCAL_UTC_DELTA;
}

export function utcToLocalTime(utcTime: number): number {
    return utcTime + LOCAL_UTC_DELTA;
}

export function formatUtcToLocal(utcTimeString: string): string {
    const utcTime = new Date(utcTimeString).getTime();
    const localDate = new Date(localToUtcTime(utcTime));
    const localTimeString = localDate.toISOString();
    if (localTimeString.endsWith("Z")) {
        return localTimeString.substr(0, localTimeString.length - 1);
    }
    return localTimeString;
}

export function formatLocalToUtc(localTimeString: string): string {
    const localTime = new Date(localTimeString).getTime();
    const utcDate = new Date(localToUtcTime(localTime));
    return utcDate.toISOString();
}


export function formatUtcTimeToLocal(utcTime: number): string | null {
    let isoString = new Date(utcToLocalTime(utcTime)).toISOString();
    let i = isoString.indexOf('T');
    return isoString.substring(0, i);
}
