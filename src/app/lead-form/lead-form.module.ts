import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { LeadFormComponent } from './components/lead-form/lead-form.component';
import { ChipSelectComponent } from './components/chip-select/chip-select.component';

/**
 * Feature module del form de leads.
 *
 * Encapsula ReactiveFormsModule para no contaminar el AppModule.
 * Exporta LeadFormComponent para que pueda usarse en `<app-foot>` y a futuro en `/contact`.
 */
@NgModule({
  declarations: [
    LeadFormComponent,
    ChipSelectComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  exports: [
    LeadFormComponent
  ]
})
export class LeadFormModule {}
