import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseClientService } from '../../../../core/services/supabase-client.service';

@Component({
  selector: 'app-seguimiento-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="seguimiento-page">

      <div class="breadcrumb">
        <span>CRM</span><span class="material-icons breadcrumb-sep">chevron_right</span>
        <span class="breadcrumb-current">Seguimiento</span>
      </div>

      <div class="page-header">
        <div>
          <h1 class="page-title">Seguimiento</h1>
          <p class="page-subtitle">{{ items().length }} tarea(s) registradas</p>
        </div>
        <button class="btn-primary" (click)="openModal()">
          <span class="material-icons">add</span>
          Nueva Tarea
        </button>
      </div>

      <!-- Alertas -->
      @if (successMsg()) {
        <div class="success-alert"><span class="material-icons">check_circle</span>{{ successMsg() }}</div>
      }

      <!-- Filtros rápidos -->
      <div class="filter-tabs">
        @for (f of filtros; track f.value) {
          <button class="filter-tab" [class.filter-tab--active]="filtroActivo() === f.value" (click)="filtroActivo.set(f.value)">
            {{ f.label }}
            <span class="tab-count">{{ countByStatus(f.value) }}</span>
          </button>
        }
      </div>

      @if (loading()) {
        <div class="spinner-container"><div class="spinner"></div></div>
      } @else {
        <div class="card no-pad">
          <table class="crm-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Prioridad</th>
                <th>Fecha límite</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (item of filteredItems(); track item.id) {
                <tr>
                  <td>
                    <span class="task-title">{{ item.titulo }}</span>
                    @if (item.descripcion) {
                      <span class="task-desc">{{ item.descripcion }}</span>
                    }
                  </td>
                  <td>{{ item.cliente_nombre || '—' }}</td>
                  <td>
                    <select class="status-select" [value]="item.estado" (change)="changeStatus(item, $event)">
                      <option value="pendiente">Pendiente</option>
                      <option value="en_progreso">En Progreso</option>
                      <option value="completado">Completado</option>
                    </select>
                  </td>
                  <td><span class="badge" [class]="getPriorityBadge(item.prioridad)">{{ item.prioridad }}</span></td>
                  <td [class.overdue]="isOverdue(item.fecha_limite, item.estado)">
                    {{ formatDate(item.fecha_limite) }}
                  </td>
                  <td>
                    <button class="icon-btn icon-btn--danger" (click)="deleteItem(item.id)" title="Eliminar">
                      <span class="material-icons">delete_outline</span>
                    </button>
                  </td>
                </tr>
              }
              @if (filteredItems().length === 0) {
                <tr>
                  <td colspan="6" style="text-align:center;padding:48px;color:#8892a0">
                    No hay tareas {{ filtroActivo() !== 'all' ? 'con este estado' : '' }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>

    <!-- MODAL: Nueva tarea -->
    @if (showModal()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Nueva Tarea de Seguimiento</h2>
            <button class="icon-btn" (click)="closeModal()"><span class="material-icons">close</span></button>
          </div>
          <div class="modal-body">
            @if (modalError()) {
              <div class="error-alert modal-alert"><span class="material-icons">error_outline</span>{{ modalError() }}</div>
            }
            <div class="form-grid">
              <div class="field-group field-full">
                <label class="field-label">Título *</label>
                <input type="text" class="crm-input" [(ngModel)]="newTask.titulo" placeholder="Título de la tarea">
              </div>
              <div class="field-group field-full">
                <label class="field-label">Descripción</label>
                <textarea class="crm-input" [(ngModel)]="newTask.descripcion" rows="2" placeholder="Descripción opcional..."></textarea>
              </div>
              <div class="field-group">
                <label class="field-label">Cliente</label>
                <select class="crm-input" [(ngModel)]="newTask.cliente_id" (change)="onClienteChange()">
                  <option value="">— Sin asignar —</option>
                  @for (c of clientes(); track c.id) {
                    <option [value]="c.id">{{ c.nombre }}</option>
                  }
                </select>
              </div>
              <div class="field-group">
                <label class="field-label">Estado</label>
                <select class="crm-input" [(ngModel)]="newTask.estado">
                  <option value="pendiente">Pendiente</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="completado">Completado</option>
                </select>
              </div>
              <div class="field-group">
                <label class="field-label">Prioridad</label>
                <select class="crm-input" [(ngModel)]="newTask.prioridad">
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
              <div class="field-group">
                <label class="field-label">Fecha límite</label>
                <input type="date" class="crm-input" [(ngModel)]="newTask.fecha_limite">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeModal()" [disabled]="saving()">Cancelar</button>
            <button class="btn-primary" (click)="saveTask()" [disabled]="saving()">
              {{ saving() ? 'Guardando...' : 'Crear Tarea' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .seguimiento-page { display: flex; flex-direction: column; gap: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; }

    /* Filtros */
    .filter-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
    .filter-tab { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border: 1px solid #e0e0e8; border-radius: 20px; background: white; cursor: pointer; font-size: 13px; font-family: 'Open Sans', sans-serif; color: #5a6474; transition: all 0.15s;
      &--active { background: #004179; color: white; border-color: #004179; }
      &:not(.filter-tab--active):hover { border-color: #004179; }
    }
    .tab-count { background: rgba(0,0,0,0.1); border-radius: 10px; padding: 1px 7px; font-size: 11px; font-weight: 700; }
    .filter-tab--active .tab-count { background: rgba(255,255,255,0.25); }

    /* Tabla */
    .task-title { display: block; font-size: 13px; font-weight: 600; color: #2A3548; }
    .task-desc { display: block; font-size: 12px; color: #8892a0; margin-top: 2px; }

    .status-select { padding: 4px 8px; border: 1px solid #e0e0e8; border-radius: 6px; font-size: 12px; font-family: 'Open Sans', sans-serif; background: white; cursor: pointer; color: #2A3548; &:focus { outline: none; border-color: #004179; } }

    .overdue { color: #e53935; font-weight: 600; }

    .icon-btn { background: transparent; border: 1px solid #e0e0e8; border-radius: 6px; padding: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s;
      &--danger { color: #e53935; &:hover { background: #fdecea; border-color: #e53935; } }
      .material-icons { font-size: 16px; }
    }

    /* Modal */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .modal-container { background: white; border-radius: 12px; width: 100%; max-width: 580px; box-shadow: 0 16px 48px rgba(0,0,0,0.2); display: flex; flex-direction: column; max-height: 90vh; overflow-y: auto; }
    .modal-header { padding: 20px 24px; border-bottom: 1px solid #e0e0e8; display: flex; justify-content: space-between; align-items: center; h2 { font-size: 18px; font-weight: 700; color: #2A3548; } }
    .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
    .modal-footer { padding: 16px 24px; border-top: 1px solid #e0e0e8; display: flex; justify-content: flex-end; gap: 12px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .field-group { display: flex; flex-direction: column; gap: 6px; }
    .field-label { font-size: 13px; font-weight: 600; color: #2A3548; }
    .field-full { grid-column: 1 / -1; }
    textarea.crm-input { resize: vertical; min-height: 64px; }
    .modal-alert { margin-bottom: 4px; }

    .success-alert { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; color: #155724; font-size: 14px; .material-icons { font-size: 18px; } }
    .error-alert { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #fdecea; border: 1px solid #f5c6cb; border-radius: 8px; color: #721c24; font-size: 14px; .material-icons { font-size: 18px; } }
  `]
})
export class SeguimientoListComponent implements OnInit {
  items = signal<any[]>([]);
  clientes = signal<any[]>([]);
  loading = signal(true);
  saving = signal(false);
  showModal = signal(false);
  successMsg = signal('');
  modalError = signal('');
  filtroActivo = signal('all');

  filtros = [
    { label: 'Todos', value: 'all' },
    { label: 'Pendiente', value: 'pendiente' },
    { label: 'En Progreso', value: 'en_progreso' },
    { label: 'Completado', value: 'completado' },
  ];

  newTask = this.emptyTask();

  constructor(private supabase: SupabaseClientService) {}

  async ngOnInit(): Promise<void> {
    await Promise.all([this.loadItems(), this.loadClientes()]);
  }

  private async loadItems(): Promise<void> {
    this.loading.set(true);
    const { data } = await this.supabase.supabase.from('seguimiento').select('*').order('created_at', { ascending: false });
    this.items.set(data || []);
    this.loading.set(false);
  }

  private async loadClientes(): Promise<void> {
    const { data } = await this.supabase.supabase.from('clientes').select('id, nombre').order('nombre');
    this.clientes.set(data || []);
  }

  filteredItems(): any[] {
    const f = this.filtroActivo();
    if (f === 'all') return this.items();
    return this.items().filter(i => i.estado === f);
  }

  countByStatus(status: string): number {
    if (status === 'all') return this.items().length;
    return this.items().filter(i => i.estado === status).length;
  }

  openModal(): void {
    this.newTask = this.emptyTask();
    this.modalError.set('');
    this.showModal.set(true);
  }

  closeModal(): void { this.showModal.set(false); }

  onClienteChange(): void {
    const c = this.clientes().find(cl => cl.id === this.newTask.cliente_id);
    this.newTask.cliente_nombre = c?.nombre || '';
  }

  async saveTask(): Promise<void> {
    if (!this.newTask.titulo.trim()) { this.modalError.set('El título es obligatorio'); return; }
    this.saving.set(true);
    this.modalError.set('');
    const payload: any = {
      titulo: this.newTask.titulo.trim(),
      descripcion: this.newTask.descripcion.trim() || null,
      estado: this.newTask.estado,
      prioridad: this.newTask.prioridad,
      fecha_limite: this.newTask.fecha_limite || null,
      cliente_nombre: this.newTask.cliente_nombre || null,
    };
    if (this.newTask.cliente_id) payload.cliente_id = this.newTask.cliente_id;
    const { error } = await this.supabase.supabase.from('seguimiento').insert(payload);
    this.saving.set(false);
    if (error) { this.modalError.set('Error: ' + error.message); return; }
    this.closeModal();
    await this.loadItems();
    this.successMsg.set('Tarea creada correctamente');
    setTimeout(() => this.successMsg.set(''), 3000);
  }

  async changeStatus(item: any, event: Event): Promise<void> {
    const newStatus = (event.target as HTMLSelectElement).value;
    await this.supabase.supabase.from('seguimiento').update({ estado: newStatus }).eq('id', item.id);
    this.items.update(arr => arr.map(i => i.id === item.id ? { ...i, estado: newStatus } : i));
  }

  async deleteItem(id: string): Promise<void> {
    if (!confirm('¿Eliminar esta tarea?')) return;
    await this.supabase.supabase.from('seguimiento').delete().eq('id', id);
    this.items.update(arr => arr.filter(i => i.id !== id));
  }

  getPriorityBadge(p: string): string {
    return ({ alta: 'badge-danger', media: 'badge-warning', baja: 'badge-success' } as any)[p] || 'badge-info';
  }

  formatDate(d: string): string { return d ? new Date(d + 'T00:00:00').toLocaleDateString('es-ES') : '—'; }

  isOverdue(fecha: string, estado: string): boolean {
    if (!fecha || estado === 'completado') return false;
    return new Date(fecha + 'T00:00:00') < new Date();
  }

  private emptyTask() {
    return { titulo: '', descripcion: '', estado: 'pendiente', prioridad: 'media', fecha_limite: '', cliente_id: '', cliente_nombre: '' };
  }
}
