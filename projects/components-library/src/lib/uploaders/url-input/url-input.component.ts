import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type UrlInputStatus = 'default' | 'focused' | 'uploading';

@Component({
  selector: 'lib-url-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './url-input.component.html',
  styleUrl: './url-input.component.scss'
})
export class UrlInputComponent {
  // Inputs
  placeholder = input<string>('Añadir URL del archivo');
  buttonText = input<string>('Cargar');
  loadingText = input<string>('Cargando...');
  status = input<UrlInputStatus>('default');

  // Outputs
  urlUpload = output<string>();
  focusChange = output<boolean>();

  // Internal state
  urlValue = signal<string>('');

  // Methods
  onFocus(): void {
    this.focusChange.emit(true);
  }

  onBlur(): void {
    this.focusChange.emit(false);
  }

  onUpload(): void {
    const url = this.urlValue().trim();
    if (url && this.status() !== 'uploading') {
      this.urlUpload.emit(url);
    }
  }

  // Public methods
  setValue(value: string): void {
    this.urlValue.set(value);
  }

  getValue(): string {
    return this.urlValue();
  }

  clear(): void {
    this.urlValue.set('');
  }
}
