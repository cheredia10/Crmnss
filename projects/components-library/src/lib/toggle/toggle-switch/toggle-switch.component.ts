import { Component, input, output, forwardRef, signal, effect } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'lib-toggle-switch',
  standalone: true,
  templateUrl: './toggle-switch.component.html',
  styleUrl: './toggle-switch.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleSwitchComponent),
      multi: true
    }
  ]
})
export class ToggleSwitchComponent implements ControlValueAccessor {
  // Inputs
  value = input<boolean>(false);
  disabled = input<boolean>(false);
  size = input<'small' | 'medium' | 'large'>('medium');

  // Output
  toggled = output<boolean>();

  // Internal state
  isChecked = signal<boolean>(false);

  constructor() {
    // Effect to sync input value with internal state
    effect(() => {
      this.isChecked.set(this.value());
    });
  }

  // ControlValueAccessor callbacks
  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  toggle(): void {
    if (this.disabled()) return;

    this.isChecked.update(value => !value);
    this.onChange(this.isChecked());
    this.onTouched();
    this.toggled.emit(this.isChecked());
  }

  // ControlValueAccessor implementation
  writeValue(value: boolean): void {
    this.isChecked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // El disabled se maneja via input, no necesitamos hacer nada aquí
  }
}