import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseClientService } from '../../../../core/services/supabase-client.service';

interface Cliente {
  id: string;
  codigo: string;
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  estado: string;
  created_at: string;
}

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="clientes-page">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <span>CRM</span>
        <span class="material-icons breadcrumb-sep">chevron_right</span>
        <span class="breadcrumb-current">Clientes</span>
      </div>

      <div class="page-header">
        <div>
          <h1 class="page-title">Clientes</h1>
          <p class="page-subtitle">Gestiona tu base de clientes</p>
        </div>
        <div class="header-actions">
          <label class="btn-secondary import-btn">
            <span class="material-icons">upload_file</span>
            Importar CSV
            <input type="file" accept=".csv" (change)="importCSV($event)" style="display:none">
          </label>
          <button class="btn-primary" (click)="showModal = true">
            <span class="material-icons">person_add</span>
            Nuevo Cliente
          </button>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters-bar card">
        <div class="filter-field">
          <span class="material-icons filter-icon">search</span>
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (ngModelChange)="filterClientes()"
            class="crm-input with-icon"
            placeholder="Buscar por nombre, empresa o email...">
        </div>
        <select class="crm-input status-filter" [(ngModel)]="statusFilter" (ngModelChange)="filterClientes()">
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
          <option value="potencial">Potencial</option>
        </select>
      </div>

      <!-- Tabla -->
      @if (loading()) {
        <div class="spinner-container"><div class="spinner"></div><p>Cargando clientes...</p></div>
      } @else if (filtered().length === 0) {
        <div class="empty-state">
          <span class="material-icons" style="font-size:48px;color:#e0e0e8">people_outline</span>
          <p>No se encontraron clientes</p>
        </div>
      } @else {
        <div class="card no-pad">
          <table class="crm-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Empresa</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (cliente of filtered(); track cliente.id) {
                <tr>
                  <td>
                    <span class="codigo-badge">{{ cliente.codigo || '—' }}</span>
                  </td>
                  <td>
                    <div class="name-cell">
                      <div class="mini-avatar">{{ getInitials(cliente.nombre) }}</div>
                      <span>{{ cliente.nombre }}</span>
                    </div>
                  </td>
                  <td>{{ cliente.empresa || '—' }}</td>
                  <td>{{ cliente.email || '—' }}</td>
                  <td>{{ cliente.telefono || '—' }}</td>
                  <td>
                    <span class="badge" [class]="getBadgeClass(cliente.estado)">{{ cliente.estado }}</span>
                  </td>
                  <td>
                    <div class="action-btns">
                      <button class="icon-btn" title="Ver detalle" (click)="verDetalle(cliente.id)">
                        <span class="material-icons">visibility</span>
                      </button>
                      <button class="icon-btn icon-btn--danger" title="Eliminar" (click)="deleteCliente(cliente.id)">
                        <span class="material-icons">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="results-count">Mostrando {{ filtered().length }} de {{ clientes().length }} clientes</p>
      }
    </div>

    <!-- Modal nuevo cliente -->
    @if (showModal) {
      <div class="modal-overlay" (click)="showModal = false">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Nuevo Cliente</h2>
            <button class="modal-close" (click)="showModal = false">
              <span class="material-icons">close</span>
            </button>
          </div>
          <form (ngSubmit)="createCliente()" class="modal-form">
            @if (modalError()) {
              <div class="error-alert"><span class="material-icons">error_outline</span>{{ modalError() }}</div>
            }
            <div class="field-group">
              <label class="field-label">Nombre *</label>
              <input type="text" [(ngModel)]="newCliente.nombre" name="nombre" class="crm-input" required>
            </div>
            <div class="field-group autocomplete-wrapper">
              <label class="field-label">Empresa</label>
              <input
                type="text"
                [(ngModel)]="newCliente.empresa"
                name="empresa"
                class="crm-input"
                placeholder="Buscar o escribir empresa..."
                (input)="onEmpresaInput()"
                (focus)="onEmpresaInput()"
                (blur)="hideEmpresaSuggestions()"
                autocomplete="off">
              @if (empresaSuggestions().length > 0) {
                <ul class="autocomplete-list">
                  @for (sug of empresaSuggestions(); track sug) {
                    <li class="autocomplete-item" (mousedown)="selectEmpresa(sug)">{{ sug }}</li>
                  }
                </ul>
              }
            </div>
            <div class="field-group">
              <label class="field-label">Email</label>
              <input type="email" [(ngModel)]="newCliente.email" name="email" class="crm-input">
            </div>
            <div class="field-group">
              <label class="field-label">Teléfono</label>
              <input type="tel" [(ngModel)]="newCliente.telefono" name="telefono" class="crm-input">
            </div>
            <div class="field-group">
              <label class="field-label">Estado</label>
              <select [(ngModel)]="newCliente.estado" name="estado" class="crm-input">
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="potencial">Potencial</option>
              </select>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-secondary" (click)="showModal = false">Cancelar</button>
              <button type="submit" class="btn-primary" [disabled]="saving()">
                {{ saving() ? 'Guardando...' : 'Crear Cliente' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: [`
    .clientes-page { display: flex; flex-direction: column; gap: 24px; }

    .page-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; }
    .header-actions { display: flex; gap: 12px; flex-wrap: wrap; }

    .filters-bar {
      display: flex; gap: 16px; flex-wrap: wrap; padding: 16px;
      .filter-field { flex: 1; min-width: 240px; position: relative; }
      .filter-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #8892a0; pointer-events: none; }
      .crm-input.with-icon { padding-left: 44px; }
      .status-filter { min-width: 180px; }
    }

    .name-cell { display: flex; align-items: center; gap: 10px; }
    .mini-avatar { width: 32px; height: 32px; border-radius: 50%; background: #004179; color: white; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
    .codigo-badge { background: #e6f0fe; color: #004179; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 700; font-family: monospace; white-space: nowrap; }
    .error-alert { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #fdecea; border: 1px solid #f5c6cb; border-radius: 8px; color: #721c24; font-size: 13px; .material-icons { font-size: 16px; } }

    .action-btns { display: flex; gap: 6px; }
    .icon-btn { background: transparent; border: 1px solid #e0e0e8; border-radius: 6px; padding: 6px; cursor: pointer; color: #004179; transition: all 0.15s; &:hover { background: #e6f0fe; } .material-icons { font-size: 16px; } }
    .icon-btn--danger { color: #e53935; &:hover { background: #fdecea; border-color: #e53935; } }

    .results-count { font-size: 13px; color: #8892a0; }
    .empty-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px 0; color: #8892a0; }

    .import-btn { display: flex; align-items: center; gap: 6px; cursor: pointer; .material-icons { font-size: 18px; } }

    /* Modal */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .modal-card { background: white; border-radius: 16px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 24px; border-bottom: 1px solid #e0e0e8; h2 { font-size: 18px; font-weight: 700; color: #2A3548; } }
    .modal-close { background: transparent; border: none; cursor: pointer; color: #8892a0; &:hover { color: #2A3548; } .material-icons { font-size: 22px; } }
    .modal-form { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
    .field-group { display: flex; flex-direction: column; gap: 8px; }
    .field-label { font-size: 13px; font-weight: 600; color: #2A3548; }
    .modal-actions { display: flex; gap: 12px; justify-content: flex-end; padding-top: 8px; }

    /* Autocomplete */
    .autocomplete-wrapper { position: relative; }
    .autocomplete-list { position: absolute; z-index: 200; top: calc(100% + 2px); left: 0; right: 0; background: white; border: 1px solid #e0e0e8; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); max-height: 200px; overflow-y: auto; list-style: none; padding: 4px 0; margin: 0; }
    .autocomplete-item { padding: 10px 14px; font-size: 14px; color: #2A3548; cursor: pointer; transition: background 0.1s; &:hover { background: #e6f0fe; color: #004179; } }
  `]
})
export class ClientesListComponent implements OnInit {
  clientes = signal<Cliente[]>([]);
  filtered = signal<Cliente[]>([]);
  loading = signal(true);
  saving = signal(false);
  modalError = signal('');
  empresaSuggestions = signal<string[]>([]);
  showModal = false;
  searchTerm = '';
  statusFilter = '';

  newCliente = { nombre: '', empresa: '', email: '', telefono: '', estado: 'activo' };

  constructor(private supabaseService: SupabaseClientService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    await this.loadClientes();
  }

  private async loadClientes(): Promise<void> {
    this.loading.set(true);
    const { data } = await this.supabaseService.supabase
      .from('clientes').select('*').order('created_at', { ascending: false });
    this.clientes.set(data || []);
    this.filtered.set(data || []);
    this.loading.set(false);
  }

  filterClientes(): void {
    let result = this.clientes();
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(c =>
        c.nombre?.toLowerCase().includes(term) ||
        c.empresa?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term)
      );
    }
    if (this.statusFilter) {
      result = result.filter(c => c.estado === this.statusFilter);
    }
    this.filtered.set(result);
  }

  getInitials(nombre: string): string {
    return (nombre || '').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  }

  getBadgeClass(estado: string): string {
    const map: Record<string, string> = { activo: 'badge-success', inactivo: 'badge-danger', potencial: 'badge-warning' };
    return map[estado] || 'badge-info';
  }

  verDetalle(id: string): void {
    this.router.navigate(['/clientes', id]);
  }

  async deleteCliente(id: string): Promise<void> {
    if (!confirm('¿Eliminar este cliente?')) return;
    await this.supabaseService.supabase.from('clientes').delete().eq('id', id);
    await this.loadClientes();
  }

  onEmpresaInput(): void {
    const term = this.newCliente.empresa.trim().toLowerCase();
    if (!term) { this.empresaSuggestions.set([]); return; }
    const unique = [...new Set(
      this.clientes()
        .map(c => c.empresa)
        .filter(e => e && e.toLowerCase().includes(term))
    )].slice(0, 8);
    this.empresaSuggestions.set(unique as string[]);
  }

  selectEmpresa(empresa: string): void {
    this.newCliente.empresa = empresa;
    this.empresaSuggestions.set([]);
  }

  hideEmpresaSuggestions(): void {
    setTimeout(() => this.empresaSuggestions.set([]), 150);
  }

  async createCliente(): Promise<void> {
    if (!this.newCliente.nombre.trim()) return;
    this.modalError.set('');

    // Validar email único si se ingresó uno
    if (this.newCliente.email.trim()) {
      const { data: existing } = await this.supabaseService.supabase
        .from('clientes').select('id').eq('email', this.newCliente.email.trim()).maybeSingle();
      if (existing) {
        this.modalError.set('Ya existe un cliente registrado con ese email.');
        return;
      }
    }

    this.saving.set(true);
    const codigo = this.generateCodigo();
    const { error } = await this.supabaseService.supabase
      .from('clientes').insert([{ ...this.newCliente, codigo }]);
    this.saving.set(false);

    if (error) {
      if (error.code === '23505') {
        this.modalError.set('Ya existe un cliente registrado con ese email.');
      } else {
        this.modalError.set('Error al crear cliente: ' + error.message);
      }
      return;
    }
    this.showModal = false;
    this.newCliente = { nombre: '', empresa: '', email: '', telefono: '', estado: 'activo' };
    await this.loadClientes();
  }

  private generateCodigo(): string {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `CLI-${num}`;
  }

  importCSV(event: Event): void {
    // CSV import placeholder — integración con PapaParse
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      alert(`Importando: ${input.files[0].name}. Funcionalidad en desarrollo.`);
    }
  }
}
