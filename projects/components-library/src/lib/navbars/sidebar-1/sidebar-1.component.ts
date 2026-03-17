import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

export interface SidebarMenuItem {
  id: string;
  icon: string;        // Material Icon name
  label: string;
  route: string;
  badge?: string | number;
}

@Component({
  selector: 'lib-sidebar-1',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar-1.component.html',
  styleUrl: './sidebar-1.component.scss'
})
export class Sidebar1Component {
  /** Lista de ítems del menú */
  @Input() menuItems: SidebarMenuItem[] = [];
  /** Nombre de la app mostrado bajo el logo */
  @Input() appName: string = 'CRM Hamar';
  /** ¿Sidebar abierto en mobile? */
  @Input() isOpen: boolean = false;

  /** Estado colapsado (solo iconos) — manejado internamente */
  isCollapsed = signal(false);

  /** Emite cuando el usuario hace clic en un ítem (para cerrar en mobile) */
  @Output() itemClick = new EventEmitter<SidebarMenuItem>();
  /** Emite solicitud de cierre del sidebar */
  @Output() closeSidebar = new EventEmitter<void>();
  /** Emite cuando el usuario hace clic en Cerrar sesión */
  @Output() logoutClick = new EventEmitter<void>();

  toggleCollapse(): void {
    this.isCollapsed.update(v => !v);
  }

  onItemClick(item: SidebarMenuItem): void {
    this.itemClick.emit(item);
    this.closeSidebar.emit();
  }
}
