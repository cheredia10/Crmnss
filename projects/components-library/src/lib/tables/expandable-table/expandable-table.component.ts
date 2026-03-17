import { CommonModule } from '@angular/common';
import { Component, computed, ContentChild, ContentChildren, input, output, QueryList, signal, TemplateRef } from '@angular/core';
import { TableHeaderComponent } from '../table-header/table-header.component';
import { TableActionsComponent } from '../table-actions/table-actions.component';
import { TableColumnDirective } from '../../../directives/table-column.directive';
import { ExpandableTableRowDetailDirective } from '../../../directives/expandable-table-row-detail.directive';
import { ActionItem, TableConfig } from '../../../models/table-config.model';

@Component({
  selector: 'lib-expandable-table',
  standalone: true,
  imports: [
    CommonModule,
    TableHeaderComponent,
    TableActionsComponent,
  ],
  templateUrl: './expandable-table.component.html',
  styleUrl: './expandable-table.component.scss'
})
export class ExpandableTableComponent<T extends { id: number | string; [key: string]: any }> {
  config = input.required<TableConfig>();
  data = input<T[]>([]);
  actions = input<ActionItem[]>([]);
  sort = output<{ column: keyof T; direction: 'asc' | 'desc' }>();

  // Plantillas personalizadas
  @ContentChildren(TableColumnDirective) private customColumns!: QueryList<TableColumnDirective>;
  @ContentChild(ExpandableTableRowDetailDirective) private detailTemplate!: ExpandableTableRowDetailDirective;

  // Estado de expansión
  readonly expandedRowIds = signal<Set<number | string>>(new Set());
  readonly sortState = signal<{ column: keyof T | null; direction: 'asc' | 'desc' }>({ column: null, direction: 'asc' });

  readonly detailTemplateRef = computed(() => this.detailTemplate?.templateRef);
  readonly columnTemplates = computed(() => {
    const templates: { [key: string]: TemplateRef<any> } = {};
    // Accede a la query. Angular se asegura de que esto se actualice.
    this.customColumns?.forEach(column => {
      templates[column.columnName] = column.templateRef;
    });
    return templates;
  });

  toggleRow(id: number | string): void {
    this.expandedRowIds.update(currentIds => {
      const newIds = new Set(currentIds);
      newIds.has(id) ? newIds.delete(id) : newIds.add(id);
      return newIds;
    });
  }

  isExpanded(id: number | string): boolean {
    return this.expandedRowIds().has(id);
  }

  // CORRECCIÓN: El método ahora acepta `string` desde la plantilla.
  onSort(columnKey: string): void {
    if (!this.config().sortable) return;

    // Hacemos el casting a 'keyof T' aquí dentro del método.
    const key = columnKey as keyof T;

    let direction: 'asc' | 'desc' = 'asc';
    if (this.sortState().column === key) {
      direction = this.sortState().direction === 'asc' ? 'desc' : 'asc';
    }

    this.sortState.set({ column: key, direction });
    this.sort.emit({ column: key, direction });
  }

  trackByFn(index: number, item: T): number | string { return item.id; }
}
