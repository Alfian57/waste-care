import { useState, useEffect } from 'react';
import { 
  fetchCampaigns, 
  joinCampaign as joinCampaignService, 
  leaveCampaign as leaveCampaignService,
  generateCampaignFromNearbyReports 
} from '@/lib/campaignService';
import type { Campaign, CampaignFilters } from '@/types/campaign.types';
import { useAuth } from './useAuth';

export function useCampaigns(filters?: CampaignFilters) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCampaignsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dari Supabase
      const data = await fetchCampaigns(user?.id);
      
      // Apply filters
      let filtered = data;
      if (filters?.status) {
        filtered = filtered.filter(c => c.status === filters.status);
      }

      setCampaigns(filtered);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
