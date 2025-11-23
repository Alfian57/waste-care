/**
 * Lazy Supabase client loader
 * Defers initialization until actually needed
 */

import type { Database } from '@/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient<Database> | null = null;
let supabaseAdminInstance: SupabaseClient<Database> | null = null;

/**
 * Get Supabase client instance (lazy initialization)
 */
export async function getSupabaseClient(): Promise<SupabaseClient<Database>> {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const { createClient } = await import('@supabase/supabase-js');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return supabaseInstance;
}

/**
 * Get Supabase admin client (lazy initialization)
 */
export async function getSupabaseAdmin(): Promise<SupabaseClient<Database> | null> {
  if (supabaseAdminInstance !== undefined) {
    return supabaseAdminInstance;
  }

  const { createClient } = await import('@supabase/supabase-js');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceRoleKey) {
    supabaseAdminInstance = null;
    return null;
  }

  supabaseAdminInstance = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseAdminInstance;
}

/**
 * Synchronous getter (throws if not initialized)
 * Use this only after calling getSupabaseClient() at least once
 */
export function getSupabaseSync(): SupabaseClient<Database> {
  if (!supabaseInstance) {
    throw new Error('Supabase client not initialized. Call getSupabaseClient() first.');
  }
  return supabaseInstance;
}
