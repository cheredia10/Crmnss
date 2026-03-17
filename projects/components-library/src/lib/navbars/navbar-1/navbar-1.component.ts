import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NavbarUser {
  nombre?: string;
  email?: string;
  avatarUrl?: string;
}

@Component({
  selector: 'lib-navbar-1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-1.component.html',
  styleUrl: './navbar-1.component.scss'
})
export class Navbar1Component {
  /** Usuario autenticado */
  @Input() user: NavbarUser | null = null;
  /** Título de la aplicación */
  @Input() appTitle: string = 'CRM Hamar';
  /** Icon de Material Icons para el título */
  @Input() appIcon: string = 'crm';
  /** Emite cuando el usuario hace clic en el botón de menú (mobile) */
  @Output() menuClick = new EventEmitter<void>();
  /** Emite cuando el usuario hace clic en Cerrar sesión */
  @Output() logoutClick = new EventEmitter<void>();

  get userInitials(): string {
    const nombre = this.user?.nombre || '';
    const parts = nombre.trim().split(' ');
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase() || 'U';
  }
}
