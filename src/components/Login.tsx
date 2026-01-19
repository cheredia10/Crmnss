import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';

// Imports from Figma assets
const imgBackground = "/images/bc16a6151697106091ba6148dc7779a0c13a0ec1.png";
const imgSideLogo = "/images/25757e1cf266f3931e35c0dce4d580fa318a1eb6.png";
const imgFormLogo = "/images/25757e1cf266f3931e35c0dce4d580fa318a1eb6.png";

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Por favor complete todos los campos');
      return;
    }
    // Mock login logic - this would be replaced by Supabase auth
    toast.success('Iniciando sesión...');
    console.log('Login attempt:', { username, password });
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-[#333]">
      <Toaster position="bottom-center" />
      
      {/* Left Panel - Branding & Background */}
      {/* Hidden on mobile, visible on large screens */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center overflow-hidden bg-[#004179]">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img 
            src={imgBackground} 
            alt="Background Office" 
            className="w-full h-full object-cover"
          />
          {/* Blue Overlay: rgba(0,65,121,0.8) from Figma */}
          <div className="absolute inset-0 bg-[#004179]/80" />
        </div>

        {/* Side Logo Content */}
        <div className="relative z-10 p-12 w-full max-w-[500px] flex items-center justify-center">
          <img 
            src={imgSideLogo} 
            alt="New Stage Solutions Branding" 
            className="w-full h-auto object-contain max-w-[400px]"
          />
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12 w-full">
        <div className="w-full max-w-[400px] flex flex-col items-center gap-10">
          
          {/* Header Logos & Title */}
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
            <h1 className="text-2xl font-bold text-[#333]">Inicio de sesión</h1>

            {/* Form */}
            <form onSubmit={handleLogin} className="w-full flex flex-col gap-6">
              
              {/* Username Field */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-black pl-1">
                  Usuario
                </label>
                <div className="bg-[#f0f9ff] rounded-lg border border-transparent focus-within:border-[#015ca8] transition-colors">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ingrese su nombre de usuario"
                    className="w-full bg-transparent px-4 py-3 outline-none text-sm text-[#333] placeholder-[#bbbfc1]"
                  />
                </div>
              </div>

              {/* Password Field */}
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
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                className="mt-4 w-full bg-[#015ca8] hover:bg-[#014b8a] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-sm"
              >
                Iniciar sesión
              </button>
            </form>

            {/* Footer Actions */}
            <div className="flex flex-col items-center gap-8 w-full">
              <a 
                href="#" 
                className="text-sm text-[#bbbfc1] hover:text-[#015ca8] transition-colors font-semibold"
                onClick={(e) => { e.preventDefault(); toast.info('Funcionalidad de recuperación pendiente'); }}
              >
                ¿Olvidaste la contraseña?
              </a>
              
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span className="text-[#bbbfc1]">¿Aún no eres miembro?</span>
                <a 
                  href="#" 
                  className="text-[#004179] hover:underline"
                  onClick={(e) => { e.preventDefault(); toast.info('Registro de usuarios pendiente'); }}
                >
                  Crear cuenta
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
