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

  // Rutas de imágenes
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
    // CONTENEDOR PRINCIPAL: Usamos flex para dividir la pantalla en dos
    <div className="flex w-full h-screen bg-white overflow-hidden">
      
      {/* SECCIÓN IZQUIERDA (Imagen): Ocupa el 50% (w-1/2) solo en pantallas grandes */}
      <div className="hidden md:flex relative w-1/2 h-full bg-[#004179]">
        <img 
          alt="Fondo oficina" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          src={imgFondo}
          onError={(e) => e.currentTarget.style.display = 'none'} // Si falla la imagen, muestra solo el azul
        />
        {/* Capa azul encima */}
        <div className="absolute inset-0 bg-[#004179] opacity-60"></div>
        
        {/* Logo Grande Centrado en la parte azul */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
           <img 
            alt="Logo Grande" 
            className="w-[300px] object-contain"
            src={imgLogoGrande} 
          />
        </div>
      </div>

      {/* SECCIÓN DERECHA (Formulario): Ocupa el otro 50% y centra el contenido */}
      <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center p-8 overflow-y-auto">
        
        <div className="w-full max-w-[400px] flex flex-col gap-8">
          {/* Cabecera del form */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-[200px]">
              <img 
                alt="Logo CRM" 
                className="w-full object-contain"
                src={imgLogoPequeno} 
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">CRM</h1>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 text-center">
            {isSignUp ? 'Crear cuenta' : 'Inicio de sesión'}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Campos del formulario */}
            {isSignUp && (
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-sm text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ingrese su nombre"
                  className="w-full p-3 bg-sky-50 rounded-lg outline-none focus:ring-2 focus:ring-[#015ca8]"
                  required={isSignUp}
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm text-gray-700">Usuario</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingrese su usuario"
                className="w-full p-3 bg-sky-50 rounded-lg outline-none focus:ring-2 focus:ring-[#015ca8]"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm text-gray-700">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full p-3 bg-sky-50 rounded-lg outline-none focus:ring-2 focus:ring-[#015ca8]"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#015ca8] text-white rounded-lg font-bold hover:bg-[#004179] transition disabled:opacity-50"
            >
              {loading ? 'Cargando...' : (isSignUp ? 'Crear cuenta' : 'Iniciar sesión')}
            </button>
          </form>

          {/* Links inferiores */}
          <div className="flex flex-col items-center gap-4 text-sm">
            {!isSignUp && (
              <button type="button" onClick={onForgotPassword} className="text-gray-400 hover:text-[#015ca8]">
                ¿Olvidaste la contraseña?
              </button>
            )}
            <div className="flex gap-2">
              <span className="text-gray-400">
                {isSignUp ? '¿Ya tienes cuenta?' : '¿Aún no eres miembro?'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-[#015ca8] font-bold hover:underline"
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

//final
