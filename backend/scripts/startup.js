#!/usr/bin/env node

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

console.log("🚀 Starting Mindboost Backend...");

// Function to run a command and return a promise
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: true,
      cwd: projectRoot,
      ...options,
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on("error", (error) => {
      reject(error);
    });
  });
}

async function startup() {
  try {
    console.log("📦 Generating Prisma client...");
    await runCommand("npx", ["prisma", "generate"]);

    console.log("🗄️ Running database migrations...");
    await runCommand("npx", ["prisma", "migrate", "deploy"]);

    console.log("✅ Database setup complete!");
    console.log("🌟 Starting development server...");

    // Start the development server (this will keep running)
    const serverProcess = spawn("npx", ["tsx", "watch", "src/index.ts"], {
      stdio: "inherit",
      shell: true,
      cwd: projectRoot,
    });

    // Handle graceful shutdown
    process.on("SIGINT", () => {
      console.log("\n🛑 Shutting down server...");
      serverProcess.kill("SIGINT");
      process.exit(0);
    });

    process.on("SIGTERM", () => {
      console.log("\n🛑 Shutting down server...");
      serverProcess.kill("SIGTERM");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Startup failed:", error.message);
    process.exit(1);
  }
}

startup();
