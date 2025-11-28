import { useState } from 'react';
import { Search, Phone, Calendar, Clock, Filter, Download, Plus } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { Modal } from './Modal';

interface Llamada {
  id: string;
  cliente: string;
  empresa: string;
  fecha: string;
  hora: string;
  duracion: string;
  tipo: 'Entrante' | 'Saliente';
  motivo: string;
  resultado: string;
  agente: string;
}

const mockLlamadas: Llamada[] = [
  {
    id: 'LL-001',
    cliente: 'Juan Pérez',
    empresa: 'Tech Solutions SA',
    fecha: '27 Nov 2024',
    hora: '10:30',
    duracion: '15 min',
    tipo: 'Saliente',
    motivo: 'Seguimiento de propuesta',
    resultado: 'Positivo',
    agente: 'Kepa Syntax',
  },
  {
    id: 'LL-002',
    cliente: 'María García',
    empresa: 'Innovate Corp',
    fecha: '27 Nov 2024',
    hora: '09:15',
    duracion: '8 min',
    tipo: 'Entrante',
    motivo: 'Consulta técnica',
    resultado: 'Resuelto',
    agente: 'Kepa Syntax',
  },
  {
    id: 'LL-003',
    cliente: 'Carlos Rodríguez',
    empresa: 'Digital Partners',
    fecha: '26 Nov 2024',
    hora: '14:45',
    duracion: '22 min',
    tipo: 'Saliente',
    motivo: 'Presentación de producto',
    resultado: 'Positivo',
    agente: 'Ana López',
  },
  {
    id: 'LL-004',
    cliente: 'Ana Martínez',
    empresa: 'Global Systems',
    fecha: '26 Nov 2024',
    hora: '11:20',
    duracion: '12 min',
    tipo: 'Saliente',
    motivo: 'Seguimiento',
    resultado: 'Neutral',
    agente: 'Pedro García',
  },
  {
    id: 'LL-005',
    cliente: 'Luis Fernández',
    empresa: 'Smart Business',
    fecha: '25 Nov 2024',
    hora: '16:00',
    duracion: '18 min',
    tipo: 'Entrante',
    motivo: 'Renovación de contrato',
    resultado: 'Positivo',
    agente: 'Kepa Syntax',
  },
  {
    id: 'LL-006',
    cliente: 'Elena Santos',
    empresa: 'Future Tech',
    fecha: '25 Nov 2024',
    hora: '10:45',
    duracion: '25 min',
    tipo: 'Saliente',
    motivo: 'Prospección',
    resultado: 'Seguimiento pendiente',
    agente: 'Ana López',
  },
  {
    id: 'LL-007',
    cliente: 'Roberto Díaz',
    empresa: 'Mega Corp',
    fecha: '24 Nov 2024',
    hora: '13:30',
    duracion: '10 min',
    tipo: 'Entrante',
    motivo: 'Soporte técnico',
    resultado: 'Resuelto',
    agente: 'Pedro García',
  },
  {
    id: 'LL-008',
    cliente: 'Patricia Ruiz',
    empresa: 'Innovation Labs',
    fecha: '24 Nov 2024',
    hora: '09:00',
    duracion: '30 min',
    tipo: 'Saliente',
    motivo: 'Cierre de venta',
    resultado: 'Positivo',
    agente: 'Kepa Syntax',
  },
];

interface LlamadasViewProps {
  prefilledData?: {
    cliente: string;
    empresa: string;
    telefono: string;
  };
}

