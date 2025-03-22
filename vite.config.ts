/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  // base defaults to "/" which doesn't work for
  // the viewer build embedded in xcube server and published
  // via the "/viewer" endpoint
  base: "",
  plugins: [react()],
  optimizeDeps: {
    // Added this because I got
    // "Uncaught TypeError: styled_default is not a function", see
    // https://github.com/mui/material-ui/issues/32727
    include: ["@emotion/styled"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    // Adjust chunk size warning limit (in kbs).
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        html: "index.html",
        main: "src/index.tsx",
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["src/setupTests.ts"],
    onConsoleLog: (/*_log: string, _type: "stdout" | "stderr"*/):
      | false
      | void => {
      // return false to disable logging entirely
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: [
        "src/actions",
        "src/api",
        "src/model",
        "src/reducers",
        "src/states",
        "src/selectors",
        "src/util",
      ],
    },
  },
});
