import { useState } from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { Calendar, Clock, AlertCircle, CheckCircle, Plus, Filter, User, Building } from 'lucide-react';
import { Modal } from './Modal';

interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  cliente: string;
  empresa: string;
  fechaVencimiento: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
  estado: 'Pendiente' | 'En Progreso' | 'Completada' | 'Vencida';
  asignado: string;
  tipo: 'Llamada' | 'Reunión' | 'Email' | 'Seguimiento' | 'Propuesta';
}

const mockTareas: Tarea[] = [
  {
    id: 'T-001',
    titulo: 'Llamada de seguimiento propuesta',
    descripcion: 'Realizar llamada para conocer decisión sobre propuesta comercial Q4',
    cliente: 'María García',
    empresa: 'Innovate Corp',
    fechaVencimiento: '28 Nov 2024',
    prioridad: 'Alta',
    estado: 'Pendiente',
    asignado: 'Kepa Syntax',
    tipo: 'Llamada',
  },
  {
    id: 'T-002',
    titulo: 'Reunión presencial Madrid',
    descripcion: 'Reunión para presentar ampliación de contrato',
    cliente: 'Juan Pérez',
    empresa: 'Tech Solutions SA',
    fechaVencimiento: '29 Nov 2024',
    prioridad: 'Alta',
    estado: 'En Progreso',
    asignado: 'Kepa Syntax',
    tipo: 'Reunión',
  },
  {
    id: 'T-003',
    titulo: 'Enviar documentación técnica',
    descripcion: 'Enviar manual técnico y especificaciones del producto',
    cliente: 'Carlos Rodríguez',
    empresa: 'Digital Partners',
    fechaVencimiento: '27 Nov 2024',
    prioridad: 'Media',
    estado: 'Vencida',
    asignado: 'Ana López',
    tipo: 'Email',
  },
  {
    id: 'T-004',
    titulo: 'Seguimiento post-venta',
    descripcion: 'Verificar satisfacción con el servicio implementado',
    cliente: 'Luis Fernández',
    empresa: 'Smart Business',
    fechaVencimiento: '30 Nov 2024',
    prioridad: 'Baja',
    estado: 'Pendiente',
    asignado: 'Pedro García',
    tipo: 'Seguimiento',
  },
  {
    id: 'T-005',
    titulo: 'Enviar propuesta Enterprise',
    descripcion: 'Preparar y enviar propuesta para plan Enterprise personalizado',
    cliente: 'Elena Santos',
    empresa: 'Future Tech',
    fechaVencimiento: '02 Dic 2024',
    prioridad: 'Alta',
    estado: 'En Progreso',
    asignado: 'Kepa Syntax',
    tipo: 'Propuesta',
  },
  {
    id: 'T-006',
    titulo: 'Renovación de contrato',
    descripcion: 'Contactar para renovación de contrato anual',
    cliente: 'Ana Martínez',
    empresa: 'Global Systems',
    fechaVencimiento: '01 Dic 2024',
    prioridad: 'Media',
    estado: 'Pendiente',
    asignado: 'Ana López',
    tipo: 'Llamada',
  },
  {
    id: 'T-007',
    titulo: 'Demo de producto actualizado',
    descripcion: 'Realizar demostración de nuevas funcionalidades',
    cliente: 'Roberto Díaz',
    empresa: 'Mega Corp',
    fechaVencimiento: '25 Nov 2024',
    prioridad: 'Baja',
    estado: 'Completada',
    asignado: 'Pedro García',
    tipo: 'Reunión',
  },
  {
    id: 'T-008',
    titulo: 'Seguimiento cierre venta',
    descripcion: 'Confirmar fecha de implementación y firma de contrato',
    cliente: 'Patricia Ruiz',
    empresa: 'Innovation Labs',
    fechaVencimiento: '28 Nov 2024',
    prioridad: 'Alta',
    estado: 'En Progreso',
    asignado: 'Kepa Syntax',
    tipo: 'Seguimiento',
  },
];

