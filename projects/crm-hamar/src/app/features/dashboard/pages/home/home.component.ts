import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { StatsService, DashboardStats } from '../../../../core/services/stats.service';
import { SupabaseClientService } from '../../../../core/services/supabase-client.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <span>CRM</span>
        <span class="material-icons breadcrumb-sep">chevron_right</span>
        <span class="breadcrumb-current">Dashboard</span>
      </div>

      <!-- Welcome -->
      <div class="welcome-section">
        <h1 class="page-title">Bienvenido, {{ authService.currentUser()?.nombre || 'Usuario' }}!</h1>
        <p class="page-subtitle">Te deseamos una excelente jornada</p>
      </div>



      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background:#e6f0fe">
            <span class="material-icons" style="color:#004179">people</span>
          </div>
          <div>
            <p class="stat-label">Total Clientes</p>
            <p class="stat-value">{{ loading() ? '...' : stats().totalClientes }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background:#d4edda">
            <span class="material-icons" style="color:#155724">group</span>
          </div>
          <div>
            <p class="stat-label">Clientes Activos</p>
            <p class="stat-value">{{ loading() ? '...' : stats().clientesActivos }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background:#fff3cd">
            <span class="material-icons" style="color:#856404">phone</span>
          </div>
          <div>
            <p class="stat-label">Llamadas del Mes</p>
            <p class="stat-value">{{ loading() ? '...' : stats().llamadasMes }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background:#cce5ff">
            <span class="material-icons" style="color:#004085">today</span>
          </div>
          <div>
            <p class="stat-label">Llamadas Hoy</p>
            <p class="stat-value">{{ loading() ? '...' : stats().llamadasHoy }}</p>
          </div>
        </div>
      </div>



      <!-- Banner principal -->
      <div class="featured-banner">
        <div>
          <h2>Gestión CRM Empresarial</h2>
          <p>Administra tus clientes, llamadas y seguimiento de manera eficiente</p>
        </div>
        <button class="btn-banner" (click)="router.navigate(['/clientes'])">
          Ver clientes <span class="material-icons">arrow_forward</span>
        </button>
      </div>

      <!-- Grid principal -->
      <div class="content-grid-2">
        <div class="card no-pad">
          <div class="section-header">👥 Top 5 Clientes</div>
          <div class="list-content">
            @if (loadingClientes()) {
              <div style="padding:20px;text-align:center;color:#8892a0">Cargando...</div>
            } @else if (topClientes().length === 0) {
              <div style="padding:20px;text-align:center;color:#8892a0">No hay clientes registrados</div>
            } @else {
              @for (cliente of topClientes(); track cliente.id) {
                <div class="list-item" style="cursor:pointer" (click)="router.navigate(['/clientes', cliente.id])">
                  <div class="client-avatar">{{ getInitials(cliente.nombre) }}</div>
                  <div class="client-info">
                    <span class="client-name">{{ cliente.nombre }}</span>
                    <span class="client-company">{{ cliente.empresa || 'Sin empresa' }}</span>
                  </div>
                  <span class="badge" [class]="getEstadoBadge(cliente.estado)">{{ cliente.estado }}</span>
                </div>
              }
            }
          </div>
        </div>

        <!-- Actividad Reciente -->
        <div class="card no-pad">
          <div class="section-header">📋 Actividad Reciente</div>
          <div class="list-content">
            @if (loadingActividad()) {
              <div style="padding:20px;text-align:center;color:#8892a0">Cargando...</div>
            } @else if (actividad().length === 0) {
              <div style="padding:20px;text-align:center;color:#8892a0">Sin actividad reciente</div>
            } @else {
              @for (act of actividad(); track act.id) {
                <div class="list-item">
                  <div class="act-avatar" [class]="getActBg(act.tipo)">
                    <span class="material-icons" style="font-size:16px">{{ getActIcon(act.tipo) }}</span>
                  </div>
                  <div class="act-info">
                    <span class="act-title">{{ act.accion }}</span>
                    <span class="act-date">{{ act.cliente }} · {{ act.fecha }}</span>
                  </div>
                </div>
              }
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { display: flex; flex-direction: column; gap: 24px; }

    .welcome-section { padding: 8px 0; }

    .demo-banner {
      display: flex; align-items: center; gap: 16px;
      background: linear-gradient(135deg, #004179, #239ebc);
      color: white; padding: 20px; border-radius: 12px;
      .material-icons { font-size: 32px; }
      strong { font-size: 16px; }
      p { font-size: 13px; opacity: 0.9; margin-top: 4px; }
    }

    .stat-card {
      display: flex; flex-direction: column; gap: 12px;
      .stat-icon { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; .material-icons { font-size: 24px; } }
    }

    .section-header-inline {
      display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
      h2 { font-size: 16px; font-weight: 600; color: #2A3548; }
      .material-icons { color: #004179; font-size: 22px; }
    }

    .cloudtalk-grid { margin-top: 0; }

    .ct-card {
      border-radius: 8px; padding: 16px; display: flex; flex-direction: column; gap: 6px;
      .material-icons { font-size: 20px; }
      &--blue  { background: #e6f0fe; color: #004179; }
      &--green { background: #d4edda; color: #155724; }
      &--red   { background: #f8d7da; color: #721c24; }
      &--yellow{ background: #fff3cd; color: #856404; }
    }

    .ct-label { font-size: 12px; }
    .ct-value { font-size: 28px; font-weight: 700; }

    .featured-banner {
      background: linear-gradient(135deg, #004179 0%, #239ebc 100%);
      border-radius: 12px; padding: 32px; display: flex;
      align-items: center; justify-content: space-between; gap: 20px;
      color: white;
      h2 { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
      p { font-size: 14px; opacity: 0.9; }

      @media (max-width: 640px) { flex-direction: column; align-items: flex-start; }
    }

    .btn-banner {
      display: flex; align-items: center; gap: 6px;
      background: rgba(255,255,255,0.2); color: white;
      border: 1px solid rgba(255,255,255,0.4); border-radius: 8px;
      padding: 10px 20px; font-family: 'Open Sans',sans-serif; font-size: 14px; font-weight: 600;
      cursor: pointer; transition: background 0.15s; white-space: nowrap;
      &:hover { background: rgba(255,255,255,0.3); }
      .material-icons { font-size: 16px; }
    }

    .card.no-pad { padding: 0; overflow: hidden; }

    .list-content { padding: 16px; display: flex; flex-direction: column; gap: 10px; }

    .list-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 12px; border: 1px solid #e0e0e0; border-radius: 8px;
      transition: all 0.15s;
      &:hover { border-color: #004179; background: #e6f0fe; }
    }

    .client-avatar {
      width: 38px; height: 38px; border-radius: 50%; background: #004179;
      color: white; display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700; flex-shrink: 0;
    }

    .client-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .client-name { font-size: 13px; font-weight: 600; color: #2A3548; }
    .client-company { font-size: 11px; color: #8892a0; }

    .client-calls { display: flex; align-items: center; gap: 4px; }
    .calls-count { font-size: 16px; font-weight: 700; color: #004179; }

    .act-info { display: flex; flex-direction: column; gap: 2px; flex: 1; }
    .act-title { font-size: 13px; font-weight: 600; color: #2A3548; }
    .act-date { font-size: 11px; color: #8892a0; }
    .act-avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .act-blue  { background: #e6f0fe; color: #004179; }
    .act-green { background: #d4edda; color: #155724; }
    .act-yellow{ background: #fff3cd; color: #856404; }
  `]
})
export class HomeComponent implements OnInit {
  loading = signal(true);
  loadingClientes = signal(true);
  loadingActividad = signal(true);
  stats = signal<DashboardStats>({
    totalClientes: 0, clientesActivos: 0, llamadasMes: 0, llamadasHoy: 0, tareasPendientes: 0
  });
  topClientes = signal<any[]>([]);
  actividad = signal<any[]>([]);

  constructor(
    public authService: AuthService,
    public router: Router,
    private statsService: StatsService,
    private supabase: SupabaseClientService
  ) {}

  async ngOnInit(): Promise<void> {
    await Promise.all([this.loadStats(), this.loadTopClientes(), this.loadActividad()]);
  }

  private async loadStats(): Promise<void> {
    this.loading.set(true);
    try { const data = await this.statsService.get(); this.stats.set(data); }
    finally { this.loading.set(false); }
  }

  private async loadTopClientes(): Promise<void> {
    this.loadingClientes.set(true);
    const { data } = await this.supabase.supabase
      .from('clientes')
      .select('id, nombre, empresa, estado')
      .order('created_at', { ascending: false })
      .limit(5);
    this.topClientes.set(data || []);
    this.loadingClientes.set(false);
  }

  private async loadActividad(): Promise<void> {
    this.loadingActividad.set(true);
    const [{ data: clientes }, { data: mensajes }, { data: tareas }] = await Promise.all([
      this.supabase.supabase.from('clientes').select('id, nombre, created_at').order('created_at', { ascending: false }).limit(3),
      this.supabase.supabase.from('sms').select('id, cliente_nombre, phone_number, created_at').order('created_at', { ascending: false }).limit(3),
      this.supabase.supabase.from('seguimiento').select('id, titulo, cliente_nombre, created_at').order('created_at', { ascending: false }).limit(3),
    ]);

    const items: any[] = [
      ...(clientes || []).map(c => ({ id: c.id, tipo: 'cliente', accion: 'Nuevo cliente registrado', cliente: c.nombre, fecha: this.timeAgo(c.created_at) })),
      ...(mensajes || []).map(m => ({ id: m.id, tipo: 'whatsapp', accion: 'Mensaje WhatsApp enviado', cliente: m.cliente_nombre || m.phone_number, fecha: this.timeAgo(m.created_at) })),
      ...(tareas || []).map(t => ({ id: t.id, tipo: 'tarea', accion: t.titulo, cliente: t.cliente_nombre || '—', fecha: this.timeAgo(t.created_at) })),
    ];

    items.sort((a, b) => new Date(b.fecha_raw || 0).getTime() - new Date(a.fecha_raw || 0).getTime());
    this.actividad.set(items.slice(0, 6));
    this.loadingActividad.set(false);
  }

  getInitials(n: string): string { return (n || '').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase(); }
  getEstadoBadge(e: string): string { return ({ activo: 'badge-success', inactivo: 'badge-danger', potencial: 'badge-warning' } as any)[e] || 'badge-info'; }
  getActIcon(t: string): string { return ({ cliente: 'person', whatsapp: 'chat_bubble', tarea: 'task_alt' } as any)[t] || 'circle'; }
  getActBg(t: string): string { return ({ cliente: 'act-avatar act-blue', whatsapp: 'act-avatar act-green', tarea: 'act-avatar act-yellow' } as any)[t] || 'act-avatar act-blue'; }
  timeAgo(d: string): string {
    if (!d) return '—';
    const diff = (Date.now() - new Date(d).getTime()) / 1000;
    if (diff < 60) return 'Hace un momento';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
    if (diff < 172800) return 'Ayer';
    return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  }
}
