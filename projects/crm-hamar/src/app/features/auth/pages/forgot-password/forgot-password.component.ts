import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="forgot-page">
      <div class="forgot-card">
        <div class="forgot-header">
          <div class="logo-row">
            <span class="brand-hamar">Hamar</span><span class="brand-x">X</span>
          </div>
          <h1 class="form-title">Recuperar contraseña</h1>
          <p class="form-subtitle">Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.</p>
        </div>

        @if (successMsg()) {
          <div class="success-alert">
            <span class="material-icons">check_circle</span>
            {{ successMsg() }}
          </div>
        }

        @if (errorMsg()) {
          <div class="error-alert">
            <span class="material-icons">error_outline</span>
            {{ errorMsg() }}
          </div>
        }

        @if (!successMsg()) {
          <form (ngSubmit)="submit()" class="forgot-form">
            <div class="field-group">
              <label class="field-label">Email</label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                class="crm-input"
                placeholder="tu@email.com"
                required>
            </div>

            <button type="submit" class="btn-primary" style="width:100%; margin-top:8px" [disabled]="loading()">
              @if (loading()) { Enviando... } @else { Enviar enlace de recuperación }
            </button>
          </form>
        }

        <a routerLink="/login" class="back-link">
          <span class="material-icons">arrow_back</span>
          Volver al inicio de sesión
        </a>
      </div>
    </div>
  `,
  styles: [`
    .forgot-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #004179 0%, #239ebc 100%);
      padding: 20px;
      font-family: 'Open Sans', sans-serif;
    }

    .forgot-card {
      background: white;
      border-radius: 16px;
      padding: 48px 40px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    }

    .forgot-header { margin-bottom: 32px; }

    .logo-row { display: flex; align-items: baseline; margin-bottom: 24px; }
    .brand-hamar { font-size: 28px; font-weight: 700; color: #004179; }
    .brand-x { font-size: 30px; font-weight: 900; color: #004179; }

    .form-title { font-size: 22px; font-weight: 700; color: #2A3548; margin-bottom: 8px; }
    .form-subtitle { font-size: 14px; color: #8892a0; }

    .success-alert {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 16px; background: #d4edda; border: 1px solid #c3e6cb;
      border-radius: 8px; color: #155724; font-size: 14px; margin-bottom: 20px;
      .material-icons { font-size: 18px; }
    }

    .error-alert {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 16px; background: #fdecea; border: 1px solid #f5c6cb;
      border-radius: 8px; color: #721c24; font-size: 14px; margin-bottom: 20px;
      .material-icons { font-size: 18px; }
    }

    .forgot-form { display: flex; flex-direction: column; gap: 20px; }
    .field-group { display: flex; flex-direction: column; gap: 8px; }
    .field-label { font-size: 13px; font-weight: 600; color: #2A3548; }

    .back-link {
      display: flex; align-items: center; gap: 6px;
      margin-top: 24px; color: #239ebc; text-decoration: none; font-size: 14px;
      &:hover { text-decoration: underline; }
      .material-icons { font-size: 16px; }
    }
  `]
})
export class ForgotPasswordComponent {
  email = '';
  loading = signal(false);
  successMsg = signal('');
  errorMsg = signal('');

  constructor(private authService: AuthService, private router: Router) {}

  async submit(): Promise<void> {
    if (!this.email) { this.errorMsg.set('Por favor ingresa tu email.'); return; }
    this.loading.set(true);
    this.errorMsg.set('');
    const result = await this.authService.resetPassword(this.email);
    this.loading.set(false);
    if (result.success) {
      this.successMsg.set('Te enviamos un email con el enlace de recuperación. Revisa tu bandeja de entrada.');
    } else {
      this.errorMsg.set(result.error || 'Error al enviar el email.');
    }
  }
}
