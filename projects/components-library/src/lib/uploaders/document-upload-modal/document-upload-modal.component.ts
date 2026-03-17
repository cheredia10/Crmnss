import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, input, output, signal, ViewChild } from '@angular/core';
import { FileItemComponent } from '../file-item/file-item.component';
import { UploadProgressComponent } from '../upload-progress/upload-progress.component';
import { Button1Component, IconComponent } from '../../../public-api';
import { Divider1Component } from '../../dividers/divider-1/divider-1.component';

export interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'done' | 'error' | 'removed';
  progress?: number;
  error?: string;
  file?: File;
}

@Component({
  selector: 'lib-document-upload-modal',
  imports: [CommonModule, FileItemComponent, UploadProgressComponent, IconComponent, Divider1Component,
    Button1Component
  ],
  templateUrl: './document-upload-modal.component.html',
  styleUrl: './document-upload-modal.component.scss'
})
export class DocumentUploadModalComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Inputs
  isOpen = input<boolean>(false);
  title = input<string>('Carga de Documentos');
  subtitle = input<string>('Agrega tus documentos aquí');
  dropText = input<string>('Arrastra y suelta los archivos para iniciar la carga');
  selectButtonText = input<string>('Seleccionar archivos');
  documentsTitle = input<string>('Documentos cargados');
  allowMultiple = input<boolean>(true);
  acceptedTypes = input<string>('*/*');
  maxFileSize = input<number>(10 * 1024 * 1024); // 10MB

  // Outputs
  close = output<void>();
  filesSelected = output<File[]>();
  documentRemove = output<UploadedDocument>();
  documentDelete = output<UploadedDocument>();
  documentExpand = output<UploadedDocument>();
  documentView = output<UploadedDocument>();
  uploadPause = output<void>();
  uploadCancel = output<void>();

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

  onSelectFiles(event: Event): void {
    event.stopPropagation();
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

  // Private methods
  private handleFileSelection(files: File[]): void {
    const validFiles = files.filter(file => this.validateFile(file));

    if (validFiles.length > 0) {
      this.filesSelected.emit(validFiles);
    }
  }

  // Agregar un método para eliminar un documento por ID
  removeDocumentById(id: string): void {
    this.documents.update(docs => docs.filter(d => d.id !== id));
  }

  private validateFile(file: File): boolean {
    // Validate file size
    if (file.size > this.maxFileSize()) {
      console.warn(`File ${file.name} exceeds maximum size`);
      return false;
    }

    // Add more validations as needed
    return true;
  }

  
  // Public methods for external control
  addDocument(document: UploadedDocument): void {
    // Verificar si el documento ya existe para evitar duplicados
    const exists = this.documents().some(doc => doc.id === document.id);
    if (!exists) {
      this.documents.update(docs => [...docs, document]);
    }
  }

  // También podemos agregar un método para agregar múltiples documentos
  addDocuments(docs: UploadedDocument[]): void {
    // Filtrar documentos que ya existen
    const newDocs = docs.filter(doc =>
      !this.documents().some(existingDoc => existingDoc.id === doc.id)
    );

    if (newDocs.length > 0) {
      this.documents.update(currentDocs => [...currentDocs, ...newDocs]);
    }
  }

  updateDocument(id: string, updates: Partial<UploadedDocument>): void {
    // Si el estado es 'removed', eliminar el documento
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

  clearDocuments(): void {
    this.documents.set([]);
  }

  getDocuments(): UploadedDocument[] {
    return this.documents();
  }
}
