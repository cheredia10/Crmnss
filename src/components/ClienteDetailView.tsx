import { useState } from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { ArrowLeft, Phone, Mail, MapPin, Building, Calendar, Clock, Plus, Edit } from 'lucide-react';

interface Llamada {
  id: string;
  fecha: string;
  hora: string;
  duracion: string;
  tipo: 'Entrante' | 'Saliente';
  motivo: string;
  notas: string;
  resultado: string;
}

const mockLlamadas: Llamada[] = [
  {
    id: '001',
    fecha: '23 Nov 2024',
    hora: '10:30',
    duracion: '15 min',
    tipo: 'Saliente',
    motivo: 'Seguimiento de propuesta',
    notas: 'Cliente interesado en ampliar el contrato. Solicita reunión presencial.',
    resultado: 'Positivo',
  },
  {
    id: '002',
    fecha: '20 Nov 2024',
    hora: '14:45',
    duracion: '8 min',
    tipo: 'Entrante',
    motivo: 'Consulta técnica',
    notas: 'Pregunta sobre funcionalidades del producto.',
    resultado: 'Resuelto',
  },
  {
    id: '003',
    fecha: '18 Nov 2024',
    hora: '09:15',
    duracion: '22 min',
    tipo: 'Saliente',
    motivo: 'Presentación de producto',
    notas: 'Primera llamada de contacto. Cliente muy receptivo.',
    resultado: 'Positivo',
  },
  {
    id: '004',
    fecha: '15 Nov 2024',
    hora: '16:20',
    duracion: '12 min',
    tipo: 'Saliente',
    motivo: 'Seguimiento',
    notas: 'Confirmación de recepción de documentación.',
    resultado: 'Neutral',
  },
];

interface ClienteDetailViewProps {
  clienteId: string;
  onBack: () => void;
}

