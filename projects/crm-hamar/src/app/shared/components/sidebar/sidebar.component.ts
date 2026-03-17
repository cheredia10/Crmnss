import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

interface MenuItem {
  id: string;
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <aside class="sidebar" [class.sidebar--open]="isOpen">

      <!-- Logo -->
      <div class="sidebar__logo">
        <div class="logo-text">
          <span class="logo-hamar">Hamar</span><span class="logo-x">X</span>
        </div>
        <div class="logo-subtitle">by NEW STAGE SOLUTIONS</div>
      </div>

      <!-- Búsqueda -->
      <div class="sidebar__search">
        <span class="material-icons search-icon">search</span>
        <span class="search-placeholder">Buscar...</span>
      </div>

      <!-- Navegación -->
      <nav class="sidebar__nav">
        @for (item of menuItems; track item.id) {
          <a
            [routerLink]="item.route"
            routerLinkActive="sidebar__nav-item--active"
            class="sidebar__nav-item"
            (click)="closeSidebar.emit()">
            <span class="material-icons nav-icon">{{ item.icon }}</span>
            <span class="nav-label">{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- Cerrar sesión -->
      <div class="sidebar__footer">
        <button class="sidebar__logout" (click)="logout()">
          <span class="material-icons">logout</span>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      z-index: 50;
      height: 100vh;
      width: var(--color-sidebar-width);
      background: var(--color-sidebar-bg);
      border-right: 1px solid var(--color-border);
      box-shadow: 2px 0 16px rgba(0,0,0,0.07);
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease;
      overflow: hidden;

      @media (max-width: 1023px) {
        transform: translateX(-100%);

        &.sidebar--open {
          transform: translateX(0);
        }
      }
    }

    .sidebar__logo {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 28px 16px 20px;
      border-bottom: 1px solid var(--color-border);
    }

    .logo-text {
      display: flex;
      align-items: baseline;
      gap: 1px;
    }

    .logo-hamar {
      font-family: 'Open Sans', sans-serif;
      font-weight: 700;
      font-size: 26px;
      color: var(--color-primary);
      letter-spacing: -0.5px;
    }

    .logo-x {
      font-family: 'Open Sans', sans-serif;
      font-weight: 900;
      font-size: 28px;
      color: var(--color-primary);
      line-height: 1;
    }

    .logo-subtitle {
      font-family: 'Open Sans', sans-serif;
      font-size: 9px;
      color: var(--color-text-muted);
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-top: 3px;
    }

    .sidebar__search {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 16px 18px;
      padding: 11px 14px;
      background: white;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);
      cursor: pointer;

      .search-icon {
        font-size: 18px;
        color: var(--color-text-muted);
      }

      .search-placeholder {
        font-size: 14px;
        color: var(--color-text-muted);
      }
    }

    .sidebar__nav {
      flex: 1;
      overflow-y: auto;
      padding: 4px 18px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .sidebar__nav-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 13px 16px;
      border-radius: var(--radius-sm);
      text-decoration: none;
      color: var(--color-text);
      font-family: 'Open Sans', sans-serif;
      font-size: 15px;
      font-weight: 400;
      transition: all 0.15s ease;

      &:hover {
        background: rgba(0,65,121,0.07);
      }

      &.sidebar__nav-item--active {
        background: var(--color-primary);
        color: white;
        font-weight: 600;

        .nav-icon {
          color: white;
        }
      }

      .nav-icon {
        font-size: 20px;
        color: var(--color-text);
      }

      .nav-label {
        white-space: nowrap;
      }
    }

    .sidebar__footer {
      padding: 16px 18px;
      border-top: 1px solid var(--color-border);
    }

    .sidebar__logout {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 11px 16px;
      background: transparent;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      color: #e53935;
      font-family: 'Open Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: #fdecea;
        border-color: #e53935;
      }

      .material-icons {
        font-size: 18px;
      }
    }
  `]
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() closeSidebar = new EventEmitter<void>();

  menuItems: MenuItem[] = [
    { id: 'home',          icon: 'home',           label: 'Dashboard',    route: '/home' },
    { id: 'clientes',      icon: 'people',         label: 'Clientes',     route: '/clientes' },
    { id: 'llamadas',      icon: 'phone',          label: 'Llamadas',     route: '/llamadas' },
    { id: 'sms',           icon: 'sms',            label: 'SMS',          route: '/sms' },
    { id: 'voicemails',    icon: 'voicemail',      label: 'Buzones',      route: '/voicemails' },
    { id: 'documentos',    icon: 'description',    label: 'Documentos',   route: '/documentos' },
    { id: 'seguimiento',   icon: 'folder_open',    label: 'Seguimiento',  route: '/seguimiento' },
    { id: 'tablero',       icon: 'dashboard',      label: 'Tablero',      route: '/tablero' },
    { id: 'configuracion', icon: 'settings',       label: 'Configuración',route: '/configuracion' },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  async logout(): Promise<void> {
    await this.authService.signOut();
    this.router.navigate(['/login']);
  }
}
