import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, output} from '@angular/core';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'lib-text-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true
    }
  ]
})
export class TextInputComponent implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('');
  readonly = input<boolean>(false);
  hasError = input<boolean>(false);
  errorMessage = input<string>('');
  helperText = input<string>('');
  showIcon = input<boolean>(true);

  valueChange = output<string>();
  blur = output<void>();
  focus = output<void>();
  enter = output<string>();

  internalValue: string = '';
  isDisabled: boolean = false;

  private onChange: (value: string) => void = () => { };
  private onTouched: () => void = () => { };

  writeValue(value: any): void {
    this.internalValue = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = target.value;

    this.internalValue = newValue;
    this.onChange(newValue);
    this.valueChange.emit(newValue);
  }

  onBlur(): void {
    this.onTouched();
    this.blur.emit();
  }

  onFocus(): void {
    this.focus.emit();
  }

  onEnter(): void {
    this.enter.emit(this.internalValue);
  }
}