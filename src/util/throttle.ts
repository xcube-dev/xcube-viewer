/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { isNumber } from "@/util/types";

export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T,
  delay?: number,
): T {
  return isNumber(delay) && delay > 0
    ? throttleWithDelay(callback, delay)
    : throttleWithRAF(callback);
}

function throttleWithDelay<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T,
  delay: number,
): T {
  let lastExecutionTime = 0;
  let lastResult: ReturnType<T>;
  return ((...args: Parameters<T>) => {
    const currentTime = Date.now();
    if (lastExecutionTime === 0 || currentTime - lastExecutionTime >= delay) {
      lastResult = callback(...args);
      lastExecutionTime = currentTime;
    }
    return lastResult;
  }) as T;
}

function throttleWithRAF<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T,
): T {
  let isThrottled = false;
  return ((...args: Parameters<T>) => {
    if (!isThrottled) {
      isThrottled = true;
      requestAnimationFrame(() => {
        callback(...args);
        isThrottled = false;
      });
    }
  }) as T;
}
