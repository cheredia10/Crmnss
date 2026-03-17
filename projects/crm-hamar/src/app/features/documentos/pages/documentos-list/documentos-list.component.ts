import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseClientService } from '../../../../core/services/supabase-client.service';

@Component({
  selector: 'app-documentos-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="docs-page">
      <div class="breadcrumb">
        <span>CRM</span><span class="material-icons breadcrumb-sep">chevron_right</span>
        <span class="breadcrumb-current">Documentos</span>
      </div>
      <div class="page-header">
        <div>
          <h1 class="page-title">Documentos</h1>
          <p class="page-subtitle">Gestión de documentos y archivos</p>
        </div>
        <button class="btn-primary" (click)="showModal = true">
          <span class="material-icons">upload_file</span> Subir Documento
        </button>
      </div>

      <!-- Filtros -->
      <div class="filters-row">
        <div class="category-tabs">
          @for (cat of categorias; track cat) {
            <button class="cat-tab" [class.cat-tab--active]="selectedCat === cat" (click)="selectedCat = cat; filter()">
              {{ cat }}
            </button>
          }
        </div>
        <select class="crm-input cliente-filter" [(ngModel)]="selectedCliente" (ngModelChange)="filter()">
          <option value="">Todos los clientes</option>
          @for (c of clientes(); track c.id) {
            <option [value]="c.id">{{ c.nombre }}</option>
          }
        </select>
      </div>

      @if (loading()) {
        <div class="spinner-container"><div class="spinner"></div></div>
      } @else {
        <div class="docs-grid">
          @for (doc of filtered(); track doc.id) {
            <div class="doc-card card">
              <div class="doc-icon">
                <span class="material-icons">{{ getDocIcon(doc.tipo) }}</span>
              </div>
              <div class="doc-info">
                <p class="doc-name">{{ doc.nombre }}</p>
                <p class="doc-meta">{{ doc.categoria }} · {{ formatDate(doc.created_at) }}</p>
                @if (doc.cliente_nombre) {
                  <p class="doc-cliente">
                    <span class="material-icons" style="font-size:12px;vertical-align:middle">person</span>
                    {{ doc.cliente_nombre }}
                  </p>
                }
              </div>
              <div class="doc-actions">
                <button class="icon-btn" (click)="openDoc(doc.url)" title="Abrir">
                  <span class="material-icons">open_in_new</span>
                </button>
                <button class="icon-btn icon-btn--danger" (click)="deleteDoc(doc.id)" title="Eliminar">
                  <span class="material-icons">delete</span>
                </button>
              </div>
            </div>
          }
          @if (filtered().length === 0) {
            <div class="empty-state" style="grid-column:1/-1;padding:60px">
              <span class="material-icons" style="font-size:48px;color:#e0e0e8">description</span>
              <p style="color:#8892a0">No hay documentos en esta categoría</p>
            </div>
          }
        </div>
      }

      <!-- Modal subir documento -->
      @if (showModal) {
        <div class="modal-overlay" (click)="showModal = false">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Subir Documento</h2>
              <button class="modal-close" (click)="showModal = false"><span class="material-icons">close</span></button>
            </div>
            <div class="modal-form">
              <div class="field-group">
                <label class="field-label">Nombre *</label>
                <input type="text" [(ngModel)]="newDoc.nombre" class="crm-input" placeholder="Nombre del documento">
              </div>
              <div class="field-group">
                <label class="field-label">Categoría</label>
                <select [(ngModel)]="newDoc.categoria" class="crm-input">
                  <option>Contratos</option><option>Facturas</option><option>Propuestas</option><option>Otros</option>
                </select>
              </div>
              <div class="field-group">
                <label class="field-label">Cliente</label>
                <select [(ngModel)]="newDoc.cliente_id" (change)="onDocClienteChange()" class="crm-input">
                  <option value="">— Sin asignar —</option>
                  @for (c of clientes(); track c.id) {
                    <option [value]="c.id">{{ c.nombre }}</option>
                  }
                </select>
              </div>
              <div class="field-group">
                <label class="field-label">Archivo</label>
                <label class="upload-zone">
                  <span class="material-icons">cloud_upload</span>
                  <span>{{ newDoc.fileName || 'Clic para seleccionar archivo' }}</span>
                  <input type="file" (change)="onFileSelect($event)" style="display:none">
                </label>
              </div>
              <div class="modal-actions">
                <button class="btn-secondary" (click)="showModal = false">Cancelar</button>
                <button class="btn-primary" (click)="saveDoc()" [disabled]="saving()">{{ saving() ? 'Guardando...' : 'Guardar' }}</button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .docs-page { display: flex; flex-direction: column; gap: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; }
    .filters-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
    .category-tabs { display: flex; gap: 8px; flex-wrap: wrap; flex: 1; }
    .cat-tab { padding: 8px 16px; border: 1px solid #e0e0e8; border-radius: 20px; background: white; font-family: 'Open Sans', sans-serif; font-size: 13px; cursor: pointer; transition: all 0.15s; &--active { background: #004179; color: white; border-color: #004179; } &:hover:not(.cat-tab--active) { border-color: #004179; color: #004179; } }
    .cliente-filter { max-width: 220px; }
    .docs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
    .doc-card { display: flex; align-items: center; gap: 14px; padding: 16px; }
    .doc-icon { width: 44px; height: 44px; border-radius: 10px; background: #e6f0fe; display: flex; align-items: center; justify-content: center; flex-shrink: 0; .material-icons { color: #004179; font-size: 22px; } }
    .doc-info { flex: 1; overflow: hidden; }
    .doc-name { font-size: 14px; font-weight: 600; color: #2A3548; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .doc-meta { font-size: 12px; color: #8892a0; margin-top: 2px; }
    .doc-cliente { font-size: 12px; color: #004179; margin-top: 4px; font-weight: 600; }
    .doc-actions { display: flex; gap: 6px; }
    .icon-btn { background: transparent; border: 1px solid #e0e0e8; border-radius: 6px; padding: 6px; cursor: pointer; color: #004179; transition: all 0.15s; &:hover { background: #e6f0fe; } .material-icons { font-size: 16px; } }
    .icon-btn--danger { color: #e53935; &:hover { background: #fdecea; border-color: #e53935; } }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .modal-card { background: white; border-radius: 16px; width: 100%; max-width: 440px; max-height: 90vh; overflow-y: auto; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 24px; border-bottom: 1px solid #e0e0e8; h2 { font-size: 18px; font-weight: 700; color: #2A3548; } }
    .modal-close { background: transparent; border: none; cursor: pointer; color: #8892a0; .material-icons { font-size: 22px; } }
    .modal-form { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
    .field-group { display: flex; flex-direction: column; gap: 8px; }
    .field-label { font-size: 13px; font-weight: 600; color: #2A3548; }
    .upload-zone { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 32px; border: 2px dashed #e0e0e8; border-radius: 8px; cursor: pointer; transition: all 0.15s; &:hover { border-color: #004179; background: #f0f6ff; } .material-icons { font-size: 32px; color: #8892a0; } span { font-size: 13px; color: #8892a0; text-align: center; } }
    .modal-actions { display: flex; gap: 12px; justify-content: flex-end; }
  `]
})
export class DocumentosListComponent implements OnInit {
  documentos = signal<any[]>([]);
  filtered = signal<any[]>([]);
  clientes = signal<any[]>([]);
  loading = signal(true);
  saving = signal(false);
  showModal = false;
  selectedCat = 'Todos';
  selectedCliente = '';
  categorias = ['Todos', 'Contratos', 'Facturas', 'Propuestas', 'Otros'];
  newDoc = { nombre: '', categoria: 'Contratos', cliente_id: '', cliente_nombre: '', fileName: '' };

  constructor(private supabase: SupabaseClientService) {}

  async ngOnInit(): Promise<void> {
    const [{ data: docs }, { data: clientes }] = await Promise.all([
      this.supabase.supabase.from('documentos').select('*').order('created_at', { ascending: false }),
      this.supabase.supabase.from('clientes').select('id, nombre').order('nombre')
    ]);
    this.documentos.set(docs || []);
    this.clientes.set(clientes || []);
    this.filter();
    this.loading.set(false);
  }

  filter(): void {
    let docs = this.documentos();
    if (this.selectedCat !== 'Todos') docs = docs.filter(d => d.categoria === this.selectedCat);
    if (this.selectedCliente) docs = docs.filter(d => d.cliente_id === this.selectedCliente);
    this.filtered.set(docs);
  }

  onDocClienteChange(): void {
    const c = this.clientes().find(cl => cl.id === this.newDoc.cliente_id);
    this.newDoc.cliente_nombre = c?.nombre || '';
  }

  async saveDoc(): Promise<void> {
    if (!this.newDoc.nombre.trim()) return;
    this.saving.set(true);
    const payload: any = { nombre: this.newDoc.nombre.trim(), categoria: this.newDoc.categoria, tipo: 'application/pdf', cliente_nombre: this.newDoc.cliente_nombre || null };
    if (this.newDoc.cliente_id) payload.cliente_id = this.newDoc.cliente_id;
    await this.supabase.supabase.from('documentos').insert([payload]);
    this.saving.set(false);
    this.showModal = false;
    this.newDoc = { nombre: '', categoria: 'Contratos', cliente_id: '', cliente_nombre: '', fileName: '' };
    await this.ngOnInit();
  }

  getDocIcon(tipo: string): string {
    if (!tipo) return 'description';
    if (tipo.includes('pdf')) return 'picture_as_pdf';
    if (tipo.includes('image')) return 'image';
    if (tipo.includes('excel') || tipo.includes('sheet')) return 'table_chart';
    if (tipo.includes('word') || tipo.includes('document')) return 'article';
    return 'description';
  }

  formatDate(d: string): string {
    return d ? new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  }

  openDoc(url: string): void { if (url) window.open(url, '_blank'); }

  async deleteDoc(id: string): Promise<void> {
    if (!confirm('¿Eliminar este documento?')) return;
    await this.supabase.supabase.from('documentos').delete().eq('id', id);
    await this.ngOnInit();
  }

  onFileSelect(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) { this.newDoc.fileName = file.name; this.newDoc.nombre = this.newDoc.nombre || file.name; }
  }
}
