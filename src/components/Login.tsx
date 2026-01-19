import { useState } from 'react';
import { signIn, signUp } from '../services/authService';

interface LoginProps {
  onLoginSuccess: () => void;
  onForgotPassword: () => void;
}

export function Login({ onLoginSuccess, onForgotPassword }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Imágenes
  const imgFondo = "/assets/34a2d73dc65cdd75feb21a18c485bd573552fb65.png";
  const imgLogoGrande = "/assets/bc16a6151697106091ba6148dc7779a0c13a0ec1.png";
  const imgLogoPequeno = "/assets/25757e1cf266f3931e35c0dce4d580fa318a1eb6.png";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isSignUp) {
        if (!nombre.trim()) {
          setError('Por favor ingrese su nombre');
          setLoading(false);
          return;
        }
        result = await signUp(nombre, email, password);
      } else {
        result = await signIn(email, password);
      }

      if (result.success) {
        onLoginSuccess();
      } else {
        setError(result.error || 'Error al autenticar');
      }
    } catch (err) {
      setError('Error de conexión. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen bg-white overflow-hidden font-sans">
      
      {/* IZQUIERDA: Imagen y Branding */}
      <div className="hidden md:flex relative w-1/2 h-full bg-[#004179]">
        {/* Imagen de fondo con opacidad */}
        <img 
          alt="Oficina moderna" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          src={imgFondo}
          onError={(e) => e.currentTarget.style.display = 'none'}
        />
        {/* Capa de color corporativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#004179] to-[#002a4d] opacity-90"></div>
        
        {/* Logo Grande Centrado */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-10">
           <img 
            alt="Logo Hamar" 
            className="w-[280px] drop-shadow-2xl mb-4"
            src={imgLogoGrande} 
          />
          <p className="text-white text-lg tracking-widest opacity-80 border-t border-white/30 pt-4 mt-2">
            NEW STAGE SOLUTIONS
          </p>
        </div>
      </div>

      {/* DERECHA: Formulario de Acceso */}
      <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center p-8 lg:p-16 bg-white">
        
        <div className="w-full max-w-[420px] flex flex-col gap-8">
          
          {/* Cabecera Móvil (solo visible si la pantalla es pequeña y no se ve el lado izquierdo) */}
          <div className="md:hidden flex justify-center mb-4">
             <img alt="Logo" className="w-[150px]" src={imgLogoPequeno} />
          </div>

          {/* Títulos */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {isSignUp ? 'Crear Cuenta' : 'Bienvenido de nuevo'}
            </h1>
            <p className="text-gray-500">
              {isSignUp ? 'Ingresa tus datos para registrarte' : 'Ingresa tus credenciales para acceder al CRM'}
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4">
            
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 ml-1">Nombre completo</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#015ca8] focus:ring-2 focus:ring-[#015ca8]/20 outline-none transition-all bg-white"
                  required={isSignUp}
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 ml-1">Usuario / Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@empresa.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#015ca8] focus:ring-2 focus:ring-[#015ca8]/20 outline-none transition-all bg-white"
                required
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-gray-700">Contraseña</label>
                {!isSignUp && (
                  <button type="button" onClick={onForgotPassword} className="text-xs font-semibold text-[#015ca8] hover:underline">
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#015ca8] focus:ring-2 focus:ring-[#015ca8]/20 outline-none transition-all bg-white"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3.5 bg-[#015ca8] hover:bg-[#004179] text-white rounded-lg font-bold shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Procesando...
                </span>
              ) : (isSignUp ? 'Registrarse' : 'Iniciar Sesión')}
            </button>
          </form>

          {/* Pie del formulario */}
          <div className="text-center pt-2">
            <p className="text-sm text-gray-500">
              {isSignUp ? '¿Ya tienes una cuenta?' : '¿Aún no tienes acceso?'}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="ml-1 text-[#015ca8] font-bold hover:underline transition-colors"
              >
                {isSignUp ? 'Inicia sesión aquí' : 'Solicita una cuenta'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}