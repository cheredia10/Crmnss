import { useState, useEffect, useRef } from 'react';
import { Search, FileText, Download, Upload, Eye, Trash2, Plus, Filter, Loader2 } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { Modal } from './Modal';
import { documentosAPI, type Documento, type DocumentoUpload } from '../utils/api';

export function DocumentosView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<DocumentoUpload>({
    nombre: '',
    tipo: 'Contrato',
    cliente: '',
    empresa: '',
    estado: 'Vigente',
    categoria: '',
  });

  useEffect(() => {
    loadDocumentos();
  }, []);

  const loadDocumentos = async () => {
    try {
      setLoading(true);
      const data = await documentosAPI.getAll();
      setDocumentos(data);
    } catch (error) {
      console.error('Error al cargar documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño (10MB máximo)
      if (file.size > 10485760) {
        alert('El archivo es demasiado grande. Tamaño máximo: 10MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Autocompletar el nombre si está vacío
      if (!formData.nombre) {
        setFormData({ ...formData, nombre: file.name });
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Por favor seleccione un archivo');
      return;
    }

    if (!formData.nombre || !formData.cliente || !formData.empresa || !formData.categoria) {
      alert('Por favor complete todos los campos');
      return;
    }

    try {
      setUploading(true);
      await documentosAPI.upload(selectedFile, formData);
      
      // Recargar documentos
      await loadDocumentos();
      
      // Cerrar modal y limpiar formulario
      setShowModal(false);
      setFormData({
        nombre: '',
        tipo: 'Contrato',
        cliente: '',
        empresa: '',
        estado: 'Vigente',
        categoria: '',
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error al subir documento:', error);
      alert('Error al subir el documento. Por favor intente de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (id: string, nombre: string) => {
    try {
      const { url } = await documentosAPI.download(id);
      
      // Abrir en nueva pestaña para descargar
      const link = document.createElement('a');
      link.href = url;
      link.download = nombre;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al descargar documento:', error);
      alert('Error al descargar el documento. Por favor intente de nuevo.');
    }
  };

  const handleView = async (id: string) => {
    try {
      const { url } = await documentosAPI.download(id);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error al ver documento:', error);
      alert('Error al abrir el documento. Por favor intente de nuevo.');
    }
  };

  const handleDelete = async (id: string, nombre: string) => {
    if (!confirm(`¿Está seguro de eliminar el documento "${nombre}"?`)) {
      return;
    }

    try {
      await documentosAPI.delete(id);
      await loadDocumentos();
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      alert('Error al eliminar el documento. Por favor intente de nuevo.');
    }
  };

  const filteredDocumentos = documentos.filter(doc => {
    const matchesSearch = doc.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.empresa.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = !tipoFilter || doc.tipo === tipoFilter;
    const matchesEstado = !estadoFilter || doc.estado === estadoFilter;
    return matchesSearch && matchesTipo && matchesEstado;
  });

  // Estadísticas
  const totalDocumentos = documentos.length;
  const documentosVigentes = documentos.filter(d => d.estado === 'Vigente').length;
  const documentosPendientes = documentos.filter(d => d.estado === 'Pendiente').length;
  const documentosObsoletos = documentos.filter(d => d.estado === 'Obsoleto').length;

  return (
    <div className="flex flex-col gap-[24px] w-full">
      <Breadcrumbs items={['CRM', 'Gestión Documental']} />
      
      {/* Title */}
      <div className="box-border content-stretch flex flex-col items-start p-[10px] relative shrink-0">
        <div className="content-stretch flex flex-col gap-[20px] md:gap-[53px] items-start relative shrink-0 w-full">
          <div className="flex flex-col font-['Open_Sans:SemiBold',sans-serif] justify-center leading-[0] relative shrink-0 text-[#333333] text-[24px] md:text-[32px]">
            <p className="leading-[normal] whitespace-pre">Gestión Documental</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
        <div className="bg-white rounded-[8px] p-[20px] flex flex-col gap-[12px] border border-[#bbbfc1]">
          <div className="flex items-center justify-center size-[40px] rounded-full bg-[#e6f0fe]">
            <FileText className="size-[20px]" color="#004179" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#999999]">
              Total Documentos
            </p>
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[24px] text-[#333333]">
              {loading ? '...' : totalDocumentos}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[8px] p-[20px] flex flex-col gap-[12px] border border-[#bbbfc1]">
          <div className="flex items-center justify-center size-[40px] rounded-full bg-[#d4edda]">
            <FileText className="size-[20px]" color="#155724" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#999999]">
              Vigentes
            </p>
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[24px] text-[#333333]">
              {loading ? '...' : documentosVigentes}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[8px] p-[20px] flex flex-col gap-[12px] border border-[#bbbfc1]">
          <div className="flex items-center justify-center size-[40px] rounded-full bg-[#fff3cd]">
            <FileText className="size-[20px]" color="#856404" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#999999]">
              Pendientes
            </p>
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[24px] text-[#333333]">
              {loading ? '...' : documentosPendientes}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[8px] p-[20px] flex flex-col gap-[12px] border border-[#bbbfc1]">
          <div className="flex items-center justify-center size-[40px] rounded-full bg-[#f8d7da]">
            <FileText className="size-[20px]" color="#721c24" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#999999]">
              Obsoletos
            </p>
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[24px] text-[#333333]">
              {loading ? '...' : documentosObsoletos}
            </p>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="bg-[#239ebc] h-[44px] relative rounded-[8px] shrink-0 w-full">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="box-border content-stretch flex gap-[8px] h-[44px] items-center justify-center p-[8px] relative w-full">
            <div className="flex flex-col font-['Open_Sans:SemiBold',sans-serif] grow justify-center text-[#fafbfc] text-[16px] text-center">
              <p className="leading-[normal]">Información Documentaria</p>
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
              Tipo
            </p>
            <div className="h-[44px] relative rounded-[8px] w-full">
              <select
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value)}
                className="box-border w-full h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#999999] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
              >
                <option value="">Seleccione tipo</option>
                <option value="Contrato">Contrato</option>
                <option value="Propuesta">Propuesta</option>
                <option value="Factura">Factura</option>
                <option value="Presentación">Presentación</option>
                <option value="Informe">Informe</option>
              </select>
            </div>
          </div>

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
                <option value="">Seleccione un estado</option>
                <option value="Vigente">Vigente</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Obsoleto">Obsoleto</option>
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
                  placeholder="Escriba el nombre del recurso"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent font-['Open_Sans:Regular',sans-serif] text-[14px] outline-none"
                />
                <Search className="size-[18px]" color="#015CA8" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-[12px] lg:shrink-0">
            <button 
              onClick={() => setShowModal(true)}
              className="bg-[#004179] text-white px-[24px] h-[44px] rounded-[8px] flex items-center justify-center gap-[8px] font-['Open_Sans:SemiBold',sans-serif] text-[14px] hover:bg-[#003060] transition-colors w-full lg:w-auto whitespace-nowrap"
            >
              <Upload className="size-[18px]" />
              Subir Documento
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto -mx-[16px] md:mx-0">
          {loading ? (
            <div className="flex items-center justify-center py-[40px]">
              <Loader2 className="size-[40px] animate-spin" color="#004179" />
            </div>
          ) : filteredDocumentos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[40px] gap-[12px]">
              <FileText className="size-[48px]" color="#999999" />
              <p className="font-['Open_Sans:Regular',sans-serif] text-[16px] text-[#999999]">
                No hay documentos disponibles
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-[#004179] text-white">
                  <th className="px-[16px] py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[14px] rounded-tl-[8px]">
                    ID
                  </th>
                  <th className="px-[16px] py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[14px]">
                    Nombre del Documento
                  </th>
                  <th className="px-[16px] py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[14px]">
                    Tipo
                  </th>
                  <th className="px-[16px] py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[14px]">
                    Cliente
                  </th>
                  <th className="px-[16px] py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[14px]">
                    Empresa
                  </th>
                  <th className="px-[16px] py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[14px]">
                    Fecha Creación
                  </th>
                  <th className="px-[16px] py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[14px]">
                    Tamaño
                  </th>
                  <th className="px-[16px] py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[14px]">
                    Estado
                  </th>
                  <th className="px-[16px] py-[12px] text-left font-['Open_Sans:SemiBold',sans-serif] text-[14px] rounded-tr-[8px]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDocumentos.map((doc, index) => (
                  <tr 
                    key={doc.id} 
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-[#e6f0fe] transition-colors`}
                  >
                    <td className="px-[16px] py-[12px] font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#333333]">
                      {doc.id.substring(0, 8)}...
                    </td>
                    <td className="px-[16px] py-[12px]">
                      <div className="flex items-center gap-[8px]">
                        <FileText className="size-[16px]" color="#004179" />
                        <span className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#333333]">
                          {doc.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="px-[16px] py-[12px]">
                      <span className="px-[12px] py-[4px] rounded-[4px] font-['Open_Sans:SemiBold',sans-serif] text-[12px] bg-[#e6f0fe] text-[#004179]">
                        {doc.tipo}
                      </span>
                    </td>
                    <td className="px-[16px] py-[12px] font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#333333]">
                      {doc.cliente}
                    </td>
                    <td className="px-[16px] py-[12px] font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#333333]">
                      {doc.empresa}
                    </td>
                    <td className="px-[16px] py-[12px] font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#333333]">
                      {doc.fechaCreacion}
                    </td>
                    <td className="px-[16px] py-[12px] font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#4d545e]">
                      {doc.tamaño}
                    </td>
                    <td className="px-[16px] py-[12px]">
                      <span
                        className={`px-[12px] py-[4px] rounded-[4px] font-['Open_Sans:SemiBold',sans-serif] text-[12px] ${
                          doc.estado === 'Vigente'
                            ? 'bg-[#d4edda] text-[#155724]'
                            : doc.estado === 'Obsoleto'
                            ? 'bg-[#f8d7da] text-[#721c24]'
                            : 'bg-[#fff3cd] text-[#856404]'
                        }`}
                      >
                        {doc.estado}
                      </span>
                    </td>
                    <td className="px-[16px] py-[12px]">
                      <div className="flex items-center gap-[8px]">
                        <button 
                          onClick={() => handleView(doc.id)}
                          className="hover:bg-[#e6f0fe] p-[6px] rounded-[4px] transition-colors"
                          title="Ver documento"
                        >
                          <Eye className="size-[16px]" color="#004179" />
                        </button>
                        <button 
                          onClick={() => handleDownload(doc.id, doc.nombre)}
                          className="hover:bg-[#e6f0fe] p-[6px] rounded-[4px] transition-colors"
                          title="Descargar documento"
                        >
                          <Download className="size-[16px]" color="#004179" />
                        </button>
                        <button 
                          onClick={() => handleDelete(doc.id, doc.nombre)}
                          className="hover:bg-[#f8d7da] p-[6px] rounded-[4px] transition-colors"
                          title="Eliminar documento"
                        >
                          <Trash2 className="size-[16px]" color="#721c24" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Subir Documento */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
        title="Subir Nuevo Documento"
      >
        <div className="flex flex-col gap-[20px]">
          <div className="flex flex-col gap-[8px]">
            <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
              Nombre del Documento
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Nombre del documento"
              className="h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
                Tipo de Documento
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
              >
                <option value="Contrato">Contrato</option>
                <option value="Propuesta">Propuesta</option>
                <option value="Factura">Factura</option>
                <option value="Presentación">Presentación</option>
                <option value="Informe">Informe</option>
              </select>
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
                Estado
              </label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
              >
                <option value="Vigente">Vigente</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Obsoleto">Obsoleto</option>
              </select>
            </div>
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

          <div className="flex flex-col gap-[8px]">
            <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
              Categoría
            </label>
            <input
              type="text"
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              placeholder="ej: Legal, Comercial, Finanzas"
              className="h-[44px] px-[10px] bg-white font-['Open_Sans:Regular',sans-serif] text-[14px] rounded-[8px] border border-[#bbbfc1] outline-none focus:border-[#015CA8]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-black">
              Archivo
            </label>
            <input 
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              className="hidden"
              id="file-upload"
            />
            <label 
              htmlFor="file-upload"
              className="h-[100px] border-2 border-dashed border-[#bbbfc1] rounded-[8px] flex flex-col items-center justify-center gap-[8px] cursor-pointer hover:border-[#015CA8] transition-colors"
            >
              <Upload className="size-[24px]" color="#999999" />
              {selectedFile ? (
                <>
                  <p className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#004179]">
                    {selectedFile.name}
                  </p>
                  <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#999999]">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <>
                  <p className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#999999]">
                    Click para seleccionar archivo
                  </p>
                  <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#999999]">
                    PDF, DOC, DOCX, XLS, XLSX (Máx. 10MB)
                  </p>
                </>
              )}
            </label>
          </div>

          <div className="flex gap-[12px] justify-end pt-[20px]">
            <button
              onClick={() => {
                setShowModal(false);
                setSelectedFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              disabled={uploading}
              className="px-[20px] py-[10px] rounded-[8px] border border-[#bbbfc1] font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#333333] hover:bg-[#f9f9f9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button 
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
              className="bg-[#004179] text-white px-[20px] py-[10px] rounded-[8px] font-['Open_Sans:SemiBold',sans-serif] text-[14px] hover:bg-[#003060] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-[8px]"
            >
              {uploading ? (
                <>
                  <Loader2 className="size-[16px] animate-spin" />
                  Subiendo...
                </>
              ) : (
                'Subir Documento'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
