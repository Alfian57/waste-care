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

    console.log(`[EXP] Adding ${amount} EXP to user ${userId} for action: ${action}`);

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
        console.log(`[EXP] Successfully updated exp to ${newExp} via RPC`);
        return {
          success: true,
          newExp,
        };
      }
      
      console.log('[EXP] RPC function not available, using fallback method');
    } catch (rpcError) {
      console.log('[EXP] RPC function error, using fallback method:', rpcError);
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

    console.log(`[EXP] Updating exp from ${currentExp} to ${newExp}`);

    // Verify we're updating the correct user (auth.uid() should match userId)
    const { data: { session } } = await supabase.auth.getSession();
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

    console.log('[EXP] Session verified, user ID:', session.user.id);

    // Update exp using the session user's ID
    const profileUpdate: ProfileUpdate = { exp: newExp };
    console.log('[EXP] Attempting update with data:', profileUpdate);
    console.log('[EXP] Update condition: id =', session.user.id);
    
    const { data: updateResult, error: updateError } = await supabase
      .from('profiles')
      // @ts-expect-error - Supabase type inference issue with profiles table
      .update(profileUpdate)
      .eq('id', session.user.id)  // Use session user ID instead
      .select();

    console.log('[EXP] Update result:', { updateResult, updateError });

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

    console.log(`[EXP] Successfully updated exp to ${newExp}`);
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
      console.log('[EXP] No profile found for user, returning 0');
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
 * Memastikan profile user exists di database
 * Buat profile baru jika belum ada
 */
export async function ensureProfileExists(userId: string): Promise<boolean> {
  try {
    console.log(`[EXP] Ensuring profile exists for user: ${userId}`);
    
    // Get session to verify user
    const { data: { session } } = await supabase.auth.getSession();
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

    // If profile exists, return true
    if (data) {
      console.log(`[EXP] Profile already exists for user: ${userId}`);
      return true;
    }

    // Create new profile using session user ID
    console.log(`[EXP] Creating new profile for user: ${userId}`);
    const newProfile: ProfileInsert = { id: session.user.id, exp: 0 };
    const { error: insertError } = await supabase
      .from('profiles')
      // @ts-expect-error - Supabase type inference issue with profiles table
      .insert(newProfile);

    if (insertError) {
      // Check if error is due to duplicate key (profile was created by another request)
      if (insertError.code === '23505') {
        console.log('[EXP] Profile already exists (created by concurrent request)');
        return true;
      }
      console.error('[EXP] Error creating profile:', insertError);
      return false;
    }

    console.log(`[EXP] Successfully created profile for user: ${userId}`);
    return true;
  } catch (error) {
    console.error('[EXP] Error in ensureProfileExists:', error);
    return false;
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
