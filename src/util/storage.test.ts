/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import { resetApplicationData } from "./storage";

describe("resetApplicationData", () => {
  afterEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    vi.unstubAllGlobals();
  });

  it("clears browser storage, caches, and service-worker registrations", async () => {
    const deleteCache = vi.fn().mockResolvedValue(true);
    const unregister = vi.fn().mockResolvedValue(true);
    vi.stubGlobal("caches", {
      keys: vi.fn().mockResolvedValue(["viewer-cache"]),
      delete: deleteCache,
    });
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: {
        getRegistrations: vi.fn().mockResolvedValue([{ unregister }]),
      },
    });
    window.localStorage.setItem("setting", "value");
    window.sessionStorage.setItem("session", "value");

    await resetApplicationData();

    expect(window.localStorage.length).toBe(0);
    expect(window.sessionStorage.length).toBe(0);
    expect(deleteCache).toHaveBeenCalledWith("viewer-cache");
    expect(unregister).toHaveBeenCalledOnce();
  });
});
