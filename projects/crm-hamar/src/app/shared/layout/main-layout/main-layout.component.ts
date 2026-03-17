import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Sidebar1Component, SidebarMenuItem } from 'components-library';
import { Navbar1Component, NavbarUser } from 'components-library';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar1Component, Navbar1Component],
  template: `
    <div class="main-layout-wrapper">

      <!-- Sidebar de la components-library -->
      <lib-sidebar-1
        [menuItems]="menuItems"
        appName="CRM Hamar"
        [isOpen]="isSidebarOpen"
        (closeSidebar)="isSidebarOpen = false"
        (logoutClick)="logout()">
      </lib-sidebar-1>

      <!-- Overlay móvil -->
      @if (isSidebarOpen) {
        <div class="mobile-overlay" (click)="isSidebarOpen = false"></div>
      }

      <!-- Navbar de la components-library -->
      <lib-navbar-1
        [user]="navbarUser"
        appTitle="CRM Hamar"
        appIcon="crm"
        (menuClick)="isSidebarOpen = true"
        (logoutClick)="logout()">
      </lib-navbar-1>

      <!-- Contenido de la ruta activa -->
      <main class="main-content">
        <div class="main-inner">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .main-layout-wrapper {
      display: flex;
      min-height: 100vh;
      background-color: #fafbfc;
    }

    .mobile-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 40;
      display: none;

      @media (max-width: 1023px) {
        display: block;
      }
    }

    .main-content {
      flex: 1;
      margin-left: 280px;
      padding-top: 64px;
      min-height: 100vh;
      background-color: #fafbfc;
      transition: margin-left 0.3s ease;

      @media (max-width: 1023px) {
        margin-left: 0;
      }
    }

    .main-inner {
      padding: 32px;
      max-width: 1600px;
      margin: 0 auto;

      @media (max-width: 768px) {
        padding: 16px;
      }
    }
  `]
})
export class MainLayoutComponent {
  isSidebarOpen = false;

  menuItems: SidebarMenuItem[] = [
    { id: 'home',        icon: 'home',             label: 'Dashboard',    route: '/home' },
    { id: 'clientes',    icon: 'people',           label: 'Clientes',     route: '/clientes' },
    { id: 'whatsapp',    icon: 'chat_bubble',      label: 'WhatsApp',     route: '/whatsapp' },
    { id: 'documentos',  icon: 'description',      label: 'Documentos',   route: '/documentos' },
    { id: 'seguimiento', icon: 'folder_open',      label: 'Seguimiento',  route: '/seguimiento' },
    { id: 'tablero',     icon: 'dashboard',        label: 'Tablero',      route: '/tablero' },
    { id: 'usuarios',    icon: 'manage_accounts',  label: 'Usuarios',     route: '/configuracion/usuarios' },
  ];

  get navbarUser(): NavbarUser | null {
    const u = this.authService.currentUser();
    return u ? { nombre: u.nombre, email: u.email } : null;
  }

  constructor(public authService: AuthService, private router: Router) {}

  async logout(): Promise<void> {
    await this.authService.signOut();
    this.router.navigate(['/login']);
  }
}
