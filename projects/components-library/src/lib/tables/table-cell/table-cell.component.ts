import { CommonModule } from '@angular/common';
import { Component, input, Input } from '@angular/core';
import { CustomDatePipe } from '../../../pipes/custom-date.pipe';

@Component({
  selector: 'lib-table-cell',
  imports: [CommonModule, CustomDatePipe],
  templateUrl: './table-cell.component.html',
  styleUrl: './table-cell.component.scss'
})
export class TableCellComponent {
  data = input<any>();
  type = input<string | undefined>();
  align = input<'left' | 'center' | 'right'>('left');
  maxWidth = input<string>('400px');

  getInitials(name?: string): string {
    if (!name) return ""
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  getDropdownValue(data: any): string {
    if (typeof data === "object" && data !== null) {
      return data.label || data.name || data.value || ""
    }
    return data || ""
  }
}
