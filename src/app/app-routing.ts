import {Routes, RouterModule, Route} from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { SplithomeComponent } from './splithome/splithome.component';
import { HomecorporateComponent } from './corporate/homecorporate/homecorporate.component';
import {HomeweblabComponent} from './weblab/homeweblab/homeweblab.component'
import { ContactPageComponent } from './contact-page/contact-page.component';
import { SoftwareComponent } from './software/software.component';
import { PoliticasDePrivacidadComponent } from './politicas-de-privacidad/politicas-de-privacidad.component';
import { NotFoundComponent } from './not-found/not-found.component';


const appRoute : Routes = [
  {path: '', component: SplithomeComponent},
  {path: 'corporate', component: HomecorporateComponent},
  {path: 'creative', redirectTo: 'weblab', pathMatch: 'full'},
  {path: 'weblab', component: HomeweblabComponent},
  {path: 'contact', component: ContactPageComponent},
  {path: 'software', component: SoftwareComponent},
  {path: 'politicas-de-privacidad', component: PoliticasDePrivacidadComponent},

  // {path: ':subplace', component: HomeweblabComponent},

  { path: '**', component: NotFoundComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<Route>  = RouterModule.forRoot(appRoute, {
    initialNavigation: 'enabledBlocking'
});
