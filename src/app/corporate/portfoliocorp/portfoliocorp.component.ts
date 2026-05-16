import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import type { Options } from '@splidejs/splide';
import { ResponsiveImageAsset, buildResponsiveImageAsset } from '../../shared/responsive-media';

interface Project {
  name: string;
  cover: ResponsiveImageAsset;
  logo: ResponsiveImageAsset;
  industry: string;
  descriptionKey: string;
  link: string;
}

@Component({
  selector: 'app-portfoliocorp',
  templateUrl: './portfoliocorp.component.html',
  styleUrls: ['./portfoliocorp.component.scss']
})
export class PortfoliocorpComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('portfolioSlider') portfolioSlider?: ElementRef<HTMLElement>;

  projects: Project[] = [];
  portfolioSchema: Record<string, unknown> = {};
  private langSub?: Subscription;
  private splide?: import('@splidejs/splide').default;
  private splideCtor?: typeof import('@splidejs/splide').default;
  private mountAttempts = 0;
  private wheelLockUntil = 0;
  private removeTrackpadHandler?: () => void;
  private readonly maxMountAttempts = 8;
  private readonly coverSizes = '(min-width: 1200px) 30vw, (min-width: 768px) 46vw, 86vw';

  private readonly industriesByProject: Record<string, string> = {
    asembis: 'Salud',
    imperio: 'Alimentos',
    aaec: 'Legal',
    nano: 'Bienestar',
    cewtec: 'Tecnología',
    amag: 'Moda',
    cefsa: 'Finanzas',
    tierrafertil: 'Agroindustria',
    psicoyng: 'Salud',
    promaca: 'Alimentos',
    tupsa: 'Transporte',
    'pasto arca': 'Agroindustria',
    cimed: 'Legal',
    escritorio: 'Contabilidad',
    haus: 'Bienes raíces',
    espaciocr: 'Arquitectura',
    'punto cero': 'Mantenimiento',
    'altura raiz': 'Arquitectura',
    evoke: 'Producción audiovisual',
    'uga comediante': 'Entretenimiento',
    gonow: 'Automotriz',
    magenta: 'Branding',
    onigiri: 'Gastronomía',
    xcelerate: 'Fitness',
    owling: 'Educación'
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.loadProjects();
    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.buildPortfolioSchema();

      if (isPlatformBrowser(this.platformId)) {
        this.remountSlider();
      }
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    void this.mountSlider();
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
    this.destroySlider();
  }

  loadProjects() {
    const baseProjects: Omit<Project, 'industry'>[] = [
      {
        name: 'asembis',
        cover: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/asembis/asembis',
          fallbackExt: 'jpg',
          widths: [480, 768, 1200, 1500],
          width: 1500,
          height: 938,
          sizes: this.coverSizes
        }),
        logo: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/asembis/asembislogo',
          fallbackExt: 'svg',
          width: 300,
          height: 140,
          includeWebp: false
        }),
        descriptionKey: 'CORPORATE.PORTFOLIO.PROJECTS.ASEMBIS.DESCRIPTION',
        link: 'https://asembis.org/'
      },
      {
        name: 'Imperio',
        cover: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/imperio/imperio',
          fallbackExt: 'jpg',
          widths: [480, 768, 1200, 1500],
          width: 1500,
          height: 938,
          sizes: this.coverSizes
        }),
        logo: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/imperio/logoimperio',
          fallbackExt: 'svg',
          width: 300,
          height: 140,
          includeWebp: false
        }),
        descriptionKey: 'CORPORATE.PORTFOLIO.PROJECTS.IMPERIO.DESCRIPTION',
        link: 'https://arrozimperio.net/'
      },
      {
        name: 'aaec',
        cover: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/aaec/aaec',
          fallbackExt: 'jpg',
          widths: [480, 768, 1200, 1500],
          width: 1500,
          height: 938,
          sizes: this.coverSizes
        }),
        logo: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/aaec/logoaaec',
          fallbackExt: 'png',
          width: 300,
          height: 140,
          includeWebp: false
        }),
        descriptionKey: 'CORPORATE.PORTFOLIO.PROJECTS.AAEC.DESCRIPTION',
        link: 'https://aaec.org/'
      },
      {
        name: 'nano',
        cover: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/nano/nano',
          fallbackExt: 'jpg',
          widths: [480, 768, 1200, 1500],
          width: 1500,
          height: 938,
          sizes: this.coverSizes
        }),
        logo: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/nano/nanologo',
          fallbackExt: 'svg',
          width: 300,
          height: 140,
          includeWebp: false
        }),
        descriptionKey: 'CORPORATE.PORTFOLIO.PROJECTS.NANO.DESCRIPTION',
        link: 'https://nano.cr/'
      },
      {
        name: 'CEWTEC',
        cover: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/CEWTEC/cewtec',
          fallbackExt: 'jpg',
          widths: [480, 768, 1200, 1500],
          width: 1500,
          height: 938,
          sizes: this.coverSizes
        }),
        logo: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/CEWTEC/cewteclogo',
          fallbackExt: 'svg',
          width: 300,
          height: 140,
          includeWebp: false
        }),
        descriptionKey: 'CORPORATE.PORTFOLIO.PROJECTS.CEWTEC.DESCRIPTION',
        link: 'https://www.cewtec.com/'
      },
      {
        name: 'amag',
        cover: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/amag/amag1',
          fallbackExt: 'jpg',
          widths: [480, 768, 1200, 1500],
          width: 1500,
          height: 938,
          sizes: this.coverSizes
        }),
        logo: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/amag/amaglogo1',
          fallbackExt: 'svg',
          width: 300,
          height: 140,
          includeWebp: false
        }),
        descriptionKey: 'CORPORATE.PORTFOLIO.PROJECTS.AMAG.DESCRIPTION',
        link: 'https://amagnr.com/home/inicio'
      },
      {
        name: 'cefsa',
        cover: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/cefsa/cefsa',
          fallbackExt: 'jpg',
          widths: [480, 768, 1200, 1500],
          width: 1500,
          height: 938,
          sizes: this.coverSizes
        }),
        logo: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/cefsa/logocefsa',
          fallbackExt: 'svg',
          width: 300,
          height: 140,
          includeWebp: false
        }),
        descriptionKey: 'CORPORATE.PORTFOLIO.PROJECTS.CEFSA.DESCRIPTION',
        link: 'https://cefsa.cr/'
      },
      {
        name: 'tierrafertil',
        cover: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/tierrafertil/tierrafertil',
          fallbackExt: 'jpg',
          widths: [480, 768, 1200, 1500],
          width: 1500,
          height: 938,
          sizes: this.coverSizes
        }),
        logo: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/tierrafertil/tierrafertillogo',
          fallbackExt: 'svg',
          width: 300,
          height: 140,
          includeWebp: false
        }),
        descriptionKey: 'CORPORATE.PORTFOLIO.PROJECTS.TIERRAFERTIL.DESCRIPTION',
        link: 'https://zacatetierrafertil.com/'
      },
      {
        name: 'psicoyng',
        cover: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/psicoyng/psicoyng',
          fallbackExt: 'jpg',
          widths: [480, 768, 1200, 1500],
          width: 1500,
          height: 938,
          sizes: this.coverSizes
        }),
        logo: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/psicoyng/logopsicoyng',
          fallbackExt: 'svg',
          width: 300,
          height: 140,
          includeWebp: false
        }),
        descriptionKey: 'CORPORATE.PORTFOLIO.PROJECTS.PSICOYNG.DESCRIPTION',
        link: 'https://psicoyng.com/'
      },
      {
        name: 'promaca',
        cover: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/promaca/promaca',
          fallbackExt: 'jpg',
          widths: [480, 768, 1200, 1500],
          width: 1500,
          height: 938,
          sizes: this.coverSizes
        }),
        logo: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/promaca/logopromaca',
          fallbackExt: 'svg',
          width: 300,
          height: 140,
          includeWebp: false
        }),
        descriptionKey: 'CORPORATE.PORTFOLIO.PROJECTS.PROMACA.DESCRIPTION',
        link: 'https://www.promacaltda.com/'
      },
      {
        name: 'tupsa',
        cover: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/tupsa/tupsa',
          fallbackExt: 'jpg',
          widths: [480, 768, 1200, 1500],
          width: 1500,
          height: 938,
          sizes: this.coverSizes
        }),
        logo: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/tupsa/logotupsa',
          fallbackExt: 'svg',
          width: 300,
          height: 140,
          includeWebp: false
        }),
        descriptionKey: 'CORPORATE.PORTFOLIO.PROJECTS.TUPSA.DESCRIPTION',
        link: 'https://tupsa.com/'
      },
      {
        name: 'Pasto Arca',
        cover: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/pastoarca/pastoarca',
          fallbackExt: 'jpg',
          widths: [480, 768, 1200, 1500],
          width: 1500,
          height: 938,
          sizes: this.coverSizes
        }),
        logo: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/pastoarca/pastoarcalogo',
          fallbackExt: 'svg',
          width: 300,
          height: 140,
          includeWebp: false
        }),
        descriptionKey: 'CORPORATE.PORTFOLIO.PROJECTS.PASTO_ARCA.DESCRIPTION',
        link: 'https://yellow-water-0de5f8f0f.2.azurestaticapps.net'
      },
      {
        name: 'CIMED',
        cover: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/CIMED/cimed',
          fallbackExt: 'jpg',
          widths: [480, 768, 1200, 1500],
          width: 1500,
          height: 938,
          sizes: this.coverSizes
        }),
        logo: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/CIMED/logocimed',
          fallbackExt: 'svg',
          width: 300,
          height: 140,
          includeWebp: false
        }),
        descriptionKey: 'CORPORATE.PORTFOLIO.PROJECTS.CIMED.DESCRIPTION',
        link: 'https://witty-rock-0c57b0910.1.azurestaticapps.net'
      },
      {
        name: 'escritorio',
        cover: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/escritorio/escritorio',
          fallbackExt: 'jpg',
          widths: [480, 768, 1200, 1500],
          width: 1500,
          height: 938,
          sizes: this.coverSizes
        }),
        logo: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/escritorio/escritoriologo',
          fallbackExt: 'svg',
          width: 300,
          height: 140,
          includeWebp: false
        }),
        descriptionKey: 'CORPORATE.PORTFOLIO.PROJECTS.ESCRITORIO.DESCRIPTION',
        link: 'https://green-island-0403db310.5.azurestaticapps.net/'
      },
      {
        name: 'haus',
        cover: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/haus/haus',
          fallbackExt: 'jpg',
          widths: [480, 768, 1200, 1500],
          width: 1500,
          height: 938,
          sizes: this.coverSizes
        }),
        logo: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/haus/hauslogo',
          fallbackExt: 'svg',
          width: 300,
          height: 140,
          includeWebp: false
        }),
        descriptionKey: 'CORPORATE.PORTFOLIO.PROJECTS.HAUS.DESCRIPTION',
        link: 'https://haus-297eca.webflow.io/'
      },
      {
        name: 'espaciocr',
        cover: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/espaciocr/espaciocr',
          fallbackExt: 'jpg',
          widths: [480, 768, 1200, 1500],
          width: 1500,
          height: 938,
          sizes: this.coverSizes
        }),
        logo: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/espaciocr/espaciocrlogo',
          fallbackExt: 'svg',
          width: 300,
          height: 140,
          includeWebp: false
        }),
        descriptionKey: 'CORPORATE.PORTFOLIO.PROJECTS.ESPACIOCR.DESCRIPTION',
        link: 'https://espaciocr-com.webflow.io/'
      },
      {
        name: 'Punto Cero',
        cover: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/puntocero/puntocero',
          fallbackExt: 'jpg',
          widths: [480, 768, 1200, 1500],
          width: 1500,
          height: 938,
          sizes: this.coverSizes
        }),
        logo: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/puntocero/puntocerologo',
          fallbackExt: 'svg',
          width: 300,
          height: 140,
          includeWebp: false
        }),
        descriptionKey: 'CORPORATE.PORTFOLIO.PROJECTS.PUNTOCERO.DESCRIPTION',
        link: 'https://victorious-desert-032f8750f.1.azurestaticapps.net/'
      },
      {
        name: 'Altura Raiz',
        cover: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/alturaraiz/alturaraiz',
          fallbackExt: 'jpg',
          widths: [480, 768, 1200, 1500],
          width: 1500,
          height: 938,
          sizes: this.coverSizes
        }),
        logo: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/alturaraiz/alturaraizlogo',
          fallbackExt: 'svg',
          width: 300,
          height: 140,
          includeWebp: false
        }),
        descriptionKey: 'CORPORATE.PORTFOLIO.PROJECTS.ALTURARAIZ.DESCRIPTION',
        link: 'https://wonderful-smoke-00f5c7f0f.6.azurestaticapps.net/'
      },
      {
        name: 'evoke',
        cover: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/evoke/evoke',
          fallbackExt: 'jpg',
          widths: [480, 768, 1200, 1500],
          width: 1500,
          height: 938,
          sizes: this.coverSizes
        }),
        logo: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/evoke/evokelogo',
          fallbackExt: 'svg',
          width: 300,
          height: 140,
          includeWebp: false
        }),
        descriptionKey: 'WEBLAB.PORTFOLIO.PROJECTS.EVOKE.DESCRIPTION',
        link: 'https://evoke-812574.webflow.io/'
      },
      {
        name: 'Uga Comediante',
        cover: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/ugacomediante/ugacomediante',
          fallbackExt: 'jpg',
          widths: [480, 768, 1200, 1500],
          width: 1500,
          height: 938,
          sizes: this.coverSizes
        }),
        logo: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/ugacomediante/ugacomediante',
          fallbackExt: 'svg',
          width: 300,
          height: 140,
          includeWebp: false
        }),
        descriptionKey: 'WEBLAB.PORTFOLIO.PROJECTS.UGA.DESCRIPTION',
        link: 'https://ugacomediante.com/'
      },
      {
        name: 'gonow',
        cover: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/gonow/gonow',
          fallbackExt: 'jpg',
          widths: [480, 768, 1200, 1500],
          width: 1500,
          height: 938,
          sizes: this.coverSizes
        }),
        logo: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/gonow/gonowlogo',
          fallbackExt: 'svg',
          width: 300,
          height: 140,
          includeWebp: false
        }),
        descriptionKey: 'WEBLAB.PORTFOLIO.PROJECTS.GONOW.DESCRIPTION',
        link: 'https://gentle-grass-0d8c1fd0f.1.azurestaticapps.net/'
      },
      {
        name: 'magenta',
        cover: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/magenta/magenta',
          fallbackExt: 'jpg',
          widths: [480, 768, 1200, 1500],
          width: 1500,
          height: 938,
          sizes: this.coverSizes
        }),
        logo: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/magenta/magentalogo',
          fallbackExt: 'svg',
          width: 300,
          height: 140,
          includeWebp: false
        }),
        descriptionKey: 'WEBLAB.PORTFOLIO.PROJECTS.MAGENTA.DESCRIPTION',
        link: 'https://magenta-agency.webflow.io/'
      },
      {
        name: 'onigiri',
        cover: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/onigiri/onigiri',
          fallbackExt: 'jpg',
          widths: [480, 768, 1200, 1500],
          width: 1500,
          height: 938,
          sizes: this.coverSizes
        }),
        logo: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/onigiri/onigirilogo',
          fallbackExt: 'svg',
          width: 300,
          height: 140,
          includeWebp: false
        }),
        descriptionKey: 'WEBLAB.PORTFOLIO.PROJECTS.ONIGIRI.DESCRIPTION',
        link: 'https://ambitious-river-0c4fcd50f.1.azurestaticapps.net/'
      },
      {
        name: 'xcelerate',
        cover: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/xcelerate/xcelerate',
          fallbackExt: 'jpg',
          widths: [480, 768, 1200, 1500],
          width: 1500,
          height: 938,
          sizes: this.coverSizes
        }),
        logo: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/xcelerate/xceleratelogo',
          fallbackExt: 'svg',
          width: 300,
          height: 140,
          includeWebp: false
        }),
        descriptionKey: 'WEBLAB.PORTFOLIO.PROJECTS.XCELERATE.DESCRIPTION',
        link: 'https://xcelerate-93e9f9.webflow.io/'
      },
      {
        name: 'owling',
        cover: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/owling/owling',
          fallbackExt: 'jpg',
          widths: [480, 768, 1200, 1500],
          width: 1500,
          height: 938,
          sizes: this.coverSizes
        }),
        logo: buildResponsiveImageAsset({
          basePath: 'assets/img/portfolio/owling/owlinglogo',
          fallbackExt: 'svg',
          width: 300,
          height: 140,
          includeWebp: false
        }),
        descriptionKey: 'CORPORATE.PORTFOLIO.PROJECTS.OWLING.DESCRIPTION',
        link: 'https://owling-5f5348d867103818b18a0662362cdb24.webflow.io/'
      }
    ];

    this.projects = baseProjects.map((project) => ({
      ...project,
      industry: this.resolveIndustry(project.name)
    }));

    this.buildPortfolioSchema();
  }

  private buildPortfolioSchema() {
    const titleLine1 = this.translate.instant('CORPORATE.PORTFOLIO.TITLE_LINE1');
    const titleLine2 = this.translate.instant('CORPORATE.PORTFOLIO.TITLE_LINE2');

    this.portfolioSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ItemList',
          '@id': 'https://linkdesign.cr/corporate#portfolio',
          name: `${titleLine1} ${titleLine2}`.trim(),
          url: 'https://linkdesign.cr/corporate#project',
          itemListOrder: 'https://schema.org/ItemListOrderAscending',
          numberOfItems: this.projects.length,
          itemListElement: this.projects.map((project, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'WebSite',
              '@id': `https://linkdesign.cr/corporate#work-${this.toSlug(project.name)}`,
              name: project.name,
              url: project.link,
              description: this.translate.instant(project.descriptionKey),
              about: {
                '@type': 'Thing',
                name: project.industry
              }
            }
          }))
        }
      ]
    };
  }

  private async mountSlider(startIndex = 0): Promise<void> {
    const sliderElement = this.portfolioSlider?.nativeElement;
    if (!sliderElement) {
      return;
    }

    const sliderWidth = sliderElement.getBoundingClientRect().width;
    if (sliderWidth < 40 && this.mountAttempts < this.maxMountAttempts) {
      this.mountAttempts += 1;
      requestAnimationFrame(() => {
        void this.mountSlider(startIndex);
      });
      return;
    }
    this.mountAttempts = 0;

    this.destroySlider();
    const SplideCtor = await this.getSplideCtor();
    if (!SplideCtor) {
      return;
    }

    try {
      this.splide = new SplideCtor(sliderElement, this.getSliderOptions());
      this.splide.mount();
      this.attachTrackpadNavigation(sliderElement);

      requestAnimationFrame(() => {
        if (!this.splide) {
          return;
        }

        if (startIndex > 0) {
          this.splide.go(startIndex);
        }

        this.splide.refresh();
      });
    } catch (error) {
      console.error('Corporate portfolio slider could not be initialized.', error);
    }
  }

  private remountSlider(): void {
    const currentIndex = this.splide?.index ?? 0;
    void this.mountSlider(currentIndex);
  }

  private destroySlider(): void {
    this.detachTrackpadNavigation();

    if (!this.splide) {
      return;
    }

    this.splide.destroy(true);
    this.splide = undefined;
  }

  private getSliderOptions(): Options {
    return {
      type: 'loop',
      clones: this.projects.length,
      perPage: 3.18,
      drag: true,
      pagination: false,
      arrows: true,
      keyboard: 'focused',
      autoplay: false,
      focus: 'center',
      trimSpace: false,
      gap: '1rem',
      perMove: 1,
      speed: 520,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      breakpoints: {
        1035: {
          perPage: 2.16,
          gap: '0.95rem'
        },
        600: {
          perPage: 1.14,
          gap: '0.75rem'
        }
      },
      i18n: {
        prev: this.translate.instant('CORPORATE.PORTFOLIO.ARIA.PREV'),
        next: this.translate.instant('CORPORATE.PORTFOLIO.ARIA.NEXT')
      }
    };
  }

  private attachTrackpadNavigation(sliderElement: HTMLElement): void {
    this.detachTrackpadNavigation();

    const track = sliderElement.querySelector<HTMLElement>('.splide__track');
    if (!track) {
      return;
    }

    const wheelHandler = (event: WheelEvent): void => {
      if (!this.splide || !event.cancelable) {
        return;
      }

      const horizontalDelta = Math.abs(event.deltaX);
      const verticalDelta = Math.abs(event.deltaY);

      if (horizontalDelta < 14 || horizontalDelta <= verticalDelta) {
        return;
      }

      const now = Date.now();
      if (now < this.wheelLockUntil) {
        event.preventDefault();
        return;
      }

      const movingForward = event.deltaX > 0;
      const arrowSelector = movingForward ? '.splide__arrow--next' : '.splide__arrow--prev';
      const arrow = sliderElement.querySelector<HTMLButtonElement>(arrowSelector);
      if (arrow?.disabled) {
        return;
      }

      event.preventDefault();
      this.wheelLockUntil = now + 380;
      this.splide.go(movingForward ? '>' : '<');
    };

    track.addEventListener('wheel', wheelHandler, { passive: false });
    this.removeTrackpadHandler = () => track.removeEventListener('wheel', wheelHandler);
  }

  private detachTrackpadNavigation(): void {
    this.removeTrackpadHandler?.();
    this.removeTrackpadHandler = undefined;
    this.wheelLockUntil = 0;
  }

  private async getSplideCtor(): Promise<typeof import('@splidejs/splide').default | null> {
    if (this.splideCtor) {
      return this.splideCtor;
    }

    try {
      const module = await import('@splidejs/splide');
      this.splideCtor = module.default;
      return this.splideCtor;
    } catch (error) {
      console.error('Splide could not be loaded for corporate portfolio.', error);
      return null;
    }
  }

  private toSlug(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private resolveIndustry(projectName: string): string {
    return this.industriesByProject[projectName.toLowerCase()] ?? 'Corporativo';
  }
}
