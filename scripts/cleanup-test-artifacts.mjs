import { execFile } from "node:child_process";
import { readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const GENERATED_DIRECTORIES = ["playwright-report", "test-results", "coverage"];
const GENERATED_FILE_PREFIXES = [".codex"];

const isInsideRoot = (root, target) => {
  const relative = path.relative(root, target);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
};

const git = (root, args) =>
  new Promise((resolve) => {
    execFile("git", args, { cwd: root }, (error, stdout) => {
      resolve({ ok: !error, stdout });
    });
  });

const isGitRepository = async (root) => {
  const result = await git(root, ["rev-parse", "--is-inside-work-tree"]);
  return result.ok && result.stdout.trim() === "true";
};

const isTrackedByGit = async (root, target) => {
  const relativePath = path.relative(root, target);
  const result = await git(root, ["ls-files", "--error-unmatch", "--", relativePath]);
  return result.ok;
};

const hasTrackedGitFiles = async (root, target) => {
  const relativePath = path.relative(root, target);
  const result = await git(root, ["ls-files", "--", relativePath]);
  return result.ok && result.stdout.trim().length > 0;
};

export const cleanupTestArtifacts = async (root = process.cwd()) => {
  const workspaceRoot = path.resolve(root);
  const removed = [];
  const canCheckGit = await isGitRepository(workspaceRoot);

  for (const directory of GENERATED_DIRECTORIES) {
    const target = path.resolve(workspaceRoot, directory);

    if (!isInsideRoot(workspaceRoot, target)) continue;
    if (canCheckGit && (await hasTrackedGitFiles(workspaceRoot, target))) continue;

    await rm(target, { force: true, recursive: true });
    removed.push(directory);
  }

  const entries = await readdir(workspaceRoot, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!GENERATED_FILE_PREFIXES.some((prefix) => entry.name.startsWith(prefix))) continue;

    const target = path.resolve(workspaceRoot, entry.name);
    if (!isInsideRoot(workspaceRoot, target)) continue;
    if (canCheckGit && (await isTrackedByGit(workspaceRoot, target))) continue;

    await rm(target, { force: true });
    removed.push(entry.name);
  }

  return removed;
};

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  cleanupTestArtifacts()
    .then((removed) => {
      if (removed.length > 0) {
        console.log(`Cleaned test artifacts: ${removed.join(", ")}`);
      }
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
