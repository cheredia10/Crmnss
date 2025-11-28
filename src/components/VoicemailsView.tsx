import { useState, useEffect } from 'react';
import { Search, Voicemail, Calendar, RefreshCw, Phone, PlayCircle, CheckCircle, Archive } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { RecordingPlayer } from './RecordingPlayer';
import { cloudtalkAPI } from '../utils/api';

export function VoicemailsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'archived'>('all');
  const [voicemails, setVoicemails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentRecordingUrl, setCurrentRecordingUrl] = useState('');

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? { status: statusFilter as 'new' | 'read' | 'archived' } : undefined;
      const data = await cloudtalkAPI.getVoicemails(params);
      setVoicemails(data);
      
      // Verificar si estamos en modo demo
      const firstVM: any = data[0];
      if (firstVM && firstVM.id && firstVM.id.startsWith('vm_')) {
        setDemoMode(true);
      }
    } catch (error) {
      console.error('Error al cargar voicemails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (vmId: string) => {
    try {
      const result = await cloudtalkAPI.markVoicemailRead(vmId);
      if (result.success) {
        await loadData();
      } else {
        alert(`Error al marcar como leído: ${result.error}`);
      }
    } catch (error) {
      console.error('Error al marcar como leído:', error);
    }
  };

  const handlePlayRecording = (url: string) => {
    setCurrentRecordingUrl(url);
    setShowPlayer(true);
  };

  const filteredVoicemails = voicemails.filter(vm => {
    const matchesSearch = vm.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vm.from?.includes(searchTerm) ||
                         vm.transcription?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalVMs = voicemails.length;
  const newVMs = voicemails.filter(v => v.status === 'new').length;
  const readVMs = voicemails.filter(v => v.status === 'read').length;

  return (
    <div className="flex flex-col gap-[24px] w-full">
      <Breadcrumbs items={['CRM', 'Buzones de Voz']} />
      
      {/* Demo Mode Banner */}
      {demoMode && (
        <div className="bg-gradient-to-r from-[#239ebc] to-[#004179] text-white p-[16px] rounded-[8px] border border-[#004179]">
          <div className="flex items-center gap-[12px]">
            <Voicemail className="size-[20px]" />
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[14px]">
              🎭 Modo Demo: Estos son buzones de voz de ejemplo. Actualiza tu API Key de CloudTalk para ver buzones reales.
            </p>
          </div>
        </div>
      )}
      
      {/* Title & Stats */}
      <div className="flex flex-col gap-[16px]">
        <h2 className="font-['Open_Sans:SemiBold',sans-serif] text-[24px] md:text-[32px] text-[#333333]">
          Buzones de Voz
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
          <div className="bg-white rounded-[8px] border border-neutral-200 p-[16px]">
            <div className="flex items-center gap-[12px]">
              <div className="flex items-center justify-center size-[40px] rounded-full bg-[#e6f0fe]">
                <Voicemail className="size-[20px]" color="#004179" />
              </div>
              <div>
                <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#666666]">Total</p>
                <p className="font-['Open_Sans:Bold',sans-serif] text-[24px] text-[#004179]">{totalVMs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[8px] border border-neutral-200 p-[16px]">
            <div className="flex items-center gap-[12px]">
              <div className="flex items-center justify-center size-[40px] rounded-full bg-[#ffc107]/20">
                <Voicemail className="size-[20px]" color="#ffc107" />
              </div>
              <div>
                <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#666666]">Nuevos</p>
                <p className="font-['Open_Sans:Bold',sans-serif] text-[24px] text-[#ffc107]">{newVMs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[8px] border border-neutral-200 p-[16px]">
            <div className="flex items-center gap-[12px]">
              <div className="flex items-center justify-center size-[40px] rounded-full bg-[#d4edda]">
                <CheckCircle className="size-[20px]" color="#28a745" />
              </div>
              <div>
                <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#666666]">Leídos</p>
                <p className="font-['Open_Sans:Bold',sans-serif] text-[24px] text-[#28a745]">{readVMs}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-[8px] border border-neutral-200 p-[16px]">
        <div className="flex flex-col md:flex-row gap-[12px] items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-[12px] top-[50%] translate-y-[-50%] size-[18px]" color="#666666" />
            <input
              type="text"
              placeholder="Buscar por nombre, número, mensaje..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-[40px] pr-[12px] py-[10px] rounded-[8px] border border-neutral-200 font-['Open_Sans:Regular',sans-serif] text-[14px] focus:outline-none focus:border-[#004179]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-[12px] py-[10px] rounded-[8px] border border-neutral-200 font-['Open_Sans:Regular',sans-serif] text-[14px] focus:outline-none focus:border-[#004179]"
          >
            <option value="all">Todos los estados</option>
            <option value="new">Nuevos</option>
            <option value="read">Leídos</option>
            <option value="archived">Archivados</option>
          </select>
          <button
            onClick={loadData}
            disabled={loading}
            className="bg-[#e6f0fe] text-[#004179] px-[16px] py-[10px] rounded-[8px] font-['Open_Sans:SemiBold',sans-serif] text-[14px] hover:bg-[#d0e7f9] transition-colors flex items-center gap-[8px]"
          >
            <RefreshCw className={`size-[16px] ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Voicemails List */}
      <div className="bg-white rounded-[8px] border border-neutral-200">
        {loading ? (
          <div className="p-[32px] text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#004179] mx-auto mb-4"></div>
            <p className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#666666]">Cargando buzones de voz...</p>
          </div>
        ) : filteredVoicemails.length === 0 ? (
          <div className="p-[32px] text-center">
            <Voicemail className="size-[48px] mx-auto mb-[16px]" color="#cccccc" />
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[16px] text-[#666666] mb-[8px]">
              No hay buzones de voz
            </p>
            <p className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#999999]">
              Los buzones de voz aparecerán aquí cuando los recibas
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {filteredVoicemails.map((vm) => (
              <div key={vm.id} className="p-[16px] hover:bg-[#fafbfc] transition-colors">
                <div className="flex items-start gap-[12px]">
                  <div className={`flex items-center justify-center size-[40px] rounded-full ${
                    vm.status === 'new' ? 'bg-[#ffc107]/20' : 
                    vm.status === 'archived' ? 'bg-neutral-200' : 'bg-[#d4edda]'
                  }`}>
                    <Voicemail className="size-[20px]" color={
                      vm.status === 'new' ? '#ffc107' : 
                      vm.status === 'archived' ? '#999999' : '#28a745'
                    } />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-[8px]">
                      <div className="flex items-center gap-[8px]">
                        <span className={`px-[8px] py-[2px] rounded-full text-[12px] font-['Open_Sans:SemiBold',sans-serif] ${
                          vm.status === 'new' ? 'bg-[#ffc107]/20 text-[#856404]' :
                          vm.status === 'archived' ? 'bg-neutral-200 text-[#666666]' :
                          'bg-[#d4edda] text-[#155724]'
                        }`}>
                          {vm.status === 'new' ? 'Nuevo' : 
                           vm.status === 'archived' ? 'Archivado' : 'Leído'}
                        </span>
                        <span className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#999999]">
                          {Math.floor(vm.duration / 60)}:{(vm.duration % 60).toString().padStart(2, '0')} min
                        </span>
                      </div>
                      <span className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#999999]">
                        {new Date(vm.timestamp).toLocaleString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-[8px] mb-[8px]">
                      <Phone className="size-[14px]" color="#666666" />
                      <span className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#333333]">
                        {vm.customer_name || 'Desconocido'}
                      </span>
                      {vm.customer_company && (
                        <>
                          <span className="text-[#999999]">•</span>
                          <span className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#666666]">
                            {vm.customer_company}
                          </span>
                        </>
                      )}
                      <span className="text-[#999999]">•</span>
                      <span className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#666666]">
                        {vm.from}
                      </span>
                    </div>
                    {vm.transcription && (
                      <p className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#555555] mb-[12px] italic">
                        "{vm.transcription}"
                      </p>
                    )}
                    <div className="flex items-center gap-[8px]">
                      {vm.recording_url && (
                        <button
                          onClick={() => handlePlayRecording(vm.recording_url)}
                          className="bg-[#004179] text-white px-[12px] py-[6px] rounded-[6px] font-['Open_Sans:SemiBold',sans-serif] text-[12px] hover:bg-[#003060] transition-colors flex items-center gap-[6px]"
                        >
                          <PlayCircle className="size-[14px]" />
                          Reproducir
                        </button>
                      )}
                      {vm.status === 'new' && (
                        <button
                          onClick={() => handleMarkAsRead(vm.id)}
                          className="bg-[#e6f0fe] text-[#004179] px-[12px] py-[6px] rounded-[6px] font-['Open_Sans:SemiBold',sans-serif] text-[12px] hover:bg-[#d0e7f9] transition-colors flex items-center gap-[6px]"
                        >
                          <CheckCircle className="size-[14px]" />
                          Marcar como leído
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recording Player Modal */}
      {showPlayer && (
        <RecordingPlayer
          url={currentRecordingUrl}
          onClose={() => {
            setShowPlayer(false);
            setCurrentRecordingUrl('');
          }}
        />
      )}
    </div>
  );
}
