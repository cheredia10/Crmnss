import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

export type CheckboxVariant = 'error' | 'select';

@Component({
  selector: 'lib-checkbox-1',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkbox-1.component.html',
  styleUrl: './checkbox-1.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Checkbox1Component),
      multi: true
    }
  ]
})
export class Checkbox1Component implements ControlValueAccessor {
  // Inputs
  label = input<string>('');
  disabled = input<boolean>(false);
  variant = input<CheckboxVariant>('select');
  checked = input<boolean>(false);

  // Estado interno
  _checked = signal<boolean>(false);

  // Outputs
  checkedChange = output<boolean>();

  // ControlValueAccessor
  private onChange: any = () => { };
  private onTouched: any = () => { };

  onCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this._checked.set(target.checked);
    this.onChange(target.checked);
    this.checkedChange.emit(target.checked);
  }

  writeValue(value: boolean): void {
    this._checked.set(value || false);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Implementación para disabled state
  }
}
