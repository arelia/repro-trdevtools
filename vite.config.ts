import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  plugins: [
    tanstackStart({
      router: {
        virtualRouteConfig: "./routes.tsx",
        routesDir: "./src/routes",
      },
    }),
    react({
      jsxRuntime: "automatic",
    }),
  ],
  ssr: {
    // DevTools package included in SSR bundle which triggers delegateEvents() bug
    noExternal: ["@tanstack/react-router-devtools"],
  },
});
