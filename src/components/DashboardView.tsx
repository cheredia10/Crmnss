import { useState, useEffect } from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { Users, Phone, TrendingUp, Calendar, Clock, FileText, ChevronRight, PhoneCall, PhoneIncoming, PhoneMissed } from 'lucide-react';
import { statsAPI, cloudtalkAPI, type DashboardStats, type CloudTalkStats } from '../utils/api';

interface DashboardViewProps {
  userName?: string;
}

export function DashboardView({ userName = 'Usuario' }: DashboardViewProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalClientes: 0,
    clientesActivos: 0,
    llamadasMes: 0,
    llamadasHoy: 0,
    tareasPendientes: 0
  });
  const [cloudtalkStats, setCloudtalkStats] = useState<CloudTalkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingCloudtalk, setLoadingCloudtalk] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    loadStats();
    loadCloudtalkStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await statsAPI.get();
      setStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCloudtalkStats = async () => {
    try {
      setLoadingCloudtalk(true);
      // Obtener estadísticas del mes actual
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const from_date = firstDay.toISOString().split('T')[0];
      const to_date = now.toISOString().split('T')[0];
      
      const response: any = await cloudtalkAPI.getStats({ from_date, to_date });
      
      // Verificar si estamos en modo demo
      if (response.demo_mode !== undefined) {
        setDemoMode(response.demo_mode);
      }
      
      // Solo establecer las estadísticas si hay datos válidos
      if (response && response.total_calls > 0) {
        setCloudtalkStats(response);
      } else {
        setCloudtalkStats(null);
      }
    } catch (error) {
      // Silenciosamente fallar si CloudTalk no está disponible
      console.log('CloudTalk no disponible o no configurado');
      setCloudtalkStats(null);
    } finally {
      setLoadingCloudtalk(false);
    }
  };

  return (
    <div className="flex flex-col gap-[24px] w-full">
      <Breadcrumbs items={['CRM', 'Dashboard']} />
      
      {/* Demo Mode Banner */}
      {demoMode && (
        <div className="bg-gradient-to-r from-[#239ebc] to-[#004179] text-white p-[20px] rounded-[12px] border-2 border-[#004179] shadow-lg">
          <div className="flex items-center gap-[16px]">
            <div className="flex items-center justify-center size-[48px] bg-white/20 rounded-full">
              <PhoneCall className="size-[24px]" />
            </div>
            <div className="flex-1">
              <h3 className="font-['Open_Sans:Bold',sans-serif] text-[18px] mb-[4px]">
                🎭 Modo Demo Activo
              </h3>
              <p className="font-['Open_Sans:Regular',sans-serif] text-[14px] opacity-90">
                Estás usando datos de demostración porque la API Key de CloudTalk no es válida. 
                Todos los datos que ves son ficticios. <strong>Actualiza tu API Key en Configuración para usar datos reales.</strong>
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Welcome Section */}
      <div className="box-border content-stretch flex flex-col items-start p-[10px] relative shrink-0">
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
          <div className="flex flex-col font-['Open_Sans:SemiBold',sans-serif] justify-center leading-[0] relative shrink-0 text-[#333333] text-[24px] md:text-[32px]">
            <p className="leading-[normal] whitespace-pre-wrap">Bienvenido, {userName}!</p>
          </div>
          <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] md:text-[14px] text-[#239ebc]">
            Te deseamos una excelente jornada!
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] md:gap-[24px]">
        {/* Total Clientes */}
        <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px] border border-[#bbbfc1]">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center size-[48px] rounded-full bg-[#e6f0fe]">
              <Users className="size-[24px]" color="#004179" />
            </div>
            <div className="flex items-center gap-[4px]">
              <TrendingUp className="size-[16px]" color="#155724" />
              <span className="font-['Open_Sans:SemiBold',sans-serif] text-[12px] text-[#155724]">
                +12%
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#999999]">
              Total Clientes
            </p>
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[32px] text-[#333333]">
              {loading ? '...' : stats.totalClientes}
            </p>
          </div>
        </div>

        {/* Clientes Activos */}
        <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px] border border-[#bbbfc1]">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center size-[48px] rounded-full" style={{ background: '#d4edda' }}>
              <span className="text-[28px]">👥</span>
            </div>
            <div className="flex items-center gap-[4px]">
              <TrendingUp className="size-[16px]" color="#155724" />
              <span className="font-['Open_Sans:SemiBold',sans-serif] text-[12px] text-[#155724]">
                +8%
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#999999]">
              Clientes Activos
            </p>
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[32px] text-[#333333]">
              {loading ? '...' : stats.clientesActivos}
            </p>
          </div>
        </div>

        {/* Llamadas del Mes */}
        <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px] border border-[#bbbfc1]">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center size-[48px] rounded-full" style={{ background: '#fff3cd' }}>
              <Phone className="size-[24px]" color="#856404" />
            </div>
            <div className="flex items-center gap-[4px]">
              <TrendingUp className="size-[16px]" color="#155724" />
              <span className="font-['Open_Sans:SemiBold',sans-serif] text-[12px] text-[#155724]">
                +15%
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#999999]">
              Llamadas del Mes
            </p>
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[32px] text-[#333333]">
              {loading ? '...' : stats.llamadasMes}
            </p>
          </div>
        </div>

        {/* Llamadas Hoy */}
        <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px] border border-[#bbbfc1]">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center size-[48px] rounded-full" style={{ background: '#cce5ff' }}>
              <Calendar className="size-[24px]" color="#004085" />
            </div>
            <div className="flex items-center gap-[4px]">
              <span className="font-['Open_Sans:SemiBold',sans-serif] text-[12px] text-[#333333]">
                Hoy
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#999999]">
              Llamadas Hoy
            </p>
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[32px] text-[#333333]">
              {loading ? '...' : stats.llamadasHoy}
            </p>
          </div>
        </div>
      </div>

      {/* CloudTalk Stats - Only show if data is available and has calls */}
      {cloudtalkStats && !loadingCloudtalk && cloudtalkStats.total_calls > 0 && (
        <div className="bg-white rounded-[8px] border border-[#bbbfc1] p-[24px]">
          <div className="flex items-center gap-[12px] mb-[20px]">
            <div className="flex items-center justify-center size-[40px] rounded-full bg-[#e6f0fe]">
              <PhoneCall className="size-[20px]" color="#004179" />
            </div>
            <h3 className="font-['Open_Sans:SemiBold',sans-serif] text-[18px] text-[#333333]">
              Estadísticas de CloudTalk - Mes Actual
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
            {/* Total Llamadas CloudTalk */}
            <div className="bg-[#e6f0fe] rounded-[8px] p-[20px] flex flex-col gap-[8px]">
              <div className="flex items-center gap-[8px]">
                <PhoneCall className="size-[18px]" color="#004179" />
                <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#004179]">
                  Total Llamadas
                </p>
              </div>
              <p className="font-['Open_Sans:SemiBold',sans-serif] text-[28px] text-[#004179]">
                {cloudtalkStats.total_calls}
              </p>
            </div>

            {/* Llamadas Contestadas */}
            <div className="bg-[#d4edda] rounded-[8px] p-[20px] flex flex-col gap-[8px]">
              <div className="flex items-center gap-[8px]">
                <PhoneIncoming className="size-[18px]" color="#155724" />
                <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#155724]">
                  Contestadas
                </p>
              </div>
              <p className="font-['Open_Sans:SemiBold',sans-serif] text-[28px] text-[#155724]">
                {cloudtalkStats.answered_calls}
              </p>
            </div>

            {/* Llamadas Perdidas */}
            <div className="bg-[#f8d7da] rounded-[8px] p-[20px] flex flex-col gap-[8px]">
              <div className="flex items-center gap-[8px]">
                <PhoneMissed className="size-[18px]" color="#721c24" />
                <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#721c24]">
                  Perdidas
                </p>
              </div>
              <p className="font-['Open_Sans:SemiBold',sans-serif] text-[28px] text-[#721c24]">
                {cloudtalkStats.missed_calls}
              </p>
            </div>

            {/* Duración Promedio */}
            <div className="bg-[#fff3cd] rounded-[8px] p-[20px] flex flex-col gap-[8px]">
              <div className="flex items-center gap-[8px]">
                <Clock className="size-[18px]" color="#856404" />
                <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#856404]">
                  Duración Promedio
                </p>
              </div>
              <p className="font-['Open_Sans:SemiBold',sans-serif] text-[28px] text-[#856404]">
                {Math.floor(cloudtalkStats.average_duration / 60)}:{(cloudtalkStats.average_duration % 60).toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Featured Banner - Full Width */}
      <div className="bg-white rounded-[8px] border border-[#bbbfc1] overflow-hidden">
        <div className="relative min-h-[140px] md:h-[180px] bg-gradient-to-br from-[#004179] to-[#239ebc] p-[20px] md:p-[32px] flex flex-col md:flex-row items-start md:items-center justify-between gap-[16px]">
          <div className="flex flex-col gap-[8px] md:gap-[12px]">
            <h2 className="font-['Open_Sans:SemiBold',sans-serif] text-[20px] md:text-[28px] text-white">
              Gestión CRM Empresarial
            </h2>
            <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] md:text-[14px] text-white/90 max-w-[600px]">
              Administra tus clientes, llamadas y seguimiento de manera eficiente con nuestra plataforma integral de CRM
            </p>
          </div>
          <button className="bg-white/20 backdrop-blur-sm text-white px-[20px] md:px-[24px] py-[10px] md:py-[12px] rounded-[8px] font-['Open_Sans:SemiBold',sans-serif] text-[12px] md:text-[14px] hover:bg-white/30 transition-colors flex items-center gap-[8px] border border-white/40">
            Ver más
            <ChevronRight className="size-[16px]" />
          </button>
        </div>
      </div>

      {/* Main Content Grid - 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px] md:gap-[24px]">
        {/* Left Column - Top 5 Clientes + Actividad Reciente */}
        <div className="flex flex-col gap-[24px]">
          {/* Top 5 Clientes */}
          <div className="bg-white rounded-[8px] border border-[#bbbfc1]">
            <div className="bg-[#239ebc] h-[50px] rounded-t-[8px] flex items-center px-[20px]">
              <p className="font-['Open_Sans:SemiBold',sans-serif] text-[16px] text-[#fafbfc]">
                ☎️ Top 5 Clientes
              </p>
            </div>
            <div className="p-[20px] flex flex-col gap-[10px]">
              {[
                { nombre: 'Luis Fernández', empresa: 'Smart Business', llamadas: 15, iniciales: 'LF' },
                { nombre: 'Juan Pérez', empresa: 'Tech Solutions SA', llamadas: 12, iniciales: 'JP' },
                { nombre: 'María García', empresa: 'Innovate Corp', llamadas: 8, iniciales: 'MG' },
                { nombre: 'Carlos Rodríguez', empresa: 'Digital Partners', llamadas: 5, iniciales: 'CR' },
                { nombre: 'Ana Martínez', empresa: 'Global Systems', llamadas: 3, iniciales: 'AM' },
              ].map((cliente, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-[12px] rounded-[8px] border border-[#e0e0e0] hover:border-[#004179] hover:bg-[#e6f0fe] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-[12px]">
                    <div className="flex items-center justify-center size-[40px] rounded-full" style={{ background: '#004179' }}>
                      <span className="font-['Open_Sans:SemiBold',sans-serif] text-[13px] text-white">
                        {cliente.iniciales}
                      </span>
                    </div>
                    <div className="flex flex-col gap-[2px]">
                      <p className="font-['Open_Sans:SemiBold',sans-serif] text-[13px] text-[#333333]">
                        {cliente.nombre}
                      </p>
                      <p className="font-['Open_Sans:Regular',sans-serif] text-[11px] text-[#4d545e]">
                        {cliente.empresa}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-[6px]">
                    <Phone className="size-[14px]" color="#004179" />
                    <p className="font-['Open_Sans:SemiBold',sans-serif] text-[16px] text-[#004179]">
                      {cliente.llamadas}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actividad Reciente */}
          <div className="bg-white rounded-[8px] border border-[#bbbfc1]">
            <div className="bg-[#239ebc] h-[50px] rounded-t-[8px] flex items-center px-[20px]">
              <p className="font-['Open_Sans:SemiBold',sans-serif] text-[16px] text-[#fafbfc]">
                📋 Actividad Reciente
              </p>
            </div>
            <div className="p-[20px] flex flex-col gap-[10px]">
              {[
                { cliente: 'Juan', accion: 'Nueva llamada registrada', fecha: 'July 10, 2020', tags: ['GP', 'IT'] },
                { cliente: 'María', accion: 'Cliente actualizado', fecha: 'May 20, 2020', tags: ['GP', 'IT'] },
                { cliente: 'Carlos', accion: 'Nueva llamada registrada', fecha: 'May 20, 2020', tags: ['GP', 'IT'] },
                { cliente: 'Ana', accion: 'Nuevo cliente añadido', fecha: 'May 20, 2020', tags: ['GP', 'IT'] },
              ].map((actividad, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-[12px] rounded-[8px] border border-[#e0e0e0] hover:border-[#239ebc] hover:bg-[#e6f0fe] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-[12px] flex-1">
                    <input
                      type="checkbox"
                      className="accent-[#239ebc] cursor-pointer"
                    />
                    <div className="flex flex-col gap-[4px] flex-1">
                      <p className="font-['Open_Sans:SemiBold',sans-serif] text-[13px] text-[#333333]">
                        {actividad.accion}
                      </p>
                      <div className="flex items-center gap-[12px]">
                        <div className="flex items-center gap-[6px]">
                          <span className="px-[8px] py-[2px] rounded-[4px] font-['Open_Sans:SemiBold',sans-serif] text-[11px] bg-[#e6f0fe] text-[#004179]">
                            {actividad.cliente}
                          </span>
                          <span className="px-[8px] py-[2px] rounded-[4px] font-['Open_Sans:SemiBold',sans-serif] text-[11px] bg-[#239ebc] text-white">
                            GP
                          </span>
                          <span className="px-[8px] py-[2px] rounded-[4px] font-['Open_Sans:SemiBold',sans-serif] text-[11px] bg-[#6c757d] text-white">
                            IT
                          </span>
                        </div>
                        <span className="font-['Open_Sans:Regular',sans-serif] text-[11px] text-[#999999]">
                          {actividad.fecha}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Calendario + Agenda */}
        <div className="flex flex-col gap-[24px]">
          {/* Calendar Widget */}
          <div className="bg-white rounded-[8px] border border-[#bbbfc1]">
            <div className="bg-[#239ebc] h-[50px] rounded-t-[8px] flex items-center px-[20px]">
              <p className="font-['Open_Sans:SemiBold',sans-serif] text-[16px] text-[#fafbfc]">
                📅 Calendario
              </p>
            </div>
            <div className="p-[20px]">
              <div className="flex items-center justify-between mb-[16px]">
                <button className="hover:bg-[#f9f9f9] p-[6px] rounded-[4px] transition-colors">
                  <ChevronRight className="size-[16px] rotate-180" color="#333333" />
                </button>
                <p className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#333333]">
                  Jun 2022
                </p>
                <button className="hover:bg-[#f9f9f9] p-[6px] rounded-[4px] transition-colors">
                  <ChevronRight className="size-[16px]" color="#333333" />
                </button>
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-[4px]">
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dia) => (
                  <div key={dia} className="text-center">
                    <p className="font-['Open_Sans:SemiBold',sans-serif] text-[11px] text-[#999999]">
                      {dia}
                    </p>
                  </div>
                ))}
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                  <div
                    key={day}
                    className={`text-center p-[6px] rounded-[4px] cursor-pointer transition-colors ${
                      day === 20
                        ? 'bg-[#004179] text-white font-["Open_Sans:SemiBold",sans-serif]'
                        : 'hover:bg-[#e6f0fe] font-["Open_Sans:Regular",sans-serif] text-[#333333]'
                    }`}
                  >
                    <p className="text-[11px]">{day}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Agenda Widget */}
          <div className="bg-white rounded-[8px] border border-[#bbbfc1] flex-1 flex flex-col">
            <div className="bg-[#239ebc] h-[50px] rounded-t-[8px] flex items-center px-[20px]">
              <p className="font-['Open_Sans:SemiBold',sans-serif] text-[16px] text-[#fafbfc]">
                🗓️ Agenda
              </p>
            </div>
            <div className="p-[20px] flex flex-col gap-[12px] flex-1">
              {[
                { hora: '10:00am', evento: 'Llamada con Cliente', tipo: 'Seguimiento' },
                { hora: '11:30am', evento: 'Revisión Mensual', tipo: 'Interno' },
                { hora: '03:00pm', evento: 'Presentación Producto', tipo: 'Comercial' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-[12px] p-[12px] rounded-[8px] bg-[#004179] text-white"
                >
                  <div className="flex flex-col gap-[2px] min-w-[60px]">
                    <p className="font-['Open_Sans:SemiBold',sans-serif] text-[12px]">
                      {item.hora}
                    </p>
                  </div>
                  <div className="flex flex-col gap-[4px] flex-1">
                    <p className="font-['Open_Sans:SemiBold',sans-serif] text-[13px]">
                      {item.evento}
                    </p>
                    <p className="font-['Open_Sans:Regular',sans-serif] text-[11px] text-white/80">
                      {item.tipo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
