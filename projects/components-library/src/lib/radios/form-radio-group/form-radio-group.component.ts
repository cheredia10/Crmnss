
import { Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioOption } from '../../../interfaces/radio-options.interface';
import { IconComponent } from '../../icons/components/icon.component';
import { TooltipDirective } from '../../tooltip/tooltip.directive';

@Component({
  selector: 'lib-form-radio-group',
  imports: [IconComponent, TooltipDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormRadioGroupComponent),
      multi: true
    }
  ],
  templateUrl: './form-radio-group.component.html',
  styleUrl: './form-radio-group.component.scss'
})
export class FormRadioGroupComponent implements ControlValueAccessor {
  // Inputs
  options = input<RadioOption[]>([]);
  name = input<string>(`radio-group-${Math.random().toString(36).substr(2, 9)}`);
  disabled = input<boolean>(false);
  direction = input<'horizontal' | 'vertical'>('horizontal');
  size = input<'small' | 'medium' | 'large'>('medium');
  // Nuevos inputs para ícono de información
  enableInfoIcons = input<boolean>(false);
  infoIconName = input<string>('info');
  // Inputs para configurar tooltip
  tooltipPosition = input<'top' | 'bottom' | 'left' | 'right'>('bottom');
  tooltipTheme = input<'normal' | 'dark'>('normal');

  // Outputs
  selectionChange = output<string | number | boolean>();
  // Nuevo output para eventos de ícono de información
  infoClick = output<{option: RadioOption, index: number}>();

  // State
  selectedValue = signal<string | number | boolean | null>(null);
  isTouched = signal<boolean>(false);
  isFocused = signal<boolean>(false);

  // ControlValueAccessor
  private onChange = (value: any) => { };
  private onTouched = () => { };

  // Computed
  isHorizontal = computed(() => this.direction() === 'horizontal');

  // Methods
  isSelected(value: string | number | boolean): boolean {
    return this.selectedValue() === value;
  }

  onSelectionChange(value: string | number | boolean): void {
    if (this.disabled()) return;

    this.selectedValue.set(value);
    this.onChange(value);
    this.selectionChange.emit(value);
  }

  onFocus(): void {
    this.isFocused.set(true);
  }

  onBlur(): void {
    this.isFocused.set(false);
    if (!this.isTouched()) {
      this.isTouched.set(true);
      this.onTouched();
    }
  }

  trackByValue(index: number, option: RadioOption): string | number | boolean {
    return option.value;
  }

  // Nuevo método para manejar click en ícono de información
  onInfoClick(option: RadioOption, index: number): void {
    this.infoClick.emit({ option, index });
  }

  // ControlValueAccessor implementation
  writeValue(value: string | number | boolean | null): void {
    this.selectedValue.set(value);
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // This would be handled by the disabled input in a real scenario
  }
}
