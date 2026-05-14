import { Component, OnInit, OnDestroy } from '@angular/core';
import { SeoService } from '../services/seo.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SEO_ROUTE_DEFINITIONS } from '../services/seo-route-definitions';

@Component({
  selector: 'app-splithome',
  templateUrl: './splithome.component.html',
  styleUrls: ['./splithome.component.scss']
})
export class SplithomeComponent implements OnInit, OnDestroy {

  private langSub?: Subscription;
  homeSchema: Record<string, unknown> = {};

  constructor(
    private seoService: SeoService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.applyTranslations();
    this.langSub = this.translate.onLangChange.subscribe(() => this.applyTranslations());
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  private applyTranslations() {
    const t = (key: string) => this.translate.instant(key);
    const seo = SEO_ROUTE_DEFINITIONS.home;
    const primaryImage = seo.image || 'https://linkdesign.cr/assets/img/section3.png';

    this.seoService.setSeoData(
      t(seo.titleKey || 'SPLITHOME.SEO.TITLE'),
      t(seo.descriptionKey || 'SPLITHOME.SEO.DESCRIPTION'),
      t(seo.keywordsKey || 'SPLITHOME.SEO.KEYWORDS'),
      {
        canonicalUrl: seo.canonicalUrl,
        image: primaryImage,
        imageWidth: seo.imageWidth,
        imageHeight: seo.imageHeight,
        robots: seo.robots,
        locale: seo.locale,
        twitterSite: seo.twitterSite,
        alternate: seo.alternate
      }
    );

    this.homeSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://linkdesign.cr/#webpage",
          "url": "https://linkdesign.cr/",
          "name": t('SPLITHOME.SCHEMA.PAGE_NAME'),
          "description": t('SPLITHOME.SCHEMA.PAGE_DESCRIPTION'),
          "inLanguage": t('SPLITHOME.SCHEMA.IN_LANGUAGE'),
          "isPartOf": {
            "@id": "https://linkdesign.cr/#website"
          },
          "about": {
            "@id": "https://linkdesign.cr/#organization"
          },
          "primaryImageOfPage": {
            "@id": "https://linkdesign.cr/#primaryimage"
          },
          "breadcrumb": {
            "@id": "https://linkdesign.cr/#breadcrumb"
          }
        },
        {
          "@type": "ImageObject",
          "@id": "https://linkdesign.cr/#primaryimage",
          "url": primaryImage,
          "width": 2379,
          "height": 2418
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://linkdesign.cr/#breadcrumb",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": t('SPLITHOME.SCHEMA.BREADCRUMB_HOME'),
              "item": "https://linkdesign.cr/"
            }
          ]
        }
      ]
    };
  }
}
