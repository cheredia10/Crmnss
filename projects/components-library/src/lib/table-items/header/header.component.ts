import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { Checkbox1Component } from '../../checkboxes/checkbox-1/checkbox-1.component';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';

export type SortDirection = 'asc' | 'desc' | 'none';

export interface TableHeaderAction {
  label: string;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'lib-header',
  imports: [CommonModule, Checkbox1Component, ClickOutsideDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  // Inputs
  text = input<string>('');
  sortable = input<boolean>(false);
  selectable = input<boolean>(false);
  showOptions = input<boolean>(false);
  actions = input<TableHeaderAction[]>([]);
  backgroundType = input<'claro' | 'oscuro'>('claro');

  // Estado interno
  sortDirection = signal<SortDirection>('none');
  allSelected = signal<boolean>(false);
  optionsMenuOpen = signal<boolean>(false);

  // Outputs
  sortChange = output<SortDirection>();
  selectAllChange = output<boolean>();
  actionClick = output<TableHeaderAction>();

  // Métodos
  onSortClick(): void {
    if (!this.sortable()) return;

    let newDirection: SortDirection = 'none';

    switch (this.sortDirection()) {
      case 'none':
        newDirection = 'asc';
        break;
      case 'asc':
        newDirection = 'desc';
        break;
      case 'desc':
        newDirection = 'none';
        break;
    }

    this.sortDirection.set(newDirection);
    this.sortChange.emit(newDirection);
  }

  onSelectAllChange(checked: boolean): void {
    this.allSelected.set(checked);
    this.selectAllChange.emit(checked);
  }

  toggleOptionsMenu(event: Event): void {
    event.stopPropagation();
    this.optionsMenuOpen.set(!this.optionsMenuOpen());
  }

  onActionClick(action: TableHeaderAction): void {
    if (!action.disabled) {
      this.actionClick.emit(action);
      this.optionsMenuOpen.set(false);
    }
  }

  closeOptionsMenu(): void {
    this.optionsMenuOpen.set(false);
  }

  // Métodos para manejar los colores de las flechas
  getUpArrowColor(): string {
    switch (this.sortDirection()) {
      case 'asc':
        return '#007AFF'; // Azul cuando está activo
      default:
        return '#A7A8AB'; // Gris cuando no está activo
    }
  }

  getDownArrowColor(): string {
    switch (this.sortDirection()) {
      case 'desc':
        return '#007AFF'; // Azul cuando está activo
      default:
        return '#A7A8AB'; // Gris cuando no está activo
    }
  }

  getSortIconClass(): string {
    return `sort-icon sort-${this.sortDirection()}`;
  }
}
