import { Component, input, model, forwardRef, ChangeDetectionStrategy, signal, computed, effect, inject, DestroyRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule, FormControl } from '@angular/forms';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StatusBadgeComponent } from '../../badges/status-badge/status-badge.component';

export interface StatusOption {
  value: string;
  label: string;
  backgroundColor: string;
  textColor: string;
}

@Component({
  selector: 'lib-status-select',
  standalone: true,
  imports: [ClickOutsideDirective, FormsModule, StatusBadgeComponent],
  templateUrl: './status-select.component.html',
  styleUrl: './status-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StatusSelectComponent),
      multi: true
    }
  ]
})
export class StatusSelectComponent implements ControlValueAccessor {
  private readonly destroyRef = inject(DestroyRef);

  // --- Inputs ---
  options = input.required<StatusOption[]>();
  placeholder = input<string>('Seleccionar estado');
  id = input<string>();
  width = input<string>('100%');
  label = input<string>();
  customClass = input<string>();
  control = input<FormControl | undefined>(undefined);

  // --- State Signals ---
  isOpen = signal(false);
  value = model<any>(null);
  isDisabled = signal(false);

  // Signal to track control status changes for error detection
  private controlStatusTrigger = signal(0);
  // Track previous control state for automatic detection
  private lastControlState = signal<{touched: boolean, dirty: boolean, invalid: boolean} | null>(null);

  // `computed` para detectar errores de validación
  hasError = computed(() => {
    const ctrl = this.control();
    if (!ctrl) return false;
    
    // Include the trigger signal to force re-computation when control state changes
    this.controlStatusTrigger();
    
    return ctrl.invalid && (ctrl.dirty || ctrl.touched);
  });

  // `computed` para obtener la opción seleccionada
  selectedOption = computed(() => {
    const currentValue = this.value();
    return this.options().find(option => option.value === currentValue) || null;
  });

  // `computed` para obtener las opciones como formato para StatusBadge
  statusOptions = computed(() => {
    const opts: Record<string, { label: string; backgroundColor: string; textColor: string }> = {};
    this.options().forEach(option => {
      opts[option.value] = {
        label: option.label,
        backgroundColor: option.backgroundColor,
        textColor: option.textColor
      };
    });
    return opts;
  });

  // Callbacks para ControlValueAccessor
  #onChange: (value: any) => void = () => { };
  #onTouched: () => void = () => { };

  constructor() {
    // Sincroniza el model() con el CVA onChange
    effect(() => {
      this.#onChange(this.value());
    });

    // Effect para manejar el control externo
    effect(() => {
      const externalControl = this.control();
      if (externalControl) {
        // 1. Sincronizamos el valor del control externo con nuestro valor interno
        externalControl.valueChanges
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(newValue => {
            this.value.set(newValue);
          });

        // 2. Sincronizamos el estado de deshabilitado y otros cambios de estado
        externalControl.statusChanges
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.isDisabled.set(externalControl.disabled);
            // Trigger re-computation of hasError when control state changes
            this.controlStatusTrigger.update(v => v + 1);
          });

        // 3. Establecemos los valores iniciales
        this.value.set(externalControl.value);
        this.isDisabled.set(externalControl.disabled);

        // 4. Set initial control state
        this.lastControlState.set({
          touched: externalControl.touched,
          dirty: externalControl.dirty,
          invalid: externalControl.invalid
        });
      }
    });
  }

  toggleDropdown(): void {
    if (this.isDisabled()) return;
    this.isOpen.update(open => !open);
    if (this.isOpen()) {
      this.#onTouched();
      const ctrl = this.control();
      if (ctrl) {
        ctrl.markAsTouched();
        // Update control state tracking when user interacts
        this.lastControlState.set({
          touched: true,
          dirty: ctrl.dirty,
          invalid: ctrl.invalid
        });
        this.controlStatusTrigger.update(v => v + 1);
      }
    }
  }

  closeDropdown(): void {
    this.isOpen.set(false);
  }

  selectOption(option: StatusOption, event: Event): void {
    event.stopPropagation();

    // Al seleccionar una opción, actualizamos tanto el control externo (si existe)
    // como nuestro `model` interno.
    const ctrl = this.control();
    if (ctrl) {
      ctrl.setValue(option.value);
      ctrl.markAsDirty();
      // Update control state tracking when value changes
      this.lastControlState.set({
        touched: ctrl.touched,
        dirty: true,
        invalid: ctrl.invalid
      });
      this.controlStatusTrigger.update(v => v + 1);
    }
    this.value.set(option.value);

    this.closeDropdown();
  }

  // --- CVA Methods ---
  writeValue(value: any): void {
    this.value.set(value);
  }

  registerOnChange(fn: any): void {
    this.#onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.#onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}