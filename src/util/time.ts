export const LOCAL_OFFSET = -new Date("1970-01-01T00:00:00").getTime();

export function dateTimeStringToUtcTime(dateTimeString: string): number {
    return new Date(dateTimeString).getTime();
}

export function utcTimeToIsoDateString(utcTime: number, local: boolean = false) {
    return new Date(utcTime + (local ? LOCAL_OFFSET : 0))
        .toISOString()
        .substr(0, 10);
}

export function utcTimeToIsoDateTimeString(utcTime: number, local: boolean = false, skipSeconds: boolean = false) {
    return new Date(utcTime + (local ? LOCAL_OFFSET : 0))
        .toISOString()
        .substr(0, skipSeconds ? 16 : 19)
        .replace("T", " ");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
// The use of the following functions has been discontinued as an intermediate step towards issue #133.

/*

export function utcTimeToLocalTimeString(utcTime: number) {
    return new Date(utcTime).toLocaleTimeString();
}

export function utcTimeToLocalDateTimeString(utcTime: number) {
    return new Date(utcTime).toLocaleString();
}

export function utcTimeToLocalDateString(utcTime: number) {
    return new Date(utcTime).toLocaleDateString();
}

export function utcTimeToDateString(utcTime: number) {
    return new Date(utcTime).toISOString().substr(0, 10);
}

export function utcTimeToLocalIsoDateString(utcTime: number) {
    return utcTimeToIsoDateString(utcTime, true);
}

export function utcTimeToLocalIsoDateTimeString(utcTime: number, skipSeconds?: boolean) {
    return utcTimeToIsoDateTimeString(utcTime, true, skipSeconds);
}

*/

//
////////////////////////////////////////////////////////////////////////////////////////////////////////
