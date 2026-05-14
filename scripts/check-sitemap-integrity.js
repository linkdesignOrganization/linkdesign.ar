const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const angularPath = path.join(root, 'angular.json');
const sitemapPath = path.join(root, 'src', 'sitemap.xml');
const distRoot = path.join(root, 'dist', 'linkdesignweb', 'browser');
const baseUrl = 'https://linkdesign.cr';

const angularJson = JSON.parse(fs.readFileSync(angularPath, 'utf8'));
const prerenderRoutes = angularJson?.projects?.linkdesignweb?.architect?.prerender?.options?.routes || [];
const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const sitemapRoutes = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g))
  .map((match) => match[1].trim())
  .filter((url) => url.startsWith(baseUrl))
  .map((url) => {
    const route = url.replace(baseUrl, '') || '/';
    return route.endsWith('/') && route !== '/' ? route.slice(0, -1) : route;
  });

const failures = [];

prerenderRoutes.forEach((route) => {
  if (!sitemapRoutes.includes(route)) {
    failures.push(`Route ${route} exists in prerender config but missing in sitemap`);
  }

  const htmlPath = route === '/'
    ? path.join(distRoot, 'index.html')
    : path.join(distRoot, route.slice(1), 'index.html');
  if (!fs.existsSync(htmlPath)) {
    failures.push(`Route ${route} missing prerendered output (${htmlPath})`);
  }
});

sitemapRoutes.forEach((route) => {
  if (!prerenderRoutes.includes(route)) {
    failures.push(`Route ${route} exists in sitemap but missing in prerender config`);
  }
});

if (failures.length > 0) {
  console.error('Sitemap integrity validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Sitemap integrity validation passed.');