export function LlamadasView({ prefilledData }: LlamadasViewProps = {}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [fechaFilter, setFechaFilter] = useState('');
  const [showModal, setShowModal] = useState(!!prefilledData);
  const [formData, setFormData] = useState({
    cliente: prefilledData?.cliente || '',
    empresa: prefilledData?.empresa || '',
    tipo: 'Saliente' as 'Entrante' | 'Saliente',
    motivo: '',
    duracion: '',
    resultado: '',
    notas: '',
  });

  const filteredLlamadas = mockLlamadas.filter(llamada => {
    const matchesSearch = llamada.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         llamada.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         llamada.motivo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = !tipoFilter || llamada.tipo === tipoFilter;
    return matchesSearch && matchesTipo;
  });

  // Estadísticas
  const totalLlamadas = mockLlamadas.length;
  const llamadasHoy = mockLlamadas.filter(l => l.fecha === '27 Nov 2024').length;
  const llamadasSalientes = mockLlamadas.filter(l => l.tipo === 'Saliente').length;
  const llamadasEntrantes = mockLlamadas.filter(l => l.tipo === 'Entrante').length;

  return (
    <div className="flex flex-col gap-[24px] w-full">
      <Breadcrumbs items={['CRM', 'Gestión de Llamadas']} />
      
      {/* Title */}
      <div className="box-border content-stretch flex flex-col items-start p-[10px] relative shrink-0">
        <div className="content-stretch flex flex-col gap-[20px] md:gap-[53px] items-start relative shrink-0 w-full">
          <div className="flex flex-col font-['Open_Sans:SemiBold',sans-serif] justify-center leading-[0] relative shrink-0 text-[#333333] text-[24px] md:text-[32px]">
            <p className="leading-[normal] whitespace-pre">Gestión de Llamadas</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
        <div className="bg-white rounded-[8px] p-[20px] flex flex-col gap-[12px] border border-[#bbbfc1]">
          <div className="flex items-center justify-center size-[40px] rounded-full bg-[#e6f0fe]">
            <Phone className="size-[20px]" color="#004179" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#999999]">
              Total Llamadas
            </p>
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[24px] text-[#333333]">
              {totalLlamadas}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[8px] p-[20px] flex flex-col gap-[12px] border border-[#bbbfc1]">
          <div className="flex items-center justify-center size-[40px] rounded-full bg-[#cce5ff]">
            <Calendar className="size-[20px]" color="#004085" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#999999]">
              Llamadas Hoy
            </p>
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[24px] text-[#333333]">
              {llamadasHoy}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[8px] p-[20px] flex flex-col gap-[12px] border border-[#bbbfc1]">
          <div className="flex items-center justify-center size-[40px] rounded-full bg-[#d4edda]">
            <Phone className="size-[20px] rotate-[135deg]" color="#155724" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#999999]">
              Llamadas Salientes
            </p>
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[24px] text-[#333333]">
              {llamadasSalientes}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[8px] p-[20px] flex flex-col gap-[12px] border border-[#bbbfc1]">
          <div className="flex items-center justify-center size-[40px] rounded-full bg-[#fff3cd]">
            <Phone className="size-[20px]" color="#856404" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#999999]">
              Llamadas Entrantes
            </p>
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[24px] text-[#333333]">
              {llamadasEntrantes}
            </p>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="bg-[#239ebc] h-[44px] relative rounded-[8px] shrink-0 w-full">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="box-border content-stretch flex gap-[8px] h-[44px] items-center justify-center p-[8px] relative w-full">
            <div className="flex flex-col font-['Open_Sans:SemiBold',sans-serif] grow justify-center text-[#fafbfc] text-[16px] text-center">
              <p className="leading-[normal]">Registro de Llamadas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-[8px] p-[16px] md:p-[24px] flex flex-col gap-[16px] md:gap-[24px]">
        <div className="content-stretch flex flex-col lg:flex-row gap-[12px] lg:gap-[20px] items-stretch lg:items-end relative shrink-0">
          {/* Tipo Filter */}
          <div className="flex-1 content-stretch flex flex-col gap-[8px] items-start justify-center">
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
              Tipo de Llamada
            </p>
            <div className="h-[44px] relative rounded-[8px] w-full">
              <select
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value)}
                className="box-border w-full h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#999999] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
              >
                <option value="">Todas las llamadas</option>
                <option value="Saliente">Saliente</option>
                <option value="Entrante">Entrante</option>
              </select>
            </div>
          </div>

          {/* Fecha Filter */}
          <div className="flex-1 content-stretch flex flex-col gap-[8px] items-start justify-center">
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
              Fecha
            </p>
            <div className="h-[44px] relative rounded-[8px] w-full">
              <select
                value={fechaFilter}
                onChange={(e) => setFechaFilter(e.target.value)}
                className="box-border w-full h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#999999] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
              >
                <option value="">Todas las fechas</option>
                <option value="hoy">Hoy</option>
                <option value="semana">Esta semana</option>
                <option value="mes">Este mes</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 content-stretch flex flex-col gap-[8px] items-start justify-center">
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
              Buscar
            </p>
            <div className="h-[44px] relative rounded-[8px] w-full">
              <div className="box-border w-full h-[44px] flex items-center gap-[10px] px-[10px] border border-[#bbbfc1] rounded-[8px]">
                <input
                  type="text"
                  placeholder="Buscar por cliente, empresa o motivo"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent font-['Open_Sans:Regular',sans-serif] text-[14px] outline-none"
                />
                <Search className="size-[18px]" color="#015CA8" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-[12px] lg:shrink-0">
            <button className="bg-white border border-[#004179] text-[#004179] px-[20px] h-[44px] rounded-[8px] flex items-center justify-center gap-[8px] font-['Open_Sans:SemiBold',sans-serif] text-[14px] hover:bg-[#e6f0fe] transition-colors">
              <Download className="size-[18px]" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-[#004179] text-white px-[24px] h-[44px] rounded-[8px] flex items-center justify-center gap-[8px] font-['Open_Sans:SemiBold',sans-serif] text-[14px] hover:bg-[#003060] transition-colors whitespace-nowrap"
            >
              <Plus className="size-[18px]" />
              Nueva Llamada
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto -mx-[16px] md:mx-0">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-[#004179] text-white">
                <th className="px-[16px] py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[14px] rounded-tl-[8px]">
                  ID
                </th>
                <th className="px-[16px] py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[14px]">
                  Cliente
                </th>
                <th className="px-[16px] py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[14px]">
                  Empresa
                </th>
                <th className="px-[16px] py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[14px]">
                  Fecha y Hora
                </th>
                <th className="px-[16px] py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[14px]">
                  Duración
                </th>
                <th className="px-[16px] py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[14px]">
                  Tipo
                </th>
                <th className="px-[16px] py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[14px]">
                  Motivo
                </th>
                <th className="px-[16px] py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[14px]">
                  Resultado
                </th>
                <th className="px-[16px] py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[14px] rounded-tr-[8px]">
                  Agente
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLlamadas.map((llamada, index) => (
                <tr 
                  key={llamada.id} 
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-[#e6f0fe] cursor-pointer transition-colors`}
                >
                  <td className="px-[16px] py-[12px] font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#333333]">
                    {llamada.id}
                  </td>
                  <td className="px-[16px] py-[12px] font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#333333]">
                    {llamada.cliente}
                  </td>
                  <td className="px-[16px] py-[12px] font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#333333]">
                    {llamada.empresa}
                  </td>
                  <td className="px-[16px] py-[12px]">
                    <div className="flex flex-col gap-[4px]">
                      <div className="flex items-center gap-[6px]">
                        <Calendar className="size-[12px]" color="#004179" />
                        <span className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#333333]">
                          {llamada.fecha}
                        </span>
                      </div>
                      <div className="flex items-center gap-[6px]">
                        <Clock className="size-[12px]" color="#004179" />
                        <span className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#4d545e]">
                          {llamada.hora}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-[16px] py-[12px] font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#333333]">
                    {llamada.duracion}
                  </td>
                  <td className="px-[16px] py-[12px]">
                    <span
                      className={`px-[12px] py-[4px] rounded-[4px] font-['Open_Sans:SemiBold',sans-serif] text-[12px] flex items-center gap-[6px] w-fit ${
                        llamada.tipo === 'Saliente'
                          ? 'bg-[#d4edda] text-[#155724]'
                          : 'bg-[#cce5ff] text-[#004085]'
                      }`}
                    >
                      <Phone className={`size-[12px] ${llamada.tipo === 'Saliente' ? 'rotate-[135deg]' : ''}`} />
                      {llamada.tipo}
                    </span>
                  </td>
                  <td className="px-[16px] py-[12px] font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#333333]">
                    {llamada.motivo}
                  </td>
                  <td className="px-[16px] py-[12px] font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#333333]">
                    {llamada.resultado}
                  </td>
                  <td className="px-[16px] py-[12px] font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#4d545e]">
                    {llamada.agente}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nueva Llamada */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          // Limpiar datos prellenados al cerrar
          if (prefilledData) {
            setFormData({
              cliente: '',
              empresa: '',
              tipo: 'Saliente',
              motivo: '',
              duracion: '',
              resultado: '',
              notas: '',
            });
          }
        }}
        title="Registrar Nueva Llamada"
      >
        <div className="flex flex-col gap-[20px]">
          {prefilledData && (
            <div className="bg-[#e6f0fe] border border-[#239ebc] rounded-[8px] p-[12px] flex items-start gap-[12px]">
              <Phone className="size-[20px] shrink-0 mt-[2px]" color="#004179" />
              <div className="flex flex-col gap-[4px]">
                <p className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#004179]">
                  Registrando llamada desde Tablero de Seguimiento
                </p>
                <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#4d545e]">
                  {prefilledData.cliente} - {prefilledData.empresa}
                </p>
                <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#4d545e]">
                  📞 {prefilledData.telefono}
                </p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
                Cliente
              </label>
              <input
                type="text"
                value={formData.cliente}
                onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                placeholder="Nombre del cliente"
                className="h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
              />
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
                Empresa
              </label>
              <input
                type="text"
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                placeholder="Nombre de la empresa"
                className="h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
                Tipo de Llamada
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'Entrante' | 'Saliente' })}
                className="h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
              >
                <option value="Saliente">Saliente</option>
                <option value="Entrante">Entrante</option>
              </select>
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
                Duración
              </label>
              <input
                type="text"
                value={formData.duracion}
                onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                placeholder="ej: 15 min"
                className="h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
              Motivo
            </label>
            <input
              type="text"
              value={formData.motivo}
              onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
              placeholder="Motivo de la llamada"
              className="h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
              Resultado
            </label>
            <input
              type="text"
              value={formData.resultado}
              onChange={(e) => setFormData({ ...formData, resultado: e.target.value })}
              placeholder="Resultado de la llamada"
              className="h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
              Notas
            </label>
            <textarea
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              placeholder="Notas adicionales..."
              className="min-h-[100px] px-[10px] py-[8px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8] resize-none"
            />
          </div>

          <div className="flex gap-[12px] justify-end pt-[20px]">
            <button
              onClick={() => setShowModal(false)}
              className="px-[20px] py-[10px] rounded-[8px] border border-[#bbbfc1] font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#333333] hover:bg-[#f9f9f9] transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={() => {
                // Aquí iría la lógica para guardar la llamada
                console.log('Nueva llamada:', formData);
                setShowModal(false);
                setFormData({
                  cliente: '',
                  empresa: '',
                  tipo: 'Saliente',
                  motivo: '',
                  duracion: '',
                  resultado: '',
                  notas: '',
                });
              }}
              className="bg-[#004179] text-white px-[20px] py-[10px] rounded-[8px] font-['Open_Sans:SemiBold',sans-serif] text-[14px] hover:bg-[#003060] transition-colors"
            >
              Guardar Llamada
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
