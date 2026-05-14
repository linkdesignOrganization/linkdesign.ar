import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
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
export class PortfoliocorpComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  portfolioSchema: Record<string, unknown> = {};
  private langSub?: Subscription;
  private readonly coverSizes = '(min-width: 1200px) 28vw, (min-width: 768px) 42vw, 92vw';

  private readonly industriesByProject: Record<string, string> = {
    asembis: 'Salud',
    imperio: 'Alimentos',
    aaec: 'Legal',
    nano: 'Bienestar',
    cewtec: 'Tecnologia',
    amag: 'Moda',
    cefsa: 'Finanzas',
    tierrafertil: 'Agroindustria',
    psicoyng: 'Salud',
    promaca: 'Alimentos',
    tupsa: 'Transporte',
    'pasto arca': 'Agroindustria',
    cimed: 'Legal',
    escritorio: 'Contabilidad',
    haus: 'Bienes Raices',
    espaciocr: 'Arquitectura',
    'punto cero': 'Mantenimiento',
    'altura raiz': 'Arquitectura'
  };

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.loadProjects();
    this.langSub = this.translate.onLangChange.subscribe(() => this.buildPortfolioSchema());
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
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
