import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-page">
      <!-- Panel izquierdo - decorativo -->
      <div class="login-left">
        <div class="login-brand">
          <span class="brand-hamar">Hamar</span><span class="brand-x">X</span>
        </div>
        <p class="login-tagline">Tu plataforma integral de gestión de clientes</p>
        <div class="login-features">
          <div class="feature-item">
            <span class="material-icons">people</span>
            <span>Gestión de Clientes</span>
          </div>
          <div class="feature-item">
            <span class="material-icons">phone</span>
            <span>Registro de Llamadas</span>
          </div>
          <div class="feature-item">
            <span class="material-icons">analytics</span>
            <span>Estadísticas en tiempo real</span>
          </div>
          <div class="feature-item">
            <span class="material-icons">description</span>
            <span>Gestión Documental</span>
          </div>
        </div>
      </div>

      <!-- Panel derecho - formulario -->
      <div class="login-right">
        <div class="login-form-card">

          <div class="form-header">
            <h1 class="form-title">Bienvenido</h1>
            <p class="form-subtitle">Inicia sesión en tu cuenta</p>
          </div>

          <!-- Error -->
          @if (errorMsg()) {
            <div class="error-alert">
              <span class="material-icons">error_outline</span>
              {{ errorMsg() }}
            </div>
          }

          <form (ngSubmit)="login()" class="login-form">
            <div class="field-group">
              <label class="field-label">Email</label>
              <div class="input-wrapper">
                <span class="input-icon material-icons">email</span>
                <input
                  type="email"
                  [(ngModel)]="email"
                  name="email"
                  class="crm-input with-icon"
                  placeholder="tu@email.com"
                  required
                  autocomplete="email">
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Contraseña</label>
              <div class="input-wrapper">
                <span class="input-icon material-icons">lock</span>
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  [(ngModel)]="password"
                  name="password"
                  class="crm-input with-icon"
                  placeholder="••••••••"
                  required
                  autocomplete="current-password">
                <button type="button" class="toggle-password" (click)="showPassword = !showPassword">
                  <span class="material-icons">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>

            <div class="form-actions-row">
              <a routerLink="/forgot-password" class="forgot-link">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" class="btn-login" [disabled]="loading()">
              @if (loading()) {
                <span class="btn-spinner"></span>
                Iniciando sesión...
              } @else {
                <span class="material-icons">login</span>
                Iniciar sesión
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      display: flex;
      min-height: 100vh;
      font-family: 'Open Sans', sans-serif;
    }

    /* Panel izquierdo */
    .login-left {
      flex: 1;
      background: linear-gradient(135deg, #004179 0%, #239ebc 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 60px;
      color: white;

      @media (max-width: 768px) {
        display: none;
      }
    }

    .login-brand {
      display: flex;
      align-items: baseline;
      margin-bottom: 16px;
    }

    .brand-hamar {
      font-size: 48px;
      font-weight: 700;
      letter-spacing: -1px;
    }

    .brand-x {
      font-size: 52px;
      font-weight: 900;
      line-height: 1;
    }

    .login-tagline {
      font-size: 18px;
      opacity: 0.9;
      margin-bottom: 48px;
      font-weight: 300;
    }

    .login-features {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 16px;
      opacity: 0.9;

      .material-icons {
        font-size: 22px;
        background: rgba(255,255,255,0.15);
        padding: 8px;
        border-radius: 8px;
      }
    }

    /* Panel derecho */
    .login-right {
      width: 480px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      background: #fafbfc;

      @media (max-width: 768px) {
        width: 100%;
        padding: 20px;
      }
    }

    .login-form-card {
      width: 100%;
      max-width: 400px;
    }

    .form-header {
      margin-bottom: 32px;
    }

    .form-title {
      font-size: 28px;
      font-weight: 700;
      color: #2A3548;
      margin-bottom: 6px;
    }

    .form-subtitle {
      font-size: 14px;
      color: #8892a0;
    }

    .error-alert {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #fdecea;
      border: 1px solid #f5c6cb;
      border-radius: 8px;
      color: #721c24;
      font-size: 14px;
      margin-bottom: 20px;

      .material-icons { font-size: 18px; }
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .field-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .field-label {
      font-size: 13px;
      font-weight: 600;
      color: #2A3548;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 14px;
      font-size: 18px;
      color: #8892a0;
      pointer-events: none;
    }

    .crm-input.with-icon {
      padding-left: 44px;
    }

    .toggle-password {
      position: absolute;
      right: 12px;
      background: transparent;
      border: none;
      cursor: pointer;
      color: #8892a0;
      padding: 4px;

      .material-icons { font-size: 18px; }
    }

    .form-actions-row {
      display: flex;
      justify-content: flex-end;
      margin-top: -8px;
    }

    .forgot-link {
      font-size: 13px;
      color: #239ebc;
      text-decoration: none;

      &:hover { text-decoration: underline; }
    }

    .btn-login {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 14px;
      background: #004179;
      color: white;
      border: none;
      border-radius: 8px;
      font-family: 'Open Sans', sans-serif;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;
      margin-top: 4px;

      &:hover:not(:disabled) { background: #00305a; }
      &:disabled { opacity: 0.7; cursor: not-allowed; }

      .material-icons { font-size: 18px; }
    }

    .btn-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  loading = signal(false);
  errorMsg = signal('');

  constructor(private authService: AuthService, private router: Router) {}

  async login(): Promise<void> {
    if (!this.email || !this.password) {
      this.errorMsg.set('Por favor completa todos los campos.');
      return;
    }
    this.loading.set(true);
    this.errorMsg.set('');
    const result = await this.authService.signIn(this.email, this.password);
    this.loading.set(false);
    if (result.success) {
      this.router.navigate(['/home']);
    } else {
      this.errorMsg.set(result.error || 'Error al iniciar sesión');
    }
  }
}
