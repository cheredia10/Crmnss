import { Component, input, output, model, ChangeDetectionStrategy, forwardRef, effect } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent } from '../../icons/components/icon.component';

@Component({
  selector: 'lib-input-1',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './input-1.component.html',
  styleUrls: ['./input-1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Buena práctica
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input1Component),
      multi: true
    }
  ]
})
export class Input1Component implements ControlValueAccessor {
  // Inputs usando la nueva sintaxis
  variant = input<'primary' | 'secondary' | 'danger'>('primary');
  size = input<'large' | 'medium' | 'small'>('medium');
  placeholder = input<string>('');
  leftIcon = input<string>();
  leftIconSize = input<string | number>();
  rightIcon = input<string>();
  rightIconSize = input<string | number>();
  type = input<'text' | 'password' | 'email' | 'number'>('text');
  width = input<string>('100%');
  height = input<string>('40px');

  // Model value para two-way binding
  value = model<string | number>('');
  // Eventos
  keyEnter = output<void>();
  valueChange = output<string>();

  // --- Implementación de ControlValueAccessor ---

  // Callbacks que Angular nos dará
  #onChange: (value: any) => void = () => { };
  #onTouched: () => void = () => { };
  disabled = model(false); // Usamos un model para el estado disabled

  constructor() {
    // Cuando el valor del input cambie (por el usuario),
    // notificamos a Angular Forms.
    effect(() => {
      this.#onChange(this.value());
    });
  }

  // Angular llama a este método para escribir un valor en nuestro componente
  writeValue(value: any): void {
    this.value.set(value);
  }

  // Angular nos da una función de callback para notificar cambios
  registerOnChange(fn: any): void {
    this.#onChange = fn;
  }

  // Angular nos da una función de callback para notificar el "touch"
  registerOnTouched(fn: any): void {
    this.#onTouched = fn;
  }

  // Angular llama a este método para habilitar/deshabilitar el control
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  // Método para manejar el evento 'blur' y notificar a Angular
  onBlur(): void {
    this.#onTouched();
  }
}