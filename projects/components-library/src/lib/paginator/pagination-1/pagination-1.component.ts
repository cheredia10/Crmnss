
import { Component, computed, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select3Component, Select3Option } from '../../selects/select-3/select-3.component';

export interface PaginationConfig {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  maxVisiblePages?: number
  showFirstLast?: boolean
  showPrevNext?: boolean
  showPageSizeSelector?: boolean
  showGoToPage?: boolean
  pageSizeOptions?: number[]
}

@Component({
  selector: 'lib-pagination-1',
  standalone: true,
  imports: [FormsModule, Select3Component],
  templateUrl: './pagination-1.component.html',
  styleUrl: './pagination-1.component.scss'
})
export class Pagination1Component {
  // Inputs
  totalItems = input.required<number>()
  itemsPerPage = model<number>(10)
  currentPage = model<number>(1)
  maxVisiblePages = input<number>(7)
  showFirstLast = input<boolean>(true)
  showPrevNext = input<boolean>(true)
  showPageSizeSelector = input<boolean>(true)
  showGoToPage = input<boolean>(true)
  pageSizeOptions = input<number[]>([5, 10, 20, 50, 100])
  disabled = input<boolean>(false)

  // i18n: Textos configurables desde la app padre
  rowsPerPageLabel = input<string>('Filas por página')
  goToPageLabel = input<string>('Ir a la página')
  firstPageAriaLabel = input<string>('Primera página')
  previousPageAriaLabel = input<string>('Página anterior')
  nextPageAriaLabel = input<string>('Página siguiente')
  lastPageAriaLabel = input<string>('Última página')
  pageAriaLabel = input<string>('Página') // Para "Página 1", "Página 2", etc.

  //conversion de inputs
  numberOptions: Select3Option[] = this.pageSizeOptions().map((option) => ({
    value: option,
    label: option.toString()
  }))

  // Outputs
  pageChange = output<number>()
  pageSizeChange = output<number>()

  // --- CAMBIO: goToPageValue ahora es una propiedad normal ---
  goToPageValue: string = '';

  // Computed values
  totalPages = computed(() => Math.ceil(this.totalItems() / this.itemsPerPage()))

  startItem = computed(() => (this.currentPage() - 1) * this.itemsPerPage() + 1)

  endItem = computed(() => {
    const end = this.currentPage() * this.itemsPerPage()
    return Math.min(end, this.totalItems())
  })

  visiblePages = computed(() => {
    const total = this.totalPages()
    const current = this.currentPage()
    const maxVisible = this.maxVisiblePages()

    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }

    const half = Math.floor(maxVisible / 2)
    let start = Math.max(1, current - half)
    let end = Math.min(total, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    const pages: (number | string)[] = []

    // Add first page if not in range
    if (start > 1) {
      pages.push(1)
      if (start > 2) {
        pages.push('...')
      }
    }

    // Add visible pages
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Add last page if not in range
    if (end < total) {
      if (end < total - 1) {
        pages.push('...')
      }
      pages.push(total)
    }

    return pages
  })

  canGoPrevious = computed(() => this.currentPage() > 1 && !this.disabled())
  canGoNext = computed(() => this.currentPage() < this.totalPages() && !this.disabled())
  canGoFirst = computed(() => this.currentPage() > 1 && !this.disabled())
  canGoLast = computed(() => this.currentPage() < this.totalPages() && !this.disabled())

  // Methods
  // Modificamos goToPage para que actualice el input
  goToPage(page: number): void {
    if (this.disabled() || page < 1 || page > this.totalPages() || page === this.currentPage()) {
      return;
    }
    this.currentPage.set(page);
    this.pageChange.emit(page);
    // Sincronizamos la propiedad con la página actual
    this.goToPageValue = page.toString();
  }

  handlePageClick(page: number | string): void {
    if (typeof page === 'number') {
      this.goToPage(page);
    }
  }

  goToFirst(): void {
    this.goToPage(1)
  }

  goToLast(): void {
    this.goToPage(this.totalPages())
  }

  goToPrevious(): void {
    this.goToPage(this.currentPage() - 1)
  }

  goToNext(): void {
    this.goToPage(this.currentPage() + 1)
  }

  onPageSizeChange(newSize: number): void {
    if (this.disabled()) return

    const currentStartItem = this.startItem()
    this.itemsPerPage.set(newSize)

    // Adjust current page to maintain position
    const newPage = Math.ceil(currentStartItem / newSize)
    this.currentPage.set(Math.max(1, Math.min(newPage, this.totalPages())))

    this.pageSizeChange.emit(newSize)
    this.pageChange.emit(this.currentPage())
  }

  onGoToPageSubmit(): void {
    const pageNumber = parseInt(this.goToPageValue, 10)
    if (!isNaN(pageNumber)) {
      this.goToPage(pageNumber)
      // No reseteamos el valor aquí para que el input muestre la página actual
    }
  }

  isPageActive(page: number | string): boolean {
    return typeof page === 'number' && page === this.currentPage()
  }

  isPageDisabled(page: number | string): boolean {
    return this.disabled() || page === '...'
  }
}
