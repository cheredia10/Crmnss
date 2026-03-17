import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChildren,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  QueryList,
  signal,
  TemplateRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableCellComponent } from '../table-cell/table-cell.component';
import { TableHeaderComponent } from '../table-header/table-header.component';
import { TableStatusComponent } from '../table-status/table-status.component';
import { TableActionsComponent } from '../table-actions/table-actions.component';
import {
  ActionItem,
  StatusType,
  TableColumn,
  TableConfig,
} from '../../../models/table-config.model';
import { TableColumnDirective } from '../../../directives/table-column.directive';
import { TableTitleComponent } from '../table-title/table-title.component';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type RenderableColumn = (
  | (TableColumn & { type: 'data'; position: number })
  // La 'key' ya no es un literal 'status', sino un string genérico.
  | {
      type: 'status';
      key: string;
      header: string;
      position: number;
      sortable?: boolean;
      headerAlign?: 'left' | 'center' | 'right';
      cellAlign?: 'left' | 'center' | 'right';
      headerPaddingLeft?: string;
      headerPaddingRight?: string;
      headerPaddingTop?: string;
      headerPaddingBottom?: string;
      width?: string;
      minWidth?: string;
      maxWidth?: string;
    }
  | {
      type: 'checkbox';
      key: 'checkbox';
      position: number;
      headerAlign?: 'left' | 'center' | 'right';
      cellAlign?: 'left' | 'center' | 'right';
      headerPaddingLeft?: string;
      headerPaddingRight?: string;
      headerPaddingTop?: string;
      headerPaddingBottom?: string;
    }
  | {
      type: 'actions';
      key: 'actions';
      position: number;
      headerAlign?: 'left' | 'center' | 'right';
      cellAlign?: 'left' | 'center' | 'right';
      headerPaddingLeft?: string;
      headerPaddingRight?: string;
      headerPaddingTop?: string;
      headerPaddingBottom?: string;
    }
) & { sticky?: 'left' | 'right' };

@Component({
  selector: 'lib-custom-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    TableCellComponent,
    TableHeaderComponent,
    TableStatusComponent,
    TableActionsComponent,
    TableTitleComponent,
  ],
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.scss',
})
export class CustomTableComponent<
  T extends { id: number | string; [key: string]: any }
