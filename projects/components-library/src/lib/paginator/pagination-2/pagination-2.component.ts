
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'lib-pagination-2',
  standalone: true,
  imports: [],
  templateUrl: './pagination-2.component.html',
  styleUrl: './pagination-2.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pagination2Component {
  // --- ENTRADAS (Inputs) ---
  currentPage = input.required<number>();
  totalItems = input.required<number>();
  pageSize = input<number>(6);
  pageRange = input<number>(2);

  // Controles izquierdos
  pageSizeOptions = input<number[]>([6, 10, 20, 50]);
  showDownload = input<boolean>(true);
  downloadOptions = input<{ label: string; value: string }[]>([
    { label: 'CSV', value: 'csv' },
    { label: 'XLSX', value: 'xlsx' },
    { label: 'PDF', value: 'pdf' },
  ]);

  // i18n: Textos configurables desde la app padre
  itemsPerPageLabel = input<string>('items por hoja');
  downloadTableLabel = input<string>('Descargar Tabla');
  pageSizeAriaLabel = input<string>('Cambiar items por hoja');
  downloadOptionsAriaLabel = input<string>('Opciones de descarga');
  paginationAriaLabel = input<string>('Paginación');
  previousPageAriaLabel = input<string>('Página anterior');
  nextPageAriaLabel = input<string>('Página siguiente');
  goToPageAriaLabel = input<string>('Ir a la página');
  tableControlsAriaLabel = input<string>('Controles de tabla y paginación');

  // --- SALIDAS (Outputs) ---
  pageChange = output<number>();
  pageSizeChange = output<number>();
  download = output<string>(); // solo emite; exportación real se añadirá después

  // --- STATE LOCAL ---
  readonly isSizeOpen = signal(false);
  readonly isDownloadOpen = signal(false);

  constructor(private host: ElementRef<HTMLElement>) { }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.isSizeOpen.set(false);
      this.isDownloadOpen.set(false);
    }
  }

  // --- SIGNALS CALCULADOS ---
  readonly totalPages = computed(() => {
    const size = this.pageSize();
    const totalItems = this.totalItems();
    if (!size || size <= 0) return 0;
    return Math.ceil(totalItems / size);
  });

  readonly pages = computed<(number | string)[]>(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const range = this.pageRange();

    if (total <= 1) return total === 1 ? [1] : [];
    if (total <= 5 + range * 2) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pagesToShow: (number | string)[] = [1];

    if (current > range + 2) pagesToShow.push('…');

    for (let i = Math.max(2, current - range); i <= Math.min(total - 1, current + range); i++) {
      pagesToShow.push(i);
    }

    if (current < total - (range + 1)) pagesToShow.push('…');

    pagesToShow.push(total);
    return pagesToShow;
  });

  // --- MÉTODOS: paginación ---
  goToPage(page: number | string): void {
    if (typeof page !== 'number') return;
    const total = this.totalPages();
    if (page < 1 || page > total || page === this.currentPage()) return;
    this.pageChange.emit(page);
  }

  goToPrevious(): void {
    this.goToPage(this.currentPage() - 1);
  }

  goToNext(): void {
    this.goToPage(this.currentPage() + 1);
  }

  trackByPage = (index: number, page: number | string) =>
    typeof page === 'number' ? page : `ellipsis-${index}`;

  // --- MÉTODOS: controles izquierdos ---
  toggleSizeMenu(): void {
    this.isSizeOpen.update(v => !v); // Usar update()
    if (this.isSizeOpen()) this.isDownloadOpen.set(false);
  }

  toggleDownloadMenu(): void {
    this.isDownloadOpen.update(v => !v); // Usar update()
    if (this.isDownloadOpen()) this.isSizeOpen.set(false);
  }

  selectPageSize(size: number): void {
    if (size !== this.pageSize()) {
      this.pageSizeChange.emit(size);
    }
    this.isSizeOpen.set(false);
  }

  selectDownload(value: string): void {
    this.download.emit(value); // exportación real se agregará más adelante
    this.isDownloadOpen.set(false);
  }

  labelPageSize(): string {
    const n = this.pageSize();
    const padded = n < 100 ? String(n).padStart(2, '0') : String(n);
    return `${padded} ${this.itemsPerPageLabel()}`;
  }
}