import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform, PLATFORM_ID } from '@angular/core';
import { Subject } from 'rxjs';
import { SoftwareComponent } from './software.component';
import { SeoService } from '../services/seo.service';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from '../services/i18n.service';

@Pipe({ name: 'translate' })
class TranslatePipeStub implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

class SeoServiceStub {
  setSeoData = jasmine.createSpy('setSeoData');
}

class TranslateServiceStub {
  onLangChange = new Subject<void>();

  instant(key: string): string {
    return key;
  }
}

class I18nServiceStub {
  currentLang: 'es' | 'en' = 'es';
  use = jasmine.createSpy('use');
}

describe('SoftwareComponent', () => {
  const originalMatchMedia = window.matchMedia;
  const originalRequestAnimationFrame = window.requestAnimationFrame;
  const originalCancelAnimationFrame = window.cancelAnimationFrame;

  const desktopQuery = '(min-width: 1036px) and (hover: hover) and (pointer: fine)';
  const mobileQuery = '(max-width: 1035px)';
  const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

  const installMatchMedia = (matcher: (query: string) => boolean) => {
    window.matchMedia = ((query: string) => ({
      matches: matcher(query),
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false
    })) as typeof window.matchMedia;
  };

  const installAnimationFrame = () => {
    window.requestAnimationFrame = ((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    }) as typeof window.requestAnimationFrame;
    window.cancelAnimationFrame = (() => undefined) as typeof window.cancelAnimationFrame;
  };

  const createEffect = () => jasmine.createSpyObj('effect', ['destroy', 'resize']);

  const setup = async (platformId: 'browser' | 'server'): Promise<ComponentFixture<SoftwareComponent>> => {
    await TestBed.configureTestingModule({
      declarations: [SoftwareComponent, TranslatePipeStub],
      providers: [
        { provide: PLATFORM_ID, useValue: platformId },
        { provide: SeoService, useClass: SeoServiceStub },
        { provide: TranslateService, useClass: TranslateServiceStub },
        { provide: I18nService, useClass: I18nServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    return TestBed.createComponent(SoftwareComponent);
  };

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    window.requestAnimationFrame = originalRequestAnimationFrame;
    window.cancelAnimationFrame = originalCancelAnimationFrame;
    TestBed.resetTestingModule();
  });

  it('should create without browser APIs available', async () => {
    const fixture = await setup('server');
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.showHeroFallback).toBeTrue();
  });

  it('should not attempt to initialize Vanta during SSR', async () => {
    const fixture = await setup('server');
    const component = fixture.componentInstance;
    const loadSpy = spyOn<any>(component, 'loadHeroDependencies').and.rejectWith(new Error('should not load'));

    fixture.detectChanges();

    expect(loadSpy).not.toHaveBeenCalled();
  });

  it('should initialize the desktop Vanta profile with mouse interaction', async () => {
    installAnimationFrame();
    installMatchMedia((query) => query === desktopQuery);

    const fixture = await setup('browser');
    const component = fixture.componentInstance;
    const effect = createEffect();
    const globeFactory = jasmine.createSpy('globeFactory').and.returnValue(effect);

    spyOn<any>(component, 'supportsHeroWebGl').and.returnValue(true);
    spyOn<any>(component, 'loadHeroDependencies').and.resolveTo({
      globeFactory,
      threeModule: {} as any
    });

    fixture.detectChanges();
    await fixture.whenStable();

    const options = globeFactory.calls.mostRecent().args[0];

    expect(globeFactory).toHaveBeenCalled();
    expect(options.mouseControls).toBeTrue();
    expect(options.touchControls).toBeFalse();
    expect(options.scale).toBe(1);
    expect(options.size).toBe(0.9);
    expect(component.showHeroFallback).toBeFalse();
    expect(component.isHeroArtifactActive).toBeTrue();
  });

  it('should initialize the mobile Vanta profile without pointer interaction', async () => {
    installAnimationFrame();
    installMatchMedia((query) => query === mobileQuery);

    const fixture = await setup('browser');
    const component = fixture.componentInstance;
    const effect = createEffect();
    const globeFactory = jasmine.createSpy('globeFactory').and.returnValue(effect);

    spyOn<any>(component, 'supportsHeroWebGl').and.returnValue(true);
    spyOn<any>(component, 'loadHeroDependencies').and.resolveTo({
      globeFactory,
      threeModule: {} as any
    });

    fixture.detectChanges();
    await fixture.whenStable();

    const options = globeFactory.calls.mostRecent().args[0];

    expect(globeFactory).toHaveBeenCalled();
    expect(options.mouseControls).toBeFalse();
    expect(options.touchControls).toBeFalse();
    expect(options.gyroControls).toBeFalse();
    expect(options.points).toBe(7);
    expect(options.scaleMobile).toBe(0.9);
    expect(component.showHeroFallback).toBeFalse();
    expect(component.isHeroArtifactActive).toBeTrue();
  });

  it('should force the fallback when reduced motion is enabled', async () => {
    installAnimationFrame();
    installMatchMedia((query) => query === reducedMotionQuery || query === desktopQuery);

    const fixture = await setup('browser');
    const component = fixture.componentInstance;
    const loadSpy = spyOn<any>(component, 'loadHeroDependencies').and.rejectWith(new Error('should not load'));
    spyOn<any>(component, 'supportsHeroWebGl').and.returnValue(true);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(loadSpy).not.toHaveBeenCalled();
    expect(component.showHeroFallback).toBeTrue();
    expect(component.isHeroArtifactActive).toBeFalse();
  });

  it('should keep the fallback visible when Vanta initialization fails', async () => {
    installAnimationFrame();
    installMatchMedia((query) => query === mobileQuery);

    const fixture = await setup('browser');
    const component = fixture.componentInstance;
    spyOn<any>(component, 'supportsHeroWebGl').and.returnValue(true);
    spyOn<any>(component, 'loadHeroDependencies').and.rejectWith(new Error('boom'));

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.showHeroFallback).toBeTrue();
    expect(component.isHeroArtifactActive).toBeFalse();
  });

  it('should render separate mobile and desktop fallback poster sources', async () => {
    const fixture = await setup('server');
    fixture.detectChanges();

    const sourceEl = fixture.nativeElement.querySelector('.hero-fallback-picture source') as HTMLSourceElement;
    const imgEl = fixture.nativeElement.querySelector('.hero-fallback-image') as HTMLImageElement;

    expect(sourceEl.getAttribute('srcset')).toBe('assets/img/software-hero-vanta-fallback-mobile.svg');
    expect(sourceEl.getAttribute('media')).toBe('(max-width: 1035px)');
    expect(imgEl.getAttribute('src')).toBe('assets/img/software-hero-vanta-fallback-desktop.svg');
  });

  it('should destroy the Vanta instance on teardown', async () => {
    const fixture = await setup('browser');
    const component = fixture.componentInstance;
    const effect = createEffect();

    (component as any).heroEffect = effect;
    component.ngOnDestroy();

    expect(effect.destroy).toHaveBeenCalled();
  });
});
