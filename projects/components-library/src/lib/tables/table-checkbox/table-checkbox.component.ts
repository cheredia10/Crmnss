
import { Component, EventEmitter, input, Input, output, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-table-checkbox',
  imports: [FormsModule],
  templateUrl: './table-checkbox.component.html',
  styleUrl: './table-checkbox.component.scss'
})
export class TableCheckboxComponent {
  id = input<string>(`checkbox-${Math.random().toString(36).substring(2, 9)}`);
  mode = input<string>('row');
  checked = input<boolean>(false);
  allSelected = input<boolean>(false);

  change = output<boolean>();
  toggleAll = output<void>();
  toggleOne = output<number | string>();

  onCheckboxChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.change.emit(input.checked);
  }
}