export function ClienteDetailView({ clienteId, onBack }: ClienteDetailViewProps) {
  const [showNuevaLlamada, setShowNuevaLlamada] = useState(false);
  const [nuevaLlamada, setNuevaLlamada] = useState({
    tipo: 'Saliente' as 'Entrante' | 'Saliente',
    motivo: '',
    notas: '',
    resultado: '',
  });

  // Mock client data
  const cliente = {
    id: clienteId,
    nombre: 'Juan Pérez',
    empresa: 'Tech Solutions SA',
    telefono: '+34 612 345 678',
    email: 'juan.perez@techsolutions.com',
    ciudad: 'Madrid',
    direccion: 'Calle Principal 123, 28001 Madrid',
    ultimaLlamada: '23 Nov 2024',
    totalLlamadas: 12,
    estado: 'Activo',
  };

  return (
    <div className="flex flex-col gap-[24px] w-full">
      <Breadcrumbs items={['CRM', 'Gestión de Clientes', cliente.nombre]} />
      
      {/* Header with Back Button */}
      <div className="box-border content-stretch flex items-center gap-[16px] p-[10px] relative shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[8px] border border-[#bbbfc1] hover:bg-[#e6f0fe] transition-colors"
        >
          <ArrowLeft className="size-[18px]" color="#004179" />
          <span className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#004179]">
            Volver
          </span>
        </button>
        <div className="flex flex-col font-['Open_Sans:SemiBold',sans-serif] justify-center text-[#333333] text-[20px] md:text-[32px]">
          <p className="leading-[normal]">Detalle del Cliente</p>
        </div>
      </div>

      {/* Client Info Card */}
      <div className="bg-white rounded-[8px] p-[16px] md:p-[24px] flex flex-col gap-[16px] md:gap-[24px]">
        <div className="bg-[#239ebc] min-h-[44px] rounded-[8px] flex flex-col sm:flex-row items-start sm:items-center justify-between px-[16px] py-[12px] sm:py-0 gap-[12px] sm:gap-0">
          <p className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] md:text-[16px] text-[#fafbfc]">
            Información del Cliente
          </p>
          <button className="flex items-center gap-[8px] px-[12px] py-[6px] bg-white rounded-[6px] hover:bg-[#e6f0fe] transition-colors">
            <Edit className="size-[14px]" color="#004179" />
            <span className="font-['Open_Sans:SemiBold',sans-serif] text-[12px] text-[#004179]">
              Editar
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px] md:gap-[24px]">
          <div className="flex flex-col gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <p className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#999999]">
                Nombre Completo
              </p>
              <p className="font-['Open_Sans:Regular',sans-serif] text-[16px] text-[#333333]">
                {cliente.nombre}
              </p>
            </div>
            
            <div className="flex flex-col gap-[8px]">
              <p className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#999999]">
                Empresa
              </p>
              <div className="flex items-center gap-[8px]">
                <Building className="size-[16px]" color="#004179" />
                <p className="font-['Open_Sans:Regular',sans-serif] text-[16px] text-[#333333]">
                  {cliente.empresa}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-[8px]">
              <p className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#999999]">
                Teléfono
              </p>
              <div className="flex items-center gap-[8px]">
                <Phone className="size-[16px]" color="#004179" />
                <p className="font-['Open_Sans:Regular',sans-serif] text-[16px] text-[#333333]">
                  {cliente.telefono}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <p className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#999999]">
                Email
              </p>
              <div className="flex items-center gap-[8px]">
                <Mail className="size-[16px]" color="#004179" />
                <p className="font-['Open_Sans:Regular',sans-serif] text-[16px] text-[#333333]">
                  {cliente.email}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-[8px]">
              <p className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#999999]">
                Ubicación
              </p>
              <div className="flex items-center gap-[8px]">
                <MapPin className="size-[16px]" color="#004179" />
                <p className="font-['Open_Sans:Regular',sans-serif] text-[16px] text-[#333333]">
                  {cliente.direccion}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-[8px]">
              <p className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#999999]">
                Estado
              </p>
              <span className="px-[12px] py-[4px] rounded-[4px] font-['Open_Sans:SemiBold',sans-serif] text-[12px] bg-[#d4edda] text-[#155724] w-fit">
                {cliente.estado}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Call History */}
      <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[24px]">
        <div className="bg-[#239ebc] h-[44px] rounded-[8px] flex items-center justify-between px-[16px]">
          <p className="font-['Open_Sans:SemiBold',sans-serif] text-[16px] text-[#fafbfc]">
            Historial de Llamadas ({mockLlamadas.length})
          </p>
          <button
            onClick={() => setShowNuevaLlamada(!showNuevaLlamada)}
            className="flex items-center gap-[8px] px-[12px] py-[6px] bg-white rounded-[6px] hover:bg-[#e6f0fe] transition-colors"
          >
            <Plus className="size-[14px]" color="#004179" />
            <span className="font-['Open_Sans:SemiBold',sans-serif] text-[12px] text-[#004179]">
              Nueva Llamada
            </span>
          </button>
        </div>

        {/* New Call Form */}
        {showNuevaLlamada && (
          <div className="bg-[#f9f9f9] rounded-[8px] p-[20px] flex flex-col gap-[16px]">
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[16px] text-[#333333]">
              Registrar Nueva Llamada
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <p className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
                  Tipo de Llamada
                </p>
                <select
                  value={nuevaLlamada.tipo}
                  onChange={(e) => setNuevaLlamada({ ...nuevaLlamada, tipo: e.target.value as 'Entrante' | 'Saliente' })}
                  className="h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1]"
                >
                  <option value="Saliente">Saliente</option>
                  <option value="Entrante">Entrante</option>
                </select>
              </div>

              <div className="flex flex-col gap-[8px]">
                <p className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
                  Motivo
                </p>
                <input
                  type="text"
                  value={nuevaLlamada.motivo}
                  onChange={(e) => setNuevaLlamada({ ...nuevaLlamada, motivo: e.target.value })}
                  placeholder="Motivo de la llamada"
                  className="h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-[8px]">
              <p className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
                Notas
              </p>
              <textarea
                value={nuevaLlamada.notas}
                onChange={(e) => setNuevaLlamada({ ...nuevaLlamada, notas: e.target.value })}
                placeholder="Notas de la llamada..."
                className="min-h-[80px] px-[10px] py-[8px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] resize-none"
              />
            </div>

            <div className="flex flex-col gap-[8px]">
              <p className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
                Resultado
              </p>
              <input
                type="text"
                value={nuevaLlamada.resultado}
                onChange={(e) => setNuevaLlamada({ ...nuevaLlamada, resultado: e.target.value })}
                placeholder="Resultado de la llamada"
                className="h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1]"
              />
            </div>

            <div className="flex gap-[12px] justify-end">
              <button
                onClick={() => setShowNuevaLlamada(false)}
                className="px-[20px] py-[10px] rounded-[8px] border border-[#bbbfc1] font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#333333] hover:bg-[#f9f9f9] transition-colors"
              >
                Cancelar
              </button>
              <button className="bg-[#004179] text-white px-[20px] py-[10px] rounded-[8px] font-['Open_Sans:SemiBold',sans-serif] text-[14px] hover:bg-[#003060] transition-colors">
                Guardar Llamada
              </button>
            </div>
          </div>
        )}

        {/* Calls List */}
        <div className="flex flex-col gap-[12px]">
          {mockLlamadas.map((llamada) => (
            <div
              key={llamada.id}
              className="bg-[#f9f9f9] rounded-[8px] p-[16px] flex flex-col gap-[12px] hover:bg-[#e6f0fe] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-[12px]">
                  <div className={`p-[8px] rounded-full ${llamada.tipo === 'Saliente' ? 'bg-[#d4edda]' : 'bg-[#cce5ff]'}`}>
                    <Phone
                      className={`size-[16px] ${llamada.tipo === 'Saliente' ? 'rotate-[135deg]' : ''}`}
                      color={llamada.tipo === 'Saliente' ? '#155724' : '#004085'}
                    />
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    <p className="font-['Open_Sans:SemiBold',sans-serif] text-[16px] text-[#333333]">
                      {llamada.motivo}
                    </p>
                    <div className="flex items-center gap-[12px]">
                      <div className="flex items-center gap-[4px]">
                        <Calendar className="size-[12px]" color="#999999" />
                        <span className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#999999]">
                          {llamada.fecha}
                        </span>
                      </div>
                      <div className="flex items-center gap-[4px]">
                        <Clock className="size-[12px]" color="#999999" />
                        <span className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#999999]">
                          {llamada.hora} - {llamada.duracion}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-[12px] py-[4px] rounded-[4px] font-['Open_Sans:SemiBold',sans-serif] text-[12px] ${
                    llamada.tipo === 'Saliente' ? 'bg-[#d4edda] text-[#155724]' : 'bg-[#cce5ff] text-[#004085]'
                  }`}
                >
                  {llamada.tipo}
                </span>
              </div>
              <p className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#4d545e]">
                {llamada.notas}
              </p>
              <div className="flex items-center gap-[8px]">
                <span className="font-['Open_Sans:SemiBold',sans-serif] text-[12px] text-[#999999]">
                  Resultado:
                </span>
                <span className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#333333]">
                  {llamada.resultado}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
