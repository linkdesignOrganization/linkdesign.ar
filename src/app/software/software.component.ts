import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, AfterViewInit, ElementRef, HostListener, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SeoService } from '../services/seo.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { I18nService } from '../services/i18n.service';
import { SEO_ROUTE_DEFINITIONS } from '../services/seo-route-definitions';
import { initDeferredVideoObserver } from '../shared/deferred-video';

declare var gtag: Function;

type HeroThreeModule = typeof import('three');
type HeroVantaFactory = typeof import('vanta/dist/vanta.globe.min').default;
type HeroVantaEffect = import('vanta/dist/vanta.globe.min').VantaEffectInstance;
type HeroVantaOptions = import('vanta/dist/vanta.globe.min').VantaGlobeOptions;
type HeroArtifactProfile = 'desktop' | 'mobile';
type HeroArtifactMode = HeroArtifactProfile | 'fallback';

interface HeroArtifactDependencies {
  globeFactory: HeroVantaFactory;
  threeModule: HeroThreeModule;
}

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.scss']
})
export class SoftwareComponent implements OnInit, AfterViewInit, OnDestroy {
  private static readonly HERO_DESKTOP_QUERY = '(min-width: 1036px) and (hover: hover) and (pointer: fine)';
  private static readonly HERO_MOBILE_QUERY = '(max-width: 1035px)';
  private static readonly REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
  private static readonly HERO_BACKGROUND_COLOR = 0xf0f0f0;
  private static readonly HERO_PRIMARY_COLOR = 0x6728ff;
  private static readonly HERO_SECONDARY_COLOR = 0x4d1fe6;
  private static readonly HERO_DESKTOP_FALLBACK_SRC = 'assets/img/software-hero-vanta-fallback-desktop.svg';
  private static readonly HERO_MOBILE_FALLBACK_SRC = 'assets/img/software-hero-vanta-fallback-mobile.svg';

  @ViewChild('heroArtifactRef') private heroArtifactRef?: ElementRef<HTMLElement>;
  @ViewChild('heroWrapperRef') private heroWrapperRef?: ElementRef<HTMLElement>;

  private langSub?: Subscription;
  private cardObserver?: IntersectionObserver;
  private cardRatios = new Map<HTMLElement, number>();
  private activeCard?: HTMLElement;
  private cardEls: HTMLElement[] = [];
  private mobileQuery?: MediaQueryList;
  private mobileQueryHandler?: () => void;
  private deferredVideoCleanup?: () => void;
  private heroEffect?: HeroVantaEffect;
  private heroResizeObserver?: ResizeObserver;
  private activeHeroProfile?: HeroArtifactProfile;
  private heroRefreshFrame?: number;
  private heroInitAttempt = 0;
  softwareSchema: Record<string, unknown> = {};
  private hasSentScrollEvent: boolean = false;

