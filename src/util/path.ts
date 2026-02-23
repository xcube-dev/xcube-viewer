/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

/**
 * Builds a path by concatenating a base path and subsequent path components.
 * The function ensures that only single path separators are used between
 * path components.
 *
 * @param base
 * @param components
 */
export function buildPath(base: string, ...components: string[]): string {
  let path = base;
  for (const c of components) {
    if (c !== "") {
      if (path.endsWith("/")) {
        if (c.startsWith("/")) {
          path += c.substring(1);
        } else {
          path += c;
        }
      } else {
        if (c.startsWith("/")) {
          path += c;
        } else {
          path += "/" + c;
        }
      }
    }
  }
  return path;
}
