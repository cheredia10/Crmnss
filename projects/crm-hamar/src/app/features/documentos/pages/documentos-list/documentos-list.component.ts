import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseClientService } from '../../../../core/services/supabase-client.service';

const BUCKET = 'document';

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
        <button class="btn-primary" (click)="openModal()">
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
              <div class="doc-icon" [class]="getDocIconClass(doc.tipo)">
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
                @if (!doc.url) {
                  <p class="doc-no-url">Sin archivo adjunto</p>
                }
              </div>
              <div class="doc-actions">
                <button class="icon-btn" (click)="openDoc(doc.url)" title="Abrir" [disabled]="!doc.url" [class.disabled]="!doc.url">
                  <span class="material-icons">open_in_new</span>
                </button>
                <button class="icon-btn icon-btn--danger" (click)="deleteDoc(doc.id, doc.storage_path)" title="Eliminar">
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
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Subir Documento</h2>
              <button class="modal-close" (click)="closeModal()"><span class="material-icons">close</span></button>
            </div>
            <div class="modal-form">

              @if (uploadError()) {
                <div class="error-alert">
                  <span class="material-icons">error_outline</span>{{ uploadError() }}
                </div>
              }

              <!-- Zona de archivo -->
              <div class="field-group">
                <label class="field-label">Archivo *</label>
                <label class="upload-zone" [class.upload-zone--selected]="docFile">
                  <span class="material-icons">{{ docFile ? 'check_circle' : 'cloud_upload' }}</span>
                  <span class="upload-filename">{{ docFile ? docFile.name : 'Clic para seleccionar archivo' }}</span>
                  <input type="file" (change)="onFileSelect($event)" style="display:none">
                </label>
              </div>

              <div class="field-group">
                <label class="field-label">Nombre</label>
                <input type="text" [(ngModel)]="newDoc.nombre" class="crm-input" placeholder="Nombre del documento (opcional)">
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

              <div class="modal-actions">
                <button class="btn-secondary" (click)="closeModal()">Cancelar</button>
                <button class="btn-primary" (click)="saveDoc()" [disabled]="saving() || !docFile">
                  {{ saving() ? 'Subiendo...' : 'Subir Documento' }}
                </button>
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
    .doc-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; .material-icons { font-size: 22px; } }
    .doc-icon { background: #e6f0fe; .material-icons { color: #004179; } }
    .doc-icon.pdf { background: #fdecea; .material-icons { color: #c62828; } }
    .doc-icon.img { background: #e8f5e9; .material-icons { color: #2e7d32; } }
    .doc-icon.xls { background: #e8f5e9; .material-icons { color: #1b5e20; } }
    .doc-icon.doc { background: #e3f2fd; .material-icons { color: #0d47a1; } }
    .doc-info { flex: 1; overflow: hidden; }
    .doc-name { font-size: 14px; font-weight: 600; color: #2A3548; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .doc-meta { font-size: 12px; color: #8892a0; margin-top: 2px; }
    .doc-cliente { font-size: 12px; color: #004179; margin-top: 4px; font-weight: 600; }
    .doc-no-url { font-size: 11px; color: #e65100; margin-top: 2px; }
    .doc-actions { display: flex; gap: 6px; }
    .icon-btn { background: transparent; border: 1px solid #e0e0e8; border-radius: 6px; padding: 6px; cursor: pointer; color: #004179; transition: all 0.15s; &:hover { background: #e6f0fe; } .material-icons { font-size: 16px; } }
    .icon-btn--danger { color: #e53935; &:hover { background: #fdecea; border-color: #e53935; } }
    .icon-btn.disabled { opacity: 0.35; cursor: not-allowed; &:hover { background: transparent; } }

    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .modal-card { background: white; border-radius: 16px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 24px; border-bottom: 1px solid #e0e0e8; h2 { font-size: 18px; font-weight: 700; color: #2A3548; } }
    .modal-close { background: transparent; border: none; cursor: pointer; color: #8892a0; &:hover { color: #2A3548; } .material-icons { font-size: 22px; } }
    .modal-form { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
    .field-group { display: flex; flex-direction: column; gap: 8px; }
    .field-label { font-size: 13px; font-weight: 600; color: #2A3548; }
    .modal-actions { display: flex; gap: 12px; justify-content: flex-end; padding-top: 4px; }

    .upload-zone { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 28px 20px; border: 2px dashed #e0e0e8; border-radius: 10px; cursor: pointer; transition: all 0.15s; color: #8892a0;
      &:hover { border-color: #004179; background: #f0f6ff; }
      &--selected { border-color: #155724; background: #f0fff4; color: #155724; }
      .material-icons { font-size: 28px; }
    }
    .upload-filename { font-size: 13px; text-align: center; word-break: break-all; }

    .error-alert { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #fdecea; border: 1px solid #f5c6cb; border-radius: 8px; color: #721c24; font-size: 13px; .material-icons { font-size: 16px; flex-shrink: 0; } }
  `]
})
export class DocumentosListComponent implements OnInit {
  documentos = signal<any[]>([]);
  filtered   = signal<any[]>([]);
  clientes   = signal<any[]>([]);
  loading    = signal(true);
  saving     = signal(false);
  uploadError = signal('');

  showModal     = false;
  selectedCat   = 'Todos';
  selectedCliente = '';
  categorias    = ['Todos', 'Contratos', 'Facturas', 'Propuestas', 'Otros'];

  newDoc  = { nombre: '', categoria: 'Contratos', cliente_id: '', cliente_nombre: '' };
  docFile: File | null = null;

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

  openModal(): void { this.showModal = true; this.uploadError.set(''); }
  closeModal(): void { this.showModal = false; this.docFile = null; this.newDoc = { nombre: '', categoria: 'Contratos', cliente_id: '', cliente_nombre: '' }; this.uploadError.set(''); }

  onFileSelect(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      this.docFile = file;
      if (!this.newDoc.nombre) this.newDoc.nombre = file.name.replace(/\.[^.]+$/, '');
    }
  }

  onDocClienteChange(): void {
    const c = this.clientes().find(cl => cl.id === this.newDoc.cliente_id);
    this.newDoc.cliente_nombre = c?.nombre || '';
  }

  async saveDoc(): Promise<void> {
    if (!this.docFile) return;
    this.saving.set(true);
    this.uploadError.set('');

    const ext  = this.docFile.name.split('.').pop();
    const path = `shared/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    // 1. Upload al bucket
    const { error: upErr } = await this.supabase.supabase.storage
      .from(BUCKET)
      .upload(path, this.docFile, { upsert: false });

    if (upErr) {
      this.uploadError.set('Error al subir: ' + upErr.message);
      this.saving.set(false);
      return;
    }

    // 2. URL pública
    const { data: urlData } = this.supabase.supabase.storage.from(BUCKET).getPublicUrl(path);

    // 3. Metadata en BD
    const payload: any = {
      nombre:        this.newDoc.nombre.trim() || this.docFile.name,
      categoria:     this.newDoc.categoria,
      tipo:          this.docFile.type,
      url:           urlData.publicUrl,
      storage_path:  path,
      cliente_nombre: this.newDoc.cliente_nombre || null
    };
    if (this.newDoc.cliente_id) payload.cliente_id = this.newDoc.cliente_id;

    await this.supabase.supabase.from('documentos').insert([payload]);

    this.saving.set(false);
    this.closeModal();
    await this.ngOnInit();
  }

  getDocIcon(tipo: string): string {
    if (!tipo) return 'description';
    if (tipo.includes('pdf'))    return 'picture_as_pdf';
    if (tipo.includes('image'))  return 'image';
    if (tipo.includes('excel') || tipo.includes('sheet')) return 'table_chart';
    if (tipo.includes('word')  || tipo.includes('document')) return 'article';
    return 'description';
  }

  getDocIconClass(tipo: string): string {
    if (!tipo) return '';
    if (tipo.includes('pdf'))   return 'pdf';
    if (tipo.includes('image')) return 'img';
    if (tipo.includes('excel') || tipo.includes('sheet')) return 'xls';
    if (tipo.includes('word')  || tipo.includes('document')) return 'doc';
    return '';
  }

  formatDate(d: string): string {
    return d ? new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  }

  openDoc(url: string): void { if (url) window.open(url, '_blank'); }

  async deleteDoc(id: string, storagePath: string): Promise<void> {
    if (!confirm('¿Eliminar este documento?')) return;
    // Eliminar de Storage si tiene path
    if (storagePath) await this.supabase.supabase.storage.from(BUCKET).remove([storagePath]);
    await this.supabase.supabase.from('documentos').delete().eq('id', id);
    await this.ngOnInit();
  }
}