export function SeguimientoView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [prioridadFilter, setPrioridadFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTarea, setSelectedTarea] = useState<Tarea | null>(null);
  const [tareas, setTareas] = useState<Tarea[]>(mockTareas);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    cliente: '',
    empresa: '',
    fechaVencimiento: '',
    prioridad: 'Media' as 'Alta' | 'Media' | 'Baja',
    tipo: 'Llamada' as 'Llamada' | 'Reunión' | 'Email' | 'Seguimiento' | 'Propuesta',
    asignado: 'Kepa Syntax',
  });

  const filteredTareas = tareas.filter(tarea => {
    const matchesSearch = tarea.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tarea.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tarea.empresa.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = !estadoFilter || tarea.estado === estadoFilter;
    const matchesPrioridad = !prioridadFilter || tarea.prioridad === prioridadFilter;
    return matchesSearch && matchesEstado && matchesPrioridad;
  });

  // Estadísticas
  const totalTareas = tareas.length;
  const tareasPendientes = tareas.filter(t => t.estado === 'Pendiente').length;
  const tareasEnProgreso = tareas.filter(t => t.estado === 'En Progreso').length;
  const tareasVencidas = tareas.filter(t => t.estado === 'Vencida').length;
  const tareasCompletadas = tareas.filter(t => t.estado === 'Completada').length;

  const handleMarcarCompletada = (tareaId: string) => {
    setTareas(prevTareas => 
      prevTareas.map(tarea => 
        tarea.id === tareaId 
          ? { ...tarea, estado: 'Completada' as const }
          : tarea
      )
    );
  };

  const handleVerDetalles = (tarea: Tarea) => {
    setSelectedTarea(tarea);
    setShowDetailModal(true);
  };

  return (
    <div className="flex flex-col gap-[24px] w-full">
      <Breadcrumbs items={['CRM', 'Seguimiento y Tareas']} />
      
      {/* Title */}
      <div className="box-border content-stretch flex flex-col items-start p-[10px] relative shrink-0">
        <div className="content-stretch flex flex-col gap-[20px] md:gap-[53px] items-start relative shrink-0 w-full">
          <div className="flex flex-col font-['Open_Sans:SemiBold',sans-serif] justify-center leading-[0] relative shrink-0 text-[#333333] text-[24px] md:text-[32px]">
            <p className="leading-[normal] whitespace-pre">Seguimiento y Tareas</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[16px]">
        <div className="bg-white rounded-[8px] p-[20px] flex flex-col gap-[12px] border border-[#bbbfc1]">
          <div className="flex items-center justify-center size-[40px] rounded-full bg-[#e6f0fe]">
            <CheckCircle className="size-[20px]" color="#004179" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#999999]">
              Total Tareas
            </p>
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[24px] text-[#333333]">
              {totalTareas}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[8px] p-[20px] flex flex-col gap-[12px] border border-[#bbbfc1]">
          <div className="flex items-center justify-center size-[40px] rounded-full bg-[#fff3cd]">
            <Clock className="size-[20px]" color="#856404" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#999999]">
              Pendientes
            </p>
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[24px] text-[#333333]">
              {tareasPendientes}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[8px] p-[20px] flex flex-col gap-[12px] border border-[#bbbfc1]">
          <div className="flex items-center justify-center size-[40px] rounded-full bg-[#cce5ff]">
            <AlertCircle className="size-[20px]" color="#004085" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#999999]">
              En Progreso
            </p>
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[24px] text-[#333333]">
              {tareasEnProgreso}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[8px] p-[20px] flex flex-col gap-[12px] border border-[#bbbfc1]">
          <div className="flex items-center justify-center size-[40px] rounded-full bg-[#f8d7da]">
            <AlertCircle className="size-[20px]" color="#721c24" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#999999]">
              Vencidas
            </p>
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[24px] text-[#333333]">
              {tareasVencidas}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[8px] p-[20px] flex flex-col gap-[12px] border border-[#bbbfc1]">
          <div className="flex items-center justify-center size-[40px] rounded-full bg-[#d4edda]">
            <CheckCircle className="size-[20px]" color="#155724" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#999999]">
              Completadas
            </p>
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[24px] text-[#333333]">
              {tareasCompletadas}
            </p>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="bg-[#239ebc] h-[44px] relative rounded-[8px] shrink-0 w-full">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="box-border content-stretch flex gap-[8px] h-[44px] items-center justify-center p-[8px] relative w-full">
            <div className="flex flex-col font-['Open_Sans:SemiBold',sans-serif] grow justify-center text-[#fafbfc] text-[16px] text-center">
              <p className="leading-[normal]">Lista de Tareas y Seguimientos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-[8px] p-[16px] md:p-[24px] flex flex-col gap-[16px] md:gap-[24px]">
        <div className="content-stretch flex flex-col lg:flex-row gap-[12px] lg:gap-[20px] items-stretch lg:items-end relative shrink-0">
          {/* Estado Filter */}
          <div className="flex-1 content-stretch flex flex-col gap-[8px] items-start justify-center">
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
              Estado
            </p>
            <div className="h-[44px] relative rounded-[8px] w-full">
              <select
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
                className="box-border w-full h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#999999] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
              >
                <option value="">Todos los estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Completada">Completada</option>
                <option value="Vencida">Vencida</option>
              </select>
            </div>
          </div>

          {/* Prioridad Filter */}
          <div className="flex-1 content-stretch flex flex-col gap-[8px] items-start justify-center">
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
              Prioridad
            </p>
            <div className="h-[44px] relative rounded-[8px] w-full">
              <select
                value={prioridadFilter}
                onChange={(e) => setPrioridadFilter(e.target.value)}
                className="box-border w-full h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#999999] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
              >
                <option value="">Todas las prioridades</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
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
                  placeholder="Buscar tarea, cliente o empresa"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent font-['Open_Sans:Regular',sans-serif] text-[14px] outline-none"
                />
                <Filter className="size-[18px]" color="#015CA8" />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#004179] text-white px-[24px] h-[44px] rounded-[8px] flex items-center justify-center gap-[8px] font-['Open_Sans:SemiBold',sans-serif] text-[14px] hover:bg-[#003060] transition-colors whitespace-nowrap lg:shrink-0 w-full lg:w-auto"
          >
            <Plus className="size-[18px]" />
            Nueva Tarea
          </button>
        </div>

        {/* Tasks List */}
        <div className="flex flex-col gap-[12px]">
          {filteredTareas.map((tarea) => (
            <div
              key={tarea.id}
              className="bg-[#f9f9f9] rounded-[8px] p-[20px] flex flex-col gap-[16px] hover:bg-[#e6f0fe] transition-colors border-l-4"
              style={{
                borderLeftColor:
                  tarea.prioridad === 'Alta'
                    ? '#721c24'
                    : tarea.prioridad === 'Media'
                    ? '#856404'
                    : '#004179',
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1 flex flex-col gap-[8px]">
                  <div className="flex items-center gap-[12px]">
                    <span className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#999999]">
                      {tarea.id}
                    </span>
                    <span
                      className={`px-[12px] py-[4px] rounded-[4px] font-['Open_Sans:SemiBold',sans-serif] text-[12px] ${
                        tarea.prioridad === 'Alta'
                          ? 'bg-[#f8d7da] text-[#721c24]'
                          : tarea.prioridad === 'Media'
                          ? 'bg-[#fff3cd] text-[#856404]'
                          : 'bg-[#cce5ff] text-[#004085]'
                      }`}
                    >
                      {tarea.prioridad}
                    </span>
                    <span className="px-[12px] py-[4px] rounded-[4px] font-['Open_Sans:SemiBold',sans-serif] text-[12px] bg-[#e6f0fe] text-[#004179]">
                      {tarea.tipo}
                    </span>
                  </div>
                  <h3 className="font-['Open_Sans:SemiBold',sans-serif] text-[18px] text-[#333333]">
                    {tarea.titulo}
                  </h3>
                  <p className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#4d545e]">
                    {tarea.descripcion}
                  </p>
                </div>
                <span
                  className={`px-[16px] py-[6px] rounded-[6px] font-['Open_Sans:SemiBold',sans-serif] text-[14px] ${
                    tarea.estado === 'Completada'
                      ? 'bg-[#d4edda] text-[#155724]'
                      : tarea.estado === 'Vencida'
                      ? 'bg-[#f8d7da] text-[#721c24]'
                      : tarea.estado === 'En Progreso'
                      ? 'bg-[#cce5ff] text-[#004085]'
                      : 'bg-[#fff3cd] text-[#856404]'
                  }`}
                >
                  {tarea.estado}
                </span>
              </div>

              {/* Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[12px] md:gap-[16px]">
                <div className="flex items-center gap-[8px]">
                  <User className="size-[16px]" color="#004179" />
                  <div className="flex flex-col">
                    <span className="font-['Open_Sans:SemiBold',sans-serif] text-[12px] text-[#999999]">
                      Cliente
                    </span>
                    <span className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#333333]">
                      {tarea.cliente}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-[8px]">
                  <Building className="size-[16px]" color="#004179" />
                  <div className="flex flex-col">
                    <span className="font-['Open_Sans:SemiBold',sans-serif] text-[12px] text-[#999999]">
                      Empresa
                    </span>
                    <span className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#333333]">
                      {tarea.empresa}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-[8px]">
                  <Calendar className="size-[16px]" color="#004179" />
                  <div className="flex flex-col">
                    <span className="font-['Open_Sans:SemiBold',sans-serif] text-[12px] text-[#999999]">
                      Vencimiento
                    </span>
                    <span className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#333333]">
                      {tarea.fechaVencimiento}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-[12px] border-t border-[#bbbfc1]">
                <div className="flex items-center gap-[8px]">
                  <div className="size-[32px] rounded-full flex items-center justify-center" style={{ background: '#004179' }}>
                    <span className="font-['Open_Sans:SemiBold',sans-serif] text-[12px] text-white">
                      {tarea.asignado.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-['Open_Sans:SemiBold',sans-serif] text-[12px] text-[#999999]">
                      Asignado a
                    </span>
                    <span className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#333333]">
                      {tarea.asignado}
                    </span>
                  </div>
                </div>

                <div className="flex gap-[8px]">
                  {tarea.estado !== 'Completada' && (
                    <button 
                      onClick={() => handleMarcarCompletada(tarea.id)}
                      className="bg-[#004179] text-white px-[16px] py-[8px] rounded-[6px] font-['Open_Sans:SemiBold',sans-serif] text-[12px] hover:bg-[#003060] transition-colors"
                    >
                      Marcar Completada
                    </button>
                  )}
                  <button 
                    onClick={() => handleVerDetalles(tarea)}
                    className="bg-white border border-[#bbbfc1] text-[#333333] px-[16px] py-[8px] rounded-[6px] font-['Open_Sans:SemiBold',sans-serif] text-[12px] hover:bg-[#f9f9f9] transition-colors"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Detalles de Tarea */}
      {selectedTarea && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedTarea(null);
          }}
          title="Detalles de la Tarea"
        >
          <div className="flex flex-col gap-[24px]">
            {/* Header con Estado y Prioridad */}
            <div className="flex items-center justify-between p-[20px] rounded-[8px] bg-[#e6f0fe]">
              <div className="flex items-center gap-[12px]">
                <span className="font-['Open_Sans:SemiBold',sans-serif] text-[16px] text-[#333333]">
                  {selectedTarea.id}
                </span>
                <span
                  className={`px-[12px] py-[6px] rounded-[6px] font-['Open_Sans:SemiBold',sans-serif] text-[14px] ${
                    selectedTarea.estado === 'Completada'
                      ? 'bg-[#d4edda] text-[#155724]'
                      : selectedTarea.estado === 'Vencida'
                      ? 'bg-[#f8d7da] text-[#721c24]'
                      : selectedTarea.estado === 'En Progreso'
                      ? 'bg-[#cce5ff] text-[#004085]'
                      : 'bg-[#fff3cd] text-[#856404]'
                  }`}
                >
                  {selectedTarea.estado}
                </span>
              </div>
              <span
                className={`px-[16px] py-[8px] rounded-[6px] font-['Open_Sans:SemiBold',sans-serif] text-[14px] ${
                  selectedTarea.prioridad === 'Alta'
                    ? 'bg-[#f8d7da] text-[#721c24]'
                    : selectedTarea.prioridad === 'Media'
                    ? 'bg-[#fff3cd] text-[#856404]'
                    : 'bg-[#cce5ff] text-[#004085]'
                }`}
              >
                Prioridad {selectedTarea.prioridad}
              </span>
            </div>

            {/* Título y Tipo */}
            <div className="flex flex-col gap-[12px]">
              <div className="flex items-center gap-[12px]">
                <h2 className="font-['Open_Sans:SemiBold',sans-serif] text-[24px] text-[#333333]">
                  {selectedTarea.titulo}
                </h2>
                <span className="px-[12px] py-[4px] rounded-[6px] font-['Open_Sans:SemiBold',sans-serif] text-[12px] bg-[#239ebc] text-white">
                  {selectedTarea.tipo}
                </span>
              </div>
            </div>

            {/* Descripción */}
            <div className="flex flex-col gap-[8px]">
              <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#999999]">
                Descripción
              </label>
              <p className="font-['Open_Sans:Regular',sans-serif] text-[15px] text-[#333333] leading-relaxed p-[16px] rounded-[8px] bg-[#f9f9f9] border border-[#e0e0e0]">
                {selectedTarea.descripcion}
              </p>
            </div>

            {/* Información del Cliente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <div className="flex flex-col gap-[8px] p-[16px] rounded-[8px] bg-[#f9f9f9] border border-[#e0e0e0]">
                <div className="flex items-center gap-[8px]">
                  <User className="size-[18px]" color="#004179" />
                  <label className="font-['Open_Sans:SemiBold',sans-serif] text-[13px] text-[#999999]">
                    Cliente
                  </label>
                </div>
                <p className="font-['Open_Sans:SemiBold',sans-serif] text-[16px] text-[#333333]">
                  {selectedTarea.cliente}
                </p>
              </div>

              <div className="flex flex-col gap-[8px] p-[16px] rounded-[8px] bg-[#f9f9f9] border border-[#e0e0e0]">
                <div className="flex items-center gap-[8px]">
                  <Building className="size-[18px]" color="#004179" />
                  <label className="font-['Open_Sans:SemiBold',sans-serif] text-[13px] text-[#999999]">
                    Empresa
                  </label>
                </div>
                <p className="font-['Open_Sans:SemiBold',sans-serif] text-[16px] text-[#333333]">
                  {selectedTarea.empresa}
                </p>
              </div>
            </div>

            {/* Fechas y Asignación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <div className="flex flex-col gap-[8px] p-[16px] rounded-[8px] bg-[#f9f9f9] border border-[#e0e0e0]">
                <div className="flex items-center gap-[8px]">
                  <Calendar className="size-[18px]" color="#004179" />
                  <label className="font-['Open_Sans:SemiBold',sans-serif] text-[13px] text-[#999999]">
                    Fecha de Vencimiento
                  </label>
                </div>
                <p className="font-['Open_Sans:SemiBold',sans-serif] text-[16px] text-[#333333]">
                  {selectedTarea.fechaVencimiento}
                </p>
              </div>

              <div className="flex flex-col gap-[8px] p-[16px] rounded-[8px] bg-[#f9f9f9] border border-[#e0e0e0]">
                <div className="flex items-center gap-[8px]">
                  <User className="size-[18px]" color="#004179" />
                  <label className="font-['Open_Sans:SemiBold',sans-serif] text-[13px] text-[#999999]">
                    Asignado a
                  </label>
                </div>
                <div className="flex items-center gap-[8px]">
                  <div className="size-[32px] rounded-full flex items-center justify-center" style={{ background: '#004179' }}>
                    <span className="font-['Open_Sans:SemiBold',sans-serif] text-[12px] text-white">
                      {selectedTarea.asignado.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <p className="font-['Open_Sans:SemiBold',sans-serif] text-[16px] text-[#333333]">
                    {selectedTarea.asignado}
                  </p>
                </div>
              </div>
            </div>

            {/* Notas adicionales simuladas */}
            <div className="flex flex-col gap-[8px]">
              <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#999999]">
                Historial de Actividad
              </label>
              <div className="flex flex-col gap-[8px]">
                <div className="p-[12px] rounded-[8px] bg-[#f9f9f9] border-l-4 border-[#004179]">
                  <p className="font-['Open_Sans:SemiBold',sans-serif] text-[13px] text-[#333333]">
                    Tarea creada
                  </p>
                  <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#999999]">
                    25 Nov 2024 - 10:30 AM
                  </p>
                </div>
                {selectedTarea.estado === 'En Progreso' && (
                  <div className="p-[12px] rounded-[8px] bg-[#f9f9f9] border-l-4 border-[#239ebc]">
                    <p className="font-['Open_Sans:SemiBold',sans-serif] text-[13px] text-[#333333]">
                      Estado actualizado a "En Progreso"
                    </p>
                    <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#999999]">
                      26 Nov 2024 - 02:15 PM
                    </p>
                  </div>
                )}
                {selectedTarea.estado === 'Completada' && (
                  <div className="p-[12px] rounded-[8px] bg-[#f9f9f9] border-l-4 border-[#155724]">
                    <p className="font-['Open_Sans:SemiBold',sans-serif] text-[13px] text-[#333333]">
                      Tarea completada
                    </p>
                    <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#999999]">
                      27 Nov 2024 - 04:45 PM
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-[12px] justify-end pt-[20px] border-t border-[#e0e0e0]">
              {selectedTarea.estado !== 'Completada' && (
                <button
                  onClick={() => {
                    handleMarcarCompletada(selectedTarea.id);
                    setShowDetailModal(false);
                    setSelectedTarea(null);
                  }}
                  className="bg-[#004179] text-white px-[20px] py-[10px] rounded-[8px] font-['Open_Sans:SemiBold',sans-serif] text-[14px] hover:bg-[#003060] transition-colors"
                >
                  Marcar como Completada
                </button>
              )}
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedTarea(null);
                }}
                className="px-[20px] py-[10px] rounded-[8px] border border-[#bbbfc1] font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#333333] hover:bg-[#f9f9f9] transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Nueva Tarea */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Crear Nueva Tarea"
      >
        <div className="flex flex-col gap-[20px]">
          <div className="flex flex-col gap-[8px]">
            <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
              Título de la Tarea
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Título de la tarea"
              className="h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Descripción detallada de la tarea..."
              className="min-h-[80px] px-[10px] py-[8px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8] resize-none"
            />
          </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
                Tipo
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                className="h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
              >
                <option value="Llamada">Llamada</option>
                <option value="Reunión">Reunión</option>
                <option value="Email">Email</option>
                <option value="Seguimiento">Seguimiento</option>
                <option value="Propuesta">Propuesta</option>
              </select>
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
                Prioridad
              </label>
              <select
                value={formData.prioridad}
                onChange={(e) => setFormData({ ...formData, prioridad: e.target.value as any })}
                className="h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
              >
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
                Fecha Vencimiento
              </label>
              <input
                type="date"
                value={formData.fechaVencimiento}
                onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })}
                className="h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
              Asignado a
            </label>
            <select
              value={formData.asignado}
              onChange={(e) => setFormData({ ...formData, asignado: e.target.value })}
              className="h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
            >
              <option value="Kepa Syntax">Kepa Syntax</option>
              <option value="Ana López">Ana López</option>
              <option value="Pedro García">Pedro García</option>
            </select>
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
                console.log('Nueva tarea:', formData);
                setShowModal(false);
                setFormData({
                  titulo: '',
                  descripcion: '',
                  cliente: '',
                  empresa: '',
                  fechaVencimiento: '',
                  prioridad: 'Media',
                  tipo: 'Llamada',
                  asignado: 'Kepa Syntax',
                });
              }}
              className="bg-[#004179] text-white px-[20px] py-[10px] rounded-[8px] font-['Open_Sans:SemiBold',sans-serif] text-[14px] hover:bg-[#003060] transition-colors"
            >
              Crear Tarea
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
