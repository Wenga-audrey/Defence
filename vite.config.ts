import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Pure SPA config (no Express middleware integration)
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: [
        path.resolve(__dirname, "./client"),
        path.resolve(__dirname, "./shared"),
        path.resolve(__dirname, "./node_modules"),
      ],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  optimizeDeps: {
    // Avoid prebundling lucide-react to prevent antivirus false positives on certain icon files
    exclude: ["lucide-react"],
  },
}));
