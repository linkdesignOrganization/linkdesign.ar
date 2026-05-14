const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const angularPath = path.join(root, 'angular.json');
const outputPath = path.join(root, 'src', 'sitemap.xml');
const baseUrl = 'https://linkdesign.cr';

const angularJson = JSON.parse(fs.readFileSync(angularPath, 'utf8'));
const routes = angularJson?.projects?.linkdesignweb?.architect?.prerender?.options?.routes || [];

if (!Array.isArray(routes) || routes.length === 0) {
  throw new Error('No prerender routes found in angular.json.');
}

const routeMeta = {
  '/': { changefreq: 'yearly', priority: '1.0' },
  '/corporate': { changefreq: 'monthly', priority: '0.9' },
  '/weblab': { changefreq: 'monthly', priority: '0.9' },
  '/software': { changefreq: 'monthly', priority: '0.9' },
  '/contact': { changefreq: 'yearly', priority: '0.6' },
  '/politicas-de-privacidad': { changefreq: 'yearly', priority: '0.3' }
};

const routeMedia = {
  '/': {
    images: [
      {
        loc: `${baseUrl}/assets/img/section3.webp`,
        title: 'LINK DESIGN home visual'
      }
    ]
  },
  '/corporate': {
    images: [
      {
        loc: `${baseUrl}/assets/img/laptop-cover.webp`,
        title: 'LINK DESIGN corporate showcase'
      }
    ]
  },
  '/weblab': {
    images: [
      {
        loc: `${baseUrl}/assets/img/section2.webp`,
        title: 'LINK DESIGN weblab visual'
      }
    ],
    videos: [
      {
        title: 'LINK DESIGN weblab reel',
        description: 'Showcase reel for LINK DESIGN Weblab services.',
        thumbnailLoc: `${baseUrl}/assets/img/section3.webp`,
        contentLoc: `${baseUrl}/assets/videos/bg-codding.mp4`
      }
    ]
  },
  '/software': {
    images: [
      {
        loc: `${baseUrl}/assets/img/hero.webp`,
        title: 'LINK DESIGN software hero'
      }
    ],
    videos: [
      {
        title: 'LINK DESIGN software capabilities',
        description: 'Overview video for LINK DESIGN software services.',
        thumbnailLoc: `${baseUrl}/assets/img/hero.webp`,
        contentLoc: `${baseUrl}/assets/videos/video-small.mp4`
      }
    ]
  },
  '/contact': {
    images: [
      {
        loc: `${baseUrl}/assets/img/favicons/1200x630opengraph.png`,
        title: 'LINK DESIGN contact graphic'
      }
    ]
  }
};

const sharedFiles = [
  'src/assets/i18n/es.json',
  'src/assets/i18n/en.json'
];

const routeFiles = {
  '/': [
    'src/index.html',
    'src/app/splithome/splithome.component.ts',
    'src/app/splithome/splithome.component.html',
    'src/app/splithome/splithome.component.scss'
  ],
  '/corporate': [
    'src/app/corporate/homecorporate/homecorporate.component.ts',
    'src/app/corporate/homecorporate/homecorporate.component.html',
    'src/app/corporate/homecorporate/homecorporate.component.scss',
    'src/app/corporate/portfoliocorp/portfoliocorp.component.ts',
    'src/app/corporate/portfoliocorp/portfoliocorp.component.html',
    'src/app/corporate/portfoliocorp/portfoliocorp.component.scss'
  ],
  '/weblab': [
    'src/app/weblab/homeweblab/homeweblab.component.ts',
    'src/app/weblab/homeweblab/homeweblab.component.html',
    'src/app/weblab/homeweblab/homeweblab.component.scss'
  ],
  '/software': [
    'src/app/software/software.component.ts',
    'src/app/software/software.component.html',
    'src/app/software/software.component.scss'
  ],
  '/contact': [
    'src/app/contact-page/contact-page.component.ts',
    'src/app/contact-page/contact-page.component.html',
    'src/app/contact-page/contact-page.component.scss'
  ],
  '/politicas-de-privacidad': [
    'src/app/politicas-de-privacidad/politicas-de-privacidad.component.ts',
    'src/app/politicas-de-privacidad/politicas-de-privacidad.component.html',
    'src/app/politicas-de-privacidad/politicas-de-privacidad.component.scss'
  ]
};

function toLoc(route) {
  if (route === '/') {
    return `${baseUrl}/`;
  }
  return `${baseUrl}${route}`;
}

function getFileMtimeMs(filePath) {
  const abs = path.join(root, filePath);
  if (!fs.existsSync(abs)) {
    return 0;
  }
  return fs.statSync(abs).mtimeMs;
}

function getLastmod(route) {
  const files = [...(routeFiles[route] || []), ...sharedFiles];
  const maxMtime = files.reduce((max, filePath) => {
    const mtime = getFileMtimeMs(filePath);
    return mtime > max ? mtime : max;
  }, 0);

  const finalDate = maxMtime > 0 ? new Date(maxMtime) : new Date();
  return finalDate.toISOString();
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const entries = routes.map((route) => {
  const meta = routeMeta[route] || { changefreq: 'monthly', priority: '0.5' };
  const lastmod = getLastmod(route);
  const media = routeMedia[route] || {};
  const imageNodes = (media.images || []).map((image) => [
    '    <image:image>',
    `      <image:loc>${escapeXml(image.loc)}</image:loc>`,
    `      <image:title>${escapeXml(image.title)}</image:title>`,
    '    </image:image>'
  ].join('\n')).join('\n');
  const videoNodes = (media.videos || []).map((video) => [
    '    <video:video>',
    `      <video:thumbnail_loc>${escapeXml(video.thumbnailLoc)}</video:thumbnail_loc>`,
    `      <video:title>${escapeXml(video.title)}</video:title>`,
    `      <video:description>${escapeXml(video.description)}</video:description>`,
    `      <video:content_loc>${escapeXml(video.contentLoc)}</video:content_loc>`,
    '    </video:video>'
  ].join('\n')).join('\n');
  const mediaNodes = [imageNodes, videoNodes].filter(Boolean).join('\n');

  return [
    '  <url>',
    `    <loc>${toLoc(route)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${meta.changefreq}</changefreq>`,
    `    <priority>${meta.priority}</priority>`,
    mediaNodes,
    '  </url>'
  ].filter(Boolean).join('\n');
});

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset',
  '      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '      xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"',
  '      xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"',
  '      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
  '      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9',
  '            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">',
  ...entries,
  '</urlset>',
  ''
].join('\n');

fs.writeFileSync(outputPath, xml, 'utf8');
console.log(`Sitemap generated at ${outputPath}`);
