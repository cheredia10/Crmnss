import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloudtalkService } from '../../../../core/services/cloudtalk.service';

@Component({
  selector: 'app-voicemails',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="voicemails-page">
      <div class="breadcrumb">
        <span>CRM</span><span class="material-icons breadcrumb-sep">chevron_right</span>
        <span class="breadcrumb-current">Buzones</span>
      </div>
      <h1 class="page-title">Buzones de Voz</h1>
      <p class="page-subtitle">Mensajes de voz recibidos</p>

      @if (loading()) {
        <div class="spinner-container"><div class="spinner"></div><p>Cargando buzones...</p></div>
      } @else if (voicemails().length === 0) {
        <div class="empty-state card">
          <span class="material-icons" style="font-size:56px;color:#e0e0e8">voicemail</span>
          <p style="font-size:16px;color:#8892a0">No hay buzones de voz</p>
          <p style="font-size:13px;color:#bbbfc1">Los mensajes de voz aparecerán aquí cuando los recibas</p>
        </div>
      } @else {
        <div class="voicemail-list">
          @for (vm of voicemails(); track vm.id) {
            <div class="voicemail-card card">
              <div class="vm-icon">
                <span class="material-icons">voicemail</span>
              </div>
              <div class="vm-info">
                <p class="vm-caller">{{ vm.caller_name || vm.phone_number || 'Desconocido' }}</p>
                <p class="vm-date">{{ formatDate(vm.created_at) }}</p>
              </div>
              <div class="vm-duration">{{ formatDuration(vm.duration) }}</div>
              @if (vm.recording_url) {
                <audio controls class="vm-player">
                  <source [src]="vm.recording_url">
                </audio>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .voicemails-page { display: flex; flex-direction: column; gap: 24px; }
    .empty-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px 40px; text-align: center; }
    .voicemail-list { display: flex; flex-direction: column; gap: 12px; }
    .voicemail-card { display: flex; align-items: center; gap: 16px; }
    .vm-icon { width: 48px; height: 48px; border-radius: 50%; background: #e6f0fe; display: flex; align-items: center; justify-content: center; flex-shrink: 0; .material-icons { color: #004179; font-size: 22px; } }
    .vm-info { flex: 1; }
    .vm-caller { font-size: 14px; font-weight: 600; color: #2A3548; }
    .vm-date { font-size: 12px; color: #8892a0; }
    .vm-duration { font-size: 13px; color: #8892a0; white-space: nowrap; }
    .vm-player { width: 200px; }
  `]
})
export class VoicemailsComponent implements OnInit {
  voicemails = signal<any[]>([]);
  loading = signal(true);

  constructor(private cloudtalk: CloudtalkService) {}

  async ngOnInit(): Promise<void> {
    // Voicemails se obtienen via CloudTalk - por defecto vacío si no hay config
    this.loading.set(false);
  }

  formatDate(d: string): string {
    return d ? new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  }

  formatDuration(secs: number): string {
    if (!secs) return '—';
    const m = Math.floor(secs / 60), s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
}
