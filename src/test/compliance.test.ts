import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const forbiddenPatterns = [
  {
    pattern: /fetchPriority=/g,
    message: 'Use "fetchpriority" (lowercase) instead of "fetchPriority" to avoid React warnings.'
  }
];

function walkDir(dir: string, callback: (filePath: string) => void) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        walkDir(filePath, callback);
      }
    } else if (/\.(tsx|ts|js|jsx)$/.test(file)) {
      callback(filePath);
    }
  }
}

describe('Codebase Compliance', () => {
  it('should not contain forbidden prop patterns', () => {
    const errors: string[] = [];
    const srcDir = path.resolve(__dirname, '..');

    walkDir(srcDir, (filePath) => {
      if (filePath === __filename) return;
      const content = fs.readFileSync(filePath, 'utf8');
      forbiddenPatterns.forEach(({ pattern, message }) => {
        if (pattern.test(content)) {
          const relativePath = path.relative(srcDir, filePath);
          errors.push(`${relativePath}: ${message}`);
        }
      });
    });

    if (errors.length > 0) {
      throw new Error(`Compliance violations found:\n${errors.join('\n')}`);
    }
    
    expect(errors.length).toBe(0);
  });
});
