import { useState, useEffect, useRef } from 'react';
import { 
  fetchCampaigns, 
  joinCampaign as joinCampaignService, 
  leaveCampaign as leaveCampaignService,
  generateCampaignFromNearbyReports 
} from '@/lib/campaignService';
import type { Campaign, CampaignFilters } from '@/types/campaign.types';
import { useAuth } from './useAuth';

// In-memory cache for campaigns
const campaignsCache = new Map<string, { data: Campaign[]; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

export function useCampaigns(filters?: CampaignFilters) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // AbortController untuk cancel request sebelumnya
  const abortControllerRef = useRef<AbortController | null>(null);
  // Track if initial fetch is done
  const hasFetchedRef = useRef(false);

  const fetchCampaignsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cancel request sebelumnya jika ada
      if (abortControllerRef.current) {
        console.log('[CAMPAIGNS] Aborting previous request');
        abortControllerRef.current.abort();
      }

      // Buat AbortController baru
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Check cache first
      const cacheKey = `campaigns_${user?.id || 'guest'}_${filters?.status || 'all'}`;
      const cached = campaignsCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('[CAMPAIGNS] Using cached data');
        setCampaigns(cached.data);
        setLoading(false);
        abortControllerRef.current = null;
        return;
      }

      console.log('[CAMPAIGNS] Fetching from API...');
      // Fetch dari Supabase
      const data = await fetchCampaigns(user?.id);
      
      // Cek apakah request sudah di-cancel
      if (controller.signal.aborted) {
        console.log('[CAMPAIGNS] Request was aborted after fetch');
        setLoading(false);
        return;
      }
      
      console.log('[CAMPAIGNS] Got data:', data.length, 'campaigns');
      
      // Apply filters
      let filtered = data;
      if (filters?.status) {
        filtered = filtered.filter(c => c.status === filters.status);
      }

      // Cache the result
      campaignsCache.set(cacheKey, { data: filtered, timestamp: Date.now() });

      setCampaigns(filtered);
      setLoading(false);
      abortControllerRef.current = null;
      console.log('[CAMPAIGNS] Fetch complete');
    } catch (err) {
      // Jangan set error jika request di-cancel
      if (abortControllerRef.current?.signal.aborted) {
        console.log('[CAMPAIGNS] Error handling skipped (aborted)');
        setLoading(false); // IMPORTANT: Set loading false even on abort
        return;
      }
      
      console.error('[CAMPAIGNS] Error fetching campaigns:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('[CAMPAIGNS] useEffect triggered, hasFetched:', hasFetchedRef.current);
    
    fetchCampaignsData();
    
    // Cleanup: cancel request on unmount
    return () => {
      console.log('[CAMPAIGNS] Cleanup - aborting request');
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      // Reset loading state on unmount/cleanup
      setLoading(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run on mount

  const generateCampaign = async (latitude: number, longitude: number, radiusKm: number) => {
    try {
      setLoading(true);
      setError(null);

      const campaign = await generateCampaignFromNearbyReports({
        latitude,
        longitude,
        radiusKm,
      });

      if (campaign) {
        setCampaigns(prev => [campaign, ...prev]);
        return campaign;
      } else {
        setError('Tidak ada laporan sampah di area ini');
        return null;
      }
    } catch (err) {
      console.error('Error generating campaign:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate campaign');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const joinCampaign = async (campaignId: string) => {
    if (!user) {
      setError('Anda harus login terlebih dahulu');
      return;
    }

    try {
      await joinCampaignService(parseInt(campaignId), user.id);
      
      // Update local state
      setCampaigns(prev =>
        prev.map(c =>
          c.id === campaignId
            ? { 
                ...c, 
                participants: Math.min(c.participants + 1, c.maxParticipants),
                isJoined: true 
              }
            : c
        )
      );
      
      // Invalidate cache after join
      campaignsCache.clear();
    } catch (err) {
      console.error('Error joining campaign:', err);
      setError(err instanceof Error ? err.message : 'Gagal bergabung dengan campaign');
      throw err;
    }
  };

  const leaveCampaign = async (campaignId: string) => {
    if (!user) {
      setError('Anda harus login terlebih dahulu');
      return;
    }

    try {
      await leaveCampaignService(parseInt(campaignId), user.id);
      
      // Update local state
      setCampaigns(prev =>
        prev.map(c =>
          c.id === campaignId
            ? { 
                ...c, 
                participants: Math.max(c.participants - 1, 0),
                isJoined: false 
              }
            : c
        )
      );
      
      // Invalidate cache after leave
      campaignsCache.clear();
    } catch (err) {
      console.error('Error leaving campaign:', err);
      setError(err instanceof Error ? err.message : 'Gagal keluar dari campaign');
      throw err;
    }
  };

  return {
    campaigns,
    loading,
    error,
    refetch: fetchCampaignsData,
    generateCampaign,
    joinCampaign,
    leaveCampaign,
  };
}

/**
 * Clear campaigns cache (useful for testing or logout)
 */
export function clearCampaignsCache(): void {
  campaignsCache.clear();
}
