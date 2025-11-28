import { useState, useEffect } from 'react';
import { Search, Send, MessageSquare, Calendar, RefreshCw, Phone, User } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { Modal } from './Modal';
import { cloudtalkAPI } from '../utils/api';

export function SMSView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    message: '',
    contact_id: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [smsData, numbersData] = await Promise.all([
        cloudtalkAPI.getSMS({ limit: 100 }),
        cloudtalkAPI.getPhoneNumbers()
      ]);
      setMessages(smsData);
      setPhoneNumbers(numbersData);
      
      // Verificar si estamos en modo demo
      const firstMessage: any = smsData[0];
      if (firstMessage && firstMessage.id && firstMessage.id.startsWith('sms_')) {
        setDemoMode(true);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendSMS = async () => {
    try {
      setSending(true);
      const result = await cloudtalkAPI.sendSMS(formData);
      
      if (result.success) {
        alert('✅ SMS enviado correctamente');
        await loadData();
        setShowModal(false);
        setFormData({
          from: '',
          to: '',
          message: '',
          contact_id: ''
        });
      } else {
        alert(`❌ Error al enviar SMS: ${result.error}`);
      }
    } catch (error) {
      console.error('Error al enviar SMS:', error);
      alert('Error al enviar SMS');
    } finally {
      setSending(false);
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.from?.includes(searchTerm) ||
                         msg.to?.includes(searchTerm);
    return matchesSearch;
  });

  const totalSMS = messages.length;
  const sentSMS = messages.filter(m => m.direction === 'outbound').length;
  const receivedSMS = messages.filter(m => m.direction === 'inbound').length;

  return (
    <div className="flex flex-col gap-[24px] w-full">
      <Breadcrumbs items={['CRM', 'SMS']} />
      
      {/* Demo Mode Banner */}
      {demoMode && (
        <div className="bg-gradient-to-r from-[#239ebc] to-[#004179] text-white p-[16px] rounded-[8px] border border-[#004179]">
          <div className="flex items-center gap-[12px]">
            <MessageSquare className="size-[20px]" />
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[14px]">
              🎭 Modo Demo: Estos son mensajes de ejemplo. Actualiza tu API Key de CloudTalk para enviar SMS reales.
            </p>
          </div>
        </div>
      )}
      
      {/* Title & Stats */}
      <div className="flex flex-col gap-[16px]">
        <div className="flex items-center justify-between">
          <h2 className="font-['Open_Sans:SemiBold',sans-serif] text-[24px] md:text-[32px] text-[#333333]">
            Mensajes SMS
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#004179] text-white px-[16px] py-[10px] rounded-[8px] font-['Open_Sans:SemiBold',sans-serif] text-[14px] hover:bg-[#003060] transition-colors flex items-center gap-[8px]"
          >
            <Send className="size-[16px]" />
            Enviar SMS
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
          <div className="bg-white rounded-[8px] border border-neutral-200 p-[16px]">
            <div className="flex items-center gap-[12px]">
              <div className="flex items-center justify-center size-[40px] rounded-full bg-[#e6f0fe]">
                <MessageSquare className="size-[20px]" color="#004179" />
              </div>
              <div>
                <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#666666]">Total SMS</p>
                <p className="font-['Open_Sans:Bold',sans-serif] text-[24px] text-[#004179]">{totalSMS}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[8px] border border-neutral-200 p-[16px]">
            <div className="flex items-center gap-[12px]">
              <div className="flex items-center justify-center size-[40px] rounded-full bg-[#d4edda]">
                <Send className="size-[20px]" color="#28a745" />
              </div>
              <div>
                <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#666666]">Enviados</p>
                <p className="font-['Open_Sans:Bold',sans-serif] text-[24px] text-[#28a745]">{sentSMS}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[8px] border border-neutral-200 p-[16px]">
            <div className="flex items-center gap-[12px]">
              <div className="flex items-center justify-center size-[40px] rounded-full bg-[#fff3cd]">
                <MessageSquare className="size-[20px]" color="#ffc107" />
              </div>
              <div>
                <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#666666]">Recibidos</p>
                <p className="font-['Open_Sans:Bold',sans-serif] text-[24px] text-[#ffc107]">{receivedSMS}</p>
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
              placeholder="Buscar por número, mensaje..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-[40px] pr-[12px] py-[10px] rounded-[8px] border border-neutral-200 font-['Open_Sans:Regular',sans-serif] text-[14px] focus:outline-none focus:border-[#004179]"
            />
          </div>
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

      {/* Messages List */}
      <div className="bg-white rounded-[8px] border border-neutral-200">
        {loading ? (
          <div className="p-[32px] text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#004179] mx-auto mb-4"></div>
            <p className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#666666]">Cargando mensajes...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-[32px] text-center">
            <MessageSquare className="size-[48px] mx-auto mb-[16px]" color="#cccccc" />
            <p className="font-['Open_Sans:SemiBold',sans-serif] text-[16px] text-[#666666] mb-[8px]">
              No hay mensajes
            </p>
            <p className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#999999]">
              Los mensajes aparecerán aquí cuando envíes o recibas SMS
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {filteredMessages.map((msg) => (
              <div key={msg.id} className="p-[16px] hover:bg-[#fafbfc] transition-colors">
                <div className="flex items-start gap-[12px]">
                  <div className={`flex items-center justify-center size-[40px] rounded-full ${
                    msg.direction === 'outbound' ? 'bg-[#d4edda]' : 'bg-[#fff3cd]'
                  }`}>
                    {msg.direction === 'outbound' ? (
                      <Send className="size-[20px]" color="#28a745" />
                    ) : (
                      <MessageSquare className="size-[20px]" color="#ffc107" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-[8px]">
                      <div className="flex items-center gap-[8px]">
                        <span className={`px-[8px] py-[2px] rounded-full text-[12px] font-['Open_Sans:SemiBold',sans-serif] ${
                          msg.direction === 'outbound' 
                            ? 'bg-[#d4edda] text-[#155724]' 
                            : 'bg-[#fff3cd] text-[#856404]'
                        }`}>
                          {msg.direction === 'outbound' ? 'Enviado' : 'Recibido'}
                        </span>
                        {msg.status === 'delivered' && (
                          <span className="text-[12px] font-['Open_Sans:Regular',sans-serif] text-[#28a745]">
                            ✓ Entregado
                          </span>
                        )}
                      </div>
                      <span className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#999999]">
                        {new Date(msg.timestamp).toLocaleString('es-ES', {
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
                        {msg.direction === 'outbound' ? `Para: ${msg.to}` : `De: ${msg.from}`}
                      </span>
                      {msg.customer_name && (
                        <>
                          <span className="text-[#999999]">•</span>
                          <span className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#666666]">
                            {msg.customer_name}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#555555]">
                      {msg.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Send SMS Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)} title="Enviar SMS">
          <div className="flex flex-col gap-[16px]">
            <div>
              <label className="block font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#333333] mb-[8px]">
                Desde (Tu número) *
              </label>
              {phoneNumbers.length > 0 ? (
                <select
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  className="w-full px-[12px] py-[10px] rounded-[8px] border border-neutral-200 font-['Open_Sans:Regular',sans-serif] text-[14px] focus:outline-none focus:border-[#004179]"
                  required
                >
                  <option value="">Selecciona un número</option>
                  {phoneNumbers.map((num) => (
                    <option key={num.id} value={num.number}>
                      {num.number} {num.assigned_to && `(${num.assigned_to})`}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="tel"
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  placeholder="+34 911 234 567"
                  className="w-full px-[12px] py-[10px] rounded-[8px] border border-neutral-200 font-['Open_Sans:Regular',sans-serif] text-[14px] focus:outline-none focus:border-[#004179]"
                  required
                />
              )}
            </div>

            <div>
              <label className="block font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#333333] mb-[8px]">
                Para (Número destino) *
              </label>
              <input
                type="tel"
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                placeholder="+34 912 345 678"
                className="w-full px-[12px] py-[10px] rounded-[8px] border border-neutral-200 font-['Open_Sans:Regular',sans-serif] text-[14px] focus:outline-none focus:border-[#004179]"
                required
              />
            </div>

            <div>
              <label className="block font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#333333] mb-[8px]">
                Mensaje *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Escribe tu mensaje..."
                rows={4}
                maxLength={160}
                className="w-full px-[12px] py-[10px] rounded-[8px] border border-neutral-200 font-['Open_Sans:Regular',sans-serif] text-[14px] focus:outline-none focus:border-[#004179] resize-none"
                required
              />
              <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#999999] mt-[4px]">
                {formData.message.length}/160 caracteres
              </p>
            </div>

            <div className="flex gap-[12px] pt-[16px]">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-[16px] py-[10px] rounded-[8px] border border-neutral-200 font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#666666] hover:bg-neutral-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendSMS}
                disabled={sending || !formData.from || !formData.to || !formData.message}
                className="flex-1 px-[16px] py-[10px] rounded-[8px] bg-[#004179] font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-white hover:bg-[#003060] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-[8px]"
              >
                {sending ? (
                  <>
                    <RefreshCw className="size-[16px] animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="size-[16px]" />
                    Enviar SMS
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
