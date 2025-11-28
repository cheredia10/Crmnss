import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  items: string[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="box-border content-stretch flex gap-[8px] md:gap-[10px] min-h-[40px] items-center overflow-x-auto p-[8px] relative shrink-0">
      <div className="content-stretch flex gap-[6px] md:gap-[8px] items-center relative shrink-0">
        <Home className="size-[14px] md:size-[16px] shrink-0" color="#999999" />
        <ChevronRight className="size-[20px] md:size-[24px] shrink-0" color="#999999" />
        {items.map((item, index) => (
          <div key={index} className="content-stretch flex gap-[6px] md:gap-[8px] items-center relative shrink-0">
            <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] md:text-[14px] text-[#999999] whitespace-nowrap">
              {item}
            </p>
            {index < items.length - 1 && (
              <ChevronRight className="size-[20px] md:size-[24px] shrink-0" color="#999999" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
