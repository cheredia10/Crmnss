import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Checkbox1Component } from '../../checkboxes/checkbox-1/checkbox-1.component';

@Component({
  selector: 'lib-texto-table',
  imports: [CommonModule, Checkbox1Component],
  templateUrl: './texto-table.component.html',
  styleUrl: './texto-table.component.scss'
})
export class TextoTableComponent {
  variant = input<'default' | 'edit' | 'error' | 'focused'>('default');
  showCheckbox = input<boolean>(true);
  showText = input<boolean>(true);
  text = input<string>('');

  checked = input<boolean>(false);
  disabled = input<boolean>(false);

  onCheckboxChange = output<boolean>();

}
