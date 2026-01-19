import React, { useState } from 'react';
import { signIn, signUp } from '../services/authService';

// Definimos las rutas de tus imágenes locales
const imgBackground = "/assets/34a2d73dc65cdd75feb21a18c485bd573552fb65.png";
const imgSideLogo = "/assets/bc16a6151697106091ba6148dc7779a0c13a0ec1.png";
const imgFormLogo = "/assets/25757e1cf266f3931e35c0dce4d580fa318a1eb6.png";

interface LoginProps {
  onLoginSuccess: () => void;
  onForgotPassword: () => void;
}

export function Login({ onLoginSuccess, onForgotPassword }: LoginProps) {
  // Mantenemos la lógica de tu aplicación (estados)
  const [isSignUp, setIsSignUp] = useState(false);
  const [nombre, setNombre] = useState('');
  const [username, setUsername] = useState(''); // Usamos username como email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      // Lógica de autenticación real
      if (isSignUp) {
        if (!nombre.trim()) {
           setError('Por favor complete todos los campos');
           setLoading(false);
           return;
        }
        result = await signUp(nombre, username, password);
      } else {
        result = await signIn(username, password);
      }

      if (result.success) {
        onLoginSuccess();
      } else {
        setError(result.error || 'Error en la autenticación');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-[#333]">
      
      {/* Panel Izquierdo - Branding & Background */}
      {/* Oculto en móviles, visible en pantallas grandes */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center overflow-hidden bg-[#004179]">
        {/* Contenedor Imagen de Fondo */}
        <div className="absolute inset-0 z-0">
          <img 
            src={imgBackground} 
            alt="Background Office" 
            className="w-full h-full object-cover"
          />
          {/* Capa Azul: rgba(0,65,121,0.8) */}
          <div className="absolute inset-0 bg-[#004179]/80" />
        </div>

        {/* Logo Lateral Grande */}
        <div className="relative z-10 p-12 w-full max-w-[500px] flex items-center justify-center">
          <img 
            src={imgSideLogo} 
            alt="New Stage Solutions Branding" 
            className="w-full h-auto object-contain max-w-[400px]"
          />
        </div>
      </div>

      {/* Panel Derecho - Formulario de Login */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12 w-full">
        <div className="w-full max-w-[400px] flex flex-col items-center gap-10">
          
          {/* Header: Logo Pequeño y Título */}
          <div className="flex flex-col items-center gap-5 w-full">
            <div className="w-[232px] h-auto">
              <img 
                src={imgFormLogo} 
                alt="HamarX CRM" 
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-[#333]">CRM</h2>
          </div>

          <div className="flex flex-col items-center w-full gap-8">
            <h1 className="text-2xl font-bold text-[#333]">
              {isSignUp ? 'Crear cuenta' : 'Inicio de sesión'}
            </h1>

            {/* Formulario */}
            <form onSubmit={handleLogin} className="w-full flex flex-col gap-6">
              
              {/* Campo Nombre (Solo visible en Registro) */}
              {isSignUp && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-black pl-1">
                    Nombre
                  </label>
                  <div className="bg-[#f0f9ff] rounded-lg border border-transparent focus-within:border-[#015ca8] transition-colors">
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ingrese su nombre completo"
                      className="w-full bg-transparent px-4 py-3 outline-none text-sm text-[#333] placeholder-[#bbbfc1]"
                      required={isSignUp}
                    />
                  </div>
                </div>
              )}
              
              {/* Campo Usuario */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-black pl-1">
                  Usuario
                </label>
                <div className="bg-[#f0f9ff] rounded-lg border border-transparent focus-within:border-[#015ca8] transition-colors">
                  <input
                    type="text" // Cambiado a text para aceptar usuario o email
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ingrese su nombre de usuario"
                    className="w-full bg-transparent px-4 py-3 outline-none text-sm text-[#333] placeholder-[#bbbfc1]"
                    required
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-black pl-1">
                  Contraseña
                </label>
                <div className="bg-[#f0f9ff] rounded-lg border border-transparent focus-within:border-[#015ca8] transition-colors">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Introduzca su contraseña"
                    className="w-full bg-transparent px-4 py-3 outline-none text-sm text-[#333] placeholder-[#bbbfc1]"
                    required
                  />
                </div>
              </div>

              {/* Mensaje de Error (Visualización nativa simple) */}
              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              {/* Botón Submit */}
              <button 
                type="submit"
                disabled={loading}
                className="mt-4 w-full bg-[#015ca8] hover:bg-[#014b8a] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-sm disabled:opacity-70"
              >
                {loading ? 'Cargando...' : (isSignUp ? 'Crear cuenta' : 'Iniciar sesión')}
              </button>
            </form>

            {/* Footer Actions */}
            <div className="flex flex-col items-center gap-8 w-full">
              {!isSignUp && (
                <button 
                  type="button"
                  onClick={onForgotPassword}
                  className="text-sm text-[#bbbfc1] hover:text-[#015ca8] transition-colors font-semibold"
                >
                  ¿Olvidaste la contraseña?
                </button>
              )}
              
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span className="text-[#bbbfc1]">
                    {isSignUp ? '¿Ya tienes cuenta?' : '¿Aún no eres miembro?'}
                </span>
                <button 
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                  }}
                  className="text-[#004179] hover:underline"
                >
                  {isSignUp ? 'Iniciar sesión' : 'Crear cuenta'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}