
import { Component, input, Input } from '@angular/core';
import { IconComponent } from '../../icons/components/icon.component';

@Component({
  selector: 'lib-table-header',
  imports: [IconComponent],
  templateUrl: './table-header.component.html',
  styleUrl: './table-header.component.scss'
})
export class TableHeaderComponent {
  label = input<string>("");
  sortable = input<boolean>(false);
  // REFACTOR: 'sorted' ahora se llama 'active' para mayor claridad.
  // Es 'true' si esta es la columna por la que se está ordenando.
  active = input<boolean>(false);
  direction = input<"asc" | "desc">("asc");
  align = input<'left' | 'center' | 'right'>('left');
}
