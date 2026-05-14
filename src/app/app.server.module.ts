import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { TranslateLoader } from '@ngx-translate/core';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { ServerTranslateLoader } from './services/server-translate.loader';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  providers: [
    {
      provide: TranslateLoader,
      useClass: ServerTranslateLoader
    }
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
