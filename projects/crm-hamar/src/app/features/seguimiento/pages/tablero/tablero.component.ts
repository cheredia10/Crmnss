import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseClientService } from '../../../../core/services/supabase-client.service';

@Component({
  selector: 'app-tablero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tablero-page">
      <div class="breadcrumb">
        <span>CRM</span><span class="material-icons breadcrumb-sep">chevron_right</span>
        <span class="breadcrumb-current">Tablero</span>
      </div>
      <div class="page-header">
        <div>
          <h1 class="page-title">Tablero de Seguimiento</h1>
          <p class="page-subtitle">Vista kanban de tus actividades</p>
        </div>
      </div>

      @if (loading()) {
        <div class="spinner-container"><div class="spinner"></div></div>
      } @else {
        <div class="kanban-board">
          @for (col of columns; track col.status) {
            <div
              class="kanban-col"
              [class.kanban-col--over]="dragOverCol === col.status"
              (dragover)="onDragOver($event, col.status)"
              (dragleave)="onDragLeave()"
              (drop)="onDrop($event, col.status)">

              <div class="kanban-header" [style.background]="col.color">
                <span>{{ col.label }}</span>
                <span class="count-badge">{{ getByStatus(col.status).length }}</span>
              </div>

              <div class="kanban-cards">
                @for (item of getByStatus(col.status); track item.id) {
                  <div
                    class="kanban-card"
                    [class.kanban-card--dragging]="draggingId === item.id"
                    draggable="true"
                    (dragstart)="onDragStart($event, item)"
                    (dragend)="onDragEnd()"
                    (touchstart)="onTouchStart($event, item)"
                    (touchmove)="onTouchMove($event)"
                    (touchend)="onTouchEnd($event)">

                    <div class="kc-drag-handle">
                      <span class="material-icons">drag_indicator</span>
                    </div>
                    <p class="kc-title">{{ item.titulo }}</p>
                    @if (item.cliente_nombre) {
                      <p class="kc-client">
                        <span class="material-icons">person</span>{{ item.cliente_nombre }}
                      </p>
                    }
                    <div class="kc-footer">
                      <span class="badge" [class]="getPriorityBadge(item.prioridad)">{{ item.prioridad }}</span>
                      <span class="kc-date" [class.kc-date--overdue]="isOverdue(item.fecha_limite, item.estado)">
                        {{ formatDate(item.fecha_limite) }}
                      </span>
                    </div>
                  </div>
                }
                @if (getByStatus(col.status).length === 0) {
                  <div class="kanban-empty" [class.kanban-empty--over]="dragOverCol === col.status">
                    <span class="material-icons">inbox</span>
                    <p>Arrastra aquí</p>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .tablero-page { display: flex; flex-direction: column; gap: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; }

    /* Board */
    .kanban-board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
      @media (max-width: 900px) { grid-template-columns: 1fr; }
    }

    /* Column */
    .kanban-col {
      border-radius: 10px; border: 2px solid #e0e0e8; overflow: hidden; background: #f9fafb;
      transition: border-color 0.15s, box-shadow 0.15s;
      &--over { border-color: #239ebc; box-shadow: 0 0 0 3px rgba(35,158,188,0.15); background: #f0fbff; }
    }
    .kanban-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; color: white; font-weight: 600; font-size: 14px; }
    .count-badge { background: rgba(255,255,255,0.3); border-radius: 12px; padding: 2px 10px; font-size: 12px; }

    /* Cards */
    .kanban-cards { padding: 12px; display: flex; flex-direction: column; gap: 10px; min-height: 200px; }
    .kanban-card {
      background: white; border: 1px solid #e0e0e8; border-radius: 8px; padding: 14px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05); cursor: grab; transition: all 0.15s; position: relative;
      touch-action: none;
      &:hover { border-color: #004179; box-shadow: 0 3px 12px rgba(0,65,121,0.12); transform: translateY(-1px); }
      &:active { cursor: grabbing; }
      &--dragging { opacity: 0.4; transform: scale(0.97); cursor: grabbing; }
    }
    .kc-drag-handle { position: absolute; top: 8px; right: 8px; color: #bbbfc1;
      .material-icons { font-size: 16px; }
    }
    .kc-title { font-size: 14px; font-weight: 600; color: #2A3548; margin-bottom: 8px; padding-right: 20px; }
    .kc-client { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #8892a0; margin-bottom: 8px; .material-icons { font-size: 14px; } }
    .kc-footer { display: flex; justify-content: space-between; align-items: center; }
    .kc-date { font-size: 11px; color: #8892a0; &--overdue { color: #e53935; font-weight: 700; } }

    /* Empty drop zone */
    .kanban-empty { text-align: center; padding: 32px 16px; color: #bbbfc1; font-size: 13px;
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      .material-icons { font-size: 28px; }
      &--over { color: #239ebc; border: 2px dashed #239ebc; border-radius: 8px; background: rgba(35,158,188,0.05); }
    }
  `]
})
export class TableroComponent implements OnInit {
  items = signal<any[]>([]);
  loading = signal(true);
  draggingId: string | null = null;
  draggingItem: any = null;
  dragOverCol: string | null = null;

  columns = [
    { status: 'pendiente',   label: 'Pendiente',   color: '#856404' },
    { status: 'en_progreso', label: 'En Progreso', color: '#004179' },
    { status: 'completado',  label: 'Completado',  color: '#155724' },
  ];

  constructor(private supabase: SupabaseClientService, public router: Router) {}

  async ngOnInit(): Promise<void> {
    const { data } = await this.supabase.supabase.from('seguimiento').select('*').order('created_at', { ascending: false });
    this.items.set(data || []);
    this.loading.set(false);
  }

  getByStatus(status: string): any[] { return this.items().filter(i => i.estado === status); }
  getPriorityBadge(p: string): string { return ({ alta: 'badge-danger', media: 'badge-warning', baja: 'badge-success' } as any)[p] || 'badge-info'; }
  formatDate(d: string): string { return d ? new Date(d).toLocaleDateString('es-ES') : '—'; }
  isOverdue(d: string, estado: string): boolean { return !!d && estado !== 'completado' && new Date(d) < new Date(); }

  /* === Drag & Drop handlers === */
  onDragStart(event: DragEvent, item: any): void {
    this.draggingId = item.id;
    this.draggingItem = item;
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('text/plain', item.id);
  }

  onDragEnd(): void {
    this.draggingId = null;
    this.draggingItem = null;
    this.dragOverCol = null;
  }

  onDragOver(event: DragEvent, colStatus: string): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
    this.dragOverCol = colStatus;
  }

  onDragLeave(): void {
    this.dragOverCol = null;
  }

  async onDrop(event: DragEvent, targetStatus: string): Promise<void> {
    event.preventDefault();
    this.dragOverCol = null;

    if (!this.draggingItem) return;
    if (this.draggingItem.estado === targetStatus) return;

    await this.moveItemTo(this.draggingItem, targetStatus);
    this.draggingId = null;
    this.draggingItem = null;
  }

  /* === Touch events (móvil) === */
  onTouchStart(event: TouchEvent, item: any): void {
    this.draggingId = item.id;
    this.draggingItem = item;
  }

  onTouchMove(event: TouchEvent): void {
    event.preventDefault();
    const touch = event.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const col = el?.closest('[data-col-status]');
    this.dragOverCol = col?.getAttribute('data-col-status') || null;
  }

  onTouchEnd(event: TouchEvent): void {
    if (this.draggingItem && this.dragOverCol && this.draggingItem.estado !== this.dragOverCol) {
      this.moveItemTo(this.draggingItem, this.dragOverCol);
    }
    this.draggingId = null;
    this.draggingItem = null;
    this.dragOverCol = null;
  }

  private async moveItemTo(item: any, targetStatus: string): Promise<void> {
    const updated = this.items().map(i =>
      i.id === item.id ? { ...i, estado: targetStatus } : i
    );
    this.items.set(updated);
    await this.supabase.supabase
      .from('seguimiento')
      .update({ estado: targetStatus })
      .eq('id', item.id);
  }
}
