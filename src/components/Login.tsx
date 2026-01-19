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
    <>
      <style>{`
        .loginRoot{
          min-height:100vh;
          width:100%;
          display:flex;
          background:#fff;
          font-family: "Open Sans", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        }
        .leftPanel{
          width:722px;
          position:relative;
          overflow:hidden;
          flex:0 0 722px;
          background:#004179;
        }
        .leftPanel img{
          position:absolute;
          inset:0;
          width:100%;
          height:100%;
          object-fit:cover;
        }
        .rightPanel{
          flex:1;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:40px 24px;
        }
        .card{
          width:374px;
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:32px;
        }
        .logoBox{
          width:232px;
          height:82px;
          position:relative;
        }
        .logoBox img{
          position:absolute;
          inset:0;
          width:100%;
          height:100%;
          object-fit:contain;
        }
        .titleCRM{
          margin:0;
          font-size:24px;
          font-weight:700;
          color:#333;
          text-align:center;
        }
        .titleLogin{
          margin:0;
          font-size:24px;
          font-weight:700;
          color:#333;
          text-align:center;
        }
        form{
          width:100%;
          display:flex;
          flex-direction:column;
          gap:18px;
        }
        .field{
          width:100%;
          display:flex;
          flex-direction:column;
          gap:8px;
        }
        .label{
          font-size:14px;
          font-weight:600;
          color:#000;
        }
        .input{
          width:100%;
          box-sizing:border-box;
          padding:12px 12px;
          border-radius:8px;
          border:1px solid transparent;
          background:#f0f9ff;
          outline:none;
          font-size:14px;
          color:#000;
        }
        .input:focus{
          border-color:#015ca8;
          background:#fff;
        }
        .btn{
          width:100%;
          height:48px;
          border:none;
          border-radius:8px;
          background:#015ca8;
          color:#fff;
          font-weight:600;
          cursor:pointer;
          transition:background .15s ease;
          margin-top:6px;
        }
        .btn:hover{ background:#004179; }
        .btn:disabled{ opacity:.6; cursor:not-allowed; }
        .errorBox{
          width:100%;
          box-sizing:border-box;
          padding:12px;
          background:#FEF2F2;
          border:1px solid #FECACA;
          border-radius:8px;
          color:#DC2626;
          font-size:14px;
          text-align:center;
        }
        .links{
          width:100%;
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:14px;
          margin-top:8px;
        }
        .linkBtn{
          border:none;
          background:transparent;
          color:#bbbfc1;
          font-weight:600;
          font-size:14px;
          cursor:pointer;
        }
        .linkBtn:hover{ color:#004179; }
        .signupRow{
          display:flex;
          gap:8px;
          align-items:center;
          font-size:14px;
          font-weight:600;
        }
        .muted{ color:#bbbfc1; }
        .primary{
          border:none;
          background:transparent;
          color:#004179;
          font-weight:700;
          cursor:pointer;
        }
        .primary:hover{ text-decoration:underline; }

        /* MOBILE: ocultar panel izquierdo */
        @media (max-width: 1023px){
          .leftPanel{ display:none; }
          .card{ width:min(374px, 100%); }
        }
      `}</style>

      <div className="loginRoot">
        <div className="leftPanel" aria-hidden="true">
          <img src={imgLeftX} alt="" />
        </div>

        <div className="rightPanel">
          <div className="card">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <div className="logoBox">
                <img src={imgLogoHamar} alt="HamarX" />
              </div>
              <p className="titleCRM">CRM</p>
            </div>

            <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
              <p className="titleLogin">{isSignUp ? "Crear cuenta" : "Inicio de sesión"}</p>

              <form onSubmit={handleSubmit}>
                {isSignUp && (
                  <div className="field">
                    <div className="label">Nombre</div>
                    <input
                      className="input"
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ingrese su nombre"
                      required
                    />
                  </div>
                )}

                <div className="field">
                  <div className="label">Usuario</div>
                  <input
                    className="input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingrese su nombre de usuario"
                    required
                  />
                </div>

                <div className="field">
                  <div className="label">Contraseña</div>
                  <input
                    className="input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Introduzca su contraseña"
                    required
                  />
                </div>

                {error && <div className="errorBox">{error}</div>}

                <button className="btn" type="submit" disabled={loading}>
                  {loading ? "Cargando..." : isSignUp ? "Crear cuenta" : "Iniciar sesión"}
                </button>

                <div className="links">
                  {!isSignUp && (
                    <button type="button" className="linkBtn" onClick={onForgotPassword}>
                      ¿Olvidaste la contraseña?
                    </button>
                  )}

                  <div className="signupRow">
                    <span className="muted">{isSignUp ? "¿Ya tienes cuenta?" : "¿Aún no eres miembro?"}</span>
                    <button
                      type="button"
                      className="primary"
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError("");
                        setNombre("");
                        setEmail("");
                        setPassword("");
                      }}
                    >
                      {isSignUp ? "Iniciar sesión" : "Crear cuenta"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
