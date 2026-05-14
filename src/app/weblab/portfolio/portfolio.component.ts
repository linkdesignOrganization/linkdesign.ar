import { Component, OnInit } from '@angular/core';
import { ResponsiveImageAsset, buildResponsiveImageAsset } from '../../shared/responsive-media';

interface Project {
  name: string;
  cover: ResponsiveImageAsset;
  logo: ResponsiveImageAsset;
  descriptionKey: string;
  link: string;
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
  projects: Project[] = [];
  private readonly coverSizes = '(min-width: 1200px) 28vw, (min-width: 768px) 42vw, 92vw';

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    // Sample data
    this.projects = [

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



      /* Moved to corporate portfolio cards (kept for reference)
      {
        name: 'haus',
        coverImage: 'assets/img/portfolio/haus/haus.webp',
        coverImageJpg: 'assets/img/portfolio/haus/haus.jpg',
        logoImage: 'assets/img/portfolio/haus/hauslogo.svg',
        description: 'Haus isn't just an experience; it's a small glimpse into the exclusivity the brand offers. We designed a digital journey that reflects its sophisticated style and privileged location, allowing future buyers to imagine their life there from the first moment.',
        link: 'https://haus-297eca.webflow.io/'
      },
      */

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
      /* Moved to corporate portfolio cards (kept for reference)
      {
        name: 'owling',
        coverImage: 'assets/img/portfolio/owling/owling.webp',
        coverImageJpg: 'assets/img/portfolio/owling/owling.jpg',
        logoImage: 'assets/img/portfolio/owling/owlinglogo.svg',
        descriptionKey: 'Owling es una plataforma de tutorías en línea pensada para conectar estudiantes y profesores de forma clara y cercana. Diseñamos un sitio que transmite confianza y dinamismo, resaltando su flexibilidad y el valor de un aprendizaje personalizado.',
        link: 'https://owling-5f5348d867103818b18a0662362cdb24.webflow.io/'
      },
      */

    ];
  }

}
