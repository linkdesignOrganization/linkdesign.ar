import {
  Component,
  Input,
  forwardRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

export interface ChipOption {
  value: string;
  /** Key de ngx-translate para mostrar el label. */
  labelKey: string;
  /** Clase de Bootstrap Icons opcional (ej: 'bi-envelope'). */
  icon?: string;
}

/**
 * ChipSelectComponent — selector de chips (multi-select).
 *
 * Permite seleccionar una o varias opciones simultáneamente.
 * Implementa ControlValueAccessor para integrarse con Reactive Forms:
 *   <app-chip-select formControlName="need" [options]="NEED_OPTIONS"></app-chip-select>
 *
 * Value: string[] (array de valores seleccionados, vacío si no hay selección).
 * Click toggle: si ya está seleccionado, lo deselecciona; si no, lo agrega.
 *
 * Accesibilidad:
 *   - role="group" / role="checkbox"
 *   - aria-checked, aria-disabled
 *   - keyboard: Space/Enter toggle; tab order natural
 *
 * Backward compat: writeValue acepta string o string[] (convierte automáticamente).
 */
@Component({
  selector: 'app-chip-select',
  templateUrl: './chip-select.component.html',
  styleUrls: ['./chip-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipSelectComponent),
      multi: true
    }
  ]
})
export class ChipSelectComponent implements ControlValueAccessor {
  @Input() options: ChipOption[] = [];
  @Input() name = '';
  @Input() ariaLabel = '';
  @Input() invalid = false;

  selectedValues: string[] = [];
  disabled = false;

  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  // ControlValueAccessor
  writeValue(value: string[] | string | null): void {
    if (Array.isArray(value)) {
      this.selectedValues = [...value];
    } else if (value) {
      this.selectedValues = [value];
    } else {
      this.selectedValues = [];
    }
    this.cdr.markForCheck();
  }
  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  // UI
  toggle(option: ChipOption): void {
    if (this.disabled) return;
    const idx = this.selectedValues.indexOf(option.value);
    if (idx >= 0) {
      // Deselect
      this.selectedValues = this.selectedValues.filter((v) => v !== option.value);
    } else {
      // Select (preservando el orden de selección)
      this.selectedValues = [...this.selectedValues, option.value];
    }
    this.onChange(this.selectedValues);
    this.onTouched();
    this.cdr.markForCheck();
  }

  isSelected(value: string): boolean {
    return this.selectedValues.includes(value);
  }

  onKeydown(event: KeyboardEvent, option: ChipOption): void {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.toggle(option);
    }
  }

  trackByValue = (_: number, option: ChipOption) => option.value;
}
