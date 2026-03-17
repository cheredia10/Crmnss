
import { Component, computed, effect, ElementRef, input, output, signal, ViewChild } from '@angular/core';
import { OrganigramaOption } from '../../../interfaces/organigrama-option.interface';
import { DirectoryOption } from '../../../interfaces/directory-option.interface';
import { IconComponent } from '../../icons/components/icon.component';

@Component({
  selector: 'lib-box-uploader',
  imports: [IconComponent],
  templateUrl: './box-uploader.component.html',
  styleUrl: './box-uploader.component.scss'
})
export class BoxUploaderComponent {
  // Obtenemos una referencia a nuestro <input #fileInput> del template
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Inputs
  title = input<string>('Cargar Organigrama');
  options = input<OrganigramaOption[]>([]);
  searchPlaceholder = input<string>('Seleccionar archivo...');
  showFileSelector = input<boolean>(true);
  acceptedTypes = input<string>('.pdf,.doc,.docx,.jpg,.jpeg,.png');
  allowMultiple = input<boolean>(false);
  dropZoneText = input<string>('Arrastrar los archivos a cargar');
  disableUpload = input<boolean>(false);
  existingDocumentUrl = input<string>(''); // Nueva propiedad para URL externa
  existingDocumentName = input<string>(''); // Nueva propiedad para nombre del documento

  // i18n: Textos configurables desde la app padre
  fileLabelSingular = input<string>('Archivo');
  fileLabelPlural = input<string>('Archivos');
  deleteButtonText = input<string>('BORRAR');
  uploadButtonText = input<string>('CARGAR DOCUMENTO');
  downloadButtonLabel = input<string>('Ver documento');
  infoButtonLabel = input<string>('Información');

  // Outputs
  optionSelected = output<OrganigramaOption>();
  filesSelected = output<File[]>();
  fileSelected = output<File>(); // Archivo seleccionado desde el selector
  download = output<OrganigramaOption>();
  viewDocument = output<{ url: string; name: string }>(); // Nuevo output para ver documentos
  info = output<void>();
  delete = output<void>();
  upload = output<{ option: OrganigramaOption; files: File[] }>();
  uploadFiles = output<{ selectedFile?: File; files: File[] }>();

  // State
  selectedOption = signal<OrganigramaOption | null>(null);
  selectedFileName = signal<string>('');
  //selectedFile = signal<File | null>(null);
  uploadedFiles = signal<File[]>([]);
  isDragOver = signal<boolean>(false);
  documentUrl = signal<string>(''); // URL para previsualizar documento (local o externa)
  // ¡NUEVA SEÑAL COMPUTADA!
  // Devuelve el primer archivo del array, o undefined si el array está vacío.
  selectedFile = computed(() => this.uploadedFiles()[0]);

  // Computed
  fileCount = computed(() => this.uploadedFiles().length);
  hasDocument = computed(() => 
    this.documentUrl() !== '' || this.existingDocumentUrl() !== '' || this.uploadedFiles().length > 0
  );

  constructor() {
    // Effect para cargar documento existente cuando se proporciona
    effect(() => {
      const existingUrl = this.existingDocumentUrl();
      const existingName = this.existingDocumentName();
      
      if (existingUrl && !this.selectedFileName()) {
        this.selectedFileName.set(existingName || 'Documento existente');
      }
    });
  }

  // Methods
  onOptionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedId = target.value;
    const option = this.options().find(opt => opt.id === selectedId);

    if (option) {
      this.selectedOption.set(option);
      this.optionSelected.emit(option);
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
    const files = Array.from(event.dataTransfer?.files || []);
    this.handleFiles(files);
  }

  // Este método es llamado por el FALSO SELECT y por el DRAG ZONE
  triggerFileInput(): void {
    // Usamos la referencia de @ViewChild para hacer clic en el input oculto
    this.fileInput.nativeElement.click();
  }

  // Este único método maneja los archivos seleccionados desde el explorador
  onFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files || []);
    this.handleFiles(files);
    // Limpiamos el valor para que el evento (change) se dispare aunque se seleccione el mismo archivo
    target.value = '';
  }

  // Un solo método para procesar los archivos, ya sea por drop o por selección
  private handleFiles(files: File[]): void {
    if (files.length === 0) return;

    const newFiles = this.allowMultiple() ? files : [files[0]];

    // Si no se permiten múltiples, reemplazamos. Si se permiten, los añadimos.
    // Para este caso, parece que siempre quieres reemplazar.
    this.uploadedFiles.set(newFiles);

    // Actualizamos el nombre mostrado en el falso select
    this.selectedFileName.set(newFiles[0].name);

    // Generar URL del archivo local para previsualización
    if (newFiles[0]) {
      const url = URL.createObjectURL(newFiles[0]);
      this.documentUrl.set(url);
    }

    // Emitimos los eventos de salida
    this.filesSelected.emit(newFiles);
  }

  onDownload(): void {
    // Prioridad: URL de archivo local > URL externa > opción seleccionada (backward compatibility)
    if (this.documentUrl()) {
      // Archivo local cargado - abrir URL generada
      this.viewDocument.emit({ 
        url: this.documentUrl(), 
        name: this.selectedFileName() || 'Documento' 
      });
    } else if (this.existingDocumentUrl()) {
      // URL externa proporcionada
      this.viewDocument.emit({ 
        url: this.existingDocumentUrl(), 
        name: this.existingDocumentName() || 'Documento existente' 
      });
    } else {
      // Backward compatibility con el sistema anterior
      const option = this.selectedOption();
      if (option) {
        this.download.emit(option);
      }
    }
  }

  onInfo(): void {
    this.info.emit();
  }

  onDelete(): void {
    // Limpiar URL del objeto para liberar memoria
    if (this.documentUrl()) {
      URL.revokeObjectURL(this.documentUrl());
      this.documentUrl.set('');
    }
    
    this.uploadedFiles.set([]);
    this.selectedFileName.set('');
    this.delete.emit();
  }

  onUpload(): void {
    const option = this.selectedOption();
    const files = this.uploadedFiles();

    if (option && files.length > 0) {
      this.upload.emit({ option, files });
    }
  }


  onUploadFiles(): void {
    const files = this.uploadedFiles();
    const selectedFile = this.selectedFile();

    if (files.length > 0) {
      this.uploadFiles.emit({ selectedFile: selectedFile || undefined, files });
    }
  }
}
