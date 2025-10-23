import { supabase } from './supabase';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

/**
 * Login dengan email dan password
 */
export const loginWithEmail = async (credentials: LoginCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  return { data, error };
};

/**
 * Register user baru dengan email dan password
 */
export const registerWithEmail = async (registerData: RegisterData) => {
  const { data, error } = await supabase.auth.signUp({
    email: registerData.email,
    password: registerData.password,
    options: {
      data: {
        full_name: registerData.fullName,
      },
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  });

  return { data, error };
};

/**
 * Login dengan Google OAuth
 */
export const loginWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  return { data, error };
};

/**
 * Logout user
 */
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

/**
 * Get current user session
 */
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

/**
 * Get current session
 */
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};
