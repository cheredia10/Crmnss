import { useState } from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { Phone, Mail, MessageSquare, Calendar, Facebook, Globe, User, Search } from 'lucide-react';

interface Lead {
  id: string;
  nombre: string;
  empresa: string;
  canal: 'Email' | 'WhatsApp' | 'Formulario Web' | 'Facebook Ads' | 'Llamada entrante' | 'Web institucional';
  ejecutivo: string;
  estado: 'Nuevo Lead' | 'Asignado' | 'Contactado' | 'En diagnóstico' | 'Propuesta enviada';
  etiqueta?: string;
  telefono: string;
}

const mockLeads: Lead[] = [
  {
    id: 'L-001',
    nombre: 'Pepito Pérez Luna',
    empresa: 'TORTUGAS SAC',
    canal: 'Email',
    ejecutivo: 'Luciana López',
    estado: 'Nuevo Lead',
    etiqueta: 'Seo',
    telefono: '+51 999 888 777',
  },
  {
    id: 'L-002',
    nombre: 'Valeria Muñoz',
    empresa: 'COMERCIAL LIMA SUR SAC',
    canal: 'Web institucional',
    ejecutivo: 'Daniel Reyes',
    estado: 'Asignado',
    telefono: '+51 987 654 321',
  },
  {
    id: 'L-003',
    nombre: 'Iván Sánchez',
    empresa: 'INMOBILIARIA PUENTE VERDE',
    canal: 'Web institucional',
    ejecutivo: 'Andrea Calderón',
    estado: 'Asignado',
    telefono: '+51 976 543 210',
  },
  {
    id: 'L-004',
    nombre: 'Carlos Ortega',
    empresa: 'CLÍNICA SALUD TOTAL',
    canal: 'Email',
    ejecutivo: 'Andrea Calderón',
    estado: 'Contactado',
    etiqueta: '1ra llamada',
    telefono: '+51 965 432 109',
  },
  {
    id: 'L-005',
    nombre: 'María José Quispe',
    empresa: 'NETLOGIC PERÚ S.A.C.',
    canal: 'Llamada entrante',
    ejecutivo: 'Martín Farfán',
    estado: 'Contactado',
    telefono: '+51 954 321 098',
  },
  {
    id: 'L-006',
    nombre: 'Fiorella Mendoza',
    empresa: 'CONSORCIO TECHLAB',
    canal: 'WhatsApp',
    ejecutivo: 'Sebastián Torres',
    estado: 'Contactado',
    telefono: '+51 943 210 987',
  },
  {
    id: 'L-007',
    nombre: 'Sandra Vidal',
    empresa: 'GRUPO LOGÍSTICA NORTE',
    canal: 'Formulario Web',
    ejecutivo: 'Jorge Gamarra',
    estado: 'En diagnóstico',
    etiqueta: 'Presentación',
    telefono: '+51 932 109 876',
  },
  {
    id: 'L-008',
    nombre: 'Javier Rivas',
    empresa: 'IMPORTACIONES EL TREBOL',
    canal: 'Facebook Ads',
    ejecutivo: 'Claudia Ruiz',
    estado: 'En diagnóstico',
    etiqueta: 'Oportunidad',
    telefono: '+51 921 098 765',
  },
  {
    id: 'L-009',
    nombre: 'Luis Ríos',
    empresa: 'EDUCATEC INSTITUTO',
    canal: 'Facebook Ads',
    ejecutivo: 'Rocío Medina',
    estado: 'Propuesta enviada',
    telefono: '+51 910 987 654',
  },
];

const columns = [
  { id: 'Nuevo Lead', title: 'Nuevo Lead', color: '#e6f0fe' },
  { id: 'Asignado', title: 'Asignado', color: '#e6f0fe' },
  { id: 'Contactado', title: 'Contactado', color: '#e6f0fe' },
  { id: 'En diagnóstico', title: 'En diagnóstico', color: '#e6f0fe' },
  { id: 'Propuesta enviada', title: 'Propuesta enviada', color: '#e6f0fe' },
];

const getIconForCanal = (canal: string) => {
  switch (canal) {
    case 'Email':
      return <Mail className="size-[14px]" color="#004179" />;
    case 'WhatsApp':
      return <MessageSquare className="size-[14px]" color="#004179" />;
    case 'Formulario Web':
      return <Globe className="size-[14px]" color="#004179" />;
    case 'Facebook Ads':
      return <Facebook className="size-[14px]" color="#004179" />;
    case 'Llamada entrante':
      return <Phone className="size-[14px]" color="#004179" />;
    case 'Web institucional':
      return <Globe className="size-[14px]" color="#004179" />;
    default:
      return <Mail className="size-[14px]" color="#004179" />;
  }
};

interface TableroSeguimientoViewProps {
  onNavigateToLlamadas?: (leadData: { cliente: string; empresa: string; telefono: string }) => void;
}

