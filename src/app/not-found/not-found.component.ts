import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { SeoService } from '../services/seo.service';
import { SEO_ROUTE_DEFINITIONS } from '../services/seo-route-definitions';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  constructor(private seoService: SeoService, private meta: Meta) {}

  ngOnInit(): void {
    const seo = SEO_ROUTE_DEFINITIONS.notFound;
    this.seoService.setSeoData(
      seo.title || 'Página no encontrada (404) | LINK DESIGN Costa Rica',
      seo.description || 'La URL solicitada no está disponible. Volvé al inicio de LINK DESIGN para continuar navegando nuestros servicios.',
      seo.keywords || '404, página no encontrada, enlace roto, link design',
      {
        canonicalUrl: seo.canonicalUrl,
        robots: seo.robots,
        locale: seo.locale
      }
    );
    this.meta.updateTag({ name: 'robots', content: seo.robots || 'noindex, nofollow' });
  }
}
