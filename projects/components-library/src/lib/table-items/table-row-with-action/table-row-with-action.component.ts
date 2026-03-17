import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { IconComponent } from '../../icons/components/icon.component';

export interface TableAction {
  type: 'edit' | 'link' | 'delete' | 'custom';
  icon?: string;
  label?: string;
  disabled?: boolean;
}

@Component({
  selector: 'lib-table-row-with-action',
  imports: [CommonModule, IconComponent],
  templateUrl: './table-row-with-action.component.html',
  styleUrl: './table-row-with-action.component.scss'
})
export class TableRowWithActionComponent {
  // Inputs
  text = input<string>('');
  actions = input<TableAction[]>([]);
  variant = input<'default' | 'edit' | 'error' | 'focused'>('default');

  // Outputs
  actionClick = output<TableAction>();

  onActionClick(action: TableAction): void {
    if (!action.disabled) {
      this.actionClick.emit(action);
    }
  }
}
