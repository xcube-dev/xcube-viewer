/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  delay: number,
): T {
  let lastExecutionTime = 0;
  let lastResult: ReturnType<T>;
  return ((...args: Parameters<T>) => {
    const currentTime = Date.now();
    if (lastExecutionTime === 0 || currentTime - lastExecutionTime >= delay) {
      lastResult = func(...args);
      lastExecutionTime = currentTime;
    }
    return lastResult;
  }) as T;
}
