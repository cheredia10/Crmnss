import { Injectable } from '@angular/core';
import { SupabaseClientService } from './supabase-client.service';
import { environment } from '../../../environments/environment';

export interface CloudTalkStats {
  total_calls: number;
  answered_calls: number;
  missed_calls: number;
  average_duration: number;
  demo_mode?: boolean;
}

export interface CloudTalkCall {
  id: string;
  call_id: string;
  client_name: string;
  client_company: string;
  phone_number: string;
  direction: 'inbound' | 'outbound';
  status: string;
  duration: number;
  created_at: string;
  recording_url?: string;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class CloudtalkService {
  private baseUrl = environment.cloudtalkBaseUrl;
  private supabase = this.supabaseService.supabase;

  constructor(private supabaseService: SupabaseClientService) {}

  private async getToken(): Promise<string> {
    const { data } = await this.supabase.auth.getSession();
    return data.session?.access_token || '';
  }

  async getStats(params: { from_date: string; to_date: string }): Promise<CloudTalkStats> {
    try {
      const token = await this.getToken();
      const url = `${this.baseUrl}/make-server-d03ded2a/cloudtalk/stats?from_date=${params.from_date}&to_date=${params.to_date}`;
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error fetching CloudTalk stats');
      return await res.json();
    } catch {
      return { total_calls: 0, answered_calls: 0, missed_calls: 0, average_duration: 0, demo_mode: false };
    }
  }

  async getCalls(params?: { page?: number; limit?: number; search?: string; direction?: string }): Promise<{ data: CloudTalkCall[]; total: number }> {
    try {
      const token = await this.getToken();
      const query = new URLSearchParams({
        page: String(params?.page ?? 1),
        limit: String(params?.limit ?? 20),
        ...(params?.search ? { search: params.search } : {}),
        ...(params?.direction ? { direction: params.direction } : {})
      });
      const res = await fetch(`${this.baseUrl}/make-server-d03ded2a/cloudtalk/calls?${query}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error fetching calls');
      return await res.json();
    } catch {
      return { data: [], total: 0 };
    }
  }

  async getConfig(): Promise<any> {
    try {
      const token = await this.getToken();
      const res = await fetch(`${this.baseUrl}/make-server-d03ded2a/cloudtalk/config`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return await res.json();
    } catch {
      return {};
    }
  }

  async saveConfig(apiKey: string): Promise<{ success: boolean; error?: string }> {
    try {
      const token = await this.getToken();
      const res = await fetch(`${this.baseUrl}/make-server-d03ded2a/cloudtalk/config`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKey })
      });
      const result = await res.json();
      return result;
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }
}
