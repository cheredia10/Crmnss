import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DocxFileComponent } from '../docx-file/docx-file.component';
import { XlsFileComponent } from '../xls-file/xls-file.component';
import { PdfFileComponent } from '../pdf-file/pdf-file.component';
import { JpgFileComponent } from '../jpg-file/jpg-file.component';

export type FileUploadStatus = 'default' | 'focused' | 'uploading' | 'done' | 'error' | 'view';

export interface UploadFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: FileUploadStatus;
  progress?: number;
  error?: string;
  url?: string;
  uploadTime?: number;
  remainingTime?: number;
  file?: File;
}

@Component({
  selector: 'lib-file-upload',
  imports: [CommonModule, FormsModule, DocxFileComponent, XlsFileComponent, PdfFileComponent,
    JpgFileComponent
  ],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  // Inputs
  files = input<UploadFile[]>([]);
  allowMultiple = input<boolean>(true);
  acceptedTypes = input<string>('*/*');
  maxFileSize = input<number>(10 * 1024 * 1024); // 10MB
  showUrlInput = input<boolean>(true);
  showDropZone = input<boolean>(true);
  urlPlaceholder = input<string>('Añadir URL del archivo');

  // Outputs
  fileSelect = output<File[]>();
  fileRemove = output<UploadFile>();
  fileDelete = output<UploadFile>();
  fileView = output<UploadFile>();
  fileExpand = output<UploadFile>();
  urlUpload = output<string>();
  uploadPause = output<void>();
  uploadCancel = output<void>();

  // Internal state
  urlValue = signal<string>('');
  isUrlFocused = signal<boolean>(false);
  urlUploadStatus = signal<'default' | 'uploading'>('default');
  isDragOver = signal<boolean>(false);
  globalUploadProgress = signal<{
    show: boolean;
    progress: number;
    text: string;
    details: string;
  } | null>(null);

  // Methods
  onUrlFocus(): void {
    this.isUrlFocused.set(true);
  }

  onUrlBlur(): void {
    this.isUrlFocused.set(false);
  }

  onUrlUpload(): void {
    const url = this.urlValue().trim();
    if (url) {
      this.urlUploadStatus.set('uploading');
      this.urlUpload.emit(url);
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const filesArray = Array.from(input.files);
      this.fileSelect.emit(filesArray);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);

    if (event.dataTransfer?.files) {
      const filesArray = Array.from(event.dataTransfer.files);
      this.fileSelect.emit(filesArray);
    }
  }

  onDropZoneClick(): void {
    const fileInput = document.querySelector('.file-input') as HTMLInputElement;
    fileInput?.click();
  }

  onRemoveFile(file: UploadFile): void {
    this.fileRemove.emit(file);
  }

  onDeleteFile(file: UploadFile): void {
    this.fileDelete.emit(file);
  }

  onViewFile(file: UploadFile): void {
    this.fileView.emit(file);
  }

  onExpandFile(file: UploadFile): void {
    this.fileExpand.emit(file);
  }

  onPauseUpload(): void {
    this.uploadPause.emit();
  }

  onCancelUpload(): void {
    this.uploadCancel.emit();
  }

  // Utility methods
  trackByFileId(index: number, file: UploadFile): string {
    return file.id;
  }

  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toUpperCase() || '';
  }

  getFileTypeClass(type: string): string {
    const extension = type.toLowerCase();
    if (extension.includes('pdf')) return 'pdf';
    if (extension.includes('image') || extension.includes('jpg') || extension.includes('jpeg') || extension.includes('png')) return 'image';
    if (extension.includes('excel') || extension.includes('xls') || extension.includes('xlsx')) return 'excel';
    if (extension.includes('word') || extension.includes('doc')) return 'word';
    return 'document';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(0)) + ' ' + sizes[i];
  }

  // Public methods for external control
  setGlobalProgress(progress: number, text: string, details: string): void {
    this.globalUploadProgress.set({
      show: true,
      progress,
      text,
      details
    });
  }

  hideGlobalProgress(): void {
    this.globalUploadProgress.set(null);
  }

  setUrlUploadStatus(status: 'default' | 'uploading'): void {
    this.urlUploadStatus.set(status);
  }

  clearUrl(): void {
    this.urlValue.set('');
  }
}
