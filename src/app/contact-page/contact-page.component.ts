import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { SeoService } from '../services/seo.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SEO_ROUTE_DEFINITIONS } from '../services/seo-route-definitions';
declare var gtag: Function;

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent implements OnInit, OnDestroy {

  private langSub?: Subscription;
  contactSchema: Record<string, unknown> = {};
  private hasSentScrollEvent: boolean = false;

  constructor(
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object,
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
    const seo = SEO_ROUTE_DEFINITIONS.contact;

    this.seoService.setSeoData(
      t(seo.titleKey || 'CONTACT_PAGE.SEO.TITLE'),
      t(seo.descriptionKey || 'CONTACT_PAGE.SEO.DESCRIPTION'),
      t(seo.keywordsKey || 'CONTACT_PAGE.SEO.KEYWORDS'),
      {
        canonicalUrl: seo.canonicalUrl,
        image: seo.image,
        imageWidth: seo.imageWidth,
        imageHeight: seo.imageHeight,
        robots: seo.robots,
        locale: seo.locale,
        twitterSite: seo.twitterSite,
        alternate: seo.alternate
      }
    );

    this.contactSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ContactPage",
          "@id": "https://linkdesign.cr/contact#webpage",
          "url": "https://linkdesign.cr/contact",
          "name": t('CONTACT_PAGE.SCHEMA.PAGE_NAME'),
          "description": t('CONTACT_PAGE.SCHEMA.PAGE_DESCRIPTION'),
          "inLanguage": t('CONTACT_PAGE.SCHEMA.IN_LANGUAGE'),
          "isPartOf": {
            "@id": "https://linkdesign.cr/#website"
          },
          "about": {
            "@id": "https://linkdesign.cr/#organization"
          },
          "breadcrumb": {
            "@id": "https://linkdesign.cr/contact#breadcrumb"
          }
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://linkdesign.cr/contact#breadcrumb",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": t('CONTACT_PAGE.SCHEMA.BREADCRUMB_HOME'),
              "item": "https://linkdesign.cr/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": t('CONTACT_PAGE.SCHEMA.BREADCRUMB_CONTACT'),
              "item": "https://linkdesign.cr/contact"
            }
          ]
        },
        {
          "@type": "ContactPoint",
          "@id": "https://linkdesign.cr/contact#contactpoint",
          "telephone": "+50672325943",
          "contactType": "customer service",
          "email": "hola@linkdesign.cr",
          "areaServed": "CR",
          "availableLanguage": [
            t('CONTACT_PAGE.SCHEMA.AVAILABLE_LANGUAGE')
          ]
        },
        {
          "@type": "ProfessionalService",
          "@id": "https://linkdesign.cr/#localbusiness",
          "name": "LINK DESIGN",
          "url": "https://linkdesign.cr/",
          "image": "https://linkdesign.cr/assets/img/section3.png",
          "telephone": "+50672325943",
          "email": "hola@linkdesign.cr",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "San Jose",
            "addressRegion": "San Jose",
            "addressCountry": "Costa Rica"
          },
          "areaServed": "CR",
          "parentOrganization": {
            "@id": "https://linkdesign.cr/#organization"
          }
        }
      ]
    };
  }

  goBack(): void {
    this.location.back();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.hasSentScrollEvent) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      if ((scrollTop + windowHeight) / fullHeight >= 0.5) {
        this.sendScrollConversion();
        this.hasSentScrollEvent = true;
      }
    }
  }

  private sendScrollConversion() {
    gtag('event', 'conversion', {
      'send_to': 'AW-16767245191/qZoeCOfls-oZEIe3n7s-',
      'value': 1,
      'currency': 'USD'
    });
  }

  handleEmailCopy() {
    // Llama a la función de Google Ads para registrar la conversión
    gtag('event', 'conversion', {
      'send_to': 'AW-16767245191/qSMFCN2ek-YZEIe3n7s-',
      'value': 25,
      'currency': 'USD'
    });
  }

  handleWhatsappClick(event: MouseEvent, isPhone: boolean) {
    if (isPlatformBrowser(this.platformId)) {
      var prefix = isPhone ? 'api' : 'web';
      const url = `https://${prefix}.whatsapp.com/send?phone=50672325943`;

      const callback = () => {
        window.open(url, '_blank'); // Redirige al enlace de WhatsApp después del evento de conversión
      };

      // Llama a la función de conversión de Google Ads
      gtag('event', 'conversion', {
        'send_to': 'AW-16767245191/qSMFCN2ek-YZEIe3n7s-',
        'value': 5, // Puedes enviar un valor específico si lo deseas
        'event_callback': callback
      });

      // En caso de que `gtag` sea asíncrono y la redirección deba ser inmediata
      setTimeout(callback, 1000);
    }
  }

  handleCalendarClick(event: MouseEvent) {
    if (isPlatformBrowser(this.platformId)) {
      event.preventDefault();
      const url = 'https://calendar.app.google/ZRkWtLvfCpUSwY1XA';

      let hasOpened = false;
      const callback = () => {
        if (hasOpened) {
          return;
        }
        hasOpened = true;
        window.open(url, '_blank');
      };

      gtag('event', 'conversion', {
        'send_to': 'AW-16767245191/qSMFCN2ek-YZEIe3n7s-',
        'value': 30,
        'currency': 'USD',
        'event_callback': callback
      });

      setTimeout(callback, 1000);
    }
  }

}
