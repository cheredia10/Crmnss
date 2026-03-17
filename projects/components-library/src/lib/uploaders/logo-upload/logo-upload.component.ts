import { ChangeDetectionStrategy, Component, computed, ElementRef, input, output, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'lib-logo-upload',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './logo-upload.component.html',
  styleUrl: './logo-upload.component.scss'
})
export class LogoUploadComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Inputs
  acceptedTypes = input<string>('.jpg,.jpeg,.png,.svg');
  maxSizeKB = input<number>(2048); // 2MB por defecto
  placeholder = input<string>('Subir logo');
  disabled = input<boolean>(false);

  // Outputs
  fileSelected = output<File>();
  fileRemoved = output<void>();
  error = output<string>();

  // State
  selectedFile = signal<File | null>(null);
  isDragOver = signal<boolean>(false);
  previewUrl = signal<string>('');
  errorMessage = signal<string>('');

  // Computed
  hasFile = computed(() => this.selectedFile() !== null);
  hasError = computed(() => this.errorMessage() !== '');

  triggerFileInput(): void {
    if (this.disabled()) return;
    this.fileInput.nativeElement.click();
  }

  onFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      this.handleFile(file);
    }
    target.value = '';
  }

  onDragOver(event: DragEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.isDragOver.set(false);

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  private handleFile(file: File): void {
    this.clearError();

    // Validar tipo de archivo
    const acceptedTypes = this.acceptedTypes().split(',').map(t => t.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      this.setError('Tipo de archivo no permitido. Use: ' + this.acceptedTypes());
      return;
    }

    // Validar tamaño
    const maxSizeBytes = this.maxSizeKB() * 1024;
    if (file.size > maxSizeBytes) {
      this.setError(`El archivo es muy grande. Máximo ${this.maxSizeKB()}KB`);
      return;
    }

    // Archivo válido
    this.selectedFile.set(file);
    this.createPreview(file);
    this.fileSelected.emit(file);
  }

  private createPreview(file: File): void {
    if (this.previewUrl()) {
      URL.revokeObjectURL(this.previewUrl());
    }

    const url = URL.createObjectURL(file);
    this.previewUrl.set(url);
  }

  removeFile(): void {
    if (this.previewUrl()) {
      URL.revokeObjectURL(this.previewUrl());
    }

    this.selectedFile.set(null);
    this.previewUrl.set('');
    this.clearError();
    this.fileRemoved.emit();
  }

  private setError(message: string): void {
    this.errorMessage.set(message);
    this.error.emit(message);
  }

  private clearError(): void {
    this.errorMessage.set('');
  }

  ngOnDestroy(): void {
    if (this.previewUrl()) {
      URL.revokeObjectURL(this.previewUrl());
    }
  }
}
