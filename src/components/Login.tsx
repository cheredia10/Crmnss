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

  // Asegúrate de que estas rutas sean las correctas en tu proyecto
  const imgFondoIzquierdo = "/assets/34a2d73dc65cdd75feb21a18c485bd573552fb65.png"; // Imagen azul con la X
  const imgLogoHamar = "/assets/25757e1cf266f3931e35c0dce4d580fa318a1eb6.png"; // Logo Hamar X (arriba derecha)

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
      
      {/* === LADO IZQUIERDO (Branding) === */}
      <div className="hidden md:flex relative w-1/2 h-full bg-[#0E3D6B] items-center justify-center">
        {/* Usamos object-cover para llenar todo el fondo azul */}
        <img 
          alt="Fondo Branding" 
          className="absolute inset-0 w-full h-full object-cover"
          src={imgFondoIzquierdo}
        />
        {/* Capa de protección por si la imagen tarda en cargar */}
        <div className="absolute inset-0 bg-[#0E3D6B] -z-10"></div>
      </div>

      {/* === LADO DERECHO (Formulario) === */}
      <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center bg-white px-8 py-12">
        
        <div className="w-full max-w-[400px]">
          
          {/* Logo Superior */}
          <div className="flex flex-col items-center mb-10">
            <img 
              alt="Hamar X Logo" 
              className="h-[60px] object-contain mb-2" // Ajusta h-[60px] según el tamaño real deseado
              src={imgLogoHamar} 
            />
            <p className="font-bold text-[#333333] text-xl tracking-wide">CRM</p>
          </div>

          {/* Título */}
          <h2 className="text-2xl font-bold text-[#333333] text-center mb-8">
            {isSignUp ? 'Crear cuenta' : 'Inicio de sesión'}
          </h2>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Campo Nombre (Solo Registro) */}
            {isSignUp && (
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-bold text-black ml-1">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ingrese su nombre completo"
                  className="w-full h-[50px] px-4 bg-[#F2F8FD] rounded-[6px] text-gray-700 placeholder-gray-400 outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  required={isSignUp}
                />
              </div>
            )}

            {/* Campo Usuario */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-bold text-black ml-1">Usuario</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingrese su nombre de usuario"
                className="w-full h-[50px] px-4 bg-[#F2F8FD] rounded-[6px] text-gray-700 placeholder-gray-400 outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            {/* Campo Contraseña */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-bold text-black ml-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Introduzca su contraseña"
                className="w-full h-[50px] px-4 bg-[#F2F8FD] rounded-[6px] text-gray-700 placeholder-gray-400 outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded text-center">
                {error}
              </div>
            )}

            {/* Botón Principal */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full h-[50px] bg-[#0C5D9E] hover:bg-[#094b80] text-white font-bold rounded-[6px] transition-colors shadow-sm disabled:opacity-70"
            >
              {loading ? 'Cargando...' : (isSignUp ? 'Crear cuenta' : 'Iniciar sesión')}
            </button>
          </form>

          {/* Links Inferiores */}
          <div className="mt-8 flex flex-col items-center gap-3 text-sm font-medium">
            {!isSignUp && (
              <button 
                type="button" 
                onClick={onForgotPassword} 
                className="text-[#bbbfc1] hover:text-[#0C5D9E] transition-colors"
              >
                ¿Olvidaste la contraseña?
              </button>
            )}
            
            <div className="flex gap-1 text-[#bbbfc1]">
              <span>{isSignUp ? '¿Ya tienes cuenta?' : '¿Aún no eres miembro?'}</span>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-[#0E3D6B] font-bold hover:underline"
              >
                {isSignUp ? 'Iniciar sesión' : 'Crear cuenta'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}