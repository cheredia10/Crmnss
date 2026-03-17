import { Injectable, signal } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { SupabaseClientService } from './supabase-client.service';

export interface CrmUser {
  id: string;
  email: string;
  nombre: string;
}

export interface AuthResult {
  success: boolean;
  user?: CrmUser;
  error?: string;
  accessToken?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase;

  currentUser = signal<CrmUser | null>(null);
  isLoading = signal(true);

  constructor(private supabaseService: SupabaseClientService) {
    this.supabase = supabaseService.supabase;
    this.initSession();
  }

  private async initSession(): Promise<void> {
    const { data } = await this.supabase.auth.getSession();
    if (data.session?.user) {
      this.currentUser.set(this.mapUser(data.session.user));
    }
    this.isLoading.set(false);

    this.supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        this.currentUser.set(this.mapUser(session.user));
      } else {
        this.currentUser.set(null);
      }
    });
  }

  private mapUser(user: User): CrmUser {
    return {
      id: user.id,
      email: user.email || '',
      nombre: (user.user_metadata as any)?.['nombre'] || 'Usuario'
    };
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      if (!data.session) return { success: false, error: 'No se pudo crear la sesión' };
      const user = this.mapUser(data.user);
      this.currentUser.set(user);
      return { success: true, user, accessToken: data.session.access_token };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
    this.currentUser.set(null);
  }

  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }
}
