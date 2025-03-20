/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  // base defaults to "/" which doesn't work for
  // the viewer build embedded in xcube server and published
  // via the "/viewer" endpoint
  base: "",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // Automatically updates SW on new releases
      manifest: {
        name: "xcube Viewer",
        short_name: "xc-viewer",
        description: "Data cube toolbox",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/images/logo192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/images/logo512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      devOptions: {
        enabled: true, // 👈 Allows service workers during development
      },
      workbox: {
        // the app is already 4.2 MB (way too large)
        // https://vite-pwa-org.netlify.app/guide/faq.html#missing-assets-from-sw-precache-manifest
        maximumFileSizeToCacheInBytes: 4500000,
      },
    }),
  ],
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