export function TableroSeguimientoView({ onNavigateToLlamadas }: TableroSeguimientoViewProps = {}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [canalFilter, setCanalFilter] = useState('');

  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = lead.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.empresa.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCanal = !canalFilter || lead.canal === canalFilter;
    return matchesSearch && matchesCanal;
  });

  const handleLlamar = (lead: Lead) => {
    // Navegamos a la vista de Gestión de Llamadas con los datos del lead prellenados
    if (onNavigateToLlamadas) {
      onNavigateToLlamadas({
        cliente: lead.nombre,
        empresa: lead.empresa,
        telefono: lead.telefono,
      });
    }
  };

  return (
    <div className="flex flex-col gap-[24px] w-full">
      <Breadcrumbs items={['CRM', 'Gestión Comercial', 'Tablero de Seguimiento']} />
      
      {/* Title */}
      <div className="box-border content-stretch flex flex-col items-start p-[10px] relative shrink-0">
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
          <div className="flex flex-col font-['Open_Sans:SemiBold',sans-serif] justify-center leading-[0] relative shrink-0 text-[#333333] text-[24px] md:text-[32px]">
            <p className="leading-[normal] whitespace-pre">Tablero de Seguimiento</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[8px] p-[16px] md:p-[20px] border border-[#bbbfc1]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
          {/* Desde */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
              Desde
            </label>
            <div className="relative">
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="w-full h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#004179]"
                placeholder="Seleccione"
              />
            </div>
          </div>

          {/* Hasta */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
              Hasta
            </label>
            <div className="relative">
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="w-full h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#004179]"
                placeholder="Seleccione"
              />
            </div>
          </div>

          {/* Tipo de canal */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
              Tipo de canal
            </label>
            <select
              value={canalFilter}
              onChange={(e) => setCanalFilter(e.target.value)}
              className="w-full h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#004179]"
            >
              <option value="">Seleccione</option>
              <option value="Email">Email</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Formulario Web">Formulario Web</option>
              <option value="Facebook Ads">Facebook Ads</option>
              <option value="Llamada entrante">Llamada entrante</option>
              <option value="Web institucional">Web institucional</option>
            </select>
          </div>

          {/* Buscar */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
              Buscar
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar"
                className="w-full h-[44px] px-[10px] pr-[40px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#004179]"
              />
              <Search className="absolute right-[12px] top-[13px] size-[18px]" color="#004179" />
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-[16px]">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col gap-[12px]">
            {/* Column Header */}
            <div className="bg-[#239ebc] rounded-[8px] p-[12px] text-center">
              <h3 className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-white">
                {column.title}
              </h3>
            </div>

            {/* Column Cards */}
            <div className="flex flex-col gap-[12px]">
              {filteredLeads
                .filter(lead => lead.estado === column.id)
                .map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-white rounded-[8px] p-[16px] border-2 border-[#d4edda] hover:border-[#004179] transition-all cursor-pointer flex flex-col gap-[12px] shadow-sm hover:shadow-md"
                  >
                    {/* Card Header */}
                    <div className="flex flex-col gap-[4px]">
                      <p className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#333333]">
                        {lead.nombre}
                      </p>
                      <p className="font-['Open_Sans:SemiBold',sans-serif] text-[13px] text-[#004179] uppercase">
                        {lead.empresa}
                      </p>
                    </div>

                    {/* Etiqueta opcional */}
                    {lead.etiqueta && (
                      <div className="flex gap-[6px]">
                        <span className={`px-[10px] py-[4px] rounded-[4px] font-['Open_Sans:SemiBold',sans-serif] text-[11px] ${
                          lead.etiqueta === 'Seo' || lead.etiqueta === 'Oportunidad'
                            ? 'bg-[#cce5ff] text-[#004085]'
                            : lead.etiqueta === '1ra llamada'
                            ? 'bg-[#239ebc] text-white'
                            : 'bg-[#239ebc] text-white'
                        }`}>
                          {lead.etiqueta}
                        </span>
                        {column.id === 'Contactado' && lead.etiqueta === '1ra llamada' && (
                          <span className="px-[10px] py-[4px] rounded-[4px] font-['Open_Sans:SemiBold',sans-serif] text-[11px] bg-[#d4edda] text-[#155724]">
                            Envío correo
                          </span>
                        )}
                        {column.id === 'En diagnóstico' && lead.etiqueta === 'Presentación' && (
                          <span className="px-[10px] py-[4px] rounded-[4px] font-['Open_Sans:SemiBold',sans-serif] text-[11px] bg-[#239ebc] text-white">
                            Presentación
                          </span>
                        )}
                      </div>
                    )}

                    {/* Canal */}
                    <div className="flex items-center gap-[6px]">
                      {getIconForCanal(lead.canal)}
                      <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#4d545e]">
                        Canal: {lead.canal}
                      </p>
                    </div>

                    {/* Ejecutivo */}
                    <div className="flex items-center gap-[8px]">
                      <User className="size-[14px]" color="#004179" />
                      <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#4d545e]">
                        Ejecutivo: {lead.ejecutivo}
                      </p>
                    </div>

                    {/* Phone Button */}
                    <button 
                      onClick={() => handleLlamar(lead)}
                      className="mt-[8px] flex items-center justify-center size-[36px] rounded-full bg-[#239ebc] hover:bg-[#1b7a92] transition-colors ml-auto"
                      title={`Llamar a ${lead.nombre} - ${lead.telefono}`}
                    >
                      <Phone className="size-[18px]" color="white" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
