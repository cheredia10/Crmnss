// Mock service para CloudTalk - Datos de demostración
// Permite usar el CRM sin una API Key válida

export class CloudTalkMockService {
  // Agentes de ejemplo
  private mockAgents = [
    {
      id: 1,
      name: 'María García',
      email: 'maria.garcia@empresa.com',
      status: 'available',
      phone: '+34 911 234 567',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: 2,
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@empresa.com',
      status: 'on_call',
      phone: '+34 911 234 568',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    {
      id: 3,
      name: 'Ana Martínez',
      email: 'ana.martinez@empresa.com',
      status: 'offline',
      phone: '+34 911 234 569',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    {
      id: 4,
      name: 'David López',
      email: 'david.lopez@empresa.com',
      status: 'available',
      phone: '+34 911 234 570',
      avatar: 'https://i.pravatar.cc/150?img=7'
    }
  ];

  // Clientes de ejemplo
  private mockCustomers = [
    {
      id: 1,
      name: 'Acme Corporation',
      contact_name: 'Juan Pérez',
      phone: '+34 912 345 678',
      email: 'juan.perez@acme.com',
      company: 'Acme Corporation',
      status: 'active',
      created_at: '2025-01-15T10:30:00Z',
      last_contact: '2025-11-27T14:20:00Z'
    },
    {
      id: 2,
      name: 'TechStart SL',
      contact_name: 'Laura Sánchez',
      phone: '+34 913 456 789',
      email: 'laura.sanchez@techstart.es',
      company: 'TechStart SL',
      status: 'active',
      created_at: '2025-02-20T09:15:00Z',
      last_contact: '2025-11-26T16:45:00Z'
    },
    {
      id: 3,
      name: 'Global Innovations',
      contact_name: 'Miguel Torres',
      phone: '+34 914 567 890',
      email: 'miguel.torres@globalinnovations.com',
      company: 'Global Innovations',
      status: 'inactive',
      created_at: '2025-03-10T11:00:00Z',
      last_contact: '2025-10-15T10:30:00Z'
    }
  ];

  // Llamadas de ejemplo
  private generateMockCalls() {
    const calls = [];
    const now = new Date();
    const directions = ['inbound', 'outbound'];
    const statuses = ['answered', 'missed', 'voicemail', 'busy'];
    
    for (let i = 0; i < 50; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);
      
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const agent = this.mockAgents[Math.floor(Math.random() * this.mockAgents.length)];
      const customer = this.mockCustomers[Math.floor(Math.random() * this.mockCustomers.length)];
      
      calls.push({
        id: `call_${1000 + i}`,
        direction,
        status,
        from: direction === 'inbound' ? customer.phone : agent.phone,
        to: direction === 'inbound' ? agent.phone : customer.phone,
        duration: status === 'answered' ? Math.floor(Math.random() * 600) + 30 : 0,
        timestamp: date.toISOString(),
        agent_id: agent.id,
        agent_name: agent.name,
        customer_id: customer.id,
        customer_name: customer.contact_name,
        customer_company: customer.company,
        phone: customer.phone,
        recording_url: status === 'answered' ? `https://example.com/recordings/${1000 + i}.mp3` : null,
        notes: status === 'answered' ? this.getRandomNote() : null,
        tags: this.getRandomTags()
      });
    }
    
    return calls.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  private getRandomNote() {
    const notes = [
      'Cliente interesado en el nuevo producto',
      'Solicita información sobre precios',
      'Seguimiento de propuesta comercial',
      'Consulta técnica sobre el servicio',
      'Renovación de contrato',
      'Queja sobre el servicio - resuelto',
      'Solicita demo del producto',
      'Pregunta sobre facturación'
    ];
    return notes[Math.floor(Math.random() * notes.length)];
  }

  private getRandomTags() {
    const allTags = ['venta', 'soporte', 'consulta', 'urgente', 'seguimiento', 'nuevo_cliente'];
    const numTags = Math.floor(Math.random() * 3);
    const tags = [];
    for (let i = 0; i < numTags; i++) {
      const tag = allTags[Math.floor(Math.random() * allTags.length)];
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    }
    return tags;
  }

  // API Methods

  async getAgents() {
    await this.simulateDelay();
    return {
      success: true,
      data: this.mockAgents
    };
  }

  async getCalls(params?: {
    limit?: number;
    from_date?: string;
    to_date?: string;
    direction?: string;
    status?: string;
  }) {
    await this.simulateDelay();
    
    let calls = this.generateMockCalls();
    
    // Filter by date range
    if (params?.from_date) {
      calls = calls.filter(c => c.timestamp >= params.from_date);
    }
    if (params?.to_date) {
      calls = calls.filter(c => c.timestamp <= params.to_date);
    }
    
    // Filter by direction
    if (params?.direction) {
      calls = calls.filter(c => c.direction === params.direction);
    }
    
    // Filter by status
    if (params?.status) {
      calls = calls.filter(c => c.status === params.status);
    }
    
    // Apply limit
    if (params?.limit) {
      calls = calls.slice(0, params.limit);
    }
    
    return {
      success: true,
      data: calls
    };
  }

  async getCall(callId: string) {
    await this.simulateDelay();
    
    const calls = this.generateMockCalls();
    const call = calls.find(c => c.id === callId);
    
    if (!call) {
      return {
        success: false,
        error: 'Llamada no encontrada'
      };
    }
    
    return {
      success: true,
      data: call
    };
  }

  async getStats(params?: {
    from_date?: string;
    to_date?: string;
  }) {
    await this.simulateDelay();
    
    const calls = this.generateMockCalls();
    
    let filteredCalls = calls;
    if (params?.from_date) {
      filteredCalls = filteredCalls.filter(c => c.timestamp >= params.from_date);
    }
    if (params?.to_date) {
      filteredCalls = filteredCalls.filter(c => c.timestamp <= params.to_date);
    }
    
    const totalCalls = filteredCalls.length;
    const answeredCalls = filteredCalls.filter(c => c.status === 'answered').length;
    const missedCalls = filteredCalls.filter(c => c.status === 'missed').length;
    const inboundCalls = filteredCalls.filter(c => c.direction === 'inbound').length;
    const outboundCalls = filteredCalls.filter(c => c.direction === 'outbound').length;
    
    const totalDuration = filteredCalls
      .filter(c => c.status === 'answered')
      .reduce((sum, c) => sum + c.duration, 0);
    
    const avgDuration = answeredCalls > 0 ? Math.floor(totalDuration / answeredCalls) : 0;
    
    return {
      success: true,
      data: {
        total_calls: totalCalls,
        answered_calls: answeredCalls,
        missed_calls: missedCalls,
        inbound_calls: inboundCalls,
        outbound_calls: outboundCalls,
        total_duration: totalDuration,
        avg_duration: avgDuration,
        answer_rate: totalCalls > 0 ? Math.round((answeredCalls / totalCalls) * 100) : 0
      }
    };
  }

  async getCustomers() {
    await this.simulateDelay();
    return {
      success: true,
      data: this.mockCustomers
    };
  }

  // Simular delay de red
  private async simulateDelay() {
    const delay = Math.floor(Math.random() * 300) + 100; // 100-400ms
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  // ==================== NUEVAS FUNCIONALIDADES ====================

  // SMS de ejemplo
  private generateMockSMS() {
    const sms = [];
    const now = new Date();
    
    for (let i = 0; i < 15; i++) {
      const daysAgo = Math.floor(Math.random() * 10);
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);
      
      const customer = this.mockCustomers[Math.floor(Math.random() * this.mockCustomers.length)];
      const agent = this.mockAgents[Math.floor(Math.random() * this.mockAgents.length)];
      const direction = Math.random() > 0.5 ? 'inbound' : 'outbound';
      
      sms.push({
        id: `sms_${2000 + i}`,
        direction,
        from: direction === 'inbound' ? customer.phone : agent.phone,
        to: direction === 'inbound' ? agent.phone : customer.phone,
        message: direction === 'inbound' 
          ? this.getRandomInboundSMS()
          : this.getRandomOutboundSMS(),
        status: 'delivered',
        timestamp: date.toISOString(),
        customer_id: customer.id,
        customer_name: customer.contact_name,
        agent_id: agent.id,
        agent_name: agent.name
      });
    }
    
    return sms.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  private getRandomInboundSMS() {
    const messages = [
      'Hola, ¿pueden enviarme información sobre el producto?',
      'Necesito soporte urgente con mi cuenta',
      'Gracias por la atención, todo resuelto',
      '¿Cuándo estará disponible la nueva versión?',
      'Me gustaría agendar una reunión esta semana'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  private getRandomOutboundSMS() {
    const messages = [
      'Le enviamos la información solicitada por email',
      'Su cita está confirmada para mañana a las 10:00',
      'Gracias por contactarnos, estamos revisando su caso',
      'La nueva versión estará disponible la próxima semana',
      'Perfecto, agendamos la reunión para el jueves'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Voicemails de ejemplo
  private generateMockVoicemails() {
    const voicemails = [];
    const now = new Date();
    const statuses = ['new', 'read', 'archived'];
    
    for (let i = 0; i < 8; i++) {
      const daysAgo = Math.floor(Math.random() * 15);
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);
      
      const customer = this.mockCustomers[Math.floor(Math.random() * this.mockCustomers.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      voicemails.push({
        id: `vm_${3000 + i}`,
        from: customer.phone,
        customer_name: customer.contact_name,
        customer_company: customer.company,
        duration: Math.floor(Math.random() * 120) + 15,
        timestamp: date.toISOString(),
        status,
        transcription: this.getRandomVoicemailTranscription(),
        recording_url: `https://example.com/voicemails/${3000 + i}.mp3`
      });
    }
    
    return voicemails.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  private getRandomVoicemailTranscription() {
    const transcriptions = [
      'Hola, soy Juan de Acme. Me gustaría hablar sobre la renovación del contrato. Por favor llámenme al +34 912 345 678.',
      'Buenos días, necesito soporte técnico urgente. Mi sistema no está funcionando correctamente.',
      'Llamaba para confirmar la reunión de mañana. Gracias.',
      'Quisiera información sobre los nuevos precios. Pueden contactarme por email.',
      'Hola, tengo una duda sobre la facturación del mes pasado.'
    ];
    return transcriptions[Math.floor(Math.random() * transcriptions.length)];
  }

  // Números de teléfono disponibles
  private mockPhoneNumbers = [
    {
      id: 1,
      number: '+34 911 234 567',
      country: 'ES',
      type: 'local',
      status: 'active',
      assigned_to: 'María García'
    },
    {
      id: 2,
      number: '+34 911 234 568',
      country: 'ES',
      type: 'local',
      status: 'active',
      assigned_to: 'Carlos Rodríguez'
    },
    {
      id: 3,
      number: '+34 900 123 456',
      country: 'ES',
      type: 'toll_free',
      status: 'active',
      assigned_to: 'General'
    }
  ];

  // Tags disponibles
  private mockTags = [
    { id: 1, name: 'venta', color: '#28a745' },
    { id: 2, name: 'soporte', color: '#dc3545' },
    { id: 3, name: 'consulta', color: '#ffc107' },
    { id: 4, name: 'urgente', color: '#fd7e14' },
    { id: 5, name: 'seguimiento', color: '#17a2b8' },
    { id: 6, name: 'nuevo_cliente', color: '#6f42c1' }
  ];

  // Colas
  private mockQueues = [
    {
      id: 1,
      name: 'Soporte Técnico',
      waiting: 3,
      agents_available: 2,
      max_wait_time: 180
    },
    {
      id: 2,
      name: 'Ventas',
      waiting: 1,
      agents_available: 3,
      max_wait_time: 90
    }
  ];

  // Nuevos métodos de API

  async sendSMS(params: any) {
    await this.simulateDelay();
    return {
      success: true,
      data: {
        id: `sms_${Date.now()}`,
        status: 'sent',
        ...params
      }
    };
  }

  async getSMS(params?: any) {
    await this.simulateDelay();
    return {
      success: true,
      data: this.generateMockSMS()
    };
  }

  async addCallNote(callId: string, note: string) {
    await this.simulateDelay();
    return {
      success: true,
      data: { callId, note, timestamp: new Date().toISOString() }
    };
  }

  async addCallTags(callId: string, tags: string[]) {
    await this.simulateDelay();
    return {
      success: true,
      data: { callId, tags }
    };
  }

  async getTags() {
    await this.simulateDelay();
    return {
      success: true,
      data: this.mockTags
    };
  }

  async rateCall(callId: string, rating: number, comment?: string) {
    await this.simulateDelay();
    return {
      success: true,
      data: { callId, rating, comment, timestamp: new Date().toISOString() }
    };
  }

  async getPhoneNumbers() {
    await this.simulateDelay();
    return {
      success: true,
      data: this.mockPhoneNumbers
    };
  }

  async getQueueStats(params?: any) {
    await this.simulateDelay();
    return {
      success: true,
      data: {
        total_queued: 4,
        average_wait_time: 120,
        abandoned_calls: 2,
        max_wait_time: 300,
        queues: this.mockQueues
      }
    };
  }

  async getQueues() {
    await this.simulateDelay();
    return {
      success: true,
      data: this.mockQueues
    };
  }

  async getVoicemails(params?: any) {
    await this.simulateDelay();
    let voicemails = this.generateMockVoicemails();
    
    if (params?.status) {
      voicemails = voicemails.filter(v => v.status === params.status);
    }
    
    return {
      success: true,
      data: voicemails
    };
  }

  async markVoicemailRead(voicemailId: string) {
    await this.simulateDelay();
    return {
      success: true,
      data: { voicemailId, status: 'read' }
    };
  }

  async getRecordingUrl(callId: string) {
    await this.simulateDelay();
    return {
      success: true,
      url: `https://example.com/recordings/${callId}.mp3`
    };
  }

  async initiateCall(from: string, to: string, contactId?: string) {
    await this.simulateDelay();
    return {
      success: true,
      data: {
        id: `call_${Date.now()}`,
        from,
        to,
        contactId,
        status: 'initiated',
        timestamp: new Date().toISOString()
      }
    };
  }
}
