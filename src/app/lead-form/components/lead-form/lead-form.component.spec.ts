import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { LeadFormComponent } from './lead-form.component';

describe('LeadFormComponent', () => {
  function createComponent(platformId: Object = 'browser'): LeadFormComponent {
    const leadService = {
      submit: jasmine.createSpy('submit').and.returnValue(of({ status: 'success', lead_id: 'test' }))
    };
    const cdr = {
      markForCheck: jasmine.createSpy('markForCheck')
    };

    return new LeadFormComponent(
      platformId,
      new FormBuilder(),
      leadService as any,
      cdr as any
    );
  }

  it('does not prefill the phone field on browser hydration', () => {
    const component = createComponent();
    component.ngOnInit();

    component.ngAfterViewInit();

    expect(component.form.get('phone')?.value).toBe('');
    component.ngOnDestroy();
  });

  it('resets the phone field to empty', () => {
    const component = createComponent();
    component.ngOnInit();
    component.form.get('phone')?.setValue('+54 11 5555 5555');

    component.resetForm();

    expect(component.form.get('phone')?.value).toBe('');
  });
});
