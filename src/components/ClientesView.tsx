import { useState } from 'react';
import { Search, Plus, MoreHorizontal, Phone, Mail, MapPin } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { Modal } from './Modal';

interface Cliente {
  id: string;
  nombre: string;
  empresa: string;
  telefono: string;
  email: string;
  ciudad: string;
  ultimaLlamada: string;
  totalLlamadas: number;
  estado: 'Activo' | 'Inactivo' | 'Prospecto';
}

const mockClientes: Cliente[] = [
  {
    id: '001',
    nombre: 'Juan Pérez',
    empresa: 'Tech Solutions SA',
    telefono: '+34 612 345 678',
    email: 'juan.perez@techsolutions.com',
    ciudad: 'Madrid',
    ultimaLlamada: '23 Nov 2024',
    totalLlamadas: 12,
    estado: 'Activo',
  },
  {
    id: '002',
    nombre: 'María García',
    empresa: 'Innovate Corp',
    telefono: '+34 623 456 789',
    email: 'maria.garcia@innovate.com',
    ciudad: 'Barcelona',
    ultimaLlamada: '22 Nov 2024',
    totalLlamadas: 8,
    estado: 'Activo',
  },
  {
    id: '003',
    nombre: 'Carlos Rodríguez',
    empresa: 'Digital Partners',
    telefono: '+34 634 567 890',
    email: 'carlos@digitalpartners.com',
    ciudad: 'Valencia',
    ultimaLlamada: '20 Nov 2024',
    totalLlamadas: 5,
    estado: 'Prospecto',
  },
  {
    id: '004',
    nombre: 'Ana Martínez',
    empresa: 'Global Systems',
    telefono: '+34 645 678 901',
    email: 'ana.martinez@globalsys.com',
    ciudad: 'Sevilla',
    ultimaLlamada: '15 Nov 2024',
    totalLlamadas: 3,
    estado: 'Inactivo',
  },
  {
    id: '005',
    nombre: 'Luis Fernández',
    empresa: 'Smart Business',
    telefono: '+34 656 789 012',
    email: 'luis.fernandez@smartbiz.com',
    ciudad: 'Bilbao',
    ultimaLlamada: '24 Nov 2024',
    totalLlamadas: 15,
    estado: 'Activo',
  },
];

interface ClientesViewProps {
  onClientSelect: (clienteId: string) => void;
}

