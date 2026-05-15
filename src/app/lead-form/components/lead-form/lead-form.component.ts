import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { LeadFormService } from '../../services/lead-form.service';
import {
  NEED_OPTIONS,
  CONTACT_OPTIONS,
  FormLocation
} from '../../models/lead-form-options';
import {
  emailStrictValidator,
  phoneFlexibleValidator,
  noLinksValidator,
  noExcessiveLinksValidator,
  arrayRequiredValidator
} from '../../validators/lead-form.validators';
import { LeadFormRawValue, LeadSubmitResult } from '../../models/lead-payload.model';

type FormState =
  | 'idle'
  | 'submitting'
  | 'success'
  | 'error_network'
  | 'error_rate_limited';

@Component({
  selector: 'app-lead-form',
  templateUrl: './lead-form.component.html',
  styleUrls: ['./lead-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeadFormComponent implements OnInit, AfterViewInit, OnDestroy {
  /** Variante visual del componente. Por ahora solo 'footer'. */
  @Input() variant: 'footer' | 'contact' = 'footer';
  @Input() formLocation: FormLocation = 'footer';

  form!: FormGroup;
  state: FormState = 'idle';
  errorMessage: string | null = null;

  // Opciones de chips (expuestas al template)
  readonly needOptions = NEED_OPTIONS;
  readonly contactOptions = CONTACT_OPTIONS;

  // Anti-spam tracking
  private formLoadedAt = Date.now();
  private interactionCount = 0;

  // Subscriptions
  private valueChangesSub?: Subscription;

  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private leadService: LeadFormService,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name:    ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80), noLinksValidator()]],
      company: ['', [Validators.maxLength(120), noLinksValidator()]],
      email:   ['', [Validators.required, emailStrictValidator(), Validators.maxLength(120)]],
      phone:   ['', [Validators.required, phoneFlexibleValidator()]],
      // need: multi-select, opcional
      need:              [[] as string[]],
      // preferred_contact: multi-select, requerido (mínimo 1)
      preferred_contact: [[] as string[], arrayRequiredValidator()],
      message: ['', [Validators.maxLength(1000), noExcessiveLinksValidator()]],
      // Honeypots — no se muestran
      website: [''],
      url:     ['']
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    // Iniciar contador de tiempo y eventos una vez hidratado en browser
    this.formLoadedAt = Date.now();

    // Cualquier valueChange real cuenta como interacción
    // (cubre autofills de password managers + edición manual)
    this.valueChangesSub = this.form.valueChanges.subscribe(() => {
      this.interactionCount += 1;
    });
  }

  ngOnDestroy(): void {
    this.valueChangesSub?.unsubscribe();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Interaction tracking
  // ──────────────────────────────────────────────────────────────────────────

  registerInteraction(): void {
    this.interactionCount += 1;
  }

  onPhoneFocus(): void {
    if (!this.isBrowser) return;
    this.registerInteraction();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Field state helpers (para el template)
  // ──────────────────────────────────────────────────────────────────────────

  fieldClass(controlName: string): { [k: string]: boolean } {
    const ctrl = this.form.get(controlName);
    if (!ctrl) return {};
    // Invalid (rojo): solo después de salir del input (blur → touched).
    // No molestamos al usuario mientras escribe.
    const showError = ctrl.invalid && ctrl.touched;
    // Valid (check verde): apenas el valor es correcto, dé feedback positivo.
    const showValid = ctrl.valid && (ctrl.dirty || ctrl.touched);
    return {
      'is-invalid': showError,
      'is-valid': showValid
    };
  }

  /**
   * Devuelve la key de i18n del error a mostrar (o null si no hay error a mostrar).
   * Solo se muestra después del blur (touched), para no molestar mientras escribe.
   */
  errorKeyFor(controlName: string): string | null {
    const ctrl = this.form.get(controlName);
    if (!ctrl || !ctrl.errors) return null;
    if (!ctrl.touched) return null;
    const errs = ctrl.errors;

    if (errs['required']) return 'LEAD_FORM.ERRORS.REQUIRED';
    if (errs['minlength']) return 'LEAD_FORM.ERRORS.TOO_SHORT';
    if (errs['maxlength']) return 'LEAD_FORM.ERRORS.TOO_LONG';
    if (errs['emailInvalid'] || errs['emailTooLong']) return 'LEAD_FORM.ERRORS.INVALID_EMAIL';
    if (errs['emailDisposable']) return 'LEAD_FORM.ERRORS.INVALID_EMAIL';
    if (errs['phoneNeedsPrefix']) return 'LEAD_FORM.ERRORS.PHONE_NEEDS_PREFIX';
    if (errs['phoneInvalidChars']) return 'LEAD_FORM.ERRORS.INVALID_PHONE';
    if (errs['phoneTooShort'] || errs['phoneTooLong']) return 'LEAD_FORM.ERRORS.INVALID_PHONE';
    if (errs['containsLinks']) return 'LEAD_FORM.ERRORS.NO_LINKS';
    if (errs['tooManyLinks']) return 'LEAD_FORM.ERRORS.NO_LINKS';
    if (errs['spamKeyword']) return 'LEAD_FORM.ERRORS.NO_LINKS';
    return null;
  }

  // Para los chips: detecta invalid pero solo si fue tocado por submit
  chipInvalid(controlName: string): boolean {
    const ctrl = this.form.get(controlName);
    if (!ctrl) return false;
    return ctrl.invalid && ctrl.touched;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Submit
  // ──────────────────────────────────────────────────────────────────────────

  onSubmit(): void {
    if (this.state === 'submitting') return;

    // Marcar todos como touched para mostrar errores
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.cdr.markForCheck();
      return;
    }

    this.state = 'submitting';
    this.errorMessage = null;
    this.cdr.markForCheck();

    const raw = this.form.value as LeadFormRawValue;

    this.leadService
      .submit(raw, {
        formLocation: this.formLocation,
        formLoadedAt: this.formLoadedAt,
        interactionCount: this.interactionCount
      })
      .subscribe({
        next: (result) => this.handleResult(result),
        error: (err) => {
          // eslint-disable-next-line no-console
          console.error('[LeadForm] Submit error', err);
          this.state = 'error_network';
          this.errorMessage = null;
          this.cdr.markForCheck();
        }
      });
  }

  private handleResult(result: LeadSubmitResult): void {
    switch (result.status) {
      case 'success':
      case 'spam_detected':
        // Para spam, mostramos success falso al usuario (no informar al bot).
        this.state = 'success';
        break;
      case 'rate_limited':
        this.state = 'error_rate_limited';
        this.errorMessage = result.message;
        break;
      case 'error':
        this.state = 'error_network';
        this.errorMessage = result.message || null;
        break;
    }
    this.cdr.markForCheck();
  }

  /**
   * Reset del form para enviar otro mensaje.
   */
  resetForm(): void {
    this.form.reset({
      name: '',
      company: '',
      email: '',
      phone: '',
      need: [],
      preferred_contact: [],
      message: '',
      website: '',
      url: ''
    });
    this.state = 'idle';
    this.errorMessage = null;
    this.formLoadedAt = Date.now();
    this.interactionCount = 0;
    this.cdr.markForCheck();
  }

  /**
   * Re-intento desde estado de error de red.
   */
  retry(): void {
    this.state = 'idle';
    this.errorMessage = null;
    this.cdr.markForCheck();
  }
}
