import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-t-[16px] sm:rounded-[8px] w-full max-w-[600px] max-h-[90vh] sm:max-h-[85vh] overflow-auto m-0 sm:m-[20px]">
        {/* Header */}
        <div className="sticky top-0 bg-[#239ebc] min-h-[60px] rounded-t-[16px] sm:rounded-t-[8px] flex items-center justify-between px-[16px] md:px-[24px] py-[12px]">
          <h2 className="font-['Open_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] text-[#fafbfc]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-[8px] rounded-[4px] transition-colors"
          >
            <X className="size-[20px]" color="#fafbfc" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-[16px] md:p-[24px]">
          {children}
        </div>
      </div>
    </div>
  );
}
