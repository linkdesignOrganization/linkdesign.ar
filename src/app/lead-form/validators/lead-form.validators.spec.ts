import { FormControl } from '@angular/forms';

import { phoneFlexibleValidator } from './lead-form.validators';

describe('phoneFlexibleValidator', () => {
  const validator = phoneFlexibleValidator();

  it('accepts an Argentine number with country code', () => {
    const control = new FormControl('+54 11 5555 5555');

    expect(validator(control)).toBeNull();
  });

  it('accepts an international number outside Argentina', () => {
    const control = new FormControl('+1 (415) 555-0123');

    expect(validator(control)).toBeNull();
  });

  it('requires the country prefix', () => {
    const control = new FormControl('11 5555 5555');

    expect(validator(control)).toEqual({ phoneNeedsPrefix: true });
  });

  it('does not keep a special validation rule for Costa Rica numbers', () => {
    const control = new FormControl('+506 1234 567');

    expect(validator(control)).toBeNull();
  });
});
