import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { CloudTalkService } from "./cloudtalk.tsx";
import { CloudTalkMockService } from "./cloudtalk-mock.tsx";
const app = new Hono();

// Variable global para modo demo
let DEMO_MODE = false;

// Helper para obtener el servicio de CloudTalk (real o mock)
function getCloudTalkService(apiKey: string | undefined) {
  if (DEMO_MODE || !apiKey) {
    console.log('🎭 Usando CloudTalk MODO DEMO (Mock Service)');
    return { service: new CloudTalkMockService(), isDemo: true };
  }
  console.log('📞 Usando CloudTalk MODO REAL (API Service)');
  return { service: new CloudTalkService(apiKey), isDemo: false };
}

// Helper para manejar respuesta con fallback automático a mock
async function callCloudTalkWithFallback(
  apiKey: string | undefined,
  method: string,
  ...args: any[]
): Promise<any> {
  const { service, isDemo } = getCloudTalkService(apiKey);
  
  // @ts-ignore - dynamic method call
  const result = await service[method](...args);
  
  // Si falla con 401 y no estamos en demo, activar modo demo automáticamente
  if (!result.success && result.error?.includes('401') && !isDemo && !DEMO_MODE) {
    console.log('⚠️ API Key inválida detectada. Activando MODO DEMO automáticamente...');
    DEMO_MODE = true;
    const mockService = new CloudTalkMockService();
    // @ts-ignore - dynamic method call
    return await mockService[method](...args);
  }
  
  return result;
}

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-d03ded2a/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== CLIENTES ====================

