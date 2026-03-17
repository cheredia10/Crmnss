import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseClientService } from '../../../../core/services/supabase-client.service';

@Component({
  selector: 'app-sms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sms-page">
      <div class="breadcrumb">
        <span>CRM</span><span class="material-icons breadcrumb-sep">chevron_right</span>
        <span class="breadcrumb-current">WhatsApp</span>
      </div>
      <div class="page-header">
        <div>
          <h1 class="page-title">WhatsApp</h1>
          <p class="page-subtitle">Mensajes de WhatsApp enviados y recibidos</p>
        </div>
        <button class="btn-primary" (click)="showModal = true">
          <span class="material-icons">chat_bubble</span> Nuevo Mensaje
        </button>
      </div>

      @if (loading()) {
        <div class="spinner-container"><div class="spinner"></div><p>Cargando mensajes...</p></div>
      } @else {
        <div class="card no-pad">
          <table class="crm-table">
            <thead>
              <tr><th>Cliente</th><th>Teléfono</th><th>Mensaje</th><th>Estado</th><th>Fecha</th></tr>
            </thead>
            <tbody>
              @for (sms of smsMessages(); track sms.id) {
                <tr>
                  <td>
                    @if (sms.cliente_nombre || sms.recipient_name) {
                      <span class="cliente-chip">{{ sms.cliente_nombre || sms.recipient_name }}</span>
                    } @else {
                      <span style="color:#8892a0">—</span>
                    }
                  </td>
                  <td>{{ sms.phone_number }}</td>
                  <td class="msg-cell">{{ sms.message }}</td>
                  <td><span class="badge" [class]="getStatusBadge(sms.status)">{{ sms.status }}</span></td>
                  <td>{{ formatDate(sms.created_at) }}</td>
                </tr>
              }
              @if (smsMessages().length === 0) {
                <tr><td colspan="5" style="text-align:center;padding:40px;color:#8892a0">No hay mensajes de WhatsApp registrados</td></tr>
              }
            </tbody>
          </table>
        </div>
      }

      @if (showModal) {
        <div class="modal-overlay" (click)="showModal = false">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Nuevo Mensaje WhatsApp</h2>
              <button class="modal-close" (click)="showModal = false"><span class="material-icons">close</span></button>
            </div>
            <form (ngSubmit)="sendSMS()" class="modal-form">
              <div class="field-group">
                <label class="field-label">Cliente</label>
                <select [(ngModel)]="newSms.cliente_id" name="cliente_id" class="crm-input" (change)="onClienteChange()">
                  <option value="">— Sin asignar —</option>
                  @for (c of clientes(); track c.id) {
                    <option [value]="c.id">{{ c.nombre }}</option>
                  }
                </select>
              </div>
              <div class="field-group"><label class="field-label">Teléfono *</label><input type="tel" [(ngModel)]="newSms.phone" name="phone" class="crm-input" placeholder="+34 600 000 000" required></div>
              <div class="field-group"><label class="field-label">Mensaje *</label><textarea [(ngModel)]="newSms.message" name="message" class="crm-input" rows="4" style="resize:vertical" required></textarea></div>
              <div class="modal-actions">
                <button type="button" class="btn-secondary" (click)="showModal = false">Cancelar</button>
                <button type="submit" class="btn-primary" [disabled]="saving()">{{ saving() ? 'Enviando...' : 'Enviar Mensaje' }}</button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .sms-page { display: flex; flex-direction: column; gap: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; }
    .msg-cell { max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .cliente-chip { background: #e6f0fe; color: #004179; padding: 2px 8px; border-radius: 10px; font-size: 12px; font-weight: 600; white-space: nowrap; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .modal-card { background: white; border-radius: 16px; width: 100%; max-width: 440px; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 24px; border-bottom: 1px solid #e0e0e8; h2 { font-size: 18px; font-weight: 700; color: #2A3548; } }
    .modal-close { background: transparent; border: none; cursor: pointer; color: #8892a0; .material-icons { font-size: 22px; } }
    .modal-form { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
    .field-group { display: flex; flex-direction: column; gap: 8px; }
    .field-label { font-size: 13px; font-weight: 600; color: #2A3548; }
    .modal-actions { display: flex; gap: 12px; justify-content: flex-end; }
  `]
})
export class SmsComponent implements OnInit {
  smsMessages = signal<any[]>([]);
  clientes = signal<any[]>([]);
  loading = signal(true);
  saving = signal(false);
  showModal = false;
  newSms = { phone: '', message: '', cliente_id: '', cliente_nombre: '' };

  constructor(private supabase: SupabaseClientService) {}

  async ngOnInit(): Promise<void> {
    const [{ data: msgs }, { data: clientes }] = await Promise.all([
      this.supabase.supabase.from('sms').select('*').order('created_at', { ascending: false }),
      this.supabase.supabase.from('clientes').select('id, nombre').order('nombre')
    ]);
    this.smsMessages.set(msgs || []);
    this.clientes.set(clientes || []);
    this.loading.set(false);
  }

  onClienteChange(): void {
    const c = this.clientes().find(cl => cl.id === this.newSms.cliente_id);
    this.newSms.cliente_nombre = c?.nombre || '';
  }

  getStatusBadge(status: string): string {
    const m: Record<string, string> = { sent: 'badge-success', failed: 'badge-danger', pending: 'badge-warning' };
    return m[status] || 'badge-info';
  }

  formatDate(d: string): string {
    return d ? new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  }

  async sendSMS(): Promise<void> {
    if (!this.newSms.phone || !this.newSms.message) return;
    this.saving.set(true);
    const payload: any = { phone_number: this.newSms.phone, message: this.newSms.message, status: 'sent', cliente_nombre: this.newSms.cliente_nombre || null };
    if (this.newSms.cliente_id) payload.cliente_id = this.newSms.cliente_id;
    await this.supabase.supabase.from('sms').insert([payload]);
    this.saving.set(false);
    this.showModal = false;
    this.newSms = { phone: '', message: '', cliente_id: '', cliente_nombre: '' };
    await this.ngOnInit();
  }
}
