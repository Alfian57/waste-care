import { supabase } from './supabase';

export interface LeaderboardEntry {
  id: string;
  exp: number;
  rank: number;
  email?: string;
  displayName?: string;
}

/**
 * Censor email for privacy
 * Example: john.doe@example.com -> j***e@example.com
 */
function censorEmail(email: string): string {
  if (!email) return 'Anonymous';
  
  const [username, domain] = email.split('@');
  if (!username || !domain) return 'Anonymous';
  
  // Show first char + *** + last char for username
  if (username.length <= 2) {
    return `${username[0]}***@${domain}`;
  }
  
  const firstChar = username[0];
  const lastChar = username[username.length - 1];
  const censored = `${firstChar}***${lastChar}@${domain}`;
  
  return censored;
}

export const leaderboardService = {
  /**
   * Get top users by exp for leaderboard
   * @param limit - Number of users to fetch (default: 100)
   */
  async getLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    try {
      // Get profiles ordered by exp descending
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, exp, created_at')
        .order('exp', { ascending: false })
        .order('created_at', { ascending: true }) // Secondary sort for ties
        .limit(limit)
        .returns<Array<{ id: string; exp: number; created_at: string }>>();

      if (profilesError) throw profilesError;
      if (!profiles) return [];

      // Get emails for all users via API route
      const userIds = profiles.map(p => p.id);
      const emailMap = new Map<string, string>();

      try {
        const response = await fetch('/api/leaderboard/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userIds }),
        });

        if (response.ok) {
          const { users } = await response.json();
          users.forEach((user: { id: string; email: string }) => {
            emailMap.set(user.id, user.email);
          });
        }
      } catch (error) {
        console.warn('Failed to fetch user emails, using fallback:', error);
      }

      // Map to leaderboard entries with proper ranking (handles ties)
      const leaderboard: LeaderboardEntry[] = [];
      
      for (let i = 0; i < profiles.length; i++) {
        const profile = profiles[i];
        
        // Always use position + 1 as rank for simplicity
        // This ensures no duplicate ranks even with same EXP
        const currentRank = i + 1;
        
        const email = emailMap.get(profile.id);
        const displayName = email ? censorEmail(email) : `User ${profile.id.slice(0, 8)}`;
        
        leaderboard.push({
          id: profile.id,
          exp: profile.exp,
          rank: currentRank,
          displayName,
          email: email ? censorEmail(email) : undefined
        });
      }

      return leaderboard;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  },

  /**
   * Get user's rank and position in leaderboard
   * @param userId - User ID to find rank for
   */
  async getUserRank(userId: string): Promise<{ rank: number; exp: number; total: number } | null> {
    try {
      // Get user's exp and created_at
      const { data: userProfile, error: userError } = await supabase
        .from('profiles')
        .select('exp, created_at')
        .eq('id', userId)
        .single<{ exp: number; created_at: string }>();

      if (userError) throw userError;
      if (!userProfile) return null;

      // Count users with higher exp
      const { count: higherExpCount, error: higherExpError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gt('exp', userProfile.exp);

      if (higherExpError) throw higherExpError;

      // Count users with same exp but earlier created_at (for tie-breaking)
      const { count: sameExpEarlierCount, error: sameExpError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('exp', userProfile.exp)
        .lt('created_at', userProfile.created_at);

      if (sameExpError) throw sameExpError;

      // Get total users count
      const { count: totalCount, error: totalError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;

      // Rank = users with higher exp + users with same exp but earlier created_at + 1
      const rank = (higherExpCount || 0) + (sameExpEarlierCount || 0) + 1;

      return {
        rank,
        exp: userProfile.exp,
        total: totalCount || 0
      };
    } catch (error) {
      console.error('Error fetching user rank:', error);
      throw error;
    }
  }
};
