import { mkdir, mkdtemp, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { execFile } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { cleanupTestArtifacts } from "../../scripts/cleanup-test-artifacts.mjs";

const exists = async (filePath: string) => {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
};

const git = (root: string, args: string[]) =>
  new Promise<void>((resolve, reject) => {
    execFile("git", args, { cwd: root }, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

describe("cleanupTestArtifacts", () => {
  it("removes generated Codex and test artifact files from the target root", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "cleanup-test-artifacts-"));
    const codexFile = path.join(root, ".codex-navbar-check.png");
    const reportFile = path.join(root, "playwright-report", "index.html");
    const testResultFile = path.join(root, "test-results", "screenshot.png");
    const sourceFile = path.join(root, "src-file.ts");

    await writeFile(codexFile, "generated");
    await mkdir(path.dirname(reportFile), { recursive: true });
    await mkdir(path.dirname(testResultFile), { recursive: true });
    await writeFile(reportFile, "generated");
    await writeFile(testResultFile, "generated");
    await writeFile(sourceFile, "keep");

    await cleanupTestArtifacts(root);

    expect(await exists(codexFile)).toBe(false);
    expect(await exists(path.dirname(reportFile))).toBe(false);
    expect(await exists(path.dirname(testResultFile))).toBe(false);
    expect(await exists(sourceFile)).toBe(true);
  });

  it("does not remove tracked project files even when they match artifact patterns", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "cleanup-test-artifacts-git-"));
    const codexProjectFile = path.join(root, ".codex-project-reference.png");
    const testResultsProjectFile = path.join(root, "test-results", "baseline.png");

    await git(root, ["init"]);
    await mkdir(path.dirname(testResultsProjectFile), { recursive: true });
    await writeFile(codexProjectFile, "project file");
    await writeFile(testResultsProjectFile, "project file");
    await git(root, ["add", "."]);

    await cleanupTestArtifacts(root);

    expect(await exists(codexProjectFile)).toBe(true);
    expect(await exists(testResultsProjectFile)).toBe(true);
  });
});
