import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../environments/environment';
import { SeoAlternateLink } from './seo-route-definitions';

interface SeoDataOptions {
    image?: string;
    type?: string;
    imageAlt?: string;
    canonicalUrl?: string;
    imageWidth?: number;
    imageHeight?: number;
    robots?: string;
    locale?: string;
    twitterSite?: string;
    alternate?: SeoAlternateLink[];
}

@Injectable({
    providedIn: 'root'
})
export class SeoService {
    private readonly siteOrigin = this.normalizeOrigin(environment.siteUrl) || 'https://linkdesign.cr';

    constructor(
        private title: Title,
        private meta: Meta,
        @Inject(DOCUMENT) private doc: Document
    ) { }

    setSeoData(
        title: string,
        description: string,
        keywords: string,
        options: SeoDataOptions = {}
    ) {
        const image = options.image || 'https://linkdesign.cr/assets/img/favicons/1200x630opengraph.png';
        const type = options.type || 'website';
        const imageAlt = options.imageAlt || '';
        const imageWidth = options.imageWidth ?? 1200;
        const imageHeight = options.imageHeight ?? 630;
        const canonicalSource = options.canonicalUrl || this.doc.URL;
        const normalizedUrl = this.normalizeUrl(canonicalSource);
        const resolvedImageAlt = imageAlt || title;
        const resolvedRobots = options.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
        const resolvedLocale = options.locale || 'es_CR';

        this.title.setTitle(title);

        this.meta.updateTag({ name: 'description', content: description });
        this.meta.updateTag({ name: 'keywords', content: keywords });
        this.meta.updateTag({ name: 'robots', content: resolvedRobots });

        // Open Graph
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ property: 'og:description', content: description });
        this.meta.updateTag({ property: 'og:image', content: image });
        this.meta.updateTag({ property: 'og:image:alt', content: resolvedImageAlt });
        this.meta.updateTag({ property: 'og:image:width', content: String(imageWidth) });
        this.meta.updateTag({ property: 'og:image:height', content: String(imageHeight) });
        this.meta.updateTag({ property: 'og:url', content: normalizedUrl });
        this.meta.updateTag({ property: 'og:type', content: type });
        this.meta.updateTag({ property: 'og:locale', content: resolvedLocale });

        // Twitter
        this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.meta.updateTag({ name: 'twitter:title', content: title });
        this.meta.updateTag({ name: 'twitter:description', content: description });
        this.meta.updateTag({ name: 'twitter:image', content: image });
        this.meta.updateTag({ name: 'twitter:image:alt', content: resolvedImageAlt });
        if (options.twitterSite) {
            this.meta.updateTag({ name: 'twitter:site', content: options.twitterSite });
        } else {
            this.meta.removeTag(`name='twitter:site'`);
        }

        this.createCanonicalLink(normalizedUrl);
        this.createAlternateLinks(options.alternate);
    }

    createCanonicalLink(url: string) {
        let link: HTMLLinkElement | null = this.doc.querySelector('link[rel="canonical"]');
        if (!link) {
            link = this.doc.createElement('link');
            link.setAttribute('rel', 'canonical');
            this.doc.head.appendChild(link);
        }
        link.setAttribute('href', url);
    }

    private createAlternateLinks(alternate?: SeoAlternateLink[]) {
        const managedSelector = 'link[rel="alternate"][data-seo-managed="true"]';
        const managedLinks = Array.from(this.doc.querySelectorAll(managedSelector));
        managedLinks.forEach((link) => link.remove());

        if (!alternate || alternate.length === 0) {
            return;
        }

        alternate.forEach((entry) => {
            const normalizedHref = this.normalizeUrl(entry.href);
            const link = this.doc.createElement('link');
            link.setAttribute('rel', 'alternate');
            link.setAttribute('hreflang', entry.hreflang);
            link.setAttribute('href', normalizedHref);
            link.setAttribute('data-seo-managed', 'true');
            this.doc.head.appendChild(link);
        });
    }

    private normalizeUrl(url: string): string {
        const sanitized = url.split('#')[0].split('?')[0];
        const toAbsolute = (value: string) => {
            if (/^https?:\/\//i.test(value)) {
                return value;
            }
            const path = value.startsWith('/') ? value : `/${value}`;
            return `${this.siteOrigin}${path}`;
        };

        try {
            const parsed = new URL(sanitized);
            const pathname = parsed.pathname === '/' ? '/' : parsed.pathname.replace(/\/+$/, '');
            const origin = parsed.origin === 'null' ? '' : parsed.origin;
            return toAbsolute(`${origin}${pathname}`);
        } catch {
            try {
                const parsed = new URL(sanitized, this.siteOrigin);
                const pathname = parsed.pathname === '/' ? '/' : parsed.pathname.replace(/\/+$/, '');
                return `${parsed.origin}${pathname}`;
            } catch {
                return this.siteOrigin;
            }
        }
    }

    private normalizeOrigin(url?: string): string | null {
        if (!url) {
            return null;
        }
        try {
            return new URL(url).origin;
        } catch {
            return url.replace(/\/+$/, '');
        }
    }
}
