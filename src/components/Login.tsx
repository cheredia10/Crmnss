import { useState } from 'react';
const imgLogoSytax1 = "/assets/bc16a6151697106091ba6148dc7779a0c13a0ec1.png";
const imgPexelsSteve289478521 = "/assets/bc16a6151697106091ba6148dc7779a0c13a0ec1.png";
const imgLogoSyntaxCorto1 = "/assets/25757e1cf266f3931e35c0dce4d580fa318a1eb6.png";

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
    <div className="bg-white relative size-full" data-name="Login">
      {/* Imagen de fondo */}
      <div className="absolute h-full left-0 top-0 w-[722px]" data-name="pexels-steve-28947852 1">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <img alt="" className="absolute max-w-none object-50%-50% object-cover size-full" src={imgPexelsSteve289478521} />
          <div className="absolute bg-[rgba(0,65,121,0.8)] inset-0" />
        </div>
      </div>
      
      {/* Logo grande izquierdo */}
      <div className="absolute h-[488px] left-[161px] top-[268px] w-[400px]" data-name="Logo-Syntax-Corto 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgLogoSyntaxCorto1} />
      </div>

      {/* Contenedor del formulario */}
      <div className="absolute content-stretch flex flex-col gap-[100px] items-center left-[911px] top-[81px] w-[374px]">
        {/* Logo y título CRM */}
        <div className="content-stretch flex flex-col gap-[20px] items-center relative shrink-0 w-full">
          <div className="h-[82px] relative shrink-0 w-[232px]" data-name="Logo-Sytax 1">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgLogoSytax1} />
          </div>
          <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] min-w-full relative shrink-0 text-[#333333] text-[24px] text-center w-[min-content]" style={{ fontVariationSettings: "'wdth' 100" }}>
            CRM
          </p>
        </div>

        {/* Formulario */}
        <div className="content-stretch flex flex-col gap-[40px] items-center relative shrink-0 w-full">
          <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#333333] text-[24px] text-center w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
            {isSignUp ? 'Crear cuenta' : 'Inicio de sesión'}
          </p>

          <form onSubmit={handleSubmit} className="content-stretch flex flex-col gap-[50px] items-center relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[30px] items-start relative shrink-0 w-full">
              {/* Campo Nombre - solo en registro */}
              {isSignUp && (
                <div className="content-stretch flex flex-col gap-[8px] h-[80px] items-start justify-center relative shrink-0 w-full" data-name="Input-text">
                  <div className="content-stretch flex gap-[10px] h-[19px] items-center relative shrink-0 w-full" data-name="Texto">
                    <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
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
                        className="box-border content-stretch flex gap-[10px] items-center p-[10px] relative size-full bg-transparent border-none outline-none font-['Open_Sans:Regular',sans-serif] font-normal leading-[normal] text-[#000] text-[14px] placeholder:text-[#bbbfc1]"
                        style={{ fontVariationSettings: "'wdth' 100" }}
                        required={isSignUp}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Campo Usuario */}
              <div className="content-stretch flex flex-col gap-[8px] h-[80px] items-start justify-center relative shrink-0 w-full" data-name="Input-text">
                <div className="content-stretch flex gap-[10px] h-[19px] items-center relative shrink-0 w-full" data-name="Texto">
                  <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
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
                      className="box-border content-stretch flex gap-[10px] items-center p-[10px] relative size-full bg-transparent border-none outline-none font-['Open_Sans:Regular',sans-serif] font-normal leading-[normal] text-[#000] text-[14px] placeholder:text-[#bbbfc1]"
                      style={{ fontVariationSettings: "'wdth' 100" }}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="content-stretch flex flex-col gap-[8px] h-[80px] items-start justify-center relative shrink-0 w-full" data-name="Input-text">
                <div className="content-stretch flex gap-[10px] h-[19px] items-center relative shrink-0 w-full" data-name="Texto">
                  <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
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
                      className="box-border content-stretch flex gap-[10px] items-center p-[10px] relative size-full bg-transparent border-none outline-none font-['Open_Sans:Regular',sans-serif] font-normal leading-[normal] text-[#000] text-[14px] placeholder:text-[#bbbfc1]"
                      style={{ fontVariationSettings: "'wdth' 100" }}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Mensaje de error */}
              {error && (
                <div className="w-full p-[12px] bg-red-50 border border-red-200 rounded-[8px]">
                  <p className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-red-600 text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
                    {error}
                  </p>
                </div>
              )}

              {/* Botón Iniciar sesión */}
              <button
                type="submit"
                disabled={loading}
                className="bg-[#015ca8] h-[48px] min-w-[136px] relative rounded-[8px] shrink-0 w-full hover:bg-[#004179] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                data-name="Botones"
              >
                <div className="flex flex-col items-center justify-center min-w-inherit size-full">
                  <div className="box-border content-stretch flex flex-col gap-[10px] h-[48px] items-center justify-center min-w-inherit p-[10px] relative w-full">
                    <div className="box-border content-stretch flex items-center justify-center px-[6px] py-0 relative shrink-0">
                      <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                        {loading ? 'Cargando...' : (isSignUp ? 'Crear cuenta' : 'Iniciar sesión')}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Enlaces inferiores */}
            <div className="content-stretch flex flex-col gap-[30px] items-center relative shrink-0 w-full">
              {!isSignUp && (
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="[white-space-collapse:collapse] block font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[0] relative shrink-0 text-[#bbbfc1] text-[0px] text-nowrap hover:text-[#004179] transition-colors"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  <p className="cursor-pointer leading-[normal] text-[14px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                    ¿Olvidaste la contraseña?
                  </p>
                </button>
              )}

              <div className="content-stretch flex gap-[10px] items-start justify-center relative shrink-0 w-full">
                <div className="content-stretch flex font-['Open_Sans:SemiBold',sans-serif] font-semibold gap-[10px] items-center leading-[normal] relative shrink-0 text-[14px] text-nowrap whitespace-pre">
                  <p className="relative shrink-0 text-[#bbbfc1]" style={{ fontVariationSettings: "'wdth' 100" }}>
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
                    className="relative shrink-0 text-[#004179] text-center hover:underline"
                    style={{ fontVariationSettings: "'wdth' 100" }}
                  >
                    {isSignUp ? 'Iniciar sesión' : 'Crear cuenta'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
