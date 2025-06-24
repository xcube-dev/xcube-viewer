/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

export class DeveloperError extends Error {}

export function assertTrue(condition: unknown, message: string) {
  if (!condition) {
    throw new DeveloperError(`assertion failed: ${message}`);
  }
}

export function assertNotNull(object: unknown, objectName: string) {
  if (object === null) {
    throw new DeveloperError(
      `assertion failed: ${objectName} must not be null`,
    );
  }
}

export function assertDefined(object: unknown, objectName: string) {
  if (typeof object === "undefined") {
    throw new DeveloperError(
      `assertion failed: ${objectName} must not be undefined`,
    );
  }
}

export function assertDefinedAndNotNull(object: unknown, objectName: string) {
  assertNotNull(object, objectName);
  assertDefined(object, objectName);
}

export function assertArray(array: unknown, arrayName: string) {
  if (!Array.isArray(array)) {
    throw new DeveloperError(`assertion failed: ${arrayName} must be an array`);
  }
}

export function assertArrayNotEmpty(array: unknown, arrayName: string) {
  if (Array.isArray(array)) {
    if (array.length === 0) {
      throw new DeveloperError(
        `assertion failed: ${arrayName} must be a non-empty array`,
      );
    }
  } else {
    throw new DeveloperError(`assertion failed: ${arrayName} must be an array`);
  }
}
