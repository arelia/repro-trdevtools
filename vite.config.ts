import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackStartVite } from "@tanstack/start/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [
    TanStackStartVite({}),
    react({
      jsxRuntime: "automatic",
    }),
  ],
  ssr: {
    // DevTools package included in SSR bundle which triggers delegateEvents() bug
    noExternal: ["@tanstack/react-router-devtools"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
