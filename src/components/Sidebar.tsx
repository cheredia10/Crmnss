import {
  Home,
  Users,
  Phone,
  FileText,
  FolderOpen,
  ChevronLeft,
  LayoutGrid,
  Settings,
  MessageSquare,
  Voicemail,
} from "lucide-react";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isOpen?: boolean;       // en desktop: expanded/colapsado | en mobile: abierto/cerrado
  onToggle?: () => void;  // controla el estado en App
}

export function Sidebar({
  currentView,
  onViewChange,
  isOpen = false,
  onToggle,
}: SidebarProps) {
  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "clientes", icon: Users, label: "Clientes" },
    { id: "llamadas", icon: Phone, label: "Llamadas" },
    { id: "sms", icon: MessageSquare, label: "SMS" },
    { id: "voicemails", icon: Voicemail, label: "Buzones" },
    { id: "documentos", icon: FileText, label: "Documentos" },
    { id: "archivos", icon: FolderOpen, label: "Seguimiento" },
    { id: "tablero", icon: LayoutGrid, label: "Tablero" },
    { id: "configuracion", icon: Settings, label: "Configuración" },
  ];

  // ancho: colapsado 100, expandido 280
  const widthClass = isOpen ? "w-[280px]" : "w-[100px]";

  // mobile: entra/sale. desktop: siempre visible
  const translateClass = isOpen
    ? "translate-x-0"
    : "-translate-x-full lg:translate-x-0";

  return (
    <aside
      className={[
        "fixed lg:fixed left-0 top-0 z-50 h-screen bg-neutral-50",
        "rounded-br-[10px] rounded-tr-[10px] border border-neutral-200",
        "transition-all duration-300",
        widthClass,
        translateClass,
      ].join(" ")}
    >
      <div className="flex h-full flex-col gap-[10px] pb-[24px] pt-[32px] px-[16px]">
        {/* Logo */}
        <div className="h-[64px] w-full flex items-center justify-center">
          <div
            className="flex items-center justify-center size-[48px] rounded-full"
            style={{ background: "#004179" }}
          >
            <span className="font-['Open_Sans:Bold',sans-serif] text-[20px] text-white">
              CRM
            </span>
          </div>
        </div>

        {/* Search */}
        <div
          className={[
            "bg-[#e6f0fe] rounded-[10px] cursor-pointer",
            "flex items-center justify-center",
            "h-[60px] w-full",
          ].join(" ")}
        >
          <svg className="size-[24px]" fill="none" viewBox="0 0 24 24">
            <circle
              cx="11"
              cy="11"
              r="8"
              stroke="#004179"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 21L16.65 16.65"
              stroke="#004179"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Menu */}
        <nav className="mt-[6px] flex flex-col gap-[6px] w-full">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onViewChange(item.id)}
                className={[
                  "w-full rounded-[8px] transition-colors",
                  "flex items-center gap-[12px]",
                  isOpen ? "px-[14px] py-[14px]" : "px-[16px] py-[18px] justify-center",
                  isActive ? "bg-[#e6f0fe]" : "hover:bg-[#e6f0fe]",
                ].join(" ")}
              >
                <Icon
                  className="size-[24px]"
                  strokeWidth={2}
                  color={isActive ? "#004179" : "#333333"}
                />
                {isOpen && (
                  <span
                    className="font-['Open_Sans:SemiBold',sans-serif] text-[14px]"
                    style={{ color: isActive ? "#004179" : "#333333" }}
                  >
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Toggle */}
      <button
        type="button"
        aria-label="Toggle sidebar"
        onClick={onToggle}
        className="absolute top-[42px] -right-[18px] size-[36px]"
      >
        <div className="relative size-full">
          <svg className="block size-full" fill="none" viewBox="0 0 36 36">
            <circle cx="18" cy="18" fill="#004179" r="18" />
          </svg>

          <div
            className={[
              "absolute inset-0 flex items-center justify-center",
              "transition-transform duration-300",
              isOpen ? "rotate-180" : "rotate-0",
            ].join(" ")}
          >
            <ChevronLeft size={24} color="#FAFAFA" />
          </div>
        </div>
      </button>
    </aside>
  );
}