> {
  private translate = inject(TranslateService);

  // --- INPUTS & OUTPUTS ---
  config = input.required<TableConfig>();
  data = input<T[]>([]);
  loading = input<boolean>(false);
  actions = input<ActionItem[]>([]);
  selected = input<Set<number | string>>(new Set());
  allSelected = input<boolean>(false);
  idKey = input<keyof T>('id');
  tableTitle = input<string>('Table Title');
  noDataMessageKey = input<string>('COMMON.MESSAGES.NO_DATA_AVAILABLE');
  // i18n: statusOptions NO debe tener valores por defecto con textos hardcodeados
  // La app padre (hamar) debe proporcionar los valores traducidos
  statusOptions = input<
    Record<
      string,
      { label: string; backgroundColor: string; textColor: string }
    >
  >({});

  sort = output<{ column: keyof T; direction: 'asc' | 'desc' }>();
  statusChange = output<{ item: T; status: StatusType }>();
  actionClick = output<{ item: T; action: string }>();
  toggleAll = output<void>();
  toggleOne = output<number | string>();

  // --- TRANSLATION SIGNAL ---
  readonly resolvedNoDataMessage = signal<string>('');

  // REMOVED: rowSelect. El manejo de la selección ahora está en el servicio.
  // El componente padre puede obtener los seleccionados desde el servicio.

  // --- QUERIES ---
  @ContentChildren(TableColumnDirective)
  private customColumns!: QueryList<TableColumnDirective>;

  // --- INTERNAL STATE ---
  readonly sortState = signal<{
    column: keyof T | null;
    direction: 'asc' | 'desc';
  }>({
    column: null,
    direction: 'asc',
  });

  // --- COMPUTED SIGNALS ---
  // readonly visibleColumns = computed(() => {
  //   return this.config().columns.sort((a, b) => (a.position || 0) - (b.position || 0));
  // });

  // --- ACTUALIZACIÓN: El signal computado ahora incluye la lógica 'sticky' ---
  readonly allColumns = computed<RenderableColumn[]>(() => {
    const config = this.config();
    const columns: RenderableColumn[] = [];

    // --- LÓGICA DE STICKY CONDICIONAL ---
    const useSticky = config.stickyColumns ?? true; // Por defecto es true si no se define

    // 1. Añadir columnas de datos
    config.columns.forEach((col) => {
      columns.push({
        ...col,
        type: 'data',
        position: col.position ?? 999,
      });
    });

    // 2. Añadir columna de Status
    if (config.showStatusColumn) {
      columns.push({
        type: 'status',
        key: config.statusKey ?? 'status',
        header: config.statusHeaderLabel ?? 'Status',
        position: config.statusPosition ?? 100,
        sortable: config.statusIsSortable ?? false,
        width: config.statusWidth,
        minWidth: config.statusMinWidth,
        maxWidth: config.statusMaxWidth,
        headerAlign: config.statusHeaderAlign ?? 'left',
        cellAlign: config.statusCellAlign ?? 'left',
      });
    }

    // 3. Añadir columna de Checkbox (y marcarla como sticky)
    if (config.showCheckboxColumn) {
      columns.push({
        type: 'checkbox',
        key: 'checkbox',
        position: config.checkboxPosition === 'left' ? -100 : 1000,
        // Aplicamos 'sticky' solo si está activado
        ...(useSticky && { sticky: 'left' }),
      });
    }

    // 4. Añadir columna de Acciones (y marcarla como sticky)
    if (config.showActionsColumn) {
      columns.push({
        type: 'actions',
        key: 'actions',
        position: config.actionsPosition === 'left' ? -99 : 1001,
        // Aplicamos 'sticky' solo si está activado
        ...(useSticky && { sticky: 'right' }),
      });
    }

    // 5. Ordenar el array final por la propiedad 'position'
    return columns.sort((a, b) => a.position - b.position);
  });
  readonly columnTemplates = computed(() => {
    const templates: { [key: string]: TemplateRef<any> } = {};
    // Accede a la query. Angular se asegura de que esto se actualice.
    this.customColumns?.forEach((column) => {
      templates[column.columnName] = column.templateRef;
    });
    return templates;
  });

  // REMOVED: Propiedades de estado antiguas que ahora maneja el servicio o los signals.
  // selectedItems, selectAll, sortColumn, sortDirection, lastEmittedIds.

  // REMOVED: ngAfterContentInit. Era redundante e incorrecto.

  // REMOVED: getVisibleColumns(). Usamos el computed signal 'visibleColumns()' directamente.

  // REMOVED: getColumnTemplate(). La lógica ahora está directamente en el template con el alias @if.

  // --- CONSTRUCTOR ---
  // Inyecta DestroyRef para manejar la limpieza de suscripciones.
  // Inyecta TranslateService para traducciones.
  constructor() {
    const destroyRef = inject(DestroyRef);

    effect(() => {
      this.translate
        .stream(this.noDataMessageKey())
        .pipe(takeUntilDestroyed(destroyRef))
        .subscribe((text) => this.resolvedNoDataMessage.set(text));
    });
  }

  // --- MÉTODOS ---
  isSelected(item: T): boolean {
    // Usa 'idKey' para ser genérico, pero asume que 'id' existe para el toggle.
    const key = this.idKey();
    return this.selected().has(item[key]);
  }

  onSort(columnKey: keyof T): void {
    if (!this.config().sortable) return;

    let direction: 'asc' | 'desc' = 'asc';
    // Compara con el valor actual del signal de estado
    if (this.sortState().column === columnKey) {
      direction = this.sortState().direction === 'asc' ? 'desc' : 'asc';
    }

    // Actualiza el estado interno y emite el evento
    this.sortState.set({ column: columnKey, direction });
    this.sort.emit({ column: columnKey, direction });
  }

  onStatusChange(item: T, status: StatusType) {
    this.statusChange.emit({ item, status });
  }

  onActionClick(item: T, action: string) {
    this.actionClick.emit({ item, action });
  }

  trackByFn(index: number, item: T): number | string {
    return item.id;
  }

  // REMOVED: onSelectItem, allSelectionHandler, getId, isSameSelection.
  // Toda esta lógica de selección ahora vive en el `TableStateService`.
}
