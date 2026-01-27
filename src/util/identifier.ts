/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

const reIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
const reVariables = /[a-zA-Z_$][a-zA-Z0-9_$]*/g;

const emptySet = new Set<string>();

export function isIdentifier(value: string): boolean {
  return reIdentifier.test(value);
}

export function getIdentifiers(expression: string): Set<string> {
  const matches = expression.match(reVariables);
  return matches !== null ? new Set(matches) : emptySet;
}
