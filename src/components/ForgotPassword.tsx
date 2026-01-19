import { useState } from 'react';
import { resetPassword } from '../services/authService';
import { ArrowLeft } from 'lucide-react';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const result = await resetPassword(email);

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Error al enviar el correo de recuperación');
      }
    } catch (err) {
      setError('Error de conexión. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white relative size-full" data-name="ForgotPassword">
      {/* Imagen de fondo */}
      <div className="absolute h-full left-0 top-0 w-[722px]" data-name="pexels-steve-28947852 1">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <img 
            alt="" 
            className="absolute max-w-none object-50%-50% object-cover size-full" 
            src="/assets/34a2d73dc65cdd75feb21a18c485bd573552fb65.png" 
          />
          <div className="absolute bg-[rgba(0,65,121,0.8)] inset-0" />
        </div>
      </div>
      
      {/* Logo grande izquierdo */}
      <div className="absolute h-[488px] left-[161px] top-[268px] w-[400px]" data-name="Logo-Syntax-Corto 1">
        <img 
            alt="" 
            className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" 
            src="/assets/bc16a6151697106091ba6148dc7779a0c13a0ec1.png" 
        />
      </div>

      {/* Contenedor del formulario */}
      <div className="absolute content-stretch flex flex-col gap-[100px] items-center left-[911px] top-[81px] w-[374px]">
        {/* Logo y título CRM */}
        <div className="content-stretch flex flex-col gap-[20px] items-center relative shrink-0 w-full">
          <div className="h-[82px] relative shrink-0 w-[232px]" data-name="Logo-Sytax 1">
            <img 
                alt="" 
                className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" 
                src="/assets/25757e1cf266f3931e35c0dce4d580fa318a1eb6.png" 
            />
          </div>
          <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] min-w-full relative shrink-0 text-[#333333] text-[24px] text-center w-[min-content]" style={{ fontVariationSettings: "'wdth' 100" }}>
            CRM
          </p>
        </div>

        {/* Formulario */}
        <div className="content-stretch flex flex-col gap-[40px] items-center relative shrink-0 w-full">
          {/* Botón Volver */}
          <button
            onClick={onBackToLogin}
            className="flex items-center gap-[8px] self-start hover:text-[#004179] transition-colors"
          >
            <ArrowLeft className="size-[20px]" strokeWidth={2} color="#004179" />
            <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold text-[14px] text-[#004179]" style={{ fontVariationSettings: "'wdth' 100" }}>
              Volver al inicio de sesión
            </p>
          </button>

          <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#333333] text-[24px] text-center w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
            Recuperar contraseña
          </p>

          {!success ? (
            <form onSubmit={handleSubmit} className="content-stretch flex flex-col gap-[50px] items-center relative shrink-0 w-full">
              <div className="content-stretch flex flex-col gap-[30px] items-start relative shrink-0 w-full">
                {/* Descripción */}
                <p className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#4d545e] text-center w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                </p>

                {/* Campo Email */}
                <div className="content-stretch flex flex-col gap-[8px] h-[80px] items-start justify-center relative shrink-0 w-full" data-name="Input-text">
                  <div className="content-stretch flex gap-[10px] h-[19px] items-center relative shrink-0 w-full" data-name="Texto">
                    <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Correo electrónico
                    </p>
                  </div>
                  <div className="basis-0 bg-sky-50 grow min-h-px min-w-px relative rounded-[8px] shrink-0 w-full">
                    <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="usuario@ejemplo.com"
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

                {/* Botón Enviar */}
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
                          {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </form>
          ) : (
            <div className="content-stretch flex flex-col gap-[30px] items-center relative shrink-0 w-full">
              {/* Mensaje de éxito */}
              <div className="w-full p-[16px] bg-green-50 border border-green-200 rounded-[8px]">
                <div className="flex flex-col gap-[12px] items-center">
                  <div className="size-[48px] rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="size-[24px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-[8px] items-center">
                    <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold text-[16px] text-green-800 text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
                      ¡Correo enviado!
                    </p>
                    <p className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-green-700 text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Hemos enviado un enlace de recuperación a <span className="font-semibold">{email}</span>. Por favor revisa tu bandeja de entrada.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botón volver al login */}
              <button
                onClick={onBackToLogin}
                className="bg-[#015ca8] h-[48px] min-w-[136px] relative rounded-[8px] shrink-0 w-full hover:bg-[#004179] transition-colors"
                data-name="Botones"
              >
                <div className="flex flex-col items-center justify-center min-w-inherit size-full">
                  <div className="box-border content-stretch flex flex-col gap-[10px] h-[48px] items-center justify-center min-w-inherit p-[10px] relative w-full">
                    <div className="box-border content-stretch flex items-center justify-center px-[6px] py-0 relative shrink-0">
                      <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                        Volver al inicio de sesión
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}