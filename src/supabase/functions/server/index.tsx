import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

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

// Obtener todos los documentos
app.get("/make-server-d03ded2a/documentos", async (c) => {
  try {
    const documentos = await kv.getByPrefix("documento:");
    return c.json({ success: true, data: documentos });
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
    
    return c.json({ success: true, data: documentosCliente });
  } catch (error) {
    console.error("Error al obtener documentos del cliente:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Crear un nuevo documento
app.post("/make-server-d03ded2a/documentos", async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    
    const documento = {
      id,
      ...body,
      fechaSubida: new Date().toISOString()
    };
    
    await kv.set(`documento:${id}`, documento);
    return c.json({ success: true, data: documento }, 201);
  } catch (error) {
    console.error("Error al crear documento:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Eliminar un documento
app.delete("/make-server-d03ded2a/documentos/:id", async (c) => {
  try {
    const id = c.req.param("id");
    
    const documento = await kv.get(`documento:${id}`);
    if (!documento) {
      return c.json({ success: false, error: "Documento no encontrado" }, 404);
    }
    
    await kv.del(`documento:${id}`);
    return c.json({ success: true, message: "Documento eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar documento:", error);
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

Deno.serve(app.fetch);