// Obtener todos los clientes
app.get("/make-server-d03ded2a/clientes", async (c) => {
  try {
    const clientes = await kv.getByPrefix("cliente:");
    return c.json({ success: true, data: clientes });
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Obtener un cliente por ID
app.get("/make-server-d03ded2a/clientes/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const cliente = await kv.get(`cliente:${id}`);
    
    if (!cliente) {
      return c.json({ success: false, error: "Cliente no encontrado" }, 404);
    }
    
    return c.json({ success: true, data: cliente });
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Crear un nuevo cliente
app.post("/make-server-d03ded2a/clientes", async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const cliente = {
      id,
      ...body,
      fechaRegistro: now,
      fechaActualizacion: now
    };
    
    await kv.set(`cliente:${id}`, cliente);
    return c.json({ success: true, data: cliente }, 201);
  } catch (error) {
    console.error("Error al crear cliente:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Actualizar un cliente
app.put("/make-server-d03ded2a/clientes/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const clienteExistente = await kv.get(`cliente:${id}`);
    if (!clienteExistente) {
      return c.json({ success: false, error: "Cliente no encontrado" }, 404);
    }
    
    const clienteActualizado = {
      ...clienteExistente,
      ...body,
      id, // Mantener el ID original
      fechaActualizacion: new Date().toISOString()
    };
    
    await kv.set(`cliente:${id}`, clienteActualizado);
    return c.json({ success: true, data: clienteActualizado });
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Eliminar un cliente
app.delete("/make-server-d03ded2a/clientes/:id", async (c) => {
  try {
    const id = c.req.param("id");
    
    const cliente = await kv.get(`cliente:${id}`);
    if (!cliente) {
      return c.json({ success: false, error: "Cliente no encontrado" }, 404);
    }
    
    await kv.del(`cliente:${id}`);
    return c.json({ success: true, message: "Cliente eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== LLAMADAS ====================

// Obtener todas las llamadas
app.get("/make-server-d03ded2a/llamadas", async (c) => {
  try {
    const llamadas = await kv.getByPrefix("llamada:");
    return c.json({ success: true, data: llamadas });
  } catch (error) {
    console.error("Error al obtener llamadas:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Obtener llamadas por cliente
app.get("/make-server-d03ded2a/llamadas/cliente/:clienteId", async (c) => {
  try {
    const clienteId = c.req.param("clienteId");
    const todasLlamadas = await kv.getByPrefix("llamada:");
    const llamadasCliente = todasLlamadas.filter((l: any) => l.clienteId === clienteId);
    
    return c.json({ success: true, data: llamadasCliente });
  } catch (error) {
    console.error("Error al obtener llamadas del cliente:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Crear una nueva llamada
app.post("/make-server-d03ded2a/llamadas", async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    
    const llamada = {
      id,
      ...body,
      fecha: body.fecha || new Date().toISOString()
    };
    
    await kv.set(`llamada:${id}`, llamada);
    return c.json({ success: true, data: llamada }, 201);
  } catch (error) {
    console.error("Error al crear llamada:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Actualizar una llamada
app.put("/make-server-d03ded2a/llamadas/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const llamadaExistente = await kv.get(`llamada:${id}`);
    if (!llamadaExistente) {
      return c.json({ success: false, error: "Llamada no encontrada" }, 404);
    }
    
    const llamadaActualizada = {
      ...llamadaExistente,
      ...body,
      id
    };
    
    await kv.set(`llamada:${id}`, llamadaActualizada);
    return c.json({ success: true, data: llamadaActualizada });
  } catch (error) {
    console.error("Error al actualizar llamada:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Eliminar una llamada
app.delete("/make-server-d03ded2a/llamadas/:id", async (c) => {
  try {
    const id = c.req.param("id");
    
    const llamada = await kv.get(`llamada:${id}`);
    if (!llamada) {
      return c.json({ success: false, error: "Llamada no encontrada" }, 404);
    }
    
    await kv.del(`llamada:${id}`);
    return c.json({ success: true, message: "Llamada eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar llamada:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== TAREAS / SEGUIMIENTO ====================

// Obtener todas las tareas
app.get("/make-server-d03ded2a/tareas", async (c) => {
  try {
    const tareas = await kv.getByPrefix("tarea:");
    return c.json({ success: true, data: tareas });
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Obtener tareas por cliente
app.get("/make-server-d03ded2a/tareas/cliente/:clienteId", async (c) => {
  try {
    const clienteId = c.req.param("clienteId");
    const todasTareas = await kv.getByPrefix("tarea:");
    const tareasCliente = todasTareas.filter((t: any) => t.clienteId === clienteId);
    
    return c.json({ success: true, data: tareasCliente });
  } catch (error) {
    console.error("Error al obtener tareas del cliente:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Crear una nueva tarea
app.post("/make-server-d03ded2a/tareas", async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    
    const tarea = {
      id,
      ...body,
      fechaCreacion: new Date().toISOString()
    };
    
    await kv.set(`tarea:${id}`, tarea);
    return c.json({ success: true, data: tarea }, 201);
  } catch (error) {
    console.error("Error al crear tarea:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Actualizar una tarea
app.put("/make-server-d03ded2a/tareas/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const tareaExistente = await kv.get(`tarea:${id}`);
    if (!tareaExistente) {
      return c.json({ success: false, error: "Tarea no encontrada" }, 404);
    }
    
    const tareaActualizada = {
      ...tareaExistente,
      ...body,
      id
    };
    
    await kv.set(`tarea:${id}`, tareaActualizada);
    return c.json({ success: true, data: tareaActualizada });
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Eliminar una tarea
app.delete("/make-server-d03ded2a/tareas/:id", async (c) => {
  try {
    const id = c.req.param("id");
    
    const tarea = await kv.get(`tarea:${id}`);
    if (!tarea) {
      return c.json({ success: false, error: "Tarea no encontrada" }, 404);
    }
    
    await kv.del(`tarea:${id}`);
    return c.json({ success: true, message: "Tarea eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== DOCUMENTOS ====================

// Crear bucket de documentos al inicio si no existe
const initDocumentosBucket = async () => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const bucketName = 'make-d03ded2a-documentos';
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 10485760 // 10MB
      });
      console.log('Bucket de documentos creado exitosamente');
    }
  } catch (error) {
    console.error('Error al inicializar bucket de documentos:', error);
  }
};

// Inicializar bucket
initDocumentosBucket();

// Obtener todos los documentos
app.get("/make-server-d03ded2a/documentos", async (c) => {
  try {
    const documentos = await kv.getByPrefix("documento:");
    
    // Generar URLs firmadas para cada documento
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const documentosConUrl = await Promise.all(
      documentos.map(async (doc: any) => {
        if (doc.storagePath) {
          const { data: signedUrl } = await supabase.storage
            .from('make-d03ded2a-documentos')
            .createSignedUrl(doc.storagePath, 3600); // URL válida por 1 hora
          
          return {
            ...doc,
            url: signedUrl?.signedUrl
          };
        }
        return doc;
      })
    );
    
    return c.json({ success: true, data: documentosConUrl });
  } catch (error) {
    console.error("Error al obtener documentos:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Obtener documentos por cliente
app.get("/make-server-d03ded2a/documentos/cliente/:clienteId", async (c) => {
  try {
    const clienteId = c.req.param("clienteId");
    const todosDocumentos = await kv.getByPrefix("documento:");
    const documentosCliente = todosDocumentos.filter((d: any) => d.clienteId === clienteId);
    
    // Generar URLs firmadas
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const documentosConUrl = await Promise.all(
      documentosCliente.map(async (doc: any) => {
        if (doc.storagePath) {
          const { data: signedUrl } = await supabase.storage
            .from('make-d03ded2a-documentos')
            .createSignedUrl(doc.storagePath, 3600);
          
          return {
            ...doc,
            url: signedUrl?.signedUrl
          };
        }
        return doc;
      })
    );
    
    return c.json({ success: true, data: documentosConUrl });
  } catch (error) {
    console.error("Error al obtener documentos del cliente:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Subir un nuevo documento
app.post("/make-server-d03ded2a/documentos/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const metadata = JSON.parse(formData.get('metadata') as string);
    
    if (!file) {
      return c.json({ success: false, error: "No se proporcionó archivo" }, 400);
    }
    
    // Crear cliente de Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    // Generar ID y ruta de almacenamiento
    const id = crypto.randomUUID();
    const fileExtension = file.name.split('.').pop();
    const storagePath = `${id}.${fileExtension}`;
    
    // Convertir file a ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Subir archivo a Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('make-d03ded2a-documentos')
      .upload(storagePath, uint8Array, {
        contentType: file.type,
        upsert: false
      });
    
    if (uploadError) {
      console.error("Error al subir archivo a storage:", uploadError);
      return c.json({ 
        success: false, 
        error: `Error al subir archivo: ${uploadError.message}` 
      }, 500);
    }
    
    // Crear registro del documento en KV
    const documento = {
      id,
      nombre: metadata.nombre || file.name,
      tipo: metadata.tipo,
      cliente: metadata.cliente,
      empresa: metadata.empresa,
      estado: metadata.estado,
      categoria: metadata.categoria,
      tamaño: formatFileSize(file.size),
      fechaCreacion: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      fechaSubida: new Date().toISOString(),
      storagePath,
      mimeType: file.type,
      sizeBytes: file.size
    };
    
    await kv.set(`documento:${id}`, documento);
    
    // Generar URL firmada para la respuesta
    const { data: signedUrl } = await supabase.storage
      .from('make-d03ded2a-documentos')
      .createSignedUrl(storagePath, 3600);
    
    return c.json({ 
      success: true, 
      data: {
        ...documento,
        url: signedUrl?.signedUrl
      }
    }, 201);
  } catch (error) {
    console.error("Error al subir documento:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Descargar un documento
app.get("/make-server-d03ded2a/documentos/:id/download", async (c) => {
  try {
    const id = c.req.param("id");
    
    const documento: any = await kv.get(`documento:${id}`);
    if (!documento) {
      return c.json({ success: false, error: "Documento no encontrado" }, 404);
    }
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    // Generar URL firmada para descarga
    const { data: signedUrl, error } = await supabase.storage
      .from('make-d03ded2a-documentos')
      .createSignedUrl(documento.storagePath, 60); // 1 minuto de validez
    
    if (error || !signedUrl) {
      console.error("Error al generar URL de descarga:", error);
      return c.json({ success: false, error: "Error al generar URL de descarga" }, 500);
    }
    
    return c.json({ 
      success: true, 
      data: { 
        url: signedUrl.signedUrl,
        nombre: documento.nombre
      } 
    });
  } catch (error) {
    console.error("Error al descargar documento:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Eliminar un documento
app.delete("/make-server-d03ded2a/documentos/:id", async (c) => {
  try {
    const id = c.req.param("id");
    
    const documento: any = await kv.get(`documento:${id}`);
    if (!documento) {
      return c.json({ success: false, error: "Documento no encontrado" }, 404);
    }
    
    // Eliminar archivo del storage
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    if (documento.storagePath) {
      const { error: deleteError } = await supabase.storage
        .from('make-d03ded2a-documentos')
        .remove([documento.storagePath]);
      
      if (deleteError) {
        console.error("Error al eliminar archivo del storage:", deleteError);
      }
    }
    
    // Eliminar registro del KV
    await kv.del(`documento:${id}`);
    
    return c.json({ success: true, message: "Documento eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar documento:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Función auxiliar para formatear tamaño de archivo
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// ==================== AUTENTICACIÓN ====================

// Registrar nuevo usuario
app.post("/make-server-d03ded2a/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, nombre } = body;

    if (!email || !password || !nombre) {
      return c.json({ 
        success: false, 
        error: "Email, contraseña y nombre son requeridos" 
      }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { nombre },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error("Error al registrar usuario:", error);
      return c.json({ 
        success: false, 
        error: `Error al registrar usuario: ${error.message}` 
      }, 400);
    }

    return c.json({ 
      success: true, 
      data: { 
        id: data.user.id, 
        email: data.user.email,
        nombre: data.user.user_metadata.nombre
      } 
    }, 201);
  } catch (error) {
    console.error("Error en signup:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Verificar sesión de usuario
app.get("/make-server-d03ded2a/auth/verify", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: false, error: "No autorizado" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ success: false, error: "Sesión inválida" }, 401);
    }

    return c.json({ 
      success: true, 
      data: { 
        id: user.id, 
        email: user.email,
        nombre: user.user_metadata?.nombre || 'Usuario'
      } 
    });
  } catch (error) {
    console.error("Error al verificar sesión:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== DASHBOARD STATS ====================

// Obtener estadísticas del dashboard
app.get("/make-server-d03ded2a/stats", async (c) => {
  try {
    const clientes = await kv.getByPrefix("cliente:");
    const llamadas = await kv.getByPrefix("llamada:");
    const tareas = await kv.getByPrefix("tarea:");
    
    // Calcular clientes activos (ejemplo: con estado "Activo")
    const clientesActivos = clientes.filter((c: any) => c.estado === "Activo").length;
    
    // Llamadas del mes actual
    const now = new Date();
    const primerDiaMes = new Date(now.getFullYear(), now.getMonth(), 1);
    const llamadasMes = llamadas.filter((l: any) => {
      const fechaLlamada = new Date(l.fecha);
      return fechaLlamada >= primerDiaMes;
    }).length;
    
    // Llamadas de hoy
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const llamadasHoy = llamadas.filter((l: any) => {
      const fechaLlamada = new Date(l.fecha);
      fechaLlamada.setHours(0, 0, 0, 0);
      return fechaLlamada.getTime() === hoy.getTime();
    }).length;
    
    // Tareas pendientes
    const tareasPendientes = tareas.filter((t: any) => t.estado === "Pendiente").length;
    
    const stats = {
      totalClientes: clientes.length,
      clientesActivos,
      llamadasMes,
      llamadasHoy,
      tareasPendientes
    };
    
    return c.json({ success: true, data: stats });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== CLOUDTALK INTEGRATION ====================

// Iniciar llamada (Click-to-Call)
app.post("/make-server-d03ded2a/cloudtalk/call", async (c) => {
  try {
    const body = await c.req.json();
    const { from, to, contactId } = body;

    if (!from || !to) {
      return c.json({ 
        success: false, 
        error: "Los campos 'from' y 'to' son requeridos" 
      }, 400);
    }

    const apiKey = Deno.env.get('CLOUDTALK_API_KEY');
    if (!apiKey) {
      return c.json({ 
        success: false, 
        error: "CloudTalk API Key no configurada" 
      }, 500);
    }

    const cloudtalk = new CloudTalkService(apiKey);
    const result = await cloudtalk.initiateCall(from, to, contactId);

    if (!result.success) {
      return c.json({ success: false, error: result.error }, 500);
    }

    return c.json({ success: true, data: result.data });
  } catch (error) {
    console.error("Error al iniciar llamada CloudTalk:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Obtener historial de llamadas de CloudTalk
app.get("/make-server-d03ded2a/cloudtalk/calls", async (c) => {
  try {
    const apiKey = Deno.env.get('CLOUDTALK_API_KEY');
    
    // Obtener parámetros de query
    const from_date = c.req.query('from_date');
    const to_date = c.req.query('to_date');
    const direction = c.req.query('direction') as 'inbound' | 'outbound' | undefined;
    const status = c.req.query('status');
    const limit = c.req.query('limit');

    const params: any = {};
    if (from_date) params.from_date = from_date;
    if (to_date) params.to_date = to_date;
    if (direction) params.direction = direction;
    if (status) params.status = status;
    if (limit) params.limit = parseInt(limit);

    const result = await callCloudTalkWithFallback(apiKey, 'getCalls', params);

    if (!result.success) {
      console.log("CloudTalk API no disponible, retornando array vacío");
      return c.json({ 
        success: true, 
        data: [],
        demo_mode: DEMO_MODE 
      });
    }

    return c.json({ 
      success: true, 
      data: result.data,
      demo_mode: DEMO_MODE 
    });
  } catch (error) {
    console.log("Error al obtener llamadas de CloudTalk:", error);
    return c.json({ 
      success: true, 
      data: [],
      demo_mode: DEMO_MODE 
    });
  }
});

// Obtener detalles de una llamada específica
app.get("/make-server-d03ded2a/cloudtalk/calls/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const apiKey = Deno.env.get('CLOUDTALK_API_KEY');
    
    const result = await callCloudTalkWithFallback(apiKey, 'getCall', id);

    if (!result.success) {
      return c.json({ 
        success: false, 
        error: result.error,
        demo_mode: DEMO_MODE 
      }, 500);
    }

    return c.json({ 
      success: true, 
      data: result.data,
      demo_mode: DEMO_MODE 
    });
  } catch (error) {
    console.error("Error al obtener detalles de llamada:", error);
    return c.json({ 
      success: false, 
      error: String(error),
      demo_mode: DEMO_MODE 
    }, 500);
  }
});

// Obtener URL de grabación de una llamada
app.get("/make-server-d03ded2a/cloudtalk/calls/:id/recording", async (c) => {
  try {
    const id = c.req.param("id");
    const apiKey = Deno.env.get('CLOUDTALK_API_KEY');
    
    if (!apiKey) {
      return c.json({ 
        success: false, 
        error: "CloudTalk API Key no configurada" 
      }, 500);
    }

    const cloudtalk = new CloudTalkService(apiKey);
    const result = await cloudtalk.getRecordingUrl(id);

    if (!result.success) {
      return c.json({ success: false, error: result.error }, 500);
    }

    return c.json({ success: true, url: result.url });
  } catch (error) {
    console.error("Error al obtener grabación:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Obtener estadísticas de CloudTalk
app.get("/make-server-d03ded2a/cloudtalk/stats", async (c) => {
  try {
    const apiKey = Deno.env.get('CLOUDTALK_API_KEY');
    
    const from_date = c.req.query('from_date');
    const to_date = c.req.query('to_date');

    const params: any = {};
    if (from_date) params.from_date = from_date;
    if (to_date) params.to_date = to_date;

    const result = await callCloudTalkWithFallback(apiKey, 'getStats', params);

    if (!result.success) {
      // Retornar estadísticas vacías en lugar de error
      return c.json({ 
        success: true, 
        data: {
          total_calls: 0,
          answered_calls: 0,
          missed_calls: 0,
          average_duration: 0,
          total_duration: 0
        },
        demo_mode: DEMO_MODE
      });
    }

    return c.json({ 
      success: true, 
      data: result.data,
      demo_mode: DEMO_MODE 
    });
  } catch (error) {
    console.log("CloudTalk stats no disponibles:", error);
    return c.json({ 
      success: true, 
      data: {
        total_calls: 0,
        answered_calls: 0,
        missed_calls: 0,
        average_duration: 0,
        total_duration: 0
      }
    });
  }
});

// Obtener agentes disponibles
app.get("/make-server-d03ded2a/cloudtalk/agents", async (c) => {
  try {
    const apiKey = Deno.env.get('CLOUDTALK_API_KEY');
    const result = await callCloudTalkWithFallback(apiKey, 'getAgents');

    if (!result.success) {
      return c.json({ 
        success: false, 
        error: result.error, 
        data: [],
        demo_mode: DEMO_MODE 
      }, 500);
    }

    return c.json({ 
      success: true, 
      data: result.data,
      demo_mode: DEMO_MODE 
    });
  } catch (error) {
    console.error("Error al obtener agentes:", error);
    return c.json({ 
      success: false, 
      error: String(error), 
      data: [],
      demo_mode: DEMO_MODE 
    }, 500);
  }
});

// Webhook para recibir eventos de CloudTalk
app.post("/make-server-d03ded2a/cloudtalk/webhook", async (c) => {
  try {
    const body = await c.req.json();
    const { event, data } = body;

    console.log('CloudTalk Webhook Event:', event, data);

    // Procesar diferentes tipos de eventos
    switch (event) {
      case 'call.started':
      case 'call.ended':
      case 'call.answered':
      case 'call.missed':
        // Guardar o actualizar la llamada en el KV store
        if (data?.id) {
          const llamadaId = `cloudtalk-${data.id}`;
          const llamadaExistente = await kv.get(`llamada:${llamadaId}`);
          
          const llamada = {
            id: llamadaId,
            clienteId: data.contact_id || 'unknown',
            clienteNombre: data.contact_name || 'Desconocido',
            tipo: data.direction === 'inbound' ? 'Entrante' : 'Saliente',
            duracion: data.duration ? `${Math.floor(data.duration / 60)}:${(data.duration % 60).toString().padStart(2, '0')}` : '0:00',
            fecha: data.started_at || new Date().toISOString(),
            estado: event === 'call.answered' || event === 'call.ended' ? 'Completada' : 
                   event === 'call.missed' ? 'Perdida' : 'En Progreso',
            notas: `Llamada CloudTalk - ${data.from} → ${data.to}`,
            cloudtalkId: data.id,
            cloudtalkData: data,
            ...llamadaExistente
          };

          await kv.set(`llamada:${llamadaId}`, llamada);
        }
        break;

      default:
        console.log('Evento de CloudTalk no manejado:', event);
    }

    return c.json({ success: true, message: 'Webhook procesado correctamente' });
  } catch (error) {
    console.error("Error al procesar webhook de CloudTalk:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Diagnóstico detallado de CloudTalk
app.get("/make-server-d03ded2a/cloudtalk/diagnostics", async (c) => {
  try {
    const apiKey = Deno.env.get('CLOUDTALK_API_KEY');
    
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      apiKeyConfigured: !!apiKey,
      apiKeyLength: apiKey ? apiKey.length : 0,
      apiKeyPreview: apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}` : 'NO_CONFIGURADA',
      tests: []
    };

    if (!apiKey) {
      diagnostics.status = 'ERROR';
      diagnostics.message = 'CLOUDTALK_API_KEY no está configurada en las variables de entorno';
      return c.json({ success: false, data: diagnostics });
    }

    // Test 1: Verificar formato de API Key (debe contener puntos y comas)
    const hasExpectedFormat = apiKey.includes(';');
    diagnostics.tests.push({
      name: 'Formato de API Key',
      passed: hasExpectedFormat,
      message: hasExpectedFormat ? 'La API Key tiene el formato esperado' : 'La API Key no parece tener el formato correcto (debe contener ";")',
      details: 'Verifica que copiaste la API Key completa desde CloudTalk > Settings > Integrations > API'
    });

    // Test 2: Probar diferentes métodos de autenticación
    console.log('🔍 DIAGNÓSTICO: Probando diferentes métodos de autenticación...');
    console.log('🔍 API Key preview:', diagnostics.apiKeyPreview);
    console.log('🔍 API Base URL: https://api.cloudtalk.io/api');
    
    // Método 1: Query parameter con access_token (URL ENCODED)
    try {
      const testUrl1 = `https://api.cloudtalk.io/api/users?access_token=${encodeURIComponent(apiKey)}`;
      console.log('🔍 Test 1: Query Parameter ENCODED');
      const test1 = await fetch(testUrl1, {
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'CloudTalk-CRM-Integration/1.0'
        }
      });
      
      const test1Body = test1.ok ? await test1.json() : await test1.text();
      console.log(`   Response: ${test1.status} - ${test1Body.substring ? test1Body.substring(0, 100) : JSON.stringify(test1Body).substring(0, 100)}`);
      
      diagnostics.tests.push({
        name: 'Auth Método 1: Query Parameter ENCODED',
        passed: test1.ok,
        message: `Status: ${test1.status} ${test1.statusText}`,
        data: test1.ok ? test1Body : test1Body.substring ? test1Body.substring(0, 300) : test1Body
      });
    } catch (e) {
      diagnostics.tests.push({
        name: 'Auth Método 1: Query Parameter ENCODED',
        passed: false,
        message: `Error: ${e}`,
        data: null
      });
    }

    // Método 1b: Query parameter SIN encoding (directo)
    try {
      const testUrl1b = `https://api.cloudtalk.io/api/users?access_token=${apiKey}`;
      console.log('🔍 Test 1b: Query Parameter NO ENCODED');
      const test1b = await fetch(testUrl1b, {
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'CloudTalk-CRM-Integration/1.0'
        }
      });
      
      const test1bBody = test1b.ok ? await test1b.json() : await test1b.text();
      console.log(`   Response: ${test1b.status} - ${test1bBody.substring ? test1bBody.substring(0, 100) : JSON.stringify(test1bBody).substring(0, 100)}`);
      
      diagnostics.tests.push({
        name: 'Auth Método 1b: Query Parameter NO ENCODED',
        passed: test1b.ok,
        message: `Status: ${test1b.status} ${test1b.statusText}`,
        data: test1b.ok ? test1bBody : test1bBody.substring ? test1bBody.substring(0, 300) : test1bBody
      });
    } catch (e) {
      diagnostics.tests.push({
        name: 'Auth Método 1b: Query Parameter NO ENCODED',
        passed: false,
        message: `Error: ${e}`,
        data: null
      });
    }

    // Método 2: Header con Bearer token
    try {
      const testUrl2 = 'https://api.cloudtalk.io/api/users';
      console.log('🔍 Test 2: Header Bearer Token');
      const test2 = await fetch(testUrl2, {
        headers: { 
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
          'User-Agent': 'CloudTalk-CRM-Integration/1.0'
        }
      });
      
      const test2Body = test2.ok ? await test2.json() : await test2.text();
      console.log(`   Response: ${test2.status} - ${test2Body.substring ? test2Body.substring(0, 100) : JSON.stringify(test2Body).substring(0, 100)}`);
      
      diagnostics.tests.push({
        name: 'Auth Método 2: Header Bearer Token',
        passed: test2.ok,
        message: `Status: ${test2.status} ${test2.statusText}`,
        data: test2.ok ? test2Body : test2Body.substring ? test2Body.substring(0, 300) : test2Body
      });
    } catch (e) {
      diagnostics.tests.push({
        name: 'Auth Método 2: Header Bearer Token',
        passed: false,
        message: `Error: ${e}`,
        data: null
      });
    }

    // Método 3: Header con token directo
    try {
      const testUrl3 = 'https://api.cloudtalk.io/api/users';
      console.log('🔍 Test 3: Header Token Directo');
      const test3 = await fetch(testUrl3, {
        headers: { 
          'Authorization': apiKey,
          'Accept': 'application/json',
          'User-Agent': 'CloudTalk-CRM-Integration/1.0'
        }
      });
      
      const test3Body = test3.ok ? await test3.json() : await test3.text();
      console.log(`   Response: ${test3.status} - ${test3Body.substring ? test3Body.substring(0, 100) : JSON.stringify(test3Body).substring(0, 100)}`);
      
      diagnostics.tests.push({
        name: 'Auth Método 3: Header Token Directo',
        passed: test3.ok,
        message: `Status: ${test3.status} ${test3.statusText}`,
        data: test3.ok ? test3Body : test3Body.substring ? test3Body.substring(0, 300) : test3Body
      });
    } catch (e) {
      diagnostics.tests.push({
        name: 'Auth Método 3: Header Token Directo',
        passed: false,
        message: `Error: ${e}`,
        data: null
      });
    }

    // Método 4: Header X-API-Key
    try {
      const testUrl4 = 'https://api.cloudtalk.io/api/users';
      console.log('🔍 Test 4: Header X-API-Key');
      const test4 = await fetch(testUrl4, {
        headers: { 
          'X-API-Key': apiKey,
          'Accept': 'application/json',
          'User-Agent': 'CloudTalk-CRM-Integration/1.0'
        }
      });
      
      const test4Body = test4.ok ? await test4.json() : await test4.text();
      console.log(`   Response: ${test4.status} - ${test4Body.substring ? test4Body.substring(0, 100) : JSON.stringify(test4Body).substring(0, 100)}`);
      
      diagnostics.tests.push({
        name: 'Auth Método 4: Header X-API-Key',
        passed: test4.ok,
        message: `Status: ${test4.status} ${test4.statusText}`,
        data: test4.ok ? test4Body : test4Body.substring ? test4Body.substring(0, 300) : test4Body
      });
    } catch (e) {
      diagnostics.tests.push({
        name: 'Auth Método 4: Header X-API-Key',
        passed: false,
        message: `Error: ${e}`,
        data: null
      });
    }

    // Test 3: Si algún método funcionó, probar con el servicio actual
    const cloudtalk = new CloudTalkService(apiKey);
    const callsResult = await cloudtalk.getCalls({ limit: 5 });
    diagnostics.tests.push({
      name: 'Obtener Historial de Llamadas (método actual)',
      passed: callsResult.success,
      message: callsResult.success 
        ? `Conexión exitosa - ${callsResult.data?.length || 0} llamadas encontradas`
        : `Error: ${callsResult.error}`,
      data: callsResult.success ? callsResult.data : null
    });

    // Determinar estado general
    const allTestsPassed = diagnostics.tests.every((t: any) => t.passed);
    diagnostics.status = allTestsPassed ? 'OK' : 'ERROR';
    diagnostics.message = allTestsPassed 
      ? 'CloudTalk está configurado correctamente'
      : 'CloudTalk tiene problemas de configuración - Ver detalles de tests';

    console.log('🔍 DIAGNÓSTICO COMPLETO:', JSON.stringify(diagnostics, null, 2));

    return c.json({ 
      success: allTestsPassed, 
      data: diagnostics 
    });
  } catch (error) {
    console.error("❌ Error en diagnóstico de CloudTalk:", error);
    return c.json({ 
      success: false, 
      data: {
        status: 'ERROR',
        message: `Error al ejecutar diagnóstico: ${error}`,
        error: String(error)
      }
    });
  }
});

// Endpoint para obtener/cambiar el modo demo
app.get("/make-server-d03ded2a/cloudtalk/demo-mode", (c) => {
  return c.json({ demo_mode: DEMO_MODE });
});

app.post("/make-server-d03ded2a/cloudtalk/demo-mode", async (c) => {
  try {
    const body = await c.req.json();
    DEMO_MODE = body.enabled === true;
    console.log(`🎭 Modo Demo ${DEMO_MODE ? 'ACTIVADO' : 'DESACTIVADO'}`);
    return c.json({ success: true, demo_mode: DEMO_MODE });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== NUEVAS FUNCIONALIDADES CLOUDTALK ====================

// Enviar SMS
app.post("/make-server-d03ded2a/cloudtalk/sms", async (c) => {
  try {
    const body = await c.req.json();
    const { from, to, message, contact_id } = body;

    if (!from || !to || !message) {
      return c.json({ 
        success: false, 
        error: "Los campos 'from', 'to' y 'message' son requeridos" 
      }, 400);
    }

    const apiKey = Deno.env.get('CLOUDTALK_API_KEY');
    const result = await callCloudTalkWithFallback(apiKey, 'sendSMS', { from, to, message, contact_id });

    if (!result.success) {
      return c.json({ 
        success: false, 
        error: result.error,
        demo_mode: DEMO_MODE 
      }, 500);
    }

    return c.json({ 
      success: true, 
      data: result.data,
      demo_mode: DEMO_MODE 
    });
  } catch (error) {
    console.error("Error al enviar SMS:", error);
    return c.json({ 
      success: false, 
      error: String(error),
      demo_mode: DEMO_MODE 
    }, 500);
  }
});

// Obtener historial de SMS
app.get("/make-server-d03ded2a/cloudtalk/sms", async (c) => {
  try {
    const apiKey = Deno.env.get('CLOUDTALK_API_KEY');
    
    const from_date = c.req.query('from_date');
    const to_date = c.req.query('to_date');
    const limit = c.req.query('limit');

    const params: any = {};
    if (from_date) params.from_date = from_date;
    if (to_date) params.to_date = to_date;
    if (limit) params.limit = parseInt(limit);

    const result = await callCloudTalkWithFallback(apiKey, 'getSMS', params);

    if (!result.success) {
      return c.json({ 
        success: true, 
        data: [],
        demo_mode: DEMO_MODE 
      });
    }

    return c.json({ 
      success: true, 
      data: result.data,
      demo_mode: DEMO_MODE 
    });
  } catch (error) {
    console.log("Error al obtener SMS:", error);
    return c.json({ 
      success: true, 
      data: [],
      demo_mode: DEMO_MODE 
    });
  }
});

// Agregar nota a una llamada
app.post("/make-server-d03ded2a/cloudtalk/calls/:id/note", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { note } = body;

    if (!note) {
      return c.json({ 
        success: false, 
        error: "El campo 'note' es requerido" 
      }, 400);
    }

    const apiKey = Deno.env.get('CLOUDTALK_API_KEY');
    const result = await callCloudTalkWithFallback(apiKey, 'addCallNote', id, note);

    if (!result.success) {
      return c.json({ 
        success: false, 
        error: result.error,
        demo_mode: DEMO_MODE 
      }, 500);
    }

    return c.json({ 
      success: true, 
      data: result.data,
      demo_mode: DEMO_MODE 
    });
  } catch (error) {
    console.error("Error al agregar nota:", error);
    return c.json({ 
      success: false, 
      error: String(error),
      demo_mode: DEMO_MODE 
    }, 500);
  }
});

// Agregar tags a una llamada
app.post("/make-server-d03ded2a/cloudtalk/calls/:id/tags", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { tags } = body;

    if (!tags || !Array.isArray(tags)) {
      return c.json({ 
        success: false, 
        error: "El campo 'tags' debe ser un array" 
      }, 400);
    }

    const apiKey = Deno.env.get('CLOUDTALK_API_KEY');
    const result = await callCloudTalkWithFallback(apiKey, 'addCallTags', id, tags);

    if (!result.success) {
      return c.json({ 
        success: false, 
        error: result.error,
        demo_mode: DEMO_MODE 
      }, 500);
    }

    return c.json({ 
      success: true, 
      data: result.data,
      demo_mode: DEMO_MODE 
    });
  } catch (error) {
    console.error("Error al agregar tags:", error);
    return c.json({ 
      success: false, 
      error: String(error),
      demo_mode: DEMO_MODE 
    }, 500);
  }
});

// Obtener tags disponibles
app.get("/make-server-d03ded2a/cloudtalk/tags", async (c) => {
  try {
    const apiKey = Deno.env.get('CLOUDTALK_API_KEY');
    const result = await callCloudTalkWithFallback(apiKey, 'getTags');

    if (!result.success) {
      return c.json({ 
        success: false, 
        error: result.error,
        data: [],
        demo_mode: DEMO_MODE 
      }, 500);
    }

    return c.json({ 
      success: true, 
      data: result.data,
      demo_mode: DEMO_MODE 
    });
  } catch (error) {
    console.error("Error al obtener tags:", error);
    return c.json({ 
      success: false, 
      error: String(error),
      data: [],
      demo_mode: DEMO_MODE 
    }, 500);
  }
});

// Calificar una llamada
app.post("/make-server-d03ded2a/cloudtalk/calls/:id/rating", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return c.json({ 
        success: false, 
        error: "El campo 'rating' debe ser un número entre 1 y 5" 
      }, 400);
    }

    const apiKey = Deno.env.get('CLOUDTALK_API_KEY');
    const result = await callCloudTalkWithFallback(apiKey, 'rateCall', id, rating, comment);

    if (!result.success) {
      return c.json({ 
        success: false, 
        error: result.error,
        demo_mode: DEMO_MODE 
      }, 500);
    }

    return c.json({ 
      success: true, 
      data: result.data,
      demo_mode: DEMO_MODE 
    });
  } catch (error) {
    console.error("Error al calificar llamada:", error);
    return c.json({ 
      success: false, 
      error: String(error),
      demo_mode: DEMO_MODE 
    }, 500);
  }
});

// Obtener números de teléfono disponibles
app.get("/make-server-d03ded2a/cloudtalk/phone-numbers", async (c) => {
  try {
    const apiKey = Deno.env.get('CLOUDTALK_API_KEY');
    const result = await callCloudTalkWithFallback(apiKey, 'getPhoneNumbers');

    if (!result.success) {
      return c.json({ 
        success: false, 
        error: result.error,
        data: [],
        demo_mode: DEMO_MODE 
      }, 500);
    }

    return c.json({ 
      success: true, 
      data: result.data,
      demo_mode: DEMO_MODE 
    });
  } catch (error) {
    console.error("Error al obtener números de teléfono:", error);
    return c.json({ 
      success: false, 
      error: String(error),
      data: [],
      demo_mode: DEMO_MODE 
    }, 500);
  }
});

// Obtener estadísticas de colas
app.get("/make-server-d03ded2a/cloudtalk/queue-stats", async (c) => {
  try {
    const apiKey = Deno.env.get('CLOUDTALK_API_KEY');
    
    const from_date = c.req.query('from_date');
    const to_date = c.req.query('to_date');

    const params: any = {};
    if (from_date) params.from_date = from_date;
    if (to_date) params.to_date = to_date;

    const result = await callCloudTalkWithFallback(apiKey, 'getQueueStats', params);

    if (!result.success) {
      return c.json({ 
        success: true, 
        data: {
          total_queued: 0,
          average_wait_time: 0,
          abandoned_calls: 0,
          max_wait_time: 0
        },
        demo_mode: DEMO_MODE 
      });
    }

    return c.json({ 
      success: true, 
      data: result.data,
      demo_mode: DEMO_MODE 
    });
  } catch (error) {
    console.log("Error al obtener estadísticas de colas:", error);
    return c.json({ 
      success: true, 
      data: {
        total_queued: 0,
        average_wait_time: 0,
        abandoned_calls: 0,
        max_wait_time: 0
      },
      demo_mode: DEMO_MODE 
    });
  }
});

// Obtener colas
app.get("/make-server-d03ded2a/cloudtalk/queues", async (c) => {
  try {
    const apiKey = Deno.env.get('CLOUDTALK_API_KEY');
    const result = await callCloudTalkWithFallback(apiKey, 'getQueues');

    if (!result.success) {
      return c.json({ 
        success: false, 
        error: result.error,
        data: [],
        demo_mode: DEMO_MODE 
      }, 500);
    }

    return c.json({ 
      success: true, 
      data: result.data,
      demo_mode: DEMO_MODE 
    });
  } catch (error) {
    console.error("Error al obtener colas:", error);
    return c.json({ 
      success: false, 
      error: String(error),
      data: [],
      demo_mode: DEMO_MODE 
    }, 500);
  }
});

// Obtener voicemails
app.get("/make-server-d03ded2a/cloudtalk/voicemails", async (c) => {
  try {
    const apiKey = Deno.env.get('CLOUDTALK_API_KEY');
    
    const from_date = c.req.query('from_date');
    const to_date = c.req.query('to_date');
    const status = c.req.query('status') as 'new' | 'read' | 'archived' | undefined;
    const limit = c.req.query('limit');

    const params: any = {};
    if (from_date) params.from_date = from_date;
    if (to_date) params.to_date = to_date;
    if (status) params.status = status;
    if (limit) params.limit = parseInt(limit);

    const result = await callCloudTalkWithFallback(apiKey, 'getVoicemails', params);

    if (!result.success) {
      return c.json({ 
        success: true, 
        data: [],
        demo_mode: DEMO_MODE 
      });
    }

    return c.json({ 
      success: true, 
      data: result.data,
      demo_mode: DEMO_MODE 
    });
  } catch (error) {
    console.log("Error al obtener voicemails:", error);
    return c.json({ 
      success: true, 
      data: [],
      demo_mode: DEMO_MODE 
    });
  }
});

// Marcar voicemail como leído
app.put("/make-server-d03ded2a/cloudtalk/voicemails/:id/read", async (c) => {
  try {
    const id = c.req.param("id");
    const apiKey = Deno.env.get('CLOUDTALK_API_KEY');
    const result = await callCloudTalkWithFallback(apiKey, 'markVoicemailRead', id);

    if (!result.success) {
      return c.json({ 
        success: false, 
        error: result.error,
        demo_mode: DEMO_MODE 
      }, 500);
    }

    return c.json({ 
      success: true, 
      data: result.data,
      demo_mode: DEMO_MODE 
    });
  } catch (error) {
    console.error("Error al marcar voicemail como leído:", error);
    return c.json({ 
      success: false, 
      error: String(error),
      demo_mode: DEMO_MODE 
    }, 500);
  }
});

Deno.serve(app.fetch);