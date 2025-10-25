import { supabase } from './supabase';
import { EXP_CONFIG, type ExpActionType } from '@/config/exp.config';

/**
 * Service untuk mengelola Experience Points (EXP) user
 */

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
    const { userId, amount } = params;

    // Get current exp
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('exp')
      .eq('id', userId)
      .maybeSingle(); // Use maybeSingle to handle 0 rows

    // If profile doesn't exist, create it first
    if (!profile && !fetchError) {
      const { error: createError } = await supabase
        .from('profiles')
        .insert({ id: userId, exp: amount } as never);

      if (createError) {
        console.error('Error creating user profile:', createError);
        return {
          success: false,
          error: 'Gagal membuat profil user',
        };
      }

      return {
        success: true,
        newExp: amount,
      };
    }

    if (fetchError) {
      console.error('Error fetching user profile:', fetchError);
      return {
        success: false,
        error: 'Gagal mengambil data profil user',
      };
    }

    const currentExp = profile ? ((profile as unknown) as { exp: number }).exp || 0 : 0;
    const newExp = currentExp + amount;

    // Update exp
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ exp: newExp } as never)
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating user exp:', updateError);
      return {
        success: false,
        error: 'Gagal mengupdate EXP user',
      };
    }

    return {
      success: true,
      newExp,
    };
  } catch (error) {
    console.error('Error in addExpToUser:', error);
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
    const { data, error } = await supabase
      .from('profiles')
      .select('exp')
      .eq('id', userId)
      .maybeSingle(); // Use maybeSingle instead of single to handle 0 rows

    if (error) {
      console.error('Error fetching user exp:', error);
      return 0;
    }

    // If no profile exists, return 0
    if (!data) {
      return 0;
    }

    return data ? ((data as unknown) as { exp: number }).exp || 0 : 0;
  } catch (error) {
    console.error('Error in getUserExp:', error);
    return 0;
  }
}

/**
 * Memastikan profile user exists di database
 * Buat profile baru jika belum ada
 */
export async function ensureProfileExists(userId: string): Promise<boolean> {
  try {
    // Check if profile exists
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking profile:', error);
      return false;
    }

    // If profile exists, return true
    if (data) {
      return true;
    }

    // Create new profile
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({ id: userId, exp: 0 } as never);

    if (insertError) {
      console.error('Error creating profile:', insertError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in ensureProfileExists:', error);
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
