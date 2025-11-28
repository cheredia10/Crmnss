import { Home, Users, Phone, FileText, FolderOpen, ChevronLeft, LayoutGrid, Settings, MessageSquare, Voicemail } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ currentView, onViewChange, isOpen = false, onToggle }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'clientes', icon: Users, label: 'Clientes' },
    { id: 'llamadas', icon: Phone, label: 'Llamadas' },
    { id: 'sms', icon: MessageSquare, label: 'SMS' },
    { id: 'voicemails', icon: Voicemail, label: 'Buzones' },
    { id: 'documentos', icon: FileText, label: 'Documentos' },
    { id: 'archivos', icon: FolderOpen, label: 'Seguimiento' },
    { id: 'tablero', icon: LayoutGrid, label: 'Tablero' },
    { id: 'configuracion', icon: Settings, label: 'Configuración' },
  ];

  return (
    <div className={`fixed lg:absolute bg-neutral-50 box-border content-stretch flex flex-col gap-[10px] h-full items-center pb-[24px] pt-[32px] px-[16px] rounded-br-[10px] rounded-tr-[10px] top-0 w-[100px] z-50 transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    } left-0`}>
      <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-br-[10px] rounded-tr-[10px]" />
      
      {/* Logo Area */}
      <div className="box-border content-stretch flex gap-[10px] h-[64px] items-start p-[10px] relative shrink-0 w-[170px]">
        <div className="flex items-center justify-center w-full h-full">
          <div className="flex items-center justify-center size-[48px] rounded-full" style={{ background: '#004179' }}>
            <span className="font-['Open_Sans:Bold',sans-serif] text-[20px] text-white">CRM</span>
          </div>
        </div>
      </div>

      {/* Search Button */}
      <div className="bg-[#e6f0fe] box-border content-stretch flex gap-[16px] items-center justify-center px-[16px] py-[18px] relative rounded-[10px] shrink-0 cursor-pointer">
        <svg className="size-[24px]" fill="none" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" stroke="#004179" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 21L16.65 16.65" stroke="#004179" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Menu Items */}
      <div className="content-stretch flex flex-col gap-px items-start relative shrink-0 w-[56px]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`box-border content-stretch flex gap-[16px] items-start px-[16px] py-[18px] relative shrink-0 cursor-pointer hover:bg-[#e6f0fe] rounded-[8px] transition-colors ${
                isActive ? 'bg-[#e6f0fe]' : ''
              }`}
            >
              <Icon 
                className="size-[24px]" 
                strokeWidth={2}
                color={isActive ? '#004179' : '#333333'}
              />
            </div>
          );
        })}
      </div>

      {/* Toggle Arrow */}
      <div className="absolute left-[82px] size-[36px] top-[42px] cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
        <svg className="block size-full" fill="none" viewBox="0 0 36 36">
          <circle cx="18" cy="18" fill="#004179" r="18" />
          <ChevronLeft className="absolute top-[6px] left-[6px]" size={24} color="#FAFAFA" />
        </svg>
      </div>
    </div>
  );
}
