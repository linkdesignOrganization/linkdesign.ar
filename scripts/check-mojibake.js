const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const srcRoot = path.join(root, 'src');
const mojibakePattern = /Ã|Â/;
const targetExtensions = new Set(['.ts', '.html', '.json']);
const failures = [];

function walk(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  entries.forEach((entry) => {
    const absPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walk(absPath);
      return;
    }

    const extension = path.extname(entry.name);
    if (!targetExtensions.has(extension)) {
      return;
    }

    const content = fs.readFileSync(absPath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (mojibakePattern.test(line)) {
        failures.push(`${path.relative(root, absPath)}:${index + 1}`);
      }
    });
  });
}

walk(srcRoot);

if (failures.length > 0) {
  console.error('Mojibake detected in source files:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Mojibake check passed.');
