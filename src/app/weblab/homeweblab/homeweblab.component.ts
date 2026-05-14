import { Component, HostListener, OnInit, OnDestroy, Inject, PLATFORM_ID, AfterViewInit, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../services/seo.service';
import { I18nService } from '../../services/i18n.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SEO_ROUTE_DEFINITIONS } from '../../services/seo-route-definitions';
import { initDeferredVideoObserver } from '../../shared/deferred-video';
import { initScrollPanelColors } from '../../shared/scroll-panel-colors';

declare var gtag: Function;

@HostListener('window:scroll', ['$event'])

@Component({
  selector: 'app-homeweblab',
  templateUrl: './homeweblab.component.html',
  styleUrls: ['./homeweblab.component.scss']
})
export class HomeweblabComponent implements OnInit, OnDestroy, AfterViewInit {

  private hasSentScrollEvent: boolean = false;
  private langSub?: Subscription;
  private deferredVideoCleanup?: () => void;
  private scrollPanelColorsCleanup?: () => void;
  labSchema: Record<string, unknown> = {};


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private host: ElementRef<HTMLElement>,
    private seoService: SeoService,
    private translate: TranslateService,
    public i18n: I18nService
  ) { }

  ngOnInit(): void {
    this.applyTranslations();
    this.langSub = this.translate.onLangChange.subscribe(() => this.applyTranslations());

    if (isPlatformBrowser(this.platformId)) {
      this.initCustomCursor();
      this.initAos();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.deferredVideoCleanup = initDeferredVideoObserver(this.host.nativeElement);
      this.scrollPanelColorsCleanup = initScrollPanelColors(this.host.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
    this.deferredVideoCleanup?.();
    this.scrollPanelColorsCleanup?.();
  }

  private applyTranslations() {
    const t = (key: string) => this.translate.instant(key);
    const seo = SEO_ROUTE_DEFINITIONS.weblab;
    const ogImage = seo.image || 'https://linkdesign.cr/assets/img/section2.png';
    const primaryImageUrl = 'https://linkdesign.cr/assets/img/section2.webp';
    const primaryVideoUrl = 'https://linkdesign.cr/assets/videos/bg-codding.mp4';
    const primaryVideoThumbnail = 'https://linkdesign.cr/assets/img/section3.webp';

    this.seoService.setSeoData(
      t(seo.titleKey || 'WEBLAB.SEO.TITLE'),
      t(seo.descriptionKey || 'WEBLAB.SEO.DESCRIPTION'),
      t(seo.keywordsKey || 'WEBLAB.SEO.KEYWORDS'),
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

    this.labSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://linkdesign.cr/weblab#webpage",
          "url": "https://linkdesign.cr/weblab",
          "name": t('WEBLAB.SCHEMA.PAGE_NAME'),
          "description": t('WEBLAB.SCHEMA.PAGE_DESCRIPTION'),
          "inLanguage": t('WEBLAB.SCHEMA.IN_LANGUAGE'),
          "isPartOf": {
            "@id": "https://linkdesign.cr/#website"
          },
          "about": {
            "@id": "https://linkdesign.cr/#organization"
          },
          "primaryImageOfPage": {
            "@id": "https://linkdesign.cr/weblab#primaryimage"
          },
          "subjectOf": {
            "@id": "https://linkdesign.cr/weblab#primaryvideo"
          },
          "breadcrumb": {
            "@id": "https://linkdesign.cr/weblab#breadcrumb"
          }
        },
        {
          "@type": "ImageObject",
          "@id": "https://linkdesign.cr/weblab#primaryimage",
          "url": primaryImageUrl,
          "contentUrl": primaryImageUrl,
          "width": 2157,
          "height": 1980,
          "caption": t('WEBLAB.HOME.CLIENTS_ALT')
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://linkdesign.cr/weblab#breadcrumb",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": t('WEBLAB.SCHEMA.BREADCRUMB_HOME'),
              "item": "https://linkdesign.cr/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": t('WEBLAB.SCHEMA.BREADCRUMB_LAB'),
              "item": "https://linkdesign.cr/weblab"
            }
          ]
        },
        {
          "@type": "Service",
          "name": t('WEBLAB.SCHEMA.SERVICE_NAME'),
          "description": t('WEBLAB.SCHEMA.SERVICE_DESCRIPTION'),
          "provider": {
            "@type": "Organization",
            "@id": "https://linkdesign.cr/#organization"
          },
          "areaServed": "Costa Rica",
          "url": "https://linkdesign.cr/weblab"
        },
        {
          "@type": "VideoObject",
          "@id": "https://linkdesign.cr/weblab#primaryvideo",
          "name": t('WEBLAB.HOME.HOW_TITLE_LINE1'),
          "description": t('WEBLAB.SCHEMA.PAGE_DESCRIPTION'),
          "thumbnailUrl": [primaryVideoThumbnail],
          "contentUrl": primaryVideoUrl,
          "embedUrl": "https://linkdesign.cr/weblab",
          "uploadDate": "2026-02-26",
          "inLanguage": t('WEBLAB.SCHEMA.IN_LANGUAGE'),
          "publisher": {
            "@id": "https://linkdesign.cr/#organization"
          }
        }
      ]
    };
  }

  private initAos() {
    import('aos').then(({ default: AOS }) => AOS.init());
  }

  private initCustomCursor() {
    const cursor = document.querySelector<HTMLElement>('.custom-cursor');
    if (!cursor) {
      return;
    }

    const links = document.querySelectorAll<HTMLAnchorElement>('a');
    links.forEach((link) => {
      link.addEventListener('mouseenter', () => cursor.classList.add('custom-cursor--link'));
      link.addEventListener('mouseleave', () => cursor.classList.remove('custom-cursor--link'));
    });

    let initialized = false;
    window.addEventListener('mousemove', (event) => {
      if (!initialized) {
        cursor.style.opacity = '1';
        initialized = true;
      }
      cursor.style.top = `${event.clientY}px`;
      cursor.style.left = `${event.clientX}px`;
    });

    window.addEventListener('mouseout', () => {
      cursor.style.opacity = '0';
      initialized = false;
    });
  }


  goTop() {
    if (isPlatformBrowser(this.platformId)) {
      // @ts-ignore
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }

  setLang(lang: 'es' | 'en', event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.i18n.use(lang);
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

}
