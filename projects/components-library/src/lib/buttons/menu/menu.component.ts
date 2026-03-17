import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MenuItem, TextMenuComponent } from '../text-menu/text-menu.component';

@Component({
  selector: 'lib-menu',
  imports: [CommonModule, TextMenuComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
// Inputs
items = input<MenuItem[]>([]);
selectedIndex = input<number>(-1);
variant = input<'default' | 'compact' | 'bordered'>('default');

// Outputs
itemClick = output<{ item: MenuItem; index: number }>();

// Métodos
onItemClick(item: MenuItem, index: number): void {
  if (!item.disabled) {
    this.itemClick.emit({ item, index });
  }
}
}
