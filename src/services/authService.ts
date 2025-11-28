import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info.tsx';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

export interface User {
  id: string;
  email: string;
  nombre: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  accessToken?: string;
}

// Iniciar sesión
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data.session) {
      return {
        success: false,
        error: 'No se pudo crear la sesión',
      };
    }

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email || '',
        nombre: data.user.user_metadata?.nombre || 'Usuario',
      },
      accessToken: data.session.access_token,
    };
  } catch (error) {
    return {
      success: false,
      error: String(error),
    };
  }
}

// Registrar nuevo usuario
export async function signUp(nombre: string, email: string, password: string): Promise<AuthResponse> {
  try {
    const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-d03ded2a`;
    
    const response = await fetch(`${serverUrl}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ nombre, email, password }),
    });

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Error al registrar usuario',
      };
    }

    // Después de registrar, iniciar sesión automáticamente
    return await signIn(email, password);
  } catch (error) {
    return {
      success: false,
      error: String(error),
    };
  }
}

// Cerrar sesión
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

// Enviar email de recuperación de contraseña
export async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: String(error),
    };
  }
}

// Actualizar contraseña
export async function updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: String(error),
    };
  }
}

// Obtener sesión actual
export async function getSession(): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      return {
        success: false,
        error: 'No hay sesión activa',
      };
    }

    return {
      success: true,
      user: {
        id: data.session.user.id,
        email: data.session.user.email || '',
        nombre: data.session.user.user_metadata?.nombre || 'Usuario',
      },
      accessToken: data.session.access_token,
    };
  } catch (error) {
    return {
      success: false,
      error: String(error),
    };
  }
}

// Listener para cambios en autenticación
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email || '',
        nombre: session.user.user_metadata?.nombre || 'Usuario',
      });
    } else {
      callback(null);
    }
  });
}
