import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseClientService } from '../../../../core/services/supabase-client.service';

type TabId = 'llamadas' | 'whatsapp' | 'documentos' | 'seguimiento';

@Component({
  selector: 'app-cliente-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="detail-page">

      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <span (click)="router.navigate(['/clientes'])" style="cursor:pointer;color:#239ebc">Clientes</span>
        <span class="material-icons breadcrumb-sep">chevron_right</span>
        <span class="breadcrumb-current">{{ cliente()?.nombre || 'Detalle' }}</span>
      </div>

      <div class="page-header">
        <button class="btn-secondary back-btn" (click)="router.navigate(['/clientes'])">
          <span class="material-icons">arrow_back</span> Volver
        </button>
        @if (!editMode()) {
          <button class="btn-primary" (click)="startEdit()">
            <span class="material-icons">edit</span> Editar Cliente
          </button>
        }
      </div>

      @if (successMsg()) {
        <div class="success-alert"><span class="material-icons">check_circle</span>{{ successMsg() }}</div>
      }
      @if (errorMsg()) {
        <div class="error-alert"><span class="material-icons">error_outline</span>{{ errorMsg() }}</div>
      }

      @if (loading()) {
        <div class="spinner-container"><div class="spinner"></div></div>
      } @else if (!cliente()) {
        <div class="empty-state"><p>Cliente no encontrado</p></div>
      } @else {
        <div class="detail-layout">

          <!-- Panel izquierdo: perfil -->
          <div class="profile-panel card">
            <div class="profile-avatar">{{ getInitials(cliente()!.nombre) }}</div>

            @if (!editMode()) {
              <h2 class="profile-name">{{ cliente()!.nombre }}</h2>
              <p class="profile-company">{{ cliente()!.empresa || 'Sin empresa' }}</p>
              <span class="badge" [class]="getBadgeClass(cliente()!.estado)">{{ cliente()!.estado }}</span>
              <div class="contact-info">
                @if (cliente()!.email) {
                  <div class="contact-row"><span class="material-icons">email</span><span>{{ cliente()!.email }}</span></div>
                }
                @if (cliente()!.telefono) {
                  <div class="contact-row"><span class="material-icons">phone</span><span>{{ cliente()!.telefono }}</span></div>
                }
                @if (cliente()!.notas) {
                  <div class="contact-row notas-row"><span class="material-icons">notes</span><span>{{ cliente()!.notas }}</span></div>
                }
                <div class="contact-row"><span class="material-icons">calendar_today</span><span>Cliente desde: {{ formatDate(cliente()!.created_at) }}</span></div>
              </div>
            } @else {
              <h3 class="edit-title">Editar Cliente</h3>
              <div class="edit-form">
                <div class="field-group"><label class="field-label">Nombre *</label><input type="text" class="crm-input" [(ngModel)]="form.nombre"></div>
                <div class="field-group"><label class="field-label">Empresa</label><input type="text" class="crm-input" [(ngModel)]="form.empresa"></div>
                <div class="field-group"><label class="field-label">Email</label><input type="email" class="crm-input" [(ngModel)]="form.email"></div>
                <div class="field-group"><label class="field-label">Teléfono</label><input type="text" class="crm-input" [(ngModel)]="form.telefono"></div>
                <div class="field-group"><label class="field-label">Estado</label>
                  <select class="crm-input" [(ngModel)]="form.estado">
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="potencial">Potencial</option>
                  </select>
                </div>
                <div class="field-group"><label class="field-label">Notas</label><textarea class="crm-input" [(ngModel)]="form.notas" rows="3"></textarea></div>
                <div class="edit-actions">
                  <button class="btn-secondary" (click)="cancelEdit()" [disabled]="saving()">Cancelar</button>
                  <button class="btn-primary" (click)="saveEdit()" [disabled]="saving()">{{ saving() ? 'Guardando...' : 'Guardar' }}</button>
                </div>
              </div>
            }
          </div>

          <!-- Panel derecho: tabs -->
          <div class="tabs-panel">
            <!-- Tab headers -->
            <div class="tab-bar">
              @for (tab of tabs; track tab.id) {
                <button class="tab-btn" [class.tab-btn--active]="activeTab() === tab.id" (click)="activeTab.set(tab.id)">
                  <span class="material-icons tab-icon">{{ tab.icon }}</span>
                  <span>{{ tab.label }}</span>
                  <span class="tab-count">{{ getCount(tab.id) }}</span>
                </button>
              }
            </div>

            <!-- Tab content -->
            <div class="tab-content card">

              <!-- LLAMADAS -->
              @if (activeTab() === 'llamadas') {
                <div class="tab-header">
                  <h3>Historial de Llamadas</h3>
                  <!-- Llamadas no disponibles (CloudTalk desactivado) -->
                </div>
                @if (llamadas().length === 0) {
                  <div class="empty-tab">
                    <span class="material-icons">phone_disabled</span>
                    <p>No hay llamadas registradas para este cliente</p>
                  </div>
                } @else {
                  @for (call of llamadas(); track call.id) {
                    <div class="history-item">
                      <div class="hi-icon" [class.hi-icon--in]="call.direction === 'inbound'">
                        <span class="material-icons">{{ call.direction === 'inbound' ? 'phone_callback' : 'phone_forwarded' }}</span>
                      </div>
                      <div class="hi-info">
                        <span class="hi-title">{{ call.status }}</span>
                        <span class="hi-date">{{ formatDate(call.created_at) }}</span>
                      </div>
                      <span class="hi-extra">{{ formatDuration(call.duration) }}</span>
                    </div>
                  }
                }
              }

              <!-- WHATSAPP -->
              @if (activeTab() === 'whatsapp') {
                <div class="tab-header">
                  <h3>WhatsApp</h3>
                  <button class="btn-primary btn-sm" (click)="showWAModal = true">
                    <span class="material-icons">chat_bubble</span> Nuevo Mensaje
                  </button>
                </div>
                @if (mensajes().length === 0) {
                  <div class="empty-tab">
                    <span class="material-icons">chat_bubble_outline</span>
                    <p>No hay mensajes de WhatsApp para este cliente</p>
                  </div>
                } @else {
                  @for (msg of mensajes(); track msg.id) {
                    <div class="history-item">
                      <div class="hi-icon hi-icon--wa">
                        <span class="material-icons">chat_bubble</span>
                      </div>
                      <div class="hi-info">
                        <span class="hi-title msg-preview">{{ msg.message }}</span>
                        <span class="hi-date">{{ msg.phone_number }} · {{ formatDate(msg.created_at) }}</span>
                      </div>
                      <span class="badge" [class]="getStatusBadge(msg.status)">{{ msg.status }}</span>
                    </div>
                  }
                }
              }

              <!-- DOCUMENTOS -->
              @if (activeTab() === 'documentos') {
                <div class="tab-header">
                  <h3>Documentos</h3>
                  <button class="btn-primary btn-sm" (click)="showDocModal = true">
                    <span class="material-icons">upload_file</span> Subir Documento
                  </button>
                </div>
                @if (documentos().length === 0) {
                  <div class="empty-tab">
                    <span class="material-icons">description</span>
                    <p>No hay documentos asociados a este cliente</p>
                  </div>
                } @else {
                  @for (doc of documentos(); track doc.id) {
                    <div class="history-item">
                      <div class="hi-icon hi-icon--doc">
                        <span class="material-icons">description</span>
                      </div>
                      <div class="hi-info">
                        <span class="hi-title">{{ doc.nombre }}</span>
                        <span class="hi-date">{{ doc.categoria }} · {{ formatDate(doc.created_at) }}</span>
                      </div>
                      <button class="icon-btn-sm" (click)="openDoc(doc.url)" title="Abrir">
                        <span class="material-icons">open_in_new</span>
                      </button>
                    </div>
                  }
                }
              }

              <!-- SEGUIMIENTO -->
              @if (activeTab() === 'seguimiento') {
                <div class="tab-header">
                  <h3>Seguimiento</h3>
                  <button class="btn-primary btn-sm" (click)="showSegModal = true">
                    <span class="material-icons">add</span> Nueva Tarea
                  </button>
                </div>
                @if (seguimiento().length === 0) {
                  <div class="empty-tab">
                    <span class="material-icons">folder_open</span>
                    <p>No hay tareas de seguimiento para este cliente</p>
                  </div>
                } @else {
                  @for (seg of seguimiento(); track seg.id) {
                    <div class="history-item">
                      <div class="hi-icon" [class]="getPriorityIconClass(seg.prioridad)">
                        <span class="material-icons">task_alt</span>
                      </div>
                      <div class="hi-info">
                        <span class="hi-title">{{ seg.titulo }}</span>
                        <span class="hi-date">Vence: {{ formatDate(seg.fecha_limite) }}</span>
                      </div>
                      <span class="badge" [class]="getEstadoBadge(seg.estado)">{{ seg.estado }}</span>
                    </div>
                  }
                }
              }

            </div>
          </div>
        </div>
      }
    </div>

    <!-- MODAL: Nuevo WhatsApp -->
    @if (showWAModal) {
      <div class="modal-overlay" (click)="showWAModal = false">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Nuevo Mensaje WhatsApp</h2>
            <button class="icon-close" (click)="showWAModal = false"><span class="material-icons">close</span></button>
          </div>
          <div class="modal-body">
            <div class="field-group"><label class="field-label">Teléfono *</label><input type="tel" class="crm-input" [(ngModel)]="waForm.phone" placeholder="+34 600 000 000"></div>
            <div class="field-group"><label class="field-label">Mensaje *</label><textarea class="crm-input" [(ngModel)]="waForm.message" rows="4" style="resize:vertical"></textarea></div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="showWAModal = false">Cancelar</button>
            <button class="btn-primary" (click)="saveWA()" [disabled]="saving()">{{ saving() ? 'Enviando...' : 'Enviar Mensaje' }}</button>
          </div>
        </div>
      </div>
    }

    <!-- MODAL: Subir Documento -->
    @if (showDocModal) {
      <div class="modal-overlay" (click)="showDocModal = false">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Subir Documento</h2>
            <button class="icon-close" (click)="showDocModal = false"><span class="material-icons">close</span></button>
          </div>
          <div class="modal-body">
            <div class="field-group"><label class="field-label">Nombre *</label><input type="text" class="crm-input" [(ngModel)]="docForm.nombre" placeholder="Nombre del documento"></div>
            <div class="field-group"><label class="field-label">Categoría</label>
              <select class="crm-input" [(ngModel)]="docForm.categoria">
                <option>Contratos</option><option>Facturas</option><option>Propuestas</option><option>Otros</option>
              </select>
            </div>
            <div class="field-group"><label class="field-label">Tipo</label>
              <select class="crm-input" [(ngModel)]="docForm.tipo">
                <option value="application/pdf">PDF</option>
                <option value="application/vnd.ms-excel">Excel</option>
                <option value="application/msword">Word</option>
                <option value="image/png">Imagen</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="showDocModal = false">Cancelar</button>
            <button class="btn-primary" (click)="saveDoc()" [disabled]="saving()">{{ saving() ? 'Guardando...' : 'Guardar' }}</button>
          </div>
        </div>
      </div>
    }

    <!-- MODAL: Nueva Tarea de Seguimiento -->
    @if (showSegModal) {
      <div class="modal-overlay" (click)="showSegModal = false">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Nueva Tarea de Seguimiento</h2>
            <button class="icon-close" (click)="showSegModal = false"><span class="material-icons">close</span></button>
          </div>
          <div class="modal-body">
            <div class="field-group"><label class="field-label">Título *</label><input type="text" class="crm-input" [(ngModel)]="segForm.titulo" placeholder="Título de la tarea"></div>
            <div class="field-group"><label class="field-label">Descripción</label><textarea class="crm-input" [(ngModel)]="segForm.descripcion" rows="2" style="resize:vertical"></textarea></div>
            <div class="form-grid-2">
              <div class="field-group"><label class="field-label">Estado</label>
                <select class="crm-input" [(ngModel)]="segForm.estado">
                  <option value="pendiente">Pendiente</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="completado">Completado</option>
                </select>
              </div>
              <div class="field-group"><label class="field-label">Prioridad</label>
                <select class="crm-input" [(ngModel)]="segForm.prioridad">
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
            </div>
            <div class="field-group"><label class="field-label">Fecha límite</label><input type="date" class="crm-input" [(ngModel)]="segForm.fecha_limite"></div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="showSegModal = false">Cancelar</button>
            <button class="btn-primary" (click)="saveSeg()" [disabled]="saving()">{{ saving() ? 'Guardando...' : 'Crear Tarea' }}</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .detail-page { display: flex; flex-direction: column; gap: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; }
    .back-btn { display: inline-flex; align-items: center; gap: 6px; .material-icons { font-size: 18px; } }

    /* Layout dos columnas */
    .detail-layout { display: grid; grid-template-columns: 300px 1fr; gap: 24px; align-items: flex-start;
      @media (max-width: 900px) { grid-template-columns: 1fr; }
    }

    /* Perfil */
    .profile-panel { display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; }
    .profile-avatar { width: 80px; height: 80px; border-radius: 50%; background: #004179; color: white; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; }
    .profile-name { font-size: 20px; font-weight: 700; color: #2A3548; }
    .profile-company { font-size: 14px; color: #8892a0; }
    .contact-info { width: 100%; margin-top: 8px; display: flex; flex-direction: column; gap: 10px; text-align: left; }
    .contact-row { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #2A3548; .material-icons { font-size: 18px; color: #8892a0; flex-shrink: 0; margin-top: 1px; } }
    .notas-row { background: #f9fafb; border-radius: 6px; padding: 10px; }
    .edit-title { font-size: 16px; font-weight: 700; color: #2A3548; align-self: flex-start; }
    .edit-form { width: 100%; display: flex; flex-direction: column; gap: 14px; }
    .field-group { display: flex; flex-direction: column; gap: 6px; text-align: left; }
    .field-label { font-size: 13px; font-weight: 600; color: #2A3548; }
    textarea.crm-input { resize: vertical; min-height: 64px; }
    .edit-actions { display: flex; gap: 10px; justify-content: flex-end; }

    /* Tabs */
    .tabs-panel { display: flex; flex-direction: column; gap: 0; }
    .tab-bar { display: flex; gap: 0; border-bottom: 2px solid #e0e0e8; overflow-x: auto; }
    .tab-btn { display: flex; align-items: center; gap: 6px; padding: 12px 18px; border: none; background: transparent; cursor: pointer; font-family: 'Open Sans', sans-serif; font-size: 13px; font-weight: 600; color: #8892a0; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.15s; white-space: nowrap;
      &:hover { color: #004179; background: #f5f7fa; }
      &--active { color: #004179; border-bottom-color: #004179; background: transparent; }
    }
    .tab-icon { font-size: 16px; }
    .tab-count { background: #e6f0fe; color: #004179; padding: 2px 6px; border-radius: 10px; font-size: 11px; font-weight: 700; }
    .tab-btn--active .tab-count { background: #004179; color: white; }

    .tab-content { border-radius: 0 0 10px 10px; min-height: 220px; }
    .tab-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; h3 { font-size: 16px; font-weight: 700; color: #2A3548; } }

    .btn-sm { padding: 7px 14px; font-size: 13px; }

    /* History items */
    .history-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f0f0f4; &:last-child { border-bottom: none; } }
    .hi-icon { width: 38px; height: 38px; border-radius: 50%; background: #e6f0fe; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      .material-icons { font-size: 18px; color: #004179; }
      &--in { background: #d4edda; .material-icons { color: #155724; } }
      &--wa { background: #e8f5e9; .material-icons { color: #2e7d32; } }
      &--doc { background: #fff3e0; .material-icons { color: #e65100; } }
      &--high { background: #fdecea; .material-icons { color: #c62828; } }
      &--med { background: #fff3cd; .material-icons { color: #856404; } }
    }
    .hi-info { flex: 1; display: flex; flex-direction: column; gap: 2px; overflow: hidden; }
    .hi-title { font-size: 13px; font-weight: 600; color: #2A3548; }
    .hi-date { font-size: 11px; color: #8892a0; }
    .hi-extra { font-size: 13px; color: #8892a0; white-space: nowrap; }
    .msg-preview { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    .icon-btn-sm { background: transparent; border: 1px solid #e0e0e8; border-radius: 6px; padding: 5px; cursor: pointer; color: #004179; transition: all 0.15s; &:hover { background: #e6f0fe; } .material-icons { font-size: 14px; display: block; } }

    .empty-tab { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 48px 0; color: #8892a0; .material-icons { font-size: 40px; color: #e0e0e8; } p { font-size: 14px; } }

    /* Modales */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .modal-container { background: white; border-radius: 12px; width: 100%; max-width: 520px; box-shadow: 0 16px 48px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; }
    .modal-header { padding: 20px 24px; border-bottom: 1px solid #e0e0e8; display: flex; justify-content: space-between; align-items: center; h2 { font-size: 17px; font-weight: 700; color: #2A3548; } }
    .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
    .modal-footer { padding: 16px 24px; border-top: 1px solid #e0e0e8; display: flex; justify-content: flex-end; gap: 12px; }
    .icon-close { background: transparent; border: none; cursor: pointer; color: #8892a0; padding: 4px; &:hover { color: #2A3548; } .material-icons { font-size: 20px; } }
    .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

    /* Alertas */
    .success-alert { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; color: #155724; font-size: 14px; .material-icons { font-size: 18px; } }
    .error-alert { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #fdecea; border: 1px solid #f5c6cb; border-radius: 8px; color: #721c24; font-size: 14px; .material-icons { font-size: 18px; } }
  `]
})
export class ClienteDetailComponent implements OnInit {
  cliente = signal<any>(null);
  llamadas = signal<any[]>([]);
  mensajes = signal<any[]>([]);
  documentos = signal<any[]>([]);
  seguimiento = signal<any[]>([]);
  loading = signal(true);
  saving = signal(false);
  editMode = signal(false);
  successMsg = signal('');
  errorMsg = signal('');
  activeTab = signal<TabId>('llamadas');

  showWAModal = false;
  showDocModal = false;
  showSegModal = false;

  tabs = [
    { id: 'llamadas' as TabId,   icon: 'phone',           label: 'Llamadas'    },
    { id: 'whatsapp' as TabId,   icon: 'chat_bubble',     label: 'WhatsApp'    },
    { id: 'documentos' as TabId, icon: 'description',     label: 'Documentos'  },
    { id: 'seguimiento' as TabId,icon: 'folder_open',     label: 'Seguimiento' },
  ];

  form = { nombre: '', empresa: '', email: '', telefono: '', estado: 'activo', notas: '' };
  waForm  = { phone: '', message: '' };
  docForm = { nombre: '', categoria: 'Contratos', tipo: 'application/pdf' };
  segForm = { titulo: '', descripcion: '', estado: 'pendiente', prioridad: 'media', fecha_limite: '' };

  private clienteId = '';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private supabase: SupabaseClientService
  ) {}

  async ngOnInit(): Promise<void> {
    this.clienteId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.clienteId) return;
    this.loading.set(true);
    await this.loadAll();
    this.loading.set(false);
  }

  private async loadAll(): Promise<void> {
    const clienteNombre = (await this.supabase.supabase.from('clientes').select('nombre').eq('id', this.clienteId).single()).data?.nombre || '';

    const [c, calls, msgs, docs, segs] = await Promise.all([
      this.supabase.supabase.from('clientes').select('*').eq('id', this.clienteId).single(),
      this.supabase.supabase.from('llamadas').select('*').eq('cliente_id', this.clienteId).order('created_at', { ascending: false }),
      this.supabase.supabase.from('sms').select('*')
        .or(`cliente_id.eq.${this.clienteId},cliente_nombre.eq.${clienteNombre}`)
        .order('created_at', { ascending: false }),
      this.supabase.supabase.from('documentos').select('*')
        .or(`cliente_id.eq.${this.clienteId},cliente_nombre.eq.${clienteNombre}`)
        .order('created_at', { ascending: false }),
      this.supabase.supabase.from('seguimiento').select('*')
        .or(`cliente_id.eq.${this.clienteId},cliente_nombre.eq.${clienteNombre}`)
        .order('created_at', { ascending: false }),
    ]);
    this.cliente.set(c.data);
    this.llamadas.set(calls.data || []);
    this.mensajes.set(msgs.data || []);
    this.documentos.set(docs.data || []);
    this.seguimiento.set(segs.data || []);
  }

  getCount(tab: TabId): number {
    const map: Record<TabId, number> = {
      llamadas: this.llamadas().length,
      whatsapp: this.mensajes().length,
      documentos: this.documentos().length,
      seguimiento: this.seguimiento().length,
    };
    return map[tab];
  }

  startEdit(): void {
    const c = this.cliente()!;
    this.form = { nombre: c.nombre || '', empresa: c.empresa || '', email: c.email || '', telefono: c.telefono || '', estado: c.estado || 'activo', notas: c.notas || '' };
    this.editMode.set(true);
    this.successMsg.set(''); this.errorMsg.set('');
  }

  cancelEdit(): void { this.editMode.set(false); }

  async saveEdit(): Promise<void> {
    if (!this.form.nombre.trim()) { this.errorMsg.set('El nombre es obligatorio'); return; }
    this.saving.set(true); this.errorMsg.set('');
    const { error } = await this.supabase.supabase.from('clientes').update({ ...this.form, updated_at: new Date().toISOString() }).eq('id', this.clienteId);
    this.saving.set(false);
    if (error) { this.errorMsg.set('Error: ' + error.message); return; }
    const { data } = await this.supabase.supabase.from('clientes').select('*').eq('id', this.clienteId).single();
    this.cliente.set(data);
    this.editMode.set(false);
    this.successMsg.set('Cliente actualizado correctamente');
    setTimeout(() => this.successMsg.set(''), 3000);
  }

  async saveWA(): Promise<void> {
    if (!this.waForm.phone || !this.waForm.message) return;
    this.saving.set(true);
    await this.supabase.supabase.from('sms').insert([{ phone_number: this.waForm.phone, message: this.waForm.message, status: 'sent', cliente_id: this.clienteId, cliente_nombre: this.cliente()!.nombre }]);
    this.saving.set(false);
    this.showWAModal = false;
    this.waForm = { phone: '', message: '' };
    const { data } = await this.supabase.supabase.from('sms').select('*').eq('cliente_id', this.clienteId).order('created_at', { ascending: false });
    this.mensajes.set(data || []);
  }

  async saveDoc(): Promise<void> {
    if (!this.docForm.nombre.trim()) return;
    this.saving.set(true);
    await this.supabase.supabase.from('documentos').insert([{ ...this.docForm, cliente_id: this.clienteId, cliente_nombre: this.cliente()!.nombre }]);
    this.saving.set(false);
    this.showDocModal = false;
    this.docForm = { nombre: '', categoria: 'Contratos', tipo: 'application/pdf' };
    const { data } = await this.supabase.supabase.from('documentos').select('*').eq('cliente_id', this.clienteId).order('created_at', { ascending: false });
    this.documentos.set(data || []);
  }

  async saveSeg(): Promise<void> {
    if (!this.segForm.titulo.trim()) return;
    this.saving.set(true);
    await this.supabase.supabase.from('seguimiento').insert([{ ...this.segForm, cliente_id: this.clienteId, cliente_nombre: this.cliente()!.nombre }]);
    this.saving.set(false);
    this.showSegModal = false;
    this.segForm = { titulo: '', descripcion: '', estado: 'pendiente', prioridad: 'media', fecha_limite: '' };
    const { data } = await this.supabase.supabase.from('seguimiento').select('*').eq('cliente_id', this.clienteId).order('created_at', { ascending: false });
    this.seguimiento.set(data || []);
  }

  openDoc(url: string): void { if (url) window.open(url, '_blank'); }

  getInitials(n: string): string { return (n || '').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase(); }
  getBadgeClass(e: string): string { return ({ activo: 'badge-success', inactivo: 'badge-danger', potencial: 'badge-warning' } as any)[e] || 'badge-info'; }
  getStatusBadge(s: string): string { return ({ sent: 'badge-success', failed: 'badge-danger', pending: 'badge-warning' } as any)[s] || 'badge-info'; }
  getEstadoBadge(e: string): string { return ({ pendiente: 'badge-warning', en_progreso: 'badge-info', completado: 'badge-success' } as any)[e] || 'badge-info'; }
  getPriorityIconClass(p: string): string { return p === 'alta' ? 'hi-icon hi-icon--high' : p === 'media' ? 'hi-icon hi-icon--med' : 'hi-icon'; }
  formatDate(d: string): string { return d ? new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'; }
  formatDuration(s: number): string { if (!s) return '—'; return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`; }
}
