import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ClientesView } from './components/ClientesView';
import { ClienteDetailView } from './components/ClienteDetailView';
import { LlamadasView } from './components/LlamadasView';
import { DocumentosView } from './components/DocumentosView';
import { SeguimientoView } from './components/SeguimientoView';
import { TableroSeguimientoView } from './components/TableroSeguimientoView';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedClienteId, setSelectedClienteId] = useState<string | null>(null);
  const [llamadaPrefilledData, setLlamadaPrefilledData] = useState<{
    cliente: string;
    empresa: string;
    telefono: string;
  } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleClientSelect = (clienteId: string) => {
    setSelectedClienteId(clienteId);
    setCurrentView('cliente-detail');
  };

  const handleBackToClientes = () => {
    setSelectedClienteId(null);
    setCurrentView('clientes');
  };

  const handleNavigateToLlamadas = (leadData: { cliente: string; empresa: string; telefono: string }) => {
    setLlamadaPrefilledData(leadData);
    setCurrentView('llamadas');
  };

  const renderView = () => {
    if (currentView === 'cliente-detail' && selectedClienteId) {
      return <ClienteDetailView clienteId={selectedClienteId} onBack={handleBackToClientes} />;
    }

    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'clientes':
        return <ClientesView onClientSelect={handleClientSelect} />;
      case 'llamadas':
        return <LlamadasView prefilledData={llamadaPrefilledData || undefined} />;
      case 'documentos':
        return <DocumentosView />;
      case 'archivos':
        return <SeguimientoView />;
      case 'tablero':
        return <TableroSeguimientoView onNavigateToLlamadas={handleNavigateToLlamadas} />;
      default:
        return <DashboardView />;
    }
  };

  const handleViewChange = (view: string) => {
    // Limpiar datos prellenados cuando se cambia de vista
    if (view !== 'llamadas') {
      setLlamadaPrefilledData(null);
    }
    setCurrentView(view);
    // Cerrar sidebar en móvil después de seleccionar
    setIsSidebarOpen(false);
  };

  return (
    <div className="size-full bg-[#fafbfc] relative">
      {/* Overlay para móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        currentView={currentView} 
        onViewChange={handleViewChange}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      {/* Navbar */}
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      
      {/* Main Content */}
      <div className="absolute left-0 lg:left-[100px] top-[60px] md:top-[80px] right-0 bottom-0 overflow-auto">
        <div className="min-h-full p-[16px] md:p-[24px] lg:p-[32px]">
          {renderView()}
        </div>
      </div>
    </div>
  );
}
