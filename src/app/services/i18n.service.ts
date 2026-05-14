import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private readonly storageKey = 'lang';
  private readonly supportedLangs = ['es', 'en'] as const;

  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.translate.addLangs([...this.supportedLangs]);
    this.translate.setDefaultLang('es');
  }

  async init(): Promise<void> {
    const isBrowser = this.isBrowser();
    let forcedLang: 'es' | 'en' | null = null;

    if (isBrowser) {
      const { pathname, search } = window.location;
      if (pathname === '/' || pathname === '') {
        const flags = search.replace(/^\?/, '').split('&').filter(Boolean);
        if (flags.includes('en')) {
          forcedLang = 'en';
        } else if (flags.includes('es')) {
          forcedLang = 'es';
        }
      }
    }

    const lang = this.normalizeLang(forcedLang ?? 'es');
    await firstValueFrom(this.translate.use(lang));
    this.setHtmlLang(lang);
    this.storeLang(lang);
  }

  use(lang: 'es' | 'en') {
    const result = this.translate.use(lang);
    this.setHtmlLang(lang);
    this.storeLang(lang);
    return result;
  }

  toggle() {
    const next = this.currentLang === 'es' ? 'en' : 'es';
    this.use(next);
  }

  get currentLang(): 'es' | 'en' {
    const current = this.translate.currentLang || this.translate.defaultLang || 'es';
    return this.normalizeLang(current);
  }

  private normalizeLang(lang?: string | null): 'es' | 'en' {
    if (!lang) {
      return 'es';
    }
    return lang.toLowerCase().startsWith('en') ? 'en' : 'es';
  }

  private isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  private getStoredLang() {
    return this.isBrowser() ? localStorage.getItem(this.storageKey) : null;
  }

  private storeLang(lang: string) {
    if (this.isBrowser()) {
      localStorage.setItem(this.storageKey, lang);
    }
  }

  private setHtmlLang(lang: string) {
    if (this.isBrowser()) {
      document.documentElement.lang = lang === 'es' ? 'es-CR' : lang;
    }
  }
}
