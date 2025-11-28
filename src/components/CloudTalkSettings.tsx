import { useState, useEffect } from 'react';
import { Phone, User, Settings, RefreshCw, AlertCircle, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface DiagnosticTest {
  name: string;
  passed: boolean;
  message: string;
  data?: any;
}

interface DiagnosticData {
  timestamp: string;
  apiKeyConfigured: boolean;
  apiKeyLength: number;
  apiKeyPreview: string;
  status: 'OK' | 'ERROR';
  message: string;
  tests: DiagnosticTest[];
}

export function CloudTalkSettings() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDiagnostics();
  }, []);

  const loadDiagnostics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d03ded2a/cloudtalk/diagnostics`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();
      
      if (result.success) {
        setDiagnostics(result.data);
      } else {
        setDiagnostics(result.data);
        setError(result.data?.message || 'Error al ejecutar diagnóstico');
      }
    } catch (err) {
      console.error('Error al cargar diagnóstico:', err);
      setError('No se pudo conectar con el servidor. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  const connectionStatus = diagnostics?.status === 'OK' ? 'connected' : 
                          diagnostics ? 'disconnected' : 
                          'checking';

  return (
    <div className="flex flex-col gap-[24px] w-full">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={['Dashboard', 'Configuración de CloudTalk']}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[12px]">
          <div className="flex items-center justify-center size-[40px] rounded-full bg-[#e6f0fe]">
            <Settings className="size-[20px]" color="#004179" />
          </div>
          <h2 className="font-['Open_Sans:SemiBold',sans-serif] text-[24px] text-[#333333]">
            Configuración de CloudTalk
          </h2>
        </div>
        <button
          onClick={loadDiagnostics}
          disabled={loading}
          className="bg-[#004179] text-white px-[16px] py-[8px] rounded-[8px] font-['Open_Sans:SemiBold',sans-serif] text-[14px] hover:bg-[#003060] transition-colors flex items-center gap-[8px] disabled:opacity-50"
        >
          <RefreshCw className={`size-[16px] ${loading ? 'animate-spin' : ''}`} />
          Verificar Conexión
        </button>
      </div>

      {/* Critical Alert - API Key Issue */}
      {connectionStatus === 'disconnected' && (
        <div className="bg-[#dc3545] text-white p-[20px] rounded-[8px] border-4 border-[#bd2130] shadow-lg">
          <div className="flex items-start gap-[16px]">
            <AlertCircle className="size-[32px] flex-shrink-0 mt-[4px]" />
            <div>
              <h3 className="font-['Open_Sans:Bold',sans-serif] text-[20px] mb-[8px]">
                🚨 ACCIÓN REQUERIDA: API Key Inválida
              </h3>
              <p className="font-['Open_Sans:Regular',sans-serif] text-[15px] mb-[12px] leading-relaxed">
                CloudTalk está rechazando tu API Key con <strong>error 401 Unauthorized</strong>. 
                La API Key <code className="bg-white/20 px-[6px] py-[2px] rounded font-mono">{diagnostics?.apiKeyPreview}</code> no es válida.
              </p>
              <p className="font-['Open_Sans:SemiBold',sans-serif] text-[15px] mb-[8px]">
                ⚠️ IMPORTANTE: Debes generar una NUEVA API Key desde CloudTalk ahora mismo.
              </p>
              <div className="bg-white/10 p-[12px] rounded-[6px]">
                <p className="font-['Open_Sans:Regular',sans-serif] text-[14px]">
                  <strong>Paso Rápido:</strong><br/>
                  1. Ve a <a href="https://my.cloudtalk.io/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#e6f0fe]">my.cloudtalk.io</a> → Settings → Integrations → API<br/>
                  2. Genera una nueva API Key con permisos completos<br/>
                  3. Actualízala en Supabase (CLOUDTALK_API_KEY)<br/>
                  4. Vuelve aquí y haz clic en "Verificar Conexión"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connection Status Panel */}
      <div className={`rounded-[8px] p-[20px] border-2 ${
        connectionStatus === 'connected' 
          ? 'bg-[#d4edda] border-[#28a745]' 
          : connectionStatus === 'disconnected' 
          ? 'bg-[#f8d7da] border-[#dc3545]' 
          : 'bg-[#fff3cd] border-[#ffc107]'
      }`}>
        <div className="flex items-start gap-[16px]">
          <div>
            {connectionStatus === 'connected' ? (
              <CheckCircle className="size-[32px]" color="#28a745" />
            ) : connectionStatus === 'disconnected' ? (
              <XCircle className="size-[32px]" color="#dc3545" />
            ) : (
              <AlertCircle className="size-[32px]" color="#ffc107" />
            )}
          </div>
          <div className="flex-1">
            <h3 className={`font-['Open_Sans:SemiBold',sans-serif] text-[18px] mb-[8px] ${
              connectionStatus === 'connected' 
                ? 'text-[#155724]' 
                : connectionStatus === 'disconnected' 
                ? 'text-[#721c24]' 
                : 'text-[#856404]'
            }`}>
              {connectionStatus === 'connected' 
                ? '✅ CloudTalk Conectado' 
                : connectionStatus === 'disconnected' 
                ? '❌ CloudTalk No Disponible' 
                : '⏳ Verificando conexión...'}
            </h3>
            <p className={`font-['Open_Sans:Regular',sans-serif] text-[14px] ${
              connectionStatus === 'connected' 
                ? 'text-[#155724]' 
                : connectionStatus === 'disconnected' 
                ? 'text-[#721c24]' 
                : 'text-[#856404]'
            }`}>
              {diagnostics?.message || 'Cargando información...'}
            </p>

            {/* API Key Info */}
            {diagnostics && (
              <div className="mt-[12px] p-[12px] bg-white/50 rounded-[6px]">
                <p className="font-['Open_Sans:SemiBold',sans-serif] text-[12px] text-[#333333] mb-[4px]">
                  Estado de la API Key:
                </p>
                <div className="space-y-[4px]">
                  <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#555555]">
                    • <strong>Configurada:</strong> {diagnostics.apiKeyConfigured ? 'Sí ✓' : 'No ✗'}
                  </p>
                  {diagnostics.apiKeyConfigured && (
                    <>
                      <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#555555]">
                        • <strong>Longitud:</strong> {diagnostics.apiKeyLength} caracteres
                      </p>
                      <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#555555] font-mono">
                        • <strong>Preview:</strong> {diagnostics.apiKeyPreview}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Toggle Details Button */}
            {diagnostics?.tests && diagnostics.tests.length > 0 && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="mt-[12px] flex items-center gap-[8px] text-[14px] font-['Open_Sans:SemiBold',sans-serif] text-[#004179] hover:text-[#003060] transition-colors"
              >
                {showDetails ? (
                  <>
                    <ChevronUp className="size-[16px]" />
                    Ocultar Detalles de Tests
                  </>
                ) : (
                  <>
                    <ChevronDown className="size-[16px]" />
                    Ver Detalles de Tests
                  </>
                )}
              </button>
            )}

            {/* Detailed Tests */}
            {showDetails && diagnostics?.tests && (
              <div className="mt-[12px] space-y-[8px]">
                {diagnostics.tests.map((test, index) => (
                  <div
                    key={index}
                    className={`p-[12px] rounded-[6px] ${
                      test.passed ? 'bg-[#d4edda]' : 'bg-[#f8d7da]'
                    }`}
                  >
                    <div className="flex items-center gap-[8px] mb-[4px]">
                      {test.passed ? (
                        <CheckCircle className="size-[16px]" color="#28a745" />
                      ) : (
                        <XCircle className="size-[16px]" color="#dc3545" />
                      )}
                      <h4 className={`font-['Open_Sans:SemiBold',sans-serif] text-[14px] ${
                        test.passed ? 'text-[#155724]' : 'text-[#721c24]'
                      }`}>
                        {test.name}
                      </h4>
                    </div>
                    <p className={`font-['Open_Sans:Regular',sans-serif] text-[12px] ml-[24px] ${
                      test.passed ? 'text-[#155724]' : 'text-[#721c24]'
                    }`}>
                      {test.message}
                    </p>
                    {test.data && test.data.length > 0 && (
                      <div className="ml-[24px] mt-[8px]">
                        <p className="font-['Open_Sans:SemiBold',sans-serif] text-[12px] text-[#333333] mb-[4px]">
                          Datos encontrados: {test.data.length} items
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Instructions when disconnected */}
            {connectionStatus === 'disconnected' && (
              <div className="mt-[16px] p-[16px] bg-white rounded-[8px] border border-[#dc3545]/30">
                <h4 className="font-['Open_Sans:SemiBold',sans-serif] text-[16px] text-[#dc3545] mb-[12px]">
                  ⚠️ Error 401: API Key Inválida o Expirada
                </h4>
                <p className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#555555] mb-[12px]">
                  CloudTalk está rechazando tu API Key con error <strong>401 Unauthorized</strong>. Esto significa que:
                </p>
                <ul className="list-disc list-inside space-y-[4px] font-['Open_Sans:Regular',sans-serif] text-[13px] text-[#555555] mb-[16px]">
                  <li>La API Key ha expirado</li>
                  <li>La API Key fue revocada</li>
                  <li>La API Key no tiene los permisos necesarios</li>
                  <li>Hay un error en el formato de la API Key copiada</li>
                </ul>

                <div className="p-[12px] bg-[#fff3cd] border border-[#ffc107] rounded-[6px] mb-[16px]">
                  <h5 className="font-['Open_Sans:SemiBold',sans-serif] text-[13px] text-[#856404] mb-[8px]">
                    📋 Paso 1: Obtener una nueva API Key desde CloudTalk
                  </h5>
                  <ol className="list-decimal list-inside space-y-[4px] font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#856404]">
                    <li>Inicia sesión en tu cuenta de <a href="https://my.cloudtalk.io/" target="_blank" rel="noopener noreferrer" className="text-[#004179] underline hover:text-[#003060]">CloudTalk</a></li>
                    <li>Ve a <strong>Settings</strong> (⚙️) → <strong>Integrations</strong> → <strong>API</strong></li>
                    <li>Busca la sección <strong>"Access Tokens"</strong> o <strong>"API Keys"</strong></li>
                    <li>Si existe una API Key antigua, revócala y crea una nueva</li>
                    <li>Haz clic en <strong>"Generate New Token"</strong> o <strong>"Create API Key"</strong></li>
                    <li>Asegúrate de que tenga los permisos: <strong>Read Calls</strong>, <strong>Write Calls</strong>, <strong>Read Users</strong></li>
                    <li>Copia la API Key completa (debe tener punto y comas ";" como: <code>HvX49;50WL...</code>)</li>
                  </ol>
                </div>

                <div className="p-[12px] bg-[#e6f0fe] border border-[#004179] rounded-[6px]">
                  <h5 className="font-['Open_Sans:SemiBold',sans-serif] text-[13px] text-[#004179] mb-[8px]">
                    🔧 Paso 2: Actualizar la API Key en Supabase
                  </h5>
                  <ol className="list-decimal list-inside space-y-[4px] font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#004179]">
                    <li>Ve a tu <strong>Supabase Dashboard</strong></li>
                    <li>Navega a <strong>Settings</strong> → <strong>Edge Functions</strong> → <strong>Secrets</strong></li>
                    <li>Busca la variable <code className="bg-white px-[6px] py-[2px] rounded font-mono">CLOUDTALK_API_KEY</code></li>
                    <li>Haz clic en <strong>"Edit"</strong> y pega la nueva API Key</li>
                    <li>Guarda los cambios</li>
                    <li>Espera 1-2 minutos para que se apliquen</li>
                    <li>Regresa aquí y haz clic en <strong>"Verificar Conexión"</strong></li>
                  </ol>
                </div>
                
                <div className="mt-[12px] p-[12px] bg-[#f8f9fa] rounded-[6px]">
                  <p className="font-['Open_Sans:SemiBold',sans-serif] text-[12px] text-[#333333] mb-[6px]">
                    ℹ️ Información Técnica:
                  </p>
                  <div className="space-y-[4px] text-[12px]">
                    <p className="font-['Open_Sans:Regular',sans-serif] text-[#555555]">
                      <strong>API Base:</strong> <code className="bg-white px-[4px] py-[2px] rounded font-mono">https://api.cloudtalk.io/api</code>
                    </p>
                    <p className="font-['Open_Sans:Regular',sans-serif] text-[#555555]">
                      <strong>Método Auth:</strong> Query parameter <code className="bg-white px-[4px] py-[2px] rounded font-mono">?access_token=xxx</code>
                    </p>
                    <p className="font-['Open_Sans:Regular',sans-serif] text-[#555555]">
                      <strong>Docs:</strong> <a href="https://www.cloudtalk.io/api-documentation" target="_blank" rel="noopener noreferrer" className="text-[#004179] underline hover:text-[#003060]">cloudtalk.io/api-documentation</a>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Agents Section (only show when connected) */}
      {connectionStatus === 'connected' && diagnostics?.tests && (
        <div className="bg-white rounded-[8px] border border-neutral-200 p-[20px]">
          <div className="flex items-center gap-[12px] mb-[16px]">
            <User className="size-[24px]" color="#004179" />
            <h3 className="font-['Open_Sans:SemiBold',sans-serif] text-[18px] text-[#333333]">
              Agentes de CloudTalk
            </h3>
          </div>

          {diagnostics.tests.find(t => t.name === 'Conexión a API de Agentes')?.data?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[12px]">
              {diagnostics.tests
                .find(t => t.name === 'Conexión a API de Agentes')
                ?.data?.map((agent: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-[12px] p-[12px] bg-[#e6f0fe] rounded-[8px]"
                  >
                    <div className="flex items-center justify-center size-[40px] rounded-full bg-[#004179]">
                      <User className="size-[20px]" color="white" />
                    </div>
                    <div>
                      <p className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#333333]">
                        {agent.name || agent.email || 'Agente'}
                      </p>
                      <p className="font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#666666]">
                        {agent.status || 'Disponible'}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#666666]">
              No se encontraron agentes configurados.
            </p>
          )}
        </div>
      )}

      {/* Additional Info */}
      <div className="bg-[#e6f0fe] rounded-[8px] p-[16px] border border-[#004179]/20">
        <div className="flex items-start gap-[12px]">
          <AlertCircle className="size-[20px] shrink-0 mt-[2px]" color="#004179" />
          <div>
            <h4 className="font-['Open_Sans:SemiBold',sans-serif] text-[14px] text-[#004179] mb-[8px]">
              Importante
            </h4>
            <ul className="list-disc list-inside space-y-[4px] font-['Open_Sans:Regular',sans-serif] text-[13px] text-[#555555]">
              <li>El CRM funciona completamente sin CloudTalk</li>
              <li>CloudTalk es opcional y añade funcionalidades extra como click-to-call y grabaciones</li>
              <li>Si tienes problemas, verifica que tu API Key de CloudTalk tenga permisos adecuados</li>
              <li>Los logs detallados del servidor están disponibles en Supabase Dashboard → Edge Functions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
