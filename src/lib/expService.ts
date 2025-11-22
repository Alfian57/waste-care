import { supabase } from './supabase';
import { EXP_CONFIG, type ExpActionType } from '@/config/exp.config';
import type { Database } from '@/types/database.types';

/**
 * Service untuk mengelola Experience Points (EXP) user
 */

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

interface AddExpParams {
  userId: string;
  amount: number;
  action: ExpActionType;
}

interface AddExpResult {
  success: boolean;
  newExp?: number;
  error?: string;
}

/**
 * Menambahkan EXP ke user profile
 * 
 * @param params - Parameter untuk menambahkan EXP
 * @returns Result dengan status dan new exp value
 */
export async function addExpToUser(params: AddExpParams): Promise<AddExpResult> {
  try {
    const { userId, amount, action } = params;

    // Try using RPC function first (if available in Supabase)
    try {
      const { data: rpcResult, error: rpcError } = await supabase
        // @ts-expect-error - RPC function may not exist yet in database
        .rpc('add_exp_to_profile', {
          user_id: userId,
          exp_amount: amount
        });

      // @ts-expect-error - Dynamic RPC result type
      if (!rpcError && rpcResult && Array.isArray(rpcResult) && rpcResult.length > 0) {
        // @ts-expect-error - Dynamic RPC result
        const newExp = rpcResult[0].new_exp;
        return {
          success: true,
          newExp,
        };
      }
      
    } catch (rpcError) {
      // Log RPC error but fallback to manual update
    }

    // Fallback: Manual update
    // First, ensure profile exists
    const profileExists = await ensureProfileExists(userId);
    if (!profileExists) {
      console.error('[EXP] Failed to ensure profile exists');
      return {
        success: false,
        error: 'Gagal memastikan profil user ada',
      };
    }

    // Get current exp
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('exp')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('[EXP] Error fetching user profile:', fetchError);
      console.error('[EXP] Fetch error details:', {
        code: fetchError.code,
        message: fetchError.message,
        details: fetchError.details,
        hint: fetchError.hint,
      });
      return {
        success: false,
        error: `Gagal mengambil data profil user: ${fetchError.message}`,
      };
    }

    if (!profile) {
      console.error('[EXP] Profile not found after ensureProfileExists');
      return {
        success: false,
        error: 'Profil user tidak ditemukan',
      };
    }

    // @ts-expect-error - Supabase type inference issue
    const currentExp = profile?.exp || 0;
    const newExp = currentExp + amount;

    // Verify we're updating the correct user (auth.uid() should match userId)
    let session = null;
    try {
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Session timeout')), 3000)
      );
      
      const { data: { session: currentSession } } = await Promise.race([
        sessionPromise,
        timeoutPromise
      ]) as any;
      
      session = currentSession;
    } catch (sessionError) {
      console.error('[EXP] Failed to get session:', sessionError);
      return {
        success: false,
        error: 'Gagal mendapatkan session. Mohon login ulang.',
      };
    }
    
    if (!session?.user?.id) {
      console.error('[EXP] No active session found');
      return {
        success: false,
        error: 'Tidak ada sesi aktif',
      };
    }

    if (session.user.id !== userId) {
      console.error('[EXP] Session user ID does not match target user ID');
      return {
        success: false,
        error: 'User ID tidak cocok dengan sesi',
      };
    }

    // Update exp using the session user's ID
    const profileUpdate: ProfileUpdate = { exp: newExp };
    
    const { data: updateResult, error: updateError } = await supabase
      .from('profiles')
      // @ts-expect-error - Supabase type inference issue with profiles table
      .update(profileUpdate)
      .eq('id', session.user.id)  // Use session user ID instead
      .select();

    if (updateError) {
      console.error('[EXP] Error updating user exp:', updateError);
      console.error('[EXP] Update error details:', {
        code: updateError.code,
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint,
      });
      return {
        success: false,
        error: `Gagal mengupdate EXP user: ${updateError.message}`,
      };
    }

    if (!updateResult || updateResult.length === 0) {
      console.error('[EXP] Update returned no rows');
      return {
        success: false,
        error: 'Update tidak mempengaruhi row manapun',
      };
    }

    return {
      success: true,
      newExp,
    };
  } catch (error) {
    console.error('[EXP] Error in addExpToUser:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Menambahkan EXP untuk membuat report
 */
export async function addExpForCreateReport(userId: string): Promise<AddExpResult> {
  return addExpToUser({
    userId,
    amount: EXP_CONFIG.CREATE_REPORT,
    action: 'CREATE_REPORT',
  });
}

/**
 * Menambahkan EXP untuk join campaign
 */
export async function addExpForJoinCampaign(userId: string): Promise<AddExpResult> {
  return addExpToUser({
    userId,
    amount: EXP_CONFIG.JOIN_CAMPAIGN,
    action: 'JOIN_CAMPAIGN',
  });
}

/**
 * Menambahkan EXP untuk complete campaign (untuk future use)
 */
export async function addExpForCompleteCampaign(userId: string): Promise<AddExpResult> {
  return addExpToUser({
    userId,
    amount: EXP_CONFIG.COMPLETE_CAMPAIGN,
    action: 'COMPLETE_CAMPAIGN',
  });
}

/**
 * Menambahkan EXP untuk create campaign (untuk future use)
 */
export async function addExpForCreateCampaign(userId: string): Promise<AddExpResult> {
  return addExpToUser({
    userId,
    amount: EXP_CONFIG.CREATE_CAMPAIGN,
    action: 'CREATE_CAMPAIGN',
  });
}

/**
 * Mendapatkan total EXP user
 */
export async function getUserExp(userId: string): Promise<number> {
  try {
    // Get session to verify user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      console.error('[EXP] No active session for getUserExp');
      return 0;
    }

    // Verify session user matches target user
    if (session.user.id !== userId) {
      console.error('[EXP] Session user ID does not match target user ID in getUserExp');
      return 0;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('exp')
      .eq('id', session.user.id)  // Use session user ID
      .maybeSingle();

    if (error) {
      console.error('[EXP] Error fetching user exp:', error);
      return 0;
    }

    // If no profile exists, return 0
    if (!data) {
      return 0;
    }

    // @ts-expect-error - Supabase type inference issue
    return data.exp || 0;
  } catch (error) {
    console.error('[EXP] Error in getUserExp:', error);
    return 0;
  }
}

/**
 * Cache untuk profile checks (in-memory, per session)
 * Prevents duplicate profile queries within same page load
 */
const profileExistsCache = new Map<string, { exists: boolean; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minute

/**
 * Memastikan profile user exists di database
 * Buat profile baru jika belum ada
 * Uses in-memory cache to prevent duplicate queries
 */
export async function ensureProfileExists(userId: string): Promise<boolean> {
  try {
    // Check cache first
    const cached = profileExistsCache.get(userId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.exists;
    }

    // Get session to verify user with timeout
    let session = null;
    try {
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Session timeout')), 3000)
      );
      
      const { data: { session: currentSession } } = await Promise.race([
        sessionPromise,
        timeoutPromise
      ]) as any;
      
      session = currentSession;
    } catch (sessionError) {
      console.error('[EXP] Failed to get session in ensureProfileExists:', sessionError);
      return false;
    }
    
    if (!session?.user?.id) {
      console.error('[EXP] No active session for ensureProfileExists');
      return false;
    }

    // Verify session user matches target user
    if (session.user.id !== userId) {
      console.error('[EXP] Session user ID does not match target user ID in ensureProfileExists');
      return false;
    }
    
    // Check if profile exists
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)  // Use session user ID
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('[EXP] Error checking profile:', error);
      return false;
    }

    // If profile exists, cache and return true
    if (data) {
      profileExistsCache.set(userId, { exists: true, timestamp: Date.now() });
      return true;
    }

    // Create new profile using session user ID
    const newProfile: ProfileInsert = { id: session.user.id, exp: 0 };
    const { error: insertError } = await supabase
      .from('profiles')
      // @ts-expect-error - Supabase type inference issue with profiles table
      .insert(newProfile);

    if (insertError) {
      // Check if error is due to duplicate key (profile was created by another request)
      if (insertError.code === '23505') {
        profileExistsCache.set(userId, { exists: true, timestamp: Date.now() });
        return true;
      }
      console.error('[EXP] Error creating profile:', insertError);
      return false;
    }

    // Cache success
    profileExistsCache.set(userId, { exists: true, timestamp: Date.now() });
    return true;
  } catch (error) {
    console.error('[EXP] Error in ensureProfileExists:', error);
    return false;
  }
}

