/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

function getTimezoneOffset(date: Date): number {
  return date.getTimezoneOffset() * 60000;
}

export function localToUtcTime(local: Date): number {
  return local.getTime() - getTimezoneOffset(local);
}

export function utcTimeToLocal(utcTime: number): Date {
  const dateTime = new Date(utcTime);
  return new Date(dateTime.getTime() + getTimezoneOffset(dateTime));
}

export function utcTimeToIsoDateString(utcTime: number) {
  return new Date(utcTime).toISOString().substring(0, 10);
}

export function utcTimeToIsoDateTimeString(utcTime: number) {
  return isoDateTimeStringToLabel(new Date(utcTime).toISOString());
}

export function isoDateTimeStringToLabel(utcDateTimeString: string) {
  return utcDateTimeString.substring(0, 19).replace("T", " ");
}
