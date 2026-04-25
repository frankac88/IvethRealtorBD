import { spawn } from "node:child_process";
import path from "node:path";

import { cleanupTestArtifacts } from "./cleanup-test-artifacts.mjs";

const runVitest = () =>
  new Promise((resolve) => {
    const vitestPath = path.resolve("node_modules", "vitest", "vitest.mjs");
    const child = spawn(process.execPath, [vitestPath, "run", ...process.argv.slice(2)], {
      stdio: "inherit",
    });

    child.on("close", (code) => resolve(code ?? 1));
    child.on("error", () => resolve(1));
  });

const exitCode = await runVitest();
await cleanupTestArtifacts();

process.exit(exitCode);
