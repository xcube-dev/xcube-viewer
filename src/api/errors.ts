/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

export class HTTPError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, statusMessage: string) {
    super(statusMessage);
    this.statusCode = statusCode;
  }
}
