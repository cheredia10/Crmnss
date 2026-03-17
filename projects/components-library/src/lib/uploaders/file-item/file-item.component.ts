import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { DocxFileComponent } from '../docx-file/docx-file.component';
import { XlsFileComponent } from '../xls-file/xls-file.component';
import { JpgFileComponent } from '../jpg-file/jpg-file.component';
import { PdfFileComponent } from '../pdf-file/pdf-file.component';
import { IconComponent } from '../../../public-api';

export type FileItemStatus = 'done' | 'uploading' | 'error' | 'default' | 'focused' | 'uploading_loading' | 'view' | 'removed';

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  status: FileItemStatus;
  progress?: number;
  error?: string;
  url?: string;
  uploadTime?: number;
  remainingTime?: number;
}

@Component({
  selector: 'lib-file-item',
  imports: [CommonModule,DocxFileComponent, XlsFileComponent, PdfFileComponent,
    JpgFileComponent, IconComponent],
  templateUrl: './file-item.component.html',
  styleUrl: './file-item.component.scss'
})
export class FileItemComponent {
  // Inputs
  name = input<string>('');
  size = input<number>(0);
  type = input<string>('');
  status = input<FileItemStatus>('default');
  progress = input<number | undefined>(undefined);
  error = input<string>('');
  url = input<string>('');

  // Outputs
  remove = output<void>();
  delete = output<void>();
  expand = output<void>();
  view = output<void>();

  // Methods
  onRemove(): void {
    this.remove.emit();
  }

  onDelete(): void {
    this.delete.emit();
  }

  onExpand(): void {
    this.expand.emit();
  }

  onView(): void {
    this.view.emit();
  }

  getFileExtension(): string {
    return this.name().split('.').pop()?.toUpperCase() || '';
  }

  getFileTypeClass(): string {
    const extension = this.type().toLowerCase();
    const fileName = this.name().toLowerCase();

    if (extension.includes('pdf') || fileName.includes('.pdf')) return 'pdf';
    if (extension.includes('image') || fileName.includes('.jpg') || fileName.includes('.jpeg') || fileName.includes('.png')) return 'image';
    if (extension.includes('excel') || fileName.includes('.xls') || fileName.includes('.xlsx')) return 'excel';
    if (extension.includes('word') || fileName.includes('.doc') || fileName.includes('.docx')) return 'word';
    return 'document';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(0)) + sizes[i].toLowerCase();
  }
}
