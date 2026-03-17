import { Injectable } from '@angular/core';
import { SupabaseClientService } from './supabase-client.service';

export interface DashboardStats {
  totalClientes: number;
  clientesActivos: number;
  llamadasMes: number;
  llamadasHoy: number;
  tareasPendientes: number;
}

@Injectable({ providedIn: 'root' })
export class StatsService {
  constructor(private supabaseService: SupabaseClientService) {}

  async get(): Promise<DashboardStats> {
    const supabase = this.supabaseService.supabase;

    const [{ count: totalClientes }, { count: clientesActivos }] = await Promise.all([
      supabase.from('clientes').select('*', { count: 'exact', head: true }),
      supabase.from('clientes').select('*', { count: 'exact', head: true }).eq('estado', 'activo')
    ]);

    // Llamadas del mes
    const now = new Date();
    const firstDayMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const firstDayToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    const [{ count: llamadasMes }, { count: llamadasHoy }] = await Promise.all([
      supabase.from('llamadas').select('*', { count: 'exact', head: true }).gte('created_at', firstDayMonth),
      supabase.from('llamadas').select('*', { count: 'exact', head: true }).gte('created_at', firstDayToday)
    ]);

    return {
      totalClientes: totalClientes ?? 0,
      clientesActivos: clientesActivos ?? 0,
      llamadasMes: llamadasMes ?? 0,
      llamadasHoy: llamadasHoy ?? 0,
      tareasPendientes: 0
    };
  }
}
