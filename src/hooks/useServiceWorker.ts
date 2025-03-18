/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useEffect } from "react";
// Ensure this is only imported at runtime!
import { registerSW } from "virtual:pwa-register";

export default function useServiceWorker() {
  useEffect(() => {
    // noinspection JSUnusedGlobalSymbols
    const updateSW = registerSW({
      onNeedRefresh() {
        if (confirm("New content is available. Reload?")) {
          location.reload();
        }
      },
      onOfflineReady() {
        console.log("App is ready for offline use.");
      },
    });
    return () => updateSW();
  }, []);
}
