import { Component, OnInit } from '@angular/core';
import { SeoService } from '../services/seo.service';
import { SEO_ROUTE_DEFINITIONS } from '../services/seo-route-definitions';

@Component({
  selector: 'app-politicas-de-privacidad',
  templateUrl: './politicas-de-privacidad.component.html',
  styleUrls: ['./politicas-de-privacidad.component.scss']
})
export class PoliticasDePrivacidadComponent implements OnInit {
  todayYear = new Date().getFullYear();

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    const seo = SEO_ROUTE_DEFINITIONS.privacy;
    this.seoService.setSeoData(
      seo.title || 'Política de Privacidad y Datos | LINK DESIGN Costa Rica',
      seo.description || 'Conoce cómo recopilamos, usamos y protegemos tus datos personales en LINK DESIGN, incluyendo finalidades, derechos y medios de contacto para privacidad.',
      seo.keywords || 'política de privacidad, protección de datos, privacidad digital, link design, costa rica',
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
  }
}
