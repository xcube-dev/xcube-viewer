export class DeveloperError extends Error {
}

export function assertTrue(condition: any, message: string) {
    if (!condition) {
        throw new DeveloperError(`assertion failed: ${message}`);
    }
}

export function assertNotNull(object: any, objectName: string) {
    if (object === null) {
        throw new DeveloperError(`assertion failed: ${objectName} must not be null`);
    }
}

export function assertDefined(object: any, objectName: string) {
    if (typeof object === "undefined") {
        throw new DeveloperError(`assertion failed: ${objectName} must not be undefined`);
    }
}

export function assertDefinedAndNotNull(object: any, objectName: string) {
    assertNotNull(object, objectName);
    assertDefined(object, objectName);
}

export function assertArray(array: any, arrayName: string) {
    if (!Array.isArray(array)) {
        throw new DeveloperError(`assertion failed: ${arrayName} must be an array`);
    }
}

export function assertArrayNotEmpty(array: any, arrayName: string) {
    assertArray(array, arrayName);
    if (array.length === 0) {
        throw new DeveloperError(`assertion failed: ${arrayName} must be a non-empty array`);
    }
}
