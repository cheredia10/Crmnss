// CloudTalk API Integration
// Según la documentación oficial: https://www.cloudtalk.io/api-documentation
const CLOUDTALK_API_BASE = 'https://api.cloudtalk.io/api';

interface CloudTalkCall {
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

interface CloudTalkStats {
  total_calls: number;
  answered_calls: number;
  missed_calls: number;
  average_duration: number;
  total_duration: number;
}

export class CloudTalkService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    try {
      // CloudTalk usa el access_token como query parameter
      // Importante: codificar el token ya que contiene caracteres especiales como ";"
      const separator = endpoint.includes('?') ? '&' : '?';
      const encodedToken = encodeURIComponent(this.apiKey);
      const url = `${CLOUDTALK_API_BASE}${endpoint}${separator}access_token=${encodedToken}`;
      
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      };

      console.log(`📞 CloudTalk Request: ${options.method || 'GET'} ${CLOUDTALK_API_BASE}${endpoint}${separator}access_token=***`);

      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log(`📞 CloudTalk Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ CloudTalk API Error:
  - Status: ${response.status} ${response.statusText}
  - Endpoint: ${endpoint}
  - URL: ${CLOUDTALK_API_BASE}${endpoint}${separator}access_token=***
  - Error Body: ${errorText.substring(0, 500)}
  - API Key Preview: ${this.apiKey.substring(0, 10)}...${this.apiKey.substring(this.apiKey.length - 5)}
        `);
        return null;
      }

      const data = await response.json();
      console.log(`✅ CloudTalk Success: ${endpoint} - ${JSON.stringify(data).substring(0, 200)}...`);
      return data;
    } catch (error) {
      console.error(`❌ CloudTalk Network Error:
  - Endpoint: ${endpoint}
  - Error: ${error}
  - Stack: ${error instanceof Error ? error.stack : 'N/A'}
      `);
      return null;
    }
  }

  // Click-to-Call: Iniciar una llamada
  async initiateCall(from: string, to: string, contactId?: string) {
    const body: any = {
      number_from: from,
      number_to: to,
    };

    if (contactId) {
      body.contact_id = contactId;
    }

    const result = await this.request('/click-to-call', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (!result) {
      return {
        success: false,
        error: 'CloudTalk API no disponible',
      };
    }

    return {
      success: true,
      data: result,
    };
  }

  // Obtener historial de llamadas
  async getCalls(params?: {
    from_date?: string;
    to_date?: string;
    direction?: 'inbound' | 'outbound';
    status?: string;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params?.from_date) queryParams.append('date_from', params.from_date);
    if (params?.to_date) queryParams.append('date_to', params.to_date);
    if (params?.direction) queryParams.append('direction', params.direction);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('per_page', params.limit.toString());

    const endpoint = `/call-history${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const result = await this.request(endpoint);

    if (!result) {
      return {
        success: false,
        error: 'CloudTalk API no disponible',
        data: [],
      };
    }

    return {
      success: true,
      data: result.data || result || [],
    };
  }

  // Obtener detalles de una llamada específica
  async getCall(callId: string) {
    const result = await this.request(`/call/${callId}`);
    
    if (!result) {
      return {
        success: false,
        error: 'CloudTalk API no disponible',
      };
    }
    
    return {
      success: true,
      data: result,
    };
  }

  // Obtener URL de grabación de una llamada
  async getRecordingUrl(callId: string) {
    const result = await this.request(`/call/${callId}/recording`);
    
    if (!result) {
      return {
        success: false,
        error: 'CloudTalk API no disponible',
      };
    }
    
    return {
      success: true,
      url: result.url || result.recording_url || result.download_url,
    };
  }

  // Obtener estadísticas - Calculadas desde las llamadas
  async getStats(params?: {
    from_date?: string;
    to_date?: string;
  }) {
    // CloudTalk no tiene un endpoint de analytics directo en v1
    // Obtenemos las llamadas y calculamos las estadísticas localmente
    const callsResult = await this.getCalls(params);
    
    if (!callsResult.success || !callsResult.data) {
      return {
        success: false,
        error: 'CloudTalk API no disponible',
        data: {
          total_calls: 0,
          answered_calls: 0,
          missed_calls: 0,
          average_duration: 0,
          total_duration: 0,
        },
      };
    }

    const calls = callsResult.data;
    
    // Calcular estadísticas
    const total_calls = calls.length;
    const answered_calls = calls.filter((c: any) => 
      c.status === 'answered' || c.status === 'completed'
    ).length;
    const missed_calls = calls.filter((c: any) => 
      c.status === 'missed' || c.status === 'no_answer'
    ).length;
    
    const durations = calls
      .filter((c: any) => c.duration && c.duration > 0)
      .map((c: any) => c.duration);
    
    const total_duration = durations.reduce((sum: number, d: number) => sum + d, 0);
    const average_duration = durations.length > 0 
      ? Math.floor(total_duration / durations.length) 
      : 0;

    return {
      success: true,
      data: {
        total_calls,
        answered_calls,
        missed_calls,
        average_duration,
        total_duration,
      },
    };
  }

  // Obtener agentes disponibles
  async getAgents() {
    const result = await this.request('/users');
    
    if (!result) {
      return {
        success: false,
        error: 'CloudTalk API no disponible',
        data: [],
      };
    }
    
    return {
      success: true,
      data: result.data || result || [],
    };
  }

  // ==================== NUEVAS FUNCIONALIDADES ====================

  // Enviar SMS a un número
  async sendSMS(params: {
    from: string;
    to: string;
    message: string;
    contact_id?: string;
  }) {
    const body: any = {
      from: params.from,
      to: params.to,
      message: params.message,
    };

    if (params.contact_id) {
      body.contact_id = params.contact_id;
    }

    const result = await this.request('/sms', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (!result) {
      return {
        success: false,
        error: 'CloudTalk API no disponible',
      };
    }

    return {
      success: true,
      data: result,
    };
  }

  // Obtener historial de SMS
  async getSMS(params?: {
    from_date?: string;
    to_date?: string;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params?.from_date) queryParams.append('date_from', params.from_date);
    if (params?.to_date) queryParams.append('date_to', params.to_date);
    if (params?.limit) queryParams.append('per_page', params.limit.toString());

    const endpoint = `/sms${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const result = await this.request(endpoint);

    if (!result) {
      return {
        success: false,
        error: 'CloudTalk API no disponible',
        data: [],
      };
    }

    return {
      success: true,
      data: result.data || result || [],
    };
  }

  // Agregar nota a una llamada
  async addCallNote(callId: string, note: string) {
    const body = {
      note: note,
    };

    const result = await this.request(`/call/${callId}/note`, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (!result) {
      return {
        success: false,
        error: 'CloudTalk API no disponible',
      };
    }

    return {
      success: true,
      data: result,
    };
  }

  // Agregar tags a una llamada
  async addCallTags(callId: string, tags: string[]) {
    const body = {
      tags: tags,
    };

    const result = await this.request(`/call/${callId}/tags`, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (!result) {
      return {
        success: false,
        error: 'CloudTalk API no disponible',
      };
    }

    return {
      success: true,
      data: result,
    };
  }

  // Obtener tags disponibles
  async getTags() {
    const result = await this.request('/tags');
    
    if (!result) {
      return {
        success: false,
        error: 'CloudTalk API no disponible',
        data: [],
      };
    }
    
    return {
      success: true,
      data: result.data || result || [],
    };
  }

  // Calificar una llamada
  async rateCall(callId: string, rating: number, comment?: string) {
    const body: any = {
      rating: rating, // 1-5
    };

    if (comment) {
      body.comment = comment;
    }

    const result = await this.request(`/call/${callId}/rating`, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (!result) {
      return {
        success: false,
        error: 'CloudTalk API no disponible',
      };
    }

    return {
      success: true,
      data: result,
    };
  }

  // Obtener números de teléfono disponibles
  async getPhoneNumbers() {
    const result = await this.request('/phone-numbers');
    
    if (!result) {
      return {
        success: false,
        error: 'CloudTalk API no disponible',
        data: [],
      };
    }
    
    return {
      success: true,
      data: result.data || result || [],
    };
  }

  // Obtener estadísticas de colas
  async getQueueStats(params?: {
    from_date?: string;
    to_date?: string;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params?.from_date) queryParams.append('date_from', params.from_date);
    if (params?.to_date) queryParams.append('date_to', params.to_date);

    const endpoint = `/queue-stats${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const result = await this.request(endpoint);

    if (!result) {
      return {
        success: false,
        error: 'CloudTalk API no disponible',
        data: {
          total_queued: 0,
          average_wait_time: 0,
          abandoned_calls: 0,
          max_wait_time: 0,
        },
      };
    }

    return {
      success: true,
      data: result,
    };
  }

  // Obtener lista de colas
  async getQueues() {
    const result = await this.request('/queues');
    
    if (!result) {
      return {
        success: false,
        error: 'CloudTalk API no disponible',
        data: [],
      };
    }
    
    return {
      success: true,
      data: result.data || result || [],
    };
  }

  // Obtener voicemails
  async getVoicemails(params?: {
    from_date?: string;
    to_date?: string;
    status?: 'new' | 'read' | 'archived';
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params?.from_date) queryParams.append('date_from', params.from_date);
    if (params?.to_date) queryParams.append('date_to', params.to_date);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('per_page', params.limit.toString());

    const endpoint = `/voicemails${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const result = await this.request(endpoint);

    if (!result) {
      return {
        success: false,
        error: 'CloudTalk API no disponible',
        data: [],
      };
    }

    return {
      success: true,
      data: result.data || result || [],
    };
  }

  // Marcar voicemail como leído
  async markVoicemailRead(voicemailId: string) {
    const result = await this.request(`/voicemail/${voicemailId}/read`, {
      method: 'PUT',
    });

    if (!result) {
      return {
        success: false,
        error: 'CloudTalk API no disponible',
      };
    }

    return {
      success: true,
      data: result,
    };
  }
}
