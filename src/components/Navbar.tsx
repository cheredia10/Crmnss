import { HelpCircle, Settings, Inbox, LogOut, Menu } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <div className="absolute box-border content-stretch flex gap-[16px] md:gap-[30px] items-center justify-between lg:justify-end left-0 lg:left-[97px] overflow-clip pl-[16px] md:pl-[32px] lg:pl-[48px] pr-[16px] md:pr-[32px] py-[12px] md:py-[16px] top-0 w-full">
      {/* Menu Button - Solo móvil */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-[8px] hover:bg-[#e6f0fe] rounded-[8px] transition-colors"
      >
        <Menu className="size-[24px]" strokeWidth={2} color="#2A2E34" />
      </button>

      {/* Icons Section */}
      <div className="content-stretch flex gap-[4px] md:gap-[8px] items-center relative shrink-0">
        <div className="box-border content-stretch flex gap-[16px] items-start px-[8px] md:px-[16px] py-[12px] md:py-[18px] relative shrink-0">
          <HelpCircle className="size-[20px] md:size-[24px]" strokeWidth={2} color="#2A2E34" />
        </div>
        <div className="box-border content-stretch flex gap-[16px] items-start px-[8px] md:px-[16px] py-[12px] md:py-[18px] relative shrink-0">
          <Settings className="size-[20px] md:size-[24px]" strokeWidth={2} color="#2A2E34" />
        </div>
        <div className="box-border content-stretch flex gap-[16px] items-start px-[8px] md:px-[16px] py-[12px] md:py-[18px] relative shrink-0">
          <div className="relative">
            <Inbox className="size-[20px] md:size-[24px]" strokeWidth={2} color="#2A2E34" />
            <div className="absolute -top-1 -right-1 size-[6px] md:size-[8px] rounded-full bg-[#004179]" />
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="box-border content-stretch flex gap-[8px] md:gap-[16px] items-center p-[8px] md:p-[12px] relative shrink-0">
        {/* Avatar */}
        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
          <div className="size-[36px] md:size-[48px] rounded-full flex items-center justify-center" style={{ background: '#004179' }}>
            <p className="font-['Open_Sans:Bold',sans-serif] text-[14px] md:text-[16px] text-neutral-50">
              KS
            </p>
          </div>
        </div>
        
        {/* Profile Info - Oculto en móvil */}
        <div className="content-stretch hidden md:flex flex-col font-['Open_Sans:Regular',sans-serif] gap-[4px] h-full items-start relative shrink-0">
          <p className="text-[16px] text-[#14181f]">
            Kepa Syntax
          </p>
          <p className="text-[11.11px] text-[#4d545e]">
            kepa@syntax.com
          </p>
        </div>
        
        {/* Logout Icon - Oculto en móvil pequeño */}
        <LogOut className="hidden sm:block size-[20px] md:size-[24px]" strokeWidth={2} color="#2A2E34" />
      </div>
    </div>
  );
}
