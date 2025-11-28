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
  nombre: string;
  tipo: string;
  cliente: string;
  empresa: string;
  estado: string;
  categoria: string;
  tamaño: string;
  fechaCreacion: string;
  fechaSubida: string;
  url?: string;
  storagePath?: string;
}

export interface DocumentoUpload {
  nombre: string;
  tipo: string;
  cliente: string;
  empresa: string;
  estado: string;
  categoria: string;
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

  upload: async (file: File, metadata: DocumentoUpload): Promise<Documento> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(metadata));

      const response = await fetch(`${API_BASE_URL}/documentos/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: formData
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      console.error('Error al subir documento:', error);
      throw error;
    }
  },

  download: async (id: string): Promise<{ url: string; nombre: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/documentos/${id}/download`, { headers });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      console.error('Error al descargar documento:', error);
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

// ==================== CLOUDTALK ====================

export interface CloudTalkCall {
  id: string;
  direction: 'inbound' | 'outbound';
  from: string;
  to: string;
  status: string;
  duration: number;
  started_at: string;
  ended_at: string;
  recording_url?: string;
  contact_id?: string;
}

export interface CloudTalkStats {
  total_calls: number;
  answered_calls: number;
  missed_calls: number;
  average_duration: number;
  total_duration: number;
}

export interface CloudTalkAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
}

export const cloudtalkAPI = {
  // Click-to-Call: Iniciar una llamada
  initiateCall: async (from: string, to: string, contactId?: string): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cloudtalk/call`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ from, to, contactId })
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.log('CloudTalk no disponible:', error);
      return { success: false, error: 'CloudTalk no disponible' };
    }
  },

  // Obtener historial de llamadas
  getCalls: async (params?: {
    from_date?: string;
    to_date?: string;
    direction?: 'inbound' | 'outbound';
    status?: string;
    limit?: number;
  }): Promise<CloudTalkCall[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.from_date) queryParams.append('from_date', params.from_date);
      if (params?.to_date) queryParams.append('to_date', params.to_date);
      if (params?.direction) queryParams.append('direction', params.direction);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const url = `${API_BASE_URL}/cloudtalk/calls${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url, { headers });
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.log('CloudTalk no disponible:', error);
      return [];
    }
  },

  // Obtener detalles de una llamada
  getCall: async (id: string): Promise<CloudTalkCall> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cloudtalk/calls/${id}`, { headers });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      console.error('Error al obtener detalles de llamada:', error);
      throw error;
    }
  },

  // Obtener URL de grabación
  getRecording: async (id: string): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cloudtalk/calls/${id}/recording`, { headers });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.url;
    } catch (error) {
      console.error('Error al obtener grabación:', error);
      throw error;
    }
  },

  // Obtener estadísticas
  getStats: async (params?: {
    from_date?: string;
    to_date?: string;
  }): Promise<CloudTalkStats> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.from_date) queryParams.append('from_date', params.from_date);
      if (params?.to_date) queryParams.append('to_date', params.to_date);

      const url = `${API_BASE_URL}/cloudtalk/stats${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url, { headers });
      const result = await response.json();
      return result.data || {
        total_calls: 0,
        answered_calls: 0,
        missed_calls: 0,
        average_duration: 0,
        total_duration: 0
      };
    } catch (error) {
      console.log('CloudTalk no disponible:', error);
      return {
        total_calls: 0,
        answered_calls: 0,
        missed_calls: 0,
        average_duration: 0,
        total_duration: 0
      };
    }
  },

  // Obtener agentes
  getAgents: async (): Promise<CloudTalkAgent[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cloudtalk/agents`, { headers });
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.log('CloudTalk no disponible:', error);
      return [];
    }
  },

  // ==================== NUEVAS FUNCIONALIDADES ====================

  // Enviar SMS
  sendSMS: async (params: {
    from: string;
    to: string;
    message: string;
    contact_id?: string;
  }): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cloudtalk/sms`, {
        method: 'POST',
        headers,
        body: JSON.stringify(params)
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.log('CloudTalk SMS no disponible:', error);
      return { success: false, error: 'CloudTalk SMS no disponible' };
    }
  },

  // Obtener historial de SMS
  getSMS: async (params?: {
    from_date?: string;
    to_date?: string;
    limit?: number;
  }): Promise<any[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.from_date) queryParams.append('from_date', params.from_date);
      if (params?.to_date) queryParams.append('to_date', params.to_date);
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const url = `${API_BASE_URL}/cloudtalk/sms${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url, { headers });
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.log('CloudTalk SMS no disponible:', error);
      return [];
    }
  },

  // Agregar nota a una llamada
  addCallNote: async (callId: string, note: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cloudtalk/calls/${callId}/note`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ note })
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.log('Error al agregar nota:', error);
      return { success: false, error: 'No se pudo agregar la nota' };
    }
  },

  // Agregar tags a una llamada
  addCallTags: async (callId: string, tags: string[]): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cloudtalk/calls/${callId}/tags`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ tags })
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.log('Error al agregar tags:', error);
      return { success: false, error: 'No se pudieron agregar los tags' };
    }
  },

  // Obtener tags disponibles
  getTags: async (): Promise<any[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cloudtalk/tags`, { headers });
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.log('CloudTalk tags no disponibles:', error);
      return [];
    }
  },

  // Calificar una llamada
  rateCall: async (callId: string, rating: number, comment?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cloudtalk/calls/${callId}/rating`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ rating, comment })
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.log('Error al calificar llamada:', error);
      return { success: false, error: 'No se pudo calificar la llamada' };
    }
  },

  // Obtener números de teléfono disponibles
  getPhoneNumbers: async (): Promise<any[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cloudtalk/phone-numbers`, { headers });
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.log('CloudTalk phone numbers no disponibles:', error);
      return [];
    }
  },

  // Obtener estadísticas de colas
  getQueueStats: async (params?: {
    from_date?: string;
    to_date?: string;
  }): Promise<any> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.from_date) queryParams.append('from_date', params.from_date);
      if (params?.to_date) queryParams.append('to_date', params.to_date);

      const url = `${API_BASE_URL}/cloudtalk/queue-stats${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url, { headers });
      const result = await response.json();
      return result.data || {
        total_queued: 0,
        average_wait_time: 0,
        abandoned_calls: 0,
        max_wait_time: 0
      };
    } catch (error) {
      console.log('CloudTalk queue stats no disponibles:', error);
      return {
        total_queued: 0,
        average_wait_time: 0,
        abandoned_calls: 0,
        max_wait_time: 0
      };
    }
  },

  // Obtener colas
  getQueues: async (): Promise<any[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cloudtalk/queues`, { headers });
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.log('CloudTalk queues no disponibles:', error);
      return [];
    }
  },

  // Obtener voicemails
  getVoicemails: async (params?: {
    from_date?: string;
    to_date?: string;
    status?: 'new' | 'read' | 'archived';
    limit?: number;
  }): Promise<any[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.from_date) queryParams.append('from_date', params.from_date);
      if (params?.to_date) queryParams.append('to_date', params.to_date);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const url = `${API_BASE_URL}/cloudtalk/voicemails${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url, { headers });
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.log('CloudTalk voicemails no disponibles:', error);
      return [];
    }
  },

  // Marcar voicemail como leído
  markVoicemailRead: async (voicemailId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cloudtalk/voicemails/${voicemailId}/read`, {
        method: 'PUT',
        headers
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.log('Error al marcar voicemail como leído:', error);
      return { success: false, error: 'No se pudo marcar como leído' };
    }
  }
};