/**
 * Clear profile exists cache (useful for testing or logout)
 */
export function clearProfileCache(userId?: string): void {
  if (userId) {
    profileExistsCache.delete(userId);
  } else {
    profileExistsCache.clear();
  }
}

/**
 * Helper function untuk calculate level dari EXP (untuk future use)
 * Asumsi: setiap 1000 EXP = 1 level
 */
export function calculateLevel(exp: number): number {
  return Math.floor(exp / 1000) + 1;
}

/**
 * Helper function untuk calculate progress ke level berikutnya (untuk future use)
 */
export function calculateLevelProgress(exp: number): {
  currentLevel: number;
  nextLevel: number;
  currentLevelExp: number;
  nextLevelExp: number;
  progress: number; // 0-100
} {
  const currentLevel = calculateLevel(exp);
  const nextLevel = currentLevel + 1;
  const currentLevelExp = (currentLevel - 1) * 1000;
  const nextLevelExp = currentLevel * 1000;
  const expInCurrentLevel = exp - currentLevelExp;
  const expNeededForNextLevel = nextLevelExp - currentLevelExp;
  const progress = (expInCurrentLevel / expNeededForNextLevel) * 100;

  return {
    currentLevel,
    nextLevel,
    currentLevelExp,
    nextLevelExp,
    progress: Math.min(100, Math.max(0, progress)),
  };
}
