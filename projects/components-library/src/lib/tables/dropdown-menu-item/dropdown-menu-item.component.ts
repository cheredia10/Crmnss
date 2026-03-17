
import { Component, EventEmitter, input, Input, output, Output } from '@angular/core';
import { DropdownMenuItem } from '../dropdown-menu/dropdown-menu.component';
import { IconComponent } from '../../icons/components/icon.component';

@Component({
  selector: 'lib-dropdown-menu-item',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './dropdown-menu-item.component.html',
  styleUrl: './dropdown-menu-item.component.scss'
})
export class DropdownMenuItemComponent {
  item = input<DropdownMenuItem>()
  showSeparator = input<boolean>(true)

  itemClick = output<DropdownMenuItem>()

  onClick() {
    const item = this.item();
    if (!item || item.disabled) return;

    this.itemClick.emit(item);
  }
}
