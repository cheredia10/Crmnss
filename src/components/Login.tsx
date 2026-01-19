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

  // Rutas de imágenes corregidas
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
    // AQUÍ ESTÁ EL ARREGLO: h-screen para ocupar toda la pantalla
    <div className="bg-white relative w-full h-screen overflow-hidden" data-name="Login">
      
      {/* 1. Imagen de fondo (Izquierda) */}
      <div className="absolute h-full left-0 top-0 w-[722px]" data-name="Fondo Izquierdo">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <img 
            alt="Fondo oficina" 
            className="absolute max-w-none object-cover size-full" 
            src={imgFondo} 
          />
          <div className="absolute bg-[rgba(0,65,121,0.8)] inset-0" />
        </div>
      </div>
      
      {/* 2. Logo Grande (Sobre el fondo azul) */}
      <div className="absolute h-[488px] left-[161px] top-[268px] w-[400px]" data-name="Logo Syntax Grande">
        <img 
          alt="Logo Grande" 
          className="absolute inset-0 object-cover pointer-events-none size-full" 
          src={imgLogoGrande} 
        />
      </div>

      {/* 3. Contenedor del formulario (Derecha) */}
      <div className="absolute flex flex-col gap-[100px] items-center left-[911px] top-[81px] w-[374px]">
        
        {/* Encabezado del Formulario */}
        <div className="flex flex-col gap-[20px] items-center w-full">
          <div className="h-[82px] w-[232px] relative">
            <img 
              alt="Logo CRM" 
              className="absolute inset-0 object-cover size-full" 
              src={imgLogoPequeno} 
            />
          </div>
          <p className="font-bold text-[#333333] text-[24px] text-center">
            CRM
          </p>
        </div>

        {/* Inputs y Botones */}
        <div className="flex flex-col gap-[40px] items-center w-full">
          <p className="font-bold text-[#333333] text-[24px] text-center w-full">
            {isSignUp ? 'Crear cuenta' : 'Inicio de sesión'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-[50px] items-center w-full">
            <div className="flex flex-col gap-[30px] w-full">
              
              {/* Nombre (Solo si es registro) */}
              {isSignUp && (
                <div className="flex flex-col gap-[8px] w-full">
                  <p className="font-semibold text-[14px] text-black">Nombre</p>
                  <div className="bg-sky-50 rounded-[8px] p-[10px]">
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ingrese su nombre"
                      className="w-full bg-transparent outline-none text-[14px]"
                      required={isSignUp}
                    />
                  </div>
                </div>
              )}

              {/* Usuario / Email */}
              <div className="flex flex-col gap-[8px] w-full">
                <p className="font-semibold text-[14px] text-black">Usuario</p>
                <div className="bg-sky-50 rounded-[8px] p-[10px]">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingrese su nombre de usuario"
                    className="w-full bg-transparent outline-none text-[14px]"
                    required
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="flex flex-col gap-[8px] w-full">
                <p className="font-semibold text-[14px] text-black">Contraseña</p>
                <div className="bg-sky-50 rounded-[8px] p-[10px]">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Introduzca su contraseña"
                    className="w-full bg-transparent outline-none text-[14px]"
                    required
                  />
                </div>
              </div>

              {/* Mensaje de Error */}
              {error && (
                <div className="w-full p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              {/* Botón Principal */}
              <button
                type="submit"
                disabled={loading}
                className="bg-[#015ca8] h-[48px] rounded-[8px] w-full text-white font-semibold hover:bg-[#004179] transition-colors disabled:opacity-50"
              >
                {loading ? 'Cargando...' : (isSignUp ? 'Crear cuenta' : 'Iniciar sesión')}
              </button>
            </div>

            {/* Enlaces de pie de página */}
            <div className="flex flex-col gap-[30px] items-center w-full">
              {!isSignUp && (
                <button type="button" onClick={onForgotPassword} className="text-[#bbbfc1] text-[14px] font-semibold hover:text-[#004179]">
                  ¿Olvidaste la contraseña?
                </button>
              )}
              <div className="flex gap-[10px] text-[14px] font-semibold">
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

          </form>
        </div>
      </div>
    </div>
  );
}