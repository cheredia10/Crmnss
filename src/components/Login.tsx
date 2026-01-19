import { useState } from "react";
import { signIn, signUp } from "../services/authService";

const imgLogoHamar = "/assets/25757e1cf266f3931e35c0dce4d580fa318a1eb6.png";
const imgLeftX = "/assets/bc16a6151697106091ba6148dc7779a0c13a0ec1.png";

interface LoginProps {
  onLoginSuccess: () => void;
  onForgotPassword: () => void;
}

export function Login({ onLoginSuccess, onForgotPassword }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;

      if (isSignUp) {
        if (!nombre.trim()) {
          setError("Por favor ingrese su nombre");
          setLoading(false);
          return;
        }
        result = await signUp(nombre, email, password);
      } else {
        result = await signIn(email, password);
      }

      if (result.success) onLoginSuccess();
      else setError(result.error || "Error al autenticar");
    } catch {
      setError("Error de conexión. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex">
      {/* IZQUIERDA: imagen full height */}
      <div className="hidden lg:block lg:w-[722px] relative">
        <img
          src={imgLeftX}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* DERECHA: formulario centrado */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[374px] flex flex-col items-center gap-10">
          {/* Logo + CRM */}
          <div className="flex flex-col items-center gap-5 w-full">
            <div className="w-[232px] h-[82px] relative">
              <img
                src={imgLogoHamar}
                alt="HamarX"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
            <p className="font-['Open_Sans:Bold',sans-serif] font-bold text-[#333] text-[24px] text-center">
              CRM
            </p>
          </div>

          {/* Título + form */}
          <div className="w-full flex flex-col items-center gap-8">
            <p className="font-['Open_Sans:Bold',sans-serif] font-bold text-[#333] text-[24px] text-center w-full">
              {isSignUp ? "Crear cuenta" : "Inicio de sesión"}
            </p>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
              {/* Nombre */}
              {isSignUp && (
                <div className="flex flex-col gap-2">
                  <label className="font-['Open_Sans:SemiBold',sans-serif] font-semibold text-[14px] text-black">
                    Nombre
                  </label>
                  <div className="bg-sky-50 rounded-[8px]">
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ingrese su nombre"
                      className="w-full bg-transparent p-[10px] outline-none text-[14px] placeholder:text-[#bbbfc1]"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Usuario */}
              <div className="flex flex-col gap-2">
                <label className="font-['Open_Sans:SemiBold',sans-serif] font-semibold text-[14px] text-black">
                  Usuario
                </label>
                <div className="bg-sky-50 rounded-[8px]">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingrese su nombre de usuario"
                    className="w-full bg-transparent p-[10px] outline-none text-[14px] placeholder:text-[#bbbfc1]"
                    required
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="flex flex-col gap-2">
                <label className="font-['Open_Sans:SemiBold',sans-serif] font-semibold text-[14px] text-black">
                  Contraseña
                </label>
                <div className="bg-sky-50 rounded-[8px]">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Introduzca su contraseña"
                    className="w-full bg-transparent p-[10px] outline-none text-[14px] placeholder:text-[#bbbfc1]"
                    required
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="w-full p-[12px] bg-red-50 border border-red-200 rounded-[8px]">
                  <p className="text-[14px] text-red-600 text-center">{error}</p>
                </div>
              )}

              {/* Botón */}
              <button
                type="submit"
                disabled={loading}
                className="bg-[#015ca8] h-[48px] rounded-[8px] w-full hover:bg-[#004179] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-[14px]"
              >
                {loading ? "Cargando..." : isSignUp ? "Crear cuenta" : "Iniciar sesión"}
              </button>
            </form>

            {/* Links */}
            <div className="w-full flex flex-col items-center gap-6">
              {!isSignUp && (
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-[#bbbfc1] text-[14px] font-semibold hover:text-[#004179] transition-colors"
                >
                  ¿Olvidaste la contraseña?
                </button>
              )}

              <div className="flex items-center gap-2 text-[14px] font-semibold">
                <span className="text-[#bbbfc1]">
                  {isSignUp ? "¿Ya tienes cuenta?" : "¿Aún no eres miembro?"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError("");
                    setNombre("");
                    setEmail("");
                    setPassword("");
                  }}
                  className="text-[#004179] hover:underline"
                >
                  {isSignUp ? "Iniciar sesión" : "Crear cuenta"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
