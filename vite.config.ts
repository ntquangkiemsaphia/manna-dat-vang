import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    allowedHosts: ["vuakiem.com"],
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    target: "es2020",
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          // Gom toàn bộ react / react-dom (gồm react-dom/client) / react-router vào 1 chunk
          if (
            id.includes("/react-dom/") ||
            id.includes("/react/") ||
            id.includes("/react-router/") ||
            id.includes("/react-router-dom/") ||
            id.includes("/scheduler/")
          ) {
            return "react-vendor";
          }
          if (
            id.includes("@tanstack/react-query") ||
            id.includes("@tanstack/query-core")
          ) {
            return "query";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
}));
