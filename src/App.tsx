import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ClientesView } from './components/ClientesView';
import { ClienteDetailView } from './components/ClienteDetailView';
import { LlamadasView } from './components/LlamadasView';
import { SMSView } from './components/SMSView';
import { VoicemailsView } from './components/VoicemailsView';
import { DocumentosView } from './components/DocumentosView';
import { SeguimientoView } from './components/SeguimientoView';
import { TableroSeguimientoView } from './components/TableroSeguimientoView';
import { CloudTalkSettings } from './components/CloudTalkSettings';
import { Login } from './components/Login';
import { ForgotPassword } from './components/ForgotPassword';
import { getSession, onAuthStateChange, type User } from './services/authService';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedClienteId, setSelectedClienteId] = useState<string | null>(null);
  const [llamadaPrefilledData, setLlamadaPrefilledData] = useState<{
    cliente: string;
    empresa: string;
    telefono: string;
  } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session.success && session.user) {
        setUser(session.user);
      }
      setLoading(false);
    };

    checkSession();

    const { data } = onAuthStateChange((newUser) => {
      setUser(newUser);
    });

    return () => {
      data?.subscription?.unsubscribe();
    };
  }, []);

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
        
    switch (currentView) {
      case 'dashboard':
          return <DashboardView userName={user?.nombre} />

      case 'clientes':
        return <ClientesView onClientSelect={handleClientSelect} />;

      case 'llamadas':
        return <LlamadasView prefilledData={llamadaPrefilledData || undefined} />;

      case 'sms':
        return <SMSView />;

      case 'voicemails':
        return <VoicemailsView />;

      case 'documentos':
        return <DocumentosView />;

      case 'archivos':
        return <SeguimientoView />;

      case 'tablero':
        return <TableroSeguimientoView onNavigateToLlamadas={handleNavigateToLlamadas} />;

      case 'configuracion':
        return <CloudTalkSettings />;

      default:
        return <DashboardView userName={user?.nombre} />;
    }
  };

  const handleViewChange = (view: string) => {
    if (view !== 'llamadas') {
      setLlamadaPrefilledData(null);
    }
    setCurrentView(view);
    setIsSidebarOpen(false);
  };

  const handleLoginSuccess = () => {
    // la sesión se actualiza por el listener
  };

  if (loading) {
    return (
      <div className="size-full bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004179] mx-auto mb-4"></div>
          <p className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#4d545e]">
            Cargando...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (showForgotPassword) {
      return <ForgotPassword onBackToLogin={() => setShowForgotPassword(false)} />;
    }

    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onForgotPassword={() => setShowForgotPassword(true)}
      />
    );
  }

  return (
    <div className="size-full bg-[#fafbfc] relative">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <Navbar
        onMenuClick={() => setIsSidebarOpen(true)}
        userName={user?.nombre}
        userEmail={user?.email}
      />

      {/* Main Content */}
      <div className="lg:ml-[100px] pt-[60px] md:pt-[80px] min-h-screen bg-[#fafbfc]">
        <div className="p-[16px] md:p-[24px] lg:p-[32px]">
          {renderView()}
        </div>
      </div>
    </div>
  );
}
