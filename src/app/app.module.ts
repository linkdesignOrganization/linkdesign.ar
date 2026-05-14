import { APP_INITIALIZER, NgModule, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { routing, appRoutingProviders } from './app-routing';
import { SplithomeComponent } from './splithome/splithome.component';
import { HomecorporateComponent } from './corporate/homecorporate/homecorporate.component';
import { HomeweblabComponent } from './weblab/homeweblab/homeweblab.component';
import { NavComponent } from './corporate/nav/nav.component';
import { GlitchComponent } from './corporate/glitch/glitch.component';
import { CoverComponent } from './weblab/cover/cover.component';
import { NavWeblabComponent } from './weblab/nav-weblab/nav-weblab.component';
import { PortfolioComponent } from './weblab/portfolio/portfolio.component';
import { TimmerComponent } from './weblab/timmer/timmer.component';
import { PortfoliocorpComponent } from './corporate/portfoliocorp/portfoliocorp.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { NgxJsonLdModule } from '@ngx-lite/json-ld';
import { SoftwareComponent } from './software/software.component';
import { PoliticasDePrivacidadComponent } from './politicas-de-privacidad/politicas-de-privacidad.component';
import { FootComponent } from './foot/foot.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { I18nService } from './services/i18n.service';
import { ServerTranslateLoader } from './services/server-translate.loader';
import { SoftwareShowcaseComponent } from './software/showcase/software-showcase.component';
import { LeadFormModule } from './lead-form/lead-form.module';

export function HttpLoaderFactory(http: HttpClient, platformId: object) {
  if (isPlatformBrowser(platformId)) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  }
  if (isPlatformServer(platformId)) {
    return new ServerTranslateLoader();
  }
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function initI18n(i18nService: I18nService) {
  return () => i18nService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    SplithomeComponent,
    HomecorporateComponent,
    HomeweblabComponent,
    NavComponent,
    GlitchComponent,
    CoverComponent,
    NavWeblabComponent,
    PortfolioComponent,
    TimmerComponent,
    PortfoliocorpComponent,
    ContactPageComponent,
    SoftwareComponent,
    SoftwareShowcaseComponent,
    PoliticasDePrivacidadComponent,
    NotFoundComponent,
    FootComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient, PLATFORM_ID]
      }
    }),
    RouterModule,
    routing,
    NgxJsonLdModule,
    LeadFormModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initI18n,
      deps: [I18nService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
