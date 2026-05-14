const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const appRoot = path.join(root, 'src', 'app');
const htmlFiles = [];

function walk(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  entries.forEach((entry) => {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      return;
    }
    if (entry.isFile() && fullPath.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  });
}

function hasAttribute(tag, pattern) {
  return pattern.test(tag);
}

walk(appRoot);

const failures = [];

htmlFiles.forEach((filePath) => {
  const relativePath = path.relative(root, filePath);
  const html = fs.readFileSync(filePath, 'utf8');

  const imgTags = html.match(/<img\b[^>]*>/gi) || [];
  imgTags.forEach((tag) => {
    const hasSrc = hasAttribute(tag, /\s(?:src|\[src\])=/i);
    const hasSrcset = hasAttribute(tag, /\s(?:srcset|\[srcset\]|\[attr\.srcset\])=/i);
    const hasAlt = hasAttribute(tag, /\s(?:alt|\[alt\]|\[attr\.alt\])=/i);
    const isAriaHidden = hasAttribute(tag, /\saria-hidden=["']true["']/i);
    const hasEmptyAlt = hasAttribute(tag, /\salt=["']\s*["']/i);

    if (hasSrcset && !hasSrc) {
      failures.push(`${relativePath}: img uses srcset without src -> ${tag}`);
    }

    if (!hasAlt && !isAriaHidden) {
      failures.push(`${relativePath}: img missing alt semantics -> ${tag}`);
    }

    if (hasEmptyAlt && !isAriaHidden) {
      failures.push(`${relativePath}: img has empty alt without aria-hidden -> ${tag}`);
    }
  });

  const videoBlocks = html.match(/<video\b[\s\S]*?<\/video>/gi) || [];
  videoBlocks.forEach((block) => {
    const hasPoster = /poster=/i.test(block);
    const sources = block.match(/<source\b[^>]*src=/gi) || [];

    if (!hasPoster) {
      failures.push(`${relativePath}: video missing poster -> ${block}`);
    }

    if (sources.length === 0) {
      failures.push(`${relativePath}: video missing source fallback -> ${block}`);
    }
  });
});

if (failures.length > 0) {
  console.error('Media SEO validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Media SEO validation passed for ${htmlFiles.length} templates.`);
