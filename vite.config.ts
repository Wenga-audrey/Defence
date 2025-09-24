import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ command, mode, isSsrBuild }) => {
  const isServer = command === 'build' && isSsrBuild;
  
  // Common configuration
  const commonConfig = {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./client"),
        "@shared": path.resolve(__dirname, "./shared"),
      },
    },
  };

  // Server build configuration
  if (isServer) {
    return {
      ...commonConfig,
      build: {
        lib: {
          entry: path.resolve(__dirname, "server/node-build.ts"),
          name: "server",
          fileName: "production",
          formats: ["es"],
        },
        outDir: "dist/server",
        target: "node22",
        ssr: true,
        rollupOptions: {
          external: [
            // Node.js built-ins
            "fs", "path", "url", "http", "https", "os", "crypto",
            "stream", "util", "events", "buffer", "querystring",
            // Add other Node.js built-ins as needed
          ],
        },
      },
    };
  }

  // Client configuration
  return {
    ...commonConfig,
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
    optimizeDeps: {
      // Avoid prebundling lucide-react to prevent antivirus false positives
      exclude: ["lucide-react"],
    },
  };
});
