import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseClientService } from '../../../../core/services/supabase-client.service';

interface UserProfile {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
  created_at: string;
}

@Component({
  selector: 'app-usuarios-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="usuarios-page">
      <div class="breadcrumb">
        <span>CRM</span><span class="material-icons breadcrumb-sep">chevron_right</span>
        <span>Configuración</span><span class="material-icons breadcrumb-sep">chevron_right</span>
        <span class="breadcrumb-current">Usuarios</span>
      </div>
      <div class="page-header">
        <div>
          <h1 class="page-title">Gestión de Usuarios</h1>
          <p class="page-subtitle">Administra los usuarios con acceso al CRM</p>
        </div>
        <button class="btn-primary" (click)="openCreateModal()">
          <span class="material-icons">person_add</span> Nuevo Usuario
        </button>
      </div>

      @if (successMsg()) {
        <div class="success-alert"><span class="material-icons">check_circle</span>{{ successMsg() }}</div>
      }
      @if (errorMsg()) {
        <div class="error-alert"><span class="material-icons">error_outline</span>{{ errorMsg() }}</div>
      }

      @if (loading()) {
        <div class="spinner-container"><div class="spinner"></div></div>
      } @else {
        <div class="card no-pad">
          <table class="crm-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Desde</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (user of users(); track user.id) {
                <tr [class.row-inactive]="!user.activo">
                  <td>
                    <div class="user-cell">
                      <div class="user-avatar" [class.avatar-inactive]="!user.activo">{{ getInitials(user.nombre) }}</div>
                      <span class="user-name">{{ user.nombre }}</span>
                    </div>
                  </td>
                  <td class="email-cell">{{ user.email }}</td>
                  <td>
                    <span class="role-badge" [class]="getRolClass(user.rol)">
                      <span class="material-icons role-icon">{{ getRolIcon(user.rol) }}</span>
                      {{ getRolLabel(user.rol) }}
                    </span>
                  </td>
                  <td>
                    <button class="status-toggle" [class.status-active]="user.activo" [class.status-inactive]="!user.activo"
                      (click)="toggleActivo(user)" [disabled]="saving()">
                      <span class="material-icons">{{ user.activo ? 'check_circle' : 'cancel' }}</span>
                      {{ user.activo ? 'Activo' : 'Inactivo' }}
                    </button>
                  </td>
                  <td class="date-cell">{{ formatDate(user.created_at) }}</td>
                  <td>
                    <div class="action-btns">
                      <button class="icon-btn" (click)="openEditModal(user)" title="Editar">
                        <span class="material-icons">edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              }
              @if (users().length === 0) {
                <tr><td colspan="6" class="empty-cell">No hay usuarios registrados</td></tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>

    <!-- Modal: Crear Usuario -->
    @if (showCreateModal) {
      <div class="modal-overlay" (click)="showCreateModal = false">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Nuevo Usuario</h2>
            <button class="icon-close" (click)="showCreateModal = false"><span class="material-icons">close</span></button>
          </div>
          <div class="modal-body">
            @if (modalError()) {
              <div class="error-alert sm"><span class="material-icons">error_outline</span>{{ modalError() }}</div>
            }
            <div class="field-group">
              <label class="field-label">Nombre completo *</label>
              <input type="text" class="crm-input" [(ngModel)]="createForm.nombre" placeholder="Ej. María García">
            </div>
            <div class="field-group">
              <label class="field-label">Email *</label>
              <input type="email" class="crm-input" [(ngModel)]="createForm.email" placeholder="usuario@empresa.com">
            </div>
            <div class="field-group">
              <label class="field-label">Contraseña *</label>
              <input type="password" class="crm-input" [(ngModel)]="createForm.password" placeholder="Mínimo 6 caracteres">
            </div>
            <div class="field-group">
              <label class="field-label">Rol</label>
              <select class="crm-input" [(ngModel)]="createForm.rol">
                <option value="admin">Administrador</option>
                <option value="supervisor">Supervisor</option>
                <option value="agente">Agente</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="showCreateModal = false">Cancelar</button>
            <button class="btn-primary" (click)="createUser()" [disabled]="saving()">
              {{ saving() ? 'Creando...' : 'Crear Usuario' }}
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Modal: Editar Usuario -->
    @if (showEditModal) {
      <div class="modal-overlay" (click)="showEditModal = false">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Editar Usuario</h2>
            <button class="icon-close" (click)="showEditModal = false"><span class="material-icons">close</span></button>
          </div>
          <div class="modal-body">
            <div class="field-group">
              <label class="field-label">Nombre completo</label>
              <input type="text" class="crm-input" [(ngModel)]="editForm.nombre">
            </div>
            <div class="field-group">
              <label class="field-label">Rol</label>
              <select class="crm-input" [(ngModel)]="editForm.rol">
                <option value="admin">Administrador</option>
                <option value="supervisor">Supervisor</option>
                <option value="agente">Agente</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="showEditModal = false">Cancelar</button>
            <button class="btn-primary" (click)="saveEdit()" [disabled]="saving()">
              {{ saving() ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .usuarios-page { display: flex; flex-direction: column; gap: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; }

    /* Table */
    .user-cell { display: flex; align-items: center; gap: 10px; }
    .user-avatar { width: 36px; height: 36px; border-radius: 50%; background: #004179; color: white; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
    .avatar-inactive { background: #bbbfc1; }
    .user-name { font-weight: 600; color: #2A3548; }
    .email-cell { color: #8892a0; font-size: 13px; }
    .date-cell { font-size: 13px; color: #8892a0; white-space: nowrap; }
    .row-inactive td { opacity: 0.6; }
    .empty-cell { text-align: center; padding: 40px; color: #8892a0; }

    /* Role badge */
    .role-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .role-icon { font-size: 13px; }
    .rol-admin { background: #e6f0fe; color: #004179; }
    .rol-supervisor { background: #fff3cd; color: #856404; }
    .rol-agente { background: #f0f0f0; color: #555; }

    /* Status toggle */
    .status-toggle { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 20px; border: none; cursor: pointer; font-size: 12px; font-weight: 600; font-family: 'Open Sans', sans-serif; transition: all 0.15s; .material-icons { font-size: 14px; } }
    .status-active { background: #d4edda; color: #155724; }
    .status-inactive { background: #f8d7da; color: #721c24; }

    /* Actions */
    .action-btns { display: flex; gap: 6px; }
    .icon-btn { background: transparent; border: 1px solid #e0e0e8; border-radius: 6px; padding: 6px; cursor: pointer; color: #004179; transition: all 0.15s; &:hover { background: #e6f0fe; } .material-icons { font-size: 16px; display: block; } }

    /* Modales */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .modal-card { background: white; border-radius: 14px; width: 100%; max-width: 460px; box-shadow: 0 16px 48px rgba(0,0,0,0.18); overflow: hidden; }
    .modal-header { padding: 20px 24px; border-bottom: 1px solid #e0e0e8; display: flex; justify-content: space-between; align-items: center; h2 { font-size: 17px; font-weight: 700; color: #2A3548; } }
    .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
    .modal-footer { padding: 16px 24px; border-top: 1px solid #e0e0e8; display: flex; justify-content: flex-end; gap: 12px; }
    .icon-close { background: transparent; border: none; cursor: pointer; color: #8892a0; padding: 4px; &:hover { color: #2A3548; } .material-icons { font-size: 20px; } }
    .field-group { display: flex; flex-direction: column; gap: 6px; }
    .field-label { font-size: 13px; font-weight: 600; color: #2A3548; }

    /* Alerts */
    .success-alert, .error-alert { display: flex; align-items: center; gap: 8px; padding: 12px 16px; border-radius: 8px; font-size: 14px; .material-icons { font-size: 18px; } }
    .success-alert { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
    .error-alert { background: #fdecea; border: 1px solid #f5c6cb; color: #721c24; }
    .error-alert.sm { padding: 8px 12px; font-size: 13px; }
  `]
})
export class UsuariosConfigComponent implements OnInit {
  users = signal<UserProfile[]>([]);
  loading = signal(true);
  saving = signal(false);
  successMsg = signal('');
  errorMsg = signal('');
  modalError = signal('');

  showCreateModal = false;
  showEditModal = false;
  editingId = '';

  createForm = { nombre: '', email: '', password: '', rol: 'agente' };
  editForm = { nombre: '', rol: 'agente' };

  constructor(private supabase: SupabaseClientService) {}

  async ngOnInit(): Promise<void> {
    await this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    this.loading.set(true);
    const { data } = await this.supabase.supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    this.users.set(data || []);
    this.loading.set(false);
  }

  openCreateModal(): void {
    this.createForm = { nombre: '', email: '', password: '', rol: 'agente' };
    this.modalError.set('');
    this.showCreateModal = true;
  }

  openEditModal(user: UserProfile): void {
    this.editingId = user.id;
    this.editForm = { nombre: user.nombre, rol: user.rol };
    this.showEditModal = true;
  }

  async createUser(): Promise<void> {
    if (!this.createForm.nombre.trim() || !this.createForm.email.trim() || !this.createForm.password) {
      this.modalError.set('Nombre, email y contraseña son obligatorios');
      return;
    }
    this.saving.set(true);
    this.modalError.set('');

    // Usar Service Role para crear usuario (via RPC o insertar perfil directamente)
    const { data, error } = await this.supabase.supabase.auth.signUp({
      email: this.createForm.email.trim(),
      password: this.createForm.password,
      options: { data: { full_name: this.createForm.nombre.trim() } }
    });

    if (error) {
      this.modalError.set(error.message);
      this.saving.set(false);
      return;
    }

    // Insertar/actualizar perfil con rol y nombre
    if (data.user) {
      await this.supabase.supabase.from('profiles').upsert({
        id: data.user.id,
        email: this.createForm.email.trim(),
        nombre: this.createForm.nombre.trim(),
        rol: this.createForm.rol,
        activo: true
      });
    }

    this.saving.set(false);
    this.showCreateModal = false;
    this.successMsg.set('Usuario creado correctamente');
    setTimeout(() => this.successMsg.set(''), 3000);
    await this.loadUsers();
  }

  async saveEdit(): Promise<void> {
    this.saving.set(true);
    const { error } = await this.supabase.supabase
      .from('profiles')
      .update({ nombre: this.editForm.nombre, rol: this.editForm.rol })
      .eq('id', this.editingId);
    this.saving.set(false);
    if (error) { this.errorMsg.set(error.message); return; }
    this.showEditModal = false;
    this.successMsg.set('Usuario actualizado');
    setTimeout(() => this.successMsg.set(''), 3000);
    await this.loadUsers();
  }

  async toggleActivo(user: UserProfile): Promise<void> {
    this.saving.set(true);
    await this.supabase.supabase
      .from('profiles')
      .update({ activo: !user.activo })
      .eq('id', user.id);
    this.saving.set(false);
    await this.loadUsers();
  }

  getInitials(n: string): string { return (n || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase(); }
  getRolClass(r: string): string { return `role-badge rol-${r}`; }
  getRolLabel(r: string): string { return ({ admin: 'Administrador', supervisor: 'Supervisor', agente: 'Agente' } as any)[r] || r; }
  getRolIcon(r: string): string { return ({ admin: 'admin_panel_settings', supervisor: 'manage_accounts', agente: 'person' } as any)[r] || 'person'; }
  formatDate(d: string): string { return d ? new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'; }
}
