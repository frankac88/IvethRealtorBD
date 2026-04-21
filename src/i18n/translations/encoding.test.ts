import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const sourceFiles = [
  "src/pages/Index.tsx",
  "src/pages/ProjectsPage.tsx",
];

const forbiddenPatterns = [
  "Ã",
  "Â",
  "â€™",
  "â€œ",
  "â€",
  "�",
];

describe("site copy encoding", () => {
  it("does not contain mojibake or replacement characters in key page files", () => {
    sourceFiles.forEach((file) => {
      const content = readFileSync(resolve(process.cwd(), file), "utf8");

      forbiddenPatterns.forEach((pattern) => {
        expect(content).not.toContain(pattern);
      });
    });
  });
});
