import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CloudtalkService, CloudTalkCall } from '../../../../core/services/cloudtalk.service';

@Component({
  selector: 'app-llamadas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="llamadas-page">
      <div class="breadcrumb">
        <span>CRM</span><span class="material-icons breadcrumb-sep">chevron_right</span>
        <span class="breadcrumb-current">Llamadas</span>
      </div>
      <div class="page-header">
        <div>
          <h1 class="page-title">Llamadas</h1>
          <p class="page-subtitle">Historial de llamadas realizadas y recibidas</p>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters-bar card">
        <div style="position:relative;flex:1;min-width:200px">
          <span class="material-icons" style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#8892a0;font-size:18px;pointer-events:none">search</span>
          <input type="text" [(ngModel)]="search" (ngModelChange)="loadCalls()" class="crm-input" style="padding-left:44px" placeholder="Buscar llamada...">
        </div>
        <select class="crm-input" [(ngModel)]="direction" (ngModelChange)="loadCalls()" style="min-width:160px">
          <option value="">Todas las direcciones</option>
          <option value="inbound">Entrantes</option>
          <option value="outbound">Salientes</option>
        </select>
      </div>

      @if (loading()) {
        <div class="spinner-container"><div class="spinner"></div><p>Cargando llamadas...</p></div>
      } @else {
        <div class="card no-pad">
          <table class="crm-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Cliente</th>
                <th>Empresa</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Duración</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              @for (call of calls(); track call.id) {
                <tr>
                  <td>
                    <div class="call-type" [class.call-type--in]="call.direction === 'inbound'">
                      <span class="material-icons">{{ call.direction === 'inbound' ? 'phone_callback' : 'phone_forwarded' }}</span>
                      {{ call.direction === 'inbound' ? 'Entrante' : 'Saliente' }}
                    </div>
                  </td>
                  <td>{{ call.client_name || '—' }}</td>
                  <td>{{ call.client_company || '—' }}</td>
                  <td>{{ call.phone_number || '—' }}</td>
                  <td><span class="badge" [class]="getStatusBadge(call.status)">{{ call.status }}</span></td>
                  <td>{{ formatDuration(call.duration) }}</td>
                  <td>{{ formatDate(call.created_at) }}</td>
                </tr>
              }
              @if (calls().length === 0) {
                <tr><td colspan="7" style="text-align:center;padding:40px;color:#8892a0">No se encontraron llamadas</td></tr>
              }
            </tbody>
          </table>
        </div>
        <p class="results-count">{{ total() }} llamadas en total</p>
      }
    </div>
  `,
  styles: [`
    .llamadas-page { display: flex; flex-direction: column; gap: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; }
    .filters-bar { display: flex; gap: 16px; flex-wrap: wrap; padding: 16px; }
    .call-type { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #004179; .material-icons { font-size: 16px; } &--in { color: #155724; } }
    .results-count { font-size: 13px; color: #8892a0; }
  `]
})
export class LlamadasComponent implements OnInit {
  calls = signal<CloudTalkCall[]>([]);
  loading = signal(true);
  total = signal(0);
  search = '';
  direction = '';

  constructor(private cloudtalkService: CloudtalkService) {}

  async ngOnInit(): Promise<void> { await this.loadCalls(); }

  async loadCalls(): Promise<void> {
    this.loading.set(true);
    const result = await this.cloudtalkService.getCalls({ search: this.search, direction: this.direction });
    this.calls.set(result.data);
    this.total.set(result.total);
    this.loading.set(false);
  }

  getStatusBadge(status: string): string {
    const m: Record<string, string> = { answered: 'badge-success', missed: 'badge-danger', voicemail: 'badge-warning' };
    return m[status] || 'badge-info';
  }

  formatDuration(secs: number): string {
    if (!secs) return '—';
    const m = Math.floor(secs / 60), s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  formatDate(date: string): string {
    return date ? new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
  }
}
