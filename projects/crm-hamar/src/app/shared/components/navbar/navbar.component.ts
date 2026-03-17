import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="navbar">
      <!-- Botón menú móvil -->
      <button class="navbar__menu-btn" (click)="menuClick.emit()" aria-label="Abrir menú">
        <span class="material-icons">menu</span>
      </button>

      <!-- Título -->
      <div class="navbar__title">
        <span class="material-icons title-icon">crm</span>
        <span>CRM Hamar</span>
      </div>

      <!-- Spacer -->
      <div class="navbar__spacer"></div>

      <!-- Usuario -->
      <div class="navbar__user">
        <div class="user-avatar">
          {{ userInitial }}
        </div>
        <div class="user-info">
          <span class="user-name">{{ userName || 'Usuario' }}</span>
          <span class="user-email">{{ userEmail || '' }}</span>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: var(--color-sidebar-width);
      right: 0;
      height: var(--color-navbar-height);
      background: white;
      border-bottom: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      padding: 0 24px;
      z-index: 30;
      gap: 16px;
      box-shadow: 0 1px 6px rgba(0,0,0,0.06);
      transition: left 0.3s ease;

      @media (max-width: 1023px) {
        left: 0;
      }
    }

    .navbar__menu-btn {
      display: none;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 6px;
      border-radius: 6px;
      color: var(--color-text);
      transition: background 0.15s;

      &:hover { background: var(--color-primary-light); }

      .material-icons { font-size: 22px; }

      @media (max-width: 1023px) {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .navbar__title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'Open Sans', sans-serif;
      font-weight: 700;
      font-size: 16px;
      color: var(--color-primary);

      .title-icon { font-size: 20px; }
    }

    .navbar__spacer {
      flex: 1;
    }

    .navbar__user {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: var(--color-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Open Sans', sans-serif;
      font-weight: 700;
      font-size: 15px;
    }

    .user-info {
      display: flex;
      flex-direction: column;

      @media (max-width: 640px) {
        display: none;
      }
    }

    .user-name {
      font-family: 'Open Sans', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: var(--color-text);
    }

    .user-email {
      font-family: 'Open Sans', sans-serif;
      font-size: 12px;
      color: var(--color-text-muted);
    }
  `]
})
export class NavbarComponent {
  @Input() userName?: string;
  @Input() userEmail?: string;
  @Output() menuClick = new EventEmitter<void>();

  get userInitial(): string {
    return (this.userName || 'U').charAt(0).toUpperCase();
  }
}
