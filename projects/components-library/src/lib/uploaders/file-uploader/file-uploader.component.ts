import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, inject, input, output, signal, ViewChild } from '@angular/core';
import { FileItemComponent } from '../file-item/file-item.component';
import { UploadProgressComponent } from '../upload-progress/upload-progress.component';
import { IconComponent } from '../../icons/components/icon.component';
import { Divider1Component } from '../../dividers/divider-1/divider-1.component';
import { Button1Component } from '../../buttons/button-1/button-1.component';

export interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'done' | 'error' | 'removed' | 'view';
  progress?: number;
  error?: string;
  file?: File;
}

@Component({
  selector: 'lib-file-uploader',
  standalone: true,
  imports: [CommonModule, FileItemComponent, UploadProgressComponent, IconComponent, Divider1Component,
    Button1Component],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss'
})
export class FileUploaderComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  // --- NUEVO INPUT ---
  // Controla el modo de visualización del componente.
  // 'modal': Muestra el componente dentro de un modal con fondo, título y botón de cierre.
  // 'inline': Muestra solo el área de carga y la lista de archivos.
  mode = input<'modal' | 'inline'>('inline');

  // Inputs
  isOpen = input<boolean>(false); // 'isOpen' ahora solo afecta al modo 'modal'
  title = input<string>('Carga de Documentos');
  subtitle = input<string>('Agrega tus documentos aquí');
  dropText = input<string>('Arrastra y suelta los archivos para iniciar la carga');
  selectButtonText = input<string>('Seleccionar archivos');
  documentsTitle = input<string>('Documentos cargados');
  allowMultiple = input<boolean>(true);
  acceptedTypes = input<string>('*/*');
  maxFileSize = input<number>(10 * 1024 * 1024); // 10MB

  // Outputs
  close = output<void>(); // 'close' se emitirá desde el modo 'modal'
  filesSelected = output<File[]>();
  documentRemove = output<UploadedDocument>();
  documentDelete = output<UploadedDocument>();
  documentExpand = output<UploadedDocument>();
  documentView = output<UploadedDocument>();
  uploadPause = output<void>();
  uploadCancel = output<void>();
  fileValidationError = output<{title: string, message: string, fileName: string, maxSize: number}>();

  // El resto de la lógica del componente no necesita cambios significativos.
  // ... (el resto de tu código TS permanece igual) ...

  // Internal state
  documents = signal<UploadedDocument[]>([]);
  isDragOver = signal<boolean>(false);
  globalUploadProgress = signal<{
    show: boolean;
    progress: number;
    text: string;
    details: string;
  } | null>(null);

  // Computed
  overallProgress = computed(() => {
    const docs = this.documents();
    if (docs.length === 0) return 0;
    const totalProgress = docs.reduce((sum, doc) => {
      if (doc.status === 'done') return sum + 100;
      if (doc.status === 'uploading' && doc.progress) return sum + doc.progress;
      return sum;
    }, 0);
    return totalProgress / docs.length;
  });

  // Methods
  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(): void {
    this.onClose();
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
      this.handleFileSelection(filesArray);
    }
  }

  onDropZoneClick(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const filesArray = Array.from(input.files);
      this.handleFileSelection(filesArray);
    }
  }

  onRemoveDocument(doc: UploadedDocument): void {
    this.documents.update(docs => docs.filter(d => d.id !== doc.id));
    this.documentRemove.emit(doc);
  }

  onDeleteDocument(doc: UploadedDocument): void {
    this.documents.update(docs => docs.filter(d => d.id !== doc.id));
    this.documentDelete.emit(doc);
  }

  onExpandDocument(doc: UploadedDocument): void {
    this.documentExpand.emit(doc);
  }

  onViewDocument(doc: UploadedDocument): void {
    this.documentView.emit(doc);
  }

  onUploadPause(): void {
    this.uploadPause.emit();
  }

  onUploadCancel(): void {
    this.uploadCancel.emit();
    this.globalUploadProgress.set(null);
  }

  trackByDocId(index: number, doc: UploadedDocument): string {
    return doc.id;
  }

  private handleFileSelection(files: File[]): void {
    const validFiles = files.filter(file => this.validateFile(file));
    if (validFiles.length > 0) {
      this.filesSelected.emit(validFiles);
    }
  }

  removeDocumentById(id: string): void {
    this.documents.update(docs => docs.filter(d => d.id !== id));
  }

  private validateFile(file: File): boolean {
    if (file.size > this.maxFileSize()) {
      console.warn(`File ${file.name} exceeds maximum size`);

      // Emitir evento para que el padre maneje la alerta
      this.fileValidationError.emit({
        title: 'Error de Validación',
        message: `El archivo ${file.name} excede el tamaño máximo permitido de ${this.maxFileSize() / 1024 / 1024} MB.`,
        fileName: file.name,
        maxSize: this.maxFileSize()
      });

      return false;
    }
    return true;
  }

  // Public methods for external control
  addDocument(document: UploadedDocument): void {
    const exists = this.documents().some(doc => doc.id === document.id);
    if (!exists) {
      this.documents.update(docs => [...docs, document]);
    }
  }

  addDocuments(docs: UploadedDocument[]): void {
    const newDocs = docs.filter(doc =>
      !this.documents().some(existingDoc => existingDoc.id === doc.id)
    );
    if (newDocs.length > 0) {
      this.documents.update(currentDocs => [...currentDocs, ...newDocs]);
    }
  }

  updateDocument(id: string, updates: Partial<UploadedDocument>): void {
    if (updates.status === 'removed') {
      this.removeDocumentById(id);
      return;
    }
    this.documents.update(docs =>
      docs.map(doc =>
        doc.id === id ? { ...doc, ...updates } : doc
      )
    );
  }

  setGlobalProgress(progress: number, text: string, details: string): void {
    this.globalUploadProgress.set({ show: true, progress, text, details });
  }

  hideGlobalProgress(): void {
    this.globalUploadProgress.set(null);
  }

  clearDocuments(): void {
    this.documents.set([]);
  }

  getDocuments(): UploadedDocument[] {
    return this.documents();
  }
}
