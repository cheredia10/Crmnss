import { computed, Injectable, signal, WritableSignal } from '@angular/core';

// Usaremos un tipo genérico para que el servicio sea más flexible.
export type SortState<T> = {
  column: keyof T | null;
  direction: 'asc' | 'desc';
};

@Injectable()
export class TableStateService<T extends { id: number | string }> {
  // --- STATE SIGNALS ---

  // Datos originales sin modificar
  private readonly sourceData = signal<T[]>([]);

  // Estado de la ordenación
  readonly sortState: WritableSignal<SortState<T>> = signal({
    column: null,
    direction: 'asc',
  });

  // Conjunto de IDs seleccionados
  readonly selectedIds = signal<Set<number | string>>(new Set());

  // --- NUEVO ESTADO PARA PAGINACIÓN ---
  readonly pageSize = signal(6); // Por defecto, como en tu diseño
  readonly currentPage = signal(1);

  // --- COMPUTED (DERIVED) SIGNALS ---

  // Datos ordenados, se recalculan automáticamente cuando sourceData o sortState cambian
  // 1. Datos ordenados (antes se llamaba processedData)
  readonly sortedData  = computed(() => {
    const data = this.sourceData();
    const { column, direction } = this.sortState();

    if (!column) {
      return data;
    }

    // Creamos una copia para no mutar el array original
    return [...data].sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      // Lógica de comparación mejorada
      if (valueA === null || valueA === undefined) return 1;
      if (valueB === null || valueB === undefined) return -1;

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB, undefined, { sensitivity: 'base' }) * (direction === 'asc' ? 1 : -1);
      }

      if (valueA < valueB) {
        return direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  });

  // 2. Total de items
  readonly totalItems = computed(() => this.sortedData().length);

  // 3. NUEVO: Datos paginados. ESTE ES EL QUE LA TABLA USARÁ
  readonly processedData = computed(() => {
    const data = this.sortedData();
    const page = this.currentPage();
    const size = this.pageSize();
    
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;

    return data.slice(startIndex, endIndex);
  });

  // Booleano que indica si todos los elementos están seleccionados
  readonly allSelected = computed(() => {
    const data = this.processedData();
    const selected = this.selectedIds();
    return data.length > 0 && data.every(item => selected.has(item.id));
  });

  // --- PUBLIC METHODS (ACTIONS) ---

  /**
   * Inicializa el servicio con los datos de la tabla.
   */
  setData(data: T[]): void {
    this.sourceData.set(data);
  }

  /**
   * Actualiza el estado de ordenación.
   * AHORA recibe explícitamente la dirección.
   */
  setSort(column: keyof T, direction: 'asc' | 'desc'): void {
    this.sortState.set({ column, direction });
  }

  // --- NUEVOS MÉTODOS PARA PAGINACIÓN ---
  setPage(page: number): void {
    this.currentPage.set(page);
  }
  
  setPageSize(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1); // Resetear a la primera página al cambiar el tamaño
  }

  /**
   * Selecciona o deselecciona un único elemento por su ID.
   */
  toggleOne(id: number | string): void {
    this.selectedIds.update(currentIds => {
      const newIds = new Set(currentIds);
      if (newIds.has(id)) {
        newIds.delete(id);
      } else {
        newIds.add(id);
      }
      return newIds;
    });
  }

  /**
   * Selecciona o deselecciona todos los elementos visibles.
   */
  toggleAll(): void {
    const areAllSelected = this.allSelected();
    const data = this.processedData();

    if (areAllSelected) {
      this.selectedIds.set(new Set());
    } else {
      const allIds = new Set(data.map(item => item.id));
      this.selectedIds.set(allIds);
    }
  }

  /**
   * Retorna los items actualmente seleccionados.
   */
  getSelectedItems(): T[] {
    const ids = this.selectedIds();
    return this.sourceData().filter(item => ids.has(item.id));
  }

  updateItem(itemId: number | string, updatedProperties: Partial<T>): void {
    this.sourceData.update(currentData =>
      currentData.map(item =>
        item.id === itemId ? { ...item, ...updatedProperties } : item
      )
    );
  }

  // --- MÉTODO AÑADIDO PARA LA NUEVA FUNCIONALIDAD ---

  /**
   * Añade un nuevo ítem al principio de la lista de datos.
   * @param item El nuevo ítem a añadir.
   */
  addItem(item: T): void {
    this.sourceData.update(currentData => [item, ...currentData]);
  }

  // --- MÉTODO AÑADIDO PARA ELIMINAR ---
  /**
   * Elimina un ítem de la lista de datos por su ID.
   * @param itemId El ID del ítem a eliminar.
   */
  removeItem(itemId: number | string): void {
    this.sourceData.update(currentData =>
      currentData.filter(item => item.id !== itemId)
    );
  }
}
