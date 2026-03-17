import { Component, input, output, model, forwardRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';

export interface DropdownOption {
  value: any;
  label: string;
}

@Component({
  selector: 'lib-select-1',
  imports: [FormsModule, ClickOutsideDirective],
  templateUrl: './select-1.component.html',
  styleUrl: './select-1.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Select1Component),
      multi: true
    }
  ]
})
export class Select1Component {
  // Inputs con la nueva sintaxis
  options = input<DropdownOption[]>([]);
  label = input<string>('');
  placeholder = input<string>('Seleccionar');
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  name = input<string>('');
  id = input<string>('');
  ariaLabel = input<string>('');
  customClass = input<string>('');
  width = input<string>('auto');

  // Output con la nueva sintaxis
  selectionChange = output<any>();

  // Modelo con la nueva sintaxis (para casos donde no necesitas ControlValueAccessor)
  // selectedValue = model<any>(null);

  isOpen: boolean = false;
  selectedValue: any = null;
  selectedLabel: string = '';

  // Implementación de ControlValueAccessor
  private onChange: any = () => {};
  private onTouched: any = () => {};

  toggleDropdown(): void {
    if (!this.disabled()) {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.onTouched();
      }
    }
  }

  closeDropdown(event: Event): void {
    event.stopPropagation();
    this.isOpen = false;
  }

  selectOption(option: DropdownOption, event: Event): void {
    event.stopPropagation();
    this.selectedValue = option.value;
    this.selectedLabel = option.label;
    this.isOpen = false;
    this.onChange(this.selectedValue);
    this.selectionChange.emit(this.selectedValue);
  }

  // Implementación de ControlValueAccessor
  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      this.selectedValue = value;
      const selectedOption = this.options().find(option => option.value === value);
      this.selectedLabel = selectedOption ? selectedOption.label : '';
    } else {
      this.selectedValue = null;
      this.selectedLabel = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // No podemos asignar directamente a this.disabled porque es una función
    // En un componente real, usarías un WritableSignal
  }
}
