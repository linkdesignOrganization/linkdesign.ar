const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const distRoot = path.join(root, 'dist', 'linkdesignweb', 'browser');

const routes = [
  '/',
  '/corporate',
  '/weblab',
  '/software',
  '/contact',
  '/politicas-de-privacidad'
];

const expectedTypesByRoute = {
  '/': ['Organization', 'WebSite', 'WebPage', 'BreadcrumbList', 'ImageObject'],
  '/corporate': ['Organization', 'WebSite', 'WebPage', 'BreadcrumbList', 'Service', 'ItemList'],
  '/weblab': ['Organization', 'WebSite', 'WebPage', 'BreadcrumbList', 'Service', 'ImageObject', 'VideoObject'],
  '/software': ['Organization', 'WebSite', 'WebPage', 'BreadcrumbList', 'Service', 'FAQPage', 'ImageObject', 'VideoObject'],
  '/contact': ['Organization', 'WebSite', 'ContactPage', 'BreadcrumbList', 'ContactPoint', 'ProfessionalService'],
  '/politicas-de-privacidad': ['Organization', 'WebSite']
};

function getHtmlPath(route) {
  if (route === '/') {
    return path.join(distRoot, 'index.html');
  }
  return path.join(distRoot, route.replace(/^\//, ''), 'index.html');
}

function extractJsonLdBlocks(html) {
  const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const blocks = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    blocks.push(match[1].trim());
  }
  return blocks;
}

function collectTypesFromBlock(parsed) {
  const types = new Set();

  if (Array.isArray(parsed)) {
    parsed.forEach((entry) => {
      if (entry && entry['@type']) {
        types.add(entry['@type']);
      }
    });
    return types;
  }

  if (parsed && parsed['@graph'] && Array.isArray(parsed['@graph'])) {
    parsed['@graph'].forEach((entry) => {
      if (entry && entry['@type']) {
        types.add(entry['@type']);
      }
    });
  }

  if (parsed && parsed['@type']) {
    types.add(parsed['@type']);
  }

  return types;
}

const failures = [];

for (const route of routes) {
  const htmlPath = getHtmlPath(route);

  if (!fs.existsSync(htmlPath)) {
    failures.push(`${route}: missing prerendered HTML at ${htmlPath}`);
    continue;
  }

  const html = fs.readFileSync(htmlPath, 'utf8');
  const blocks = extractJsonLdBlocks(html);

  if (blocks.length === 0) {
    failures.push(`${route}: no JSON-LD blocks found`);
    continue;
  }

  const routeTypes = new Set();

  blocks.forEach((block, index) => {
    try {
      const parsed = JSON.parse(block);
      const types = collectTypesFromBlock(parsed);
      types.forEach((type) => routeTypes.add(type));
    } catch (error) {
      failures.push(`${route}: block ${index + 1} JSON parse error (${error.message})`);
    }
  });

  const expectedTypes = expectedTypesByRoute[route] || [];
  const missingTypes = expectedTypes.filter((type) => !routeTypes.has(type));
  if (missingTypes.length > 0) {
    failures.push(`${route}: missing expected types: ${missingTypes.join(', ')}`);
  }

  console.log(`${route} -> JSON-LD blocks: ${blocks.length} | types: ${Array.from(routeTypes).sort().join(', ')}`);
}

if (failures.length > 0) {
  console.error('\nJSON-LD validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('\nJSON-LD validation passed.');