export function ClientesView({ onClientSelect }: ClientesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    telefono: '',
    email: '',
    ciudad: '',
    direccion: '',
    estado: 'Prospecto' as 'Activo' | 'Inactivo' | 'Prospecto',
  });

  const filteredClientes = mockClientes.filter(cliente => {
    const matchesSearch = cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.empresa.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = !estadoFilter || cliente.estado === estadoFilter;
    return matchesSearch && matchesEstado;
  });

  return (
    <div className="flex flex-col gap-[24px] w-full">
      <Breadcrumbs items={['CRM', 'Gestión de Clientes']} />
      
      {/* Title */}
      <div className="box-border content-stretch flex flex-col items-start p-[10px] relative shrink-0">
        <div className="content-stretch flex flex-col gap-[20px] md:gap-[53px] items-start relative shrink-0 w-full">
          <div className="flex flex-col font-['Open_Sans:SemiBold',sans-serif] justify-center leading-[0] relative shrink-0 text-[#333333] text-[24px] md:text-[32px]">
            <p className="leading-[normal] whitespace-pre">Gestión de Clientes</p>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="bg-[#239ebc] h-[44px] relative rounded-[8px] shrink-0 w-full">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="box-border content-stretch flex gap-[8px] h-[44px] items-center justify-center p-[8px] relative w-full">
            <div className="flex flex-col font-['Open_Sans:SemiBold',sans-serif] grow justify-center text-[#fafbfc] text-[16px] text-center">
              <p className="leading-[normal]">Listado de Clientes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-[8px] p-[16px] md:p-[24px] flex flex-col gap-[16px] md:gap-[24px]">
        <div className="content-stretch flex flex-col md:flex-row gap-[12px] md:gap-[20px] items-stretch md:items-end relative shrink-0">
          {/* Estado Filter */}
          <div className="flex-1 content-stretch flex flex-col gap-[8px] items-start justify-center">
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
              Estado
            </p>
            <div className="h-[44px] relative rounded-[8px] w-full">
              <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                <select
                  value={estadoFilter}
                  onChange={(e) => setEstadoFilter(e.target.value)}
                  className="box-border w-full h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#999999] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
                >
                  <option value="">Todos los estados</option>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="Prospecto">Prospecto</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 content-stretch flex flex-col gap-[8px] items-start justify-center">
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
              Buscar
            </p>
            <div className="h-[44px] relative rounded-[8px] w-full">
              <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                <div className="box-border w-full h-[44px] flex items-center gap-[10px] px-[10px] border border-[#bbbfc1] rounded-[8px]">
                  <input
                    type="text"
                    placeholder="Buscar por nombre o empresa"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent font-['Open_Sans:Regular',sans-serif] text-[14px] outline-none"
                  />
                  <Search className="size-[18px]" color="#015CA8" />
                </div>
              </div>
            </div>
          </div>

          {/* New Client Button */}
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#004179] text-white px-[24px] h-[44px] rounded-[8px] flex items-center justify-center gap-[8px] font-['Open_Sans:SemiBold',sans-serif] text-[14px] hover:bg-[#003060] transition-colors whitespace-nowrap"
          >
            <Plus className="size-[18px]" />
            <span className="hidden sm:inline">Nuevo Cliente</span>
            <span className="sm:hidden">Nuevo</span>
          </button>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto -mx-[16px] md:mx-0">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-[#004179] text-white">
                <th className="px-[12px] md:px-[16px] py-[10px] md:py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[12px] md:text-[14px] rounded-tl-[8px]">
                  Id
                </th>
                <th className="px-[12px] md:px-[16px] py-[10px] md:py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[12px] md:text-[14px]">
                  Nombre
                </th>
                <th className="px-[12px] md:px-[16px] py-[10px] md:py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[12px] md:text-[14px]">
                  Empresa
                </th>
                <th className="px-[12px] md:px-[16px] py-[10px] md:py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[12px] md:text-[14px]">
                  Contacto
                </th>
                <th className="px-[12px] md:px-[16px] py-[10px] md:py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[12px] md:text-[14px]">
                  Ciudad
                </th>
                <th className="px-[12px] md:px-[16px] py-[10px] md:py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[12px] md:text-[14px]">
                  Última Llamada
                </th>
                <th className="px-[12px] md:px-[16px] py-[10px] md:py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[12px] md:text-[14px]">
                  Total Llamadas
                </th>
                <th className="px-[12px] md:px-[16px] py-[10px] md:py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[12px] md:text-[14px]">
                  Estado
                </th>
                <th className="px-[12px] md:px-[16px] py-[10px] md:py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[12px] md:text-[14px] rounded-tr-[8px]">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredClientes.map((cliente, index) => (
                <tr 
                  key={cliente.id} 
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-[#e6f0fe] cursor-pointer transition-colors`}
                  onClick={() => onClientSelect(cliente.id)}
                >
                  <td className="px-[16px] py-[12px] font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#333333]">
                    {cliente.id}
                  </td>
                  <td className="px-[16px] py-[12px] font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#333333]">
                    {cliente.nombre}
                  </td>
                  <td className="px-[16px] py-[12px] font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#333333]">
                    {cliente.empresa}
                  </td>
                  <td className="px-[16px] py-[12px]">
                    <div className="flex flex-col gap-[4px]">
                      <div className="flex items-center gap-[6px]">
                        <Phone className="size-[12px]" color="#004179" />
                        <span className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#4d545e]">
                          {cliente.telefono}
                        </span>
                      </div>
                      <div className="flex items-center gap-[6px]">
                        <Mail className="size-[12px]" color="#004179" />
                        <span className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#4d545e]">
                          {cliente.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-[16px] py-[12px]">
                    <div className="flex items-center gap-[6px]">
                      <MapPin className="size-[14px]" color="#004179" />
                      <span className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#333333]">
                        {cliente.ciudad}
                      </span>
                    </div>
                  </td>
                  <td className="px-[16px] py-[12px] font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#333333]">
                    {cliente.ultimaLlamada}
                  </td>
                  <td className="px-[16px] py-[12px] font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#004179] text-center">
                    {cliente.totalLlamadas}
                  </td>
                  <td className="px-[16px] py-[12px]">
                    <span
                      className={`px-[12px] py-[4px] rounded-[4px] font-['Open_Sans:SemiBold',sans-serif] text-[12px] ${
                        cliente.estado === 'Activo'
                          ? 'bg-[#d4edda] text-[#155724]'
                          : cliente.estado === 'Inactivo'
                          ? 'bg-[#f8d7da] text-[#721c24]'
                          : 'bg-[#fff3cd] text-[#856404]'
                      }`}
                    >
                      {cliente.estado}
                    </span>
                  </td>
                  <td className="px-[16px] py-[12px]">
                    <button className="hover:bg-[#e6f0fe] p-[8px] rounded-[4px] transition-colors">
                      <MoreHorizontal className="size-[18px]" color="#333333" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nuevo Cliente */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Añadir Nuevo Cliente"
      >
        <div className="flex flex-col gap-[20px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
                Nombre Completo
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
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
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="+34 XXX XXX XXX"
                className="h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
              />
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@empresa.com"
                className="h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
              Dirección
            </label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              placeholder="Dirección completa"
              className="h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
                Ciudad
              </label>
              <input
                type="text"
                value={formData.ciudad}
                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                placeholder="Ciudad"
                className="h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
              />
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
                Estado
              </label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
                className="h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
              >
                <option value="Prospecto">Prospecto</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-[12px] justify-end pt-[20px]">
            <button
              onClick={() => setShowModal(false)}
              className="px-[20px] py-[10px] rounded-[8px] border border-[#bbbfc1] font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#333333] hover:bg-[#f9f9f9] transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={() => {
                console.log('Nuevo cliente:', formData);
                setShowModal(false);
                setFormData({
                  nombre: '',
                  empresa: '',
                  telefono: '',
                  email: '',
                  ciudad: '',
                  direccion: '',
                  estado: 'Prospecto',
                });
              }}
              className="bg-[#004179] text-white px-[20px] py-[10px] rounded-[8px] font-['Open_Sans:SemiBold',sans-serif] text-[14px] hover:bg-[#003060] transition-colors"
            >
              Guardar Cliente
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
