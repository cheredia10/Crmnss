import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-d03ded2a`;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`
};

// ==================== CLIENTES ====================

export interface Cliente {
  id: string;
  nombre: string;
  empresa: string;
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
  estado: 'Activo' | 'Inactivo' | 'Prospecto';
  fechaRegistro: string;
  fechaActualizacion: string;
}

export const clientesAPI = {
  getAll: async (): Promise<Cliente[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`, { headers });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Cliente> => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}`, { headers });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      console.error('Error al obtener cliente:', error);
      throw error;
    }
  },

  create: async (cliente: Omit<Cliente, 'id' | 'fechaRegistro' | 'fechaActualizacion'>): Promise<Cliente> => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`, {
        method: 'POST',
        headers,
        body: JSON.stringify(cliente)
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw error;
    }
  },

  update: async (id: string, cliente: Partial<Cliente>): Promise<Cliente> => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(cliente)
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: 'DELETE',
        headers
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      throw error;
    }
  }
};

// ==================== LLAMADAS ====================

export interface Llamada {
  id: string;
  clienteId: string;
  clienteNombre: string;
  fecha: string;
  duracion: string;
  tipo: 'Entrante' | 'Saliente';
  estado: 'Completada' | 'Perdida' | 'No contestada';
  notas: string;
}

export const llamadasAPI = {
  getAll: async (): Promise<Llamada[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/llamadas`, { headers });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      console.error('Error al obtener llamadas:', error);
      throw error;
    }
  },

  getByCliente: async (clienteId: string): Promise<Llamada[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/llamadas/cliente/${clienteId}`, { headers });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      console.error('Error al obtener llamadas del cliente:', error);
      throw error;
    }
  },

  create: async (llamada: Omit<Llamada, 'id'>): Promise<Llamada> => {
    try {
      const response = await fetch(`${API_BASE_URL}/llamadas`, {
        method: 'POST',
        headers,
        body: JSON.stringify(llamada)
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      console.error('Error al crear llamada:', error);
      throw error;
    }
  },

  update: async (id: string, llamada: Partial<Llamada>): Promise<Llamada> => {
    try {
      const response = await fetch(`${API_BASE_URL}/llamadas/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(llamada)
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      console.error('Error al actualizar llamada:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/llamadas/${id}`, {
        method: 'DELETE',
        headers
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
    } catch (error) {
      console.error('Error al eliminar llamada:', error);
      throw error;
    }
  }
};

// ==================== TAREAS ====================

export interface Tarea {
  id: string;
  clienteId: string;
  clienteNombre: string;
  titulo: string;
  descripcion: string;
  fechaVencimiento: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
  estado: 'Pendiente' | 'En Progreso' | 'Completada';
  tipo: string;
  fechaCreacion: string;
}

export const tareasAPI = {
  getAll: async (): Promise<Tarea[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tareas`, { headers });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      throw error;
    }
  },

  getByCliente: async (clienteId: string): Promise<Tarea[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tareas/cliente/${clienteId}`, { headers });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      console.error('Error al obtener tareas del cliente:', error);
      throw error;
    }
  },

  create: async (tarea: Omit<Tarea, 'id' | 'fechaCreacion'>): Promise<Tarea> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tareas`, {
        method: 'POST',
        headers,
        body: JSON.stringify(tarea)
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      console.error('Error al crear tarea:', error);
      throw error;
    }
  },

  update: async (id: string, tarea: Partial<Tarea>): Promise<Tarea> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(tarea)
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
        method: 'DELETE',
        headers
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      throw error;
    }
  }
};

// ==================== DOCUMENTOS ====================

export interface Documento {
  id: string;
  clienteId: string;
  clienteNombre: string;
  nombre: string;
  tipo: string;
  tamaño: string;
  fechaSubida: string;
  url?: string;
}

export const documentosAPI = {
  getAll: async (): Promise<Documento[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/documentos`, { headers });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      console.error('Error al obtener documentos:', error);
      throw error;
    }
  },

  getByCliente: async (clienteId: string): Promise<Documento[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/documentos/cliente/${clienteId}`, { headers });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      console.error('Error al obtener documentos del cliente:', error);
      throw error;
    }
  },

  create: async (documento: Omit<Documento, 'id' | 'fechaSubida'>): Promise<Documento> => {
    try {
      const response = await fetch(`${API_BASE_URL}/documentos`, {
        method: 'POST',
        headers,
        body: JSON.stringify(documento)
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      console.error('Error al crear documento:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/documentos/${id}`, {
        method: 'DELETE',
        headers
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      throw error;
    }
  }
};

// ==================== STATS ====================

export interface DashboardStats {
  totalClientes: number;
  clientesActivos: number;
  llamadasMes: number;
  llamadasHoy: number;
  tareasPendientes: number;
}

export const statsAPI = {
  get: async (): Promise<DashboardStats> => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`, { headers });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }
};
