import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import type { Options } from '@splidejs/splide';

interface SoftwareShowcaseItem {
  tagKey: string;
  titleKey: string;
  beforeKey: string;
  afterKey: string;
}

@Component({
  selector: 'app-software-showcase',
  templateUrl: './software-showcase.component.html',
  styleUrls: ['./software-showcase.component.scss']
})
export class SoftwareShowcaseComponent implements AfterViewInit, OnDestroy {
  @ViewChild('showcaseSlider') showcaseSlider?: ElementRef<HTMLElement>;

  readonly items: SoftwareShowcaseItem[] = [
    {
      tagKey: 'SOFTWARE.PAGE_COPY.SHOWCASE.ITEMS.ITEM1.TAG',
      titleKey: 'SOFTWARE.PAGE_COPY.SHOWCASE.ITEMS.ITEM1.TITLE',
      beforeKey: 'SOFTWARE.PAGE_COPY.SHOWCASE.ITEMS.ITEM1.BEFORE',
      afterKey: 'SOFTWARE.PAGE_COPY.SHOWCASE.ITEMS.ITEM1.AFTER'
    },
    {
      tagKey: 'SOFTWARE.PAGE_COPY.SHOWCASE.ITEMS.ITEM2.TAG',
      titleKey: 'SOFTWARE.PAGE_COPY.SHOWCASE.ITEMS.ITEM2.TITLE',
      beforeKey: 'SOFTWARE.PAGE_COPY.SHOWCASE.ITEMS.ITEM2.BEFORE',
      afterKey: 'SOFTWARE.PAGE_COPY.SHOWCASE.ITEMS.ITEM2.AFTER'
    },
    {
      tagKey: 'SOFTWARE.PAGE_COPY.SHOWCASE.ITEMS.ITEM3.TAG',
      titleKey: 'SOFTWARE.PAGE_COPY.SHOWCASE.ITEMS.ITEM3.TITLE',
      beforeKey: 'SOFTWARE.PAGE_COPY.SHOWCASE.ITEMS.ITEM3.BEFORE',
      afterKey: 'SOFTWARE.PAGE_COPY.SHOWCASE.ITEMS.ITEM3.AFTER'
    },
    {
      tagKey: 'SOFTWARE.PAGE_COPY.SHOWCASE.ITEMS.ITEM4.TAG',
      titleKey: 'SOFTWARE.PAGE_COPY.SHOWCASE.ITEMS.ITEM4.TITLE',
      beforeKey: 'SOFTWARE.PAGE_COPY.SHOWCASE.ITEMS.ITEM4.BEFORE',
      afterKey: 'SOFTWARE.PAGE_COPY.SHOWCASE.ITEMS.ITEM4.AFTER'
    },
    {
      tagKey: 'SOFTWARE.PAGE_COPY.SHOWCASE.ITEMS.ITEM5.TAG',
      titleKey: 'SOFTWARE.PAGE_COPY.SHOWCASE.ITEMS.ITEM5.TITLE',
      beforeKey: 'SOFTWARE.PAGE_COPY.SHOWCASE.ITEMS.ITEM5.BEFORE',
      afterKey: 'SOFTWARE.PAGE_COPY.SHOWCASE.ITEMS.ITEM5.AFTER'
    },
    {
      tagKey: 'SOFTWARE.PAGE_COPY.SHOWCASE.ITEMS.ITEM6.TAG',
      titleKey: 'SOFTWARE.PAGE_COPY.SHOWCASE.ITEMS.ITEM6.TITLE',
      beforeKey: 'SOFTWARE.PAGE_COPY.SHOWCASE.ITEMS.ITEM6.BEFORE',
      afterKey: 'SOFTWARE.PAGE_COPY.SHOWCASE.ITEMS.ITEM6.AFTER'
    }
  ];

  private splide?: import('@splidejs/splide').default;
  private splideCtor?: typeof import('@splidejs/splide').default;
  private langSub?: Subscription;
  private mountAttempts = 0;
  private readonly maxMountAttempts = 8;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService
  ) { }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    void this.mountSlider();
    this.langSub = this.translate.onLangChange.subscribe(() => this.remountSlider());
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
    this.destroySlider();
  }

  private async mountSlider(startIndex = 0): Promise<void> {
    const sliderElement = this.showcaseSlider?.nativeElement;
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

      requestAnimationFrame(() => {
        const firstSlide = sliderElement.querySelector<HTMLElement>('.splide__slide');
        const firstSlideWidth = firstSlide?.getBoundingClientRect().width ?? 0;

        if (firstSlideWidth < 20) {
          this.destroySlider();
          return;
        }

        if (!this.splide) {
          return;
        }

        if (startIndex > 0) {
          this.splide.go(startIndex);
        }

        this.splide.refresh();
      });
    } catch (error) {
      console.error('Showcase slider could not be initialized.', error);
    }
  }

  private remountSlider(): void {
    const currentIndex = this.splide?.index ?? 0;
    void this.mountSlider(currentIndex);
  }

  private destroySlider(): void {
    if (!this.splide) {
      return;
    }

    this.splide.destroy(true);
    this.splide = undefined;
  }

  private getSliderOptions(): Options {
    return {
      type: 'slide',
      perPage: 3,
      perMove: 1,
      rewind: true,
      drag: true,
      arrows: true,
      pagination: false,
      keyboard: 'focused',
      autoplay: false,
      gap: '1.25rem',
      speed: 520,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      breakpoints: {
        1035: {
          perPage: 2,
          gap: '1rem'
        },
        600: {
          perPage: 1,
          gap: '0.75rem'
        }
      },
      i18n: {
        prev: this.translate.instant('SOFTWARE.PAGE_COPY.SHOWCASE.ARIA.PREV'),
        next: this.translate.instant('SOFTWARE.PAGE_COPY.SHOWCASE.ARIA.NEXT')
      }
    };
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
      console.error('Splide could not be loaded.', error);
      return null;
    }
  }
}
