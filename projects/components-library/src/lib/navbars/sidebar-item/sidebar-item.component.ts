
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DynamicIconComponent } from '../../icons/components/dynamic-icon.component';

@Component({
  selector: 'lib-sidebar-item',
  imports: [RouterModule, DynamicIconComponent],
  templateUrl: './sidebar-item.component.html',
  styleUrl: './sidebar-item.component.scss'
})
export class SidebarItemComponent {
  icon = input<string>();
  matIcon = input<string>();
  label = input<string>('');
  collapsed = input<boolean>(false);
  routerLink = input<string | string[] | undefined>([]);
  badge = input<number | undefined>(undefined);

  // Computed property for router link type safety
  protected get normalizedRouterLink(): string[] {
    return Array.isArray(this.routerLink()) 
      ? this.routerLink() as string[]
      : [this.routerLink() as string];
  }
}
