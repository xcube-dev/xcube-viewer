/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useEffect, useState } from "react";

export interface PromiseState<T> {
  pending?: boolean;
  error?: unknown;
  value?: T;
}

export default function usePromise<T>(promise: Promise<T>): PromiseState<T> {
  const [state, setState] = useState<PromiseState<T>>({});
  useEffect(() => {
    setState({ pending: true });
    promise
      .then((value) => {
        setState({ value });
      })
      .catch((error) => {
        setState({ error });
      });
  }, [promise]);
  return state;
}
