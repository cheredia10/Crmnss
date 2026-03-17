import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-table-title',
  imports: [],
  templateUrl: './table-title.component.html',
  styleUrl: './table-title.component.scss'
})
export class TableTitleComponent {
  title = input<string>('Table Title');
}
