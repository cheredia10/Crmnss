
import { Component, input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DynamicIconComponent } from '../../icons/components/dynamic-icon.component';
import { MenuItem } from '../../../interfaces/menu-item.interface';

@Component({
  selector: 'lib-sidebar-submenu',
  imports: [RouterModule, DynamicIconComponent],
  templateUrl: './sidebar-submenu.component.html',
  styleUrl: './sidebar-submenu.component.scss'
})
export class SidebarSubmenuComponent {
  icon = input<string | undefined>('');
  matIcon = input<string | undefined>('');
  label = input.required<string>();
  collapsed = input<boolean>(false);
  items = input<MenuItem[]>([]);

  isOpen = input<boolean>(false);
  openChildrenIndexes = signal<Set<number>>(new Set());

  toggleChildren(index: number) {
    this.openChildrenIndexes.update(currentIndexes => {
      const newIndexes = new Set(currentIndexes);
      if (newIndexes.has(index)) {
        newIndexes.delete(index);
      } else {
        newIndexes.add(index);
      }
      return newIndexes;
    });
  }

  isChildrenOpen(index: number): boolean {
    return this.openChildrenIndexes().has(index);
  }

    trackByItem(item: MenuItem, index: number): string {
        return `${item.label}-${item.route || ''}-${index}`;
    }

    trackByChild(child: MenuItem, index: number): string {
        return `${child.label}-${child.route}-${index}`;
    }
}