  /** Feedback visual del botón de copiar email. Se resetea solo después de ~2s. */
  emailCopied = false;
  heroFallbackDesktopSrc = SoftwareComponent.HERO_DESKTOP_FALLBACK_SRC;
  heroFallbackMobileSrc = SoftwareComponent.HERO_MOBILE_FALLBACK_SRC;
  showHeroFallback = true;
  isHeroArtifactActive = false;
  private emailCopyResetTimer?: any;
  private readonly emailAddress = 'hola@linkdesign.cr';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private host: ElementRef<HTMLElement>,
    private seoService: SeoService,
    private translate: TranslateService,
    public i18n: I18nService
  ) { }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.deferredVideoCleanup = initDeferredVideoObserver(this.host.nativeElement);
      this.initMobileCardObserver();
      this.initHeroResizeObserver();
      this.queueHeroArtifactRefresh();
    }
  }


  ngOnInit(): void {
    this.scrollToTop();
    this.applyTranslations();
    this.langSub = this.translate.onLangChange.subscribe(() => this.applyTranslations());
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
    this.teardownMobileCardObserver();
    this.deferredVideoCleanup?.();
    this.teardownHeroResizeObserver();
    this.teardownHeroArtifact(false);
    if (isPlatformBrowser(this.platformId) && this.heroRefreshFrame) {
      window.cancelAnimationFrame(this.heroRefreshFrame);
      this.heroRefreshFrame = undefined;
    }
    if (this.emailCopyResetTimer) {
      clearTimeout(this.emailCopyResetTimer);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Copiar correo al portapapeles (con feedback visual + conversion tracking)
  // ──────────────────────────────────────────────────────────────────────────

  copyEmail(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!isPlatformBrowser(this.platformId)) return;

    const onSuccess = () => {
      this.emailCopied = true;
      if (this.emailCopyResetTimer) clearTimeout(this.emailCopyResetTimer);
      this.emailCopyResetTimer = setTimeout(() => {
        this.emailCopied = false;
      }, 2000);
      // Reutilizamos el evento de conversión existente
      this.handleEmailCopy();
    };

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(this.emailAddress)
        .then(onSuccess)
        .catch(() => this.copyWithFallback(this.emailAddress, onSuccess));
    } else {
      this.copyWithFallback(this.emailAddress, onSuccess);
    }
  }

  /**
   * Fallback con document.execCommand para browsers viejos o contextos no seguros.
   */
  private copyWithFallback(text: string, onSuccess: () => void): void {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, text.length);
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (ok) {
        onSuccess();
      }
    } catch {
      /* sin clipboard disponible — ignorar silenciosamente */
    }
  }

  private applyTranslations() {
    const t = (key: string) => this.translate.instant(key);
    const seo = SEO_ROUTE_DEFINITIONS.software;
    const pageUrl = 'https://linkdesign.cr/software';
    const inLanguage = t('SOFTWARE.SCHEMA.IN_LANGUAGE');
    const ogImage = seo.image || 'https://linkdesign.cr/assets/img/hero.png';
    const primaryImageUrl = 'https://linkdesign.cr/assets/img/hero.webp';
    const primaryVideoUrl = 'https://linkdesign.cr/assets/videos/video-small.mp4';
    const primaryVideoThumbnail = 'https://linkdesign.cr/assets/img/hero.webp';
    const serviceArea = {
      "@type": "Country",
      "name": "Costa Rica"
    };
    const faqEntries = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => ({
      "@type": "Question",
      "name": t(`SOFTWARE.PAGE_COPY.FAQ.Q${item}`),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": t(`SOFTWARE.PAGE_COPY.FAQ.A${item}`)
      }
    }));

    this.seoService.setSeoData(
      t(seo.titleKey || 'SOFTWARE.SEO.TITLE'),
      t(seo.descriptionKey || 'SOFTWARE.SEO.DESCRIPTION'),
      t(seo.keywordsKey || 'SOFTWARE.SEO.KEYWORDS'),
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

    this.softwareSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${pageUrl}#webpage`,
          "url": pageUrl,
          "name": t('SOFTWARE.SCHEMA.PAGE_NAME'),
          "description": t('SOFTWARE.SCHEMA.PAGE_DESCRIPTION'),
          "inLanguage": inLanguage,
          "isPartOf": {
            "@id": "https://linkdesign.cr/#website"
          },
          "about": {
            "@id": "https://linkdesign.cr/#organization"
          },
          "breadcrumb": {
            "@id": `${pageUrl}#breadcrumb`
          },
          "primaryImageOfPage": {
            "@id": `${pageUrl}#primaryimage`
          },
          "subjectOf": {
            "@id": `${pageUrl}#primaryvideo`
          },
          "mainEntity": {
            "@id": `${pageUrl}#faq`
          }
        },
        {
          "@type": "ImageObject",
          "@id": `${pageUrl}#primaryimage`,
          "url": primaryImageUrl,
          "contentUrl": primaryImageUrl,
          "width": 1210,
          "height": 1300,
          "caption": t('SOFTWARE.ALT.HERO_IMAGE')
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${pageUrl}#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": t('SOFTWARE.SCHEMA.BREADCRUMB_HOME'),
              "item": "https://linkdesign.cr/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": t('SOFTWARE.SCHEMA.BREADCRUMB_SOFTWARE'),
              "item": pageUrl
            }
          ]
        },
        {
          "@type": "Service",
          "@id": `${pageUrl}#software-medida`,
          "url": pageUrl,
          "name": t('SOFTWARE.SCHEMA.SERVICE_CUSTOM_NAME'),
          "serviceType": t('SOFTWARE.SCHEMA.SERVICE_CUSTOM_NAME'),
          "description": t('SOFTWARE.SCHEMA.SERVICE_CUSTOM_DESCRIPTION'),
          "provider": {
            "@type": "Organization",
            "@id": "https://linkdesign.cr/#organization"
          },
          "areaServed": serviceArea
        },
        {
          "@type": "Service",
          "@id": `${pageUrl}#apps-internas`,
          "url": pageUrl,
          "name": t('SOFTWARE.SCHEMA.SERVICE_INTERNAL_APPS_NAME'),
          "serviceType": t('SOFTWARE.SCHEMA.SERVICE_INTERNAL_APPS_NAME'),
          "description": t('SOFTWARE.SCHEMA.SERVICE_INTERNAL_APPS_DESCRIPTION'),
          "provider": {
            "@type": "Organization",
            "@id": "https://linkdesign.cr/#organization"
          },
          "areaServed": serviceArea
        },
        {
          "@type": "Service",
          "@id": `${pageUrl}#implementacion-tecnologias`,
          "url": pageUrl,
          "name": t('SOFTWARE.SCHEMA.SERVICE_TECH_IMPLEMENTATION_NAME'),
          "serviceType": t('SOFTWARE.SCHEMA.SERVICE_TECH_IMPLEMENTATION_NAME'),
          "description": t('SOFTWARE.SCHEMA.SERVICE_TECH_IMPLEMENTATION_DESCRIPTION'),
          "provider": {
            "@type": "Organization",
            "@id": "https://linkdesign.cr/#organization"
          },
          "areaServed": serviceArea
        },
        {
          "@type": "Service",
          "@id": `${pageUrl}#implementacion-ia`,
          "url": pageUrl,
          "name": t('SOFTWARE.SCHEMA.SERVICE_AI_NAME'),
          "serviceType": t('SOFTWARE.SCHEMA.SERVICE_AI_NAME'),
          "description": t('SOFTWARE.SCHEMA.SERVICE_AI_DESCRIPTION'),
          "provider": {
            "@type": "Organization",
            "@id": "https://linkdesign.cr/#organization"
          },
          "areaServed": serviceArea
        },
        {
          "@type": "VideoObject",
          "@id": `${pageUrl}#primaryvideo`,
          "name": t('SOFTWARE.SCHEMA.SERVICE_CUSTOM_NAME'),
          "description": t('SOFTWARE.SCHEMA.PAGE_DESCRIPTION'),
          "thumbnailUrl": [primaryVideoThumbnail],
          "contentUrl": primaryVideoUrl,
          "embedUrl": pageUrl,
          "uploadDate": "2026-02-26",
          "inLanguage": inLanguage,
          "publisher": {
            "@id": "https://linkdesign.cr/#organization"
          }
        },
        {
          "@type": "FAQPage",
          "@id": `${pageUrl}#faq`,
          "url": `${pageUrl}#faq`,
          "inLanguage": inLanguage,
          "mainEntity": faqEntries
        }
      ]
    };
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

  @HostListener('window:resize')
  onWindowResize(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.queueHeroArtifactRefresh();
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

  handleContactWhatsappClick(event: MouseEvent, isPhone: boolean): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const prefix = isPhone ? 'api' : 'web';
    const message = this.translate.instant('SOFTWARE.PAGE_COPY.CONTACT.WHATSAPP_PRESET_MESSAGE');
    const encodedMessage = encodeURIComponent(message);
    const url = `https://${prefix}.whatsapp.com/send?phone=50672325943&text=${encodedMessage}`;

    let hasOpened = false;
    const callback = () => {
      if (hasOpened) {
        return;
      }
      hasOpened = true;
      window.open(url, '_blank');
    };

    if (typeof gtag === 'function') {
      gtag('event', 'conversion', {
        'send_to': 'AW-16767245191/qSMFCN2ek-YZEIe3n7s-',
        'value': 5,
        'event_callback': callback
      });
      setTimeout(callback, 1000);
      return;
    }

    callback();
  }

  handleCalendarClick(event: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

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

    if (typeof gtag === 'function') {
      gtag('event', 'conversion', {
        'send_to': 'AW-16767245191/qSMFCN2ek-YZEIe3n7s-',
        'value': 30,
        'currency': 'USD',
        'event_callback': callback
      });
      setTimeout(callback, 1000);
      return;
    }

    callback();
  }

  private scrollToTop() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  private queueHeroArtifactRefresh(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.heroRefreshFrame) {
      window.cancelAnimationFrame(this.heroRefreshFrame);
    }

    this.heroRefreshFrame = window.requestAnimationFrame(() => {
      this.heroRefreshFrame = undefined;
      void this.refreshHeroArtifact();
    });
  }

  private initHeroResizeObserver(): void {
    if (!isPlatformBrowser(this.platformId)
      || typeof ResizeObserver === 'undefined'
      || !this.heroWrapperRef?.nativeElement) {
      return;
    }

    this.teardownHeroResizeObserver();

    let lastWidth = 0;
    let lastHeight = 0;
    this.heroResizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      const width = Math.round(entry.contentRect.width);
      const height = Math.round(entry.contentRect.height);
      if (width === lastWidth && height === lastHeight) {
        return;
      }

      lastWidth = width;
      lastHeight = height;
      this.queueHeroArtifactRefresh();
    });

    this.heroResizeObserver.observe(this.heroWrapperRef.nativeElement);
  }

  private teardownHeroResizeObserver(): void {
    this.heroResizeObserver?.disconnect();
    this.heroResizeObserver = undefined;
  }

  private async refreshHeroArtifact(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const nextMode = this.selectHeroArtifactMode();
    if (nextMode === 'fallback') {
      this.heroInitAttempt += 1;
      this.activeHeroProfile = undefined;
      this.teardownHeroArtifact(true);
      return;
    }

    if (this.heroEffect && this.activeHeroProfile === nextMode) {
      this.isHeroArtifactActive = true;
      this.showHeroFallback = false;
      this.heroEffect.resize();
      return;
    }

    await this.initHeroArtifact(nextMode);
  }

  private selectHeroArtifactMode(): HeroArtifactMode {
    if (!this.heroArtifactRef?.nativeElement
      || this.matchesMediaQuery(SoftwareComponent.REDUCED_MOTION_QUERY)
      || !this.supportsHeroWebGl()) {
      return 'fallback';
    }

    if (this.matchesMediaQuery(SoftwareComponent.HERO_DESKTOP_QUERY)) {
      return 'desktop';
    }

    if (this.matchesMediaQuery(SoftwareComponent.HERO_MOBILE_QUERY)) {
      return 'mobile';
    }

    return 'fallback';
  }

  private matchesMediaQuery(query: string): boolean {
    if (!isPlatformBrowser(this.platformId) || typeof window.matchMedia !== 'function') {
      return false;
    }

    return window.matchMedia(query).matches;
  }

  private supportsHeroWebGl(): boolean {
    if (!isPlatformBrowser(this.platformId) || typeof window.WebGLRenderingContext === 'undefined') {
      return false;
    }

    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  }

  private async initHeroArtifact(profile: HeroArtifactProfile): Promise<void> {
    if (!this.heroArtifactRef?.nativeElement) {
      this.showHeroFallback = true;
      this.isHeroArtifactActive = false;
      return;
    }

    const attempt = ++this.heroInitAttempt;

    try {
      const { globeFactory, threeModule } = await this.loadHeroDependencies();
      if (attempt !== this.heroInitAttempt || this.selectHeroArtifactMode() !== profile) {
        return;
      }

      this.teardownHeroArtifact(false);
      this.heroArtifactRef.nativeElement.innerHTML = '';
      const effect = globeFactory(this.createHeroArtifactOptions(profile, threeModule));

      if (!effect) {
        this.showHeroFallback = true;
        this.isHeroArtifactActive = false;
        return;
      }

      if (attempt !== this.heroInitAttempt || this.selectHeroArtifactMode() !== profile) {
        effect.destroy();
        return;
      }

      this.heroEffect = effect;
      this.activeHeroProfile = profile;
      this.isHeroArtifactActive = true;
      this.showHeroFallback = false;
      this.heroEffect.resize();
    } catch {
      this.showHeroFallback = true;
      this.isHeroArtifactActive = false;
      this.teardownHeroArtifact(true);
    }
  }

  private createHeroArtifactOptions(profile: HeroArtifactProfile, threeModule: HeroThreeModule): HeroVantaOptions {
    const baseOptions: HeroVantaOptions = {
      el: this.heroArtifactRef!.nativeElement,
      THREE: threeModule,
      backgroundAlpha: 1,
      backgroundColor: SoftwareComponent.HERO_BACKGROUND_COLOR,
      color: SoftwareComponent.HERO_PRIMARY_COLOR,
      color2: SoftwareComponent.HERO_SECONDARY_COLOR,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      showDots: false
    };

    if (profile === 'desktop') {
      return {
        ...baseOptions,
        maxDistance: 20,
        mouseControls: true,
        points: 10,
        scale: 1,
        scaleMobile: 1,
        size: 0.9,
        spacing: 15,
        touchControls: false
      };
    }

    return {
      ...baseOptions,
      maxDistance: 18,
      mouseControls: false,
      points: 7,
      scale: 0.98,
      scaleMobile: 0.9,
      size: 0.74,
      spacing: 16,
      touchControls: false
    };
  }

  private async loadHeroDependencies(): Promise<HeroArtifactDependencies> {
    const [{ default: globeFactory }, threeModule] = await Promise.all([
      import('vanta/dist/vanta.globe.min'),
      import('three')
    ]);

    return { globeFactory, threeModule };
  }

  private teardownHeroArtifact(showFallback: boolean): void {
    if (this.heroEffect) {
      this.heroEffect.destroy();
      this.heroEffect = undefined;
    }

    this.activeHeroProfile = undefined;
    this.isHeroArtifactActive = false;
    if (showFallback) {
      this.showHeroFallback = true;
    }
  }

  setLang(lang: 'es' | 'en', event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.i18n.use(lang);
  }

  scrollToSection(selector: string, event?: Event) {
    if (event) {
      event.preventDefault();
    }

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const target = document.querySelector<HTMLElement>(selector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  private initMobileCardObserver() {
    if (typeof window === 'undefined') {
      return;
    }

    this.cardEls = Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>('.card-hover'));
    if (this.cardEls.length === 0) {
      return;
    }

    this.mobileQuery = window.matchMedia('(max-width: 1000px)');
    const apply = () => {
      if (this.mobileQuery?.matches) {
        this.enableCardObserver();
      } else {
        this.disableCardObserver();
      }
    };

    apply();

    if (this.mobileQuery.addEventListener) {
      this.mobileQuery.addEventListener('change', apply);
    } else {
      this.mobileQuery.addListener(apply);
    }

    this.mobileQueryHandler = apply;
  }

  private teardownMobileCardObserver() {
    if (this.mobileQuery && this.mobileQueryHandler) {
      if (this.mobileQuery.removeEventListener) {
        this.mobileQuery.removeEventListener('change', this.mobileQueryHandler);
      } else {
        this.mobileQuery.removeListener(this.mobileQueryHandler);
      }
    }

    this.disableCardObserver();
    this.mobileQuery = undefined;
    this.mobileQueryHandler = undefined;
  }

  private enableCardObserver() {
    if (this.cardObserver) {
      return;
    }

    this.cardRatios.clear();
    this.cardObserver = new IntersectionObserver(this.handleCardIntersect, {
      root: null,
      rootMargin: '-30% 0px -30% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    this.cardEls.forEach(el => this.cardObserver?.observe(el));
  }

  private disableCardObserver() {
    if (!this.cardObserver) {
      return;
    }

    this.cardObserver.disconnect();
    this.cardObserver = undefined;
    this.cardRatios.clear();

    if (this.activeCard) {
      this.activeCard.classList.remove('is-active');
      this.activeCard = undefined;
    }
  }

  private handleCardIntersect = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      const el = entry.target as HTMLElement;
      if (entry.isIntersecting) {
        this.cardRatios.set(el, entry.intersectionRatio);
      } else {
        this.cardRatios.delete(el);
      }
    });

    let nextActive: HTMLElement | undefined;
    let bestRatio = 0;
    this.cardRatios.forEach((ratio, el) => {
      if (ratio > bestRatio) {
        bestRatio = ratio;
        nextActive = el;
      }
    });

    if (nextActive !== this.activeCard) {
      if (this.activeCard) {
        this.activeCard.classList.remove('is-active');
      }
      if (nextActive) {
        nextActive.classList.add('is-active');
      }
      this.activeCard = nextActive;
    }
  };
}
