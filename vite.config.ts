import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// Copies dist/index.html to dist/404.html so GitHub Pages serves the SPA
// on direct navigation / refresh of client-side routes (/submission, etc.).
const spa404Fallback = () => ({
  name: "spa-404-fallback",
  apply: "build" as const,
  closeBundle() {
    const dist = path.resolve(__dirname, "dist");
    const src = path.join(dist, "index.html");
    const dest = path.join(dist, "404.html");
    if (fs.existsSync(src)) fs.copyFileSync(src, dest);
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  // base: '/demo/',

  plugins: [
    react(),
    mode === "development" && componentTagger(),
    spa404Fallback(),
  ].filter(Boolean),
  assetsInclude: ['**/*.tex', '**/*.docx'],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
