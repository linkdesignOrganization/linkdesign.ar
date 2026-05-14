import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ScrollService } from './services/scroll.service';
import { SeoService } from './services/seo.service';
import { filter } from 'rxjs/operators';
import { SEO_ROUTE_DEFINITIONS } from './services/seo-route-definitions';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'linkdesignweb';
  showFoot = true;
  constructor(
    private scrollService: ScrollService,
    private seoService: SeoService,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    const seo = SEO_ROUTE_DEFINITIONS.home;
    this.seoService.setSeoData(
      this.translate.instant(seo.titleKey || 'SPLITHOME.SEO.TITLE'),
      this.translate.instant(seo.descriptionKey || 'SPLITHOME.SEO.DESCRIPTION'),
      this.translate.instant(seo.keywordsKey || 'SPLITHOME.SEO.KEYWORDS'),
      {
        canonicalUrl: seo.canonicalUrl,
        image: seo.image,
        imageWidth: seo.imageWidth,
        imageHeight: seo.imageHeight,
        robots: seo.robots,
        locale: seo.locale
      }
    );

    this.updateFootVisibility(this.router.url);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navEvent = event as NavigationEnd;
        this.updateFootVisibility(navEvent.urlAfterRedirects);
      });
  }

  private updateFootVisibility(url: string) {
    const basePath = url.split('?')[0].split('#')[0];
    this.showFoot = basePath !== '/';
  }
}
