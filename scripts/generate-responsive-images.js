const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const cwebp = '/opt/homebrew/bin/cwebp';
const sips = '/usr/bin/sips';

const baseEntries = [
  { input: 'src/assets/img/hero.png', widths: [480, 768, 1210] },
  { input: 'src/assets/img/laptop-cover.jpg', widths: [480, 768, 1200, 1800] },
  { input: 'src/assets/img/section2.png', widths: [768, 1200, 1600, 2157] },
  { input: 'src/assets/img/section3.png', widths: [768, 1200, 1600, 2379] },
  { input: 'src/assets/img/section3-mobile.png', widths: [480, 768, 1200, 1701] }
];

function ensureTool(toolPath, name) {
  if (!fs.existsSync(toolPath)) {
    throw new Error(`${name} not found at ${toolPath}`);
  }
}

function getImageWidth(filePath) {
  const output = execFileSync(sips, ['-g', 'pixelWidth', filePath], {
    cwd: root,
    encoding: 'utf8'
  });

  const match = output.match(/pixelWidth:\s*(\d+)/);
  if (!match) {
    throw new Error(`Unable to read width for ${filePath}`);
  }

  return Number(match[1]);
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function resizeFallback(inputPath, outputPath, width, originalWidth) {
  ensureDir(outputPath);

  if (width === originalWidth) {
    fs.copyFileSync(inputPath, outputPath);
    return;
  }

  execFileSync(sips, ['--resampleWidth', String(width), inputPath, '--out', outputPath], {
    cwd: root,
    stdio: 'ignore'
  });
}

function createWebp(inputPath, outputPath) {
  ensureDir(outputPath);
  execFileSync(cwebp, ['-quiet', '-m', '6', '-q', '78', '-mt', '-af', inputPath, '-o', outputPath], {
    cwd: root,
    stdio: 'ignore'
  });
}

function buildResponsiveVariants(entry) {
  const absoluteInput = path.join(root, entry.input);
  if (!fs.existsSync(absoluteInput)) {
    throw new Error(`Missing source image: ${entry.input}`);
  }

  const ext = path.extname(entry.input).slice(1).toLowerCase();
  const basePath = path.join(path.dirname(entry.input), path.basename(entry.input, path.extname(entry.input)));
  const originalWidth = getImageWidth(absoluteInput);
  const widths = entry.widths.filter((width) => width <= originalWidth);

  widths.forEach((width) => {
    const fallbackOutput = path.join(root, `${basePath}-${width}w.${ext}`);
    const webpOutput = path.join(root, `${basePath}-${width}w.webp`);

    resizeFallback(absoluteInput, fallbackOutput, width, originalWidth);
    createWebp(fallbackOutput, webpOutput);
  });
}

function getPortfolioEntries() {
  const portfolioDir = path.join(root, 'src/assets/img/portfolio');
  const entries = [];
  const folders = fs.readdirSync(portfolioDir, { withFileTypes: true });

  folders.forEach((folder) => {
    if (!folder.isDirectory()) {
      return;
    }

    const folderPath = path.join(portfolioDir, folder.name);
    const files = fs.readdirSync(folderPath);
    const jpg = files.find((file) => file.toLowerCase().endsWith('.jpg'));
    if (!jpg) {
      return;
    }

    entries.push({
      input: path.relative(root, path.join(folderPath, jpg)),
      widths: [480, 768, 1200, 1500]
    });
  });

  return entries;
}

function main() {
  ensureTool(sips, 'sips');
  ensureTool(cwebp, 'cwebp');

  const entries = [...baseEntries, ...getPortfolioEntries()];
  entries.forEach(buildResponsiveVariants);

  console.log(`Generated responsive variants for ${entries.length} source images.`);
}

main();
