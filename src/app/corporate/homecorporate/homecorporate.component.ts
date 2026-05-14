import { Component, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../services/seo.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SEO_ROUTE_DEFINITIONS } from '../../services/seo-route-definitions';

declare var gtag: Function;

@HostListener('window:scroll', ['$event'])

@Component({
  selector: 'app-homecorporate',
  templateUrl: './homecorporate.component.html',
  styleUrls: ['./homecorporate.component.scss']
})
export class HomecorporateComponent implements OnInit, OnDestroy {

  private hasSentScrollEvent: boolean = false;
  private langSub?: Subscription;

  coprporateSchema: Record<string, unknown> = {};


  constructor(
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
    const seo = SEO_ROUTE_DEFINITIONS.corporate;
    const ogImage = seo.image || 'https://linkdesign.cr/assets/img/laptop-cover.jpg';

    this.seoService.setSeoData(
      t(seo.titleKey || 'CORPORATE.SEO.TITLE'),
      t(seo.descriptionKey || 'CORPORATE.SEO.DESCRIPTION'),
      t(seo.keywordsKey || 'CORPORATE.SEO.KEYWORDS'),
      {
        canonicalUrl: seo.canonicalUrl,
        image: ogImage,
        imageWidth: seo.imageWidth,
        imageHeight: seo.imageHeight,
        robots: seo.robots,
        locale: seo.locale,
        twitterSite: seo.twitterSite,
        alternate: seo.alternate
      }
    );

    this.coprporateSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://linkdesign.cr/corporate#webpage",
          "url": "https://linkdesign.cr/corporate",
          "name": t('CORPORATE.SCHEMA.PAGE_NAME'),
          "description": t('CORPORATE.SCHEMA.PAGE_DESCRIPTION'),
          "inLanguage": t('CORPORATE.SCHEMA.IN_LANGUAGE'),
          "isPartOf": {
            "@id": "https://linkdesign.cr/#website"
          },
          "about": {
            "@id": "https://linkdesign.cr/#organization"
          },
          "mainEntity": {
            "@id": "https://linkdesign.cr/corporate#portfolio"
          },
          "breadcrumb": {
            "@id": "https://linkdesign.cr/corporate#breadcrumb"
          }
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://linkdesign.cr/corporate#breadcrumb",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": t('CORPORATE.SCHEMA.BREADCRUMB_HOME'),
              "item": "https://linkdesign.cr/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": t('CORPORATE.SCHEMA.BREADCRUMB_CORPORATE'),
              "item": "https://linkdesign.cr/corporate"
            }
          ]
        },
        {
          "@type": "Service",
          "@id": "https://linkdesign.cr/corporate#landing-page",
          "name": t('CORPORATE.SCHEMA.SERVICE_LANDING_NAME'),
          "description": t('CORPORATE.SCHEMA.SERVICE_LANDING_DESCRIPTION'),
          "provider": {
            "@type": "Organization",
            "@id": "https://linkdesign.cr/#organization"
          },
          "areaServed": "Costa Rica",
          "url": "https://linkdesign.cr/corporate"
        },
        {
          "@type": "Service",
          "@id": "https://linkdesign.cr/corporate#sitio-corporativo",
          "name": t('CORPORATE.SCHEMA.SERVICE_CORPORATE_NAME'),
          "description": t('CORPORATE.SCHEMA.SERVICE_CORPORATE_DESCRIPTION'),
          "provider": {
            "@type": "Organization",
            "@id": "https://linkdesign.cr/#organization"
          },
          "areaServed": "Costa Rica",
          "url": "https://linkdesign.cr/corporate"
        },
        {
          "@type": "Service",
          "@id": "https://linkdesign.cr/corporate#ecommerce",
          "name": t('CORPORATE.SCHEMA.SERVICE_ECOMMERCE_NAME'),
          "description": t('CORPORATE.SCHEMA.SERVICE_ECOMMERCE_DESCRIPTION'),
          "provider": {
            "@type": "Organization",
            "@id": "https://linkdesign.cr/#organization"
          },
          "areaServed": "Costa Rica",
          "url": "https://linkdesign.cr/corporate"
        },
        {
          "@type": "Service",
          "@id": "https://linkdesign.cr/corporate#apps",
          "name": t('CORPORATE.SCHEMA.SERVICE_APPS_NAME'),
          "description": t('CORPORATE.SCHEMA.SERVICE_APPS_DESCRIPTION'),
          "provider": {
            "@type": "Organization",
            "@id": "https://linkdesign.cr/#organization"
          },
          "areaServed": "Costa Rica",
          "url": "https://linkdesign.cr/corporate"
        }
      ]
    };
  }



  handleWhatsappClick(event: MouseEvent, isPhone: boolean) {
    if (isPlatformBrowser(this.platformId)) {
      var prefix = isPhone ? 'api' : 'web';
      const url = `https://${prefix}.whatsapp.com/send?phone=5491171534161`;

      const callback = () => {
        window.open(url, '_blank'); // Redirige al enlace de WhatsApp después del evento de conversión
      };

      // Llama a la función de conversión de Google Ads
      gtag('event', 'conversion', {
        'send_to': 'AW-16767245191/qSMFCN2ek-YZEIe3n7s-',
        'value': 5, // Puedes enviar un valor específico si lo deseas
        'currency': 'USD', // Opcional: si quieres asignar un valor a esta conversión
        'event_callback': callback
      });

      // En caso de que `gtag` sea asíncrono y la redirección deba ser inmediata
      //setTimeout(callback, 1000);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.hasSentScrollEvent) {
        return; // Ya se ha enviado el evento
      }

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      // Verifica si el usuario ha hecho scroll al menos un 50% de la página (puedes ajustar el porcentaje)
      if ((scrollTop + windowHeight) / fullHeight >= 0.5) {
        this.sendScrollConversion();
        this.hasSentScrollEvent = true; // Marca que el evento ya se ha enviado
      }
    }
  }

  // Enviar evento de conversión
  private sendScrollConversion() {
    gtag('event', 'conversion', {
      'send_to': 'AW-16767245191/qZoeCOfls-oZEIe3n7s-',
      'value': 1,
      'currency': 'USD' // Opcional: si quieres asignar un valor a esta conversión
    });
  }

  quoteElement() {
    if (isPlatformBrowser(this.platformId)) {
      // @ts-ignore
      document.getElementById("quote").scrollIntoView();
    }
  }

  sectionDesarrollo() {
    if (isPlatformBrowser(this.platformId)) {
      // @ts-ignore
      document.getElementById("desarrollo").scrollIntoView();
    }
  }

  sectionDiseno() {
    if (isPlatformBrowser(this.platformId)) {
      // @ts-ignore
      document.getElementById("diseno").scrollIntoView();
    }
  }

  sectionExperiencia() {
    if (isPlatformBrowser(this.platformId)) {
      // @ts-ignore
      document.getElementById("experiencia").scrollIntoView();
    }
  }



}
