import { useState } from 'react';
import { signIn, signUp } from '../services/authService';

// ✅ SOLO 2 IMÁGENES (en /public/assets/)
const imgLogoHamar = "/assets/25757e1cf266f3931e35c0dce4d580fa318a1eb6.png";
const imgLeftX = "/assets/bc16a6151697106091ba6148dc7779a0c13a0ec1.png";

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

      if (result.success) onLoginSuccess();
      else setError(result.error || 'Error al autenticar');
    } catch {
      setError('Error de conexión. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white relative size-full" data-name="Login">
      {/* PANEL IZQUIERDO: imagen X full height */}
      <div className="absolute inset-y-0 left-0 w-[722px] overflow-hidden" aria-hidden="true">
        <img
          alt=""
          src={imgLeftX}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* CONTENEDOR DEL FORMULARIO (derecha) */}
      <div className="absolute content-stretch flex flex-col gap-[100px] items-center left-[911px] top-[81px] w-[374px]">
        {/* Logo y título CRM */}
        <div className="content-stretch flex flex-col gap-[20px] items-center relative shrink-0 w-full">
          <div className="h-[82px] relative shrink-0 w-[232px]">
            <img
              alt="HamarX"
              className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
              src={imgLogoHamar}
            />
          </div>
          <p
            className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] min-w-full relative shrink-0 text-[#333333] text-[24px] text-center w-[min-content]"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            CRM
          </p>
        </div>

        {/* Formulario */}
        <div className="content-stretch flex flex-col gap-[40px] items-center relative shrink-0 w-full">
          <p
            className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#333333] text-[24px] text-center w-full"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            {isSignUp ? 'Crear cuenta' : 'Inicio de sesión'}
          </p>

          <form onSubmit={handleSubmit} className="content-stretch flex flex-col gap-[50px] items-center relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[30px] items-start relative shrink-0 w-full">
              {/* Nombre (solo registro) */}
              {isSignUp && (
                <div className="content-stretch flex flex-col gap-[8px] h-[80px] items-start justify-center relative shrink-0 w-full">
                  <div className="content-stretch flex gap-[10px] h-[19px] items-center relative shrink-0 w-full">
                    <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-black">
                      Nombre
                    </p>
                  </div>
                  <div className="basis-0 bg-sky-50 grow min-h-px min-w-px relative rounded-[8px] shrink-0 w-full">
                    <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ingrese su nombre"
                        className="box-border content-stretch flex gap-[10px] items-center p-[10px] relative size-full bg-transparent border-none outline-none font-['Open_Sans:Regular',sans-serif] text-[#000] text-[14px] placeholder:text-[#bbbfc1]"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Usuario */}
              <div className="content-stretch flex flex-col gap-[8px] h-[80px] items-start justify-center relative shrink-0 w-full">
                <div className="content-stretch flex gap-[10px] h-[19px] items-center relative shrink-0 w-full">
                  <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-black">
                    Usuario
                  </p>
                </div>
                <div className="basis-0 bg-sky-50 grow min-h-px min-w-px relative rounded-[8px] shrink-0 w-full">
                  <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ingrese su nombre de usuario"
                      className="box-border content-stretch flex gap-[10px] items-center p-[10px] relative size-full bg-transparent border-none outline-none font-['Open_Sans:Regular',sans-serif] text-[#000] text-[14px] placeholder:text-[#bbbfc1]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contraseña */}
              <div className="content-stretch flex flex-col gap-[8px] h-[80px] items-start justify-center relative shrink-0 w-full">
                <div className="content-stretch flex gap-[10px] h-[19px] items-center relative shrink-0 w-full">
                  <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-black">
                    Contraseña
                  </p>
                </div>
                <div className="basis-0 bg-sky-50 grow min-h-px min-w-px relative rounded-[8px] shrink-0 w-full">
                  <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Introduzca su contraseña"
                      className="box-border content-stretch flex gap-[10px] items-center p-[10px] relative size-full bg-transparent border-none outline-none font-['Open_Sans:Regular',sans-serif] text-[#000] text-[14px] placeholder:text-[#bbbfc1]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="w-full p-[12px] bg-red-50 border border-red-200 rounded-[8px]">
                  <p className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-red-600 text-center">
                    {error}
                  </p>
                </div>
              )}

              {/* Botón */}
              <button
                type="submit"
                disabled={loading}
                className="bg-[#015ca8] h-[48px] min-w-[136px] relative rounded-[8px] shrink-0 w-full hover:bg-[#004179] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex flex-col items-center justify-center min-w-inherit size-full">
                  <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold text-[14px] text-white">
                    {loading ? 'Cargando...' : (isSignUp ? 'Crear cuenta' : 'Iniciar sesión')}
                  </p>
                </div>
              </button>
            </div>

            {/* Links */}
            <div className="content-stretch flex flex-col gap-[30px] items-center relative shrink-0 w-full">
              {!isSignUp && (
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="font-['Open_Sans:SemiBold',sans-serif] font-semibold text-[#bbbfc1] text-[14px] hover:text-[#004179] transition-colors"
                >
                  ¿Olvidaste la contraseña?
                </button>
              )}

              <div className="content-stretch flex gap-[10px] items-start justify-center relative shrink-0 w-full">
                <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold text-[14px] text-[#bbbfc1]">
                  {isSignUp ? '¿Ya tienes cuenta?' : '¿Aún no eres miembro?'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                    setNombre('');
                    setEmail('');
                    setPassword('');
                  }}
                  className="font-['Open_Sans:SemiBold',sans-serif] font-semibold text-[14px] text-[#004179] hover:underline"
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
