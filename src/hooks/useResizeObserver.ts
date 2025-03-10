/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { type MutableRefObject, useEffect, useRef } from "react";

export type Size = { width: number; height: number };

export default function useResizeObserver<T extends HTMLElement>(
  callback: (size: Size) => void,
  ref?: MutableRefObject<T | null>,
): void {
  const sizeRef = useRef<Size>();

  useEffect(() => {
    if (ref && !ref.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          const width = entry.contentRect.width;
          const height = entry.contentRect.height;
          const prevSize = sizeRef.current;
          if (
            !prevSize ||
            prevSize.width !== width ||
            prevSize.height !== height
          ) {
            const size = {
              width: width,
              height: height,
            };
            sizeRef.current = size;
            if (prevSize) {
              callback(size);
            }
          }
        }
      }
    });

    observer.observe(ref ? ref.current! : document.documentElement);

    return () => observer.disconnect();
  }, [callback, ref]);
}
