const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const distRoot = path.join(root, 'dist', 'linkdesignweb', 'browser');
const baseUrl = 'https://linkdesign.cr';
const routes = [
  '/',
  '/corporate',
  '/weblab',
  '/software',
  '/contact',
  '/politicas-de-privacidad'
];

function getHtmlPath(route) {
  if (route === '/') {
    return path.join(distRoot, 'index.html');
  }
  return path.join(distRoot, route.slice(1), 'index.html');
}

function getTagContent(html, regex) {
  const match = html.match(regex);
  return match ? match[1].trim() : '';
}

const failures = [];

routes.forEach((route) => {
  const filePath = getHtmlPath(route);
  if (!fs.existsSync(filePath)) {
    failures.push(`${route}: missing prerendered HTML (${filePath})`);
    return;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  const title = getTagContent(html, /<title>([^<]+)<\/title>/i);
  const description = getTagContent(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  const canonical = getTagContent(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  const robots = getTagContent(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i);
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const jsonLdCount = (html.match(/application\/ld\+json/gi) || []).length;
  const expectedCanonical = route === '/' ? `${baseUrl}/` : `${baseUrl}${route}`;

  if (!title) {
    failures.push(`${route}: missing title`);
  }
  if (title.length < 45 || title.length > 60) {
    failures.push(`${route}: title length out of range (${title.length})`);
  }

  if (!description) {
    failures.push(`${route}: missing description`);
  }
  if (description.length < 120 || description.length > 155) {
    failures.push(`${route}: description length out of range (${description.length})`);
  }

  if (canonical !== expectedCanonical) {
    failures.push(`${route}: canonical mismatch (${canonical} !== ${expectedCanonical})`);
  }

  if (!robots || !robots.includes('index') || !robots.includes('follow')) {
    failures.push(`${route}: invalid robots tag (${robots || 'missing'})`);
  }

  if (h1Count !== 1) {
    failures.push(`${route}: expected 1 h1, found ${h1Count}`);
  }

  if (jsonLdCount < 1) {
    failures.push(`${route}: missing JSON-LD block`);
  }
});

if (failures.length > 0) {
  console.error('Meta validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Meta validation passed.');
