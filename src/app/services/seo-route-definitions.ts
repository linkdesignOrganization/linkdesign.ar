export interface SeoAlternateLink {
  hreflang: string;
  href: string;
}

export interface RouteSeoDefinition {
  canonicalUrl: string;
  titleKey?: string;
  descriptionKey?: string;
  keywordsKey?: string;
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  type?: string;
  robots?: string;
  locale?: string;
  twitterSite?: string;
  alternate?: SeoAlternateLink[];
}

export type SeoRouteDefinitionKey =
  | 'home'
  | 'corporate'
  | 'weblab'
  | 'software'
  | 'contact'
  | 'privacy'
  | 'notFound';

export const SEO_ROUTE_DEFINITIONS: Record<SeoRouteDefinitionKey, RouteSeoDefinition> = {
  home: {
    canonicalUrl: 'https://linkdesign.cr/',
    titleKey: 'SPLITHOME.SEO.TITLE',
    descriptionKey: 'SPLITHOME.SEO.DESCRIPTION',
    keywordsKey: 'SPLITHOME.SEO.KEYWORDS',
    image: 'https://linkdesign.cr/assets/img/section3.png',
    imageWidth: 2379,
    imageHeight: 2418,
    locale: 'es_CR',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  },
  corporate: {
    canonicalUrl: 'https://linkdesign.cr/corporate',
    titleKey: 'CORPORATE.SEO.TITLE',
    descriptionKey: 'CORPORATE.SEO.DESCRIPTION',
    keywordsKey: 'CORPORATE.SEO.KEYWORDS',
    image: 'https://linkdesign.cr/assets/img/laptop-cover.jpg',
    imageWidth: 1800,
    imageHeight: 1276,
    locale: 'es_CR',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  },
  weblab: {
    canonicalUrl: 'https://linkdesign.cr/weblab',
    titleKey: 'WEBLAB.SEO.TITLE',
    descriptionKey: 'WEBLAB.SEO.DESCRIPTION',
    keywordsKey: 'WEBLAB.SEO.KEYWORDS',
    image: 'https://linkdesign.cr/assets/img/section2.png',
    imageWidth: 2157,
    imageHeight: 1980,
    locale: 'es_CR',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  },
  software: {
    canonicalUrl: 'https://linkdesign.cr/software',
    titleKey: 'SOFTWARE.SEO.TITLE',
    descriptionKey: 'SOFTWARE.SEO.DESCRIPTION',
    keywordsKey: 'SOFTWARE.SEO.KEYWORDS',
    image: 'https://linkdesign.cr/assets/img/hero.png',
    imageWidth: 1210,
    imageHeight: 1300,
    locale: 'es_CR',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  },
  contact: {
    canonicalUrl: 'https://linkdesign.cr/contact',
    titleKey: 'CONTACT_PAGE.SEO.TITLE',
    descriptionKey: 'CONTACT_PAGE.SEO.DESCRIPTION',
    keywordsKey: 'CONTACT_PAGE.SEO.KEYWORDS',
    image: 'https://linkdesign.cr/assets/img/favicons/1200x630opengraph.png',
    imageWidth: 1200,
    imageHeight: 630,
    locale: 'es_CR',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  },
  privacy: {
    canonicalUrl: 'https://linkdesign.cr/politicas-de-privacidad',
    title: 'Política de Privacidad y Datos | LINK DESIGN Costa Rica',
    description: 'Conoce cómo recopilamos, usamos y protegemos tus datos personales en LINK DESIGN, incluyendo finalidades, derechos y medios de contacto para privacidad.',
    keywords: 'política de privacidad, protección de datos, privacidad digital, link design, costa rica',
    image: 'https://linkdesign.cr/assets/img/favicons/1200x630opengraph.png',
    imageWidth: 1200,
    imageHeight: 630,
    locale: 'es_CR',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  },
  notFound: {
    canonicalUrl: 'https://linkdesign.cr/404',
    title: 'Página no encontrada (404) | LINK DESIGN Costa Rica',
    description: 'La URL solicitada no está disponible. Volvé al inicio de LINK DESIGN para continuar navegando nuestros servicios.',
    keywords: '404, página no encontrada, enlace roto, link design',
    robots: 'noindex, nofollow',
    locale: 'es_CR'
  }
};
