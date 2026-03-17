import { CommonModule } from '@angular/common';
import { Component, computed, effect, forwardRef, input, output, signal } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';

export interface Select3Option {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'lib-select-3',
  standalone: true,
  imports: [CommonModule, FormsModule, ClickOutsideDirective],
  templateUrl: './select-3.component.html',
  styleUrl: './select-3.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Select3Component),
      multi: true
    }
  ]
})
export class Select3Component {
  // Inputs
  options = input<Select3Option[]>([]);
  placeholder = input<string>('Seleccionar');
  disabled = input<boolean>(false);
  width = input<string>('auto');
  fontSize = input<string>('14px');
  textColor = input<string>('#000');
  backgroundColor = input<string>('transparent');
  customClass = input<string>('');
  customId = input<string>('');
  selected = input<any | null>(null);

  // Outputs
  selectionChange = output<any>();

  // Estado interno
  isOpen = signal<boolean>(false);
  selectedValue = signal<any>(null);

  // ControlValueAccessor
  private onChange: any = () => {};
  private onTouched: any = () => {};

  // Computed
  selectedOption = computed(() => {
    const value = this.selectedValue();
    return this.options().find(option => option.value === value) || null;
  });

  displayText = computed(() => {
    const selected = this.selectedOption();
    return selected ? selected.label : this.placeholder();
  });

  containerStyle = computed(() => ({
    width: this.width(),
    fontSize: this.fontSize(),
    color: this.textColor(),
    backgroundColor: this.backgroundColor()
  }));

  // Efecto para inicializar el valor seleccionado externo
  constructor() {
    effect(() => {
      const externalValue = this.selected();
      if (externalValue !== null && this.selectedValue() === null) {
        this.selectedValue.set(externalValue);
      }
    });
  }

  // Métodos
  toggleDropdown(event: Event): void {
    event.stopPropagation();
    if (!this.disabled()) {
      this.isOpen.set(!this.isOpen());
      if (this.isOpen()) {
        this.onTouched();
      }
    }
  }

  selectOption(option: Select3Option, event: Event): void {
    event.stopPropagation();
    if (!option.disabled) {
      this.selectedValue.set(option.value);
      this.isOpen.set(false);
      this.onChange(option.value);
      this.selectionChange.emit(option.value);
    }
  }

  closeDropdown(): void {
    this.isOpen.set(false);
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.selectedValue.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // InputSignals are read-only, we can't modify them directly
    // No action needed since disabled is an input signal
  }
}
