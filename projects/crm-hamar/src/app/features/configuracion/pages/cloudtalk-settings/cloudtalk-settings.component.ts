import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CloudtalkService } from '../../../../core/services/cloudtalk.service';

@Component({
  selector: 'app-cloudtalk-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-page">
      <div class="breadcrumb">
        <span>CRM</span><span class="material-icons breadcrumb-sep">chevron_right</span>
        <span>Configuración</span><span class="material-icons breadcrumb-sep">chevron_right</span>
        <span class="breadcrumb-current">CloudTalk</span>
      </div>
      <h1 class="page-title">Configuración CloudTalk</h1>
      <p class="page-subtitle">Gestiona la integración con CloudTalk para llamadas y estadísticas</p>

      @if (successMsg()) {
        <div class="success-alert"><span class="material-icons">check_circle</span>{{ successMsg() }}</div>
      }
      @if (errorMsg()) {
        <div class="error-alert"><span class="material-icons">error_outline</span>{{ errorMsg() }}</div>
      }

      <div class="settings-grid">
        <!-- API Key config -->
        <div class="card">
          <div class="section-header-inline">
            <span class="material-icons">vpn_key</span>
            <h2>API Key de CloudTalk</h2>
          </div>
          <p class="setting-desc">Ingresa tu API Key de CloudTalk para activar la integración de llamadas y estadísticas en tiempo real.</p>
          <form (ngSubmit)="saveApiKey()" class="settings-form">
            <div class="field-group">
              <label class="field-label">API Key</label>
              <div style="position:relative">
                <input [type]="showKey ? 'text' : 'password'" [(ngModel)]="apiKey" name="apiKey" class="crm-input" style="padding-right:44px" placeholder="xxxxxxxxxxxxxxxxxxxxxxxx">
                <button type="button" class="toggle-btn" (click)="showKey = !showKey">
                  <span class="material-icons">{{ showKey ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>
            <button type="submit" class="btn-primary" style="width:fit-content" [disabled]="saving()">
              {{ saving() ? 'Guardando...' : 'Guardar API Key' }}
            </button>
          </form>
        </div>

        <!-- Webhook info -->
        <div class="card">
          <div class="section-header-inline">
            <span class="material-icons">webhook</span>
            <h2>Webhook URL</h2>
          </div>
          <p class="setting-desc">Configura esta URL en CloudTalk como webhook para recibir eventos de llamadas en tiempo real.</p>
          <div class="webhook-url">
            <code>{{ webhookUrl }}</code>
            <button class="icon-btn" (click)="copyWebhook()" title="Copiar">
              <span class="material-icons">content_copy</span>
            </button>
          </div>
          <div class="info-box">
            <span class="material-icons">info</span>
            <p>Configura el webhook en el portal de CloudTalk en <strong>Settings → Integrations → Webhooks</strong>.</p>
          </div>
        </div>

        <!-- Estado de la integración -->
        <div class="card">
          <div class="section-header-inline">
            <span class="material-icons">monitor_heart</span>
            <h2>Estado de la Integración</h2>
          </div>
          <div class="status-rows">
            <div class="status-row">
              <span class="status-dot status-dot--ok"></span>
              <span>Supabase</span>
              <span class="status-label status-label--ok">Conectado</span>
            </div>
            <div class="status-row">
              <span class="status-dot" [class.status-dot--ok]="hasApiKey" [class.status-dot--err]="!hasApiKey"></span>
              <span>CloudTalk</span>
              <span class="status-label" [class.status-label--ok]="hasApiKey" [class.status-label--err]="!hasApiKey">
                {{ hasApiKey ? 'API Key configurada' : 'Sin API Key' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page { display: flex; flex-direction: column; gap: 24px; }
    .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; @media (max-width: 900px) { grid-template-columns: 1fr; } }
    .section-header-inline { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; h2 { font-size: 16px; font-weight: 600; color: #2A3548; } .material-icons { color: #004179; } }
    .setting-desc { font-size: 13px; color: #8892a0; margin-bottom: 16px; line-height: 1.5; }
    .settings-form { display: flex; flex-direction: column; gap: 16px; }
    .field-group { display: flex; flex-direction: column; gap: 8px; }
    .field-label { font-size: 13px; font-weight: 600; color: #2A3548; }
    .toggle-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: transparent; border: none; cursor: pointer; color: #8892a0; .material-icons { font-size: 18px; } }
    .webhook-url { display: flex; align-items: center; gap: 10px; background: #f9fafb; border: 1px solid #e0e0e8; border-radius: 8px; padding: 12px 16px; margin-bottom: 12px; code { flex: 1; font-size: 12px; color: #2A3548; word-break: break-all; } }
    .icon-btn { background: transparent; border: 1px solid #e0e0e8; border-radius: 6px; padding: 6px; cursor: pointer; color: #004179; &:hover { background: #e6f0fe; } .material-icons { font-size: 16px; } }
    .info-box { display: flex; align-items: flex-start; gap: 8px; padding: 12px; background: #e6f0fe; border-radius: 8px; .material-icons { font-size: 18px; color: #004179; flex-shrink: 0; } p { font-size: 13px; color: #2A3548; line-height: 1.5; } }
    .status-rows { display: flex; flex-direction: column; gap: 12px; }
    .status-row { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #2A3548; }
    .status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; &--ok { background: #28a745; } &--err { background: #dc3545; } }
    .status-label { margin-left: auto; font-size: 12px; font-weight: 600; &--ok { color: #155724; } &--err { color: #721c24; } }
    .success-alert { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; color: #155724; font-size: 14px; .material-icons { font-size: 18px; } }
    .error-alert { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #fdecea; border: 1px solid #f5c6cb; border-radius: 8px; color: #721c24; font-size: 14px; .material-icons { font-size: 18px; } }
  `]
})
export class CloudtalkSettingsComponent implements OnInit {
  apiKey = '';
  showKey = false;
  saving = signal(false);
  successMsg = signal('');
  errorMsg = signal('');
  hasApiKey = false;
  webhookUrl = '';

  constructor(private cloudtalkService: CloudtalkService) {}

  async ngOnInit(): Promise<void> {
    this.webhookUrl = `${window.location.origin}/api/cloudtalk/webhook`;
    const config = await this.cloudtalkService.getConfig();
    if (config?.has_api_key) {
      this.hasApiKey = true;
      this.apiKey = '••••••••••••••••••••';
    }
  }

  async saveApiKey(): Promise<void> {
    if (!this.apiKey || this.apiKey === '••••••••••••••••••••') return;
    this.saving.set(true);
    this.successMsg.set('');
    this.errorMsg.set('');
    const result = await this.cloudtalkService.saveConfig(this.apiKey);
    this.saving.set(false);
    if (result.success) {
      this.successMsg.set('API Key guardada correctamente. La integración está activa.');
      this.hasApiKey = true;
    } else {
      this.errorMsg.set(result.error || 'Error al guardar la API Key.');
    }
  }

  copyWebhook(): void {
    navigator.clipboard.writeText(this.webhookUrl).then(() => alert('Webhook URL copiada'));
  }
}
